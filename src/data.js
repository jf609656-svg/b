// ══ data.js ══
// ═══════════════════════════════════════════════════════════════
//  data.js - All constants, name banks, event pools
//  To add content: find the right array and push a new entry.
// ═══════════════════════════════════════════════════════════════

// ── NAMES ──────────────────────────────────────────────────────
const NM = [
  "Liam","Noah","Oliver","Elijah","James","Aiden","Lucas","Mason","Ethan","Logan",
  "Sebastian","Jackson","Mateo","Jack","Owen","Theodore","Asher","Samuel","Henry",
  "Alexander","Benjamin","Daniel","Michael","William","Dylan","Carter","Wyatt",
  "Julian","Grayson","Leo","Easton","Nolan","Hudson","Lincoln","Eli","Landon",
  "Caleb","Isaac","Joshua","Nathan","Hunter","Connor","Finn","Declan","Miles",
  "Dominic","Ezra","Adrian","Cole","Jaxon","Roman","Silas","Axel","Jasper","Theo"
];
const NF = [
  "Olivia","Emma","Charlotte","Amelia","Sophia","Isabella","Mia","Luna","Harper",
  "Evelyn","Camila","Aria","Scarlett","Penelope","Layla","Chloe","Victoria",
  "Madison","Eleanor","Grace","Nora","Riley","Zoey","Hannah","Lily","Addison",
  "Aubrey","Ellie","Stella","Natalia","Zoe","Leah","Hazel","Violet","Aurora",
  "Savannah","Audrey","Brooklyn","Bella","Claire","Skylar","Lucy","Paisley",
  "Nova","Caroline","Kennedy","Delilah","Naomi","Aaliyah","Elena","Ivy","Ruby",
  "Alice","Eva","Autumn","Willow","Jade","Piper","Quinn","Sadie","Lydia"
];
const NN = [
  "Alex","Jordan","Morgan","Riley","Avery","Skyler","Quinn","Reese","Finley",
  "River","Sage","Blake","Emery","Casey","Devon","Harley","Kai","Peyton","Rowan","Sawyer"
];
const NS = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez",
  "Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor",
  "Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez",
  "Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright",
  "Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker",
  "Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Phillips","Evans",
  "Turner","Parker","Collins","Edwards","Stewart","Morris","Murphy"
];
const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
];

// ── HIGH SCHOOL SPORTS ──────────────────────────────────────────
// femaleOnly: true = only shows for female chars
// maleOnly: true = only shows for male chars
const HS_SPORTS = [
  { id:'football',   label:'Football',      icon:'🏈', desc:'Friday nights under the lights.',
    healthBonus:9, happyBonus:7, looksBonus:4, smartsPen:3, repBonus:14,
    minHealth:40, minSmarts:0, maleOnly:true },
  { id:'basketball', label:'Basketball',    icon:'🏀', desc:'Gym every day. Ankles of steel.',
    healthBonus:8, happyBonus:7, looksBonus:3, smartsPen:2, repBonus:11,
    minHealth:35, minSmarts:0 },
  { id:'wrestling',  label:'Wrestling',     icon:'🤼', desc:'Early mornings. Weight cuts. Pure discipline.',
    healthBonus:11, happyBonus:4, looksBonus:5, smartsPen:2, repBonus:8,
    minHealth:45, minSmarts:0 },
  { id:'baseball',   label:'Baseball',      icon:'⚾', desc:'America\'s pastime. Lots of standing.',
    healthBonus:6, happyBonus:6, looksBonus:2, smartsPen:1, repBonus:7,
    minHealth:30, minSmarts:0 },
  { id:'soccer',     label:'Soccer',        icon:'⚽', desc:'The real sport. You know this.',
    healthBonus:9, happyBonus:6, looksBonus:3, smartsPen:0, repBonus:7,
    minHealth:35, minSmarts:0 },
  { id:'track',      label:'Track & Field', icon:'🏃', desc:'Just you vs the clock.',
    healthBonus:10, happyBonus:4, looksBonus:5, smartsPen:0, repBonus:5,
    minHealth:30, minSmarts:0 },
  { id:'swimming',   label:'Swimming',      icon:'🏊', desc:'5am practice. Chlorine is a personality now.',
    healthBonus:10, happyBonus:5, looksBonus:6, smartsPen:0, repBonus:6,
    minHealth:30, minSmarts:0 },
  { id:'cheer',      label:'Cheerleading',  icon:'📣', desc:'Sidelines are still center stage.',
    healthBonus:6, happyBonus:10, looksBonus:8, smartsPen:1, repBonus:12,
    minHealth:28, minSmarts:0, femaleOnly:true },
  { id:'band',       label:'Marching Band', icon:'🎺', desc:'Underappreciated. Extremely loud.',
    healthBonus:2, happyBonus:7, looksBonus:0, smartsPen:-4, repBonus:3,
    minHealth:0,  minSmarts:35 },
  { id:'debate',     label:'Debate Team',   icon:'🎙️', desc:'Words as weapons. Very effective.',
    healthBonus:0, happyBonus:5, looksBonus:0, smartsPen:-6, repBonus:4,
    minHealth:0,  minSmarts:55 },
];

// ── CLIQUES ────────────────────────────────────────────────────
const CLIQUES = [
  { id:'popular', label:'The Popular Crowd', icon:'👑', desc:'Best table. Everyone knows your name.',
    bonus:{looks:8,happy:7},   penalty:{smarts:-4} },
  { id:'jock',    label:'The Jocks',         icon:'🏈', desc:'Varsity everything. Nobody messes with you.',
    bonus:{health:9,happy:6},  penalty:{smarts:-4} },
  { id:'nerd',    label:'The Nerds',         icon:'🤓', desc:'GPA mandatory. Pocket protectors optional.',
    bonus:{smarts:12},          penalty:{looks:-4,happy:-3} },
  { id:'rebel',   label:'The Rebels',        icon:'🖤', desc:'Smoke behind the bleachers. Ironically.',
    bonus:{happy:7,looks:3},   penalty:{health:-6,smarts:-3} },
  { id:'artsy',   label:'The Artsy Kids',    icon:'🎨', desc:'Misunderstood geniuses. Very aesthetic.',
    bonus:{smarts:6,happy:6},  penalty:{} },
  { id:'theater', label:'Theater Kids',      icon:'🎭', desc:'Everything is a performance. Everything.',
    bonus:{happy:9,looks:4},   penalty:{smarts:-2} },
  { id:'loner',   label:'Lone Wolf',         icon:'🐺', desc:'Tables for one. Surprisingly peaceful.',
    bonus:{smarts:8},           penalty:{happy:-9} },
];

// ── SUBSTANCES ─────────────────────────────────────────────────
// addictChance: per-use probability of addiction forming
const SUBSTANCES = [
  { id:'alcohol', label:'Drink',        icon:'🍺', minAge:14, addictChance:.09,
    happyRange:[8,16],  healthRange:[-4,-8],  smartsRange:[-1,-4],
    firstLine: 'You got drunk for real. Your body had strong opinions about this.',
    lines: [
      'You drank at a party. Charming, apparently. No evidence survives.',
      'Drunk texted three people. Only one was embarrassing. Progress.',
      'Hangover hit like a tax bill. Unexpected. Devastating. Deserved.',
      'You were the funniest person in the room. This is what you choose to believe.',
    ]},
  { id:'weed',    label:'Smoke Weed',   icon:'🌿', minAge:14, addictChance:.07,
    happyRange:[9,17],  healthRange:[-3,-7],  smartsRange:[-2,-5],
    firstLine: 'First time. The ceiling was very interesting for about two hours.',
    lines: [
      'You got high and watched TV. You understood the TV.',
      'Munchies consumed half the kitchen. Worth every calorie.',
      'Got paranoid and convinced yourself everyone knew. They didn\'t. Probably.',
      'You laughed at something for eight minutes. It wasn\'t that funny.',
    ]},
  { id:'cigs',    label:'Smoke Cigs',   icon:'🚬', minAge:13, addictChance:.22,
    happyRange:[2,6],   healthRange:[-5,-10], smartsRange:[0,0],
    firstLine: 'You smoked a cigarette. Coughed embarrassingly. Lit another one.',
    lines: [
      'Cigarette before school. You smell like it all day. People notice.',
      'You look cool. You are not cool. Your lungs have filed a complaint.',
      'Three a day now. Your wallet is also filing a complaint.',
    ]},
  { id:'pills',   label:'Pop Pills',    icon:'💊', minAge:16, addictChance:.28,
    happyRange:[14,22], healthRange:[-9,-18], smartsRange:[-3,-7],
    firstLine: 'The pills hit differently. You\'re not sure what different means yet.',
    lines: [
      'Things were interesting for a while. You\'re back. Mostly.',
      'That escalated quickly. You\'re okay. You think.',
      'You chased the first feeling. You won\'t find it. Nobody does.',
    ]},
  { id:'shrooms', label:'Mushrooms',    icon:'🍄', minAge:16, addictChance:.03,
    happyRange:[16,26], healthRange:[-2,-5],  smartsRange:[-4,9],
    firstLine: 'You took mushrooms. The carpet had opinions. You listened to all of them.',
    lines: [
      'Beautiful and terrifying and you cried at a tree for twenty minutes.',
      'Time moved differently. Profound thoughts recorded. Made no sense the next day.',
      'You understood something enormous. It\'s already gone.',
    ]},
];

