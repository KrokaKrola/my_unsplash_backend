import { CategoryEntity } from 'src/models/categories/entities/category.entity';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';

@Entity({
  name: 'posts',
})
export class PostEntity extends BasePrimaryEntity {
  @Column({
    type: 'int',
    default: 0,
  })
  viewsCount: number;

  @Column({
    type: 'int',
    default: 0,
  })
  likesCount: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => CategoryEntity)
  @JoinColumn()
  category: CategoryEntity;

  @OneToOne(() => ImageEntity)
  @JoinColumn()
  image: ImageEntity;

  @OneToOne(() => PetEntity)
  @JoinColumn()
  pet: PetEntity;
}
