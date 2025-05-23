import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TCurrencyWithRates, TCurrency } from '../../../types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExchangeRates } from '@prisma/client';

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllExchangeRates(): Promise<TCurrencyWithRates[]> {
    return this.prismaService.currency.findMany({
      include: {
        exchangeRates: true,
      },
    });
  }

  async getRateHistory(
    currencyId: number,
    fromDate: string,
    toDate: string,
  ): Promise<ExchangeRates[]> {
    const currency = await this.prismaService.currency.findUnique({
      where: { id: currencyId },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    const history = await this.prismaService.exchangeRates.findMany({
      where: {
        currencyId: currencyId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (!history.length) {
      throw new NotFoundException('No rate history found');
    }

    return history;
  }

  async createCurrency(name: string): Promise<TCurrency> {
    const existedCurrency = await this.prismaService.currency.findUnique({
      where: {
        name,
      },
    });

    if (existedCurrency) {
      throw new BadRequestException('Currency already exists');
    }

    return this.prismaService.currency.create({
      data: {
        name,
      },
    });
  }

  async updateCurrency(
    currencyId: number,
    newName: string,
  ): Promise<TCurrency> {
    const currency = await this.prismaService.currency.findUnique({
      where: { id: currencyId },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return await this.prismaService.currency.update({
      where: {
        id: currencyId,
      },
      data: {
        name: newName,
      },
    });
  }

  async removeCurrency(name: string): Promise<TCurrency> {
    const currency = await this.prismaService.currency.findUnique({
      where: { name },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.prismaService.currency.delete({
      where: { name },
    });
  }

  async getExchangeRatesByDay(date: string): Promise<TCurrencyWithRates[]> {
    if (isNaN(Date.parse(date))) {
      throw new BadRequestException('Invalid date format');
    }

    const currencies = await this.prismaService.currency.findMany({
      where: {
        exchangeRates: {
          some: { date },
        },
      },
      include: {
        exchangeRates: {
          where: { date },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (currencies.length === 0) {
      throw new NotFoundException(`No exchange rates found for date ${date}`);
    }

    return currencies.map((c) => ({
      id: c.id,
      name: c.name,
      exchangeRates: c.exchangeRates.map((r) => ({
        id: r.id,
        date: r.date,
        rate: r.rate,
      })),
    }));
  }

  async setExchangeRate(
    currencyId: number,
    date: string,
    rate: number,
  ): Promise<void> {
    if (isNaN(Date.parse(date))) {
      throw new BadRequestException('Invalid date format');
    }

    const currency = await this.prismaService.currency.findUnique({
      where: { id: currencyId },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    const existing = await this.prismaService.exchangeRates.findFirst({
      where: {
        currencyId,
        date,
      },
    });

    if (existing) {
      await this.prismaService.exchangeRates.update({
        where: { id: existing.id },
        data: { rate },
      });
    } else {
      await this.prismaService.exchangeRates.create({
        data: {
          currencyId,
          date,
          rate,
        },
      });
    }
  }
}
