import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../models/users/entities/users.entity';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, ApiTokenEntity])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
