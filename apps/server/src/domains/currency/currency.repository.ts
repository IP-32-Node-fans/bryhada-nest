import { Injectable } from '@nestjs/common';
import { Rate, TCurrency } from '../../../types';
import { DatabaseService } from 'src/database/database.service';
import { SQL } from './currency.sql';

@Injectable()
export class CurrencyRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllCurrencies(): Promise<TCurrency[]> {
    const result = await this.db.query(SQL.getAllCurrencies);
    return result.rows;
  }

  async addCurrency(currencyName: string): Promise<TCurrency> {
    await this.db.query(SQL.createCurrency, [currencyName]);
    const currency = await this.db.query(SQL.findCurrencyByName, [
      currencyName,
    ]);
    return currency.rows[0];
  }

  async deleteCurrency(name: string): Promise<void> {
    await this.db.query(SQL.deleteCurrency, [name]);
  }

  async updateCurrency(id: number, name: string): Promise<TCurrency> {
    const currency = await this.db.query(SQL.updateCurrency, [id, name]);
    return currency.rows[0];
  }

  async findCurrencyByName(name: string): Promise<TCurrency[]> {
    const result = await this.db.query(SQL.findCurrencyByName, [name]);
    return result.rows[0];
  }

  async findCurrencyById(id: number): Promise<TCurrency[]> {
    const result = await this.db.query(SQL.findCurrencyById, [id]);
    return result.rows[0];
  }

  async getAllRatesByDay(date: string): Promise<Rate[]> {
    const result = await this.db.query(SQL.getRatesByDay, [date]);
    return result.rows;
  }

  async getRateHistory(
    currencyId: number,
    fromDate: string,
    toDate: string,
  ): Promise<Rate[]> {
    const result = await this.db.query(SQL.getRateHistory, [
      currencyId,
      fromDate,
      toDate,
    ]);
    return result.rows;
  }

  async setExchangeRate(
    currencyId: number,
    date: string,
    rate: number,
  ): Promise<void> {
    await this.db.query(SQL.setExchangeRate, [currencyId, date, rate]);
  }
}
