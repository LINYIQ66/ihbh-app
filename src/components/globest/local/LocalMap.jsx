import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function LocalMap({ merchants, onOpen }) {
  const { t } = useExperience();
  return <div className="h-[480px] overflow-hidden rounded-2xl border border-border">
    <MapContainer center={[1.31, 103.83]} zoom={12} className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {merchants.map(x => <CircleMarker key={x.id} center={[x.lat, x.lng]} radius={10} pathOptions={{ color: '#ea580c', fillColor: '#f97316', fillOpacity: 0.85 }}>
        <Popup><b>{t(x.zh, x.en)}</b><br />★ {x.rating} · S${x.avg}<br /><button className="mt-1 font-semibold text-orange-600" onClick={() => onOpen(x)}>{t('查看详情', 'View details')}</button></Popup>
      </CircleMarker>)}
    </MapContainer>
  </div>;
}