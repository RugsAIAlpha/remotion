import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {C, FONT, s2f} from "./theme";

export type Phrase = {start: number; end: number; text: string; accent?: string[]};

// Timings come from the pauses detected in the original voice track.
export const PHRASES: Phrase[] = [
  {start: 0.1, end: 3.76, text: "Apni job ya business chalate hue khud apna construction project sambhalna...", accent: ["job", "business", "construction", "project"]},
  {start: 3.96, end: 6.19, text: "...acche acche logon se mehangi galtiyan karwa deta hai.", accent: ["mehangi", "galtiyan"]},
  {start: 6.71, end: 8.36, text: "Aap site par utna samay nahi de paate", accent: ["samay", "nahi"]},
  {start: 8.49, end: 10.0, text: "ki samay rehte samasya ko pakad sakein...", accent: ["samasya"]},
  {start: 10.32, end: 11.56, text: "...aur jab tak aapka dhyan jaata hai,"},
  {start: 11.86, end: 12.89, text: "use theek karne ka kharch", accent: ["kharch"]},
  {start: 13.24, end: 14.09, text: "3 guna ho jaata hai.", accent: ["3", "guna"]},
  {start: 14.57, end: 15.79, text: "Yeh aapki kaabiliyat ki baat nahi hai,", accent: ["kaabiliyat"]},
  {start: 16.04, end: 17.1, text: "bas samay ki kami ki baat hai.", accent: ["samay", "kami"]},
  {start: 17.55, end: 19.14, text: "Ek project manager ka poora kaam yahi hai—", accent: ["project", "manager"]},
  {start: 19.51, end: 20.54, text: "site par woh aankhein banna", accent: ["aankhein"]},
  {start: 20.81, end: 21.84, text: "jo aap khud nahi ban sakte."},
  {start: 22.22, end: 24.19, text: "Agar aap bhi abhi akele hi yeh sab sambhal rahe hain,", accent: ["akele"]},
  {start: 24.44, end: 25.05, text: "toh comment karein", accent: ["comment"]},
  {start: 25.33, end: 25.67, text: "“MANAGE”", accent: ["“MANAGE”"]},
  {start: 26.15, end: 26.79, text: "aur main aapko aapke DM mein", accent: ["DM"]},
  {start: 27.07, end: 28.67, text: "iski saari jankari bheej doonga.", accent: ["jankari"]},
];

const clean = (w: string) => w.replace(/[.,—]/g, "");

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const p = PHRASES.find((ph) => frame >= s2f(ph.start) - 1 && frame <= s2f(ph.end) + 4);
  if (!p) return null;
  const words = p.text.split(" ");
  const a = s2f(p.start);
  const b = s2f(p.end);
  const prog = interpolate(frame, [a, b], [0, words.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const inT = interpolate(frame, [a - 1, a + 3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 60, right: 60, top: 1455, height: 190, display: "flex", justifyContent: "center", alignItems: "center", opacity: inT, transform: `translateY(${(1 - inT) * 14}px)`}}>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, textAlign: "center"}}>
        {words.map((w, i) => {
          const active = i < Math.ceil(prog) && i >= Math.floor(prog) - 0 && prog < words.length;
          const accent = p.accent?.some((x) => clean(x).toLowerCase() === clean(w).toLowerCase());
          const spoken = i < prog;
          const color = accent ? C.orange : C.cream;
          return (
            <span
              key={i}
              style={{
                color,
                opacity: spoken || active ? 1 : 0.6,
                transform: "none",
                display: "inline-block",
                WebkitTextStroke: "9px rgba(14,27,61,.92)",
                paintOrder: "stroke fill",
                textShadow: "0 6px 18px rgba(0,0,0,.45)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
