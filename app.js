/* Rene Coach app. All data stays on this phone (localStorage + IndexedDB). */
const $ = s => document.querySelector(s);
const KEY = 'reneCoach_v1';
const DEFAULTS = {
  name: 'Rene', start: '2026-09-29', wake: '06:30', meal1: '09:00', lift: '11:00', meal2: '12:30',
  dinner: '19:00', bed: '22:15', work: 'desk', snacks: ['13:30', '16:00', '20:00'],
  pilates: '17:00', cardio: '17:00', checkin: '18:00', units: 'lb'
};
let DB = load();
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function save() { localStorage.setItem(KEY, JSON.stringify(DB)); }
function S() { return Object.assign({}, DEFAULTS, DB.settings || {}); }
DB.checks = DB.checks || {}; DB.daily = DB.daily || {}; DB.sessions = DB.sessions || {}; DB.checkins = DB.checkins || {};
DB.tests = DB.tests || {}; DB.films = DB.films || {}; DB.seen = DB.seen || {};

// ---------- dates ----------
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => ymd(new Date());
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

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(() => t.style.display = 'none', 1800); }

// ---------- schedule builder ----------
function blocksFor(dateStr) {
  const s = S(), d = parseYmd(dateStr), dow = d.getDay(), w = weekOf(dateStr), W = WORKOUTS[dow];
  const wake = toMin(s.wake), bed = toMin(s.bed);
  const b = [];
  b.push({ id: 'wake', t: s.wake, ttl: 'Wake up', d: 'Weigh in. Glass of water + pinch of salt. No phone yet.' });
  b.push({ id: 'walk', t: toT(wake + 15), ttl: 'Sun walk (20-30 min)', d: 'Outside, no sunglasses, even if cloudy.' });
  b.push({ id: 'morning', t: toT(wake + 45), ttl: 'Morning routine (12 min)', d: 'Rock-backs, ankle stretch (LEFT extra), hips, crawl, core, neck.', open: 'morning' });
  b.push({ id: 'meal1', t: s.meal1, ttl: 'Meal 1 · Team Sweet', d: 'Egg + whites (or Greek yogurt), oats, berries, a little honey. Morning supplements.', team: 'Sweet' });
  b.push({ id: 'coffee', t: toT(Math.max(wake + 60, toMin(s.meal1) + 45)), ttl: 'Coffee + L-theanine', d: 'None after 2 PM.' });
  if (dow >= 1 && dow <= 5) {
    b.push({ id: 'lift', t: s.lift, ttl: 'Gym: ' + W.title, d: W.focus + (W.legs ? ' · Ankle + jump blocks first' : ''), gym: true });
    b.push({ id: 'meal2', t: s.meal2, ttl: 'Meal 2 · Team Sweet (post-lift)', d: 'Chicken/shrimp/cod + rice + fruit. Creatine 5 g.', team: 'Sweet' });
  } else {
    b.push({ id: 'meal2', t: s.meal2, ttl: 'Meal 2', d: 'Protein + pick a team.' });
  }
  if (dow === 5) b.push({ id: 'cardio', t: s.cardio, ttl: weekOf(dateStr) >= 10 ? 'Sprint starts 6 x 20 m' : 'Bike intervals (20 min)', d: '5 min easy, 8 x (30 sec hard / 90 sec easy), 5 min easy.' });
  if (dow === 6) { b.push({ id: 'pilates', t: s.pilates, ttl: 'Reformer Pilates', d: 'Plus a long walk (45-60 min) sometime today.' }); }
  if (dow === 0) {
    b.push({ id: 'reset', t: toT(wake + 120), ttl: 'Floor reset (8 min) + walk + optional sauna', d: 'Back, each side, stomach. 2 min each.', open: 'floorReset' });
    b.push({ id: 'checkin', t: s.checkin, ttl: 'Weekly check-in + front photo', d: 'Progress tab. Takes 3 minutes.', progress: true });
  }
  s.snacks.forEach((t, i) => b.push({ id: 'snack' + i, t, ttl: 'Floor snack (5-10 min)', d: 'Phone/TV on the floor. Switch positions every 1-2 min.', open: 'floor', opt: true }));
  b.push({ id: 'dinner', t: s.dinner, ttl: 'Dinner · pick a team', d: 'RICH: steak/salmon + veg + oil, no dessert. SWEET: lean protein + rice/potato + veg, yogurt bowl after.', team: 'Pick' });
  b.push({ id: 'postwalk', t: toT(toMin(s.dinner) + 45), ttl: '10-min walk after dinner', d: 'Helps digestion + steps.' });
  b.push({ id: 'evening', t: toT(bed - 75), ttl: 'Evening release + breathing (10 min)', d: 'Foam roll, traps, face. Then 2-2-4 breathing. Magnesium + glycine.', open: 'evening' });
  b.push({ id: 'screens', t: toT(bed - 45), ttl: 'Screens off, lights dim', d: 'Phone out of the bedroom.' });
  b.push({ id: 'bed', t: s.bed, ttl: 'Lights out', d: 'Room cool + pitch black.' });
  return b.sort((a, c) => toMin(a.t) - toMin(c.t));
}

// ---------- router ----------
let TAB = 'today', GYMDAY = null, PROGTAB = 'week';
function render() {
  if (!DB.onboarded) return renderOnboarding();
  const app = $('#app');
  const s = S(), td = today(), w = weekOf(td), ph = phaseOf(Math.max(1, w));
  const title = { today: 'Today', gym: 'Gym', learn: 'Learn', progress: 'Progress' }[TAB];
  app.innerHTML = `<header><div style="flex:1"><h1>${title}</h1><div class="sub">${fmtDate(td)} · ${w === 0 ? 'Starts ' + fmtDate(s.start) : 'Week ' + w + ' of 12 · ' + ph.name}</div></div><button class="iconbtn" onclick="openSettings()">⚙︎</button></header><main id="main"></main>
  <nav>${[['today', '☀︎', 'Today'], ['gym', '🏋︎', 'Gym'], ['learn', '📖', 'Learn'], ['progress', '📈', 'Progress']].map(([k, ic, l]) => `<button class="${TAB === k ? 'on' : ''}" onclick="go('${k}')"><span class="ic">${ic}</span>${l}</button>`).join('')}</nav>`;
  ({ today: renderToday, gym: renderGym, learn: renderLearn, progress: renderProgress })[TAB]();
  window.scrollTo(0, 0);
}
function go(t) { TAB = t; if (t === 'gym') GYMDAY = null; render(); }

