//  mma.js — MMA Career System
//  Martial arts progression → amateur scene → pro regional → UFC
// ══════════════════════════════════════════════════════════════════

const MMA_DISCIPLINES = {
  bjj:       { label:'BJJ',        icon:'🟦', stat:'grappling', iq:2, cond:1 },
  wrestling: { label:'Wrestling',  icon:'🤼', stat:'control',   iq:1, cond:2 },
  muaythai:  { label:'Muay Thai',  icon:'🦵', stat:'striking',  iq:1, cond:2 },
  judo:      { label:'Judo',       icon:'🥋', stat:'throws',    iq:2, cond:1 },
  boxing:    { label:'Boxing',     icon:'🥊', stat:'hands',     iq:1, cond:2 },
};

const MMA_DISCIPLINE_EVENTS = {
  bjj: [
    'You drilled guard retention for two straight hours. Your hips are smarter now.',
    'Rolling round after round made your timing cleaner and your ego quieter.',
    'You hit a smooth back-take chain in live rounds. The room noticed.',
  ],
  wrestling: [
    'Shot entries and sprawls all day. Your gas tank was tested.',
    'You won most scrambles off the cage. Coaches love cage wrestling.',
    'Your top pressure improved. Opponents started carrying your weight late.',
  ],
  muaythai: [
    'Pad rounds were brutal. Elbows and knees felt sharper this week.',
    'Clinch work left your neck sore but your control improved.',
    'You found your timing on low kicks and started landing clean.',
  ],
  judo: [
    'Grip-fighting rounds changed how you handle tie-ups.',
    'You finally timed that throw cleanly in sparring. Crowd reaction: loud.',
    'Your balance and off-balancing improved in stand-up exchanges.',
  ],
  boxing: [
    'You drilled jab-cross-footwork for rounds. Cleaner entries, fewer counters.',
    'Defensive rounds sharpened your slips and exits.',
    'You sparred a slick boxer and survived. That alone was useful.',
  ],
};

const MMA_GYM_TIERS = [
  { id:0, label:'Garage Setup',           join:0,     annual:0,      req:0,  gain:0.9,  sparMax:1, icon:'🏚️' },
  { id:1, label:'Community Fight Gym',    join:600,   annual:900,    req:0,  gain:1.0,  sparMax:2, icon:'🏫' },
  { id:2, label:'Regional MMA Academy',   join:2800,  annual:3600,   req:26, gain:1.08, sparMax:3, icon:'🏟️' },
  { id:3, label:'Elite Performance Camp', join:12000, annual:14500,  req:48, gain:1.16, sparMax:4, icon:'🏆' },
  { id:4, label:'World-Class Super Camp', join:42000, annual:52000,  req:72, gain:1.24, sparMax:5, icon:'🌍' },
];

const MMA_WEIGHT_CLASSES = [
  'Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight',
  'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'
];

const MMA_UFC_GYM_EVENTS = [
  { msg:'Your camp flew in elite partners. The rounds felt like title fights.', good:true },
  { msg:'Coach changed your game plan two weeks out. Stress levels spiked.', good:false },
  { msg:'Your weight cut was textbook. Recovery looked excellent.', good:true },
  { msg:'A sparring war went too hard. Your camp had to dial things back.', good:false },
];

const MMA_TRAINING_CAP = 12;

const MMA_BJJ_BELTS = [
  { min:0,  label:'White Belt',  icon:'⬜' },
  { min:22, label:'Blue Belt',   icon:'🟦' },
  { min:42, label:'Purple Belt', icon:'🟪' },
  { min:62, label:'Brown Belt',  icon:'🟫' },
  { min:80, label:'Black Belt',  icon:'⬛' },
];

function mmaClamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

function mmaCap(v){
  return mmaClamp(Math.round(v), 0, 100);
}

function mmaBjjBeltForSkill(skill){
  let belt = MMA_BJJ_BELTS[0];
  for(let i=0;i<MMA_BJJ_BELTS.length;i++){
    if(skill >= MMA_BJJ_BELTS[i].min) belt = MMA_BJJ_BELTS[i];
  }
  return belt;
}

function mmaSyncBjjBelt(announce){
  const m = G.mma;
  const next = mmaBjjBeltForSkill(m.discipline.bjj||0);
  const prev = m.bjjBelt || MMA_BJJ_BELTS[0].label;
  m.bjjBelt = next.label;
  if(announce && next.label!==prev){
    G.happy = mmaCap((G.happy||50) + rnd(3,8));
    addEv(`BJJ belt promotion: ${next.icon} ${next.label}. Your grappling looked sharper every month.`, 'love');
    flash(`BJJ promoted: ${next.label}`,'good');
  }
}

