import React from "react";
import {Composition} from "remotion";
import {Explainer} from "./Explainer";
import {Explainer2, FRAMES_2} from "./Explainer2";
import {FPS, H, TOTAL_FRAMES, W} from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="ManageExplainer" component={Explainer} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="PromptExplainer" component={Explainer2} durationInFrames={FRAMES_2} fps={FPS} width={W} height={H} />
  </>
);
