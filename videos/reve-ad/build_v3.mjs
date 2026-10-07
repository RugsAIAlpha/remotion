// v3: editorial paper-cutout style (reference 2). Person on screen 4.0 s total, footage ungraded.
// Run: node build_v3.mjs  -> index.html
import { writeFileSync } from "node:fs";

const W = 1080, H = 1920, DUR = 36;

const CAPS = [
  [0.0, 2.63, "This *AI* tool does something no one talks about"],
  [3.16, 3.89, "and honestly,"],
  [4.36, 6.0, "it should *scare* your designer a little"],
  [6.81, 7.71, "You know that feeling,"],
  [8.25, 9.42, "you have a clear *vision*,"],
  [10.0, 11.48, "you *type* it into an AI tool,"],
  [12.03, 13.08, "and what comes out"],
  [13.61, 15.34, "looks *nothing like* what you imagine"],
  [16.18, 16.78, "*Wrong* colors,"],
  [17.31, 17.94, "*broken* text,"],
  [18.54, 19.04, "*generic* feel,"],
  [19.62, 21.18, "so you either redo it manually"],
  [21.57, 22.12, "or just *settle*"],
  [22.88, 23.42, "*Reve* image"],
  [23.64, 25.07, "actually gets what *you mean*"],
  [25.76, 26.42, "*Studio* visuals,"],
  [27.01, 28.0, "text inside images"],
  [28.21, 29.23, "that's actually *readable*,"],
  [29.95, 31.39, "all of it in under *20 seconds*"],
  [31.96, 32.48, "And it's *free*"],
  [33.25, 33.74, "*Comment* “Reve”"],
  [34.03, 35.6, "and I'll send it *straight to your DM*"],
];

// person windows = 1.4 + 1.2 + 1.4 = 4.0 s (source time = timeline time)
const PERSON = [[0, 1.4], [19.6, 1.2], [34.6, 1.4]];
const onPerson = t => PERSON.some(([a, d]) => t >= a && t < a + d + 0.6);

const capHtml = CAPS.map((c, i) => {
  let acc = false;
  const segs = [];
  for (const w of c[2].split(" ")) {
    let t = w, a = acc;
    if (t.startsWith("*")) { acc = true; a = true; t = t.slice(1); }
    if (/\*[,.!?]?$/.test(t)) { acc = false; t = t.replace("*", ""); }
    if (!segs.length || segs[segs.length - 1].a !== a) segs.push({ a, words: [] });
    segs[segs.length - 1].words.push(t);
  }
  const blocks = segs.map(g => `<div class="${g.a ? "kw" : "sup"}">${g.words.map(t => `<span class="w">${t}</span>`).join(" ")}</div>`).join("");
  const end = Math.min(c[1] + 0.25, DUR);
  const cls = onPerson(c[0]) ? " onp" : "";
  return `<div id="cap${i}" class="cap clip${cls}" data-start="${c[0]}" data-duration="${(end - c[0]).toFixed(2)}" data-track-index="9">${blocks}</div>`;
}).join("\n  ");

const personHtml = PERSON.map((p, i) =>
  `<video id="p${i}" class="clip person" src="assets/talk.mp4" data-start="${p[0]}" data-duration="${p[1]}" data-media-start="${p[0]}" data-track-index="1" muted playsinline></video>`
).join("\n  ");