function ensureMMAState(){
  if(!G.mma){
    G.mma = {};
  }
  const m = G.mma;
  if(typeof m.active!=='boolean') m.active = false;
  if(typeof m.gymTier!=='number') m.gymTier = 0;
  if(!m.discipline) m.discipline = {};
  ['bjj','wrestling','muaythai','judo','boxing'].forEach(k=>{
    if(typeof m.discipline[k]!=='number') m.discipline[k] = 0;
  });
  if(typeof m.mmaSkill!=='number') m.mmaSkill = 0;
  if(typeof m.conditioning!=='number') m.conditioning = 45;
  if(typeof m.fightIQ!=='number') m.fightIQ = 40;
  if(typeof m.confidence!=='number') m.confidence = 50;
  if(!Array.isArray(m.injuries)) m.injuries = [];
  if(typeof m.injured!=='boolean') m.injured = false;
  if(typeof m.recoveryWeeks!=='number') m.recoveryWeeks = 0;
  if(typeof m.trainingSessionsThisYear!=='number') m.trainingSessionsThisYear = 0;
  if(typeof m.sparsThisYear!=='number') m.sparsThisYear = 0;
  if(typeof m.compsThisYear!=='number') m.compsThisYear = 0;
  if(typeof m.officialFightsThisYear!=='number') m.officialFightsThisYear = 0;
  if(typeof m.bjjBelt!=='string') m.bjjBelt = MMA_BJJ_BELTS[0].label;
  if(!m.amateur) m.amateur = {};
  if(!m.pro) m.pro = {};
  if(!m.pro.ufc) m.pro.ufc = {};

  const am = m.amateur;
  if(typeof am.wins!=='number') am.wins = 0;
  if(typeof am.losses!=='number') am.losses = 0;
  if(typeof am.draws!=='number') am.draws = 0;
  if(typeof am.byKO!=='number') am.byKO = 0;
  if(typeof am.bySub!=='number') am.bySub = 0;
  if(typeof am.byDec!=='number') am.byDec = 0;
  if(typeof am.titleWins!=='number') am.titleWins = 0;
  if(!Array.isArray(am.log)) am.log = [];

  const p = m.pro;
  if(typeof p.isPro!=='boolean') p.isPro = false;
  if(typeof p.org!=='string') p.org = 'regional';
  if(typeof p.wins!=='number') p.wins = 0;
  if(typeof p.losses!=='number') p.losses = 0;
  if(typeof p.draws!=='number') p.draws = 0;
  if(typeof p.byKO!=='number') p.byKO = 0;
  if(typeof p.bySub!=='number') p.bySub = 0;
  if(typeof p.byDec!=='number') p.byDec = 0;
  if(typeof p.streak!=='number') p.streak = 0;
  if(typeof p.ranking!=='number') p.ranking = 0;
  if(typeof p.popularity!=='number') p.popularity = 18;
  if(typeof p.marketability!=='number') p.marketability = 25;
  if(typeof p.controversies!=='number') p.controversies = 0;
  if(!Array.isArray(p.rivals)) p.rivals = [];
  if(typeof p.callouts!=='number') p.callouts = 0;
  if(typeof p.hype!=='number') p.hype = 0;
  if(!Array.isArray(p.recordLog)) p.recordLog = [];
  if(typeof p.weightClass!=='string' || !p.weightClass) p.weightClass = 'Lightweight';
  if(typeof p.purse!=='number') p.purse = 12000;

  const u = p.ufc;
  if(typeof u.inUFC!=='boolean') u.inUFC = false;
  if(typeof u.rank!=='number') u.rank = 0;
  if(typeof u.wins!=='number') u.wins = 0;
  if(typeof u.losses!=='number') u.losses = 0;
  if(typeof u.draws!=='number') u.draws = 0;
  if(typeof u.titleShots!=='number') u.titleShots = 0;
  if(typeof u.titleWins!=='number') u.titleWins = 0;
  if(typeof u.titleDefenses!=='number') u.titleDefenses = 0;
  if(typeof u.interimTitleWins!=='number') u.interimTitleWins = 0;
  if(typeof u.champ!=='boolean') u.champ = false;
  if(typeof u.interimChamp!=='boolean') u.interimChamp = false;
  if(typeof u.champWeight!=='string') u.champWeight = '';
  if(typeof u.champWeight2!=='string') u.champWeight2 = '';
  if(typeof u.doubleChampAttempt!=='boolean') u.doubleChampAttempt = false;

  if(typeof m.totalEarned!=='number') m.totalEarned = 0;
  mmaSyncBjjBelt(false);

  mmaRecalcSkill();
}

function mmaFightCount(){
  if(!G.mma || !G.mma.amateur || !G.mma.pro) return 0;
  const m = G.mma;
  return m.amateur.wins + m.amateur.losses + m.amateur.draws + m.pro.wins + m.pro.losses + m.pro.draws;
}

function mmaRecordLine(rec){
  return `${rec.wins}-${rec.losses}${rec.draws>0?`-${rec.draws}`:''}`;
}

function mmaRecalcSkill(){
  if(!G.mma || !G.mma.discipline) return;
  const m = G.mma;
  const d = m.discipline;
  const base = d.bjj*0.2 + d.wrestling*0.24 + d.muaythai*0.2 + d.judo*0.14 + d.boxing*0.22;
  const attributes = m.conditioning*0.16 + m.fightIQ*0.2 + m.confidence*0.12;
  const exp = Math.min(18, mmaFightCount()*1.4);
  const gym = (m.gymTier||0) * 2;
  m.mmaSkill = mmaCap(base*0.58 + attributes + exp + gym);
}

function mmaStartJourney(){
  ensureMMAState();
  if(G.age < 12){ flash('MMA training unlocks at age 12.','warn'); return; }
  const m = G.mma;
  m.active = true;
  if(m.gymTier===0) m.gymTier = 1;
  mmaRecalcSkill();
  addEv('You started training martial arts. New routine: bruises, discipline, and weird confidence.', 'good');
  flash('🥋 MMA journey started','good');
  renderProSports();
}

function mmaGymData(){
  ensureMMAState();
  return MMA_GYM_TIERS.find(g=>g.id===G.mma.gymTier) || MMA_GYM_TIERS[0];
}

function mmaCanTrain(){
  ensureMMAState();
  if(!G.mma.active){ flash('Start training first.','warn'); return false; }
  if(G.mma.trainingSessionsThisYear>=MMA_TRAINING_CAP){ flash('You already maxed training sessions this year. Age up first.','warn'); return false; }
  if(G.mma.injured){ flash('You are currently injured. Recover before heavy training.','warn'); return false; }
  return true;
}

function mmaApplyTrainingCost(base){
  if(G.age<18) return true;
  if(G.money < base){ flash(`Need ${fmt$(base)} for this session.`,'warn'); return false; }
  G.money -= base;
  return true;
}

function mmaTrainDiscipline(id){
  ensureMMAState();
  const spec = MMA_DISCIPLINES[id];
  if(!spec) return;
  if(!mmaCanTrain()) return;

  const m = G.mma;
  const gym = mmaGymData();
  const trainCost = 70 + m.gymTier*45;
  if(!mmaApplyTrainingCost(trainCost)) return;
  const prevBjj = m.discipline.bjj||0;

  const current = m.discipline[id];
  const damp =
    current>=85 ? 0.24 :
    current>=70 ? 0.35 :
    current>=55 ? 0.5  :
    current>=40 ? 0.68 :
    current>=25 ? 0.82 : 1;
  const variance = Math.random()<0.15 ? 1.4 : 1;
  let gain = Math.round((rnd(2,4) + (m.gymTier>=3?1:0)) * gym.gain * damp * variance);
  if(id==='wrestling' && G.age>=14 && G.age<=18){
    gain += 1;
    if(Math.random()<0.5){
      addEv('High school wrestling room work paid off. You felt stronger in every clinch exchange.', 'good');
    }
  }
  gain = Math.max(1, gain);
  m.discipline[id] = mmaCap(current + gain);
  m.conditioning = mmaCap(m.conditioning + rnd(0, spec.cond));
  m.fightIQ = mmaCap(m.fightIQ + rnd(0, spec.iq));
  m.confidence = mmaCap(m.confidence + rnd(0,2));
  m.trainingSessionsThisYear++;
  if(id==='bjj' && m.discipline.bjj>prevBjj){
    mmaSyncBjjBelt(true);
  }
  mmaRecalcSkill();

  addEv(`${spec.icon} ${pick(MMA_DISCIPLINE_EVENTS[id])} (+${gain} ${spec.label})`, 'good');
  updateHUD();
  renderProSports();
}

