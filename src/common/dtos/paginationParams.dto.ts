import { IsOptional } from 'class-validator';
import { IsPositiveInteger } from '../decorators/is-positive-integer.decorator';

export class PaginationParamsDto {
  @IsOptional()
  @IsPositiveInteger({
    min: 1,
  })
  page: number;

  @IsOptional()
  @IsPositiveInteger({
    min: 1,
    max: 100,
  })
  limit: number;
}
