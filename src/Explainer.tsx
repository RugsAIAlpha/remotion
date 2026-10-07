import React from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {DownArrow, EndCTA} from "./cta";
import {Cut} from "./collage";
import {SceneCTA, SceneCost, SceneEyes, SceneError, SceneJob, SceneNoTime, SceneTime} from "./three/Scenes3D";
import {Subtitles} from "./Subtitles";
import {C, s2f, TOTAL_FRAMES} from "./theme";
import {ease} from "./util";

/* ------------------------------------------------------------------ timeline
 * Seconds, synced to the pauses detected in the voice track (see Subtitles.tsx).
 * One paper-collage beat per spoken idea, with matching sound effects.
 */
// Talking-head shots alternate with full-screen cutaway clips (see <Cut> below).
// Between cutaways the framing jump-cuts between wide and a slightly tighter crop.
const ZOOM: {from: number; to: number; a: number; b: number}[] = [
  {from: 0, to: 6.0, a: 1.0, b: 1.04},
  {from: 6.0, to: 10.2, a: 1.12, b: 1.16},
  {from: 10.2, to: 14.6, a: 1.0, b: 1.05},
  {from: 14.6, to: 17.9, a: 1.13, b: 1.17},
  {from: 17.9, to: 21.2, a: 1.0, b: 1.04},
  {from: 21.2, to: 26.9, a: 1.1, b: 1.14},
  {from: 26.9, to: 30, a: 1.0, b: 1.05},
];

// Kept deliberately sparse: roughly one quiet cue per beat.
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 1.5, file: "tear", vol: 0.5},                                    // 1 job / business
  {at: 5.0, file: "stamp", vol: 0.6},                                   // 2 error stamp
  {at: 7.8, file: "tick", vol: 0.3}, {at: 8.8, file: "tock", vol: 0.3}, {at: 9.8, file: "tick", vol: 0.3}, // 3 clock
  {at: 13.25, file: "slam", vol: 0.5},                                  // 4 3X
  {at: 15.6, file: "hit", vol: 0.45},                                   // 5 not skill
  {at: 18.5, file: "scan", vol: 0.3},                                   // 6 eyes on site
  {at: 25.1, file: "key", vol: 0.35}, {at: 25.3, file: "key", vol: 0.35}, {at: 25.5, file: "key", vol: 0.35}, // 7 typing
  {at: 26.95, file: "chime", vol: 0.5},                                 // 7 notification
];

const SourceVideo: React.FC = () => <OffthreadVideo src={staticFile("source.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(1.05)"}} />;

const Zoom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const z = ZOOM.find((s) => frame >= s2f(s.from) && frame < s2f(s.to)) ?? ZOOM[ZOOM.length - 1];
  const scale = interpolate(frame, [s2f(z.from), s2f(z.to)], [z.a, z.b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: "50% 900px"}}>{children}</AbsoluteFill>;
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

export const Explainer: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Zoom>
        <SourceVideo />
      </Zoom>

      <Cut from={1.5} to={3.9}><SceneJob from={1.5} to={3.9} /></Cut>
      <Cut from={4.0} to={6.0}><SceneError from={4.0} to={6.0} /></Cut>
      <Cut from={7.3} to={10.1}><SceneTime from={7.3} to={10.1} /></Cut>
      <Cut from={12.4} to={14.5}><SceneCost from={12.4} to={14.5} /></Cut>
      <Cut from={15.5} to={17.1}><SceneNoTime from={15.5} to={17.1} /></Cut>
      <Cut from={17.9} to={21.0}><SceneEyes from={17.9} to={21.0} /></Cut>
      <Cut from={24.4} to={26.9}><SceneCTA from={24.4} to={26.9} /></Cut>
      <EndCTA at={26.95} to={29.44} />
      <DownArrow at={27.4} to={29.44} />

      <Subtitles />

      <Audio src={staticFile("audio/voice.wav")} volume={1} />
      <Audio src={staticFile("audio/music.wav")} volume={(f) => 0.06 * interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES], [1, 0], {extrapolateLeft: "clamp"})} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s2f(s.at)} durationInFrames={s2f(2)} layout="none">
          <Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
