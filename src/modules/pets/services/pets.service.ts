import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DeletePetDto } from '../dtos/deletePet.dto';
import { GetPetDto } from '../dtos/getPet.dto';
import { PetDto } from '../dtos/pet.dto';

@Injectable()
export class PetsService {
  constructor(private prismaService: PrismaService) {}

  // async getAll(
  //   query: PaginationParamsDto,
  //   userId: number,
  // ): Promise<Pagination<PetDto>> {
  //   const queryBuilder = this.petEntityRepository
  //     .createQueryBuilder('pet')
  //     .leftJoinAndSelect('pet.user', 'user')
  //     .leftJoinAndSelect('pet.petType', 'petType')
  //     .leftJoinAndSelect('pet.image', 'image')
  //     .where('pet.user.id = :id', { id: userId });

  //   return paginate<PetEntity>(queryBuilder, { ...query, route: '/pets/' });
  // }

  async getOne(getPetDto: GetPetDto, userId: number): Promise<PetDto> {
    const pet = await this.prismaService.pet.findUnique({
      where: { id: getPetDto.id },
      include: {
        user: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet?.user?.id !== userId) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async deleteOne(deletePetDto: DeletePetDto, userId: number) {
    const pet = await this.getOne(deletePetDto, userId);

    await this.prismaService.pet.delete({
      where: { id: pet.id },
    });
  }
}