// ── HANGOUT EVENTS ─────────────────────────────────────────────
// {msg} = friend's firstName placeholder
// Add new entries freely - they auto-pool by minAge
const HANGOUT_EVENTS = [
  // ── Chill ────
  { minAge:10, type:'',     happyD:10, healthD:-2, smartsD:0,  moneyD:0,   repD:0,
    msg:'You and {f} played video games for six hours straight. Productivity: zero. Happiness: maximum.' },
  { minAge:12, type:'',     happyD:8,  healthD:-3, smartsD:0,  moneyD:-15, repD:0,
    msg:'You and {f} went to Taco Bell at midnight for no reason. Perfect evening.' },
  { minAge:10, type:'love', happyD:7,  healthD:0,  smartsD:0,  moneyD:0,   repD:0,
    msg:'{f} came over and you watched a movie. You both cried. Neither of you acknowledged it.' },
  { minAge:16, type:'',     happyD:9,  healthD:0,  smartsD:0,  moneyD:-10, repD:2,
    msg:'You and {f} drove around for two hours listening to music. Nowhere to go. Didn\'t need to.' },
  { minAge:10, type:'',     happyD:5,  healthD:0,  smartsD:5,  moneyD:0,   repD:0,
    msg:'{f} taught you something useful today. You\'re not sure what to do with this information yet.' },
  { minAge:13, type:'',     happyD:6,  healthD:0,  smartsD:3,  moneyD:0,   repD:4,
    msg:'You and {f} made a YouTube video. It got 11 views. Seven were you.' },
  { minAge:14, type:'love', happyD:12, healthD:0,  smartsD:4,  moneyD:0,   repD:0,
    msg:'You and {f} had a 2am conversation about life. No answers. Still the best night in weeks.' },
  { minAge:12, type:'love', happyD:14, healthD:2,  smartsD:0,  moneyD:0,   repD:0,
    msg:'{f} helped you through something. The kind of friend you keep forever.' },
  { minAge:11, type:'',     happyD:6,  healthD:0,  smartsD:0,  moneyD:0,   repD:0,
    msg:'{f} showed you a show they love. You watched six episodes in one sitting. No regrets.' },
  // ── Active ───
  { minAge:14, type:'love', happyD:15, healthD:-3, smartsD:0,  moneyD:-60, repD:7,
    msg:'You and {f} went to a concert. Lost each other twice. Reunited at the merch stand. Perfect.' },
  { minAge:12, type:'',     happyD:8,  healthD:7,  smartsD:0,  moneyD:-5,  repD:0,
    msg:'You and {f} went hiking. Neither of you were prepared. Both pretended to be fine.' },
  { minAge:10, type:'',     happyD:9,  healthD:6,  smartsD:0,  moneyD:0,   repD:3,
    msg:'You and {f} played basketball. Trash talk reached illegal levels.' },
  { minAge:13, type:'warn', happyD:8,  healthD:-4, smartsD:0,  moneyD:0,   repD:5,
    msg:'{f} dared you to eat something disgusting. You completed it. You regret nothing.' },
  { minAge:15, type:'',     happyD:11, healthD:4,  smartsD:0,  moneyD:-30, repD:4,
    msg:'You and {f} went to a sports game. You screamed yourselves hoarse. Worth every dollar.' },
  // ── Pranks ───
  { minAge:12, type:'warn', happyD:12, healthD:0,  smartsD:0,  moneyD:0,   repD:9,
    msg:'You and {f} pranked someone perfectly. Consequences: pending. Laughs: immediate.' },
  { minAge:12, type:'bad',  happyD:4,  healthD:0,  smartsD:0,  moneyD:0,   repD:-6,
    msg:'You and {f} pranked the wrong person. They did not find it funny. You ran.' },
  { minAge:11, type:'',     happyD:9,  healthD:0,  smartsD:0,  moneyD:0,   repD:2,
    msg:'Prank calls with {f}. You laughed until you couldn\'t breathe. It was stupid. It was perfect.' },
  // ── Awkward ──
  { minAge:10, type:'warn', happyD:-4, healthD:0,  smartsD:0,  moneyD:0,   repD:0,
    msg:'You and {f} had a weird argument over nothing. Over by dinner. Probably.' },
  { minAge:10, type:'bad',  happyD:-7, healthD:0,  smartsD:0,  moneyD:0,   repD:0,
    msg:'{f} cancelled last minute. You sat home alone. More upset than you expected.' },
  { minAge:13, type:'',     happyD:5,  healthD:0,  smartsD:6,  moneyD:0,   repD:0,
    msg:'You and {f} stayed up studying together. Somehow both of you actually absorbed it.' },
];

// ── PARTY EVENTS ──────────────────────────────────────────────
// Add entries freely. They pool randomly when attending/throwing
const PARTY_EVENTS = [
  { type:'love', happyD:16, healthD:-8,  repD:14,
    msg:'The party was legendary. You were at the centre of it. Tomorrow will be rough.' },
  { type:'warn', happyD:3,  healthD:0,   repD:-2,
    msg:'You showed up not knowing anyone. Stood near the snacks for two hours. Left early. Still counts.' },
  { type:'',     happyD:11, healthD:-5,  repD:7,
    msg:'Beer pong. Lost every game. People respected the commitment.' },
  { type:'love', happyD:12, healthD:0,   repD:4,
    msg:'You had a deep conversation with a stranger. Never got their name. Changed your life a little.' },
  { type:'warn', happyD:7,  healthD:-6,  repD:10,
    msg:'A fight broke out at the party. You either joined it or ran. Either way, stories.' },
  { type:'warn', happyD:10, healthD:-3,  repD:13,
    msg:'You danced on something you shouldn\'t have. People recorded it. Reputation: unclear.' },
  { type:'bad',  happyD:8,  healthD:0,   repD:16,
    msg:'Cops showed up. Everyone scattered. Your cardio was an asset tonight.' },
  { type:'',     happyD:5,  healthD:0,   repD:5,
    msg:'You drove people home safely. The hero nobody thanks. Karma is watching though.' },
  { type:'love', happyD:13, healthD:0,   repD:9,
    msg:'You made out with someone at the party. You\'re not going to ask their name. They\'re not asking yours.' },
  { type:'bad',  happyD:-9, healthD:-6,  repD:-16,
    msg:'You threw up at the party. In front of everyone. Specifically in front of your crush.' },
  { type:'',     happyD:9,  healthD:0,   repD:-3,
    msg:'Total flop - eight people, Mario Kart, living room floor. Actually one of the best nights.' },
  { type:'',     happyD:11, healthD:0,   repD:5,
    msg:'You and your crew claimed a couch and never moved. Perfect strategy. Flawless execution.' },
  { type:'love', happyD:10, healthD:-4,  repD:8,
    msg:'Someone you liked was at the party. You actually talked to them. Nerve-racking. Worth it.' },
  { type:'bad',  happyD:-5, healthD:-10, repD:-8,
    msg:'You way overdid it at this party. Some of the night is missing. All of the morning was suffering.' },
  { type:'warn', happyD:14, healthD:-5,  repD:11,
    msg:'The playlist was yours. The whole party felt it. You didn\'t even have to say it was you.' },
];

