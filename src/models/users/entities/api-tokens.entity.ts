import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({
  name: 'api-tokens',
})
export class ApiTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UsersEntity;
}
