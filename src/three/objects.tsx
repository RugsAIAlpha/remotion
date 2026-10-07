import React, {useMemo} from "react";
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import boldFont from "three/examples/fonts/helvetiker_bold.typeface.json";
import {makeTex, noiseTex} from "./tex";

type V3 = [number, number, number];

/* ------------------------------------------------------------------ helpers */
export const RBox: React.FC<{size: V3; r?: number; position?: V3; rotation?: V3; children?: React.ReactNode; cast?: boolean}> = ({size, r = 0.02, position, rotation, children, cast = true}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 4, r), [size[0], size[1], size[2], r]);
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow={cast} receiveShadow>
      {children}
    </mesh>
  );
};

const Glass: React.FC<{opacity?: number}> = ({opacity = 0.16}) => (
  <meshPhysicalMaterial color="#dfeeff" transparent opacity={opacity} roughness={0.02} metalness={0} envMapIntensity={2.2} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} />
);

/* ------------------------------------------------------------------ hard hat */
export const Hardhat: React.FC<{color?: string}> = ({color = "#FFB400"}) => {
  const {shell, ribs} = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(0.0001, -0.0), new THREE.Vector2(0.54, 0.0), new THREE.Vector2(0.74, 0.0), new THREE.Vector2(0.75, 0.04), new THREE.Vector2(0.6, 0.06)];
    for (let a = 0; a <= 90; a += 5) {
      const rad = (a * Math.PI) / 180;
      pts.push(new THREE.Vector2(Math.max(0.0001, 0.58 * Math.cos(rad)), 0.06 + 0.5 * Math.pow(Math.sin(rad), 0.85)));
    }
    const shell = new THREE.LatheGeometry(pts, 72);
    const ribs = [-0.2, 0, 0.2].map((x0) => {
      const curve = new THREE.CatmullRomCurve3(
        Array.from({length: 25}, (_, i) => {
          const z = -0.54 + (i / 24) * 1.08;
          const q = Math.max(0, 1 - (x0 * x0 + z * z) / (0.58 * 0.58));
          return new THREE.Vector3(x0, 0.06 + 0.5 * Math.pow(q, 0.5 / 0.85 * 0.9) + 0.012, z);
        }),
      );
      return new THREE.TubeGeometry(curve, 48, 0.034, 8, false);
    });
    return {shell, ribs};
  }, []);
  return (
    <group>
      <mesh geometry={shell} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0} clearcoat={1} clearcoatRoughness={0.12} side={THREE.DoubleSide} />
      </mesh>
      {ribs.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.54, 48]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ laptop */