function mmaTrainMixed(){
  ensureMMAState();
  if(!mmaCanTrain()) return;
  const m = G.mma;
  const gym = mmaGymData();
  const trainCost = 120 + m.gymTier*70;
  if(!mmaApplyTrainingCost(trainCost)) return;
  const prevBjj = m.discipline.bjj||0;

  const keys = Object.keys(MMA_DISCIPLINES);
  const primary = pick(keys);
  const secondary = pick(keys.filter(k=>k!==primary));
  const pGain = Math.max(1, Math.round((rnd(2,3) + (m.gymTier>=2?1:0)) * gym.gain * (m.discipline[primary]>=70?0.55:0.9)));
  const sGain = Math.max(1, Math.round((rnd(1,3)) * gym.gain * (m.discipline[secondary]>=70?0.5:0.8)));
  m.discipline[primary] = mmaCap(m.discipline[primary] + pGain);
  m.discipline[secondary] = mmaCap(m.discipline[secondary] + sGain);
  m.fightIQ = mmaCap(m.fightIQ + rnd(1,3));
  m.conditioning = mmaCap(m.conditioning + rnd(1,3));
  m.trainingSessionsThisYear++;
  if((m.discipline.bjj||0) > prevBjj){
    mmaSyncBjjBelt(true);
  }
  mmaRecalcSkill();
  addEv(`You trained pure MMA rounds this year. Transitions looked cleaner under pressure. (+${pGain}/${sGain})`, 'good');
  updateHUD();
  renderProSports();
}

function mmaSpar(level){
  ensureMMAState();
  const m = G.mma;
  const gym = mmaGymData();
  const lv = Math.max(1, Math.min(5, level|0));
  if(!m.active){ flash('Start your MMA journey first.','warn'); return; }
  if(m.injured){ flash('You are injured and should not spar.','warn'); return; }
  if(m.sparsThisYear>=2){ flash('Sparring cap reached this year.','warn'); return; }
  if(lv > gym.sparMax){ flash('Your current gym cannot safely run that sparring level.','warn'); return; }
  const req = 18 + lv*10;
  if(m.mmaSkill < req){ flash(`Need MMA skill ${req} for this sparring level.`,'warn'); return; }
  if(!mmaApplyTrainingCost(100 + lv*90)) return;

  const oppSkill = req + rnd(5,22) + lv*2;
  const sparWinProb = mmaClamp(0.46 + (m.mmaSkill-oppSkill)/170 + (m.conditioning-50)/250, 0.14, 0.84);
  const wonRounds = Math.random() < sparWinProb;

  if(wonRounds){
    m.conditioning = mmaCap(m.conditioning + rnd(1,3));
    m.fightIQ = mmaCap(m.fightIQ + rnd(1,2));
    m.confidence = mmaCap(m.confidence + rnd(2,5));
    addEv(`Hard sparring (L${lv}) went your way. Timing and composure improved under heat.`, 'good');
  } else {
    m.conditioning = mmaCap(m.conditioning + rnd(0,2));
    m.confidence = mmaCap(m.confidence - rnd(1,4));
    addEv(`Hard sparring (L${lv}) exposed gaps in your game. Useful, but humbling.`, 'warn');
  }

  const injuryRisk = 0.05 + lv*0.05 - m.gymTier*0.01;
  if(Math.random() < injuryRisk){
    m.injured = true;
    m.recoveryWeeks = rnd(8,28);
    const injury = pick(['shin contusion','rib bruise','ankle sprain','minor concussion symptoms','shoulder strain']);
    m.injuries.push({ age:G.age, injury });
    G.health = mmaCap(G.health - rnd(4,12));
    addEv(`Sparring injury: ${injury}. You will need recovery time.`, 'bad');
  }

  m.sparsThisYear++;
  mmaRecalcSkill();
  updateHUD();
  renderProSports();
}

function mmaEnterCompetition(id){
  ensureMMAState();
  const m = G.mma;
  const spec = MMA_DISCIPLINES[id];
  if(!spec){ flash('Unknown discipline.','warn'); return; }
  if(!m.active){ flash('Start your MMA journey first.','warn'); return; }
  if(m.compsThisYear>=2){ flash('Competition cap reached this year.','warn'); return; }
  if(m.discipline[id] < 14){ flash(`Need at least 14 ${spec.label} skill to compete.`,'warn'); return; }

  const entry = 80 + m.gymTier*40;
  if(!mmaApplyTrainingCost(entry)) return;
  const skill = m.discipline[id] + m.fightIQ*0.2 + m.conditioning*0.15;
  const opp = m.discipline[id] + rnd(-10,16) + (m.compsThisYear*2);
  const winProb = mmaClamp(0.44 + (skill-opp)/145, 0.18, 0.86);
  const won = Math.random() < winProb;

  if(id==='wrestling' && G.age>=14 && G.age<=18){
    addEv('You entered a high school wrestling tournament bracket this season.', 'good');
  }

  if(won){
    const payout = G.age>=18 ? rnd(300,2500) : 0;
    if(payout>0){ G.money += payout; m.totalEarned += payout; }
    const gain = rnd(1,3);
    m.discipline[id] = mmaCap(m.discipline[id] + gain);
    m.confidence = mmaCap(m.confidence + rnd(2,5));
    addEv(`${spec.icon} ${spec.label} competition win. ${payout>0?`Prize: ${fmt$(payout)}. `:''}You looked composed under pressure.`, 'love');
  } else {
    m.confidence = mmaCap(m.confidence - rnd(1,4));
    m.fightIQ = mmaCap(m.fightIQ + rnd(0,2));
    addEv(`${spec.icon} ${spec.label} competition loss. Good tape for your coaches.`, 'warn');
  }

  m.compsThisYear++;
  mmaRecalcSkill();
  updateHUD();
  renderProSports();
}

function mmaMethodFromProfile(){
  ensureMMAState();
  const m = G.mma;
  const koPower = m.discipline.boxing + m.discipline.muaythai;
  const subPower = m.discipline.bjj + m.discipline.judo + Math.floor(m.discipline.wrestling*0.5);
  const decisionBase = 110 + m.fightIQ;
  const total = koPower + subPower + decisionBase;
  const roll = Math.random() * total;
  if(roll < koPower) return pick(['KO/TKO','KO/TKO','KO/TKO','Doctor Stoppage']);
  if(roll < koPower + subPower) return pick(['Submission','Submission','Submission','Technical Submission']);
  return pick(['Decision','Decision','Split Decision']);
}

