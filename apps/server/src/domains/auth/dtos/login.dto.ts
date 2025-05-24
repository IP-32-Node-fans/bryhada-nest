import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'username',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '12390',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
