// Rene Plan - all plan content. Plain language on purpose.
// Media helpers: Y('key') = YouTube demo from vid.js, C('file') = cut clip from Tripp's reel (loops, no sound).
const Y = k => (window.VID[k] ? { type: 'yt', id: VID[k][0], dur: VID[k][1] } : null);
const C = f => ({ type: 'mp4', src: 'clips/' + f + '.mp4' });

window.PLAN = {
  weeks: 12,
  phases: [
    { weeks: [1, 4], name: 'Unlock', goal: 'Get your ankles and hips moving again. Learn balance. Light hops only.' },
    { weeks: [5, 8], name: 'Load', goal: 'Make the new positions strong: weighted step-downs, harder balance, bigger jumps.' },
    { weeks: [9, 12], name: 'Speed', goal: 'Make it fast and automatic: drop jumps, bounds, sprint starts, then cutting. Retest at the end.' }
  ],
  deloadWeeks: [4, 8, 12],
  testWeeks: [0, 6, 12],
  filmWeeks: [1, 3, 5, 7, 9, 11],
  targets: {
    liftDay: { kcal: 2500, protein: 200, fat: 65, carbs: 280 },
    restDay: { kcal: 2300, protein: 200, fat: 65, carbs: 230 },
    steps: '10-12k', lossPerWeek: 0.75
  }
};

// ---------- ROUTINES (follow-along: video + timer + instructions, auto-advances) ----------
// sec = timer length. sides = timer splits in half and tells you to switch. No sec = do the reps, tap Next.
window.ROUTINES = {
  morning: {
    title: 'Morning routine', src: "Tripp's 5-minute routine + 1 ankle drill",
    why: "Tripp's own morning routine, cut into single moves so you just follow the video. It loosens your hips, back and ankles (your #1 problem). Pad your knees and ankles with a folded towel.",
    items: [
      { name: 'Legs up, arms up, deep breaths', dose: '1 min', sec: 60, how: 'Lie on your back, calves up on a couch or chair. Arms up over your head. Slow breaths into your back and sides. (His video says 2 min; 1 is enough.)', media: C('m1_breathing'), src: 'Tripp' },
      { name: 'Rockers', dose: '30 reps (~1 min)', sec: 60, how: 'Hands and knees, tops of feet flat. Rock your butt back toward your heels, then forward. Smooth, not fast.', media: C('m2_rockers'), src: 'Tripp' },
      { name: 'Toes-tucked rocking', dose: '30 reps (~1 min)', sec: 60, how: 'Same, but tuck your toes under. Feet point straight back. Towel under your knees. Stop if the outside of your ankle pinches.', media: C('m3_toes_tucked'), src: 'Tripp' },
      { name: 'Single-leg elevated rocking', dose: '20 each side (~1.5 min)', sec: 90, sides: true, how: 'On all fours, step one foot up next to your hand. Rock forward and back. LEFT side first.', media: C('m4_single_leg_rock'), src: 'Tripp' },
      { name: 'Pigeon stretch', dose: '45 sec each side', sec: 90, sides: true, how: 'Front shin across in front of you, back leg long. Sit your hips down and breathe. LEFT first.', media: C('m5_pigeon'), src: 'Tripp' },
      { name: 'Knee-to-wall ankle rocks', dose: '10 each side + 5 extra LEFT (~1.5 min)', sec: 90, sides: true, how: 'Half-kneel facing a wall. Push your front knee toward the wall, heel stays DOWN, hold 2 sec. Band on the front of the ankle if you have one. LEFT first.', media: Y('ankle_band'), src: 'Evidence (ankle rehab)' }
    ]
  },
  winddown: {
    title: 'Wind-down', src: 'Tripp + Mitchell/Kaya + breathing research',
    why: 'No foam roller needed (that happens at the gym now). Calms you down, drains face puffiness a bit, and gets you ready to sleep.',
    items: [
      { name: 'Face release (hands only)', dose: '3 min', sec: 180, how: 'Clean hands, a little oil or moisturizer. Follow the video: slow strokes from the middle of your face out to your ears, jaw toward ears, then down the SIDES of your neck. Never press the front of your neck.', media: Y('face_hands'), src: 'Mitchell / Kaya' },
      { name: 'Legs up the wall', dose: '2 min', sec: 120, how: "Tripp's first move again: back on the floor, legs up the wall or on the bed. Slow breaths into your back. Take magnesium + glycine now.", media: C('m1_breathing'), src: 'Tripp' },
      { name: '2-2-4 breathing', dose: '5 min (in bed)', sec: 300, breath: [2, 2, 4], how: 'In through your nose for 2, hold 2, out through your nose for 4. Belly soft. Follow the circle.', src: 'Breathing research' }
    ]
  },
  moveBreak: {
    title: 'Movement break', src: 'GOATA idea (move often) + simple drills',
    why: 'Not on the schedule. Do it any time you have sat for about an hour. 2.5 minutes.',
    items: [
      { name: '10 squats', dose: '10 reps (~30 sec)', sec: 30, how: 'Heels on a book or plate if needed. Slow, chest up.', media: Y('deep_squat_hold') },
      { name: 'Couch stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Back knee on the floor, shin up the couch or wall. Squeeze that glute, ribs down.', media: Y('couch_stretch') },
      { name: 'Chin tucks', dose: '10 reps (~20 sec)', sec: 20, how: 'Pull your chin straight back (make a double chin). Hold 1 sec.', media: Y('chin_tuck') },
      { name: 'Open books', dose: '5 each side (~40 sec)', sec: 40, sides: true, how: 'Lie on your side, knees bent. Open your top arm across like a book, follow it with your eyes.', media: Y('open_books') }
    ]
  },
  floor: {
    title: 'Floor snack', src: 'GOATA + Tripp + Mitchell',
    why: 'Chairs make your hips, back and neck stiff. Sit on the floor while you watch TV or use your phone. Switch positions when the timer says. 6 minutes.',
    items: [
      { name: 'Criss-cross', dose: '1.5 min', sec: 90, how: 'Try to get the outside edges of your feet on the floor. To get up: hands next to your feet, hips back, then rise.', img: 'img/06-criss-cross.jpg', src: 'GOATA' },
      { name: 'Seiza (sit on heels)', dose: '1.5 min', sec: 90, how: 'Folded towel under ankles and shins. Feet point STRAIGHT back (not toes in). Chest up. Stop at any outside-ankle pain.', img: 'img/01-seiza.jpg', src: 'GOATA / Mitchell' },
      { name: 'Upright fetal (half seiza)', dose: '1 min each side', sec: 120, sides: true, how: 'From seiza, bring one foot forward and plant it outside your knee.', img: 'img/04-upright-fetal-half-seiza.jpg', src: 'GOATA' },
      { name: 'All-fours rocking', dose: '1 min', sec: 60, how: 'Hands and knees. Rock back and forth gently.', img: 'img/07-all-fours-rock.jpg', src: 'Tripp' }
    ]
  },
  floorReset: {
    title: 'Floor reset (Sunday)', src: 'Tripp',
    why: "Tripp's reset: lie on the hardest floor you can stand and let your body soften. 8 minutes.",
    items: [
      { name: 'On your back', dose: '2 min', sec: 120, how: 'Breathe slow, sink into the floor.', img: 'img/08-floor-reset-back.jpg' },
      { name: 'Curled on left side', dose: '2 min', sec: 120, how: 'Fetal position, breathe.' },
      { name: 'Curled on right side', dose: '2 min', sec: 120, how: 'Fetal position, breathe.' },
      { name: 'On your stomach', dose: '2 min', sec: 120, how: 'Head turned, breathe into your back.', img: 'img/09-floor-reset-stomach.jpg' }
    ]
  },
  contrast: {
    title: 'Sunday sauna + cold plunge', src: 'Heat/cold research',
    why: 'Sunday is the right day for the plunge: cold water right after lifting can shrink muscle gains, and Sunday has no lift. About 35 minutes.',
    items: [
      { name: 'Sauna', dose: '12-15 min', sec: 900, how: 'Drink water + Hydrate first. Sit or lie down. Get out if dizzy.' },
      { name: 'Cold plunge', dose: '1-3 min', sec: 120, how: '50-59°F. Slow breaths out, shoulders under. Start with 1 min.' },
      { name: 'Sauna again', dose: '10 min', sec: 600, how: 'Round 2.' },
      { name: 'Cold plunge (finish)', dose: '1-3 min', sec: 120, how: 'End on cold. Let your body warm up on its own after (no hot shower right away).' }
    ]
  }
};

