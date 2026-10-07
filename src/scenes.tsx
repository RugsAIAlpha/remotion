import React from "react";
import {interpolate, random, useCurrentFrame} from "remotion";
import {Label, Paper, Reticle, Stamp} from "./collage";
import {HardhatSvg} from "./graphics";
import {BIG, C, FONT, FPS, s2f} from "./theme";
import {clamp01, ease, usePop, useT} from "./util";

/* ---------------------------------------------------------------- illustrations */
const LaptopBriefcase: React.FC = () => (
  <svg width="360" height="300" viewBox="0 0 360 300">
    <rect x="40" y="40" width="190" height="120" rx="10" fill="#E8EEF8" stroke={C.navy} strokeWidth="6" />
    <rect x="52" y="52" width="166" height="96" rx="4" fill={C.navy2} />
    <polyline points="64,130 100,100 130,116 170,76 206,92" fill="none" stroke={C.yellow} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 170 H250 L232 190 H38 Z" fill="#B8C3D9" stroke={C.navy} strokeWidth="6" strokeLinejoin="round" />
    <rect x="200" y="150" width="140" height="110" rx="14" fill="#8A5A2B" stroke={C.navy} strokeWidth="6" />
    <path d="M240 150 V132 H300 V150" fill="none" stroke={C.navy} strokeWidth="9" />
    <rect x="262" y="190" width="16" height="22" rx="3" fill={C.yellow} stroke={C.navy} strokeWidth="3" />
  </svg>
);

const HouseBlueprint: React.FC = () => (
  <svg width="420" height="320" viewBox="0 0 420 320" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
    <polygon points="40,150 210,40 380,150" />
    <rect x="70" y="150" width="280" height="140" />
    <rect x="95" y="185" width="70" height="105" />
    <rect x="215" y="185" width="95" height="60" />
    <line x1="262" y1="185" x2="262" y2="245" strokeWidth="3" />
    <line x1="215" y1="215" x2="310" y2="215" strokeWidth="3" />
    <line x1="40" y1="305" x2="380" y2="305" strokeDasharray="10 8" strokeWidth="3" />
  </svg>
);

const Magnifier: React.FC<{cx: number; cy: number}> = ({cx, cy}) => (
  <svg width="1080" height="560" viewBox="0 0 1080 560" style={{position: "absolute", left: 0, top: 0}}>
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="92" fill="rgba(255,255,255,.18)" stroke={C.yellow} strokeWidth="14" />
      <line x1="66" y1="66" x2="150" y2="150" stroke="#2A2A2A" strokeWidth="24" strokeLinecap="round" />
      <path d="M-50 -40 A62 62 0 0 1 10 -62" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".7" />
    </g>
  </svg>
);

const SiteIllustration: React.FC = () => (
  <svg width="420" height="330" viewBox="0 0 420 330" fill="none" strokeLinejoin="round" strokeLinecap="round">
    <g stroke={C.navy} strokeWidth="6">
      <rect x="40" y="170" width="170" height="130" fill="#fff" />
      {[1, 2, 3].map((i) => <line key={i} x1="40" x2="210" y1={170 + i * 32} y2={170 + i * 32} strokeWidth="3" />)}
      <line x1="125" y1="170" x2="125" y2="300" strokeWidth="3" />
      <line x1="290" y1="300" x2="290" y2="30" stroke={C.orange} strokeWidth="10" />
      <line x1="200" y1="46" x2="390" y2="46" stroke={C.orange} strokeWidth="10" />
      <line x1="200" y1="46" x2="200" y2="70" />
      <line x1="350" y1="46" x2="350" y2="150" strokeWidth="3" />
      <rect x="334" y="150" width="32" height="22" fill={C.yellow} />
      <line x1="20" y1="305" x2="400" y2="305" strokeWidth="8" />
    </g>
  </svg>
);

