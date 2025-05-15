import { ApiProperty } from '@nestjs/swagger';

export class SetRateDto {
  @ApiProperty()
  currencyId: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  rate: number;
}
