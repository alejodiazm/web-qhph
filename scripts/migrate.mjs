import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runMigration() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL en .env.local");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Conectado a PostgreSQL nativo.');
    const sql = fs.readFileSync('supabase/schema.sql', 'utf8');
    await client.query(sql);
    console.log('Extensión PostGIS, tabla events y función RPC creadas exitosamente.');
  } catch (err) {
    console.error('Error estructural:', err);
  } finally {
    await client.end();
  }
}
runMigration();
