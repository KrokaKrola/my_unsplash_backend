import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { MailStatus } from '../enums/mail-status';

@Entity({
  name: 'mails',
})
export class MailEntity extends BasePrimaryEntity {
  @Column({
    enum: MailStatus,
    type: 'enum',
    default: MailStatus.PENDING,
  })
  status?: MailStatus;

  @Column({
    type: 'json',
    nullable: true,
  })
  info?: string;
}