function mmaResolveFight(oppSkill, opts={}){
  ensureMMAState();
  const m = G.mma;
  const titleTax = opts.titleFight ? 0.04 : 0;
  const pressureTax = opts.championOpponent ? 0.03 : 0;
  const injuryTax = m.injured ? 0.12 : 0;
  const edge = (m.mmaSkill-oppSkill)/175 + (m.conditioning-50)/265 + (m.fightIQ-50)/320 + (m.confidence-50)/300 + m.gymTier*0.008;
  const winProb = mmaClamp(0.45 + edge - titleTax - pressureTax - injuryTax, 0.08, 0.9);
  const drawProb = Math.abs(m.mmaSkill-oppSkill)<3 ? 0.04 : 0.02;
  const r = Math.random();
  if(r < drawProb){
    return { result:'draw', method:'Decision' };
  }
  const win = r < drawProb + winProb;
  return {
    result: win ? 'win' : 'loss',
    method: win ? mmaMethodFromProfile() : pick(['KO/TKO','Submission','Decision']),
  };
}

function mmaNamedOpponent(tag=''){
  const firstPool = (NM||[]).concat(NF||[]);
  const lastPool = NS||[];
  const first = firstPool.length ? pick(firstPool) : 'Alex';
  const last = lastPool.length ? pick(lastPool) : 'Stone';
  const nick = pick(['The Hammer','No Mercy','Night Shift','Razor','The Clinch','Southpaw','The Problem']);
  return `${first} "${nick}" ${last}${tag?` (${tag})`:''}`;
}

function mmaApplyFightResult(bucket, outcome){
  if(outcome.result==='win'){
    bucket.wins++;
    if(outcome.method.includes('KO')) bucket.byKO++;
    else if(outcome.method.includes('Sub')) bucket.bySub++;
    else bucket.byDec++;
  } else if(outcome.result==='loss'){
    bucket.losses++;
  } else {
    bucket.draws++;
  }
}

function mmaAmateurFight(){
  ensureMMAState();
  const m = G.mma;
  if(!m.active){ flash('Start your MMA journey first.','warn'); return; }
  if(G.age<16){ flash('Official amateur MMA fights unlock at age 16.','warn'); return; }
  if(m.officialFightsThisYear>=1){ flash('You already fought this year. Age up for a new booking.','warn'); return; }

  const oppSkill = mmaClamp(m.mmaSkill + rnd(-12,12) + Math.floor((m.amateur.wins-m.amateur.losses)*0.8), 16, 86);
  const oppName = mmaNamedOpponent('Amateur');
  const outcome = mmaResolveFight(oppSkill, { titleFight:m.amateur.wins>=5 && Math.random()<0.3 });
  mmaApplyFightResult(m.amateur, outcome);

  if(outcome.result==='win'){
    m.confidence = mmaCap(m.confidence + rnd(4,8));
    m.fightIQ = mmaCap(m.fightIQ + rnd(1,3));
    if(Math.random()<0.18){ m.amateur.titleWins++; addEv('You won a local amateur tournament belt. Small stage, big confidence boost.', 'love'); }
    addEv(`Amateur fight win vs ${oppName} by ${outcome.method}. Record: ${mmaRecordLine(m.amateur)}.`, 'love');
  } else if(outcome.result==='loss'){
    m.confidence = mmaCap(m.confidence - rnd(4,9));
    G.health = mmaCap(G.health - rnd(2,8));
    addEv(`Amateur fight loss vs ${oppName} (${outcome.method}). Back to the lab. Record: ${mmaRecordLine(m.amateur)}.`, 'bad');
  } else {
    m.fightIQ = mmaCap(m.fightIQ + 2);
    addEv(`Amateur draw vs ${oppName}. Judges couldn't split it. Record: ${mmaRecordLine(m.amateur)}.`, 'warn');
  }

  m.amateur.log.unshift({ age:G.age, opp:oppName, result:outcome.result, method:outcome.method });
  if(m.amateur.log.length>20) m.amateur.log.pop();
  m.officialFightsThisYear++;
  mmaRecalcSkill();

  if(m.amateur.wins>=6 && m.mmaSkill>=58 && G.age>=18){
    flash('You are close to being pro-ready.','good');
  }
  updateHUD();
  renderProSports();
}

function mmaCanTurnPro(){
  ensureMMAState();
  const m = G.mma;
  return !m.pro.isPro && G.age>=18 && m.amateur.wins>=6 && m.mmaSkill>=58;
}

function mmaTurnPro(){
  ensureMMAState();
  const m = G.mma;
  if(!mmaCanTurnPro()){
    flash('Need age 18+, 6 amateur wins, and MMA skill 58+ to turn pro.','warn');
    return;
  }
  m.pro.isPro = true;
  m.pro.org = 'regional';
  m.pro.ranking = 0;
  m.pro.popularity = Math.max(20, m.pro.popularity);
  m.pro.marketability = Math.max(28, m.pro.marketability);
  m.pro.purse = 14000 + rnd(0,7000);
  m.active = true;
  addEv('You turned pro in MMA. The checks are small. The risks are not.', 'love');
  flash('🥊 You are now a pro fighter','good');
  renderProSports();
}

function mmaEligibleForUFC(){
  ensureMMAState();
  const m = G.mma;
  return m.pro.isPro && !m.pro.ufc.inUFC && m.pro.wins>=8 && m.pro.losses<=4 && m.mmaSkill>=70 && m.pro.popularity>=35;
}

