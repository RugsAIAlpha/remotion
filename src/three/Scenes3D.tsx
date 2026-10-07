import React from "react";
import * as THREE from "three";
import {interpolate, random, useCurrentFrame} from "remotion";
import {Label, Reticle} from "../collage";
import {C, FONT, FPS, s2f} from "../theme";
import {clamp01, ease, usePop} from "../util";
import {AlarmClock, Banknote, Blueprint, Briefcase, Diorama, Eyeball, Hardhat, Hourglass, Laptop, Magnifier, Phone, RBox, Stamp, StampInk, Text3D} from "./objects";
import {OFFICE, Person, SITE} from "./Person";
import {Stage} from "./Stage";
import {makeTex} from "./tex";

type V3 = [number, number, number];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const LABEL_Y = 985;

/** local time in seconds since `from` */
const useLocal = (from: number) => {
  const f = useCurrentFrame();
  return Math.max(0, f / FPS - from);
};

/* -------------------------------------------------------------- 1. job vs site */
export const SceneJob: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inL = usePop(from, 13, 110);
  const inR = usePop(from + 0.15, 13, 110);
  const vs = usePop(from + 0.9, 9, 220);
  const frame = useCurrentFrame();
  const showVs = frame >= s2f(from + 0.9) && frame < s2f(to) - 6;
  return (
    <>
      <Stage>
        {/* left: office worker, desk + laptop */}
        <group position={[lerp(-2.2, 0, inL), 0, 0]}>
          <Person look={OFFICE} pose={{t, look: 0.25, nod: 0.05, armL: [0.2 + Math.sin(t * 2) * 0.05, 0.55, 1.0], armR: [0.05, 0.12, 0.1]}} position={[-0.62, -0.75, -0.1]} scale={0.95} />
          <RBox size={[0.62, 0.34, 0.4]} r={0.02} position={[-0.38, -0.58, 0.55]}>
            <meshStandardMaterial color="#8a6a45" roughness={0.6} />
          </RBox>
          <group position={[-0.38, -0.4, 0.55]} scale={0.42}><Laptop /></group>
        </group>
        {/* right: site engineer, cones + hardhat on bricks */}
        <group position={[lerp(2.2, 0, inR), 0, 0]}>
          <Person look={SITE} pose={{t, look: -0.25, armL: [0.9 + Math.sin(t * 2) * 0.04, 0.12, 1.25], armR: [0.35, 0.5, 0.35]}} position={[0.62, -0.75, -0.1]} scale={0.95} />
          <mesh position={[0.28, -0.52, 0.6]} castShadow>
            <coneGeometry args={[0.1, 0.4, 24]} />
            <meshStandardMaterial color="#ff6a1a" roughness={0.5} />
          </mesh>
          <mesh position={[0.28, -0.73, 0.6]} castShadow><boxGeometry args={[0.26, 0.04, 0.26]} /><meshStandardMaterial color="#222" /></mesh>
          <group position={[0.28, -0.65, 0.6]}><mesh position={[0, -0.0, 0]}><cylinderGeometry args={[0.062, 0.095, 0.09, 24]} /><meshStandardMaterial color="#f4f4f4" roughness={0.5} /></mesh></group>
          <group position={[0.92, -0.45, 0.6]} scale={0.22} rotation={[0, -0.5, 0]}><Hardhat /></group>
          <RBox size={[0.34, 0.18, 0.2]} r={0.01} position={[0.92, -0.66, 0.6]}><meshStandardMaterial color="#a8523a" roughness={0.9} /></RBox>
        </group>
      </Stage>
      {showVs ? <div style={{position: "absolute", left: 540 - 55, top: 330 - 55, width: 110, height: 110, borderRadius: "50%", background: C.yellow, border: "6px solid #0B0B0F", fontFamily: "Anton, Impact, sans-serif", fontSize: 56, textAlign: "center", lineHeight: "98px", transform: `scale(${vs})`}}>VS</div> : null}
      <Label y={LABEL_Y} at={from + 0.3} to={to}>Job ya Business?</Label>
      <Label y={LABEL_Y + 100} at={from + 1.0} to={to} bg={C.yellow} color="#0B0B0F" size={56} rot={-1.5}>Construction Project</Label>
    </>
  );
};

