import React from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {DownArrow} from "./cta";
import {Caption, Captions, CutDark, HookCard, Inset, LightLeak} from "./ref";
import {s2f} from "./theme";
import {SceneApps, SceneChat, SceneHardWay, SceneIdeas, SceneLoop, SceneThirty} from "./three/Scenes2";
import {SceneCTA} from "./three/Scenes3D";
import {ease} from "./util";

export const FRAMES_2 = 1015; // 40.6 s @ 25 fps

/* Cut points follow the pauses found in the voice track. Captions only cover the phrases the
 * speech recogniser was confident about; edit CAPTIONS below to correct or extend them. */
const CAPTIONS: Caption[] = [
  {start: 8.0, end: 10.3, words: "I've been doing things the hard way", hl: ["hard", "way"]},
  {start: 11.3, end: 13.6, words: "Have you ever typed something in", hl: ["typed"]},
  {start: 14.4, end: 16.6, words: "and it just isn't right", hl: ["isn't", "right"]},
  {start: 17.4, end: 19.1, words: "So you try again and again", hl: ["again"], script: "again", scriptColor: "#FFE600"},
  {start: 19.8, end: 22.0, words: "Before you know it 30 minutes have passed", hl: ["30", "minutes"]},
  {start: 24.3, end: 27.7, words: "Other people out there are just generating", hl: ["generating"]},
  {start: 28.4, end: 30.3, words: "mobile apps and business ideas", hl: ["business", "ideas"], script: "ideas", scriptColor: "#FF2A2A"},
  {start: 36.0, end: 37.4, words: "If you want in on the secret", hl: ["secret"]},
  {start: 37.5, end: 38.8, words: "comment", script: "PROMPT", scriptColor: "#FF2A2A"},
  {start: 38.9, end: 40.5, words: "and I'll send it immediately", hl: ["immediately"], y: 1380},
];

// punch-in crops on the talking head; the inset windows sit above his head so those shots stay wide
const ZOOM: {from: number; to: number; a: number; b: number}[] = [
  {from: 0, to: 8.0, a: 1.12, b: 1.2},
  {from: 8.0, to: 11.3, a: 1.2, b: 1.2},
  {from: 11.3, to: 13.6, a: 1.0, b: 1.0},
  {from: 13.6, to: 14.6, a: 1.3, b: 1.34},
  {from: 14.6, to: 16.6, a: 1.0, b: 1.0},
  {from: 16.6, to: 17.4, a: 1.18, b: 1.22},
  {from: 17.4, to: 19.8, a: 1.2, b: 1.2},
  {from: 19.8, to: 22.0, a: 1.0, b: 1.0},
  {from: 22.0, to: 24.3, a: 1.1, b: 1.18},
  {from: 24.3, to: 27.7, a: 1.0, b: 1.0},
  {from: 27.7, to: 30.3, a: 1.3, b: 1.34},
  {from: 30.3, to: 32.6, a: 1.28, b: 1.34},
  {from: 32.6, to: 34.3, a: 1.12, b: 1.16},
  {from: 34.3, to: 36.0, a: 1.3, b: 1.36},
  {from: 36.0, to: 39.0, a: 1.2, b: 1.2},
  {from: 39.0, to: 41, a: 1.14, b: 1.2},
];

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: "whoosh", vol: 0.45}, {at: 1.5, file: "whoosh-out", vol: 0.4},
  {at: 8.0, file: "hit", vol: 0.4},
  {at: 11.6, file: "key", vol: 0.35}, {at: 11.9, file: "key", vol: 0.35}, {at: 12.2, file: "key", vol: 0.35}, {at: 12.5, file: "key", vol: 0.35},
  {at: 14.9, file: "alarm", vol: 0.22},
  {at: 17.4, file: "whoosh", vol: 0.4},
  {at: 20.1, file: "tick", vol: 0.3}, {at: 20.6, file: "tock", vol: 0.3}, {at: 21.1, file: "tick", vol: 0.3},
  {at: 24.6, file: "pop", vol: 0.4},
  {at: 28.4, file: "whoosh", vol: 0.4}, {at: 28.7, file: "ding", vol: 0.35},
  {at: 36.0, file: "riser", vol: 0.3},
  {at: 37.65, file: "key", vol: 0.35}, {at: 37.75, file: "key", vol: 0.35}, {at: 37.85, file: "key", vol: 0.35},
  {at: 38.75, file: "chime", vol: 0.5},
];

const Zoom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const z = ZOOM.find((s) => frame >= s2f(s.from) && frame < s2f(s.to)) ?? ZOOM[ZOOM.length - 1];
  const scale = interpolate(frame, [s2f(z.from), s2f(z.to)], [z.a, z.b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: "50% 720px"}}>{children}</AbsoluteFill>;
};

/** Moody grade like the reference: soft vignette plus a dark gradient behind the captions. */
const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(5,8,14,.55) 100%)"}} />
    <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(5,8,14,.75) 0%, rgba(5,8,14,0) 34%)"}} />
  </>
);

const useFonts = () => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    Promise.all(["400 100px Anton", "800 40px Inter", "italic 800 40px Inter", "400 100px Yellowtail"].map((f) => document.fonts.load(f))).then(
      () => continueRender(handle),
      () => continueRender(handle),
    );
  }, [handle]);
};

export const Explainer2: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: "#05070b"}}>
      <Zoom>
        <OffthreadVideo src={staticFile("source2.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.06) saturate(1.05) brightness(.97)"}} />
      </Zoom>
      <Grade />

      {/* inset windows above his head, speaker stays on screen */}
      <Inset from={11.3} to={13.6}><SceneChat from={11.3} to={13.6} mode="typing" inset /></Inset>
      <Inset from={14.6} to={16.6}><SceneChat from={14.6} to={16.6} mode="wrong" inset /></Inset>
      <Inset from={19.8} to={22.0}><SceneThirty from={19.8} to={22.0} inset /></Inset>
      <Inset from={24.3} to={27.7}><SceneApps from={24.3} to={27.7} inset /></Inset>

      {/* full-screen dark cutaways */}
      <CutDark from={8.0} to={10.3}><SceneHardWay from={8.0} to={10.3} /></CutDark>
      <CutDark from={17.4} to={19.1}><SceneLoop from={17.4} to={19.1} /></CutDark>
      <CutDark from={28.4} to={30.3}><SceneIdeas from={28.4} to={30.3} /></CutDark>
      <CutDark from={36.0} to={39.0}><SceneCTA from={36.0} to={39.0} word="PROMPT" typeAt={1.55} postIn={2.6} labels={false} dark /></CutDark>

      <HookCard from={0} to={1.6} />
      {[1.5, 8.0, 17.4, 28.4, 36.0, 39.0].map((t) => <LightLeak key={t} at={t - 0.1} />)}

      <Captions items={CAPTIONS} />
      <DownArrow at={39.6} to={40.6} />

      <Audio src={staticFile("audio/voice2.wav")} volume={1} />
      <Audio src={staticFile("audio/music-long.wav")} volume={(f) => 0.06 * interpolate(f, [FRAMES_2 - 40, FRAMES_2], [1, 0], {extrapolateLeft: "clamp"})} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s2f(s.at)} durationInFrames={s2f(2)} layout="none">
          <Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