// ── AGE-UP RANDOM EVENTS ───────────────────────────────────────
// Format: [minAge, maxAge, happyD, healthD, smartsD, moneyD, msg, type]
// Add freely. They weight-pool by age bracket automatically.
const LIFE_EVENTS = [
  // Childhood (5-11)
  [5,11,  9,  0, 6,  0, 'You read a book series that consumed your entire summer. Worth it.', ''],
  [5,11,  8,  0, 0,  0, 'Your birthday party was genuinely great. Someone brought a bouncy castle.', 'love'],
  [5,11, -7,  0, 0,  0, 'A kid at school was mean to you. The specific cruelty only children can manage.', 'bad'],
  [5,11,  6,  5, 0,  0, 'You spent all summer outside. You don\'t remember specific days. You remember all of it.', ''],
  [5,11, -5, -5, 0,  0, 'You got really sick and missed two weeks of school. You missed school. You\'d never admit it.', 'bad'],
  [5,11,  7,  0, 5,  0, 'You became obsessed with a weird hobby. It lasted three weeks. You learned a lot.', ''],
  [5,11,  4,  0, 8,  0, 'A teacher genuinely believed in you this year. It stuck.', 'good'],
  // Teen (12-17)
  [12,17, 10, 0, 0,  0, 'You made a new friend so naturally it felt like you\'d known them for years.', 'love'],
  [12,17,-11, 0, 0,  0, 'Your friend group imploded over something genuinely stupid. Nobody remembers why.', 'bad'],
  [12,17,  9, 0, 8,  0, 'You aced a class everyone said was impossible. You are insufferable about it.', 'good'],
  [12,17,  9, 0, 0,  0, 'You got your driver\'s license. The freedom. The near-misses. The petrol costs.', ''],
  [12,17, -5, 0, 0,  0, 'Acne arrived and immediately targeted your best school photo yet.', 'warn'],
  [12,17, 12, 0, 0,  0, 'You went semi-viral for something humiliating but weirdly charming. School royalty, briefly.', 'warn'],
  [12,17,-13, 0, 0,  0, 'A rumour spread about you. Completely fabricated. Believed with enthusiasm by everyone.', 'bad'],
  [12,17,  8, 0, 6,  0, 'You got obsessed with a show and accidentally learned a lot from it.', ''],
  [12,17, -7, 0, 0,  0, 'You tried out for something and didn\'t make it. The rejection letter was basically a novel.', 'bad'],
  [12,17,  7, 5, 0,  0, 'Glow-up year. Something clicked. People noticed. You pretended not to notice them noticing.', 'good'],
  [12,17,  9, 0, 0,  0, 'You stood up for someone being bullied. Scary. Correct. You\'d do it again.', 'good'],
  // Young adult (18-29)
  [18,29, 14, 0, 0,  0, 'You fell genuinely, embarrassingly in love. They feel it too.', 'love'],
  [18,29,-12, 0, 0,  0, 'Your first real heartbreak. You listened to the same song 400 times.', 'bad'],
  [18,29,  8, 0, 8,  0, 'You discovered self-improvement content. The journal lasted four days. The ideas stuck.', ''],
  [18,29, -7,-9, 0,  0, 'A rough patch. You ate badly, slept worse, and called it adulting.', 'bad'],
  [18,29,  9, 0, 5,  0, 'A road trip that became a story you\'ll tell forever.', 'love'],
  [18,29, -7, 0, 0, -2000, 'You lent money to a friend. It\'s gone. The friendship is complicated now.', 'bad'],
  [18,29,  8, 7, 0,  0, 'You ran a 5k. Not fast. Every step was suffering. You\'d do it again.', 'good'],
  // Midlife (30-59)
  [30,59, 10, 0, 0,  0, 'Life felt genuinely good this year. No drama. No crisis. Just good.', 'good'],
  [30,59, -9, 0, 0,  0, 'The existential crisis arrived on schedule. You stared at the ceiling a lot.', 'warn'],
  [30,59,  7, 0, 6,  0, 'You got really into a niche hobby. You cannot stop talking about it.', ''],
  [30,59, -4, 0, 0,  0, 'You found your first grey hair. Then another. Then you stopped looking.', 'warn'],
  [30,59,  8, 8, 0,  0, 'You got serious about your health. Doctor was genuinely surprised.', 'good'],
  [30,59, 12, 0, 0, -500,'You threw a big party. Expensive. Completely worth it.', 'love'],
  // Senior (60+)
  [60,90, 12, 0, 0,  0, 'You stopped caring what people think. Life improved dramatically.', 'good'],
  [60,90, -8, 0, 0,  0, 'An old friend passed away. The world got a little quieter.', 'bad'],
  [60,90,  9, 5, 0,  0, 'Your doctor called your bloodwork "boring for your age." Highest compliment.', 'good'],
  [60,90,  7, 0, 5,  0, 'You took up a new hobby. Pottery, chess, birdwatching. All equally valid.', ''],
  [60,90,  9, 0, 0,  0, 'You reread an old favourite book. Better the second time.', ''],
];

// ── ILLNESS TABLE ──────────────────────────────────────────────
// [id, name, emoji, desc, healthDmg, happyDmg, cost, fatal, minAge, maxAge]
const ILLNESSES = [
  ['cold',      'Common Cold',        '🤧', 'Sneezing on everyone. Classic.',                          5,  3,  50,    false, 0,  90],
  ['flu',       'Influenza',          '🤒', 'Bedridden for a week. Body is on strike.',               12,  8, 200,    false, 0,  90],
  ['broken',    'Broken Bone',        '🦴', 'Something snapped that should not snap.',                  8, 10, 900,    false, 5,  90],
  ['appendix',  'Appendicitis',       '🏥', 'Your appendix resigned without notice.',                  20, 15, 5500,   false,10,  60],
  ['depression','Depression',         '😔', 'The darkness settled in and got comfortable.',             5, 25, 1200,   false,13,  90],
  ['anxiety',   'Anxiety Disorder',   '😰', 'Everything is a threat. Even the good things.',            3, 18,  900,   false,13,  90],
  ['burnout',   'Burnout',            '🪫', 'You ran on empty too long. Now just empty.',               4, 22,  700,   false,18,  75],
  ['cancer',    'Cancer',             '🎗️', 'The C-word. Everything shifts immediately.',              35, 30,55000,   true, 28,  90],
  ['heartdis',  'Heart Disease',      '💔', 'Your heart has opinions about your lifestyle.',           25, 15,16000,   true, 40,  90],
  ['diabetes',  'Type 2 Diabetes',    '💉', 'The birthday cakes finally caught up.',                   10, 10, 3500,   false,25,  90],
  ['covid',     'Severe COVID',       '😷', 'Not just a cold. The really-not kind.',                   18, 12, 2200,   false, 0,  90],
  ['backpain',  'Chronic Back Pain',  '😣', 'Your spine has filed a formal grievance.',                 8, 12, 2200,   false,28,  90],
  ['migraine',  'Chronic Migraines',  '🤕', 'Your head is a drama queen.',                              4, 10,  600,   false,14,  90],
  ['insomnia',  'Insomnia',           '🌙', 'You stare at the ceiling. It stares back.',                6, 15,  500,   false,14,  90],
  ['pneumonia', 'Pneumonia',          '🫁', 'Lungs: staging a protest.',                               18, 12, 3200,   false, 0,  90],
  ['kidney',    'Kidney Stones',      '😖', 'Passing them is exactly as bad as described.',            10, 18, 4500,   false,20,  90],
  ['obesity',   'Obesity',            '🍔', 'Doctor used the word "concerning." Twice.',               12,  8, 1800,   false,16,  90],
  ['stroke',    'Stroke',             '🧠', 'Your brain staged a brief protest. Very inconvenient.',   30, 20,28000,   true, 55,  90],
];

// ── ACTIVITIES ─────────────────────────────────────────────────
const ACTIVITIES = [
  { icon:'🏋️', name:'Work Out',        desc:'+Health +Looks',          minAge:10,
    fn(){ G.health=clamp(G.health+rnd(5,12)); G.looks=clamp(G.looks+rnd(2,7)); G.stress=clamp((G.stress||35)-rnd(5,10)); addEv('You hit the gym consistently. Feeling it.'); flash('+Health +Looks 💪'); }},
  { icon:'📚', name:'Read',            desc:'+Smarts',                  minAge:5,
    fn(){ G.smarts=clamp(G.smarts+rnd(5,12)); G.stress=clamp((G.stress||35)-rnd(2,6)); addEv('You read widely. Something shifted in how you think.'); flash('+Smarts 📚'); }},
  { icon:'✈️', name:'Travel the World', desc:'Plan a trip anywhere',    minAge:16,
    fn(){ openTravelPlanner(); }},
  { icon:'🎉', name:'Party Hard',      desc:'+Happy / -Health',         minAge:16,
    fn(){ G.happy=clamp(G.happy+rnd(8,14)); G.health=clamp(G.health-rnd(3,7)); G.stress=clamp((G.stress||35)-rnd(3,7)); addEv('You partied hard. Great memories, questionable choices.'); flash('+Happy 🎉'); }},
  { icon:'🧘', name:'Meditate',        desc:'+Health +Happy',           minAge:12,
    fn(){ G.health=clamp(G.health+rnd(5,12)); G.happy=clamp(G.happy+rnd(4,9)); G.stress=clamp((G.stress||35)-rnd(8,15)); addEv('You prioritised your wellness. Mind and body in sync.'); flash('+Health +Happy 🧘'); }},
  { icon:'💰', name:'Side Hustle',     desc:'Earn money · 16+',         minAge:16,
    fn(){ if(G.age<16){flash('Too young to work.','warn');return;} const e=rnd(300,1400); G.money+=e; G.stress=clamp((G.stress||35)-rnd(0,3)); addEv(`Side hustle paid $${e}.`); flash(`+$${e} 💰`); }},
  { icon:'🍎', name:'Eat Healthy',     desc:'+Health',                  minAge:5,
    fn(){ G.health=clamp(G.health+rnd(4,10)); G.stress=clamp((G.stress||35)-rnd(2,5)); addEv('Clean eating. You feel annoyingly virtuous.'); flash('+Health 🍎'); }},
  { icon:'🎸', name:'Learn Instrument',desc:'+Smarts +Happy',           minAge:8,
    fn(){ G.smarts=clamp(G.smarts+rnd(3,7)); G.happy=clamp(G.happy+rnd(4,9)); G.stress=clamp((G.stress||35)-rnd(3,8)); addEv('You practiced an instrument. Creative outlet found.'); flash('+Smarts +Happy 🎸'); }},
  { icon:'🏃', name:'Go for a Run',    desc:'+Health',                  minAge:8,
    fn(){ G.health=clamp(G.health+rnd(6,13)); G.looks=clamp(G.looks+rnd(1,4)); G.stress=clamp((G.stress||35)-rnd(5,10)); addEv('You ran. Every step was suffering. You feel great.'); flash('+Health 🏃'); }},
  { icon:'🎨', name:'Create Art',      desc:'+Happy +Smarts',           minAge:5,
    fn(){ G.happy=clamp(G.happy+rnd(5,10)); G.smarts=clamp(G.smarts+rnd(2,6)); G.stress=clamp((G.stress||35)-rnd(3,8)); addEv('You made something. The process mattered more than the result.'); flash('+Happy +Smarts 🎨'); }},
  { icon:'🍳', name:'Cook a Meal',     desc:'+Happy +Health',           minAge:12,
    fn(){ G.happy=clamp(G.happy+rnd(5,9)); G.health=clamp(G.health+rnd(3,7)); G.stress=clamp((G.stress||35)-rnd(2,6)); addEv('You cooked from scratch. Actually tasted good. Dangerous confidence building.'); flash('+Happy +Health 🍳'); }},
  { icon:'🎬', name:'Watch Movies',    desc:'+Happy (guilty pleasure)',  minAge:5,
    fn(){ G.happy=clamp(G.happy+rnd(4,8)); G.stress=clamp((G.stress||35)-rnd(2,6)); addEv('Movie marathon. You stayed up too late. Worth it.'); flash('+Happy 🎬'); }},
];

