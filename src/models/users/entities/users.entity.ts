import { BeforeInsert, Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

@Entity({
  name: 'users',
})
export class UsersEntity extends BasePrimaryEntity {
  constructor(partial: Partial<UsersEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'varchar',
    length: 128,
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
    length: 64,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Exclude()
  emailConfirmed: boolean;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  @Exclude()
  facebookId?: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @BeforeInsert()
  private async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async verifyPassword(password: string) {
    return await argon2.verify(this.password, password);
  }
}
