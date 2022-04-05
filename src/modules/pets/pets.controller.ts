import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserId } from 'src/common/decorators/user.decorator';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';
import { RequestValidationPipe } from 'src/common/pipes/RequestValidationPipe.pipe';
import JwtAuthenticationGuard from '../auth/guards/jwt.guard';
import { CreatePetDTO } from './dtos/createPet.dto';
import { PetDto } from './dtos/pet.dto';
import { CreatePetService } from './services/create-pet.service';
import { PetsService } from './services/pets.service';

@Controller('pets')
export class PetsController {
  constructor(
    private createPetService: CreatePetService,
    private petsService: PetsService,
  ) {}

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

  @Get('/')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  getAll(
    @Query() query: PaginationParamsDto = { limit: 10, page: 1 },
    @UserId() userId: number,
  ): Promise<Pagination<PetDto>> {
    return this.petsService.getAll(query, userId);
  }
}
