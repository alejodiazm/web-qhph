import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function reload() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Schema cache recargado');
  } catch (err) {
    console.error('Error reloading cache', err);
  } finally {
    await client.end();
  }
}
reload();