// ---------- TODAY ----------
function renderToday() {
  const td = today(), w = weekOf(td), ph = phaseOf(Math.max(1, w)), bl = blocksFor(td), ch = DB.checks[td] || {};
  const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
  const req = bl.filter(b => !b.opt), doneN = req.filter(b => ch[b.id]).length;
  const next = bl.find(b => !ch[b.id] && toMin(b.t) + 30 >= nm) || bl.find(b => !ch[b.id]);
  let html = '';
  // banners
  if (w === 0 || (w === 1 && !testsDone(0))) html += banner('Week-0 tests (15 min)', 'Before your first workout: 5 quick tests + 4 short videos. This is your starting point.', `go('progress');PROGTAB='tests';render()`);
  if ((w === 6 || w === 12) && !testsDone(w)) html += banner(`Week-${w} retest`, 'Same tests as week 0. See how far you came.', `PROGTAB='tests';go('progress')`);
  if (PLAN.deloadWeeks.includes(w)) html += `<div class="card"><span class="pill y">Easy week</span> <b>Deload week.</b> <span class="small mute">Do 1/3 fewer sets on everything. Let your body catch up.</span></div>`;
  html += `<div class="card next"><div class="row"><span class="pill g">Up next</span><span class="small mute" style="margin-left:auto">${doneN}/${req.length} done</span></div>`;
  if (next) html += `<div class="big">${t12(next.t)} · ${next.ttl}</div><div class="small">${next.d}</div><div class="row" style="margin-top:10px">${actBtn(next)}<button class="btn sm sec" onclick="toggle('${td}','${next.id}')">✓ Done</button></div>`;
  else html += `<div class="big">All done today 🎉</div><div class="small">Sleep well.</div>`;
  html += `<div class="bar" style="margin-top:12px"><i style="width:${Math.round(100 * doneN / Math.max(1, req.length))}%"></i></div></div>`;
  // timeline
  html += `<div class="card"><h2>Today's plan</h2><ul class="tl">${bl.map(b => `<li class="${ch[b.id] ? 'done' : ''}"><div class="time">${t12(b.t)}</div><div class="body"><div class="ttl">${b.ttl}${b.opt ? ' <span class="pill">flex</span>' : ''}</div><div class="d">${b.d}</div>${actLink(b)}</div><button class="chk ${ch[b.id] ? 'on' : ''}" onclick="toggle('${td}','${b.id}')">${ch[b.id] ? '✓' : ''}</button></li>`).join('')}</ul></div>`;
  // rules
  html += `<div class="card"><h2>Remember all day (no schedule)</h2>${RULES.map(r => `<details style="margin:6px 0"><summary><b>${r.t}</b></summary><div class="small mute" style="margin:4px 0 0 16px">${r.d}</div></details>`).join('')}<button class="linkish" onclick="openRoutine('moveBreak')">▶ Movement-break routine</button></div>`;
  // phase
  html += `<div class="card"><h2>This phase: ${ph.name}</h2><div class="small">${ph.goal}</div></div>`;
  // daily log
  const dl = DB.daily[td] || {};
  html += `<div class="card"><h2>Quick log</h2>
   <div class="grid2"><label class="fld"><span>Weight (${S().units})</span><input inputmode="decimal" value="${dl.weight || ''}" onchange="setDaily('weight',this.value)"></label>
   <label class="fld"><span>Steps</span><input inputmode="numeric" value="${dl.steps || ''}" onchange="setDaily('steps',this.value)"></label>
   <label class="fld"><span>Morning stiffness (min)</span><input inputmode="numeric" value="${dl.stiff || ''}" onchange="setDaily('stiff',this.value)"></label>
   <label class="fld"><span>Drinks today</span><input inputmode="numeric" value="${dl.drinks || ''}" onchange="setDaily('drinks',this.value)"></label></div>
   <div class="fld"><span>Protein (3 x ~67 g)</span><div class="row">${[0, 1, 2].map(i => `<button class="chk ${(dl.protein || [])[i] ? 'on' : ''}" onclick="protein(${i})">${(dl.protein || [])[i] ? '✓' : ''}</button>`).join('')}<span class="small mute">Meal 1 · Meal 2 · Dinner</span></div></div>
   <div class="fld"><span>Pain today (0-10). Rule: 3 max, gone by morning.</span>${painInputs(dl.pain || {}, 'setPain')}</div>
   <label class="fld"><span>Notes</span><textarea rows="2" onchange="setDaily('notes',this.value)">${dl.notes || ''}</textarea></label></div>`;
  $('#main').innerHTML = html;
}
function banner(t, d, act) { return `<div class="card" style="border-color:#7c5a12;background:#231a0b"><div class="row"><span class="pill y">To do</span><b>${t}</b></div><div class="small" style="margin:6px 0 10px">${d}</div><button class="btn sm" onclick="${act}">Open</button></div>`; }
function actBtn(b) { if (b.gym) return `<button class="btn sm" onclick="go('gym')">Start workout</button>`; if (b.open) return `<button class="btn sm" onclick="openRoutine('${b.open}')">Open guide</button>`; if (b.progress) return `<button class="btn sm" onclick="PROGTAB='week';go('progress')">Check in</button>`; if (b.team) return `<button class="btn sm" onclick="openFood()">Food rules</button>`; return ''; }
function actLink(b) { if (b.gym) return `<button class="linkish" onclick="go('gym')">▶ Open workout</button>`; if (b.open) return `<button class="linkish" onclick="openRoutine('${b.open}')">▶ How to do it</button>`; if (b.progress) return `<button class="linkish" onclick="PROGTAB='week';go('progress')">▶ Check in</button>`; if (b.team) return `<button class="linkish" onclick="openFood()">▶ Pick-a-team guide</button>`; return ''; }
function toggle(d, id) { DB.checks[d] = DB.checks[d] || {}; DB.checks[d][id] = !DB.checks[d][id]; save(); render(); }
function setDaily(k, v) { const d = today(); DB.daily[d] = DB.daily[d] || {}; DB.daily[d][k] = v; save(); toast('Saved'); }
function protein(i) { const d = today(); DB.daily[d] = DB.daily[d] || {}; const p = DB.daily[d].protein || [0, 0, 0]; p[i] = !p[i]; DB.daily[d].protein = p; save(); render(); }
const AREAS = [['back', 'Low back'], ['knees', 'Knees'], ['ankles', 'Ankles/feet'], ['hips', 'Hips/groin'], ['neck', 'Neck/shoulders']];
function painInputs(p, fn) { return AREAS.map(([k, l]) => `<div class="painrow"><span>${l}</span><input type="range" min="0" max="10" value="${p[k] || 0}" oninput="this.nextElementSibling.textContent=this.value" onchange="${fn}('${k}',this.value)"><b style="width:22px;text-align:right">${p[k] || 0}</b></div>`).join(''); }
function setPain(k, v) { const d = today(); DB.daily[d] = DB.daily[d] || {}; DB.daily[d].pain = DB.daily[d].pain || {}; DB.daily[d].pain[k] = +v; save(); }

