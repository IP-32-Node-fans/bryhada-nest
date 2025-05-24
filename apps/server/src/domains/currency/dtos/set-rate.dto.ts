import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SetRateDto {
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

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Currency rate',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  rate: number;
}
