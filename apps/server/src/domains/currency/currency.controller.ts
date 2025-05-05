import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateCurrencyDto } from './dtos/create.dto';
import { SetRateDto } from './dtos/set-rate.dto';
import { UpdateCurrencyDto } from './dtos/update.dto';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getAllExchangeRates() {
    const rates = await this.currencyService.getAllExchangeRates();
    return rates;
  }

  @Get('/rates/:date')
  async getExchangeRates(@Param('date') date: string) {
    const rates = await this.currencyService.getExchangeRatesByDay(date);
    return rates;
  }

  @Get('/rates/:currency_id/:fromDate/:toDate')
  async getHistory(
    @Param('currency_id') currencyId: string,
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    const history = await this.currencyService.getRateHistory(
      Number(currencyId),
      fromDate,
      toDate,
    );
    return history;
  }

  @UseGuards(AdminGuard)
  @Post()
  async createCurrency(@Body() dto: CreateCurrencyDto) {
    const newCurrency = await this.currencyService.createCurrency(dto.name);
    return newCurrency;
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateCurrency(
    @Param('id') id: string,
    @Body() dto: UpdateCurrencyDto,
  ) {
    const updated = await this.currencyService.updateCurrency(
      Number(id),
      dto.name,
    );
    return updated;
  }

  @HttpCode(204)
  @UseGuards(AdminGuard)
  @Delete()
  async deleteCurrency(@Body() { name }: { name: string }) {
    await this.currencyService.remove(name);
  }

  @UseGuards(AdminGuard)
  @Post('/rates')
  async setRate(@Body() dto: SetRateDto) {
    await this.currencyService.setExchangeRate(
      dto.currencyId,
      dto.date,
      dto.rate,
    );
  }
}
