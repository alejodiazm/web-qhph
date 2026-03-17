import React, { useEffect } from 'react';
import EventCard from './EventCard';

interface SidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  onEventClick?: (id: string) => void;
  selectedEventId?: string | null;
}

export default function Sidebar({ events, onEventClick, selectedEventId }: SidebarProps) {
  useEffect(() => {
    if (selectedEventId) {
      const el = document.getElementById(`event-${selectedEventId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedEventId]);

  return (
    <div className="w-full md:w-[400px] h-full overflow-y-auto border-r border-gray-200 p-6 bg-white shrink-0 scroll-smooth">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Eventos cerca de ti ({events.length})</h2>
      <div className="flex flex-col gap-8">
        {events.map((event) => (
          <div key={event.id} id={`event-${event.id}`}>
            <EventCard 
              id={event.id}
              title={event.title}
              category={event.category}
              start_time={event.start_time}
              is_free={event.is_free}
              image_url={event.image_url}
              onClick={onEventClick}
              isSelected={event.id === selectedEventId}
            />
          </div>
        ))}
        {events.length === 0 && <p className="text-gray-500">No se encontraron eventos.</p>}
      </div>
    </div>
  );
}
