export const FPS = 25;
export const W = 1080;
export const H = 1920;
export const TOTAL_FRAMES = 735; // source clip = 735 frames @ 25fps (29.4s)
export const s2f = (s: number) => Math.round(s * FPS);

export const C = {
  navy: "#0E1B3D",
  navy2: "#1B2F66",
  blue: "#6C8CFF",
  orange: "#F26A1B",
  amber: "#F26A1B", // accent (kept as alias)
  red: "#D6362B",
  green: "#2FA866",
  cream: "#F6F0E4",
  white: "#F6F0E4",
  ink: "#0A0F1E",
};

export const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const BIG = "Anton, Impact, 'Arial Narrow', sans-serif";
export const SERIF = "'Playfair Display', Georgia, serif";
