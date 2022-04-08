import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';
import { PaginateService } from 'src/modules/paginate/paginate.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { DeletePetDto } from '../dtos/deletePet.dto';
import { GetPetDto } from '../dtos/getPet.dto';
import { PetDto } from '../dtos/pet.dto';

@Injectable()
export class PetsService {
  constructor(
    private prismaService: PrismaService,
    private paginateService: PaginateService,
  ) {}

  async getAll(query: PaginationParamsDto, userId: number) {
    const findManyParams = this.paginateService.generateFindManyParams(query);
    const pets = await this.prismaService.pet.findMany({
      where: {
        userId,
      },
      select: {
        bio: true,
        id: true,
        image: {
          select: {
            hash: true,
            imageStatus: true,
            originalDimensions: true,
          },
        },
        petType: true,
      },
      take: findManyParams.take,
      skip: findManyParams.skip,
    });
    const totalPets = await this.prismaService.pet.count();

    return this.paginateService.process(pets, query, totalPets);
  }

  async getOne(getPetDto: GetPetDto, userId: number): Promise<PetDto> {
    const pet = await this.prismaService.pet.findUnique({
      where: { id: +getPetDto.id },
      select: {
        bio: true,
        id: true,
        image: {
          select: {
            hash: true,
            imageStatus: true,
            originalDimensions: true,
          },
        },
        petType: true,
        userId: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet.userId !== userId) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async deleteOne(deletePetDto: DeletePetDto, userId: number) {
    const pet = await this.getOne(deletePetDto, userId);

    await this.prismaService.pet.delete({
      where: { id: +pet.id },
    });
  }
}
