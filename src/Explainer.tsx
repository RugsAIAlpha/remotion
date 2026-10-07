import React, {useMemo} from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BehindText, Line} from "./BehindText";
import {BarsCard, CheckCard, ClockCard, CrackCard, DeskCard, DMCard, DownArrow, EyeCard, HardhatCard} from "./cards";
import {Subtitles} from "./Subtitles";
import {C, s2f, TOTAL_FRAMES} from "./theme";
import {ease} from "./util";

/* ------------------------------------------------------------------ timeline
 * Times are in seconds and follow the pauses detected in the voice track.
 * Palette: navy + safety orange on warm cream (suits construction / trust).
 */
type Behind = {from: number; to: number; top: number; lines: Line[]; maxW?: number};

const BEHIND: Behind[] = [
  {from: 0.1, to: 3.85, top: 285, lines: [
    {text: "Job or Business?", at: 0.2, kind: "small", size: 70},
    {text: "Construction", at: 1.7, kind: "big", size: 170},
    {text: "Project", at: 2.1, kind: "big", size: 170, color: C.orange},
  ]},
  {from: 4.9, to: 6.5, top: 355, lines: [
    {text: "Expensive", at: 5.0, kind: "big", size: 170},
    {text: "Mistakes!", at: 5.2, kind: "big", size: 170, color: C.orange},
  ]},
  {from: 6.72, to: 10.3, top: 385, lines: [
    {text: "No time for", at: 6.75, kind: "small", size: 76},
    {text: "Site Visits", at: 7.2, kind: "big", size: 200, color: C.orange},
  ]},
  {from: 11.9, to: 14.5, top: 345, lines: [
    {text: "Cost:", at: 12.0, kind: "small", size: 80},
    {text: "3X!", at: 13.15, kind: "big", size: 330, color: C.orange},
  ]},
  {from: 14.58, to: 17.15, top: 305, maxW: 780, lines: [
    {text: "Not skill...", at: 14.65, kind: "small", size: 80},
    {text: "Just Lack", at: 16.0, kind: "big", size: 150},
    {text: "of Time", at: 16.3, kind: "big", size: 150, color: C.orange},
  ]},
  {from: 17.55, to: 22.15, top: 285, lines: [
    {text: "Project Manager", at: 17.6, kind: "small", size: 76},
    {text: "Your Eyes", at: 18.3, kind: "big", size: 170},
    {text: "on Site", at: 18.6, kind: "big", size: 170, color: C.orange},
  ]},
  {from: 24.4, to: 29.44, top: 285, lines: [
    {text: "Comment", at: 24.45, kind: "small", size: 76},
    {text: "MANAGE", at: 25.3, kind: "big", size: 230, color: C.orange},
    {text: "Check your DM", at: 26.2, kind: "small", size: 80},
  ]},
];

// gentle camera: slow push inside each beat, a small reset between beats
const ZOOM: {from: number; to: number; a: number; b: number}[] = [
  {from: 0, to: 3.9, a: 1.0, b: 1.05},
  {from: 3.9, to: 10.3, a: 1.06, b: 1.1},
  {from: 10.3, to: 17.15, a: 1.0, b: 1.06},
  {from: 17.15, to: 22.2, a: 1.08, b: 1.13},
  {from: 22.2, to: 30, a: 1.02, b: 1.08},
];

// a few quiet cues only
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.5, file: "pop", vol: 0.45}, {at: 1.9, file: "pop", vol: 0.45},
  {at: 4.0, file: "crack", vol: 0.5}, {at: 4.5, file: "pop-hi", vol: 0.35},
  {at: 6.8, file: "pop", vol: 0.45},
  {at: 7.95, file: "tick", vol: 0.5}, {at: 8.95, file: "tock", vol: 0.5}, {at: 9.95, file: "tick", vol: 0.5},
  {at: 12.4, file: "riser", vol: 0.35}, {at: 13.2, file: "hit", vol: 0.55}, {at: 13.3, file: "pop", vol: 0.4},
  {at: 17.6, file: "whoosh", vol: 0.3},
  {at: 19.5, file: "pop", vol: 0.45},
  {at: 20.8, file: "pop", vol: 0.45}, {at: 21.0, file: "check", vol: 0.4}, {at: 21.3, file: "check", vol: 0.4}, {at: 21.6, file: "check", vol: 0.4},
  {at: 25.3, file: "hit", vol: 0.5}, {at: 26.5, file: "pop", vol: 0.45}, {at: 26.85, file: "ding", vol: 0.4},
];

const MASK_COUNT = 735;
const maskUrl = (f: number) => staticFile(`mask/${String(Math.min(MASK_COUNT, Math.max(1, f + 1))).padStart(4, "0")}.png`);

/* ------------------------------------------------------------------- layers */
const GRADE = "contrast(1.06) saturate(1.05)";

const SourceVideo: React.FC = () => <OffthreadVideo src={staticFile("source.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", filter: GRADE}} />;

/** The speaker only (matte from scripts/make-matte.py), drawn above the behind-text. */
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

/** Navy wash behind the lettering (speaker stays untinted) + soft vignette. */
const Wash: React.FC = () => (
  <>
    <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(14,27,61,.78) 0%, rgba(14,27,61,.55) 35%, rgba(14,27,61,.12) 62%, rgba(14,27,61,0) 75%)"}} />
    <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(14,27,61,.7) 0%, rgba(14,27,61,0) 22%)"}} />
  </>
);

const useFonts = () => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    Promise.all(["400 100px Anton", "italic 400 40px 'Playfair Display'", "800 40px Inter"].map((f) => document.fonts.load(f))).then(
      () => continueRender(handle),
      () => continueRender(handle),
    );
  }, [handle]);
};

export const Explainer: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const behindActive = BEHIND.some((b) => frame >= s2f(b.from) && frame <= s2f(b.to));
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Zoom>
        <SourceVideo />
        <Wash />
        {BEHIND.map((b, i) => <BehindText key={i} lines={b.lines} top={b.top} end={b.to} maxW={b.maxW} />)}
        {behindActive ? <Person /> : null}
      </Zoom>

      {/* one small illustration at a time, pinned beside the speaker */}
      <DeskCard at={0.5} to={3.85} />
      <HardhatCard at={1.9} to={3.85} />
      <CrackCard at={4.0} to={6.4} />
      <ClockCard at={6.8} to={11.8} />
      <BarsCard at={13.3} to={17.0} />
      <EyeCard at={19.5} to={22.1} />
      <CheckCard at={20.8} to={22.1} />
      <DMCard at={26.5} to={29.44} />
      <DownArrow at={26.9} to={29.44} />

      <Subtitles />

      <Audio src={staticFile("audio/voice.wav")} volume={1} />
      <Audio src={staticFile("audio/music.wav")} volume={(f) => 0.08 * interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES], [1, 0], {extrapolateLeft: "clamp"})} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s2f(s.at)} durationInFrames={s2f(2)} layout="none">
          <Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
