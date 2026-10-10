// Factory roofing reel (Hinglish). Style: "after" reference (cream floral bg + rounded card + motion graphics)
// with white / neon-green italic-serif captions (caption reference). Person on screen 3.0 s total.
// Run: node build.mjs -> index.html   (1080x1920, 24.94 s)
import { writeFileSync } from "node:fs";
const W = 1080, H = 1920, DUR = 24.94;
const CX = 90, CY = 170, CW = 900, CH = 1580, R = 60;

// ---- video layers (all muted; voice comes from assets/voice.m4a) ----
const V = [
  ["p0", "talk", 0, 1.2, 0], ["v1", "clip1", 1.2, 2.0, 0], ["v2", "clip2", 3.2, 2.35, 0],
  ["v3a", "clip3", 5.55, 1.07, 0.2], ["v3b", "clip3", 6.62, 1.48, 1.6],
  ["p1", "talk", 10.05, 0.8, 10.05], ["v4", "clip4", 10.85, 1.25, 0.5], ["v5", "clip5", 12.1, 1.5, 0.2],
  ["v6", "clip6", 15.55, 1.35, 0.6], ["v7a", "clip7", 18.15, 1.4, 0.0], ["v7b", "clip7", 19.55, 1.65, 2.0],
  ["v1b", "clip1", 21.2, 1.0, 2.0], ["v8", "clip8", 22.2, 1.74, 2.6, 0.8], ["p2", "talk", 23.94, 1.0, 23.94],
];
const src = k => (k === "talk" ? "assets/talk.mp4" : `assets/${k}.mp4`.replace("clip", "clip"));
const videoHtml = V.map(([id, k, st, du, ms, rate]) =>
  `<video id="${id}" class="clip vcard" src="${src(k)}" data-start="${st}" data-duration="${du}" data-media-start="${ms}"${rate ? ` data-playback-rate="${rate}"` : ""} data-track-index="2" muted playsinline></video>`).join("\n  ");

// ---- captions: lines of [kind, text]; kind w = white sans, g = green italic serif ----
const CAPS = [
  [0.10, 1.58, [["w", "Badi"], ["g", "factories"], ["w", "aur plants tayyar ho gaye,"]]],
  [1.88, 2.79, [["w", "par kya"], ["g", "sheet"], ["w", "sahi chuna?"]]],
  [3.21, 5.12, [["g", "Galat"], ["w", "roofing sheet poora"], ["g", "production"], ["w", "thap kar sakti hai."]]],
  [5.58, 6.46, [["w", "Sadharan sheet se"], ["g", "garmi"], ["w", "mein,"]]],
  [6.64, 7.88, [["g", "bhayankar"], ["w", "garmi hoti hai"]]],
  [8.12, 9.49, [["w", "barish mein"], ["g", "jangle leakage"], ["w", "ka dar"]]],
  [10.04, 10.45, [["w", "rehta hai."]]],
  [10.93, 11.80, [["w", "Nateeja—"], ["g", "mehngi"], ["w", "masheenein"]]],
  [12.12, 13.29, [["g", "kharab"], ["w", "aur har saal"], ["g", "maintenance"], ["w", "ka kharcha."]]],
  [13.81, 15.30, [["w", "Ek plant mein"], ["g", "ghatiya"], ["w", "sheet se bhari leakage hua"]]],
  [15.58, 16.52, [["w", "aur"], ["g", "lakho"], ["w", "ka maal barbad ho gaya."]]],
  [16.95, 17.80, [["w", "Iska pakka"], ["g", "solution"], ["w", "hai—"]]],
  [18.18, 19.28, [["g", "insulated"], ["g", "PUF panel"]]],
  [19.58, 20.79, [["w", "ya"], ["g", "UPVC sheets"], ["w", "lagwana."]]],
  [21.26, 22.03, [["w", "Factory roofing"], ["w", "ke liye"]]],
  [22.27, 22.75, [["w", "comment"], ["g", "karein"]]],
  [23.42, 24.58, [["w", "aur main"], ["g", "DM"], ["w", "mein jankari bhej dunga."]]],
];
const capHtml = CAPS.map((c, i) =>
  `<div id="cap${i}" class="cap clip" data-start="${c[0]}" data-duration="${(c[1] - c[0] + 0.2).toFixed(2)}" data-track-index="9">${c[2].map(([k, t], j) => `<div class="l ${k}" id="c${i}l${j}">${t}</div>`).join("")}</div>`).join("\n  ");