// ---------- ANKLE FIX (end of leg days, ~8-10 min) + JUMPS (start of leg days, ~6-8 min) ----------
window.ANKLE = [
  { weeks: [1, 3], items: [
    { name: 'Band ankle stretch', dose: '3 x 10 each side (+1 set LEFT)', est: 180, how: 'Knee over toes, heel down, 2-sec hold.', media: Y('ankle_band'), src: 'Evidence' },
    { name: 'Single-leg balance', dose: '2 x 30 sec each side', sec: 120, sides: true, how: 'Eyes open. When easy, eyes closed.', media: Y('sl_balance'), src: 'Evidence (cuts re-sprains)' },
    { name: 'Peterson step-down', dose: '2 x 10 each side', est: 120, how: 'Low step. Working heel stays down, knee slides forward over toes. Lower the other heel slowly.', media: Y('peterson'), src: 'Knees-over-toes style (Mitchell/Mucci)' },
    { name: 'Band eversion', dose: '2 x 15 each side', est: 90, how: 'Band around your foot, push the foot OUTWARD. Protects the outside of your ankle (your old sprain).', media: Y('band_eversion'), src: 'Evidence' },
    { name: 'Tibialis raise', dose: '2 x 15-20', est: 90, how: 'Back on a wall, heels out. Lift your toes up and down.', media: Y('tib_raise'), src: 'Knees-over-toes style' }
  ]},
  { weeks: [4, 6], items: [
    { name: 'Loaded ankle stretch', dose: '3 x 10 each side', est: 180, how: 'Same stretch, dumbbell resting on your knee.', media: Y('ankle_band'), src: 'Evidence' },
    { name: 'Balance + ball toss', dose: '2 x 30 sec each side', sec: 120, sides: true, how: 'Stand on one leg, throw and catch a ball off a wall.', media: Y('balance_perturb'), src: 'Evidence' },
    { name: 'Peterson step-down (hold a dumbbell)', dose: '2 x 12 each side', est: 120, how: 'Same as before, a bit higher step or light weight.', media: Y('peterson'), src: 'Knees-over-toes style' },
    { name: 'Weighted single-leg calf raise', dose: '2 x 10 each side', est: 120, how: 'Dumbbell in the same hand. Full stretch, 2 sec up, 2 down.', media: Y('weighted_sl_calf'), src: 'Evidence' },
    { name: 'Tibialis raise', dose: '2 x 20', est: 90, how: 'Hold a light plate if easy.', media: Y('tib_raise') }
  ]},
  { weeks: [7, 9], items: [
    { name: 'Band ankle stretch', dose: '2 x 10 each side', est: 120, how: 'Keep what you gained.', media: Y('ankle_band') },
    { name: 'Balance on foam pad', dose: '2 x 30 sec each side', sec: 120, sides: true, how: 'Eyes closed when you are ready.', media: Y('foam_balance'), src: 'Evidence' },
    { name: 'Peterson step-down (heavier)', dose: '2 x 10 each side', est: 120, how: 'Heavier dumbbell.', media: Y('peterson') },
    { name: 'Tibialis raise', dose: '2 x 20', est: 90, how: '', media: Y('tib_raise') }
  ]},
  { weeks: [10, 12], items: [
    { name: 'Band ankle stretch', dose: '2 x 10 each side', est: 120, how: 'Keep what you gained.', media: Y('ankle_band') },
    { name: 'Balance on foam pad, eyes closed', dose: '2 x 30 sec each side', sec: 120, sides: true, how: '', media: Y('foam_balance') },
    { name: 'Tibialis raise', dose: '2 x 20', est: 90, how: '', media: Y('tib_raise') }
  ]}
];

