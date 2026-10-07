import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {C, FONT, FPS, s2f} from "./theme";
import {clamp01, ease, usePop, useT} from "./util";

/* ---------------------------------------------------------------- helpers */
const Blueprint: React.FC<{children?: React.ReactNode; tint?: string}> = ({children, tint = C.navy}) => (
  <div style={{position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${C.navy2} 0%, ${tint} 70%)`, overflow: "hidden"}}>
    <div
      style={{
        position: "absolute", inset: 0, opacity: 0.18,
        backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
    {children}
  </div>
);

const HazardTape: React.FC<{top?: number; bottom?: number; text?: string; rot?: number}> = ({top, bottom, text, rot = 0}) => (
  <div
    style={{
      position: "absolute", left: -60, right: -60, top, bottom, height: 96, transform: `rotate(${rot}deg)`,
      background: "repeating-linear-gradient(-45deg, #FFC21A 0 38px, #111 38px 76px)", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 12px 30px rgba(0,0,0,.45)",
    }}
  >
    {text ? (
      <div style={{background: "#111", color: C.amber, fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 6, padding: "6px 36px", borderRadius: 8}}>{text}</div>
    ) : null}
  </div>
);

/* ------------------------------------------------------------ icon pieces */
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

const Badge: React.FC<{cx: number; cy: number; at: number; to: number; label: string; children: React.ReactNode; accent: string}> = ({cx, cy, at, to, label, children, accent}) => {
  const p = usePop(at);
  const frame = useCurrentFrame();
  const out = interpolate(frame, [s2f(to) - 6, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const float = Math.sin((frame / FPS) * 2.4 + cx) * 9;
  if (frame < s2f(at) || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: cx - 125, top: cy - 125 + float, width: 250, textAlign: "center", transform: `scale(${p * out})`, opacity: out}}>
      <div style={{width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #DCE6F7)", border: `10px solid ${accent}`, boxShadow: `0 18px 50px rgba(0,0,0,.45), 0 0 40px ${accent}88`, display: "flex", alignItems: "center", justifyContent: "center"}}>
        {children}
      </div>
      <div style={{marginTop: 16, display: "inline-block", background: C.navy, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, padding: "6px 26px", borderRadius: 14, border: `3px solid ${accent}`}}>{label}</div>
    </div>
  );
};

/** S1: office desk (job) vs hard hat (construction site). */
export const SplitIcons: React.FC<{to: number}> = ({to}) => (
  <>
    <Badge cx={150} cy={1000} at={0.5} to={to} label="JOB" accent={C.blue}><DeskSvg size={190} /></Badge>
    <Badge cx={930} cy={1000} at={1.9} to={to} label="SITE" accent={C.amber}><HardhatSvg size={190} /></Badge>
  </>
);

/* ------------------------------------------------------- S2 cracked slab */
const CRACK = "M-40 520 L120 600 L190 560 L330 700 L420 660 L560 820 L640 780 L760 930 L850 900 L1000 1080 L1130 1040";
const BRANCHES = ["M330 700 L300 820 L350 930", "M560 820 L540 930 L610 1020 L590 1110", "M760 930 L830 1030 L800 1140", "M190 560 L230 450 L180 360"];

export const CrackScene: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const draw = clamp01(t / 0.45);
  const shake = t > 0.35 && t < 0.7 ? Math.sin(t * 90) * 10 : 0;
  const warn = usePop(from + 0.45, 8, 200);
  const pulse = 0.5 + 0.5 * Math.sin(t * 14);
  return (
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(160deg,#5b5f66,#3a3d44)", overflow: "hidden", transform: `translate(${shake}px,${shake * 0.6}px)`}}>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        <defs>
          <filter id="concrete"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0" /></filter>
          <filter id="glow"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width="1080" height="1920" filter="url(#concrete)" opacity=".7" />
        {/* shuttering joints */}
        {[300, 700, 1100, 1500].map((y) => <line key={y} x1="0" x2="1080" y1={y} y2={y} stroke="#2a2d33" strokeWidth="4" opacity=".6" />)}
        <path d={CRACK} stroke="#05070c" strokeWidth="22" fill="none" strokeLinejoin="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - draw)} filter="url(#glow)" opacity=".6" />
        <path d={CRACK} stroke="#05070c" strokeWidth="12" fill="none" strokeLinejoin="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - draw)} />
        {BRANCHES.map((b, i) => (
          <path key={i} d={b} stroke="#05070c" strokeWidth="7" fill="none" strokeLinejoin="round" strokeDasharray={500} strokeDashoffset={500 * (1 - clamp01((t - 0.2 - i * 0.07) / 0.35))} />
        ))}
        {/* rebar peeking out */}
        <g opacity={clamp01((t - 0.5) / 0.2)}>
          <rect x="520" y="900" width="120" height="14" rx="7" fill="#9A4B24" transform="rotate(28 580 907)" />
          <rect x="430" y="780" width="110" height="14" rx="7" fill="#9A4B24" transform="rotate(-20 485 787)" />
        </g>
      </svg>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 55%, transparent 35%, rgba(229,25,45,${0.12 + pulse * 0.18}) 100%)`}} />
      <HazardTape top={170} text="SITE ERROR" rot={-3} />
      <HazardTape bottom={70} rot={2} />
      {/* red warning accent */}
      <div style={{position: "absolute", left: 540 - 170, top: 1030, width: 340, transform: `scale(${warn}) rotate(${Math.sin(t * 22) * 4 * (1 - clamp01((t - 0.9) / 0.5))}deg)`}}>
        <svg viewBox="0 0 100 90" width="340">
          <path d="M50 6 L96 84 H4 Z" fill={C.red} stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
          <rect x="46" y="32" width="8" height="30" rx="4" fill="#fff" />
          <circle cx="50" cy="71" r="5" fill="#fff" />
        </svg>
        <div style={{position: "absolute", left: -40, top: -30, width: 420, height: 420, borderRadius: "50%", border: `8px solid ${C.red}`, opacity: 0.7 * (1 - clamp01((t - 0.5) / 0.9)), transform: `scale(${0.6 + clamp01((t - 0.5) / 0.9) * 0.9})`}} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------ S3 3D ticking clock */