// ── TRAVEL ─────────────────────────────────────────────────────
const TRAVEL_CLASSES = [
  { id:'economy',  label:'Economy',   costMult:1.0, luxury:0, desc:'Budget-friendly. Tight seats.' },
  { id:'premium',  label:'Premium',   costMult:1.6, luxury:1, desc:'More legroom, better meals.' },
  { id:'business', label:'Business',  costMult:2.5, luxury:2, desc:'Lie-flat. Quiet cabin.' },
  { id:'first',    label:'First',     costMult:4.0, luxury:3, desc:'Champagne and privacy.' },
];

const TRAVEL_GENERAL_EVENTS = [
  { msg:'You met a stranger on the plane who changed how you see the world.', happy:[4,9], smarts:[2,6] },
  { msg:'The weather was perfect. Every sunset looked staged.', happy:[6,12] },
  { msg:'You got lost and found your favorite street by accident.', happy:[4,8], smarts:[1,4] },
  { msg:'Jet lag hit hard. You powered through anyway.', health:[-4,-1], happy:[2,6] },
  { msg:'You tried a local dish that rewired your taste buds.', happy:[4,9] },
  { msg:'You learned a few phrases and used them confidently.', smarts:[3,7] },
  { msg:'A long delay tested your patience.', happy:[-6,-2] },
  { msg:'You took photos that felt like magazine covers.', looks:[2,6], happy:[3,7] },
  { msg:'You splurged on a once-in-a-lifetime experience.', happy:[5,12], money:[-200, -800] },
  { msg:'You got a little homesick in the middle of the trip.', happy:[-4,-1] },
  { msg:'You made a local friend who showed you hidden gems.', happy:[5,10], smarts:[2,5] },
  { msg:'You got a small souvenir that now feels like a talisman.', happy:[3,6] },
];

