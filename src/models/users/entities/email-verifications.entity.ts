import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MailEntity } from '../../emails/entities/mail.entity';

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

  @Column({
    type: 'varchar',
    length: 6,
  })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => MailEntity)
  @JoinColumn()
  mail: MailEntity;
}