window.JUMPS = [
  { weeks: [1, 3], contacts: '40-60', items: [
    { name: 'Pogo hops', dose: '2 x 20 sec', sec: 60, how: 'Stiff ankles, bounce on the balls of your feet, quiet.', media: Y('pogo') },
    { name: 'Snap-downs', dose: '3 x 5', est: 75, how: 'Rise on toes, then snap down into a quarter squat and freeze.', media: Y('snapdown') },
    { name: 'Squat jump + stick', dose: '3 x 3', est: 90, how: 'Jump, land soft, knees over toes, freeze 2 sec.', media: Y('squat_jump_stick') },
    { name: 'Low box jump', dose: '3 x 3', est: 90, how: 'Knee height or lower. Always STEP down.', media: Y('box_jump') }
  ]},
  { weeks: [4, 6], contacts: '60-80', items: [
    { name: 'Pogo hops', dose: '3 x 20 sec', sec: 90, how: 'A bit higher.', media: Y('pogo') },
    { name: 'Broad jump + stick', dose: '3 x 3', est: 90, how: 'Jump forward, land and freeze.', media: Y('broad_jump') },
    { name: 'Box jump', dose: '4 x 3', est: 100, how: 'Higher box. Step down.', media: Y('box_jump') },
    { name: 'Side-to-side line hops', dose: '3 x 15 sec', est: 75, how: 'Both feet, quick and quiet.', media: Y('lateral_hops') }
  ]},
  { weeks: [7, 9], contacts: '80-100', items: [
    { name: 'Drop to stick', dose: '3 x 3', est: 90, how: 'Step off a 30 cm box, land and freeze.', media: Y('drop_stick') },
    { name: 'Drop jump', dose: '3 x 3', est: 90, how: 'Step off, land, jump up right away.', media: Y('drop_jump') },
    { name: 'Skater bounds + stick', dose: '3 x 5 each side', est: 100, how: 'Bound sideways, land on one leg, freeze.', media: Y('skater') },
    { name: 'Single-leg hop + stick', dose: '3 x 3 each leg', est: 100, how: 'Forward, sideways, diagonal. LEFT first.', media: Y('hop_stick') }
  ]},
  { weeks: [10, 12], contacts: '~100', items: [
    { name: 'Depth jumps', dose: '4 x 3', est: 110, how: '30-45 cm box. Short ground contact, jump high.', media: Y('depth_jump') },
    { name: 'Approach vertical jumps', dose: '4 x 3', est: 110, how: '2-3 step approach, jump and reach high.', media: Y('approach_vj') },
    { name: 'Figure-8 hops', dose: '2 laps each leg', est: 90, how: 'Around two cones, one leg.', media: Y('fig8') },
    { name: 'Cutting drill (Thursday only)', dose: '4 x 20 m', est: 120, how: 'Run, plant, cut. 60% speed first week, 80% after.', media: Y('cutting') }
  ]}
];

