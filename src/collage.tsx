import React from "react";
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {BIG, C, s2f} from "./theme";
import {clamp01, usePop} from "./util";

/** Deterministic torn-paper outline. */
const torn = (seed: number) => {
  const pts: string[] = [];
  const n = 28;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${random(`t${seed}-${i}`) * 2}%`);
  for (let i = 1; i <= 10; i++) pts.push(`${100 - random(`r${seed}-${i}`) * 1.4}% ${(i / 10) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - random(`b${seed}-${i}`) * 2}%`);
  for (let i = 9; i >= 1; i--) pts.push(`${random(`l${seed}-${i}`) * 1.4}% ${(i / 10) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

const exitFade = (frame: number, to: number) => interpolate(frame, [s2f(to) - 6, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

/** Paper cut-out that slaps onto the frame from a side, with a soft drop shadow. */
export const Paper: React.FC<{x: number; y: number; w: number; h: number; rot: number; at: number; to: number; bg?: string; seed?: number; dir?: "l" | "r" | "t" | "b" | "s"; float?: boolean; tape?: boolean; children?: React.ReactNode}> = ({x, y, w, h, rot, at, to, bg = C.paper, seed = 1, dir = "s", float = true, tape = false, children}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 13, 150);
  const out = exitFade(frame, to);
  if (frame < s2f(at) || out <= 0) return null;
  const k = 1 - p;
  const off = dir === "l" ? {x: -500, y: 0} : dir === "r" ? {x: 500, y: 0} : dir === "t" ? {x: 0, y: -300} : dir === "b" ? {x: 0, y: 300} : {x: 0, y: 0};
  const fl = float ? Math.sin(frame / 18 + seed) * 5 : 0;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, opacity: out * clamp01(p * 3), transform: `translate(${off.x * k}px, ${off.y * k + fl}px) rotate(${rot + k * 6}deg) scale(${0.88 + 0.12 * p})`, filter: "drop-shadow(0 18px 18px rgba(4,8,24,.55))"}}>
      <div style={{width: "100%", height: "100%", background: bg, clipPath: torn(seed), position: "relative", overflow: "hidden"}}>{children}</div>
      {tape ? <div style={{position: "absolute", left: w / 2 - 60, top: -16, width: 120, height: 34, background: "rgba(255,210,63,.85)", transform: "rotate(-3deg)"}} /> : null}
    </div>
  );
};

/** Bold headline in a bounding box that snaps in. */
export const Label: React.FC<{y: number; at: number; to: number; bg?: string; color?: string; size?: number; rot?: number; children: React.ReactNode}> = ({y, at, to, bg = "#0B0B0F", color = "#fff", size = 72, rot = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - s2f(at), fps, config: {damping: 9, stiffness: 260, mass: 0.5}});
  const out = exitFade(frame, to);
  if (frame < s2f(at) || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: out * clamp01(p * 3)}}>
      <div style={{background: bg, color, fontFamily: BIG, fontSize: size, lineHeight: 1.05, letterSpacing: 1.5, textTransform: "uppercase", padding: `${size * 0.1}px ${size * 0.36}px ${size * 0.06}px`, whiteSpace: "nowrap", transform: `scale(${1.5 - 0.5 * p}) rotate(${rot}deg)`, boxShadow: "0 10px 26px rgba(0,0,0,.45)", borderRadius: 6}}>{children}</div>
    </div>
  );
};

/** Rubber stamp that slams down. */
export const Stamp: React.FC<{x: number; y: number; at: number; to: number; text: string; rot?: number}> = ({x, y, at, to, text, rot = -12}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - s2f(at), fps, config: {damping: 8, stiffness: 320, mass: 0.6}});
  const out = exitFade(frame, to);
  if (frame < s2f(at) || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${3 - 2 * p})`, opacity: out * clamp01(p * 4)}}>
      <div style={{border: "10px solid #D6362B", color: "#D6362B", fontFamily: BIG, fontSize: 150, letterSpacing: 8, padding: "0 34px", borderRadius: 14, background: "rgba(255,255,255,.12)", textShadow: "0 0 2px rgba(214,54,43,.6)"}}>{text}</div>
    </div>
  );
};

/** Target reticle brackets around a region. */
export const Reticle: React.FC<{x: number; y: number; w: number; h: number; at: number; to: number}> = ({x, y, w, h, at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 14, 140);
  const out = exitFade(frame, to);
  if (frame < s2f(at) || out <= 0) return null;
  const g = 22 * (1 - p) + Math.sin(frame / 5) * 3;
  const corner = (cx: number, cy: number, sx: number, sy: number) => <path d={`M${cx} ${cy + sy * 46} V${cy} H${cx + sx * 46}`} stroke={C.yellow} strokeWidth="7" fill="none" strokeLinecap="round" />;
  return (
    <svg width="1080" height="1920" style={{position: "absolute", inset: 0, opacity: out * clamp01(p * 2)}}>
      {corner(x - g, y - g, 1, 1)}{corner(x + w + g, y - g, -1, 1)}{corner(x - g, y + h + g, 1, -1)}{corner(x + w + g, y + h + g, -1, -1)}
      <line x1={x - 60} x2={x - 18} y1={y + h / 2} y2={y + h / 2} stroke={C.yellow} strokeWidth="4" />
      <line x1={x + w + 18} x2={x + w + 60} y1={y + h / 2} y2={y + h / 2} stroke={C.yellow} strokeWidth="4" />
    </svg>
  );
};

