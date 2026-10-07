import React from "react";
import {C} from "./theme";

export const DeskSvg: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="22" y="22" width="56" height="36" rx="4" fill="#E8EEF8" stroke={C.navy} strokeWidth="3" />
    <rect x="27" y="27" width="46" height="26" rx="2" fill={C.navy2} />
    <polyline points="31,48 40,40 48,45 58,33 68,38" fill="none" stroke={C.amber} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="46" y="58" width="8" height="8" fill={C.navy} />
    <rect x="38" y="66" width="24" height="4" rx="2" fill={C.navy} />
    <rect x="10" y="74" width="80" height="6" rx="3" fill={C.navy} />
    <rect x="14" y="80" width="5" height="12" fill={C.navy} />
    <rect x="81" y="80" width="5" height="12" fill={C.navy} />
    <rect x="76" y="62" width="10" height="12" rx="2" fill={C.orange} />
  </svg>
);

export const HardhatSvg: React.FC<{size: number; color?: string}> = ({size, color = C.amber}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 66 A32 32 0 0 1 82 66 Z" fill={color} stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
    <rect x="44" y="30" width="12" height="36" rx="3" fill="#F59E0B" stroke={C.navy} strokeWidth="2.5" />
    <rect x="8" y="64" width="84" height="12" rx="6" fill={color} stroke={C.navy} strokeWidth="3" />
    <path d="M26 56 A26 26 0 0 1 40 38" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
  </svg>
);

