import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  @IsString()
  firstName: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(256)
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(60)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}
