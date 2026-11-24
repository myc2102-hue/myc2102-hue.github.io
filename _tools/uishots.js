// 촬스의 숲 UI 점검용 캡처: 기기 크기별로 대문·HUD·메뉴·매점·고민 창을 찍는다.
// 사용: node uishots.js [출력폴더] [설정이름…]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = '/Users/apple/Desktop/claude/찰스의숲';
const OUT = process.argv[2] || path.join(__dirname, 'ui');
const ONLY = process.argv.slice(3);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8766, DBG = 9334;
const PROF = path.join(process.env.TMPDIR || '/tmp', 'chrome-ui-prof');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', DIR], { stdio: 'ignore' });
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${PROF}`,
  '--window-size=1440,900', '--hide-scrollbars', '--mute-audio', '--autoplay-policy=no-user-gesture-required',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl',
  '--no-first-run', '--no-default-browser-check', '--disable-background-timer-throttling', 'about:blank'
], { stdio: 'ignore' });
const cleanup = () => { try { chrome.kill(); } catch (e) {} try { server.kill(); } catch (e) {} };
process.on('exit', cleanup); process.on('SIGINT', () => { cleanup(); process.exit(1); });

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${DBG}/json/list`); const t = (await r.json()).find((x) => x.type === 'page'); if (t) return t; } catch (e) {}
    await sleep(300);
  }
  throw new Error('chrome devtools 응답 없음');
}
let ws, idSeq = 0; const pending = new Map(); const events = [];
function send(method, params = {}) { const id = ++idSeq; ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => pending.set(id, { res, rej })); }
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error('page error: ' + JSON.stringify(r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
  return r.result && r.result.value;
}
const run = (code) => evaluate('(() => {' + code + '})()');
async function shot(name) {
  await run(`document.body.classList.remove('idle'); return 1`);
  await sleep(700);
  const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82, fromSurface: true });
  const f = path.join(OUT, name + '.jpg');
  fs.writeFileSync(f, Buffer.from(r.data, 'base64'));
  console.log('saved', f);
}

const SETUP = `
  const S = window.__shot; const M = Math;
  S.me.setAvatar('female-b');
  const pick = (i) => (i * 2) % S.SEATS.length;
  window.__friends = [
    S.friend('산들바람', '#7fc8ff', 'female-c', 2, 2, pick(1), 1860),
    S.friend('달빛토끼', '#ffb3d9', 'male-b', -2, 2, pick(2), 950),
    S.friend('모닥불장인', '#b5e36b', 'male-e', 0, -2.5, 7, 3410)
  ];
  S.surv.since = Date.now() - 2640 * 1000;
  S.prof.gold = 128; S.renderWallet();
  S.prof.inv = { wood: 5, fruit: 3, meat_fox: 2, match: 1, aurora: 1, scroll: 2 }; S.renderBag();
  S.surv.hunger = 72; S.surv.warmth = 88; S.setHour(20.5); S.setExposure(1.3);
  const s = S.SEATS[0]; S.me.seat = -1; S.me.place(s.x * 1.5, s.z * 1.5); S.me.target.copy(S.me.pos);
  S.cam.yaw = M.atan2(-S.me.pos.x, -S.me.pos.z); S.me.yaw = S.cam.yaw; S.cam.tilt = 0.32; S.cam.dist = S.cam.distTarget = 4.4;
  document.getElementById('toast').style.display = '';
  return 'ok'`;
const STATES = {
  hud: `document.body.classList.remove('bag-open', 'chat-open', 'menu-open', 'hud-collapsed'); return 1`,
  menu: `if (document.body.classList.contains('mobile')) document.body.classList.add('menu-open'); return 1`,
  bag: `document.body.classList.remove('menu-open'); document.body.classList.add('bag-open'); return 1`,
  chat: `document.body.classList.remove('menu-open', 'bag-open'); document.body.classList.add('chat-open'); return 1`,
  shop: `document.body.classList.remove('menu-open', 'bag-open', 'chat-open'); const S = window.__shot; const [x, z] = S.shopWorld(0.3, 2.4); S.me.place(x, z); S.me.target.copy(S.me.pos); S.openShop(); return 1`,
  worry: `document.getElementById('shop').removeAttribute('data-open'); document.getElementById('worry').setAttribute('data-open', ''); document.getElementById('worryText').value = '내일 발표가 걱정돼'; return 1`,
  toast: `document.getElementById('worry').removeAttribute('data-open'); window.__shot.toast('💡 매점에서 고민 두루마리를 사서 풍등에 태워 보내세요 🏮', 5000); return 1`
};
const CONFIGS = {
  desktop: { width: 1440, height: 900, dsf: 1, mobile: false, states: ['hud', 'shop', 'worry', 'toast'] },
  phoneP: { width: 390, height: 844, dsf: 2, mobile: true, states: ['hud', 'menu', 'bag', 'chat', 'shop', 'worry', 'toast'] },
  phoneL: { width: 844, height: 390, dsf: 2, mobile: true, states: ['hud', 'menu', 'bag', 'shop', 'worry'] },
  ipadL: { width: 1180, height: 820, dsf: 1, mobile: true, states: ['hud', 'menu', 'bag', 'shop'] }
};

(async () => {
  const target = await getTarget();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(JSON.stringify(d.error))) : p.res(d.result); } else events.push(d); };
  await new Promise((r) => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  for (const [name, c] of Object.entries(CONFIGS)) {
    if (ONLY.length && !ONLY.includes(name)) continue;
    await send('Emulation.setDeviceMetricsOverride', { width: c.width, height: c.height, deviceScaleFactor: c.dsf, mobile: c.mobile });
    await send('Emulation.setTouchEmulationEnabled', { enabled: c.mobile, maxTouchPoints: c.mobile ? 5 : 1 });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?shot=1&solo=1&hour=21&v=${Date.now()}` });
    let ok = false;
    for (let i = 0; i < 80; i++) { await sleep(500); try { if (await evaluate('!!window.__shot')) { ok = true; break; } } catch (e) {} }
    if (!ok) { const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => JSON.stringify(e.params.exceptionDetails).slice(0, 500)); throw new Error('게임이 뜨지 않음 ' + name + '\n' + errs.join('\n')); }
    await sleep(1500);
    await shot(`${name}_0gate`);
    await run(`document.querySelector('#gateName').value = '찰비스'; document.querySelector('#enter').click(); return 'ok'`);
    await sleep(2600);
    await run(SETUP);
    await sleep(3500);
    let n = 1;
    for (const st of c.states) { await run(STATES[st]); await sleep(900); await shot(`${name}_${n++}${st}`); }
  }
  const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => JSON.stringify(e.params.exceptionDetails).slice(0, 240));
  if (errs.length) console.log('page errors:\n' + errs.join('\n'));
  ws.close(); cleanup(); process.exit(0);
})().catch((e) => { console.error(e.message); cleanup(); process.exit(1); });
