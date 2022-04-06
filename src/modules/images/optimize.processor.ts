import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ImagesService } from './images.service';

@Processor('imageOptimizationQueue')
export class ImageOptimizationProcessor {
  constructor(private imageService: ImagesService) {}

  @Process('optimize')
  public handleOptimize(job: Job<{ id: number; type: string }>): void {
    void this.imageService.optimizeImage(job.data.id, job.data.type);
  }
}
