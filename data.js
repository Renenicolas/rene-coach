// Rene Coach - all plan content. Plain language on purpose.
const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const YT = id => ({ type: 'youtube', id });
const IG = id => ({ type: 'link', url: 'https://www.instagram.com/p/' + id + '/', label: 'Watch on Instagram' });
const DEMO = q => ({ type: 'link', url: yt(q), label: 'Watch a demo' });

window.PLAN = {
  weeks: 12,
  phases: [
    { weeks: [1, 4], name: 'Unlock', goal: 'Get your ankles and hips moving again. Learn balance. Light hops only.' },
    { weeks: [5, 8], name: 'Load', goal: 'Make the new positions strong: weighted step-downs, holds, line hops.' },
    { weeks: [9, 12], name: 'Speed', goal: 'Make it fast and automatic: hop-and-stick, bounds, sprints, then cutting. Retest at the end.' }
  ],
  deloadWeeks: [4, 8, 12],
  testWeeks: [0, 6, 12],
  targets: {
    liftDay: { kcal: 2500, protein: 200, fat: 65, carbs: 280 },
    restDay: { kcal: 2300, protein: 200, fat: 65, carbs: 230 },
    steps: '10-12k', lossPerWeek: 0.75
  }
};

// ---------- ROUTINES ----------
window.ROUTINES = {
  morning: {
    title: 'Morning routine', minutes: 12,
    why: 'This is what makes you wake up ready to move. It unlocks your ankles (your #1 problem), hips and upper back, and protects your low back.',
    items: [
      { name: 'Back breathing', dose: '1 min', how: 'Lie on your back, legs up on a couch. Breathe into your back and sides, not your belly.', media: IG('DTyX8FYkdMI'), img: 'img/tripp_DTyX8FYkdMI.jpg' },
      { name: 'Rock-backs', dose: '20 reps', how: 'On all fours, tops of feet flat. Rock your butt back toward your heels, then forward. Head up, back flat.', media: YT('HRpjIjSl1mc'), img: 'img/07-all-fours-rock.jpg' },
      { name: 'Toes-tucked rock-backs', dose: '15 reps', how: 'Same, but toes tucked under. Put a pillow under your knees if your ankles complain.', media: YT('rJ7h6-wGl1Y') },
      { name: 'Band ankle stretch', dose: '10 per side (+5 on LEFT)', how: 'Band low on the front of your ankle, tied behind you. Half-kneel. Push your knee forward over your toes, heel stays down, hold 2 sec. LEFT first.', media: DEMO('banded ankle dorsiflexion mobilization') },
      { name: '90/90 hip lifts', dose: '8 per side', how: 'Sit with both knees bent at 90 degrees, one in front, one to the side. Lift the back shin off the floor.', media: DEMO('90 90 hip lift off') },
      { name: 'Hip-flexor stretch', dose: '45 sec per side', how: 'Half-kneel. Squeeze the back glute, ribs down. Lean forward a little.', media: DEMO('half kneeling hip flexor stretch glute squeeze') },
      { name: 'Crawl', dose: '1 min', how: 'Knees hover just off the floor. Crawl forward and back slowly.', media: IG('DVmCIcTEe40'), img: 'img/tripp_DVmCIcTEe40.jpg' },
      { name: 'McGill Big 3', dose: '1 round', how: 'Curl-up 3 x 10 sec. Side plank 10 sec each side. Bird dog 5 each side.', media: DEMO('mcgill big 3 exercises') },
      { name: 'Chin tucks + wall slides', dose: '10 each', how: 'Pull your chin straight back (double chin). Then back against a wall, slide your arms up and down.', media: DEMO('chin tucks wall slides') }
    ]
  },
  evening: {
    title: 'Evening release', minutes: 5,
    why: 'Calms tight muscles and moves fluid so you are less stiff and less puffy. Temporary relief; the real fix is the movement work.',
    items: [
      { name: 'Foam roll', dose: '60 sec each: calves, quads, glutes, upper back', how: 'Slow. Breathe. Extra time on your LEFT calf.', media: DEMO('foam rolling calves quads glutes upper back') },
      { name: 'Ball on upper traps', dose: '60 sec per side', how: 'Ball between your upper trap and a wall. Lean in and breathe.', media: DEMO('lacrosse ball upper trap release wall') },
      { name: 'Face release', dose: '2 min', how: 'Clean hands or a gua sha tool. Slow strokes from the middle of your face out to your ears. Jaw: chin to ear. Then down the SIDES of your neck. 60 sec slow circles on the chewing muscle at your jaw angle. Never press the front of your neck.', media: DEMO('gua sha lymphatic drainage face routine') }
    ]
  },
  breathing: {
    title: 'Wind-down breathing', minutes: 5,
    why: 'A longer breath out tells your body it is safe to rest. Better sleep, lower stress.',
    items: [
      { name: '2-2-4 breathing', dose: '5 min', how: 'Lie down. Breathe in through your nose for 2, hold 2, out through your nose for 4. Belly soft.' },
      { name: 'Stressed any time? Physiological sigh', dose: '1-2 min', how: 'Two breaths in through the nose (a big one, then a little top-up), then one long slow breath out. Best-proven breathing trick.' }
    ]
  },
  floor: {
    title: 'Floor snack', minutes: 8,
    why: 'Chairs make your hips, back and neck stiff. The floor is a free foam roller and makes you shift a lot. Rotate positions every 1-2 minutes.',
    items: [
      { name: 'Criss-cross', dose: '1-2 min', how: 'Try to get the outer edges of your feet on the floor. To stand up: hands next to your feet, hips back, then rise.', img: 'img/06-criss-cross.jpg' },
      { name: 'Seiza (sit on heels)', dose: '1-2 min', how: 'Folded towel under ankles and shins. Feet point STRAIGHT back (not toes in). Hips back, chest up. Stop at any outside-ankle pain.', img: 'img/01-seiza.jpg' },
      { name: 'Upright fetal (half seiza)', dose: '1 min per side', how: 'From seiza, bring one foot forward and plant it outside your knee.', img: 'img/04-upright-fetal-half-seiza.jpg' },
      { name: 'All-fours', dose: '1 min', how: 'Hands and knees. Rock back and forth gently. Great for watching TV.', img: 'img/07-all-fours-rock.jpg' },
      { name: 'Deep squat rest', dose: '1 min', how: 'Heels on a small plate or wedge, hold a door frame. Chest up.', img: 'img/05-deep-squat-rest.jpg' }
    ]
  },
  moveBreak: {
    title: 'Movement break (every 45-60 min of sitting)', minutes: 2,
    why: 'Not scheduled. Just do it whenever you have been sitting about an hour.',
    items: [
      { name: '10 squats', dose: 'heels on a plate', how: 'Controlled, chest up.' },
      { name: 'Couch stretch', dose: '30 sec per side', how: 'Back knee against a wall or couch, squeeze that glute.' },
      { name: 'Chin tucks', dose: '10', how: 'Pull chin straight back.' },
      { name: 'Open books', dose: '5 per side', how: 'Lie on your side, knees bent, open your top arm like a book.' }
    ]
  },
  floorReset: {
    title: 'Floor reset (Sunday)', minutes: 8,
    why: "Tripp's reset: lie on the hardest surface you can tolerate and let your body soften.",
    items: [
      { name: 'On your back', dose: '2 min', how: 'Breathe slow, sink into the floor.', img: 'img/08-floor-reset-back.jpg' },
      { name: 'Curled on left side', dose: '2 min', how: 'Fetal position, breathe.' },
      { name: 'Curled on right side', dose: '2 min', how: 'Fetal position, breathe.' },
      { name: 'On your stomach', dose: '2 min', how: 'Head turned, breathe into your back.', img: 'img/09-floor-reset-stomach.jpg' }
    ]
  }
};

