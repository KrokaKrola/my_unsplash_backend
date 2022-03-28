import { IsNotEmpty, Length } from 'class-validator';

export class RegisterEmailVerifyDto {
  @IsNotEmpty()
  @Length(6)
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  hash: string;
}