function mmaProFight(){
  ensureMMAState();
  const m = G.mma;
  if(!m.pro.isPro || m.pro.ufc.inUFC){ flash('Use UFC fight options once signed to UFC.','warn'); return; }
  if(m.officialFightsThisYear>=1){ flash('You already had an official fight this year.','warn'); return; }

  const oppSkill = mmaClamp(m.mmaSkill + rnd(-10,14) + Math.floor((m.pro.wins-m.pro.losses)*0.7), 34, 92);
  const oppName = mmaNamedOpponent('Regional');
  const outcome = mmaResolveFight(oppSkill, {});
  const purse = Math.floor((m.pro.purse + m.pro.popularity*180 + m.pro.hype*120) * rnd(90,125)/100);
  G.money += purse;
  m.totalEarned += purse;
  mmaApplyFightResult(m.pro, outcome);
  m.pro.recordLog.unshift({ age:G.age, stage:'pro', opp:oppName, result:outcome.result, method:outcome.method, purse });
  if(m.pro.recordLog.length>40) m.pro.recordLog.pop();

  if(outcome.result==='win'){
    m.pro.streak = Math.max(1, m.pro.streak + 1);
    m.pro.popularity = mmaCap(m.pro.popularity + rnd(3,7));
    m.pro.hype = mmaCap(m.pro.hype + rnd(4,10));
    m.pro.purse = Math.floor(m.pro.purse * (1 + rnd(5,12)/100));
    addEv(`Pro win vs ${oppName} by ${outcome.method}. Purse ${fmt$(purse)}. Pro record: ${mmaRecordLine(m.pro)}.`, 'love');
  } else if(outcome.result==='loss'){
    m.pro.streak = 0;
    m.pro.popularity = mmaCap(m.pro.popularity - rnd(2,5));
    m.pro.hype = mmaCap(m.pro.hype - rnd(4,8));
    m.confidence = mmaCap(m.confidence - rnd(4,9));
    G.health = mmaCap(G.health - rnd(3,10));
    m.pro.purse = Math.max(9000, Math.floor(m.pro.purse * (1 - rnd(3,9)/100)));
    addEv(`Pro loss vs ${oppName} (${outcome.method}). Purse ${fmt$(purse)}. Pro record: ${mmaRecordLine(m.pro)}.`, 'bad');
  } else {
    m.pro.streak = 0;
    m.pro.popularity = mmaCap(m.pro.popularity + 1);
    addEv(`Pro draw vs ${oppName}. Purse ${fmt$(purse)}. Pro record: ${mmaRecordLine(m.pro)}.`, 'warn');
  }

  if(Math.random()<0.2 + m.pro.hype/220){
    const rival = mmaNamedOpponent();
    m.pro.rivals.unshift(rival);
    if(m.pro.rivals.length>6) m.pro.rivals.pop();
    addEv(`A rivalry is forming with ${rival}. Interviews are getting personal.`, 'warn');
  }

  m.officialFightsThisYear++;
  mmaRecalcSkill();
  if(mmaEligibleForUFC()) flash('UFC offer threshold reached. You can sign with UFC now.','good');
  updateHUD();
  renderProSports();
}

function mmaSignUFC(){
  ensureMMAState();
  const m = G.mma;
  if(!mmaEligibleForUFC()){ flash('UFC requires 8+ pro wins, limited losses, and strong skill/popularity.','warn'); return; }
  m.pro.ufc.inUFC = true;
  m.pro.ufc.rank = 14;
  m.pro.org = 'UFC';
  m.pro.purse = Math.max(90000, m.pro.purse * 4);
  m.pro.marketability = mmaCap(m.pro.marketability + rnd(8,14));
  m.pro.popularity = mmaCap(m.pro.popularity + rnd(8,14));
  G.sm.totalFame = mmaCap(G.sm.totalFame + rnd(4,10));
  addEv(`You signed with the UFC at ${m.pro.weightClass}. This is the global stage now.`, 'love');
  flash('🧤 UFC contract signed','good');
  renderProSports();
}

function mmaUFCFight(){
  ensureMMAState();
  const m = G.mma;
  const p = m.pro;
  const u = p.ufc;
  if(!u.inUFC){ flash('You are not in UFC yet.','warn'); return; }
  if(m.officialFightsThisYear>=1){ flash('You already fought this year. Age up for the next camp.','warn'); return; }

  let boutType = 'ranked';
  let championOpponent = false;
  if(u.champ){
    boutType = u.doubleChampAttempt && !u.champWeight2 ? 'double' : 'defense';
    championOpponent = true;
  } else if(u.rank>0 && u.rank<=5 && (u.wins>=3 || p.hype>=55) && Math.random()<0.4){
    boutType = Math.random()<0.22 ? 'interim' : 'title';
    championOpponent = true;
  } else if(u.rank===0){
    boutType = 'debut';
  }

  const baseSkill = boutType==='debut' ? rnd(60,74)
    : boutType==='ranked' ? rnd(66,82)
    : boutType==='interim' ? rnd(78,90)
    : boutType==='double' ? rnd(82,95)
    : rnd(80,94);
  const oppSkill = mmaClamp(baseSkill + Math.floor((u.rank>0 ? (12-u.rank) : 0)*0.8), 55, 98);
  const oppTag = boutType==='title'?'Champion':boutType==='interim'?'Interim Belt':boutType==='double'?'Champ-Champ':'UFC';
  const oppName = mmaNamedOpponent(oppTag);
  const outcome = mmaResolveFight(oppSkill, { titleFight:boutType!=='debut' && boutType!=='ranked', championOpponent });
  const ppvBoost = 1 + (p.marketability/220) + (p.hype/260);
  const purse = Math.floor((p.purse + p.popularity*900 + (boutType==='title'||boutType==='defense'||boutType==='double'?130000:0)) * ppvBoost * rnd(88,128)/100);
  G.money += purse;
  m.totalEarned += purse;
  mmaApplyFightResult(p, outcome);
  mmaApplyFightResult(u, outcome);
  p.recordLog.unshift({ age:G.age, stage:'ufc', opp:oppName, result:outcome.result, method:outcome.method, purse, type:boutType });
  if(p.recordLog.length>60) p.recordLog.pop();

  if(outcome.result==='win'){
    p.streak = Math.max(1, p.streak + 1);
    p.hype = mmaCap(p.hype + rnd(8,15));
    p.popularity = mmaCap(p.popularity + rnd(6,12));
    p.marketability = mmaCap(p.marketability + rnd(3,8));
    G.sm.totalFame = mmaCap(G.sm.totalFame + rnd(2,8));
    p.purse = Math.floor(p.purse * (1 + rnd(6,14)/100));

    if(boutType==='title'){
      u.titleShots++;
      u.titleWins++;
      u.champ = true;
      u.interimChamp = false;
      u.champWeight = p.weightClass;
      u.rank = 1;
      addEv(`UFC TITLE WIN! You beat ${oppName} by ${outcome.method}. Belt secured at ${p.weightClass}.`, 'love');
      flash('🏆 UFC CHAMPION','good');
    } else if(boutType==='interim'){
      u.titleShots++;
      u.interimTitleWins++;
      u.interimChamp = true;
      u.rank = 1;
      addEv(`You won the UFC interim title against ${oppName}. Unification fight talk started immediately.`, 'love');
    } else if(boutType==='defense'){
      u.titleDefenses++;
      addEv(`Title defense successful vs ${oppName} by ${outcome.method}. Defenses: ${u.titleDefenses}.`, 'love');
    } else if(boutType==='double'){
      u.titleShots++;
      u.titleWins++;
      u.champWeight2 = pick(MMA_WEIGHT_CLASSES.filter(w=>w!==u.champWeight && w!==p.weightClass));
      u.doubleChampAttempt = false;
      addEv(`Double-champ achieved! You defeated ${oppName} and captured a second belt.`, 'love');
      flash('👑👑 DOUBLE CHAMP','good');
    } else {
      if(u.rank===0) u.rank = rnd(11,15);
      else u.rank = Math.max(1, u.rank - rnd(1,3));
      addEv(`UFC win vs ${oppName} by ${outcome.method}. Purse ${fmt$(purse)}. UFC record: ${mmaRecordLine(u)}.`, 'good');
    }
  } else if(outcome.result==='loss'){
    p.streak = 0;
    p.hype = mmaCap(p.hype - rnd(7,14));
    p.popularity = mmaCap(p.popularity - rnd(4,9));
    m.confidence = mmaCap(m.confidence - rnd(5,11));
    G.health = mmaCap(G.health - rnd(4,12));
    if(u.rank>0) u.rank = Math.min(15, u.rank + rnd(1,4));
    if(boutType==='title'||boutType==='defense'||boutType==='double'){
      u.titleShots++;
      if(u.champ && boutType!=='double'){
        u.champ = false;
        u.interimChamp = false;
        u.titleDefenses = 0;
      }
      addEv(`Title fight loss to ${oppName} (${outcome.method}). Belt status changed. UFC record: ${mmaRecordLine(u)}.`, 'bad');
    } else {
      addEv(`UFC loss to ${oppName} (${outcome.method}). Purse ${fmt$(purse)}. UFC record: ${mmaRecordLine(u)}.`, 'bad');
    }
    if(Math.random()<0.24){
      m.injured = true;
      m.recoveryWeeks = rnd(12,32);
      const inj = pick(['orbital bruise','ankle ligament sprain','hand fracture','deep cut requiring suspension']);
      m.injuries.push({ age:G.age, injury:inj });
      addEv(`Fight injury: ${inj}. Medical suspension incoming.`, 'bad');
    }
  } else {
    p.streak = 0;
    p.hype = mmaCap(p.hype + rnd(1,3));
    addEv(`UFC draw against ${oppName}. The rematch pressure is immediate.`, 'warn');
  }

  if(Math.random() < 0.14 + p.controversies*0.02){
    const controversy = pick([
      'Post-fight comments were taken out of context and went viral.',
      'You missed media obligations and got fined by the promotion.',
      'A podcast clip triggered a huge fan argument online.',
      'Weight-cut rumors spread and the press cycle got ugly.',
    ]);
    p.controversies++;
    G.sm.controversies = (G.sm.controversies||0) + 1;
    G.sm.totalFame = mmaCap(G.sm.totalFame + rnd(-4,3));
    addEv(`UFC media controversy: ${controversy}`, 'warn');
  }

  m.officialFightsThisYear++;
  mmaRecalcSkill();
  updateHUD();
  renderProSports();
}

