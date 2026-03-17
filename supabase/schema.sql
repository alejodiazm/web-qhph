-- Habilitar PostGIS para consultas espaciales
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Crear tabla events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_free BOOLEAN DEFAULT false,
  image_url TEXT,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice espacial GIST
CREATE INDEX events_location_idx ON public.events USING GIST (location);

-- Función RPC para buscar eventos cercanos
CREATE OR REPLACE FUNCTION get_events_within_radius(
  lat float,
  lng float,
  radius_meters float
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_free BOOLEAN,
  image_url TEXT,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ,
  distance float
)
LANGUAGE sql
AS $$
  SELECT *,
         ST_Distance(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) AS distance
  FROM public.events
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance ASC;
$$;
