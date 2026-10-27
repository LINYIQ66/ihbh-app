import React, { useId } from 'react';
import GinsengFoliage from '@/components/globest/GinsengFoliage';
import GinsengRoots from '@/components/globest/GinsengRoots';
export default function GinsengPlant({ level = 1, className = '' }) {
  const id = `ginseng-${useId().replace(/:/g, '')}`;
  const stage = Math.max(1, Math.min(6, Math.round(Number(level) || 1)));
  const scale = [.48, .59, .7, .81, .91, 1][stage - 1];
  const rootColors = [
    ['#F5E8CC', '#D5BE8B', '#B39866'], ['#F5E4BA', '#D6B57C', '#AD8A53'],
    ['#FAE8BB', '#DAB575', '#A68049'], ['#FFEAB5', '#D6A65B', '#9D723C'],
    ['#FFF0BC', '#DDB060', '#9A6B35'], ['#FFF3C7', '#E8BC69', '#A27032']
  ][stage - 1];
  return <svg viewBox="0 0 120 145" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-root`} x1="40" y1="70" x2="81" y2="101" gradientUnits="userSpaceOnUse"><stop stopColor={rootColors[0]}/><stop offset=".48" stopColor={rootColors[1]}/><stop offset="1" stopColor={rootColors[2]}/></linearGradient>
      <linearGradient id={`${id}-root-line`} x1="60" y1="75" x2="60" y2="143" gradientUnits="userSpaceOnUse"><stop stopColor={rootColors[2]}/><stop offset="1" stopColor={rootColors[1]}/></linearGradient>
      <linearGradient id={`${id}-leaf`} x1="-8" y1="-20" x2="8" y2="-8" gradientUnits="userSpaceOnUse"><stop stopColor={stage < 3 ? '#A3C773' : '#8CB56D'}/><stop offset=".45" stopColor={stage < 3 ? '#76A45C' : '#4E8751'}/><stop offset="1" stopColor={stage < 5 ? '#48734A' : '#245D41'}/></linearGradient>
      <radialGradient id={`${id}-berry`} cx="30%" cy="25%" r="80%"><stop stopColor="#F38D68"/><stop offset=".5" stopColor="#C44839"/><stop offset="1" stopColor="#862F2B"/></radialGradient>
      <radialGradient id={`${id}-halo`}><stop stopColor="#EAC975" stopOpacity=".25"/><stop offset=".65" stopColor="#EAC975" stopOpacity=".09"/><stop offset="1" stopColor="#EAC975" stopOpacity="0"/></radialGradient>
    </defs>
    <g transform={`translate(60 76) scale(${scale}) translate(-60 -76)`}>
      {stage >= 5 && <ellipse cx="60" cy="78" rx="58" ry="65" fill={`url(#${id}-halo)`}/>}
      <ellipse cx="60" cy="140" rx={14 + stage * 3} ry="2.5" fill="#6A794C" opacity=".09"/>
      <GinsengFoliage level={stage} id={id}/>
      <GinsengRoots level={stage} id={id}/>
      {stage === 6 && <g fill="#D8B25E" stroke="#F8E5AB" strokeWidth=".4"><path d="M12 57 L14 62 L19 64 L14 66 L12 71 L10 66 L5 64 L10 62Z"/><path d="M105 28 L106.5 32 L111 33.5 L106.5 35 L105 39 L103.5 35 L99 33.5 L103.5 32Z"/><circle cx="15" cy="38" r="1.5"/><circle cx="110" cy="76" r="1.4"/></g>}
    </g>
  </svg>;
}