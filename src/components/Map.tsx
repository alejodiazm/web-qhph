'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
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

const extractCoordinates = (location: any): [number, number] | null => {
  if (!location) return null;
  // Si viene como WKT: "POINT(-74.0817 4.6097)"
  if (typeof location === 'string') {
    const match = location.match(/POINT\(([-]?[0-9]*\.?[0-9]+)\s+([-]?[0-9]*\.?[0-9]+)\)/);
    if (match) {
      return [parseFloat(match[2]), parseFloat(match[1])]; // [lat, lng]
    }
  }
  // Alternativa (JSON con coordenadas)
  if (location.lat !== undefined && location.lng !== undefined) {
    return [location.lat, location.lng];
  }
  return null;
};

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