export const Clock3D: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = useT(from);
  const pop = usePop(from);
  const out = interpolate(frame, [s2f(to) - 8, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  const sec = Math.floor(t);
  const frac = t - sec;
  const secAngle = (sec + Math.min(1, frac * 6) * 1) * 30; // snappy tick
  const minAngle = t * 70;
  const hourAngle = t * 6;
  const total = to - from;
  const urgent = clamp01((t - total * 0.5) / (total * 0.5));
  const ring = interpolate(t, [0, total], [0, 1], {extrapolateRight: "clamp"});
  const accent = urgent > 0.5 ? C.red : C.orange;
  const R = 108;
  return (
    <div style={{position: "absolute", left: 770, top: 800, width: 300, height: 300, perspective: 800, transform: `scale(${pop * out})`, opacity: out}}>
      <div style={{width: 300, height: 300, transformStyle: "preserve-3d", transform: `rotateY(${Math.sin(t * 1.6) * 24 - 14}deg) rotateX(${12 + Math.sin(t * 1.1) * 5}deg) translateY(${Math.sin(t * 2.2) * 10}px)`}}>
        <svg width="300" height="300" viewBox="-150 -150 300 300" style={{filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))"}}>
          <circle r="138" fill={C.navy} />
          <circle r="138" fill="none" stroke="#2b3d66" strokeWidth="14" />
          <circle r="138" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" strokeDasharray={867} strokeDashoffset={867 * ring} transform="rotate(-90)" />
          <circle r={R} fill="#F6F8FC" />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1="0" y1={-R + 8} x2="0" y2={-R + (i % 3 === 0 ? 28 : 18)} stroke={C.navy} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
          ))}
          <line x1="0" y1="8" x2="0" y2="-62" stroke={C.navy} strokeWidth="9" strokeLinecap="round" transform={`rotate(${hourAngle})`} />
          <line x1="0" y1="10" x2="0" y2="-92" stroke={C.navy} strokeWidth="6" strokeLinecap="round" transform={`rotate(${minAngle})`} />
          <line x1="0" y1="20" x2="0" y2="-98" stroke={C.red} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${secAngle})`} />
          <circle r="9" fill={C.red} />
        </svg>
      </div>
    </div>
  );
};

/* -------------------------------------------- S4 surging arrow + 3X slam */
export const SurgeArrow: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = useT(from);
  const slam = usePop(from + 0.08, 9, 230);
  const out = interpolate(frame, [s2f(to) - 5, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  const draw = clamp01(t / 0.45);
  const shake = t < 0.5 ? Math.sin(t * 80) * 8 * (1 - t * 2) : 0;
  const path = "M60 1400 L300 1150 L420 1250 L650 900 L760 980 L990 620";
  return (
    <div style={{position: "absolute", inset: 0, opacity: out}}>
      <div style={{position: "absolute", inset: 0, background: "rgba(10,15,30,.55)"}} />
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        <defs><filter id="rg"><feGaussianBlur stdDeviation="14" /></filter></defs>
        <path d={path} stroke={C.red} strokeWidth="46" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - draw)} filter="url(#rg)" opacity=".8" />
        <path d={path} stroke="#FF3B4E" strokeWidth="30" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - draw)} />
        <g transform={`translate(990 620) rotate(-52) scale(${clamp01((t - 0.35) / 0.15)})`}>
          <path d="M0 -60 L70 40 L-70 40 Z" fill="#FF3B4E" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FONT, transform: `translate(${shake}px,${shake * 0.5}px) scale(${slam * 1})`}}>
        <div style={{fontWeight: 900, fontSize: 420, lineHeight: 0.9, color: "#fff", WebkitTextStroke: `14px ${C.red}`, paintOrder: "stroke fill", textShadow: `0 20px 60px rgba(229,25,45,.7)`}}>3X</div>
        <div style={{fontWeight: 900, fontSize: 150, letterSpacing: 18, color: C.amber, textShadow: "0 8px 30px rgba(0,0,0,.6)", marginTop: -10}}>COST</div>
      </div>
    </div>
  );
};

/* ------------------------------------------ S4 calculator + rising bars */
export const CalcScene: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const val = 1 + 2 * ease(clamp01(t / 0.55));
  const pop = usePop(from + 0.02);
  const keys = Array.from({length: 16});
  return (
    <Blueprint tint="#220b12">
      <div style={{position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.amber, letterSpacing: 6, transform: `scale(${pop})`}}>BUDGET ↑ 3X</div>
      <div style={{position: "absolute", left: 130, top: 520, width: 420, height: 640, borderRadius: 50, background: "linear-gradient(160deg,#2A3550,#10192E)", border: "6px solid #5C6C94", boxShadow: "0 40px 80px rgba(0,0,0,.55)", transform: `scale(${pop})`, padding: 36}}>
        <div style={{height: 150, borderRadius: 24, background: "#C8F0CF", fontFamily: "monospace", fontWeight: 700, color: "#12331A", fontSize: 96, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 24px"}}>{val.toFixed(1)}x</div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 40}}>
          {keys.map((_, i) => <div key={i} style={{height: 84, borderRadius: 22, background: i % 4 === 3 ? C.orange : "#3B4A72", boxShadow: "0 6px 0 rgba(0,0,0,.35)"}} />)}
        </div>
      </div>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        {[{x: 640, h: 180, c: "#4F8DF7", l: "1X"}, {x: 760, h: 330, c: C.orange, l: "2X"}, {x: 880, h: 520, c: C.red, l: "3X"}].map((b, i) => {
          const g = ease(clamp01((t - 0.1 - i * 0.12) / 0.4));
          return (
            <g key={i}>
              <rect x={b.x} y={1150 - b.h * g} width="90" height={b.h * g} rx="12" fill={b.c} />
              <text x={b.x + 45} y="1210" textAnchor="middle" fill="#fff" fontFamily={FONT} fontWeight={800} fontSize="40">{b.l}</text>
            </g>
          );
        })}
        <line x1="620" y1="1150" x2="1000" y2="1150" stroke="#fff" strokeWidth="4" opacity=".7" />
      </svg>
    </Blueprint>
  );
};

/* ------------------------------------ S6 digital eye scanning a 3D building */
const FLOORS = 5;
export const EyeScene: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const pop = usePop(from + 0.02);
  const scan = clamp01(t / 1.1);
  const scanY = 1480 - scan * 760;
  const look = Math.sin(t * 5) * 16;
  const defectPop = usePop(from + 0.75, 8, 220);
  const bx = 540, by = 1480, w = 300, d = 150, fh = 120;
  const floorPts = (i: number) => {
    const y = by - i * fh;
    return `${bx - w / 2},${y} ${bx},${y + d / 2} ${bx + w / 2},${y} ${bx},${y - d / 2}`;
  };
  return (
    <Blueprint>
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.blue} stopOpacity="0" /><stop offset="1" stopColor={C.blue} stopOpacity=".55" /></linearGradient>
          <filter id="neon"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* building wireframe */}
        <g filter="url(#neon)" stroke={C.blue} strokeWidth="4" fill="none" strokeLinejoin="round" opacity={pop}>
          {Array.from({length: FLOORS + 1}).map((_, i) => <polygon key={i} points={floorPts(i)} />)}
          {[0, 1, 2, 3].map((k) => {
            const pts = [[bx - w / 2, by], [bx, by + d / 2], [bx + w / 2, by], [bx, by - d / 2]][k];
            return <line key={k} x1={pts[0]} y1={pts[1]} x2={pts[0]} y2={pts[1] - FLOORS * fh} />;
          })}
        </g>
        {/* scan beam */}
        <rect x="140" y={scanY - 200} width="800" height="200" fill="url(#beam)" opacity={scan < 1 ? 1 : 0} />
        <line x1="140" x2="940" y1={scanY} y2={scanY} stroke="#9BE7FF" strokeWidth="6" filter="url(#neon)" opacity={scan < 1 ? 1 : 0} />
        {/* OK ticks appear as the beam passes */}
        {Array.from({length: FLOORS}).map((_, i) => {
          const y = by - (i + 0.5) * fh;
          const seen = scanY < y;
          const defect = i === 3;
          return seen ? (
            <g key={i} opacity={clamp01((y - scanY) / 40)}>
              {defect ? null : <circle cx={bx + 240} cy={y} r="26" fill={C.green} />}
              {defect ? null : <polyline points={`${bx + 228},${y} ${bx + 237},${y + 10} ${bx + 254},${y - 10}`} stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          ) : null;
        })}
        {/* defect marker */}
        <g transform={`translate(${bx - 250} ${by - 3.5 * fh}) scale(${defectPop})`}>
          <circle r="60" fill="none" stroke={C.red} strokeWidth="8" />
          <circle r="60" fill={C.red} opacity=".25" />
          <text y="22" textAnchor="middle" fill="#fff" fontFamily={FONT} fontWeight={900} fontSize="64">!</text>
        </g>
        {/* eye */}
        <g transform={`translate(540 560) scale(${pop * 1.5})`} filter="url(#neon)">
          <path d="M-190 0 Q0 -150 190 0 Q0 150 -190 0 Z" fill="#fff" stroke={C.blue} strokeWidth="8" />
          
          <circle cx={look} cy="0" r="78" fill="#1E5FD8" />
          <circle cx={look} cy="0" r="52" fill="#0A1F5C" />
          <circle cx={look} cy="0" r="26" fill="#000" />
          <circle cx={look - 22} cy="-24" r="14" fill="#fff" opacity=".9" />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1={look + Math.cos((i / 12) * 6.283) * 56} y1={Math.sin((i / 12) * 6.283) * 56} x2={look + Math.cos((i / 12) * 6.283) * 76} y2={Math.sin((i / 12) * 6.283) * 76} stroke={C.blue} strokeWidth="3" />
          ))}
        </g>
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 10, color: C.blue, opacity: pop}}>YOUR EYES ON SITE</div>
    </Blueprint>
  );
};

/* ------------------------------------------------- S6 inspection checklist */
const ITEMS = ["Foundation", "Rebar & beams", "Safety checks", "Budget vs plan"];
export const ChecklistScene: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const pop = usePop(from + 0.02);
  const hat = usePop(from + 0.05, 9, 190);
  return (
    <Blueprint>
      <div style={{position: "absolute", left: 120, top: 330, width: 840, height: 1050, borderRadius: 48, background: "#F8FAFF", boxShadow: "0 50px 100px rgba(0,0,0,.55)", transform: `scale(${pop}) rotate(${(1 - pop) * -6}deg)`, padding: "120px 60px 40px"}}>
        <div style={{position: "absolute", left: 290, top: -34, width: 260, height: 90, borderRadius: 24, background: "linear-gradient(#FFB347,#FF7A00)", border: `6px solid ${C.navy}`}} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.navy, textAlign: "center", marginBottom: 40}}>SITE CHECKLIST</div>
        {ITEMS.map((it, i) => {
          const k = ease(clamp01((t - 0.12 - i * 0.2) / 0.18));
          return (
            <div key={i} style={{display: "flex", alignItems: "center", gap: 36, height: 150, borderBottom: i < ITEMS.length - 1 ? "4px dashed #CBD5E8" : "none"}}>
              <svg width="96" height="96" viewBox="0 0 96 96">
                <rect x="6" y="6" width="84" height="84" rx="20" fill="#fff" stroke={C.navy} strokeWidth="7" />
                <polyline points="24,50 42,68 74,28" fill="none" stroke={C.green} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - k)} />
              </svg>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.navy}}>{it}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 640, top: 1180, transform: `scale(${hat}) rotate(12deg)`}}>
        <div style={{width: 250, height: 250, borderRadius: "50%", background: "#fff", border: `10px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,.5)"}}><HardhatSvg size={180} /></div>
      </div>
    </Blueprint>
  );
};

