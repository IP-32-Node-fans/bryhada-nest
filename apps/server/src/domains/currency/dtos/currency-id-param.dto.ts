import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyIdParamDto {
  @ApiProperty({
    description: 'Currency ID',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
