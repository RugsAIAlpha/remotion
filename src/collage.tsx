import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {BIG, C, s2f} from "./theme";
import {clamp01, usePop} from "./util";

const exitFade = (frame: number, to: number) => interpolate(frame, [s2f(to) - 6, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

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


/** Full-screen cutaway "clip": warm paper backdrop that slides up over the talking-head shot. */
export const Cut: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const a = s2f(from);
  const b = s2f(to);
  if (frame < a || frame > b) return null;
  const p = 1 - Math.pow(1 - clamp01((frame - a) / 7), 3);
  const out = interpolate(frame, [b - 5, b], [1, 0], {extrapolateLeft: "clamp"});
  return (
    <div style={{position: "absolute", inset: 0, opacity: out, transform: `translateY(${(1 - p) * 100}%)`, overflow: "hidden", background: "#EDE5D3"}}>
      <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(60,40,10,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(60,40,10,.07) 2px, transparent 2px)", backgroundSize: "64px 64px"}} />
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.55) 0%, rgba(120,90,40,.28) 100%)"}} />
      {children}
    </div>
  );
};
