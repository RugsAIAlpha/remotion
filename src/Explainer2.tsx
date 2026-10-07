import React from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Cut} from "./collage";
import {DownArrow, EndCTA} from "./cta";
import {C, s2f} from "./theme";
import {SceneApps, SceneChat, SceneHardWay, SceneIdeas, SceneLoop, SceneThirty} from "./three/Scenes2";
import {SceneCTA} from "./three/Scenes3D";
import {ease} from "./util";

export const FRAMES_2 = 1015; // 40.6 s @ 25 fps
const BG = "#EEF1EA"; // soft sage-white to sit with the room's plants

/* Cut points follow the pauses found in the voice track.
 * Talking-head shots (punch-in crops) alternate with full-screen 3D cutaways. */
const ZOOM: {from: number; to: number; a: number; b: number}[] = [
  {from: 0, to: 8.0, a: 1.12, b: 1.2},
  {from: 8.0, to: 11.3, a: 1.0, b: 1.0},
  {from: 11.3, to: 13.6, a: 1.0, b: 1.0},
  {from: 13.6, to: 14.6, a: 1.3, b: 1.34},
  {from: 14.6, to: 16.6, a: 1.0, b: 1.0},
  {from: 16.6, to: 17.4, a: 1.18, b: 1.22},
  {from: 17.4, to: 19.1, a: 1.0, b: 1.0},
  {from: 19.1, to: 19.8, a: 1.34, b: 1.38},
  {from: 19.8, to: 22.0, a: 1.0, b: 1.0},
  {from: 22.0, to: 24.3, a: 1.1, b: 1.18},
  {from: 24.3, to: 30.3, a: 1.0, b: 1.0},
  {from: 30.3, to: 32.6, a: 1.28, b: 1.34},
  {from: 32.6, to: 34.3, a: 1.12, b: 1.16},
  {from: 34.3, to: 36.0, a: 1.3, b: 1.36},
  {from: 36.0, to: 39.0, a: 1.0, b: 1.0},
  {from: 39.0, to: 41, a: 1.14, b: 1.2},
];

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 8.0, file: "hit", vol: 0.4},
  {at: 11.6, file: "key", vol: 0.35}, {at: 11.9, file: "key", vol: 0.35}, {at: 12.2, file: "key", vol: 0.35}, {at: 12.5, file: "key", vol: 0.35},
  {at: 14.9, file: "alarm", vol: 0.22},
  {at: 17.5, file: "whoosh", vol: 0.35},
  {at: 20.1, file: "tick", vol: 0.3}, {at: 20.6, file: "tock", vol: 0.3}, {at: 21.1, file: "tick", vol: 0.3},
  {at: 24.6, file: "pop", vol: 0.4},
  {at: 28.6, file: "ding", vol: 0.35},
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

const useFonts = () => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    Promise.all(["400 100px Anton", "800 40px Inter", "600 40px Inter"].map((f) => document.fonts.load(f))).then(
      () => continueRender(handle),
      () => continueRender(handle),
    );
  }, [handle]);
};

export const Explainer2: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Zoom>
        <OffthreadVideo src={staticFile("source2.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
      </Zoom>

      <Cut from={8.0} to={10.3} bg={BG}><SceneHardWay from={8.0} to={10.3} /></Cut>
      <Cut from={11.3} to={13.6} bg={BG}><SceneChat from={11.3} to={13.6} mode="typing" label="Type it in" /></Cut>
      <Cut from={14.6} to={16.6} bg={BG}><SceneChat from={14.6} to={16.6} mode="wrong" label="Not right?" color="#D6362B" /></Cut>
      <Cut from={17.4} to={19.1} bg={BG}><SceneLoop from={17.4} to={19.1} /></Cut>
      <Cut from={19.8} to={22.0} bg={BG}><SceneThirty from={19.8} to={22.0} /></Cut>
      <Cut from={24.3} to={27.7} bg={BG}><SceneApps from={24.3} to={27.7} /></Cut>
      <Cut from={28.4} to={30.3} bg={BG}><SceneIdeas from={28.4} to={30.3} /></Cut>
      <Cut from={36.0} to={39.0} bg={BG}><SceneCTA from={36.0} to={39.0} word="PROMPT" typeAt={1.55} postIn={2.6} headline="Want in on the secret?" /></Cut>

      <EndCTA at={39.05} to={40.6} word="PROMPT" second="Get it immediately" y1={230} y2={335} />
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
