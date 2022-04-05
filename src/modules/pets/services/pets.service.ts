import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { Repository } from 'typeorm';
import { DeletePetDto } from '../dtos/deletePet.dto';
import { GetPetDto } from '../dtos/getPet.dto';
import { PetDto } from '../dtos/pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(PetEntity)
    private petEntityRepository: Repository<PetEntity>,
  ) {}

  async getAll(
    query: PaginationParamsDto,
    userId: number,
  ): Promise<Pagination<PetDto>> {
    const queryBuilder = this.petEntityRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('pet.petType', 'petType')
      .leftJoinAndSelect('pet.image', 'image')
      .where('pet.user.id = :id', { id: userId });

    return paginate<PetEntity>(queryBuilder, { ...query, route: '/pets/' });
  }

  async getOne(getPetDto: GetPetDto, userId: number): Promise<PetDto> {
    const pet = await this.petEntityRepository.findOne(getPetDto.id, {
      relations: ['user', 'petType', 'image'],
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
    const pet = await this.petEntityRepository.findOne(deletePetDto.id, {
      relations: ['user'],
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet?.user?.id !== userId) {
      throw new NotFoundException('Pet not found');
    }

    await this.petEntityRepository.softDelete(deletePetDto.id);
  }
}
