import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT, s2f} from "./theme";

export type Line = {
  text: string;
  at: number; // absolute second the line pops in
  size: number;
  color?: string;
  weight?: number;
  strike?: boolean;
  spacing?: number;
};

/**
 * Big caption that sits BETWEEN the background video and the cut-out speaker,
 * so the speaker's head/shoulders overlap the letters ("text behind person").
 */
const fit = (l: Line, maxW: number) => {
  const words = l.text.split(" ");
  const em = l.text.length * ((l.weight ?? 900) >= 800 ? 0.68 : 0.6) + (words.length - 1) * 0.22;
  return Math.min(l.size, maxW / em);
};

export const BehindText: React.FC<{lines: Line[]; top: number; end: number; gap?: number; maxW?: number}> = ({lines, top, end, gap = 6, maxW = 860}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const endF = s2f(end);
  if (frame > endF) return null;
  const exit = interpolate(frame, [endF - 6, endF], [1, 0], {extrapolateLeft: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap, opacity: exit, transform: `scale(${1 + (1 - exit) * 0.05})`}}>
      {lines.map((l0, i) => {
        const l = {...l0, size: fit(l0, maxW)};
        const lf = frame - s2f(l.at);
        const words = l.text.split(" ");
        return (
          <div key={i} style={{position: "relative", display: "flex", gap: l.size * 0.22, whiteSpace: "nowrap", lineHeight: 0.98, height: l.size * 1.02}}>
            {words.map((w, j) => {
              const p = spring({frame: lf - j * 3, fps, config: {damping: 11, stiffness: 150, mass: 0.6}});
              return (
                <span
                  key={j}
                  style={{
                    fontFamily: FONT,
                    fontWeight: l.weight ?? 900,
                    fontSize: l.size,
                    letterSpacing: l.spacing ?? -2,
                    color: l.color ?? C.white,
                    textTransform: "uppercase",
                    textShadow: "0 10px 36px rgba(0,0,0,.5), 0 2px 0 rgba(0,0,0,.25)",
                    display: "inline-block",
                    opacity: lf < 0 ? 0 : Math.min(1, p * 1.6),
                    transform: `translateY(${(1 - p) * 90}px) scale(${1.35 - 0.35 * p})`,
                    filter: `blur(${(1 - Math.min(1, p)) * 10}px)`,
                  }}
                >
                  {w}
                </span>
              );
            })}
            {l.strike && lf > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: "52%",
                  height: l.size * 0.09,
                  width: `${interpolate(lf, [12, 22], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) * 1.02}%`,
                  background: C.red,
                  borderRadius: 8,
                  boxShadow: "0 0 18px rgba(229,25,45,.7)",
                  transform: "rotate(-3deg)",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
