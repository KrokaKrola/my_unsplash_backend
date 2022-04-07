import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
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
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import JwtAuthenticationGuard from '../auth/guards/jwt.guard';
import { CreatePetDTO } from './dtos/createPet.dto';
import { DeletePetDto } from './dtos/deletePet.dto';
import { GetPetDto } from './dtos/getPet.dto';
import { PetDto } from './dtos/pet.dto';
import { UpdatePetDTO, UpdatePetParamDTO } from './dtos/updatePet.dto';
import { CreatePetService } from './services/create-pet.service';
import { PetsService } from './services/pets.service';
import { UpdatePetService } from './services/update-pet.service';

@Controller('pets')
export class PetsController {
  constructor(
    private createPetService: CreatePetService,
    private petsService: PetsService,
    private updatePetService: UpdatePetService,
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

  // @Get('/')
  // @UsePipes(RequestValidationPipe)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(JwtAuthenticationGuard)
  // getAll(
  //   @Query() query: PaginationParamsDto = { limit: 10, page: 1 },
  //   @UserId() userId: number,
  // ): Promise<Pagination<PetDto>> {
  //   return this.petsService.getAll(query, userId);
  // }

  @Get('/:id')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  getOne(
    @Param() getPetDto: GetPetDto,
    @UserId() userId: number,
  ): Promise<PetDto> {
    return this.petsService.getOne(getPetDto, userId);
  }

  @Delete('/:id')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(204)
  deleteOne(@Param() deletePetDto: DeletePetDto, @UserId() userId: number) {
    return this.petsService.deleteOne(deletePetDto, userId);
  }

  @Patch('/:id')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateOne(
    @Param() updatePetParamDto: UpdatePetParamDTO,
    @Body() updatePetDto: UpdatePetDTO,
    @UploadedFile() image: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return this.updatePetService.updateOne(
      updatePetParamDto,
      updatePetDto,
      image,
      userId,
    );
  }
}
