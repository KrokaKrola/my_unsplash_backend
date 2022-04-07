import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from './images.service';
import { ImageOptimizationProcessor } from './optimize.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'imageOptimizationQueue',
    }),
  ],
  providers: [ImagesService, ImageOptimizationProcessor, PrismaService],
  exports: [ImagesService],
})
export class ImagesModule {}
