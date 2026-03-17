'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  onMarkerClick?: (id: string) => void;
  selectedEventId?: string | null;
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



const Map = ({ events, onMarkerClick, selectedEventId }: MapProps) => {
  const center: [number, number] = [4.6097, -74.0817]; // Bogotá

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      className="h-full w-full z-0 relative"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => {
        if (!event.lat || !event.lng) return null;
        return (
          <Marker 
            key={event.id} 
            position={[event.lat, event.lng]} 
            icon={defaultIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(event.id),
            }}
            ref={(r) => {
              if (r && selectedEventId === event.id) {
                r.openPopup();
              }
            }}
          >
            <Popup>
              <strong>{event.title}</strong><br/>
              <span className="text-xs text-gray-500">{event.category}</span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
