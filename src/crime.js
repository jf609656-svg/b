function addCrimeEv(text, type=''){
  ensureCrimeShape();
  G.crime.log.push({ text, type, age:G.age });
  if(G.crime.log.length>50) G.crime.log.shift();
}

function policeCheck(){
  ensureCrimeShape();
  const P = G.crime.police;
  const risk = (G.crime.heat/120) + (P.closeness/150);
  if(!P.inPrison && Math.random()<risk*0.25){
    P.arrested = true;
    runTrial();
  }
}

function runTrial(){
  const P = G.crime.police;
  if(!P.arrested) return;
  const canMid = G.money>=10000;
  const canElite = G.money>=50000;
  showPopup(
    'Trial',
    'The trial is fast. You need a lawyer.',
    [
      { label:'Public Defender ($0)', cls:'btn-ghost', onClick:()=>resolveTrial(0.35, 0) },
      { label:'Solid Lawyer ($10k)', cls:'btn-ghost', disabled:!canMid, onClick:()=>resolveTrial(0.55, 10000) },
      { label:'Elite Lawyer ($50k)', cls:'btn-primary', disabled:!canElite, onClick:()=>resolveTrial(0.75, 50000) },
    ],
    'dark'
  );
}

function initPrison(){
  const P = G.crime.police;
  const pr = G.crime.prison;
  const sev = (G.crime.heat + G.crime.notoriety);
  pr.security = sev>120 ? 'High' : sev>70 ? 'Medium' : 'Low';
  pr.respect = 10 + Math.floor(sev/20);
  pr.fear = 10 + Math.floor(G.crime.skills.violence/10);
  pr.protection = 0;
  pr.sanity = 70;
  pr.faction = null;
  pr.guards = { strict: rnd(40,80), corrupt: rnd(10,40) };
  G.crime.inmates = genInmates();
}

function resolveTrial(winChance, fee){
  if(G.money<fee){ flash('Not enough money for that lawyer.','warn'); return; }
  G.money -= fee;
  const P = G.crime.police;
  const caseDifficulty = 0.45 + (G.crime.heat/200) + (G.crime.notoriety/200);
  if(Math.random() < (winChance - caseDifficulty + 0.15)){
    addEv('You beat the case. Charges dropped.', 'good');
    addCrimeEv('Trial won. Free to go.', 'good');
    P.arrested = false;
    P.closeness = Math.max(0, P.closeness-15);
  } else {
    const years = Math.max(1, Math.floor((G.crime.heat + G.crime.notoriety)/25));
    P.inPrison = true; P.sentence = years; P.arrested = false;
    initPrison();
    addEv(`You were convicted. Sentence: ${years} year${years!==1?'s':''}.`, 'bad');
    addCrimeEv(`Convicted. Sentenced to ${years} years.`, 'bad');
  }
  renderCrime();
}

function knownPeople(){
  const list = [];
  if(G.spouse && G.spouse.alive) list.push(G.spouse);
  G.family.forEach(p=>p.alive&&list.push(p));
  G.friends.forEach(p=>p.alive&&list.push(p));
  G.lovers.forEach(p=>p.alive&&list.push(p));
  return list.filter((v,i,a)=>a.findIndex(x=>x.name===v.name)===i);
}

function randomVictimDesc(){
  const age = rnd(18,65);
  const vibe = pick(['jogger','tourist','late‑night worker','college student','bar regular','delivery driver']);
  const location = pick(['near a convenience store','outside a club','at a bus stop','in a parking garage','on a quiet street','near a park']);
  return `Random target: ${age}-year-old ${vibe} ${location}.`;
}

function gangArchetype(){
  ensureCrimeShape();
  return GANG_ARCHETYPES.find(x=>x.id===G.crime.gang.type) || null;
}

function gangRivalsFor(typeId){
  return (GANG_RIVAL_MAP && GANG_RIVAL_MAP[typeId]) ? GANG_RIVAL_MAP[typeId] : [];
}

function gangBeefLevelLabel(level){
  return level>=3 ? 'War' : level===2 ? 'Active Beef' : level===1 ? 'Tension' : 'Cold';
}

function gangRandomMember(roleHint=''){
  const rolePool = roleHint ? [roleHint] : ['enforcer','dealer','runner','hitter','lookout'];
  return {
    id:`gm_${Math.random().toString(36).slice(2,9)}`,
    name:`${pick(NM.concat(NF))} ${pick(NS)}`,
    age:rnd(16,34),
    role:pick(rolePool),
    loyalty:rnd(25,80),
    aggression:rnd(18,90),
    competence:rnd(25,86),
    greed:rnd(16,88),
  };
}

function gangEnsureMemberPool(){
  ensureCrimeShape();
  const g = G.crime.gang;
  if(!Array.isArray(g.members)) g.members = [];
  if(g.members.length<4){
    while(g.members.length<4) g.members.push(gangRandomMember());
  }
  if(!g.hierarchy || typeof g.hierarchy!=='object') g.hierarchy = { shotCaller:'', core:[], young:[] };
  if(!g.hierarchy.shotCaller){
    g.hierarchy.shotCaller = g.members[0]?.name || '';
  }
  if(!Array.isArray(g.hierarchy.core) || !g.hierarchy.core.length){
    g.hierarchy.core = g.members.slice(0,2).map(m=>m.name);
  }
  if(!Array.isArray(g.hierarchy.young) || !g.hierarchy.young.length){
    g.hierarchy.young = g.members.slice(2,4).map(m=>m.name);
  }
}

function gangEscalate(trigger=''){
  ensureCrimeShape();
  const g = G.crime.gang;
  const a = gangArchetype();
  const bias = a?.beefBias || 1;
  g.beef.score = clamp((g.beef.score||0) + Math.round(rnd(8,17)*bias));
  if(g.beef.score>=75) g.beef.level = 3;
  else if(g.beef.score>=42) g.beef.level = 2;
  else if(g.beef.score>=16) g.beef.level = 1;
  g.beef.lastTrigger = trigger || g.beef.lastTrigger || 'disrespect';
  if(!g.beef.rival){
    const r = gangRivalsFor(g.type);
    g.beef.rival = r.length ? pick(r) : 'unknown';
  }
}

function gangDeescalate(amount){
  ensureCrimeShape();
  const g = G.crime.gang;
  g.beef.score = clamp(Math.max(0, (g.beef.score||0) - Math.max(1, amount|0)));
  if(g.beef.score>=75) g.beef.level = 3;
  else if(g.beef.score>=42) g.beef.level = 2;
  else if(g.beef.score>=16) g.beef.level = 1;
  else g.beef.level = 0;
}

function ensureCrimeShape(){
  if(!G.crime || typeof G.crime!=='object') G.crime = {};
  if(!Array.isArray(G.crime.log)) G.crime.log = [];
  if(typeof G.crime.heat!=='number') G.crime.heat = 0;
  if(typeof G.crime.notoriety!=='number') G.crime.notoriety = 0;
  if(!G.crime.police || typeof G.crime.police!=='object') G.crime.police = { closeness:0, arrested:false, sentence:0, inPrison:false };
  if(!G.crime.prison || typeof G.crime.prison!=='object'){
    G.crime.prison = { respect:10, fear:10, protection:0, sanity:70, security:'Low', faction:null, guards:{ strict:50, corrupt:20 } };
  }
  if(!G.crime.gang || typeof G.crime.gang!=='object'){
    G.crime.gang = { joined:false, type:null, name:null, colors:'', symbol:'', style:'', territory:1, cred:10, notoriety:5, crew:[], leader:null, affiliation:'', clout:0 };
  }
  const g = G.crime.gang;
  if(typeof g.joined!=='boolean') g.joined = false;
  if(typeof g.type!=='string' && g.type!==null) g.type = null;
  if(typeof g.name!=='string' && g.name!==null) g.name = null;
  if(typeof g.colors!=='string') g.colors = '';
  if(typeof g.symbol!=='string') g.symbol = '';
  if(typeof g.style!=='string') g.style = '';
  if(typeof g.territory!=='number') g.territory = 1;
  if(typeof g.cred!=='number') g.cred = 10;
  if(typeof g.notoriety!=='number') g.notoriety = 5;
  if(!Array.isArray(g.crew)) g.crew = [];
  if(typeof g.leader!=='string' && g.leader!==null) g.leader = null;
  if(typeof g.affiliation!=='string') g.affiliation = '';
  if(typeof g.clout!=='number') g.clout = 0;
  if(!Array.isArray(g.members)) g.members = [];
  if(!g.hierarchy || typeof g.hierarchy!=='object') g.hierarchy = { shotCaller:'', core:[], young:[] };
  if(typeof g.hierarchy.shotCaller!=='string') g.hierarchy.shotCaller = '';
  if(!Array.isArray(g.hierarchy.core)) g.hierarchy.core = [];
  if(!Array.isArray(g.hierarchy.young)) g.hierarchy.young = [];
  if(!g.beef || typeof g.beef!=='object') g.beef = { rival:'', level:0, score:0, lastTrigger:'', yearsAtWar:0 };
  if(typeof g.beef.rival!=='string') g.beef.rival = '';
  if(typeof g.beef.level!=='number') g.beef.level = 0;
  if(typeof g.beef.score!=='number') g.beef.score = 0;
  if(typeof g.beef.lastTrigger!=='string') g.beef.lastTrigger = '';
  if(typeof g.beef.yearsAtWar!=='number') g.beef.yearsAtWar = 0;
  if(!g.relationships || typeof g.relationships!=='object') g.relationships = { cohesion:55, internalConflict:0, powerStruggle:0 };
  if(typeof g.relationships.cohesion!=='number') g.relationships.cohesion = 55;
  if(typeof g.relationships.internalConflict!=='number') g.relationships.internalConflict = 0;
  if(typeof g.relationships.powerStruggle!=='number') g.relationships.powerStruggle = 0;
  if(typeof g.retaliations!=='number') g.retaliations = 0;
  if(typeof g.recentViolence!=='number') g.recentViolence = 0;
  if(!G.crime.mafia || typeof G.crime.mafia!=='object'){
    G.crime.mafia = { joined:false, rank:0, fear:10, respect:10, loyalty:40, obedience:50, earnings:0, heat:0, rackets:[], crew:[], territory:1, order:null, fronts:0, corruption:0 };
  }
  if(!G.crime.drugs || typeof G.crime.drugs!=='object') G.crime.drugs = {};
  const d = G.crime.drugs;
  if(typeof d.active!=='boolean') d.active = false;
  if(typeof d.route!=='string') d.route = 'independent';
  if(typeof d.tradeDrug!=='string') d.tradeDrug = 'marijuana';
  if(!d.inventory || typeof d.inventory!=='object') d.inventory = {};
  DRUG_TYPES.forEach(t=>{ if(typeof d.inventory[t.id]!=='number') d.inventory[t.id] = 0; });
  if(typeof d.supplyQuality!=='number') d.supplyQuality = 45;
  if(typeof d.instability!=='number') d.instability = 20;
  if(!Array.isArray(d.zones) || !d.zones.length){
    d.zones = [
      { id:'downtown', label:'Downtown Clubs', demand:26, risk:0.9, assignment:'none', intensity:1 },
      { id:'projects', label:'Housing Projects', demand:30, risk:1.2, assignment:'none', intensity:1 },
      { id:'suburbs', label:'Suburbs', demand:18, risk:0.6, assignment:'none', intensity:1 },
      { id:'industrial', label:'Industrial Strip', demand:22, risk:1.0, assignment:'none', intensity:1 },
    ];
  }
  if(!d.dealers || typeof d.dealers!=='object') d.dealers = { independent:1, gang:0, mafia:0 };
  if(typeof d.income!=='number') d.income = 0;
  if(typeof d.lastIncome!=='number') d.lastIncome = 0;
  if(typeof d.addictionScore!=='number') d.addictionScore = 0;
  if(typeof d.addictionLevel!=='string') d.addictionLevel = 'None';
  if(typeof d.inRecovery!=='boolean') d.inRecovery = false;
  if(typeof d.relapseRisk!=='number') d.relapseRisk = 8;
  if(!d.junkie || typeof d.junkie!=='object') d.junkie = { active:false, years:0, housing:'none', isolation:0 };
  if(typeof d.junkie.active!=='boolean') d.junkie.active = false;
  if(typeof d.junkie.years!=='number') d.junkie.years = 0;
  if(typeof d.junkie.housing!=='string') d.junkie.housing = 'none';
  if(typeof d.junkie.isolation!=='number') d.junkie.isolation = 0;
  if(!d.trip || typeof d.trip!=='object') d.trip = { active:false, label:'', expiresAge:0, rebound:{ happy:0, smarts:0, stress:0 } };
  if(typeof d.trip.active!=='boolean') d.trip.active = false;
  if(typeof d.trip.label!=='string') d.trip.label = '';
  if(typeof d.trip.expiresAge!=='number') d.trip.expiresAge = 0;
  if(!d.trip.rebound || typeof d.trip.rebound!=='object') d.trip.rebound = { happy:0, smarts:0, stress:0 };
  ['happy','smarts','stress'].forEach(k=>{ if(typeof d.trip.rebound[k]!=='number') d.trip.rebound[k] = 0; });
  if(!Array.isArray(d.familyCases)) d.familyCases = [];
  if(typeof d.recentViolence!=='number') d.recentViolence = 0;
  if(!d.useCount || typeof d.useCount!=='object') d.useCount = {};
  DRUG_TYPES.forEach(t=>{ if(typeof d.useCount[t.id]!=='number') d.useCount[t.id] = 0; });
  HALLUCINOGEN_TYPES.forEach(t=>{ if(typeof d.useCount[t.id]!=='number') d.useCount[t.id] = 0; });

  if(!G.crime.heists || typeof G.crime.heists!=='object') G.crime.heists = {};
  const h = G.crime.heists;
  if(!h.active || typeof h.active!=='object') h.active = null;
  if(!Array.isArray(h.history)) h.history = [];
  if(!h.market || typeof h.market!=='object') h.market = {};
  if(typeof h.planningQuality!=='number') h.planningQuality = 0;
  if(typeof h.crewEfficiency!=='number') h.crewEfficiency = 0;
  if(typeof h.betrayalRisk!=='number') h.betrayalRisk = 0;
  if(typeof h.cooldown!=='number') h.cooldown = 0;
  if(typeof h.totalTake!=='number') h.totalTake = 0;
  if(!Array.isArray(h.setupPopupSeen)) h.setupPopupSeen = [];
  if(typeof G.crime.currentHeist!=='string' && G.crime.currentHeist!==null) G.crime.currentHeist = null;
}

const HEIST_TIER_META = {
  entry:{ label:'Entry', heatMult:0.75, deathRisk:0.02, fame:2 },
  urban:{ label:'Urban', heatMult:1.0, deathRisk:0.05, fame:4 },
  major:{ label:'Major', heatMult:1.25, deathRisk:0.09, fame:7 },
  national:{ label:'National', heatMult:1.6, deathRisk:0.14, fame:10 },
  apex:{ label:'Apex', heatMult:1.95, deathRisk:0.22, fame:14 },
};