const TRAVEL_LOCATIONS = [
  { name:'Tokyo', country:'Japan', region:'Asia', baseCost:1800, luxury:2, culture:3,
    events:[{ msg:'You wandered Shibuya at night. The neon made everything feel cinematic.', happy:[6,12] },
            { msg:'Sushi at a tiny counter ruined your standards forever.', happy:[4,8] }] },
  { name:'Kyoto', country:'Japan', region:'Asia', baseCost:1600, luxury:1, culture:3,
    events:[{ msg:'You visited temples at dawn. The silence was unforgettable.', happy:[5,10], smarts:[2,6] },
            { msg:'You took part in a tea ceremony. Slow, precise, beautiful.', smarts:[3,6], happy:[3,6] }] },
  { name:'Seoul', country:'South Korea', region:'Asia', baseCost:1500, luxury:2, culture:2,
    events:[{ msg:'Night markets, street food, endless energy.', happy:[6,12] },
            { msg:'You found a café district that felt like a movie set.', happy:[4,8], looks:[1,3] }] },
  { name:'Bangkok', country:'Thailand', region:'Asia', baseCost:900, luxury:1, culture:2,
    events:[{ msg:'Rooftop views over the city at night. Electric.', happy:[6,10] },
            { msg:'A floating market tour turned into a feast.', happy:[4,8] }] },
  { name:'Chiang Mai', country:'Thailand', region:'Asia', baseCost:800, luxury:1, culture:2,
    events:[{ msg:'You learned to cook Thai dishes from scratch.', smarts:[2,5], happy:[4,8] },
            { msg:'Mountain air and quiet temples reset your mind.', health:[2,5], happy:[3,7] }] },
  { name:'Bali', country:'Indonesia', region:'Asia', baseCost:1100, luxury:2, culture:1,
    events:[{ msg:'A private villa day made life feel unreal.', happy:[6,12], looks:[2,5] },
            { msg:'You caught a perfect sunrise over the rice terraces.', happy:[5,9] }] },
  { name:'Singapore', country:'Singapore', region:'Asia', baseCost:1700, luxury:3, culture:2,
    events:[{ msg:'The skyline at night felt like the future.', happy:[5,10] },
            { msg:'Hawker center food tour was elite.', happy:[4,8] }] },
  { name:'Hanoi', country:'Vietnam', region:'Asia', baseCost:800, luxury:1, culture:2,
    events:[{ msg:'Old Quarter chaos was oddly calming.', happy:[4,8], smarts:[1,3] },
            { msg:'You took a motorbike ride through the city. Thrilling.', happy:[5,9] }] },
  { name:'Ho Chi Minh City', country:'Vietnam', region:'Asia', baseCost:850, luxury:1, culture:2,
    events:[{ msg:'You explored hidden cafés and art spaces.', happy:[4,8] },
            { msg:'Night markets felt endless.', happy:[4,7] }] },
  { name:'Manila', country:'Philippines', region:'Asia', baseCost:950, luxury:1, culture:1,
    events:[{ msg:'You took a day trip to a postcard-perfect island.', happy:[6,10] },
            { msg:'Street food tour turned into a long night.', happy:[4,8] }] },
  { name:'Sydney', country:'Australia', region:'Oceania', baseCost:2200, luxury:2, culture:1,
    events:[{ msg:'Opera House and harbor ferry at golden hour.', happy:[6,12] },
            { msg:'You surfed for the first time. Wiped out. Loved it.', happy:[4,9], health:[-1,2] }] },
  { name:'Melbourne', country:'Australia', region:'Oceania', baseCost:2100, luxury:2, culture:2,
    events:[{ msg:'Coffee culture took over your mornings.', happy:[3,7] },
            { msg:'Laneway art walks made you feel cooler by association.', looks:[1,3], happy:[4,7] }] },
  { name:'Auckland', country:'New Zealand', region:'Oceania', baseCost:2000, luxury:1, culture:1,
    events:[{ msg:'You hiked and saw views that felt unreal.', health:[2,6], happy:[5,9] },
            { msg:'You visited a quiet coastal town and actually relaxed.', happy:[4,8] }] },
  { name:'Queenstown', country:'New Zealand', region:'Oceania', baseCost:2300, luxury:1, culture:1,
    events:[{ msg:'Adventure sports day. You chose the scary one.', happy:[6,10], health:[-2,2] },
            { msg:'Lake views made everything feel small in a good way.', happy:[5,9] }] },
  { name:'Reykjavík', country:'Iceland', region:'Europe', baseCost:2100, luxury:1, culture:2,
    events:[{ msg:'You saw the northern lights. It didn\'t feel real.', happy:[7,12] },
            { msg:'Hot springs at night fixed your soul.', health:[2,6], happy:[4,8] }] },
  { name:'Dublin', country:'Ireland', region:'Europe', baseCost:1600, luxury:1, culture:2,
    events:[{ msg:'Live music in a pub turned into a long, warm night.', happy:[5,10] },
            { msg:'Rain and castles. Surprisingly perfect.', happy:[4,8] }] },
  { name:'London', country:'United Kingdom', region:'Europe', baseCost:1800, luxury:2, culture:3,
    events:[{ msg:'Museums and history made your brain light up.', smarts:[3,7], happy:[3,7] },
            { msg:'You did a full theatre night. Unforgettable.', happy:[5,10] }] },
  { name:'Paris', country:'France', region:'Europe', baseCost:1900, luxury:3, culture:3,
    events:[{ msg:'You watched the city glow from a bridge at night.', happy:[6,12] },
            { msg:'A tiny patisserie ruined you for cheap desserts forever.', happy:[4,8] }] },
  { name:'Nice', country:'France', region:'Europe', baseCost:1700, luxury:3, culture:2,
    events:[{ msg:'Mediterranean breeze. You slowed down for once.', happy:[5,9] },
            { msg:'Sunset on the promenade felt like a postcard.', happy:[4,8] }] },
  { name:'Barcelona', country:'Spain', region:'Europe', baseCost:1700, luxury:2, culture:3,
    events:[{ msg:'Gaudí architecture made the city feel alive.', smarts:[2,5], happy:[4,8] },
            { msg:'Late-night tapas run. No regrets.', happy:[5,9] }] },
  { name:'Madrid', country:'Spain', region:'Europe', baseCost:1600, luxury:1, culture:2,
    events:[{ msg:'The plaza stayed alive until dawn.', happy:[4,9] },
            { msg:'You wandered into a flamenco show. Chills.', happy:[5,9] }] },
  { name:'Lisbon', country:'Portugal', region:'Europe', baseCost:1500, luxury:1, culture:2,
    events:[{ msg:'Pastel de nata became a daily ritual.', happy:[4,8] },
            { msg:'The hills gave you legs and a view.', health:[1,4], happy:[4,8] }] },
  { name:'Porto', country:'Portugal', region:'Europe', baseCost:1500, luxury:1, culture:2,
    events:[{ msg:'Riverside wine tasting. Elegant and easy.', happy:[4,8] },
            { msg:'You took the scenic train and it was worth it.', happy:[4,8] }] },
  { name:'Rome', country:'Italy', region:'Europe', baseCost:1800, luxury:2, culture:3,
    events:[{ msg:'You walked past 2,000 years of history like it was normal.', smarts:[3,7], happy:[3,7] },
            { msg:'Pasta. Forever.', happy:[4,8] }] },
  { name:'Florence', country:'Italy', region:'Europe', baseCost:1700, luxury:2, culture:3,
    events:[{ msg:'Art and architecture overload in the best way.', smarts:[3,7], happy:[4,8] },
            { msg:'You watched sunset over the river with a gelato.', happy:[4,8] }] },
  { name:'Venice', country:'Italy', region:'Europe', baseCost:1900, luxury:3, culture:2,
    events:[{ msg:'Gondola at dusk. Yes, it was cheesy. Yes, it worked.', happy:[6,10] },
            { msg:'You got lost in the alleys. That was the point.', happy:[4,8] }] },
  { name:'Milan', country:'Italy', region:'Europe', baseCost:1700, luxury:3, culture:2,
    events:[{ msg:'Fashion district energy rubbed off on you.', looks:[2,5], happy:[3,7] },
            { msg:'A tiny espresso bar became your place.', happy:[3,6] }] },
  { name:'Athens', country:'Greece', region:'Europe', baseCost:1600, luxury:1, culture:3,
    events:[{ msg:'The Acropolis at sunrise. Unreal.', smarts:[3,7], happy:[4,8] },
            { msg:'You learned to love late dinners and warm nights.', happy:[4,8] }] },
  { name:'Santorini', country:'Greece', region:'Europe', baseCost:2000, luxury:3, culture:1,
    events:[{ msg:'Cliffside views and blue domes. Exactly the dream.', happy:[6,12] },
            { msg:'You took a boat tour and swam in hot springs.', happy:[4,9] }] },
  { name:'Istanbul', country:'Turkey', region:'Europe', baseCost:1500, luxury:1, culture:3,
    events:[{ msg:'The bazaar felt like a movie set.', happy:[4,9] },
            { msg:'You learned the history of three empires in one day.', smarts:[3,7] }] },
  { name:'Prague', country:'Czechia', region:'Europe', baseCost:1400, luxury:1, culture:2,
    events:[{ msg:'Cobblestone streets and gothic spires all night.', happy:[4,8] },
            { msg:'You found a jazz cellar bar and stayed too long.', happy:[4,8] }] },
  { name:'Vienna', country:'Austria', region:'Europe', baseCost:1600, luxury:2, culture:3,
    events:[{ msg:'Classical concert night. You felt classy.', smarts:[2,5], happy:[4,8] },
            { msg:'Café culture slowed your pace in a good way.', happy:[4,7] }] },
  { name:'Budapest', country:'Hungary', region:'Europe', baseCost:1400, luxury:1, culture:2,
    events:[{ msg:'Ruin bars and river lights. Iconic.', happy:[4,9] },
            { msg:'Thermal baths at night reset you.', health:[2,5], happy:[4,8] }] },
  { name:'Amsterdam', country:'Netherlands', region:'Europe', baseCost:1700, luxury:2, culture:2,
    events:[{ msg:'Canals at dusk, bikes everywhere.', happy:[4,8] },
            { msg:'You visited a museum and it actually hit you.', smarts:[2,5], happy:[3,7] }] },
  { name:'Berlin', country:'Germany', region:'Europe', baseCost:1600, luxury:1, culture:3,
    events:[{ msg:'History, art, and techno all in one night.', happy:[4,9], smarts:[1,4] },
            { msg:'You found a hidden courtyard café. Perfect.', happy:[3,6] }] },
  { name:'Copenhagen', country:'Denmark', region:'Europe', baseCost:1900, luxury:2, culture:2,
    events:[{ msg:'Nordic design everywhere. You felt minimalist.', looks:[1,3], happy:[3,7] },
            { msg:'Harbor views and bike rides made you feel light.', health:[1,4], happy:[3,7] }] },
  { name:'Oslo', country:'Norway', region:'Europe', baseCost:2000, luxury:2, culture:2,
    events:[{ msg:'Fjord cruise. Quiet and huge and perfect.', happy:[5,9] },
            { msg:'You tried Nordic sauna culture. Intense but great.', health:[2,5] }] },
  { name:'Stockholm', country:'Sweden', region:'Europe', baseCost:1900, luxury:2, culture:2,
    events:[{ msg:'Island-hopping afternoon. Clean, crisp air.', health:[1,4], happy:[4,8] },
            { msg:'You found a bookstore café and stayed all afternoon.', smarts:[2,5], happy:[3,7] }] },
  { name:'Helsinki', country:'Finland', region:'Europe', baseCost:1800, luxury:1, culture:2,
    events:[{ msg:'You jumped into the Baltic after a sauna. Wild.', health:[1,4], happy:[3,7] },
            { msg:'Design district walk made you want new furniture.', happy:[3,6] }] },
  { name:'Marrakech', country:'Morocco', region:'Africa', baseCost:1300, luxury:1, culture:3,
    events:[{ msg:'The souks were pure sensory overload.', happy:[4,9] },
            { msg:'You stayed in a riad with a courtyard you still think about.', happy:[4,8] }] },
  { name:'Cairo', country:'Egypt', region:'Africa', baseCost:1400, luxury:1, culture:3,
    events:[{ msg:'You saw the pyramids. Photos don\'t do it justice.', smarts:[3,7], happy:[4,8] },
            { msg:'Nile night cruise felt timeless.', happy:[4,8] }] },
  { name:'Cape Town', country:'South Africa', region:'Africa', baseCost:1700, luxury:2, culture:2,
    events:[{ msg:'Table Mountain views were unreal.', happy:[5,9] },
            { msg:'You did a coastal drive and stopped at every viewpoint.', happy:[4,8] }] },
  { name:'Nairobi', country:'Kenya', region:'Africa', baseCost:1600, luxury:1, culture:2,
    events:[{ msg:'You did a day safari. It felt like a nature documentary.', happy:[6,10] },
            { msg:'Local food tour surprised you.', happy:[3,7] }] },
  { name:'Zanzibar', country:'Tanzania', region:'Africa', baseCost:1700, luxury:2, culture:1,
    events:[{ msg:'Turquoise water. White sand. No notes.', happy:[6,12] },
            { msg:'Spice market tour was unexpectedly fun.', happy:[4,8] }] },
  { name:'Dubai', country:'UAE', region:'Middle East', baseCost:2200, luxury:3, culture:1,
    events:[{ msg:'Skyline views and rooftop dinners. Excess, but fun.', happy:[5,10], looks:[2,5] },
            { msg:'Desert safari at sunset. Still thinking about it.', happy:[4,8] }] },
  { name:'Doha', country:'Qatar', region:'Middle East', baseCost:2100, luxury:3, culture:1,
    events:[{ msg:'Museums and modern architecture all day.', smarts:[2,5], happy:[3,7] },
            { msg:'The souq at night was all atmosphere.', happy:[4,8] }] },
  { name:'Jerusalem', country:'Israel', region:'Middle East', baseCost:1800, luxury:1, culture:3,
    events:[{ msg:'History everywhere. Heavy, powerful, unforgettable.', smarts:[3,7], happy:[2,6] },
            { msg:'You walked the old city at sunrise. Stillness.', happy:[4,8] }] },
  { name:'Petra', country:'Jordan', region:'Middle East', baseCost:1700, luxury:1, culture:3,
    events:[{ msg:'The Treasury in person. Unreal.', happy:[6,10], smarts:[2,5] },
            { msg:'Desert night under a full sky.', happy:[5,9] }] },
  { name:'New York City', country:'USA', region:'North America', baseCost:1400, luxury:3, culture:2,
    events:[{ msg:'Broadway night. You left buzzing.', happy:[5,10] },
            { msg:'You walked for miles and saw everything.', health:[1,4], happy:[4,8] }] },
  { name:'Los Angeles', country:'USA', region:'North America', baseCost:1300, luxury:2, culture:1,
    events:[{ msg:'Sunset at the beach with the skyline in the distance.', happy:[4,8] },
            { msg:'You saw a celebrity. Maybe. Probably.', happy:[3,7] }] },
  { name:'Miami', country:'USA', region:'North America', baseCost:1200, luxury:2, culture:1,
    events:[{ msg:'Beach day, nightlife, repeat.', happy:[5,10] },
            { msg:'You found a secret art deco bar.', happy:[4,8] }] },
  { name:'Las Vegas', country:'USA', region:'North America', baseCost:1200, luxury:3, culture:0,
    events:[{ msg:'A night out went longer than planned.', happy:[5,10], money:[-200,-800] },
            { msg:'You saw a show that blew your mind.', happy:[5,9] }] },
  { name:'Chicago', country:'USA', region:'North America', baseCost:1100, luxury:1, culture:2,
    events:[{ msg:'Lakefront wind, skyline views, perfect food.', happy:[4,8] },
            { msg:'Deep dish made you question everything.', happy:[3,7] }] },
  { name:'Vancouver', country:'Canada', region:'North America', baseCost:1400, luxury:1, culture:2,
    events:[{ msg:'Mountains and ocean in one view. Unreal.', happy:[5,9] },
            { msg:'You biked the seawall and felt healthy for once.', health:[2,5], happy:[3,7] }] },
  { name:'Toronto', country:'Canada', region:'North America', baseCost:1300, luxury:1, culture:2,
    events:[{ msg:'Food tour around the world in one city.', happy:[4,8] },
            { msg:'You caught a game and the crowd was electric.', happy:[4,8] }] },
  { name:'Montreal', country:'Canada', region:'North America', baseCost:1300, luxury:1, culture:2,
    events:[{ msg:'Old town at night felt like Europe.', happy:[4,8] },
            { msg:'Late-night poutine hit the spot.', happy:[3,6] }] },
  { name:'Mexico City', country:'Mexico', region:'North America', baseCost:1100, luxury:1, culture:3,
    events:[{ msg:'Street food tour changed your standards.', happy:[4,9] },
            { msg:'You visited Frida\'s house and felt it.', smarts:[2,5], happy:[3,7] }] },
  { name:'Cancún', country:'Mexico', region:'North America', baseCost:1000, luxury:2, culture:1,
    events:[{ msg:'Beach resort days blurred into one perfect week.', happy:[6,10] },
            { msg:'You snorkeled and saw ridiculous colors.', happy:[4,8] }] },
  { name:'Tulum', country:'Mexico', region:'North America', baseCost:1200, luxury:2, culture:1,
    events:[{ msg:'Jungle cenote swim. Pure magic.', happy:[5,9] },
            { msg:'You slowed down and it felt good.', happy:[4,8] }] },
  { name:'Havana', country:'Cuba', region:'Caribbean', baseCost:1200, luxury:1, culture:2,
    events:[{ msg:'Classic cars and music everywhere.', happy:[4,8] },
            { msg:'Salsa night in a small club. You joined in.', happy:[5,9] }] },
  { name:'San Juan', country:'Puerto Rico', region:'Caribbean', baseCost:1100, luxury:1, culture:1,
    events:[{ msg:'Old San Juan at night was perfect.', happy:[4,8] },
            { msg:'You took a day trip to a hidden beach.', happy:[4,8] }] },
  { name:'Punta Cana', country:'Dominican Republic', region:'Caribbean', baseCost:1200, luxury:2, culture:1,
    events:[{ msg:'All-inclusive days felt like a reset.', happy:[5,10] },
            { msg:'You tried a new watersport and actually liked it.', happy:[4,8] }] },
  { name:'Rio de Janeiro', country:'Brazil', region:'South America', baseCost:1500, luxury:2, culture:2,
    events:[{ msg:'You stood under Christ the Redeemer. It hit hard.', happy:[5,9], smarts:[1,4] },
            { msg:'Carnival energy is real even off-season.', happy:[5,10] }] },
  { name:'São Paulo', country:'Brazil', region:'South America', baseCost:1400, luxury:1, culture:2,
    events:[{ msg:'Food scene was wild. You ate like a local.', happy:[4,8] },
            { msg:'Street art tour felt alive.', smarts:[1,4], happy:[3,7] }] },
  { name:'Buenos Aires', country:'Argentina', region:'South America', baseCost:1500, luxury:1, culture:2,
    events:[{ msg:'Tango show at night was electric.', happy:[5,9] },
            { msg:'Late dinners turned into long conversations.', happy:[4,8] }] },
  { name:'Santiago', country:'Chile', region:'South America', baseCost:1500, luxury:1, culture:1,
    events:[{ msg:'You took a day trip into the Andes.', happy:[5,9] },
            { msg:'Wine country visit turned into a perfect day.', happy:[4,8] }] },
  { name:'Machu Picchu', country:'Peru', region:'South America', baseCost:1800, luxury:1, culture:3,
    events:[{ msg:'You saw Machu Picchu at sunrise. Unreal.', happy:[7,12], smarts:[2,5] },
            { msg:'The hike tested you. You did it anyway.', health:[1,4], happy:[4,8] }] },
  { name:'Cusco', country:'Peru', region:'South America', baseCost:1500, luxury:1, culture:2,
    events:[{ msg:'Altitude hit, but the city was worth it.', health:[-3,-1], happy:[4,8] },
            { msg:'You wandered ancient streets and markets.', happy:[4,8] }] },
  { name:'Lima', country:'Peru', region:'South America', baseCost:1400, luxury:1, culture:2,
    events:[{ msg:'Ceviche at the coast. Perfect.', happy:[4,8] },
            { msg:'You explored cliffside parks at sunset.', happy:[4,8] }] },
  { name:'Bogotá', country:'Colombia', region:'South America', baseCost:1300, luxury:1, culture:2,
    events:[{ msg:'Coffee culture took over your day.', happy:[3,7] },
            { msg:'You found a rooftop with a perfect view.', happy:[4,8] }] }

];