const Hourglass: React.FC<{t: number}> = ({t}) => {
  const k = clamp01((t % 3) / 3);
  return (
    <svg width="230" height="300" viewBox="0 0 230 300">
      <rect x="30" y="10" width="170" height="22" rx="8" fill={C.orange} stroke={C.navy} strokeWidth="5" />
      <rect x="30" y="268" width="170" height="22" rx="8" fill={C.orange} stroke={C.navy} strokeWidth="5" />
      <path d="M48 32 H182 C182 100 128 128 115 150 C128 172 182 200 182 268 H48 C48 200 102 172 115 150 C102 128 48 100 48 32Z" fill="rgba(255,255,255,.6)" stroke={C.navy} strokeWidth="6" />
      <clipPath id="hgTop"><path d="M48 32 H182 C182 100 128 128 115 150 C102 128 48 100 48 32Z" /></clipPath>
      <clipPath id="hgBot"><path d="M115 150 C128 172 182 200 182 268 H48 C48 200 102 172 115 150Z" /></clipPath>
      <rect x="40" y={32 + 118 * k} width="150" height={118 * (1 - k)} fill={C.yellow} clipPath="url(#hgTop)" />
      <rect x="40" y={268 - 118 * k} width="150" height={118 * k} fill={C.yellow} clipPath="url(#hgBot)" />
      <line x1="115" y1="150" x2="115" y2="268" stroke={C.yellow} strokeWidth="4" opacity={k < 0.98 ? 1 : 0} />
    </svg>
  );
};

/* ------------------------------------------------------------------- scene 1 */
export const SceneJob: React.FC<{to: number}> = ({to}) => {
  const vs = usePop(1.0, 9, 220);
  const frame = useCurrentFrame();
  const show = frame >= s2f(1.0) && frame < s2f(to) - 6;
  return (
    <>
      <Paper x={40} y={90} w={480} h={420} rot={-3} at={0.1} to={to} bg={C.kraft} seed={3} dir="l">
        <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}><LaptopBriefcase /></div>
      </Paper>
      <Paper x={560} y={90} w={480} h={420} rot={3} at={0.1} to={to} bg={C.paper} seed={7} dir="r">
        <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}><HardhatSvg size={330} color={C.orange} /></div>
      </Paper>
      {show ? <div style={{position: "absolute", left: 540 - 55, top: 300 - 55, width: 110, height: 110, borderRadius: "50%", background: C.yellow, border: "6px solid #0B0B0F", fontFamily: BIG, fontSize: 56, textAlign: "center", lineHeight: "98px", transform: `scale(${vs})`}}>VS</div> : null}
      <Label y={560} at={0.2} to={to}>Job ya Business?</Label>
      <Label y={660} at={1.9} to={to} bg={C.yellow} color="#0B0B0F" size={56} rot={-1.5}>Construction Project</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 2 */
export const SceneError: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useT(from);
  const mx = 300 + Math.sin(t * 1.9) * 260;
  const my = 250 + Math.cos(t * 2.3) * 70;
  const red = clamp01((t - 0.7) / 0.9) * 0.62;
  return (
    <>
      <Paper x={70} y={90} w={940} h={450} rot={-2} at={from} to={to} bg="#1F4E9C" seed={11} dir="t" tape>
        <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.22) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.22) 2px, transparent 2px)", backgroundSize: "44px 44px"}} />
        <div style={{position: "absolute", left: 260, top: 70}}><HouseBlueprint /></div>
        <Magnifier cx={mx} cy={my} />
        <div style={{position: "absolute", inset: 0, background: `rgba(214,54,43,${red})`}} />
      </Paper>
      <Stamp x={540} y={330} at={from + 1.05} to={to} text="ERROR" />
      <Label y={600} at={from + 1.05} to={to} bg={C.yellow} color="#D6362B" size={78} rot={-1}>Expensive Mistakes</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 3 */
