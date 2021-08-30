import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { EmailsStatus } from '../enums/email-status.enum';

@Entity({
  name: 'emails',
})
export class EmailsEntity extends BasePrimaryEntity {
  @Column({
    enum: EmailsStatus,
    type: 'enum',
    default: EmailsStatus.PENDING,
    nullable: true,
  })
  status: EmailsStatus;

  @Column({
    type: 'json',
    nullable: true,
  })
  info?: string;
}
