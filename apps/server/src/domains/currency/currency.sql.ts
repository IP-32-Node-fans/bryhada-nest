export const SQL = {
  createTables: `
    CREATE TABLE IF NOT EXISTS currencies (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS exchange_rates (
      id SERIAL PRIMARY KEY,
      currency_id INTEGER NOT NULL REFERENCES currencies(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      rate NUMERIC NOT NULL,
      UNIQUE(currency_id, date)
    );
  `,

  dropTables: `
    DROP TABLE IF EXISTS exchange_rates;
    DROP TABLE IF EXISTS currencies;
  `,

  createCurrency: `
    INSERT INTO currencies (name) VALUES ($1) RETURNING *;
  `,

  getAllCurrencies: `
    SELECT * FROM currencies;
  `,

  deleteCurrency: `
    DELETE FROM currencies WHERE name = $1;
  `,

  updateCurrency: `
    UPDATE currencies SET name = $2 WHERE id = $1 RETURNING *;
  `,

  findCurrencyByName: `
    SELECT * FROM currencies WHERE name = $1;
  `,

  findCurrencyById: `
    SELECT * FROM currencies WHERE id = $1;
  `,

  setExchangeRate: `
    INSERT INTO exchange_rates (currency_id, date, rate)
    VALUES ($1, $2, $3)
    ON CONFLICT (currency_id, date)
    DO UPDATE SET rate = EXCLUDED.rate;
  `,

  getRatesByDay: `
    SELECT c.id, c.name, r.date, r.rate
    FROM currencies c
    JOIN exchange_rates r ON c.id = r.currency_id
    WHERE r.date = $1;
  `,

  getRateHistory: `
    SELECT c.id, c.name, r.date, r.rate
    FROM currencies c
    JOIN exchange_rates r ON c.id = r.currency_id
    WHERE c.id = $1 AND r.date BETWEEN $2 AND $3
    ORDER BY r.date;
  `,

  getAllRates: `
    SELECT c.name, r.date, r.rate
    FROM exchange_rates r
    JOIN currencies c ON c.id = r.currency_id
    ORDER BY r.date DESC;
  `,
};
