import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreatePetDTO {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  name: string;

  @MaxLength(500)
  @IsOptional()
  bio: string;

  @IsOptional()
  typeId: number;
}
