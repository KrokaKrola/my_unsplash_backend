import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePetDTO {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  name: string;

  @MaxLength(500)
  bio: string;

  @IsNumber()
  @IsInt()
  typeId: number;
}
