import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Image, PetType } from '@prisma/client';
import { ImagesService } from 'src/modules/images/images.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdatePetDTO, UpdatePetParamDTO } from '../dtos/updatePet.dto';

@Injectable()
export class UpdatePetService {
  constructor(
    private imagesService: ImagesService,
    private prismaService: PrismaService,
  ) {}

  async updateOne(
    paramDto: UpdatePetParamDTO,
    updatePetDto: UpdatePetDTO,
    image: Express.Multer.File,
    userId: number,
  ) {
    const pet = await this.prismaService.pet.findUnique({
      where: { id: paramDto.id },
      include: {
        user: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet.user.id !== userId) {
      throw new NotFoundException('Pet not found');
    }

    let newPetType: PetType;

    if (updatePetDto.typeId) {
      newPetType = await this.prismaService.petType.findUnique({
        where: { id: updatePetDto.typeId },
      });

      if (!newPetType) {
        throw new UnprocessableEntityException([
          {
            property: 'typeId',
            constraints: {
              typeId: 'typeId not found in database',
            },
          },
        ]);
      }
    }

    let newImage: Image;

    if (image) {
      const validateImageResult = await this.imagesService.validateImage(
        image,
        5_000_000,
        { width: 500, height: 500 },
        ['image/jpg', 'image/png', 'image/jpeg'],
      );

      if (!validateImageResult.isValid) {
        throw new UnprocessableEntityException([
          {
            property: 'image',
            constraints: validateImageResult.errors,
          },
        ]);
      }

      const { size, dimensions, mimetype, originalName } =
        validateImageResult.imageMeta;

      newImage = await this.imagesService.createImage(
        image,
        size,
        mimetype,
        dimensions,
        originalName,
        'pet-images',
      );
    }

    return this.prismaService.pet.update({
      where: {
        id: paramDto.id,
      },
      data: {
        bio: updatePetDto.bio ?? pet.bio,
        name: updatePetDto.name ?? pet.name,
        petTypeId: newPetType ? newPetType.id : pet.petTypeId,
        imageId: newImage ? newImage.id : pet.imageId,
      },
    });
  }
}
