/* Rene Plan app. All data stays on this phone (localStorage + IndexedDB). */
const $ = s => document.querySelector(s);
const KEY = 'reneCoach_v1';
const DEFAULTS = {
  name: 'Rene', start: '2026-09-29', wake: '06:30', meal1: '09:00', lift: '11:00', meal2: '13:00',
  dinner: '19:00', bed: '22:15', work: 'desk', snacks: ['14:00', '16:30', '20:00'],
  pilates: '09:00', plunge: '11:00', checkin: '18:00', units: 'lb'
};
let DB = load();
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function save() { localStorage.setItem(KEY, JSON.stringify(DB)); }
function S() { return Object.assign({}, DEFAULTS, DB.settings || {}); }
DB.checks = DB.checks || {}; DB.daily = DB.daily || {}; DB.sessions = DB.sessions || {}; DB.checkins = DB.checkins || {};
DB.tests = DB.tests || {}; DB.films = DB.films || {}; DB.seen = DB.seen || {}; DB.formfilms = DB.formfilms || {};
DB.kcalAdj = DB.kcalAdj || 0;

// ---------- dates ----------
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => ymd(new Date());
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtDate = s => { const d = parseYmd(s); return DAYN[d.getDay()] + ' ' + d.toLocaleString('en-US', { month: 'short' }) + ' ' + d.getDate(); };
function weekOf(dateStr) {
  const diff = Math.floor((parseYmd(dateStr) - parseYmd(S().start)) / 86400000);
  if (diff < 0) return 0;
  return Math.min(12, Math.floor(diff / 7) + 1);
}
function phaseOf(w) { return PLAN.phases.find(p => w >= p.weeks[0] && w <= p.weeks[1]) || PLAN.phases[0]; }
function block(list, w) { const ww = Math.max(1, w); return list.find(b => ww >= b.weeks[0] && ww <= b.weeks[1]) || list[0]; }
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const toT = m => pad(Math.floor(((m % 1440) + 1440) % 1440 / 60)) + ':' + pad(((m % 60) + 60) % 60);
const t12 = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'p' : 'a'; h = h % 12 || 12; return h + ':' + pad(m) + ap; };
const mins = sec => Math.max(1, Math.round(sec / 60));
const hm = sec => { const m = Math.round(sec / 60); return m >= 60 ? Math.floor(m / 60) + ':' + pad(m % 60) : m + ' min'; };
function toast(msg, ms) { const t = $('#toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(() => t.style.display = 'none', ms || 1800); }
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p || [250, 120, 250]); } catch (e) { } }

// ---------- time math ----------
const itemSec = it => it.sec || it.est || 45;
const listSec = items => items.reduce((a, it) => a + itemSec(it), 0);
const exSec = (e, sets) => sets * ((e.each ? 80 : 40) + e.rest) + 60;
const rMin = k => mins(listSec(ROUTINES[k].items));
function dayPlan(dow, w) {
  const W = WORKOUTS[dow]; if (!W || W.rest) return null;
  const deload = PLAN.deloadWeeks.includes(w);
  const setsOf = e => deload ? Math.max(1, Math.round(e.sets * 2 / 3)) : e.sets;
  const warm = W.legs ? [...W.warmup, ...block(JUMPS, w).items.filter(x => !(dow === 2 && /Thursday only/.test(x.name)))] : W.warmup;
  const fin = W.legs ? [...block(ANKLE, w).items, ...W.finish] : W.finish;
  const cardio = W.cardio ? (w >= 10 ? CARDIO.late : CARDIO.early) : null;
  const t = { warm: listSec(warm), lift: W.ex.reduce((a, e) => a + exSec(e, setsOf(e)), 0), cardio: cardio ? (w >= 10 ? 900 : 1200) : 0, fin: listSec(fin), sauna: SAUNA.sec };
  t.total = t.warm + t.lift + t.cardio + t.fin + t.sauna;
  return { W, warm, fin, cardio, t, deload, setsOf };
}