/* ------------------------------------------------------------- S7 CTA bits */
const Letter: React.FC<{l: string; at: number}> = ({l, at}) => {
  const lp = usePop(at, 7, 240);
  return <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 190, lineHeight: 1, color: "#fff", display: "inline-block", transform: `translateY(${(1 - lp) * -80}px) scale(${0.6 + 0.4 * lp})`, textShadow: "0 8px 0 rgba(0,0,0,.25)"}}>{l}</span>;
};

export const ManageSticker: React.FC<{at: number; to: number}> = ({at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 8, 210);
  const t = useT(at);
  if (frame < s2f(at) || frame > s2f(to)) return null;
  const letters = "MANAGE".split("");
  const wob = Math.sin(t * 3) * 1.5;
  return (
    <div style={{position: "absolute", left: 90, top: 1010, width: 900, transform: `scale(${p}) rotate(${-5 + wob}deg)`, transformOrigin: "50% 50%"}}>
      <div style={{background: `linear-gradient(135deg, ${C.orange}, #FF3D00)`, borderRadius: 44, border: "10px solid #fff", boxShadow: "0 30px 70px rgba(0,0,0,.55), 0 0 60px rgba(255,122,0,.6)", padding: "26px 20px 22px", textAlign: "center"}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 8, color: "#FFE9CF"}}>COMMENT</div>
        <div style={{display: "flex", justifyContent: "center", gap: 6}}>
          {letters.map((l, i) => <Letter key={i} l={l} at={at + 0.05 + i * 0.05} />)}
        </div>
      </div>
    </div>
  );
};

