import React from "react";
import * as THREE from "three";
import {Hardhat, RBox} from "./objects";

type V3 = [number, number, number];

export type Pose = {
  /** local time in seconds, drives idle motion */
  t: number;
  /** yaw of the whole body (radians); 0 faces the camera */
  turn?: number;
  /** head yaw / pitch */
  look?: number;
  nod?: number;
  /** arm: [forward raise, abduction, elbow flex] in radians */
  armL?: V3;
  armR?: V3;
  /** walking amount 0..1 */
  walk?: number;
};

export type Look = {
  skin?: string;
  hair?: string;
  shirt: string;
  pants: string;
  shoes?: string;
  hardhat?: boolean;
  vest?: boolean;
  tie?: boolean;
  prop?: "briefcase" | "clipboard" | "watch" | "none";
};

const Limb: React.FC<{len: number; r: number; color: string; y?: number; children?: React.ReactNode}> = ({len, r, color, y, children}) => (
  <group position={[0, y ?? -len / 2, 0]}>
    <mesh castShadow>
      <capsuleGeometry args={[r, len - r * 2, 8, 16]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    {children}
  </group>
);

const Arm: React.FC<{side: 1 | -1; a: V3; look: Look; hold?: React.ReactNode}> = ({side, a, look, hold}) => {
  const sleeve = look.vest ? look.shirt : look.shirt;
  return (
    <group position={[side * 0.235, 1.34, 0]} rotation={[-a[0], 0, side * a[1]]}>
      <Limb len={0.3} r={0.052} color={sleeve}>
        <group position={[0, -0.15, 0]} rotation={[-a[2], 0, 0]}>
          <Limb len={0.29} r={0.045} color={look.shirt} y={-0.145}>
            <group position={[0, -0.16, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.062, 16, 16]} />
                <meshStandardMaterial color={look.skin ?? "#c68e65"} roughness={0.55} />
              </mesh>
              {hold}
            </group>
          </Limb>
        </group>
      </Limb>
    </group>
  );
};

const Leg: React.FC<{side: 1 | -1; swing: number; knee: number; look: Look}> = ({side, swing, knee, look}) => (
  <group position={[side * 0.095, 0.88, 0]} rotation={[swing, 0, 0]}>
    <Limb len={0.44} r={0.085} color={look.pants}>
      <group position={[0, -0.22, 0]} rotation={[knee, 0, 0]}>
        <Limb len={0.44} r={0.068} color={look.pants} y={-0.22}>
          <RBox size={[0.12, 0.08, 0.27]} r={0.035} position={[0, -0.235, 0.055]}>
            <meshStandardMaterial color={look.shoes ?? "#1e1a17"} roughness={0.5} />
          </RBox>
        </Limb>
      </group>
    </Limb>
  </group>
);

const Face: React.FC<{look: Look; blink: number}> = ({look, blink}) => {
  const skin = look.skin ?? "#c68e65";
  return (
    <group>
      <mesh castShadow scale={[1, 1.12, 1.02]}>
        <sphereGeometry args={[0.125, 40, 32]} />
        <meshPhysicalMaterial color={skin} roughness={0.5} sheen={0.6} sheenColor="#ffb08a" />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.045, 0.02, 0.108]} scale={[1, blink, 1]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#f4f1ec" roughness={0.3} />
          </mesh>
          <mesh position={[s * 0.045, 0.02, 0.125]} scale={[1, blink, 1]}>
            <sphereGeometry args={[0.0105, 12, 12]} />
            <meshStandardMaterial color="#120a05" roughness={0.1} />
          </mesh>
          <mesh position={[s * 0.047, 0.056, 0.114]} rotation={[0, 0, -s * 0.12]}>
            <boxGeometry args={[0.04, 0.008, 0.01]} />
            <meshStandardMaterial color={look.hair ?? "#15100c"} roughness={0.9} />
          </mesh>
          <mesh position={[s * 0.123, 0, 0]} castShadow>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.012, 0.125]} scale={[1, 1.2, 1]} castShadow>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.062, 0.113]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.028, 0.0045, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#5a2a1d" roughness={0.6} />
      </mesh>
      {/* moustache */}
      <mesh position={[0, -0.04, 0.118]}>
        <boxGeometry args={[0.05, 0.01, 0.01]} />
        <meshStandardMaterial color={look.hair ?? "#15100c"} roughness={0.9} />
      </mesh>
      {!look.hardhat ? (
        <mesh position={[0, 0.045, -0.005]} scale={[1.04, 1.0, 1.06]}>
          <sphereGeometry args={[0.128, 32, 20, 0, Math.PI * 2, 0, 1.25]} />
          <meshStandardMaterial color={look.hair ?? "#15100c"} roughness={0.85} />
        </mesh>
      ) : null}
      {look.hardhat ? (
        <group position={[0, 0.075, 0]} scale={0.205} rotation={[0.04, 0, 0]}>
          <Hardhat color="#FFB400" />
        </group>
      ) : null}
    </group>
  );
};

