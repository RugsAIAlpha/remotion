// Cement-spec reel (Hinglish). Style: Video-24898 reference — speaker full-frame w/ mono lowercase
// captions, alternating with cream UI-card scenes, dark-red stat cards, gradient CTA card.
// Run: node build.mjs -> index.html   (1080x1920, 33.5 s)
import { writeFileSync } from "node:fs";
const W = 1080, H = 1920, DUR = 33.5;

// speaker windows (source time == timeline time)
const PERSON = [[0, 2.82], [5.6, 2.0], [14.7, 2.0], [22.6, 3.4], [31.0, 2.5]];
// person-scene captions: [start, end, text]  (*word* = coral keyword)
const PCAPS = [
  [0.0, 1.67, "galat grade ka *cement* use hone se"],
  [1.96, 2.62, "aapka *ghar*"],
  [5.69, 7.59, "zyadatar *contractor* wahi cement lagaate hain"],
  [14.85, 16.62, "par agar koi *specify* hi nahi kar raha toh"],
  [22.61, 23.66, "yeh maine *khud dekha* hai"],
  [24.1, 25.9, "isiliye *construction* shuru hone se pehle"],
  [31.0, 33.1, "aur main aapko ek basic *checklist* bhejoonga"],
];
const mono = t => t.replace(/\*(.+?)\*/g, '<b>$1</b>');
const pcapHtml = PCAPS.map((c, i) =>
  `<div id="pc${i}" class="clip pcap" data-start="${c[0]}" data-duration="${(c[1] - c[0] + 0.2).toFixed(2)}" data-track-index="9">${mono(c[2])}</div>`).join("\n  ");
const personHtml = PERSON.map((p, i) =>
  `<video id="p${i}" class="clip person" src="assets/talk.mp4" data-start="${p[0]}" data-duration="${p[1]}" data-media-start="${p[0]}" data-track-index="1" muted playsinline></video>`).join("\n  ");