const Clock3D: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const pop = usePop(from, 12, 150);
  const t = useT(from);
  const out = interpolate(frame, [s2f(to) - 8, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: 50, top: 120, width: 400, height: 400, perspective: 900, opacity: out, transform: `scale(${pop})`}}>
      <div style={{width: 400, height: 400, transform: `rotateY(${-18 + Math.sin(t * 1.4) * 8}deg) rotateX(14deg)`, filter: "drop-shadow(0 30px 24px rgba(0,0,0,.55))"}}>
        <svg width="400" height="400" viewBox="-200 -200 400 400">
          <circle r="190" fill={C.orange} />
          <circle r="172" fill={C.navy} />
          <circle r="150" fill={C.paper} />
          {Array.from({length: 12}).map((_, i) => <line key={i} x1="0" y1="-132" x2="0" y2={i % 3 === 0 ? -100 : -116} stroke={C.navy} strokeWidth={i % 3 === 0 ? 9 : 5} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
          <line y2="-80" stroke={C.navy} strokeWidth="12" strokeLinecap="round" transform={`rotate(${t * 40})`} />
          <line y2="-115" stroke={C.navy} strokeWidth="8" strokeLinecap="round" transform={`rotate(${t * 480})`} />
          <line y1="24" y2="-128" stroke="#D6362B" strokeWidth="5" strokeLinecap="round" transform={`rotate(${t * 1440})`} />
          <circle r="12" fill="#D6362B" />
        </svg>
      </div>
    </div>
  );
};

export const SceneTime: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const off = -(frame % 40) * 1.2;
  return (
    <>
      <Clock3D from={from} to={to} />
      <Paper x={590} y={120} w={450} h={380} rot={3} at={from + 0.15} to={to} seed={5} dir="r">
        <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}><SiteIllustration /></div>
      </Paper>
      {/* dashed tracking line from the clock to the site */}
      <svg width="1080" height="1920" style={{position: "absolute", inset: 0, opacity: clamp01((frame - s2f(from + 0.4)) / 8) * (frame < s2f(to) - 6 ? 1 : 0)}}>
        <path d="M430 320 C 480 200, 520 200, 600 300" fill="none" stroke={C.yellow} strokeWidth="8" strokeDasharray="16 14" strokeDashoffset={off} strokeLinecap="round" />
        <polygon points="600,300 570,296 584,322" fill={C.yellow} transform="rotate(10 600 300)" />
      </svg>
      <Label y={575} at={from + 0.3} to={to} size={64}>Utna samay</Label>
      <Label y={670} at={from + 1.5} to={to} bg="#D6362B" size={74} rot={-1}>Nahi de paate</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 4 */
