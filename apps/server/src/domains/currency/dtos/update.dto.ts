import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrencyDto {
  @ApiProperty()
  name: string;
}