// ---------- WARM-UPS + FINISHERS (stretch + foam roll AT THE GYM) ----------
const W_UPPER = [
  { name: 'Bike', dose: '3 min easy', sec: 180, how: 'Just get warm.' },
  { name: 'Band dislocates', dose: '15 reps', est: 45, how: 'Wide grip on a band, arms straight, over your head and back.', media: Y('dislocates') },
  { name: 'Wall slides', dose: '10 reps', est: 45, how: 'Back and arms on the wall, slide up and down.', media: Y('wall_slides') },
  { name: 'Crawl', dose: '1 min', sec: 60, how: "Tripp's crawl: knees hover 1 inch off the floor, crawl forward and back slowly. Back stays flat.", media: C('w_crawl'), src: 'Tripp' },
  { name: 'Med-ball chest pass', dose: '3 x 5 (max speed)', est: 90, how: 'Throw hard into a wall. Makes you explosive.', media: Y('mb_chest_pass'), src: 'Evidence (athletic)' }
];
const W_PULL = [
  { name: 'Bike', dose: '3 min easy', sec: 180, how: 'Just get warm.' },
  { name: 'Band pull-aparts', dose: '20 reps', est: 45, how: 'Arms straight, pull the band to your chest.', media: Y('pull_apart') },
  { name: 'Scap pull-ups', dose: '10 reps', est: 45, how: 'Hang, pull your shoulders down without bending elbows.', media: Y('scap_pullup') },
  { name: 'Crawl', dose: '1 min', sec: 60, how: "Tripp's crawl: knees hover, slow, back flat.", media: C('w_crawl'), src: 'Tripp' },
  { name: 'Med-ball shot-put throw', dose: '3 x 5 each side', est: 90, how: 'Rotate and throw from your shoulder into a wall.', media: Y('mb_shotput'), src: 'Evidence (athletic)' }
];
const W_LEGS = [
  { name: 'Backwards incline treadmill walk', dose: '5 min', sec: 300, how: 'Slow, hold the rails lightly. Warms up knees and ankles.', media: Y('back_treadmill'), src: 'Knees-over-toes style' }
];
const FOAM = [
  { name: 'Foam roll calves', dose: '1 min (+30 sec LEFT)', sec: 90, how: 'Slow. Stop on tight spots and breathe.', media: Y('foam_calves') },
  { name: 'Foam roll quads', dose: '1 min', sec: 60, how: '', media: Y('foam_quads') },
  { name: 'Foam roll glutes', dose: '1 min', sec: 60, how: 'Cross one ankle over the other knee.', media: Y('foam_glutes') },
  { name: 'Foam roll upper back', dose: '1 min', sec: 60, how: 'Hands behind your head, roll mid and upper back only.', media: Y('foam_upper_back') }
];
const F_UPPER = [...FOAM,
  { name: 'Foam roll lats', dose: '30 sec each side', sec: 60, sides: true, how: '', media: Y('foam_lats') },
  { name: 'Doorway pec stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Forearm on a rack or door frame, step through.', media: Y('doorway_pec') },
  { name: 'Rack lat stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Hold a rack, sit your hips back and away.', media: Y('lat_stretch') },
  { name: 'Couch stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Back knee down, shin up a bench. Squeeze the glute.', media: Y('couch_stretch') },
  { name: 'Pigeon stretch', dose: '45 sec each side', sec: 90, sides: true, how: 'On a bench or the floor. LEFT first.', media: C('m5_pigeon'), src: 'Tripp' },
  { name: 'Standing hamstring stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Heel on a low box, hinge forward with a flat back.', media: Y('hamstring_stretch') }
];
const F_LEGS = [...FOAM.slice(0, 3),
  { name: 'Couch stretch', dose: '30 sec each side', sec: 60, sides: true, how: 'Squeeze the glute, ribs down.', media: Y('couch_stretch') },
  { name: 'Calf stretch on a step', dose: '30 sec each side', sec: 60, sides: true, how: 'Knee straight, then knee bent.', media: Y('calf_stretch') },
  { name: 'Deep squat hold', dose: '1 min', sec: 60, how: 'Heels on a plate, hold a rack. Chest up.', media: Y('deep_squat_hold') }
];
const SAUNA = { name: 'Sauna', dose: '15 min', sec: 900, how: 'Drink 500 ml water + Hydrate. Sit or lie down. You can do gentle stretches in there. Skip it on a drinking night or the morning after.' };

