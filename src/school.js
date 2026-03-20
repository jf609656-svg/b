// ══ school.js ══
// ═══════════════════════════════════════════════════════════════
//  school.js — Elementary · Middle · High School · College
//  Full sports pipeline: HS → College Recruiting → Draft Eligible
// ═══════════════════════════════════════════════════════════════

// ── FOOTBALL POSITIONS ───────────────────────────────────────────
const FB_POSITIONS = ['QB','RB','WR','TE','OL','DE','DT','LB','CB','S','K'];
const BB_POSITIONS = ['PG','SG','SF','PF','C'];

// ── REAL COLLEGE DATABASE ────────────────────────────────────────
// Each entry: { name, tier, sportsTier, minGPA, minSAT, tuition, prestige,
//               strongMajors[], researchInstitution, ivyLeague, conf }
const REAL_COLLEGES = [
  // ── Ivy League & Elite Academic ──────────────────────────────
  { name:'Harvard University',          tier:'ivyplus', sportsTier:'mid',   minGPA:3.9, minSAT:1510, tuition:57000, prestige:100, strongMajors:['Law','Medicine','Business','Computer Science','Economics'], researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'MIT',                         tier:'ivyplus', sportsTier:'mid',   minGPA:3.9, minSAT:1520, tuition:57000, prestige:100, strongMajors:['Engineering','Computer Science','Physics','Mathematics'],  researchInstitution:true,  ivyLeague:false, conf:'Independent' },
  { name:'Yale University',             tier:'ivyplus', sportsTier:'mid',   minGPA:3.9, minSAT:1500, tuition:59000, prestige:99,  strongMajors:['Law','Political Science','Arts','Medicine'],               researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Princeton University',        tier:'ivyplus', sportsTier:'mid',   minGPA:3.9, minSAT:1510, tuition:56000, prestige:99,  strongMajors:['Engineering','Mathematics','Economics','Computer Science'], researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Columbia University',         tier:'ivyplus', sportsTier:'mid',   minGPA:3.8, minSAT:1490, tuition:63000, prestige:98,  strongMajors:['Business','Journalism','Law','Engineering'],               researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'University of Pennsylvania',  tier:'ivyplus', sportsTier:'mid',   minGPA:3.8, minSAT:1490, tuition:62000, prestige:97,  strongMajors:['Business','Medicine','Nursing','Engineering'],             researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Brown University',            tier:'ivyplus', sportsTier:'mid',   minGPA:3.8, minSAT:1480, tuition:61000, prestige:96,  strongMajors:['Medicine','Computer Science','Arts'],                      researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Dartmouth College',           tier:'ivyplus', sportsTier:'mid',   minGPA:3.8, minSAT:1480, tuition:60000, prestige:95,  strongMajors:['Business','Engineering','Medicine'],                       researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Cornell University',          tier:'ivyplus', sportsTier:'mid',   minGPA:3.8, minSAT:1480, tuition:62000, prestige:95,  strongMajors:['Engineering','Architecture','Business','Nursing'],         researchInstitution:true,  ivyLeague:true,  conf:'Ivy League' },
  { name:'Stanford University',         tier:'ivyplus', sportsTier:'elite', minGPA:3.8, minSAT:1480, tuition:57000, prestige:98,  strongMajors:['Computer Science','Engineering','Business','Medicine'],     researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'Duke University',             tier:'elite',   sportsTier:'elite', minGPA:3.7, minSAT:1450, tuition:60000, prestige:93,  strongMajors:['Medicine','Business','Engineering','Law'],                 researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'University of Chicago',       tier:'elite',   sportsTier:'small', minGPA:3.8, minSAT:1480, tuition:62000, prestige:96,  strongMajors:['Economics','Law','Mathematics','Business'],                researchInstitution:true,  ivyLeague:false, conf:'University Athletic Association' },
  { name:'Northwestern University',     tier:'elite',   sportsTier:'good',  minGPA:3.7, minSAT:1460, tuition:60000, prestige:93,  strongMajors:['Journalism','Engineering','Law','Business'],               researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'Johns Hopkins University',    tier:'elite',   sportsTier:'small', minGPA:3.8, minSAT:1470, tuition:60000, prestige:94,  strongMajors:['Medicine','Public Health','Nursing','Engineering'],        researchInstitution:true,  ivyLeague:false, conf:'Centennial Conference' },
  { name:'Vanderbilt University',       tier:'elite',   sportsTier:'good',  minGPA:3.7, minSAT:1450, tuition:59000, prestige:91,  strongMajors:['Medicine','Law','Engineering','Education'],                researchInstitution:true,  ivyLeague:false, conf:'SEC' },
  { name:'Georgetown University',       tier:'elite',   sportsTier:'good',  minGPA:3.7, minSAT:1440, tuition:59000, prestige:90,  strongMajors:['Law','Political Science','Business','Medicine'],           researchInstitution:true,  ivyLeague:false, conf:'Big East' },
  { name:'Carnegie Mellon University',  tier:'elite',   sportsTier:'small', minGPA:3.7, minSAT:1460, tuition:58000, prestige:90,  strongMajors:['Computer Science','Engineering','Business','Arts'],        researchInstitution:true,  ivyLeague:false, conf:'UAA' },
  { name:'Notre Dame',                  tier:'elite',   sportsTier:'elite', minGPA:3.7, minSAT:1440, tuition:58000, prestige:89,  strongMajors:['Business','Law','Engineering','Political Science'],        researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  // ── Flagship State Universities ───────────────────────────────
  { name:'UC Berkeley',                 tier:'prestige',sportsTier:'good',  minGPA:3.7, minSAT:1390, tuition:44000, prestige:88,  strongMajors:['Engineering','Computer Science','Business','Law'],        researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'UCLA',                        tier:'prestige',sportsTier:'elite', minGPA:3.6, minSAT:1350, tuition:43000, prestige:85,  strongMajors:['Film','Medicine','Business','Engineering'],                researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'University of Michigan',      tier:'prestige',sportsTier:'elite', minGPA:3.6, minSAT:1360, tuition:51000, prestige:84,  strongMajors:['Engineering','Business','Law','Medicine'],                researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'University of Virginia',      tier:'prestige',sportsTier:'good',  minGPA:3.6, minSAT:1360, tuition:52000, prestige:83,  strongMajors:['Business','Law','Political Science','Medicine'],          researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'University of North Carolina',tier:'prestige',sportsTier:'elite', minGPA:3.5, minSAT:1310, tuition:37000, prestige:80,  strongMajors:['Business','Journalism','Medicine','Law'],                 researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'Georgia Tech',                tier:'prestige',sportsTier:'good',  minGPA:3.6, minSAT:1390, tuition:34000, prestige:82,  strongMajors:['Engineering','Computer Science','Business'],              researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'University of Texas',         tier:'prestige',sportsTier:'elite', minGPA:3.5, minSAT:1280, tuition:37000, prestige:78,  strongMajors:['Business','Law','Engineering','Computer Science'],        researchInstitution:true,  ivyLeague:false, conf:'SEC' },
  { name:'Ohio State University',       tier:'prestige',sportsTier:'elite', minGPA:3.4, minSAT:1250, tuition:31000, prestige:75,  strongMajors:['Business','Engineering','Medicine','Education'],          researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'Penn State',                  tier:'prestige',sportsTier:'elite', minGPA:3.3, minSAT:1220, tuition:35000, prestige:73,  strongMajors:['Business','Engineering','Psychology','Education'],        researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'University of Wisconsin',     tier:'prestige',sportsTier:'good',  minGPA:3.4, minSAT:1250, tuition:37000, prestige:74,  strongMajors:['Engineering','Business','Agriculture','Medicine'],        researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'USC',                         tier:'prestige',sportsTier:'elite', minGPA:3.5, minSAT:1320, tuition:63000, prestige:77,  strongMajors:['Film','Business','Engineering','Communication'],          researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'University of Florida',       tier:'prestige',sportsTier:'elite', minGPA:3.4, minSAT:1250, tuition:29000, prestige:73,  strongMajors:['Engineering','Business','Agriculture','Medicine'],        researchInstitution:true,  ivyLeague:false, conf:'SEC' },
  { name:'University of Georgia',       tier:'good',    sportsTier:'elite', minGPA:3.3, minSAT:1210, tuition:29000, prestige:70,  strongMajors:['Business','Agriculture','Journalism','Education'],        researchInstitution:false, ivyLeague:false, conf:'SEC' },
  { name:'University of Alabama',       tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1150, tuition:26000, prestige:65,  strongMajors:['Business','Engineering','Education','Nursing'],          researchInstitution:false, ivyLeague:false, conf:'SEC' },
  { name:'LSU',                         tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1130, tuition:27000, prestige:64,  strongMajors:['Business','Engineering','Agriculture','Education'],       researchInstitution:false, ivyLeague:false, conf:'SEC' },
  { name:'Auburn University',           tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1130, tuition:32000, prestige:63,  strongMajors:['Engineering','Business','Agriculture','Nursing'],        researchInstitution:false, ivyLeague:false, conf:'SEC' },
  { name:'Tennessee',                   tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1120, tuition:29000, prestige:62,  strongMajors:['Business','Engineering','Nursing','Education'],          researchInstitution:false, ivyLeague:false, conf:'SEC' },
  { name:'Michigan State',              tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1130, tuition:30000, prestige:65,  strongMajors:['Agriculture','Business','Engineering','Education'],       researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'Iowa',                        tier:'good',    sportsTier:'good',  minGPA:2.9, minSAT:1100, tuition:31000, prestige:63,  strongMajors:['Nursing','Business','Engineering','Education'],          researchInstitution:true,  ivyLeague:false, conf:'Big Ten' },
  { name:'Oregon',                      tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1120, tuition:35000, prestige:65,  strongMajors:['Business','Computer Science','Arts','Education'],        researchInstitution:false, ivyLeague:false, conf:'Big Ten' },
  { name:'Clemson',                     tier:'good',    sportsTier:'elite', minGPA:3.2, minSAT:1160, tuition:38000, prestige:67,  strongMajors:['Engineering','Business','Computer Science','Education'],  researchInstitution:false, ivyLeague:false, conf:'ACC' },
  { name:'Oklahoma',                    tier:'good',    sportsTier:'elite', minGPA:3.0, minSAT:1130, tuition:28000, prestige:64,  strongMajors:['Business','Engineering','Education','Nursing'],          researchInstitution:false, ivyLeague:false, conf:'SEC' },
  // ── Strong Academic, Mid Sports ──────────────────────────────
  { name:'Boston University',           tier:'good',    sportsTier:'mid',   minGPA:3.5, minSAT:1290, tuition:58000, prestige:78,  strongMajors:['Business','Engineering','Law','Medicine'],               researchInstitution:true,  ivyLeague:false, conf:'Patriot League' },
  { name:'Tulane University',           tier:'good',    sportsTier:'mid',   minGPA:3.4, minSAT:1280, tuition:57000, prestige:76,  strongMajors:['Business','Law','Medicine','Engineering'],               researchInstitution:true,  ivyLeague:false, conf:'AAC' },
  { name:'Emory University',            tier:'elite',   sportsTier:'small', minGPA:3.7, minSAT:1430, tuition:57000, prestige:88,  strongMajors:['Medicine','Business','Law','Public Health'],              researchInstitution:true,  ivyLeague:false, conf:'UAA' },
  { name:'Wake Forest',                 tier:'good',    sportsTier:'good',  minGPA:3.5, minSAT:1310, tuition:59000, prestige:80,  strongMajors:['Business','Law','Medicine','Political Science'],         researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  { name:'University of Miami',         tier:'good',    sportsTier:'good',  minGPA:3.3, minSAT:1230, tuition:52000, prestige:71,  strongMajors:['Business','Music','Engineering','Law'],                  researchInstitution:true,  ivyLeague:false, conf:'ACC' },
  // ── Mid-Tier Universities ─────────────────────────────────────
  { name:'Arizona State University',    tier:'mid',     sportsTier:'good',  minGPA:2.8, minSAT:1060, tuition:28000, prestige:58,  strongMajors:['Business','Engineering','Journalism','Education'],       researchInstitution:true,  ivyLeague:false, conf:'Big 12' },
  { name:'University of Arizona',       tier:'mid',     sportsTier:'good',  minGPA:2.7, minSAT:1030, tuition:34000, prestige:56,  strongMajors:['Medicine','Engineering','Business','Nursing'],           researchInstitution:true,  ivyLeague:false, conf:'Big 12' },
  { name:'Colorado State',              tier:'mid',     sportsTier:'mid',   minGPA:2.8, minSAT:1040, tuition:28000, prestige:55,  strongMajors:['Agriculture','Engineering','Business','Education'],      researchInstitution:false, ivyLeague:false, conf:'Mountain West' },
  { name:'Kansas State',                tier:'mid',     sportsTier:'good',  minGPA:2.8, minSAT:1020, tuition:24000, prestige:55,  strongMajors:['Agriculture','Engineering','Business','Nursing'],        researchInstitution:false, ivyLeague:false, conf:'Big 12' },
  { name:'Boise State',                 tier:'mid',     sportsTier:'good',  minGPA:2.6, minSAT:980,  tuition:22000, prestige:50,  strongMajors:['Business','Education','Engineering','Nursing'],          researchInstitution:false, ivyLeague:false, conf:'Mountain West' },
  { name:'UCF',                         tier:'mid',     sportsTier:'good',  minGPA:2.9, minSAT:1090, tuition:22000, prestige:58,  strongMajors:['Engineering','Business','Computer Science','Education'],  researchInstitution:false, ivyLeague:false, conf:'Big 12' },
  { name:'SMU',                         tier:'mid',     sportsTier:'mid',   minGPA:3.3, minSAT:1200, tuition:58000, prestige:70,  strongMajors:['Business','Law','Engineering','Education'],              researchInstitution:false, ivyLeague:false, conf:'ACC' },
  { name:'University of Houston',       tier:'mid',     sportsTier:'mid',   minGPA:2.9, minSAT:1060, tuition:23000, prestige:57,  strongMajors:['Engineering','Business','Education','Nursing'],          researchInstitution:true,  ivyLeague:false, conf:'Big 12' },
  // ── Community / Small ─────────────────────────────────────────
  { name:'South Dakota State',          tier:'small',   sportsTier:'small', minGPA:2.0, minSAT:900,  tuition:11000, prestige:35,  strongMajors:['Agriculture','Nursing','Education','Engineering'],       researchInstitution:false, ivyLeague:false, conf:'Missouri Valley' },
  { name:'Villanova University',        tier:'good',    sportsTier:'mid',   minGPA:3.4, minSAT:1270, tuition:57000, prestige:78,  strongMajors:['Business','Nursing','Engineering','Law'],                researchInstitution:false, ivyLeague:false, conf:'Big East' },
  { name:'James Madison University',    tier:'small',   sportsTier:'small', minGPA:2.8, minSAT:1040, tuition:27000, prestige:52,  strongMajors:['Business','Education','Nursing','Communication'],        researchInstitution:false, ivyLeague:false, conf:'Sun Belt' },
  { name:'Montana State',               tier:'small',   sportsTier:'small', minGPA:2.5, minSAT:960,  tuition:22000, prestige:40,  strongMajors:['Agriculture','Engineering','Nursing','Education'],       researchInstitution:false, ivyLeague:false, conf:'Big Sky' },
  { name:'UNLV',                        tier:'mid',     sportsTier:'mid',   minGPA:2.6, minSAT:960,  tuition:22000, prestige:48,  strongMajors:['Business','Hospitality','Education','Nursing'],          researchInstitution:false, ivyLeague:false, conf:'Mountain West' },
];

// Convenience lookup maps
const COLLEGE_BY_NAME = Object.fromEntries(REAL_COLLEGES.map(c=>[c.name,c]));

function collegeTierForSchool(name){
  const c = COLLEGE_BY_NAME[name];
  return c ? c.sportsTier : 'mid';
}
function collegeAcademicTier(name){
  const c = COLLEGE_BY_NAME[name];
  return c ? c.tier : 'mid';
}

function schoolEncodeArg(v){
  return encodeURIComponent(String(v||''));
}

function schoolDecodeArg(v){
  try{
    return decodeURIComponent(v||'');
  }catch(_e){
    return String(v||'');
  }
}

function schoolActEncoded(role, action, encodedName){
  schoolAct(role, action, schoolDecodeArg(encodedName));
}

function pickCollegeMajorEncoded(encodedCollege){
  pickCollegeMajor(schoolDecodeArg(encodedCollege));
}

function enrollCollegeEncoded(encodedCourse, encodedCollege){
  enrollCollege(schoolDecodeArg(encodedCourse), schoolDecodeArg(encodedCollege));
}

// Legacy compat shim
const COLLEGE_TIERS = {
  elite:  { label:'Elite Program', conferences:['SEC','Big Ten','ACC','Big 12'],  prestige:95, scholarshipChance:0.9, draftBoost:0.25, nflBoost:0.3, nbaBoost:0.3 },
  good:   { label:'Power 5',       conferences:['SEC','Big Ten','ACC','Big 12'],  prestige:75, scholarshipChance:0.7, draftBoost:0.15, nflBoost:0.2, nbaBoost:0.2 },
  mid:    { label:'Mid-Major',     conferences:['AAC','Mountain West','Sun Belt'],prestige:50, scholarshipChance:0.5, draftBoost:0.05, nflBoost:0.1, nbaBoost:0.1 },
  small:  { label:'Small College', conferences:['Big South','NEC','SWAC','MEAC'], prestige:25, scholarshipChance:0.2, draftBoost:0,    nflBoost:0.05,nbaBoost:0.05 },
};
const COLLEGES = {
  elite: REAL_COLLEGES.filter(c=>c.sportsTier==='elite').map(c=>c.name),
  good:  REAL_COLLEGES.filter(c=>c.sportsTier==='good').map(c=>c.name),
  mid:   REAL_COLLEGES.filter(c=>c.sportsTier==='mid').map(c=>c.name),
  small: REAL_COLLEGES.filter(c=>c.sportsTier==='small').map(c=>c.name),
};

// ── FRAT NAMES ────────────────────────────────────────────────────
const FRAT_NAMES = [
  'Sigma Alpha Epsilon','Delta Tau Delta','Phi Kappa Psi','Beta Theta Pi','Kappa Sigma',
  'Lambda Chi Alpha','Sigma Chi','Phi Gamma Delta (FIJI)','Delta Upsilon','Pi Kappa Alpha',
  'Sigma Nu','Alpha Epsilon Pi','Phi Delta Theta','Tau Kappa Epsilon','Sigma Phi Epsilon',
  'Zeta Beta Tau','Alpha Tau Omega','Chi Phi','Theta Chi','Delta Chi',
];

const SORORITY_NAMES = [
  'Delta Delta Delta','Kappa Kappa Gamma','Alpha Chi Omega','Chi Omega','Kappa Delta',
  'Phi Mu','Alpha Delta Pi','Gamma Phi Beta','Delta Phi Epsilon','Sigma Kappa',
  'Alpha Phi','Pi Beta Phi','Zeta Tau Alpha','Alpha Sigma Tau','Theta Phi Alpha',
];

// ── GPA HELPERS ──────────────────────────────────────────────────
const GPA_LABEL = g => g>=3.7?'A / Honor Roll':g>=3.0?'B / Above Average':g>=2.0?'C / Average':g>=1.0?'D / Barely Passing':'F / Failing';
const GPA_COLOR = g => g>=3.7?'var(--accent)':g>=3.0?'var(--gold)':g>=2.0?'var(--text)':'var(--danger)';

// ── FRAT PARTY EVENTS ────────────────────────────────────────────
const FRAT_EVENTS = [
  { msg:'Jungle juice. Unknown ingredients. You woke up in the yard. Legendary.', happyD:18, healthD:-12, repD:20, dark:1, type:'warn' },
  { msg:'The frat house got put on probation. Technically your fault. Nobody can prove it.', happyD:10, healthD:-5, repD:-8, dark:1, type:'bad' },
  { msg:'Hazing week. You did everything they asked. You have stories now. You will never tell them.', happyD:8, healthD:-15, repD:12, dark:2, type:'warn' },
  { msg:'Philanthropy event. You raised $4,000. You also drank the whole time. Net positive.', happyD:12, healthD:-6, repD:18, dark:0, type:'good' },
  { msg:'Date function at a themed venue. The costume was a choice. You committed.', happyD:15, healthD:-4, repD:8, dark:0, type:'love' },
  { msg:'Chapter meeting devolved into chaos. Three people almost quit. Nothing was resolved. Business as usual.', happyD:5, healthD:0, repD:0, dark:0, type:'warn' },
  { msg:'Road trip to away game. Eleven people in one van. One traffic stop. Zero arrests. Barely.', happyD:14, healthD:-8, repD:10, dark:0, type:'warn' },
  { msg:'You threw a rager that violated every noise ordinance. Cops came twice. You moved the party inside. Continued.', happyD:16, healthD:-10, repD:22, dark:1, type:'warn' },
  { msg:'Formal dinner. Suits, ties, open bar. Someone cried. It wasn\'t you. This time.', happyD:10, healthD:-5, repD:6, dark:0, type:'love' },
  { msg:'Secret initiation ritual. What happened stays in the lodge. The bond: real.', happyD:8, healthD:-3, repD:14, dark:1, type:'warn' },
  { msg:'Spring Break house rental. Seven days. Zero sleep. Medical bills: modest.', happyD:22, healthD:-18, repD:20, dark:1, type:'love' },
  { msg:'You were elected to a frat office. Treasurer. You immediately regretted it. The spreadsheets are a mess.', happyD:6, healthD:0, repD:10, dark:0, type:'good' },
  { msg:'Bro code tested. You upheld it. The situation was complicated. You\'d do it again.', happyD:8, healthD:0, repD:12, dark:0, type:'good' },
  { msg:'House inspection failed. Every single category. You were there when they arrived. Still failed.', happyD:-5, healthD:0, repD:-10, dark:0, type:'bad' },
  { msg:'Beef with rival frat escalated to prank war. Yours was better. The evidence is destroyed.', happyD:14, healthD:-4, repD:16, dark:1, type:'warn' },
];


// ── COLLEGE ATHLETE STATS EVENTS ─────────────────────────────────
const COLLEGE_FB_EVENTS = [
  'You torched the defense for {stat} yards. Film sessions: reverent.',
  'You put up {stat} yards and the whole stadium knew your name by the 4th quarter.',
  'Scouts in attendance. You had {stat} yards. They wrote things down.',
  'You scored {stat} touchdowns in the bowl game. Career-defining.',
  '{stat} yards rushing and a walk-off TD. The student section stormed the field.',
  'You threw for {stat} yards and zero picks. The coach shook your hand after.',
  'Blocked a field goal in the final seconds. {stat} fans on the field.',
  '{stat} tackles. Defense of the year conversation starting.',
];

const COLLEGE_BB_EVENTS = [
  'You dropped {stat} points and the gym was deafening.',
  '{stat} points, 8 rebounds, 5 assists. Someone posted the stat line and it went viral.',
  'March Madness run. You had {stat} points in the second half. Your jersey is everywhere now.',
  'NBA scouts at every game. You put up {stat} in front of all of them.',
  '{stat} assists, no turnovers. The point guard conversation has a new candidate.',
  'Conference tournament. {stat} points in the overtime win. Trending nationally.',
  'You grabbed {stat} rebounds in the national semifinal. Draft boards updated live.',
];

// ── RECRUITING POOLS ─────────────────────────────────────────────
function getRecruitingStars(S){
  // Based on HS performance
  const wins = S.bigGameWins;
  const mvp  = S.sportMVP;
  const al   = S.stateLine;
  const sport= S.sport;
  let stars = 1;
  if(wins>=1) stars++;
  if(wins>=3) stars++;
  if(mvp)     stars++;
  if(al==='All-State') stars = Math.min(5, stars+1);
  if(sport==='football' && S.football.heisman) stars = 5;
  if(sport==='basketball' && S.basketball.allState) stars = Math.min(5, stars+1);
  return Math.min(5, stars);
}

function generateRecruitingOffers(stars, sport){
  const offers = [];
  if(stars>=5){
    offers.push(...pick2(COLLEGES.elite,3));
    offers.push(...pick2(COLLEGES.good,2));
  } else if(stars>=4){
    offers.push(...pick2(COLLEGES.elite,1));
    offers.push(...pick2(COLLEGES.good,3));
    offers.push(...pick2(COLLEGES.mid,1));
  } else if(stars>=3){
    offers.push(...pick2(COLLEGES.good,2));
    offers.push(...pick2(COLLEGES.mid,3));
  } else if(stars>=2){
    offers.push(...pick2(COLLEGES.mid,2));
    offers.push(...pick2(COLLEGES.small,2));
  } else {
    offers.push(...pick2(COLLEGES.small,2));
  }
  return offers;
}

function pick2(arr, n){ // pick n unique items
  const copy = [...arr]; const out = [];
  for(let i=0;i<Math.min(n,copy.length);i++){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

function collegeTierForSchool(name){
  if(COLLEGES.elite.includes(name)) return 'elite';
  if(COLLEGES.good.includes(name))  return 'good';
  if(COLLEGES.mid.includes(name))   return 'mid';
  return 'small';
}

// ── RENDER SCHOOL ────────────────────────────────────────────────
function renderSchool(){
  const sc = document.getElementById('school-content');
  const a  = G.age;
  const S  = G.school;

  if(a<5){
    sc.innerHTML=`<div class="notif warn">You're ${a} — too young for school.</div>`; return;
  }
  if(S.expelled){
    sc.innerHTML=`<div class="card"><div class="card-title">School Status</div>
      <div class="notif bad">You were expelled. Focus on work, social life, or activities.</div></div>`;
    return;
  }
  if(a<=10){ renderElementary(sc); return; }
  if(a<=13){ renderMiddle(sc); return; }
  if(a<=17){ renderHighSchool(sc); return; }
  if(S.uni.enrolled){ ensureUniState(); renderUni(sc); return; }
  if(G.career.medSchool.enrolled || G.career.lawSchool.enrolled){ renderGradSchool(sc); return; }
  if(a===18){ renderPostHS(sc); return; }
  sc.innerHTML=`<div class="notif">Past school age. Keep growing via Activities.</div>`;
}

function ensureUniState(){
  if(!G.school) return;
  if(!G.school.uni) G.school.uni = {};
  const u = G.school.uni;
  if(typeof u.enrolled!=='boolean') u.enrolled = false;
  if(typeof u.course!=='string') u.course = '';
  if(typeof u.year!=='number') u.year = 1;
  if(typeof u.gpa!=='number') u.gpa = 2.5;
  if(typeof u.honors!=='boolean') u.honors = false;
  if(!Array.isArray(u.clubs)) u.clubs = [];
  if(typeof u.hasResearch!=='boolean') u.hasResearch = false;
  if(typeof u.sport!=='string') u.sport = null;
  if(typeof u.sportYears!=='number') u.sportYears = 0;
  if(typeof u.sportConference!=='string') u.sportConference = 'Independent';
  if(typeof u.collegeName!=='string') u.collegeName = 'State University';
  if(typeof u.athleteStatus!=='string') u.athleteStatus = null;
  if(!u.athleteStats || typeof u.athleteStats!=='object') u.athleteStats = {td:0,yds:0,pts:0,reb:0,ast:0,tackles:0};
  if(typeof u.allConference!=='boolean') u.allConference = false;
  if(typeof u.allAmerican!=='boolean') u.allAmerican = false;
  if(typeof u.heisman!=='boolean') u.heisman = false;
  if(typeof u.nationalChamp!=='boolean') u.nationalChamp = false;
  if(typeof u.draftEligible!=='boolean') u.draftEligible = false;
  if(typeof u.draftDeclared!=='boolean') u.draftDeclared = false;
  if(typeof u.draftRound!=='number' && u.draftRound!==null) u.draftRound = null;
  if(typeof u.draftPick!=='number' && u.draftPick!==null) u.draftPick = null;
  if(typeof u.draftTeam!=='string' && u.draftTeam!==null) u.draftTeam = null;
  if(typeof u.nflDraftable!=='boolean') u.nflDraftable = false;
  if(typeof u.nbaNextStep!=='boolean') u.nbaNextStep = false;
  if(typeof u.frat!=='string' && u.frat!==null) u.frat = null;
  if(typeof u.fratRank!=='string' && u.fratRank!==null) u.fratRank = null;
  if(typeof u.fratRep!=='number') u.fratRep = 0;
  if(typeof u.campusCrush!=='string' && u.campusCrush!==null) u.campusCrush = null;
  if(typeof u.academicProbation!=='boolean') u.academicProbation = false;
  if(typeof u.researchInstitution!=='boolean') u.researchInstitution = false;
  if(typeof u.collegePrestige!=='number') u.collegePrestige = 60;
  if(typeof u.tuitionPerYear!=='number') u.tuitionPerYear = 30000;
  if(typeof u.activeResearch!=='string' && u.activeResearch!==null) u.activeResearch = null;
  if(!Array.isArray(u.researchComplete)) u.researchComplete = [];
  if(typeof u.careerUnlocked!=='string' && u.careerUnlocked!==null) u.careerUnlocked = null;
  if(typeof u.eliteSchool!=='boolean') u.eliteSchool = false;
  if(!Array.isArray(u.professors)) u.professors = [];
  if(!Array.isArray(u.classmates)) u.classmates = [];
  if(typeof u.discipline!=='number') u.discipline = 0;
}

// ── ELEMENTARY ──────────────────────────────────────────────────
function renderElementary(sc){
  const a = G.age;
  sc.innerHTML=`
  <div class="card">
    <div class="card-title">Elementary School · Grade ${a-4}</div>
    <p style="color:var(--muted2);font-size:.875rem;margin-bottom:14px">Reading, writing, and the brutal politics of recess.</p>
    <div class="choice-grid">
      <div class="choice" onclick="elemDo('study')"><div class="choice-icon">📚</div><div class="choice-name">Study Hard</div><div class="choice-desc">+Smarts</div></div>
      <div class="choice" onclick="elemDo('play')"><div class="choice-icon">⚽</div><div class="choice-name">Play Around</div><div class="choice-desc">+Happy</div></div>
      <div class="choice" onclick="elemDo('social')"><div class="choice-icon">🤝</div><div class="choice-name">Be Social</div><div class="choice-desc">+Happy · maybe +Friends</div></div>
      <div class="choice" onclick="elemDo('art')"><div class="choice-icon">🎨</div><div class="choice-name">Do Art</div><div class="choice-desc">+Smarts +Happy</div></div>
    </div>
  </div>`;
}

function elemDo(type){
  if(type==='study'){
    G.smarts=clamp(G.smarts+rnd(5,10));
    addEv('You studied diligently. Teacher put a star sticker on your paper.');
  } else if(type==='play'){
    G.happy=clamp(G.happy+rnd(7,12));
    addEv('Recess was a lawless paradise. You thrived.');
  } else if(type==='social'){
    G.happy=clamp(G.happy+rnd(5,8));
    if(Math.random()<.5){
      const p=makePerson('Friend'); p.age=G.age+rnd(-1,1); G.friends.push(p);
      addEv(`New friend: ${p.firstName}!`,'love');
    } else { addEv('You tried to make friends. It\'s a process.'); }
  } else if(type==='art'){
    G.smarts=clamp(G.smarts+rnd(3,6)); G.happy=clamp(G.happy+rnd(5,8));
    addEv('Art class was the highlight of your week. It stays on the fridge.');
  }
  updateHUD(); switchTab('life');
}

// ── MIDDLE SCHOOL ────────────────────────────────────────────────
function renderMiddle(sc){
  const a = G.age;
  sc.innerHTML=`
  <div class="card">
    <div class="card-title">Middle School · Grade ${a-5}</div>
    <p style="color:var(--muted2);font-size:.875rem;margin-bottom:14px">The social hierarchy is forming. Choose your lane.</p>
    <div class="choice-grid">
      <div class="choice" onclick="midDo('study')"><div class="choice-icon">📖</div><div class="choice-name">Hit the Books</div><div class="choice-desc">+GPA +Smarts</div></div>
      <div class="choice" onclick="midDo('sport')"><div class="choice-icon">🏀</div><div class="choice-name">Play Sports</div><div class="choice-desc">+Happy +Health</div></div>
      <div class="choice" onclick="midDo('rebel')"><div class="choice-icon">😈</div><div class="choice-name">Cause Trouble</div><div class="choice-desc">High risk, high reward</div></div>
      <div class="choice" onclick="midDo('image')"><div class="choice-icon">💅</div><div class="choice-name">Work on Image</div><div class="choice-desc">+Looks +Rep</div></div>
    </div>
  </div>`;
}

function midDo(type){
  if(type==='study'){
    G.smarts=clamp(G.smarts+rnd(6,13)); G.school.gpa=Math.min(4.0,G.school.gpa+0.18);
    addEv(`Focused on academics. GPA: ${G.school.gpa.toFixed(1)}.`);
  } else if(type==='sport'){
    G.health=clamp(G.health+rnd(5,10)); G.happy=clamp(G.happy+rnd(4,8));
    addEv('After-school sports. You\'re decent. Emphasis on decent.');
  } else if(type==='rebel'){
    if(Math.random()>.45){
      G.happy=clamp(G.happy+12); G.social.reputation=clamp(G.social.reputation+9);
      addEv('Your act of rebellion earned real street cred. 😈');
    } else {
      G.smarts=clamp(G.smarts-4); G.happy=clamp(G.happy-10); G.school.detentions++;
      addEv('Detention. Parents called. The look on their faces.','bad');
      flash('Detention! -Happy','bad');
    }
  } else if(type==='image'){
    G.looks=clamp(G.looks+rnd(3,7)); G.social.reputation=clamp(G.social.reputation+rnd(3,8));
    G.happy=clamp(G.happy+rnd(3,7));
    addEv('You worked on your look and social presence. People noticed.');
  }
  updateHUD(); switchTab('life');
}

// ══════════════════════════════════════════════════════════════════
//  HIGH SCHOOL — Full expanded system
// ══════════════════════════════════════════════════════════════════

function renderHighSchool(sc){
  const a    = G.age;
  const S    = G.school;
  ensureHSProfiles();
  const grade = {14:'Freshman',15:'Sophomore',16:'Junior',17:'Senior'}[a];
  const sport = S.sport ? HS_SPORTS.find(s=>s.id===S.sport) : null;
  const susp  = S.suspended ? `<div class="notif bad" style="margin-bottom:10px">⚠️ Currently suspended.</div>` : '';

  // Recruiting banner for athletes
  let recruitBanner = '';
  if(S.sport && a>=16 && S.recruitingStars>0){
    const stars = '⭐'.repeat(S.recruitingStars);
    recruitBanner = `<div class="notif good" style="margin-bottom:10px">
      🏈 ${stars} Recruit · ${S.recruitingOffers.length} college offer${S.recruitingOffers.length!==1?'s':''}
      ${S.stateLine?` · <strong style="color:var(--gold)">${S.stateLine}</strong>`:''}
    </div>`;
  }

  let html = `${susp}${recruitBanner}
  <div class="card">
    <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:14px">
      <div>
        <div style="font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);margin-bottom:4px">GPA</div>
        <div class="gpa-display" style="color:${GPA_COLOR(S.gpa)}">${S.gpa.toFixed(1)}</div>
        <div style="font-size:.7rem;color:${GPA_COLOR(S.gpa)};margin-top:2px">${GPA_LABEL(S.gpa)}</div>
      </div>
      ${sport?`<div>
        <div style="font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);margin-bottom:4px">Sport</div>
        <div style="font-family:var(--fh);font-weight:700;font-size:1rem">${sport.icon} ${sport.label}</div>
        ${S.sportMVP?'<div style="font-size:.7rem;color:var(--gold)">⭐ MVP</div>':''}
        ${S.sport==='football'&&S.football.position?`<div style="font-size:.7rem;color:var(--muted2)">${S.football.position}</div>`:''}
        ${S.sport==='basketball'&&S.basketball.position?`<div style="font-size:.7rem;color:var(--muted2)">${S.basketball.position}</div>`:''}
      </div>`:''}
      <div>
        <div style="font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);margin-bottom:4px">Rep</div>
        <div style="font-family:var(--fh);font-weight:700;font-size:1rem">${G.social.reputation}</div>
      </div>
      <div>
        <div style="font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);margin-bottom:4px">Detentions</div>
        <div style="font-family:var(--fh);font-weight:700;font-size:1rem">${S.detentions}</div>
      </div>
    </div>
    <div class="card-title no-mb">${grade} · Grade ${a-5}</div>
    ${a===17?'<div class="notif warn" style="margin-top:8px">Senior year. College apps, SATs, last chances at everything.</div>':''}
  </div>`;

  // Academics
  html+=`<div class="card"><div class="card-title">Academics</div>
    <div class="choice-grid">
      <div class="choice" onclick="hsDo('study')"><div class="choice-icon">📖</div><div class="choice-name">Study Hard</div><div class="choice-desc">+GPA +Smarts</div></div>
      <div class="choice" onclick="hsDo('coast')"><div class="choice-icon">😴</div><div class="choice-name">Coast</div><div class="choice-desc">Hold steady</div></div>
      <div class="choice" onclick="hsDo('cheat')"><div class="choice-icon">😏</div><div class="choice-name">Cheat on Test</div><div class="choice-desc">Risk it for the GPA</div></div>
      <div class="choice" onclick="hsDo('skip')"><div class="choice-icon">🚪</div><div class="choice-name">Skip Class</div><div class="choice-desc">-GPA +Happy (risky)</div></div>
    </div>
  </div>`;

  // Teachers & Classmates
  html+=`<div class="card"><div class="card-title">Teachers & Classmates</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">Trouble: ${S.trouble} · ${S.expelled?'⚠️ Expelled':''}</div>
    ${S.teachers.map(t=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
        <div><div class="p-name">${t.name}</div><div class="p-role">Teacher · Relation ${t.relation}%</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('teacher','respect','${schoolEncodeArg(t.name)}')">Respect</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('teacher','rude','${schoolEncodeArg(t.name)}')">Be Rude</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('teacher','help','${schoolEncodeArg(t.name)}')">Ask Help</button>
        </div>
      </div>`).join('')}
    <div style="margin-top:10px"></div>
    ${S.classmates.map(c=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
        <div><div class="p-name">${c.name}</div><div class="p-role">Classmate · Compat ${c.compat}%</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','study','${schoolEncodeArg(c.name)}')">Study</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','flirt','${schoolEncodeArg(c.name)}')">Flirt</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','prank','${schoolEncodeArg(c.name)}')">Prank</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','befriend','${schoolEncodeArg(c.name)}')">Befriend</button>
        </div>
      </div>`).join('')}
  </div>`;

  // Sport section
  if(!S.sport){
    html+=`<div class="card"><div class="card-title">Try Out for a Team</div>
      <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">Your stats affect your odds.</p>
      <div class="choice-grid">`;
    HS_SPORTS.forEach(s=>{
      if(s.femaleOnly&&G.gender!=='female') return;
      if(s.maleOnly&&G.gender!=='male') return;
      const can = G.health>=s.minHealth && G.smarts>=s.minSmarts;
      html+=`<div class="choice${can?'':' disabled'}" onclick="${can?`hsTryout('${s.id}')`:''}" >
        <div class="choice-icon">${s.icon}</div><div class="choice-name">${s.label}</div>
        <div class="choice-desc">${s.desc}</div>
        ${!can?`<div class="choice-req">Need: ${s.minHealth>0?s.minHealth+' Health ':''}${s.minSmarts>0?s.minSmarts+' Smarts':''}</div>`:''}
      </div>`;
    });
    html+=`</div></div>`;
  } else {
    // Sport-specific expanded section
    if(S.sport==='football'){
      html += renderHSFootball(S, sport, a);
    } else if(S.sport==='basketball'){
      html += renderHSBasketball(S, sport, a);
    } else {
      html += renderHSGenericSport(S, sport, a);
    }
  }

  // Recruiting offers (16+, athlete)
  if(S.sport && a>=16 && S.recruitingOffers.length>0){
    html+=`<div class="card"><div class="card-title">🏫 College Recruiting Offers</div>
      <p style="color:var(--muted2);font-size:.8rem;margin-bottom:10px">${S.recruitingStars} ⭐ recruit · ${S.recruitingOffers.length} offer${S.recruitingOffers.length!==1?'s':''}</p>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${S.recruitingOffers.map(col=>{
          const tier = collegeTierForSchool(col);
          const td   = COLLEGE_TIERS[tier];
          const hasFull = Math.random()<td.scholarshipChance;
          return `<div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface3);border-radius:var(--r-sm);padding:8px 12px">
            <div>
              <div style="font-family:var(--fh);font-weight:700;font-size:.88rem">${col}</div>
              <div style="font-size:.72rem;color:var(--muted2)">${td.label} · ${pick(td.conferences)} Conference</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="acceptScholarship('${col}','${S.sport}',${hasFull})">
              ${hasFull?'💰 Full Ride':'📋 Partial'}
            </button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // After school
  html+=`<div class="card"><div class="card-title">After School</div>
    <div class="choice-grid">
      <div class="choice" onclick="hsPartTime()"><div class="choice-icon">💼</div><div class="choice-name">Part-Time Job</div><div class="choice-desc">Earn money</div></div>
      <div class="choice" onclick="hsDo('volunteer')"><div class="choice-icon">🤲</div><div class="choice-name">Volunteer</div><div class="choice-desc">+GPA +Rep</div></div>
      ${a===17?`<div class="choice" onclick="hsSAT()"><div class="choice-icon">📝</div><div class="choice-name">Take the SAT</div><div class="choice-desc">Affects college apps</div></div>`:''}
    </div>
  </div>`;

  sc.innerHTML = html;
}

function ensureHSProfiles(){
  if(G.school.teachers.length===0){
    G.school.teachers = [makePerson('Teacher'),makePerson('Teacher'),makePerson('Teacher')].map(t=>{
      t.age = rnd(28,55); t.relation = rnd(35,70); return t;
    });
  }
  if(G.school.classmates.length===0){
    G.school.classmates = Array.from({length:6},()=>makePerson('Classmate')).map(c=>{
      c.age = G.age + rnd(-1,1); c.relation = rnd(25,65); c.compat = rnd(30,90); return c;
    });
  }
}

// ── HS FOOTBALL ──────────────────────────────────────────────────
function renderHSFootball(S, sport, a){
  const fb   = S.football;
  const pos  = fb.position || 'Unknown';
  const seas = `Season stats: ${fb.stats.td} TD · ${fb.stats.yds} yds${fb.stats.tackles?' · '+fb.stats.tackles+' tackles':''}`;
  return `<div class="card">
    <div class="card-title">🏈 Football · ${pos} · Year ${S.sportYears}</div>
    <p style="color:var(--muted2);font-size:.8rem;margin-bottom:10px">${seas}</p>
    ${fb.allState?'<span class="badge badge-gold">🏆 All-State</span>':''}
    ${S.sportMVP?'<span class="badge badge-gold" style="margin-left:5px">⭐ MVP</span>':''}
    <div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="hsSport('train')"><div class="choice-icon">💪</div><div class="choice-name">Train Hard</div><div class="choice-desc">+Stats +Health</div></div>
      <div class="choice" onclick="hsSport('bigGame')"><div class="choice-icon">🏆</div><div class="choice-name">Big Game</div><div class="choice-desc">State playoff or championship</div></div>
      <div class="choice" onclick="hsSport('film')"><div class="choice-icon">📹</div><div class="choice-name">Watch Film</div><div class="choice-desc">+Smarts +Stats</div></div>
      <div class="choice" onclick="hsSport('weights')"><div class="choice-icon">🏋️</div><div class="choice-name">Weight Room</div><div class="choice-desc">+Health +Draft stock</div></div>
      <div class="choice" onclick="hsSport('recruiting')"><div class="choice-icon">📨</div><div class="choice-name">Official Visit</div><div class="choice-desc">Boost recruiting profile</div></div>
      <div class="choice" onclick="hsSport('coast')"><div class="choice-icon">😴</div><div class="choice-name">Coast</div><div class="choice-desc">Minimal effort</div></div>
      <div class="choice" onclick="hsSport('injury_risk')"><div class="choice-icon">💊</div><div class="choice-name">Play Through Pain</div><div class="choice-desc">High risk, stay on field</div></div>
      <div class="choice" onclick="hsSport('quit')"><div class="choice-icon">🚶</div><div class="choice-name">Quit Team</div><div class="choice-desc">-Rep, free time</div></div>
    </div>
  </div>`;
}

// ── HS BASKETBALL ────────────────────────────────────────────────
function renderHSBasketball(S, sport, a){
  const bb = S.basketball;
  return `<div class="card">
    <div class="card-title">🏀 Basketball · ${bb.position||'?'} · Year ${S.sportYears}</div>
    <p style="color:var(--muted2);font-size:.8rem;margin-bottom:10px">Season avg: ${bb.stats.pts} pts · ${bb.stats.reb} reb · ${bb.stats.ast} ast</p>
    ${bb.allState?'<span class="badge badge-gold">🏆 All-State</span>':''}
    <div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="hsSport('train')"><div class="choice-icon">💪</div><div class="choice-name">Train Hard</div><div class="choice-desc">+Stats +Health</div></div>
      <div class="choice" onclick="hsSport('bigGame')"><div class="choice-icon">🏆</div><div class="choice-name">Playoff Game</div><div class="choice-desc">State title push</div></div>
      <div class="choice" onclick="hsSport('film')"><div class="choice-icon">📹</div><div class="choice-name">Watch Film</div><div class="choice-desc">+IQ +Stats</div></div>
      <div class="choice" onclick="hsSport('recruiting')"><div class="choice-icon">📨</div><div class="choice-name">AAU Circuit</div><div class="choice-desc">+Recruiting stars</div></div>
      <div class="choice" onclick="hsSport('weights')"><div class="choice-icon">🏋️</div><div class="choice-name">Strength Training</div><div class="choice-desc">+Health +Draft stock</div></div>
      <div class="choice" onclick="hsSport('coast')"><div class="choice-icon">😴</div><div class="choice-name">Coast</div><div class="choice-desc">Minimal effort</div></div>
      <div class="choice" onclick="hsSport('quit')"><div class="choice-icon">🚶</div><div class="choice-name">Quit Team</div><div class="choice-desc">-Rep, free time</div></div>
    </div>
  </div>`;
}

// ── HS GENERIC SPORT ─────────────────────────────────────────────
function renderHSGenericSport(S, sport, a){
  return `<div class="card"><div class="card-title">${sport.icon} ${sport.label} · Year ${S.sportYears}</div>
    <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">Big game wins: ${S.bigGameWins}</p>
    <div class="choice-grid">
      <div class="choice" onclick="hsSport('train')"><div class="choice-icon">💪</div><div class="choice-name">Train Hard</div><div class="choice-desc">+Health +Rep</div></div>
      <div class="choice" onclick="hsSport('bigGame')"><div class="choice-icon">🏆</div><div class="choice-name">Big Game</div><div class="choice-desc">Win or lose it all</div></div>
      <div class="choice" onclick="hsSport('coast')"><div class="choice-icon">😴</div><div class="choice-name">Coast</div><div class="choice-desc">Minimal effort</div></div>
      <div class="choice" onclick="hsSport('quit')"><div class="choice-icon">🚶</div><div class="choice-name">Quit</div><div class="choice-desc">-Rep, free time</div></div>
    </div>
  </div>`;
}

// ── HS ACADEMIC ACTIONS ──────────────────────────────────────────
function hsDo(type){
  const S = G.school;
  if(type==='study'){
    const gain = parseFloat((Math.random()*0.35+0.1).toFixed(2));
    S.gpa = parseFloat(Math.min(4.0, S.gpa+gain).toFixed(2));
    G.smarts=clamp(G.smarts+rnd(4,10)); G.happy=clamp(G.happy-rnd(2,5));
    addEv(`Studied hard. GPA up to ${S.gpa.toFixed(1)}.`);
  } else if(type==='coast'){
    S.gpa = parseFloat(Math.max(0, S.gpa-0.05).toFixed(2));
    addEv('Did the bare minimum. Showed up. That\'s the whole review.');
  } else if(type==='cheat'){
    if(Math.random()>.35){
      S.gpa=parseFloat(Math.min(4.0,S.gpa+parseFloat((Math.random()*0.4+0.2).toFixed(2))).toFixed(2));
      addEv(`Cheated. Worked. GPA: ${S.gpa.toFixed(1)}.`,'warn');
    } else {
      S.gpa=parseFloat(Math.max(0,S.gpa-0.3).toFixed(2));
      S.detentions++; G.social.reputation=clamp(G.social.reputation-9);
      G.happy=clamp(G.happy-12); G.darkScore++;
      addEv('Caught cheating. Detention. Parents called.','bad'); flash('Caught cheating!','bad');
    }
  } else if(type==='skip'){
    G.happy=clamp(G.happy+rnd(6,11));
    if(Math.random()>.42){
      S.gpa=parseFloat(Math.max(0,S.gpa-0.15).toFixed(2)); S.detentions++;
      addEv('Skipped. Got caught. Parents found out.','warn');
    } else { addEv('Skipped class. Nobody noticed. A perfect crime.'); }
  } else if(type==='volunteer'){
    S.gpa=parseFloat(Math.min(4.0,S.gpa+0.05).toFixed(2));
    G.social.reputation=clamp(G.social.reputation+rnd(4,8));
    addEv('Volunteered. College app padded. Morally mixed.');
  }
  updateHUD(); renderSchool();
}

// ── HS TRYOUT ────────────────────────────────────────────────────
function hsTryout(sportId){
  const s    = HS_SPORTS.find(x=>x.id===sportId);
  const odds = 0.38 + (G.health/300) + (G.looks/380);
  if(Math.random()<odds){
    G.school.sport = sportId; G.school.sportYears = 1;
    // Assign position
    if(sportId==='football'){
      const pos = G.gender==='female' ? pick(['K','P']) :
        G.health>=75 ? pick(['QB','RB','WR','TE']) :
        G.smarts>=65 ? 'QB' : pick(FB_POSITIONS);
      G.school.football.position = pos;
    } else if(sportId==='basketball'){
      const pos = G.health>=70 ? pick(['PG','SG','SF']) : pick(BB_POSITIONS);
      G.school.basketball.position = pos;
    }
    G.social.reputation=clamp(G.social.reputation+s.repBonus);
    G.health=clamp(G.health+rnd(2,5));
    addEv(`Made the ${s.label} team! ${s.icon}`,'love');
    flash(`Made the ${s.label} team! ${s.icon}`,'good');
  } else {
    addEv(`Tried out for ${s.label}. Didn't make the cut.`,'bad');
    flash(`Didn't make ${s.label} team`,'bad');
  }
  updateHUD(); renderSchool();
}

// ── HS SPORT ACTIONS ─────────────────────────────────────────────
function hsSport(action){
  const S = G.school;
  const s = HS_SPORTS.find(x=>x.id===S.sport);
  if(!s) return;
  const isFB = S.sport==='football';
  const isBB = S.sport==='basketball';

  if(action==='train'){
    G.health=clamp(G.health+rnd(s.healthBonus-2,s.healthBonus+2));
    G.looks=clamp(G.looks+rnd(1,s.looksBonus||3));
    G.social.reputation=clamp(G.social.reputation+rnd(2,5));
    if(isFB){ S.football.stats.yds+=rnd(50,200); S.football.stats.td+=rnd(0,2); }
    if(isBB){ S.basketball.stats.pts+=rnd(2,8); S.basketball.stats.reb+=rnd(1,4); }
    addEv(`Extra ${s.label} practice. The work shows. ${s.icon}`);
    flash(`+Health +Rep · ${s.icon}`,'good');
    hsCheckRecruitingUpdate();
  } else if(action==='film'){
    G.smarts=clamp(G.smarts+rnd(2,5));
    if(isFB){ S.football.stats.td+=rnd(0,2); S.football.stats.yds+=rnd(30,100); }
    if(isBB){ S.basketball.stats.pts+=rnd(1,5); S.basketball.stats.ast+=rnd(1,3); }
    addEv(`Film session. You saw tendencies nobody else noticed.`,'good');
    flash(`+Smarts · film work`,'good');
  } else if(action==='weights'){
    G.health=clamp(G.health+rnd(5,10)); G.looks=clamp(G.looks+rnd(2,5));
    if(isFB){ S.football.stats.tackles+=rnd(3,8); S.football.stats.yds+=rnd(20,80); }
    addEv(`Weight room dedicated session. You\'re physically ahead of your class now.`,'good');
    flash(`+Health +Looks · weight room`,'good');
    hsCheckRecruitingUpdate();
  } else if(action==='recruiting'){
    // Official visit or AAU — boosts recruiting stars
    G.social.reputation=clamp(G.social.reputation+rnd(5,12));
    const newOffers = generateRecruitingOffers(S.recruitingStars, S.sport);
    newOffers.forEach(c=>{ if(!S.recruitingOffers.includes(c)) S.recruitingOffers.push(c); });
    if(isFB){
      addEv(`Official visit done. Coaches shook your hand. Your recruiting profile updated.`,'love');
      flash(`+Offers! Recruiting profile boosted`,'good');
    } else {
      addEv(`AAU circuit. Scouts at every game. You put numbers up when it counted.`,'love');
      flash(`+Recruiting visibility`,'good');
    }
  } else if(action==='bigGame'){
    const win = Math.random() < (0.32 + (G.health/220) + (S.sportYears*0.04));
    if(win){
      S.bigGameWins++;
      G.happy=clamp(G.happy+rnd(13,21));
      G.social.reputation=clamp(G.social.reputation+rnd(11,19));
      if(isFB){ S.football.stats.td+=rnd(2,5); S.football.stats.yds+=rnd(100,350); }
      if(isBB){ S.basketball.stats.pts+=rnd(15,35); S.basketball.stats.reb+=rnd(4,12); }
      // MVP / All-State check
      const mvp = !S.sportMVP && Math.random()<(0.14+S.sportYears*0.04);
      if(mvp){ S.sportMVP=true; }
      const allState = !S.stateLine && S.bigGameWins>=2 && Math.random()<0.3;
      if(allState){
        S.stateLine='All-State';
        S.recruitingStars=Math.min(5,S.recruitingStars+1);
        const newOffs=generateRecruitingOffers(S.recruitingStars,S.sport);
        newOffs.forEach(c=>{ if(!S.recruitingOffers.includes(c)) S.recruitingOffers.push(c); });
        addEv(`Big game win${mvp?' + MVP!':''} AND you were named All-State! 🏆⭐ Recruiting phones exploding.`,'love');
        flash('ALL-STATE! 🏆 Recruiting blowing up','good');
      } else {
        addEv(pick([
          `Big game WIN! ${mvp?'You were named MVP! ':''} ${s.icon} The school celebrated for days.`,
          `Championship game: your team won. You were everywhere. ${s.icon}`,
        ]),'love');
        flash(`Big game WIN! ${mvp?'+ MVP!':''} 🏆`,'good');
      }
      hsCheckRecruitingUpdate();
    } else {
      G.happy=clamp(G.happy-rnd(5,13));
      G.social.reputation=clamp(G.social.reputation-rnd(3,9));
      if(isFB){ S.football.stats.yds+=rnd(20,80); }
      addEv(pick([
        `Your team lost the big ${s.label} game. You replayed every mistake on the bus home.`,
        `The ${s.label} game slipped away in the final minutes. Total silence.`,
      ]),'bad');
      flash('Big game loss. Tough one.','bad');
    }
  } else if(action==='injury_risk'){
    if(Math.random()<0.35){
      const injuries=['sprained ankle','bruised ribs','concussion protocol','torn labrum','stress fracture'];
      const inj=pick(injuries);
      S.injuryHistory.push(inj); G.health=clamp(G.health-rnd(10,25));
      G.happy=clamp(G.happy-rnd(8,15));
      addEv(`You tried to play through it. ${inj}. You're out ${rnd(2,8)} weeks. Stock: dipped.`,'bad');
      flash(`Injured: ${inj}`,'bad');
    } else {
      G.happy=clamp(G.happy+rnd(5,10));
      if(isFB) S.football.stats.td+=rnd(1,3);
      if(isBB) S.basketball.stats.pts+=rnd(5,15);
      addEv(`Played through the pain. It paid off. The tape will be talked about.`,'good');
      flash(`Played through it! +Stats`,'good');
    }
  } else if(action==='coast'){
    G.health=clamp(G.health+rnd(1,4)); G.happy=clamp(G.happy+rnd(2,5));
    addEv(`Showed up to ${s.label} practice. Mostly. Coach noticed.`,'warn');
  } else if(action==='quit'){
    G.school.sport=null;
    G.social.reputation=clamp(G.social.reputation-rnd(6,13));
    G.school.recruitingOffers=[];
    addEv(`Quit the ${s.label} team. Former teammates: cold. Coach: disappointed. Free time: real.`,'warn');
    flash(`Left ${s.label} team. -Rep`,'warn');
  }
  if(G.school.sport) G.school.sportYears++;
  updateHUD(); renderSchool();
}

function hsCheckRecruitingUpdate(){
  const S = G.school;
  if(!S.sport || G.age<15) return;
  const newStars = getRecruitingStars(S);
  if(newStars>S.recruitingStars){
    S.recruitingStars=newStars;
    const newOffs=generateRecruitingOffers(newStars,S.sport);
    newOffs.forEach(c=>{ if(!S.recruitingOffers.includes(c)) S.recruitingOffers.push(c); });
    if(newStars>=3){
      addEv(`Your recruiting profile jumped to ${newStars} ⭐. ${S.recruitingOffers.length} college offers now.`,'love');
      flash(`${newStars} ⭐ Recruit! New offers arriving`,'good');
    }
  }
}

function acceptScholarship(college, sport, fullRide){
  G.school.scholarshipOffer = { college, sport, fullRide };
  addEv(`You committed to ${college}! ${fullRide?'Full scholarship — free ride!':'Partial scholarship offer.'} Signing day incoming.`,'love');
  flash(`Committed to ${college}! ${fullRide?'💰 Full Ride!':'📋 Partial'}`, 'good');
  renderSchool();
}

function hsPartTime(){
  const earn = rnd(3000,9000); G.money+=earn;
  addEv(`Part-time job: ${fmt$(earn)} earned. Every dollar smells like french fries.`);
  flash(`+${fmt$(earn)} 💵`,'good'); updateHUD(); switchTab('life');
}

function hsSAT(){
  const score=Math.floor(800+(G.smarts/100)*800); G.school.satScore=score;
  addEv(`SAT score: ${score}/1600. ${score>=1400?'Exceptional.':score>=1200?'Solid.':score>=1000?'Gets the job done.':'Room to grow.'}`);
  flash(`SAT: ${score}/1600`,'good'); updateHUD(); switchTab('life');
}

// ── POST-HS ──────────────────────────────────────────────────────
function renderPostHS(sc){
  const S = G.school;
  const hasScholarship = S.scholarshipOffer;

  sc.innerHTML=`
  <div class="card">
    <div class="card-title">After High School</div>
    <p style="color:var(--muted2);font-size:.875rem;margin-bottom:14px">
      GPA: <strong style="color:${GPA_COLOR(S.gpa)}">${S.gpa.toFixed(1)}</strong> — ${GPA_LABEL(S.gpa)}
      ${S.satScore?` · SAT: <strong style="color:var(--accent2)">${S.satScore}</strong>`:''}
      ${S.recruitingStars>0?` · ${'⭐'.repeat(S.recruitingStars)} Recruit`:''}
    </p>
    ${hasScholarship?`<div class="notif good" style="margin-bottom:14px">
      🏈 Scholarship offer: <strong>${S.scholarshipOffer.college}</strong> — ${S.scholarshipOffer.fullRide?'💰 Full Ride':'Partial Scholarship'}
      <button class="btn btn-primary btn-sm" style="margin-left:10px" onclick="enrollWithScholarship()">Accept & Enroll</button>
    </div>`:''}
    <div class="choice-grid">
      <div class="choice" onclick="showCollegeMenu()"><div class="choice-icon">🎓</div><div class="choice-name">Apply to College</div><div class="choice-desc">4-year degree</div></div>
      <div class="choice" onclick="enterWorkforce()"><div class="choice-icon">🔧</div><div class="choice-name">Enter Workforce</div><div class="choice-desc">Start earning now</div></div>
      <div class="choice" onclick="joinMilitary()"><div class="choice-icon">🪖</div><div class="choice-name">Join Military</div><div class="choice-desc">+All stats</div></div>
      <div class="choice" onclick="gapYear()"><div class="choice-icon">✈️</div><div class="choice-name">Gap Year</div><div class="choice-desc">+Happy · Find yourself</div></div>
    </div>
  </div>`;
}

function enrollWithScholarship(){
  const S    = G.school;
  const off  = S.scholarshipOffer;
  if(!off) return;
  const sport= off.sport;
  const tier = collegeTierForSchool(off.college);
  const td   = COLLEGE_TIERS[tier];
  if(off.fullRide) G.money+=rnd(20000,50000); // scholarship money freed up
  S.uni = {
    enrolled:true, course:'Sports Science', year:1, gpa:2.8,
    honors:false, clubs:[], hasResearch:false,
    sport, sportYears:1, sportConference:pick(td.conferences),
    collegeName:off.college,
    athleteStatus:'scholarship',
    athleteStats:{td:0,yds:0,pts:0,reb:0,ast:0,tackles:0},
    allConference:false, allAmerican:false, heisman:false, nationalChamp:false,
    draftEligible:false, draftDeclared:false, draftRound:null, draftPick:null, draftTeam:null,
    nflDraftable:false, nbaNextStep:false,
    frat:null, fratRank:null, fratRep:0,
    campusCrush:null, academicProbation:false,
    researchInstitution:false, collegePrestige:td.prestige||65, tuitionPerYear:0,
    activeResearch:null, researchComplete:[], careerUnlocked:null, eliteSchool:false,
    professors:[], classmates:[], discipline:0,
  };
  ensureUniState();
  addEv(`Enrolled at ${off.college} on a ${off.fullRide?'full':'partial'} athletic scholarship! ${sport==='football'?'🏈':'🏀'} The next chapter: college athletics.`,'love');
  flash(`${off.college} athlete! 🎓`,'good');
  updateHUD(); switchTab('life');
}

function enterWorkforce(){ const earn=rnd(22000,40000); G.money+=earn; addEv(`Entered workforce at ${fmt$(earn)}/yr.`); flash(`+${fmt$(earn)}/yr 💼`,'good'); updateHUD(); switchTab('life'); }
function joinMilitary(){ G.health=clamp(G.health+rnd(8,15)); G.smarts=clamp(G.smarts+rnd(5,10)); G.looks=clamp(G.looks+rnd(3,8)); G.happy=clamp(G.happy+rnd(4,8)); addEv('Enlisted. Discipline is now your entire personality.'); flash('Enlisted! +All stats 🪖','good'); updateHUD(); switchTab('life'); }
function gapYear(){ G.happy=clamp(G.happy+rnd(10,18)); G.smarts=clamp(G.smarts+rnd(3,7)); addEv('Gap year. Found yourself in Portugal. Still counts.'); flash('+Happy +Smarts ✈️','good'); updateHUD(); switchTab('life'); }

// ── college application flow (step 1: pick school, step 2: pick major) ──
function showCollegeMenu(){
  const gpaBonus = G.school.gpa>=3.9?25:G.school.gpa>=3.7?18:G.school.gpa>=3.5?12:G.school.gpa>=3.0?6:0;
  const satBonus = G.school.satScore>=1500?20:G.school.satScore>=1400?14:G.school.satScore>=1300?8:G.school.satScore>=1200?4:0;
  const eff = G.smarts + gpaBonus + satBonus;
  G._collegeAppEff = eff;

  const sc = document.getElementById('school-content');
  // Group eligible schools
  const eligible = REAL_COLLEGES.filter(col=>{
    const gpaOk  = G.school.gpa >= col.minGPA - 0.1;
    const satOk  = !G.school.satScore || G.school.satScore >= col.minSAT - 30;
    const smartsOk = eff >= (col.prestige - 20);
    return gpaOk && satOk && smartsOk;
  }).sort((a,b)=>b.prestige-a.prestige);

  const tiers = ['ivyplus','elite','prestige','good','mid','small'];
  const tierLabels = { ivyplus:'🏛️ Ivy League / MIT / Stanford', elite:'⭐ Elite Universities',
    prestige:'🎓 Prestigious State Schools', good:'✅ Strong Universities', mid:'📚 Mid-Tier', small:'🏫 Small Colleges' };

  let html = `<div class="card"><div class="card-title">Apply to College</div>
    <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">
      HS GPA: <strong style="color:${GPA_COLOR(G.school.gpa)}">${G.school.gpa.toFixed(1)}</strong>
      ${G.school.satScore?` · SAT: <strong style="color:var(--accent2)">${G.school.satScore}</strong>`:''}
      · Effective score: <strong style="color:var(--gold)">${eff}</strong>
    </p>
    ${eligible.length===0?'<div class="notif bad">Your grades are not strong enough for any college right now. Work on your GPA.</div>':''}`;

  tiers.forEach(tier=>{
    const group = eligible.filter(c=>c.tier===tier);
    if(!group.length) return;
    html+=`<div class="section-header">${tierLabels[tier]}</div><div class="choice-grid">`;
    group.slice(0,6).forEach(col=>{
      html+=`<div class="choice" onclick="pickCollegeMajorEncoded('${schoolEncodeArg(col.name)}')">
        <div class="choice-icon">${col.ivyLeague?'🏛️':col.prestige>=90?'⭐':col.prestige>=75?'🎓':'📚'}</div>
        <div class="choice-name" style="font-size:.8rem">${col.name}</div>
        <div class="choice-desc">${col.conf} · Prestige ${col.prestige}</div>
        <div style="font-size:.66rem;color:var(--gold);margin-top:3px">${fmt$(col.tuition)}/yr ${col.researchInstitution?'· 🔬 Research':''}${col.ivyLeague?'· Ivy':''}  </div>
      </div>`;
    });
    if(group.length>6) html+=`<div style="font-size:.76rem;color:var(--muted2);padding:8px;grid-column:1/-1">+${group.length-6} more schools available</div>`;
    html+=`</div>`;
  });
  html+=`</div>`;
  sc.innerHTML=html;
}

function pickCollegeMajor(collegeName){
  const col = COLLEGE_BY_NAME[collegeName];
  if(!col) return;
  const eff = G._collegeAppEff || G.smarts;

  const sc = document.getElementById('school-content');
  let html = `<div class="card">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <div style="font-size:2rem">${col.ivyLeague?'🏛️':col.prestige>=90?'⭐':'🎓'}</div>
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.2rem">${col.name}</div>
        <div style="font-size:.76rem;color:var(--muted2)">${col.conf} · Prestige ${col.prestige} · ${fmt$(col.tuition)}/yr</div>
        ${col.ivyLeague?'<span class="badge badge-gold" style="margin-top:4px">Ivy League</span>':''}
        ${col.researchInstitution?'<span class="badge badge-accent" style="margin-top:4px">🔬 Research Institution</span>':''}
      </div>
    </div>
    <p style="color:var(--muted2);font-size:.82rem;margin-bottom:12px">Strong programs: ${col.strongMajors.join(', ')}</p>
    <div class="card-title">Choose Your Major</div>
    <div class="choice-grid">`;

  Object.entries(UNI_COURSES).forEach(([name, cd])=>{
    const meetsSmarts = eff >= cd.minSmarts;
    const isStrong    = col.strongMajors.includes(name);
    html+=`<div class="choice${meetsSmarts?'':' disabled'}" onclick="${meetsSmarts?`enrollCollegeEncoded('${schoolEncodeArg(name)}','${schoolEncodeArg(collegeName)}')`:''}" style="${isStrong?'border-color:rgba(94,234,212,.35)':''}">
      <div class="choice-icon">${cd.icon}</div>
      <div class="choice-name" style="font-size:.8rem">${name}${isStrong?' ⭐':''}</div>
      <div class="choice-desc" style="font-size:.68rem">${cd.desc}</div>
      <div style="font-size:.64rem;color:var(--muted2);margin-top:2px">${cd.years}yr · ${cd.careerPay?fmt$(cd.careerPay[0])+'–'+fmt$(cd.careerPay[1]):''}</div>
      ${!meetsSmarts?`<div class="choice-req">Need ${cd.minSmarts} eff.</div>`:''}
    </div>`;
  });
  html+=`</div></div>
  <button class="btn btn-ghost" style="margin-top:8px;width:100%" onclick="showCollegeMenu()">← Back to Schools</button>`;
  sc.innerHTML=html;
}

function enrollCollege(course, collegeName){
  const col  = COLLEGE_BY_NAME[collegeName] || { conf:'Independent', prestige:60, tuition:30000, researchInstitution:false };
  const conf = col.conf || 'Independent';
  const tuition = col.tuition || 30000;
  const cd   = UNI_COURSES[course] || {};

  G.school.uni = {
    enrolled:true, course, year:1, gpa:2.5, honors:false, clubs:[], hasResearch:false,
    sport:null, sportYears:0, sportConference:conf, collegeName:collegeName,
    athleteStatus:null, athleteStats:{td:0,yds:0,pts:0,reb:0,ast:0,tackles:0},
    allConference:false, allAmerican:false, heisman:false, nationalChamp:false,
    draftEligible:false, draftDeclared:false, draftRound:null, draftPick:null, draftTeam:null,
    nflDraftable:false, nbaNextStep:false,
    frat:null, fratRank:null, fratRep:0, campusCrush:null, academicProbation:false,
    // new academic fields
    researchInstitution: col.researchInstitution || false,
    collegePrestige: col.prestige || 60,
    tuitionPerYear: tuition,
    activeResearch: null,
    researchComplete: [],
    careerUnlocked: null,
    eliteSchool: (col.prestige||0)>=88,
    professors:[],
    classmates:[],
    discipline:0,
  };
  ensureUniState();

  // Deduct first year tuition
  G.money -= tuition;

  const isStrong = col.strongMajors && col.strongMajors.includes(course);
  const strongNote = isStrong ? collegeName+' is known for this programme. ' : '';
  addEv('Enrolled at '+collegeName+' — '+course+'! '+(col.ivyLeague?'An Ivy League education. ':'')+( col.researchInstitution?'Research opportunities available. ':'')+strongNote+'Tuition: '+fmt$(tuition)+'/yr.','love');
  flash(`${cd.icon||'🎓'} ${course} at ${collegeName}!`,'good');
  updateHUD(); switchTab('life');
}

// ══════════════════════════════════════════════════════════════════
//  UNIVERSITY — Full Expansion with College Athletics + Greek Life
// ══════════════════════════════════════════════════════════════════

// ── DEGREES & CAREER UNLOCKS ─────────────────────────────────────
const UNI_COURSES = {
  'Medicine':          { icon:'🩺', years:4, studyLoad:'brutal', minSmarts:70,
    careerPay:[140000,350000], careers:['Doctor','Surgeon','Psychiatrist','Medical Researcher'],
    desc:'Gruelling. Rewarding. Required for any medical career.' },
  'Law':               { icon:'⚖️', years:4, studyLoad:'heavy',  minSmarts:62,
    careerPay:[80000,300000],  careers:['Lawyer','Judge','Corporate Counsel','Public Defender'],
    desc:'Arguments as a profession. Law school optional but expected.' },
  'Engineering':       { icon:'🔬', years:4, studyLoad:'heavy',  minSmarts:55,
    careerPay:[75000,260000],  careers:['Engineer','Biotech Engineer','Renewable Energy Analyst','Operations Executive'],
    desc:'Build things. Break things. Repeat.' },
  'Computer Science':  { icon:'💻', years:4, studyLoad:'medium', minSmarts:46,
    careerPay:[90000,260000],  careers:['Software Engineer','Data Engineer','AI/ML Engineer','Cybersecurity Analyst','Game Designer'],
    desc:'The degree that currently prints money.' },
  'Business':          { icon:'📊', years:4, studyLoad:'medium', minSmarts:42,
    careerPay:[55000,260000],  careers:['CEO','Investment Banker','Product Marketing Manager','Supply Chain Manager','Chief of Staff'],
    desc:'Theory before the real MBA.' },
  'Economics':         { icon:'📈', years:4, studyLoad:'heavy',  minSmarts:58,
    careerPay:[65000,230000],  careers:['Economist','Risk Analyst','Strategy Consultant','Policy Advisor','Finance Director'],
    desc:'Numbers with narrative. Surprisingly useful.' },
  'Finance':           { icon:'💰', years:4, studyLoad:'medium', minSmarts:48,
    careerPay:[70000,250000],  careers:['Investment Banker','Hedge Fund Manager','Financial Advisor','Trader'],
    desc:'The Wall Street pipeline starts here.' },
  'Political Science': { icon:'🏛️', years:4, studyLoad:'medium', minSmarts:44,
    careerPay:[45000,220000],  careers:['Policy Aide','Politician','Policy Director','Lobbyist','Chief of Staff'],
    desc:'Either law school prep or a career in itself.' },
  'Journalism':        { icon:'📰', years:4, studyLoad:'medium', minSmarts:38,
    careerPay:[35000,100000],  careers:['Journalist','News Anchor','Editor','Media Executive'],
    desc:'Writing for a living. A noble poverty.' },
  'Psychology':        { icon:'🧠', years:4, studyLoad:'medium', minSmarts:38,
    careerPay:[45000,160000],  careers:['UX Researcher','Psychologist','Clinical Psychologist','Therapist','HR Director'],
    desc:'Understanding people. Terrifying power.' },
  'Nursing':           { icon:'💊', years:4, studyLoad:'heavy',  minSmarts:45,
    careerPay:[60000,110000],  careers:['Nurse','Nurse Practitioner','Healthcare Administrator'],
    desc:'The backbone of healthcare. Underrated career.' },
  'Arts':              { icon:'🎨', years:4, studyLoad:'light',  minSmarts:0,
    careerPay:[25000,80000],   careers:['Artist','Creative Director','Art Teacher','Curator'],
    desc:'Open to everyone. Success varies dramatically.' },
  'Film & Media':      { icon:'🎬', years:4, studyLoad:'light',  minSmarts:30,
    careerPay:[30000,500000],  careers:['Director','Producer','Screenwriter','Cinematographer'],
    desc:'USC pipeline to Hollywood.' },
  'Architecture':      { icon:'🏗️', years:5, studyLoad:'heavy',  minSmarts:52,
    careerPay:[55000,140000],  careers:['Architect','Urban Planner','Design Director'],
    desc:'Five years. Worth every studio night.' },
  'Mathematics':       { icon:'🔢', years:4, studyLoad:'brutal', minSmarts:68,
    careerPay:[70000,200000],  careers:['Mathematician','Actuary','Data Scientist','Quant Analyst'],
    desc:'Abstract thinking. Concrete earning potential.' },
  'Biology':           { icon:'🧬', years:4, studyLoad:'heavy',  minSmarts:58,
    careerPay:[50000,180000],  careers:['Lab Technician','Biologist','Biotech Engineer','Biotech Researcher','Geneticist'],
    desc:'Pre-med or genuine science. Both valid.' },
  'Physics':           { icon:'⚛️', years:4, studyLoad:'brutal', minSmarts:72,
    careerPay:[65000,180000],  careers:['Physicist','Research Scientist','Engineer','Quant'],
    desc:'The hardest major. The most interesting life.' },
  'Public Health':     { icon:'🏥', years:4, studyLoad:'medium', minSmarts:44,
    careerPay:[50000,165000],  careers:['Public Health Director','Epidemiologist','Health Policy Advisor','Policy Aide','Clinical Psychologist'],
    desc:'Population-level medicine. Important work.' },
  'Sports Science':    { icon:'🏈', years:4, studyLoad:'light',  minSmarts:0,
    careerPay:[30000,80000],   careers:['Athletic Trainer','Coach','Sports Analyst','PT'],
    desc:'For the athlete-student. Manageable workload.' },
  'Education':         { icon:'📚', years:4, studyLoad:'medium', minSmarts:30,
    careerPay:[35000,80000],   careers:['Teacher','Principal','Education Director','Professor'],
    desc:'Shaping the next generation. Underpaid. Essential.' },
};

// Majors where research institutions unlock special projects
const RESEARCH_MAJORS = ['Medicine','Engineering','Computer Science','Biology','Physics',
                          'Mathematics','Economics','Public Health'];

// Elite school bonus careers (only unlocked at prestige >= 88)
const ELITE_SCHOOL_CAREERS = {
  'Law':           ['Supreme Court Clerk','Big Law Partner','Attorney General'],
  'Business':      ['Goldman Sachs Analyst','McKinsey Partner','Venture Capitalist'],
  'Computer Science':['Google/Meta/Apple Engineer','AI Researcher','Unicorn Founder'],
  'Medicine':      ['Research Hospital Director','NIH Researcher','Published Scientist'],
  'Economics':     ['Federal Reserve Economist','Nobel Candidate','World Bank Advisor'],
  'Political Science':['Senator','Cabinet Member','Presidential Advisor'],
};

// Research project pool (only at researchInstitution:true + research major)
const RESEARCH_PROJECTS = [
  { id:'cancer',    label:'Oncology Research',      icon:'🎗️', minSmarts:65, grant:50000,  desc:'Studying tumor suppression mechanisms.', smartsBonus:8, famousChance:0.05 },
  { id:'ai',        label:'AI Research Lab',         icon:'🤖', minSmarts:70, grant:80000,  desc:'Machine learning models with a professor.', smartsBonus:10, famousChance:0.08 },
  { id:'climate',   label:'Climate Science Study',   icon:'🌍', minSmarts:60, grant:40000,  desc:'Environmental data modeling.', smartsBonus:7, famousChance:0.04 },
  { id:'vaccine',   label:'Vaccine Development',     icon:'💉', minSmarts:68, grant:60000,  desc:'Immunology trials. High stakes.', smartsBonus:9, famousChance:0.06 },
  { id:'space',     label:'NASA Collaboration',      icon:'🚀', minSmarts:72, grant:100000, desc:'Astrophysics data analysis.', smartsBonus:11, famousChance:0.1  },
  { id:'economics', label:'Fed Reserve Paper',       icon:'📊', minSmarts:65, grant:30000,  desc:'Monetary policy research submitted for review.', smartsBonus:7, famousChance:0.05 },
  { id:'genome',    label:'Genome Sequencing Study', icon:'🧬', minSmarts:70, grant:70000,  desc:'Rare disease gene mapping.', smartsBonus:10, famousChance:0.07 },
  { id:'quantum',   label:'Quantum Computing Lab',   icon:'⚛️', minSmarts:75, grant:90000,  desc:'Theoretical physics. Frontier territory.', smartsBonus:12, famousChance:0.09 },
];

const UNI_EVENTS = [
  ['Your roommate plays guitar at 1am every night. You\'ve learned to hate music.',-6,-3,0,0,'bad',1],
  ['You pulled an all-nighter and aced the exam. Your body filed a complaint.',5,-8,8,0,'warn',1],
  ['You found $20 in an old jacket. Dinner is on you.',4,0,0,20,'',1],
  ['Campus Wi-Fi went down during your online exam. The professor: unsympathetic.',-10,0,0,0,'bad',1],
  ['Someone in your study group genuinely changed how you think.',6,0,8,0,'love',1],
  ['Your professor remembered your name. You felt disproportionately good.',5,0,4,0,'',1],
  ['Spring break. You didn\'t go anywhere. It was perfect.',9,5,0,-50,'love',1],
  ['Wrong lecture. Stayed the whole time. Interesting.',3,0,5,0,'',1],
  ['Campus food reached a new low. You ate it anyway.',-4,-4,0,0,'bad',1],
  ['Coffee shop off campus that feels like yours specifically.',6,0,0,-30,'love',1],
  ['Finals week. Lived in the library. May have hallucinated.',-8,-7,10,0,'warn',2],
  ['A professor told you to reconsider your major. You did not.',-5,0,0,0,'warn',2],
  ['Senior year reality check: the job market is a thing.',-6,0,4,0,'warn',3],
  ['Presentation went well. Confidence lasted two days.',8,0,5,0,'good',2],
  ['Thesis advisor suggested a complete rewrite with three weeks to go.',-12,-5,6,0,'bad',3],
  ['Graduation countdown: real world incoming.',5,0,0,0,'',4],
];

function renderUni(sc){
  const u  = G.school.uni;
  ensureUniProfiles();
  const cd = UNI_COURSES[u.course] || { icon:'🎓', years:4 };
  const progressPct = ((u.year-1)/cd.years)*100;
  const uGpa = u.gpa ? u.gpa.toFixed(1) : '—';
  const uGpaColor = u.gpa>=3.5?'var(--accent)':u.gpa>=3.0?'var(--gold)':u.gpa>=2.0?'var(--text)':'var(--danger)';
  const isSportScholar = u.athleteStatus === 'scholarship' || u.athleteStatus === 'starter' || u.athleteStatus === 'star' || u.athleteStatus === 'consensus AA';
  const collegeName = u.collegeName || 'State University';

  let html = `
  <!-- Header -->
  <div class="card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      <div>
        <span class="badge badge-purple" style="margin-bottom:6px">${cd.icon} ${u.course}</span>
        ${u.eliteSchool?'<span class="badge badge-gold" style="margin-bottom:6px;margin-left:4px">⭐ Elite School</span>':''}
        ${u.researchInstitution?'<span class="badge badge-accent" style="margin-bottom:6px;margin-left:4px">🔬 Research Institution</span>':''}
        <div style="font-family:var(--fh);font-weight:800;font-size:1.4rem">${G.firstname} ${G.lastname}</div>
        <div style="font-size:.78rem;color:var(--muted2);margin-top:2px">${collegeName} · Year ${u.year} · ${u.sportConference||'Independent'}</div>
        ${u.activeResearch?`<div style="font-size:.72rem;color:var(--accent);margin-top:3px">🔬 Active research: ${u.activeResearch}</div>`:''}
        ${(u.researchComplete&&u.researchComplete.length)?`<div style="font-size:.7rem;color:var(--muted2);margin-top:2px">${u.researchComplete.length} research project${u.researchComplete.length!==1?'s':''} completed</div>`:''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2)">GPA</div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.8rem;color:${uGpaColor}">${uGpa}</div>
      </div>
    </div>
    <div style="margin-top:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:.7rem;color:var(--muted2);font-family:var(--fh);text-transform:uppercase;letter-spacing:.06em">Progress</span>
        <span style="font-size:.7rem;color:var(--muted2)">Year ${u.year} of ${cd.years}</span>
      </div>
      <div style="height:5px;background:var(--surface3);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,var(--accent2),var(--accent3));border-radius:99px"></div>
      </div>
    </div>
    ${u.honors?'<div class="badge badge-gold" style="margin-top:8px">⭐ Dean\'s List</div>':''}
    ${u.academicProbation?'<div class="badge badge-danger" style="margin-top:8px">⚠️ Academic Probation</div>':''}
    ${u.frat?`<div style="margin-top:6px;font-size:.78rem;color:var(--accent2)">🏠 ${u.frat} · ${u.fratRank||'Brother'}</div>`:''}
  </div>`;

  // College Athletics section
  if(u.sport){
    html += renderCollegeAthletics(u);
  }

  // Core year actions
  html+=`
  <div class="card">
    <div class="card-title">Academics — Year ${u.year}</div>
    <div class="choice-grid">
      <div class="choice" onclick="uniDo('study')"><div class="choice-icon">📖</div><div class="choice-name">Hit the Books</div><div class="choice-desc">+GPA +Smarts</div></div>
      <div class="choice" onclick="uniDo('balanced')"><div class="choice-icon">⚖️</div><div class="choice-name">Stay Balanced</div><div class="choice-desc">Steady progress</div></div>
      <div class="choice" onclick="uniDo('party')"><div class="choice-icon">🎉</div><div class="choice-name">Party Hard</div><div class="choice-desc">+Happy -GPA -Health</div></div>
      <div class="choice" onclick="uniDo('intern')"><div class="choice-icon">💼</div><div class="choice-name">Get an Internship</div><div class="choice-desc">+Money +Smarts</div></div>
    </div>
  </div>

  <!-- Campus Life -->
  <div class="card">
    <div class="card-title">Campus Life</div>
    <div class="choice-grid">
      <div class="choice" onclick="uniCampus('clubs')"><div class="choice-icon">🏛️</div><div class="choice-name">Join a Club</div><div class="choice-desc">+Happy +Rep</div></div>
      ${!u.frat?`<div class="choice" onclick="uniCampus('rush')"><div class="choice-icon">🏠</div><div class="choice-name">Rush ${G.gender==='female'?'a Sorority':'a Frat'}</div><div class="choice-desc">Social ladder. Commitment required.</div></div>`
               :`<div class="choice" onclick="uniCampus('frat_event')"><div class="choice-icon">🍺</div><div class="choice-name">Frat Event</div><div class="choice-desc">Chaos. Community. Memories.</div></div>`}
      ${u.frat?`<div class="choice" onclick="uniCampus('frat_party')"><div class="choice-icon">🎉</div><div class="choice-name">Throw a Rager</div><div class="choice-desc">Legendary or arrested. Find out.</div></div>`:''}
      ${u.frat?`<div class="choice" onclick="uniCampus('frat_hazing')"><div class="choice-icon">😰</div><div class="choice-name">Pledge Week</div><div class="choice-desc">Dark. Bonding. You'll never say what happened.</div></div>`:''}
      <div class="choice" onclick="uniCampus('sport')"><div class="choice-icon">🏃</div><div class="choice-name">Intramural Sport</div><div class="choice-desc">+Health +Happy</div></div>
      <div class="choice" onclick="uniCampus('volunteer')"><div class="choice-icon">🤲</div><div class="choice-name">Volunteer</div><div class="choice-desc">+GPA +Rep</div></div>
      <div class="choice" onclick="uniCampus('research')"><div class="choice-icon">🔬</div><div class="choice-name">Research Assist</div><div class="choice-desc">+Smarts +Resume</div></div>
      <div class="choice" onclick="uniCampus('parttime')"><div class="choice-icon">☕</div><div class="choice-name">Part-Time Job</div><div class="choice-desc">+Money -GPA</div></div>
      <div class="choice" onclick="uniCampus('tailgate')"><div class="choice-icon">🏈</div><div class="choice-name">Tailgate</div><div class="choice-desc">+Happy +Rep · game day culture</div></div>
      <div class="choice" onclick="uniCampus('date')"><div class="choice-icon">💘</div><div class="choice-name">Campus Romance</div><div class="choice-desc">Meet someone</div></div>
    </div>
  </div>

  ${u.year>=3?`
  <div class="card">
    <div class="card-title">Academic Crunch</div>
    <div class="choice-grid">
      <div class="choice" onclick="uniAcademic('thesis')"><div class="choice-icon">📝</div><div class="choice-name">Work on Thesis</div><div class="choice-desc">+GPA +Smarts</div></div>
      <div class="choice" onclick="uniAcademic('skip')"><div class="choice-icon">😴</div><div class="choice-name">Skip Lectures</div><div class="choice-desc">+Happy -GPA</div></div>
      <div class="choice" onclick="uniAcademic('cramming')"><div class="choice-icon">😤</div><div class="choice-name">Exam Cram</div><div class="choice-desc">+GPA · health cost</div></div>
      <div class="choice" onclick="uniAcademic('cheat')"><div class="choice-icon">😏</div><div class="choice-name">Academic Dishonesty</div><div class="choice-desc">+GPA (if caught: expelled)</div></div>
    </div>
  </div>`:''}

  <div class="card">
    <div class="card-title">Professors & Classmates</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">Discipline: ${u.discipline}</div>
    ${u.professors.map(p=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
        <div><div class="p-name">${p.name}</div><div class="p-role">Professor · Relation ${p.relation}%</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('prof','respect','${schoolEncodeArg(p.name)}')">Respect</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('prof','rude','${schoolEncodeArg(p.name)}')">Be Rude</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('prof','office','${schoolEncodeArg(p.name)}')">Office Hours</button>
        </div>
      </div>`).join('')}
    <div style="margin-top:10px"></div>
    ${u.classmates.map(c=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
        <div><div class="p-name">${c.name}</div><div class="p-role">Classmate · Compat ${c.compat}%</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','study','${schoolEncodeArg(c.name)}')">Study</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','flirt','${schoolEncodeArg(c.name)}')">Flirt</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','prank','${schoolEncodeArg(c.name)}')">Prank</button>
          <button class="btn btn-ghost btn-sm" onclick="schoolActEncoded('classmate','befriend','${schoolEncodeArg(c.name)}')">Befriend</button>
        </div>
      </div>`).join('')}
  </div>

  <div class="card" style="border-color:rgba(248,113,113,.2)">
    <div class="card-title" style="color:var(--danger)">Nuclear Options</div>
    <div class="choice-grid">
      <div class="choice" style="border-color:rgba(248,113,113,.3)" onclick="uniDo('dropout')">
        <div class="choice-icon">🚪</div><div class="choice-name">Drop Out</div><div class="choice-desc">Steve Jobs did it</div>
      </div>
      ${u.year>=3?`<div class="choice" style="border-color:rgba(251,191,36,.3)" onclick="uniDo('transfer')">
        <div class="choice-icon">🔄</div><div class="choice-name">Transfer</div><div class="choice-desc">-1 year, fresh start</div>
      </div>`:''}
    </div>
  </div>`;

  sc.innerHTML = html;
}

function ensureUniProfiles(){
  const u = G.school.uni;
  if(!u) return;
  if(!Array.isArray(u.professors)) u.professors = [];
  if(!Array.isArray(u.classmates)) u.classmates = [];
  if(u.professors.length===0){
    u.professors = [makePerson('Professor'),makePerson('Professor'),makePerson('Professor')].map(p=>{
      p.age = rnd(35,65); p.relation = rnd(35,70); return p;
    });
  }
  if(u.classmates.length===0){
    u.classmates = Array.from({length:6},()=>makePerson('Classmate')).map(c=>{
      c.age = G.age + rnd(-2,2); c.relation = rnd(25,65); c.compat = rnd(30,90); return c;
    });
  }
}

// ── GRAD SCHOOL (MED / LAW) ─────────────────────────────────────
function renderGradSchool(sc){
  const ms = G.career.medSchool;
  const ls = G.career.lawSchool;
  const isMed = ms.enrolled;

  let html = `<div class="card">
    <div class="card-title">${isMed?'Medical School':'Law School'}</div>
    <p style="color:var(--muted2);font-size:.85rem;margin-bottom:10px">
      Year ${isMed?ms.year:ls.year} · GPA ${isMed?ms.gpa.toFixed(2):ls.gpa.toFixed(2)} · Debt ${fmt$((isMed?ms.debt:ls.debt))}
    </p>
    <div class="choice-grid">
      <div class="choice" onclick="gradDo('study')"><div class="choice-icon">📚</div><div class="choice-name">Study Hard</div><div class="choice-desc">+GPA +Smarts</div></div>
      <div class="choice" onclick="gradDo('clinic')"><div class="choice-icon">🩺</div><div class="choice-name">${isMed?'Clinic Rotation':'Externship'}</div><div class="choice-desc">+Experience</div></div>
      <div class="choice" onclick="gradDo('network')"><div class="choice-icon">🤝</div><div class="choice-name">Network</div><div class="choice-desc">+Reputation</div></div>
      <div class="choice" onclick="gradDo('party')"><div class="choice-icon">🥂</div><div class="choice-name">Let Loose</div><div class="choice-desc">+Happy -GPA (risky)</div></div>
    </div>
  </div>`;

  sc.innerHTML = html;
}

function gradDo(type){
  const ms = G.career.medSchool;
  const ls = G.career.lawSchool;
  const inMed = ms.enrolled;
  const g = inMed ? ms : ls;

  if(type==='study'){
    g.gpa = Math.min(4.0, g.gpa + (rnd(6,14)/100));
    G.smarts = clamp(G.smarts + rnd(4,8));
    addEv('You locked in. Your GPA improved.', 'good');
  } else if(type==='clinic'){
    G.smarts = clamp(G.smarts + rnd(3,7));
    G.happy = clamp(G.happy + rnd(-2,5));
    addEv(inMed?'Clinical rotation sharpened your skills.':'Externship helped your resume.', 'good');
  } else if(type==='network'){
    G.career.reputation = clamp(G.career.reputation + rnd(3,7));
    addEv('You made connections that could matter later.', 'good');
  } else if(type==='party'){
    g.gpa = Math.max(2.0, g.gpa - (rnd(4,12)/100));
    G.happy = clamp(G.happy + rnd(6,12));
    addEv('You blew off steam. The GPA took a small hit.', 'warn');
  }

  updateHUD(); renderSchool();
}

// ── COLLEGE ATHLETICS PANEL ──────────────────────────────────────
function renderCollegeAthletics(u){
  const isFB = u.sport==='football';
  const isBB = u.sport==='basketball';
  const st   = u.athleteStats;
  const statStr = isFB
    ? `${st.td} TD · ${st.yds} yds rushing/passing · ${st.tackles} tackles`
    : `${st.pts} pts · ${st.reb} reb · ${st.ast} ast`;
  const statusColor = u.athleteStatus==='consensus AA'?'var(--gold)':u.athleteStatus==='star'?'var(--accent)':u.athleteStatus==='starter'?'var(--success)':'var(--muted2)';

  return `<div class="card" style="border-color:rgba(${isFB?'251,191,36':'94,234,212'},.25)">
    <div class="card-title">${isFB?'🏈':'🏀'} ${u.collegeName} ${isFB?'Football':'Basketball'}</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px">
      <div class="sm-stat">
        <div class="sm-stat-val" style="color:${statusColor};text-transform:capitalize">${u.athleteStatus||'Walk-on'}</div>
        <div class="sm-stat-lbl">Status</div>
      </div>
      <div class="sm-stat"><div class="sm-stat-val">${u.sportYears}</div><div class="sm-stat-lbl">Seasons</div></div>
    </div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">${statStr}</div>
    ${u.allAmerican?'<span class="badge badge-gold">🏆 All-American</span> ':''}
    ${u.allConference?'<span class="badge badge-accent">⭐ All-Conference</span> ':''}
    ${u.heisman?'<span class="badge badge-gold">🏆 Heisman</span> ':''}
    ${u.nationalChamp?'<span class="badge badge-gold">🏆 National Champ</span> ':''}
    ${u.draftDeclared?`<div class="notif good" style="margin-top:8px;font-size:.78rem">🎯 Declared for draft · Round ${u.draftRound||'?'} · ${u.draftTeam||'TBD'}</div>`:''}
    <div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="collegeAthlete('train')"><div class="choice-icon">💪</div><div class="choice-name">Practice Hard</div><div class="choice-desc">+Stats +Draft stock</div></div>
      <div class="choice" onclick="collegeAthlete('game')"><div class="choice-icon">🏆</div><div class="choice-name">${isFB?'Big Game':'Tourney Run'}</div><div class="choice-desc">Championship implications</div></div>
      <div class="choice" onclick="collegeAthlete('film')"><div class="choice-icon">📹</div><div class="choice-name">Film Study</div><div class="choice-desc">+Smarts +Draft stock</div></div>
      <div class="choice" onclick="collegeAthlete('media')"><div class="choice-icon">📺</div><div class="choice-name">Media Day</div><div class="choice-desc">+Fame +Draft exposure</div></div>
      <div class="choice" onclick="collegeAthlete('injury_risk')"><div class="choice-icon">💊</div><div class="choice-name">Play Through Pain</div><div class="choice-desc">Risk it or miss time</div></div>
      ${u.year>=3&&!u.draftDeclared?`<div class="choice" onclick="collegeAthlete('declare')"><div class="choice-icon">📋</div><div class="choice-name">Declare for Draft</div><div class="choice-desc">Enter ${isFB?'NFL':'NBA'} Draft</div></div>`:''}
      ${u.draftDeclared?`<div class="choice" onclick="collegeAthlete('combine')"><div class="choice-icon">🏟️</div><div class="choice-name">Draft Combine</div><div class="choice-desc">Showcase for scouts</div></div>`:''}
    </div>
  </div>`;
}

function collegeAthlete(action){
  const u  = G.school.uni;
  const st = u.athleteStats;
  const isFB = u.sport==='football';
  const isBB = u.sport==='basketball';
  const tier = collegeTierForSchool(u.collegeName||'');
  const td   = COLLEGE_TIERS[tier]||COLLEGE_TIERS.mid;

  if(action==='train'){
    G.health=clamp(G.health+rnd(3,8));
    if(isFB){ st.td+=rnd(1,4); st.yds+=rnd(80,300); st.tackles+=rnd(2,8); }
    if(isBB){ st.pts+=rnd(3,10); st.reb+=rnd(2,6); st.ast+=rnd(1,4); }
    collegeAthleteStatusCheck(u, td);
    addEv(isFB
      ? pick(COLLEGE_FB_EVENTS).replace('{stat}', st.yds)
      : pick(COLLEGE_BB_EVENTS).replace('{stat}', st.pts),'good');
    flash(`+Stats +Draft stock`,'good');
  } else if(action==='film'){
    G.smarts=clamp(G.smarts+rnd(2,5));
    if(isFB){ st.td+=rnd(0,2); st.yds+=rnd(30,100); }
    if(isBB){ st.pts+=rnd(1,4); st.ast+=rnd(2,5); }
    addEv(`Film breakdown. You\'re seeing the game differently now. Scouts notice players who think.`,'good');
    flash(`+Smarts +IQ · film`,'good');
  } else if(action==='game'){
    const win=Math.random()<(0.38+(G.health/280)+u.sportYears*0.04);
    if(isFB){ st.td+=rnd(2,6); st.yds+=rnd(150,400); }
    if(isBB){ st.pts+=rnd(15,40); st.reb+=rnd(5,15); }
    if(win){
      G.happy=clamp(G.happy+rnd(14,22));
      G.social.reputation=clamp(G.social.reputation+rnd(10,20));
      G.sm.totalFame=clamp(G.sm.totalFame+rnd(2,6));
      collegeAthleteStatusCheck(u, td);
      // National championship check
      if(u.year>=3 && u.allConference && Math.random()<0.2){
        u.nationalChamp=true;
        G.sm.totalFame=clamp(G.sm.totalFame+rnd(10,20));
        addEv(`NATIONAL CHAMPIONSHIP! ${u.collegeName} wins it all. Your name is everywhere.`,'love');
        flash('🏆 NATIONAL CHAMPS!','good');
      } else {
        addEv(isFB
          ? pick(COLLEGE_FB_EVENTS).replace('{stat}',st.yds)
          : pick(COLLEGE_BB_EVENTS).replace('{stat}',st.pts),'love');
        flash(`Big WIN! +Fame +Rep 🏆`,'good');
      }
    } else {
      G.happy=clamp(G.happy-rnd(5,12));
      addEv(`Tough loss. You left everything on the field. It wasn\'t enough today.`,'bad');
      flash(`Tough loss.`,'bad');
    }
  } else if(action==='media'){
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(2,8));
    G.social.reputation=clamp(G.social.reputation+rnd(5,12));
    const espnChance = u.allConference||u.allAmerican;
    addEv(espnChance
      ? `ESPN feature piece on you. Draft analysts mention your name. The coverage: national.`
      : `Press interviews. Conference coverage. Your profile growing.`,'good');
    flash(`+Fame · media day 📺`,'good');
  } else if(action==='injury_risk'){
    if(Math.random()<0.3){
      const injuries=['hamstring strain','knee sprain','shoulder separation','stress fracture','concussion'];
      const inj=pick(injuries);
      G.school.injuryHistory.push(inj); G.health=clamp(G.health-rnd(12,28));
      G.happy=clamp(G.happy-rnd(10,18));
      addEv(`Played through it and paid the price. ${inj}. Draft stock: questioned.`,'bad');
      flash(`Injured: ${inj} · draft stock dipped`,'bad');
    } else {
      if(isFB){ st.td+=rnd(2,4); st.yds+=rnd(100,250); }
      if(isBB){ st.pts+=rnd(8,20); }
      addEv(`Played through the pain and it paid off. That tape will follow you to the draft.`,'love');
      flash(`Played through it! Career game`,'good');
    }
  } else if(action==='declare'){
    if(u.year<3){ flash('Need at least 3 seasons first','warn'); return; }
    u.draftDeclared=true; u.draftEligible=true;
    // Estimate draft round
    const baseChance = (G.health/100)*0.4 + (u.allAmerican?0.3:0) + (u.nationalChamp?0.1:0) + td.draftBoost;
    const round = baseChance>0.8?1 : baseChance>0.6?2 : baseChance>0.4?3 : baseChance>0.25?4 : baseChance>0.15?5 : baseChance>0.08?6 : 7;
    const pick_ = rnd(1,32);
    u.draftRound=round; u.draftPick=pick_;
    u.draftTeam=pick(['Chiefs','Eagles','49ers','Cowboys','Bills','Ravens','Bengals','Lions',
                      'Packers','Rams','Dolphins','Seahawks','Chargers','Broncos','Steelers',
                      'Vikings','Saints','Falcons','Buccaneers','Panthers','Giants','Jets',
                      'Commanders','Bears','Lions','Colts','Titans','Jaguars','Texans',
                      'Raiders','Broncos','Cardinals','Lakers','Celtics','Warriors','Bulls',
                      'Heat','Knicks','Nets','Sixers','Bucks','Suns','Nuggets','Clippers']);
    if(isFB) u.nflDraftable=true;
    if(isBB) u.nbaNextStep=true;
    addEv(`Declared for the ${isFB?'NFL':'NBA'} Draft. Projected: Round ${round}, Pick ${pick_}. ${round===1?'First round money. Life-changing.':round<=3?'Solid projection. Roster spot likely.':'Fighting for a roster spot.'}`,'love');
    flash(`Declared for draft! Rd ${round} Pk ${pick_} · ${u.draftTeam}`,'good');
  } else if(action==='combine'){
    const perf=Math.random();
    if(perf>0.6){
      const improvement=rnd(1,2);
      u.draftRound=Math.max(1,u.draftRound-improvement);
      addEv(`Combine performance: elite. ${isFB?'40-yard dash turned heads.':'Athleticism testing: elite.'} Moved up ${improvement} round${improvement!==1?'s':''}.`,'love');
      flash(`Combine: elite! Moved up to Round ${u.draftRound}`,'good');
    } else if(perf>0.3){
      addEv(`Solid combine. Numbers confirmed what scouts already knew. Stock: steady.`,'good');
      flash(`Combine: solid. Stock confirmed.`,'good');
    } else {
      u.draftRound=Math.min(7,u.draftRound+1);
      addEv(`Combine underperformed expectations. ${isFB?'Slower 40 than projected.':'Shot looked off.'} Slid slightly.`,'warn');
      flash(`Combine: below expectation. Slid to Round ${u.draftRound}`,'warn');
    }
  }
  updateHUD(); renderSchool();
}

function collegeAthleteStatusCheck(u, td){
  const st = u.athleteStats;
  const isFB = u.sport==='football';
  const isBB = u.sport==='basketball';
  // Status progression
  const score = isFB ? (st.td*3 + st.yds/50 + st.tackles) : (st.pts + st.reb*1.2 + st.ast*1.5);
  if(score>200 && u.athleteStatus!=='consensus AA'){
    u.athleteStatus='consensus AA'; u.allAmerican=true;
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(8,15));
    addEv(`Consensus All-American! ${u.collegeName}\'s best player. The national conversation is about you now.`,'love');
    flash(`🏆 Consensus All-American!`,'good');
    if(isFB&&!u.heisman&&Math.random()<0.4){ u.heisman=true; addEv(`HEISMAN TROPHY WINNER. Downtown New York. The speech. Your parents cried.`,'love'); flash('🏆 HEISMAN!','good'); }
  } else if(score>100 && u.athleteStatus!=='star'&&u.athleteStatus!=='consensus AA'){
    u.athleteStatus='star'; u.allConference=true;
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,9));
    addEv(`All-Conference selection. You\'re the best player in the conference. Scouts coming to every game.`,'love');
    flash(`⭐ All-Conference!`,'good');
  } else if(score>50 && u.athleteStatus!=='starter'&&u.athleteStatus!=='star'&&u.athleteStatus!=='consensus AA'){
    u.athleteStatus='starter';
    addEv(`You\'ve earned a starting spot. The coaches trust you. The fans know your name.`,'good');
    flash(`Starting role earned!`,'good');
  } else if(!u.athleteStatus){
    u.athleteStatus='walk-on';
  }
}

