import React, {useMemo} from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BehindText, Line} from "./BehindText";
import {CalcScene, ChecklistScene, Clock3D, CrackScene, DMIcon, DownArrow, EyeScene, Flash, ManageSticker, SplitIcons, SurgeArrow} from "./graphics";
import {Subtitles} from "./Subtitles";
import {C, s2f, TOTAL_FRAMES} from "./theme";
import {Takeover, Window, ease} from "./util";

/* ----------------------------------------------------------------- timeline */
type Behind = {from: number; to: number; top: number; lines: Line[]};

const BEHIND: Behind[] = [
  {from: 0.1, to: 3.85, top: 450, lines: [
    {text: "Job or Business?", at: 0.2, size: 104},
    {text: "Construction Project", at: 1.9, size: 76, color: C.amber},
  ]},
  {from: 5.0, to: 6.5, top: 470, lines: [
    {text: "Expensive", at: 5.0, size: 150, color: "#fff"},
    {text: "Mistakes!", at: 5.2, size: 170, color: "#FF3B4E"},
  ]},
  {from: 6.72, to: 10.3, top: 470, lines: [
    {text: "No Time For", at: 6.75, size: 118},
    {text: "Site Visits", at: 7.3, size: 170, color: C.amber},
  ]},
  {from: 14.58, to: 17.15, top: 520, lines: [
    {text: "Not Skill...", at: 14.65, size: 104, weight: 300, strike: true, spacing: 2},
    {text: "Just Lack of Time", at: 16.0, size: 84, weight: 600, spacing: 1, color: C.amber},
  ]},
  {from: 17.55, to: 19.5, top: 470, lines: [
    {text: "Project Manager", at: 17.6, size: 110},
    {text: "Your Eyes on Site", at: 18.3, size: 98, color: C.amber},
  ]},
  {from: 24.4, to: 29.44, top: 450, lines: [
    {text: "Comment 'MANAGE'", at: 24.45, size: 94},
    {text: "Check Your DM", at: 26.2, size: 108, color: C.amber},
  ]},
];

const ZOOM: {from: number; to: number; a: number; b: number; oy?: number}[] = [
  {from: 0, to: 3.9, a: 1.02, b: 1.09},
  {from: 3.9, to: 5.1, a: 1.0, b: 1.0},
  {from: 5.1, to: 6.7, a: 1.14, b: 1.2},
  {from: 6.7, to: 10.3, a: 1.0, b: 1.07},
  {from: 10.3, to: 13.2, a: 1.12, b: 1.18},
  {from: 13.2, to: 14.6, a: 1.2, b: 1.25},
  {from: 14.6, to: 17.15, a: 1.34, b: 1.42},
  {from: 17.15, to: 22.2, a: 1.0, b: 1.08},
  {from: 22.2, to: 25.3, a: 1.12, b: 1.2},
  {from: 25.3, to: 29.5, a: 1.06, b: 1.14},
];

const SFX: {at: number; file: string; vol?: number}[] = [
  {at: 0.1, file: "whoosh", vol: 0.5}, {at: 0.25, file: "hit", vol: 0.45}, {at: 0.55, file: "pop"}, {at: 1.9, file: "pop-hi"}, {at: 1.9, file: "whoosh", vol: 0.35},
  {at: 3.55, file: "riser", vol: 0.35},
  {at: 3.9, file: "whoosh", vol: 0.6}, {at: 4.0, file: "crack", vol: 0.9}, {at: 4.4, file: "alarm", vol: 0.28}, {at: 4.45, file: "hit", vol: 0.5}, {at: 5.0, file: "whoosh-out", vol: 0.5},
  {at: 5.0, file: "hit", vol: 0.55}, {at: 5.2, file: "pop-hi"},
  {at: 6.7, file: "whoosh", vol: 0.55}, {at: 6.85, file: "pop"}, {at: 7.3, file: "hit", vol: 0.4},
  {at: 6.95, file: "tick"}, {at: 7.95, file: "tock"}, {at: 8.95, file: "tick"}, {at: 9.95, file: "tock"}, {at: 10.95, file: "tick"},
  {at: 11.85, file: "riser", vol: 0.55},
  {at: 13.2, file: "hit", vol: 0.9}, {at: 13.2, file: "whoosh", vol: 0.5}, {at: 13.35, file: "ding", vol: 0.3},
  {at: 13.85, file: "whoosh", vol: 0.6}, {at: 14.0, file: "cash", vol: 0.5},
  {at: 14.55, file: "whoosh", vol: 0.5}, {at: 14.65, file: "pop"}, {at: 16.0, file: "pop-hi"},
  {at: 17.5, file: "whoosh", vol: 0.5}, {at: 17.6, file: "pop"}, {at: 18.3, file: "pop-hi"},
  {at: 19.4, file: "whoosh", vol: 0.55}, {at: 19.55, file: "scan", vol: 0.45}, {at: 20.3, file: "alarm", vol: 0.2},
  {at: 20.75, file: "whoosh", vol: 0.5}, {at: 21.0, file: "check"}, {at: 21.2, file: "check"}, {at: 21.4, file: "check"}, {at: 21.6, file: "check"},
  {at: 22.15, file: "whoosh-out", vol: 0.5},
  {at: 24.45, file: "pop"}, {at: 25.0, file: "riser", vol: 0.35},
  {at: 25.3, file: "hit", vol: 0.8}, {at: 25.3, file: "whoosh", vol: 0.5}, {at: 25.4, file: "key", vol: 0.5}, {at: 25.45, file: "key", vol: 0.5}, {at: 25.5, file: "key", vol: 0.5},
  {at: 26.2, file: "pop-hi"}, {at: 26.45, file: "whoosh", vol: 0.5}, {at: 26.55, file: "ding", vol: 0.5}, {at: 26.85, file: "pop"}, {at: 27.4, file: "pop"},
];

