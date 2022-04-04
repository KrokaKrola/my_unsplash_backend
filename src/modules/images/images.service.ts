import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import imageSize from 'image-size';
import { ISize } from 'image-size/dist/types/interface';
import { generateToken } from 'src/common/utils/generateToken';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { ImageType } from 'src/models/image/enums/image-type.enum';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { createDirectory, PROJECT_DIR } from 'src/common/utils/file-system';
import { ImageStatus } from 'src/models/image/enums/image-status.enum';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
    @InjectQueue('imageOptimizationQueue')
    private readonly imageOptimizationQueue: Queue,
  ) {}

  getImageSize(image: Express.Multer.File): number {
    return image.size;
  }

  getImageFileType(image: Express.Multer.File): string {
    return image.mimetype;
  }

  getImageOriginalName(image: Express.Multer.File): string {
    return image.originalname;
  }

  getImageDimensions(image: Express.Multer.File): Promise<ISize> {
    return new Promise((resolve, reject) => {
      try {
        const result = imageSize(image.buffer);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  validateImageMaxSize(size: number, maxSize: number) {
    return size < maxSize;
  }

  validateMinimumDimensions(
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

  validateMimetype(mimetype: string, supportedMimetypes: string[]) {
    return supportedMimetypes.includes(mimetype);
  }

  async validateImage(
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
          originalName: this.getImageOriginalName(image),
          size: image.size,
          mimetype: image.mimetype,
          dimensions: imageDimensions,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  parseImageType(mimeType: string) {
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

  async createImage(
    imageFile: Express.Multer.File,
    size: number,
    mimetype: string,
    dimensions: { width: number; height: number },
    originalName: string,
    type: string,
  ) {
    const image = new ImageEntity();
    image.hash = await generateToken({ byteLength: 32 });
    image.imageSize = size;
    image.originalDimensions = JSON.stringify(dimensions);
    image.originalName = originalName;
    image.imageType = this.parseImageType(mimetype);

    const imageEntity = await this.imageEntityRepository.save(image);

    await createDirectory(`${PROJECT_DIR}/public/images/${type}/${image.hash}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await sharp(imageFile.buffer)
      .toFormat('jpeg')
      .toFile(
        `${PROJECT_DIR}/public/images/${type}/${image.hash}/original.jpeg`,
      );

    await this.imageOptimizationQueue.add('optimize', {
      id: imageEntity.id,
      type,
    });

    return imageEntity;
  }

  async optimizeImage(id: number, type: string) {
    const image = await this.imageEntityRepository.findOne(id);
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
        image.imageStatus = ImageStatus.OPTIMIZED;
        image.imageOptimizationLog = JSON.stringify(result);
        await this.imageEntityRepository.save(image);
      } catch (error) {
        this.logger.error(error);
        image.imageStatus = ImageStatus.ERROR;
        image.imageOptimizationLog = JSON.stringify(error);
        await this.imageEntityRepository.save(image);
      }
    } else {
      this.logger.error(`Image with id ${id} not found in database`);
    }
  }
}