// ── UNI CORE ACTIONS ─────────────────────────────────────────────
function uniDo(type){
  const u = G.school.uni;
  if(!u.gpa) u.gpa=2.5;
  if(!u.clubs) u.clubs=[];

  if(type==='study'){
    const gain=parseFloat((Math.random()*.35+.15).toFixed(2));
    u.gpa=parseFloat(Math.min(4.0,u.gpa+gain).toFixed(2));
    G.smarts=clamp(G.smarts+rnd(5,13)); G.happy=clamp(G.happy-rnd(3,7));
    addEv(`Hit the books hard. GPA: ${u.gpa}. Friends: theoretical.`);
    if(u.gpa>=3.7){ u.honors=true; addEv('Dean\'s List. ⭐','good'); flash('Dean\'s List! ⭐','good'); }
    u.academicProbation=false;
  } else if(type==='balanced'){
    u.gpa=parseFloat(Math.min(4.0,u.gpa+parseFloat((Math.random()*.15+.05).toFixed(2))).toFixed(2));
    G.smarts=clamp(G.smarts+rnd(3,8)); G.happy=clamp(G.happy+rnd(2,5));
    addEv(`Kept it balanced. GPA: ${u.gpa}.`);
  } else if(type==='party'){
    u.gpa=parseFloat(Math.max(1.0,u.gpa-parseFloat((Math.random()*.3+.1).toFixed(2))).toFixed(2));
    G.happy=clamp(G.happy+rnd(12,18)); G.health=clamp(G.health-rnd(5,10));
    addEv(`Party mode. GPA: ${u.gpa}. Worth it.`,'warn');
    if(u.gpa<2.0){ u.academicProbation=true; addEv('Academic probation. GPA below 2.0.','bad'); flash('⚠️ Academic probation','bad'); }
  } else if(type==='intern'){
    const earn=rnd(5000,15000); G.money+=earn; G.smarts=clamp(G.smarts+rnd(4,8));
    addEv(`Internship. +${fmt$(earn)}. Got coffee and learned everything.`);
    flash(`Internship: +${fmt$(earn)} 💼`,'good');
  } else if(type==='dropout'){
    u.enrolled=false; G.darkScore++;
    addEv(`Dropped out of ${u.course}. Steve Jobs did it. Different energy.`,'warn');
    flash('Dropped out.','warn'); updateHUD(); switchTab('life'); return;
  } else if(type==='transfer'){
    if(u.year<2){ flash('Need year 2+ to transfer','warn'); return; }
    u.year=Math.max(1,u.year-1); u.gpa=parseFloat(Math.max(1.0,u.gpa-.2).toFixed(2));
    G.happy=clamp(G.happy+rnd(4,10));
    addEv(`Transferred. Lost a year but the fresh start was worth it.`,'warn');
    flash('Transferred. -1 year','warn'); updateHUD(); switchTab('life'); return;
  }

  // Annual tuition deduction
  if(u.tuitionPerYear){ G.money-=Math.floor(u.tuitionPerYear*(u.year<=1?0:1)); } // yr1 paid at enrollment

  // Campus event
  const eligible=UNI_EVENTS.filter(e=>u.year>=e[6]);
  if(eligible.length&&Math.random()<.75){
    const ev=pick(eligible); G.happy=clamp(G.happy+ev[1]); G.health=clamp(G.health+ev[2]); G.smarts=clamp(G.smarts+ev[3]); G.money+=ev[4]; addEv(ev[0],ev[5]);
  }

  u.year++;
  const cdYears = UNI_COURSES[u.course]?.years || 4;
  if(u.year>cdYears){
    u.enrolled=false;
    // No extra debt — tuition paid annually; small graduation fee
    const gradFee = rnd(500,2000);
    G.money -= gradFee;
    const honStr=u.honors?' — graduated with honors ⭐':'';
    const cd2=UNI_COURSES[u.course]||{};
    // Unlock career based on degree + school prestige
    const eliteCareers = u.eliteSchool && ELITE_SCHOOL_CAREERS[u.course] ? ' Eligible for elite positions: '+ELITE_SCHOOL_CAREERS[u.course].slice(0,2).join(', ')+'.':'' ;
    const researchStr = u.researchComplete&&u.researchComplete.length>0?' Research credits: '+u.researchComplete.length+' projects.':'';
    G.school.graduated=true; G.school.degree=u.course; G.school.uniGpa=u.gpa;
    G.school.careerUnlocked = cd2.careers ? cd2.careers[0] : 'Professional';
    G.school.eliteGrad = u.eliteSchool;
    addEv(`Graduated from ${u.collegeName||'college'} with a ${u.course} degree!${honStr} GPA: ${u.gpa.toFixed(1)} 🎓${researchStr}${eliteCareers}`,'love');
    flash(`🎓 ${u.course} degree — ${u.collegeName||'done'}!`,'good');
  }
  updateHUD(); switchTab('life');
}

