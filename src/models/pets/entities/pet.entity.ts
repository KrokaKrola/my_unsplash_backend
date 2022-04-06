import { ImageEntity } from 'src/models/image/entities/image.entity';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';

@Entity({
  name: 'pets',
})
export class PetEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
    length: 128,
  })
  name: string;

  @Column({
    length: 500,
    type: 'varchar',
    nullable: true,
  })
  bio: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => PetTypeEntity, { nullable: true })
  @JoinColumn()
  petType: PetTypeEntity;

  @OneToOne(() => ImageEntity)
  @JoinColumn()
  image: ImageEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;
}
