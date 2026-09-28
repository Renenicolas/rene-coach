// Short-form education. Each lesson = a few swipe cards + optional deep-dive doc.
window.LESSONS = [
  { id: 'start', group: 'Start here', title: 'The whole plan in 1 minute', min: 1, cards: [
    { h: 'Your goal', b: '1) Look built: lose fat, keep or add muscle, even out your body.\n2) Be athletic: jump high, springy legs.\n3) No pain.\n4) Energy all day.' },
    { h: 'Why you hurt', b: 'Stiff ankles (left worst) make your low back, knees and hips do extra work. Sitting makes you stiff in the morning. So we fix the ankles first.' },
    { h: 'What you do', b: 'Every day: sun walk, 12-min morning routine, steps, floor snacks, evening release, sleep.\nMon-Fri: lift.\nSat: Pilates + walk. Sun: recovery + check-in.' },
    { h: '12 weeks, 3 phases', b: 'Weeks 1-4 UNLOCK: ankles, hips, balance.\nWeeks 5-8 LOAD: make it strong.\nWeeks 9-12 SPEED: jumps, sprints, cutting.' },
    { h: 'The one rule', b: 'Pain up to 3 out of 10 is OK if it is gone by morning. More than that: back off 20-30%.' }
  ], deep: 'plan' },

  { id: 'rewire', group: 'Movement', title: 'How you rewire your body', min: 2, cards: [
    { h: 'Borrowed motion', b: 'When a joint is stuck, your body borrows motion from the next joint. Stiff ankle -> knee and low back take the load. That is where pain shows up.' },
    { h: 'Step 1: Unlock', b: 'Get lost motion back. Ankle band stretch, rocking, 90/90 hips. (Morning routine.)' },
    { h: 'Step 2: Teach', b: 'Practice the new position slowly so your brain learns it. Balance, holds, step-downs, slow calf raises.' },
    { h: 'Step 3: Load', b: 'Make it strong. Your lifts, with the right depth, Nordics, sled.' },
    { h: 'Step 4: Speed', b: 'Make it automatic when fast. Hops -> jumps -> sprints -> cutting.' },
    { h: 'Why most people fail', b: 'They skip steps 1 and 2 and go straight to heavy lifting or sports. The pain keeps coming back. You are doing all 4, in order.' }
  ], deep: 'course' },

  { id: 'timeline', group: 'Movement', title: 'How long it takes', min: 1, cards: [
    { h: 'Weeks 1-2', b: 'You feel looser. Morning stiffness drops. (Your nervous system relaxes.)' },
    { h: 'Weeks 3-6', b: 'Knee-to-wall goes up a few cm. Balance improves. You squat deeper before your pelvis tucks.' },
    { h: 'Weeks 6-12', b: 'Landings get clean without thinking. Jumping feels springy. Pain drops a lot.' },
    { h: 'Months 3-6', b: 'Tendons and ligaments get truly stronger. New movement is your default.' },
    { h: 'Fat loss', b: 'About 0.75 lb a week, around 9 lb by week 12. Your face usually looks leaner after 5-8 lb.' }
  ]},

  { id: 'watch', group: 'Movement', title: 'What to watch each week', min: 1, cards: [
    { h: 'Knee-to-wall (cm)', b: 'Should go up every 2-3 weeks, especially LEFT.' },
    { h: 'Squat depth', b: 'How deep before your pelvis tucks. Should get deeper.' },
    { h: 'Morning stiffness', b: 'Minutes + how bad (0-10). Should shrink.' },
    { h: 'Landings on video', b: 'Quiet, knees NOT caving in.' },
    { h: 'Weight', b: '7-day average, not the daily number.' }
  ]},

  { id: 'goata', group: 'The coaches', title: 'GOATA in plain words', min: 3, cards: [
    { h: 'What it is', b: 'A movement system (Gary Scheffler + Ricky Stanzi) built from slow-motion video of athletes and kids. Tripp sells their "Recode" program.' },
    { h: '"Hips back, head forward"', b: 'Athletic stance. Sit back into glutes and hamstrings instead of leaning on knees and low back. KEEP.' },
    { h: '"Don\'t collapse the arch"', b: 'Big toe down, arch up when you land. KEEP.' },
    { h: '"The bow"', b: 'When you land, your knee points out over your little toes, never caving in. KEEP. Best-proven idea (prevents ACL tears).' },
    { h: '"Inside ankle bone high"', b: 'Weight on the outside edge of the foot. ONLY in slow drills. For your old ankle injuries it is close to how you roll an ankle.' },
    { h: 'What NOT to believe', b: '"Never lift heavy", "feet dead straight always", "walk on light heels". Not supported. Lifting protects athletes.' },
    { h: 'Bottom line', b: 'Good drills + good cues, oversold theory. Nobody has studied GOATA as a system. You get all of it free in this app.' }
  ], deep: 'goata' },

  { id: 'floor', group: 'Movement', title: 'Sitting + resting like GOATA', min: 2, cards: [
    { h: 'Chairs are the problem', b: 'In a chair your hips sit in front of your ribs for hours. Your body learns the slump.' },
    { h: 'The ground is a free foam roller', b: 'Sitting on the floor presses your hips, calves and back. You get uncomfortable in 3-10 min and shift. That shifting = moving all day.' },
    { h: '"The next shape is the best shape"', b: 'Rotate: criss-cross -> seiza -> all-fours -> deep squat. 1-2 min each.', img: 'img/01-seiza.jpg' },
    { h: 'Upright fetal', b: 'The "fetal position" is a SITTING position (half seiza), not a sleep position.', img: 'img/04-upright-fetal-half-seiza.jpg' },
    { h: 'Big rule', b: 'Do not slam into positions you are not ready for. Start with 10 min bouts. Towel under ankles. Feet point straight back.' },
    { h: 'Skip this one', b: 'Mucci\'s toes-in squat loads your ankle the way it got hurt.', img: 'img/12-mucci-toes-in-squat-SKIP.jpg' }
  ]},

  { id: 'lifting', group: 'Movement', title: 'Why you keep lifting', min: 1, cards: [
    { h: 'Lifting protects you', b: 'Strength training cut sports injuries to under a third in big studies. Stretching alone did nothing.' },
    { h: 'Tall-lifter rule', b: 'At 6\'4" your torso leans more in squats. Normal. Hack, pendulum, heel-elevated and split squats suit you.' },
    { h: 'Your squat fix', b: 'Go only as deep as you can before your pelvis tucks. That tuck is your low back pain. Depth comes back as ankles open.' },
    { h: 'Mitchell\'s summary', b: '"Only three things really move the needle: caloric deficit, hitting your protein and lifting heavy."' }
  ]},

  { id: 'metab', group: 'Food + metabolism', title: 'What metabolism really is', min: 2, cards: [
    { h: '4 buckets', b: 'Resting burn ~2,000\nDaily movement 300-900 (biggest lever!)\nWorkouts ~250-400\nDigestion ~250\nTotal ~3,000-3,400 a day.' },
    { h: 'Fast metabolism =', b: 'More muscle + more daily movement. No magic switch.' },
    { h: 'Your 5 levers', b: '1 Steps\n2 Muscle\n3 Protein (burns 20-30% of its calories to digest)\n4 No crash diets\n5 Sleep + low stress' }
  ]},

  { id: 'tripp', group: 'The coaches', title: 'Tripp\'s metabolism idea', min: 3, cards: [
    { h: 'His theory', b: 'Scared body (crash diets, fasting, low carb, tons of cardio) = stores fat. Safe body (lots of easy fuel) = burns fat. "More fuel, bigger fire."' },
    { h: 'True part', b: 'Hard dieting makes your body fight back: you move less without noticing and burn 100-300 fewer calories. That is why your cut is moderate.' },
    { h: 'Sugar in the day', b: 'His reason: fills your liver so stress hormones stay low, helps thyroid. Verdict: athletes need carbs, but you get them from rice, oats, fruit. No Coke needed.' },
    { h: 'Protein only at dinner', b: 'His reason: a hormone called FGF21 rises with low protein. Verdict: BAD trade for you. Less protein = less muscle, and muscle is your metabolism engine.' },
    { h: 'No fish oil', b: 'His reason: "unstable fats" hurt cells. Verdict: mostly theory. Fish oil is safe. Your 1 softgel is fine, or eat salmon 2x a week.' },
    { h: 'What we keep', b: 'Eat enough, no crash diets, carbs around training, fruit is fine, collagen/broth, sun, walk after meals.' },
    { h: 'Too-hard check', b: 'Cold hands + low energy + worse sleep + lifts dropping 2 weeks = eat 100-200 more calories.' }
  ], deep: 'ebook' },

  { id: 'team', group: 'Food + metabolism', title: 'Pick a team (fat vs sugar)', min: 1, cards: [
    { h: 'The rule', b: 'Every meal has a protein. Then pick ONE team:\nTeam Sweet: rice, fruit, honey, oats, potatoes.\nTeam Rich: steak, salmon, oil, butter, avocado, cheese, nuts.\nThe two teams don\'t play together.' },
    { h: 'Pick by the protein', b: 'Lean protein (chicken, shrimp, cod) -> Team Sweet, dessert OK.\nFatty protein (steak, salmon) -> Team Rich, no dessert.' },
    { h: 'Why it works', b: 'Not magic. Sweet + fatty together (donuts, pizza, ice cream after steak) is the easiest food to overeat. Keep them apart and you eat less junk without trying.' }
  ]},

  { id: 'salt', group: 'Food + metabolism', title: 'Salt, puffiness, lean face', min: 2, cards: [
    { h: 'Morning salt = good', b: 'You lose water and minerals overnight. A pinch in your water just tops you back up.' },
    { h: 'Salty dinner = puffy', b: 'A big salt spike (takeout, fries) + carbs + drinks = your body holds water. You wake up puffy.' },
    { h: 'The rule', b: 'Keep salt steady every day. Eat potassium (fruit, potatoes, greens). Zero salt backfires.' },
    { h: 'Hollow cheeks come from', b: '1 Lower body fat (the cut)\n2 No salt spikes\n3 Less alcohol\n4 7.5+ hrs sleep\n5 Chin tucked, not forward. No supplement does it.' },
    { h: 'debloat+ / GLP-1 powders', b: 'Fiber + probiotics. Helps belly bloat, not face water. ~$70/month. Skip. You get fiber from food.' }
  ]},

  { id: 'mitchell', group: 'The coaches', title: 'Mitchell Saron\'s best lessons', min: 3, cards: [
    { h: 'Who', b: 'Harvard, 2024 Olympic fencer, runs Kaya. Much of his 2026 content is sarcasm, by his own admission.' },
    { h: 'His biggest change', b: 'Cutting alcohol. "My next tournament I did pretty well." Plus a friend group chat for accountability.' },
    { h: 'The needle movers', b: 'Calorie deficit, protein, lifting heavy. Plus morning sun, 10-15k steps, dark room at night.' },
    { h: 'The binge math', b: 'A 10,000-calorie day added only ~1-1.3 lb of real fat. The scale jumps 5-12 lb from water. Next day: lift, walk, back to normal.' },
    { h: 'After a trip', b: '"The scale and mirror lie that first week." 100 g carbs holds ~400 g water. No crash diet.' },
    { h: 'Stress = injuries', b: 'Olympic year: perfect diet, still injuries + acne. Both cleared when pressure dropped. Treat stress like training load.' },
    { h: 'Ito-san', b: 'A super healthy old man in Japan with zero protocols: "don\'t over-indulge." Mitchell: "health is a lot more simple than we make it."' }
  ], deep: 'mitchell' },

  { id: 'travel', group: 'The coaches', title: 'Mitchell\'s travel rules', min: 1, cards: [
    { h: 'Flying', b: 'Don\'t eat on the plane. Sun + walk as soon as you land. Electrolytes.' },
    { h: 'On the road', b: '10-20k steps. A quick lift to "use the fuel". Green tea before deciding if you\'re hungry.' },
    { h: 'Eating out', b: 'Ask: no oil? no sugar? sauce on the side? Have the treat first, then stop.' },
    { h: 'Mindset', b: '"Presence > perfection." Rest. Enjoy it.' }
  ]},

  { id: 'sleep', group: 'Recovery', title: 'Sun, sleep, breathing', min: 2, cards: [
    { h: 'Morning sun', b: '5-20 min outside within 30 min of waking, no sunglasses, even if cloudy. Sets your body clock.' },
    { h: 'Night', b: 'Dim warm lights after sunset. Screens off 9:30. Room cool and pitch black. Phone out of the bedroom.' },
    { h: 'Sleep position', b: 'Back or side are fine. Back is best for face symmetry. GOATA gives no sleep advice.' },
    { h: 'Physiological sigh', b: '2 breaths in (nose), 1 long breath out. 1-2 min. Beat meditation for mood in a Stanford study.' },
    { h: '2-2-4 breathing', b: 'In 2, hold 2, out 4, through the nose. 5 min in bed.' }
  ], deep: 'breath' },

  { id: 'fascia', group: 'Recovery', title: 'Fascia, face + symmetry', min: 1, cards: [
    { h: 'Release = temporary', b: 'Foam rolling and face massage calm muscles and move fluid for a few hours. They do NOT permanently reshape fascia.' },
    { h: 'Morning face', b: '2 min of gua sha / massage can reduce puffiness for the day.' },
    { h: 'Real symmetry fix', b: 'Weak side first + extra sets (left leg). Chew both sides. Sleep on your back. Phone at eye level. Switch bag shoulder.' }
  ]},

  { id: 'supps', group: 'Food + metabolism', title: 'Supplements', min: 1, cards: [
    { h: 'Your stack is enough', b: 'Creatine, magnesium, glycine, omega-3, collagen, whey, greens, ashwagandha, beta-alanine, citrulline, theanine, electrolytes. Add nothing for the cut.' },
    { h: 'One tweak', b: 'Collagen 30-60 min before ankle/tendon work with some vitamin C (kiwi or orange).' },
    { h: 'Skip list', b: 'Raw milk/meat, 72-hr fasts, mega vitamin D, methylene blue, stem-cell clinics, "deuterium", "fabric frequency", ivermectin/chlorine dioxide for colds.' }
  ]},

  { id: 'pain', group: 'Recovery', title: 'Pain rules + red flags', min: 1, cards: [
    { h: '0-2 out of 10', b: 'Keep going.' },
    { h: '3 out of 10', b: 'OK only if it\'s gone by next morning.' },
    { h: 'More than 3 / worse next morning', b: 'Cut that exercise 20-30% (weight, depth or jumps). Recheck in 2-3 days.' },
    { h: 'See a doctor', b: 'Ankle catches, locks, gives way or keeps swelling. Back pain that wakes you at night. Heel pain. Morning stiffness over 45 min. Ask for a CRP blood test either way.' }
  ]}
];

window.LIBRARY = [
  { id: 'plan', title: 'Your 12-week plan (full)', file: 'md/plan.md' },
  { id: 'course', title: 'Coach Course (9 lessons, full)', file: 'md/course.md' },
  { id: 'goata', title: 'GOATA method (deep dive)', file: 'md/goata.md' },
  { id: 'tripp', title: 'Tripp: every video, drills, routines', file: 'md/tripp.md' },
  { id: 'ebook', title: "Tripp's ebook (summary)", file: 'md/ebook.md' },
  { id: 'mitchell', title: 'Mitchell Saron (Instagram/TikTok)', file: 'md/mitchell.md' },
  { id: 'mitchell2', title: 'Mitchell: podcasts + extra finds', file: 'md/mitchell2.md' },
  { id: 'kaya', title: 'Kaya community report', file: 'md/kaya.md' },
  { id: 'breath', title: 'Kaya breathwork + non-toxic guide', file: 'md/breath.md' },
  { id: 'evidence', title: 'Evidence: ankles, pain, athletic lifting', file: 'md/evidence.md' },
  { id: 'bio', title: 'Evidence: metabolism / bioenergetics', file: 'md/bio.md' }
];
