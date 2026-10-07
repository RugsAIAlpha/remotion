import React from "react";
import {random, useCurrentFrame} from "remotion";
import {Label} from "../collage";
import {C, FPS} from "../theme";
import {clamp01, usePop} from "../util";
import {AlarmClock, Coin, CrumpledPaper, Laptop, Lightbulb, LoopArrows, Phone, RBox, Text3D} from "./objects";
import {Person} from "./Person";
import {Stage} from "./Stage";
import {makeTex} from "./tex";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const LABEL_Y = 985;
const useLocal = (from: number) => Math.max(0, useCurrentFrame() / FPS - from);
const CASUAL = {shirt: "#e9ecf2", pants: "#23262e", shoes: "#14110f", prop: "none" as const, hair: "#120d09"};

/** Chat-window texture. mode: "typing" grows the prompt bubble, "wrong" shows a bad answer with a red cross. */
const chatTex = (progress: number, mode: "typing" | "wrong", t: number) =>
  makeTex(1024, 640, (c, w, h) => {
    c.fillStyle = "#0f1420";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#1a2133";
    c.fillRect(0, 0, w, 64);
    c.fillStyle = "#F26A1B";
    c.beginPath(); c.arc(40, 32, 14, 0, 7); c.fill();
    c.fillStyle = "#cfd6e6";
    c.font = "700 28px Inter, Arial";
    c.fillText("AI Assistant", 70, 42);
    // user prompt bubble
    c.fillStyle = "#2b3550";
    c.beginPath();
    (c as CanvasRenderingContext2D & {roundRect: (...a: number[]) => void}).roundRect(w - 640, 100, 600, 130, 26);
    c.fill();
    c.fillStyle = "#9fb0d6";
    for (let i = 0; i < 3; i++) {
      const wd = Math.max(0, Math.min(1, progress * 3 - i)) * (i === 2 ? 300 : 520);
      c.fillRect(w - 610, 130 + i * 30, wd, 14);
    }
    if (mode === "typing" && Math.floor(t * 3) % 2 === 0) { c.fillStyle = "#fff"; c.fillRect(w - 610 + Math.min(520, progress * 1560 % 520) + 6, 124 + Math.min(2, Math.floor(progress * 3)) * 30, 4, 26); }
    if (mode === "wrong") {
      c.fillStyle = "#1f2840";
      c.beginPath();
      (c as CanvasRenderingContext2D & {roundRect: (...a: number[]) => void}).roundRect(40, 270, 620, 220, 26);
      c.fill();
      c.fillStyle = "#6c7a9c";
      for (let i = 0; i < 4; i++) c.fillRect(70, 305 + i * 38, 520 - (i % 2) * 140, 14);
      const k = clamp01(t / 0.25);
      c.save();
      c.translate(820, 380);
      c.scale(0.4 + 0.6 * k, 0.4 + 0.6 * k);
      c.fillStyle = "#D6362B";
      c.beginPath(); c.arc(0, 0, 90, 0, 7); c.fill();
      c.strokeStyle = "#fff"; c.lineWidth = 22; c.lineCap = "round";
      c.beginPath(); c.moveTo(-36, -36); c.lineTo(36, 36); c.moveTo(36, -36); c.lineTo(-36, 36); c.stroke();
      c.restore();
    }
  });

/* ---------- the hard way: stressed at the laptop, crumpled attempts piling up */
export const SceneHardWay: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 13, 110);
  const papers = Array.from({length: 9}, (_, i) => {
    const t0 = 0.3 + i * 0.22;
    const fall = clamp01((t - t0) / 0.35);
    const x = 0.25 + (random(`px${i}`) - 0.3) * 0.9;
    return {i, on: t >= t0, x, y: lerp(0.9, -0.66, fall * fall), z: 0.5 + random(`pz${i}`) * 0.5};
  });
  return (
    <>
      <Stage s={1.12}>
        <Person look={CASUAL} pose={{t, look: 0.2, nod: 0.12, armL: [1.2, 0.55, 2.3], armR: [1.2, 0.55, 2.3]}} position={[lerp(-2, -0.55, inA), -0.75, -0.1]} scale={0.98} />
        <RBox size={[0.7, 0.34, 0.42]} r={0.02} position={[-0.55, -0.58, 0.55]}><meshStandardMaterial color="#8a6a45" roughness={0.6} /></RBox>
        <group position={[-0.55, -0.4, 0.55]} scale={0.46}><Laptop /></group>
        {papers.filter((p) => p.on).map((p) => (
          <group key={p.i} position={[p.x + 0.35, p.y, p.z]} rotation={[p.i, p.i * 2, 0]}><CrumpledPaper seed={p.i + 1} /></group>
        ))}
      </Stage>
      <Label y={LABEL_Y} at={from + 0.2} to={to} size={72}>The hard way</Label>
    </>
  );
};

/* ---------- typing a prompt / wrong output */
export const SceneChat: React.FC<{from: number; to: number; mode: "typing" | "wrong"; label: string; color?: string}> = ({from, to, mode, label, color}) => {
  const t = useLocal(from);
  const inA = usePop(from, 13, 110);
  const screen = chatTex(clamp01((t - 0.3) / 1.6), mode, t);
  const shake = mode === "wrong" && t > 0.25 && t < 0.7 ? Math.sin(t * 70) * 0.03 : 0;
  return (
    <>
      <Stage>
        <group position={[shake, lerp(-1.6, -0.3, inA), 0.2]} rotation={[0.12, Math.sin(t * 0.8) * 0.12 - 0.08, 0]} scale={1.85}>
          <Laptop screen={screen} />
        </group>
      </Stage>
      <Label y={LABEL_Y} at={from + 0.25} to={to} bg={color ?? "#0B0B0F"} size={76} rot={color ? -1 : 0}>{label}</Label>
    </>
  );
};

