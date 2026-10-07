import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {DeskSvg, HardhatSvg} from "./graphics";
import {C, FONT, FPS, SERIF, s2f} from "./theme";
import {clamp01, ease, usePop, useT} from "./util";

const Inner: React.FC<{render: (t: number) => React.ReactNode; t: number}> = ({render, t}) => <>{render(t)}</>;

/** A calm "pinned polaroid" that holds one small illustration. Sits beside the speaker's head. */
export const Card: React.FC<{side: "left" | "right"; at: number; to: number; label: string; rot?: number; children: (t: number) => React.ReactNode}> = ({side, at, to, label, rot = 4, children}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 14, 120);
  const t = useT(at);
  const out = interpolate(frame, [s2f(to) - 8, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(at) || out <= 0) return null;
  const r = (side === "left" ? -rot : rot) + (1 - p) * (side === "left" ? -10 : 10);
  return (
    <div style={{position: "absolute", left: side === "left" ? 30 : 750, top: 790 + Math.sin(t * 1.6) * 5, width: 300, opacity: out * clamp01(p * 2), transform: `translateY(${(1 - p) * 60}px) rotate(${r}deg)`}}>
      <div style={{background: C.cream, borderRadius: 14, padding: "14px 14px 12px", boxShadow: "0 22px 44px rgba(10,16,40,.38)"}}>
        <div style={{height: 258, borderRadius: 8, background: C.navy, overflow: "hidden", position: "relative"}}><Inner render={children} t={t} /></div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: C.navy, textAlign: "center", marginTop: 8}}>{label}</div>
      </div>
      <div style={{position: "absolute", left: 120, top: -16, width: 60, height: 26, background: "rgba(242,106,27,.85)", transform: "rotate(-4deg)", borderRadius: 3}} />
    </div>
  );
};

const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg}) => (
  <div style={{position: "absolute", inset: 0, background: bg ?? C.navy, display: "flex", alignItems: "center", justifyContent: "center"}}>{children}</div>
);

export const DeskCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="left" at={at} to={to} label="Job" rot={4}>{() => <Stage bg={C.cream}><DeskSvg size={200} /></Stage>}</Card>
);
export const HardhatCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="right" at={at} to={to} label="Construction" rot={4}>{() => <Stage bg={C.cream}><HardhatSvg size={200} color={C.orange} /></Stage>}</Card>
);

const CRACK = "M-10 70 L70 110 L110 90 L170 150 L215 130 L270 200";
export const CrackCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="left" at={at} to={to} label="Site error" rot={5}>
    {(t) => {
      const d = clamp01(t / 0.5);
      const w = usePop(at + 0.5, 9, 200);
      return (
        <Stage bg="#6B6F76">
          <svg width="272" height="258" viewBox="0 0 272 258" style={{position: "absolute", inset: 0}}>
            <path d={CRACK} stroke="#14161B" strokeWidth="9" fill="none" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 * (1 - d)} />
            <path d="M110 90 L100 150 L128 190" stroke="#14161B" strokeWidth="5" fill="none" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - clamp01((t - 0.25) / 0.4))} />
            <g transform={`translate(212 52) scale(${w})`}>
              <path d="M0 -34 L38 30 H-38 Z" fill={C.red} stroke={C.cream} strokeWidth="5" strokeLinejoin="round" />
              <rect x="-4" y="-12" width="8" height="24" rx="4" fill={C.cream} />
              <circle cx="0" cy="21" r="4.5" fill={C.cream} />
            </g>
          </svg>
        </Stage>
      );
    }}
  </Card>
);

