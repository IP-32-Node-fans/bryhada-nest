import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator'

export class UpdateCurrencyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
