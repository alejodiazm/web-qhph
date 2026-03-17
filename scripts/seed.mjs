import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const categories = ['Concierto', 'Teatro', 'Taller', 'Deportes', 'Comedia', 'Educación', 'Fiesta', 'Festival', 'Bienestar', 'Gastronomía'];
const adjectives = ['Increíble', 'Exclusivo', 'Gratuito', 'Nocturno', 'Intensivo', 'Interactivo', 'Al aire libre', 'Local', 'Internacional', 'Clásico'];
const nouns = ['Experiencia', 'Clase', 'Encuentro', 'Show', 'Torneo', 'Charla', 'Ruta', 'Maratón', 'Exhibición', 'Sesión'];
const images = [
  "https://images.unsplash.com/photo-1540039155733-d7696d4ebaf7?w=500", // Concierto
  "https://images.unsplash.com/photo-1507676184212-d0330a1523fe?w=500", // Teatro
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500", // Yoga
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=500", // Gastronomía
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500"  // Fiesta
];

// Límites aproximados de Bogotá
const MIN_LAT = 4.5000;
const MAX_LAT = 4.7500;
const MIN_LNG = -74.1500;
const MAX_LNG = -74.0000;

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

const generatedEvents = Array.from({ length: 10 }).map(() => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const lng = getRandomInRange(MIN_LNG, MAX_LNG, 4);
  const lat = getRandomInRange(MIN_LAT, MAX_LAT, 4);
  
  // Fechas aleatorias entre Marzo y Mayo 2026
  const startDay = Math.floor(Math.random() * 60) + 16; 
  const startDate = new Date(2026, 2, startDay, Math.floor(Math.random() * 24), 0, 0);
  const endDate = new Date(startDate.getTime() + (Math.random() * 4 + 1) * 60 * 60 * 1000);

  return {
    title: `${adj} ${noun} de ${category}`,
    description: `Únete a esta gran experiencia de ${category} en Bogotá. No te lo pierdas.`,
    category: category,
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
    is_free: Math.random() > 0.7, // 30% probabilidad de ser gratis
    image_url: images[Math.floor(Math.random() * images.length)],
    location: `POINT(${lng} ${lat})`
  };
});

async function seed() {
  console.log('Insertando 10 eventos en Supabase...');
  // Limpiar eventos anteriores
  await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Insertamos en lotes para evitar límites de payload
  const { data, error } = await supabase.from('events').insert(generatedEvents);
  if (error) {
    console.error('Error masivo:', error);
  } else {
    console.log('¡10 Eventos generados e insertados con éxito en Bogotá!');
  }
}
seed();