const Bills: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS - from;
  if (t < 0 || frame > s2f(to)) return null;
  return (
    <>
      {Array.from({length: 16}).map((_, i) => {
        const x = 40 + random(`bx${i}`) * 960;
        const t0 = random(`bt${i}`) * 1.0;
        const y = -140 + (t - t0) * (620 + random(`bs${i}`) * 260);
        if (t < t0 || y > 1500) return null;
        const rot = random(`br${i}`) * 360 + (t - t0) * (120 + random(`bw${i}`) * 200) * (i % 2 ? 1 : -1);
        return (
          <div key={i} style={{position: "absolute", left: x, top: y, width: 150, height: 74, borderRadius: 8, background: "linear-gradient(135deg,#7CBF86,#4C9660)", border: "4px solid #2D6A43", color: "#1E4D31", fontFamily: FONT, fontWeight: 800, fontSize: 40, textAlign: "center", lineHeight: "66px", transform: `rotate(${rot}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.35)"}}>₹</div>
        );
      })}
    </>
  );
};

export const SceneCost: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const p = usePop(from, 9, 200);
  const t = useT(from);
  const out = interpolate(frame, [s2f(to) - 8, s2f(to)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (frame < s2f(from) || out <= 0) return null;
  const ext = Array.from({length: 10}).map((_, i) => `${i * 2}px ${i * 2}px 0 #0B0B0F`).join(",");
  return (
    <>
      <div style={{position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", perspective: 900, opacity: out, transform: `scale(${p})`}}>
        <div style={{fontFamily: BIG, fontSize: 470, lineHeight: 1, color: C.yellow, textShadow: `${ext}, 0 30px 40px rgba(0,0,0,.5)`, transform: `rotateY(${Math.sin(t * 2.4) * 28}deg) rotateZ(${Math.sin(t * 1.7) * 4}deg)`}}>3X</div>
      </div>
      <Bills from={from + 0.6} to={to} />
      <Reticle x={90} y={605} w={900} h={104} at={from + 0.8} to={to} />
      <Label y={610} at={from + 0.8} to={to} bg="#D6362B" size={72}>Cost 3X ho jaata hai!</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 5 */
export const SceneNoTime: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = useT(from);
  return (
    <>
      <Paper x={320} y={90} w={440} h={450} rot={3} at={from} to={to} seed={9} dir="b" tape float={false}>
        <div style={{position: "absolute", inset: 14, background: "repeating-linear-gradient(-45deg,#FFD23F 0 26px,#111 26px 52px)", borderRadius: 6}} />
        <div style={{position: "absolute", inset: 38, background: C.paper, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${Math.sin(frame / 14) * 6}px)`}}>
          <Hourglass t={t} />
        </div>
        <svg width="90" height="80" viewBox="0 0 100 90" style={{position: "absolute", left: 40, top: 40}}>
          <path d="M50 6 L96 84 H4 Z" fill="#D6362B" stroke={C.paper} strokeWidth="6" strokeLinejoin="round" />
          <rect x="46" y="32" width="8" height="30" rx="4" fill="#fff" />
          <circle cx="50" cy="71" r="5" fill="#fff" />
        </svg>
      </Paper>
      <Label y={575} at={from + 0.1} to={to} size={92}>Not Skill</Label>
      <Label y={685} at={from + 1.4} to={to} bg={C.yellow} color="#0B0B0F" size={92} rot={-1}>Just No Time</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 6 */
export const SceneEyes: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useT(from);
  const open = ease(clamp01((t - 0.25) / 0.5));
  const scan = (t * 0.9) % 1;
  const look = Math.sin(t * 2.2) * 18;
  const pulse = 0.55 + 0.45 * Math.sin(t * 9);
  return (
    <>
      <Paper x={60} y={90} w={960} h={450} rot={-1.5} at={from} to={to} bg="#1F4E9C" seed={13} dir="t" float={false}>
        <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.2) 2px, transparent 2px)", backgroundSize: "44px 44px"}} />
        <svg width="960" height="450" viewBox="0 0 960 450" fill="none" strokeLinejoin="round" strokeLinecap="round">
          {/* building under inspection */}
          <g stroke="#fff" strokeWidth="5">
            <rect x="350" y="170" width="260" height="250" />
            {[0, 1, 2, 3].map((i) => <line key={i} x1="350" x2="610" y1={232 + i * 62} y2={232 + i * 62} strokeWidth="3" />)}
            {[0, 1, 2].map((i) => <line key={i} x1={437 + i * 87} x2={437 + i * 87} y1="170" y2="420" strokeWidth="3" />)}
          </g>
          {/* yellow beam lines from the eye */}
          <g stroke={C.yellow} strokeWidth="5" opacity={pulse * open} strokeDasharray="14 10">
            <line x1="480" y1="120" x2="350" y2="420" />
            <line x1="480" y1="120" x2="610" y2="420" />
            <line x1="480" y1="120" x2="480" y2="420" />
          </g>
          <rect x="340" y={170 + scan * 250} width="280" height="8" fill={C.yellow} opacity={open} />
          {/* eye */}
          <g transform={`translate(480 100)`}>
            <g transform={`scale(1 ${Math.max(0.06, open)})`}>
              <path d="M-110 0 Q0 -80 110 0 Q0 80 -110 0Z" fill={C.paper} stroke="#0B0B0F" strokeWidth="6" />
              <circle cx={look} r="42" fill={C.orange} stroke="#0B0B0F" strokeWidth="5" />
              <circle cx={look} r="20" fill="#0B0B0F" />
              <circle cx={look - 11} cy="-13" r="7" fill="#fff" />
            </g>
          </g>
        </svg>
      </Paper>
      <Label y={575} at={from + 0.05} to={to} size={72}>Project Manager</Label>
      <Label y={672} at={from + 1.0} to={to} bg={C.yellow} color="#0B0B0F" size={64} rot={-1}>= Your Eyes on Site</Label>
    </>
  );
};

/* ------------------------------------------------------------------- scene 7 */
const CURSOR = "M0 0 L0 34 L9 26 L16 42 L24 38 L17 23 L30 23 Z";
export const SceneCTA: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const typeStart = 25.1;
  const typed = Math.max(0, Math.min(6, Math.floor((t - typeStart) / 0.1) + 1));
  const text = "MANAGE".slice(0, typed);
  const posted = t >= 26.0;
  // cursor path: enters, clicks the field, then moves to Post
  const cx = interpolate(t, [23.4, 24.6, 25.9, 26.1], [980, 520, 520, 890], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  const cy = interpolate(t, [23.4, 24.6, 25.9, 26.1], [480, 330, 330, 330], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  const click = Math.abs(t - 24.65) < 0.06 || Math.abs(t - 26.12) < 0.06;
  const badge = usePop(26.7, 8, 240);
  return (
    <>
      <Paper x={70} y={110} w={940} h={420} rot={-1} at={23.2} to={to} bg="#FFFFFF" seed={17} dir="t" float={false}>
        <div style={{padding: "26px 34px", fontFamily: FONT}}>
          <div style={{fontWeight: 800, fontSize: 34, color: "#111"}}>Comments</div>
          <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 24}}>
            <div style={{width: 74, height: 74, borderRadius: "50%", background: C.orange}} />
            <div style={{flex: 1, height: 74, borderRadius: 40, border: `4px solid ${typed > 0 || t > 24.6 ? C.orange : "#C9CED8"}`, display: "flex", alignItems: "center", padding: "0 28px", fontWeight: 800, fontSize: 40, color: "#111"}}>
              {text || (t < 24.6 ? <span style={{color: "#9AA3B5", fontWeight: 600}}>Add a comment…</span> : null)}
              {!posted && t > 24.6 ? <span style={{display: "inline-block", width: 4, height: 44, background: "#111", marginLeft: 4, opacity: Math.floor(t * 2.5) % 2 ? 0 : 1}} /> : null}
            </div>
            <div style={{padding: "16px 30px", borderRadius: 40, background: typed ? C.orange : "#C9CED8", color: "#fff", fontWeight: 800, fontSize: 34, transform: click && t > 26 ? "scale(.92)" : "none"}}>Post</div>
          </div>
          {posted ? (
            <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 34, opacity: clamp01((t - 26.0) / 0.2), transform: `translateY(${(1 - clamp01((t - 26.0) / 0.2)) * 20}px)`}}>
              <div style={{width: 74, height: 74, borderRadius: "50%", background: C.orange}} />
              <div style={{fontSize: 44, fontWeight: 800, color: "#111"}}>MANAGE <span style={{fontSize: 28, color: "#9AA3B5", fontWeight: 600}}>· just now</span></div>
            </div>
          ) : null}
        </div>
        <svg width="940" height="420" style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
          <g transform={`translate(${cx - 70} ${cy - 110}) scale(${click ? 0.85 : 1})`}><path d={CURSOR} fill="#111" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /></g>
        </svg>
      </Paper>
      <Label y={575} at={24.4} to={to} size={72}>
        Comment <span style={{color: C.yellow}}>'MANAGE'</span>
        <span style={{display: "inline-block", width: 8, height: "0.8em", background: C.yellow, marginLeft: 12, verticalAlign: "-0.08em", opacity: Math.floor(t * 2) % 2 ? 0 : 1}} />
      </Label>
      <Label y={675} at={26.3} to={to} bg={C.yellow} color="#0B0B0F" size={64} rot={-1}>Check your DM</Label>
      {t > 26.7 ? (
        <div style={{position: "absolute", left: 850, top: 790, transform: `scale(${badge * 0.85})`}}>
          <div style={{width: 170, height: 170, borderRadius: 46, background: C.orange, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 30px rgba(0,0,0,.45)"}}>
            <svg width="96" height="96" viewBox="0 0 100 100"><path d="M92 10 L8 44 L40 56 L52 90 Z" fill="#fff" /><path d="M92 10 L40 56" stroke={C.orange} strokeWidth="5" strokeLinecap="round" /></svg>
          </div>
          <div style={{position: "absolute", right: -14, top: -14, width: 56, height: 56, borderRadius: "50%", background: "#D6362B", border: "5px solid #fff", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 32, textAlign: "center", lineHeight: "46px"}}>1</div>
        </div>
      ) : null}
    </>
  );
};