const HEIST_BLUEPRINTS = [
  {
    id:'jewellery_store',
    label:'Jewellery Store Heist',
    location:'Crownline Jewellery Exchange, Midtown',
    tier:'entry',
    difficulty:28,
    minNotoriety:0,
    minSetups:2,
    payout:[90000,220000],
    baseHeat:14,
    specialistRole:'Safecracker',
    setups:[
      { id:'store_recon', label:'Recon floor layout', desc:'Map cameras and guard rotations.', cost:2500, planning:10, success:5, risk:-8, payout:0.02, heat:1 },
      { id:'smash_kit', label:'Build smash kit', desc:'Fast-entry tools for cases.', cost:4000, planning:7, success:4, risk:-2, payout:0.08, heat:2 },
      { id:'silent_case', label:'Acquire glass cutter', desc:'Quiet case access.', cost:7000, planning:10, success:7, risk:-10, payout:-0.03, heat:0 },
      { id:'exit_route', label:'Scout police response lanes', desc:'Predict patrol timing around the block.', cost:3000, planning:8, success:4, risk:-6, payout:0.01, heat:0 },
    ],
    steps:[
      { id:'entry', title:'Store entry', prompt:'Alarmed front and service hallway both look viable.', options:[
        { label:'Smash front and shock crowd', success:9, risk:14, payout:0.15, casualty:8, heat:9, speed:20, betrayal:4 },
        { label:'Service hallway breach', success:6, risk:7, payout:0.06, casualty:3, heat:5, speed:12, betrayal:1 },
        { label:'Wait for shift change', success:4, risk:4, payout:-0.02, casualty:1, heat:2, speed:-8, betrayal:0 },
      ]},
      { id:'vault', title:'Vault room', prompt:'Safe door is old-school steel with upgraded relockers.', options:[
        { label:'Safecracker takes lead', success:8, risk:5, payout:0.12, casualty:1, heat:3, speed:8, betrayal:0 },
        { label:'Enforcer uses thermic lance', success:5, risk:11, payout:0.16, casualty:6, heat:8, speed:15, betrayal:2 },
        { label:'Grab display stock and bail', success:7, risk:4, payout:-0.18, casualty:1, heat:2, speed:18, betrayal:0 },
      ]},
      { id:'escape', title:'Exit', prompt:'Two police units are approaching from opposite streets.', options:[
        { label:'Driver forces alley exit', success:8, risk:11, payout:0.02, casualty:5, heat:7, speed:12, betrayal:1 },
        { label:'Blend into crowd in disguise', success:5, risk:6, payout:-0.05, casualty:1, heat:1, speed:-3, betrayal:3 },
        { label:'Shoot through checkpoint', success:3, risk:16, payout:0.07, casualty:12, heat:12, speed:16, betrayal:4 },
      ]},
    ],
  },
  {
    id:'citibank',
    label:'Citibank Heist',
    location:'Citibank Financial Center, Downtown',
    tier:'urban',
    difficulty:45,
    minNotoriety:20,
    minSetups:3,
    payout:[420000,980000],
    baseHeat:24,
    specialistRole:'Negotiator',
    setups:[
      { id:'inside_info', label:'Inside teller schedule', desc:'Identify peak cash windows and panic button habits.', cost:12000, planning:12, success:7, risk:-8, payout:0.05, heat:2 },
      { id:'vault_access', label:'Vault access strategy', desc:'Steal keycard clone and lock timing.', cost:18000, planning:14, success:10, risk:-9, payout:0.09, heat:3 },
      { id:'crowd_model', label:'Crowd flow simulation', desc:'Predict hostages and line-of-sight issues.', cost:8000, planning:8, success:5, risk:-6, payout:0.02, heat:1 },
      { id:'getaway_cells', label:'Distributed getaway cars', desc:'Burner vehicles across 3 blocks.', cost:16000, planning:10, success:6, risk:-8, payout:0.03, heat:1 },
    ],
    steps:[
      { id:'lobby_control', title:'Lobby control', prompt:'A security guard is reaching for the silent alarm.', options:[
        { label:'Hard intimidation', success:7, risk:12, payout:0.12, casualty:8, heat:10, speed:15, betrayal:2 },
        { label:'Negotiator calms room', success:6, risk:5, payout:0.02, casualty:2, heat:4, speed:4, betrayal:0 },
        { label:'Abort lobby and push vault only', success:4, risk:7, payout:-0.2, casualty:3, heat:5, speed:8, betrayal:1 },
      ]},
      { id:'vault_breach', title:'Vault breach', prompt:'Time lock has 4 minutes left on cycle.', options:[
        { label:'Wait for legal cycle and crack', success:8, risk:4, payout:0.08, casualty:1, heat:2, speed:-6, betrayal:2 },
        { label:'Explosive hinge cut', success:5, risk:14, payout:0.16, casualty:9, heat:11, speed:18, betrayal:3 },
        { label:'Cut losses and clear cash drawers', success:7, risk:5, payout:-0.14, casualty:2, heat:3, speed:11, betrayal:0 },
      ]},
      { id:'city_escape', title:'City escape', prompt:'Downtown traffic is gridlocked after the first dispatch call.', options:[
        { label:'Driver uses tunnel route', success:8, risk:8, payout:0.04, casualty:4, heat:6, speed:9, betrayal:0 },
        { label:'Switch to subway egress', success:6, risk:6, payout:-0.03, casualty:2, heat:2, speed:2, betrayal:2 },
        { label:'Hijack ambulance corridor', success:4, risk:13, payout:0.07, casualty:7, heat:9, speed:14, betrayal:3 },
      ]},
    ],
  },
  {
    id:'federal_reserve',
    label:'Federal Reserve Heist',
    location:'Federal Reserve Currency Annex, Manhattan',
    tier:'national',
    difficulty:72,
    minNotoriety:48,
    minSetups:4,
    payout:[2200000,6200000],
    baseHeat:42,
    specialistRole:'Security Engineer',
    setups:[
      { id:'blueprints', label:'Acquire subterranean blueprints', desc:'Map service tunnels and seismic sensors.', cost:60000, planning:16, success:10, risk:-10, payout:0.03, heat:3 },
      { id:'cipher_keys', label:'Obtain rotating cipher keys', desc:'Spoof two-factor door chains.', cost:90000, planning:18, success:14, risk:-12, payout:0.07, heat:4 },
      { id:'power_override', label:'Substation override package', desc:'Create controlled blackout windows.', cost:55000, planning:12, success:8, risk:-7, payout:0.04, heat:3 },
      { id:'federal_safehouse', label:'Federal manhunt safehouses', desc:'Prep 3-state fallback route.', cost:70000, planning:15, success:9, risk:-9, payout:0.02, heat:1 },
      { id:'counterintel', label:'Counterintelligence leak scan', desc:'Check for informants and watchers.', cost:40000, planning:11, success:7, risk:-8, payout:0.01, heat:1 },
    ],
    steps:[
      { id:'approach', title:'Approach', prompt:'Choose opening doctrine: stealth corridor or forceful breach.', options:[
        { label:'Stealth doctrine', success:10, risk:5, payout:0.03, casualty:2, heat:4, speed:-3, betrayal:0 },
        { label:'Brute breach doctrine', success:4, risk:15, payout:0.15, casualty:11, heat:14, speed:18, betrayal:3 },
      ]},
      { id:'core_vault', title:'Core vault network', prompt:'Inner vault sits behind timed interlocks and pressure flooring.', options:[
        { label:'Precision sequenced unlock', success:11, risk:5, payout:0.08, casualty:1, heat:3, speed:-4, betrayal:0 },
        { label:'Forced relay bypass', success:6, risk:12, payout:0.14, casualty:7, heat:9, speed:10, betrayal:2 },
        { label:'Take reserve transfer pallets only', success:8, risk:6, payout:-0.2, casualty:2, heat:4, speed:13, betrayal:1 },
      ]},
      { id:'federal_response', title:'Federal response', prompt:'National response protocol is active and comms are saturated.', options:[
        { label:'Split crew into two escape cells', success:8, risk:9, payout:-0.05, casualty:5, heat:7, speed:6, betrayal:4 },
        { label:'Keep crew tight and armored', success:6, risk:12, payout:0.02, casualty:7, heat:10, speed:8, betrayal:1 },
        { label:'Burn decoy truck convoy', success:7, risk:8, payout:-0.08, casualty:3, heat:5, speed:12, betrayal:0 },
      ]},
    ],
  },
  {
    id:'yacht',
    label:'Steven Croft Yacht Heist',
    location:'Croft\'s yacht "Lucent Vow", Atlantic route',
    tier:'major',
    difficulty:58,
    minNotoriety:36,
    minSetups:3,
    payout:[950000,2800000],
    baseHeat:30,
    specialistRole:'Diver',
    setups:[
      { id:'route_ping', label:'Route interception intel', desc:'Track moving route and weather windows.', cost:22000, planning:12, success:7, risk:-7, payout:0.05, heat:1 },
      { id:'boarding_kit', label:'Boarding kit and grapples', desc:'Tooling for moving-hull entry.', cost:15000, planning:9, success:5, risk:-5, payout:0.03, heat:1 },
      { id:'manifest', label:'Diamond manifest leak', desc:'Identify where Croft stores stones onboard.', cost:30000, planning:14, success:10, risk:-8, payout:0.1, heat:2 },
      { id:'coastline_exit', label:'Coastline extraction cache', desc:'Fuel and med cache near extraction cove.', cost:18000, planning:8, success:5, risk:-6, payout:0.01, heat:1 },
    ],
    steps:[
      { id:'intercept', title:'Open water intercept', prompt:'Sea state is unstable and yacht speed is increasing.', options:[
        { label:'Night shadow approach', success:8, risk:7, payout:0.03, casualty:3, heat:4, speed:5, betrayal:0 },
        { label:'Direct speedboat slam', success:5, risk:13, payout:0.12, casualty:8, heat:9, speed:16, betrayal:2 },
      ]},
      { id:'board', title:'Boarding', prompt:'Deck security rotates every 90 seconds.', options:[
        { label:'Diver inserts from stern', success:10, risk:6, payout:0.05, casualty:2, heat:3, speed:4, betrayal:1 },
        { label:'Enforcer clears top deck', success:6, risk:12, payout:0.14, casualty:9, heat:11, speed:14, betrayal:2 },
        { label:'Social bluff as catering', success:7, risk:8, payout:-0.03, casualty:2, heat:2, speed:2, betrayal:3 },
      ]},
      { id:'exfil', title:'Marine exfiltration', prompt:'Coast guard chatter confirms active sweep.', options:[
        { label:'Drop to submarine tender', success:8, risk:8, payout:-0.04, casualty:3, heat:5, speed:10, betrayal:0 },
        { label:'Race to private marina', success:6, risk:11, payout:0.03, casualty:6, heat:8, speed:14, betrayal:1 },
        { label:'Scuttle decoy boat and swim', success:5, risk:10, payout:-0.09, casualty:7, heat:4, speed:3, betrayal:2 },
      ]},
    ],
  },
  {
    id:'casino',
    label:'Grand Crescent Casino Heist',
    location:'Grand Crescent Casino, Las Venturas',
    tier:'major',
    difficulty:63,
    minNotoriety:40,
    minSetups:3,
    payout:[1100000,3600000],
    baseHeat:33,
    specialistRole:'Con Artist',
    setups:[
      { id:'disguises', label:'Acquire staff disguises', desc:'High-end uniforms and chips authentication.', cost:26000, planning:12, success:8, risk:-7, payout:0.03, heat:1 },
      { id:'inside_host', label:'Flip pit manager', desc:'Secure insider path to vault elevator.', cost:42000, planning:16, success:11, risk:-10, payout:0.08, heat:3 },
      { id:'security_map', label:'Map surveillance spine', desc:'Track dead zones and mafia watch points.', cost:28000, planning:13, success:9, risk:-9, payout:0.04, heat:2 },
      { id:'countroom_clone', label:'Clone count room keyset', desc:'Access to back cash processing rooms.', cost:24000, planning:11, success:8, risk:-7, payout:0.05, heat:2 },
    ],
    steps:[
      { id:'approach', title:'Approach method', prompt:'Pick a doctrine for the casino floor.', options:[
        { label:'Stealth infiltration', success:10, risk:5, payout:0.02, casualty:1, heat:3, speed:-2, betrayal:1 },
        { label:'Social engineering con', success:8, risk:7, payout:0.07, casualty:2, heat:4, speed:4, betrayal:2 },
        { label:'Aggressive takeover', success:5, risk:15, payout:0.16, casualty:10, heat:12, speed:15, betrayal:0 },
      ]},
      { id:'mafia_guard', title:'Mafia guards', prompt:'House mafia detail spots movement near the count room.', options:[
        { label:'Pay them off quietly', success:7, risk:5, payout:-0.08, casualty:1, heat:2, speed:2, betrayal:0 },
        { label:'Con artist misdirection', success:8, risk:8, payout:0.03, casualty:3, heat:5, speed:5, betrayal:2 },
        { label:'Enforcer neutralizes guards', success:5, risk:14, payout:0.1, casualty:9, heat:10, speed:11, betrayal:3 },
      ]},
      { id:'count_room', title:'Count room extraction', prompt:'Vault timers and table-game revenue bundles are moving fast.', options:[
        { label:'Hit high-value chips only', success:8, risk:6, payout:0.06, casualty:2, heat:4, speed:8, betrayal:0 },
        { label:'Drain full count room', success:6, risk:11, payout:0.15, casualty:6, heat:9, speed:12, betrayal:2 },
        { label:'Take digital ledger and blackmail', success:7, risk:8, payout:-0.04, casualty:2, heat:3, speed:3, betrayal:4 },
      ]},
    ],
  },
  {
    id:'train',
    label:'Ridgeway Train Heist',
    location:'Ridgeway elevated freight line',
    tier:'urban',
    difficulty:52,
    minNotoriety:30,
    minSetups:3,
    payout:[520000,1500000],
    baseHeat:27,
    specialistRole:'Demolitions',
    setups:[
      { id:'schedule', label:'Steal rail timetable', desc:'Locate high-value cars and patrol intervals.', cost:12000, planning:10, success:6, risk:-7, payout:0.04, heat:1 },
      { id:'track_tools', label:'Track tool staging', desc:'Signal jammers and clamp packs.', cost:18000, planning:11, success:8, risk:-8, payout:0.05, heat:2 },
      { id:'bridge_spot', label:'Choose interception bridge', desc:'Higher loot odds, worse escape if wrong.', cost:14000, planning:8, success:5, risk:-5, payout:0.09, heat:1 },
      { id:'cargo_manifest', label:'Cargo manifest leak', desc:'Avoid decoy containers.', cost:21000, planning:12, success:8, risk:-7, payout:0.07, heat:2 },
    ],
    steps:[
      { id:'intercept', title:'Interception timing', prompt:'Train speed is 10% higher than projected.', options:[
        { label:'Force emergency brake now', success:6, risk:12, payout:0.12, casualty:7, heat:8, speed:16, betrayal:2 },
        { label:'Shadow and intercept at tunnel', success:8, risk:7, payout:0.04, casualty:3, heat:4, speed:8, betrayal:1 },
        { label:'Abort and re-hit another car', success:4, risk:4, payout:-0.1, casualty:1, heat:1, speed:-6, betrayal:4 },
      ]},
      { id:'car_entry', title:'Cargo car entry', prompt:'Two armored cars and one decoy container are in view.', options:[
        { label:'Demolitions opens armored car', success:8, risk:10, payout:0.11, casualty:5, heat:7, speed:12, betrayal:1 },
        { label:'Hacker spoof smart lock', success:7, risk:6, payout:0.06, casualty:2, heat:3, speed:5, betrayal:0 },
        { label:'Grab easiest visible cargo', success:6, risk:5, payout:-0.13, casualty:1, heat:2, speed:10, betrayal:2 },
      ]},
      { id:'time_window', title:'Limited decision window', prompt:'Air unit ETA is under 4 minutes.', options:[
        { label:'Take partial haul and jump', success:8, risk:6, payout:-0.05, casualty:2, heat:3, speed:14, betrayal:0 },
        { label:'Push for max haul', success:5, risk:13, payout:0.15, casualty:8, heat:10, speed:9, betrayal:2 },
        { label:'Detach car and tow later', success:4, risk:9, payout:0.04, casualty:4, heat:5, speed:2, betrayal:5 },
      ]},
    ],
  },
  {
    id:'little_wayne_island',
    label:'Little Wayne Island Heist',
    location:'Little Wayne Island, estate of billionaire host circles',
    tier:'apex',
    difficulty:88,
    minNotoriety:68,
    minSetups:4,
    payout:[8200000,22000000],
    baseHeat:55,
    specialistRole:'Infiltration Architect',
    setups:[
      { id:'island_recon', label:'Recon security grid', desc:'Map elite patrol boats, drones, thermal nets.', cost:180000, planning:18, success:12, risk:-11, payout:0.05, heat:4 },
      { id:'entry_vector', label:'Secure entry method', desc:'Subsea tunnel, helicopter spoof, or dock clone.', cost:210000, planning:16, success:11, risk:-10, payout:0.04, heat:4 },
      { id:'disable_systems', label:'Disable sensor lattice', desc:'Interference package for cameras and pressure floors.', cost:230000, planning:17, success:12, risk:-12, payout:0.05, heat:5 },
      { id:'insider', label:'Insider intelligence', desc:'Flip island operations staff for vault timing.', cost:260000, planning:20, success:14, risk:-12, payout:0.08, heat:5 },
      { id:'extraction', label:'Ocean extraction chain', desc:'Multi-hop extraction with decoys due to isolation.', cost:170000, planning:13, success:9, risk:-8, payout:0.02, heat:2 },
    ],
    steps:[
      { id:'isolation_entry', title:'Island entry', prompt:'Island weather is changing and helipad checks doubled.', options:[
        { label:'Subsea breach during storm', success:9, risk:11, payout:0.06, casualty:6, heat:6, speed:9, betrayal:1 },
        { label:'Forged VIP convoy docking', success:8, risk:8, payout:0.04, casualty:3, heat:4, speed:5, betrayal:3 },
        { label:'Direct armed insertion', success:5, risk:18, payout:0.17, casualty:14, heat:15, speed:17, betrayal:0 },
      ]},
      { id:'outer_perimeter', title:'Outer perimeter corridor', prompt:'Thermal drones and sniper nests overlap every 40 seconds around the estate ring road.', options:[
        { label:'Hacker loops thermal feed', success:10, risk:7, payout:0.02, casualty:2, heat:3, speed:3, betrayal:1 },
        { label:'Driver rushes blind corners', success:7, risk:13, payout:0.05, casualty:7, heat:8, speed:12, betrayal:2 },
        { label:'Enforcer clears perimeter hard', success:6, risk:16, payout:0.08, casualty:11, heat:12, speed:10, betrayal:0 },
      ]},
      { id:'estate_core', title:'Estate core', prompt:'Panic vault route forks into trophy room, crypto cold-room, and art wing.', options:[
        { label:'Hit vault and leave art', success:9, risk:9, payout:0.11, casualty:4, heat:7, speed:7, betrayal:0 },
        { label:'Split crew across all wings', success:6, risk:14, payout:0.2, casualty:9, heat:12, speed:11, betrayal:6 },
        { label:'Trigger blackout and ghost path', success:8, risk:7, payout:0.06, casualty:3, heat:5, speed:4, betrayal:2 },
      ]},
      { id:'data_spine', title:'Data spine raid', prompt:'The island data spine controls off-ledger wallets, art provenance, and shell-company ledgers.', options:[
        { label:'Clone data and keep moving', success:8, risk:8, payout:0.09, casualty:3, heat:6, speed:6, betrayal:1 },
        { label:'Ransom the ledgers live', success:6, risk:13, payout:0.16, casualty:6, heat:10, speed:4, betrayal:5 },
        { label:'Wipe evidence trails only', success:9, risk:6, payout:-0.08, casualty:2, heat:2, speed:5, betrayal:0 },
      ]},
      { id:'host_network', title:'Host and guard network', prompt:'Estate hosts are panicking while private militia reorganizes around your last known position.', options:[
        { label:'Negotiator stabilizes civilians', success:9, risk:7, payout:-0.03, casualty:1, heat:3, speed:-2, betrayal:1 },
        { label:'Use host panic as smoke', success:6, risk:15, payout:0.11, casualty:10, heat:13, speed:9, betrayal:4 },
        { label:'Seal corridors and isolate militia', success:8, risk:10, payout:0.04, casualty:5, heat:7, speed:6, betrayal:2 },
      ]},
      { id:'collapse_window', title:'Collapse window', prompt:'Island lockdown starts in 90 seconds and sea lanes are blocked.', options:[
        { label:'Hold formation and force one lane', success:7, risk:13, payout:0.03, casualty:8, heat:10, speed:10, betrayal:1 },
        { label:'Break into micro-teams', success:8, risk:9, payout:-0.06, casualty:5, heat:6, speed:8, betrayal:7 },
        { label:'Burn decoy yacht extraction', success:6, risk:11, payout:-0.1, casualty:4, heat:5, speed:12, betrayal:0 },
      ]},
      { id:'deepwater_exit', title:'Deepwater exfiltration', prompt:'Air patrols lock the north channel while your offshore extraction chain starts collapsing.', options:[
        { label:'Subsea tunnels to outer reef', success:9, risk:10, payout:0.02, casualty:4, heat:6, speed:7, betrayal:1 },
        { label:'Hijack coastguard corridor', success:6, risk:16, payout:0.07, casualty:9, heat:12, speed:13, betrayal:3 },
        { label:'Dump heavy loot for clean exit', success:10, risk:6, payout:-0.14, casualty:2, heat:3, speed:11, betrayal:0 },
      ]},
    ],
  },
];

const HEIST_ROLE_NAMES = {
  Hacker:['Iris Vale','Niko Byte','Kade Cipher','Lena Null','Rafe Loop','Mila Vector'],
  Driver:['Mason Drift','Tara Slip','Jace Pike','Rin Voss','Dex Havoc','Juno Vale'],
  Enforcer:['Bruno Slate','Kira Knox','Viktor Hale','Jett Rook','Mara Stone','Axel Ward'],
  'Safecracker':['Owen Dial','Kimi Locke','Silas Pin','Aria Tumblers'],
  Negotiator:['Rhea Vox','Parker Lane','Noah Silk','Lina Hart'],
  'Security Engineer':['Dorian Mesh','Asha Gate','Quinn Relay','Ivo Circuit'],
  Diver:['Nadia Deep','Cole Keel','Mira Tide','Rowan Reef'],
  'Con Artist':['Sienna Bluff','Eli Monroe','Nora Mint','Cal Vane'],
  Demolitions:['Rex Blaster','Tova Fuse','Gage Flint','Milo Charge'],
  'Infiltration Architect':['Lyra Ghost','Cass Ward','Evren Shade','Nina Prism'],
};