// ---- cutout object library (flat vector, soft shadow via CSS) ----
const OBJ = {
  monitor: `<svg viewBox="0 0 520 440"><rect x="10" y="10" width="500" height="320" rx="22" fill="#2b2a27"/><rect x="34" y="34" width="452" height="272" rx="10" fill="#f6f5ef"/><rect x="60" y="62" width="150" height="18" rx="9" fill="#cfcdc2"/><rect x="60" y="100" width="400" height="180" rx="10" fill="none" stroke="#bdbaad" stroke-width="3" stroke-dasharray="10 9"/><rect x="236" y="330" width="48" height="60" fill="#2b2a27"/><rect x="150" y="388" width="220" height="30" rx="15" fill="#2b2a27"/></svg>`,
  sticky: c => `<svg viewBox="0 0 140 140"><path d="M6 6h128v100l-34 34H6z" fill="${c}"/><path d="M100 140v-34h34z" fill="rgba(0,0,0,.16)"/></svg>`,
  pencil: `<svg viewBox="0 0 520 80"><path d="M40 10h400l60 30-60 30H40z" fill="#f2c94c"/><path d="M440 10l60 30-60 30z" fill="#f3dcc0"/><path d="M482 30l18 10-18 10z" fill="#2b2a27"/><rect x="0" y="10" width="40" height="60" rx="8" fill="#e58a8a"/><rect x="40" y="10" width="14" height="60" fill="#b9b9b2"/></svg>`,
  head: `<svg viewBox="0 0 520 640"><defs><clipPath id="hc"><path d="M260 20C130 20 50 120 50 250c0 90 40 130 40 200v160h230v-70h70V440c70-50 130-80 130-190C520 120 390 20 260 20z" transform="translate(0,0) scale(.92) translate(20,0)"/></clipPath><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a6a"/><stop offset=".6" stop-color="#ff5d7a"/><stop offset="1" stop-color="#6b4dff"/></linearGradient></defs><g clip-path="url(#hc)"><rect width="520" height="640" fill="url(#sk)"/><circle cx="270" cy="210" r="70" fill="#ffe27a"/><path d="M0 400L150 240l110 130 120-170 140 200v240H0z" fill="#2b1650"/></g><path d="M260 20C130 20 50 120 50 250c0 90 40 130 40 200v160h230v-70h70V440c70-50 130-80 130-190C520 120 390 20 260 20z" transform="scale(.92) translate(20,0)" fill="none" stroke="#2b2a27" stroke-width="9"/></svg>`,
  card: (bg, inner) => `<div class="cardbox" style="background:${bg}">${inner}</div>`,
  bottle: `<svg viewBox="0 0 260 520"><ellipse cx="130" cy="492" rx="100" ry="18" fill="rgba(0,0,0,.18)"/><rect x="85" y="150" width="90" height="330" rx="26" fill="#fbfaf6"/><rect x="108" y="90" width="44" height="68" rx="8" fill="#2b2a27"/><rect x="100" y="270" width="60" height="86" rx="8" fill="#ff5d3a"/></svg>`,
  bubble: `<svg viewBox="0 0 300 260"><path d="M20 20h260v170H130l-60 54v-54H20z" fill="#fff" stroke="#2b2a27" stroke-width="8" stroke-linejoin="round"/><circle cx="90" cy="105" r="14" fill="#2b2a27"/><circle cx="150" cy="105" r="14" fill="#2b2a27"/><circle cx="210" cy="105" r="14" fill="#2b2a27"/></svg>`,
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>Reve Ad</title>
<script src="assets/gsap.min.js"></script>
<style>
:root{--paper:#e9e7de;--ink:#2d2c28;--grey:#7a7971;--coral:#ff5d3a;--night:#16151a}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:Inter,"Helvetica Neue",Arial,sans-serif}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#000}
.clip{position:absolute}
.person{left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.scene{left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;
  background-color:var(--paper);
  background-image:linear-gradient(rgba(60,58,50,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(60,58,50,.07) 1px,transparent 1px),radial-gradient(900px 900px at 50% 45%,rgba(255,255,255,.55),rgba(0,0,0,0) 70%);
  background-size:54px 54px,54px 54px,100% 100%}
.dark{background-color:var(--night);background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:54px 54px}
.abs{position:absolute}
.cut{position:absolute;filter:drop-shadow(0 26px 26px rgba(48,44,30,.30))}
.cut svg{display:block;width:100%;height:100%}
.hair{position:absolute;height:2px;background:rgba(45,44,40,.55);transform-origin:0 50%}
.cardbox{width:100%;height:100%;border-radius:26px;overflow:hidden;position:relative}
/* captions: small light line + bold caps keyword */
.cap{left:60px;width:960px;top:1400px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:50}
.cap.onp{top:1400px}
.cap .sup,.cap .kw{display:flex;flex-wrap:wrap;justify-content:center;gap:0 14px}
.cap .sup .w{font-weight:500;font-size:56px;line-height:1.2;letter-spacing:-.005em;color:#6d6c64}
.cap .kw .w{font-weight:800;font-size:124px;line-height:1.02;letter-spacing:.015em;text-transform:uppercase;color:#2d2c28}
.cap.onp .sup .w{color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.cap.onp .kw .w{color:#fff;text-shadow:0 3px 18px rgba(0,0,0,.6)}
.cap.dk .sup .w{color:#b9b8ae}.cap.dk .kw .w{color:#f4f3ec}
#flash{left:0;top:0;width:${W}px;height:${H}px;z-index:60;background:#f5f4ee;opacity:0;pointer-events:none}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">

  <audio id="voice" src="assets/voice.m4a" data-start="0" data-duration="${DUR}" data-track-index="0"></audio>
  ${personHtml}

  <!-- S1 1.4–6.5 designer -->
  <section id="s1" class="clip scene" data-start="1.4" data-duration="5.1" data-track-index="2">
    <div id="s1m" class="cut" style="left:150px;top:210px;width:780px;height:660px">${OBJ.monitor}</div>
    <div id="s1p" class="cut" style="left:90px;top:960px;width:560px;height:90px;transform:rotate(-8deg)">${OBJ.pencil}</div>
    <div id="s1a" class="cut" style="left:60px;top:150px;width:170px;height:170px">${OBJ.sticky("#ffd84d")}</div>
    <div id="s1b" class="cut" style="left:840px;top:120px;width:170px;height:170px">${OBJ.sticky("#ff9ab0")}</div>
    <div id="s1c" class="cut" style="left:880px;top:880px;width:140px;height:140px">${OBJ.sticky("#9be7c6")}</div>
    <div id="s1h1" class="hair" style="left:0;top:170px;width:1400px;transform:rotate(14deg)"></div>
  </section>

  <!-- S2 6.5–12.0 vision -> prompt -->
  <section id="s2" class="clip scene" data-start="6.5" data-duration="5.5" data-track-index="2">
    <div id="s2h" class="cut" style="left:250px;top:120px;width:580px;height:710px">${OBJ.head}</div>
    <div id="s2p" class="cut" style="left:90px;top:860px;width:900px;height:260px">${OBJ.card("#fff", `<div style="padding:40px 46px"><div style="font-weight:700;font-size:24px;letter-spacing:.16em;color:#9a988d;text-transform:uppercase">Prompt</div><div id="s2type" style="margin-top:20px;font-size:48px;font-weight:600;line-height:1.2;color:#2d2c28;min-height:130px"></div></div>`)}</div>
    <div id="s2h1" class="hair" style="left:-100px;top:1000px;width:1400px;transform:rotate(-9deg)"></div>
  </section>

  <!-- S3 12.0–16.0 head vs result -->
  <section id="s3" class="clip scene" data-start="12.0" data-duration="4.0" data-track-index="2">
    <div id="s3a" class="cut" style="left:70px;top:150px;width:440px;height:760px">${OBJ.card("linear-gradient(#ff9a6a,#ff5d7a 55%,#6b4dff)", `<svg viewBox="0 0 440 760"><circle cx="220" cy="270" r="84" fill="#ffe27a"/><path d="M0 500L120 360l100 110 100-150 120 180v310H0z" fill="#2b1650"/><rect x="60" y="610" width="320" height="30" rx="15" fill="#fff"/></svg>`)}</div>
    <div id="s3b" class="cut" style="left:570px;top:150px;width:440px;height:760px">${OBJ.card("#a9a79c", `<svg viewBox="0 0 440 760"><ellipse cx="240" cy="290" rx="130" ry="64" fill="#7d7b72"/><path d="M0 520q110-80 200 20t240-40v260H0z" fill="#6f6d65"/><text x="36" y="640" font-family="Arial" font-weight="900" font-size="54" fill="#3a3935" transform="rotate(-4 36 640)">COFFE SH0P</text></svg>`)}</div>
    <div id="s3l1" class="abs" style="left:70px;top:940px;width:440px;text-align:center;font-weight:700;font-size:28px;letter-spacing:.16em;text-transform:uppercase;color:#6d6c64">In your head</div>
    <div id="s3l2" class="abs" style="left:570px;top:940px;width:440px;text-align:center;font-weight:700;font-size:28px;letter-spacing:.16em;text-transform:uppercase;color:#6d6c64">What you got</div>
  </section>

  <!-- S4 16.0–19.6 three problems -->
  <section id="s4" class="clip scene dark" data-start="16.0" data-duration="3.6" data-track-index="2">
    <div id="s4a" class="cut" style="left:70px;top:120px;width:940px;height:300px">${OBJ.card("#1f1e25", `<div style="padding:34px 40px"><div style="font-weight:700;font-size:26px;letter-spacing:.16em;color:#ff7a5c">01 · WRONG COLORS</div><div style="display:flex;margin-top:30px;height:150px"><i style="flex:1;background:#00e5a8"></i><i style="flex:1;background:#ff2bd6"></i><i style="flex:1;background:#fff200"></i><i style="flex:1;background:#2f6bff"></i><i style="flex:1;background:#ff7a00"></i></div></div>`)}</div>
    <div id="s4b" class="cut" style="left:70px;top:460px;width:940px;height:300px">${OBJ.card("#1f1e25", `<div style="padding:34px 40px"><div style="font-weight:700;font-size:26px;letter-spacing:.16em;color:#ff7a5c">02 · BROKEN TEXT</div><div id="s4g" style="margin-top:28px;font-weight:900;font-size:92px;color:#fff;white-space:nowrap">G10B4L C0FFEE</div></div>`)}</div>
    <div id="s4c" class="cut" style="left:70px;top:800px;width:940px;height:300px">${OBJ.card("#1f1e25", `<div style="padding:34px 40px"><div style="font-weight:700;font-size:26px;letter-spacing:.16em;color:#ff7a5c">03 · GENERIC FEEL</div><div style="display:flex;gap:24px;margin-top:30px"><i style="width:260px;height:150px;background:#8b8f96;border-radius:14px"></i><i style="width:260px;height:150px;background:#8b8f96;border-radius:14px"></i><i style="width:260px;height:150px;background:#8b8f96;border-radius:14px"></i></div></div>`)}</div>
  </section>

  <!-- S4b 20.8–22.7 settle -->
  <section id="s4x" class="clip scene" data-start="20.8" data-duration="1.9" data-track-index="2">
    <div id="s4x1" class="cut" style="left:200px;top:260px;width:680px;height:420px;transform:rotate(-4deg)">${OBJ.card("#bdbbb0", `<div style="padding:50px;font-weight:800;font-size:90px;color:#85837a">meh.</div>`)}</div>
    <div id="s4x2" class="cut" style="left:230px;top:380px;width:680px;height:420px;transform:rotate(3deg)">${OBJ.card("#cfcdc3", `<div style="padding:50px;font-weight:800;font-size:90px;color:#6f6d65">good enough</div>`)}</div>
    <div id="s4x3" class="cut" style="left:700px;top:760px;width:240px;height:240px">${OBJ.sticky("#ffd84d")}</div>
  </section>

  <!-- S5 22.7–25.8 reveal -->
  <section id="s5" class="clip scene" data-start="22.7" data-duration="3.1" data-track-index="2">
    <div id="s5w" class="abs" style="left:0;top:420px;width:${W}px;text-align:center;font-weight:900;font-size:300px;letter-spacing:-.05em;color:#2d2c28">Reve</div>
    <div id="s5s" class="abs" style="left:0;top:760px;width:${W}px;text-align:center;font-weight:600;font-size:40px;letter-spacing:.3em;text-transform:uppercase;color:#7a7971">AI image generator</div>
    <div id="s5l" class="hair" style="left:340px;top:850px;width:400px"></div>
  </section>

  <!-- S6 25.8–29.6 posters -->
  <section id="s6" class="clip scene" data-start="25.8" data-duration="3.8" data-track-index="2">
    <div id="s6a" class="cut" style="left:50px;top:130px;width:460px;height:640px">${OBJ.card("linear-gradient(160deg,#ffd9c4,#ff9a6a)", `<div style="position:absolute;inset:0">${OBJ.bottle}</div>`)}</div>
    <div id="s6b" class="cut" style="left:570px;top:130px;width:460px;height:640px">${OBJ.card("#1b1a17", `<div style="position:absolute;left:36px;top:70px;font-weight:900;font-size:100px;line-height:.95;color:#fff;letter-spacing:-.03em">FRESH<br>ROAST</div><div style="position:absolute;left:36px;top:300px;font-size:38px;font-weight:600;color:#d7ff3a;line-height:1.3">Small-batch coffee<br>Brewed daily</div>`)}</div>
    <div id="s6c" class="cut" style="left:50px;top:820px;width:460px;height:520px">${OBJ.card("#fff", `<div style="position:absolute;left:36px;top:36px;font-size:56px;font-weight:900;color:#2d2c28">MENU</div><div style="position:absolute;left:36px;top:120px;font-size:38px;font-weight:600;color:#2d2c28;line-height:1.7">Flat white ... 4.5<br>Cold brew ... 5.0<br>Croissant ... 3.5<br>Matcha ... 5.5</div>`)}</div>
    <div id="s6d" class="cut" style="left:570px;top:820px;width:460px;height:520px">${OBJ.card("linear-gradient(160deg,#6b4dff,#2b1cc4)", `<div style="position:absolute;left:36px;top:56px;font-size:32px;font-weight:700;color:#fff;letter-spacing:.18em">A NOVEL</div><div style="position:absolute;left:36px;top:130px;font-size:88px;font-weight:900;line-height:.98;color:#fff">Quiet<br>Light</div><div style="position:absolute;left:36px;bottom:44px;font-size:34px;color:#d7ff3a;font-weight:700">M. Alvarez</div>`)}</div>
  </section>

  <!-- S7 29.6–31.9 timer -->
  <section id="s7" class="clip scene" data-start="29.6" data-duration="2.3" data-track-index="2">
    <svg class="abs" style="left:150px;top:200px" width="780" height="780" viewBox="0 0 780 780">
      <circle cx="390" cy="390" r="330" fill="none" stroke="rgba(45,44,40,.14)" stroke-width="26"/>
      <circle id="s7r" cx="390" cy="390" r="330" fill="none" stroke="#2d2c28" stroke-width="26" stroke-linecap="round" stroke-dasharray="2073" stroke-dashoffset="0" transform="rotate(-90 390 390)"/>
    </svg>
    <div id="s7n" class="abs" style="left:0;top:470px;width:${W}px;text-align:center;font-weight:900;font-size:290px;color:#2d2c28;letter-spacing:-.04em">0:20</div>
    <div class="abs" style="left:0;top:790px;width:${W}px;text-align:center;font-weight:700;font-size:36px;letter-spacing:.3em;color:#7a7971">SECONDS OR LESS</div>
  </section>

  <!-- S8 31.9–33.25 free -->
  <section id="s8" class="clip scene" data-start="31.9" data-duration="1.35" data-track-index="2">
    <div id="s8f" class="abs" style="left:0;top:420px;width:${W}px;text-align:center;font-weight:900;font-size:270px;letter-spacing:-.04em;color:#2d2c28;transform:rotate(-5deg)">FREE</div>
    <div id="s8l" class="hair" style="left:150px;top:760px;width:780px;height:6px;background:#ff5d3a"></div>
  </section>

  <!-- S9 33.25–34.6 comment -->
  <section id="s9" class="clip scene" data-start="33.25" data-duration="1.35" data-track-index="2">
    <div id="s9b" class="cut" style="left:250px;top:260px;width:580px;height:500px">${OBJ.bubble}</div>
    <div id="s9t" class="abs" style="left:0;top:790px;width:${W}px;text-align:center;font-weight:800;font-size:60px;letter-spacing:.16em;color:#2d2c28">@ REVE</div>
  </section>

  <div id="flash" class="clip" data-start="0" data-duration="${DUR}" data-track-index="10"></div>
  ${capHtml}
</div>

<script>
const tl = gsap.timeline({ paused: true });
const E = "power3.out", B = "back.out(1.8)";

// captions
${CAPS.map((c, i) => {
  const n = c[2].split(" ").length;
  const span = Math.max(0.25, Math.min(c[1] - c[0], 1.4) * 0.55);
  return `tl.from("#cap${i} .sup .w",{y:22,opacity:0,filter:"blur(8px)",duration:.28,ease:E,stagger:${(span / n).toFixed(3)}},${c[0]});tl.from("#cap${i} .kw .w",{y:36,opacity:0,scale:.92,filter:"blur(10px)",duration:.34,ease:B,stagger:.08},${(c[0] + 0.06).toFixed(2)});tl.to("#cap${i}",{opacity:0,duration:.12},${(c[1] + 0.12).toFixed(2)});`;
}).join("\n")}
// dark-scene captions
["cap8","cap9","cap10"].forEach(id=>document.getElementById(id).classList.add("dk"));

// cuts: quick paper flash
[1.4,6.5,12.0,16.0,19.6,20.8,22.7,25.8,29.6,31.9,33.25,34.6].forEach(t=>{
  tl.set("#flash",{opacity:0},t-0.07);tl.to("#flash",{opacity:.55,duration:.06,ease:"none"},t-0.06);tl.to("#flash",{opacity:0,duration:.14,ease:"power1.out"},t+0.01);});

// cutout entrance helper: fly in from an edge with slight rotation, then drift
function fly(sel,t,fx,fy,rot,drift){tl.from(sel,{x:fx,y:fy,rotate:rot,opacity:0,duration:.55,ease:E},t);
  if(drift)tl.to(sel,{x:"+="+drift[0],y:"+="+drift[1],duration:3,ease:"sine.inOut"},t+.55);}

// S1
fly("#s1m",1.5,0,-500,-6,[0,-14]);fly("#s1p",2.0,-600,0,-30,[30,0]);fly("#s1a",2.3,-300,-300,-40);fly("#s1b",2.5,300,-300,40);fly("#s1c",2.8,300,300,20);
tl.from("#s1h1",{scaleX:0,duration:.8,ease:E},1.6);
// S2
fly("#s2h",6.6,0,500,8,[0,-12]);tl.from("#s2p",{y:300,opacity:0,duration:.5,ease:E},9.9);
const pt="a cozy cafe poster, warm light, clean bold typography",po={n:0};
tl.to(po,{n:pt.length,duration:1.4,ease:"none",onUpdate(){const k=Math.round(po.n);document.getElementById("s2type").textContent=pt.slice(0,k)+(k<pt.length?"▌":"");}},10.1);
tl.from("#s2h1",{scaleX:0,duration:.8,ease:E},6.7);
// S3
fly("#s3a",12.1,-600,0,-8,[0,-10]);fly("#s3b",13.5,600,0,8);tl.from(["#s3l1"],{opacity:0,y:20,duration:.3},12.5);tl.from("#s3l2",{opacity:0,y:20,duration:.3},14.0);
tl.to("#s3b",{xPercent:3,skewX:3,duration:.05,repeat:7,yoyo:true,ease:"steps(1)"},14.8);
// S4
tl.from("#s4a",{scale:.7,opacity:0,duration:.25,ease:B},16.18);tl.from("#s4b",{scale:.7,opacity:0,duration:.25,ease:B},17.31);tl.from("#s4c",{scale:.7,opacity:0,duration:.25,ease:B},18.54);
tl.to("#s4g",{x:"+=10",skewX:-8,duration:.05,repeat:9,yoyo:true,ease:"steps(1)"},17.4);
// S4b
fly("#s4x1",20.85,-700,0,-14);fly("#s4x2",21.1,700,0,14);fly("#s4x3",21.4,0,400,30);
// S5
tl.from("#s5w",{y:90,opacity:0,filter:"blur(14px)",duration:.6,ease:E},22.88);tl.from("#s5s",{opacity:0,y:24,duration:.7,ease:E},23.4);tl.from("#s5l",{scaleX:0,duration:.6,ease:E},23.6);
// S6
tl.from(["#s6a","#s6b","#s6c","#s6d"],{y:300,opacity:0,rotate:5,duration:.45,ease:E,stagger:{amount:1.5}},25.9);
tl.to(["#s6a","#s6c"],{yPercent:-3,duration:3.2,ease:"none"},25.9);tl.to(["#s6b","#s6d"],{yPercent:3,duration:3.2,ease:"none"},25.9);
// S7
const tm={v:20};tl.to(tm,{v:0,duration:1.8,ease:"power1.inOut",onUpdate(){document.getElementById("s7n").textContent="0:"+String(Math.ceil(tm.v)).padStart(2,"0");}},29.75);
tl.to("#s7r",{strokeDashoffset:2073,duration:1.8,ease:"power1.inOut"},29.75);
// S8
tl.from("#s8f",{scale:2.4,opacity:0,duration:.3,ease:"power4.out"},31.96);tl.from("#s8l",{scaleX:0,duration:.35,ease:E},32.2);
// S9
tl.from("#s9b",{scale:.3,rotate:-20,opacity:0,duration:.45,ease:B},33.3);tl.from("#s9t",{opacity:0,y:30,duration:.3},33.6);
// person windows: subtle push, no grade
tl.fromTo("#p0",{scale:1},{scale:1.06,duration:1.4,ease:"none"},0);
tl.fromTo("#p1",{scale:1.06},{scale:1,duration:1.2,ease:"none"},19.6);
tl.fromTo("#p2",{scale:1},{scale:1.08,duration:1.4,ease:"none"},34.6);

window.__timelines["main"] = tl;
</script>
</body>
</html>`;

writeFileSync("index.html", html);
console.log("index.html written", html.length);
