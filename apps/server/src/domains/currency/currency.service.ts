import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  TCurrencyWithRates,
  TCurrency,
  TExchangeRate,
} from '../../../types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExchangeRates } from '@prisma/client';
import { GetExchangeRatesQueryDto } from './dtos/get-all-rates.dto';
import { PaginatedExchangeRatesResponseDto } from './dtos/pagination.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllExchangeRates(
    query: GetExchangeRatesQueryDto,
  ): Promise<PaginatedExchangeRatesResponseDto> {
    const { name, page = 1, limit = 10 } = query;

    // Фільтрація
    const where: any = {};
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    // Пагінація
    const skip = (page - 1) * limit;

    // Отримання даних
    const [data, totalItems] = await Promise.all([
      this.prismaService.currency.findMany({
        where,
        include: {
          exchangeRates: {
            orderBy: { date: 'desc' },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prismaService.currency.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    };
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
    return this.prismaService.$transaction(async (tx) => {
      const existed = await tx.currency.findUnique({ where: { name } });
      if (existed) {
        throw new BadRequestException('Currency already exists');
      }
      return tx.currency.create({ data: { name } });
    });
  }

  async updateCurrency(
    currencyId: number,
    newName: string,
  ): Promise<TCurrency> {
    return this.prismaService.$transaction(async (tx) => {
      const currency = await tx.currency.findUnique({
        where: { id: currencyId },
      });
      if (!currency) {
        throw new NotFoundException('Currency not found');
      }
      return tx.currency.update({
        where: { id: currencyId },
        data: { name: newName },
      });
    });
  }

  async removeCurrency(name: string): Promise<TCurrency> {
    return this.prismaService.$transaction(async (tx) => {
      const currency = await tx.currency.findUnique({ where: { name } });
      if (!currency) {
        throw new NotFoundException('Currency not found');
      }
      return tx.currency.delete({ where: { name } });
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
  ): Promise<TExchangeRate> {
    if (isNaN(Date.parse(date))) {
      throw new BadRequestException('Invalid date format');
    }

    return this.prismaService.$transaction(async (tx) => {
      const currency = await tx.currency.findUnique({
        where: { id: currencyId },
      });
      if (!currency) {
        throw new NotFoundException('Currency not found');
      }

      const existing = await tx.exchangeRates.findFirst({
        where: { currencyId, date },
      });

      if (existing) {
        return tx.exchangeRates.update({
          where: { id: existing.id },
          data: { rate },
        });
      } else {
        return tx.exchangeRates.create({
          data: { currencyId, date, rate },
        });
      }
    });
  }
}