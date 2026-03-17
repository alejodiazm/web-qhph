'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import MapPlaceholder from '@/components/MapPlaceholder';

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

const CATEGORIES = ['Concierto', 'Teatro', 'Taller', 'Deportes', 'Comedia', 'Educación', 'Fiesta', 'Festival', 'Bienestar', 'Gastronomía'];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    start_time: '',
    end_time: '',
    is_free: false,
    image_url: '',
    lat: null as number | null,
    lng: null as number | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!formData.lat || !formData.lng) {
      setErrorMsg('Por favor selecciona una ubicación en el mapa.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('events').insert([{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        is_free: formData.is_free,
        image_url: formData.image_url,
        location: `POINT(${formData.lng} ${formData.lat})`
      }]);

      if (error) {
        throw error;
      }

      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error publicando el evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Publicar un Evento</h1>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del evento</label>
              <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea name="description" id="description" rows={3} required value={formData.description} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500"></textarea>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-white">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center mt-8">
              <input type="checkbox" name="is_free" id="is_free" checked={formData.is_free} onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
              <label htmlFor="is_free" className="ml-2 block text-sm font-medium text-gray-700">Es un evento gratuito</label>
            </div>

            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Fecha y Hora de Inicio</label>
              <input type="datetime-local" name="start_time" id="start_time" required value={formData.start_time} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">Fecha y Hora de Fin</label>
              <input type="datetime-local" name="end_time" id="end_time" required value={formData.end_time} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">URL de la Imagen de Portada</label>
              <input type="url" name="image_url" id="image_url" placeholder="https://ejemplo.com/imagen.jpg" required value={formData.image_url} onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación (Haz clic en el mapa para marcar)</label>
              <div className="h-[300px] w-full rounded-xl border border-gray-300 overflow-hidden">
                <LocationPickerMap onLocationSelect={handleLocationSelect} />
              </div>
              {formData.lat && formData.lng && (
                <p className="mt-2 text-sm text-green-600 font-medium">Ubicación seleccionada: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" onClick={() => router.push('/')} className="mr-4 px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50">
              {loading ? 'Publicando...' : 'Publicar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