// ---------- WORKOUTS ----------
// Every exercise: why = the reason it's in your plan. src = where it came from.
// Time math: each set ~40 sec + rest, +1 min setup. Lifting is kept to ~45-55 min.
window.WORKOUTS = {
  1: { key: 'push', title: 'Push', focus: 'Chest, shoulders, triceps, abs',
    warmup: W_UPPER, finish: F_UPPER,
    ex: [
      { name: 'Machine chest press', sets: 3, reps: '6-8', rest: 150, v: 'chest_press', cues: ['First set: one arm at a time to even out sides', 'Full range, controlled', 'Stop 1-2 reps before you fail'], swap: 'Hammer Strength press', src: 'Your Superpower plan', why: 'Main chest builder. Machine = safe to push hard.' },
      { name: 'Seated machine shoulder press', sets: 3, reps: '8-10', rest: 120, v: 'shoulder_press', cues: ['Ribs down, back on the pad', 'Stop 1-2 reps before you fail'], swap: 'Smith press', src: 'Your Superpower plan', why: 'Wider-looking shoulders.' },
      { name: 'High-to-low cable fly', sets: 3, reps: '12-15 (+1 extra set right side)', rest: 75, v: 'cable_fly_hl', cues: ['Right side first (it is behind)', 'Feel the stretch'], swap: 'Pec deck', src: 'Your Superpower plan', why: 'Fills out the chest. Extra set evens out your right side.' },
      { name: 'Single-arm cable lateral raise', sets: 3, reps: '12-15 each', rest: 45, each: true, v: 'cable_lateral', cues: ['Lead with the elbow', 'Stop at shoulder height', '3 sec down'], swap: 'Lateral raise machine', src: 'Your Superpower plan', why: 'Side delts = the "V" that makes your waist look smaller.' },
      { name: 'Overhead single-arm cable extension', sets: 3, reps: '10-12 each', rest: 45, each: true, v: 'oh_cable_ext', cues: ['Elbow points at the ceiling', 'Deep stretch at the bottom'], swap: 'Rope overhead extension', src: 'Your Superpower plan', why: 'Biggest part of the triceps grows best stretched overhead.' },
      { name: 'Face pull', sets: 3, reps: '15', rest: 60, v: 'face_pull', cues: ['Rope at forehead height', 'Pull to your face, elbows high', 'Rotate your hands back at the end'], swap: 'Band pull-aparts', src: 'Added (evidence)', why: 'You press a lot. This trains the back of your shoulders and rotator cuff so shoulders stay pulled back and your neck/shoulder pain calms down. Once a week.' },
      { name: 'Cable crunch', sets: 3, reps: '12-15', rest: 60, v: 'cable_crunch', cues: ['Curl your ribs toward your hips', 'Hips stay still', 'Add weight over time'], swap: 'Machine crunch', src: 'Your Superpower plan', why: 'Front abs only (the six-pack). Does not widen your waist.' }
    ] },
  2: { key: 'legsA', title: 'Legs A (quads) + ankles + jumps', focus: 'Quads, knees, ankles, springy legs', legs: true, film: 'hack',
    warmup: W_LEGS, finish: F_LEGS,
    ex: [
      { name: 'Hack squat (heels elevated)', sets: 4, reps: '6-8', rest: 150, v: 'hack_squat', film: true, cues: ['Go only as deep as you can BEFORE your pelvis tucks under (that tuck = your back pain)', 'Brace hard, 3 sec down', 'Add depth as your ankles improve'], swap: 'Pendulum or heels-up goblet squat', src: 'Your Superpower plan', why: 'Main quad builder. Back is supported, so it is kind to your low back.' },
      { name: 'Bulgarian split squat', sets: 3, reps: '8-10 each', rest: 90, each: true, v: 'bulgarian', cues: ['LEFT leg first', 'Let the front knee travel over the toes', 'Lean a little forward'], swap: 'Slant-board split squat', src: 'Your Superpower plan', why: 'One leg at a time fixes left/right gaps and stretches the hip flexor.' },
      { name: 'Leg extension', sets: 3, reps: '12-15', rest: 75, v: 'leg_ext', cues: ['1 sec squeeze at the top', '3 sec down'], swap: '-', src: 'Your Superpower plan', why: 'Builds the quad near the knee. Good for knee pain when controlled.' },
      { name: 'Seated leg curl', sets: 3, reps: '10-12', rest: 75, v: 'seated_leg_curl', cues: ['Seated, not lying', 'Lean forward a bit'], swap: '-', src: 'Your Superpower plan', why: 'Seated grows hamstrings best (stretched position).' },
      { name: 'Standing calf raise', sets: 4, reps: '8-10', rest: 60, v: 'calf_standing', cues: ['Full stretch at the bottom', '2 sec pause down there', 'No bouncing'], swap: 'Leg press calf raise', src: 'Your Superpower plan', why: 'Strong calves + Achilles = springy jumps and happier ankles.' }
    ] },
  3: { key: 'pull', title: 'Pull', focus: 'Back, biceps, posture',
    warmup: W_PULL, finish: F_UPPER,
    ex: [
      { name: 'Chest-supported T-bar row', sets: 4, reps: '8-10', rest: 120, v: 'tbar_row', cues: ['Chest stays on the pad', 'Pull to your lower ribs'], swap: 'Seated cable row', src: 'Your Superpower plan', why: 'Thick back without loading your low back.' },
      { name: 'Lat pulldown', sets: 3, reps: '8-10', rest: 120, v: 'lat_pulldown', cues: ['Lean back a little', 'Full stretch at the top', 'Elbows to your pockets'], swap: 'Pull-ups', src: 'Your Superpower plan', why: 'Wide lats = V-taper = smaller-looking waist.' },
      { name: 'Shrug', sets: 3, reps: '10-12', rest: 75, v: 'shrug', cues: ['Straight up', '1 sec pause', 'No rolling'], swap: 'Dumbbell shrug', src: 'Your Superpower plan', why: 'Traps for a bigger, athletic look.' },
      { name: '45-degree back extension', sets: 3, reps: '12', rest: 75, v: 'back_ext', cues: ['Round a little at the bottom', 'Stop at straight, never lean back past it'], swap: '-', src: 'Added (evidence)', why: 'Strong low-back muscles are the best-proven fix for low-back pain. Replaces the old McGill core drills.' },
      { name: 'Incline dumbbell curl', sets: 3, reps: '10-12', rest: 75, v: 'incline_curl', cues: ['Arms hang behind you', 'Elbows stay still'], swap: 'Bayesian cable curl', src: 'Your Superpower plan', why: 'Stretched biceps grow best.' },
      { name: 'Preacher curl', sets: 3, reps: '10-12', rest: 60, v: 'preacher', cues: ['Armpits on the pad', 'Stop just short of locking out'], swap: '-', src: 'Your Superpower plan', why: 'Second biceps angle.' },
      { name: 'Dead hang', sets: 2, reps: '30-45 sec', rest: 60, v: 'dead_hang', cues: ['Relax your shoulders, breathe'], swap: '-', src: 'Added (Mitchell + evidence)', why: 'Stretches your lats and spine, strong grip, feels great on the shoulders.' }
    ] },
  4: { key: 'legsB', title: 'Legs B (hamstrings/glutes) + ankles + jumps', focus: 'Hamstrings, glutes, groin, sprint-proof legs', legs: true, film: 'rdl',
    warmup: W_LEGS, finish: F_LEGS,
    ex: [
      { name: 'Romanian deadlift', sets: 4, reps: '8-10', rest: 150, v: 'rdl', film: true, cues: ['Hips back, soft knees', 'Flat back; stop where it wants to round', 'Stop 2 reps before you fail'], swap: 'Dumbbell RDL', src: 'Your Superpower plan', why: 'Hamstrings + glutes + a strong back = jumping power.' },
      { name: 'Hip thrust', sets: 3, reps: '8-10', rest: 120, v: 'hip_thrust', cues: ['Ribs down', 'Squeeze 1 sec', 'No arching at the top'], swap: 'Glute machine', src: 'Your Superpower plan', why: 'Glutes protect your knees and low back.' },
      { name: 'Nordic curl', sets: 2, reps: '4-6', rest: 90, v: 'nordic', cues: ['Lower as SLOW as you can', 'Catch yourself with your hands, push back up'], swap: 'Band-assisted Nordic', src: 'Added (strong evidence)', why: 'Cuts hamstring injuries about in half in studies. Needed before sprinting.' },
      { name: 'Copenhagen plank (short)', sets: 2, reps: '20 sec each side', rest: 45, each: true, v: 'copenhagen', cues: ['KNEE on the bench (easy version)', 'Hips up in a straight line'], swap: 'Adductor machine', src: 'Added (strong evidence)', why: 'This is for your GROIN (inner thigh), not your obliques. It cuts groin injuries by about 40% and targets your hip/groin pain.' },
      { name: 'Standing calf raise', sets: 3, reps: '12-15', rest: 60, v: 'calf_standing', cues: ['Full stretch, controlled'], swap: '-', src: 'Your Superpower plan', why: 'Calves twice a week for springy ankles.' },
      { name: 'Sled push', sets: 4, reps: '20 m', rest: 75, v: 'sled_push', cues: ['Low body angle', 'Drive through the balls of your feet'], swap: 'Backwards sled drag', src: 'Added (knees-over-toes style)', why: 'Knee-friendly leg power + fat burn. Knees can go over toes safely.' }
    ] },
  5: { key: 'upper', title: 'Upper + abs + bike', focus: 'Arms, delts, traps, abs. Then bike intervals.',
    warmup: W_UPPER.filter(x => x.name !== 'Med-ball chest pass'), finish: F_UPPER.filter(x => !/lats|Rack|hamstring/.test(x.name)), cardio: true,
    ex: [
      { name: 'Overhead single-arm cable extension', sets: 3, reps: '10-12 each', rest: 45, each: true, v: 'oh_cable_ext', cues: ['Elbow points at the ceiling'], swap: '-', src: 'Your Superpower plan', why: 'Triceps = 2/3 of your arm size.' },
      { name: 'Single-arm cable lateral raise', sets: 3, reps: '12-15 each', rest: 45, each: true, v: 'cable_lateral', cues: ['Lead with the elbow'], swap: 'Machine', src: 'Your Superpower plan', why: 'Twice a week for wider shoulders.' },
      { name: 'Incline dumbbell curl', sets: 3, reps: '10-12', rest: 75, v: 'incline_curl', cues: ['Arms hang behind you'], swap: '-', src: 'Your Superpower plan', why: 'Biceps twice a week.' },
      { name: 'Single-arm reverse-grip pushdown', sets: 3, reps: '12-15 each', rest: 45, each: true, v: 'rev_pushdown', cues: ['Upper arm stays still'], swap: 'Rope pushdown', src: 'Your Superpower plan', why: 'Second triceps angle.' },
      { name: 'Machine or Smith shrug', sets: 3, reps: '10-12', rest: 75, v: 'shrug', cues: ['1 sec pause, slow down'], swap: '-', src: 'Your Superpower plan', why: 'Traps twice a week.' },
      { name: 'Ab wheel (from knees)', sets: 3, reps: '8-12', rest: 60, v: 'ab_wheel', cues: ['Squeeze glutes, tuck your hips a little', 'Roll out only as far as your back stays flat'], swap: 'Hanging straight-leg raise', src: 'Added', why: 'Front abs + teaches your abs to stop your back from arching. No side work.' },
      { name: 'Stomach vacuum', sets: 3, reps: '20 sec', rest: 30, v: 'stomach_vacuum', cues: ['Breathe all the way out', 'Pull your belly button to your spine and hold', 'Breathe small while holding'], swap: '-', src: 'Added', why: 'Trains the deep "corset" muscle. Honest: little research proves it slims the waist, but it costs 2 minutes.' }
    ] },
  6: { key: 'sat', title: 'Saturday: morning Pilates + long walk', rest: true,
    items: ['Reformer Pilates in the morning (after you wake up and eat)', 'Long walk 45-60 min sometime today', 'Floor snacks as usual'] },
  0: { key: 'sun', title: 'Sunday: recovery + check-in', rest: true,
    items: ['Floor reset (8 min)', 'Walk', 'Sauna + cold plunge (2 rounds, ~35 min)', 'Front progress photo', 'Weekly check-in (Progress tab, 3 min)'] }
};
window.CARDIO = {
  early: { name: 'Bike intervals', dose: '20 min', how: '5 min easy, then 8 rounds of 30 sec HARD / 90 sec easy, then 5 min easy.', steps: [{ name: 'Easy', sec: 300 }, ...Array.from({ length: 8 }, (_, i) => [{ name: 'HARD ' + (i + 1) + '/8', sec: 30 }, { name: 'Easy', sec: 90 }]).flat(), { name: 'Easy cool-down', sec: 300 }] },
  late: { name: 'Sprint starts (weeks 10-12)', dose: '15 min', how: '5 min easy jog, then 6 x 20 m sprint starts, walk back between. 70% speed week 10, 85% after.', media: Y('sprint_start') }
};