// ---------- modals ----------
function openModal(title, inner) { const m = $('#modal'); m.innerHTML = `<header><div style="flex:1"><h1>${title}</h1></div><button class="iconbtn" onclick="closeModal()">✕</button></header><main>${inner}</main>`; m.classList.add('on'); m.scrollTop = 0; }
function closeModal() { $('#modal').classList.remove('on'); $('#modal').innerHTML = ''; }
function mediaHtml(m, img) {
  let h = img ? `<img class="thumb" src="${img}" loading="lazy">` : '';
  if (!m) return h;
  if (m.type === 'youtube') h += `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${m.id}" allowfullscreen loading="lazy"></iframe></div>`;
  else h += `<a class="btn sm sec" style="margin-top:6px" href="${m.url}" target="_blank" rel="noopener">▶ ${m.label || 'Watch'}</a>`;
  return h;
}
function openRoutine(k) {
  const r = ROUTINES[k];
  openModal(r.title, `<div class="card"><span class="pill b">${r.minutes} min</span><div class="small" style="margin-top:8px">${r.why}</div></div>` + r.items.map((it, i) => `<div class="card"><div class="row"><div class="num" style="width:28px;height:28px;border-radius:9px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-weight:800">${i + 1}</div><b style="flex:1">${it.name}</b><span class="pill g">${it.dose}</span></div><div class="small" style="margin-top:8px">${it.how}</div>${mediaHtml(it.media, it.img)}</div>`).join('') + (k === 'floor' ? `<div class="card"><h2>All resting positions</h2><div class="photos">${['01-seiza', '02-seiza-side', '03-samurai-toes-tucked', '04-upright-fetal-half-seiza', '05-deep-squat-rest', '06-criss-cross', '07-all-fours-rock', '10-mucci-seiza', '11-mucci-slant-board-lean'].map(n => `<img src="img/${n}.jpg" loading="lazy">`).join('')}</div><div class="small mute" style="margin-top:6px">Frames from Tripp's and Mitchell's videos. Skip toes-in squats (bad for your ankles).</div></div>` : ''));
}
function openFood() {
  const T = PLAN.targets;
  openModal('Food: pick a team', `<div class="card"><h2>The rule</h2><div>Every meal has a <b>protein</b>. Then pick <b>one team</b>. The two teams don't play together.</div>${FOOD.team.map(t => `<div class="team" style="border-color:${t.color}"><b style="color:${t.color}">Team ${t.team}</b><div class="small"><b>Protein:</b> ${t.protein}</div><div class="small"><b>Add:</b> ${t.add}</div><div class="small"><b>Dessert:</b> ${t.dessert}</div></div>`).join('')}<div class="small mute">Pick by the protein: lean → Sweet, fatty → Rich.</div></div>
  <div class="card"><h2>Your day</h2>${FOOD.day.map(m => `<div style="margin:8px 0"><b>${m.meal}</b> <span class="pill ${m.team === 'Sweet' ? 'y' : m.team === 'Rich' ? 'p' : 'b'}">${m.team}</span><div class="small">${m.what}</div></div>`).join('')}</div>
  <div class="card"><h2>Targets (cut)</h2><div class="small">Lift days: <b>${T.liftDay.kcal} kcal</b> · ${T.liftDay.protein} g protein · ${T.liftDay.fat} g fat · ${T.liftDay.carbs} g carbs<br>Weekend: <b>${T.restDay.kcal} kcal</b> · ${T.restDay.protein} g protein · ${T.restDay.fat} g fat · ${T.restDay.carbs} g carbs<br>Goal: lose ~${T.lossPerWeek} lb/week (7-day average). Faster than 1.5 lb/wk → +100 kcal. Stuck 2 weeks → −150 kcal or +2k steps.</div></div>
  <div class="card"><h2>Never together</h2><div class="small">${FOOD.dont.join(' · ')}</div><h3>Also</h3><div class="small">${FOOD.eatingOrder}<br>${FOOD.fun}</div></div>`);
}