/* ---------- again and again */
export const SceneLoop: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const p = usePop(from, 10, 150);
  const papers = Array.from({length: 12}, (_, i) => {
    const t0 = 0.2 + i * 0.13;
    return {i, on: t >= t0, x: (random(`lx${i}`) - 0.5) * 2.0, y: 1.6 - (t - t0) * 2.2, z: random(`lz${i}`) * 0.6};
  });
  return (
    <>
      <Stage s={1.15}>
        <group position={[0, 0.25, 0.2]} scale={p * 1.35} rotation={[0, Math.sin(t * 1.5) * 0.3, -t * 3]}><LoopArrows /></group>
        {papers.filter((q) => q.on && q.y > -0.7).map((q) => (
          <group key={q.i} position={[q.x, q.y, q.z]} rotation={[q.i + t * 2, q.i * 2, t]}><CrumpledPaper seed={q.i + 3} /></group>
        ))}
      </Stage>
      <Label y={LABEL_Y} at={from + 0.15} to={to} size={80}>Again &amp; again</Label>
    </>
  );
};

/* ---------- thirty minutes passed */
export const SceneThirty: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 12, 130);
  const inB = usePop(from + 0.35, 9, 200);
  return (
    <>
      <Stage s={0.95}>
        <group position={[-0.5, lerp(-1.5, 0.1, inA), 0.3]} scale={0.95}><AlarmClock t={t * 2.4} /></group>
        <group position={[0.7, 0.35, 0]} scale={inB * 0.9} rotation={[0, Math.sin(t * 2) * 0.35, 0]}>
          <Text3D text="30" size={0.9} />
          <group position={[0, -0.85, 0]}><Text3D text="MIN" size={0.5} color="#F26A1B" /></group>
        </group>
      </Stage>
      <Label y={LABEL_Y} at={from + 0.25} to={to} bg="#D6362B" size={76} rot={-1}>30 minutes gone</Label>
    </>
  );
};

/* ---------- others generating apps */
export const SceneApps: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 12, 130);
  const n = Math.min(12, Math.floor(t * 4.5));
  const screen = makeTex(512, 1024, (c, w, h) => {
    c.fillStyle = "#0f1420";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#cfd6e6";
    c.font = "800 36px Inter, Arial";
    c.fillText("Generating…", 40, 90);
    c.fillStyle = "#2b3550";
    c.fillRect(40, 120, w - 80, 16);
    c.fillStyle = "#F26A1B";
    c.fillRect(40, 120, (w - 80) * clamp01(t / 2.4), 16);
    const cols = ["#F26A1B", "#FFD23F", "#2FA866", "#6C8CFF", "#D6362B", "#b36cff"];
    for (let i = 0; i < 12; i++) {
      if (i >= n) break;
      const x = 50 + (i % 3) * 150, y = 200 + Math.floor(i / 3) * 170;
      c.fillStyle = cols[i % cols.length];
      c.beginPath();
      (c as CanvasRenderingContext2D & {roundRect: (...a: number[]) => void}).roundRect(x, y, 120, 120, 30);
      c.fill();
    }
  });
  return (
    <>
      <Stage s={1.1}>
        <group position={[-0.35, lerp(-1.7, 0.1, inA), 0]} rotation={[0.04, 0.3 + Math.sin(t) * 0.12, 0]} scale={1.05}><Phone screen={screen} /></group>
        {Array.from({length: 4}, (_, i) => {
          const a = t * 1.6 + (i * Math.PI) / 2;
          return (
            <mesh key={i} position={[0.85 + Math.cos(a) * 0.35, 0.2 + Math.sin(a * 0.8) * 0.5, Math.sin(a) * 0.4]} rotation={[a, a, 0]} castShadow>
              <boxGeometry args={[0.24, 0.24, 0.24]} />
              <meshPhysicalMaterial color={["#F26A1B", "#FFD23F", "#2FA866", "#6C8CFF"][i]} roughness={0.3} clearcoat={1} />
            </mesh>
          );
        })}
      </Stage>
      <Label y={LABEL_Y} at={from + 0.2} to={to} size={66}>Others are generating</Label>
    </>
  );
};

/* ---------- business ideas */
export const SceneIdeas: React.FC<{from: number; to: number}> = ({from, to}) => {
  const t = useLocal(from);
  const inA = usePop(from, 10, 150);
  const glow = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <>
      <Stage s={1.0}>
        <group position={[0, 0.25, 0]} scale={inA * 1.9} rotation={[0, Math.sin(t * 1.3) * 0.4, 0]}><Lightbulb glow={glow} /></group>
        {Array.from({length: 7}, (_, i) => {
          const k = (t * 0.6 + i / 7) % 1;
          return (
            <group key={i} position={[(random(`cx${i}`) - 0.5) * 2.0, -0.7 + k * 2.2, random(`cz${i}`) * 0.6]} rotation={[0, t * 3 + i, 0]} scale={1.1}><Coin /></group>
          );
        })}
      </Stage>
      <Label y={LABEL_Y} at={from + 0.1} to={to} bg={C.yellow} color="#0B0B0F" size={66} rot={-1}>Apps &amp; business ideas</Label>
    </>
  );
};