export const Laptop: React.FC<{open?: number; screen?: THREE.Texture}> = ({open = 1, screen}) => {
  const dashTex = useMemo(
    () =>
      makeTex(1024, 640, (c, w, h) => {
        c.fillStyle = "#0f1b2e";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#16263f";
        c.fillRect(0, 0, w, 56);
        ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
          c.fillStyle = col;
          c.beginPath();
          c.arc(36 + i * 34, 28, 11, 0, 7);
          c.fill();
        });
        c.strokeStyle = "rgba(255,255,255,.08)";
        for (let i = 1; i < 6; i++) {
          c.beginPath();
          c.moveTo(60, 100 + i * 80);
          c.lineTo(w - 60, 100 + i * 80);
          c.stroke();
        }
        c.strokeStyle = "#FFC20E";
        c.lineWidth = 9;
        c.beginPath();
        [[80, 500], [220, 420], [350, 460], [500, 300], [650, 340], [800, 190], [930, 230]].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.stroke();
        c.fillStyle = "#F26A1B";
        [[120, 330, 70], [250, 270, 130], [380, 230, 170]].forEach(([x, y, hh]) => c.fillRect(x, 560 - hh, 60, hh));
      }),
    [],
  );
  const keyGeo = useMemo(() => new RoundedBoxGeometry(0.055, 0.012, 0.055, 2, 0.006), []);
  const keys = useMemo(() => {
    const out: V3[] = [];
    for (let r = 0; r < 5; r++) for (let k = 0; k < 13; k++) out.push([-0.43 + k * 0.072, 0.03, -0.1 + r * 0.068]);
    return out;
  }, []);
  const hinge = -0.31;
  return (
    <group>
      <RBox size={[1.05, 0.04, 0.72]} r={0.02} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#c9ccd1" metalness={0.95} roughness={0.28} />
      </RBox>
      {keys.map((p, i) => (
        <mesh key={i} geometry={keyGeo} position={p} castShadow>
          <meshStandardMaterial color="#1b1d22" roughness={0.6} />
        </mesh>
      ))}
      <RBox size={[0.3, 0.006, 0.18]} r={0.003} position={[0, 0.043, 0.25]}>
        <meshStandardMaterial color="#b4b8be" metalness={0.9} roughness={0.35} />
      </RBox>
      <group position={[0, 0.04, hinge]} rotation={[-(Math.PI / 2 + 0.18) * open, 0, 0]}>
        <RBox size={[1.05, 0.03, 0.7]} r={0.015} position={[0, 0.015, 0.35]}>
          <meshStandardMaterial color="#c9ccd1" metalness={0.95} roughness={0.28} />
        </RBox>
        <mesh position={[0, -0.002, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.98, 0.62]} />
          <meshStandardMaterial map={screen ?? dashTex} emissiveMap={screen ?? dashTex} emissive="#ffffff" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ briefcase */
export const Briefcase: React.FC = () => {
  const bump = useMemo(() => {
    const t = noiseTex(256, 7, 120);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 2);
    return t;
  }, []);
  const handle = useMemo(() => new THREE.TorusGeometry(0.16, 0.022, 12, 32, Math.PI), []);
  return (
    <group>
      <RBox size={[0.9, 0.62, 0.24]} r={0.05} position={[0, 0.31, 0]}>
        <meshPhysicalMaterial color="#6a3f1f" roughness={0.55} bumpMap={bump} bumpScale={1.6} clearcoat={0.4} clearcoatRoughness={0.4} />
      </RBox>
      <RBox size={[0.9, 0.012, 0.245]} r={0.004} position={[0, 0.31, 0]}>
        <meshStandardMaterial color="#2a1a0e" roughness={0.7} />
      </RBox>
      <mesh geometry={handle} position={[0, 0.62, 0]} castShadow>
        <meshStandardMaterial color="#1a1209" roughness={0.6} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <RBox key={x} size={[0.09, 0.07, 0.26]} r={0.01} position={[x, 0.47, 0]}>
          <meshStandardMaterial color="#d8c27a" metalness={1} roughness={0.28} />
        </RBox>
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ alarm clock */
export const AlarmClock: React.FC<{t: number}> = ({t}) => {
  const face = useMemo(
    () =>
      makeTex(1024, 1024, (c, w) => {
        c.fillStyle = "#f6f1e6";
        c.beginPath();
        c.arc(w / 2, w / 2, w / 2, 0, 7);
        c.fill();
        c.strokeStyle = "#1a1a1a";
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * Math.PI * 2;
          const big = i % 5 === 0;
          c.lineWidth = big ? 12 : 4;
          c.beginPath();
          c.moveTo(w / 2 + Math.sin(a) * (w / 2 - 40), w / 2 - Math.cos(a) * (w / 2 - 40));
          c.lineTo(w / 2 + Math.sin(a) * (w / 2 - (big ? 100 : 70)), w / 2 - Math.cos(a) * (w / 2 - (big ? 100 : 70)));
          c.stroke();
        }
        c.fillStyle = "#1a1a1a";
        c.font = "bold 110px Inter, Arial";
        c.textAlign = "center";
        c.textBaseline = "middle";
        for (let n = 1; n <= 12; n++) {
          const a = (n / 12) * Math.PI * 2;
          c.fillText(String(n), w / 2 + Math.sin(a) * 335, w / 2 - Math.cos(a) * 335);
        }
      }),
    [],
  );
  const bell = useMemo(() => new THREE.SphereGeometry(0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const metal = <meshStandardMaterial color="#cfd3da" metalness={1} roughness={0.22} />;
  return (
    <group rotation={[0, Math.sin(t * 1.4) * 0.32 - 0.12, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.3, 64]} />
          <meshPhysicalMaterial color="#F26A1B" metalness={0.5} roughness={0.28} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.035, 16, 64]} />
          {metal}
        </mesh>
        <mesh position={[0, 0.145, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.02, 64]} />
          <meshStandardMaterial color="#f6f1e6" roughness={0.6} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.158]}>
        <circleGeometry args={[0.55, 64]} />
        <meshStandardMaterial map={face} roughness={0.55} />
      </mesh>
      {/* hands */}
      <group position={[0, 0, 0.17]}>
        <group rotation={[0, 0, -t * 0.7]}>
          <RBox size={[0.045, 0.28, 0.01]} r={0.005} position={[0, 0.12, 0]}><meshStandardMaterial color="#111" roughness={0.4} /></RBox>
        </group>
        <group rotation={[0, 0, -t * 8.4]}>
          <RBox size={[0.03, 0.42, 0.01]} r={0.004} position={[0, 0.17, 0.012]}><meshStandardMaterial color="#111" roughness={0.4} /></RBox>
        </group>
        <group rotation={[0, 0, -t * 25]}>
          <RBox size={[0.012, 0.5, 0.008]} r={0.003} position={[0, 0.18, 0.024]}><meshStandardMaterial color="#d6362b" roughness={0.4} /></RBox>
        </group>
        <mesh position={[0, 0, 0.03]}><sphereGeometry args={[0.035, 16, 16]} /><meshStandardMaterial color="#d6362b" metalness={0.4} roughness={0.3} /></mesh>
      </group>
      {/* glass */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.01, 64]} />
        <Glass opacity={0.14} />
      </mesh>
      {/* bells + hammer */}
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={bell} position={[s * 0.38, 0.55, 0]} rotation={[0, 0, -s * 0.5]} castShadow>
          {metal}
        </mesh>
      ))}
      <mesh position={[0, 0.74, 0]} rotation={[0, 0, Math.sin(t * 40) * 0.25]}>
        <cylinderGeometry args={[0.012, 0.012, 0.26, 8]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.88, 0]}><sphereGeometry args={[0.045, 16, 16]} />{metal}</mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.34, -0.62, 0]} rotation={[0, 0, s * 0.45]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 0.2, 12]} />
          {metal}
        </mesh>
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ magnifier */
export const Magnifier: React.FC = () => (
  <group>
    <mesh castShadow>
      <torusGeometry args={[0.36, 0.04, 20, 64]} />
      <meshStandardMaterial color="#e0b24a" metalness={1} roughness={0.28} />
    </mesh>
    <mesh>
      <circleGeometry args={[0.36, 64]} />
      <Glass opacity={0.2} />
    </mesh>
    <mesh position={[0.3, -0.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
      <capsuleGeometry args={[0.04, 0.38, 8, 16]} />
      <meshStandardMaterial color="#2b1a10" roughness={0.45} />
    </mesh>
    <mesh position={[0.2, -0.23, 0]} rotation={[0, 0, Math.PI / 4]}>
      <cylinderGeometry args={[0.052, 0.052, 0.06, 16]} />
      <meshStandardMaterial color="#e0b24a" metalness={1} roughness={0.28} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ blueprint sheet */
export const Blueprint: React.FC<{tint?: number}> = ({tint = 0}) => {
  const make = (red: boolean) =>
    makeTex(1024, 768, (c, w, h) => {
      c.fillStyle = red ? "#5a1d1b" : "#262a33";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(255,255,255,.14)";
      c.lineWidth = 2;
      for (let x = 0; x < w; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
      for (let y = 0; y < h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      c.strokeStyle = "#f4f1ea";
      c.lineWidth = 5;
      c.lineJoin = "round";
      c.beginPath();
      c.moveTo(240, 400); c.lineTo(512, 190); c.lineTo(784, 400); c.closePath(); c.stroke();
      c.strokeRect(290, 400, 444, 240);
      c.strokeRect(330, 470, 110, 170);
      c.strokeRect(520, 470, 160, 100);
      c.lineWidth = 3;
      c.beginPath(); c.moveTo(600, 470); c.lineTo(600, 570); c.moveTo(520, 520); c.lineTo(680, 520); c.stroke();
      c.setLineDash([14, 10]);
      c.beginPath(); c.moveTo(240, 690); c.lineTo(784, 690); c.stroke();
      c.setLineDash([]);
      c.fillStyle = "#f4f1ea";
      c.font = "600 30px Inter, Arial";
      c.fillText("SITE PLAN  1:100", 50, 70);
      c.fillText("REV. 03", 830, 730);
    });
  const base = useMemo(() => make(false), []);
  const red = useMemo(() => make(true), []);
  return (
    <group>
      <RBox size={[2.05, 1.54, 0.03]} r={0.012} position={[0, 0, -0.016]}>
        <meshStandardMaterial color="#d9d4c7" roughness={0.9} />
      </RBox>
      <mesh>
        <planeGeometry args={[2.0, 1.5]} />
        <meshStandardMaterial map={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[2.0, 1.5]} />
        <meshStandardMaterial map={red} roughness={0.85} transparent opacity={tint} />
      </mesh>
    </group>
  );
};

/** Rubber stamp; `slam` 0 = raised, 1 = pressed. */
export const Stamp: React.FC<{slam: number}> = ({slam}) => {
  const knob = useMemo(() => {
    const pts = [[0.001, 0], [0.12, 0], [0.12, 0.03], [0.07, 0.08], [0.07, 0.2], [0.1, 0.26], [0.11, 0.34], [0.08, 0.42], [0.001, 0.44]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 32);
  }, []);
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.4 * (1 - slam) + 0.18 * slam]}>
      <mesh geometry={knob} position={[0, 0.06, 0]} rotation={[0, 0, 0]} castShadow>
        <meshPhysicalMaterial color="#7a4a2b" roughness={0.35} clearcoat={0.6} />
      </mesh>
      <RBox size={[1.0, 0.07, 0.42]} r={0.02} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#1c1c1f" roughness={0.9} />
      </RBox>
    </group>
  );
};

export const StampInk: React.FC<{opacity: number}> = ({opacity}) => {
  const tex = useMemo(
    () =>
      makeTex(1024, 512, (c, w, h) => {
        c.clearRect(0, 0, w, h);
        c.strokeStyle = "#d6362b";
        c.fillStyle = "#d6362b";
        c.lineWidth = 22;
        c.strokeRect(30, 30, w - 60, h - 60);
        c.font = "900 260px Inter, Arial";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("ERROR", w / 2, h / 2 + 10);
        // distress speckle
        let s = 5;
        c.globalCompositeOperation = "destination-out";
        for (let i = 0; i < 1400; i++) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const x = (s / 2 ** 32) * w;
          s = (s * 1664525 + 1013904223) >>> 0;
          const y = (s / 2 ** 32) * h;
          c.globalAlpha = 0.55;
          c.beginPath();
          c.arc(x, y, 1 + ((s >>> 8) % 4), 0, 7);
          c.fill();
        }
      }),
    [],
  );
  return (
    <mesh position={[0, 0, 0.008]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1.0, 0.5]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ construction site diorama */
export const Crane: React.FC<{swing: number; hook: number}> = ({swing, hook}) => {
  const orange = <meshStandardMaterial color="#F2A100" roughness={0.5} metalness={0.3} />;
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const y = i * 0.1;
    bars.push(
      <mesh key={`d${i}`} position={[0, y + 0.05, 0.0]} rotation={[0, 0, i % 2 ? 0.8 : -0.8]} castShadow>
        <boxGeometry args={[0.006, 0.14, 0.006]} />
        {orange}
      </mesh>,
    );
  }
  return (
    <group>
      {[[-0.04, -0.04], [0.04, -0.04], [-0.04, 0.04], [0.04, 0.04]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.45, z]} castShadow>
          <boxGeometry args={[0.012, 0.9, 0.012]} />
          {orange}
        </mesh>
      ))}
      {bars}
      <group position={[0, 0.9, 0]} rotation={[0, swing, 0]}>
        <mesh position={[0, 0.03, 0]} castShadow><boxGeometry args={[0.1, 0.06, 0.1]} /><meshStandardMaterial color="#444" roughness={0.6} /></mesh>
        <mesh position={[0.28, 0.1, 0]} castShadow><boxGeometry args={[0.9, 0.035, 0.05]} />{orange}</mesh>
        <mesh position={[0.28, 0.065, 0]} castShadow><boxGeometry args={[0.9, 0.012, 0.012]} />{orange}</mesh>
        <mesh position={[-0.25, 0.08, 0]} castShadow><boxGeometry args={[0.2, 0.1, 0.09]} /><meshStandardMaterial color="#6b6e75" roughness={0.8} /></mesh>
        <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.012, 0.16, 0.012]} />{orange}</mesh>
        <mesh position={[0.62, 0.065 - hook / 2, 0]}><boxGeometry args={[0.004, hook, 0.004]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0.62, 0.065 - hook, 0]} castShadow><boxGeometry args={[0.06, 0.04, 0.04]} /><meshStandardMaterial color="#d6362b" roughness={0.5} /></mesh>
      </group>
    </group>
  );
};