const HEIST_SETUP_POPUPS = [
  { id:'command_van_rehearsal', icon:'📡', title:'Command Van Rehearsal',
    text:'Your recon van intercepts a live police dispatch rehearsal that maps likely response routes.',
    options:[
      { id:'spoof_dispatch', label:'Inject spoofed dispatch chatter', desc:'Raise confusion but risk forensic traces.', effects:{ planning:5, success:3, risk:1, wanted:2, money:-12000 } },
      { id:'record_only', label:'Record and study only', desc:'Safer intel extraction, smaller edge.', effects:{ planning:3, success:1, risk:-1 } },
      { id:'sell_fragment', label:'Sell fragments to another crew', desc:'Quick cash, but leaks your activity.', effects:{ money:26000, wanted:4, betrayal:2 } },
      { id:'burn_van', label:'Burn the van and reset kit', desc:'Expensive reset that lowers future exposure.', effects:{ money:-24000, risk:-4, wanted:-2 } },
    ] },
  { id:'forged_passports', icon:'🛂', title:'Forged Identity Batch',
    text:'A document broker offers premium passports for setup movement and post-job exits.',
    options:[
      { id:'buy_premium', label:'Buy premium identities', desc:'Big expense, cleaner cross-border exits.', effects:{ planning:4, success:2, risk:-3, money:-30000 } },
      { id:'buy_basic', label:'Buy basic papers', desc:'Affordable but easier to flag.', effects:{ planning:2, risk:1, money:-12000 } },
      { id:'forge_inhouse', label:'Forge in-house overnight', desc:'Risky speed play with no broker trail.', effects:{ speed:5, risk:3, success:1 } },
      { id:'skip_docs', label:'Skip documents', desc:'No cost now, harder extraction later.', effects:{ money:0, risk:4, planning:-2 } },
    ] },
  { id:'drone_blind_spot', icon:'🛸', title:'Drone Blind Spot Discovered',
    text:'A mapper finds a 42-second blind spot in aerial surveillance but only at a narrow angle.',
    options:[
      { id:'train_window', label:'Train entire crew on the 42s window', desc:'Consistent timing advantage.', effects:{ planning:6, success:2, speed:2, money:-15000 } },
      { id:'use_once', label:'Use it once for entry only', desc:'Moderate edge with less prep time.', effects:{ planning:3, success:1, speed:4 } },
      { id:'sell_to_rival', label:'Sell location to a rival buyer', desc:'Take money, lose future stealth edge.', effects:{ money:38000, planning:-3, betrayal:3 } },
      { id:'ignore_signal', label:'Ignore as unreliable', desc:'No prep spend, no tactical gain.', effects:{ risk:1 } },
    ] },
  { id:'bribed_harbormaster', icon:'⚓', title:'Harbormaster Reach-Out',
    text:'A harbormaster asks for payment to bury docking logs tied to your setup transports.',
    options:[
      { id:'pay_full', label:'Pay full hush fee', desc:'Clean records and safer extraction lanes.', effects:{ money:-45000, risk:-4, wanted:-1, planning:2 } },
      { id:'partial_pay', label:'Pay half and pressure compliance', desc:'Cheaper but unstable loyalty.', effects:{ money:-20000, risk:-1, betrayal:2 } },
      { id:'blackmail_him', label:'Blackmail instead of paying', desc:'No fee now, exposure if he flips.', effects:{ money:0, risk:3, betrayal:4, closeness:3 } },
      { id:'walk_away', label:'Walk away', desc:'No cost, logs remain available to investigators.', effects:{ risk:3, closeness:4 } },
    ] },
  { id:'signal_jammer', icon:'📶', title:'Signal Jammer Tuning',
    text:'Your jammer can either blanket comms or run precision bursts around key checkpoints.',
    options:[
      { id:'blanket_jam', label:'Blanket jam all channels', desc:'Fast disruption, spikes law-enforcement attention.', effects:{ success:3, speed:4, wanted:4, risk:2 } },
      { id:'precision_jam', label:'Precision burst protocol', desc:'Lower profile, requires cleaner timing.', effects:{ planning:4, risk:-2, speed:1 } },
      { id:'dual_stack', label:'Install dual-mode rig', desc:'Strong flexibility with expensive hardware.', effects:{ planning:3, success:2, money:-28000 } },
      { id:'no_jammer', label:'Save money and skip jammer', desc:'Lower setup spend but weaker control.', effects:{ money:0, risk:3, success:-1 } },
    ] },
  { id:'safehouse_leak', icon:'🏚️', title:'Safehouse Leak Rumor',
    text:'A whisper claims one fallback safehouse is compromised by a surveillance team.',
    options:[
      { id:'relocate_all', label:'Relocate all safehouses tonight', desc:'Costly reset that cuts exposure.', effects:{ money:-52000, planning:3, risk:-4, closeness:-2 } },
      { id:'relocate_one', label:'Move only the flagged house', desc:'Balanced response.', effects:{ money:-18000, risk:-2 } },
      { id:'plant_decoy', label:'Plant decoy activity', desc:'Can misdirect pressure if executed cleanly.', effects:{ planning:2, success:1, wanted:-1, risk:1 } },
      { id:'do_nothing', label:'Do nothing', desc:'Save cash, assume rumor is fake.', effects:{ risk:4, betrayal:1 } },
    ] },
  { id:'decoy_convoy', icon:'🚚', title:'Decoy Convoy Opportunity',
    text:'A logistics contact can stage a decoy convoy to split response during setup movement.',
    options:[
      { id:'full_convoy', label:'Fund full convoy operation', desc:'Strong misdirection with visible spend.', effects:{ money:-60000, success:3, risk:-3, wanted:1 } },
      { id:'mini_convoy', label:'Stage a mini convoy', desc:'Partial split, lower cost.', effects:{ money:-22000, success:1, risk:-1 } },
      { id:'fake_radio_only', label:'Use radio chatter only', desc:'Cheap deception with weaker confidence.', effects:{ money:-6000, planning:1, risk:1 } },
      { id:'scrap_plan', label:'Scrap convoy plan', desc:'No spend, no response split.', effects:{ speed:1, risk:2 } },
    ] },
  { id:'thermic_calibration', icon:'🔥', title:'Thermic Tool Calibration',
    text:'Your thermic cutter can be tuned for speed or reduced thermal signature.',
    options:[
      { id:'fast_cut', label:'Tune for fast breach', desc:'Great tempo, higher heat signature.', effects:{ speed:6, success:2, wanted:3, risk:2 } },
      { id:'cold_cut', label:'Tune for low signature', desc:'Safer profile, slower operation.', effects:{ risk:-3, speed:-2, planning:2 } },
      { id:'balanced_cut', label:'Balanced calibration', desc:'Steady performance with moderate cost.', effects:{ speed:2, risk:-1, money:-9000 } },
      { id:'outsource_cut', label:'Outsource to specialist lab', desc:'High cost, reliable engineering gains.', effects:{ money:-26000, planning:3, success:2, risk:-1 } },
    ] },
  { id:'social_engineering', icon:'🎭', title:'Social Engineering Window',
    text:'A staff social event opens a chance to seed fake credentials and role-play access.',
    options:[
      { id:'deep_cover', label:'Run deep-cover operation', desc:'Strong setup edge with burnout pressure.', effects:{ planning:5, success:3, stress:4, money:-14000 } },
      { id:'quick_hit', label:'Quick credential grab', desc:'Small gains, lower exposure.', effects:{ planning:2, success:1, risk:-1 } },
      { id:'honey_trap', label:'Use romance leverage', desc:'High upside with betrayal fallout.', effects:{ success:3, betrayal:4, notoriety:2 } },
      { id:'decline_window', label:'Decline the social play', desc:'Stay clean and keep pace.', effects:{ happy:1, risk:1 } },
    ] },
  { id:'encryption_key_auction', icon:'🔐', title:'Encryption Key Auction',
    text:'An underground auction is selling access keys compatible with your target systems.',
    options:[
      { id:'win_auction', label:'Outbid everyone and secure keys', desc:'Reliable access at major cost.', effects:{ money:-90000, success:4, planning:4, risk:-2 } },
      { id:'snipe_fragments', label:'Buy partial key fragments', desc:'Cheaper but uncertain integration.', effects:{ money:-34000, success:2, planning:2, risk:1 } },
      { id:'steal_keys', label:'Steal keys from bidders', desc:'No auction cost, high detection chance.', effects:{ money:-5000, success:3, wanted:4, risk:3 } },
      { id:'walk_auction', label:'Skip auction entirely', desc:'Rely on existing tools only.', effects:{ planning:-1, risk:2 } },
    ] },
  { id:'rogue_crew_contact', icon:'🧨', title:'Rogue Crew Contact',
    text:'A known rogue operator offers insider data in exchange for a guaranteed post-heist cut.',
    options:[
      { id:'take_deal', label:'Take deal and promise a cut', desc:'Useful intel with betrayal tax.', effects:{ success:4, planning:2, betrayal:5 } },
      { id:'pay_cash', label:'Pay cash up front instead', desc:'Lower betrayal, higher burn.', effects:{ money:-48000, success:3, betrayal:1 } },
      { id:'double_cross', label:'Take intel and plan to stiff them', desc:'Short-term gain, long-term heat.', effects:{ success:2, betrayal:6, wanted:3, notoriety:3 } },
      { id:'decline_contact', label:'Decline contact', desc:'No volatility, no extra edge.', effects:{ happy:1, planning:0 } },
    ] },
  { id:'weather_window', icon:'🌧️', title:'Weather Window Shift',
    text:'Forecast flips from clear skies to hard rain during your expected setup movement.',
    options:[
      { id:'delay_ops', label:'Delay setup movement', desc:'Safer passage but slower momentum.', effects:{ risk:-3, speed:-4, planning:2 } },
      { id:'push_through', label:'Push through storm anyway', desc:'Maintains pace, raises mishap risk.', effects:{ speed:5, risk:3, health:-2 } },
      { id:'buy_weather_cover', label:'Buy weather-rated gear and transport', desc:'Expensive but controlled.', effects:{ money:-36000, risk:-2, success:2 } },
      { id:'split_routes', label:'Split setup routes by weather cell', desc:'Reduces single-point failure, coordination strain.', effects:{ planning:3, betrayal:2, risk:-1 } },
    ] },
  { id:'blackout_drill', icon:'💡', title:'Blackout Drill',
    text:'A utility engineer can trigger a test blackout matching your setup infiltration window.',
    options:[
      { id:'full_blackout', label:'Trigger full district blackout', desc:'Large tactical edge, massive attention.', effects:{ success:4, speed:3, wanted:5, closeness:4 } },
      { id:'micro_blackout', label:'Trigger micro-grid dip only', desc:'Lower profile but narrower timing.', effects:{ planning:3, risk:-1, money:-14000 } },
      { id:'simulate_fault', label:'Simulate random fault', desc:'Moderate gain with technical uncertainty.', effects:{ success:2, risk:1, planning:1 } },
      { id:'cancel_blackout', label:'Cancel blackout option', desc:'No utility leverage.', effects:{ risk:1 } },
    ] },
  { id:'counterfeit_badges', icon:'🪪', title:'Counterfeit Badge Shipment',
    text:'A batch of counterfeit security badges arrives with mixed quality and traceability.',
    options:[
      { id:'use_best_badges', label:'Use only top-grade badges', desc:'Reduced risk, leave quantity on table.', effects:{ risk:-3, planning:2, money:-11000 } },
      { id:'use_all_badges', label:'Use the whole shipment', desc:'More access points, higher detection tail.', effects:{ success:3, risk:2, wanted:2 } },
      { id:'reprint_batch', label:'Reprint the full badge set', desc:'Strong consistency with print cost.', effects:{ money:-25000, planning:3, success:2 } },
      { id:'ditch_badges', label:'Ditch badges and use force route', desc:'No disguise dependency.', effects:{ speed:3, risk:3, casualty:2 } },
    ] },
  { id:'insider_double_agent', icon:'🕵️', title:'Insider Loyalty Shock',
    text:'Your inside asset may be feeding both sides. You can test loyalty or proceed fast.',
    options:[
      { id:'run_loyalty_test', label:'Run a loyalty test operation', desc:'Slower but reduces betrayal variance.', effects:{ planning:4, betrayal:-3, speed:-2, money:-17000 } },
      { id:'pay_retainer', label:'Pay retainer to lock loyalty', desc:'Bribe to stabilize the insider.', effects:{ money:-42000, betrayal:-4, success:2 } },
      { id:'threaten_asset', label:'Threaten asset into compliance', desc:'Immediate control, volatile trust.', effects:{ success:2, betrayal:4, risk:2 } },
      { id:'cut_asset_out', label:'Cut insider out entirely', desc:'Less betrayal path, weaker targeting.', effects:{ betrayal:-1, success:-2, risk:1 } },
    ] },
];

function heistPopupById(id){
  return HEIST_SETUP_POPUPS.find(p=>p.id===id) || null;
}

function heistSetupPopupImpactText(effects){
  const out = [];
  if(typeof effects.planning==='number' && effects.planning!==0) out.push(`Plan ${effects.planning>0?'+':''}${effects.planning}`);
  if(typeof effects.success==='number' && effects.success!==0) out.push(`Exec ${effects.success>0?'+':''}${effects.success}`);
  if(typeof effects.risk==='number' && effects.risk!==0) out.push(`Risk ${effects.risk>0?'+':''}${effects.risk}`);
  if(typeof effects.speed==='number' && effects.speed!==0) out.push(`Speed ${effects.speed>0?'+':''}${effects.speed}`);
  if(typeof effects.betrayal==='number' && effects.betrayal!==0) out.push(`Betrayal ${effects.betrayal>0?'+':''}${effects.betrayal}`);
  if(typeof effects.wanted==='number' && effects.wanted!==0) out.push(`Heat ${effects.wanted>0?'+':''}${effects.wanted}`);
  if(typeof effects.closeness==='number' && effects.closeness!==0) out.push(`Police ${effects.closeness>0?'+':''}${effects.closeness}`);
  if(typeof effects.money==='number' && effects.money!==0) out.push(`${effects.money>=0?'Cash +':'Cost '}${fmt$(Math.abs(effects.money))}`);
  if(typeof effects.notoriety==='number' && effects.notoriety!==0) out.push(`Notoriety ${effects.notoriety>0?'+':''}${effects.notoriety}`);
  return out.join(' · ') || 'Minor flavor outcome';
}

function heistMaybeOpenSetupPopup(bp, setup, setupSucceeded){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='setup') return false;
  const seen = G.crime.heists.setupPopupSeen || [];
  const unseen = HEIST_SETUP_POPUPS.filter(p=>!seen.includes(p.id));
  const mustShow = unseen.length>0;
  const triggerChance = setupSucceeded ? 0.96 : 0.72;
  if(!mustShow && Math.random() > triggerChance) return false;
  if(mustShow && Math.random() > triggerChance) return false;

  const popup = pick(unseen.length ? unseen : HEIST_SETUP_POPUPS);
  if(!popup) return false;
  if(!seen.includes(popup.id)) seen.push(popup.id);
  G.crime.heists.setupPopupSeen = seen.slice(-30);
  active.pendingSetupPopup = { popupId:popup.id, setupId:setup.id, heistId:bp.id };

  const optionsHtml = popup.options.map((opt, idx)=>`
    <button class="heist-popup-option" onclick="heistResolveSetupPopupChoice('${popup.id}','${opt.id}')">
      <div class="heist-popup-option-top">
        <span class="heist-popup-option-index">${idx+1}</span>
        <span class="heist-popup-option-label">${opt.label}</span>
      </div>
      <div class="heist-popup-option-desc">${opt.desc}</div>
      <div class="heist-popup-impact">${heistSetupPopupImpactText(opt.effects||{})}</div>
    </button>
  `).join('');
  const html = `
    <div class="heist-popup-shell">
      <div class="heist-popup-head">
        <div class="heist-popup-icon">${popup.icon}</div>
        <div>
          <div class="heist-popup-kicker">SETUP EVENT · ${bp.label}</div>
          <div class="heist-popup-title">${popup.title}</div>
        </div>
      </div>
      <div class="heist-popup-copy">${popup.text}</div>
      <div class="heist-popup-meta">
        Triggered by setup: <strong>${setup.label}</strong> · ${setupSucceeded?'Setup succeeded':'Setup failed'} · Scroll options below
      </div>
      <div class="heist-popup-scroll">
        ${optionsHtml}
      </div>
    </div>
  `;
  showPopupHTML(
    `${popup.icon} Heist Setup Event`,
    html,
    [{ label:'Ignore Event', cls:'btn-ghost', onClick:()=>heistResolveSetupPopupChoice(popup.id, '__ignore') }],
    'dark'
  );
  return true;
}

function heistResolveSetupPopupChoice(popupId, optionId){
  ensureCrimeShape();
  const overlay = document.getElementById('popup-overlay');
  const active = G.crime.heists.active;
  if(!active){
    if(overlay) overlay.style.display = 'none';
    return;
  }
  const pending = active.pendingSetupPopup || null;
  const popup = heistPopupById(popupId);
  if(!popup || !pending || pending.popupId!==popupId){
    if(overlay) overlay.style.display = 'none';
    return;
  }
  if(optionId==='__ignore'){
    active.pendingSetupPopup = null;
    active.setupEffects.risk = (active.setupEffects.risk||0) + 1;
    addCrimeEv(`Ignored setup event: ${popup.title}.`, 'warn');
    addEv(`You ignored a setup opportunity (${popup.title}).`, 'warn');
    if(overlay) overlay.style.display = 'none';
    heistRecalcScores();
    updateHUD();
    renderCrime();
    return;
  }

  const choice = popup.options.find(o=>o.id===optionId);
  if(!choice){
    if(overlay) overlay.style.display = 'none';
    return;
  }
  const fx = choice.effects || {};
  if(typeof fx.money==='number' && fx.money<0 && G.money < Math.abs(fx.money)){
    flash(`Need ${fmt$(Math.abs(fx.money))} for this setup response.`, 'warn');
    return;
  }

  ['planning','success','risk','payout','heat','casualty','betrayal','speed'].forEach(k=>{
    if(typeof fx[k]==='number'){
      active.setupEffects[k] = (active.setupEffects[k]||0) + fx[k];
    }
  });
  if(typeof fx.money==='number') G.money = Math.max(0, G.money + fx.money);
  if(typeof fx.wanted==='number') G.crime.heat = Math.max(0, Math.min(100, G.crime.heat + fx.wanted));
  if(typeof fx.closeness==='number') G.crime.police.closeness = Math.max(0, Math.min(100, G.crime.police.closeness + fx.closeness));
  if(typeof fx.notoriety==='number') G.crime.notoriety = clamp((G.crime.notoriety||0) + fx.notoriety);
  if(typeof fx.stress==='number') G.stress = clamp((G.stress||35) + fx.stress);
  if(typeof fx.happy==='number') G.happy = clamp((G.happy||50) + fx.happy);
  if(typeof fx.health==='number') G.health = clamp((G.health||50) + fx.health);

  active.pendingSetupPopup = null;
  addCrimeEv(`Setup event resolved: ${popup.title} -> ${choice.label}.`, fx.risk>0 || fx.wanted>0 ? 'warn' : 'good');
  addEv(`${popup.title}: ${choice.label}.`, fx.risk>0 || fx.wanted>0 ? 'warn' : 'good');
  if(overlay) overlay.style.display = 'none';
  heistRecalcScores();
  updateHUD();
  renderCrime();
}

function drugById(id){
  return DRUG_TYPES.find(d=>d.id===id) || DRUG_TYPES[0];
}

function hallucinogenById(id){
  return HALLUCINOGEN_TYPES.find(h=>h.id===id) || HALLUCINOGEN_TYPES[0];
}

function drugRouteMeta(route){
  if(route==='gang') return { label:'Street Gang Network', profit:1.12, heat:1.3, conflict:0.25 };
  if(route==='mafia') return { label:'Mafia Supply Network', profit:1.24, heat:0.88, conflict:0.08 };
  return { label:'Independent Crew', profit:1.0, heat:1.0, conflict:0.14 };
}

function drugAddictionLevel(score){
  if(score>=82) return 'Severe';
  if(score>=62) return 'Addicted';
  if(score>=38) return 'Dependent';
  if(score>=14) return 'Casual';
  return 'None';
}

function drugSyncAddictionState(announce=true){
  ensureCrimeShape();
  const D = G.crime.drugs;
  const next = drugAddictionLevel(D.addictionScore||0);
  const prev = D.addictionLevel||'None';
  D.addictionLevel = next;
  if(announce && next!==prev){
    const tone = (next==='None'||next==='Casual') ? 'warn' : 'bad';
    addEv(`Addiction status changed: ${prev} -> ${next}.`, tone);
  }
  if(next!=='Severe' && D.junkie.active && (D.addictionScore||0)<70){
    D.junkie.active = false;
    D.junkie.housing = 'none';
    addEv('You climbed out of junkie state. Recovery is still fragile.', 'good');
  }
}

function drugOpenSupplyPopup(){
  ensureCrimeShape();
  const actions = DRUG_TYPES.map(d=>({
    label:`${d.label} (${fmt$(Math.floor(d.profit*0.55))}/unit)`,
    cls:'btn-ghost',
    onClick:()=>drugChooseSupplyQty(d.id),
  }));
  showPopup('Acquire Supply', 'Pick what to buy. Higher margin products also spike heat and instability faster.', actions, 'dark');
}

function drugChooseSupplyQty(drugId){
  const d = drugById(drugId);
  showPopup(`Supply quantity: ${d.label}`, 'Bigger buys improve scale but increase bust/exposure risk.', [
    { label:'Small (8 units)', cls:'btn-ghost', onClick:()=>drugAcquireSupply(drugId, 8) },
    { label:'Medium (18 units)', cls:'btn-ghost', onClick:()=>drugAcquireSupply(drugId, 18) },
    { label:'Large (36 units)', cls:'btn-primary', onClick:()=>drugAcquireSupply(drugId, 36) },
  ], 'dark');
}

function drugAcquireSupply(drugId, qty, silent=false){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  const d = drugById(drugId);
  const units = Math.max(1, qty|0);
  const routeMeta = drugRouteMeta(D.route);
  const wholesaleUnit = Math.max(35, Math.floor(d.profit * (D.route==='mafia' ? 0.43 : D.route==='gang' ? 0.5 : 0.56)));
  const cost = wholesaleUnit * units;
  if(G.money < cost){
    flash(`Need ${fmt$(cost)} for this shipment.`,'warn');
    return false;
  }
  G.money -= cost;
  D.active = true;
  D.tradeDrug = d.id;
  D.inventory[d.id] = (D.inventory[d.id]||0) + units;
  D.supplyQuality = clamp((D.supplyQuality||45) + rnd(1,4));
  D.instability = clamp((D.instability||20) + Math.round(units*d.heatMult*0.22 + routeMeta.conflict*5));
  C.heat = Math.min(100, C.heat + Math.max(1, Math.round(units * d.heatMult * 0.25)));
  C.police.closeness = Math.min(100, C.police.closeness + Math.max(1, Math.round(units * d.heatMult * 0.18)));
  addCrimeEv(`Supply acquired: ${units} units of ${d.label} (${fmt$(cost)}).`, 'warn');
  if(Math.random() < (0.06 + units/460)){
    const spoil = Math.max(1, Math.floor(units * rnd(10,28) / 100));
    D.inventory[d.id] = Math.max(0, D.inventory[d.id] - spoil);
    D.instability = clamp(D.instability + rnd(3,8));
    addEv(`Supplier quality issue: ${spoil} units of ${d.label} were compromised.`, 'bad');
  }
  if(!silent){
    updateHUD();
    renderCrime();
  }
  return true;
}

function drugSetRoute(route){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  if(!['independent','gang','mafia'].includes(route)) return;
  D.route = route;
  if(route==='gang' && !C.gang.joined){
    D.instability = clamp(D.instability + rnd(3,8));
    addEv('You are outsourcing to street crews without direct affiliation. Betrayal risk rises.', 'warn');
  }
  if(route==='mafia' && !C.mafia.joined){
    D.instability = clamp(D.instability + rnd(1,5));
    addEv('You are buying mafia-protected lanes via brokers. Expensive, but discreet.', 'warn');
  }
  addCrimeEv(`Drug route switched to ${drugRouteMeta(route).label}.`, 'warn');
  updateHUD();
  renderCrime();
}

