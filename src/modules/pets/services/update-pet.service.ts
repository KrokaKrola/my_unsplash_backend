import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { ImagesService } from 'src/modules/images/images.service';
import { Repository } from 'typeorm';
import { UpdatePetDTO, UpdatePetParamDTO } from '../dtos/updatePet.dto';

@Injectable()
export class UpdatePetService {
  constructor(
    @InjectRepository(PetEntity)
    private petEntityRepository: Repository<PetEntity>,
    @InjectRepository(PetTypeEntity)
    private petTypeEntityRepository: Repository<PetTypeEntity>,
    private imagesService: ImagesService,
  ) {}

  async updateOne(
    paramDto: UpdatePetParamDTO,
    updatePetDto: UpdatePetDTO,
    image: Express.Multer.File,
    userId: number,
  ): Promise<PetEntity> {
    const pet = await this.petEntityRepository.findOne(paramDto.id, {
      relations: ['user', 'petType'],
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet.user.id !== userId) {
      throw new NotFoundException('Pet not found');
    }

    if (updatePetDto.bio) {
      pet.bio = updatePetDto.bio;
    }

    if (updatePetDto.name) {
      pet.name = updatePetDto.name;
    }

    if (updatePetDto.typeId) {
      const petTypeEntity = await this.petTypeEntityRepository.findOne(
        updatePetDto.typeId,
      );

      if (!petTypeEntity) {
        throw new UnprocessableEntityException([
          {
            property: 'typeId',
            constraints: {
              typeId: 'typeId not found in database',
            },
          },
        ]);
      }

      pet.petType = petTypeEntity;
    }

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

      const imageEntity = await this.imagesService.createImage(
        image,
        size,
        mimetype,
        dimensions,
        originalName,
        'pet-images',
      );

      pet.image = imageEntity;
    }

    return await this.petEntityRepository.save(pet);
  }
}