export const ClockCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="right" at={at} to={to} label="Time" rot={4}>
    {(t) => {
      const total = to - at;
      const ring = clamp01(t / total);
      const sec = Math.floor(t) * 30 + Math.min(1, (t % 1) * 6) * 30;
      return (
        <Stage>
          <svg width="230" height="230" viewBox="-115 -115 230 230">
            <circle r="104" fill="none" stroke="#2A3F78" strokeWidth="12" />
            <circle r="104" fill="none" stroke={C.orange} strokeWidth="12" strokeLinecap="round" strokeDasharray={654} strokeDashoffset={654 * ring} transform="rotate(-90)" />
            <circle r="86" fill={C.cream} />
            {Array.from({length: 12}).map((_, i) => <line key={i} x1="0" y1="-76" x2="0" y2={i % 3 === 0 ? -60 : -68} stroke={C.navy} strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
            <line y2="-48" stroke={C.navy} strokeWidth="7" strokeLinecap="round" transform={`rotate(${t * 6})`} />
            <line y2="-68" stroke={C.navy} strokeWidth="5" strokeLinecap="round" transform={`rotate(${t * 60})`} />
            <line y1="12" y2="-72" stroke={C.orange} strokeWidth="3" strokeLinecap="round" transform={`rotate(${sec})`} />
            <circle r="7" fill={C.orange} />
          </svg>
        </Stage>
      );
    }}
  </Card>
);

export const BarsCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="right" at={at} to={to} label="Cost" rot={4}>
    {(t) => (
      <Stage bg={C.cream}>
        <svg width="260" height="240" viewBox="0 0 260 240">
          {[{x: 28, h: 55, c: C.navy, l: "1X"}, {x: 100, h: 105, c: C.navy2, l: "2X"}, {x: 172, h: 165, c: C.orange, l: "3X"}].map((b, i) => {
            const g = ease(clamp01((t - 0.1 - i * 0.14) / 0.45));
            return (
              <g key={i}>
                <rect x={b.x} y={200 - b.h * g} width="58" height={b.h * g} rx="8" fill={b.c} />
                <text x={b.x + 29} y="228" textAnchor="middle" fill={C.navy} fontFamily={FONT} fontWeight={800} fontSize="22">{b.l}</text>
              </g>
            );
          })}
          <line x1="14" y1="204" x2="246" y2="204" stroke={C.navy} strokeWidth="3" />
        </svg>
      </Stage>
    )}
  </Card>
);

export const EyeCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="left" at={at} to={to} label="Your eyes" rot={4}>
    {(t) => {
      const look = Math.sin(t * 4) * 12;
      const blink = (t % 2) > 1.85 ? 0.15 : 1;
      return (
        <Stage>
          <svg width="250" height="150" viewBox="-125 -75 250 150">
            <g transform={`scale(1 ${blink})`}>
              <path d="M-110 0 Q0 -90 110 0 Q0 90 -110 0 Z" fill={C.cream} />
              <circle cx={look} r="44" fill={C.orange} />
              <circle cx={look} r="24" fill={C.navy} />
              <circle cx={look - 12} cy="-14" r="8" fill={C.cream} />
            </g>
          </svg>
        </Stage>
      );
    }}
  </Card>
);

const ROWS = ["Foundation", "Beams", "Safety"];
export const CheckCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="right" at={at} to={to} label="Checklist" rot={4}>
    {(t) => (
      <Stage bg={C.cream}>
        <div style={{width: 230}}>
          {ROWS.map((r, i) => {
            const k = ease(clamp01((t - 0.2 - i * 0.3) / 0.25));
            return (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 16, height: 76}}>
                <svg width="46" height="46" viewBox="0 0 46 46">
                  <rect x="3" y="3" width="40" height="40" rx="10" fill="#fff" stroke={C.navy} strokeWidth="4" />
                  <polyline points="12,24 20,33 35,14" fill="none" stroke={C.orange} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - k)} />
                </svg>
                <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.navy}}>{r}</div>
              </div>
            );
          })}
        </div>
      </Stage>
    )}
  </Card>
);

export const DMCard: React.FC<{at: number; to: number}> = ({at, to}) => (
  <Card side="right" at={at} to={to} label="Check your DM" rot={4}>
    {(t) => {
      const b = usePop(at + 0.3, 8, 260);
      const fly = ease(clamp01(t / 0.5));
      return (
        <Stage bg={C.cream}>
          <div style={{position: "relative"}}>
            <div style={{width: 160, height: 160, borderRadius: 42, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <svg width="96" height="96" viewBox="0 0 100 100" style={{transform: `translate(${(1 - fly) * -40}px,${(1 - fly) * 40}px)`}}>
                <path d="M92 10 L8 44 L40 56 L52 90 Z" fill={C.cream} />
                <path d="M92 10 L40 56" stroke={C.orange} strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{position: "absolute", right: -16, top: -16, width: 56, height: 56, borderRadius: "50%", background: C.navy, color: C.cream, fontFamily: FONT, fontWeight: 800, fontSize: 34, textAlign: "center", lineHeight: "56px", transform: `scale(${b})`}}>1</div>
          </div>
        </Stage>
      );
    }}
  </Card>
);

export const DownArrow: React.FC<{at: number; to: number}> = ({at, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 14, 120);
  if (frame < s2f(at) || frame > s2f(to)) return null;
  const bounce = Math.abs(Math.sin(((frame - s2f(at)) / FPS) * 4)) * 26;
  return (
    <div style={{position: "absolute", left: 505, top: 1665 + bounce, transform: `scale(${p})`}}>
      <svg width="70" height="100" viewBox="0 0 70 95" style={{filter: "drop-shadow(0 8px 12px rgba(0,0,0,.4))"}}>
        <path d="M22 0 H48 V50 H66 L35 92 L4 50 H22 Z" fill={C.orange} stroke={C.cream} strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
