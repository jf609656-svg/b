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

function ensureCrimeShape(){
  if(!G.crime || typeof G.crime!=='object') G.crime = {};
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
      { id:'estate_core', title:'Estate core', prompt:'Panic vault route forks into trophy room, crypto cold-room, and art wing.', options:[
        { label:'Hit vault and leave art', success:9, risk:9, payout:0.11, casualty:4, heat:7, speed:7, betrayal:0 },
        { label:'Split crew across all wings', success:6, risk:14, payout:0.2, casualty:9, heat:12, speed:11, betrayal:6 },
        { label:'Trigger blackout and ghost path', success:8, risk:7, payout:0.06, casualty:3, heat:5, speed:4, betrayal:2 },
      ]},
      { id:'collapse_window', title:'Collapse window', prompt:'Island lockdown starts in 90 seconds and sea lanes are blocked.', options:[
        { label:'Hold formation and force one lane', success:7, risk:13, payout:0.03, casualty:8, heat:10, speed:10, betrayal:1 },
        { label:'Break into micro-teams', success:8, risk:9, payout:-0.06, casualty:5, heat:6, speed:8, betrayal:7 },
        { label:'Burn decoy yacht extraction', success:6, risk:11, payout:-0.1, casualty:4, heat:5, speed:12, betrayal:0 },
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
        <div class="choice" onclick="sellDrugs()"><div class="choice-icon">💊</div><div class="choice-name">Sell Drugs</div><div class="choice-desc">Expansion soon</div></div>
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
  html += `<div class="card">
    <div class="card-title">Street Gangs</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">
      ${C.gang.joined?`${C.gang.symbol} ${C.gang.name} · Style: ${C.gang.style} · Cred ${C.gang.cred} · Notoriety ${C.gang.notoriety}`:'Not affiliated'}
    </div>
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
        <div class="choice" onclick="gangBeef()"><div class="choice-icon">😤</div><div class="choice-name">Escalate Beef</div><div class="choice-desc">Volatile</div></div>
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
  const gain = rnd(80,240);
  G.money += gain; G.crime.notoriety += 2; G.crime.heat = Math.min(100, G.crime.heat + rnd(4,10));
  addEv(`You sold drugs on the side. +$${gain}. Expansion coming.`, 'warn');
  addCrimeEv(`Sold drugs for $${gain}.`, 'warn');
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(3,8));
  policeCheck();
  updateHUD(); renderCrime();
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
    C.joined = true; C.name = C.type==='set' ? (Math.random()<0.5?'Bloods':'Crips') : pick(['Southside Crew','Block 79','Neon Alley','Greyline']);
    C.affiliation = method;
    C.cred = rnd(15,35); C.notoriety = rnd(10,25);
    addCrimeEv(`Joined ${C.name} as ${C.style}.`, 'bad');
  } else {
    addCrimeEv('Joining failed. You were rejected.', 'bad');
  }
  renderCrime();
}

function gangTag(){
  const C = G.crime.gang;
  C.cred = clamp(C.cred + rnd(2,5));
  C.territory += 1;
  G.crime.heat = Math.min(100, G.crime.heat + rnd(2,6));
  addCrimeEv('Tagged territory. Your name spreads.', 'warn');
  renderCrime();
}

function gangDefend(){
  const C = G.crime.gang;
  if(Math.random()<0.6){
    C.cred = clamp(C.cred + rnd(4,8));
    addCrimeEv('Defended your block. Respect grew.', 'bad');
  } else {
    C.cred = clamp(C.cred - rnd(3,7));
    addCrimeEv('Defense failed. Rival took ground.', 'bad');
  }
  C.notoriety = clamp(C.notoriety + rnd(2,6));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(6,12));
  renderCrime();
}

function gangPush(){
  const C = G.crime.gang;
  if(Math.random()<0.45){
    C.territory += 1;
    C.cred = clamp(C.cred + rnd(6,10));
    addCrimeEv('Pushed into rival zone. Territory gained.', 'bad');
  } else {
    C.cred = clamp(C.cred - rnd(4,8));
    addCrimeEv('Push failed. Violence erupted.', 'bad');
  }
  C.notoriety = clamp(C.notoriety + rnd(6,12));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(10,18));
  renderCrime();
}

function gangBeef(){
  const C = G.crime.gang;
  C.notoriety = clamp(C.notoriety + rnd(5,10));
  G.crime.heat = Math.min(100, G.crime.heat + rnd(8,14));
  addCrimeEv('Beef escalated. Tension is high.', 'bad');
  renderCrime();
}

function gangPost(){
  const C = G.crime.gang;
  const cloutGain = C.type==='clout' ? rnd(4,9) : rnd(1,4);
  C.clout = clamp(C.clout + cloutGain);
  if(G.sm.platforms && Object.keys(G.sm.platforms).length){
    Object.keys(G.sm.platforms).forEach(pid=>G.sm.platforms[pid].followers += rnd(200,1200));
  }
  G.crime.heat = Math.min(100, G.crime.heat + rnd(4,10));
  addCrimeEv('Posted gang content. Clout up, heat up.', 'warn');
  renderCrime();
}

function gangDrugs(){
  const D = G.crime.drugs;
  if(!D.active){
    D.active = true; D.tier='low'; D.supply = rnd(5,15); D.model = 'street';
    addCrimeEv('Started small drug operation.', 'bad');
  } else {
    const dt = DRUG_TYPES.find(x=>x.id===D.tier);
    const income = Math.floor(dt.profit * D.supply * (D.model==='street'?1:0.8));
    G.money += income; D.income += income;
    G.crime.heat = Math.min(100, G.crime.heat + Math.floor(6*dt.heat));
    addCrimeEv(`Drug sales earned ${fmt$(income)}.`, 'bad');
  }
  renderCrime();
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