/* -------------------------------------------------------------- 2. error stamp */
export const SceneError: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const enter = usePop(from, 13, 110);
  const mx = Math.sin(t * 1.9) * 0.55;
  const my = 0.05 + Math.cos(t * 2.3) * 0.2;
  const tint = clamp01((t - 0.7) / 0.9) * 0.85;
  const slamT = 1.0;
  const lift = ease(clamp01((t - (slamT + 0.3)) / 0.35));
  const ink = t >= slamT + 0.04 ? 0.92 : 0;
  const flash = t >= slamT && t < slamT + 0.25 ? 2.5 : 0;
  return (
    <>
      <Stage>
        <group position={[0, lerp(1.6, 0.2, enter), 0]} rotation={[-0.1, 0.08 + Math.sin(t) * 0.03, 0.02]} scale={1.15}>
          <Blueprint tint={tint} />
          <group position={[mx, my, 0.12]} rotation={[0, 0, -0.15]}><Magnifier /></group>
          {/* stamp slams onto the sheet */}
          <group position={[0.05, -0.05, 0]} rotation={[0, 0, -0.2]}>
            <group scale={1.2} position={[0, lift * 1.2, lift * 0.6]}><Stamp slam={t < slamT ? Math.max(0, (t - (slamT - 0.35)) / 0.35) ** 2 : 1} /></group>
            <group position={[0, 0, 0.01]} scale={1.3}><StampInk opacity={ink} /></group>
          </group>
          <pointLight position={[0, 0, 1.5]} intensity={flash} color="#ff3b2f" distance={6} />
        </group>
      </Stage>
      <Label y={LABEL_Y} at={from + 1.05} to={to} bg={C.yellow} color="#D6362B" size={78} rot={-1}>Expensive Mistakes</Label>
    </>
  );
};

/* -------------------------------------------------------------- 3. time vs site */
export const SceneTime: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 13, 110);
  const inB = usePop(from + 0.15, 13, 110);
  const dashes: V3[] = Array.from({length: 14}, (_, i) => {
    const u = ((i / 14 + t * 0.35) % 1);
    const x = lerp(-0.05, 0.4, u);
    const y = 0.35 + Math.sin(u * Math.PI) * 0.45;
    return [x, y, 0.4];
  });
  return (
    <>
      <Stage>
        <group position={[-0.58, lerp(-1.6, 0.05, inA), 0.3]} scale={1.0}><AlarmClock t={t} /></group>
        <group position={[lerp(1.8, 0.58, inB), -0.62, 0]} rotation={[0.08, -0.55 + Math.sin(t * 0.7) * 0.12, 0]} scale={1.05}><Diorama t={t} /></group>
        {dashes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color="#FFD23F" emissive="#FFD23F" emissiveIntensity={1.2} />
          </mesh>
        ))}
      </Stage>
      <Label y={LABEL_Y} at={from + 0.3} to={to} size={64}>Utna samay</Label>
      <Label y={LABEL_Y + 100} at={from + 1.5} to={to} bg="#D6362B" size={74} rot={-1}>Nahi de paate</Label>
    </>
  );
};

/* -------------------------------------------------------------- 4. 3X cost */
export const SceneCost: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const p = usePop(from, 9, 200);
  const notes = Array.from({length: 18}, (_, i) => {
    const x = (random(`nx${i}`) - 0.5) * 2.2;
    const t0 = 0.35 + random(`nt${i}`) * 1.0;
    const y = 1.6 - (t - t0) * (1.4 + random(`ns${i}`) * 0.9);
    const rx = random(`nrx${i}`) * 6 + (t - t0) * (2 + random(`nw${i}`) * 3);
    const rz = random(`nrz${i}`) * 6 + (t - t0) * 1.5;
    return {i, x, y, rx, rz, on: t >= t0 && y > -1.3, z: random(`nz${i}`) * 0.8};
  });
  return (
    <>
      <Stage>
        <group position={[0, 0.3, 0]} scale={p * 1.0} rotation={[0, Math.sin(t * 2.4) * 0.45, Math.sin(t * 1.7) * 0.05]}>
          <Text3D text="3X" size={1.25} />
        </group>
        {notes.filter((n) => n.on).map((n) => (
          <group key={n.i} position={[n.x, n.y, n.z]} rotation={[n.rx, 0.3, n.rz]}><Banknote /></group>
        ))}
      </Stage>
      <Reticle x={90} y={LABEL_Y - 8} w={900} h={104} at={from + 0.8} to={to} />
      <Label y={LABEL_Y} at={from + 0.8} to={to} bg="#D6362B" size={72}>Cost 3X ho jaata hai!</Label>
    </>
  );
};

