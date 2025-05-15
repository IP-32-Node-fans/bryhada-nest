import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Rate, TCurrency } from '../../../types';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrencyService {
  constructor(private readonly repository: CurrencyRepository) {}

  async getAllExchangeRates(): Promise<TCurrency[]> {
    return await this.repository.getAllCurrencies();
  }

  async getRateHistory(
    currencyId: number,
    fromDate: string,
    toDate: string,
  ): Promise<Rate[]> {
    const data = await this.repository.getAllCurrencies();
    const currencyObj = data.find((cur) => cur.id === currencyId);
    if (!currencyObj) {
      throw new NotFoundException('Currency not found');
    }
    const history = await this.repository.getRateHistory(
      currencyId,
      fromDate,
      toDate,
    );
    if (!history.length) {
      throw new NotFoundException('No rate history found');
    }
    return history;
  }

  async createCurrency(name: string): Promise<TCurrency> {
    const data = await this.repository.getAllCurrencies();
    if (data.some((cur) => cur.name === name)) {
      throw new BadRequestException('Currency already exists');
    }

    const newCurrency = await this.repository.addCurrency(name);

    return newCurrency;
  }

  async updateCurrency(
    currencyId: number,
    newName: string,
  ): Promise<TCurrency> {
    const data = await this.repository.findCurrencyById(currencyId);

    if (!data) {
      throw new NotFoundException('Currency not found');
    }
    return await this.repository.updateCurrency(currencyId, newName);
  }

  async remove(name: string): Promise<void> {
    const data = await this.repository.findCurrencyByName(name);
    if (!data) {
      throw new NotFoundException('Currency not found');
    }
    await this.repository.deleteCurrency(name);
  }

  async getExchangeRatesByDay(date: string): Promise<Rate[]> {
    const data = await this.repository.getAllRatesByDay(date);
    if (!data) {
      throw new NotFoundException('data not found');
    }

    return data;
  }

  async setExchangeRate(
    currencyId: number,
    date: string,
    rate: number,
  ): Promise<void> {
    const data = await this.repository.findCurrencyById(currencyId);
    if (!data) {
      throw new NotFoundException('Currency not found');
    }
    await this.repository.setExchangeRate(currencyId, date, rate);
  }
}
