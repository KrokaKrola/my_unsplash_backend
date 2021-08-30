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
  name: 'email-verifications',
})
export class EmailVerificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UsersEntity;
}
