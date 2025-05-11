import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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
import { Rate, TCurrency } from '../../../types';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exchange rates' })
  @ApiResponse({
    status: 200,
    description: 'List of all currencies and their rates',
    type: [TCurrency],
  })
  async getAllExchangeRates(): Promise<TCurrency[]> {
    return this.currencyService.getAllExchangeRates();
  }

  @Get('/rates/:date')
  @ApiOperation({ summary: 'Get exchange rates by date' })
  @ApiResponse({
    status: 200,
    description: 'Rates for the specified date',
    type: [Rate],
  })
  async getExchangeRates(@Param() dto: DateParamDto): Promise<Rate[]> {
    return this.currencyService.getExchangeRatesByDay(dto.date);
  }

  @Get('/rates/:currencyId/:fromDate/:toDate')
  @ApiOperation({ summary: 'Get currency rate history' })
  @ApiResponse({
    status: 200,
    description: 'Rate history for currency',
    type: [Rate],
  })
  async getHistory(@Param() dto: CurrencyHistoryParamsDto): Promise<Rate[]> {
    return this.currencyService.getRateHistory(
      dto.currencyId,
      dto.fromDate,
      dto.toDate,
    );
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiResponse({
    status: 201,
    description: 'Currency created successfully',
    type: TCurrency,
  })
  async createCurrency(@Body() dto: CreateCurrencyDto): Promise<TCurrency> {
    return this.currencyService.createCurrency(dto.name);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Update a currency' })
  @ApiResponse({
    status: 200,
    description: 'Currency updated successfully',
    type: TCurrency,
  })
  async updateCurrency(
    @Param() idDto: CurrencyIdParamDto,
    @Body() dto: UpdateCurrencyDto,
  ): Promise<TCurrency> {
    return this.currencyService.updateCurrency(idDto.id, dto.name);
  }

  @HttpCode(204)
  @UseGuards(AdminGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete a currency by name' })
  @ApiResponse({ status: 204, description: 'Currency deleted successfully' })
  async deleteCurrency(@Body() { name }: { name: string }): Promise<void> {
    await this.currencyService.remove(name);
  }

  @UseGuards(AdminGuard)
  @Post('/rates')
  @ApiOperation({ summary: 'Set exchange rate for a currency' })
  @ApiResponse({ status: 201, description: 'Rate set successfully' })
  async setRate(@Body() dto: SetRateDto): Promise<void> {
    await this.currencyService.setExchangeRate(
      dto.currencyId,
      dto.date,
      dto.rate,
    );
  }
}