export const Building: React.FC<{floors?: number; grow?: number}> = ({floors = 5, grow = 1}) => {
  const conc = useMemo(() => {
    const t = noiseTex(128, 3, 60);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);
  const out: React.ReactNode[] = [];
  const visible = Math.max(0, Math.min(floors, grow * floors));
  for (let f = 0; f < floors; f++) {
    const on = Math.max(0, Math.min(1, visible - f));
    if (on <= 0) continue;
    const y = f * 0.24;
    out.push(
      <mesh key={`s${f}`} position={[0, y + 0.012, 0]} scale={[1, on, 1]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.024, 0.46]} />
        <meshStandardMaterial color="#b9b6ae" roughness={0.9} bumpMap={conc} bumpScale={1} />
      </mesh>,
    );
    if (on > 0.7) {
      [[-0.29, -0.2], [0.29, -0.2], [-0.29, 0.2], [0.29, 0.2], [0, -0.2], [0, 0.2]].forEach(([x, z], i) =>
        out.push(
          <mesh key={`c${f}-${i}`} position={[x, y + 0.13, z]} castShadow>
            <boxGeometry args={[0.025, 0.22, 0.025]} />
            <meshStandardMaterial color="#a3a099" roughness={0.9} />
          </mesh>,
        ),
      );
      if (f < floors - 1)
        out.push(
          <mesh key={`g${f}`} position={[0, y + 0.13, 0.2]}>
            <boxGeometry args={[0.58, 0.2, 0.004]} />
            <meshPhysicalMaterial color="#9fc6d8" transparent opacity={0.35} roughness={0.05} metalness={0.2} envMapIntensity={2} />
          </mesh>,
        );
    }
  }
  return <group>{out}</group>;
};