// ---------- ANKLE + JUMP BLOCKS by phase (weeks 1-3, 4-6, 7-9, 10-12) ----------
window.ANKLE = [
  { weeks: [1, 3], items: [
    { name: 'Band ankle stretch', sets: '3 x 10', how: 'Knee over toes, heel down, 2-sec hold. LEFT first, +1 set left.', media: DEMO('banded ankle dorsiflexion mobilization') },
    { name: 'Single-leg balance', sets: '3 x 30 sec each', how: 'Eyes open first. When easy, eyes closed.', media: DEMO('single leg balance eyes closed ankle rehab') },
    { name: 'Single-leg calf raise (slow)', sets: '3 x 12', how: '2 sec up, 2 sec down, full range off a step.', media: DEMO('single leg calf raise slow tempo step') },
    { name: 'Band eversion', sets: '3 x 15', how: 'Band around your foot, push the foot OUTWARD against it.', media: DEMO('resistance band ankle eversion') }
  ]},
  { weeks: [4, 6], items: [
    { name: 'Band ankle stretch (loaded)', sets: '3 x 10', how: 'Hold a dumbbell on your knee.', media: DEMO('loaded ankle dorsiflexion mobilization') },
    { name: 'Balance with head turns + ball tosses', sets: '3 x 5 each', how: 'Stand on one leg, turn your head, catch a ball.', media: DEMO('single leg balance perturbation ball toss') },
    { name: 'Weighted single-leg calf raise', sets: '3 x 10', how: 'Hold a dumbbell. Add slant board when ankle bend improves.', media: DEMO('weighted single leg calf raise') },
    { name: 'Band eversion (heavier)', sets: '3 x 15', how: 'Thicker band.' }
  ]},
  { weeks: [7, 9], items: [
    { name: 'Single-leg hop and stick', sets: '3 x 3 each direction', how: 'Forward, sideways, diagonal. Land and freeze 3 sec. Quiet landing.', media: DEMO('single leg hop and stick ankle') },
    { name: 'Heavy calf raise', sets: '3 x 8', how: 'Machine or heavy dumbbell.' },
    { name: 'Balance on foam pad', sets: '3 x 30 sec', how: 'Eyes closed when ready.' }
  ]},
  { weeks: [10, 12], items: [
    { name: 'Side-to-side hops', sets: '3 x 30 sec', how: 'Over a line, quick and quiet.', media: DEMO('lateral line hops ankle') },
    { name: 'Figure-8 hops', sets: '3 x 1 lap each leg', how: 'Around two cones.' },
    { name: 'Cutting drills', sets: '4 x 20 m', how: 'Run, plant, cut. Start at 60% speed.' }
  ]}
];

