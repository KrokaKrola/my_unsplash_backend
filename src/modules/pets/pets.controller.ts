import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestValidationPipe } from 'src/common/pipes/RequestValidationPipe.pipe';
import { CreatePetDTO } from './dtos/createPet.dto';
import { CreatePetService } from './services/create-pet.service';

@Controller('pets')
export class PetsController {
  constructor(private createPetService: CreatePetService) {}

  @Post('/')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  createPet(
    @Body() createPetDto: CreatePetDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.createPetService.createPet(createPetDto, image);
  }
}