export const Diorama: React.FC<{t: number; grow?: number}> = ({t, grow = 1}) => (
  <group>
    <RBox size={[1.2, 0.07, 0.9]} r={0.02} position={[0, -0.035, 0]}>
      <meshStandardMaterial color="#8a7a5c" roughness={0.95} />
    </RBox>
    <group position={[-0.15, 0, 0.05]}><Building floors={5} grow={grow} /></group>
    <group position={[0.42, 0, -0.2]}><Crane swing={0.2 + Math.sin(t * 0.8) * 0.35} hook={0.35 + Math.sin(t * 1.3) * 0.1} /></group>
    <mesh position={[0.45, 0.07, 0.3]} castShadow><boxGeometry args={[0.18, 0.1, 0.12]} /><meshStandardMaterial color="#c8c3b5" roughness={0.9} /></mesh>
  </group>
);

/* ------------------------------------------------------------------ gold 3D text */
const font = new FontLoader().parse(boldFont as never);
export const Text3D: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 1, color = "#FFC63A"}) => {
  const geo = useMemo(() => {
    const g = new TextGeometry(text, {font, size, height: size * 0.28, curveSegments: 10, bevelEnabled: true, bevelThickness: size * 0.04, bevelSize: size * 0.03, bevelSegments: 5});
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
    return g;
  }, [text, size]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} emissive="#7a5200" emissiveIntensity={0.55} envMapIntensity={2.2} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ banknote */
export const Banknote: React.FC<{bend?: number}> = ({bend = 0.25}) => {
  const tex = useMemo(
    () =>
      makeTex(512, 256, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#8fbf8a");
        g.addColorStop(1, "#5f9a6a");
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#2f6c47";
        c.lineWidth = 6;
        c.strokeRect(14, 14, w - 28, h - 28);
        c.lineWidth = 3;
        c.beginPath(); c.arc(w / 2, h / 2, 70, 0, 7); c.stroke();
        c.beginPath(); c.arc(w / 2, h / 2, 54, 0, 7); c.stroke();
        c.fillStyle = "#2f6c47";
        c.font = "800 84px Inter, Arial";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("₹", w / 2, h / 2 + 4);
        c.font = "700 40px Inter, Arial";
        c.fillText("500", 82, 56);
        c.fillText("500", w - 82, h - 56);
      }),
    [],
  );
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.52, 0.24, 12, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / 0.52) * Math.PI) * bend * 0.2);
    g.computeVertexNormals();
    return g;
  }, [bend]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial map={tex} roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ hourglass */