function mmaUFCAction(type){
  ensureMMAState();
  const m = G.mma;
  const p = m.pro;
  const u = p.ufc;
  if(!u.inUFC){ flash('These actions unlock in UFC.','warn'); return; }

  if(type==='callout'){
    p.callouts++;
    p.hype = mmaCap(p.hype + rnd(8,16));
    p.popularity = mmaCap(p.popularity + rnd(3,7));
    addEv('You called out a top contender publicly. Engagement exploded within minutes.', 'good');
    if(Math.random()<0.35){
      p.controversies++;
      G.sm.controversies = (G.sm.controversies||0) + 1;
      addEv('The callout crossed a line for some fans. Sponsor relations got tense.', 'warn');
    }
  } else if(type==='media'){
    const pay = rnd(8000,45000);
    G.money += pay; m.totalEarned += pay;
    p.marketability = mmaCap(p.marketability + rnd(4,9));
    p.popularity = mmaCap(p.popularity + rnd(4,8));
    p.hype = mmaCap(p.hype + rnd(2,6));
    addEv(`Media tour complete. Appearance fee: ${fmt$(pay)}. You moved the needle.`, 'good');
  } else if(type==='trash'){
    p.hype = mmaCap(p.hype + rnd(12,20));
    p.popularity = mmaCap(p.popularity + rnd(2,6));
    p.controversies++;
    G.sm.controversies = (G.sm.controversies||0) + 1;
    addEv('You went all-in on trash talk. PPV interest jumped. So did backlash.', 'warn');
  } else if(type==='apology'){
    p.controversies = Math.max(0, p.controversies-1);
    p.hype = mmaCap(p.hype - rnd(3,8));
    p.popularity = mmaCap(p.popularity + rnd(1,4));
    addEv('You issued a measured apology and reset the tone publicly.', 'good');
  } else if(type==='double'){
    if(!u.champ || u.titleDefenses<2){
      flash('Need to be champion with at least 2 defenses before double-champ callout.','warn');
      return;
    }
    if(u.champWeight2){ flash('You already captured a second belt.','warn'); return; }
    u.doubleChampAttempt = true;
    p.hype = mmaCap(p.hype + rnd(8,14));
    addEv('You announced a champ-champ campaign. The promotion is considering it.', 'love');
  } else if(type==='move'){
    mmaWeightMovePrompt();
    return;
  }

  renderProSports();
}

function mmaWeightMovePrompt(){
  ensureMMAState();
  const p = G.mma.pro;
  const idx = MMA_WEIGHT_CLASSES.indexOf(p.weightClass);
  const opts = [];
  if(idx>0) opts.push(MMA_WEIGHT_CLASSES[idx-1]);
  if(idx<MMA_WEIGHT_CLASSES.length-1) opts.push(MMA_WEIGHT_CLASSES[idx+1]);
  if(!opts.length){ flash('No adjacent weight class available.','warn'); return; }
  showPopupHTML(
    'Change Weight Class',
    `Current: <strong>${p.weightClass}</strong><br><span style="font-size:.82rem;color:var(--muted2)">Moving classes impacts performance and matchmaking difficulty.</span>`,
    [
      ...opts.map(w=>({ label:`Move to ${w}`, cls:'btn-primary', onClick:()=>mmaMoveWeight(w) })),
      { label:'Stay', cls:'btn-ghost', onClick:()=>{} },
    ]
  );
}

function mmaMoveWeight(nextClass){
  ensureMMAState();
  const p = G.mma.pro;
  const old = p.weightClass;
  if(old===nextClass) return;
  p.weightClass = nextClass;
  G.mma.conditioning = mmaCap(G.mma.conditioning + rnd(-4,5));
  G.mma.confidence = mmaCap(G.mma.confidence + rnd(-3,4));
  addEv(`You changed weight class: ${old} → ${nextClass}. New opponents, new stylistic puzzles.`, 'warn');
  renderProSports();
}

