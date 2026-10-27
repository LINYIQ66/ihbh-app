import React from 'react';
export default function GinsengFoliage({ level, id }) {
  const fans = [{ x: 60, y: 43, size: 1, angles: level === 1 ? [-42, 42] : level === 2 ? [-52, 0, 52] : [-72, -36, 0, 36, 72] }];
  if (level >= 3) fans.push({ x: 33, y: 52, size: .7, angles: level === 3 ? [-48, 0, 48] : [-72, -36, 0, 36, 72] }, { x: 87, y: 49, size: .75, angles: level === 3 ? [-48, 0, 48] : [-72, -36, 0, 36, 72] });
  if (level >= 5) fans.push({ x: 40, y: 65, size: .5, angles: [-60, 0, 60] }, { x: 82, y: 64, size: .5, angles: [-60, 0, 60] });
  const berries = [[60, 13], [55, 10], [65, 10], [57, 5], [63, 5], [51, 15], [69, 15], [60, 19], [60, 9]].slice(0, [0, 0, 1, 3, 5, 9][level - 1]);
  return <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M60 71 Q57 53 60 32" stroke="#496C3C" strokeWidth={level >= 4 ? 3 : 2}/>
    {fans.map((fan, index) => <g key={index}>
      {index > 0 && <path d={`M60 65 Q${fan.x} 64 ${fan.x} ${fan.y}`} stroke="#597846" strokeWidth="1.7"/>}
      <g transform={`translate(${fan.x} ${fan.y}) scale(${fan.size})`}>
        {fan.angles.map((angle, n) => <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 0 C-5 -4 -12 -12 -8 -21 Q-4 -25 0 -31 Q3 -25 7 -21 C12 -13 6 -5 0 0Z" fill={`url(#${id}-leaf)`} stroke="#356544" strokeWidth=".65"/>
          <path d="M0 -2 Q-1 -16 0 -28" stroke="#C4D497" strokeWidth=".8" opacity=".8"/>
          {level >= 3 && <path d="M0 -8 L-5 -13 M0 -14 L-6 -19 M0 -11 L5 -16 M0 -19 L4 -23" stroke="#C4D497" strokeWidth=".55" opacity={n % 2 ? '.55' : '.8'}/>}
        </g>)}
      </g>
    </g>)}
    {berries.length > 0 && <path d="M60 41 Q64 24 60 11" stroke="#698044" strokeWidth="1.3"/>}
    {berries.map(([x, y], index) => <g key={index}><path d={`M60 25 L${x} ${y}`} stroke="#698044" strokeWidth=".7"/><circle cx={x} cy={y} r={level === 6 ? 3.4 : 3} fill={`url(#${id}-berry)`} stroke="#92392E" strokeWidth=".5"/><circle cx={x - .8} cy={y - 1} r=".85" fill="#FFE1BC" opacity=".8"/></g>)}
  </g>;
}