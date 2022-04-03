import { Injectable } from '@nestjs/common';
import imageSize from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

@Injectable()
export class ImagesService {
  getImageSize(image: Express.Multer.File): number {
    return image.size;
  }

  getImageFileType(image: Express.Multer.File): string {
    return image.mimetype;
  }

  getImageOriginalName(image: Express.Multer.File): string {
    return image.originalname;
  }

  getImageDimensions(
    image: Express.Multer.File,
  ): Promise<ISizeCalculationResult> {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      imageSize(image.buffer, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  }

  validateImageMaxSize(size: number, maxSize: number) {
    return size < maxSize;
  }

  validateMinimumDimensions(
    minimumDimensions: { width: number; height: number },
    dimensions: ISizeCalculationResult,
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
          size: image.size,
          mimetype: image.mimetype,
          dimensions: imageDimensions,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}
