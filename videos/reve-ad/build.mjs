// Generates index.html (1080x1920, 36s). Run: node build.mjs
import { writeFileSync } from "node:fs";

const W = 1080, H = 1920, DUR = 36;

// speech phrases snapped to detected pauses (start, end, words; * = accent word)
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

const LIGHT = [[6.5, 16.0], [25.7, 29.6]];
const capHtml = CAPS.map((c, i) => {
  const words = c[2].split(" ");
  // merge words so *two word accents* stay together: accent marker toggles per word group
  let acc = false;
  const spans = [];
  for (const w of words) {
    let t = w, a = acc;
    if (t.startsWith("*")) { acc = true; a = true; t = t.slice(1); }
    if (/\*[,.!?]?$/.test(t)) { acc = false; t = t.replace("*", ""); }
    spans.push(`<span class="w${a ? " a" : ""}">${t}</span>`);
  }
  const end = Math.min(c[1] + 0.25, DUR);
  return `<div id="cap${i}" class="cap clip${LIGHT.some(([a,b])=>c[0]>=a&&c[0]<b)?" light":""}" data-start="${c[0]}" data-duration="${(end - c[0]).toFixed(2)}" data-track-index="9">${spans.join(" ")}</div>`;
}).join("\n      ");

// person windows (source time = timeline time)
const PERSON = [[0, 1.9], [19.6, 2.3], [33.25, 2.75]];
const personHtml = PERSON.map((p, i) =>
  `<video id="p${i}" class="clip person" src="assets/talk.mp4" data-start="${p[0]}" data-duration="${p[1]}" data-media-start="${p[0]}" data-track-index="1" muted playsinline></video>`
).join("\n      ");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>Reve Ad</title>
<script src="assets/gsap.min.js"></script>
<style>
:root{--ink:#15130f;--cream:#f5efe6;--coral:#ff4d2e;--violet:#6b4dff;--night:#0e0d14;--lime:#d7ff3a}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:Inter,"Helvetica Neue",Arial,sans-serif}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#000}
.clip{position:absolute}
.person{left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.scene{left:0;top:0;width:${W}px;height:${H}px;overflow:hidden}
.abs{position:absolute}
/* captions */
.cap{left:40px;width:1000px;top:1440px;height:300px;display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:6px 18px;text-align:center;z-index:50}
.w{font-weight:900;font-size:92px;line-height:1.02;letter-spacing:-.02em;color:#fff;text-transform:uppercase;
   text-shadow:0 4px 0 rgba(0,0,0,.55),0 0 28px rgba(0,0,0,.45);-webkit-text-stroke:2px rgba(0,0,0,.35);display:inline-block}
.w.a{color:var(--lime)}
.light .w{color:var(--ink);text-shadow:none;-webkit-text-stroke:0}
.light .w.a{color:#c92f14}
/* shared pieces */
.label{position:absolute;font-weight:800;letter-spacing:.14em;font-size:30px;text-transform:uppercase}
.card{position:absolute;border-radius:36px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.35)}
.pill{position:absolute;padding:16px 34px;border-radius:99px;font-weight:900;font-size:40px;letter-spacing:.04em;text-transform:uppercase}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">

  <audio id="voice" src="assets/voice.m4a" data-start="0" data-duration="${DUR}" data-track-index="0"></audio>

  <!-- ===== S1  2.0–6.5  "scare your designer" ===== -->
  <section id="s1" class="clip scene" data-start="1.9" data-duration="4.6" data-track-index="2" style="background:radial-gradient(900px 900px at 50% 40%,#2a2540,#0e0d14 70%)">
    <svg class="abs" id="s1art" style="left:0;top:0" width="${W}" height="1440" viewBox="0 0 ${W} 1440">
      <defs><radialGradient id="glow" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#7d6bff" stop-opacity=".9"/><stop offset="1" stop-color="#7d6bff" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="540" cy="560" rx="520" ry="420" fill="url(#glow)"/>
      <!-- monitor -->
      <rect x="170" y="230" width="740" height="470" rx="26" fill="#1a1824" stroke="#3a3650" stroke-width="8"/>
      <rect x="196" y="256" width="688" height="418" rx="12" fill="#f3f0ff"/>
      <rect x="226" y="290" width="220" height="26" rx="13" fill="#cfc8ff"/>
      <rect x="226" y="340" width="628" height="290" rx="14" fill="#fff" stroke="#d9d3ff" stroke-width="4" stroke-dasharray="14 12"/>
      <rect id="s1cursor" x="520" y="470" width="6" height="52" fill="#15130f"/>
      <rect x="470" y="700" width="140" height="70" fill="#2a2740"/><rect x="380" y="770" width="320" height="22" rx="11" fill="#3a3650"/>
      <!-- designer silhouette -->
      <g id="s1fig"><circle cx="540" cy="1010" r="120" fill="#0a0910"/><path d="M250 1440 C250 1190 360 1120 540 1120 C720 1120 830 1190 830 1440 Z" fill="#0a0910"/></g>
      <!-- sticky notes -->
      <g id="s1notes"><rect x="60" y="300" width="130" height="130" fill="#ffd84d" transform="rotate(-8 125 365)"/><rect x="900" y="360" width="130" height="130" fill="#ff8aa1" transform="rotate(7 965 425)"/><rect x="930" y="560" width="110" height="110" fill="#7dffd0" transform="rotate(-5 985 615)"/></g>
    </svg>
    <div class="label abs" id="s1tag" style="left:70px;top:120px;color:#cfc8ff">Designer · 9:41 pm</div>
  </section>

  <!-- ===== S2  6.5–12.0  vision → prompt ===== -->
  <section id="s2" class="clip scene" data-start="6.5" data-duration="5.5" data-track-index="2" style="background:var(--cream)">
    <svg class="abs" style="left:0;top:0" width="${W}" height="1440" viewBox="0 0 ${W} 1440">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a5c"/><stop offset=".6" stop-color="#ff4d6d"/><stop offset="1" stop-color="#6b4dff"/></linearGradient>
        <clipPath id="headclip"><path d="M540 140 C380 140 290 260 290 410 C290 520 340 560 340 640 L340 760 L560 760 L560 690 L640 690 L640 560 C720 500 790 470 790 400 C790 250 700 140 540 140 Z"/></clipPath>
      </defs>
      <path d="M540 140 C380 140 290 260 290 410 C290 520 340 560 340 640 L340 760 L560 760 L560 690 L640 690 L640 560 C720 500 790 470 790 400 C790 250 700 140 540 140 Z" fill="none" stroke="#15130f" stroke-width="10"/>
      <g clip-path="url(#headclip)" id="s2scene" opacity="0">
        <rect x="280" y="130" width="520" height="640" fill="url(#sky)"/>
        <circle cx="560" cy="360" r="95" fill="#ffe27a"/>
        <path d="M280 560 L420 380 L520 500 L640 330 L800 560 L800 770 L280 770Z" fill="#2b1650"/>
        <path d="M280 640 L440 520 L560 620 L700 500 L800 640 L800 770 L280 770Z" fill="#1a0d33"/>
      </g>
      <g id="s2sparks"><circle cx="250" cy="200" r="10" fill="#ff4d2e"/><circle cx="840" cy="170" r="14" fill="#6b4dff"/><circle cx="880" cy="520" r="9" fill="#ff4d2e"/><circle cx="220" cy="520" r="12" fill="#6b4dff"/></g>
    </svg>
    <div id="s2prompt" class="abs" style="left:70px;top:880px;width:940px;height:330px;background:#fff;border-radius:34px;box-shadow:0 30px 70px rgba(21,19,15,.22);padding:44px;">
      <div style="font-size:26px;font-weight:800;letter-spacing:.14em;color:#8a8478;text-transform:uppercase;margin-bottom:22px">Prompt</div>
      <div id="s2type" style="font-size:52px;font-weight:700;line-height:1.2;color:#15130f;min-height:190px"></div>
    </div>
  </section>

  <!-- ===== S3  12.0–16.0  mismatch ===== -->
  <section id="s3" class="clip scene" data-start="12.0" data-duration="4.0" data-track-index="2" style="background:#e9e2d6">
    <div id="s3a" class="card" style="left:70px;top:150px;width:440px;height:860px;background:linear-gradient(#ff8a5c,#ff4d6d 55%,#6b4dff)">
      <svg width="440" height="860" viewBox="0 0 440 860"><circle cx="220" cy="300" r="90" fill="#ffe27a"/><path d="M0 560 L120 400 L220 520 L320 380 L440 560 L440 860 L0 860Z" fill="#2b1650"/><rect x="60" y="690" width="320" height="34" rx="17" fill="#fff"/><rect x="110" y="750" width="220" height="22" rx="11" fill="#ffffffaa"/></svg>
    </div>
    <div id="s3b" class="card" style="left:570px;top:150px;width:440px;height:860px;background:#9a9a9a;filter:saturate(.2)">
      <svg width="440" height="860" viewBox="0 0 440 860"><rect width="440" height="860" fill="#a8a39a"/><ellipse cx="240" cy="330" rx="140" ry="70" fill="#7b7870"/><path d="M0 600 Q110 520 200 640 T440 580 L440 860 L0 860Z" fill="#6f6d68"/><text x="40" y="740" font-family="Arial" font-weight="900" font-size="58" fill="#3b3a37" transform="rotate(-4 40 740)">COFFE SH0P</text><text x="40" y="800" font-family="Arial" font-size="30" fill="#4a4945">fr3sh r0ast bl3nd</text></svg>
    </div>
    <div class="pill" id="s3la" style="left:70px;top:1050px;background:var(--ink);color:#fff;font-size:34px">In your head</div>
    <div class="pill" id="s3lb" style="left:570px;top:1050px;background:#7a7468;color:#fff;font-size:34px">What you got</div>
  </section>

  <!-- ===== S4  16.0–19.6  wrong colors / broken text / generic ===== -->
  <section id="s4" class="clip scene" data-start="16.0" data-duration="3.6" data-track-index="2" style="background:#14121b">
    <div id="s4a" class="card" style="left:70px;top:130px;width:940px;height:330px;background:#1d1a27;box-shadow:none;border:4px solid #ff4d2e">
      <div class="label" style="left:44px;top:34px;color:#ff4d2e">01 · Wrong colors</div>
      <div style="position:absolute;left:44px;right:44px;top:110px;height:170px;display:flex;gap:0"><i style="flex:1;background:#00e5a8"></i><i style="flex:1;background:#ff2bd6"></i><i style="flex:1;background:#fff200"></i><i style="flex:1;background:#2f6bff"></i><i style="flex:1;background:#ff7a00"></i></div>
    </div>
    <div id="s4b" class="card" style="left:70px;top:500px;width:940px;height:330px;background:#1d1a27;box-shadow:none;border:4px solid #ff4d2e">
      <div class="label" style="left:44px;top:34px;color:#ff4d2e">02 · Broken text</div>
      <div id="s4glitch" style="position:absolute;left:44px;top:100px;font-size:96px;white-space:nowrap;font-weight:900;color:#fff;letter-spacing:.02em">G10B4L C0FFEE</div>
    </div>
    <div id="s4c" class="card" style="left:70px;top:870px;width:940px;height:330px;background:#1d1a27;box-shadow:none;border:4px solid #ff4d2e">
      <div class="label" style="left:44px;top:34px;color:#ff4d2e">03 · Generic feel</div>
      <div style="position:absolute;left:44px;top:110px;display:flex;gap:26px"><i style="width:260px;height:170px;background:#8b8f96;border-radius:14px"></i><i style="width:260px;height:170px;background:#8b8f96;border-radius:14px"></i><i style="width:260px;height:170px;background:#8b8f96;border-radius:14px"></i></div>
    </div>
  </section>

  <!-- person windows -->
  ${personHtml}

  <!-- ===== S5  21.9–25.8  Reve reveal ===== -->
  <section id="s5" class="clip scene" data-start="21.9" data-duration="3.9" data-track-index="2" style="background:radial-gradient(1000px 1000px at 50% 45%,#3b2bd9,#12103a 70%)">
    <div id="s5ring1" class="abs" style="left:190px;top:260px;width:700px;height:700px;border:6px solid #ffffff55;border-radius:50%"></div>
    <div id="s5ring2" class="abs" style="left:90px;top:160px;width:900px;height:900px;border:4px solid #ffffff22;border-radius:50%"></div>
    <div id="s5word" class="abs" style="left:0;top:470px;width:${W}px;text-align:center;font-weight:900;font-size:260px;letter-spacing:-.05em;color:#fff">Reve</div>
    <div id="s5sub" class="abs" style="left:0;top:790px;width:${W}px;text-align:center;font-weight:700;font-size:48px;letter-spacing:.16em;text-transform:uppercase;color:var(--lime)">AI image generator</div>
  </section>

  <!-- ===== S6  25.8–29.6  studio visuals + readable text ===== -->
  <section id="s6" class="clip scene" data-start="25.8" data-duration="3.8" data-track-index="2" style="background:var(--cream)">
    <div id="s6a" class="card" style="left:60px;top:90px;width:450px;height:640px;background:linear-gradient(160deg,#ffd9c4,#ff8a5c)">
      <svg width="450" height="640" viewBox="0 0 450 640"><ellipse cx="225" cy="560" rx="150" ry="26" fill="#00000030"/><rect x="170" y="190" width="110" height="330" rx="22" fill="#fff"/><rect x="195" y="130" width="60" height="70" rx="10" fill="#15130f"/><rect x="190" y="290" width="70" height="90" rx="8" fill="#ff4d2e"/></svg>
    </div>
    <div id="s6b" class="card" style="left:570px;top:90px;width:450px;height:640px;background:#15130f">
      <div style="position:absolute;left:36px;top:70px;font-weight:900;font-size:100px;line-height:.95;color:#fff;letter-spacing:-.03em">FRESH<br>ROAST</div>
      <div style="position:absolute;left:36px;top:300px;font-size:38px;font-weight:600;color:var(--lime)">Small-batch coffee<br>Brewed daily</div>
      <div style="position:absolute;left:36px;bottom:50px;font-size:30px;color:#ffffffaa;letter-spacing:.12em">EST. 2025</div>
    </div>
    <div id="s6c" class="card" style="left:60px;top:790px;width:450px;height:560px;background:#fff">
      <div style="position:absolute;left:36px;top:40px;font-size:56px;font-weight:900;color:#15130f">MENU</div>
      <div style="position:absolute;left:36px;top:130px;font-size:38px;font-weight:600;color:#15130f;line-height:1.7">Flat white ... 4.5<br>Cold brew ... 5.0<br>Croissant ... 3.5<br>Matcha ... 5.5</div>
    </div>
    <div id="s6d" class="card" style="left:570px;top:790px;width:450px;height:560px;background:linear-gradient(160deg,#6b4dff,#2b1cc4)">
      <div style="position:absolute;left:36px;top:60px;font-size:34px;font-weight:700;color:#fff;letter-spacing:.18em">A NOVEL</div>
      <div style="position:absolute;left:36px;top:140px;font-size:88px;font-weight:900;line-height:.98;color:#fff">Quiet<br>Light</div>
      <div style="position:absolute;left:36px;bottom:50px;font-size:36px;color:var(--lime);font-weight:700">M. Alvarez</div>
    </div>
  </section>

  <!-- ===== S7  29.6–31.9  timer ===== -->
  <section id="s7" class="clip scene" data-start="29.6" data-duration="2.3" data-track-index="2" style="background:var(--night)">
    <svg class="abs" style="left:140px;top:210px" width="800" height="800" viewBox="0 0 800 800">
      <circle cx="400" cy="400" r="340" fill="none" stroke="#2a2740" stroke-width="30"/>
      <circle id="s7ring" cx="400" cy="400" r="340" fill="none" stroke="#d7ff3a" stroke-width="30" stroke-linecap="round" stroke-dasharray="2137" stroke-dashoffset="0" transform="rotate(-90 400 400)"/>
    </svg>
    <div id="s7num" class="abs" style="left:0;top:480px;width:${W}px;text-align:center;font-weight:900;font-size:300px;color:#fff;letter-spacing:-.04em">0:20</div>
    <div class="abs" style="left:0;top:800px;width:${W}px;text-align:center;font-weight:800;font-size:44px;letter-spacing:.2em;color:#d7ff3a">SECONDS OR LESS</div>
  </section>

  <!-- ===== S8  31.9–33.25  free ===== -->
  <section id="s8" class="clip scene" data-start="31.9" data-duration="1.35" data-track-index="2" style="background:var(--coral)">
    <div id="s8free" class="abs" style="left:0;top:420px;width:${W}px;text-align:center;font-weight:900;font-size:330px;letter-spacing:-.04em;color:#fff;transform:rotate(-6deg)">FREE</div>
    <div id="s8dots"></div>
  </section>

  <!-- CTA over closing shot -->
  <div id="cta" class="clip" data-start="33.4" data-duration="2.6" data-track-index="8" style="left:90px;top:170px;width:900px;height:150px;background:var(--lime);border-radius:75px;display:flex;align-items:center;justify-content:center;gap:26px;z-index:40">
    <svg width="64" height="64" viewBox="0 0 64 64"><path d="M8 10h48v32H30l-14 12V42H8z" fill="#15130f"/></svg>
    <span style="font-weight:900;font-size:54px;color:#15130f;letter-spacing:.02em;text-transform:uppercase">Comment “Reve”</span>
  </div>

  <!-- captions -->
  ${capHtml}
</div>

<script>
const tl = gsap.timeline({ paused: true });
const E = "power3.out";

// ---- captions: word pop-in, exit
${CAPS.map((c, i) => {
  const n = c[2].split(" ").length;
  const span = Math.max(0.25, Math.min(c[1] - c[0], 1.4) * 0.6);
  return `tl.from("#cap${i} .w",{y:34,scale:.7,opacity:0,duration:.18,ease:"back.out(2)",stagger:${(span / n).toFixed(3)}},${c[0]});tl.to("#cap${i}",{opacity:0,duration:.12},${(c[1] + 0.12).toFixed(2)});`;
}).join("\n")}
// light-background scenes use dark captions
[${[[6.5, 12.0], [12.0, 16.0], [25.8, 29.6]].map(r => `[${r}]`).join(",")}].forEach(([a,b])=>{});

// ---- scene entrances
function sceneIn(id,t){tl.from(id,{opacity:0,duration:.12},t);}
sceneIn("#s1",1.9);sceneIn("#s2",6.5);sceneIn("#s3",12.0);sceneIn("#s4",16.0);sceneIn("#s5",21.9);sceneIn("#s6",25.8);sceneIn("#s7",29.6);sceneIn("#s8",31.9);

// S1 slow push + cursor blink + fig breathe
tl.fromTo("#s1art",{scale:1.0,transformOrigin:"50% 40%"},{scale:1.1,duration:4.6,ease:"none"},1.9);
tl.fromTo("#s1cursor",{opacity:1},{opacity:0,duration:.3,repeat:7,yoyo:true,ease:"steps(1)"},1.9);
tl.from("#s1notes",{y:-40,opacity:0,duration:.5,ease:E},2.3);
tl.from("#s1tag",{x:-40,opacity:0,duration:.4,ease:E},2.2);

// S2 vision glow then prompt typing
tl.to("#s2scene",{opacity:1,duration:.7,ease:E},8.2);
tl.fromTo("#s2sparks circle",{scale:0,transformOrigin:"50% 50%"},{scale:1,duration:.4,stagger:.12,ease:"back.out(3)"},8.4);
tl.from("#s2prompt",{y:140,opacity:0,duration:.5,ease:E},9.9);
const promptText="a cozy cafe poster, warm light, clean bold typography";
const typeObj={n:0};
tl.to(typeObj,{n:promptText.length,duration:1.4,ease:"none",onUpdate(){document.getElementById("s2type").textContent=promptText.slice(0,Math.round(typeObj.n))+(Math.round(typeObj.n)<promptText.length?"▌":"");}},10.1);

// S3 two cards then wrong one glitches
tl.from("#s3a",{x:-500,rotate:-6,duration:.45,ease:E},12.1);
tl.from("#s3b",{x:500,rotate:6,duration:.45,ease:E},13.6);
tl.from("#s3la",{y:30,opacity:0,duration:.3},12.5);
tl.from("#s3lb",{y:30,opacity:0,duration:.3},14.0);
tl.to("#s3b",{x:"+=14",skewX:4,duration:.05,repeat:7,yoyo:true,ease:"steps(1)"},14.8);

// S4 three callouts stamp in
tl.from("#s4a",{scale:.6,opacity:0,duration:.25,ease:"back.out(2.5)"},16.18);
tl.from("#s4b",{scale:.6,opacity:0,duration:.25,ease:"back.out(2.5)"},17.31);
tl.from("#s4c",{scale:.6,opacity:0,duration:.25,ease:"back.out(2.5)"},18.54);
tl.to("#s4glitch",{x:"+=10",skewX:-8,duration:.05,repeat:9,yoyo:true,ease:"steps(1)"},17.4);

// person windows: gentle punch-in so the shot never feels static
tl.fromTo("#p0",{scale:1.0},{scale:1.08,duration:1.9,ease:"none"},0);
tl.fromTo("#p1",{scale:1.08},{scale:1.0,duration:2.3,ease:"none"},19.6);
tl.fromTo("#p2",{scale:1.0},{scale:1.1,duration:2.75,ease:"none"},33.25);
tl.from("#cta",{y:-60,opacity:0,scale:.8,duration:.4,ease:"back.out(2)"},33.4);

// S5 reveal
tl.from("#s5ring1",{scale:.2,opacity:0,duration:.9,ease:E},22.2);
tl.from("#s5ring2",{scale:.2,opacity:0,duration:1.1,ease:E},22.3);
tl.from("#s5word",{y:120,opacity:0,scale:.85,duration:.6,ease:"back.out(1.8)"},22.88);
tl.from("#s5sub",{opacity:0,y:30,duration:.5,ease:E},23.5);

// S6 cards stagger + parallax drift
tl.from(["#s6a","#s6b","#s6c","#s6d"],{y:260,opacity:0,rotate:4,duration:.45,ease:E,stagger:{amount:1.6}},25.9);
tl.to(["#s6a","#s6c"],{yPercent:-4,duration:3.4,ease:"none"},25.9);
tl.to(["#s6b","#s6d"],{yPercent:4,duration:3.4,ease:"none"},25.9);

// S7 timer counts 0:20 -> 0:00 as ring fills
const tm={v:20};
tl.to(tm,{v:0,duration:1.8,ease:"power1.inOut",onUpdate(){const s=Math.ceil(tm.v);document.getElementById("s7num").textContent="0:"+String(s).padStart(2,"0");}},29.75);
tl.to("#s7ring",{strokeDashoffset:2137,duration:1.8,ease:"power1.inOut"},29.75);

// S8 free stamp + confetti
tl.from("#s8free",{scale:2.6,opacity:0,duration:.3,ease:"power4.out"},31.96);
const dots=document.getElementById("s8dots");
for(let i=0;i<24;i++){const d=document.createElement("i");const a=i/24*Math.PI*2;d.style.cssText="position:absolute;left:540px;top:760px;width:22px;height:22px;border-radius:50%;background:"+["#fff","#d7ff3a","#15130f"][i%3];dots.appendChild(d);
tl.fromTo(d,{x:0,y:0,scale:0},{x:Math.cos(a)*(380+(i%4)*60),y:Math.sin(a)*(380+(i%3)*70),scale:1,duration:.5,ease:"power3.out"},32.0);}

window.__timelines["main"] = tl;
</script>
</body>
</html>`;

writeFileSync("index.html", html);
console.log("index.html written", html.length);
