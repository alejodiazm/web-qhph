import React from 'react';

export interface EventCardProps {
  id: string;
  title: string;
  category: string;
  start_time: string;
  is_free: boolean;
  image_url?: string | null;
  onClick?: (id: string) => void;
  isSelected?: boolean;
}

export default function EventCard({ id, title, category, start_time, is_free, image_url, onClick, isSelected }: EventCardProps) {
  const dateStr = start_time ? new Date(start_time).toLocaleDateString() : 'Por definir';
  return (
    <div 
      className={`group cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-4 rounded-xl' : ''}`} 
      onClick={() => onClick && onClick(id)}
    >
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3 overflow-hidden">
        {image_url ? (
          <img src={image_url} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gray-300 transition-transform duration-300 group-hover:scale-105"></div>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div className="pr-2">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{dateStr}</p>
        </div>
        <span className="bg-gray-100 border border-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
          {category}
        </span>
      </div>
      <p className="text-sm mt-1">
        <span className="font-semibold text-gray-900">{is_free ? 'Gratis' : 'De pago'}</span>
      </p>
    </div>
  );
}
