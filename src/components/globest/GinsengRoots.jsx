import React from 'react';
const silhouettes = [
  'M57 66 C49 70 53 82 59 94 C63 87 67 75 63 67 Q60 64 57 66Z',
  'M55 65 C45 73 49 88 57 101 Q61 107 65 98 C72 85 73 72 64 65Z',
  'M54 65 C42 71 46 88 51 96 L55 108 Q60 113 65 105 C74 95 77 80 71 70 Q64 63 54 65Z',
  'M54 64 C44 64 41 76 46 88 Q49 96 50 106 Q53 114 59 107 L63 100 Q66 111 72 107 C79 100 75 88 77 80 Q81 66 66 63Z',
  'M53 63 C40 66 38 78 44 89 Q47 99 45 107 Q45 115 52 114 L62 102 Q65 107 66 114 Q75 120 79 108 L76 95 Q85 82 78 70 C75 63 66 60 53 63Z',
  'M52 62 C38 63 36 77 42 88 Q47 96 42 109 Q40 119 50 117 L62 103 Q70 109 67 118 Q78 125 83 113 L78 98 Q88 86 81 73 C79 60 65 58 52 62Z'
];
const tendrils = ['M56 94 Q49 114 44 127 L38 139', 'M65 96 Q76 116 72 130 L79 142', 'M49 77 Q36 76 34 93 T18 117 L11 126', 'M73 77 Q90 82 88 97 T104 119 L109 131', 'M46 88 Q31 93 27 110 L16 115', 'M78 87 Q99 91 100 106 L115 115', 'M51 107 Q35 114 32 133 L26 141', 'M76 110 Q87 118 89 134 L99 141'];
const branches = ['M47 118 L34 123 L29 130', 'M75 120 L87 126 L93 136', 'M26 106 L13 108 L7 115', 'M96 110 L110 106 L116 110', 'M34 92 L21 89 L12 97', 'M91 94 L108 90 L116 96', 'M34 125 L18 128 L12 137', 'M88 129 L107 132 L111 140'];
export default function GinsengRoots({ level, id }) {
  return <g strokeLinecap="round" strokeLinejoin="round">
    <g stroke={`url(#${id}-root-line)`} strokeWidth={level > 3 ? 1.65 : 1.3}>
      {tendrils.slice(0, [2, 3, 4, 6, 7, 8][level - 1]).map((d, i) => <path key={i} d={d}/>)}
      {branches.slice(0, [0, 1, 2, 4, 6, 8][level - 1]).map((d, i) => <path key={i} d={d} strokeWidth=".8"/>)}
      {level === 6 && <path d="M19 117 Q25 123 18 132 M102 117 Q98 124 106 127 M43 132 L50 137 M71 134 L64 141 M13 108 L9 102 M108 90 L110 82" strokeWidth=".6"/>}
    </g>
    <path d={silhouettes[level - 1]} fill={`url(#${id}-root)`} stroke="#A88249" strokeWidth="1.1"/>
    <path d="M59 63 Q56 58 60 53 Q64 58 62 64" fill={`url(#${id}-root)`} stroke="#AD8B55" strokeWidth="1"/>
    {level >= 4 && <path d="M56 58 L64 58 M56 61 L65 61 M54 65 L66 65" stroke="#9D7845" strokeWidth=".85"/>}
    <path d={level < 3 ? 'M56 71 Q54 79 58 86' : 'M51 72 Q46 85 54 94'} stroke="#FFF1CC" strokeWidth={level > 3 ? 3 : 2} opacity=".65"/>
    {Array.from({ length: level + 1 }, (_, index) => { const y = 72 + index * 5; return <path key={y} d={`M${level > 3 ? 50 : 54} ${y} Q60 ${y + 1.8} ${level > 3 ? 73 : 66} ${y - 1.5}`} stroke="#9F793E" strokeWidth=".8" opacity=".48"/>; })}
    {level >= 5 && <g fill="#95703B" opacity=".5"><circle cx="48" cy="80" r=".8"/><circle cx="74" cy="83" r=".8"/><circle cx="58" cy="94" r=".7"/><circle cx="68" cy="76" r=".6"/></g>}
  </g>;
}