export const Hourglass: React.FC<{k: number}> = ({k}) => {
  const glassGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const y = -0.62 + u * 1.24;
      const r = 0.1 + 0.34 * Math.pow(Math.abs(u - 0.5) * 2, 1.6);
      pts.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  const brass = <meshStandardMaterial color="#c8962f" metalness={1} roughness={0.32} />;
  const sandTop = Math.max(0.001, 1 - k);
  const sandBot = Math.max(0.001, k);
  return (
    <group>
      <mesh geometry={glassGeo}><Glass opacity={0.2} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[0, s * 0.66, 0]} castShadow><cylinderGeometry args={[0.56, 0.56, 0.08, 48]} />{brass}</mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i / 3) * 6.28) * 0.5, 0, Math.sin((i / 3) * 6.28) * 0.5]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.3, 12]} />
          {brass}
        </mesh>
      ))}
      {/* sand */}
      <mesh position={[0, 0.02 + 0.28 * (1 - sandTop) * 0.5, 0]} scale={[sandTop ** 0.6, sandTop, sandTop ** 0.6]}>
        <coneGeometry args={[0.3, 0.52, 40]} />
        <meshStandardMaterial color="#e3b04b" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.6 + 0.26 * sandBot, 0]} scale={[1, sandBot, 1]}>
        <coneGeometry args={[0.38, 0.52, 40]} />
        <meshStandardMaterial color="#e3b04b" roughness={0.95} />
      </mesh>
      {k < 0.98 ? (
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.8 * (1 - sandBot * 0.4), 8]} />
          <meshStandardMaterial color="#e3b04b" roughness={0.95} />
        </mesh>
      ) : null}
    </group>
  );
};

