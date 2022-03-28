import { BeforeInsert, Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

@Entity({
  name: 'registration-candidate',
})
export class RegistrationCandidateEntity extends BasePrimaryEntity {
  constructor(partial: Partial<RegistrationCandidateEntity>) {
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
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
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
    type: 'varchar',
  })
  hash: string;

  @BeforeInsert()
  private async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async verifyPassword(password: string) {
    return await argon2.verify(this.password, password);
  }
}
