import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { PetsController } from './pets.controller';
import { CreatePetService } from './services/create-pet.service';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity, PetTypeEntity]), ImagesModule],
  controllers: [PetsController],
  providers: [CreatePetService],
})
export class PetsModule {}