// ── UNI CAMPUS ACTIONS ───────────────────────────────────────────
function uniCampus(type){
  const u = G.school.uni;
  if(!u.clubs) u.clubs=[];

  if(type==='clubs'){
    const clubs=['Chess Club','Film Society','Hiking Club','Student Government','Drama Society',
                 'Investment Club','Coding Society','Environmental Club','Music Collective','Writing Workshop'];
    const available=clubs.filter(c=>!u.clubs.includes(c));
    if(!available.length){ flash('You\'ve joined every club.','warn'); return; }
    const club=pick(available); u.clubs.push(club);
    G.happy=clamp(G.happy+rnd(5,10)); G.social.reputation=clamp(G.social.reputation+rnd(3,7));
    const f=makePerson('Friend'); f.age=G.age+rnd(-2,2); G.friends.push(f);
    addEv(`Joined ${club}. Met ${f.firstName} there.`,'love'); flash(`Joined ${club}!`,'good');
  } else if(type==='rush'){
    const org = G.gender==='female' ? pick(SORORITY_NAMES) : pick(FRAT_NAMES);
    if(G.money<500){ flash('Rush costs $500 in dues','warn'); return; }
    G.money-=500; u.frat=org; u.fratRank='pledge'; u.fratRep=20;
    G.happy=clamp(G.happy+rnd(10,16)); G.social.reputation=clamp(G.social.reputation+rnd(8,14));
    addEv(`You rushed ${org} and got a bid! Pledge period begins. Your life is no longer your own.`,'love');
    flash(`🏠 Pledging ${org}!`,'good');
  } else if(type==='frat_event'){
    if(!u.frat){ flash('Need to be in a frat/sorority','warn'); return; }
    const ev=pick(FRAT_EVENTS);
    G.happy=clamp(G.happy+ev.happyD); G.health=clamp(G.health+ev.healthD);
    G.social.reputation=clamp(G.social.reputation+ev.repD);
    if(ev.dark) G.darkScore+=ev.dark;
    u.fratRep=Math.min(100,u.fratRep+rnd(5,12));
    // Rank advancement
    if(u.fratRank==='pledge'&&u.fratRep>40){ u.fratRank='brother'; addEv('Initiated as a full brother. You\'re in.','love'); flash('🍾 Fully initiated!','good'); }
    if(u.fratRank==='brother'&&u.fratRep>70){ u.fratRank='officer'; addEv('Elected to a frat officer position. The power: real.','good'); }
    if(u.fratRank==='officer'&&u.fratRep>=95&&Math.random()<0.2){ u.fratRank='president'; addEv('You\'re chapter president. The house is yours.','love'); flash('🏆 Chapter President!','good'); }
    addEv(ev.msg,ev.type);
    flash(`🏠 ${u.frat} event`,'good');
  } else if(type==='frat_party'){
    if(!u.frat){ flash('Need to be in a frat/sorority','warn'); return; }
    if(G.money<300){ flash('Need $300','warn'); return; }
    G.money-=300;
    const legendary=Math.random()<0.28;
    if(legendary){
      G.social.reputation=clamp(G.social.reputation+25); G.happy=clamp(G.happy+18);
      addEv(`You threw the most legendary rager of the semester. Cops came. You moved it inside. Continued.`,'love');
      flash('LEGENDARY RAGER 🎉','good');
    } else {
      G.social.reputation=clamp(G.social.reputation+12); G.happy=clamp(G.happy+12);
      addEv(`The rager was certified. The playlist was unimpeachable. Nothing expensive was broken.`,'love');
      flash('Great rager! +Rep 🎉','good');
    }
    G.darkScore+=1;
  } else if(type==='frat_hazing'){
    if(!u.frat||u.fratRank!=='pledge'){ flash('Pledge week only','warn'); return; }
    G.health=clamp(G.health-rnd(8,20)); G.happy=clamp(G.happy-rnd(3,8));
    G.darkScore+=2;
    if(Math.random()<0.3){
      G.school.detentions++;
      addEv('Hazing event went too far. Someone filed a report. Frat on probation.','bad');
      flash('⚠️ Hazing investigation','bad');
    } else {
      u.fratRep=Math.min(100,u.fratRep+rnd(10,20));
      addEv('Pledge week. You did everything they asked. You have stories you\'ll never tell.','warn');
      flash('Pledge week survived. Bond: real.','warn');
    }
  } else if(type==='tailgate'){
    G.happy=clamp(G.happy+rnd(9,15)); G.social.reputation=clamp(G.social.reputation+rnd(3,7));
    G.health=clamp(G.health-rnd(2,6));
    addEv(`Tailgate before the game. Parking lot. Grill. You were there from 9am.`,'love');
    flash('Tailgate! +Happy +Rep 🏈','good');
  } else if(type==='sport'){
    G.health=clamp(G.health+rnd(5,12)); G.happy=clamp(G.happy+rnd(5,9));
    addEv(`Intramural ${pick(['soccer','basketball','volleyball','flag football','tennis'])}. You\'re not as good as you thought.`);
    flash('+Health +Happy 🏃','good');
  } else if(type==='volunteer'){
    u.gpa=parseFloat(Math.min(4.0,u.gpa+.04).toFixed(2)); G.social.reputation=clamp(G.social.reputation+rnd(4,8));
    addEv('Volunteered. Resume boosted. Also genuinely rewarding.');
    flash('+GPA +Rep 🤲','good');
  } else if(type==='research'){
    if(u.researchInstitution && RESEARCH_MAJORS.includes(u.course)){
      // Offer a research project selection
      showResearchProjects(); return;
    } else {
      G.smarts=clamp(G.smarts+rnd(5,11)); u.gpa=parseFloat(Math.min(4.0,u.gpa+.06).toFixed(2));
      u.hasResearch=true;
      addEv(`Research assistant under Professor ${pick(NS)}. Spreadsheets. You learned more than expected.`);
      flash('+Smarts +GPA 🔬','good');
    }
  } else if(type==='parttime'){
    const earn=rnd(3000,8000); G.money+=earn; u.gpa=parseFloat(Math.max(1.0,u.gpa-.04).toFixed(2));
    addEv(`Part-time job: ${fmt$(earn)}. Coffee shop hours don\'t fix themselves.`);
    flash(`+${fmt$(earn)} ☕`,'good');
  } else if(type==='date'){
    if(Math.random()<.5&&!G.spouse){
      const p=makePerson('Lover'); p.age=G.age+rnd(-2,2); assignAdultCareer(p);
      G.lovers.push(p); G.happy=clamp(G.happy+rnd(8,15));
      addEv(`You and ${p.firstName} started something on campus. The timing is complicated. It always is.`,'love');
      flash(`${p.firstName} is now in the picture 💕`,'good');
    } else {
      G.happy=clamp(G.happy+rnd(4,8));
      addEv('You met someone interesting at a party. You talked all night. You\'ll see them around.');
    }
  }
  updateHUD(); renderSchool();
}