// decorative capsules / dots / sparkles for cream scenes
const deco = (id, items) => items.map(([k, x, y, r, s], n) => {
  if (k === "cap") return `<i id="${id}c${n}" class="capsule" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s})"></i>`;
  if (k === "dot") return `<i id="${id}d${n}" class="dot" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px"></i>`;
  return `<i id="${id}s${n}" class="spark" style="left:${x}px;top:${y}px;font-size:${s}px">+</i>`;
}).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<title>Cement Spec</title>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:"JetBrains Mono";src:url("assets/fonts/jetbrains-mono-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"JetBrains Mono";src:url("assets/fonts/jetbrains-mono-latin-600-normal.woff2") format("woff2");font-weight:600}
@font-face{font-family:"Anton";src:url("assets/fonts/anton-latin-400-normal.woff2") format("woff2");font-weight:400}
:root{--cream:#f7f2ea;--ink:#241d1a;--coral:#ff5a3c;--soft:#9a8f86;--dark:#2a0a07}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:Inter,"Helvetica Neue",Arial,sans-serif}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#000}
.clip{position:absolute}
.person{left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.scene{left:0;top:0;width:${W}px;height:${H}px;overflow:hidden}
.cream{background:radial-gradient(900px 900px at 30% 10%,#fff,rgba(255,255,255,0) 70%),var(--cream)}
.reddark{background:radial-gradient(1000px 1000px at 50% 40%,#8a2314,#2a0a07 75%)}
.abs{position:absolute}
.pcap{left:60px;width:960px;top:120px;text-align:center;font-family:"JetBrains Mono",monospace;font-weight:400;font-size:50px;line-height:1.3;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.8),0 0 3px rgba(0,0,0,.5);z-index:50}
.pcap b{font-weight:600;color:#ff8f72;text-shadow:0 2px 14px rgba(0,0,0,.85),0 0 3px rgba(0,0,0,.6)}
.capsule{position:absolute;width:150px;height:60px;border-radius:30px;background:linear-gradient(180deg,#ff7a5c,#ff4a2a);box-shadow:0 18px 26px rgba(255,90,60,.35),inset 0 -8px 12px rgba(160,30,10,.35)}
.dot{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8a70,#ff4a2a)}
.spark{position:absolute;font-weight:300;color:var(--coral);line-height:1}
.title{position:absolute;left:70px;width:940px;font-weight:800;font-size:96px;line-height:1.08;letter-spacing:-.025em;color:var(--ink);text-align:center}
.title em{font-style:normal;color:var(--coral);text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:10px}
.ui{position:absolute;background:#fff;border-radius:36px;box-shadow:0 40px 80px rgba(80,40,20,.18),0 4px 0 rgba(0,0,0,.02)}
.lbl{font-family:"JetBrains Mono",monospace;font-size:26px;color:var(--soft);letter-spacing:.04em}
.row{display:flex;align-items:center;gap:22px;border-radius:22px;background:#faf6f1;padding:24px 28px}
.chip{border-radius:99px;padding:8px 22px;font-weight:800;font-size:28px;color:#fff;background:var(--coral);white-space:nowrap}
.chip.g{background:#2f9e6a}.chip.k{background:#6e6660}
.bag{width:84px;height:100px;flex:none}
.tabs{display:flex;gap:14px}.tab{border-radius:99px;padding:10px 24px;font-weight:700;font-size:26px;background:#f1ebe4;color:#8d8279}.tab.on{background:var(--coral);color:#fff}
.mfull{left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
#wipe{left:50%;top:50%;width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:var(--coral);z-index:70;pointer-events:none}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <audio id="voice" src="assets/voice.m4a" data-start="0" data-duration="${DUR}" data-track-index="0"></audio>
  ${personHtml}

  <!-- C1 2.82–5.6 house ages (ref clip) + stat -->
  <video id="m1" class="clip mfull" src="assets/house.mp4" data-start="2.82" data-duration="2.78" data-media-start="0" data-playback-rate="1.43" data-track-index="2" muted playsinline></video>
  <section id="c1" class="clip scene" data-start="2.82" data-duration="2.78" data-track-index="3" style="background:linear-gradient(180deg,rgba(42,10,7,.80),rgba(42,10,7,.50) 45%,rgba(42,10,7,.88))">
    <div class="abs lbl" style="left:0;top:150px;width:${W}px;text-align:center;font-size:36px;color:#ffd9ce">galat grade ka cement</div>
    <div id="c1a" class="abs" style="left:0;top:520px;width:${W}px;text-align:center;font-weight:800;font-size:150px;color:#fff;letter-spacing:-.03em">15 din</div>
    <div id="c1x" class="abs" style="left:250px;top:610px;width:580px;height:12px;background:var(--coral);border-radius:6px;transform-origin:0 50%"></div>
    <div id="c1b" class="abs" style="left:0;top:760px;width:${W}px;text-align:center;font-weight:900;font-size:300px;color:#ff6a4a;letter-spacing:-.05em;line-height:1;text-shadow:0 8px 30px rgba(0,0,0,.5)">15 saal</div>
    <div id="c1s" class="abs lbl" style="left:0;top:1120px;width:${W}px;text-align:center;font-size:40px;color:#ffd9ce">mein jawaab de sakta hai</div>
    ${deco("c1", [["cap", 60, 1500, -24, 1], ["cap", 800, 260, 28, .9], ["spark", 900, 1300, 0, 70], ["dot", 120, 330, 0, 36]])}
  </section>

  <!-- C2 7.6–10.9 local dukan (ref clip in frame) -->
  <section id="c2" class="clip scene cream" data-start="7.6" data-duration="3.3" data-track-index="2">
    <div id="c2t" class="title" style="top:170px">contractor wahi cement lagaate hain jo <em>local dukan</em> mein mile</div>
    <div id="c2f" class="abs" style="left:80px;top:640px;width:920px;height:760px;border-radius:40px;box-shadow:0 40px 80px rgba(80,40,20,.25);background:#ddd"></div>
    ${deco("c2", [["cap", 760, 80, 20, .9], ["cap", 40, 1560, -18, 1.1], ["spark", 930, 560, 0, 64], ["dot", 70, 580, 0, 30], ["spark", 140, 1480, 0, 54]])}
  </section>
  <video id="m2" class="clip mframe" src="assets/shop.mp4" data-start="7.6" data-duration="3.3" data-media-start="0" data-track-index="3" muted playsinline style="left:80px;top:640px;width:920px;height:760px;border-radius:40px;object-fit:cover"></video>
  <section id="c2o" class="clip scene" data-start="7.6" data-duration="3.3" data-track-index="4" style="pointer-events:none">
    <div id="c2r1" class="abs chip k" style="left:120px;top:1290px;font-size:36px;padding:14px 34px">jo dukan mein mila</div>
    <div id="c2r2" class="abs chip" style="left:470px;top:1290px;font-size:34px;padding:14px 30px">structure ko chahiye?</div>
  </section>

  <!-- C3 10.9–14.7 foundation -> compound wall (ref clip) -->
  <video id="m3" class="clip mfull" src="assets/foundation.mp4" data-start="10.9" data-duration="3.8" data-media-start="0" data-playback-rate="1.05" data-track-index="2" muted playsinline></video>
  <section id="c3" class="clip scene" data-start="10.9" data-duration="3.8" data-track-index="3" style="background:linear-gradient(180deg,rgba(20,8,4,.72),rgba(20,8,4,0) 38%,rgba(20,8,4,0) 62%,rgba(20,8,4,.78))">
    <div id="c3t" class="title" style="top:150px;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.55)"><em>alag</em> kaam,<br>alag grade</div>
    <div id="c3a" class="abs" style="left:70px;top:1380px"><div style="font-weight:900;font-size:96px;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.6)">Foundation</div><div class="chip" style="display:inline-block;margin-top:14px">alag grade</div></div>
    <div id="c3b" class="abs" style="left:70px;top:1380px"><div style="font-weight:900;font-size:96px;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.6)">Compound wall</div><div class="chip" style="display:inline-block;margin-top:14px">alag grade</div></div>
    ${deco("c3", [["cap", 800, 70, -26, .9], ["spark", 900, 1250, 0, 66], ["dot", 960, 520, 0, 34]])}
  </section>

  <!-- C4 16.7–18.9  specify nahi kiya toh -->
  <section id="c4" class="clip scene cream" data-start="16.7" data-duration="2.2" data-track-index="2">
    <div id="c4t" class="title" style="top:170px">decision<br>andaze pe <em>chhod</em> diya</div>
    <div id="c4u" class="ui" style="left:80px;top:700px;width:920px;height:640px;padding:44px">
      <div class="lbl">material specification</div>
      <div class="row" style="margin-top:26px"><div style="flex:1;font-weight:700;font-size:38px;color:var(--ink)">cement grade</div><div id="c4q1" class="chip k">— —</div></div>
      <div class="row" style="margin-top:22px"><div style="flex:1;font-weight:700;font-size:38px;color:var(--ink)">concrete mix</div><div id="c4q2" class="chip k">— —</div></div>
      <div class="row" style="margin-top:22px"><div style="flex:1;font-weight:700;font-size:38px;color:var(--ink)">decision kiska?</div><div id="c4q3" class="chip">andaza ?</div></div>
    </div>
    <div id="c4m" class="abs" style="left:70px;top:1400px;font-weight:900;font-size:200px;color:var(--coral);transform:rotate(-12deg)">?</div>
    ${deco("c4", [["cap", 780, 1450, -20, 1], ["spark", 900, 600, 0, 64], ["dot", 80, 1300, 0, 36]])}
  </section>

  <!-- C5a 18.9–20.8 savings -->
  <section id="c5" class="clip scene reddark" data-start="18.9" data-duration="1.9" data-track-index="2">
    <div id="c5a" class="abs" style="left:0;top:700px;width:${W}px;text-align:center;font-weight:800;font-size:116px;color:#fff;line-height:1.05">kuch hazaar ₹<br>bachaye</div>
    ${deco("c5", [["cap", 40, 120, -20, 1], ["spark", 920, 250, 0, 66]])}
  </section>
  <!-- C5b 20.8–22.6 cracking wall (ref clip) -->
  <video id="m5" class="clip mfull" src="assets/crack.mp4" data-start="20.8" data-duration="1.8" data-media-start="1.0" data-playback-rate="1.55" data-track-index="2" muted playsinline></video>
  <section id="c5x" class="clip scene" data-start="20.8" data-duration="1.8" data-track-index="3" style="background:linear-gradient(180deg,rgba(26,5,2,.55),rgba(26,5,2,0) 40%,rgba(26,5,2,.0) 55%,rgba(26,5,2,.85))">
    <div id="c5b" class="abs" style="left:0;top:1380px;width:${W}px;text-align:center;font-weight:900;font-size:130px;color:#ff6a4a;letter-spacing:-.03em;text-shadow:0 6px 28px rgba(0,0,0,.6)">5 saal mein <span style="color:#fff">cracks</span></div>
  </section>

  <!-- C6 26.0–29.3 spec sheet (ref photo) + checklist -->
  <section id="c6" class="clip scene cream" data-start="26.0" data-duration="3.3" data-track-index="2">
    <div id="c6t" class="title" style="top:150px">material <em>specification</em> sheet</div>
    <div id="c6i" class="abs" style="left:50px;top:560px;width:480px;height:860px;border-radius:36px;overflow:hidden;box-shadow:0 40px 80px rgba(80,40,20,.28)"><img id="c6im" src="assets/engineer.jpg" style="width:100%;height:100%;object-fit:cover;display:block"/></div>
    <div id="c6u" class="ui" style="left:500px;top:740px;width:530px;height:640px;padding:30px">
      <div style="display:flex;justify-content:space-between"><div class="lbl" style="font-size:22px">spec checklist</div><div id="c6p" class="lbl" style="color:var(--coral);font-size:22px">0/4</div></div>
      ${["cement grade", "steel grade", "sand & aggregate", "concrete mix"].map((t, i) => `<div class="row" style="margin-top:16px;padding:18px 20px;gap:16px"><div id="c6k${i}" style="width:44px;height:44px;flex:none;border-radius:50%;border:4px solid #d9cfc5;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:28px;color:#fff">✓</div><div style="flex:1;font-weight:700;font-size:30px;color:var(--ink)">${t}</div></div>`).join("")}
      <div style="margin-top:28px;height:14px;border-radius:7px;background:#f1ebe4;overflow:hidden"><div id="c6b" style="height:100%;width:100%;background:var(--coral);transform-origin:0 50%"></div></div>
    </div>
    <div id="c6n" class="chip k" style="position:absolute;left:300px;top:1480px;font-size:54px;padding:16px 40px;text-decoration:line-through">baad mein</div>
    <div id="c6y" class="chip g" style="position:absolute;left:300px;top:1480px;font-size:54px;padding:16px 40px">pehle ✓</div>
    ${deco("c6", [["cap", 780, 70, 22, .9], ["cap", 30, 1600, -16, 1], ["spark", 940, 520, 0, 66], ["dot", 70, 520, 0, 32]])}
  </section>

  <!-- C7 29.3–31.0  DM SPEC CTA card -->
  <section id="c7" class="clip scene" data-start="29.3" data-duration="1.7" data-track-index="2" style="background:radial-gradient(1000px 900px at 50% 100%,#ff7a4a,rgba(255,122,74,0) 70%),linear-gradient(180deg,#1a0504,#7a1a10)">
    <div id="c7t" class="abs" style="left:0;top:330px;width:${W}px;text-align:center;font-family:Anton,Impact,sans-serif;font-size:300px;line-height:.95;color:#fff;letter-spacing:.01em">DM<br><span style="color:#ff6a4a">“SPEC”</span></div>
    <div id="c7f" class="abs" style="left:240px;top:1010px;width:600px;text-align:center;border:4px solid #ff6a4a;border-radius:99px;padding:14px 0;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:36px;letter-spacing:.3em;color:#ff6a4a">FREE · CHECKLIST</div>
    <div id="c7c" class="ui" style="left:200px;top:1200px;width:680px;height:300px;padding:34px"><div class="lbl">basic checklist</div><div style="margin-top:18px;height:14px;border-radius:7px;background:#f1ebe4"></div><div style="margin-top:22px;height:14px;width:70%;border-radius:7px;background:#f1ebe4"></div><div style="margin-top:22px;height:14px;width:85%;border-radius:7px;background:#f1ebe4"></div></div>
  </section>

  <div id="cta" class="clip" data-start="31.0" data-duration="2.5" data-track-index="8" style="left:150px;top:1560px;width:780px;height:120px;border-radius:60px;background:var(--coral);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:56px;color:#fff;letter-spacing:.04em;z-index:40;box-shadow:0 20px 40px rgba(255,90,60,.4)">DM “SPEC” ↗</div>

  <div id="wipe" class="clip" data-start="0" data-duration="${DUR}" data-track-index="10"></div>
  ${pcapHtml}
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.set("#wipe",{scale:0},0);
const E="power3.out", B="back.out(1.7)";

// person captions (mono, typewriter-ish: words pop with tiny rise)
${PCAPS.map((c, i) => `tl.from("#pc${i}",{y:18,opacity:0,duration:.22,ease:E},${c[0]});tl.to("#pc${i}",{opacity:0,duration:.1},${(c[1] + 0.1).toFixed(2)});`).join("\n")}
tl.fromTo("#p0",{scale:1},{scale:1.07,duration:2.82,ease:"none"},0);
tl.fromTo("#p1",{scale:1.07},{scale:1,duration:2,ease:"none"},5.6);
tl.fromTo("#p2",{scale:1},{scale:1.07,duration:2,ease:"none"},14.7);
tl.fromTo("#p3",{scale:1.07},{scale:1,duration:3.4,ease:"none"},22.6);
tl.fromTo("#p4",{scale:1},{scale:1.06,duration:2.5,ease:"none"},31.0);

// coral blob wipe on every cut
[2.82,5.6,7.6,10.9,14.7,16.7,18.9,22.6,26.0,29.3,31.0].forEach(t=>{
  tl.set("#wipe",{scale:0},t-0.2);tl.to("#wipe",{scale:3.2,duration:.2,ease:"power2.in"},t-0.2);tl.to("#wipe",{scale:0,duration:.26,ease:"power2.out"},t+0.01);});

// decorative drift on every scene
["c1","c2","c3","c4","c5","c6"].forEach(id=>{document.querySelectorAll("#"+id+" .capsule, #"+id+" .spark, #"+id+" .dot").forEach((el,i)=>{
  const t=parseFloat(document.getElementById(id).getAttribute("data-start"));
  tl.from(el,{scale:0,opacity:0,duration:.4,ease:B},t+0.15+i*.06);tl.to(el,{y:(i%2?-1:1)*26,duration:2.5,ease:"sine.inOut"},t+0.5);});});

// C1
tl.from("#c1a",{y:60,opacity:0,duration:.35,ease:E},2.9);tl.from("#c1x",{scaleX:0,duration:.3,ease:E},3.45);
tl.from("#c1b",{y:120,opacity:0,scale:.7,duration:.45,ease:B},3.96);tl.from("#c1s",{opacity:0,duration:.3},4.7);
// C2
tl.from("#c2t",{y:50,opacity:0,duration:.4,ease:E},7.65);tl.from("#c2u",{y:300,opacity:0,duration:.5,ease:E},7.85);
tl.from("#c2f",{y:200,opacity:0,duration:.5,ease:E},7.8);tl.from("#c2r1",{y:40,opacity:0,duration:.3,ease:E},8.4);tl.from("#c2r2",{y:40,opacity:0,duration:.3,ease:E},9.5);
// C3
tl.from("#c3t",{y:50,opacity:0,duration:.4,ease:E},10.95);
tl.from("#c3a",{x:-400,opacity:0,duration:.45,ease:E},11.2);tl.to("#c3a",{opacity:0,duration:.2},12.7);tl.from("#c3b",{x:-400,opacity:0,duration:.45,ease:E},12.9);
// C4
tl.from("#c4t",{y:50,opacity:0,duration:.35,ease:E},16.75);tl.from("#c4u",{y:260,opacity:0,duration:.45,ease:E},16.95);
tl.from("#c4q3",{scale:0,duration:.3,ease:B},17.9);tl.from("#c4m",{scale:0,rotate:-50,duration:.45,ease:B},18.2);
tl.to("#c4q1",{x:"+=0",duration:.1},17.0);
// C5
tl.from("#c5a",{y:60,opacity:0,duration:.4,ease:E},19.0);
tl.from("#c5b",{y:60,opacity:0,duration:.35,ease:E},20.95);
// C6
tl.from("#c6t",{y:50,opacity:0,duration:.35,ease:E},26.05);tl.from("#c6i",{x:-300,opacity:0,duration:.5,ease:E},26.15);tl.fromTo("#c6im",{scale:1},{scale:1.12,duration:3.2,ease:"none"},26.1);tl.from("#c6u",{x:300,opacity:0,duration:.5,ease:E},26.4);
const ck=[26.7,27.2,27.65,28.1];const cnt={n:0};
ck.forEach((t,i)=>{tl.to("#c6k"+i,{backgroundColor:"#ff5a3c",borderColor:"#ff5a3c",duration:.2},t);tl.from("#c6k"+i,{scale:.6,duration:.25,ease:B},t);});
tl.fromTo("#c6b",{scaleX:0},{scaleX:1,duration:1.5,ease:"none"},26.7);
tl.to(cnt,{n:4,duration:1.5,ease:"none",onUpdate(){document.getElementById("c6p").textContent=Math.min(4,Math.floor(cnt.n+0.05))+"/4";}},26.7);
tl.from("#c6n",{scale:0,opacity:0,duration:.3,ease:B},28.0);tl.to("#c6n",{opacity:0,scale:.8,duration:.2},28.75);tl.from("#c6y",{scale:0,opacity:0,duration:.3,ease:B},28.8);
// C7
tl.from("#c7t",{scale:.5,opacity:0,duration:.45,ease:B},29.4);tl.from("#c7f",{y:40,opacity:0,duration:.3,ease:E},29.85);tl.from("#c7c",{y:300,opacity:0,duration:.45,ease:E},30.0);
// closing CTA pill
tl.from("#cta",{y:80,opacity:0,scale:.8,duration:.4,ease:B},31.1);

window.__timelines["main"]=tl;
</script></body></html>`;
writeFileSync("index.html", html);
console.log("index.html", html.length);
