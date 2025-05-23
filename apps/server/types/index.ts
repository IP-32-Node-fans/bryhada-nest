import { ApiProperty, PickType } from '@nestjs/swagger';

export class TCurrency {
  @ApiProperty({ example: 1, description: 'Currency ID' })
  id: number;

  @ApiProperty({ example: 'USD', description: 'Currency name' })
  name: string;
}

export class TExchangeRate {
  @ApiProperty({ example: 1, description: 'Exchange rate record ID' })
  id: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Date of the exchange rate (ISO format)',
  })
  date: string;

  @ApiProperty({
    example: 52.14,
    description: 'Exchange rate value for this date',
  })
  rate: number;
}

export class TCurrencyWithRates extends PickType(TCurrency, [
  'id',
  'name',
] as const) {
  @ApiProperty({
    type: [TExchangeRate],
    description: 'List of historical exchange rates for this currency',
  })
  exchangeRates: TExchangeRate[];
}

export class TUser {
  @ApiProperty({ example: 52, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: 'РоманУходько',
    description: 'Unique nickname for the user',
  })
  nickname: string;

  @ApiProperty({
    example: 'hashedPassword123',
    description: 'User password (usually hashed)',
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    example: 'admin',
    enum: ['user', 'admin'],
    description: 'Role of the user',
  })
  role: 'user' | 'admin';
}
