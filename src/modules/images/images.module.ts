import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { ImagesService } from './images.service';
import { ImageOptimizationProcessor } from './optimize.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    BullModule.registerQueue({
      name: 'imageOptimizationQueue',
    }),
  ],
  providers: [ImagesService, ImageOptimizationProcessor],
  exports: [ImagesService],
})
export class ImagesModule {}
