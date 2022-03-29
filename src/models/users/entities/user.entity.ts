import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

@Entity({
  name: 'users',
})
export class UserEntity extends BasePrimaryEntity {
  constructor(partial: Partial<UserEntity>) {
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
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
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
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  async verifyRefreshToken(refreshToken: string) {
    return await argon2.verify(this.currentHashedRefreshToken, refreshToken);
  }

  async verifyPassword(password: string) {
    return await argon2.verify(this.password, password);
  }
}
