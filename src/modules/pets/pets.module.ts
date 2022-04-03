import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { PetsController } from './pets.controller';
import { CreatePetService } from './services/create-pet.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity, PetTypeEntity])],
  controllers: [PetsController],
  providers: [CreatePetService],
})
export class PetsModule {}