window.JUMPS = [
  { weeks: [1, 3], contacts: '40-60', items: [
    { name: 'Pogo hops', sets: '2 x 20 sec', how: 'Stiff ankles, bounce off the balls of your feet, quiet.', media: DEMO('pogo hops technique') },
    { name: 'Snap-downs', sets: '3 x 5', how: 'Jump up small, snap into a quarter squat, freeze.', media: DEMO('snap downs landing drill') },
    { name: 'Squat jump + stick', sets: '3 x 3', how: 'Jump, land soft, knees over toes, freeze 2 sec.' },
    { name: 'Low box jump (step down)', sets: '3 x 3', how: 'Knee-height or lower. Always step down.', media: DEMO('box jump technique step down') }
  ]},
  { weeks: [4, 6], contacts: '60-80', items: [
    { name: 'Pogo hops', sets: '3 x 20 sec', how: 'A bit higher.' },
    { name: 'Broad jump + stick', sets: '3 x 3', how: 'Jump forward, land and freeze.', media: DEMO('broad jump stick landing') },
    { name: 'Box jump', sets: '4 x 3', how: 'Higher box. Step down.' },
    { name: 'Lateral line hops', sets: '3 x 15 sec', how: 'Side to side over a line.' }
  ]},
  { weeks: [7, 9], contacts: '80-100', items: [
    { name: 'Drop to stick', sets: '3 x 3', how: 'Step off a 30 cm box, land and freeze.', media: DEMO('drop landing stick') },
    { name: 'Drop jump', sets: '3 x 3', how: 'Step off, land, jump up right away.', media: DEMO('drop jump technique') },
    { name: 'Skater bounds', sets: '3 x 5 per side', how: 'Bound sideways, land on one leg, stick.', media: DEMO('skater bounds stick') },
    { name: 'Single-leg hop + stick', sets: '3 x 3 per leg', how: 'Left first.' }
  ]},
  { weeks: [10, 12], contacts: '~100', items: [
    { name: 'Depth jumps', sets: '4 x 3', how: '30-45 cm box. Short ground contact, jump high.', media: DEMO('depth jump technique') },
    { name: 'Approach vertical jumps', sets: '4 x 3', how: '2-3 step approach, jump and reach high.', media: DEMO('approach vertical jump technique') }
  ]}
];

