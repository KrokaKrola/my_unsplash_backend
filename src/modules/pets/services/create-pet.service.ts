import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { ImagesService } from 'src/modules/images/images.service';
import { Repository } from 'typeorm';
import { CreatePetDTO } from '../dtos/createPet.dto';
import { PetDto } from '../dtos/pet.dto';

@Injectable()
export class CreatePetService {
  constructor(
    @InjectRepository(PetEntity)
    private petEntityRepository: Repository<PetEntity>,
    @InjectRepository(PetTypeEntity)
    private petTypeEntityRepository: Repository<PetTypeEntity>,
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    private imagesService: ImagesService,
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

    const pet = new PetEntity();
    pet.bio = createPetDto.bio;
    pet.name = createPetDto.name;

    if (createPetDto.typeId) {
      const petType = await this.petTypeEntityRepository.findOne(
        createPetDto.typeId,
      );

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

      pet.petType = petType;
    } else {
      pet.petType = null;
    }

    const user = await this.userEntityRepository.findOne(userId);

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
    pet.user = user;

    return await this.petEntityRepository.save(pet);
  }

  async getAll() {}
}