// ── TRAITS ─────────────────────────────────────────────────────
const TRAITS = [
  'Ambitious','Kind','Anxious','Rebellious','Creative','Analytical','Charismatic','Introverted',
  'Impulsive','Disciplined','Funny','Empathetic','Competitive','Loyal','Curious','Stubborn',
  'Idealistic','Pragmatic','Optimistic','Cynical',
];

function pickTraits(n=3){
  const copy = [...TRAITS];
  const out = [];
  for(let i=0;i<n && copy.length;i++){
    out.push(copy.splice(rnd(0,copy.length-1),1)[0]);
  }
  return out;
}

function inheritTraits(p1, p2){
  const base = [];
  if(p1?.traits?.length) base.push(...p1.traits.slice(0,2));
  if(p2?.traits?.length) base.push(...p2.traits.slice(0,2));
  while(base.length<3) base.push(pick(TRAITS));
  return [...new Set(base)].slice(0,3);
}

// ── JOBS / CAREERS ─────────────────────────────────────────────
const JOB_LEVELS = [
  { id:'entry',  label:'Entry',  minYears:0,  payMult:1.0 },
  { id:'mid',    label:'Mid',    minYears:2,  payMult:1.25 },
  { id:'senior', label:'Senior', minYears:5,  payMult:1.55 },
  { id:'lead',   label:'Lead',   minYears:8,  payMult:1.9 },
  { id:'exec',   label:'Exec',   minYears:12, payMult:2.5 },
];

const COMPANIES = [
  'Northbridge Labs','Atlas & Co','Blueleaf Media','Summit Dynamics','Granite Health',
  'Horizon Legal Group','Redwood Partners','Everbright Systems','Silverline Capital',
  'PulseTech','Crestview Foods','Harbor Logistics','Aurora Studios','Aspen Analytics',
];