// ── UNI ACADEMIC CRUNCH ──────────────────────────────────────────
function uniAcademic(type){
  const u=G.school.uni;
  if(!u.gpa) u.gpa=2.5;
  if(type==='thesis'){
    const gain=parseFloat((Math.random()*.2+.1).toFixed(2));
    u.gpa=parseFloat(Math.min(4.0,u.gpa+gain).toFixed(2));
    G.smarts=clamp(G.smarts+rnd(6,12)); G.happy=clamp(G.happy-rnd(4,8));
    addEv(`Grinded on the thesis. GPA: ${u.gpa}.`); flash('+GPA +Smarts 📝','good');
  } else if(type==='skip'){
    u.gpa=parseFloat(Math.max(1.0,u.gpa-parseFloat((Math.random()*.2+.05).toFixed(2))).toFixed(2));
    G.happy=clamp(G.happy+rnd(6,12));
    addEv(`Skipped lectures. GPA: ${u.gpa}. Very free.`,'warn');
  } else if(type==='cramming'){
    const gain=parseFloat((Math.random()*.25+.1).toFixed(2));
    u.gpa=parseFloat(Math.min(4.0,u.gpa+gain).toFixed(2));
    G.health=clamp(G.health-rnd(8,14)); G.smarts=clamp(G.smarts+rnd(4,9));
    addEv(`Exam cram. Energy drinks. GPA: ${u.gpa}.`,'warn'); flash('+GPA · -Health ⚡','warn');
  } else if(type==='cheat'){
    if(Math.random()>.3){
      u.gpa=parseFloat(Math.min(4.0,u.gpa+parseFloat((Math.random()*.4+.2).toFixed(2))).toFixed(2));
      addEv(`Cheated on thesis. GPA: ${u.gpa}. You feel fine about it.`,'warn'); G.darkScore++;
    } else {
      u.enrolled=false; G.happy=clamp(G.happy-25); G.social.reputation=clamp(G.social.reputation-20);
      addEv(`Caught cheating on your thesis. Expelled.`,'bad'); flash('Expelled for cheating. 💀','bad');
      updateHUD(); switchTab('life'); return;
    }
  }
  updateHUD(); renderSchool();
}

