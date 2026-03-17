import React from 'react';
import { Map } from 'lucide-react';

export default function MapPlaceholder() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
      <Map className="w-16 h-16 mb-4 text-gray-300" />
      <p className="text-lg font-medium">El mapa interactivo cargará aquí...</p>
    </div>
  );
}