// minEdu: 'none'|'hs'|'college'|'med'|'law'
const JOBS = [
  // teen / part-time
  { id:'retail',     title:'Retail Associate',   tier:'teen',  minAge:16, minEdu:'none', basePay:18000, degrees:[] },
  { id:'barista',    title:'Barista',            tier:'teen',  minAge:16, minEdu:'none', basePay:19000, degrees:[] },
  { id:'lifeguard',  title:'Lifeguard',          tier:'teen',  minAge:16, minEdu:'none', basePay:21000, degrees:[] },
  { id:'linecook',   title:'Line Cook',          tier:'teen',  minAge:16, minEdu:'none', basePay:22000, degrees:[] },
  { id:'intern',     title:'Unpaid Intern',      tier:'teen',  minAge:16, minEdu:'hs',   basePay:0,     degrees:[] },

  // entry
  { id:'assistant',  title:'Office Assistant',   tier:'entry', minAge:18, minEdu:'hs',      basePay:28000, degrees:[] },
  { id:'support',    title:'Customer Support',   tier:'entry', minAge:18, minEdu:'hs',      basePay:30000, degrees:[] },
  { id:'marketing',  title:'Marketing Assistant',tier:'entry', minAge:18, minEdu:'college', basePay:42000, degrees:['Business','Journalism','Film & Media'] },
  { id:'jdev',       title:'Junior Developer',   tier:'entry', minAge:18, minEdu:'college', basePay:60000, degrees:['Computer Science','Engineering','Mathematics'] },
  { id:'analyst',    title:'Business Analyst',   tier:'entry', minAge:18, minEdu:'college', basePay:52000, degrees:['Business','Economics','Finance'] },
  { id:'data_analyst',title:'Data Analyst',       tier:'entry', minAge:21, minEdu:'college', basePay:61000, degrees:['Computer Science','Mathematics','Economics','Physics'], certsPreferred:['data'] },
  { id:'ux_researcher',title:'UX Researcher',     tier:'entry', minAge:21, minEdu:'college', basePay:64000, degrees:['Psychology','Arts','Film & Media','Computer Science'] },
  { id:'policy_aide', title:'Policy Aide',        tier:'entry', minAge:21, minEdu:'college', basePay:50000, degrees:['Political Science','Economics','Law','Public Health'] },
  { id:'lab_tech',    title:'Lab Technician',     tier:'entry', minAge:21, minEdu:'college', basePay:54000, degrees:['Biology','Medicine','Public Health'] },
  { id:'teacher',    title:'Teacher',            tier:'entry', minAge:22, minEdu:'college', basePay:43000, degrees:['Education','Psychology','Arts'] },
  { id:'nurse',      title:'Registered Nurse',   tier:'entry', minAge:22, minEdu:'college', basePay:62000, degrees:['Nursing'] },

  // mid
  { id:'swe',        title:'Software Engineer',  tier:'mid',   minAge:22, minEdu:'college', basePay:90000, degrees:['Computer Science','Engineering','Mathematics','Physics'] },
  { id:'designer',   title:'Product Designer',   tier:'mid',   minAge:22, minEdu:'college', basePay:78000, degrees:['Arts','Film & Media','Architecture'] },
  { id:'accountant', title:'Accountant',         tier:'mid',   minAge:22, minEdu:'college', basePay:68000, degrees:['Business','Finance','Economics'] },
  { id:'manager',    title:'HR Manager',         tier:'mid',   minAge:24, minEdu:'college', basePay:74000, degrees:['Business','Psychology','Education'] },
  { id:'architect',  title:'Architect',          tier:'mid',   minAge:24, minEdu:'college', basePay:82000, degrees:['Architecture'] },
  { id:'data_engineer',title:'Data Engineer',    tier:'mid',   minAge:24, minEdu:'college', basePay:112000,degrees:['Computer Science','Engineering','Mathematics','Physics'], certsPreferred:['cloud','data'], track:'specialist' },
  { id:'cyber_analyst',title:'Cybersecurity Analyst', tier:'mid', minAge:23, minEdu:'college', basePay:106000,degrees:['Computer Science','Engineering','Mathematics'], certsPreferred:['cloud'], track:'specialist' },
  { id:'biotech_engineer',title:'Biotech Engineer', tier:'mid', minAge:24, minEdu:'college', basePay:98000,degrees:['Biology','Engineering','Medicine','Public Health'], track:'specialist' },
  { id:'supply_manager',title:'Supply Chain Manager', tier:'mid', minAge:24, minEdu:'college', basePay:92000,degrees:['Business','Economics','Engineering'], certsPreferred:['pmp'], track:'managerial' },
  { id:'renewable_analyst',title:'Renewable Energy Analyst', tier:'mid', minAge:23, minEdu:'college', basePay:94000,degrees:['Engineering','Physics','Economics'], certsPreferred:['data'], track:'specialist' },
  { id:'game_designer',title:'Game Designer',    tier:'mid',   minAge:22, minEdu:'college', basePay:88000,degrees:['Computer Science','Arts','Film & Media'], track:'specialist' },

  // senior
  { id:'swe_s',      title:'Senior Engineer',    tier:'senior',minAge:26, minEdu:'college', basePay:120000,degrees:['Computer Science','Engineering','Mathematics','Physics'] },
  { id:'pm',         title:'Product Manager',    tier:'senior',minAge:26, minEdu:'college', basePay:130000,degrees:['Business','Computer Science','Engineering'] },
  { id:'fin_mgr',    title:'Finance Manager',    tier:'senior',minAge:26, minEdu:'college', basePay:115000,degrees:['Finance','Economics','Business'] },
  { id:'principal',  title:'School Principal',   tier:'senior',minAge:30, minEdu:'college', basePay:98000, degrees:['Education','Psychology'] },
  { id:'ai_engineer',title:'AI/ML Engineer',     tier:'senior',minAge:26, minEdu:'college', basePay:158000,degrees:['Computer Science','Mathematics','Physics','Engineering'], certsPreferred:['cloud','data'], track:'specialist' },
  { id:'product_mkt_mgr',title:'Product Marketing Manager', tier:'senior', minAge:27, minEdu:'college', basePay:128000,degrees:['Business','Journalism','Film & Media','Economics'], certsPreferred:['pmp'], track:'managerial' },
  { id:'risk_analyst',title:'Risk Analyst',      tier:'senior',minAge:27, minEdu:'college', basePay:142000,degrees:['Finance','Economics','Mathematics','Physics'], certsPreferred:['finance','data'], track:'specialist' },
  { id:'strategy_consultant',title:'Strategy Consultant', tier:'senior', minAge:27, minEdu:'college', basePay:150000,degrees:['Business','Economics','Engineering','Political Science'], certsPreferred:['pmp','finance'], track:'managerial' },
  { id:'clinical_psych',title:'Clinical Psychologist', tier:'senior', minAge:27, minEdu:'college', basePay:118000,degrees:['Psychology','Public Health','Biology'], track:'specialist' },

  // executive / elite
  { id:'director',   title:'Director',           tier:'exec',  minAge:32, minEdu:'college', basePay:170000,degrees:[] },
  { id:'vp',         title:'VP / Executive',     tier:'exec',  minAge:35, minEdu:'college', basePay:230000,degrees:[] },
  { id:'chief_staff',title:'Chief of Staff',     tier:'exec',  minAge:32, minEdu:'college', basePay:215000,degrees:['Business','Political Science','Economics','Law'], certsPreferred:['pmp'], track:'executive' },
  { id:'ops_exec',   title:'Operations Executive',tier:'exec', minAge:34, minEdu:'college', basePay:245000,degrees:['Business','Engineering','Economics'], certsPreferred:['pmp','finance'], track:'executive' },
  { id:'ib',         title:'Investment Banker',  tier:'elite', minAge:24, minEdu:'college', basePay:160000,degrees:['Finance','Economics','Business','Mathematics'] },
  { id:'quant',      title:'Quant Analyst',      tier:'elite', minAge:24, minEdu:'college', basePay:190000,degrees:['Mathematics','Physics','Computer Science'] },

  // legal (requires law license)
  { id:'law_assoc',  title:'Associate Lawyer',   tier:'legal', minAge:25, minEdu:'law',     basePay:140000,degrees:['Law'] },
  { id:'public_def', title:'Public Defender',    tier:'legal', minAge:25, minEdu:'law',     basePay:90000, degrees:['Law'] },
  { id:'corp_coun',  title:'Corporate Counsel',  tier:'legal', minAge:28, minEdu:'law',     basePay:180000,degrees:['Law'] },
  { id:'judge',      title:'Judge',              tier:'legal', minAge:38, minEdu:'law',     basePay:220000,degrees:['Law'] },
  { id:'partner',    title:'Law Firm Partner',   tier:'legal', minAge:35, minEdu:'law',     basePay:260000,degrees:['Law'] },

  // medical (requires medical license)
  { id:'resident',   title:'Medical Resident',   tier:'medical',minAge:26, minEdu:'med',    basePay:65000, degrees:['Medicine'] },
  { id:'doctor',     title:'Doctor',             tier:'medical',minAge:28, minEdu:'med',    basePay:200000,degrees:['Medicine'] },
  { id:'surgeon',    title:'Surgeon',            tier:'medical',minAge:30, minEdu:'med',    basePay:350000,degrees:['Medicine'] },
  { id:'psychiat',   title:'Psychiatrist',       tier:'medical',minAge:28, minEdu:'med',    basePay:240000,degrees:['Medicine','Psychology'] },
  { id:'med_research',title:'Medical Researcher',tier:'medical',minAge:27, minEdu:'med',    basePay:180000,degrees:['Medicine','Biology'] },
];

const MED_SCHOOL = { years:4, tuition:52000, minGPA:3.3 };
const LAW_SCHOOL = { years:3, tuition:48000, minGPA:3.2 };

const HOUSING_OPTIONS = [
  { id:'room',   label:'Roommates',  rent:780,  minCredit:580, comfort:35, neighborhood:45 },
  { id:'studio', label:'Studio',     rent:1200, minCredit:620, comfort:45, neighborhood:55 },
  { id:'onebed', label:'1BR',        rent:1700, minCredit:650, comfort:55, neighborhood:60 },
  { id:'lux',    label:'Luxury Apt', rent:2600, minCredit:700, comfort:70, neighborhood:70 },
];

// ── CRIME DATA ─────────────────────────────────────────────────
const HEAT_PHASES = [
  'Quiet', 'Whispers', 'Known Locally', 'On the Radar', 'Notorious',
  'Hot', 'Very Hot', 'Manhunt', 'Most Wanted', 'Legendary Heat'
];

const SHOPLIFT_ITEMS = [
  { name:'Candy Bar', value:2, risk:5 },
  { name:'Energy Drink', value:4, risk:6 },
  { name:'Lip Balm', value:6, risk:7 },
  { name:'Gum Pack', value:2, risk:4 },
  { name:'Notebook', value:5, risk:6 },
  { name:'Socks', value:8, risk:8 },
  { name:'Phone Charger', value:12, risk:10 },
  { name:'Cheap Sunglasses', value:10, risk:9 },
  { name:'Water Bottle', value:7, risk:7 },
  { name:'T-Shirt', value:15, risk:12 },
  { name:'Hoodie', value:28, risk:18 },
  { name:'Headphones', value:35, risk:20 },
  { name:'Bluetooth Speaker', value:45, risk:24 },
  { name:'Wallet', value:20, risk:14 },
  { name:'Backpack', value:30, risk:18 },
  { name:'Perfume', value:40, risk:22 },
  { name:'Makeup Kit', value:25, risk:16 },
  { name:'Wireless Mouse', value:18, risk:12 },
  { name:'Keyboard', value:35, risk:20 },
  { name:'USB Drive', value:12, risk:10 },
  { name:'Novel', value:9, risk:6 },
  { name:'Comic', value:7, risk:5 },
  { name:'Baseball Cap', value:16, risk:11 },
  { name:'Sneakers', value:60, risk:28 },
  { name:'Jacket', value:75, risk:30 },
  { name:'Protein Bars', value:9, risk:6 },
  { name:'Skincare Serum', value:38, risk:20 },
  { name:'Game Controller', value:55, risk:26 },
  { name:'Power Bank', value:25, risk:16 },
  { name:'Hair Clippers', value:40, risk:22 },
  { name:'Watch', value:80, risk:32 },
  { name:'Sunglass Case', value:6, risk:5 },
  { name:'Bluetooth Earbuds', value:70, risk:30 },
  { name:'Portable SSD', value:95, risk:38 },
  { name:'Graphic Tee', value:22, risk:14 },
  { name:'Belt', value:14, risk:10 },
  { name:'Cologne', value:45, risk:22 },
  { name:'Lipstick', value:10, risk:8 },
  { name:'Camera SD Card', value:18, risk:12 },
  { name:'Phone Case', value:12, risk:9 },
  { name:'Board Game', value:26, risk:16 },
  { name:'VR Game', value:40, risk:22 },
  { name:'Cooking Knife', value:20, risk:14 },
  { name:'Car Freshener', value:5, risk:4 },
  { name:'Sports Jersey', value:65, risk:28 },
  { name:'Action Figure', value:24, risk:15 },
  { name:'Smart Bulb', value:18, risk:12 },
  { name:'Video Game', value:60, risk:28 },
];

