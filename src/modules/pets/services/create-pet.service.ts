import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ImagesService } from 'src/modules/images/images.service';
import { PrismaService } from 'src/prisma.service';
import { CreatePetDTO } from '../dtos/createPet.dto';
import { PetDto } from '../dtos/pet.dto';

@Injectable()
export class CreatePetService {
  constructor(
    private imagesService: ImagesService,
    private prismaService: PrismaService,
  ) {}

  async createPet(
    createPetDto: CreatePetDTO,
    image: Express.Multer.File,
    userId: number,
  ): Promise<PetDto> {
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

    if (createPetDto.typeId) {
      const petType = await this.prismaService.petType.findUnique({
        where: { id: createPetDto.typeId },
      });

      if (!petType) {
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

    const { size, dimensions, mimetype, originalName } =
      validateImageResult.imageMeta;

    const imageEntity = await this.imagesService.createImage(
      image,
      size,
      mimetype,
      dimensions,
      originalName,
      'pet-images',
    );

    return this.prismaService.pet.create({
      data: {
        name: createPetDto.name,
        bio: createPetDto.bio,
        petTypeId: createPetDto.typeId ?? null,
        imageId: imageEntity.id,
        userId: userId,
      },
    });
  }
}