/* -------------------------------------------------------------- 5. not skill, no time */
export const SceneNoTime: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 13, 110);
  const inB = usePop(from + 0.1, 13, 110);
  const hazard = React.useMemo(
    () =>
      makeTex(512, 640, (c, w, h) => {
        c.fillStyle = "#F3EBDD";
        c.fillRect(0, 0, w, h);
        c.save();
        c.beginPath();
        c.rect(0, 0, w, h);
        c.rect(26, 26, w - 52, h - 52);
        c.clip("evenodd");
        c.fillStyle = "#FFD23F";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#111";
        for (let x = -h; x < w + h; x += 64) {
          c.beginPath();
          c.moveTo(x, 0); c.lineTo(x + 32, 0); c.lineTo(x + 32 + h, h); c.lineTo(x + h, h);
          c.closePath();
          c.fill();
        }
        c.restore();
        c.fillStyle = "#D6362B";
        c.beginPath(); c.moveTo(w / 2, 70); c.lineTo(w / 2 + 70, 190); c.lineTo(w / 2 - 70, 190); c.closePath(); c.fill();
        c.fillStyle = "#fff"; c.fillRect(w / 2 - 6, 105, 12, 45); c.beginPath(); c.arc(w / 2, 168, 7, 0, 7); c.fill();
      }),
    [],
  );
  const k = clamp01((t % 3) / 3);
  return (
    <>
      <Stage>
        <Person look={{...OFFICE, prop: "watch"}} pose={{t, look: 0.35, nod: 0.18, armL: [1.55, 0.05, 2.1], armR: [0.35, 0.35, 1.1]}} position={[lerp(-2, -0.6, inA), -0.75, 0]} scale={0.9} />
        <group position={[lerp(2, 0.65, inB), 0.05, 0]}>
          <mesh position={[0, 0.0, -0.4]} rotation={[0, -0.25, 0.04]} castShadow>
            <boxGeometry args={[1.0, 1.25, 0.04]} />
            <meshStandardMaterial map={hazard} roughness={0.7} />
          </mesh>
          <group position={[0, -0.18, 0.1]} rotation={[0, Math.sin(t * 0.8) * 0.4, 0]} scale={0.55}><Hourglass k={k} /></group>
        </group>
      </Stage>
      <Label y={LABEL_Y} at={from + 0.1} to={to} size={92}>Not Skill</Label>
      <Label y={LABEL_Y + 110} at={from + 0.7} to={to} bg={C.yellow} color="#0B0B0F" size={92} rot={-1}>Just No Time</Label>
    </>
  );
};

