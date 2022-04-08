import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { CreatePetService } from './services/create-pet.service';
import { ImagesModule } from '../images/images.module';
import { PetsService } from './services/pets.service';
import { UpdatePetService } from './services/update-pet.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginateService } from '../paginate/paginate.service';

@Module({
  imports: [ImagesModule],
  controllers: [PetsController],
  providers: [
    CreatePetService,
    PetsService,
    UpdatePetService,
    PrismaService,
    PaginateService,
  ],
})
export class PetsModule {}
