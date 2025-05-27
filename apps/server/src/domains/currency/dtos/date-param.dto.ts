import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateParamDto {
  @ApiProperty({
    description: 'Date in ISO format (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
