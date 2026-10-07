import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {AlarmClock} from "./three/objects";
import {Stage} from "./three/Stage";
import {FPS, s2f} from "./theme";
import {clamp01, ease, usePop} from "./util";

const YELLOW = "#FFE600";
const RED = "#FF2A2A";

/* ------------------------------------------------------------------ captions */
export type Caption = {start: number; end: number; words: string; hl?: string[]; script?: string; scriptColor?: string; y?: number};

/** Bottom captions in the reference style: bold italic, yellow highlight words, red/yellow script overlay. */
export const Captions: React.FC<{items: Caption[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = items.find((x) => frame >= s2f(x.start) && frame <= s2f(x.end) + 3);
  if (!c) return null;
  const a = s2f(c.start);
  const out = interpolate(frame, [s2f(c.end) - 3, s2f(c.end) + 3], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const words = c.words.split(" ");
  const hl = (c.hl ?? []).join(" ").toLowerCase().split(" ");
  return (
    <div style={{position: "absolute", left: 50, right: 50, top: c.y ?? 1470, display: "flex", flexDirection: "column", alignItems: "center", opacity: out}}>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 18px", fontFamily: "Inter, Arial", fontWeight: 800, fontStyle: "italic", fontSize: 76, lineHeight: 1.06, letterSpacing: -1.5, textAlign: "center"}}>
        {words.map((w, i) => {
          const p = spring({frame: frame - a - i * 2, fps, config: {damping: 12, stiffness: 190, mass: 0.5}});
          const on = hl.includes(w.toLowerCase().replace(/[.,!?'’“”"]/g, ""));
          return (
            <span key={i} style={{display: "inline-block", color: on ? YELLOW : "#fff", opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 38}px) scale(${0.85 + 0.15 * p})`, textShadow: "0 6px 22px rgba(0,0,0,.8), 0 2px 0 rgba(0,0,0,.5)"}}>
              {w}
            </span>
          );
        })}
      </div>
      {c.script ? <Script text={c.script} at={c.start + 0.25} color={c.scriptColor ?? RED} /> : null}
    </div>
  );
};

const Script: React.FC<{text: string; at: number; color: string}> = ({text, at, color}) => {
  const p = usePop(at, 10, 160);
  return (
    <div style={{marginTop: -14, fontFamily: "Yellowtail, cursive", fontSize: 150, lineHeight: 1, color, transform: `rotate(-6deg) scale(${0.6 + 0.4 * p})`, opacity: clamp01(p * 2), textShadow: `0 0 26px ${color}aa, 0 8px 24px rgba(0,0,0,.6)`, whiteSpace: "nowrap"}}>{text}</div>
  );
};

/* ------------------------------------------------------------------ squircle inset window */
/** Rounded-square "window" above the speaker's head that holds a 3D clip. */
export const Inset: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const p = usePop(from, 13, 130);
  const out = interpolate(frame, [s2f(to) - 6, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: 90, top: 70, width: 900, height: 440, opacity: out * clamp01(p * 2), transform: `scale(${0.82 + 0.18 * p}) translateY(${Math.sin(frame / 22) * 4}px)`}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 120, overflow: "hidden", background: "radial-gradient(circle at 50% 35%, #2a3447 0%, #0b0e15 85%)", boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 0 3px rgba(255,255,255,.14)"}}>
        {children}
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%)"}} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ dark cinematic cutaway */
export const GrainOverlay: React.FC<{opacity?: number}> = ({opacity = 0.18}) => {
  const frame = useCurrentFrame();
  return (
    <svg width="1080" height="1920" style={{position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none"}}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 7} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1080" height="1920" filter="url(#grain)" />
    </svg>
  );
};

/** Full-screen dark cutaway with a slow spotlight, grain and a warm light-leak on entry. */
export const CutDark: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const a = s2f(from);
  const b = s2f(to);
  if (frame < a || frame > b) return null;
  const p = ease(clamp01((frame - a) / 8));
  const out = interpolate(frame, [b - 5, b], [1, 0], {extrapolateLeft: "clamp"});
  return (
    <div style={{position: "absolute", inset: 0, opacity: out, transform: `scale(${1.08 - 0.08 * p})`, overflow: "hidden", background: "#07090d"}}>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 40) * 8}% 38%, #27324a 0%, #10151f 45%, #05070b 100%)`}} />
      {children}
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.7) 100%)"}} />
      <GrainOverlay />
    </div>
  );
};

/** Warm orange/pink flash used between shots. */
export const LightLeak: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const k = frame - s2f(at);
  if (k < -2 || k > 11) return null;
  const o = Math.sin(clamp01((k + 2) / 13) * Math.PI);
  return <AbsoluteFill style={{mixBlendMode: "screen", opacity: o * 0.9, background: "linear-gradient(115deg, rgba(255,150,40,.95) 0%, rgba(255,60,110,.85) 45%, rgba(120,70,255,.6) 100%)", pointerEvents: "none"}} />;
};

/* ------------------------------------------------------------------ hook card */
export const HookCard: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = (frame - s2f(from)) / FPS;
  const p = usePop(from + 0.05, 11, 150);
  const q = usePop(from + 0.3, 11, 150);
  const out = interpolate(frame, [s2f(to) - 5, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: out, background: "radial-gradient(ellipse at 50% 30%, #f3f3f3 0%, #b9bcc2 55%, #5d6168 100%)", overflow: "hidden"}}>
      {/* swoosh ribbon */}
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        <path d="M160 360 C 420 620, 640 1000, 1020 1500" stroke="#111" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - ease(clamp01(t / 0.7)))} opacity=".85" />
        <path d="M700 1900 C 780 1500, 900 1250, 1100 1100" stroke="#fff" strokeWidth="60" fill="none" strokeLinecap="round" opacity=".9" />
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", lineHeight: 0.95}}>
        <div style={{fontFamily: "Yellowtail, cursive", fontSize: 250, color: RED, textShadow: "0 0 30px rgba(255,42,42,.5), 0 10px 20px rgba(0,0,0,.35)", transform: `rotate(-6deg) scale(${0.6 + 0.4 * p})`, opacity: clamp01(p * 2)}}>Stop</div>
        <div style={{fontFamily: "Yellowtail, cursive", fontSize: 190, color: "#111", transform: `rotate(-3deg) scale(${0.6 + 0.4 * q})`, opacity: clamp01(q * 2), marginTop: -20}}>Wasting Time</div>
      </div>
      <Stage w={1080} h={1920} camY={-0.9} s={1.0}>
        <group position={[0.15, -0.95, 0.6]} rotation={[0.1, -0.4 + Math.sin(t * 1.2) * 0.2, 0.06]} scale={0.95 * p}><AlarmClock t={t * 2.5} /></group>
      </Stage>
    </AbsoluteFill>
  );
};