// flowers (8-petal) for the cream background
const flower = (c, o) => `<svg viewBox="0 0 120 120" class="fl"><g fill="${c}" opacity="${o}">${[0, 45, 90, 135].map(a => `<ellipse cx="60" cy="60" rx="14" ry="52" transform="rotate(${a} 60 60)"/>`).join("")}</g><circle cx="60" cy="60" r="12" fill="#fff" opacity=".7"/></svg>`;
const FL = [[-70, -50, 260, "#f2a58c", .55], [850, -20, 240, "#f0b3a0", .5], [-80, 620, 200, "#f2a58c", .4], [900, 880, 220, "#f6c0ae", .5], [-60, 1700, 280, "#f0b3a0", .55], [830, 1740, 260, "#f2a58c", .5], [880, 330, 120, "#e8643c", .35], [30, 1250, 110, "#e8643c", .3]];
const flHtml = FL.map(([x, y, s, c, o], i) => `<div id="fl${i}" class="abs" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px">${flower(c, o)}</div>`).join("");

// rain streaks (deterministic positions)
const rain = Array.from({ length: 34 }, (_, i) => `<i class="rd" id="rd${i}" style="left:${(i * 137) % 880 + 10}px;top:${((i * 211) % 700) + 120}px;height:${70 + (i % 4) * 25}px"></i>`).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<title>Factory Roofing</title>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:"Playfair Display";src:url("assets/fonts/playfair-display-latin-700-italic.woff2") format("woff2");font-weight:700;font-style:italic}
:root{--cream:#f4ede3;--ink:#1d1a17;--coral:#e8643c;--neon:#7dff1a}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:Inter,"Helvetica Neue",Arial,sans-serif}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:var(--cream)}
.clip{position:absolute}
.abs{position:absolute}
.fl{width:100%;height:100%;display:block}
#bg{left:0;top:0;width:${W}px;height:${H}px;background:radial-gradient(900px 700px at 20% 15%,#fff7ee,rgba(255,255,255,0) 70%),radial-gradient(900px 800px at 90% 90%,#f7d9cb,rgba(255,255,255,0) 70%),var(--cream)}
#cardbg{left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:${R}px;background:#e9dfd2;box-shadow:0 40px 90px rgba(120,60,30,.28),0 0 0 8px rgba(255,255,255,.7)}
.vcard{left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px;object-fit:cover;border-radius:${R}px}
.scn{left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:${R}px;overflow:hidden}
#shade{left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:${R}px;background:linear-gradient(180deg,rgba(0,0,0,0) 48%,rgba(0,0,0,.5) 100%);z-index:30;pointer-events:none}
/* captions (white-and-green reference) */
.cap{left:${CX + 20}px;width:${CW - 40}px;top:900px;height:560px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;text-align:center;z-index:40}
.l{white-space:nowrap}
.l.w{font-weight:600;font-size:56px;line-height:1.12;letter-spacing:-.01em;color:#fff;text-shadow:0 3px 18px rgba(0,0,0,.6),0 1px 2px rgba(0,0,0,.45)}
.l.g{font-family:"Playfair Display",serif;font-style:italic;font-weight:700;font-size:112px;line-height:1.02;color:var(--neon);margin:2px 0 6px;text-shadow:0 4px 22px rgba(0,0,0,.55),0 0 28px rgba(125,255,26,.25)}
#flash{left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:${R}px;background:#fff8ee;z-index:50;opacity:0;pointer-events:none}
.rd{position:absolute;width:3px;border-radius:2px;background:linear-gradient(180deg,rgba(190,225,255,0),rgba(190,225,255,.85))}
.sh{position:absolute}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <audio id="voice" src="assets/voice.m4a" data-start="0" data-duration="${DUR}" data-track-index="0"></audio>
  <div id="bg" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0"></div>
  ${flHtml}
  <div id="cardbg" class="clip" data-start="0" data-duration="${DUR}" data-track-index="1"></div>
  ${videoHtml}

  <!-- vector stand-ins: rain on the roof (8.1–10.05) -->
  <section id="sRain" class="clip scn" data-start="8.1" data-duration="1.95" data-track-index="3" style="background:linear-gradient(180deg,#16202c,#0b1118)">
    <svg class="abs" style="left:0;top:80px" width="${CW}" height="640" viewBox="0 0 900 640"><defs><linearGradient id="rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d98a3"/><stop offset=".5" stop-color="#d7dde3"/><stop offset="1" stop-color="#8d98a3"/></linearGradient></defs>
      <g transform="rotate(-9 450 320)">${Array.from({ length: 11 }, (_, i) => `<rect x="${-40 + i * 90}" y="120" width="90" height="420" fill="url(#rib)" stroke="#5c6670" stroke-width="2"/>`).join("")}</g></svg>
    ${rain}
    <div id="drip" class="abs" style="left:560px;top:690px;width:26px;height:36px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#9fd2ff"></div>
    <div id="rpl" class="abs" style="left:430px;top:1260px;width:300px;height:80px;border-radius:50%;border:5px solid rgba(159,210,255,.7)"></div>
  </section>

  <!-- vector stand-in: big leak into the plant (13.6–15.55) -->
  <section id="sLeak" class="clip scn" data-start="13.6" data-duration="1.95" data-track-index="3" style="background:linear-gradient(180deg,#1d2730,#0d1319)">
    <div class="abs" style="left:0;top:0;width:${CW}px;height:150px;background:linear-gradient(180deg,#59636d,#39424b)"></div>
    <div id="lk" class="abs" style="left:410px;top:150px;width:90px;height:1050px;background:linear-gradient(90deg,rgba(120,190,255,.55),rgba(190,230,255,.95),rgba(120,190,255,.55));border-radius:0 0 40px 40px;transform-origin:50% 0"></div>
    <div class="abs" style="left:90px;top:900px;width:260px;height:330px;background:#2c3742;border-radius:18px"></div>
    <div class="abs" style="left:590px;top:760px;width:230px;height:470px;background:#2c3742;border-radius:18px"></div>
    <div id="pud" class="abs" style="left:250px;top:1180px;width:400px;height:90px;border-radius:50%;background:rgba(150,205,255,.55)"></div>
    <div id="pud2" class="abs" style="left:320px;top:1196px;width:260px;height:56px;border-radius:50%;border:5px solid rgba(220,240,255,.8)"></div>
    <div id="warn" class="abs" style="left:640px;top:270px;width:150px;height:150px;border-radius:50%;background:var(--coral);color:#fff;font-weight:900;font-size:110px;line-height:150px;text-align:center">!</div>
  </section>

  <!-- vector stand-in: "solution" moment (16.9–18.15) -->
  <section id="sSol" class="clip scn" data-start="16.9" data-duration="1.25" data-track-index="3" style="background:linear-gradient(180deg,#f8efe4,#efd9c8)">
    <svg id="shield" class="abs" style="left:170px;top:260px" width="560" height="640" viewBox="0 0 560 640"><path d="M280 20 L520 110 V320 C520 470 420 570 280 620 C140 570 40 470 40 320 V110 Z" fill="#e8643c"/><path d="M280 60 L482 134 V320 C482 448 398 534 280 580 C162 534 78 448 78 320 V134 Z" fill="#ff8a62"/><path d="M170 330 L250 410 L400 240" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" id="tick" stroke-dasharray="520" stroke-dashoffset="0"/></svg>
  </section>

  <!-- SHIELD text sitting in the comment bubble of the phone clip -->
  <div id="shieldTxt" class="clip" data-start="22.95" data-duration="0.99" data-track-index="8" style="left:${CX + 150}px;top:790px;width:${CW - 300}px;height:150px;display:flex;align-items:center;justify-content:center;z-index:45">
    <span style="position:relative;font-family:Anton,Impact,sans-serif;font-weight:900;font-size:128px;line-height:1;color:#141210;letter-spacing:.03em;padding:0 18px"><i id="mk" style="position:absolute;left:0;right:0;bottom:10px;height:46px;background:var(--neon);z-index:-1;transform-origin:0 50%"></i>SHIELD</span>
  </div>

  <div id="shade" class="clip" data-start="0" data-duration="${DUR}" data-track-index="5"></div>
  <div id="flash" class="clip" data-start="0" data-duration="${DUR}" data-track-index="10"></div>
  ${capHtml}
</div>
<script>
const tl = gsap.timeline({ paused: true });
const E="power3.out", B="back.out(1.7)";
tl.set("#flash",{opacity:0},0);

// captions: lines build up; white lines fade from grey, green italic lines pop with a slight scale
${CAPS.map((c, i) => c[2].map((l, j) => {
  const t0 = c[0] + j * Math.min(0.28, (c[1] - c[0]) / (c[2].length + 1));
  return l[0] === "g"
    ? `tl.from("#c${i}l${j}",{opacity:0,y:26,scale:.82,filter:"blur(8px)",duration:.3,ease:B},${t0.toFixed(2)});`
    : `tl.from("#c${i}l${j}",{opacity:0,y:18,filter:"blur(7px)",color:"#9aa0a6",duration:.28,ease:E},${t0.toFixed(2)});`;
}).join("")).join("\n")}
${CAPS.map((c, i) => `tl.to("#cap${i}",{opacity:0,duration:.1},${(c[1] + 0.1).toFixed(2)});`).join("")}

// soft cream flash on every cut
[1.2,3.2,5.55,6.62,8.1,10.05,10.85,12.1,13.6,15.55,16.9,18.15,19.55,21.2,22.2,23.94].forEach(t=>{
  tl.set("#flash",{opacity:0},t-0.08);tl.to("#flash",{opacity:.4,duration:.07,ease:"none"},t-0.07);tl.to("#flash",{opacity:0,duration:.13,ease:"power1.out"},t);});

// background flowers drift
for(let i=0;i<8;i++){tl.to("#fl"+i,{rotate:(i%2?1:-1)*35,duration:${DUR},ease:"none"},0);}

// slow push-ins keep clips alive; person windows get a gentle one too
["p0","v1","v2","v4","v5","v6","v7a","v7b","v1b"].forEach((id,i)=>{const el=document.getElementById(id);const st=parseFloat(el.getAttribute("data-start")),du=parseFloat(el.getAttribute("data-duration"));
  tl.fromTo("#"+id,{scale:1.0},{scale:1.05,duration:du,ease:"none"},st);});
tl.fromTo("#p1",{scale:1.05},{scale:1.0,duration:0.8,ease:"none"},10.05);
tl.fromTo("#p2",{scale:1.0},{scale:1.06,duration:1.0,ease:"none"},23.94);

// rain scene
for(let i=0;i<34;i++){tl.fromTo("#rd"+i,{y:-60,opacity:0},{y:420,opacity:1,duration:.38,ease:"none",repeat:4},8.1+(i%7)*0.04);}
tl.fromTo("#drip",{y:0,opacity:0},{y:560,opacity:1,duration:.7,ease:"power1.in",repeat:1},8.4);
tl.fromTo("#rpl",{scale:.2,opacity:0},{scale:1.3,opacity:.9,duration:.6,ease:E,repeat:1},8.95);

// leak scene
tl.fromTo("#lk",{scaleY:0},{scaleY:1,duration:.5,ease:"power2.in"},13.7);
tl.fromTo("#pud",{scaleX:.2,opacity:0},{scaleX:1,opacity:1,duration:.9,ease:E},14.1);
tl.fromTo("#pud2",{scale:.3,opacity:.9},{scale:1.5,opacity:0,duration:.7,ease:"power1.out",repeat:1},14.3);
tl.from("#warn",{scale:0,rotate:-30,duration:.35,ease:B},14.2);

// solution scene
tl.from("#shield",{scale:.3,opacity:0,duration:.5,ease:B},16.95);
tl.fromTo("#tick",{strokeDashoffset:520},{strokeDashoffset:0,duration:.4,ease:"power2.out"},17.4);

// SHIELD in the phone's comment bubble
tl.from("#shieldTxt",{scale:.5,opacity:0,duration:.3,ease:B},22.95);
tl.fromTo("#mk",{scaleX:0},{scaleX:1,duration:.3,ease:E},23.1);

window.__timelines["main"]=tl;
</script></body></html>`;
writeFileSync("index.html", html);
console.log("index.html", html.length);
