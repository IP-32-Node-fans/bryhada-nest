import { ApiProperty } from '@nestjs/swagger';

export class SetRateDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  rate: number;
}
