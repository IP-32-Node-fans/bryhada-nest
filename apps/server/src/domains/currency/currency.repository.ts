import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { TCurrency } from '../../../types';

@Injectable()
export class CurrencyRepository {
  private readonly filePath = path.join(
    __dirname,
    './data/currency-rates.json',
  );

  constructor() {
    this.ensureFileExists();
  }

  private async ensureFileExists(): Promise<void> {
    try {
      await fsPromises.access(this.filePath, fs.constants.F_OK);
    } catch {
      // Створюємо файл із порожнім масивом
      await fsPromises.mkdir(path.dirname(this.filePath), { recursive: true });
      await fsPromises.writeFile(this.filePath, '[]', 'utf-8');
    }
  }

  getAllRatesSync(): TCurrency[] {
    return JSON.parse(fs.readFileSync(this.filePath, 'utf-8')) as TCurrency[];
  }

  getAllRatesCallback(): Promise<TCurrency[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf-8', (err, data) => {
        if (err) reject(err);
        else resolve(JSON.parse(data) as TCurrency[]);
      });
    });
  }

  getAllRatesPromise(): Promise<TCurrency[]> {
    return fsPromises.readFile(this.filePath, 'utf-8').then(JSON.parse);
  }

  async getAllRatesAsync(): Promise<TCurrency[]> {
    const data = await fsPromises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data) as TCurrency[];
  }

  async saveRates(rates: TCurrency[]): Promise<void> {
    await fsPromises.writeFile(
      this.filePath,
      JSON.stringify(rates, null, 2),
      'utf-8',
    );
    console.log(`File created: ${this.filePath}`);
  }
}
