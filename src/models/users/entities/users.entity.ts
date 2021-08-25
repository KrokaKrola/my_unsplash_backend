import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';

@Entity({
  name: 'users',
})
export class UsersEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;
}
