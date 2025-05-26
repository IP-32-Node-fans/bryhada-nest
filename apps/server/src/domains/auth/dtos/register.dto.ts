import { IsBoolean, IsNotEmpty, IsString, IsEmail } from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty({
    description: 'User email',
    example: 'username',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'username1',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: '12390',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Wether user is admin or not',
    example: 'admin',
  })
  @Type(() => Boolean)
  @IsBoolean()
  isAdmin: boolean;
}
