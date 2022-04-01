import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class RegisterEmailVerifyDto {
  @IsNotEmpty()
  @Length(6)
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @ApiProperty()
  hash: string;
}