// ---------- ALWAYS-ON RULES (not scheduled, just remember) ----------
window.RULES = [
  { t: 'Move every 45-60 min', d: 'Been sitting about an hour? Do the 2.5-min movement break.' },
  { t: '10-12k steps', d: 'Walk after meals, take calls walking, take the stairs. Your phone fills this in automatically if you open the app from the Shortcut.' },
  { t: 'Pain rule: 3 out of 10 max', d: 'OK if it is gone by the next morning. Worse next morning? Cut that exercise 20-30% for 2-3 days. Sharp pain = stop or swap.' },
  { t: 'Missed a workout?', d: 'Do the next one in order. The Gym tab shows you which. Never two leg days in a row.' },
  { t: 'Pick a team at every meal', d: 'Protein + Sweet (rice, fruit, honey, oats) OR protein + Rich (steak, salmon, oil, avocado). Not both together.' },
  { t: 'Coffee: 1 hr after waking, none after 2 PM', d: 'Salted water before coffee.' },
  { t: 'Salt: steady every day', d: 'Pinch in morning water. Avoid big salty takeout the night before you want to look sharp.' },
  { t: 'Left side first', d: 'On every one-leg or one-arm exercise. Extra set on the left ankle work.' },
  { t: 'Chew both sides, phone at eye level', d: 'Symmetry habits. Sleep on your back or switch sides.' },
  { t: 'Weekend drinks: 1 night, 3-4 max', d: 'Protein meal first, water between drinks. No sauna that night, no heavy legs next day.' },
  { t: 'Stressed? Physiological sigh', d: 'Two breaths in through the nose, one long breath out. 1-2 min.', v: 'sigh' }
];

