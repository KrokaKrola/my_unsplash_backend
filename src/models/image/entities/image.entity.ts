import { Column, Entity } from 'typeorm';
import { BasePrimaryEntity } from '../../../common/entities/BasePrimaryEntity';
import { ImageStatus } from '../enums/image-status.enum';
import { ImageType } from '../enums/image-type.enum';

@Entity({
  name: 'images',
})
export class ImageEntity extends BasePrimaryEntity {
  @Column({
    type: 'varchar',
  })
  hash: string;

  @Column({
    type: 'varchar',
  })
  originalName: string;

  @Column({
    type: 'json',
  })
  cropSizes: string;

  @Column({
    type: 'enum',
    enum: ImageStatus,
    default: ImageStatus.PROCESSING,
  })
  imageStatus: ImageStatus;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  imageType: ImageType;

  @Column({
    type: 'varchar',
  })
  originalSizes: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  imageOptimizationLog: string;
}