// ---------- Apple Health / Hume auto-fill (from the iPhone Shortcut) ----------
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function num(s) { if (s == null) return null; const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; }
function parseAnyDate(s) {
  if (!s) return null; s = String(s);
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/); if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.toLowerCase().match(/([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/); if (m && MONTHS.includes(m[1])) return m[3] + '-' + pad(MONTHS.indexOf(m[1]) + 1) + '-' + pad(+m[2]);
  m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if (m) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; return y + '-' + pad(+m[1]) + '-' + pad(+m[2]); }
  if (/today/i.test(s)) return today(); if (/yesterday/i.test(s)) return addDays(today(), -1);
  return null;
}
function sdec(x) { for (let i = 0; i < 2; i++) { if (!/%[0-9A-Fa-f]{2}/.test(x)) break; try { x = decodeURIComponent(x); } catch (e) { break; } } return x; }
function handleSync() {
  const h = sdec(location.hash || '');
  if (!/^#sync/.test(h)) return;
  const raw = h.replace(/^#sync=?/, '');
  const kv = {}; raw.split(/[|&]/).forEach(p => { const i = p.indexOf('='); if (i > 0) kv[p.slice(0, i).trim().toLowerCase()] = p.slice(i + 1).trim(); });
  const td = today(), got = [];
  const put = (d, k, v) => { DB.daily[d] = DB.daily[d] || {}; DB.daily[d][k] = v; };
  const w = num(kv.w), bf = num(kv.bf), lbm = num(kv.lbm), st = num(kv.steps), sy = num(kv.sy);
  const wd = parseAnyDate(kv.wd) || td;
  if (w) { let wl = w; if (/kg/i.test(kv.w) && S().units === 'lb') wl = +(w * 2.20462).toFixed(1); put(wd, 'weight', String(wl)); put(wd, 'wsrc', 'Hume'); got.push(wl + ' ' + S().units); }
  if (bf) { const b = bf <= 1 ? +(bf * 100).toFixed(1) : bf; put(wd, 'bf', String(b)); got.push(b + '% fat'); }
  if (lbm) put(wd, 'lbm', String(lbm));
  if (st != null) { put(td, 'steps', String(Math.round(st))); got.push(Math.round(st).toLocaleString() + ' steps'); }
  if (sy != null) put(addDays(td, -1), 'steps', String(Math.round(sy)));
  DB.lastSync = { at: Date.now(), wd, w, bf, steps: st };
  save();
  history.replaceState(null, '', location.pathname + location.search);
  setTimeout(() => toast(got.length ? 'Synced: ' + got.join(' · ') : 'Opened from Shortcut (no new numbers)', 3500), 300);
}
function latestBody() {
  const ds = Object.keys(DB.daily).filter(d => DB.daily[d].weight).sort();
  if (!ds.length) return null; const d = ds[ds.length - 1]; return { d, w: DB.daily[d].weight, bf: DB.daily[d].bf };
}
const SHORTCUT_PROMPT = `Make a shortcut called "Rene Plan" that:
1. Finds the most recent Weight sample in Health (sort by Start Date, latest first, limit 1).
2. Finds the most recent Body Fat Percentage sample in Health (latest first, limit 1).
3. Finds Steps samples in Health where Start Date is today, grouped by Day (limit 1).
4. Finds Steps samples in Health where Start Date is yesterday, grouped by Day (limit 1).
5. Makes a Text: w=[Weight]|wd=[Weight's Start Date]|bf=[Body Fat Percentage]|steps=[Steps today]|sy=[Steps yesterday]
6. URL-encodes that Text.
7. Makes a Text: https://renenicolas.github.io/rene-coach/#sync=[URL Encoded Text]
8. Opens that URL.`;

// ---------- schedule builder ----------
function blocksFor(dateStr) {
  const s = S(), d = parseYmd(dateStr), dow = d.getDay(), w = weekOf(dateStr), W = WORKOUTS[dow];
  const wake = toMin(s.wake), bed = toMin(s.bed);
  const b = [];
  b.push({ id: 'wake', t: s.wake, ttl: 'Wake up + weigh in', d: 'Weigh yourself after the bathroom, before food. Type it on the Today screen. Water + pinch of salt.' });
  if (testsDue(dateStr)) { const tw = w >= 12 ? 12 : w >= 6 ? 6 : 0; b.push({ id: 'tests', t: toT(wake + 44), ttl: `Week-${tw} tests (15 min)`, d: tw ? 'Same tests as week 0. See how far you came.' : 'Your starting point. Quick tests + a few short videos.', tests: true }); }
  b.push({ id: 'walk', t: toT(wake + 15), ttl: 'Sun walk (20-30 min)', d: 'Outside, no sunglasses, even if cloudy.' });
  b.push({ id: 'morning', t: toT(wake + 45), ttl: `Morning routine (${rMin('morning')} min)`, d: "Tripp's 5-min routine + ankle rocks. Follow the video.", play: 'morning' });
  b.push({ id: 'meal1', t: s.meal1, ttl: 'Meal 1 · Team Sweet + morning supplements', d: '1 whole egg + 6 whites (or Greek yogurt), 80 g oats, berries, a little honey.', team: 'Sweet', take: SUPPS.am });
  b.push({ id: 'coffee', t: toT(Math.max(wake + 60, toMin(s.meal1) + 45)), ttl: 'Coffee + L-theanine', d: 'None after 2 PM.', take: SUPPS.coffee });
  if (dow >= 1 && dow <= 5) {
    const P = dayPlan(dow, Math.max(1, w));
    b.push({ id: 'prelift', t: toT(toMin(s.lift) - 60), ttl: 'Pre-gym supplements', d: 'One hour before the gym.', take: SUPPS.preLift });
    b.push({ id: 'lift', t: s.lift, ttl: `Gym: ${W.title.split(' + ')[0].split(' (')[0]} (${hm(P.t.total)})`, d: `Warm-up ${mins(P.t.warm)} · lift ${mins(P.t.lift)}${P.cardio ? ' · bike ' + mins(P.t.cardio) : ''} · stretch ${mins(P.t.fin)} · sauna 15`, gym: true, take: SUPPS.gym });
    b.push({ id: 'meal2', t: toT(Math.max(toMin(s.meal2), toMin(s.lift) + Math.round(P.t.total / 60) + 10)), ttl: 'Meal 2 · Team Sweet (post-lift)', d: 'Chicken, shrimp or cod + 1.5 cups white rice + fruit.', team: 'Sweet', take: SUPPS.meal2 });
  } else {
    b.push({ id: 'meal2', t: s.meal2, ttl: 'Meal 2', d: 'Protein + pick a team.', team: 'Pick', take: SUPPS.meal2 });
  }
  if (dow === 6) b.push({ id: 'pilates', t: s.pilates, ttl: 'Reformer Pilates (morning)', d: 'Plus a long walk (45-60 min) sometime today.' });
  if (dow === 0) {
    b.push({ id: 'reset', t: toT(wake + 60), ttl: `Floor reset (${rMin('floorReset')} min)`, d: 'Back, each side, stomach. 2 min each.', play: 'floorReset' });
    b.push({ id: 'plunge', t: s.plunge, ttl: 'Sauna + cold plunge (~35 min)', d: '2 rounds: sauna, then plunge. End on cold.', play: 'contrast', take: SUPPS.sauna });
    b.push({ id: 'checkin', t: s.checkin, ttl: 'Weekly check-in + front photo (3 min)', d: 'Progress tab. The app adjusts your plan for you.', progress: true });
  }
  s.snacks.forEach((t, i) => b.push({ id: 'snack' + i, t, ttl: `Floor snack (${rMin('floor')} min)`, d: 'Phone/TV on the floor. Timer tells you when to switch.', play: 'floor', opt: true }));
  b.push({ id: 'dinner', t: s.dinner, ttl: 'Dinner · pick a team', d: 'RICH: steak/salmon + veg + oil, no dessert. SWEET: lean protein + rice/potato + veg, yogurt bowl after.', team: 'Pick', take: SUPPS.dinner });
  b.push({ id: 'postwalk', t: toT(toMin(s.dinner) + 45), ttl: '10-min walk after dinner', d: 'Helps digestion + steps.' });
  b.push({ id: 'evening', t: toT(bed - 60), ttl: `Wind-down (${rMin('winddown')} min)`, d: 'Face release, legs up the wall, then 2-2-4 breathing in bed.', play: 'winddown', take: SUPPS.night });
  b.push({ id: 'screens', t: toT(bed - 45), ttl: 'Screens off, lights dim', d: 'Phone out of the bedroom.' });
  b.push({ id: 'bed', t: s.bed, ttl: 'Lights out', d: 'Room cool + pitch black. 2-2-4 breathing.' });
  return b.sort((a, c) => toMin(a.t) - toMin(c.t));
}

// ---------- router ----------
let TAB = 'today', GYMDAY = null, PROGTAB = 'week';
function render() {
  const app = $('#app');
  const s = S(), td = today(), w = weekOf(td), ph = phaseOf(Math.max(1, w));
  const title = { today: 'Today', gym: 'Gym', learn: 'Learn', progress: 'Progress' }[TAB];
  const dayName = w === 0 ? 'Plan starts ' + fmtDate(s.start) : 'Week ' + w + ' of 12 · ' + ph.name + (PLAN.deloadWeeks.includes(w) ? ' · easy week' : '');
  app.innerHTML = `<header><div style="flex:1"><h1>${TAB === 'today' ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][parseYmd(td).getDay()] : title}</h1><div class="sub">${TAB === 'today' ? fmtDate(td).slice(4) + ' · ' : ''}${dayName}</div></div><button class="iconbtn" onclick="openSettings()">⚙︎</button></header><main id="main"></main>
  <nav>${[['today', '☀︎', 'Today'], ['gym', '🏋︎', 'Gym'], ['learn', '📖', 'Learn'], ['progress', '📈', 'Progress']].map(([k, ic, l]) => `<button class="${TAB === k ? 'on' : ''}" onclick="go('${k}')"><span class="ic">${ic}</span>${l}</button>`).join('')}</nav>`;
  ({ today: renderToday, gym: renderGym, learn: renderLearn, progress: renderProgress })[TAB]();
  window.scrollTo(0, 0);
}
function go(t) { TAB = t; if (t === 'gym') GYMDAY = null; render(); }

// ---------- TODAY (one thing at a time) ----------
const takeBox = b => b.take ? `<div class="why" style="margin-top:8px;border-left:3px solid #22c55e"><b>💊 Take:</b><ul class="cues" style="margin:4px 0 0">${b.take.map(x => `<li>${x}</li>`).join('')}</ul></div>` : '';
function openSupps() { const S2 = SUPPS, sec2 = (t, l) => `<div class="item"><b>${t}</b><ul class="cues">${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`, s = S();
  openModal('Supplements', `<div class="card"><div class="small mute">Your Superpower stack, by time of day. The Today screen shows each one when it's time.</div>${sec2(t12(s.meal1) + ' · with Meal 1', S2.am)}${sec2(t12(toT(Math.max(toMin(s.wake) + 60, toMin(s.meal1) + 45))) + ' · coffee', S2.coffee)}${sec2(t12(toT(toMin(s.lift) - 60)) + ' · gym days, 1 hr before', S2.preLift)}${sec2('During the gym', S2.gym)}${sec2('With Meal 2 (every day)', S2.meal2)}${sec2(t12(s.dinner) + ' · with dinner', S2.dinner)}${sec2('Night (wind-down)', S2.night)}${sec2('Sunday, before sauna', S2.sauna)}</div><div class="card"><h2>Notes</h2><ul class="cues">${S2.notes.map(x => `<li>${x}</li>`).join('')}</ul></div>`); }
let OPEN = {}, LASTKEY = '';
const winOf = b => b.gym ? 120 : 60;
const isDone = (td, b) => !!(DB.checks[td] || {})[b.id];
function testsDue(td) { const w = weekOf(td); if (w <= 1) return !testsDone(0); if (w === 6 || w === 12) return !testsDone(w); return false; }
function nowState(td) {
  const bl = blocksFor(td), n = new Date(), nm = n.getHours() * 60 + n.getMinutes();
  let cur = null;
  bl.forEach(b => { const m = toMin(b.t); if (b.id !== 'bed' && m <= nm && nm < m + winOf(b) && !isDone(td, b)) cur = b; });
  const later = bl.filter(b => b !== cur && !isDone(td, b) && toMin(b.t) > nm);
  const missed = bl.filter(b => b !== cur && !isDone(td, b) && !b.opt && toMin(b.t) + winOf(b) <= nm && !['wake', 'walk', 'coffee', 'prelift', 'postwalk', 'screens', 'bed', 'meal1', 'meal2', 'dinner'].includes(b.id));
  return { bl, cur, later, missed, nm, asleep: nm < toMin(S().wake) - 30 || nm >= toMin(S().bed) };
}
function todayKey() { const td = today(), st = nowState(td); return td + '|' + (st.cur ? st.cur.id : '-') + '|' + (st.later[0] ? st.later[0].id : '-') + '|' + st.asleep; }
function tipFor(b, td) {
  const dow = parseYmd(td).getDay(), id = b.id;
  if (b.team) return 'Pick a team: protein + Sweet (rice, fruit, oats, honey) OR protein + Rich (steak, salmon, oil, avocado). Not both. Veggies first, stop at 80% full.';
  if (id === 'coffee') return 'Salted water first. No coffee after 2 PM.';
  if (b.gym) return 'Left side first on one-leg and one-arm moves. Pain up to 3/10 is OK if it is gone by tomorrow. Sharp pain = stop or swap.';
  if (id === 'walk') return 'Outside, no sunglasses, even if cloudy.';
  if (id === 'evening' || id === 'screens' || id === 'postwalk') return (dow === 5 || dow === 6) ? 'Drinking tonight? 3-4 max, water between, no sauna tonight, no heavy legs tomorrow.' : 'Sleep on your back or switch sides. Room cool and dark.';
  return '';
}
function bigBtn(b) {
  if (b.gym) return `<button class="btn" onclick="go('gym')">▶ Start workout</button>`;
  if (b.play) return `<button class="btn" onclick="play('${b.play}')">▶ Follow along</button>`;
  if (b.tests) return `<button class="btn" onclick="PROGTAB='tests';go('progress')">▶ Open tests</button>`;
  if (b.progress) return `<button class="btn" onclick="PROGTAB='week';go('progress')">▶ Check in</button>`;
  if (b.team) return `<button class="btn sec" onclick="openFood()">What to eat</button>`;
  return '';
}
function weighBox(td) { const dl = DB.daily[td] || {}; return `<div class="row" style="margin-top:10px"><input id="wtin" inputmode="decimal" placeholder="Weight (${S().units})" value="${dl.weight || ''}" style="flex:1;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:12px;padding:12px;font-size:17px"><button class="btn sm" onclick="logWeight()">Save</button></div>`; }
function logWeight() { const v = ($('#wtin') || {}).value; if (!v) return; const td = today(); DB.daily[td] = DB.daily[td] || {}; DB.daily[td].weight = v; DB.checks[td] = DB.checks[td] || {}; DB.checks[td].wake = true; save(); toast('Saved ' + v); render(); }
function renderToday() {
  const td = today(), st = nowState(td), s = S(), dl = DB.daily[td] || {};
  LASTKEY = todayKey();
  let h = '';
  if (!DB.introSeen) h += `<div class="card"><div class="row"><div class="small" style="flex:1">Using a default day (wake ${t12(s.wake)}, gym ${t12(s.lift)}). Change times any time in ⚙︎.</div><button class="btn sm sec" onclick="DB.introSeen=1;save();render()">OK</button></div></div>`;
  // NOW
  h += `<div class="card next">`;
  if (st.asleep && !st.cur) {
    h += `<span class="pill">Night</span><div class="big" style="margin-top:6px">Sleep 😴</div><div class="small">Tomorrow starts at ${t12(s.wake)}: weigh in, then a sun walk.</div>`;
  } else if (st.cur) {
    const b = st.cur, tip = tipFor(b, td);
    h += `<div class="row"><span class="pill g">Now</span><span class="tiny mute" style="margin-left:auto">${t12(b.t)}</span></div><div class="big" style="margin-top:6px">${b.ttl}</div><div class="small">${b.d}</div>${takeBox(b)}${tip ? `<div class="why" style="margin-top:8px">${tip}</div>` : ''}${b.id === 'wake' ? weighBox(td) : ''}<div class="row" style="margin-top:10px">${bigBtn(b)}<button class="btn sm sec" onclick="toggle('${td}','${b.id}')">✓ Done</button></div>`;
  } else if (st.later.length) {
    const nx = st.later[0];
    h += `<span class="pill b">Free until ${t12(nx.t)}</span><div class="big" style="margin-top:6px">Next: ${nx.ttl}</div><div class="small" style="margin-top:6px">Meanwhile: stand up every hour for a 2-min movement break, and walk when you can (goal 10-12k steps).</div><div class="row" style="margin-top:10px"><button class="btn sm" onclick="play('moveBreak')">▶ Movement break</button>${nx.play || nx.gym ? `<button class="btn sm sec" onclick="${nx.gym ? "go('gym')" : `play('${nx.play}')`}">Start ${nx.gym ? 'workout' : 'it'} early</button>` : ''}</div>`;
  } else {
    h += `<span class="pill g">Done</span><div class="big" style="margin-top:6px">That's today 🎉</div><div class="small">Screens off soon, lights out at ${t12(s.bed)}.</div>`;
  }
  h += `</div>`;
  // weigh-in (only if not already in the Now card)
  if (!(st.cur && st.cur.id === 'wake')) {
    if (!dl.weight && st.nm < 14 * 60 && !st.asleep) h += `<div class="card"><b>Weigh-in</b> <span class="tiny mute">morning, before food</span>${weighBox(td)}</div>`;
    else if (dl.weight) h += `<div class="tiny mute" style="margin:0 6px 10px">✓ Weighed ${dl.weight} ${s.units} · 7-day avg ${avgWeight(td)}</div>`;
  }
  // later
  if (st.later.length > (st.cur ? 0 : 1)) h += `<div class="card"><h2>Later today</h2>${st.later.slice(st.cur ? 0 : 1, st.cur ? 3 : 4).map(b => `<div class="item row"><div class="time" style="width:58px;color:var(--mute);font-size:13px">${t12(b.t)}</div><div style="flex:1"><b>${b.ttl}</b>${b.take ? `<div class="tiny mute">💊 ${b.take.map(x => x.split(':')[0]).join(', ')}</div>` : ''}</div></div>`).join('')}</div>`;
  // missed
  if (st.missed.length && !st.asleep) h += `<div class="card"><div class="small"><b>Didn't get to:</b> ${st.missed.map(b => `${b.play ? `<button class="linkish" onclick="play('${b.play}')">${b.ttl.split(' (')[0]}</button>` : b.gym ? `<button class="linkish" onclick="go('gym')">${b.ttl.split(' (')[0]}</button>` : b.tests ? `<button class="linkish" onclick="PROGTAB='tests';go('progress')">${b.ttl.split(' (')[0]}</button>` : b.ttl.split(' (')[0]}`).join(' · ')}</div><div class="tiny mute">Do it if you can. If the day is gone, skip it. Never double up.</div></div>`;
  // tucked away
  const ch = DB.checks[td] || {};
  h += `<details class="card" ${OPEN.full ? 'open' : ''} ontoggle="OPEN.full=this.open"><summary><b>Full day</b> <span class="tiny mute">${st.bl.filter(b => ch[b.id]).length}/${st.bl.length} done</span></summary><ul class="tl" style="margin-top:8px">${st.bl.map(b => `<li class="${ch[b.id] ? 'done' : ''}"><div class="time">${t12(b.t)}</div><div class="body"><div class="ttl">${b.ttl}</div><div class="d">${b.d}</div>${b.take ? `<div class="d">💊 ${b.take.join(' · ')}</div>` : ''}${actLink(b)}</div><button class="chk ${ch[b.id] ? 'on' : ''}" onclick="toggle('${td}','${b.id}')">${ch[b.id] ? '✓' : ''}</button></li>`).join('')}</ul></details>`;
  h += `<details class="card" ${OPEN.log ? 'open' : ''} ontoggle="OPEN.log=this.open"><summary><b>Log more</b> <span class="tiny mute">optional: steps, stiffness, pain, protein</span></summary>
   <div class="grid2" style="margin-top:8px"><label class="fld"><span>Steps</span><input inputmode="numeric" value="${dl.steps || ''}" onchange="setDaily('steps',this.value)"></label>
   <label class="fld"><span>Morning stiffness (min)</span><input inputmode="numeric" value="${dl.stiff || ''}" onchange="setDaily('stiff',this.value)"></label>
   <label class="fld"><span>Drinks</span><input inputmode="numeric" value="${dl.drinks || ''}" onchange="setDaily('drinks',this.value)"></label></div>
   <div class="fld"><span>Protein (3 x ~67 g)</span><div class="row">${[0, 1, 2].map(i => `<button class="chk ${(dl.protein || [])[i] ? 'on' : ''}" onclick="protein(${i})">${(dl.protein || [])[i] ? '✓' : ''}</button>`).join('')}<span class="small mute">Meal 1 · Meal 2 · Dinner</span></div></div>
   <div class="fld"><span>Pain (0-10). OK up to 3 if gone by morning.</span>${painInputs(dl.pain || {}, 'setPain')}</div>
   <label class="fld"><span>Notes</span><textarea rows="2" onchange="setDaily('notes',this.value)">${dl.notes || ''}</textarea></label></details>`;
  $('#main').innerHTML = h;
}
function actBtn(b) { if (b.tests) return `<button class="btn sm" onclick="PROGTAB='tests';go('progress')">Open tests</button>`; if (b.gym) return `<button class="btn sm" onclick="go('gym')">Start workout</button>`; if (b.play) return `<button class="btn sm" onclick="play('${b.play}')">▶ Follow along</button>`; if (b.progress) return `<button class="btn sm" onclick="PROGTAB='week';go('progress')">Check in</button>`; if (b.team) return `<button class="btn sm" onclick="openFood()">Food rules</button>`; return ''; }
function actLink(b) { if (b.tests) return `<button class="linkish" onclick="PROGTAB='tests';go('progress')">▶ Open tests</button>`; if (b.gym) return `<button class="linkish" onclick="go('gym')">▶ Open workout</button>`; if (b.play) return `<button class="linkish" onclick="play('${b.play}')">▶ Follow along</button> <button class="linkish" onclick="openRoutine('${b.play}')">· see all steps</button>`; if (b.progress) return `<button class="linkish" onclick="PROGTAB='week';go('progress')">▶ Check in</button>`; if (b.team) return `<button class="linkish" onclick="openFood()">▶ Pick-a-team guide</button>`; return ''; }
function toggle(d, id) { DB.checks[d] = DB.checks[d] || {}; DB.checks[d][id] = !DB.checks[d][id]; save(); render(); }
function setDaily(k, v) { const d = today(); DB.daily[d] = DB.daily[d] || {}; DB.daily[d][k] = v; if (k === 'weight' && v) { DB.checks[d] = DB.checks[d] || {}; DB.checks[d].wake = true; } save(); toast('Saved'); }
function protein(i) { const d = today(); DB.daily[d] = DB.daily[d] || {}; const p = DB.daily[d].protein || [0, 0, 0]; p[i] = !p[i]; DB.daily[d].protein = p; save(); render(); }
const AREAS = [['back', 'Low back'], ['knees', 'Knees'], ['ankles', 'Ankles/feet'], ['hips', 'Hips/groin'], ['neck', 'Neck/shoulders']];
function painInputs(p, fn) { return AREAS.map(([k, l]) => `<div class="painrow"><span>${l}</span><input type="range" min="0" max="10" value="${p[k] || 0}" oninput="this.nextElementSibling.textContent=this.value" onchange="${fn}('${k}',this.value)"><b style="width:22px;text-align:right">${p[k] || 0}</b></div>`).join(''); }
function setPain(k, v) { const d = today(); DB.daily[d] = DB.daily[d] || {}; DB.daily[d].pain = DB.daily[d].pain || {}; DB.daily[d].pain[k] = +v; save(); }

// ---------- media ----------
function ytSrc(id) { return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1`; }
function mediaEl(m, img) {
  if (m && m.type === 'mp4') return `<video class="vid" src="${m.src}" autoplay muted loop playsinline></video>`;
  if (m && m.type === 'yt') return `<div class="embed" style="margin-top:8px"><iframe src="${ytSrc(m.id)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
  if (img) return `<img class="thumb" src="${img}" loading="lazy">`;
  return '';
}
let YTN = 0;
function ytBtn(key, label) { const v = VID[key]; if (!v) return ''; const id = 'yt' + (YTN++); return `<div id="${id}"><button class="btn sm sec" style="margin-top:6px" onclick="document.getElementById('${id}').innerHTML=mediaEl({type:'yt',id:'${v[0]}'})+'<a class=&quot;tiny mute&quot; href=&quot;https://youtu.be/${v[0]}&quot; target=&quot;_blank&quot;>Open in YouTube</a>'">▶ ${label || 'Watch demo'} (${v[1]}s)</button></div>`; }
function mediaBtn(m, img) {
  if (m && m.type === 'yt') { const id = 'yt' + (YTN++); return `<div id="${id}"><button class="btn sm sec" style="margin-top:6px" onclick="document.getElementById('${id}').innerHTML=mediaEl({type:'yt',id:'${m.id}'})">▶ Watch demo (${m.dur}s)</button></div>`; }
  return mediaEl(m, img);
}

// ---------- modals ----------
function openModal(title, inner) { const m = $('#modal'); m.innerHTML = `<header><div style="flex:1"><h1>${title}</h1></div><button class="iconbtn" onclick="closeModal()">✕</button></header><main>${inner}</main>`; m.classList.add('on'); m.scrollTop = 0; }
function closeModal() { Player.stop(); $('#modal').classList.remove('on'); $('#modal').innerHTML = ''; }
function openRoutine(k) {
  const r = ROUTINES[k];
  openModal(r.title, `<div class="card"><span class="pill b">${rMin(k)} min</span> <span class="srcp">${r.src || ''}</span><div class="small" style="margin-top:8px">${r.why}</div><button class="btn" style="margin-top:10px" onclick="play('${k}')">▶ Follow along (video + timer)</button></div>` + stepCards(r.items) + (k === 'floor' ? `<div class="card"><h2>All resting positions</h2><div class="photos">${['01-seiza', '02-seiza-side', '03-samurai-toes-tucked', '04-upright-fetal-half-seiza', '05-deep-squat-rest', '06-criss-cross', '07-all-fours-rock', '10-mucci-seiza', '11-mucci-slant-board-lean'].map(n => `<img src="img/${n}.jpg" loading="lazy">`).join('')}</div><div class="small mute" style="margin-top:6px">Frames from Tripp's and Mitchell's videos. Skip toes-in squats (bad for your ankles).</div></div>` : ''));
}
function stepCards(items) { return items.map((it, i) => `<div class="card"><div class="row"><div class="num" style="width:28px;height:28px;border-radius:9px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-weight:800">${i + 1}</div><b style="flex:1">${it.name}</b><span class="pill g">${it.dose}</span></div>${it.src ? `<div class="srcp" style="margin-top:4px">${it.src}</div>` : ''}<div class="small" style="margin-top:6px">${it.how}</div>${mediaBtn(it.media, it.img)}</div>`).join(''); }

// ---------- FOLLOW-ALONG PLAYER ----------
const Player = {
  P: null, h: null, lock: null,
  start(title, items, done) { this.stop(); this.P = { title, items, i: 0, left: items[0].sec || 0, run: false, done, t0: 0, half: false }; this.draw(); try { navigator.wakeLock && navigator.wakeLock.request('screen').then(l => this.lock = l).catch(() => { }); } catch (e) { } },
  stop() { clearInterval(this.h); this.h = null; if (this.lock) { try { this.lock.release(); } catch (e) { } this.lock = null; } this.P = null; },
  go(i) { const P = this.P; if (i < 0) return; if (i >= P.items.length) { const d = P.done; this.stop(); closeModal(); toast('Done! Nice work 💪', 2500); buzz([200, 100, 200, 100, 400]); if (d) d(); return; } P.i = i; P.left = P.items[i].sec || 0; P.half = false; P.t0 = Date.now(); this.draw(); if (P.run && P.left) this.tick0(); },
  toggle() { const P = this.P; P.run = !P.run; if (P.run && P.left) { P.t0 = Date.now(); this.tick0(); } else clearInterval(this.h); this.drawClock(); },
  tick0() { clearInterval(this.h); this.last = Date.now(); this.h = setInterval(() => this.tick(), 250); },
  tick() {
    const P = this.P; if (!P || !P.run) return; const now = Date.now(); P.left -= (now - this.last) / 1000; this.last = now;
    const it = P.items[P.i];
    if (it.sides && !P.half && P.left <= it.sec / 2) { P.half = true; buzz(); toast('Switch sides →', 1500); }
    if (P.left <= 0) { clearInterval(this.h); buzz(); P.left = 0; this.drawClock(); setTimeout(() => this.P && this.go(P.i + 1), 1200); return; }
    this.drawClock();
  },
  drawClock() {
    const P = this.P; if (!P) return; const it = P.items[P.i], el = $('#pclock'); if (!el) return;
    const l = Math.max(0, Math.ceil(P.left)); el.textContent = Math.floor(l / 60) + ':' + pad(l % 60);
    const sd = $('#pside'); if (sd && it.sides) sd.textContent = P.half ? 'Right side (or 2nd side)' : 'LEFT side first';
    const pb = $('#pplay'); if (pb) pb.textContent = P.run ? '❚❚ Pause' : '▶ Start';
    if (it.breath) { const [a, b, c] = it.breath, el2 = (it.sec - P.left) % (a + b + c), pc = $('#pacer'); if (pc) { const ph = !P.run ? ['Tap Start', 1] : el2 < a ? ['Breathe in', 1.35] : el2 < a + b ? ['Hold', 1.35] : ['Breathe out', 0.8]; pc.textContent = ph[0]; pc.style.transform = `scale(${ph[1]})`; } }
  },
  draw() {
    const P = this.P, it = P.items[P.i], n = P.items.length;
    const leftAll = P.items.slice(P.i).reduce((a, x) => a + itemSec(x), 0);
    const nx = P.items[P.i + 1];
    openModal(P.title, `<div class="player"><div class="row"><span class="pill b">Step ${P.i + 1} of ${n}</span><span class="tiny mute" style="margin-left:auto">~${mins(leftAll)} min left</span></div><div class="bar"><i style="width:${Math.round(100 * P.i / n)}%"></i></div>
    ${it.breath ? `<div class="pacer" id="pacer">Ready</div>` : mediaEl(it.media, it.img)}
    <div class="pn">${it.name}</div><div><span class="pill g">${it.dose || ''}</span> ${it.src ? `<span class="srcp">${it.src}</span>` : ''}</div>
    ${it.how ? `<div class="small">${it.how}</div>` : ''}
    ${it.sec ? `<div class="clock" id="pclock">0:00</div>${it.sides ? `<div class="side" id="pside"></div>` : ''}<button class="btn" id="pplay" onclick="Player.toggle()">▶ Start</button>` : `<div class="card" style="text-align:center"><b>Do the reps at your pace</b><div class="tiny mute">About ${mins(itemSec(it))} min. Tap Next when done.</div></div>`}
    <div class="row"><button class="btn sec" style="flex:1" onclick="Player.go(${P.i - 1})" ${P.i ? '' : 'disabled'}>← Back</button><button class="btn ${it.sec ? 'sec' : ''}" style="flex:2" onclick="Player.go(${P.i + 1})">${P.i === n - 1 ? 'Finish ✓' : 'Next →'}</button></div>
    ${nx ? `<div class="tiny mute" style="text-align:center">Next: ${nx.name} (${nx.dose || ''})</div>` : ''}</div>`);
    this.drawClock();
  }
};
function play(k) { const r = ROUTINES[k]; Player.start(r.title, r.items, () => { const td = today(), bl = blocksFor(td).find(b => b.play === k && !(DB.checks[td] || {})[b.id]); if (bl) { DB.checks[td] = DB.checks[td] || {}; DB.checks[td][bl.id] = true; save(); } render(); }); }
function playList(title, items) { Player.start(title, items); }

function openFood() {
  const T = PLAN.targets, a = DB.kcalAdj || 0;
  openModal('Food: pick a team', `<div class="card"><h2>The rule</h2><div>Every meal has a <b>protein</b>. Then pick <b>one team</b>. The two teams don't play together.</div>${FOOD.team.map(t => `<div class="team" style="border-color:${t.color}"><b style="color:${t.color}">Team ${t.team}</b><div class="small"><b>Protein:</b> ${t.protein}</div><div class="small"><b>Add:</b> ${t.add}</div><div class="small"><b>Dessert:</b> ${t.dessert}</div></div>`).join('')}<div class="small mute">Pick by the protein: lean → Sweet, fatty → Rich.</div></div>
  <div class="card"><h2>Your day</h2>${FOOD.day.map(m => `<div style="margin:8px 0"><b>${m.meal}</b> <span class="pill ${m.team === 'Sweet' ? 'y' : m.team === 'Rich' ? 'p' : 'b'}">${m.team}</span><div class="small">${m.what}</div></div>`).join('')}</div>
  <div class="card"><h2>Targets (cut)</h2><div class="small">Lift days: <b>${T.liftDay.kcal + a} kcal</b> · ${T.liftDay.protein} g protein · ${T.liftDay.fat} g fat · ${T.liftDay.carbs + Math.round(a / 4)} g carbs<br>Weekend: <b>${T.restDay.kcal + a} kcal</b> · ${T.restDay.protein} g protein · ${T.restDay.fat} g fat · ${T.restDay.carbs + Math.round(a / 4)} g carbs${a ? `<br><span class="pill y">Auto-adjusted ${a > 0 ? '+' : ''}${a} kcal from your check-ins</span>` : ''}<br>Goal: lose ~${T.lossPerWeek} lb/week (7-day average). The Sunday check-in adjusts this for you.</div></div>
  <div class="card"><h2>Never together</h2><div class="small">${FOOD.dont.join(' · ')}</div><h3>Also</h3><div class="small">${FOOD.eatingOrder}<br>${FOOD.fun}</div></div>`);
}

// ---------- GYM ----------
function weekMonday(td) { const d = parseYmd(td); const off = (d.getDay() + 6) % 7; return addDays(td, -off); }
function doneThisWeek(td, key) { const mon = weekMonday(td); for (let i = 0; i < 7; i++) { const d = addDays(mon, i); if (d > td) break; if (DB.sessions[d] && DB.sessions[d][key] && DB.sessions[d][key].done) return d; } return null; }
function missedList(td) {
  const mon = weekMonday(td), out = [];
  if (weekOf(td) === 0) return out;
  for (let dow = 1; dow <= 5; dow++) { const d = addDays(mon, dow - 1); if (d >= td) break; if (d < S().start) continue; const k = WORKOUTS[dow].key; if (!doneThisWeek(td, k)) out.push(dow); }
  return out;
}
function renderGym() {
  const td = today(), tdow = parseYmd(td).getDay(), w = Math.max(1, weekOf(td));
  const missed = missedList(td);
  const dow = GYMDAY == null ? tdow : GYMDAY, W = WORKOUTS[dow];
  const order = [1, 2, 3, 4, 5, 6, 0];
  const short = d => ({ legsA: 'Legs A', legsB: 'Legs B', push: 'Push', pull: 'Pull', upper: 'Upper', sat: 'Pilates', sun: 'Rest' })[WORKOUTS[d].key];
  let html = `<div class="days">${order.map(d => `<button class="${d === dow ? 'on' : ''} ${d === tdow ? 'today' : ''}" onclick="GYMDAY=${d};render()">${DAYN[d]}<br><span style="font-weight:500">${short(d)}</span>${doneThisWeek(td, WORKOUTS[d].key) ? ' ✓' : ''}</button>`).join('')}</div>`;
  if (missed.length && GYMDAY == null) {
    const first = missed[0], legsYesterday = ['legsA', 'legsB'].some(k => DB.sessions[addDays(td, -1)] && DB.sessions[addDays(td, -1)][k] && DB.sessions[addDays(td, -1)][k].done);
    const pick = (WORKOUTS[first].legs && legsYesterday) ? (missed.find(d => !WORKOUTS[d].legs) || null) : first;
    html += `<div class="card" style="border-color:#7c5a12;background:#231a0b"><div class="row"><span class="pill y">Missed</span><b>${missed.map(d => WORKOUTS[d].title.split(' + ')[0].split(' (')[0]).join(', ')}</b></div><div class="small" style="margin:6px 0">No stress. Do the next one in order${pick ? `: <b>${WORKOUTS[pick].title.split(' + ')[0]}</b> today` : ''}. The rest slides one day; Saturday can be a lift day (move Pilates to Sunday).${WORKOUTS[first].legs && legsYesterday ? ' Not legs today (you did legs yesterday).' : ''} Missed 2+? Drop Friday's Upper day first.</div>${pick ? `<button class="btn sm" onclick="GYMDAY=${pick};render()">Open ${WORKOUTS[pick].title.split(' + ')[0]}</button>` : ''}</div>`;
  }
  if (W.rest) { html += `<div class="card"><h2>${W.title}</h2><ul class="cues">${W.items.map(i => `<li>${i}</li>`).join('')}</ul>${dow === 0 ? `<button class="btn sec" onclick="play('floorReset')">▶ Floor reset (${rMin('floorReset')} min)</button> <button class="btn sec" style="margin-top:8px" onclick="play('contrast')">▶ Sauna + cold plunge</button>` : ''}</div>`; $('#main').innerHTML = html; return; }
  const DP = dayPlan(dow, w), sess = sessionFor(td, W.key), T = DP.t;
  html += `<div class="card"><div class="row"><h2 style="flex:1;margin:0">${W.title}</h2>${sess.done ? '<span class="pill g">Done ✓</span>' : ''}</div><div class="small mute">${W.focus}</div><div style="margin-top:6px"><span class="pill b">Week ${w}</span><span class="pill">${phaseOf(w).name}</span>${DP.deload ? '<span class="pill y">Deload: 1/3 fewer sets</span>' : ''}</div>
  <div class="small" style="margin-top:8px">💊 1 hr before: citrulline 8 g + collagen + kiwi/orange. In your bottle: Hydrate 1 scoop. <button class="linkish" onclick="openSupps()">All supplements</button></div><div class="small" style="margin-top:10px"><b>Total ≈ ${hm(T.total)}</b>: warm-up ${mins(T.warm)} · lift ${mins(T.lift)}${T.cardio ? ' · bike ' + mins(T.cardio) : ''} · stretch ${mins(T.fin)} · sauna 15</div></div>`;
  // filming
  if (W.film && PLAN.filmWeeks.includes(w)) {
    const fk = w + '_' + W.key, ff = DB.formfilms[fk] || {}, lift = W.ex.find(e => e.film);
    html += `<div class="card" style="border-color:#7c5a12;background:#231a0b"><b>🎥 Film today (odd week)</b><ul class="cues"><li>1 set of <b>${lift.name}</b> from the SIDE (phone on the floor, 3 m away).</li><li>1 set of your <b>jumps</b> from the FRONT.</li></ul>
    <div class="small"><b>Right after, check:</b></div><ul class="cues">${[...FILMGUIDE.look[W.film], FILMGUIDE.look.jumps[0]].map(x => `<li>${x}</li>`).join('')}</ul>
    <div class="row"><button class="btn sm ${ff.ok ? '' : 'sec'}" onclick="ffSet('${fk}','ok',${!ff.ok})">${ff.ok ? '✓ Looks good' : 'Looks good'}</button><input style="flex:1;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:8px" placeholder="or one fix…" value="${ff.fix || ''}" onchange="ffSet('${fk}','fix',this.value)"></div>
    <div class="tiny mute" style="margin-top:6px">Then add the clip to your "12-Week Films" album. Keep 1 per exercise. <button class="linkish" onclick="openLesson('films')">Full filming guide</button></div></div>`;
  }
  // 1 warm-up
  html += sec('1. Warm-up' + (W.legs ? ' + jumps' : ''), mins(T.warm), `playList('Warm-up', dayPlan(${dow},${w}).warm)`);
  html += `<div class="card">${W.legs ? `<div class="tiny mute" style="margin-bottom:4px">Jumps weeks ${block(JUMPS, w).weeks.join('-')} · ${block(JUMPS, w).contacts} landings · only move up if pain ≤3, quiet landings, knees don't cave</div>` : ''}${itemList(DP.warm)}</div>`;
  // 2 lift
  html += `<div class="sec-h"><h3>2. Lift · ${mins(T.lift)} min · tap to open</h3></div>`;
  const prev = prevSession(td, W.key);
  W.ex.forEach((e, i) => {
    const sets = DP.setsOf(e), logged = (sess.sets[i] || []);
    const fin = logged.filter(x => x && (x.w || x.r)).length >= sets;
    const pv = prev && prev.sets[i] ? prev.sets[i].filter(x => x && (x.w || x.r)).map(x => `${x.w || '-'}×${x.r || '-'}`).join(', ') : '';
    html += `<div class="ex ${fin ? 'fin' : ''}" id="ex${i}"><div class="hd" onclick="this.parentNode.classList.toggle('open')"><div class="num">${fin ? '✓' : i + 1}</div><div class="n">${e.name} ${/^Added/.test(e.src) ? '<span class="pill g">NEW</span>' : ''}<div class="small mute" style="font-weight:500">${sets} × ${e.reps} · rest ${e.rest >= 60 ? (e.rest / 60) + ' min' : e.rest + 's'} · ~${mins(exSec(e, sets))} min</div></div><span class="mute">▾</span></div>
    <div class="bd"><div class="why"><b>Why:</b> ${e.why}<div class="srcp" style="margin-top:3px">From: ${e.src}</div></div>${ytBtn(e.v)}
    <ul class="cues">${e.cues.map(c => `<li>${c}</li>`).join('')}</ul>${e.swap && e.swap !== '-' ? `<div class="small mute">Machine busy? ${e.swap}</div>` : ''}${pv ? `<div class="small" style="margin-top:4px">Last time: <b>${pv}</b></div>` : ''}
    <table class="sets"><tr><th>Set</th><th>${S().units}</th><th>Reps</th><th>Left in tank</th></tr>${Array.from({ length: sets }, (_, j) => { const x = logged[j] || {}; return `<tr><td class="mute">${j + 1}</td><td><input inputmode="decimal" value="${x.w || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'w',this.value)"></td><td><input inputmode="numeric" value="${x.r || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'r',this.value)"></td><td><input inputmode="numeric" placeholder="1-2" value="${x.rir || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'rir',this.value)"></td></tr>`; }).join('')}</table>
    <div class="row"><button class="btn sm" onclick="Timer.start(${e.rest})">⏱ Rest ${e.rest >= 60 ? (e.rest / 60) + ' min' : e.rest + 's'}</button></div>
    <label class="fld"><span>Joint note (0-10, optional)</span><input inputmode="numeric" value="${(sess.notes || {})[i] || ''}" onchange="logNote('${td}','${W.key}',${i},this.value)"></label></div></div>`;
  });
  let n = 3;
  if (DP.cardio) {
    const c = DP.cardio;
    html += sec(`${n++}. ${c.name}`, mins(T.cardio), c.steps ? `playList('${c.name}', CARDIO.early.steps)` : null);
    html += `<div class="card"><div class="small">${c.how}</div>${c.steps ? '<div class="tiny mute" style="margin-top:4px">Tap Follow along: it beeps for every hard/easy switch.</div>' : ytBtn('sprint_start')}</div>`;
  }
  html += sec(`${n++}. ${W.legs ? 'Ankle fix + stretch + foam roll' : 'Stretch + foam roll'}`, mins(T.fin), `playList('Stretch', dayPlan(${dow},${w}).fin)`);
  html += `<div class="card">${W.legs ? `<div class="tiny mute" style="margin-bottom:4px">Ankle fix weeks ${block(ANKLE, w).weeks.join('-')} · LEFT first</div>` : ''}${itemList(DP.fin)}</div>`;
  html += sec(`${n++}. Sauna`, 15, `playList('Sauna', [SAUNA])`);
  html += `<div class="card"><div class="small">${SAUNA.how}</div></div>`;
  html += `<button class="btn" onclick="finishSession('${td}','${W.key}')">${sess.done ? 'Workout saved ✓' : 'Finish workout'}</button>`;
  $('#main').innerHTML = html;
}
function sec(title, m, playJs) { return `<div class="sec-h"><h3>${title} · ${m} min</h3>${playJs ? `<button class="btn sm" onclick="${playJs}">▶ Follow along</button>` : ''}</div>`; }
function itemList(items) { return items.map(it => `<div class="item"><div class="row"><b style="flex:1">${it.name}</b><span class="pill g">${it.dose || ''}</span></div>${it.how ? `<div class="small mute">${it.how}</div>` : ''}${it.src ? `<div class="srcp">${it.src}</div>` : ''}${mediaBtn(it.media)}</div>`).join(''); }
function ffSet(k, f, v) { DB.formfilms[k] = DB.formfilms[k] || {}; DB.formfilms[k][f] = v; save(); if (f === 'ok') render(); else toast('Saved'); }
function sessionFor(d, k) { DB.sessions[d] = DB.sessions[d] || {}; DB.sessions[d][k] = DB.sessions[d][k] || { sets: {}, notes: {} }; return DB.sessions[d][k]; }
function prevSession(d, k) { const ds = Object.keys(DB.sessions).filter(x => x < d && DB.sessions[x][k] && Object.keys(DB.sessions[x][k].sets).length).sort(); return ds.length ? DB.sessions[ds[ds.length - 1]][k] : null; }
function logSet(d, k, i, j, f, v) { const s = sessionFor(d, k); s.sets[i] = s.sets[i] || []; s.sets[i][j] = s.sets[i][j] || {}; s.sets[i][j][f] = v; save(); }
function logNote(d, k, i, v) { const s = sessionFor(d, k); s.notes[i] = v; save(); }
function finishSession(d, k) { sessionFor(d, k).done = true; DB.checks[d] = DB.checks[d] || {}; DB.checks[d].lift = true; save(); toast('Workout saved 💪'); render(); }
const Timer = {
  h: null, end: 0,
  start(sec) { this.end = Date.now() + sec * 1000; $('#timer').classList.add('on'); clearInterval(this.h); this.h = setInterval(() => this.tick(), 250); this.tick(); },
  add(s) { this.end += s * 1000; },
  stop() { clearInterval(this.h); $('#timer').classList.remove('on'); },
  tick() { const left = Math.max(0, Math.round((this.end - Date.now()) / 1000)); $('#tt').textContent = Math.floor(left / 60) + ':' + pad(left % 60); if (left <= 0) { this.stop(); buzz([300, 150, 300]); toast('Rest done. Next set!'); } }
};

// ---------- LEARN ----------
function renderLearn() {
  const groups = [...new Set(LESSONS.map(l => l.group))];
  let html = `<div class="card"><h2>Learn in 1-3 minutes</h2><div class="small mute">Swipe through short cards. Tap "Deep dive" for the full research when you have time.</div><div class="bar" style="margin-top:10px"><i style="width:${Math.round(100 * Object.keys(DB.seen).length / LESSONS.length)}%"></i></div><div class="tiny mute" style="margin-top:4px">${Object.keys(DB.seen).length} of ${LESSONS.length} lessons seen</div></div>`;
  groups.forEach(g => { html += `<h3 style="margin:16px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">${g}</h3><div class="lessons">${LESSONS.filter(l => l.group === g).map(l => `<button class="lesson ${DB.seen[l.id] ? 'seen' : ''}" onclick="openLesson('${l.id}')"><div class="t">${l.title}</div><div class="tiny mute">${l.min} min · ${l.cards.length} cards ${DB.seen[l.id] ? '· ✓' : ''}</div></button>`).join('')}</div>`; });
  html += `<h3 style="margin:18px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">Routines (follow along)</h3><div class="lessons">${Object.entries(ROUTINES).map(([k, r]) => `<button class="lesson" onclick="openRoutine('${k}')"><div class="t">${r.title}</div><div class="tiny mute">${rMin(k)} min · ${r.items.length} steps</div></button>`).join('')}<button class="lesson" onclick="openFood()"><div class="t">Food: pick a team</div><div class="tiny mute">Meals + targets</div></button><button class="lesson" onclick="openSupps()"><div class="t">Supplements</div><div class="tiny mute">What, how much, when</div></button></div>`;
  html += `<h3 style="margin:18px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">Library (full research)</h3><div class="card">${LIBRARY.map(d => `<button class="linkish" style="display:block;font-size:15px;margin:8px 0" onclick="openDoc('${d.id}')">📄 ${d.title}</button>`).join('')}</div>`;
  $('#main').innerHTML = html;
}
function openLesson(id) {
  const L = LESSONS.find(l => l.id === id); DB.seen[id] = true; save();
  const slides = L.cards.map((c, i) => `<div class="slide"><div class="tiny mute" style="margin-bottom:8px">${i + 1} / ${L.cards.length}</div><h3>${c.h}</h3><p>${c.b}</p>${c.img ? `<img src="${c.img}">` : ''}</div>`).join('') + `<div class="slide" style="justify-content:center;text-align:center"><h3>Got it ✓</h3><p class="mute" style="font-size:16px">${L.deep ? 'Want the full research?' : 'Nice. On to the next one.'}</p>${L.deep ? `<button class="btn" style="margin-top:16px" onclick="openDoc('${L.deep}')">Deep dive</button>` : ''}<button class="btn sec" style="margin-top:10px" onclick="closeModal();render()">Back</button></div>`;
  openModal(L.title, `<div class="swiper" id="sw">${slides}</div><div class="dots" id="dots">${Array.from({ length: L.cards.length + 1 }, (_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div><div class="tiny mute" style="text-align:center">Swipe ←</div>`);
  const sw = $('#sw'); sw.addEventListener('scroll', () => { const i = Math.round(sw.scrollLeft / sw.clientWidth); document.querySelectorAll('#dots i').forEach((d, j) => d.classList.toggle('on', j === i)); });
}
async function openDoc(id) {
  const d = LIBRARY.find(x => x.id === id);
  openModal(d.title, `<div class="card md" id="doc">Loading…</div>`);
  try { const t = await (await fetch(d.file)).text(); $('#doc').innerHTML = md(t); } catch (e) { $('#doc').textContent = 'Could not load (are you offline?).'; }
}
function md(src) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inl = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank">$1</a>').replace(/(^|\s)(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank">$2</a>');
  const lines = src.split('\n'); let out = '', i = 0, inList = false;
  const close = () => { if (inList) { out += '</ul>'; inList = false; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^\|/.test(l)) { close(); const rows = []; while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; } const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); const body = rows.filter(r => !/^\|\s*-/.test(r)); out += '<table>' + body.map((r, ri) => '<tr>' + cells(r).map(c => ri === 0 ? `<th>${inl(c)}</th>` : `<td>${inl(c)}</td>`).join('') + '</tr>').join('') + '</table>'; continue; }
    const h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { close(); out += `<h${Math.min(4, h[1].length)}>${inl(h[2])}</h${Math.min(4, h[1].length)}>`; }
    else if (/^\s*[-*]\s+/.test(l)) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + inl(l.replace(/^\s*[-*]\s+/, '')) + '</li>'; }
    else if (/^\s*\d+\.\s+/.test(l)) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + inl(l.replace(/^\s*/, '')) + '</li>'; }
    else if (/^---/.test(l)) { close(); out += '<hr style="border-color:var(--line)">'; }
    else if (l.trim()) { close(); out += '<p>' + inl(l) + '</p>'; }
    else close();
    i++;
  }
  close(); return out;
}