function mmaUpgradeGym(id){
  ensureMMAState();
  const m = G.mma;
  const target = MMA_GYM_TIERS.find(g=>g.id===id);
  if(!target){ flash('Gym tier not found.','warn'); return; }
  if(target.id===m.gymTier){ flash('Already at that gym tier.','warn'); return; }
  if(target.id<m.gymTier){
    m.gymTier = target.id;
    addEv(`You moved camps to ${target.label}. Different coaches, different style.`, 'warn');
    renderProSports();
    return;
  }
  if(m.mmaSkill < target.req){ flash(`Need MMA skill ${target.req} to join ${target.label}.`,'warn'); return; }
  if(G.age>=18 && G.money < target.join){ flash(`Need ${fmt$(target.join)} signing cost.`,'warn'); return; }
  if(G.age>=18) G.money -= target.join;
  m.gymTier = target.id;
  addEv(`You joined ${target.label}. ${target.icon} Camp quality increased.`, 'good');
  flash('Gym upgraded','good');
  updateHUD();
  renderProSports();
}

function mmaSeasonPassive(){
  ensureMMAState();
  const m = G.mma;
  if(!m.active) return;

  // Gym annual dues
  const gym = mmaGymData();
  if(gym.annual>0 && G.age>=18){
    if(G.money >= gym.annual){
      G.money -= gym.annual;
      addEv(`MMA camp annual dues paid: ${fmt$(gym.annual)} to ${gym.label}.`, '');
    } else {
      const shortfall = gym.annual - Math.max(0, G.money);
      G.money = 0;
      G.finance.debt += Math.floor(shortfall * 1.08);
      m.gymTier = Math.max(1, m.gymTier-1);
      addEv(`Could not fully pay MMA camp dues. Debt increased by ${fmt$(Math.floor(shortfall*1.08))} and your camp tier dropped.`, 'bad');
    }
  }

  if(m.trainingSessionsThisYear===0){
    const key = pick(Object.keys(MMA_DISCIPLINES));
    m.discipline[key] = Math.max(0, m.discipline[key]-1);
    m.conditioning = mmaCap(m.conditioning - rnd(1,3));
    addEv(`MMA inactivity this year cost you a little sharpness in ${MMA_DISCIPLINES[key].label}.`, 'warn');
  }

  if(m.pro.isPro && m.officialFightsThisYear===0){
    m.pro.hype = mmaCap(m.pro.hype - rnd(6,12));
    m.confidence = mmaCap(m.confidence - rnd(1,4));
    addEv('You took no official MMA fights this year. Matchmakers cooled on you.', 'warn');
    if(m.pro.ufc.inUFC && m.pro.ufc.rank>0){
      m.pro.ufc.rank = Math.min(15, m.pro.ufc.rank + rnd(1,3));
      addEv(`UFC ranking slipped due to inactivity. Current rank: #${m.pro.ufc.rank}.`, 'warn');
    }
  }

  if(Math.random() < 0.18 + m.gymTier*0.03){
    const ev = pick(MMA_UFC_GYM_EVENTS);
    m.confidence = mmaCap(m.confidence + (ev.good?rnd(1,4):-rnd(1,3)));
    m.fightIQ = mmaCap(m.fightIQ + (ev.good?rnd(0,3):rnd(-1,1)));
    addEv(ev.msg, ev.good?'good':'warn');
  }

  if(m.injured){
    m.recoveryWeeks = Math.max(0, m.recoveryWeeks - 52);
    if(m.recoveryWeeks===0){
      m.injured = false;
      addEv('You are medically cleared from your MMA injury.', 'good');
    } else {
      addEv(`You are still recovering from injury (${m.recoveryWeeks} weeks estimated).`, 'warn');
    }
  }

  m.trainingSessionsThisYear = 0;
  m.sparsThisYear = 0;
  m.compsThisYear = 0;
  m.officialFightsThisYear = 0;
  mmaRecalcSkill();
}

