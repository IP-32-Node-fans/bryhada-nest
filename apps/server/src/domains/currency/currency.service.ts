import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  TCurrency,
  TCurrencyWithRates,
  TExchangeRate,
} from '../../../types';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly db: DatabaseService) {}

  async getAllExchangeRates(): Promise<TCurrencyWithRates[]> {
    const query = `
      SELECT c.id, c.name, r.id as rate_id, r.rate, r.date
      FROM currencies c
      LEFT JOIN exchange_rates r ON r.currency_id = c.id
      ORDER BY c.id, r.date DESC;
    `;
    const { rows } = await this.db.query(query);

    const grouped: Record<number, TCurrencyWithRates> = {};
    for (const row of rows) {
      if (!grouped[row.id]) {
        grouped[row.id] = { id: row.id, name: row.name, exchangeRates: [] };
      }
      if (row.rate_id) {
        grouped[row.id].exchangeRates.push({
          id: row.rate_id,
          date: row.date,
          rate: row.rate,
        });
      }
    }
    return Object.values(grouped);
  }

  async getRateHistory(currencyId: number, fromDate: string, toDate: string): Promise<TExchangeRate[]> {
    const { rows: currency } = await this.db.query('SELECT * FROM currencies WHERE id = $1', [currencyId]);
    if (!currency.length) throw new NotFoundException('Currency not found');

    const { rows } = await this.db.query(
      'SELECT * FROM exchange_rates WHERE currency_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date ASC',
      [currencyId, fromDate, toDate],
    );

    if (!rows.length) throw new NotFoundException('No rate history found');
    return rows;
  }

  async createCurrency(name: string): Promise<TCurrency> {
    const { rows: existing } = await this.db.query('SELECT * FROM currencies WHERE name = $1', [name]);
    if (existing.length) throw new BadRequestException('Currency already exists');

    const { rows } = await this.db.query(
      'INSERT INTO currencies (name) VALUES ($1) RETURNING *',
      [name],
    );
    return rows[0];
  }

  async updateCurrency(currencyId: number, newName: string): Promise<TCurrency> {
    const { rows: existing } = await this.db.query('SELECT * FROM currencies WHERE id = $1', [currencyId]);
    if (!existing.length) throw new NotFoundException('Currency not found');

    const { rows } = await this.db.query(
      'UPDATE currencies SET name = $1 WHERE id = $2 RETURNING *',
      [newName, currencyId],
    );
    return rows[0];
  }

  async removeCurrency(name: string): Promise<TCurrency> {
    const { rows: existing } = await this.db.query('SELECT * FROM currencies WHERE name = $1', [name]);
    if (!existing.length) throw new NotFoundException('Currency not found');

    const { rows } = await this.db.query('DELETE FROM currencies WHERE name = $1 RETURNING *', [name]);
    return rows[0];
  }

  async getExchangeRatesByDay(date: string): Promise<TCurrencyWithRates[]> {
    if (isNaN(Date.parse(date))) throw new BadRequestException('Invalid date format');

    const { rows } = await this.db.query(
      `SELECT c.id, c.name, r.id as rate_id, r.rate, r.date
       FROM currencies c
       JOIN exchange_rates r ON r.currency_id = c.id
       WHERE r.date = $1
       ORDER BY r.date ASC`,
      [date],
    );

    if (!rows.length) throw new NotFoundException(`No exchange rates found for date ${date}`);

    const grouped: Record<number, TCurrencyWithRates> = {};
    for (const row of rows) {
      if (!grouped[row.id]) {
        grouped[row.id] = { id: row.id, name: row.name, exchangeRates: [] };
      }
      grouped[row.id].exchangeRates.push({ id: row.rate_id, rate: row.rate, date: row.date });
    }
    return Object.values(grouped);
  }

  async setExchangeRate(currencyId: number, date: string, rate: number): Promise<TExchangeRate> {
    if (isNaN(Date.parse(date))) throw new BadRequestException('Invalid date format');

    const { rows: existing } = await this.db.query('SELECT * FROM currencies WHERE id = $1', [currencyId]);
    if (!existing.length) throw new NotFoundException('Currency not found');

    const { rows: foundRate } = await this.db.query(
      'SELECT * FROM exchange_rates WHERE currency_id = $1 AND date = $2',
      [currencyId, date],
    );

    if (foundRate.length) {
      const { rows } = await this.db.query(
        'UPDATE exchange_rates SET rate = $1 WHERE id = $2 RETURNING *',
        [rate, foundRate[0].id],
      );
      return rows[0];
    } else {
      const { rows } = await this.db.query(
        'INSERT INTO exchange_rates (currency_id, date, rate) VALUES ($1, $2, $3) RETURNING *',
        [currencyId, date, rate],
      );
      return rows[0];
    }
  }
}