/* -------------------------------------------------------------- 6. eyes on site */
export const SceneEyes: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 13, 110);
  const open = ease(clamp01((t - 0.35) / 0.5));
  const grow = ease(clamp01((t - 0.1) / 1.1));
  const scan = (t * 0.7) % 1;
  const look = Math.sin(t * 1.8) * 0.35;
  const target: V3 = [-0.1, -0.35, 0.2];
  const beam = (tx: number): [V3, number, number] => {
    const from3 = new THREE.Vector3(-0.42, 0.9, 0.3);
    const to3 = new THREE.Vector3(tx, -0.3, 0.3);
    const mid = from3.clone().add(to3).multiplyScalar(0.5);
    const len = from3.distanceTo(to3);
    const ang = Math.atan2(to3.x - from3.x, -(to3.y - from3.y));
    return [[mid.x, mid.y, mid.z], len, ang];
  };
  const beams = [-0.62, -0.42, -0.2].map(beam);
  return (
    <>
      <Stage>
        <group position={[-0.4, lerp(-1.4, 0, inA), 0]}>
          <group position={[0, -0.7, 0]} rotation={[0.05, -0.45, 0]} scale={1.3}>
            <Diorama t={t} grow={grow} />
            {/* scanning plane */}
            <mesh position={[-0.15, 0.1 + scan * 1.0, 0.1]}>
              <boxGeometry args={[0.75, 0.012, 0.6]} />
              <meshBasicMaterial color="#FFD23F" transparent opacity={0.7} toneMapped={false} />
            </mesh>
          </group>
          <group position={[-0.02, 0.95, 0.3]} scale={0.6}><Eyeball open={open} look={look} lookY={0.1} /></group>
          {beams.map(([pos, len, ang], i) => (
            <mesh key={i} position={pos} rotation={[0, 0, ang]}>
              <cylinderGeometry args={[0.012, 0.012, len, 8]} />
              <meshBasicMaterial color="#FFD23F" transparent opacity={(0.35 + 0.35 * Math.sin(t * 9 + i)) * open} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <Person look={SITE} pose={{t, turn: -0.55, look: 0.3, armL: [0.55, 0.15, 0.9], armR: [1.15, 0.5, 0.25]}} position={[lerp(2.2, 0.85, inA), -0.75, 0]} scale={0.85} />
      </Stage>
      <Label y={LABEL_Y} at={from + 0.05} to={to} size={72}>Project Manager</Label>
      <Label y={LABEL_Y + 100} at={from + 1.0} to={to} bg={C.yellow} color="#0B0B0F" size={64} rot={-1}>= Your Eyes on Site</Label>
      {void target}
    </>
  );
};

/* -------------------------------------------------------------- 7. comment MANAGE */
export const SceneCTA: React.FC<{from: number; to: number; word?: string; typeAt?: number; postIn?: number; headline?: string}> = ({from, to, word = "MANAGE", typeAt = 0.7, postIn = 1.55, headline}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const lt = Math.max(0, t - from);
  const enter = usePop(from, 13, 110);
  const typeStart = from + typeAt;
  const typed = Math.max(0, Math.min(word.length, Math.floor((t - typeStart) / 0.1) + 1));
  const text = word.slice(0, typed);
  const postAt = from + postIn;
  const posted = t >= postAt;
  const focusAt = from + typeAt - 0.15;
  const screen = makeTex(512, 1024, (c, w, h) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#111";
    c.font = "800 34px Inter, Arial";
    c.fillText("Comments", 34, 80);
    c.fillStyle = "#e5e5e5";
    c.fillRect(0, 100, w, 2);
    // existing comments
    for (let i = 0; i < 3; i++) {
      c.fillStyle = ["#d9c7a8", "#b8c9d9", "#d9b8c0"][i];
      c.beginPath(); c.arc(60, 190 + i * 100, 28, 0, 7); c.fill();
      c.fillStyle = "#d8d8d8";
      c.fillRect(110, 172 + i * 100, 220 - i * 30, 14);
      c.fillRect(110, 198 + i * 100, 330 - i * 40, 12);
    }
    if (posted) {
      const k = clamp01((t - postAt) / 0.25);
      c.globalAlpha = k;
      c.fillStyle = "#F26A1B";
      c.beginPath(); c.arc(60, 490, 28, 0, 7); c.fill();
      c.fillStyle = "#111";
      c.font = "800 40px Inter, Arial";
      c.fillText(word, 110, 502);
      c.globalAlpha = 1;
    }
    // input bar
    c.fillStyle = "#f2f2f2";
    c.fillRect(0, h - 190, w, 190);
    c.fillStyle = "#F26A1B";
    c.beginPath(); c.arc(54, h - 105, 28, 0, 7); c.fill();
    c.strokeStyle = t >= focusAt && !posted ? "#F26A1B" : "#cfcfcf";
    c.lineWidth = 4;
    c.beginPath();
    (c as CanvasRenderingContext2D & {roundRect: (...a: number[]) => void}).roundRect(100, h - 142, 290, 74, 37);
    c.stroke();
    c.fillStyle = "#111";
    c.font = "800 34px Inter, Arial";
    if (text && !posted) c.fillText(text, 124, h - 92);
    else if (!posted && t < focusAt) { c.fillStyle = "#9aa3b5"; c.font = "600 28px Inter, Arial"; c.fillText("Add a comment…", 124, h - 94); }
    if (!posted && t >= focusAt && Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = "#111"; c.fillRect(124 + c.measureText(text).width + 4, h - 120, 3, 46); }
    c.fillStyle = typed ? "#F26A1B" : "#c9ced8";
    c.beginPath();
    (c as CanvasRenderingContext2D & {roundRect: (...a: number[]) => void}).roundRect(404, h - 140, 90, 70, 35);
    c.fill();
    c.fillStyle = "#fff";
    c.font = "800 26px Inter, Arial";
    c.fillText("Post", 420, h - 95);
  });
  const taps = [focusAt, postAt - 0.05].map((tt) => clamp01((t - tt) / 0.5));
  return (
    <>
      <Stage>
        <group position={[0, lerp(-1.8, 0.12, enter), 0]} rotation={[0.05, Math.sin(lt * 0.9) * 0.22 - 0.12, Math.sin(lt * 0.7) * 0.02]} scale={1.05}>
          <Phone screen={screen} />
          {taps.map((k, i) =>
            k > 0 && k < 1 ? (
              <mesh key={i} position={[i ? 0.28 : -0.02, i ? -0.62 : -0.62, 0.06]}>
                <ringGeometry args={[0.04 + k * 0.16, 0.055 + k * 0.17, 40]} />
                <meshBasicMaterial color="#F26A1B" transparent opacity={1 - k} toneMapped={false} />
              </mesh>
            ) : null,
          )}
        </group>
      </Stage>
      {headline ? <Label y={LABEL_Y - 110} at={from + 0.1} to={to} bg={C.yellow} color="#0B0B0F" size={60} rot={-1}>{headline}</Label> : null}
      <Label y={LABEL_Y} at={from + (headline ? 0.2 : 0.1)} to={to} size={72}>
        Comment <span style={{color: C.yellow}}>'{word}'</span>
        <span style={{display: "inline-block", width: 8, height: "0.8em", background: C.yellow, marginLeft: 12, verticalAlign: "-0.08em", opacity: Math.floor(t * 2) % 2 ? 0 : 1}} />
      </Label>
      {void FONT}
    </>
  );
};
