import React from 'react';

const css = `
.wg{animation:wgBob .5s ease-in-out infinite}
.wg-l1,.wg-a2{transform-origin:24px 40px;animation:wgSwing .5s ease-in-out infinite alternate}
.wg-l2,.wg-a1{transform-origin:24px 40px;animation:wgSwing .5s ease-in-out infinite alternate-reverse}
.wg-a1,.wg-a2{transform-origin:24px 28px}
.wg-leaf{transform-origin:24px 14px;animation:wgLeaf 1s ease-in-out infinite alternate}
@keyframes wgBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes wgSwing{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}
@keyframes wgLeaf{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}`;

export default function WalkingGinseng({ className = '', style }) {
  return <svg viewBox="0 0 48 64" className={className} style={style} overflow="visible">
    <style>{css}</style>
    <g className="wg" stroke="#5a3410" strokeWidth="1.6" strokeLinecap="round">
      <g className="wg-leaf">
        <path d="M24 16 L24 6" fill="none" stroke="#1f6b2a" strokeWidth="2" />
        <path d="M24 7 L16 1 L19 9Z M24 7 L32 1 L29 9Z M24 6 L24 -2 L21 5Z" fill="#2f9e3b" stroke="#1f6b2a" />
        <circle cx="24" cy="4" r="2.4" fill="#e3261b" stroke="#8a0f08" />
      </g>
      <path className="wg-a1" d="M18 28 L9 36 L6 34" fill="none" />
      <path className="wg-a2" d="M30 28 L39 36 L42 34" fill="none" />
      <path className="wg-l1" d="M21 42 L17 56 L12 58" fill="none" strokeWidth="2.2" />
      <path className="wg-l2" d="M27 42 L31 56 L36 58" fill="none" strokeWidth="2.2" />
      <path d="M24 14 C33 16 34 30 31 40 C29 46 19 46 17 40 C14 30 15 16 24 14Z" fill="#e8c27a" />
      <path d="M19 24 L23 25 M26 24 L30 23 M19 33 L24 34 M25 37 L29 36" fill="none" strokeWidth="1" />
      <path d="M19.5 21 L22.5 22.5 M29 21 L26 22.5" strokeWidth="1.8" />
      <circle cx="21.5" cy="24.5" r="1.3" fill="#1a1a1a" stroke="none" />
      <circle cx="27" cy="24.5" r="1.3" fill="#1a1a1a" stroke="none" />
      <path d="M22 29 Q24.5 30.5 27 28.5" fill="none" strokeWidth="1.3" />
    </g>
  </svg>;
}