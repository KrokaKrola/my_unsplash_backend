import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async createPet(body: CreatePetDTO): Promise<PetEntity> {
    const pet = new PetEntity();
    pet.bio = body.bio;
    pet.name = body.name;

    if (body.typeId) {
      const petType = this.petTypeEntityRepository.findOne(body.typeId);

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

    return this.petEntityRepository.save(pet);
  }
}
