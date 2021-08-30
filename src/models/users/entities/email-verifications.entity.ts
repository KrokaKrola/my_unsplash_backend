import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { EmailsEntity } from '../../emails/entities/emails.entity';

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

  @OneToOne(() => EmailsEntity)
  @JoinColumn()
  email: EmailsEntity;
}
