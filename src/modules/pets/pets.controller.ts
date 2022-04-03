import { Body, Controller, Post } from '@nestjs/common';
import { CreatePetDTO } from './dtos/createPet.dto';
import { CreatePetService } from './services/create-pet.service';

@Controller('pets')
export class PetsController {
  constructor(private createPetService: CreatePetService) {}

  @Post('/')
  createPet(@Body() body: CreatePetDTO) {
    return this.createPetService.createPet(body);
  }
}
