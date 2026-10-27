import React, { useEffect, useRef } from 'react';
import { MicOff } from 'lucide-react';

const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 4: 'grid-cols-2', 6: 'grid-cols-3', 9: 'grid-cols-3' };

function Tile({ seat }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && seat.stream) ref.current.srcObject = seat.stream; }, [seat.stream]);
  return <div className="relative overflow-hidden rounded-lg bg-neutral-800">
    {seat.stream ? <video ref={ref} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" /> : <img src={seat.img} alt="" className="h-full w-full object-cover" />}
    <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/60 px-1.5 text-[11px]">{seat.muted && <MicOff size={10} />}{seat.name}</span>
  </div>;
}

export default function VideoGrid({ seats, layout }) {
  const shown = seats.slice(0, layout);
  return <div className={`grid h-full gap-1 ${cols[layout]}`}>{shown.map(s => <Tile key={s.id} seat={s} />)}</div>;
}