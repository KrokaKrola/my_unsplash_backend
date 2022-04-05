import { IsPositiveInteger } from 'src/common/decorators/is-positive-integer.decorator';

export class DeletePetDto {
  @IsPositiveInteger({
    min: 1,
  })
  id: number;
}
