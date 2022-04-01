import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  firstName: string;

  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @MaxLength(256)
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