// ---------- PROGRESS ----------
function renderProgress() {
  let html = `<div class="days">${[['week', 'Check-in'], ['tests', 'Tests'], ['films', 'Films'], ['charts', 'Charts'], ['photos', 'Photos']].map(([k, l]) => `<button class="${PROGTAB === k ? 'on' : ''}" onclick="PROGTAB='${k}';render()">${l}</button>`).join('')}</div>`;
  $('#main').innerHTML = html + '<div id="pp"></div>';
  ({ week: progWeek, tests: progTests, films: progFilms, charts: progCharts, photos: progPhotos })[PROGTAB]();
}
function avgWeight(endStr) { const v = []; for (let i = 0; i < 7; i++) { const x = parseFloat((DB.daily[addDays(endStr, -i)] || {}).weight); if (!isNaN(x)) v.push(x); } return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : ''; }
function bestSet(k, name) { let best = null; Object.values(DB.sessions).forEach(s => { const ss = s[k]; if (!ss) return; const i = WORKOUTS[{ legsA: 2, legsB: 4 }[k]].ex.findIndex(e => e.name === name); (ss.sets[i] || []).forEach(x => { if (x && x.w && (!best || +x.w > +best.w)) best = x; }); }); return best ? `${best.w} × ${best.r || '?'}` : ''; }
function autopilot(w) {
  const td = today(), c = DB.checkins[w] || {}, out = []; let kcal = 0;
  const now = parseFloat(avgWeight(td)), prev = parseFloat((DB.checkins[w - 1] || {}).avg || avgWeight(addDays(td, -7)));
  if (isNaN(now) || isNaN(prev)) out.push(['Calories', 'Need about a week of weigh-ins to adjust. Weigh yourself most mornings.']);
  else {
    const loss = +(prev - now).toFixed(2), prevLoss = (DB.checkins[w - 1] || {}).loss;
    if (loss > 1.5) { kcal = 100; out.push(['Calories', `You lost ${loss} lb this week (too fast, you could lose muscle). Eat 100 more a day: add a banana or 1/2 cup rice.`]); }
    else if (loss < 0.25 && prevLoss != null && prevLoss < 0.25) { kcal = -150; out.push(['Calories', `No weight lost 2 weeks in a row (${loss < 0 ? 'up ' + (-loss) : 'down ' + loss} lb). Eat 150 less a day (skip the honey + half the oats) OR add 2,000 steps a day.`]); }
    else if (loss < 0.25) out.push(['Calories', `${loss < 0 ? 'Up ' + (-loss) : 'Only ' + loss} lb this week (water can do that). Change nothing yet; if next week is the same, the app cuts 150.`]);
    else out.push(['Calories', `Lost ${loss} lb. Right on track. Change nothing.`]);
    c.loss = loss;
  }
  const hurt = AREAS.filter(([k]) => ((c.pain || {})[k] || 0) >= 4).map(([, l]) => l);
  out.push(['Pain', hurt.length ? `${hurt.join(', ')} above 3. This week cut the exercises that bother it by 20-30% (less weight, less depth or fewer jumps). No new jump level.` : 'All 3 or below. Keep progressing.']);
  if (+c.stiff > 45) out.push(['Doctor', 'Morning stiffness over 45 min. Book a doctor visit and ask for a CRP blood test.']);
  if (+c.k2wl >= 10 && +c.k2wr >= 10 && Math.abs(c.k2wl - c.k2wr) < 2) out.push(['Unlocked', 'Both ankles 10+ cm and even. Barbell back squats are OK now (swap for hack squat if you want).']);
  const nw = w + 1;
  if (PLAN.deloadWeeks.includes(nw)) out.push(['Next week', 'Deload week: the Gym tab cuts sets by 1/3 automatically.']);
  if (PLAN.testWeeks.includes(nw)) out.push(['Next week', `Week-${nw} retest. The Today tab will remind you.`]);
  if (PLAN.filmWeeks.includes(nw)) out.push(['Next week', 'Film week: 1 set on Tuesday and Thursday.']);
  return { out, kcal };
}
function progWeek() {
  const td = today(), w = Math.max(1, weekOf(td)), c = DB.checkins[w] || {};
  const aw = avgWeight(td), hs = bestSet('legsA', 'Hack squat (heels elevated)'), rdl = bestSet('legsB', 'Romanian deadlift');
  const prevW = DB.checkins[w - 1] || {}, lb = latestBody();
  let html = `<div class="card"><h2>Week ${w} check-in</h2><div class="small mute">Every Sunday, 3 minutes. Your weight average and best lifts fill in from what you logged. Then tap Save and the app tells you what changes next week.</div>
  <div class="fld"><span>7-day avg weight</span><b style="font-size:22px">${aw || '—'}</b> <span class="tiny mute">${prevW.avg ? '(last week ' + prevW.avg + ')' : ''}</span></div>
  <div class="fld"><span>Best hack squat / RDL</span><b>${hs || '—'}</b> / <b>${rdl || '—'}</b></div>
  <div class="grid2"><label class="fld"><span>Knee-to-wall LEFT (cm)</span><input inputmode="decimal" value="${c.k2wl || ''}" onchange="ci('k2wl',this.value)"></label><label class="fld"><span>Knee-to-wall RIGHT (cm)</span><input inputmode="decimal" value="${c.k2wr || ''}" onchange="ci('k2wr',this.value)"></label>
  <label class="fld"><span>Morning stiffness (avg min)</span><input inputmode="numeric" value="${c.stiff || ''}" onchange="ci('stiff',this.value)"></label><label class="fld"><span>Energy (1-10)</span><input inputmode="numeric" value="${c.energy || ''}" onchange="ci('energy',this.value)"></label></div>
  <div class="fld"><span>Pain this week (worst, 0-10)</span>${painInputs(c.pain || {}, 'ciPain')}</div>
  <label class="fld"><span>Front photo (stays in the app)</span><input type="file" accept="image/*" capture="environment" onchange="addPhoto(this,${w})"></label>
  <label class="fld"><span>One win</span><input value="${c.win || ''}" onchange="ci('win',this.value)"></label>
  <label class="fld"><span>One miss</span><input value="${c.miss || ''}" onchange="ci('miss',this.value)"></label>
  <button class="btn" onclick="saveCheckin(${w})">${c.saved ? '✓ Saved · update' : 'Save check-in'}</button></div>`;
  if (c.saved && c.auto) html += `<div class="card"><h2>What changes next week</h2>${c.auto.map(([t, d]) => `<div style="margin:8px 0"><span class="pill ${t === 'Doctor' ? 'r' : t === 'Unlocked' ? 'g' : 'b'}">${t}</span><div class="small" style="margin-top:4px">${d}</div></div>`).join('')}${c.kcal && !c.applied ? `<button class="btn sm" onclick="applyKcal(${w})">Apply ${c.kcal > 0 ? '+' : ''}${c.kcal} kcal to my targets</button>` : c.applied ? '<span class="pill g">Calories updated ✓</span>' : ''}</div>`;
  $('#pp').innerHTML = html;
}
function ci(k, v) { const w = Math.max(1, weekOf(today())); DB.checkins[w] = DB.checkins[w] || {}; DB.checkins[w][k] = v; DB.checkins[w].avg = avgWeight(today()); save(); toast('Saved'); }
function ciPain(k, v) { const w = Math.max(1, weekOf(today())); DB.checkins[w] = DB.checkins[w] || {}; DB.checkins[w].pain = DB.checkins[w].pain || {}; DB.checkins[w].pain[k] = +v; save(); }
function saveCheckin(w) { DB.checkins[w] = DB.checkins[w] || {}; const c = DB.checkins[w]; c.avg = avgWeight(today()); const a = autopilot(w); c.auto = a.out; if (!c.applied) c.kcal = a.kcal; c.saved = true; DB.checks[today()] = DB.checks[today()] || {}; DB.checks[today()].checkin = true; save(); toast('Saved ✓'); render(); }
function applyKcal(w) { const c = DB.checkins[w]; DB.kcalAdj = (DB.kcalAdj || 0) + c.kcal; c.applied = true; save(); toast('Targets updated'); render(); }
function testsDone(w) { const t = DB.tests[w] || {}; return TESTS.filter(x => t[x.id]).length >= 5; }
function progTests() {
  const w0 = weekOf(today()); const cur = w0 >= 12 ? 12 : w0 >= 6 ? 6 : 0;
  let html = `<div class="days">${PLAN.testWeeks.map(w => `<button class="${w === (window.TW ?? cur) ? 'on' : ''}" onclick="TW=${w};render()">Week ${w}</button>`).join('')}</div>`;
  const tw = window.TW ?? cur, t = DB.tests[tw] || {}, f = DB.films[tw] || {};
  html += `<div class="card"><h2>Week ${tw} tests (~15 min)</h2><div class="small mute">Warm up with a walk first. Barefoot. Same time of day each retest. Every test has its own short video.</div>${TESTS.map(x => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${x.name}</b><div class="small mute">${x.how}</div><div class="tiny" style="color:var(--acc2)">Target: ${x.target}</div><div class="row" style="margin-top:6px"><input style="flex:1;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:9px" inputmode="decimal" value="${t[x.id] || ''}" onchange="setTest(${tw},'${x.id}',this.value)"></div>${x.v ? ytBtn(x.v, 'How to do this test') : ''}${tw > 0 && (DB.tests[0] || {})[x.id] ? `<div class="tiny mute">Week 0: ${(DB.tests[0] || {})[x.id]}</div>` : ''}</div>`).join('')}</div>`;
  html += `<div class="card"><h2>🎥 Test-day videos + photos (5 min)</h2><div class="small mute">Film each once, add to your "12-Week Films" album. Check the list right after.</div>${FILMS.map(x => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line);align-items:flex-start"><button class="chk ${f[x.id] ? 'on' : ''}" onclick="setFilm(${tw},'${x.id}')">${f[x.id] ? '✓' : ''}</button><div style="flex:1"><b>${x.name}</b><div class="small mute">${x.how}</div>${x.look.length ? `<div class="tiny">Look for: ${x.look.join(' · ')}</div>` : ''}${x.v ? ytBtn(x.v, 'How') : ''}</div></div>`).join('')}${tw > 0 ? `<div class="small" style="margin-top:8px"><b>Compare:</b> open the album and watch your week-0 clip next to today's.</div>` : ''}</div>`;
  $('#pp').innerHTML = html;
}
function progFilms() {
  const G = FILMGUIDE;
  const rows = Object.entries(DB.formfilms).sort().map(([k, v]) => { const [wk, key] = k.split('_'); return `<div class="item"><b>Week ${wk} · ${key === 'legsA' ? 'Hack squat + jumps' : 'RDL + jumps'}</b><div class="small">${v.ok ? '✓ Looked good' : ''}${v.fix ? ' Fix: ' + v.fix : ''}</div></div>`; }).join('');
  $('#pp').innerHTML = `<div class="card"><h2>Filming: the whole system</h2><div class="small"><b>Where:</b> one album on your iPhone called <b>"${G.album}"</b>. ${G.setup}</div></div>
  <div class="card"><h2>When + what</h2>${G.schedule.map(([a, b]) => `<div class="item"><b>${a}</b><div class="small">${b}</div></div>`).join('')}</div>
  <div class="card"><h2>After you film</h2><ol class="cues">${G.after.map(x => `<li>${x}</li>`).join('')}</ol></div>
  <div class="card"><h2>Skipped?</h2><div class="small">${G.skip}</div></div>
  <div class="card"><h2>Your film notes</h2>${rows || '<div class="small mute">None yet. They show up here after odd-week leg days.</div>'}</div>`;
}
function setTest(w, k, v) { DB.tests[w] = DB.tests[w] || {}; DB.tests[w][k] = v; save(); toast('Saved'); }
function setFilm(w, k) { DB.films[w] = DB.films[w] || {}; DB.films[w][k] = !DB.films[w][k]; save(); render(); }
function chart(points, label, unit) {
  if (points.length < 2) return `<div class="card"><h2>${label}</h2><div class="small mute">Needs at least 2 entries.</div></div>`;
  const W = 320, H = 140, xs = points.map(p => p[0]), ys = points.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const X = x => 10 + (W - 20) * (x - x0) / Math.max(1, x1 - x0), Yp = y => H - 18 - (H - 36) * (y - y0) / Math.max(0.1, y1 - y0);
  const path = points.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Yp(p[1]).toFixed(1)).join(' ');
  return `<div class="card"><h2>${label}</h2><svg viewBox="0 0 ${W} ${H}" style="width:100%"><path d="${path}" fill="none" stroke="#22c55e" stroke-width="2.5"/>${points.map(p => `<circle cx="${X(p[0])}" cy="${Yp(p[1])}" r="3" fill="#38bdf8"/>`).join('')}<text x="10" y="12" fill="#8e99b8" font-size="11">${y1}${unit}</text><text x="10" y="${H - 4}" fill="#8e99b8" font-size="11">${y0}${unit}</text></svg><div class="small mute">Latest: <b style="color:var(--text)">${ys[ys.length - 1]}${unit}</b> · Start: ${ys[0]}${unit}</div></div>`;
}
function progCharts() {
  const days = Object.keys(DB.daily).sort(); const st = parseYmd(S().start);
  const pts = k => days.filter(d => DB.daily[d][k] && d >= addDays(S().start, -14)).map(d => [(parseYmd(d) - st) / 86400000, parseFloat(DB.daily[d][k])]);
  const kl = [], kr = []; Object.keys(DB.checkins).sort((a, b) => a - b).forEach(w => { const c = DB.checkins[w]; if (c.k2wl) kl.push([+w, +c.k2wl]); if (c.k2wr) kr.push([+w, +c.k2wr]); });
  if (DB.tests[0] && DB.tests[0].k2w_l) kl.unshift([0, +DB.tests[0].k2w_l]); if (DB.tests[0] && DB.tests[0].k2w_r) kr.unshift([0, +DB.tests[0].k2w_r]);
  $('#pp').innerHTML = chart(pts('weight'), 'Body weight', '') + chart(pts('bf'), 'Body fat (Hume)', '%') + chart(pts('steps'), 'Steps', '') + chart(kl, 'Knee-to-wall LEFT', ' cm') + chart(kr, 'Knee-to-wall RIGHT', ' cm') + chart(pts('stiff'), 'Morning stiffness', ' min');
}
// photos in IndexedDB
function idb() { return new Promise((res, rej) => { const r = indexedDB.open('reneCoachPhotos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = rej; }); }
async function addPhoto(inp, w) { const f = inp.files[0]; if (!f) return; const db = await idb(); const tx = db.transaction('p', 'readwrite'); tx.objectStore('p').put({ id: Date.now(), week: w, date: today(), blob: f }); tx.oncomplete = () => toast('Photo saved (on this phone only)'); }
async function progPhotos() {
  const db = await idb(); const all = await new Promise(r => { const q = db.transaction('p').objectStore('p').getAll(); q.onsuccess = () => r(q.result); });
  const add = `<label class="fld"><span>Add a photo</span><input type="file" accept="image/*" capture="environment" onchange="addPhoto(this,${Math.max(0, weekOf(today()))});setTimeout(render,500)"></label>`;
  if (!all.length) { $('#pp').innerHTML = `<div class="card"><h2>Progress photos</h2><div class="small mute">One front photo every Sunday in the check-in. Same light, same spot, shirt off.</div>${add}</div>`; return; }
  const byW = {}; all.forEach(p => (byW[p.week] = byW[p.week] || []).push(p));
  $('#pp').innerHTML = Object.keys(byW).sort((a, b) => a - b).map(w => `<div class="card"><h2>Week ${w}</h2><div class="photos">${byW[w].map(p => `<img src="${URL.createObjectURL(p.blob)}">`).join('')}</div></div>`).join('') + `<div class="card">${add}</div>`;
}

// ---------- SETTINGS ----------
function shortcutCard() {
  return `<div class="card"><details><summary><b>Optional: auto-fill from Hume</b> <span class="tiny mute">(skip this; typing works fine)</span></summary><div class="small">Your Hume Body Pod already writes weight and body fat into Apple Health (same as Nino Health). One Shortcut reads them plus your steps and opens this app with everything filled in.</div>
  <ol class="cues"><li>Open the <b>Shortcuts</b> app → <b>+</b>. Tap the text box at the bottom and paste the prompt below (the AI builder makes it for you). Or build it by hand from the same steps.</li><li>Run it once. Tap <b>Allow</b> for Health.</li><li>In the shortcut, tap the name at the top → <b>Add to Home Screen</b>. Note: this icon and Safari's home-screen icon keep separate data, so only set this up at the very start.</li></ol>
  <textarea id="scp" rows="9" style="width:100%;font-size:12px" readonly>${SHORTCUT_PROMPT}</textarea><button class="btn sm" onclick="navigator.clipboard.writeText($('#scp').value).then(()=>toast('Copied'))">Copy prompt</button>
  <div class="tiny mute" style="margin-top:6px">${DB.lastSync ? 'Last sync: ' + new Date(DB.lastSync.at).toLocaleString() : 'Not synced yet.'} </div></details></div>`;
}
function openSettings() {
  const s = S();
  openModal('Settings', `<div class="card"><h2>Your day</h2>${schedFields(s)}<button class="btn" onclick="saveSettings(true)">Save</button></div>
  ${shortcutCard()}
  <div class="card"><h2>Reminders on your phone</h2><div class="small">Adds every block (morning routine, gym, floor snacks, wind-down, Sunday plunge + check-in, retests) to your calendar with alerts, for all 12 weeks.</div><button class="btn" style="margin-top:10px" onclick="downloadICS()">📅 Add to my calendar</button><div class="tiny mute" style="margin-top:6px">Tap it, then "Add All". Changed your times? Delete the old "Rene Plan" calendar first, then add again.</div></div>
  <div class="card"><h2>Backup</h2><div class="small mute">Your data lives only on this phone. Back it up every few weeks.</div><div class="row" style="margin-top:8px"><button class="btn sm sec" onclick="exportData()">Export backup</button><label class="btn sm sec">Import<input type="file" accept="application/json" style="display:none" onchange="importData(this)"></label></div></div>
  <div class="card"><h2>Home screen</h2><div class="small">In Safari: <b>Share → Add to Home Screen</b>. Always open it from that icon; your logs live there.</div></div>`);
}
function schedFields(s) {
  const f = (k, l) => `<label class="fld"><span>${l}</span><input type="time" id="s_${k}" value="${s[k]}"></label>`;
  return `<label class="fld"><span>Start date (week 1, day 1)</span><input type="date" id="s_start" value="${s.start}"></label><div class="grid2">${f('wake', 'Wake up')}${f('meal1', 'Meal 1')}${f('lift', 'Gym Mon-Fri (1:30)')}${f('meal2', 'Meal 2')}${f('dinner', 'Dinner')}${f('bed', 'Lights out')}${f('pilates', 'Sat Pilates (morning)')}${f('plunge', 'Sun sauna + plunge')}${f('checkin', 'Sun check-in')}</div>
  <div class="fld"><span>Floor snacks (up to 3; flexible)</span><div class="grid2">${[0, 1, 2].map(i => `<input type="time" id="s_snack${i}" value="${s.snacks[i] || ''}" style="width:100%;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:12px;padding:11px">`).join('')}</div></div>
  <label class="fld"><span>Units</span><select id="s_units"><option ${s.units === 'lb' ? 'selected' : ''}>lb</option><option ${s.units === 'kg' ? 'selected' : ''}>kg</option></select></label>`;
}
function saveSettings(close) {
  const s = S(); ['start', 'wake', 'meal1', 'lift', 'meal2', 'dinner', 'bed', 'pilates', 'plunge', 'checkin', 'units'].forEach(k => { const el = $('#s_' + k); if (el && el.value) s[k] = el.value; });
  if ($('#s_snack0')) s.snacks = [0, 1, 2].map(i => ($('#s_snack' + i) || {}).value).filter(Boolean);
  DB.settings = s; save(); if (close) { closeModal(); toast('Saved'); } render();
}
function exportData() { const b = new Blob([JSON.stringify(DB, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rene-plan-backup-' + today() + '.json'; a.click(); }
function importData(inp) { const r = new FileReader(); r.onload = () => { try { DB = JSON.parse(r.result); save(); toast('Restored'); closeModal(); render(); } catch (e) { alert('Bad file'); } }; r.readAsText(inp.files[0]); }
function downloadICS() {
  const s = S(), st = parseYmd(s.start), until = new Date(st); until.setDate(st.getDate() + 84);
  const U = ymd(until).replace(/-/g, '') + 'T235900';
  const dt = (d, t) => ymd(d).replace(/-/g, '') + 'T' + t.replace(':', '') + '00';
  const firstDow = dow => { const d = new Date(st); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return d; };
  const url = location.href.split('#')[0];
  let n = 0; const ev = (title, d, t, mn, rrule, desc) => { const e = toMin(t) + mn; return `BEGIN:VEVENT\r\nUID:rp-${n++}-${Date.now()}@reneplan\r\nDTSTAMP:${dt(new Date(), '00:00')}\r\nDTSTART:${dt(d, t)}\r\nDTEND:${dt(d, toT(e))}\r\n${rrule ? 'RRULE:' + rrule + ';UNTIL=' + U + '\r\n' : ''}SUMMARY:${title}\r\nDESCRIPTION:${(desc || '').replace(/\n/g, '\\n')}\\nOpen Rene Plan.\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${title}\r\nTRIGGER:-PT0M\r\nEND:VALARM\r\nEND:VEVENT\r\n`; };
  const wake = toMin(s.wake), bed = toMin(s.bed);
  let c = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Rene Plan//EN\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Rene Plan\r\n';
  c += ev('⚖️ Weigh in + type it in Rene Plan', st, s.wake, 5, 'FREQ=DAILY', 'After the bathroom, before food.');
  c += ev(`☀️ Sun walk + morning routine (${rMin('morning')} min)`, st, toT(wake + 15), 40, 'FREQ=DAILY', 'Walk 20-30 min outside, then follow along with the morning routine.');
  const names = { 1: 'Push', 2: 'Legs A + ankles + jumps', 3: 'Pull', 4: 'Legs B + ankles + jumps', 5: 'Upper + abs + bike' };
  [1, 2, 3, 4, 5].forEach(d => c += ev('🏋️ Gym: ' + names[d] + ' (lift + stretch + sauna)', firstDow(d), s.lift, 90, 'FREQ=WEEKLY', 'Open the Gym tab. ' + ([2, 4].includes(d) ? 'Odd weeks: film 1 set (the Gym tab tells you).' : '')));
  c += ev('🧘 Reformer Pilates (morning) + long walk', firstDow(6), s.pilates, 60, 'FREQ=WEEKLY', '');
  c += ev('🧊 Sauna + cold plunge (2 rounds)', firstDow(0), s.plunge, 40, 'FREQ=WEEKLY', 'Sauna 12-15, plunge 1-3 min, repeat. End on cold.');
  c += ev('📈 Weekly check-in + front photo (3 min)', firstDow(0), s.checkin, 15, 'FREQ=WEEKLY', 'Progress tab. Save it and the app adjusts next week.');
  s.snacks.forEach(t => c += ev(`🧎 Floor snack (${rMin('floor')} min, flexible)`, st, t, 10, 'FREQ=DAILY', 'Sit on the floor, follow along.'));
  c += ev(`🌙 Wind-down (${rMin('winddown')} min)`, st, toT(bed - 60), 10, 'FREQ=DAILY', 'Face release, legs up the wall, then 2-2-4 breathing in bed.');
  c += ev('📵 Screens off', st, toT(bed - 45), 5, 'FREQ=DAILY', 'Lights dim. Phone out of the bedroom.');
  const w6 = new Date(st); w6.setDate(st.getDate() + 35); const w12 = new Date(st); w12.setDate(st.getDate() + 81);
  c += ev('🧪 Week-6 retest (15 min)', w6, toT(wake + 60), 20, '', 'Progress → Tests → Week 6.');
  c += ev('🧪 Week-12 retest (15 min)', w12, toT(wake + 60), 20, '', 'Progress → Tests → Week 12.');
  c += 'END:VCALENDAR\r\n';
  const b = new Blob([c], { type: 'text/calendar' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rene-plan.ics'; a.click();
}

// ---------- ONBOARDING ----------
let OSTEP = 0;
function renderOnboarding() {
  const s = S(); const app = $('#app');
  const steps = [
    `<h1>Hey ${s.name} 👋</h1><p class="mute">This is your 12-week plan. It tells you exactly what to do each day, plays every routine as a follow-along video with a timer, runs your workouts, and adjusts itself every Sunday.</p>
     <div class="card"><b>How it works</b><ul class="cues"><li><b>Today</b>: what to do now. Tap ▶ and follow the video.</li><li><b>Gym</b>: today's workout, ~1:30 with stretch + sauna. Log sets.</li><li><b>Learn</b>: 1-minute swipe lessons + the full research.</li><li><b>Progress</b>: Sunday check-in, tests, films, photos, charts.</li></ul></div>
     <div class="card"><b>Rules you don't schedule</b><div class="small mute">Move every hour, 10-12k steps, pain ≤3/10, pick-a-team meals. They live on the Today screen.</div></div>`,
    `<h1>When does your day happen?</h1><p class="mute">The app builds your schedule around these. Change them any time in Settings.</p>${schedFields(s)}`,
    `<h1>Reminders</h1><p class="mute">One tap adds your whole 12 weeks to your calendar with alerts.</p><button class="btn" onclick="saveSettings(false);downloadICS()">📅 Add to my calendar</button><div class="card" style="margin-top:12px"><b>Make it an app</b><div class="small">In Safari tap <b>Share</b> → <b>Add to Home Screen</b>. Open it from that icon from now on.</div></div>`,
    `<h1>First thing tomorrow</h1><div class="card"><ol class="cues"><li>Weigh yourself and type it on the Today screen</li><li>Sun walk</li><li><b>Week-0 tests</b> (Progress → Tests): 15 min</li><li>Morning routine: tap ▶ and follow along</li><li>Gym: follow the Gym tab top to bottom</li></ol></div><p class="mute">That's it. Open the app, look at "Up next", tap ▶, tap ✓.</p>`
  ];
  app.innerHTML = `<div class="onb">${steps[OSTEP]}<div style="flex:1"></div><div class="row" style="margin-top:20px">${OSTEP ? `<button class="btn sec" onclick="OSTEP--;renderOnboarding()">Back</button>` : ''}<button class="btn" onclick="onbNext()">${OSTEP === steps.length - 1 ? "Let's go" : 'Next'}</button></div><div class="dots" style="margin-top:14px">${steps.map((_, i) => `<i class="${i === OSTEP ? 'on' : ''}"></i>`).join('')}</div></div>`;
}
function onbNext() { if (OSTEP === 1) saveSettings(false); if (OSTEP >= 3) { DB.onboarded = true; save(); OSTEP = 0; render(); return; } OSTEP++; renderOnboarding(); }

// ---------- boot ----------
// migrate old settings (v1 had Fri cardio + 5 PM Pilates)
if (DB.settings) { if (DB.settings.pilates === '17:00') DB.settings.pilates = '09:00'; delete DB.settings.cardio; save(); }
handleSync();
window.addEventListener('hashchange', () => { if (/^#sync/.test(sdec(location.hash))) { handleSync(); render(); } });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
render();
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
const idle = () => !$('#modal').classList.contains('on') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
setInterval(() => { if (TAB === 'today' && idle() && todayKey() !== LASTKEY) render(); }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && idle()) { if (TAB === 'today' || DB.lastDay !== today()) { TAB = TAB === 'gym' && DB.lastDay === today() ? 'gym' : 'today'; } DB.lastDay = today(); save(); render(); } });
DB.lastDay = today(); save();
