import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { Repository } from 'typeorm';
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
}
