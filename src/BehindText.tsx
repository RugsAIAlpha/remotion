import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {BIG, C, SERIF, s2f} from "./theme";
import {ease} from "./util";

export type Line = {
  text: string;
  at: number; // absolute second the line appears
  kind: "small" | "big";
  size: number;
  color?: string;
};

const fit = (l: Line, maxW: number) => Math.min(l.size, maxW / (l.text.length * (l.kind === "big" ? 0.47 : 0.5)));

/**
 * Editorial caption: tiny italic connector + one big condensed keyword.
 * Sits BETWEEN the background video and the cut-out speaker (text behind person).
 * Motion is deliberately simple: a short slide-up + fade.
 */
export const BehindText: React.FC<{lines: Line[]; top: number; end: number; maxW?: number}> = ({lines, top, end, maxW = 880}) => {
  const frame = useCurrentFrame();
  const endF = s2f(end);
  if (frame > endF) return null;
  const exit = interpolate(frame, [endF - 8, endF], [1, 0], {extrapolateLeft: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: exit}}>
      {lines.map((l0, i) => {
        const l = {...l0, size: fit(l0, maxW)};
        const p = ease(interpolate(frame - s2f(l.at), [0, 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
        const big = l.kind === "big";
        return (
          <div
            key={i}
            style={{
              fontFamily: big ? BIG : SERIF,
              fontStyle: big ? "normal" : "italic",
              fontWeight: 400,
              fontSize: l.size,
              lineHeight: big ? 1.02 : 1.2,
              letterSpacing: big ? 1 : 0,
              textTransform: big ? "uppercase" : "none",
              whiteSpace: "nowrap",
              color: l.color ?? C.cream,
              textShadow: "0 6px 28px rgba(8,14,36,.45)",
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
