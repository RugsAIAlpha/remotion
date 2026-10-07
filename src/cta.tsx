import React from "react";
import {useCurrentFrame} from "remotion";
import {Label} from "./collage";
import {C, FONT, FPS, s2f} from "./theme";
import {usePop} from "./util";

/** Back on the speaker: short CTA labels ABOVE his head (never over it) + DM badge beside it. */
export const EndCTA: React.FC<{at: number; to: number}> = ({at, to}) => {
  const badge = usePop(at + 0.2, 8, 240);
  const frame = useCurrentFrame();
  return (
    <>
      <Label y={350} at={at} to={to} size={70}>Comment <span style={{color: C.yellow}}>'MANAGE'</span></Label>
      <Label y={455} at={at + 0.3} to={to} bg={C.yellow} color="#0B0B0F" size={64} rot={-1}>Check your DM</Label>
      {frame >= s2f(at + 0.2) ? (
        <div style={{position: "absolute", left: 860, top: 800, transform: `scale(${badge * 0.8})`}}>
          <div style={{width: 170, height: 170, borderRadius: 46, background: C.orange, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 30px rgba(0,0,0,.45)"}}>
            <svg width="96" height="96" viewBox="0 0 100 100"><path d="M92 10 L8 44 L40 56 L52 90 Z" fill="#fff" /><path d="M92 10 L40 56" stroke={C.orange} strokeWidth="5" strokeLinecap="round" /></svg>
          </div>
          <div style={{position: "absolute", right: -14, top: -14, width: 56, height: 56, borderRadius: "50%", background: "#D6362B", border: "5px solid #fff", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 32, textAlign: "center", lineHeight: "46px"}}>1</div>
        </div>
      ) : null}
    </>
  );
};

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