// ---------- GYM ----------
function renderGym() {
  const td = today(), dow = GYMDAY == null ? parseYmd(td).getDay() : GYMDAY, w = Math.max(1, weekOf(td)), W = WORKOUTS[dow];
  const order = [1, 2, 3, 4, 5, 6, 0];
  let html = `<div class="days">${order.map(d => `<button class="${d === dow ? 'on' : ''} ${d === parseYmd(td).getDay() ? 'today' : ''}" onclick="GYMDAY=${d};render()">${DAYN[d]}<br><span style="font-weight:500">${WORKOUTS[d].key === 'legsA' ? 'Legs A' : WORKOUTS[d].key === 'legsB' ? 'Legs B' : WORKOUTS[d].title.split(':')[0].split(' ')[0]}</span></button>`).join('')}</div>`;
  if (W.rest) { html += `<div class="card"><h2>${W.title}</h2><ul class="cues">${W.items.map(i => `<li>${i}</li>`).join('')}</ul>${dow === 0 ? `<button class="btn sec" onclick="openRoutine('floorReset')">Floor reset guide</button>` : ''}</div>`; $('#main').innerHTML = html; return; }
  const sess = sessionFor(td, W.key), deload = PLAN.deloadWeeks.includes(w);
  html += `<div class="card"><div class="row"><h2 style="flex:1;margin:0">${W.title}</h2>${sess.done ? '<span class="pill g">Done ✓</span>' : ''}</div><div class="small mute">${W.focus}</div><div style="margin-top:6px"><span class="pill b">Week ${w}</span><span class="pill">${phaseOf(w).name}</span>${deload ? '<span class="pill y">Deload: 1/3 fewer sets</span>' : ''}</div></div>`;
  const films = [];
  if (W.legs && (w % 3 === 1)) films.push('Film ONE set of your jump block from the front (knees caving in?).');
  W.ex.filter(e => e.film && w % 2 === 1).forEach(e => films.push('Film one set of ' + e.name + ' from the side (pelvis tuck?).'));
  if (films.length) html += `<div class="card" style="border-color:#7c5a12;background:#231a0b"><b>🎥 Film today</b><ul class="cues">${films.map(f => `<li>${f}</li>`).join('')}</ul><div class="tiny mute">Phone on the floor/bench, 3 m away. Send it in your Sunday check-in.</div></div>`;
  html += `<div class="card"><h2>1. Warm-up</h2><ul class="cues">${W.warmup.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  if (W.legs) {
    const A = block(ANKLE, w), J = block(JUMPS, w);
    html += `<div class="card"><h2>2. Ankle block (10 min)</h2><div class="small mute">Weeks ${A.weeks[0]}-${A.weeks[1]} · LEFT first, +1 set on the left</div>${miniList(A.items)}</div>`;
    html += `<div class="card"><h2>3. Jump block (6-8 min)</h2><div class="small mute">Weeks ${J.weeks[0]}-${J.weeks[1]} · ${J.contacts} contacts · Only move up if pain ≤3, quiet landings, knees don't cave</div>${miniList(J.items)}</div>`;
  }
  html += `<h3 style="margin:14px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">${W.legs ? '4' : '2'}. Main workout · tap to open</h3>`;
  const prev = prevSession(td, W.key);
  W.ex.forEach((e, i) => {
    const sets = deload ? Math.max(1, Math.round(e.sets * 2 / 3)) : e.sets;
    const logged = (sess.sets[i] || []);
    const fin = logged.filter(x => x && (x.w || x.r)).length >= sets;
    const pv = prev && prev.sets[i] ? prev.sets[i].filter(x => x && (x.w || x.r)).map(x => `${x.w || '-'}×${x.r || '-'}`).join(', ') : '';
    html += `<div class="ex ${fin ? 'fin' : ''}" id="ex${i}"><div class="hd" onclick="this.parentNode.classList.toggle('open')"><div class="num">${fin ? '✓' : i + 1}</div><div class="n">${e.name} ${e.tag ? `<span class="pill ${e.tag === 'NEW' ? 'g' : 'b'}">${e.tag}</span>` : ''}<div class="small mute" style="font-weight:500">${sets} × ${e.reps} · rest ${e.rest >= 60 ? (e.rest / 60) + ' min' : e.rest + 's'}</div></div><span class="mute">▾</span></div>
    <div class="bd"><ul class="cues">${e.cues.map(c => `<li>${c}</li>`).join('')}</ul>${e.swap && e.swap !== '-' ? `<div class="small mute">Swap if busy: ${e.swap}</div>` : ''}${pv ? `<div class="small" style="margin-top:4px">Last time: <b>${pv}</b></div>` : ''}
    <table class="sets"><tr><th>Set</th><th>${S().units}</th><th>Reps</th><th>Left in tank</th></tr>${Array.from({ length: sets }, (_, j) => { const x = logged[j] || {}; return `<tr><td class="mute">${j + 1}</td><td><input inputmode="decimal" value="${x.w || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'w',this.value)"></td><td><input inputmode="numeric" value="${x.r || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'r',this.value)"></td><td><input inputmode="numeric" placeholder="1-2" value="${x.rir || ''}" onchange="logSet('${td}','${W.key}',${i},${j},'rir',this.value)"></td></tr>`; }).join('')}</table>
    <div class="row"><button class="btn sm" onclick="Timer.start(${e.rest})">⏱ Rest ${e.rest >= 60 ? (e.rest / 60) + ' min' : e.rest + 's'}</button>${e.media ? `<a class="btn sm sec" href="${e.media.url}" target="_blank" rel="noopener">▶ Demo</a>` : ''}</div>
    <label class="fld"><span>Joint note (0-10, optional)</span><input inputmode="numeric" value="${(sess.notes || {})[i] || ''}" onchange="logNote('${td}','${W.key}',${i},this.value)"></label></div></div>`;
  });
  html += `<div class="card"><h2>Cooldown</h2><ul class="cues">${W.cooldown.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  html += `<button class="btn" onclick="finishSession('${td}','${W.key}')">${sess.done ? 'Workout saved ✓' : 'Finish workout'}</button>`;
  $('#main').innerHTML = html;
}
function miniList(items) { return items.map(it => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="row"><b style="flex:1">${it.name}</b><span class="pill g">${it.sets}</span></div><div class="small mute">${it.how}</div>${it.media ? `<a class="linkish" href="${it.media.url}" target="_blank" rel="noopener">▶ Demo</a>` : ''}</div>`).join(''); }
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
  tick() { const left = Math.max(0, Math.round((this.end - Date.now()) / 1000)); $('#tt').textContent = Math.floor(left / 60) + ':' + pad(left % 60); if (left <= 0) { this.stop(); if (navigator.vibrate) navigator.vibrate([300, 150, 300]); toast('Rest done. Next set!'); } }
};

