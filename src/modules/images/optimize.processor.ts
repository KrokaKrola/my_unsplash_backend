import { Process, Processor } from '@nestjs/bull';

@Processor('imageOptimizationQueue')
export class ImageOptimizationProcessor {
  @Process('optimize')
  public handleOptimize(job): void {
    console.log(job);
  }
}
