import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: false,
  })
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(256)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
