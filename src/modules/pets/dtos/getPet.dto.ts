import { IsPositiveInteger } from 'src/common/decorators/is-positive-integer.decorator';

export class GetPetDto {
  @IsPositiveInteger({
    min: 1,
  })
  id: number;
}
