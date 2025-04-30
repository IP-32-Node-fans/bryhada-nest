import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Response } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateCurrencyDto } from './dtos/create.dto';
import { SetRateDto } from './dtos/set-rate.dto';
import { UpdateCurrencyDto } from './dtos/update.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getAllExchangeRates(@Res() res: Response) {
    try {
      const rates = await this.currencyService.getAllExchangeRates();
      res.status(200).json(rates);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      res.status(500).send(errorMessage);
    }
  }

  @Get('/rates/:date')
  async getExchangeRates(@Param('date') date: string, @Res() res: Response) {
    try {
      const rates = await this.currencyService.getExchangeRates(date);
      res.status(200).json(rates);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).send(errorMessage);
    }
  }

  @Get('/rates/:currency/:fromDate/:toDate')
  async getHistory(
    @Param('currency') currency: string,
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
    @Res() res: Response,
  ) {
    try {
      const history = await this.currencyService.getExchangeRateHistory(
        currency,
        fromDate,
        toDate,
      );
      res.status(200).json(history);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).send(errorMessage);
    }
  }

  @UseGuards(AdminGuard)
  @Post()
  async createCurrency(@Body() dto: CreateCurrencyDto, @Res() res: Response) {
    try {
      const newCurrency = await this.currencyService.createCurrency(dto.name);
      res.status(201).json(newCurrency);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(400).send(errorMessage);
    }
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateCurrency(
    @Param('id') id: string,
    @Body() dto: UpdateCurrencyDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.currencyService.updateCurrency(
        Number(id),
        dto.name,
      );
      res.json(updated);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(400).send(errorMessage);
    }
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteCurrency(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.currencyService.deleteCurrency(Number(id));
      res.status(204).send();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(400).send(errorMessage);
    }
  }

  @UseGuards(AdminGuard)
  @Post('/rate')
  async setRate(@Body() dto: SetRateDto, @Res() res: Response) {
    try {
      await this.currencyService.setExchangeRate(
        dto.currency,
        dto.date,
        dto.rate,
      );
      res.status(201).send('Exchange rate set successfully');
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(400).send(errorMessage);
    }
  }
}
