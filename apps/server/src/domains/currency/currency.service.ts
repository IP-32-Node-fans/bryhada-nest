import { Injectable } from '@nestjs/common';
import type { TCurrency } from '../../../types';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrencyService {
  constructor(private readonly repository: CurrencyRepository) {}

  async getExchangeRates(date: string): Promise<TCurrency[]> {
    const rates = await this.repository.getAllRatesPromise();
    return rates
      .map((cur) => ({
        ...cur,
        exchangeRates: cur.exchangeRates.filter((rate) => rate.date === date),
      }))
      .filter((cur) => cur.exchangeRates.length > 0);
  }

  async getExchangeRateHistory(
    currency: string,
    fromDate: string,
    toDate: string,
  ): Promise<TCurrency[]> {
    const rates = await new Promise<TCurrency[]>(() => {
      this.repository.getAllRatesCallback();
    });

    return rates
      .filter((cur) => cur.name === currency)
      .map((cur) => ({
        ...cur,
        exchangeRates: cur.exchangeRates.filter(
          (rate) => rate.date >= fromDate && rate.date <= toDate,
        ),
      }));
  }

  async createCurrency(name: string): Promise<TCurrency> {
    const data = this.repository.getAllRatesSync();
    if (data.some((cur) => cur.name === name)) {
      throw new Error('Currency already exists');
    }

    const newCurrency: TCurrency = { id: Date.now(), name, exchangeRates: [] };
    data.push(newCurrency);
    await this.repository.saveRates(data);

    return newCurrency;
  }

  async updateCurrency(
    currencyId: number,
    newName: string,
  ): Promise<TCurrency> {
    const data = await this.repository.getAllRatesAsync();
    const currency = data.find((cur) => cur.id === currencyId);

    if (!currency) {
      throw new Error('Currency not found');
    }

    currency.name = newName;
    await this.repository.saveRates(data);
    return currency;
  }

  async deleteCurrency(currencyId: number): Promise<void> {
    const data = await this.repository.getAllRatesAsync();
    const indexToDelete = data.findIndex((cur) => cur.id === currencyId);

    if (indexToDelete === -1) {
      throw new Error('Currency not found');
    }

    data.splice(indexToDelete, 1);
    await this.repository.saveRates(data);
  }

  async setExchangeRate(
    currency: string,
    date: string,
    rate: number,
  ): Promise<void> {
    const data = await this.repository.getAllRatesAsync();
    const currencyObj = data.find((cur) => cur.name === currency);

    if (!currencyObj) {
      throw new Error('Currency not found');
    }

    const existingRate = currencyObj.exchangeRates.find((r) => r.date === date);
    if (existingRate) {
      existingRate.rate = rate;
    } else {
      currencyObj.exchangeRates.push({ date, rate });
    }

    await this.repository.saveRates(data);
  }
}