/** Jointed 3D character: ~1.8 units tall, feet at y=0, facing +z. */
export const Person: React.FC<{look: Look; pose: Pose; position?: V3; scale?: number}> = ({look, pose, position = [0, 0, 0], scale = 1}) => {
  const {t, turn = 0, look: lk = 0, nod = 0, walk = 0} = pose;
  const aL = pose.armL ?? [0.05, 0.12, 0.1];
  const aR = pose.armR ?? [0.05, 0.12, 0.1];
  const breathe = Math.sin(t * 2.2) * 0.008;
  const sway = Math.sin(t * 1.3) * 0.02;
  const ph = t * 6.5;
  const sw = Math.sin(ph) * 0.55 * walk;
  const blinkPhase = (t % 3.2) / 3.2;
  const blink = blinkPhase > 0.95 ? 0.12 : 1;
  const skin = look.skin ?? "#c68e65";
  const bob = Math.abs(Math.sin(ph)) * 0.025 * walk;
  const hands = (side: 1 | -1) => {
    if (side === 1 && look.prop === "briefcase")
      return (
        <group position={[0, -0.02, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.62}>
          <group position={[0, -0.85, 0]}><BriefcaseProp /></group>
        </group>
      );
    if (side === -1 && look.prop === "clipboard")
      return (
        <group position={[0, -0.02, 0.07]} rotation={[0.5, 0, 0]}>
          <RBox size={[0.24, 0.32, 0.015]} r={0.006} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#8b6a43" roughness={0.6} />
          </RBox>
          <mesh position={[0, 0.1, 0.011]}>
            <planeGeometry args={[0.2, 0.27]} />
            <meshStandardMaterial color="#f5f3ec" roughness={0.9} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, 0.2 - i * 0.05, 0.0125]}>
              <planeGeometry args={[0.16, 0.006]} />
              <meshBasicMaterial color={i === 0 ? "#2f6c47" : "#999"} />
            </mesh>
          ))}
          <RBox size={[0.07, 0.03, 0.02]} r={0.008} position={[0, 0.26, 0.01]}>
            <meshStandardMaterial color="#aaa" metalness={1} roughness={0.3} />
          </RBox>
        </group>
      );
    if (side === -1 && look.prop === "watch")
      return (
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.052, 0.012, 8, 20]} />
          <meshStandardMaterial color="#c8962f" metalness={1} roughness={0.3} />
        </mesh>
      );
    return null;
  };
  return (
    <group position={position} rotation={[0, turn, 0]} scale={scale}>
      <group position={[0, bob, 0]}>
        <Leg side={1} swing={sw} knee={Math.max(0, -sw) * 0.9} look={look} />
        <Leg side={-1} swing={-sw} knee={Math.max(0, sw) * 0.9} look={look} />
        <group rotation={[0, sway + sw * 0.15, 0]}>
          {/* pelvis + torso */}
          <RBox size={[0.3, 0.16, 0.2]} r={0.06} position={[0, 0.92, 0]}>
            <meshStandardMaterial color={look.pants} roughness={0.7} />
          </RBox>
          <group position={[0, 1.15, 0]} scale={[1.18, 1 + breathe, 0.8]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.16, 0.24, 8, 24]} />
              <meshStandardMaterial color={look.shirt} roughness={0.75} />
            </mesh>
            {look.vest ? (
              <group>
                <mesh scale={[1.04, 1.0, 1.06]}>
                  <capsuleGeometry args={[0.16, 0.22, 8, 24]} />
                  <meshStandardMaterial color="#FF7A1A" roughness={0.7} />
                </mesh>
                {[-0.07, 0.07].map((y) => (
                  <mesh key={y} position={[0, y, 0]} scale={[1.05, 1, 1.075]}>
                    <cylinderGeometry args={[0.1676, 0.1676, 0.03, 32, 1, true]} />
                    <meshStandardMaterial color="#e8eaee" metalness={0.7} roughness={0.25} side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </group>
            ) : null}
            {look.tie ? (
              <group position={[0, 0.07, 0.158]}>
                <mesh><boxGeometry args={[0.045, 0.22, 0.012]} /><meshStandardMaterial color="#b3202a" roughness={0.5} /></mesh>
              </group>
            ) : null}
          </group>
          {/* shoulders + neck */}
          <mesh position={[0, 1.34, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.8]} castShadow>
            <capsuleGeometry args={[0.07, 0.34, 8, 16]} />
            <meshStandardMaterial color={look.shirt} roughness={0.75} />
          </mesh>
          <mesh position={[0, 1.43, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.062, 0.1, 16]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[0, 1.58, 0]} rotation={[nod, lk, 0]} scale={1.32}>
            <Face look={look} blink={blink} />
          </group>
          <Arm side={-1} a={aL} look={look} hold={hands(-1)} />
          <Arm side={1} a={aR} look={look} hold={hands(1)} />
        </group>
      </group>
    </group>
  );
};

const BriefcaseProp: React.FC = () => (
  <group>
    <RBox size={[0.9, 0.62, 0.24]} r={0.05} position={[0, 0.31, 0]}>
      <meshPhysicalMaterial color="#6a3f1f" roughness={0.55} clearcoat={0.4} />
    </RBox>
    <mesh position={[0, 0.66, 0]}><torusGeometry args={[0.16, 0.025, 10, 28, Math.PI]} /><meshStandardMaterial color="#1a1209" roughness={0.6} /></mesh>
    {[-0.28, 0.28].map((x) => (
      <RBox key={x} size={[0.09, 0.07, 0.26]} r={0.01} position={[x, 0.47, 0]}>
        <meshStandardMaterial color="#d8c27a" metalness={1} roughness={0.28} />
      </RBox>
    ))}
  </group>
);

/** Reference looks used in the video. */
export const OFFICE: Look = {shirt: "#e9ecf2", pants: "#23262e", shoes: "#14110f", tie: true, prop: "briefcase", hair: "#120d09"};
export const SITE: Look = {shirt: "#d9d3c4", pants: "#6f6a58", shoes: "#3a2c20", hardhat: true, vest: true, prop: "clipboard", hair: "#120d09"};