/* ------------------------------------------------------------------ eyeball with eyelids */
export const Eyeball: React.FC<{open: number; look: number; lookY?: number}> = ({open, look, lookY = 0}) => {
  const iris = useMemo(
    () =>
      makeTex(512, 512, (c, w) => {
        const g = c.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2);
        g.addColorStop(0, "#050505");
        g.addColorStop(0.2, "#1a0d05");
        g.addColorStop(0.32, "#7a4417");
        g.addColorStop(0.7, "#b8741f");
        g.addColorStop(0.9, "#3b200b");
        g.addColorStop(1, "#1a0f06");
        c.fillStyle = g;
        c.fillRect(0, 0, w, w);
        c.strokeStyle = "rgba(255,210,120,.35)";
        c.lineWidth = 2;
        for (let i = 0; i < 90; i++) {
          const a = (i / 90) * Math.PI * 2;
          c.beginPath();
          c.moveTo(w / 2 + Math.cos(a) * 70, w / 2 + Math.sin(a) * 70);
          c.lineTo(w / 2 + Math.cos(a) * 220, w / 2 + Math.sin(a) * 220);
          c.stroke();
        }
      }),
    [],
  );
  const lid = (up: boolean) => (
    <group rotation={[up ? -open * 1.35 : open * 1.25, 0, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.535, 48, 24, 0, Math.PI * 2, up ? 0 : Math.PI / 2 + 0.02, Math.PI / 2 - 0.02]} />
        <meshPhysicalMaterial color="#c68e65" roughness={0.55} sheen={0.5} sheenColor="#ffb08a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
  return (
    <group>
      <group rotation={[lookY, look, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 48, 32]} />
          <meshPhysicalMaterial color="#f4efe8" roughness={0.35} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.455]} scale={[1, 1, 0.3]}>
          <sphereGeometry args={[0.24, 48, 24]} />
          <meshStandardMaterial map={iris} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.42]}>
          <sphereGeometry args={[0.285, 48, 24, 0, Math.PI * 2, 0, 0.9]} />
          <meshPhysicalMaterial transparent opacity={0.22} roughness={0} clearcoat={1} envMapIntensity={3} depthWrite={false} />
        </mesh>
      </group>
      {lid(true)}
      {lid(false)}
    </group>
  );
};

