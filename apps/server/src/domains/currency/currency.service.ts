import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM currencies WHERE name = $1', [name]);
      if (existing.rows.length) throw new BadRequestException('Currency already exists');

      const result = await client.query(
        'INSERT INTO currencies (name) VALUES ($1) RETURNING *',
        [name],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async updateCurrency(currencyId: number, newName: string): Promise<TCurrency> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM currencies WHERE id = $1', [currencyId]);
      if (!existing.rows.length) throw new NotFoundException('Currency not found');

      const result = await client.query(
        'UPDATE currencies SET name = $1 WHERE id = $2 RETURNING *',
        [newName, currencyId],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async removeCurrency(name: string): Promise<TCurrency> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM currencies WHERE name = $1', [name]);
      if (!existing.rows.length) throw new NotFoundException('Currency not found');

      const result = await client.query(
        'DELETE FROM currencies WHERE name = $1 RETURNING *',
        [name],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
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

    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const existingCurrency = await client.query('SELECT * FROM currencies WHERE id = $1', [currencyId]);
      if (!existingCurrency.rows.length) throw new NotFoundException('Currency not found');

      const existingRate = await client.query(
        'SELECT * FROM exchange_rates WHERE currency_id = $1 AND date = $2',
        [currencyId, date],
      );

      let result;
      if (existingRate.rows.length) {
        result = await client.query(
          'UPDATE exchange_rates SET rate = $1 WHERE id = $2 RETURNING *',
          [rate, existingRate.rows[0].id],
        );
      } else {
        result = await client.query(
          'INSERT INTO exchange_rates (currency_id, date, rate) VALUES ($1, $2, $3) RETURNING *',
          [currencyId, date, rate],
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
