import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BasePrimaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Exclude()
  deletedAt;

  @UpdateDateColumn()
  @Exclude()
  updatedAt;
}
