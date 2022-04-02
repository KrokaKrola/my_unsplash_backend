import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';

@Entity({
  name: 'pet_types',
})
export class PetTypeEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
  })
  name: string;
}