// ---------- WORKOUTS ----------
// ex: name, sets(number), reps, rest (sec), cues[], swap, media, tag
window.WORKOUTS = {
  1: { key: 'push', title: 'Push', focus: 'Chest, shoulders, triceps + neck/shoulder health',
    warmup: ['5 min bike', 'Band dislocates x15', 'Wall slides x10', 'Scapular push-ups x10', 'Athletic: med-ball chest pass 3 x 5 (max speed)', 'Athletic: rotational scoop toss 3 x 5 per side'],
    ex: [
      { name: 'Machine chest press', sets: 3, reps: '6-8', rest: 180, cues: ['Do one side first on set 1', 'Controlled, full range', 'Stop 1-2 reps before failure'], swap: 'Hammer Strength iso', media: DEMO('machine chest press form') },
      { name: 'High-to-low cable fly', sets: 3, reps: '12-15 (+1 extra set right side)', rest: 90, cues: ['Right side first', 'Control the stretch', 'Last set can go to failure'], swap: 'Pec deck', media: DEMO('high to low cable fly form') },
      { name: 'Seated machine shoulder press', sets: 4, reps: '8-10', rest: 150, cues: ['Stay seated, ribs down', 'Stop 1-2 reps before failure'], swap: 'Smith press', media: DEMO('seated machine shoulder press form') },
      { name: 'Single-arm cable lateral raise', sets: 3, reps: '12-15 each', rest: 60, cues: ['Lead with the elbow', 'Stop at shoulder height', '3 sec down'], swap: 'Lateral raise machine', media: DEMO('single arm cable lateral raise') },
      { name: 'Overhead single-arm cable extension', sets: 4, reps: '10-12 each', rest: 90, cues: ['Elbow points at the ceiling', 'Do not sink past 90 degrees'], swap: '-', media: DEMO('single arm overhead cable tricep extension') },
      { name: 'Single-arm reverse-grip pushdown', sets: 3, reps: '12-15', rest: 60, cues: ['Upper arm stays still'], swap: '-', media: DEMO('single arm reverse grip pushdown') },
      { name: 'Face pull', sets: 3, reps: '15', rest: 60, cues: ['Elbows high', 'Pull to your forehead', 'Rotate hands back'], swap: 'Band pull-aparts', media: DEMO('face pull proper form'), tag: 'NEW' },
      { name: 'Cable crunch', sets: 3, reps: '12-15', rest: 60, cues: ['Curl ribs toward pelvis', 'Add weight over time'], swap: '-', media: DEMO('cable crunch form') }
    ],
    cooldown: ['Doorway pec stretch 30 sec/side', '5 min walk'] },
  2: { key: 'legsA', title: 'Legs A (quads) + ankle + jumps', focus: 'Quads, knees, ankles, springy legs', legs: true,
    warmup: ['Backwards incline treadmill walk 5-8 min', 'ANKLE BLOCK (see below)', 'JUMP BLOCK (see below)'],
    ex: [
      { name: 'Hack squat (heels elevated)', sets: 4, reps: '6-8', rest: 180, cues: ['Only go as deep as you can BEFORE your pelvis tucks (that tuck = your back pain)', 'Brace hard, 3 sec down', 'Add depth as your ankles improve'], swap: 'Pendulum / heel-elevated goblet squat', media: DEMO('hack squat form heels elevated'), film: true },
      { name: 'Leg press', sets: 3, reps: '10-12', rest: 150, cues: ['Stop the instant your pelvis tucks'], swap: '-', media: DEMO('leg press form pelvis tuck') },
      { name: 'Bulgarian split squat', sets: 3, reps: '8-10 each', rest: 120, cues: ['LEFT leg first', 'Knee travels over toes', 'Torso slightly forward'], swap: 'Slant-board split squat', media: DEMO('bulgarian split squat form knee over toe') },
      { name: 'Peterson step-down', sets: 2, reps: '10 each', rest: 60, cues: ['Low step', 'Working heel stays down', 'Knee slides forward over toes', 'Lower the other heel slowly'], swap: '-', media: DEMO('peterson step down exercise'), tag: 'NEW' },
      { name: 'Leg extension', sets: 3, reps: '12-15', rest: 90, cues: ['1 sec squeeze at top', '3 sec down'], swap: '-', media: DEMO('leg extension form') },
      { name: 'Seated leg curl', sets: 3, reps: '10-12', rest: 90, cues: ['Seated, not lying'], swap: '-', media: DEMO('seated leg curl form') },
      { name: 'Standing calf raise', sets: 4, reps: '8-10', rest: 90, cues: ['Full stretch', '2 sec pause at the bottom', 'No bouncing'], swap: '-', media: DEMO('standing calf raise full range pause') },
      { name: 'Tibialis raise', sets: 2, reps: '15-20', rest: 60, cues: ['Back on a wall, heels out', 'Lift your toes up'], swap: '-', media: DEMO('tibialis raise wall'), tag: 'NEW' },
      { name: 'Hanging leg raise', sets: 3, reps: '10-12', rest: 60, cues: ['Curl your pelvis up', 'No swinging'], swap: '-', media: DEMO('hanging leg raise form') }
    ],
    cooldown: ['Deep squat hold 60 sec (heels on a plate)', 'Couch stretch 30 sec/side', 'Calf stretch on a step', '5 min walk'] },
  3: { key: 'pull', title: 'Pull', focus: 'Back, biceps, posture',
    warmup: ['5 min bike', 'Band pull-aparts x20', 'Scapular pull-ups x10', 'Athletic: med-ball shot-put throw 3 x 5 per side'],
    ex: [
      { name: 'T-bar / chest-supported row', sets: 4, reps: '8-10', rest: 150, cues: ['Neutral or overhand grip', 'Pull to lower ribs', 'Chest stays on the pad'], swap: '-', media: DEMO('chest supported t bar row form') },
      { name: 'Lat pulldown', sets: 3, reps: '8-10', rest: 150, cues: ['Lean back ~15 degrees', 'Full stretch at the top'], swap: 'Pull-ups', media: DEMO('lat pulldown form neutral grip') },
      { name: 'Smith bent-over row', sets: 3, reps: '10-12', rest: 120, cues: ['Straps', 'Flat back'], swap: '-', media: DEMO('smith machine bent over row') },
      { name: 'Shrug', sets: 3, reps: '10-12', rest: 90, cues: ['Straight up', '1 sec pause', 'No rolling'], swap: '-', media: DEMO('machine shrug form') },
      { name: 'Back extension', sets: 3, reps: '12', rest: 90, cues: ['Round a little at the bottom', 'Stop at straight, never past'], swap: '-', media: DEMO('45 degree back extension form'), tag: 'NEW' },
      { name: 'Face pull', sets: 3, reps: '15', rest: 60, cues: ['Elbows high', 'Rotate back'], swap: '-', media: DEMO('face pull proper form') },
      { name: 'Incline dumbbell curl', sets: 3, reps: '10-12', rest: 90, cues: ['Arms hang behind you', 'Elbows still'], swap: '-', media: DEMO('incline dumbbell curl form') },
      { name: 'Preacher curl', sets: 3, reps: '10-12', rest: 90, cues: ['Armpits on the pad', 'Stop short of lockout'], swap: '-', media: DEMO('preacher curl form') },
      { name: 'Hammer curl', sets: 2, reps: '12-15', rest: 60, cues: ['Slow lowering'], swap: '-', media: DEMO('hammer curl form') },
      { name: 'Dead hang', sets: 2, reps: '30-45 sec', rest: 60, cues: ['Relax your shoulders, breathe'], swap: '-', media: DEMO('dead hang benefits form'), tag: 'NEW' }
    ],
    cooldown: ['Lat stretch on a rack', 'Doorway pec stretch', '5 min walk'] },
  4: { key: 'legsB', title: 'Legs B (hamstrings/glutes) + ankle + jumps', focus: 'Hamstrings, glutes, groin, sprint-proof legs', legs: true,
    warmup: ['Backwards incline treadmill walk 5-8 min', 'ANKLE BLOCK (see below)', 'JUMP BLOCK (see below)'],
    ex: [
      { name: 'Romanian deadlift', sets: 4, reps: '8-10', rest: 180, cues: ['Hips back, soft knees', 'Flat back; stop where it wants to round', 'Stop 2 reps before failure'], swap: 'Dumbbell RDL', media: DEMO('romanian deadlift form'), film: true },
      { name: 'Nordic curl', sets: 2, reps: '4-6', rest: 120, cues: ['GHD or Nordic bench', 'Lower as SLOW as you can', 'Push back up with your hands'], swap: 'Band-assisted Nordic', media: DEMO('nordic hamstring curl beginner'), tag: 'NEW' },
      { name: 'Seated leg curl', sets: 3, reps: '10-12', rest: 90, cues: ['Seated, not lying'], swap: '-', media: DEMO('seated leg curl form') },
      { name: 'Hip thrust', sets: 3, reps: '8-10', rest: 150, cues: ['Ribs down', 'Squeeze 1 sec', 'No arching at the top'], swap: 'Machine', media: DEMO('hip thrust form ribs down') },
      { name: '45-degree back extension', sets: 2, reps: '12-15', rest: 90, cues: ['Stop at straight'], swap: '-', media: DEMO('45 degree back extension form') },
      { name: 'Copenhagen plank', sets: 2, reps: '15-20 sec each', rest: 60, cues: ['Start with KNEE on the bench (short lever)'], swap: '-', media: DEMO('copenhagen plank short lever'), tag: 'NEW' },
      { name: 'Standing calf raise', sets: 3, reps: '12-15', rest: 90, cues: ['Full stretch, controlled'], swap: '-', media: DEMO('standing calf raise full range pause') },
      { name: 'Sled push (finisher)', sets: 4, reps: '20 m', rest: 90, cues: ['Low body angle', 'Drive through the balls of your feet'], swap: 'Backwards sled drag', media: DEMO('sled push technique'), tag: 'NEW' }
    ],
    cooldown: ['Hamstring stretch 30 sec/side', 'Couch stretch 30 sec/side', '5 min walk'] },
  5: { key: 'upper', title: 'Upper + core', focus: 'Arms, traps, core. Bike intervals at 5 PM.',
    warmup: ['5 min bike', 'Band pull-aparts x20', 'Dislocates x15', 'Wall slides x10', 'Light med-ball throws'],
    ex: [
      { name: 'Overhead single-arm cable extension', sets: 4, reps: '10-12 each', rest: 90, cues: ['Elbow points at ceiling'], swap: '-', media: DEMO('single arm overhead cable tricep extension') },
      { name: 'Machine / Smith shrug', sets: 4, reps: '10-12', rest: 90, cues: ['1 sec pause, slow stretch'], swap: '-', media: DEMO('machine shrug form') },
      { name: 'Incline dumbbell curl', sets: 3, reps: '10-12', rest: 90, cues: ['Arms hang behind you'], swap: '-', media: DEMO('incline dumbbell curl form') },
      { name: 'Single-arm reverse-grip pushdown', sets: 3, reps: '12-15', rest: 90, cues: ['Upper arm still'], swap: '-', media: DEMO('single arm reverse grip pushdown') },
      { name: 'Preacher curl', sets: 3, reps: '10-12', rest: 90, cues: ['Armpits on pad'], swap: '-', media: DEMO('preacher curl form') },
      { name: 'Single-arm cable lateral raise', sets: 3, reps: '12-15 each', rest: 60, cues: ['Lead with elbow'], swap: '-', media: DEMO('single arm cable lateral raise') },
      { name: 'Chest-supported / T-bar row', sets: 3, reps: '10-12', rest: 120, cues: ['Lighter than Wednesday'], swap: '-', media: DEMO('chest supported t bar row form') },
      { name: 'High-to-low cable fly', sets: 2, reps: '12-15 (+1 right)', rest: 90, cues: ['Right side first'], swap: 'Pec deck', media: DEMO('high to low cable fly form') },
      { name: 'CORE: L-sit hold', sets: 2, reps: '15-20 sec', rest: 45, cues: ['Dip bars, tuck knees if needed'], swap: '-', media: DEMO('l sit hold dip bars beginner'), tag: 'CORE' },
      { name: 'CORE: Straight-leg hanging raise', sets: 2, reps: '8-10', rest: 45, cues: ['No swinging, straight legs'], swap: '-', media: DEMO('straight leg hanging leg raise'), tag: 'CORE' },
      { name: 'CORE: Banded front fold', sets: 2, reps: '15-20', rest: 45, cues: ['Lying down, band anchored overhead', 'Pull into a V-up'], swap: '-', media: DEMO('banded v up core exercise'), tag: 'CORE' },
      { name: 'CORE: Suitcase carry', sets: 2, reps: '30 m each side', rest: 45, cues: ['Stand tall, do not lean'], swap: '-', media: DEMO('suitcase carry form'), tag: 'CORE' }
    ],
    cooldown: ['5 PM: Bike intervals: 5 min easy, then 8 x (30 sec hard / 90 sec easy), then 5 min easy. (Weeks 10-12: 6 x 20 m sprint starts instead.)'] },
  6: { key: 'sat', title: 'Saturday: Pilates + long walk', rest: true,
    items: ['Reformer Pilates (5 PM)', 'Long walk 45-60 min', 'Morning routine + floor snacks as usual'] },
  0: { key: 'sun', title: 'Sunday: Recovery + check-in', rest: true,
    items: ['Floor reset (8 min)', 'Walk', 'Sauna (optional)', 'Front progress photo (same light, same spot)', 'Weekly check-in in the Progress tab'] }
};

