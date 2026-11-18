// 찰스의 숲 스토어 스크린샷 촬영기: 로컬 http 서버 + 헤드리스 Chrome(CDP) 로 ?shot=1 모드 장면을 찍는다.
// 사용: node shoot.js [장면번호들]   예) node shoot.js 1 3
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = '/Users/apple/Desktop/claude/찰스의숲';
const OUT = path.join(DIR, 'store', 'shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8765, DBG = 9333;
const PROF = path.join(process.env.TMPDIR || '/tmp', 'chrome-shot-prof');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', DIR], { stdio: 'ignore' });
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${PROF}`,
  '--window-size=640,360', '--hide-scrollbars', '--mute-audio', '--autoplay-policy=no-user-gesture-required',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl',
  '--no-first-run', '--no-default-browser-check', '--disable-background-timer-throttling', 'about:blank'
], { stdio: 'ignore' });
const cleanup = () => { try { chrome.kill(); } catch (e) {} try { server.kill(); } catch (e) {} };
process.on('exit', cleanup); process.on('SIGINT', () => { cleanup(); process.exit(1); });

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${DBG}/json/list`);
      const list = await r.json();
      const t = list.find((x) => x.type === 'page');
      if (t) return t;
    } catch (e) {}
    await sleep(300);
  }
  throw new Error('chrome devtools 응답 없음');
}

