import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import imageSize from 'image-size';
import { ISize } from 'image-size/dist/types/interface';
import { generateToken } from 'src/common/utils/generateToken';
import { ImageType } from 'src/common/enums/image/enums/image-type.enum';
import * as sharp from 'sharp';
import { createDirectory, PROJECT_DIR } from 'src/common/utils/file-system';
import { ImageStatus } from 'src/common/enums/image-status.enum';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectQueue('imageOptimizationQueue')
    private readonly imageOptimizationQueue: Queue,
    private prismaService: PrismaService,
  ) {}

  private getImageDimensions(image: Express.Multer.File): Promise<ISize> {
    return new Promise((resolve, reject) => {
      try {
        const result = imageSize(image.buffer);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  private validateImageMaxSize(size: number, maxSize: number) {
    return size < maxSize;
  }

  private validateMinimumDimensions(
    minimumDimensions: { width: number; height: number },
    dimensions: ISize,
  ) {
    if (dimensions.height < minimumDimensions.height) {
      return false;
    }

    if (dimensions.width < minimumDimensions.width) {
      return false;
    }

    return true;
  }

  private validateMimetype(mimetype: string, supportedMimetypes: string[]) {
    return supportedMimetypes.includes(mimetype);
  }

  public async validateImage(
    image: Express.Multer.File,
    maxSize: number,
    minimumDimensions: { width: number; height: number },
    supportedMimetypes: string[],
  ) {
    try {
      const errors = {};

      const sizeValidationResult = this.validateImageMaxSize(
        image.size,
        maxSize,
      );

      if (!sizeValidationResult) {
        errors['maxSize'] = 'Image size is more than acceptable';
      }

      const supportedMimetypesValidationResult = this.validateMimetype(
        image.mimetype,
        supportedMimetypes,
      );

      if (!supportedMimetypesValidationResult) {
        errors['mimeType'] = 'Image mimetype is not valid';
      }

      const imageDimensions = await this.getImageDimensions(image);

      const minimumDimensionsValidationResult = this.validateMinimumDimensions(
        minimumDimensions,
        imageDimensions,
      );

      if (!minimumDimensionsValidationResult) {
        errors['dimensions'] = 'Image sizes is not valid';
      }

      if (Object.keys(errors).length > 0) {
        return {
          isValid: false,
          errors,
          imageMeta: {
            size: image.size,
            mimetype: image.mimetype,
            dimensions: imageDimensions,
          },
        };
      }

      return {
        isValid: true,
        errors: {},
        imageMeta: {
          originalName: image.originalname,
          size: image.size,
          mimetype: image.mimetype,
          dimensions: imageDimensions,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  private parseImageType(mimeType: string) {
    if (mimeType === 'image/jpeg') {
      return ImageType.JPEG;
    }

    if (mimeType === 'image/jpg') {
      return ImageType.JPEG;
    }

    if (mimeType === 'image/png') {
      return ImageType.PNG;
    }
  }

  public async createImage(
    imageFile: Express.Multer.File,
    size: number,
    mimetype: string,
    dimensions: { width: number; height: number },
    originalName: string,
    type: string,
  ) {
    const imageHash = await generateToken({ byteLength: 32 });
    const imageEntity = await this.prismaService.image.create({
      data: {
        hash: imageHash,
        imageSize: size,
        originalDimensions: JSON.stringify(dimensions),
        originalName,
        imageType: this.parseImageType(mimetype),
      },
    });
    await createDirectory(`${PROJECT_DIR}/public/images/${type}/${imageHash}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await sharp(imageFile.buffer)
      .toFormat('jpeg')
      .toFile(
        `${PROJECT_DIR}/public/images/${type}/${imageHash}/original.jpeg`,
      );

    await this.imageOptimizationQueue.add('optimize', {
      id: imageEntity.id,
      type,
    });

    return imageEntity;
  }

  public async optimizeImage(id: number, type: string) {
    const image = await this.prismaService.image.findUnique({
      where: { id },
    });
    if (image) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const result = await sharp(
          `${process.cwd()}/public/images/${type}/${image.hash}/original.jpeg`,
        )
          .jpeg({
            quality: 80,
          })
          .toFile(
            `${process.cwd()}/public/images/${type}/${
              image.hash
            }/optimized.jpeg`,
          );
        await this.prismaService.image.update({
          where: { id },
          data: {
            imageStatus: ImageStatus.OPTIMIZED,
            imageOptimizationLog: JSON.stringify(result),
          },
        });
      } catch (error) {
        this.logger.error(error);
        await this.prismaService.image.update({
          where: { id },
          data: {
            imageStatus: ImageStatus.ERROR,
            imageOptimizationLog: JSON.stringify(error),
          },
        });
      }
    } else {
      this.logger.error(`Image with id ${id} not found in database`);
    }
  }
}
