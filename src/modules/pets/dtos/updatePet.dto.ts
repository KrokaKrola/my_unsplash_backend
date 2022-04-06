import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { IsPositiveInteger } from 'src/common/decorators/is-positive-integer.decorator';

export class UpdatePetDTO {
  @IsOptional()
  @MinLength(2)
  @MaxLength(128)
  name: string;

  @MaxLength(500)
  @IsOptional()
  bio: string;

  @IsOptional()
  typeId: number;
}

export class UpdatePetParamDTO {
  @IsPositiveInteger({
    min: 1,
  })
  id: number;
}
