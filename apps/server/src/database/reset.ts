import { SQL } from './../../src/domains/currency/currency.sql';
import { DatabaseService } from '../database/database.service';

(async () => {
  const db = new DatabaseService();
  await db.query(SQL.dropTables);
  await db.query(SQL.createTables);
  console.log('✅ Tables reseted');
  process.exit(0);
})();