import {Config} from "@remotion/cli/config";
import fs from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(16);

// In the sandbox Remotion cannot download its own Chrome; use the pre-installed headless shell if present.
const shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(shell)) Config.setBrowserExecutable(shell);
