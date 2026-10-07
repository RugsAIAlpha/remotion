import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {FPS, s2f} from "./theme";

/** Spring that starts at absolute second `at` (global frame based). */
export const usePop = (at: number, damping = 11, stiffness = 170) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - s2f(at), fps, config: {damping, stiffness, mass: 0.6}});
};

/** Seconds since `from` (can be negative). */
export const useT = (from: number) => useCurrentFrame() / FPS - from;

/** Renders children only between two absolute seconds, with a short fade in/out. */
export const Window: React.FC<{from: number; to: number; fade?: number; children: React.ReactNode}> = ({from, to, fade = 4, children}) => {
  const frame = useCurrentFrame();
  const a = s2f(from);
  const b = s2f(to);
  if (frame < a || frame > b) return null;
  const opacity = fade ? Math.min(interpolate(frame, [a, a + fade], [0, 1], {extrapolateRight: "clamp"}), interpolate(frame, [b - fade, b], [1, 0], {extrapolateLeft: "clamp"})) : 1;
  return <div style={{position: "absolute", inset: 0, opacity}}>{children}</div>;
};

/** Circular-reveal "cut" used for full-screen B-roll style graphics. */
export const Takeover: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const a = s2f(from);
  const b = s2f(to);
  if (frame < a || frame > b) return null;
  const enter = interpolate(frame, [a, a + 7], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const exit = interpolate(frame, [b - 6, b], [1, 0], {extrapolateLeft: "clamp", easing: Easing.in(Easing.cubic)});
  const r = Math.min(enter, exit) * 1700;
  return (
    <div style={{position: "absolute", inset: 0, clipPath: `circle(${r}px at 50% 46%)`}}>
      {children}
    </div>
  );
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ease = Easing.out(Easing.cubic);