function drugOpenRoutePopup(){
  showPopup('Distribution Route', 'Choose the core structure of your operation. No route is purely safe.', [
    { label:'Independent', cls:'btn-ghost', onClick:()=>drugSetRoute('independent') },
    { label:'Street Gangs', cls:'btn-ghost', onClick:()=>drugSetRoute('gang') },
    { label:'Mafia Network', cls:'btn-primary', onClick:()=>drugSetRoute('mafia') },
  ], 'dark');
}

function drugOpenZoneAssign(zoneId){
  ensureCrimeShape();
  const z = (G.crime.drugs.zones||[]).find(x=>x.id===zoneId);
  if(!z) return;
  showPopup(`Assign ${z.label}`, 'Pick who handles this zone and how aggressive the push is.', [
    { label:'Pause this zone', cls:'btn-ghost', onClick:()=>drugAssignZone(zoneId, 'none', 1) },
    { label:'Independent crew (normal)', cls:'btn-ghost', onClick:()=>drugAssignZone(zoneId, 'independent', 1) },
    { label:'Street gang (hot)', cls:'btn-ghost', onClick:()=>drugAssignZone(zoneId, 'gang', 1) },
    { label:'Mafia (low profile)', cls:'btn-primary', onClick:()=>drugAssignZone(zoneId, 'mafia', 1) },
    { label:'Aggressive push (+income +risk)', cls:'btn-ghost', onClick:()=>drugAssignZone(zoneId, z.assignment==='none'?'independent':z.assignment, 2) },
  ], 'dark');
}

function drugAssignZone(zoneId, assignment, intensity){
  ensureCrimeShape();
  const D = G.crime.drugs;
  const z = (D.zones||[]).find(x=>x.id===zoneId);
  if(!z) return;
  z.assignment = assignment;
  z.intensity = Math.max(1, Math.min(2, intensity|0));
  if(assignment!=='none') D.active = true;
  addCrimeEv(`${z.label} assigned to ${assignment} route (${z.intensity===2?'aggressive':'normal'}).`, 'warn');
  renderCrime();
}

function drugRunDistributionCycle(auto=false){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  const d = drugById(D.tradeDrug||'marijuana');
  const inv = D.inventory[d.id]||0;
  const activeZones = (D.zones||[]).filter(z=>z.assignment!=='none');
  if(inv<=0){
    if(!auto) flash(`No ${d.label} inventory. Acquire supply first.`, 'warn');
    return false;
  }
  if(!activeZones.length){
    if(!auto) flash('Assign at least one zone before distribution.', 'warn');
    return false;
  }

  let remaining = inv;
  let net = 0;
  let heatGain = 0;
  let violencePulse = 0;
  let soldTotal = 0;

  activeZones.forEach(z=>{
    if(remaining<=0) return;
    const route = z.assignment || D.route || 'independent';
    const routeMeta = drugRouteMeta(route);
    const qualityMult = 0.65 + (D.supplyQuality||45)/160;
    const demand = Math.max(4, Math.floor(z.demand * qualityMult * z.intensity));
    const sold = Math.min(remaining, demand + rnd(0, Math.floor(demand*0.4)));
    if(sold<=0) return;
    remaining -= sold;
    soldTotal += sold;
    const gross = Math.floor(sold * d.profit * routeMeta.profit);
    const brokerCut =
      route==='mafia' && !C.mafia.joined ? Math.floor(gross*0.14) :
      route==='gang' && !C.gang.joined ? Math.floor(gross*0.1) : 0;
    net += Math.max(0, gross - brokerCut);
    heatGain += sold * d.heatMult * z.risk * 0.11 * routeMeta.heat;
    violencePulse += d.violence * z.risk * routeMeta.conflict * (z.intensity===2?1.25:1);
  });

  D.inventory[d.id] = Math.max(0, remaining);
  D.lastIncome = Math.floor(net);
  D.income = (D.income||0) + Math.floor(net);
  G.money += Math.floor(net);
  C.notoriety = clamp(C.notoriety + Math.max(1, Math.floor(soldTotal/18)));
  C.heat = Math.min(100, C.heat + Math.max(1, Math.floor(heatGain)));
  C.police.closeness = Math.min(100, C.police.closeness + Math.max(1, Math.floor(heatGain*0.7)));
  D.instability = clamp((D.instability||20) + Math.max(0, Math.floor(violencePulse*20)));
  D.recentViolence = clamp((D.recentViolence||0) + Math.max(0, Math.floor(violencePulse*18)));

  if(soldTotal>0){
    addCrimeEv(`Distribution cycle: sold ${soldTotal} ${d.label} units for ${fmt$(Math.floor(net))}.`, 'bad');
    if(Math.random() < Math.min(0.5, violencePulse*0.45)){
      G.health = clamp(G.health - rnd(2,8));
      addEv('A distribution dispute turned violent. You survived, but it got ugly.', 'bad');
    }
    if(C.mafia.joined && (C.mafia.rackets||[]).some(r=>r.id==='drugs')){
      const mafiaTake = Math.floor(net*0.08);
      C.mafia.earnings += mafiaTake;
      C.mafia.respect = clamp(C.mafia.respect + 1);
    }
    if(C.gang.joined && D.route==='gang'){
      C.gang.cred = clamp(C.gang.cred + rnd(1,3));
      C.gang.notoriety = clamp(C.gang.notoriety + rnd(1,4));
    }
  }

  if(!auto) drugResolveTradeEvent();
  if(C.heat>62) policeCheck();
  if(!auto){
    updateHUD();
    renderCrime();
  }
  return true;
}

function drugResolveTradeEvent(){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  if(!D.active) return;
  if(Math.random() > 0.24) return;
  const d = drugById(D.tradeDrug||'marijuana');
  const ev = pick(['bad_batch','supplier_missing','crew_using','raid','rival_hit']);
  if(ev==='bad_batch'){
    const spoiled = Math.max(1, Math.floor((D.inventory[d.id]||0) * rnd(8,24)/100));
    D.inventory[d.id] = Math.max(0, (D.inventory[d.id]||0) - spoiled);
    D.instability = clamp(D.instability + rnd(4,10));
    addEv(`Bad batch alert: ${spoiled} ${d.label} units were unsellable and triggered chaos.`, 'bad');
  } else if(ev==='supplier_missing'){
    D.supplyQuality = clamp(D.supplyQuality - rnd(6,14));
    D.instability = clamp(D.instability + rnd(3,8));
    addEv('A supplier vanished overnight. Routes are unstable and prices are climbing.', 'warn');
  } else if(ev==='crew_using'){
    D.addictionScore = clamp(D.addictionScore + rnd(3,8));
    D.instability = clamp(D.instability + rnd(2,7));
    addEv('Crew members dipped into product. Discipline slipped and margins took a hit.', 'warn');
  } else if(ev==='raid'){
    const seizure = rnd(1200,10000);
    C.heat = Math.min(100, C.heat + rnd(8,18));
    C.police.closeness = Math.min(100, C.police.closeness + rnd(8,16));
    G.money = Math.max(0, G.money - seizure);
    addEv(`Police raid pressure cost you ${fmt$(seizure)} in seized cash and product.`, 'bad');
    if(Math.random()<0.2) policeCheck();
  } else {
    C.heat = Math.min(100, C.heat + rnd(6,14));
    D.recentViolence = clamp(D.recentViolence + rnd(6,16));
    addEv('A rival crew hit one of your routes. The city got hotter overnight.', 'bad');
  }
}

function drugUseTradeProduct(drugId){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  const d = drugById(drugId||D.tradeDrug||'marijuana');
  const inv = D.inventory[d.id]||0;
  if(inv>0){
    D.inventory[d.id] = Math.max(0, inv-1);
  } else {
    const cost = Math.max(50, Math.floor(d.profit*0.5));
    if(G.money<cost){ flash(`Need ${fmt$(cost)} to source ${d.label}.`, 'warn'); return; }
    G.money -= cost;
  }
  D.useCount[d.id] = (D.useCount[d.id]||0) + 1;
  G.happy = clamp(G.happy + rnd(2,9));
  G.stress = clamp((G.stress||35) - rnd(1,8));
  G.health = clamp(G.health - rnd(2,8) - Math.floor(d.socialImpact*6));
  G.smarts = clamp(G.smarts - rnd(0,3) - Math.floor(d.socialImpact*4));
  D.addictionScore = clamp((D.addictionScore||0) + Math.round(d.addictionRate*100) + rnd(1,5));
  D.relapseRisk = clamp((D.relapseRisk||8) + Math.round(d.addictionRate*20));
  if(d.id==='fentanyl' && Math.random()<Math.max(0.005, d.fatality*0.22)){
    die('An overdose ended your story. This was avoidable.');
    return;
  }
  addEv(`You used ${d.label}. Immediate relief came with a delayed bill.`, 'warn');
  if((G.sm.totalFame||0)>=40 && Math.random()<Math.min(0.45, d.socialImpact*0.5)){
    G.sm.controversies = (G.sm.controversies||0) + 1;
    G.sm.totalFame = clamp((G.sm.totalFame||0) - rnd(2,8));
    addEv(`Drug controversy hit the news cycle. Fame took a dent.`, 'bad');
  }
  drugSyncAddictionState();
  updateHUD();
  renderCrime();
}

function drugTakeHallucinogen(id){
  ensureCrimeShape();
  const D = G.crime.drugs;
  const h = hallucinogenById(id);
  const cost = rnd(h.price[0], h.price[1]);
  if(G.money < cost){ flash(`Need ${fmt$(cost)} for ${h.label}.`, 'warn'); return; }
  G.money -= cost;
  D.useCount[h.id] = (D.useCount[h.id]||0) + 1;
  const trip = pick(HALLUCINOGEN_TRIP_EVENTS);
  const dSmarts = rnd(h.mindSwing[0], h.mindSwing[1]);
  const dStress = rnd(h.stressSwing[0], h.stressSwing[1]);
  const dHealth = rnd(h.healthSwing[0], h.healthSwing[1]);
  const dHappy = rnd(-6, 12);
  G.smarts = clamp(G.smarts + dSmarts);
  G.stress = clamp((G.stress||35) + dStress);
  G.health = clamp(G.health + dHealth);
  G.happy = clamp(G.happy + dHappy);
  D.trip = {
    active:true,
    label:h.label,
    expiresAge:G.age+1,
    rebound:{
      happy: Math.round(-dHappy*0.5),
      smarts: Math.round(-dSmarts*0.45),
      stress: Math.round(-dStress*0.55),
    }
  };
  addEv(`${h.icon} ${trip.msg}`, trip.tone||'warn');
  addEv(`Trip effects: Happy ${dHappy>=0?'+':''}${dHappy}, Smarts ${dSmarts>=0?'+':''}${dSmarts}, Stress ${dStress>=0?'+':''}${dStress}.`, 'warn');
  updateHUD();
  renderCrime();
}

function drugOpenHallucinogenPopup(){
  showPopup('Hallucinogens', 'Trips never boost your distribution income. They only affect your headspace and stats temporarily.', HALLUCINOGEN_TYPES.map(h=>({
    label:`${h.icon} ${h.label}`,
    cls:'btn-ghost',
    onClick:()=>drugTakeHallucinogen(h.id),
  })), 'dark');
}

function drugStartRecovery(){
  ensureCrimeShape();
  const D = G.crime.drugs;
  D.inRecovery = true;
  D.relapseRisk = clamp(Math.max(8, D.relapseRisk - rnd(1,5)));
  addEv('You committed to recovery. It helps, but relapse risk remains real.', 'good');
  renderCrime();
}

function drugAttendRecovery(){
  ensureCrimeShape();
  const D = G.crime.drugs;
  const cost = 850;
  if(G.money<cost){ flash(`Need ${fmt$(cost)} for treatment support.`, 'warn'); return; }
  G.money -= cost;
  D.inRecovery = true;
  D.addictionScore = clamp(Math.max(0, D.addictionScore - rnd(10,18)));
  D.relapseRisk = clamp(Math.max(6, D.relapseRisk - rnd(4,10)));
  G.stress = clamp((G.stress||35) - rnd(5,12));
  G.happy = clamp(G.happy + rnd(2,8));
  drugSyncAddictionState();
  addEv('You attended treatment support. Progress is real, even when it feels slow.', 'good');
  updateHUD();
  renderCrime();
}

function drugJunkieAction(type){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  if(!D.junkie.active) return;
  if(type==='scavenge'){
    const gain = rnd(20,140);
    G.money += gain;
    G.health = clamp(G.health - rnd(1,4));
    addEv(`You scavenged enough for ${fmt$(gain)}. It barely keeps the lights on.`, 'warn');
  } else if(type==='steal'){
    const gain = rnd(80,360);
    G.money += gain;
    C.heat = Math.min(100, C.heat + rnd(6,14));
    C.police.closeness = Math.min(100, C.police.closeness + rnd(5,12));
    G.health = clamp(G.health - rnd(3,8));
    addEv(`You stole to survive. It worked this time, but the net closes tighter.`, 'bad');
    policeCheck();
  } else if(type==='crash'){
    D.junkie.housing = pick(['abandoned house','trap house couch','shelter bunk']);
    D.junkie.isolation = clamp(D.junkie.isolation + rnd(2,8));
    G.happy = clamp(G.happy - rnd(2,6));
    addEv(`You crashed in a ${D.junkie.housing}. Stability keeps shrinking.`, 'warn');
  }
  updateHUD();
  renderCrime();
}

function processDrugEcosystemYear(){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  if((D.recentViolence||0)>0) D.recentViolence = Math.max(0, D.recentViolence - rnd(8,20));

  if(D.trip.active && D.trip.expiresAge<=G.age){
    const rb = D.trip.rebound||{ happy:0, smarts:0, stress:0 };
    G.happy = clamp(G.happy + (rb.happy||0));
    G.smarts = clamp(G.smarts + (rb.smarts||0));
    G.stress = clamp((G.stress||35) + (rb.stress||0));
    addEv(`The ${D.trip.label} after-effects faded. Your baseline mind-state returned.`, 'warn');
    D.trip = { active:false, label:'', expiresAge:0, rebound:{ happy:0, smarts:0, stress:0 } };
  }

  if(D.active && (D.zones||[]).some(z=>z.assignment!=='none') && (D.inventory[D.tradeDrug]||0)>0){
    drugRunDistributionCycle(true);
    addEv(`Drug network yielded ${fmt$(D.lastIncome||0)} this year from ${drugById(D.tradeDrug).label}.`, 'warn');
  }

  const lvl = drugAddictionLevel(D.addictionScore||0);
  if(lvl==='Casual'){
    G.health = clamp(G.health - rnd(1,2));
    G.money -= rnd(120,360);
  } else if(lvl==='Dependent'){
    G.health = clamp(G.health - rnd(2,5));
    G.happy = clamp(G.happy - rnd(2,6));
    G.smarts = clamp(G.smarts - rnd(1,3));
    G.money -= rnd(300,950);
  } else if(lvl==='Addicted'){
    G.health = clamp(G.health - rnd(4,9));
    G.happy = clamp(G.happy - rnd(4,9));
    G.smarts = clamp(G.smarts - rnd(2,5));
    G.money -= rnd(700,2200);
    if(Math.random()<0.2){
      D.addictionScore = clamp(D.addictionScore + rnd(3,8));
      addEv('Addiction drove a bad decision this year. Recovery got harder.', 'bad');
    }
  } else if(lvl==='Severe'){
    G.health = clamp(G.health - rnd(8,16));
    G.happy = clamp(G.happy - rnd(8,16));
    G.smarts = clamp(G.smarts - rnd(3,8));
    G.money -= rnd(1400,4200);
    if(!D.junkie.active && Math.random()<0.35){
      D.junkie.active = true;
      D.junkie.years = 0;
      D.junkie.housing = pick(['abandoned house','junkie house','shelter bunk']);
      addEv('Severe addiction pushed you into a junkie survival state.', 'bad');
    }
  }

  if(D.junkie.active){
    D.junkie.years += 1;
    D.junkie.isolation = clamp((D.junkie.isolation||0) + rnd(3,10));
    G.health = clamp(G.health - rnd(3,9));
    G.happy = clamp(G.happy - rnd(5,12));
    G.stress = clamp((G.stress||35) + rnd(4,12));
    if(Math.random()<0.3){
      G.crime.heat = Math.min(100, G.crime.heat + rnd(4,12));
      addEv('Desperation drew police attention around your junkie circle.', 'bad');
    }
  }

  if(D.inRecovery){
    D.addictionScore = clamp(Math.max(0, D.addictionScore - rnd(5,12)));
    const relapseChance = Math.max(0.04, Math.min(0.65,
      (D.relapseRisk||8)/100 + (G.stress||35)/320 + ((D.addictionLevel==='Severe')?0.12:0)
    ));
    if(Math.random()<relapseChance){
      D.addictionScore = clamp(D.addictionScore + rnd(8,18));
      addEv('Relapse episode. Recovery resets, but it is not over.', 'bad');
    } else {
      G.happy = clamp(G.happy + rnd(1,4));
      G.health = clamp(G.health + rnd(1,3));
    }
  }

  // Rare family addiction fallout (1% per family member per year)
  (G.family||[]).forEach(p=>{
    if(!p || p.alive===false) return;
    if(!p.drugIssue && Math.random()<0.01){
      p.drugIssue = { level:'casual', years:0 };
      addEv(`Rare family crisis: ${p.firstName} developed a substance issue.`, 'bad');
    }
    if(!p.drugIssue) return;
    p.drugIssue.years = (p.drugIssue.years||0) + 1;
    if(Math.random()<0.26){
      const ask = rnd(120,1200);
      if(G.money>=ask && Math.random()<0.65){
        G.money -= ask;
        p.relation = clamp((p.relation||50) + rnd(1,3));
        addEv(`${p.firstName} asked for help with addiction-related costs. You gave ${fmt$(ask)}.`, 'warn');
      } else if(Math.random()<0.35){
        const loss = rnd(80,900);
        G.money = Math.max(0, G.money-loss);
        p.relation = clamp((p.relation||50) - rnd(4,10));
        addEv(`${p.firstName} stole ${fmt$(loss)} during a relapse spiral.`, 'bad');
      }
    }
    if(Math.random()<0.12){
      p.drugIssue.level = p.drugIssue.level==='casual' ? 'dependent' : 'severe';
      p.relation = clamp((p.relation||50) - rnd(3,9));
    } else if(Math.random()<0.08){
      p.drugIssue = null;
      addEv(`${p.firstName} entered recovery and stabilized this year.`, 'good');
    }
  });

  // Fame interconnection
  if((G.sm.totalFame||0)>=55 && lvl!=='None' && Math.random()<0.22){
    G.sm.controversies = (G.sm.controversies||0) + 1;
    G.sm.totalFame = clamp((G.sm.totalFame||0) - rnd(3,11));
    addEv('Fame controversy: substance narrative dominated headlines this year.', 'bad');
  }

  // Drug-trade pressure and crackdown
  const totalInv = Object.values(D.inventory||{}).reduce((s,v)=>s+(v||0),0);
  if(D.active){
    const pressure = (D.instability||20)/10 + totalInv/18 + ((D.route==='gang')?3:0) + ((D.route==='mafia')?1:0);
    C.heat = Math.min(100, C.heat + Math.floor(pressure/6));
    C.police.closeness = Math.min(100, C.police.closeness + Math.floor(pressure/8));
    if(pressure>16 && Math.random()<0.22){
      const seized = Math.min(totalInv, rnd(8,28));
      D.inventory[D.tradeDrug] = Math.max(0, (D.inventory[D.tradeDrug]||0) - seized);
      C.heat = Math.min(100, C.heat + rnd(6,16));
      addEv(`Police crackdown seized ${seized} units from your pipeline.`, 'bad');
      if(Math.random()<0.24) policeCheck();
    }
  }

  drugSyncAddictionState(false);
}

