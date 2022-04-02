import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';

@Entity({
  name: 'categories',
})
export class CategoryEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
  })
  name: string;
}