// ---------- FOOD ----------
window.FOOD = {
  team: [
    { team: 'Sweet', color: '#f59e0b', protein: 'Lean: chicken breast, shrimp, cod, turkey, egg whites, 93/7 beef, Greek yogurt', add: 'Rice, potatoes, oats, fruit, honey', dessert: 'Yes, if sweet not fatty (yogurt + honey bowl, fruit, sorbet)' },
    { team: 'Rich', color: '#8b5cf6', protein: 'Fatty: steak, salmon, lamb, whole eggs', add: 'Veggies + olive oil or butter, avocado', dessert: 'No dessert' }
  ],
  day: [
    { meal: 'Meal 1 (pre-lift)', team: 'Sweet', what: '1 whole egg + 6 egg whites (or Greek yogurt), 80 g oats, cinnamon, berries, a little honey. Greens, omega-3, ashwagandha, beta-alanine.' },
    { meal: 'Meal 2 (post-lift)', team: 'Sweet', what: 'Chicken, shrimp or cod + 1.5 cups white rice + pineapple or fruit. Creatine 5 g.' },
    { meal: 'Dinner', team: 'Pick', what: 'RICH: steak or salmon + veggies + olive oil, no dessert. SWEET: chicken/cod + potato or rice + veggies, then the yogurt bowl.' },
    { meal: '9 PM bowl (optional)', team: 'Sweet', what: 'Greek yogurt or cottage cheese + fruit + honey. Only after a Sweet dinner.' }
  ],
  dont: ['Donuts, pastries', 'Pizza', 'Burger + fries + shake', 'Ice cream after a steak'],
  eatingOrder: 'Veggies first, then protein, then carbs. Stop at about 80% full.',
  fun: 'About 300 "fun" calories a day of anything, as long as protein and total calories land.'
};

