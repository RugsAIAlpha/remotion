import React from "react";
import {Composition} from "remotion";
import {Explainer} from "./Explainer";
import {FPS, H, TOTAL_FRAMES, W} from "./theme";

export const Root: React.FC = () => (
  <Composition id="ManageExplainer" component={Explainer} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
