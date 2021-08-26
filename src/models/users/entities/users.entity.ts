import { BeforeInsert, Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { hash } from 'bcrypt';

@Entity({
  name: 'users',
})
export class UsersEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  lastName?: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 5);
  }
}
