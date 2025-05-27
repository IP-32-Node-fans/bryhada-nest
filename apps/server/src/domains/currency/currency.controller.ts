import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateCurrencyDto } from './dtos/create.dto';
import { SetRateDto } from './dtos/set-rate.dto';
import { UpdateCurrencyDto } from './dtos/update.dto';
import { CurrencyService } from './currency.service';
import { DateParamDto } from './dtos/date-param.dto';
import { CurrencyHistoryParamsDto } from './dtos/currency-history-params.dto';
import { CurrencyIdParamDto } from './dtos/currency-id-param.dto';
import { TCurrencyWithRates, TExchangeRate, TCurrency } from 'types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginatedExchangeRatesResponseDto } from './dtos/pagination.dto';
import { GetExchangeRatesQueryDto } from './dtos/get-all-rates.dto';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get exchange rates with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of currencies with their exchange rates',
    type: PaginatedExchangeRatesResponseDto,
  })
  async getAllExchangeRates(
    @Query() query: GetExchangeRatesQueryDto,
  ): Promise<PaginatedExchangeRatesResponseDto> {
    return this.currencyService.getAllExchangeRates(query);
  }

  @UseGuards(AuthGuard)
  @Get('/rates/:date')
  @ApiOperation({ summary: 'Get exchange rates by date' })
  @ApiResponse({
    status: 200,
    description: 'Rates for the specified date',
    type: [TCurrencyWithRates],
  })
  async getExchangeRates(
    @Param() dto: DateParamDto,
  ): Promise<TCurrencyWithRates[]> {
    return this.currencyService.getExchangeRatesByDay(dto.date);
  }

  @UseGuards(AuthGuard)
  @Get('/rates/:currencyId/:fromDate/:toDate')
  @ApiOperation({ summary: 'Get currency rate history' })
  @ApiResponse({
    status: 200,
    description: 'Rate history for currency',
    type: [TExchangeRate],
  })
  async getHistory(
    @Param() dto: CurrencyHistoryParamsDto,
  ): Promise<TExchangeRate[]> {
    return this.currencyService.getRateHistory(
      dto.currencyId,
      dto.fromDate,
      dto.toDate,
    );
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiResponse({
    status: 201,
    description: 'Currency created successfully',
    type: TCurrency,
  })
  @ApiResponse({ status: 404, description: 'Currency already exists' })
  async createCurrency(@Body() dto: CreateCurrencyDto): Promise<TCurrency> {
    return this.currencyService.createCurrency(dto.name);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Update a currency' })
  @ApiResponse({
    status: 200,
    description: 'Currency updated successfully',
    type: TCurrency,
  })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  async updateCurrency(
    @Param() idDto: CurrencyIdParamDto,
    @Body() dto: UpdateCurrencyDto,
  ): Promise<TCurrency> {
    return this.currencyService.updateCurrency(idDto.id, dto.name);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete a currency by name' })
  @ApiResponse({ status: 204, description: 'Currency deleted successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  async deleteCurrency(@Body() { name }: { name: string }): Promise<TCurrency> {
    return this.currencyService.removeCurrency(name);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/rates')
  @ApiOperation({ summary: 'Set exchange rate for a currency' })
  @ApiResponse({ status: 201, description: 'Rate set successfully' })
  async setRate(@Body() dto: SetRateDto): Promise<TExchangeRate> {
    return this.currencyService.setExchangeRate(
      dto.currencyId,
      dto.date,
      dto.rate,
    );
  }
}