export const DMIcon: React.FC<{at: number; to: number}> = ({at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 8, 200);
  const badge = usePop(at + 0.35, 6, 300);
  const t = useT(at);
  if (frame < s2f(at) || frame > s2f(to)) return null;
  const fly = ease(clamp01(t / 0.5));
  return (
    <div style={{position: "absolute", left: 770, top: 640 - 40 * Math.sin(t * 3), transform: `scale(${p}) rotate(${(1 - p) * 20}deg)`}}>
      <div style={{width: 230, height: 230, borderRadius: 60, background: "linear-gradient(45deg,#FEDA75,#FA7E1E 25%,#D62976 50%,#962FBF 75%,#4F5BD5)", boxShadow: "0 24px 60px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #fff"}}>
        <svg width="140" height="140" viewBox="0 0 100 100" style={{transform: `translate(${(1 - fly) * -50}px, ${(1 - fly) * 50}px)`}}>
          <path d="M92 10 L8 44 L40 56 L52 90 Z" fill="#fff" />
          <path d="M92 10 L40 56" stroke="#D62976" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{position: "absolute", right: -22, top: -22, width: 84, height: 84, borderRadius: "50%", background: C.red, border: "7px solid #fff", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 52, textAlign: "center", lineHeight: "70px", transform: `scale(${badge})`}}>1</div>
    </div>
  );
};

export const DownArrow: React.FC<{at: number; to: number}> = ({at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 9, 180);
  if (frame < s2f(at) || frame > s2f(to)) return null;
  const bounce = Math.abs(Math.sin(((frame - s2f(at)) / FPS) * 5)) * 40;
  return (
    <div style={{position: "absolute", left: 500, top: 1650 + bounce, transform: `scale(${p})`}}>
      <svg width="140" height="190" viewBox="0 0 70 95" style={{filter: "drop-shadow(0 12px 18px rgba(0,0,0,.5))"}}>
        <path d="M22 0 H48 V50 H66 L35 92 L4 50 H22 Z" fill={C.amber} stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Cheap "impact" flash used on hard cuts. */
export const Flash: React.FC<{at: number; color?: string}> = ({at, color = "#fff"}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s2f(at), s2f(at) + 5], [0.55, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return o > 0 ? <div style={{position: "absolute", inset: 0, background: color, opacity: o}} /> : null;
};

