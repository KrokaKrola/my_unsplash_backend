import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/common/decorators/user.decorator';
import { RequestValidationPipe } from 'src/common/pipes/RequestValidationPipe.pipe';
import JwtAuthenticationGuard from '../auth/guards/jwt.guard';
import { CreatePetDTO } from './dtos/createPet.dto';
import { CreatePetService } from './services/create-pet.service';

@Controller('pets')
export class PetsController {
  constructor(private createPetService: CreatePetService) {}

  @Post('/')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthenticationGuard)
  createPet(
    @Body() createPetDto: CreatePetDTO,
    @UploadedFile() image: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return this.createPetService.createPet(createPetDto, image, userId);
  }
}
