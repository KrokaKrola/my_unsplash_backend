import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { Repository } from 'typeorm';
import { CreatePetDTO } from '../dtos/createPet.dto';

@Injectable()
export class CreatePetService {
  constructor(
    @InjectRepository(PetEntity)
    private petEntityRepository: Repository<PetEntity>,
    @InjectRepository(PetTypeEntity)
    private petTypeEntityRepository: Repository<PetTypeEntity>,
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
  ) {}

  async createPet(
    createPetDto: CreatePetDTO,
    image: Express.Multer.File,
  ): Promise<PetEntity> {
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
    }

    return this.petEntityRepository.save(pet);
  }
}
