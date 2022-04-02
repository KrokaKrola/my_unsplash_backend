import { ImageEntity } from 'src/models/image/entities/image.entity';
import { PetTypeEntity } from 'src/models/pet-types/entities/pet-type.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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
    length: 512,
    type: 'varchar',
  })
  bio: string;

  @OneToOne(() => PetTypeEntity)
  @JoinColumn()
  petType: PetTypeEntity;

  @OneToOne(() => ImageEntity)
  @JoinColumn()
  image: ImageEntity;
}
