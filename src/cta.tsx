import React from "react";
import {useCurrentFrame} from "remotion";
import {C, FPS, s2f} from "./theme";
import {usePop} from "./util";

/** Bouncing arrow pointing down at the comment section. */
export const DownArrow: React.FC<{at: number; to: number}> = ({at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 14, 120);
  if (frame < s2f(at) || frame > s2f(to)) return null;
  const bounce = Math.abs(Math.sin(((frame - s2f(at)) / FPS) * 4)) * 26;
  return (
    <div style={{position: "absolute", left: 505, top: 1665 + bounce, transform: `scale(${p})`}}>
      <svg width="70" height="100" viewBox="0 0 70 95" style={{filter: "drop-shadow(0 8px 12px rgba(0,0,0,.4))"}}>
        <path d="M22 0 H48 V50 H66 L35 92 L4 50 H22 Z" fill={C.yellow} stroke="#0B0B0F" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