function renderMMA(){
  ensureMMAState();
  const mc = document.getElementById('mma-content');
  if(!mc) return;
  const m = G.mma;
  const p = m.pro;
  const u = p.ufc;
  const gym = mmaGymData();
  const amRec = mmaRecordLine(m.amateur);
  const proRec = mmaRecordLine(p);
  const ufcRec = mmaRecordLine(u);
  const canPro = mmaCanTurnPro();
  const canUFC = mmaEligibleForUFC();
  const gymChoices = MMA_GYM_TIERS.map(g=>`
    <div class="choice${g.id===m.gymTier?' disabled':''}" onclick="mmaUpgradeGym(${g.id})">
      <div class="choice-icon">${g.icon}</div>
      <div class="choice-name">${g.label}</div>
      <div class="choice-desc">${g.id<m.gymTier?'Move camp':g.id===m.gymTier?'Current camp':`${fmt$(g.join)} join · req skill ${g.req}`}</div>
    </div>`).join('');

  if(!m.active){
    mc.innerHTML = `
      <div class="card">
        <div class="card-title">🥋 MMA Career</div>
        <p style="font-size:.86rem;color:var(--muted2);margin-bottom:12px">
          Build your game through BJJ, wrestling, Muay Thai, judo, and boxing.
          Progress to amateur, pro, and eventually UFC.
        </p>
        <button class="btn btn-primary" onclick="mmaStartJourney()">Start MMA Training</button>
      </div>`;
    return;
  }

  const sparButtons = [1,2,3,4,5].map(l=>`
    <div class="choice${l>gym.sparMax?' disabled':''}" onclick="mmaSpar(${l})">
      <div class="choice-icon">🥊</div>
      <div class="choice-name">Sparring L${l}</div>
      <div class="choice-desc">${l>gym.sparMax?'Locked by gym tier':'Sharper timing · injury risk rises'}</div>
    </div>`).join('');

  const disciplineButtons = Object.keys(MMA_DISCIPLINES).map(k=>{
    const d = MMA_DISCIPLINES[k];
    return `<div class="choice" onclick="mmaTrainDiscipline('${k}')">
      <div class="choice-icon">${d.icon}</div>
      <div class="choice-name">${d.label} Training</div>
      <div class="choice-desc">Skill ${m.discipline[k]} · ${d.stat}</div>
    </div>`;
  }).join('');

  const compButtons = Object.keys(MMA_DISCIPLINES).map(k=>{
    const d = MMA_DISCIPLINES[k];
    return `<div class="choice" onclick="mmaEnterCompetition('${k}')">
      <div class="choice-icon">🏅</div>
      <div class="choice-name">${d.label} Comp</div>
      <div class="choice-desc">${k==='wrestling'&&G.age>=14&&G.age<=18?'HS meets available':'Technique-specific tournament'}</div>
    </div>`;
  }).join('');

  const rivalText = p.rivals.length ? p.rivals.slice(0,2).join(' · ') : 'No major rivals yet.';
  const titleLine = u.champ
    ? `Champion at ${u.champWeight||p.weightClass}${u.champWeight2?` · Also champ at ${u.champWeight2}`:''}`
    : u.interimChamp
      ? `Interim champion at ${p.weightClass}`
      : 'No UFC belt yet';

  mc.innerHTML = `
    <div class="card">
      <div class="card-title">🥋 MMA Profile</div>
      <p style="font-size:.78rem;color:var(--muted2)">Gym: ${gym.icon} ${gym.label} · MMA Skill <strong style="color:var(--accent)">${m.mmaSkill}</strong></p>
      <p style="font-size:.78rem;color:var(--muted2)">Conditioning ${m.conditioning} · Fight IQ ${m.fightIQ} · Confidence ${m.confidence}</p>
      <p style="font-size:.78rem;color:var(--muted2)">BJJ rank: <strong>${mmaBjjBeltForSkill(m.discipline.bjj||0).icon} ${m.bjjBelt||mmaBjjBeltForSkill(m.discipline.bjj||0).label}</strong></p>
      <p style="font-size:.78rem;color:var(--muted2)">Amateur ${amRec} · Pro ${proRec}${u.inUFC?` · UFC ${ufcRec}`:''}</p>
      <p style="font-size:.78rem;color:${m.injured?'var(--danger)':'var(--muted2)'}">${m.injured?`Injured (${m.recoveryWeeks} weeks est)`:'Healthy'} · Fights this year: ${m.officialFightsThisYear}/1 · Training sessions: ${m.trainingSessionsThisYear}/${MMA_TRAINING_CAP}</p>
    </div>

    <div class="card">
      <div class="card-title">Discipline Training</div>
      <p style="font-size:.78rem;color:var(--muted2)">BJJ belt path: ${MMA_BJJ_BELTS.map(b=>`${b.icon} ${b.label}`).join(' → ')}</p>
      <div class="choice-grid">${disciplineButtons}</div>
      <div class="choice-grid" style="margin-top:8px">
        <div class="choice" onclick="mmaTrainMixed()">
          <div class="choice-icon">🧠</div><div class="choice-name">Pure MMA Training</div><div class="choice-desc">Transitions + fight IQ</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Gym & Sparring</div>
      <p style="font-size:.78rem;color:var(--muted2)">Higher tier gyms improve gains, sparring depth, and UFC readiness.</p>
      <div class="choice-grid">${gymChoices}</div>
      <div class="choice-grid" style="margin-top:8px">${sparButtons}</div>
    </div>

    <div class="card">
      <div class="card-title">Discipline Competitions</div>
      <p style="font-size:.78rem;color:var(--muted2)">Comp entries used this year: ${m.compsThisYear}/2</p>
      <div class="choice-grid">${compButtons}</div>
    </div>

    <div class="card">
      <div class="card-title">Fight Career</div>
      ${!p.isPro?`
        <p style="font-size:.78rem;color:var(--muted2)">Amateur record: <strong>${amRec}</strong></p>
        <div class="choice-grid">
          <div class="choice" onclick="mmaAmateurFight()"><div class="choice-icon">🧤</div><div class="choice-name">Amateur Fight</div><div class="choice-desc">One official bout per year</div></div>
          <div class="choice${canPro?'':' disabled'}" onclick="mmaTurnPro()"><div class="choice-icon">💼</div><div class="choice-name">Turn Pro</div><div class="choice-desc">${canPro?'Ready now':'Need 6 amateur wins + skill 58 + age 18'}</div></div>
        </div>
      `:''}
      ${p.isPro && !u.inUFC?`
        <p style="font-size:.78rem;color:var(--muted2)">Regional pro record: <strong>${proRec}</strong> · Popularity ${p.popularity} · Hype ${p.hype}</p>
        <p style="font-size:.78rem;color:var(--muted2)">Weight class: ${p.weightClass} · Rivals: ${rivalText}</p>
        <div class="choice-grid">
          <div class="choice" onclick="mmaProFight()"><div class="choice-icon">🥊</div><div class="choice-name">Regional Pro Fight</div><div class="choice-desc">Build record and purse</div></div>
          <div class="choice${canUFC?'':' disabled'}" onclick="mmaSignUFC()"><div class="choice-icon">🏟️</div><div class="choice-name">Sign with UFC</div><div class="choice-desc">${canUFC?'Offer threshold reached':'Need 8+ wins, low losses, skill/popularity'}</div></div>
        </div>
      `:''}
      ${u.inUFC?`
        <p style="font-size:.78rem;color:var(--muted2)">UFC record: <strong>${ufcRec}</strong> ${u.rank>0?`· Rank #${u.rank}`:'· Unranked'} · ${titleLine}</p>
        <p style="font-size:.78rem;color:var(--muted2)">Title shots ${u.titleShots} · Title wins ${u.titleWins} · Defenses ${u.titleDefenses} · Controversies ${p.controversies}</p>
        <div class="choice-grid">
          <div class="choice" onclick="mmaUFCFight()"><div class="choice-icon">🏆</div><div class="choice-name">Book UFC Fight</div><div class="choice-desc">Full simulation with title logic</div></div>
          <div class="choice" onclick="mmaUFCAction('callout')"><div class="choice-icon">📢</div><div class="choice-name">Call Out Opponent</div><div class="choice-desc">+Hype, controversy risk</div></div>
          <div class="choice" onclick="mmaUFCAction('media')"><div class="choice-icon">🎥</div><div class="choice-name">Media Tour</div><div class="choice-desc">+Marketability +cash</div></div>
          <div class="choice" onclick="mmaUFCAction('trash')"><div class="choice-icon">🧨</div><div class="choice-name">Trash Talk Campaign</div><div class="choice-desc">Big hype, big backlash</div></div>
          <div class="choice" onclick="mmaUFCAction('apology')"><div class="choice-icon">🤝</div><div class="choice-name">Damage Control</div><div class="choice-desc">Lower controversy</div></div>
          <div class="choice" onclick="mmaUFCAction('move')"><div class="choice-icon">⚖️</div><div class="choice-name">Change Weight Class</div><div class="choice-desc">Different division meta</div></div>
          <div class="choice${u.champ&&u.titleDefenses>=2&&!u.champWeight2?'':' disabled'}" onclick="mmaUFCAction('double')"><div class="choice-icon">👑</div><div class="choice-name">Double-Champ Callout</div><div class="choice-desc">${u.champ&&u.titleDefenses>=2&&!u.champWeight2?'Set up champ-champ bout':'Need belt + 2 defenses'}</div></div>
        </div>
      `:''}
    </div>`;
}

