import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { ImagesService } from './images.service';
import { ImageOptimizationProcessor } from './optimize.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'imageOptimizationQueue',
    }),
    TypeOrmModule.forFeature([ImageEntity]),
  ],
  providers: [ImagesService, ImageOptimizationProcessor],
  exports: [ImagesService],
})
export class ImagesModule {}