/* ------------------------------------------------------------------ smartphone */
export const Phone: React.FC<{screen: THREE.Texture}> = ({screen}) => (
  <group>
    <RBox size={[0.8, 1.64, 0.085]} r={0.085}>
      <meshStandardMaterial color="#2b2d33" metalness={1} roughness={0.28} />
    </RBox>
    <mesh position={[0, 0, 0.0445]}>
      <planeGeometry args={[0.74, 1.58]} />
      <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.85} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.74, 0.046]}><circleGeometry args={[0.02, 24]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
  </group>
);

/* ------------------------------------------------------------------ extra props */
export const CrumpledPaper: React.FC<{seed?: number}> = ({seed = 1}) => {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.13, 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = 1 + 0.22 * Math.sin(x * 55 + seed) * Math.cos(y * 47 + seed * 2) + 0.15 * Math.sin(z * 61 + seed * 3);
      p.setXYZ(i, x * n, y * n, z * n);
    }
    g.computeVertexNormals();
    return g;
  }, [seed]);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#f4f1ea" roughness={0.95} flatShading />
    </mesh>
  );
};

/** Orange "refresh" icon: two curved arrows. */
export const LoopArrows: React.FC = () => {
  const arc = useMemo(() => new THREE.TorusGeometry(0.55, 0.07, 16, 48, 2.5), []);
  const head = useMemo(() => new THREE.ConeGeometry(0.17, 0.3, 24), []);
  const mat = <meshPhysicalMaterial color="#F26A1B" roughness={0.3} clearcoat={1} />;
  return (
    <group>
      {[0, Math.PI].map((r) => (
        <group key={r} rotation={[0, 0, r]}>
          <mesh geometry={arc} castShadow>{mat}</mesh>
          <mesh geometry={head} position={[Math.cos(2.5) * 0.55, Math.sin(2.5) * 0.55, 0]} rotation={[0, 0, 2.5 + Math.PI]} castShadow>{mat}</mesh>
        </group>
      ))}
    </group>
  );
};

export const Lightbulb: React.FC<{glow: number}> = ({glow}) => (
  <group>
    <mesh position={[0, 0.25, 0]} castShadow>
      <sphereGeometry args={[0.36, 40, 32]} />
      <meshPhysicalMaterial color="#fff6d0" emissive="#FFD23F" emissiveIntensity={0.15 + glow * 1.4} roughness={0.08} transparent opacity={0.85} clearcoat={1} />
    </mesh>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.17, 0.22, 0.24, 24]} /><meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.3} /></mesh>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0, -0.06 - i * 0.05, 0]}><torusGeometry args={[0.19, 0.012, 8, 24]} /><meshStandardMaterial color="#8d9097" metalness={1} roughness={0.4} /></mesh>
    ))}
    <pointLight position={[0, 0.25, 0.4]} intensity={glow * 3} color="#ffd23f" distance={4} />
  </group>
);

export const Coin: React.FC = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
    <cylinderGeometry args={[0.14, 0.14, 0.035, 36]} />
    <meshStandardMaterial color="#FFC63A" metalness={0.8} roughness={0.3} emissive="#7a5200" emissiveIntensity={0.4} envMapIntensity={2} />
  </mesh>
);
