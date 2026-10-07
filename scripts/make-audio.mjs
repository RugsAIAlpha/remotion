// Synthesises the music bed and all sound effects as 48k mono WAV files (no external assets needed).
import fs from "node:fs";
import path from "node:path";

const SR = 48000;
const OUT = path.resolve("public/audio");
fs.mkdirSync(OUT, {recursive: true});

let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;
const buf = (sec) => new Float32Array(Math.floor(sec * SR));
const env = (t, a, d) => Math.min(t / a, 1) * Math.exp(-t / d);

function writeWav(name, data, gain = 0.9) {
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const k = peak > 0 ? gain / peak : 1;
  const b = Buffer.alloc(44 + data.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i] * k)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, name), b);
}

// one-pole low-pass helper
const lp = (x, fc) => { const a = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };

// whoosh: band-passed noise with rising then falling cutoff
function whoosh(sec = 0.6, up = true) {
  const o = buf(sec); let y1 = 0, y2 = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / o.length;
    const fc = (up ? 300 + 5000 * t : 5300 - 5000 * t) ;
    const a = 1 - Math.exp(-2 * Math.PI * fc / SR);
    y1 += a * (rnd() - y1); y2 += a * (y1 - y2);
    o[i] = (y1 - y2) * 6 * Math.sin(Math.PI * t) ** 1.5;
  }
  return o;
}
// pop: quick pitch-dropping sine
function pop(f0 = 700, f1 = 180, sec = 0.18) {
  const o = buf(sec); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; const f = f1 + (f0 - f1) * Math.exp(-t * 40);
    ph += 2 * Math.PI * f / SR; o[i] = Math.sin(ph) * env(t, 0.002, 0.05);
  }
  return o;
}
// impact: sub boom + noise burst
function hit(sec = 1.2) {
  const o = buf(sec); let ph = 0; const n = lp(Array.from({length: o.length}, rnd), 2500);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; const f = 40 + 90 * Math.exp(-t * 14);
    ph += 2 * Math.PI * f / SR;
    o[i] = Math.sin(ph) * env(t, 0.003, 0.35) + n[i] * 0.8 * env(t, 0.001, 0.08);
  }
  return o;
}
function tick(hi = true) {
  const o = buf(0.08);
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = (Math.sin(2 * Math.PI * (hi ? 2200 : 1500) * t) * 0.6 + rnd() * 0.4) * env(t, 0.0005, 0.012); }
  return o;
}
function ding(f = 1318, sec = 1.1) {
  const o = buf(sec);
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t)) * env(t, 0.002, 0.3); }
  return o;
}
function alarm(sec = 0.7) { // two-tone warning
  const o = buf(sec); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; const f = Math.floor(t / 0.175) % 2 ? 620 : 880; ph += 2 * Math.PI * f / SR;
    const saw = (Math.sin(ph) + 0.3 * Math.sin(2 * ph) + 0.15 * Math.sin(3 * ph));
    o[i] = saw * Math.min(1, t / 0.01) * Math.min(1, (sec - t) / 0.05);
  }
  return o;
}
function riser(sec = 1.2) {
  const o = buf(sec); let ph = 0, y = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / o.length; const f = 200 * Math.pow(12, t); ph += 2 * Math.PI * f / SR;
    const a = 1 - Math.exp(-2 * Math.PI * (500 + 6000 * t) / SR); y += a * (rnd() - y);
    o[i] = (Math.sin(ph) * 0.35 + y * 1.2) * t ** 1.5;
  }
  return o;
}
function crack(sec = 0.45) {
  const o = buf(sec);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; const burst = (Math.sin(t * 90) > 0.2 ? 1 : 0.15);
    o[i] = rnd() * env(t, 0.0005, 0.06) * burst;
  }
  return o;
}
function typeKey() { const o = buf(0.04); for (let i = 0; i < o.length; i++) o[i] = rnd() * env(i / SR, 0.0003, 0.007); return o; }
function scan(sec = 1.4) { // sci-fi sweep
  const o = buf(sec); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / o.length; const f = 500 + 1400 * (0.5 - 0.5 * Math.cos(Math.PI * 4 * t)); ph += 2 * Math.PI * f / SR;
    o[i] = Math.sin(ph) * 0.5 * Math.sin(Math.PI * t);
  }
  return o;
}
function cash(sec = 0.9) { // cha-ching: two bright bells
  const a = ding(2093, sec), b = ding(3136, sec); const o = buf(sec);
  const off = Math.floor(0.09 * SR);
  for (let i = 0; i < o.length; i++) o[i] = a[i] * 0.7 + (i >= off ? b[i - off] : 0);
  return o;
}
function check() { const o = buf(0.25); for (let i = 0; i < o.length; i++) { const t = i / SR; const f = t < 0.08 ? 880 : 1320; o[i] = Math.sin(2 * Math.PI * f * t) * env(t, 0.003, 0.09); } return o; }

// ---- music bed: 29.5 s, 100 BPM, A minor "tension/corporate" pulse -----------------------------
function music(sec = 30) {
  const o = buf(sec); const bpm = 100, beat = 60 / bpm;
  const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am F C G (triad roots)
  const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; const bar = Math.floor(t / (beat * 4)); const chord = prog[bar % 4];
    // soft pad
    let pad = 0; for (const n of chord) pad += Math.sin(2 * Math.PI * mtof(n) * t) + 0.5 * Math.sin(2 * Math.PI * mtof(n) * 1.003 * t);
    pad *= 0.12;
    // sub bass on beat 1 & 3
    const bt = (t % (beat * 2)); const bass = Math.sin(2 * Math.PI * mtof(chord[0] - 24) * t) * env(bt, 0.01, 0.5) * 0.9;
    // plucked arpeggio, 8th notes
    const st = t % (beat / 2); const step = Math.floor(t / (beat / 2));
    const an = chord[[0, 1, 2, 1][step % 4]] + 12; const arp = Math.sin(2 * Math.PI * mtof(an) * t) * env(st, 0.003, 0.12) * 0.35;
    o[i] = pad + bass * 0.55 + arp;
  }
  // kick + hat
  for (let b = 0; b * beat < sec; b++) {
    const s = Math.floor(b * beat * SR); let ph = 0;
    for (let i = 0; i < 0.3 * SR && s + i < o.length; i++) { const t = i / SR; ph += 2 * Math.PI * (45 + 90 * Math.exp(-t * 30)) / SR; o[s + i] += Math.sin(ph) * env(t, 0.002, 0.1) * 0.7; }
    const h = s + Math.floor(beat / 2 * SR);
    for (let i = 0; i < 0.05 * SR && h + i < o.length; i++) o[h + i] += rnd() * env(i / SR, 0.0005, 0.012) * 0.12;
  }
  // fade in/out
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] *= Math.min(1, t / 0.8) * Math.min(1, (sec - t) / 1.5); }
  return o;
}

const files = {
  "whoosh.wav": whoosh(0.6, true), "whoosh-out.wav": whoosh(0.5, false), "pop.wav": pop(), "pop-hi.wav": pop(1100, 300, 0.14),
  "hit.wav": hit(), "tick.wav": tick(true), "tock.wav": tick(false), "ding.wav": ding(), "alarm.wav": alarm(),
  "riser.wav": riser(), "crack.wav": crack(), "key.wav": typeKey(), "scan.wav": scan(), "cash.wav": cash(), "check.wav": check(),
};
for (const [n, d] of Object.entries(files)) writeWav(n, d, n === "hit.wav" ? 1 : 0.85);
writeWav("music.wav", music(30), 0.8);
console.log("wrote", Object.keys(files).length + 1, "audio files to", OUT);
