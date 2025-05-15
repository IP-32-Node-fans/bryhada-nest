import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyHistoryParamsDto {
  @ApiProperty({
    description: 'Currency ID',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  currencyId: number;

  @ApiProperty({
    description: 'Start date in ISO format (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'End date in ISO format (YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @IsNotEmpty()
  @IsDateString()
  toDate: string;
}