function renderDrugEcosystemCard(){
  ensureCrimeShape();
  const C = G.crime;
  const D = C.drugs;
  const primary = drugById(D.tradeDrug||'marijuana');
  const inv = D.inventory[primary.id]||0;
  const zoneRows = (D.zones||[]).map(z=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:.82rem">${z.label}</div>
        <div style="font-size:.68rem;color:var(--muted2)">Demand ${z.demand} · Risk ${z.risk.toFixed(1)} · ${z.assignment==='none'?'Paused':`${z.assignment} / ${z.intensity===2?'Aggressive':'Normal'}`}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="drugOpenZoneAssign('${z.id}')">Assign</button>
    </div>`).join('');
  const routeMeta = drugRouteMeta(D.route||'independent');
  const addictionTone = D.addictionLevel==='Severe' ? 'var(--danger)' : D.addictionLevel==='Addicted' ? 'var(--gold)' : 'var(--muted2)';
  return `<div class="card">
    <div class="card-title">Drug Ecosystem</div>
    <div style="font-size:.78rem;color:var(--muted2)">
      Route: ${routeMeta.label} · Product: <strong>${primary.label}</strong> · Inventory: ${inv} units · Last cycle: ${fmt$(D.lastIncome||0)}
    </div>
    <div style="font-size:.72rem;color:var(--muted2);margin-top:4px">
      Supply quality ${D.supplyQuality} · Instability ${D.instability} · Heat ${C.heat} · Recent violence ${D.recentViolence}
    </div>
    <div style="font-size:.72rem;color:${addictionTone};margin-top:4px">
      Personal addiction status: <strong>${D.addictionLevel}</strong> (score ${D.addictionScore}) ${D.inRecovery?'· In recovery':''} ${D.junkie.active?'· Junkie state active':''}
    </div>
    <div class="choice-grid" style="margin-top:8px">
      <div class="choice" onclick="drugOpenSupplyPopup()"><div class="choice-icon">📦</div><div class="choice-name">Acquire Supply</div><div class="choice-desc">Supply phase</div></div>
      <div class="choice" onclick="drugRunDistributionCycle()"><div class="choice-icon">🚚</div><div class="choice-name">Run Distribution</div><div class="choice-desc">Income + risk</div></div>
      <div class="choice" onclick="drugOpenRoutePopup()"><div class="choice-icon">🧭</div><div class="choice-name">Set Route</div><div class="choice-desc">Independent / gang / mafia</div></div>
      <div class="choice" onclick="drugUseTradeProduct('${primary.id}')"><div class="choice-icon">💉</div><div class="choice-name">Use ${primary.label}</div><div class="choice-desc">Consumption + addiction risk</div></div>
      <div class="choice" onclick="drugOpenHallucinogenPopup()"><div class="choice-icon">🌀</div><div class="choice-name">Hallucinogens</div><div class="choice-desc">Trip events (no income)</div></div>
      <div class="choice" onclick="${D.inRecovery?'drugAttendRecovery()':'drugStartRecovery()'}"><div class="choice-icon">🫶</div><div class="choice-name">${D.inRecovery?'Attend Recovery':'Start Recovery'}</div><div class="choice-desc">Exit path + relapse risk</div></div>
    </div>
    ${D.junkie.active?`
      <div style="font-size:.72rem;color:var(--danger);margin-top:10px">
        Junkie state: housing = ${D.junkie.housing||'unstable'} · isolation ${D.junkie.isolation||0}
      </div>
      <div class="choice-grid">
        <div class="choice" onclick="drugJunkieAction('scavenge')"><div class="choice-icon">🛒</div><div class="choice-name">Scavenge</div><div class="choice-desc">Tiny cash, health cost</div></div>
        <div class="choice" onclick="drugJunkieAction('steal')"><div class="choice-icon">🧤</div><div class="choice-name">Steal for Money</div><div class="choice-desc">Heat spike risk</div></div>
        <div class="choice" onclick="drugJunkieAction('crash')"><div class="choice-icon">🛏️</div><div class="choice-name">Crash House</div><div class="choice-desc">Low-quality shelter</div></div>
      </div>
    `:''}
    <div style="max-height:140px;overflow:auto;border:1px solid var(--border);border-radius:10px;padding:6px;margin-top:8px">
      ${zoneRows}
    </div>
  </div>`;
}

function renderCrime(){
  ensureCrimeShape();
  const cc = document.getElementById('crime-content');
  const a = G.age;
  const C = G.crime;
  const P = C.police;
  if(a<12){
    cc.innerHTML = `<div class="notif warn">Crime unlocks at age 12. Stay out of trouble.</div>`; return;
  }

  if(P.inPrison){
    const inmates = (C.inmates||[]).slice(0,5);
    const pr = C.prison;
    cc.innerHTML = `
      <div class="card">
        <div class="card-title">Prison</div>
        <div style="font-size:.78rem;color:var(--muted2)">Sentence remaining: ${P.sentence} year(s) · Security: ${pr.security}</div>
        <div style="margin-top:8px;font-size:.78rem;color:var(--muted2)">Respect ${pr.respect} · Fear ${pr.fear} · Protection ${pr.protection} · Sanity ${pr.sanity}</div>
        <div style="margin-top:6px;font-size:.78rem;color:var(--muted2)">Faction: ${pr.faction||'Independent'} · Guards: strict ${pr.guards.strict} / corrupt ${pr.guards.corrupt}</div>
        <button class="btn btn-purple btn-block btn-lg" style="margin-top:10px" onclick="ageUp()">⏩ Age Up (Prison Year)</button>
      </div>
      <div class="card">
        <div class="card-title">Inmates</div>
        ${inmates.map(i=>`<div style="font-size:.82rem;margin-bottom:4px">🧑 ${i.name} · Craziness ${i.crazy}${i.beef?' · Beef':''}</div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">Daily Loop</div>
        <div class="choice-grid">
          <div class="choice" onclick="prisonAct('work')"><div class="choice-icon">🧰</div><div class="choice-name">Work Detail</div><div class="choice-desc">Money + respect</div></div>
          <div class="choice" onclick="prisonAct('exercise')"><div class="choice-icon">🏋️</div><div class="choice-name">Exercise</div><div class="choice-desc">Health + fear</div></div>
          <div class="choice" onclick="prisonAct('social')"><div class="choice-icon">🗣️</div><div class="choice-name">Socialize</div><div class="choice-desc">Protection + risk</div></div>
          <div class="choice" onclick="prisonAct('quiet')"><div class="choice-icon">🫥</div><div class="choice-name">Keep to Yourself</div><div class="choice-desc">Lower risk</div></div>
          <div class="choice" onclick="prisonAct('good')"><div class="choice-icon">📜</div><div class="choice-name">Good Behavior</div><div class="choice-desc">Sentence relief</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Prison Factions</div>
        <div class="choice-grid">
          <div class="choice" onclick="prisonFaction('Independent')"><div class="choice-icon">🧍</div><div class="choice-name">Stay Independent</div><div class="choice-desc">Hard mode</div></div>
          <div class="choice" onclick="prisonFaction('Gang‑Affiliated')"><div class="choice-icon">🟥</div><div class="choice-name">Gang‑Affiliated</div><div class="choice-desc">Protection</div></div>
          <div class="choice" onclick="prisonFaction('Crew')"><div class="choice-icon">🧑‍🤝‍🧑</div><div class="choice-name">Join Crew</div><div class="choice-desc">Connections</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Prison Actions</div>
        <div class="choice-grid">
          <div class="choice" onclick="prisonAct('survive')"><div class="choice-icon">🧱</div><div class="choice-name">Keep Your Head Down</div><div class="choice-desc">Safer</div></div>
          <div class="choice" onclick="prisonAct('smuggle')"><div class="choice-icon">📦</div><div class="choice-name">Smuggle</div><div class="choice-desc">Money + risk</div></div>
          <div class="choice" onclick="prisonAct('riot')"><div class="choice-icon">🔥</div><div class="choice-name">Riot</div><div class="choice-desc">Chaos</div></div>
          <div class="choice" onclick="prisonAct('escape')"><div class="choice-icon">🚪</div><div class="choice-name">Escape</div><div class="choice-desc">Very risky</div></div>
          ${G.spouse||G.lovers.length?`<div class="choice" onclick="prisonAct('conjugal')"><div class="choice-icon">💗</div><div class="choice-name">Conjugal Visit</div><div class="choice-desc">+Happy</div></div>`:''}
          <div class="choice" onclick="prisonAct('beef')"><div class="choice-icon">😤</div><div class="choice-name">Start Beef</div><div class="choice-desc">Danger</div></div>
        </div>
      </div>
    `;
    return;
  }

  const heat = C.heat;
  const phase = heatPhase(heat);
  const items = pick2(SHOPLIFT_ITEMS, 5);
  const known = knownPeople().slice(0,5);

  let html = `
    <div class="card">
      <div class="card-title">Crime Log</div>
      ${C.log.slice().reverse().slice(0,8).map(e=>`<div style="font-size:.82rem;color:var(--muted2);padding:4px 0">Age ${e.age}: ${e.text}</div>`).join('') || '<div class="notif warn">No crime events yet.</div>'}
    </div>
    <div class="card">
      <div class="card-title">Heat</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:.7rem;color:var(--muted2)">Phase: ${phase}</span>
        <span style="font-size:.7rem;color:${heat>=70?'var(--danger)':heat>=40?'var(--gold)':'var(--muted2)'}">${heat}/100</span>
      </div>
      <div class="stat-track"><div class="stat-fill bar-l" style="width:${heat}%;background:${heat>=70?'var(--danger)':heat>=40?'var(--gold)':'var(--accent)'}"></div></div>
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="crimeLayLow()">🫥 Lay Low</button>
        <button class="btn btn-ghost btn-sm" onclick="crimeDitchEvidence()">🧹 Ditch Evidence</button>
      </div>
    </div>
  `;

  html += `<div class="card">
    <div class="card-title">Police Pressure</div>
    <div style="font-size:.78rem;color:var(--muted2)">Closeness: ${P.closeness}/100</div>
    <div class="stat-track"><div class="stat-fill bar-p" style="width:${P.closeness}%"></div></div>
  </div>`;

  // Age 12+ petty crime
  html += `<div class="card">
    <div class="card-title">Petty Crime</div>
    <div style="max-height:180px;overflow:auto;border:1px solid var(--border);border-radius:10px;padding:6px">
      ${items.map(i=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 4px;border-bottom:1px solid var(--border)">
          <div>
            <div style="font-size:.85rem">${i.name}</div>
            <div style="font-size:.7rem;color:var(--muted2)">Value $${i.value} · Risk ${i.risk}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="shoplift('${i.name}')">Shoplift</button>
        </div>`).join('')}
    </div>
    <div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="stealParcels()"><div class="choice-icon">📦</div><div class="choice-name">Steal Parcels</div><div class="choice-desc">Low payout</div></div>
      <div class="choice" onclick="robPeople()"><div class="choice-icon">🧑</div><div class="choice-name">Rob People</div><div class="choice-desc">Risky</div></div>
    </div>
  </div>`;

  // Age 14+
  if(a>=14){
    html += `<div class="card">
      <div class="card-title">Street Crime (14+)</div>
      <div class="choice-grid">
        <div class="choice" onclick="carjack()"><div class="choice-icon">🚗</div><div class="choice-name">Carjack</div><div class="choice-desc">High risk</div></div>
        <div class="choice" onclick="holdUpStore()"><div class="choice-icon">🏪</div><div class="choice-name">Hold Up Store</div><div class="choice-desc">Bigger payout</div></div>
        <div class="choice" onclick="sellDrugs()"><div class="choice-icon">💊</div><div class="choice-name">Sell Drugs</div><div class="choice-desc">Launches full ecosystem</div></div>
      </div>
    </div>`;
  }

  // Age 15+ violence
  if(a>=15){
    html += `<div class="card">
      <div class="card-title">Violence (15+)</div>
      <div class="choice-grid">
        ${known.map(p=>`<div class="choice" onclick="attemptKill('${p.name}')"><div class="choice-icon">🩸</div><div class="choice-name">Kill ${p.firstName}</div><div class="choice-desc">Known person</div></div>`).join('')}
        <div class="choice" onclick="attemptKill('random')"><div class="choice-icon">🕳️</div><div class="choice-name">Kill Random</div><div class="choice-desc">Very risky</div></div>
      </div>
    </div>`;
  }

  // Scams / hacking / embezzlement
  html += `<div class="card">
    <div class="card-title">Scams & Schemes</div>
    <div class="choice-grid">
      <div class="choice" onclick="runScam()"><div class="choice-icon">📨</div><div class="choice-name">Run Scam</div><div class="choice-desc">Skill: ${C.skills.scam}</div></div>
      ${G.career?.employed?`<div class="choice" onclick="embezzle()"><div class="choice-icon">💼</div><div class="choice-name">Embezzle Funds</div><div class="choice-desc">From work</div></div>`:''}
      ${a>=18?`<div class="choice" onclick="hackPeople()"><div class="choice-icon">💻</div><div class="choice-name">Hack People</div><div class="choice-desc">Skill: ${C.skills.hack}</div></div>`:''}
    </div>
  </div>`;

  html += renderDrugEcosystemCard();

  // Age 18+ big crime
  if(a>=18){
    html += `<div class="card">
      <div class="card-title">Big Crime (18+)</div>
      <div class="choice-grid">
        <div class="choice" onclick="kidnap('low')"><div class="choice-icon">🧢</div><div class="choice-name">Kidnap (Low)</div><div class="choice-desc">Risky</div></div>
        <div class="choice" onclick="kidnap('high')"><div class="choice-icon">👑</div><div class="choice-name">Kidnap (High)</div><div class="choice-desc">Very risky</div></div>
      </div>
    </div>`;
    html += renderHeistOperationsCard();
  }

  // Street Gangs (revamp)
  const beefLevelLabel =
    (C.gang.beef?.level||0)>=3 ? 'War' :
    (C.gang.beef?.level||0)>=2 ? 'Active Beef' :
    (C.gang.beef?.level||0)>=1 ? 'Tension' : 'Calm';
  html += `<div class="card">
    <div class="card-title">Street Gangs</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">
      ${C.gang.joined
        ? `${C.gang.symbol} ${C.gang.name} · Style: ${C.gang.style} · Cred ${C.gang.cred} · Notoriety ${C.gang.notoriety} · Beef: ${beefLevelLabel}${C.gang.beef?.rival?` vs ${gangRivalLabel(C.gang.beef.rival)}`:''}`
        : 'Not affiliated'}
    </div>
    ${C.gang.joined ? `<div style="font-size:.72rem;color:var(--muted2);margin-bottom:8px">Territory ${C.gang.territory} · Cohesion ${C.gang.relationships?.cohesion||0} · Internal conflict ${C.gang.relationships?.internalConflict||0} · Members ${(C.gang.members||[]).filter(m=>m.status==='active').length}</div>` : ''}
    ${!C.gang.joined?`
      <div class="choice-grid">
        ${GANG_ARCHETYPES.map(g=>`<div class="choice" onclick="gangJoin('${g.id}')"><div class="choice-icon">${g.symbol}</div><div class="choice-name">${g.label}</div><div class="choice-desc">${g.style}</div></div>`).join('')}
      </div>
      <div style="font-size:.76rem;color:var(--muted2);margin-top:8px">Joining methods will appear after selection.</div>
    `:`
      <div class="choice-grid">
        <div class="choice" onclick="gangTag()"><div class="choice-icon">🧱</div><div class="choice-name">Tag Territory</div><div class="choice-desc">Low risk</div></div>
        <div class="choice" onclick="gangDefend()"><div class="choice-icon">🛡️</div><div class="choice-name">Defend Block</div><div class="choice-desc">Conflict</div></div>
        <div class="choice" onclick="gangPush()"><div class="choice-icon">⚔️</div><div class="choice-name">Push Rival Zone</div><div class="choice-desc">High risk</div></div>
        <div class="choice" onclick="gangBeef()"><div class="choice-icon">😤</div><div class="choice-name">Handle Beef</div><div class="choice-desc">Choice-driven response</div></div>
        <div class="choice" onclick="gangPost()"><div class="choice-icon">📱</div><div class="choice-name">Post Online</div><div class="choice-desc">Clout + heat</div></div>
        <div class="choice" onclick="gangDrugs()"><div class="choice-icon">💊</div><div class="choice-name">Drug Ops</div><div class="choice-desc">Income + heat</div></div>
        <div class="choice" onclick="gangSnitch()"><div class="choice-icon">🐀</div><div class="choice-name">Snitch</div><div class="choice-desc">Death risk</div></div>
      </div>
    `}
  </div>`;

  // Mafia / Organized Crime
  const M = C.mafia;
  html += `<div class="card">
    <div class="card-title">🕴️ Mafia & Organized Crime</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">
      Status: ${M.joined?MAFIA_RANKS[M.rank]:'Not affiliated'} · Fear ${M.fear} · Respect ${M.respect}
    </div>
    ${!M.joined?`
      <div class="choice-grid">
        <div class="choice" onclick="mafiaJoin('noticed')"><div class="choice-icon">👀</div><div class="choice-name">Noticed by Crew</div><div class="choice-desc">Petty crime route</div></div>
        <div class="choice" onclick="mafiaJoin('family')"><div class="choice-icon">👪</div><div class="choice-name">Family Connection</div><div class="choice-desc">If your traits fit</div></div>
        <div class="choice" onclick="mafiaJoin('apply')"><div class="choice-icon">📋</div><div class="choice-name">Direct Application</div><div class="choice-desc">Rare success</div></div>
        ${C.police.inPrison?`<div class="choice" onclick="mafiaJoin('prison')"><div class="choice-icon">🔒</div><div class="choice-name">Prison Recruitment</div><div class="choice-desc">Inside contacts</div></div>`:''}
      </div>
    `:`
      <div class="choice-grid">
        <div class="choice" onclick="mafiaCollect()"><div class="choice-icon">💵</div><div class="choice-name">Collect Money</div><div class="choice-desc">Racket income</div></div>
        <div class="choice" onclick="mafiaExpand()"><div class="choice-icon">🗺️</div><div class="choice-name">Expand Territory</div><div class="choice-desc">More income</div></div>
        <div class="choice" onclick="mafiaCrackdown()"><div class="choice-icon">⚔️</div><div class="choice-name">Crack Down</div><div class="choice-desc">Non‑payers</div></div>
        <div class="choice" onclick="mafiaRecruit()"><div class="choice-icon">🧑‍🤝‍🧑</div><div class="choice-name">Recruit Member</div><div class="choice-desc">Crew management</div></div>
        <div class="choice" onclick="mafiaOrders()"><div class="choice-icon">📦</div><div class="choice-name">Handle Order</div><div class="choice-desc">Mission</div></div>
        <div class="choice" onclick="mafiaSnitch()"><div class="choice-icon">🐀</div><div class="choice-name">Snitch</div><div class="choice-desc">High risk</div></div>
        <div class="choice" onclick="mafiaStartRacket()"><div class="choice-icon">🏦</div><div class="choice-name">Start Racket</div><div class="choice-desc">Income stream</div></div>
        <div class="choice" onclick="mafiaFrontBusiness()"><div class="choice-icon">🏪</div><div class="choice-name">Front Business</div><div class="choice-desc">Launder money</div></div>
        <div class="choice" onclick="mafiaCorrupt()"><div class="choice-icon">🧑‍⚖️</div><div class="choice-name">Corrupt Official</div><div class="choice-desc">Reduce heat</div></div>
      </div>
      <div style="margin-top:8px;font-size:.78rem;color:var(--muted2)">
        Rackets: ${M.rackets.map(r=>r.label).join(', ')||'None'} · Territory: ${M.territory}
      </div>
    `}
  </div>`;


  cc.innerHTML = html;
}

function crimeLayLow(){
  G.crime.heat = Math.max(0, G.crime.heat - rnd(6,14));
  G.happy = clamp(G.happy - rnd(2,5));
  addEv('You laid low. Less heat, less excitement.', 'warn');
  addCrimeEv('Laid low to reduce heat.', 'warn');
  updateHUD(); renderCrime();
}

function crimeDitchEvidence(){
  if(G.money<200){ flash('Need $200','warn'); return; }
  G.money -= 200;
  G.crime.heat = Math.max(0, G.crime.heat - rnd(8,16));
  addEv('You ditched evidence. The trail cooled off.', 'good');
  addCrimeEv('Ditched evidence.', 'good');
  updateHUD(); renderCrime();
}

function shoplift(itemName){
  const item = SHOPLIFT_ITEMS.find(i=>i.name===itemName);
  if(!item) return;
  const chance = 0.75 - (item.risk/100) - (G.crime.heat/200) + (G.smarts/200);
  if(Math.random()<chance){
    G.money += item.value;
    G.crime.notoriety += 1;
    addEv(`You shoplifted ${item.name}. Sold it for $${item.value}.`, 'warn');
    addCrimeEv(`Shoplifted ${item.name} for $${item.value}.`, 'warn');
  } else {
    G.crime.heat = Math.min(100, G.crime.heat + item.risk);
    G.happy = clamp(G.happy - rnd(2,6));
    addEv(`You got caught shoplifting ${item.name}.`, 'bad');
    addCrimeEv(`Caught shoplifting ${item.name}.`, 'bad');
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(1,4));
  policeCheck();
  updateHUD(); renderCrime();
}

function stealParcels(){
  const chance = 0.7 - (G.crime.heat/200);
  if(Math.random()<chance){
    const gain = rnd(20,120);
    G.money += gain; G.crime.notoriety += 1;
    addEv(`You stole some parcels. Sold the contents for $${gain}.`, 'warn');
    addCrimeEv(`Stole parcels for $${gain}.`, 'warn');
  } else {
    G.crime.heat = Math.min(100, G.crime.heat + rnd(6,12));
    addEv('You got spotted stealing parcels. Someone yelled. You ran.', 'bad');
    addCrimeEv('Spotted stealing parcels.', 'bad');
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(2,6));
  policeCheck();
  updateHUD(); renderCrime();
}

function robPeople(){
  const chance = 0.45 - (G.crime.heat/180) + (G.crime.skills.violence/200);
  if(Math.random()<chance){
    const gain = rnd(60,300);
    G.money += gain; G.crime.notoriety += 3; G.crime.heat = Math.min(100, G.crime.heat + rnd(8,16));
    addEv(`You robbed someone. Got $${gain}.`, 'bad');
    addCrimeEv(`Robbed someone for $${gain}.`, 'bad');
  } else {
    G.health = clamp(G.health - rnd(5,12));
    G.crime.heat = Math.min(100, G.crime.heat + rnd(12,20));
    addEv('Robbery went badly. You got hurt and barely escaped.', 'bad');
    addCrimeEv('Robbery failed. Injured.', 'bad');
  }
  G.crime.skills.violence = Math.min(100, G.crime.skills.violence + rnd(1,3));
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(4,10));
  policeCheck();
  updateHUD(); renderCrime();
}

function carjack(){
  const chance = 0.4 - (G.crime.heat/160) + (G.crime.skills.violence/150);
  if(Math.random()<chance){
    const gain = rnd(400,1600);
    G.money += gain; G.crime.notoriety += 6; G.crime.heat = Math.min(100, G.crime.heat + rnd(12,20));
    addEv(`You carjacked someone and flipped the car for $${gain}.`, 'bad');
    addCrimeEv(`Carjacked ${pick(CAR_LIST)} for $${gain}.`, 'bad');
  } else {
    G.health = clamp(G.health - rnd(8,16));
    G.crime.heat = Math.min(100, G.crime.heat + rnd(16,24));
    addEv('The carjacking failed. You got chased.', 'bad');
    addCrimeEv('Carjacking failed. Chased.', 'bad');
  }
  G.crime.skills.violence = Math.min(100, G.crime.skills.violence + rnd(2,4));
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(6,12));
  policeCheck();
  updateHUD(); renderCrime();
}

function holdUpStore(){
  const chance = 0.5 - (G.crime.heat/170) + (G.crime.skills.violence/180);
  if(Math.random()<chance){
    const gain = rnd(300,1400);
    G.money += gain; G.crime.notoriety += 5; G.crime.heat = Math.min(100, G.crime.heat + rnd(12,22));
    addEv(`You held up a small store. +$${gain}.`, 'bad');
    addCrimeEv(`Held up a store for $${gain}.`, 'bad');
  } else {
    G.crime.heat = Math.min(100, G.crime.heat + rnd(18,28));
    addEv('The store clerk hit the panic alarm. You ran.', 'bad');
    addCrimeEv('Store hold‑up failed. Alarm triggered.', 'bad');
  }
  G.crime.skills.violence = Math.min(100, G.crime.skills.violence + rnd(2,4));
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(8,14));
  policeCheck();
  updateHUD(); renderCrime();
}

function sellDrugs(){
  ensureCrimeShape();
  const D = G.crime.drugs;
  if(!D.active){
    D.active = true;
    D.route = G.crime.mafia.joined ? 'mafia' : (G.crime.gang.joined ? 'gang' : 'independent');
    const firstZone = (D.zones||[])[0];
    if(firstZone) firstZone.assignment = D.route;
    if(drugAcquireSupply('marijuana', rnd(10,20), true)){
      addEv('You stepped into distribution. The money is real and the risk is realer.', 'warn');
      addCrimeEv('Drug ecosystem started from street-level distribution.', 'warn');
    }
  } else {
    drugRunDistributionCycle();
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(2,6));
  updateHUD();
  renderCrime();
}

function attemptKill(targetName){
  const known = knownPeople().find(p=>p.name===targetName);
  const target = targetName==='random' ? null : known;
  const desc = target ? `${target.firstName} ${target.lastName||''}`.trim() : randomVictimDesc();
  const chance = 0.25 + (G.crime.skills.violence/120) - (G.crime.heat/150);
  showPopup(
    'Dark Choice',
    `There is no clean way out of this. You can be killed in self‑defence. ${target?`Target: ${desc}.`:`${desc}`}`,
    [
      { label:'Back Out', cls:'btn-ghost', onClick:()=>{} },
      { label:'Go Through With It', cls:'btn-primary', onClick:()=>{
          if(Math.random()<chance){
            G.crime.notoriety += 10; G.crime.heat = Math.min(100, G.crime.heat + rnd(25,35));
            if(target) target.alive = false;
            addEv(target ? `You killed ${target.firstName}. You are not the same after.` : 'You killed a random person. The city went on. You did not.', 'bad');
            addCrimeEv('Committed murder.', 'bad');
          } else {
            if(Math.random()<0.3){ G.health = 0; die('You were killed in self‑defence.'); return; }
            G.health = clamp(G.health - rnd(10,20));
            G.crime.heat = Math.min(100, G.crime.heat + rnd(30,40));
            addEv('The attempt failed. It went worse than you imagined.', 'bad');
            addCrimeEv('Murder attempt failed.', 'bad');
          }
          G.crime.skills.violence = Math.min(100, G.crime.skills.violence + rnd(4,8));
          G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(12,20));
          policeCheck();
          updateHUD(); renderCrime();
        }},
    ],
    'dark'
  );
  updateHUD(); renderCrime();
}

function runScam(){
  const scams = [
    { id:'card', label:'Carding', base:0.55, min:300, max:1200 },
    { id:'phish', label:'Phishing', base:0.62, min:120, max:700 },
    { id:'ticket', label:'Fake Tickets', base:0.58, min:200, max:900 },
  ];
  showPopup(
    'Run a Scam',
    'Choose a scam. Each has different risk and payout.',
    scams.map(s=>({
      label:s.label,
      cls:'btn-ghost',
      onClick:()=>{
        const base = s.base + (G.crime.skills.scam/140) - (G.crime.heat/320);
        if(Math.random()<base){
          const gain = rnd(s.min,s.max);
          G.money += gain; G.crime.skills.scam = Math.min(100, G.crime.skills.scam + rnd(2,6));
          G.crime.notoriety += 2; G.crime.heat = Math.min(100, G.crime.heat + rnd(4,10));
          addEv(`${s.label} scam worked. +$${gain}.`, 'warn');
          addCrimeEv(`${s.label} scam success.`, 'warn');
        } else {
          G.crime.heat = Math.min(100, G.crime.heat + rnd(8,14));
          addEv(`${s.label} scam flopped. Someone reported it.`, 'bad');
          addCrimeEv(`${s.label} scam failed.`, 'bad');
        }
        G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(4,10));
        policeCheck();
        updateHUD(); renderCrime();
      }
    })),
    'dark'
  );
  updateHUD(); renderCrime();
}

function embezzle(){
  if(!G.career?.employed){ flash('Need a job first.','warn'); return; }
  const chance = 0.5 + (G.career.performance/200) - (G.career.hrRisk/200);
  if(Math.random()<chance){
    const gain = Math.floor(G.career.salary * rnd(2,6) / 100);
    G.money += gain; G.career.hrRisk = clamp(G.career.hrRisk + rnd(6,12));
    G.crime.notoriety += 3; G.crime.heat = Math.min(100, G.crime.heat + rnd(8,14));
    addEv(`You embezzled ${fmt$(gain)}.`, 'bad');
    addCrimeEv(`Embezzled ${fmt$(gain)}.`, 'bad');
  } else {
    G.career.hrRisk = clamp(G.career.hrRisk + rnd(12,20));
    G.crime.heat = Math.min(100, G.crime.heat + rnd(10,18));
    addEv('Embezzlement attempt failed. HR is suspicious.', 'bad');
    addCrimeEv('Embezzlement failed.', 'bad');
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(6,12));
  policeCheck();
  updateHUD(); renderCrime();
}

function hackPeople(){
  const chance = 0.45 + (G.crime.skills.hack/120) - (G.crime.heat/250);
  if(Math.random()<chance){
    const gain = rnd(200,1200);
    G.money += gain; G.crime.skills.hack = Math.min(100, G.crime.skills.hack + rnd(3,7));
    G.crime.notoriety += 4; G.crime.heat = Math.min(100, G.crime.heat + rnd(8,16));
    addEv(`You hacked someone and got $${gain}.`, 'bad');
    addCrimeEv(`Hacked for $${gain}.`, 'bad');
  } else {
    G.crime.heat = Math.min(100, G.crime.heat + rnd(12,20));
    addEv('Your hack got traced. Heat spiked.', 'bad');
    addCrimeEv('Hack traced.', 'bad');
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(8,14));
  policeCheck();
  updateHUD(); renderCrime();
}

function kidnap(level){
  const risk = level==='high' ? 0.25 : 0.45;
  const payout = level==='high' ? rnd(8000,40000) : rnd(2000,12000);
  const desc = level==='high' ? 'High‑profile target with security.' : 'Low‑profile target, fewer eyes.';
  showPopup(
    'Kidnapping',
    `This can go very wrong. You can be killed or captured. ${desc}`,
    [
      { label:'Back Out', cls:'btn-ghost', onClick:()=>{} },
      { label:'Proceed', cls:'btn-primary', onClick:()=>{
          if(Math.random()<risk){
            G.money += payout; G.crime.notoriety += level==='high'?18:10;
            G.crime.heat = Math.min(100, G.crime.heat + (level==='high'?35:22));
            addEv(`Kidnapping succeeded. Ransom: ${fmt$(payout)}.`, 'bad');
            addCrimeEv('Kidnapping success.', 'bad');
          } else {
            if(Math.random()<0.25){ G.health = 0; die('The kidnapping turned fatal.'); return; }
            G.crime.heat = Math.min(100, G.crime.heat + (level==='high'?45:28));
            G.health = clamp(G.health - rnd(10,18));
            addEv('Kidnapping failed. Everything went loud.', 'bad');
            addCrimeEv('Kidnapping failed.', 'bad');
          }
          G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(12,20));
          policeCheck();
          updateHUD(); renderCrime();
        }},
    ],
    'dark'
  );
  updateHUD(); renderCrime();
}

function heistBlueprintById(id){
  return HEIST_BLUEPRINTS.find(h=>h.id===id) || null;
}

function heistRequiredRoles(blueprint){
  return ['Hacker','Driver','Enforcer', blueprint.specialistRole];
}

function heistRoleProfile(role, difficulty=50){
  const isSpecial = !['Hacker','Driver','Enforcer'].includes(role);
  const difficultyLift = Math.floor(difficulty/18);
  const minSkill = (isSpecial ? 44 : 38) + difficultyLift;
  const maxSkill = (isSpecial ? 92 : 88) + Math.floor(difficulty/28);
  return {
    minSkill: Math.min(95, minSkill),
    maxSkill: Math.min(98, maxSkill),
    minLoyalty: isSpecial ? 38 : 34,
    maxLoyalty: 88,
    minGreed: 18 + Math.floor(difficulty/14),
    maxGreed: 90,
  };
}

function heistGenerateCandidate(role, difficulty=50){
  const profile = heistRoleProfile(role, difficulty);
  const names = HEIST_ROLE_NAMES[role] || ['Alex Voss','Casey Vale','Jordan Pike','Riley Hart'];
  const name = `${pick(names)} ${pick(NS)}`;
  const skill = rnd(profile.minSkill, profile.maxSkill);
  const loyalty = rnd(profile.minLoyalty, profile.maxLoyalty);
  const greed = rnd(profile.minGreed, profile.maxGreed);
  const baseFee = Math.max(6000, Math.floor((skill*skill) * 6 + difficulty*550));
  const upfront = baseFee + rnd(0, Math.floor(baseFee*0.35));
  const cutPct = Math.max(7, Math.min(28, Math.floor(skill/6) + Math.floor(greed/20) - Math.floor(loyalty/30)));
  const edge = skill>=88 ? 'elite operator' : skill>=75 ? 'pro' : skill>=60 ? 'solid' : 'risky';
  return {
    id:`${role}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    role,
    name,
    skill,
    loyalty,
    greed,
    upfront,
    cutPct,
    edge,
  };
}

