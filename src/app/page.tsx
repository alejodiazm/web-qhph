'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import MapPlaceholder from '@/components/MapPlaceholder';
import { supabase } from '@/lib/supabase';

import { Search } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_events_within_radius', {
        user_lat: 4.6097,
        user_lng: -74.0817,
        radius_meters: 20000
      });

      if (error) {
        console.error('Error fetching events:', error);
      } else if (data) {
        setEvents(data);
        console.log("Estructura de evento 0:", data[0]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleEventClick = (id: string) => {
    setSelectedEventId(id);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (event.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || event.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-screen pt-16 -mt-16">
      <div className="border-b border-gray-200 bg-white p-4 flex justify-center sticky top-0 z-40 bg-white/90 backdrop-blur-sm">
         <div className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition bg-white w-full max-w-lg">
            <input 
              type="text" 
              placeholder="Buscar eventos..." 
              className="outline-none bg-transparent text-sm w-full placeholder-gray-400" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="bg-rose-500 rounded-full p-1.5 ml-2 cursor-pointer transition hover:bg-rose-600">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
      </div>
      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      <main className="flex flex-col-reverse md:flex-row w-full flex-1 overflow-hidden">
        <Sidebar events={filteredEvents} onEventClick={handleEventClick} selectedEventId={selectedEventId} />
        <div className="flex-1 w-full h-[50vh] md:h-full relative z-0">
          {loading ? <MapPlaceholder /> : <Map events={filteredEvents} onMarkerClick={handleEventClick} selectedEventId={selectedEventId} />}
        </div>
      </main>
    </div>
  );
}