const HEIST_CREW_POOL = [
  { id:'rook_driver',  role:'Driver', skill:30, cut:6 },
  { id:'rook_gun',     role:'Gunman', skill:35, cut:6 },
  { id:'rook_hack',    role:'Hacker', skill:30, cut:7 },
  { id:'pro_driver',   role:'Driver', skill:60, cut:10 },
  { id:'pro_gun',      role:'Gunman', skill:65, cut:10 },
  { id:'pro_hack',     role:'Hacker', skill:70, cut:12 },
  { id:'elite_driver', role:'Driver', skill:85, cut:16 },
  { id:'elite_gun',    role:'Gunman', skill:85, cut:16 },
  { id:'elite_hack',   role:'Hacker', skill:90, cut:18 },
];

const HEIST_LOCATIONS = [
  { id:'armored', label:'Armored Van', payout:80000, heat:12, minNotoriety:0, roles:['Driver','Gunman'] },
  { id:'jewelry', label:'Jewelry Store', payout:160000, heat:18, minNotoriety:8, roles:['Driver','Gunman'] },
  { id:'smallbank', label:'Small Bank', payout:240000, heat:22, minNotoriety:15, roles:['Driver','Gunman','Hacker'] },
  { id:'casino', label:'Casino Backroom', payout:450000, heat:28, minNotoriety:25, roles:['Driver','Gunman','Hacker'] },
  { id:'art', label:'Art Gallery', payout:600000, heat:32, minNotoriety:35, roles:['Driver','Gunman','Hacker'] },
  { id:'vault', label:'Private Vault', payout:900000, heat:40, minNotoriety:55, roles:['Driver','Gunman','Hacker'] },
];

const GANG_ARCHETYPES = [
  { id:'set', label:'Set-Based Urban Crew', colors:'Red/Blue', symbol:'🟥', style:'Reputation-driven', conflict:0.8, loyalty:0.7, income:0.5 },
  { id:'local', label:'Neighborhood Crew', colors:'Black/Gray', symbol:'⚫', style:'Survival-focused', conflict:0.6, loyalty:0.4, income:0.3 },
  { id:'hustle', label:'Hustle Crew', colors:'Gold', symbol:'💰', style:'Profit-focused', conflict:0.5, loyalty:0.3, income:0.7 },
  { id:'clout', label:'Culture/Clout Crew', colors:'Neon', symbol:'🎤', style:'Viral identity', conflict:0.7, loyalty:0.5, income:0.4 },
];

// Drug ecosystem catalog (trade-focused).
// profit: rough per-unit margin in the ecosystem loop.
// heatMult: how much law-enforcement pressure each unit tends to create.
// addictionRate: per-use pressure toward dependence.
// socialImpact: how strongly use harms social stability / reputation.
const DRUG_TYPES = [
  { id:'marijuana', label:'Marijuana', profit:210, heatMult:0.55, addictionRate:0.06, socialImpact:0.10, violence:0.08, fatality:0.002 },
  { id:'cocaine',   label:'Cocaine',   profit:620, heatMult:1.05, addictionRate:0.19, socialImpact:0.32, violence:0.22, fatality:0.010 },
  { id:'heroin',    label:'Heroin',    profit:780, heatMult:1.30, addictionRate:0.34, socialImpact:0.58, violence:0.30, fatality:0.030 },
  { id:'meth',      label:'Meth',      profit:730, heatMult:1.38, addictionRate:0.31, socialImpact:0.62, violence:0.44, fatality:0.025 },
  { id:'speed',     label:'Speed',     profit:460, heatMult:0.95, addictionRate:0.17, socialImpact:0.24, violence:0.18, fatality:0.008 },
  { id:'fentanyl',  label:'Fentanyl',  profit:980, heatMult:1.85, addictionRate:0.40, socialImpact:0.78, violence:0.55, fatality:0.090 },
];

const HALLUCINOGEN_TYPES = [
  { id:'mushrooms', label:'Mushrooms', icon:'🍄', price:[80,240], mindSwing:[-8,12], stressSwing:[-16,8], healthSwing:[-4,2] },
  { id:'lsd',       label:'LSD',       icon:'🧪', price:[120,320], mindSwing:[-12,14], stressSwing:[-18,10], healthSwing:[-5,1] },
  { id:'salvia',    label:'Salvia',    icon:'🌿', price:[60,190], mindSwing:[-16,10], stressSwing:[-12,14], healthSwing:[-6,0] },
  { id:'dmt',       label:'DMT',       icon:'🌀', price:[180,420], mindSwing:[-18,18], stressSwing:[-20,12], healthSwing:[-7,1] },
];

const HALLUCINOGEN_TRIP_EVENTS = [
  { msg:'You are certain you crossed into another dimension and forgot to bring your body.', tone:'warn' },
  { msg:'Time loops the same 20 seconds until you negotiate peace with a lamp.', tone:'warn' },
  { msg:'An imaginary entity gives you life advice. Half of it is brilliant. Half is nonsense.', tone:'warn' },
  { msg:'The room turns into a low-budget sci-fi bridge. You are somehow the captain.', tone:'good' },
  { msg:'You explain the universe to a houseplant. The plant seems unconvinced.', tone:'warn' },
  { msg:'Every sound looks like geometry for a while. Very profound. Very impractical.', tone:'warn' },
];
const MAFIA_RANKS = ['Associate','Soldier','Caporegime','Underboss','Boss'];
const MAFIA_RACKETS = [
  { id:'extort', label:'Extortion', income:1200, heat:6, risk:0.2 },
  { id:'loan', label:'Loan Sharking', income:1800, heat:8, risk:0.25 },
  { id:'gamble', label:'Gambling Ops', income:2200, heat:10, risk:0.3 },
  { id:'drugs', label:'Drug Distribution', income:3000, heat:16, risk:0.4 },
  { id:'launder', label:'Money Laundering', income:4200, heat:6, risk:0.15 },
];

const CAR_LIST = [
  'Vortex','Nebula','Tempest','Falcon','Nova','Spectre','Aurora','Ranger','Cobra','Vandal',
  'Coyote','Atlas','Comet','Phantom','Blaze','Rogue','Cipher','Riptide','Shadow','Stingray',
  'Monarch','Bullet','Sable','Drifter','Crossfire','Sentinel','Titan','Nomad','Eclipse','Mirage',
  'Strider','Cruiser','Raptor','Voltage','Siren','Wraith','Meteor','Harrier','Viper','Cyclone'
];
const HOME_OPTIONS = [
  { id:'starter', label:'Starter Home', price:220000, downPct:0.08, years:30, rate:0.055, minCredit:660, comfort:65, neighborhood:62 },
  { id:'family',  label:'Family Home',  price:420000, downPct:0.1,  years:30, rate:0.052, minCredit:690, comfort:75, neighborhood:70 },
  { id:'estate',  label:'Estate',       price:850000, downPct:0.15, years:30, rate:0.05,  minCredit:730, comfort:85, neighborhood:78 },
];

const ROOMMATE_EVENTS = [
  { msg:'Roommate ate your leftovers again. You stared into the empty container and felt betrayal.', happy:-3, comfort:-2 },
  { msg:'You and your roommate split chores fairly this week. Rare and beautiful.', happy:3, comfort:2 },
  { msg:'Roommate brought friends over unannounced. Your room is now a public space.', happy:-2, comfort:-3 },
  { msg:'You had a late-night heart-to-heart with your roommate. It was… nice.', happy:4, comfort:2 },
  { msg:'Bills were late because your roommate forgot to pay. You covered it.', happy:-2, comfort:-1 },
];

const NEIGHBORHOOD_EVENTS = [
  { msg:'A new coffee shop opened nearby. The area feels livelier.', comfort:3, neighborhood:4, value:2 },
  { msg:'A string of car break-ins hit the block. People are on edge.', comfort:-4, neighborhood:-6, value:-3 },
  { msg:'Community cleanup day brought neighbors together.', comfort:2, neighborhood:3, value:1 },
  { msg:'Loud construction all summer. Dust everywhere.', comfort:-3, neighborhood:-2, value:0 },
  { msg:'A local park got renovated. It actually looks nice.', comfort:3, neighborhood:4, value:2 },
  { msg:'A nearby business closed. The street feels quieter.', comfort:-1, neighborhood:-2, value:-2 },
];

const HOME_UPGRADES = [
  { id:'furnish', label:'Furnish Home', cost:1500, comfort:6 },
  { id:'appliances', label:'Upgrade Appliances', cost:2500, comfort:8 },
  { id:'decor', label:'Interior Decor', cost:1200, comfort:5 },
  { id:'security', label:'Home Security', cost:1800, neighborhood:4 },
  { id:'reno', label:'Renovate', cost:8000, comfort:12 },
];