// ---------- LEARN ----------
function renderLearn() {
  const groups = [...new Set(LESSONS.map(l => l.group))];
  let html = `<div class="card"><h2>Learn in 1-3 minutes</h2><div class="small mute">Swipe through short cards. Tap "Deep dive" for the full research when you have time.</div><div class="bar" style="margin-top:10px"><i style="width:${Math.round(100 * Object.keys(DB.seen).length / LESSONS.length)}%"></i></div><div class="tiny mute" style="margin-top:4px">${Object.keys(DB.seen).length} of ${LESSONS.length} lessons seen</div></div>`;
  groups.forEach(g => { html += `<h3 style="margin:16px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">${g}</h3><div class="lessons">${LESSONS.filter(l => l.group === g).map(l => `<button class="lesson ${DB.seen[l.id] ? 'seen' : ''}" onclick="openLesson('${l.id}')"><div class="t">${l.title}</div><div class="tiny mute">${l.min} min · ${l.cards.length} cards ${DB.seen[l.id] ? '· ✓' : ''}</div></button>`).join('')}</div>`; });
  html += `<h3 style="margin:18px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">Routines (how-to)</h3><div class="lessons">${Object.entries(ROUTINES).map(([k, r]) => `<button class="lesson" onclick="openRoutine('${k}')"><div class="t">${r.title}</div><div class="tiny mute">${r.minutes} min</div></button>`).join('')}<button class="lesson" onclick="openFood()"><div class="t">Food: pick a team</div><div class="tiny mute">Meals + targets</div></button></div>`;
  html += `<h3 style="margin:18px 4px 8px;color:var(--mute);font-size:13px;text-transform:uppercase">Library (full research)</h3><div class="card">${LIBRARY.map(d => `<button class="linkish" style="display:block;font-size:15px;margin:8px 0" onclick="openDoc('${d.id}')">📄 ${d.title}</button>`).join('')}</div>`;
  $('#main').innerHTML = html;
}
function openLesson(id) {
  const L = LESSONS.find(l => l.id === id); DB.seen[id] = true; save();
  const slides = L.cards.map((c, i) => `<div class="slide"><div class="tiny mute" style="margin-bottom:8px">${i + 1} / ${L.cards.length}</div><h3>${c.h}</h3><p>${c.b}</p>${c.img ? `<img src="${c.img}">` : ''}</div>`).join('') + `<div class="slide" style="justify-content:center;text-align:center"><h3>Got it ✓</h3><p class="mute" style="font-size:16px">${L.deep ? 'Want the full research?' : 'Nice. On to the next one.'}</p>${L.deep ? `<button class="btn" style="margin-top:16px" onclick="openDoc('${L.deep}')">Deep dive</button>` : ''}<button class="btn sec" style="margin-top:10px" onclick="closeModal();render()">Back to lessons</button></div>`;
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
  let html = `<div class="days">${[['week', 'Check-in'], ['tests', 'Tests'], ['charts', 'Charts'], ['photos', 'Photos']].map(([k, l]) => `<button class="${PROGTAB === k ? 'on' : ''}" onclick="PROGTAB='${k}';render()">${l}</button>`).join('')}</div>`;
  $('#main').innerHTML = html + '<div id="pp"></div>';
  ({ week: progWeek, tests: progTests, charts: progCharts, photos: progPhotos })[PROGTAB]();
}
function avgWeight(endStr) { const e = parseYmd(endStr); const v = []; for (let i = 0; i < 7; i++) { const d = new Date(e); d.setDate(e.getDate() - i); const x = parseFloat((DB.daily[ymd(d)] || {}).weight); if (!isNaN(x)) v.push(x); } return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : ''; }
function bestSet(k, name) { let best = null; Object.entries(DB.sessions).forEach(([d, s]) => { const ss = s[k]; if (!ss) return; const i = WORKOUTS[{ legsA: 2, legsB: 4 }[k]].ex.findIndex(e => e.name === name); (ss.sets[i] || []).forEach(x => { if (x && x.w && (!best || +x.w > +best.w)) best = x; }); }); return best ? `${best.w} × ${best.r || '?'}` : ''; }
function progWeek() {
  const td = today(), w = Math.max(1, weekOf(td)), c = DB.checkins[w] || {};
  const aw = avgWeight(td), hs = bestSet('legsA', 'Hack squat (heels elevated)'), rdl = bestSet('legsB', 'Romanian deadlift');
  const prevW = DB.checkins[w - 1] || {};
  let html = `<div class="card"><h2>Week ${w} check-in</h2><div class="small mute">Every Sunday, 3 minutes. Then tap "Send to coach".</div>
  <div class="grid2"><div class="fld"><span>7-day avg weight</span><b style="font-size:22px">${aw || '—'}</b> <span class="tiny mute">${prevW.avg ? '(last week ' + prevW.avg + ')' : ''}</span></div><div class="fld"><span>Best hack squat / RDL</span><b>${hs || '—'}</b> / <b>${rdl || '—'}</b></div></div>
  <div class="grid2"><label class="fld"><span>Knee-to-wall LEFT (cm)</span><input inputmode="decimal" value="${c.k2wl || ''}" onchange="ci('k2wl',this.value)"></label><label class="fld"><span>Knee-to-wall RIGHT (cm)</span><input inputmode="decimal" value="${c.k2wr || ''}" onchange="ci('k2wr',this.value)"></label>
  <label class="fld"><span>Morning stiffness (avg min)</span><input inputmode="numeric" value="${c.stiff || ''}" onchange="ci('stiff',this.value)"></label><label class="fld"><span>Energy (1-10)</span><input inputmode="numeric" value="${c.energy || ''}" onchange="ci('energy',this.value)"></label></div>
  <div class="fld"><span>Pain this week (worst, 0-10)</span>${painInputs(c.pain || {}, 'ciPain')}</div>
  <label class="fld"><span>Front photo</span><input type="file" accept="image/*" capture="environment" onchange="addPhoto(this,${w})"></label>
  <label class="fld"><span>One win</span><input value="${c.win || ''}" onchange="ci('win',this.value)"></label>
  <label class="fld"><span>One miss</span><input value="${c.miss || ''}" onchange="ci('miss',this.value)"></label>
  <label class="fld"><span>Anything else (videos filmed, questions)</span><textarea rows="2" onchange="ci('notes',this.value)">${c.notes || ''}</textarea></label>
  <button class="btn" onclick="sendCheckin(${w})">📤 Send to coach</button><div class="tiny mute" style="margin-top:6px">Copies a summary you paste into your Nino Health / Aside chat. Attach the videos + photo there.</div></div>`;
  $('#pp').innerHTML = html;
}
function ci(k, v) { const w = Math.max(1, weekOf(today())); DB.checkins[w] = DB.checkins[w] || {}; DB.checkins[w][k] = v; DB.checkins[w].avg = avgWeight(today()); save(); toast('Saved'); }
function ciPain(k, v) { const w = Math.max(1, weekOf(today())); DB.checkins[w] = DB.checkins[w] || {}; DB.checkins[w].pain = DB.checkins[w].pain || {}; DB.checkins[w].pain[k] = +v; save(); }
async function sendCheckin(w) {
  const c = DB.checkins[w] || {}, td = today();
  let done = 0; const e = parseYmd(td); for (let i = 0; i < 7; i++) { const d = new Date(e); d.setDate(e.getDate() - i); const ss = DB.sessions[ymd(d)]; if (ss && Object.values(ss).some(x => x.done)) done++; }
  const pain = AREAS.map(([k, l]) => `${l} ${(c.pain || {})[k] || 0}`).join(', ');
  const txt = `WEEK ${w} CHECK-IN (${fmtDate(td)})\n7-day avg weight: ${avgWeight(td) || '-'}${(DB.checkins[w - 1] || {}).avg ? ' (last week ' + DB.checkins[w - 1].avg + ')' : ''}\nWorkouts done: ${done}/5\nKnee-to-wall L/R: ${c.k2wl || '-'} / ${c.k2wr || '-'} cm\nMorning stiffness: ${c.stiff || '-'} min · Energy: ${c.energy || '-'}/10\nPain: ${pain}\nBest hack squat: ${bestSet('legsA', 'Hack squat (heels elevated)') || '-'} · Best RDL: ${bestSet('legsB', 'Romanian deadlift') || '-'}\nWin: ${c.win || '-'}\nMiss: ${c.miss || '-'}\nNotes: ${c.notes || '-'}`;
  try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (e) { }
  try { await navigator.clipboard.writeText(txt); toast('Copied! Paste it to your coach'); } catch (e) { openModal('Check-in', `<div class="card"><textarea rows="14" style="width:100%">${txt}</textarea></div>`); }
}
function testsDone(w) { const t = DB.tests[w] || {}; return TESTS.filter(x => t[x.id]).length >= 5; }
function progTests() {
  const w0 = weekOf(today()); const cur = w0 >= 12 ? 12 : w0 >= 6 ? 6 : 0;
  let html = `<div class="days">${PLAN.testWeeks.map(w => `<button class="${w === (window.TW ?? cur) ? 'on' : ''}" onclick="TW=${w};render()">Week ${w}</button>`).join('')}</div>`;
  const tw = window.TW ?? cur, t = DB.tests[tw] || {}, f = DB.films[tw] || {};
  html += `<div class="card"><h2>Week ${tw} tests (15 min)</h2><div class="small mute">Warm up with a walk first. Barefoot. Same time of day each retest.</div>${TESTS.map(x => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${x.name}</b><div class="small mute">${x.how}</div><div class="tiny" style="color:var(--acc2)">Target: ${x.target}</div><div class="row" style="margin-top:6px"><input style="flex:1;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:9px" inputmode="decimal" value="${t[x.id] || ''}" onchange="setTest(${tw},'${x.id}',this.value)">${x.media ? `<a class="btn sm sec" href="${x.media.url}" target="_blank">▶ How</a>` : ''}</div>${tw > 0 && (DB.tests[0] || {})[x.id] ? `<div class="tiny mute">Week 0: ${(DB.tests[0] || {})[x.id]}</div>` : ''}</div>`).join('')}</div>`;
  html += `<div class="card"><h2>🎥 Videos + photos to take</h2>${FILMS.map(x => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><button class="chk ${f[x.id] ? 'on' : ''}" onclick="setFilm(${tw},'${x.id}')">${f[x.id] ? '✓' : ''}</button><div><b>${x.name}</b><div class="small mute">${x.how}</div></div></div>`).join('')}<div class="tiny mute" style="margin-top:8px">Send them to your coach with the numbers.</div></div>`;
  $('#pp').innerHTML = html;
}
function setTest(w, k, v) { DB.tests[w] = DB.tests[w] || {}; DB.tests[w][k] = v; save(); toast('Saved'); }
function setFilm(w, k) { DB.films[w] = DB.films[w] || {}; DB.films[w][k] = !DB.films[w][k]; save(); render(); }
function chart(points, label, unit) {
  if (points.length < 2) return `<div class="card"><h2>${label}</h2><div class="small mute">Needs at least 2 entries.</div></div>`;
  const W = 320, H = 140, xs = points.map(p => p[0]), ys = points.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const X = x => 10 + (W - 20) * (x - x0) / Math.max(1, x1 - x0), Y = y => H - 18 - (H - 36) * (y - y0) / Math.max(0.1, y1 - y0);
  const path = points.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ');
  return `<div class="card"><h2>${label}</h2><svg viewBox="0 0 ${W} ${H}" style="width:100%"><path d="${path}" fill="none" stroke="#22c55e" stroke-width="2.5"/>${points.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3" fill="#38bdf8"/>`).join('')}<text x="10" y="12" fill="#8e99b8" font-size="11">${y1}${unit}</text><text x="10" y="${H - 4}" fill="#8e99b8" font-size="11">${y0}${unit}</text></svg><div class="small mute">Latest: <b style="color:var(--text)">${ys[ys.length - 1]}${unit}</b> · Start: ${ys[0]}${unit}</div></div>`;
}
function progCharts() {
  const days = Object.keys(DB.daily).sort(); const st = parseYmd(S().start);
  const wp = days.filter(d => DB.daily[d].weight).map(d => [(parseYmd(d) - st) / 86400000, parseFloat(DB.daily[d].weight)]);
  const kl = [], kr = []; Object.keys(DB.checkins).sort((a, b) => a - b).forEach(w => { const c = DB.checkins[w]; if (c.k2wl) kl.push([+w, +c.k2wl]); if (c.k2wr) kr.push([+w, +c.k2wr]); });
  if (DB.tests[0] && DB.tests[0].k2w_l) kl.unshift([0, +DB.tests[0].k2w_l]); if (DB.tests[0] && DB.tests[0].k2w_r) kr.unshift([0, +DB.tests[0].k2w_r]);
  const st2 = days.filter(d => DB.daily[d].stiff).map(d => [(parseYmd(d) - st) / 86400000, +DB.daily[d].stiff]);
  $('#pp').innerHTML = chart(wp, 'Body weight', '') + chart(kl, 'Knee-to-wall LEFT', ' cm') + chart(kr, 'Knee-to-wall RIGHT', ' cm') + chart(st2, 'Morning stiffness', ' min');
}
// photos in IndexedDB
function idb() { return new Promise((res, rej) => { const r = indexedDB.open('reneCoachPhotos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = rej; }); }
async function addPhoto(inp, w) { const f = inp.files[0]; if (!f) return; const db = await idb(); const tx = db.transaction('p', 'readwrite'); tx.objectStore('p').put({ id: Date.now(), week: w, date: today(), blob: f }); tx.oncomplete = () => toast('Photo saved (on this phone only)'); }
async function progPhotos() {
  const db = await idb(); const all = await new Promise(r => { const q = db.transaction('p').objectStore('p').getAll(); q.onsuccess = () => r(q.result); });
  if (!all.length) { $('#pp').innerHTML = `<div class="card"><h2>Progress photos</h2><div class="small mute">Add one every Sunday in the check-in. Same light, same spot, shirt off.</div><label class="fld"><span>Add a photo now</span><input type="file" accept="image/*" capture="environment" onchange="addPhoto(this,${Math.max(0, weekOf(today()))});setTimeout(render,500)"></label></div>`; return; }
  const byW = {}; all.forEach(p => (byW[p.week] = byW[p.week] || []).push(p));
  $('#pp').innerHTML = Object.keys(byW).sort((a, b) => a - b).map(w => `<div class="card"><h2>Week ${w}</h2><div class="photos">${byW[w].map(p => `<img src="${URL.createObjectURL(p.blob)}">`).join('')}</div></div>`).join('') + `<div class="card"><label class="fld"><span>Add a photo</span><input type="file" accept="image/*" capture="environment" onchange="addPhoto(this,${Math.max(0, weekOf(today()))});setTimeout(render,500)"></label></div>`;
}

// ---------- SETTINGS ----------
function openSettings() {
  const s = S();
  openModal('Settings', `<div class="card"><h2>Your day</h2>${schedFields(s)}<button class="btn" onclick="saveSettings(true)">Save</button></div>
  <div class="card"><h2>Reminders on your phone</h2><div class="small">Adds every block (morning routine, workouts, floor snacks, evening release, Sunday check-in) to your calendar with alerts, for all 12 weeks.</div><button class="btn" style="margin-top:10px" onclick="downloadICS()">📅 Add to my calendar</button><div class="tiny mute" style="margin-top:6px">iPhone: tap it, then "Add All". Change your times above first.</div></div>
  <div class="card"><h2>Put it on your home screen</h2><div class="small">iPhone Safari: tap <b>Share</b> → <b>Add to Home Screen</b>. It opens full-screen like a real app and works offline.</div></div>
  <div class="card"><h2>Backup</h2><div class="small mute">Your data lives only on this phone. Back it up now and then.</div><div class="row" style="margin-top:8px"><button class="btn sm sec" onclick="exportData()">Export backup</button><label class="btn sm sec">Import<input type="file" accept="application/json" style="display:none" onchange="importData(this)"></label></div></div>
  <div class="card"><button class="btn sm sec" onclick="if(confirm('Redo the setup? Your logs stay.')){DB.onboarded=false;save();closeModal();render()}">Redo setup</button></div>`);
}
function schedFields(s) {
  const f = (k, l) => `<label class="fld"><span>${l}</span><input type="time" id="s_${k}" value="${s[k]}"></label>`;
  return `<label class="fld"><span>Start date (week 1, day 1)</span><input type="date" id="s_start" value="${s.start}"></label><div class="grid2">${f('wake', 'Wake up')}${f('meal1', 'Meal 1')}${f('lift', 'Gym (Mon-Fri)')}${f('meal2', 'Meal 2')}${f('dinner', 'Dinner')}${f('bed', 'Lights out')}${f('cardio', 'Fri cardio')}${f('pilates', 'Sat Pilates')}${f('checkin', 'Sun check-in')}</div>
  <div class="fld"><span>Floor snacks (up to 3 times; they're flexible)</span><div class="grid2">${[0, 1, 2].map(i => `<input type="time" id="s_snack${i}" value="${s.snacks[i] || ''}" style="width:100%;background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:12px;padding:11px">`).join('')}</div></div>
  <label class="fld"><span>Units</span><select id="s_units"><option ${s.units === 'lb' ? 'selected' : ''}>lb</option><option ${s.units === 'kg' ? 'selected' : ''}>kg</option></select></label>`;
}
function saveSettings(close) {
  const s = S(); ['start', 'wake', 'meal1', 'lift', 'meal2', 'dinner', 'bed', 'cardio', 'pilates', 'checkin', 'units'].forEach(k => { const el = $('#s_' + k); if (el && el.value) s[k] = el.value; });
  if ($('#s_snack0')) s.snacks = [0, 1, 2].map(i => ($('#s_snack' + i) || {}).value).filter(Boolean);
  if (s.work !== undefined && $('#s_work')) s.work = $('#s_work').value;
  DB.settings = s; save(); if (close) { closeModal(); toast('Saved'); } render();
}
function exportData() { const b = new Blob([JSON.stringify(DB, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rene-coach-backup-' + today() + '.json'; a.click(); }
function importData(inp) { const r = new FileReader(); r.onload = () => { try { DB = JSON.parse(r.result); save(); toast('Restored'); closeModal(); render(); } catch (e) { alert('Bad file'); } }; r.readAsText(inp.files[0]); }
function downloadICS() {
  const s = S(), st = parseYmd(s.start), until = new Date(st); until.setDate(st.getDate() + 84);
  const U = ymd(until).replace(/-/g, '') + 'T235900';
  const dt = (d, t) => ymd(d).replace(/-/g, '') + 'T' + t.replace(':', '') + '00';
  const firstDow = dow => { const d = new Date(st); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return d; };
  const url = location.href.split('#')[0];
  let n = 0; const ev = (title, d, t, mins, rrule, desc) => { const e = toMin(t) + mins; return `BEGIN:VEVENT\r\nUID:rc-${n++}-${Date.now()}@renecoach\r\nDTSTAMP:${dt(new Date(), '00:00')}\r\nDTSTART:${dt(d, t)}\r\nDTEND:${dt(d, toT(e))}\r\n${rrule ? 'RRULE:' + rrule + ';UNTIL=' + U + '\r\n' : ''}SUMMARY:${title}\r\nDESCRIPTION:${(desc || '').replace(/\n/g, '\\n')}\\nOpen app: ${url}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${title}\r\nTRIGGER:-PT0M\r\nEND:VALARM\r\nEND:VEVENT\r\n`; };
  const wake = toMin(s.wake), bed = toMin(s.bed);
  let c = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Rene Coach//EN\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Rene Coach\r\n';
  c += ev('☀️ Sun walk + morning routine', st, toT(wake + 15), 45, 'FREQ=DAILY', 'Walk 20-30 min outside, then the 12-min morning routine.');
  const names = { 1: 'Push', 2: 'Legs A + ankle + jumps', 3: 'Pull', 4: 'Legs B + ankle + jumps', 5: 'Upper + core' };
  [1, 2, 3, 4, 5].forEach(d => c += ev('🏋️ Gym: ' + names[d], firstDow(d), s.lift, 75, 'FREQ=WEEKLY', 'Open the Gym tab. Log every set.'));
  c += ev('🚴 Bike intervals', firstDow(5), s.cardio, 25, 'FREQ=WEEKLY', '5 easy, 8 x (30s hard/90s easy), 5 easy.');
  c += ev('🧘 Reformer Pilates + long walk', firstDow(6), s.pilates, 60, 'FREQ=WEEKLY', '');
  c += ev('📈 Weekly check-in + photo', firstDow(0), s.checkin, 15, 'FREQ=WEEKLY', 'Progress tab. Then Send to coach.');
  s.snacks.forEach(t => c += ev('🧎 Floor snack (flexible)', st, t, 10, 'FREQ=DAILY', 'Sit on the floor, switch positions every 1-2 min.'));
  c += ev('🌙 Evening release + breathing', st, toT(bed - 75), 10, 'FREQ=DAILY', 'Foam roll, traps, face, then 2-2-4 breathing.');
  c += ev('📵 Screens off', st, toT(bed - 45), 5, 'FREQ=DAILY', 'Lights dim. Phone out of the bedroom.');
  const w6 = new Date(st); w6.setDate(st.getDate() + 35); const w12 = new Date(st); w12.setDate(st.getDate() + 81);
  c += ev('🧪 Week-6 retest (15 min)', w6, toT(wake + 60), 20, '', 'Progress → Tests → Week 6.');
  c += ev('🧪 Week-12 retest (15 min)', w12, toT(wake + 60), 20, '', 'Progress → Tests → Week 12.');
  c += 'END:VCALENDAR\r\n';
  const b = new Blob([c], { type: 'text/calendar' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rene-coach.ics'; a.click();
}

// ---------- ONBOARDING ----------
let OSTEP = 0;
function renderOnboarding() {
  const s = S(); const app = $('#app');
  const steps = [
    `<h1>Hey ${s.name} 👋</h1><p class="mute">This is your 12-week coach. It tells you exactly what to do each day, runs your workouts, teaches you the "why" in 1-minute lessons, and tracks your progress.</p>
     <div class="card"><b>How it works</b><ul class="cues"><li><b>Today</b>: what to do now. Check things off.</li><li><b>Gym</b>: today's workout. Log sets, rest timer, demos.</li><li><b>Learn</b>: swipe cards from every coach + full research.</li><li><b>Progress</b>: Sunday check-in, tests, photos, charts.</li></ul></div>
     <div class="card"><b>Rules you don't schedule</b><div class="small mute">Move every hour, 10-12k steps, pain ≤3/10, pick-a-team meals. The app reminds you on the Today screen.</div></div>`,
    `<h1>When does your day happen?</h1><p class="mute">I'll build your schedule around these. Change them any time in Settings.</p>${schedFields(s)}`,
    `<h1>Reminders</h1><p class="mute">One tap adds your whole 12 weeks to your calendar with alerts. Your phone will ping you for the morning routine, gym, floor snacks, evening release and the Sunday check-in.</p><button class="btn" onclick="saveSettings(false);downloadICS()">📅 Add to my calendar</button><div class="card" style="margin-top:12px"><b>Make it an app</b><div class="small">iPhone Safari: <b>Share → Add to Home Screen</b>.</div></div>`,
    `<h1>First thing tomorrow</h1><div class="card"><ol class="cues"><li>Sun walk</li><li><b>Week-0 tests</b> (Progress → Tests): 15 min</li><li>Morning routine</li><li>Gym: follow the Gym tab</li></ol></div><p class="mute">That's it. Open the app, look at "Up next", do it, tap ✓.</p>`
  ];
  app.innerHTML = `<div class="onb">${steps[OSTEP]}<div style="flex:1"></div><div class="row" style="margin-top:20px">${OSTEP ? `<button class="btn sec" onclick="OSTEP--;renderOnboarding()">Back</button>` : ''}<button class="btn" onclick="onbNext()">${OSTEP === steps.length - 1 ? "Let's go" : 'Next'}</button></div><div class="dots" style="margin-top:14px">${steps.map((_, i) => `<i class="${i === OSTEP ? 'on' : ''}"></i>`).join('')}</div></div>`;
}
function onbNext() { if (OSTEP === 1) saveSettings(false); if (OSTEP >= 3) { DB.onboarded = true; save(); OSTEP = 0; render(); return; } OSTEP++; renderOnboarding(); }

// ---------- boot ----------
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
render();
setInterval(() => { if (TAB === 'today' && !$('#modal').classList.contains('on') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') renderToday(); }, 60000);
