import { Exclude } from 'class-transformer';
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
  @Exclude()
  originalName: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  @Exclude()
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
  @Exclude()
  imageType: ImageType;

  @Column({
    type: 'varchar',
  })
  originalDimensions: string;

  @Column({
    type: 'int',
  })
  @Exclude()
  imageSize: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  @Exclude()
  imageOptimizationLog: string;
}