let ws, idSeq = 0; const pending = new Map(); const events = [];
function send(method, params = {}) {
  const id = ++idSeq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error('page error: ' + JSON.stringify(r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
  return r.result && r.result.value;
}
const run = (code) => evaluate('(() => {' + code + '})()');
async function shot(name) {
  const r = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const f = path.join(OUT, name + '.png');
  fs.writeFileSync(f, Buffer.from(r.data, 'base64'));
  console.log('saved', f);
}

// 장면 정의: 페이지 안에서 실행할 코드(window.__shot 사용)와 기다릴 시간
const SETUP = `
  const S = window.__shot; const M = Math;
  S.me.setAvatar('female-b');
  const seats = S.SEATS.length;
  const pick = (i) => (i * 2) % seats;
  window.__friends = [
    S.friend('산들바람', '#7fc8ff', 'female-c', 2, 2, pick(1), 1860),
    S.friend('달빛토끼', '#ffb3d9', 'male-b', -2, 2, pick(2), 950),
    S.friend('모닥불장인', '#b5e36b', 'male-e', 0, -2.5, 7, 3410)
  ];
  S.surv.since = Date.now() - 2640 * 1000;
  S.prof.gold = 128; S.renderWallet();
  S.prof.inv = { wood: 5, fruit: 3, meat_fox: 2, match: 1, aurora: 1, scroll: 2 }; S.renderBag();
  S.surv.hunger = 72; S.surv.warmth = 88;
  document.body.classList.remove('bag-open', 'chat-open', 'menu-open');
  return 'ok'`;
const lookAt = (tx, tz) => `S.cam.yaw = M.atan2(${tx} - S.me.pos.x, ${tz} - S.me.pos.z); S.me.yaw = S.cam.yaw;`;
const SCENES = {
  1: { name: '01_night_fire', hour: 21.3, wait: 4500, code: `
    const S = window.__shot, M = Math; S.setHour(21.3); S.state.aurora = 0; S.setExposure(1.35);
    const s = S.SEATS[0]; S.me.seat = 0; S.me.place(s.x, s.z); S.me.target.set(s.x, 0, s.z);
    ${lookAt(0, 0)} S.cam.tilt = 0.34; S.cam.dist = S.cam.distTarget = 4.3;
    setTimeout(() => window.__friends[1].say('불멍 최고 🔥'), 1200);
    setTimeout(() => window.__friends[0].emote('🙂'), 1500);
    document.body.classList.remove('bag-open'); return 'ok'` },
  2: { name: '02_aurora', hour: 23.4, wait: 3500, code: `
    const S = window.__shot, M = Math; S.setHour(23.4); S.state.aurora = 25; S.setExposure(1.35);
    const s0 = S.SEATS[0]; S.me.seat = -1; S.me.place(s0.x * 1.5 + 0.6, s0.z * 1.5); S.me.target.copy(S.me.pos);
    ${lookAt(0, 0)} S.cam.tilt = 0.26; S.cam.dist = S.cam.distTarget = 4.2;
    setTimeout(() => window.__friends[2].say('오로라다 ✨'), 1000); return 'ok'` },
  3: { name: '03_shop', hour: 18.9, wait: 3500, code: `
    const S = window.__shot, M = Math; S.setHour(18.9); S.state.aurora = 0; S.setExposure(1.3);
    const [x, z] = S.shopWorld(0.3, 2.4); S.me.seat = -1; S.me.place(x, z); S.me.target.copy(S.me.pos);
    ${lookAt('S.npc.pos.x', 'S.npc.pos.z')} S.cam.tilt = 0.28; S.cam.dist = S.cam.distTarget = 3.8; return 'ok'` },
  4: { name: '04_hunt', hour: 11.2, wait: 3500, code: `
    const S = window.__shot, M = Math; S.setHour(11.2); S.state.aurora = 0; S.setExposure(1.05);
    const an = S.animals.find((a) => a.name === 'deer' && !a.dead) || S.animals.find((a) => a.name === 'fox' && !a.dead);
    an.state = 'idle'; an.timer = 30; an.target.copy(an.pos);
    const t = M.atan2(-an.pos.x, -an.pos.z); // 모닥불 쪽(빈 땅)에서 동물을 바라보게
    S.me.seat = -1; S.me.place(an.pos.x + M.sin(t) * 1.5, an.pos.z + M.cos(t) * 1.5); S.me.target.copy(S.me.pos);
    ${lookAt('an.pos.x', 'an.pos.z')} S.cam.yaw += 1.05; S.cam.tilt = 0.3; S.cam.dist = S.cam.distTarget = 3.4;
    document.body.classList.remove('bag-open'); return 'ok'` },
  5: { name: '05_bag', hour: 14.6, wait: 3000, code: `
    const S = window.__shot, M = Math; S.setHour(14.6); S.state.aurora = 0; S.setExposure(1.05);
    S.me.seat = -1; S.me.place(0.8, 4.6); S.me.target.copy(S.me.pos);
    ${lookAt(0, 0)} S.cam.tilt = 0.4; S.cam.dist = S.cam.distTarget = 4.2;
    document.body.classList.add('bag-open'); S.renderBag(); return 'ok'` },
  6: { name: '06_camp_day', hour: 10.2, wait: 3500, code: `
    const S = window.__shot, M = Math; S.setHour(10.2); S.state.aurora = 0; S.setExposure(1.05);
    const s0 = S.SEATS[0]; S.me.seat = 0; S.me.place(s0.x, s0.z); S.me.target.set(s0.x, 0, s0.z);
    ${lookAt(0, 0)} S.cam.tilt = 0.78; S.cam.dist = S.cam.distTarget = 6;
    setTimeout(() => window.__friends[0].say('오늘도 살아남자 💪'), 900);
    document.body.classList.remove('bag-open'); return 'ok'` },
  7: { name: '07_lantern', hour: 21.8, wait: 5200, code: `
    const S = window.__shot, M = Math; S.setHour(21.8); S.state.aurora = 0; S.setExposure(1.3);
    const s0 = S.SEATS[0]; S.me.seat = -1; S.me.place(s0.x * 1.4, s0.z * 1.4); S.me.target.copy(S.me.pos);
    ${lookAt(0, 0)} S.cam.tilt = 0.22; S.cam.dist = S.cam.distTarget = 4.6;
    document.body.classList.remove('bag-open');
    S.launchLantern(S.me.pos.x + 0.7, S.me.pos.z - 0.5, '내일 발표가 걱정돼. 잘 할 수 있겠지?');
    setTimeout(() => S.launchLantern(-1.6, -1.0, null), 1500);
    setTimeout(() => S.launchLantern(1.9, -0.8, null), 2600);
    setTimeout(() => S.launchLantern(-0.4, -2.2, null), 3400);
    return 'ok'` }
};

(async () => {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SCENES);
  const target = await getTarget();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(JSON.stringify(d.error))) : p.res(d.result); } else events.push(d); };
  await new Promise((r) => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 640, height: 360, deviceScaleFactor: 3, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?shot=1&solo=1&hour=21&v=${Date.now()}` });
  let ok = false;
  for (let i = 0; i < 80; i++) { await sleep(500); try { if (await evaluate('!!window.__shot')) { ok = true; break; } } catch (e) {} }
  if (!ok) { const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => JSON.stringify(e.params.exceptionDetails).slice(0, 300)); throw new Error('게임이 뜨지 않음: ' + errs.join(' | ')); }
  await run(`document.querySelector('#gateName').value = '찰비스'; document.querySelector('#enter').click(); return 'ok'`);
  await sleep(2500);
  await run(SETUP);
  await sleep(4000);
  for (const k of want) {
    const sc = SCENES[k]; if (!sc) continue;
    await run(sc.code);
    await sleep(sc.wait);
    await shot(sc.name);
  }
  const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => JSON.stringify(e.params.exceptionDetails).slice(0, 200));
  if (errs.length) console.log('page errors:', errs.join('\n'));
  ws.close(); cleanup(); process.exit(0);
})().catch((e) => { console.error(e.message); cleanup(); process.exit(1); });