// ---------- ALWAYS-ON RULES (not scheduled, just remember) ----------
window.RULES = [
  { t: 'Move every 45-60 min', d: 'If you have been sitting about an hour: 10 squats, couch stretch, chin tucks, open books. 2 minutes.' },
  { t: '10-12k steps', d: 'Walk after meals, take calls standing or walking, take the stairs.' },
  { t: 'Pain rule: 3 out of 10 max', d: 'OK if it is gone by the next morning. Worse next morning? Cut that exercise 20-30% for 2-3 days. Sharp pain = stop or swap.' },
  { t: 'Pick a team at every meal', d: 'Protein + Sweet (rice, fruit, honey, oats) OR protein + Rich (steak, salmon, oil, avocado). Never both together.' },
  { t: 'Coffee: 1 hr after waking, none after 2 PM', d: 'Salted water before coffee.' },
  { t: 'Salt: steady every day', d: 'Pinch in morning water. Avoid big salty takeout the night before you want to look sharp.' },
  { t: 'Left side first', d: 'On every single-leg or single-arm exercise. Extra set on the left ankle work.' },
  { t: 'Chew both sides, phone at eye level', d: 'Symmetry habits. Sleep on your back or switch sides.' },
  { t: 'Weekend drinks: 1 night, 3-4 max', d: 'Protein meal first, water between drinks, count it. No sauna that night, no heavy legs next day.' },
  { t: 'Stressed? Physiological sigh', d: 'Two breaths in through the nose, one long breath out. 1-2 min.' }
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

// ---------- TESTS ----------
window.TESTS = [
  { id: 'k2w_l', name: 'Knee-to-wall LEFT (cm)', how: 'Face a wall, heel down, slide your foot back until your knee just touches. Measure toe to wall.', target: '10+ cm, less than 2 cm difference L vs R', media: DEMO('knee to wall test ankle dorsiflexion') },
  { id: 'k2w_r', name: 'Knee-to-wall RIGHT (cm)', how: 'Same on the right.', target: '10+ cm' },
  { id: 'calf_l', name: 'Single-leg calf raises LEFT (reps)', how: 'Full height, 1 rep every 2 sec, until you cannot.', target: '25+' },
  { id: 'calf_r', name: 'Single-leg calf raises RIGHT (reps)', how: 'Same.', target: '25+' },
  { id: 'bal_l', name: 'Eyes-closed balance LEFT (sec)', how: 'Hands on hips, firm floor.', target: '20-30 sec' },
  { id: 'bal_r', name: 'Eyes-closed balance RIGHT (sec)', how: 'Same.', target: '20-30 sec' },
  { id: 'sp_l', name: 'Side plank LEFT (sec)', how: 'To failure.', target: 'Sides within ~5%' },
  { id: 'sp_r', name: 'Side plank RIGHT (sec)', how: 'To failure.', target: 'Sides within ~5%' },
  { id: 'vj', name: 'Vertical jump (inches)', how: 'Chalk on fingers. Reach high and mark. Jump and mark. Measure the gap.', target: 'Goes up by week 12' }
];
window.FILMS = [
  { id: 'f_squat_side', name: 'Bodyweight squat, side view', how: 'Phone at hip height, 3 m away. 5 slow reps.' },
  { id: 'f_squat_front', name: 'Bodyweight squat, front view', how: 'Same, from the front.' },
  { id: 'f_walk', name: '10-step walk (side + behind)', how: 'Barefoot, slow-mo if you can.' },
  { id: 'f_sls', name: 'Single-leg squat x5 each (front)', how: 'Look for knee caving in.' },
  { id: 'f_photos', name: 'Photos: front, side, back', how: 'Shirt off, same light and spot.' }
];
