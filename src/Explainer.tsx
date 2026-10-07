import React from "react";
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {DownArrow} from "./cta";
import {SceneCTA, SceneCost, SceneEyes, SceneError, SceneJob, SceneNoTime, SceneTime} from "./scenes";
import {Subtitles} from "./Subtitles";
import {C, s2f, TOTAL_FRAMES} from "./theme";
import {ease} from "./util";

/* ------------------------------------------------------------------ timeline
 * Seconds, synced to the pauses detected in the voice track (see Subtitles.tsx).
 * One paper-collage beat per spoken idea, with matching sound effects.
 */
const ZOOM: {from: number; to: number; a: number; b: number}[] = [
  {from: 0, to: 3.9, a: 1.0, b: 1.04},
  {from: 3.9, to: 10.3, a: 1.03, b: 1.08},
  {from: 10.3, to: 17.15, a: 1.0, b: 1.05},
  {from: 17.15, to: 22.2, a: 1.05, b: 1.1},
  {from: 22.2, to: 30, a: 1.0, b: 1.06},
];

// Kept deliberately sparse: roughly one quiet cue per beat.
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.08, file: "tear", vol: 0.5},                                   // 1 job / business
  {at: 5.0, file: "stamp", vol: 0.6},                                   // 2 error stamp
  {at: 7.5, file: "tick", vol: 0.3}, {at: 8.5, file: "tock", vol: 0.3}, {at: 9.5, file: "tick", vol: 0.3}, // 3 clock
  {at: 13.25, file: "slam", vol: 0.5},                                  // 4 3X
  {at: 14.7, file: "hit", vol: 0.45},                                   // 5 not skill
  {at: 18.4, file: "scan", vol: 0.3},                                   // 6 eyes on site
  {at: 25.1, file: "key", vol: 0.35}, {at: 25.3, file: "key", vol: 0.35}, {at: 25.5, file: "key", vol: 0.35}, // 7 typing
  {at: 26.7, file: "chime", vol: 0.5},                                  // 7 notification
];

const SourceVideo: React.FC = () => <OffthreadVideo src={staticFile("source.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(1.05)"}} />;

const Zoom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const z = ZOOM.find((s) => frame >= s2f(s.from) && frame < s2f(s.to)) ?? ZOOM[ZOOM.length - 1];
  const scale = interpolate(frame, [s2f(z.from), s2f(z.to)], [z.a, z.b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: "50% 900px"}}>{children}</AbsoluteFill>;
};

/** Navy wash over the curtain so the paper cut-outs and labels pop. */
const Wash: React.FC = () => (
  <>
    <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(14,27,61,.8) 0%, rgba(14,27,61,.6) 38%, rgba(14,27,61,.15) 62%, rgba(14,27,61,0) 74%)"}} />
    <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(14,27,61,.7) 0%, rgba(14,27,61,0) 22%)"}} />
  </>
);

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
        <Wash />
      </Zoom>

      <SceneJob to={3.85} />
      <SceneError from={3.96} to={6.4} />
      <SceneTime from={6.7} to={11.7} />
      <SceneCost from={12.35} to={14.5} />
      <SceneNoTime from={14.58} to={17.15} />
      <SceneEyes from={17.55} to={22.1} />
      <SceneCTA from={22.2} to={29.44} />
      <DownArrow at={26.9} to={29.44} />

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