const MASK_COUNT = 735;
const maskUrl = (f: number) => staticFile(`mask/${String(Math.min(MASK_COUNT, Math.max(1, f + 1))).padStart(4, "0")}.png`);

/* ----------------------------------------------------------------- layers */
const GRADE = "brightness(0.8) contrast(1.1) saturate(1.12)";

const SourceVideo: React.FC = () => <OffthreadVideo src={staticFile("source.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", filter: GRADE}} />;

/** The speaker only, cut out with the pre-computed matte, drawn above the behind-text. */
const Person: React.FC = () => {
  const frame = useCurrentFrame();
  const url = maskUrl(frame);
  const handle = useMemo(() => delayRender(`mask ${url}`), [url]);
  React.useEffect(() => {
    const img = new Image();
    const done = () => continueRender(handle);
    img.onload = () => (img.decode ? img.decode().then(done, done) : done());
    img.onerror = done;
    img.src = url;
  }, [handle, url]);
  const m = `url(${url})`;
  return (
    <AbsoluteFill style={{WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat"}}>
      <SourceVideo />
    </AbsoluteFill>
  );
};

const Zoom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const z = ZOOM.find((s) => frame >= s2f(s.from) && frame < s2f(s.to)) ?? ZOOM[ZOOM.length - 1];
  const scale = interpolate(frame, [s2f(z.from), s2f(z.to)], [z.a, z.b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: "50% 900px"}}>{children}</AbsoluteFill>;
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(5,8,18,.55) 100%)", pointerEvents: "none"}} />
);

export const Explainer: React.FC = () => {
  const frame = useCurrentFrame();
  const behindActive = BEHIND.some((b) => frame >= s2f(b.from) && frame <= s2f(b.to));
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* 1. base video + 2. text behind speaker + 3. speaker cut-out (all share the punch-in zoom) */}
      <Zoom>
        <SourceVideo />
        {BEHIND.map((b, i) => <BehindText key={i} lines={b.lines} top={b.top} end={b.to} maxW={b.from > 14 && b.from < 17 ? 640 : 860} />)}
        {behindActive ? <Person /> : null}
      </Zoom>
      <Vignette />

      {/* 4. foreground motion graphics */}
      <SplitIcons to={3.85} />
      <Clock3D from={6.8} to={11.6} />
      <Window from={13.15} to={13.95} fade={0}><SurgeArrow from={13.15} to={13.95} /></Window>
      <Window from={5.0} to={5.45} fade={0}><Flash at={5.0} color={C.red} /></Window>

      <Takeover from={3.9} to={5.1}><CrackScene from={3.9} /></Takeover>
      <Takeover from={13.85} to={14.6}><CalcScene from={13.85} /></Takeover>
      <Takeover from={19.45} to={20.85}><EyeScene from={19.45} /></Takeover>
      <Takeover from={20.8} to={22.2}><ChecklistScene from={20.8} /></Takeover>

      <DMIcon at={26.5} to={29.44} />
      <ManageSticker at={25.3} to={29.44} />
      <DownArrow at={26.9} to={29.44} />

      {/* 5. captions */}
      <Subtitles />

      {/* 6. audio: cleaned voice, ducked music bed, sound effects */}
      <Audio src={staticFile("audio/voice.wav")} volume={1} />
      <Audio src={staticFile("audio/music.wav")} volume={(f) => 0.11 * interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES], [1, 0], {extrapolateLeft: "clamp"})} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s2f(s.at)} durationInFrames={s2f(2)} layout="none">
          <Audio src={staticFile(`audio/${s.file}.wav`)} volume={(s.vol ?? 0.7) * 0.9} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