function schoolAct(kind, action, name){
  const S = G.school;
  const u = S.uni;
  let target = null;
  if(kind==='teacher') target = S.teachers.find(t=>t.name===name);
  if(kind==='prof') target = u.professors.find(t=>t.name===name);
  if(kind==='classmate'){
    target = (S.stage==='high' ? S.classmates : u.classmates).find(c=>c.name===name);
  }
  if(!target){ flash('Could not find them.','warn'); return; }

  function befriend(p){
    if(G.friends.find(f=>f.name===p.name)) return;
    p.role = 'Friend';
    p.compat = p.compat || rnd(30,90);
    p.relation = clamp(p.relation + rnd(6,12));
    G.friends.push(p);
    addEv(`${p.firstName} is now your friend.`, 'love');
    flash(`New friend: ${p.firstName}`,'good');
  }

  if(action==='respect'){
    target.relation = clamp(target.relation + rnd(4,9));
    addEv(`You showed respect to ${target.firstName}. It went noticed.`, 'good');
  } else if(action==='rude'){
    target.relation = clamp(target.relation - rnd(8,16));
    if(S.stage==='high'){ S.trouble += rnd(2,5); }
    if(u.enrolled){ u.discipline += rnd(1,4); }
    addEv(`You were rude to ${target.firstName}. The class went silent.`, 'bad');
  } else if(action==='help'){
    target.relation = clamp(target.relation + rnd(6,12));
    G.smarts = clamp(G.smarts + rnd(2,6));
    addEv(`You asked ${target.firstName} for help. It actually helped.`, 'good');
  } else if(action==='office'){
    target.relation = clamp(target.relation + rnd(5,10));
    G.school.uni.gpa = Math.min(4.0, G.school.uni.gpa + (rnd(2,6)/100));
    addEv(`Office hours with ${target.firstName}. You left sharper.`, 'good');
  } else if(action==='study'){
    target.relation = clamp(target.relation + rnd(3,8));
    G.smarts = clamp(G.smarts + rnd(2,6));
    addEv(`You studied with ${target.firstName}. Productivity happened.`, 'good');
  } else if(action==='flirt'){
    if(Math.random()<0.35){
      target.relation = clamp(target.relation + rnd(6,12));
      addEv(`You flirted with ${target.firstName}. They flirted back.`, 'love');
      if(Math.random()<0.2 && G.age>=16){
        const p = {...target, role:'Lover', age:G.age+rnd(-2,2)};
        p.compat = rnd(30,90);
        G.lovers.push(p);
        addEv(`You started dating ${target.firstName} from class.`, 'love');
      }
    } else {
      addEv(`You flirted with ${target.firstName}. It was awkward.`, 'warn');
    }
  } else if(action==='prank'){
    if(Math.random()<0.5){
      addEv(`The prank on ${target.firstName} landed perfectly. People laughed.`, 'warn');
      G.social.reputation = clamp(G.social.reputation + rnd(3,7));
    } else {
      addEv(`The prank went wrong. You got called out.`, 'bad');
      if(S.stage==='high'){ S.trouble += rnd(2,5); }
      if(u.enrolled){ u.discipline += rnd(1,4); }
    }
  } else if(action==='befriend'){
    befriend(target);
  }

  // Expulsion checks
  if(S.stage==='high' && !S.expelled && S.trouble>=12 && Math.random()<0.35){
    S.expelled = true;
    addEv('You were expelled from school due to repeated trouble.','bad');
    flash('Expelled.','bad');
  }
  if(u.enrolled && u.discipline>=8 && Math.random()<0.35){
    u.enrolled = false;
    addEv('You were expelled from university. The emails were cold.','bad');
    flash('Expelled from uni.','bad');
  }

  updateHUD(); renderSchool();
}