// ---------- TESTS (week 0, 6, 12) ----------
window.TESTS = [
  { id: 'k2w_l', name: 'Knee-to-wall LEFT (cm)', how: 'Face a wall, heel down, slide your foot back until your knee just touches. Measure toe to wall.', target: '10+ cm, less than 2 cm difference L vs R', v: 'k2w_test' },
  { id: 'k2w_r', name: 'Knee-to-wall RIGHT (cm)', how: 'Same on the right.', target: '10+ cm', v: 'k2w_test' },
  { id: 'calf_l', name: 'Single-leg calf raises LEFT (reps)', how: 'Full height, 1 rep every 2 sec, until you cannot.', target: '25+', v: 'calf_test' },
  { id: 'calf_r', name: 'Single-leg calf raises RIGHT (reps)', how: 'Same.', target: '25+', v: 'calf_test' },
  { id: 'bal_l', name: 'Eyes-closed balance LEFT (sec)', how: 'Hands on hips, firm floor.', target: '20-30 sec', v: 'sl_balance' },
  { id: 'bal_r', name: 'Eyes-closed balance RIGHT (sec)', how: 'Same.', target: '20-30 sec', v: 'sl_balance' },
  { id: 'sp_l', name: 'Side plank LEFT (sec)', how: 'To failure. Just a left-vs-right test, not training.', target: 'Sides within ~5%', v: 'side_plank' },
  { id: 'sp_r', name: 'Side plank RIGHT (sec)', how: 'Same.', target: 'Sides within ~5%', v: 'side_plank' },
  { id: 'vj', name: 'Vertical jump (inches)', how: 'Chalk or wet fingers. Reach high and mark. Jump and mark. Measure the gap.', target: 'Goes up by week 12', v: 'vj_test' }
];

// ---------- FILMING (what, when, where it goes) ----------
window.FILMS = [
  { id: 'f_squat_side', name: 'Bodyweight squat, side view', how: 'Phone at hip height, 3 m away. 5 slow reps.', look: ['Pelvis tucks under at the bottom?', 'Heels lift?'] },
  { id: 'f_squat_front', name: 'Bodyweight squat, front view', how: 'Same, from the front.', look: ['Knees cave in?', 'Shift to one side?'] },
  { id: 'f_walk', name: '10-step walk (side + behind)', how: 'Barefoot. Slow-mo if you can.', look: ['Feet turn out a lot?', 'One side different?'] },
  { id: 'f_sls', name: 'Single-leg squat x5 each (front)', how: 'Slow, as deep as you can control.', look: ['Knee caves in?', 'Hips drop on one side?'], v: 'sls_test' },
  { id: 'f_photos', name: 'Photos: front, side, back', how: 'Shirt off, same light and spot every time.', look: [] }
];
window.FILMGUIDE = {
  album: '12-Week Films',
  setup: 'One time: Photos app → Albums → + → New Album → name it "12-Week Films".',
  schedule: [
    ['Test days: week 0, 6, 12', 'Squat side + front, walk, single-leg squat, photos (front/side/back). About 5 minutes.'],
    ['Odd weeks (1, 3, 5, 7, 9, 11), Tuesday', '1 set of hack squats from the side + 1 set of jumps from the front.'],
    ['Odd weeks, Thursday', '1 set of RDLs from the side + 1 set of jumps from the front.'],
    ['Every Sunday', 'One front photo inside the app (check-in). It stays in the app.']
  ],
  look: {
    hack: ['Does your pelvis tuck under at the bottom? Next time stop just above that depth.', 'Do your heels lift?', 'Do your knees drift in?'],
    rdl: ['Does your back round? Stop higher.', 'Do your hips go BACK (not down)?', 'Does the bar stay close to your legs?'],
    jumps: ['Do your knees cave in when you land?', 'Is the landing loud?', 'Does one foot land first?']
  },
  after: [
    'Watch it once right away (10 seconds). Check the 3 things the app lists.',
    'Tap "Looks good" or type one fix. The app saves it and shows it next time.',
    'Add the clip to the "12-Week Films" album. Keep 1 clip per exercise, delete extra takes.',
    'At week 6 and 12 the app reminds you to watch week 1 vs now side by side.'
  ],
  skip: 'Missed a film day? Film on your next leg day. Missed a whole film week? Skip it and film next odd week. Never film more than this; it is just a quick check.'
};
