// Short-form education. Each lesson = a few swipe cards + optional deep-dive doc.
window.LESSONS = [
  { id: 'start', group: 'Start here', title: 'The whole plan in 1 minute', min: 1, cards: [
    { h: 'Your goal', b: '1) Look built: lose fat, keep or add muscle, even out your body.\n2) Be athletic: jump high, springy legs.\n3) No pain.\n4) Energy all day.' },
    { h: 'Why you hurt', b: 'Stiff ankles (left worst) make your low back, knees and hips do extra work. Sitting makes you stiff in the morning. So we fix the ankles first.' },
    { h: 'What you do', b: 'Every day: weigh in, sun walk, 7-min morning routine, steps, floor snacks, 10-min wind-down, sleep.\nMon-Fri: gym, about 1:30 (lift + stretch + sauna).\nSat: morning Pilates + walk. Sun: floor reset, sauna + cold plunge, check-in.' },
    { h: '12 weeks, 3 phases', b: 'Weeks 1-4 UNLOCK: ankles, hips, balance.\nWeeks 5-8 LOAD: make it strong.\nWeeks 9-12 SPEED: jumps, sprints, cutting.' },
    { h: 'The one rule', b: 'Pain up to 3 out of 10 is OK if it is gone by morning. More than that: back off 20-30%.' }
  ], deep: 'plan' },

  { id: 'gymday', group: 'Start here', title: 'Your 1:30 gym day', min: 1, cards: [
    { h: 'The shape', b: 'Warm-up ~5-10 min → lift ~45-55 min → stretch + foam roll ~10-15 min → sauna 15 min. About 1:30 total. Friday adds 20 min of bike before the stretch, so Friday lifting is shorter.' },
    { h: 'Why lift first, sauna last', b: 'You lift fresh. The sauna at the end relaxes you and does not hurt muscle growth. You can do easy stretches inside the sauna.' },
    { h: 'Leg days', b: 'Jumps go at the START (you are fresh, landings are safer). Ankle work goes at the END with the stretch.' },
    { h: 'Why fewer exercises now', b: 'To fit an hour, I cut repeats: face pulls once a week, rows mostly on Wednesday, one back extension. Every muscle still gets hit about twice a week.' },
    { h: 'Follow along', b: 'Every warm-up, stretch and sauna block has a ▶ button. It plays the video, runs the timer and moves to the next thing.' }
  ]},
  { id: 'missed', group: 'Start here', title: 'Missed a day?', min: 1, cards: [
    { h: 'Missed 1 workout', b: 'Do it the next day. Everything slides one day. Saturday can become a lift day (move Pilates to Sunday).' },
    { h: 'Missed 2 or more', b: 'Drop Friday\'s Upper day first (arms get hit Monday and Wednesday too). Never do two leg days in a row.' },
    { h: 'Missed a whole week', b: 'Repeat that week. Don\'t jump ahead to harder jumps or ankle work.' },
    { h: 'Missed the morning routine', b: 'Do it any time that day. If the day is gone, skip it. Never double up.' },
    { h: 'Sick', b: 'Walk only. Come back to the next workout in order. The Gym tab shows what you missed and what to do.' }
  ]},
  { id: 'whyex', group: 'Movement', title: 'Why each exercise is there', min: 3, cards: [
    { h: 'Your base', b: 'Most lifts are straight from your Superpower plan: chest press, shoulder press, flies, laterals, triceps, hack squat, split squat, leg extension/curl, calves, rows, pulldown, shrugs, curls, RDL, hip thrust.' },
    { h: 'From Tripp', b: 'The whole morning routine (his 5-min reel, cut into moves), the crawl in your warm-up, legs-up breathing, floor snacks, floor reset, pick-a-team food, morning salt.' },
    { h: 'From GOATA', b: 'Floor sitting (criss-cross, seiza, upright fetal), moving every hour. Their toes-in positions are NOT used because of your ankle history.' },
    { h: 'From Mitchell / Mucci / Kaya', b: 'Knees-over-toes style work (Peterson step-downs, tib raises, sled, backwards walking), seiza, dead hangs, face release, breathwork.' },
    { h: 'Added because research says so', b: 'Nordics (half the hamstring injuries), Copenhagen plank (40% fewer groin injuries), balance work (fewer re-sprains), back extensions (low-back pain), face pulls (shoulders), jumps (vertical).' },
    { h: 'Face pulls, in one line', b: 'You press a lot. Face pulls train the back of your shoulders so they stay pulled back and your neck/shoulder pain calms down. Once a week, 6 minutes.' }
  ], deep: 'evidence' },
  { id: 'waist', group: 'Movement', title: 'A smaller waist, not a blocky one', min: 1, cards: [
    { h: 'What makes a waist small', b: 'Mostly losing belly fat, plus wider shoulders and lats (the V-taper). Your bones set the rest.' },
    { h: 'What I removed', b: 'Suitcase carries (walking with a heavy dumbbell in one hand) and banded side work. Heavy side loading is what can thicken your sides.' },
    { h: 'What you do', b: 'Front abs only: cable crunch (Mon), ab wheel + stomach vacuum (Fri). Laterals and pulldowns build the V.' },
    { h: 'Copenhagen plank?', b: 'It looks like a side plank but it trains your GROIN (inner thigh). It is there for your hip/groin pain, not your obliques.' },
    { h: 'Side plank test', b: 'Only a 2-minute test at weeks 0, 6, 12 to compare left vs right. Not training. Won\'t change your waist.' }
  ]},
  { id: 'heat', group: 'Recovery', title: 'Sauna + cold plunge', min: 1, cards: [
    { h: 'Sauna after every lift', b: '15 min. Good for your heart, relaxing, fine for muscle growth. Drink water + Hydrate. Skip it on a drinking night.' },
    { h: 'Cold plunge on Sunday: yes', b: 'Good call. Cold water right after lifting can shrink muscle gains (studies show smaller gains). Sunday has no lift, so it is the right day.' },
    { h: 'How', b: 'Sauna 12-15 min → plunge 1-3 min at 50-59°F → repeat once. End on cold. Start with 1 minute.' },
    { h: 'What it does', b: 'Mood, alertness and it feels great. It does NOT melt fat in any meaningful way.' }
  ]},
  { id: 'films', group: 'Progress', title: 'Filming: what, when, where', min: 2, cards: [
    { h: 'Where', b: 'One album in your iPhone Photos called "12-Week Films". Photos → Albums → + → New Album.' },
    { h: 'When', b: 'Test days (weeks 0, 6, 12): 4 short videos + photos.\nOdd weeks (1, 3, 5, 7, 9, 11): Tuesday and Thursday, 2 clips each.\nSundays: 1 front photo inside the app.' },
    { h: 'What', b: 'Tuesday: 1 set of hack squats from the side + 1 set of jumps from the front.\nThursday: 1 set of RDLs from the side + 1 set of jumps from the front.\nPhone on the floor, 3 m away, 10-15 seconds.' },
    { h: 'What to do with it', b: 'Watch once right away. The Gym tab shows 3 things to check. Tap "Looks good" or write one fix. Add it to the album. Delete extra takes.' },
    { h: 'Why', b: 'You cannot see your pelvis tuck or knees cave while lifting. A 10-second clip shows it. Week 1 vs week 11 side by side is the best proof you improved.' },
    { h: 'Skipped?', b: 'Film at your next leg day. Missed a whole film week? Skip it. No catching up.' }
  ]},
  { id: 'autofill', group: 'Progress', title: 'Weigh-ins: why + how', min: 1, cards: [
    { h: 'Why', b: 'Your weight jumps 1-3 lb a day from water and salt. The 7-day average shows the real trend. The Sunday check-in uses it to adjust your calories.' },
    { h: 'How', b: 'Any scale. Morning, after the bathroom, before food. Type it in the Weigh-in box on Today. 5 seconds.' },
    { h: 'Missed some?', b: '4-5 weigh-ins a week is enough.' },
    { h: 'Hume?', b: 'Optional. It adds body fat %, which home scales guess badly. Not needed for this plan.' }
  ]},

  { id: 'rewire', group: 'Movement', title: 'How you rewire your body', min: 2, cards: [
    { h: 'Borrowed motion', b: 'When a joint is stuck, your body borrows motion from the next joint. Stiff ankle -> knee and low back take the load. That is where pain shows up.' },
    { h: 'Step 1: Unlock', b: 'Get lost motion back. Rocking, pigeon, knee-to-wall ankle rocks. (Morning routine.)' },
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
    { h: 'Release = temporary', b: 'Foam rolling (at the gym) and face massage (at night) calm muscles and move fluid for a few hours. They do NOT permanently reshape fascia.' },
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
  { id: 'course', title: 'The full course (9 lessons)', file: 'md/course.md' },
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

// The all-day rules live here now (Today only shows the one that matters right now).
LESSONS.splice(1, 0, { id: 'rules', group: 'Start here', title: 'The daily rules', min: 1, cards: RULES.map(r => ({ h: r.t, b: r.d })) });
