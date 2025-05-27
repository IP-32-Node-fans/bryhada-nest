import { ApiProperty } from "@nestjs/swagger";
import { TCurrencyWithRates } from "types";


export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 25 })
  totalItems: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class PaginatedExchangeRatesResponseDto {
  @ApiProperty({ type: [TCurrencyWithRates] })
  data: TCurrencyWithRates[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}