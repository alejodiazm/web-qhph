import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixRPC() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const sql = `
    DROP FUNCTION IF EXISTS get_events_within_radius;
    CREATE OR REPLACE FUNCTION get_events_within_radius(user_lat float, user_lng float, radius_meters float)
    RETURNS TABLE(id uuid, title text, description text, category text, start_time timestamptz, end_time timestamptz, is_free boolean, image_url text, lat float, lng float) AS $$
    BEGIN
      RETURN QUERY SELECT e.id, e.title, e.description, e.category, e.start_time, e.end_time, e.is_free, e.image_url, ST_Y(e.location::geometry) AS lat, ST_X(e.location::geometry) AS lng FROM events e WHERE ST_DWithin(e.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_meters);
    END;
    $$ LANGUAGE plpgsql;
  `;
  await client.query(sql);
  console.log('RPC actualizada exitosamente para devolver lat y lng.');
  await client.end();
}
fixRPC();