function heistRefreshMarket(role, silent=false){
  ensureCrimeShape();
  const C = G.crime;
  const active = C.heists.active;
  if(!active) return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  const count = role===bp.specialistRole ? 5 : 4;
  C.heists.market[role] = Array.from({length:count}, ()=>heistGenerateCandidate(role, bp.difficulty));
  if(!silent) renderCrime();
}

function heistComputePlanning(active){
  const bp = heistBlueprintById(active.id);
  if(!bp) return 0;
  const setupBase = Math.floor((active.completedSetups.length / Math.max(1, bp.setups.length)) * 48);
  const raw = 22 + setupBase + (active.setupEffects.planning||0) + (active.decisionEffects.success||0) - Math.max(0, active.decisionEffects.risk||0);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function heistComputeCrewEfficiency(active){
  const bp = heistBlueprintById(active.id);
  if(!bp) return 0;
  const roles = heistRequiredRoles(bp);
  const hired = roles.map(r=>active.crew[r]).filter(Boolean);
  if(!hired.length) return 0;
  const avgSkill = hired.reduce((s,c)=>s+c.skill,0)/hired.length;
  const avgLoyalty = hired.reduce((s,c)=>s+c.loyalty,0)/hired.length;
  const avgGreed = hired.reduce((s,c)=>s+c.greed,0)/hired.length;
  const roleCoverage = (hired.length/roles.length) * 24;
  const raw = avgSkill*0.48 + avgLoyalty*0.34 - avgGreed*0.22 + roleCoverage;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function heistComputeBetrayalRisk(active){
  const bp = heistBlueprintById(active.id);
  if(!bp) return 0;
  const hired = heistRequiredRoles(bp).map(r=>active.crew[r]).filter(Boolean);
  if(!hired.length) return 0;
  let risk = 4 + Math.floor(bp.difficulty/15);
  hired.forEach(m=>{
    const greedGap = Math.max(0, m.greed - m.loyalty);
    risk += Math.floor(greedGap/7);
    if(m.contract==='cut' && m.cutPct<=10) risk += 4;
    if(m.contract==='upfront') risk = Math.max(0, risk-2);
  });
  risk += Math.max(0, 40 - heistComputePlanning(active))/6;
  return Math.max(0, Math.min(95, Math.round(risk)));
}

function heistRecalcScores(){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active) return;
  G.crime.heists.planningQuality = heistComputePlanning(active);
  G.crime.heists.crewEfficiency = heistComputeCrewEfficiency(active);
  G.crime.heists.betrayalRisk = heistComputeBetrayalRisk(active);
}

function heistCanLaunch(active, bp){
  if(!active || !bp) return false;
  const enoughSetups = active.completedSetups.length >= bp.minSetups;
  const roles = heistRequiredRoles(bp);
  const fullCrew = roles.every(r=>!!active.crew[r]);
  return enoughSetups && fullCrew;
}

function renderHeistOperationsCard(){
  ensureCrimeShape();
  const C = G.crime;
  const hs = C.heists;
  const active = hs.active;
  if(active){
    const bp = heistBlueprintById(active.id);
    if(!bp) return `<div class="card"><div class="notif bad">Active heist data missing.</div></div>`;
    heistRecalcScores();
    const roles = heistRequiredRoles(bp);
    const setupRows = bp.setups.map(s=>{
      const done = active.completedSetups.includes(s.id);
      return `<div class="choice${done?' disabled':''}" onclick="${done?'':`heistDoSetup('${s.id}')`}">
        <div class="choice-icon">${done?'✅':'🛠️'}</div>
        <div class="choice-name">${s.label}</div>
        <div class="choice-desc">${s.desc}</div>
        <div style="font-size:.66rem;color:var(--muted2);margin-top:2px">${fmt$(s.cost)} · plan +${s.planning}${done?' · done':''}</div>
      </div>`;
    }).join('');
    const crewRows = roles.map(role=>{
      const member = active.crew[role];
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-size:.84rem">${role}</div>
          <div style="font-size:.7rem;color:var(--muted2)">${member?`${member.name} · skill ${member.skill} · loyalty ${member.loyalty} · greed ${member.greed}`:'Unfilled slot'}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="heistOpenHire('${role}')">${member?'Replace':'Hire'}</button>
      </div>`;
    }).join('');
    const nextStep = bp.steps[active.stepIndex];
    const canLaunch = heistCanLaunch(active, bp);
    return `<div class="card">
      <div class="card-title">Heist Operation: ${bp.label}</div>
      <div style="font-size:.78rem;color:var(--muted2)">${bp.location}</div>
      ${active.dynamic && active.dynamic.seaState ? `<div style="font-size:.72rem;color:var(--muted2)">Current sea state: ${active.dynamic.seaState} · route shift ${active.dynamic.routeShift}</div>` : ''}
      <div style="font-size:.76rem;color:var(--muted2);margin-top:4px">Tier ${HEIST_TIER_META[bp.tier].label} · Difficulty ${bp.difficulty} · Cooldown ${hs.cooldown} year(s)</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
        <div class="sm-stat"><div class="sm-stat-val">${hs.planningQuality}</div><div class="sm-stat-lbl">Planning</div></div>
        <div class="sm-stat"><div class="sm-stat-val">${hs.crewEfficiency}</div><div class="sm-stat-lbl">Crew Efficiency</div></div>
        <div class="sm-stat"><div class="sm-stat-val">${hs.betrayalRisk}%</div><div class="sm-stat-lbl">Betrayal Risk</div></div>
        <div class="sm-stat"><div class="sm-stat-val">${active.completedSetups.length}/${bp.setups.length}</div><div class="sm-stat-lbl">Setups</div></div>
      </div>
      <div class="section-header" style="margin-top:10px">Setup phase (${bp.minSetups} minimum)</div>
      <div class="choice-grid">${setupRows}</div>
      <div class="section-header" style="margin-top:10px">Crew phase (Leader: You)</div>
      ${crewRows}
      <div class="section-header" style="margin-top:10px">Execution phase</div>
      <div style="font-size:.76rem;color:var(--muted2)">
        ${active.stage==='setup'
          ? 'Complete setup and crew requirements, then launch.'
          : nextStep
            ? `Next decision: ${nextStep.title} - ${nextStep.prompt}`
            : 'Execution complete. Resolving outcome...'}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        ${active.stage==='setup'
          ? `<button class="btn ${canLaunch?'btn-primary':'btn-ghost'} btn-sm" ${canLaunch?'':'disabled'} onclick="heistLaunchExecution()">Launch Heist</button>`
          : `<button class="btn btn-primary btn-sm" onclick="heistRunStepDecision()">Run Next Decision</button>`}
        <button class="btn btn-ghost btn-sm" onclick="heistAbortPlan()">Abort Heist Plan</button>
      </div>
    </div>`;
  }

  const rows = HEIST_BLUEPRINTS.map(h=>{
    const unlocked = C.notoriety>=h.minNotoriety && hs.cooldown<=0;
    const payout = `${fmt$(h.payout[0])} - ${fmt$(h.payout[1])}`;
    return `<div class="choice${unlocked?'':' disabled'}" onclick="${unlocked?`startHeist('${h.id}')`:''}">
      <div class="choice-icon">🎯</div>
      <div class="choice-name">${h.label}</div>
      <div class="choice-desc">${h.location}</div>
      <div style="font-size:.66rem;color:var(--muted2);margin-top:3px">${HEIST_TIER_META[h.tier].label} · Diff ${h.difficulty} · ${payout}</div>
      <div style="font-size:.64rem;color:${unlocked?'var(--accent2)':'var(--danger)'};margin-top:2px">${unlocked?'Ready to plan':`Need notoriety ${h.minNotoriety}${hs.cooldown>0?' and cooldown clear':''}`}</div>
    </div>`;
  }).join('');

  const historyRows = (hs.history||[]).slice(0,4).map(x=>`
    <div style="font-size:.74rem;color:var(--muted2);padding:3px 0">
      Age ${x.age}: ${x.label} - ${x.outcome.replace('_',' ')} (plan ${x.planning}, crew ${x.crewEff})
    </div>
  `).join('');

  return `<div class="card">
    <div class="card-title">Heist Operations</div>
    <div style="font-size:.78rem;color:var(--muted2)">Deep, multi-phase jobs with setup, crew management, execution decisions, and major fallout.</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
      <div class="sm-stat"><div class="sm-stat-val">${hs.planningQuality||0}</div><div class="sm-stat-lbl">Last Planning</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${hs.crewEfficiency||0}</div><div class="sm-stat-lbl">Last Crew Eff.</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${fmt$(hs.totalTake||0)}</div><div class="sm-stat-lbl">Career Heist Take</div></div>
    </div>
    <div class="choice-grid" style="margin-top:10px">${rows}</div>
    <div class="section-header" style="margin-top:10px">Recent outcomes</div>
    ${historyRows || '<div class="notif warn" style="margin-top:6px">No major heists completed yet.</div>'}
  </div>`;
}

function startHeist(heistId){
  ensureCrimeShape();
  const bp = heistBlueprintById(heistId);
  if(!bp){ flash('Heist blueprint missing.','warn'); return; }
  if(G.crime.heists.active){ flash('Finish or abort the active heist first.','warn'); return; }
  if(G.age<18){ flash('Heists unlock at age 18.','warn'); return; }
  if(G.crime.heists.cooldown>0){ flash(`You need to lay low for ${G.crime.heists.cooldown} more year(s).`,'warn'); return; }
  if(G.crime.notoriety < bp.minNotoriety){ flash(`Need notoriety ${bp.minNotoriety}.`,'warn'); return; }

  const roles = heistRequiredRoles(bp);
  const active = {
    id:bp.id,
    stage:'setup',
    specialistRole:bp.specialistRole,
    completedSetups:[],
    setupEffects:{ planning:0, success:0, risk:0, payout:0, heat:0, casualty:0, betrayal:0, speed:0 },
    decisionEffects:{ success:0, risk:0, payout:0, heat:0, casualty:0, betrayal:0, speed:0 },
    crew:Object.fromEntries(roles.map(r=>[r,null])),
    timeline:[],
    stepIndex:0,
    launched:false,
    upfrontPaid:0,
    dynamic:{},
  };
  if(bp.id==='yacht'){
    const seaState = pick(['calm','crosswind','stormfront']);
    const routeShift = rnd(-6,10);
    active.dynamic = { seaState, routeShift };
    if(seaState==='stormfront') active.setupEffects.risk += 4;
    if(routeShift>4) active.setupEffects.risk += 2;
    addCrimeEv(`Yacht route update: sea ${seaState}, route shift ${routeShift}.`, 'warn');
  }
  G.crime.heists.active = active;
  G.crime.currentHeist = bp.id;
  roles.forEach(r=>{ heistRefreshMarket(r, true); });
  addCrimeEv(`Planning started: ${bp.label}.`, 'bad');
  flash(`Planning ${bp.label}`,'warn');
  renderCrime();
}

function heistDoSetup(setupId){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='setup') return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  const setup = bp.setups.find(s=>s.id===setupId);
  if(!setup) return;
  if(active.completedSetups.includes(setup.id)){ flash('Setup already complete.','warn'); return; }
  if(G.money<setup.cost){ flash(`Need ${fmt$(setup.cost)}.`,'warn'); return; }
  G.money -= setup.cost;

  const executionChance = Math.max(0.28, Math.min(0.92, 0.7 + (G.crime.skills.hack+G.crime.skills.scam)/320 - bp.difficulty/260));
  const success = Math.random() < executionChance;
  if(success){
    active.completedSetups.push(setup.id);
    active.setupEffects.planning += setup.planning;
    active.setupEffects.success += setup.success;
    active.setupEffects.risk += setup.risk;
    active.setupEffects.payout += setup.payout;
    active.setupEffects.heat += setup.heat;
    addCrimeEv(`Setup success: ${setup.label}.`, 'warn');
    addEv(`Setup complete: ${setup.label}.`, 'good');
  } else {
    active.setupEffects.risk += Math.max(2, Math.abs(setup.risk)-1);
    active.setupEffects.betrayal += 2;
    G.crime.heat = Math.min(100, G.crime.heat + rnd(2,7));
    G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(3,8));
    addCrimeEv(`Setup failed: ${setup.label}.`, 'bad');
    addEv(`Setup failed: ${setup.label}. You are now on more radar.`, 'bad');
  }
  heistRecalcScores();
  updateHUD();
  renderCrime();
  heistMaybeOpenSetupPopup(bp, setup, success);
}

function heistOpenHire(role){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active) return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  if(!G.crime.heists.market[role] || !G.crime.heists.market[role].length) heistRefreshMarket(role);
  const list = (G.crime.heists.market[role]||[]).slice(0,4);
  if(!list.length){ flash('No candidates available.','warn'); return; }

  const actions = list.map(c=>({
    label:`${c.name} (S${c.skill} L${c.loyalty} G${c.greed})`,
    cls:'btn-ghost',
    onClick:()=>heistOfferContract(role, c.id),
  }));
  actions.push({ label:'Refresh candidates', cls:'btn-primary', onClick:()=>heistRefreshMarket(role) });
  showPopup(`Hire ${role}`, `Pick a ${role}. Low pay can increase betrayal risk.`, actions, 'dark');
}

function heistOfferContract(role, candidateId){
  ensureCrimeShape();
  const candidates = G.crime.heists.market[role] || [];
  const c = candidates.find(x=>x.id===candidateId);
  if(!c) return;
  const canUpfront = G.money>=c.upfront;
  showPopup(`Contract: ${c.name}`,
    `${role} | Skill ${c.skill} | Loyalty ${c.loyalty} | Greed ${c.greed}`,
    [
      { label:`Upfront ${fmt$(c.upfront)}`, cls:'btn-primary', disabled:!canUpfront, onClick:()=>heistHireCrew(role, candidateId, 'upfront') },
      { label:`Profit cut ${c.cutPct}%`, cls:'btn-ghost', onClick:()=>heistHireCrew(role, candidateId, 'cut') },
      { label:'Back', cls:'btn-ghost', onClick:()=>heistOpenHire(role) },
    ],
    'dark'
  );
}

function heistHireCrew(role, candidateId, contract){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='setup') return;
  const candidates = G.crime.heists.market[role] || [];
  const c = candidates.find(x=>x.id===candidateId);
  if(!c){ flash('Candidate gone.','warn'); return; }
  if(contract==='upfront' && G.money<c.upfront){ flash(`Need ${fmt$(c.upfront)}.`,'warn'); return; }
  if(contract==='upfront'){
    G.money -= c.upfront;
    active.upfrontPaid += c.upfront;
  }
  active.crew[role] = {
    id:c.id,
    role:c.role,
    name:c.name,
    skill:c.skill,
    loyalty:c.loyalty,
    greed:c.greed,
    contract,
    cutPct: contract==='cut' ? c.cutPct : 0,
    upfront: contract==='upfront' ? c.upfront : 0,
  };
  addCrimeEv(`Crew hired: ${c.name} as ${role} (${contract}).`, 'warn');
  heistRecalcScores();
  updateHUD();
  renderCrime();
}

function heistLaunchExecution(){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='setup') return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  if(!heistCanLaunch(active, bp)){
    flash(`Need at least ${bp.minSetups} setups and a full crew.`, 'warn');
    return;
  }
  active.stage = 'execution';
  active.launched = true;
  active.stepIndex = 0;
  addEv(`Execution started: ${bp.label}.`, 'bad');
  addCrimeEv(`Execution phase started at ${bp.location}.`, 'bad');
  renderCrime();
}

function heistCrewRuntimeEvent(active, bp){
  if(Math.random()>0.38) return;
  const roles = heistRequiredRoles(bp);
  const members = roles.map(r=>active.crew[r]).filter(Boolean);
  if(!members.length) return;
  const m = pick(members);
  const stress = (active.decisionEffects.risk||0) + (bp.difficulty/4);
  const panicChance = Math.max(0.08, Math.min(0.55, 0.18 + (stress/120) - m.loyalty/300));
  const betrayalPulse = Math.max(0.02, Math.min(0.45, 0.06 + (m.greed-m.loyalty)/180));
  if(Math.random()<betrayalPulse){
    active.decisionEffects.betrayal += 7;
    active.decisionEffects.success -= 4;
    addEv(`${m.name} ignored orders mid-heist to secure personal loot.`, 'bad');
    addCrimeEv(`Crew disobeyed: ${m.name}.`, 'bad');
    return;
  }
  if(Math.random()<panicChance){
    active.decisionEffects.risk += 6;
    active.decisionEffects.speed -= 6;
    addEv(`${m.name} panicked under pressure and slowed the operation.`, 'warn');
    addCrimeEv(`Crew panic: ${m.name}.`, 'warn');
    return;
  }
  active.decisionEffects.success += 6;
  active.decisionEffects.risk -= 4;
  addEv(`${m.name} executed perfectly under pressure.`, 'good');
  addCrimeEv(`Exceptional crew performance: ${m.name}.`, 'good');
}

function heistRunStepDecision(){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='execution') return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  if(active.stepIndex>=bp.steps.length){
    heistResolveOutcome();
    return;
  }
  const step = bp.steps[active.stepIndex];
  const actions = step.options.map(opt=>({
    label:opt.label,
    cls:'btn-primary',
    onClick:()=>heistApplyDecisionOption(opt),
  }));
  showPopup(`${bp.label}: ${step.title}`, step.prompt, actions, 'dark');
}

function heistApplyDecisionOption(opt){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active || active.stage!=='execution') return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;
  active.decisionEffects.success += opt.success||0;
  active.decisionEffects.risk += opt.risk||0;
  active.decisionEffects.payout += opt.payout||0;
  active.decisionEffects.casualty = (active.decisionEffects.casualty||0) + (opt.casualty||0);
  active.decisionEffects.heat += opt.heat||0;
  active.decisionEffects.speed += opt.speed||0;
  active.decisionEffects.betrayal += opt.betrayal||0;
  active.timeline.push({ age:G.age, step:active.stepIndex+1, choice:opt.label });
  heistCrewRuntimeEvent(active, bp);
  active.stepIndex += 1;
  if(active.stepIndex>=bp.steps.length){
    heistResolveOutcome();
    return;
  }
  heistRecalcScores();
  renderCrime();
}

function heistApplyArrest(bp, severity){
  const P = G.crime.police;
  const baseYears = bp.tier==='apex' ? rnd(12,24)
    : bp.tier==='national' ? rnd(8,16)
    : bp.tier==='major' ? rnd(4,10)
    : bp.tier==='urban' ? rnd(3,7)
    : rnd(1,4);
  const years = Math.max(1, baseYears + Math.floor(severity/30));
  P.inPrison = true;
  P.sentence = years;
  P.arrested = false;
  initPrison();
  G.legal.criminalStrikes = (G.legal.criminalStrikes||0) + 1;
  addEv(`Heist collapse led to arrest. Sentence: ${years} year(s).`, 'bad');
  addCrimeEv(`Arrested after ${bp.label}. Sentence ${years} years.`, 'bad');
}

function heistResolveOutcome(){
  ensureCrimeShape();
  const C = G.crime;
  const hs = C.heists;
  const active = hs.active;
  if(!active) return;
  const bp = heistBlueprintById(active.id);
  if(!bp) return;

  heistRecalcScores();
  const plan = hs.planningQuality;
  const crewEff = hs.crewEfficiency;
  const betrayalRisk = hs.betrayalRisk + (active.decisionEffects.betrayal||0);
  const noiseRisk = (active.setupEffects.risk||0) + (active.decisionEffects.risk||0);
  const payoffMod = 1 + (active.setupEffects.payout||0) + (active.decisionEffects.payout||0);
  const tier = HEIST_TIER_META[bp.tier] || HEIST_TIER_META.major;
  let successChance = 0.2
    + plan/250
    + crewEff/260
    + ((active.setupEffects.success||0) + (active.decisionEffects.success||0))/220
    - bp.difficulty/170
    - (C.heat||0)/260
    - noiseRisk/250;
  if(C.gang && C.gang.joined){
    successChance += 0.02;
    C.heat = Math.min(100, C.heat + 1);
  }
  if(bp.id==='casino' && C.mafia && C.mafia.joined){
    successChance += 0.04;
  }
  successChance = Math.max(0.05, Math.min(0.92, successChance));

  const hired = heistRequiredRoles(bp).map(r=>active.crew[r]).filter(Boolean);
  const betrayers = [];
  let stolenShare = 0;
  hired.forEach(m=>{
    const betrayChance = Math.max(0.01, Math.min(0.55,
      0.03 + (m.greed-m.loyalty)/200 + betrayalRisk/320 + (m.contract==='cut' && m.cutPct<=10 ? 0.08 : 0)
    ));
    if(Math.random()<betrayChance){
      betrayers.push(m.name);
      stolenShare += 0.08 + m.greed/550;
      successChance -= 0.06;
    }
  });
  if(betrayers.length){
    addEv(`Betrayal during the job: ${betrayers.join(', ')} broke protocol.`, 'bad');
    addCrimeEv(`Betrayal: ${betrayers.join(', ')}.`, 'bad');
  }

  const roll = Math.random();
  let outcome = 'failure';
  let fullSuccess = false;
  if(roll < successChance*0.72){
    outcome = 'success_full';
    fullSuccess = true;
  } else if(roll < successChance){
    outcome = 'success_partial';
  }

  const heatGainBase = Math.floor(bp.baseHeat * tier.heatMult) + Math.max(0, active.setupEffects.heat||0) + Math.max(0, active.decisionEffects.heat||0);
  const heatGain = heatGainBase + (bp.id==='federal_reserve' ? 16 : 0);

  if(outcome.startsWith('success')){
    const grossBase = rnd(bp.payout[0], bp.payout[1]);
    const gross = Math.max(0, Math.floor(grossBase * (fullSuccess ? 1 : 0.62) * Math.max(0.25, payoffMod)));
    const crewCut = hired.reduce((sum,m)=>sum + (m.contract==='cut' ? m.cutPct : 0), 0) / 100;
    const betrayalLoss = Math.min(0.5, stolenShare);
    const net = Math.max(0, Math.floor(gross * (1 - crewCut - betrayalLoss)));
    G.money += net;
    hs.totalTake += net;
    C.heat = Math.min(100, C.heat + heatGain + (fullSuccess?0:4));
    C.notoriety = clamp(C.notoriety + Math.floor(bp.difficulty/5) + (fullSuccess?6:3));
    C.police.closeness = Math.min(100, C.police.closeness + Math.floor(heatGain/2) + rnd(8,14));
    if(G.sm) G.sm.totalFame = clamp((G.sm.totalFame||0) + tier.fame + (fullSuccess?4:1));
    addEv(`${fullSuccess?'Heist success':'Partial success'} at ${bp.location}. Net take: ${fmt$(net)}.`, fullSuccess?'love':'warn');
    addCrimeEv(`${bp.label}: ${fullSuccess?'full success':'partial success'} for ${fmt$(net)}.`, fullSuccess?'bad':'warn');
  } else {
    C.heat = Math.min(100, C.heat + heatGain + rnd(10,18));
    C.notoriety = clamp(C.notoriety + Math.floor(bp.difficulty/8) + 2);
    C.police.closeness = Math.min(100, C.police.closeness + rnd(16,28));
    const casualtyPressure = Math.max(0, (active.decisionEffects.casualty||0) + noiseRisk + bp.difficulty);
    const deathChance = Math.max(0.01, Math.min(0.75, tier.deathRisk + casualtyPressure/360));
    const arrestChance = Math.max(0.15, Math.min(0.88, 0.34 + casualtyPressure/240 + (bp.tier==='national'||bp.tier==='apex'?0.12:0)));
    const fate = Math.random();
    if(fate < deathChance){
      addCrimeEv(`Failed ${bp.label}. Fatal collapse.`, 'bad');
      die(`The ${bp.label} at ${bp.location} went terminal. You did not make it out.`);
      return;
    }
    if(fate < deathChance + arrestChance){
      heistApplyArrest(bp, casualtyPressure);
    } else {
      const injury = rnd(14,32) + Math.floor(casualtyPressure/18);
      G.health = clamp(G.health - injury);
      G.happy = clamp(G.happy - rnd(8,18));
      addEv(`Heist failure at ${bp.location}. You escaped wounded and empty-handed.`, 'bad');
      addCrimeEv(`${bp.label} failed. Escaped wounded.`, 'bad');
    }
  }

  hs.history.unshift({
    age:G.age,
    id:bp.id,
    label:bp.label,
    location:bp.location,
    tier:bp.tier,
    planning:plan,
    crewEff,
    betrayal:betrayers.length,
    outcome,
  });
  if(hs.history.length>20) hs.history.pop();
  hs.cooldown = bp.tier==='apex' ? 2 : 1;
  hs.active = null;
  C.currentHeist = null;
  heistRecalcScores();
  updateHUD();
  renderCrime();
}

function heistAbortPlan(){
  ensureCrimeShape();
  const active = G.crime.heists.active;
  if(!active){ return; }
  const bp = heistBlueprintById(active.id);
  G.crime.heists.active = null;
  G.crime.currentHeist = null;
  G.crime.heat = Math.min(100, G.crime.heat + rnd(1,4));
  addCrimeEv(`Heist plan aborted${bp?`: ${bp.label}`:''}.`, 'warn');
  renderCrime();
}

function genInmates(){
  return Array.from({length:6},()=>({
    name: `${pick(NM.concat(NF))} ${pick(NS)}`,
    crazy: rnd(10,95),
    beef:false,
  }));
}

function prisonAct(type){
  const P = G.crime.police;
  const C = G.crime;
  if(!P.inPrison) return;
  if(!C.inmates) C.inmates = genInmates();
  const pr = C.prison;

  if(type==='work'){
    const gain = rnd(50,200);
    G.money += gain; pr.respect = clamp(pr.respect + rnd(1,3));
    addCrimeEv(`Worked detail. Earned ${fmt$(gain)}.`, 'warn');
  } else if(type==='exercise'){
    G.health = clamp(G.health + rnd(1,4)); pr.fear = clamp(pr.fear + rnd(2,5));
    addCrimeEv('Hit the yard. People noticed.', 'bad');
  } else if(type==='social'){
    pr.protection = clamp(pr.protection + rnd(2,5));
    if(Math.random()<0.2){ pr.sanity = clamp(pr.sanity - rnd(2,6)); }
    addCrimeEv('Built connections on the inside.', 'warn');
  } else if(type==='quiet'){
    pr.sanity = clamp(pr.sanity + rnd(1,4));
    addCrimeEv('Kept to yourself. Low profile.', 'good');
  } else if(type==='good'){
    if(Math.random()<0.3){
      G.crime.police.sentence = Math.max(0, G.crime.police.sentence-1);
      addCrimeEv('Good behavior shaved time off your sentence.', 'good');
    } else {
      addCrimeEv('Good behavior noted. No change yet.', 'warn');
    }
  } else if(type==='survive'){
    G.happy = clamp(G.happy - rnd(2,6));
    addCrimeEv('Kept your head down in prison.', 'warn');
  } else if(type==='smuggle'){
    const gain = rnd(200,1200);
    G.money += gain;
    addCrimeEv(`Smuggled goods for ${fmt$(gain)}.`, 'bad');
    if(Math.random()<0.3){ G.health = clamp(G.health - rnd(4,10)); }
  } else if(type==='riot'){
    if(Math.random()<0.4){
      addCrimeEv('Riot broke out. You survived.', 'bad');
      G.health = clamp(G.health - rnd(6,14));
    } else {
      addCrimeEv('Riot failed. Solitary time.', 'bad');
      G.happy = clamp(G.happy - rnd(6,12));
    }
  } else if(type==='escape'){
    if(Math.random()<0.18){
      P.inPrison = false; P.sentence = 0;
      C.heat = Math.min(100, C.heat + 20);
      addCrimeEv('You escaped prison. Heat exploded.', 'bad');
    } else {
      G.health = clamp(G.health - rnd(8,16));
      addCrimeEv('Escape failed. You were beaten.', 'bad');
    }
  } else if(type==='conjugal'){
    G.happy = clamp(G.happy + rnd(6,12));
    addCrimeEv('Conjugal visit. Brief warmth in a cold place.', 'good');
  } else if(type==='beef'){
    const i = pick(C.inmates);
    i.beef = true;
    G.health = clamp(G.health - rnd(4,10));
    addCrimeEv(`Started beef with ${i.name}.`, 'bad');
  }
  updateHUD(); renderCrime();
}

function prisonFaction(name){
  const pr = G.crime.prison;
  pr.faction = name;
  if(name==='Gang‑Affiliated') pr.protection = clamp(pr.protection + 8);
  if(name==='Crew') pr.protection = clamp(pr.protection + 5);
  if(name==='Independent') pr.protection = Math.max(0, pr.protection - 3);
  addCrimeEv(`Joined prison faction: ${name}.`, 'warn');
  renderCrime();
}

function joinGang(name){
  // legacy no-op
}

function gangAct(type){
  // legacy no-op
}

function gangTypeMeta(){
  const id = G.crime?.gang?.type;
  return GANG_ARCHETYPES.find(x=>x.id===id) || GANG_ARCHETYPES[0];
}

function gangRivalLabel(id){
  return (GANG_ARCHETYPES.find(x=>x.id===id)||{}).label || 'Rivals';
}

function gangMemberGenerate(role='young'){
  return {
    name:`${pick(NM.concat(NF))} ${pick(NS)}`,
    age:rnd(16,35),
    role,
    loyalty:rnd(24,84),
    aggression:rnd(20,92),
    competence:rnd(25,88),
    greed:rnd(12,86),
    status:'active',
  };
}

function gangEnsureRoster(){
  ensureCrimeShape();
  const g = G.crime.gang;
  if(!Array.isArray(g.members)) g.members = [];
  if(g.members.length>=4) return;
  const starter = [
    gangMemberGenerate('shot-caller'),
    gangMemberGenerate('core'),
    gangMemberGenerate('core'),
    gangMemberGenerate('young'),
    gangMemberGenerate('young'),
  ];
  g.members = starter;
  g.hierarchy.shotCaller = starter[0].name;
  g.hierarchy.core = starter.filter(m=>m.role==='core').map(m=>m.name);
  g.hierarchy.young = starter.filter(m=>m.role==='young').map(m=>m.name);
  if(!g.leader) g.leader = starter[0].name;
}

function gangRecalcBeefLevel(){
  ensureCrimeShape();
  const beef = G.crime.gang.beef;
  const score = beef.score||0;
  beef.level = score>=72 ? 3 : score>=38 ? 2 : score>=16 ? 1 : 0;
}

function gangEscalate(trigger='street_incident', base=8){
  ensureCrimeShape();
  const C = G.crime;
  const g = C.gang;
  if(!g.joined) return;
  const meta = gangTypeMeta();
  const inc = Math.max(3, Math.floor(base * (meta.beefBias||1)));
  g.beef.score = clamp((g.beef.score||0) + inc);
  g.beef.lastTrigger = trigger;
  if(!g.beef.rival){
    const rivals = GANG_RIVAL_MAP[g.type] || [];
    g.beef.rival = rivals.length ? pick(rivals) : '';
  }
  gangRecalcBeefLevel();
}

function gangOpenBeefResponsePopup(){
  ensureCrimeShape();
  const g = G.crime.gang;
  if(!g.joined){ flash('Join a gang first.','warn'); return; }
  if(!g.beef.rival){
    const rivals = GANG_RIVAL_MAP[g.type]||[];
    g.beef.rival = rivals.length ? pick(rivals) : '';
  }
  showPopup(`Beef with ${gangRivalLabel(g.beef.rival)}`, 'Decide your response doctrine. Every option carries risk.', [
    { label:'Ignore', cls:'btn-ghost', onClick:()=>{
      g.beef.score = clamp((g.beef.score||0) + rnd(1,5));
      g.cred = clamp((g.cred||10) - rnd(1,4));
      G.crime.heat = Math.max(0, G.crime.heat - rnd(1,4));
      gangRecalcBeefLevel();
      addCrimeEv('You ignored a beef incident. Heat eased, respect dipped.', 'warn');
      renderCrime();
    }},
    { label:'Respond', cls:'btn-primary', onClick:()=>{
      g.beef.score = clamp((g.beef.score||0) + rnd(6,12));
      g.cred = clamp((g.cred||10) + rnd(2,6));
      g.notoriety = clamp((g.notoriety||5) + rnd(2,6));
      G.crime.heat = Math.min(100, G.crime.heat + rnd(5,11));
      g.recentViolence = clamp((g.recentViolence||0) + rnd(5,12));
      gangRecalcBeefLevel();
      addCrimeEv(`You responded to ${gangRivalLabel(g.beef.rival)} pressure.`, 'bad');
      renderCrime();
    }},
    { label:'Escalate', cls:'btn-ghost', onClick:()=>{
      g.beef.score = clamp((g.beef.score||0) + rnd(12,22));
      g.cred = clamp((g.cred||10) + rnd(4,9));
      g.notoriety = clamp((g.notoriety||5) + rnd(6,12));
      G.crime.heat = Math.min(100, G.crime.heat + rnd(10,20));
      g.recentViolence = clamp((g.recentViolence||0) + rnd(10,20));
      gangRecalcBeefLevel();
      addCrimeEv(`You escalated into open war posture with ${gangRivalLabel(g.beef.rival)}.`, 'bad');
      renderCrime();
    }},
  ], 'dark');
}

function processGangYear(){
  ensureCrimeShape();
  const C = G.crime;
  const g = C.gang;
  if(!g.joined) return;
  const meta = gangTypeMeta();
  gangEnsureRoster();

  // territory control and risk
  const terrDrift = rnd(-1,2) + (meta.territoryBias>1?1:0);
  g.territory = Math.max(1, g.territory + (terrDrift>0 && Math.random()<0.42 ? 1 : terrDrift<0 ? -1 : 0));
  if(g.territory>6 && Math.random()<0.28){
    C.heat = Math.min(100, C.heat + rnd(4,9));
    addEv('Large gang footprint raised law-enforcement pressure.', 'warn');
  }

  // member-driven chaos
  const active = g.members.filter(m=>m.status==='active');
  active.forEach(m=>{
    if(m.aggression>74 && Math.random()<0.16){
      gangEscalate('member_started_fight', 9);
      addEv(`${m.name} started trouble without orders.`, 'bad');
    }
    if(m.greed>76 && Math.random()<0.14){
      const skim = rnd(180,2200);
      G.money = Math.max(0, G.money - skim);
      g.relationships.internalConflict = clamp((g.relationships.internalConflict||0) + rnd(4,10));
      addEv(`${m.name} skimmed ${fmt$(skim)} from gang earnings.`, 'bad');
    }
    if(m.loyalty<30 && Math.random()<0.08){
      m.status = 'flipped';
      C.heat = Math.min(100, C.heat + rnd(8,16));
      C.police.closeness = Math.min(100, C.police.closeness + rnd(6,14));
      addEv(`${m.name} switched sides and fed info to rivals/cops.`, 'bad');
    }
    if(Math.random()<0.05 + (C.heat/420)){
      m.status = 'jailed';
      C.police.inPrison = C.police.inPrison || false;
      addEv(`${m.name} got arrested in a sweep.`, 'warn');
    }
  });

  // active beef lifecycle
  if((g.beef.score||0)>0){
    if(g.beef.level>=3){
      g.beef.yearsAtWar = (g.beef.yearsAtWar||0) + 1;
      if(Math.random()<0.28){
        const injury = rnd(6,18);
        G.health = clamp(G.health - injury);
        C.heat = Math.min(100, C.heat + rnd(8,18));
        g.recentViolence = clamp((g.recentViolence||0) + rnd(8,18));
        addEv(`War-level retaliation from ${gangRivalLabel(g.beef.rival)} left you injured.`, 'bad');
      }
      const deathRisk = Math.max(0.01, Math.min(0.5,
        g.beef.level*0.07 + (g.notoriety||0)/420 + (g.recentViolence||0)/380 - (g.cred||10)/520
      ));
      if(Math.random()<deathRisk*0.2){
        die(`Gang war with ${gangRivalLabel(g.beef.rival)} turned fatal.`);
        return;
      }
    }
    g.beef.score = Math.max(0, (g.beef.score||0) - rnd(2,7));
    gangRecalcBeefLevel();
  }

  // cohesion and control
  const avgLoyalty = active.length ? Math.floor(active.reduce((s,m)=>s+(m.loyalty||0),0)/active.length) : 40;
  g.relationships.cohesion = clamp(Math.floor((g.relationships.cohesion||55)*0.6 + avgLoyalty*0.4 - (g.relationships.internalConflict||0)*0.18));
  if(g.relationships.cohesion<35 && Math.random()<0.22){
    g.relationships.powerStruggle = clamp((g.relationships.powerStruggle||0) + rnd(4,10));
    addEv('A power struggle inside your gang is forming.', 'warn');
  }
  if((g.relationships.powerStruggle||0)>70 && Math.random()<0.18){
    g.cred = clamp((g.cred||10) - rnd(6,14));
    g.territory = Math.max(1, g.territory - 1);
    addEv('Internal split weakened your street control this year.', 'bad');
  }
}

function gangJoin(typeId){
  const g = GANG_ARCHETYPES.find(x=>x.id===typeId);
  if(!g) return;
  const C = G.crime.gang;
  C.type = g.id; C.colors = g.colors; C.symbol = g.symbol; C.style = g.style;
  showPopup('Join Crew', 'Choose how you join and prove yourself.', [
    { label:'Invited', cls:'btn-ghost', onClick:()=>gangJoinMethod('invited') },
    { label:'Born Into It', cls:'btn-ghost', onClick:()=>gangJoinMethod('born') },
    { label:'Prove Yourself', cls:'btn-primary', onClick:()=>gangJoinMethod('prove') },
    { label:'Prison Recruitment', cls:'btn-ghost', onClick:()=>gangJoinMethod('prison') },
  ], 'dark');
}

function gangJoinMethod(method){
  const C = G.crime.gang;
  let chance = 0.25 + (G.crime.notoriety/120);
  if(method==='born') chance += 0.15;
  if(method==='invited') chance += 0.1;
  if(method==='prove') chance += 0.05;
  if(method==='prison' && G.crime.police.inPrison) chance += 0.2;
  if(Math.random()<chance){
    const meta = gangTypeMeta();
    C.joined = true;
    C.name = meta.label;
    C.affiliation = method;
    C.cred = rnd(15,35);
    C.notoriety = rnd(10,25);
    C.beef = { rival: pick(GANG_RIVAL_MAP[C.type]||[]), level:0, score:0, lastTrigger:'', yearsAtWar:0 };
    C.relationships = { cohesion:rnd(48,66), internalConflict:rnd(4,16), powerStruggle:rnd(0,10) };
    C.retaliations = 0;
    C.recentViolence = 0;
    gangEnsureRoster();
    addCrimeEv(`Joined ${C.name} (${meta.incomeFocus}).`, 'bad');
  } else {
    addCrimeEv('Joining failed. You were rejected.', 'bad');
  }
  renderCrime();
}

function gangTag(){
  const C = G.crime.gang;
  C.cred = clamp(C.cred + rnd(2,5));
  C.territory += 1;
  C.beef.score = clamp((C.beef.score||0) + rnd(0,4));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(2,6));
  addCrimeEv('Tagged territory. Your name spreads.', 'warn');
  renderCrime();
}

function gangDefend(){
  const C = G.crime.gang;
  const meta = gangTypeMeta();
  if(Math.random()<0.6){
    C.cred = clamp(C.cred + rnd(4,8));
    addCrimeEv('Defended your block. Respect grew.', 'bad');
  } else {
    C.cred = clamp(C.cred - rnd(3,7));
    addCrimeEv('Defense failed. Rival took ground.', 'bad');
  }
  C.beef.score = clamp((C.beef.score||0) + rnd(4,9));
  if(meta.id==='bloods') C.beef.score = clamp(C.beef.score + 2);
  gangRecalcBeefLevel();
  C.notoriety = clamp(C.notoriety + rnd(2,6));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(6,12));
  renderCrime();
}

function gangPush(){
  const C = G.crime.gang;
  const meta = gangTypeMeta();
  const pushChance = 0.42 + ((meta.territoryBias||1)-1)*0.18 - (C.beef.level>=3?0.06:0);
  if(Math.random()<pushChance){
    C.territory += 1;
    C.cred = clamp(C.cred + rnd(6,10));
    addCrimeEv('Pushed into rival zone. Territory gained.', 'bad');
  } else {
    C.cred = clamp(C.cred - rnd(4,8));
    addCrimeEv('Push failed. Violence erupted.', 'bad');
  }
  C.beef.score = clamp((C.beef.score||0) + rnd(7,14));
  gangRecalcBeefLevel();
  C.notoriety = clamp(C.notoriety + rnd(6,12));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(10,18));
  renderCrime();
}

function gangBeef(){
  gangOpenBeefResponsePopup();
}

function gangPost(){
  const C = G.crime.gang;
  const cloutGain = C.type==='getmoney' ? rnd(4,9) : rnd(1,4);
  C.clout = clamp(C.clout + cloutGain);
  if(G.sm.platforms && Object.keys(G.sm.platforms).length){
    Object.keys(G.sm.platforms).forEach(pid=>G.sm.platforms[pid].followers += rnd(200,1200));
  }
  if((C.type==='bloods' || C.type==='crips') && Math.random()<0.45){
    gangEscalate('online_disrespect', rnd(6,13));
  }
  G.crime.heat = Math.min(100, G.crime.heat + rnd(4,10));
  addCrimeEv('Posted gang content. Clout up, heat up.', 'warn');
  renderCrime();
}

function gangDrugs(){
  ensureCrimeShape();
  const D = G.crime.drugs;
  D.active = true;
  D.route = 'gang';
  const zone = (D.zones||[]).find(z=>z.assignment==='none') || (D.zones||[])[0];
  if(zone){
    zone.assignment = 'gang';
    zone.intensity = 2;
  }
  if((D.inventory[D.tradeDrug]||0)<8){
    drugAcquireSupply(D.tradeDrug||'marijuana', rnd(8,16), true);
  }
  addCrimeEv('Street gang distribution route activated.', 'bad');
  drugRunDistributionCycle();
}

function gangSnitch(){
  if(Math.random()<0.25){
    die('You were killed for snitching.');
    return;
  }
  G.crime.gang.joined = false;
  addCrimeEv('You snitched on your crew. You are marked.', 'bad');
  renderCrime();
}

function mafiaJoin(path){
  const M = G.crime.mafia;
  const loyaltyTrait = G.traits?.includes('Loyal') ? 0.15 : 0;
  const rep = (G.crime.notoriety/100) + loyaltyTrait;
  let chance = 0.2 + rep;
  if(path==='family') chance += 0.2;
  if(path==='apply') chance -= 0.1;
  if(path==='prison') chance += 0.15;
  if(path==='noticed') chance += 0.05;
  if(Math.random()<chance){
    M.joined = true; M.rank = 0; M.loyalty = 45; M.respect = 20; M.fear = 15;
    M.rackets = [MAFIA_RACKETS[0]];
    addCrimeEv('Accepted into the mafia as an Associate.', 'bad');
  } else {
    addCrimeEv('Mafia rejected you. For now.', 'warn');
  }
  renderCrime();
}

function mafiaCollect(){
  const M = G.crime.mafia;
  const base = M.rackets.reduce((s,r)=>s+r.income,0);
  const take = Math.floor(base * (1 + M.territory*0.1));
  G.money += take; M.earnings += take;
  G.crime.heat = Math.min(100, G.crime.heat + rnd(2,6));
  addCrimeEv(`Collected ${fmt$(take)} from rackets.`, 'bad');
  renderCrime();
}

function mafiaExpand(){
  const M = G.crime.mafia;
  if(Math.random()<0.45){
    M.territory += 1;
    addCrimeEv('Took over a new territory.', 'bad');
    G.crime.heat = Math.min(100, G.crime.heat + rnd(6,12));
  } else {
    addCrimeEv('Expansion attempt failed. Rival crew pushed back.', 'bad');
  }
  renderCrime();
}

function mafiaCrackdown(){
  const M = G.crime.mafia;
  if(Math.random()<0.6){
    M.fear = clamp(M.fear + rnd(4,8));
    addCrimeEv('You cracked down on non‑payers. Fear increased.', 'bad');
  } else {
    addCrimeEv('Crackdown backfired. Respect dropped.', 'bad');
    M.respect = clamp(M.respect - rnd(3,7));
  }
  renderCrime();
}

function mafiaRecruit(){
  const M = G.crime.mafia;
  const member = { name:`${pick(NM.concat(NF))} ${pick(NS)}`, role:pick(['Enforcer','Earner','Fixer']), loyalty:rnd(30,70), greed:rnd(20,80), competence:rnd(30,80) };
  M.crew.push(member);
  addCrimeEv(`Recruited ${member.name} (${member.role}).`, 'bad');
  renderCrime();
}

function mafiaOrders(){
  const M = G.crime.mafia;
  const orders = ['Collect debts','Deal with a traitor','Expand territory','Handle rival crew'];
  const order = pick(orders);
  showPopup('Order', order, [
    { label:'Do It Clean', cls:'btn-ghost', onClick:()=>{ M.respect=clamp(M.respect+2); M.loyalty=clamp(M.loyalty+2); addCrimeEv(`Handled: ${order} cleanly.`, 'bad'); renderCrime(); }},
    { label:'Do It Violently', cls:'btn-primary', onClick:()=>{ M.fear=clamp(M.fear+4); G.crime.heat=Math.min(100,G.crime.heat+8); addCrimeEv(`Handled: ${order} violently.`, 'bad'); renderCrime(); }},
    { label:'Refuse', cls:'btn-ghost', onClick:()=>{ M.loyalty=clamp(M.loyalty-6); addCrimeEv(`Refused order: ${order}.`, 'bad'); renderCrime(); }},
  ], 'dark');
}

function mafiaSnitch(){
  const M = G.crime.mafia;
  if(!M.joined) return;
  if(Math.random()<0.2){
    die('You were killed for snitching.');
    return;
  }
  M.joined = false; M.rank = 0;
  G.crime.heat = Math.min(100, G.crime.heat + 20);
  addCrimeEv('You snitched on the mafia. You are marked.', 'bad');
  renderCrime();
}

function mafiaStartRacket(){
  const M = G.crime.mafia;
  const available = MAFIA_RACKETS.filter(r=>!M.rackets.find(x=>x.id===r.id));
  if(!available.length){ flash('All rackets running.','warn'); return; }
  const r = pick(available);
  M.rackets.push(r);
  addCrimeEv(`Started racket: ${r.label}.`, 'bad');
  renderCrime();
}

function mafiaFrontBusiness(){
  const M = G.crime.mafia;
  if(G.money<5000){ flash('Need $5,000','warn'); return; }
  G.money -= 5000;
  M.fronts += 1;
  M.heat = Math.max(0, M.heat-5);
  addCrimeEv('Set up a front business. Heat reduced.', 'warn');
  renderCrime();
}

function mafiaCorrupt(){
  const M = G.crime.mafia;
  if(G.money<15000){ flash('Need $15,000','warn'); return; }
  G.money -= 15000;
  M.corruption += 1;
  G.crime.heat = Math.max(0, G.crime.heat-10);
  addCrimeEv('Bribed an official. Police pressure eased.', 'bad');
  renderCrime();
}
// ── PRO SPORTS HUB ─────────────────────────────────────────────
function renderProSports(){
  const pc = document.getElementById('prosports-content');
  const tab = G.proSportsTab || 'nfl';
  const nflActive = tab==='nfl' ? 'active' : '';
  const nbaActive = tab==='nba' ? 'active' : '';
  const mmaActive = tab==='mma' ? 'active' : '';
  pc.innerHTML = `
    <div style="display:flex;border-bottom:1px solid var(--border);padding:0 0 6px 0;gap:6px;overflow-x:auto">
      <button class="tab ${nflActive}" onclick="setProSportTab('nfl')">🏈 NFL</button>
      <button class="tab ${nbaActive}" onclick="setProSportTab('nba')">🏀 NBA</button>
      <button class="tab ${mmaActive}" onclick="setProSportTab('mma')">🥋 MMA</button>
    </div>
    <div style="margin-top:10px" id="prosports-inner"></div>
  `;
  if(tab==='nfl'){ renderNFLInto('prosports-inner'); }
  if(tab==='nba'){ renderNBAInto('prosports-inner'); }
  if(tab==='mma'){ renderMMAInto('prosports-inner'); }
}

function setProSportTab(t){
  G.proSportsTab = t;
  renderProSports();
}

function renderNFLInto(id){
  const el = document.getElementById(id);
  if(!el) return;
  renderNFL();
  const nfl = document.getElementById('nfl-content');
  if(nfl) el.innerHTML = nfl.innerHTML;
}

function renderNBAInto(id){
  const el = document.getElementById(id);
  if(!el) return;
  renderNBA();
  const nba = document.getElementById('nba-content');
  if(nba) el.innerHTML = nba.innerHTML;
}

function renderMMAInto(id){
  const el = document.getElementById(id);
  if(!el) return;
  if(typeof renderMMA==='function') renderMMA();
  const mma = document.getElementById('mma-content');
  if(mma) el.innerHTML = mma.innerHTML;
}


// ═══════════════════════════════════════════════════════════════
