import * as THREE from "three";

/** Draws a canvas and wraps it as an sRGB texture. */
export const makeTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Greyscale noise used as a leather / concrete bump map. */
export const noiseTex = (size = 256, seed = 1, contrast = 90) =>
  makeTex(size, size, (c, w, h) => {
    const img = c.createImageData(w, h);
    let s = seed;
    for (let i = 0; i < w * h; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const v = 128 + ((s / 2 ** 32) - 0.5) * contrast;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  });
