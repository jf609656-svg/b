// ══ activities.js ══
// ═══════════════════════════════════════════════════════════════
//  activities.js — Activities tab
// ═══════════════════════════════════════════════════════════════

function renderActivities(){
  const eligible = ACTIVITIES.filter(a=>G.age>=a.minAge);
  const grid = document.getElementById('activities-grid');
  if(!grid) return;
  grid.innerHTML = eligible.map((a,i)=>`
    <div class="choice" onclick="runActivity(${ACTIVITIES.indexOf(a)})">
      <div class="choice-icon">${a.icon}</div>
      <div class="choice-name">${a.name}</div>
      <div class="choice-desc">${a.desc}</div>
    </div>`).join('');
  renderClubActivitiesCard();
  renderStreetRacingCard();
}

function openStreetRacingHub(){
  ensureStreetRacingState();
  renderActivities();
  flash('Street racing hub opened. Build your garage and race.', 'good');
}

function runActivity(i){
  ACTIVITIES[i].fn();
  updateHUD();
  switchTab('life');
}

const STREET_RACING_LEVELS = [
  { id:1, label:'Rookie', minRep:0, unlockTracks:1 },
  { id:2, label:'Street Runner', minRep:55, unlockTracks:2 },
  { id:3, label:'Circuit Predator', minRep:120, unlockTracks:3 },
  { id:4, label:'Underground Icon', minRep:220, unlockTracks:4 },
  { id:5, label:'City Legend', minRep:340, unlockTracks:5 },
];

const STREET_RACING_CARS = [
  { id:'hatch_starter', name:'Raptor S Hatch', class:'D', price:8500, power:32, grip:38, reliability:64 },
  { id:'old_muscle', name:'Ironbolt 78', class:'D', price:11000, power:45, grip:28, reliability:52 },
  { id:'turbo_compact', name:'VX Turbo Compact', class:'C', price:22000, power:55, grip:52, reliability:60 },
  { id:'awd_sedan', name:'Falcon AWD GT', class:'C', price:30000, power:62, grip:58, reliability:70 },
  { id:'drift_coupe', name:'Nightshade Coupe', class:'B', price:52000, power:74, grip:65, reliability:58 },
  { id:'track_r', name:'Apex R Track', class:'B', price:76000, power:82, grip:78, reliability:74 },
  { id:'super_gt', name:'Nova Super GT', class:'A', price:145000, power:96, grip:86, reliability:66 },
  { id:'hyper_x', name:'Hyperion X', class:'S', price:320000, power:112, grip:95, reliability:72 },
];

const STREET_RACING_TRACKS = [
  { id:'dock_loop', name:'Dockside Loop', reqLevel:1, entry:[300,1200], payout:[1200,4600], hazard:8, turns:42, straight:48 },
  { id:'industrial_ring', name:'Industrial Ring', reqLevel:2, entry:[800,2600], payout:[4500,12500], hazard:16, turns:56, straight:44 },
  { id:'mountain_run', name:'Mountain Midnight Run', reqLevel:3, entry:[1800,6000], payout:[12000,34000], hazard:28, turns:68, straight:36 },
  { id:'expressway_sprint', name:'Expressway Sprint', reqLevel:4, entry:[3500,11000], payout:[26000,68000], hazard:35, turns:32, straight:72 },
  { id:'grand_underground', name:'Grand Underground Circuit', reqLevel:5, entry:[9000,22000], payout:[85000,190000], hazard:48, turns:60, straight:66 },
];

const STREET_RACING_MODS = [
  { id:'ecu', name:'ECU Tune', stat:'power', minCost:1200, maxCost:6800, boost:[4,12], risk:6, desc:'More power, more stress on engine.' },
  { id:'tires', name:'Semi-Slick Tires', stat:'grip', minCost:900, maxCost:5500, boost:[5,13], risk:3, desc:'Better cornering and launch consistency.' },
  { id:'suspension', name:'Coilover Suspension', stat:'handling', minCost:1400, maxCost:7200, boost:[4,11], risk:4, desc:'Sharper transitions and stability.' },
  { id:'weight', name:'Weight Reduction', stat:'handling', minCost:1600, maxCost:9800, boost:[6,14], risk:8, desc:'Faster chassis, harsher mistakes.' },
  { id:'turbo', name:'Turbo Upgrade', stat:'power', minCost:3000, maxCost:16000, boost:[8,18], risk:12, desc:'Big speed jump, high reliability risk.' },
  { id:'brakes', name:'Track Brake Kit', stat:'grip', minCost:1200, maxCost:7600, boost:[5,12], risk:2, desc:'Late braking confidence.' },
  { id:'nitrous', name:'Nitrous Shot', stat:'power', minCost:1800, maxCost:9200, boost:[6,15], risk:14, desc:'Huge bursts, easy to overuse.' },
  { id:'aero', name:'Aero Package', stat:'handling', minCost:2000, maxCost:10500, boost:[5,13], risk:5, desc:'High-speed stability and downforce.' },
];

const STREET_RACING_EVENTS = [
  { title:'Grid Start Pressure', prompt:'Launch lights drop and the AWD cars jump hard. What do you do?',
    choices:[
      { label:'Aggressive launch, chase holeshot', stat:'skill', base:58, risk:10 },
      { label:'Controlled launch, save traction', stat:'grip', base:50, risk:4 },
      { label:'Late launch, avoid wheelspin chaos', stat:'reliability', base:42, risk:1 },
    ]},
  { title:'Tight Chicane', prompt:'You enter a rapid left-right chicane two-wide.',
    choices:[
      { label:'Attack inside line', stat:'handling', base:56, risk:12 },
      { label:'Settle and prioritize clean exit', stat:'grip', base:48, risk:4 },
      { label:'Brake early and survive', stat:'reliability', base:40, risk:1 },
    ]},
  { title:'Long Straight Duel', prompt:'Rival pulls alongside on the longest straight.',
    choices:[
      { label:'Nitrous and full-send pass', stat:'power', base:60, risk:14 },
      { label:'Slipstream, then late move', stat:'skill', base:52, risk:8 },
      { label:'Hold lane and defend position', stat:'reliability', base:46, risk:3 },
    ]},
  { title:'Late Braking Zone', prompt:'Final corner braking marker appears too fast.',
    choices:[
      { label:'Out-brake everyone', stat:'grip', base:57, risk:12 },
      { label:'Brake on marker, prioritize traction', stat:'handling', base:50, risk:5 },
      { label:'Lift early and avoid contact', stat:'reliability', base:43, risk:1 },
    ]},
  { title:'Engine Heat Spike', prompt:'Oil temps are rising mid-race.',
    choices:[
      { label:'Ignore it, keep full pace', stat:'power', base:54, risk:15 },
      { label:'Short-shift and cool engine', stat:'reliability', base:50, risk:2 },
      { label:'Pit for quick check', stat:'skill', base:38, risk:0 },
    ]},
  { title:'Police Scanner Alert', prompt:'Spotter calls possible police near exit route.',
    choices:[
      { label:'Push now and finish before crackdown', stat:'skill', base:55, risk:13 },
      { label:'Maintain pace and avoid spotlight', stat:'reliability', base:48, risk:5 },
      { label:'Abort and pull out early', stat:'reliability', base:35, risk:0 },
    ]},
  { title:'Wet Surface Patch', prompt:'Unexpected damp patch appears at corner entry.',
    choices:[
      { label:'Trust setup and attack anyway', stat:'handling', base:53, risk:11 },
      { label:'Adjust line and feather throttle', stat:'skill', base:50, risk:5 },
      { label:'Back off heavily', stat:'reliability', base:40, risk:1 },
    ]},
  { title:'Rival Divebomb', prompt:'A rival divebombs from behind into your lane.',
    choices:[
      { label:'Counter-cut and reclaim apex', stat:'skill', base:57, risk:10 },
      { label:'Yield, set up switchback', stat:'handling', base:49, risk:4 },
      { label:'Let them go and secure finish', stat:'reliability', base:43, risk:1 },
    ]},
  { title:'Tire Degradation', prompt:'Rear grip is fading during final laps.',
    choices:[
      { label:'Drift-style rotation, keep speed', stat:'handling', base:54, risk:12 },
      { label:'Smooth lines, preserve what is left', stat:'grip', base:50, risk:4 },
      { label:'Defensive driving only', stat:'reliability', base:42, risk:1 },
    ]},
  { title:'Final-Lap Gambit', prompt:'Last lap. Podium is one move away.',
    choices:[
      { label:'All-in overtaking attempt', stat:'skill', base:60, risk:15 },
      { label:'Wait for rival mistake', stat:'reliability', base:47, risk:3 },
      { label:'Bank current place and points', stat:'reliability', base:44, risk:1 },
    ]},
];

function ensureStreetRacingState(){
  if(!G.activities || typeof G.activities!=='object') G.activities = {};
  if(!G.activities.streetRacing || typeof G.activities.streetRacing!=='object'){
    G.activities.streetRacing = {
      level:1,
      rep:0,
      skill:18,
      heat:4,
      garage:[],
      activeCarId:'',
      races:0,
      wins:0,
      podiums:0,
      crashes:0,
      fines:0,
      totalPrize:0,
      maxTrackUnlocked:1,
    };
  }
  const r = G.activities.streetRacing;
  if(typeof r.level!=='number') r.level = 1;
  if(typeof r.rep!=='number') r.rep = 0;
  if(typeof r.skill!=='number') r.skill = 18;
  if(typeof r.heat!=='number') r.heat = 4;
  if(!Array.isArray(r.garage)) r.garage = [];
  if(typeof r.activeCarId!=='string') r.activeCarId = '';
  if(typeof r.races!=='number') r.races = 0;
  if(typeof r.wins!=='number') r.wins = 0;
  if(typeof r.podiums!=='number') r.podiums = 0;
  if(typeof r.crashes!=='number') r.crashes = 0;
  if(typeof r.fines!=='number') r.fines = 0;
  if(typeof r.totalPrize!=='number') r.totalPrize = 0;
  if(typeof r.maxTrackUnlocked!=='number') r.maxTrackUnlocked = 1;
  if(!r.garage.length){
    const starter = STREET_RACING_CARS[0];
    r.garage.push({
      id:starter.id,
      name:starter.name,
      class:starter.class,
      power:starter.power,
      grip:starter.grip,
      handling:Math.floor((starter.power+starter.grip)/2),
      reliability:starter.reliability,
      mods:[],
      value:starter.price,
      mileage:0,
      damage:0,
    });
    r.activeCarId = starter.id;
  }
  if(!r.activeCarId && r.garage[0]) r.activeCarId = r.garage[0].id;
}

function streetCarById(id){
  ensureStreetRacingState();
  return G.activities.streetRacing.garage.find(c=>c.id===id) || null;
}

function activeStreetCar(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  return streetCarById(r.activeCarId) || r.garage[0] || null;
}

function streetRacingRecalcLevel(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  let lvl = 1;
  STREET_RACING_LEVELS.forEach(l=>{
    if(r.rep>=l.minRep) lvl = l.id;
  });
  if(lvl>r.level){
    r.level = lvl;
    r.maxTrackUnlocked = Math.max(r.maxTrackUnlocked, lvl);
    addEv(`Street racing level up: ${STREET_RACING_LEVELS[lvl-1].label}. New tracks unlocked.`, 'love');
    flash(`🏁 Level ${lvl} unlocked`,'good');
  }
}

function streetRacingBuyCar(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const owned = new Set(r.garage.map(c=>c.id));
  const market = STREET_RACING_CARS.filter(c=>!owned.has(c.id));
  if(!market.length){
    flash('You already own all available cars.','warn');
    return;
  }
  showPopup(
    'Street Racing Market',
    'Choose a car to add to your garage.',
    market.slice(0,6).map(c=>({
      label:`${c.name} · ${c.class} · ${fmt$(c.price)}`,
      cls:'btn-ghost',
      onClick:()=>streetRacingConfirmBuy(c.id),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRacingConfirmBuy(carId){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const base = STREET_RACING_CARS.find(c=>c.id===carId);
  if(!base) return;
  if(G.money < base.price){
    flash(`Need ${fmt$(base.price)} to buy ${base.name}.`,'warn');
    return;
  }
  G.money -= base.price;
  r.garage.push({
    id:base.id,
    name:base.name,
    class:base.class,
    power:base.power,
    grip:base.grip,
    handling:Math.floor((base.power+base.grip)/2),
    reliability:base.reliability,
    mods:[],
    value:base.price,
    mileage:0,
    damage:0,
  });
  r.activeCarId = base.id;
  addEv(`Bought ${base.name} for ${fmt$(base.price)}. Garage expanded.`, 'good');
  flash(`New car: ${base.name}`,'good');
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingSelectCar(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  showPopup(
    'Select Active Car',
    'Choose your race car for the next event.',
    r.garage.map(c=>({
      label:`${c.name} · P${c.power} G${c.grip} H${c.handling} R${c.reliability}`,
      cls: c.id===r.activeCarId ? 'btn-primary' : 'btn-ghost',
      onClick:()=>{
        r.activeCarId = c.id;
        addEv(`Set ${c.name} as active race car.`, 'good');
        renderStreetRacingCard();
      },
    })).concat([{ label:'Close', cls:'btn-ghost', onClick:()=>{} }]),
    'normal'
  );
}

function streetRacingOpenMods(){
  ensureStreetRacingState();
  const car = activeStreetCar();
  if(!car){ flash('No active race car selected.','warn'); return; }
  showPopup(
    `${car.name} Mods`,
    'Choose a modification package for your next setup.',
    STREET_RACING_MODS.slice(0,8).map(m=>({
      label:`${m.name} · ${fmt$(m.minCost)}-${fmt$(m.maxCost)}`,
      cls:'btn-ghost',
      onClick:()=>streetRacingApplyMod(m.id),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRacingApplyMod(modId){
  ensureStreetRacingState();
  const mod = STREET_RACING_MODS.find(m=>m.id===modId);
  const car = activeStreetCar();
  if(!mod || !car) return;
  const cost = rnd(mod.minCost, mod.maxCost);
  if(G.money<cost){
    flash(`Need ${fmt$(cost)} for ${mod.name}.`,'warn');
    return;
  }
  G.money -= cost;
  const gain = rnd(mod.boost[0], mod.boost[1]);
  if(mod.stat==='power') car.power = clamp(car.power + gain);
  if(mod.stat==='grip') car.grip = clamp(car.grip + gain);
  if(mod.stat==='handling') car.handling = clamp(car.handling + gain);
  car.reliability = clamp(car.reliability - rnd(0, mod.risk));
  car.mods.push({ id:mod.id, name:mod.name, gain, cost });
  if(car.mods.length>10) car.mods.shift();
  G.activities.streetRacing.skill = clamp((G.activities.streetRacing.skill||18) + rnd(1,3));
  addEv(`Installed ${mod.name} on ${car.name} for ${fmt$(cost)} (+${gain} ${mod.stat}).`, 'good');
  flash(`Mod installed: ${mod.name}`,'good');
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingOpenTrack(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const unlocked = STREET_RACING_TRACKS.filter(t=>t.reqLevel<=r.level);
  showPopup(
    'Choose Race Track',
    'Pick your race location and stakes.',
    unlocked.map(t=>({
      label:`${t.name} · Lv${t.reqLevel}+ · Entry ${fmt$(t.entry[0])}-${fmt$(t.entry[1])}`,
      cls:'btn-ghost',
      onClick:()=>streetRacingRunRace(t.id),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRaceStatForChoice(car, choice, racingSkill){
  if(choice.stat==='power') return car.power;
  if(choice.stat==='grip') return car.grip;
  if(choice.stat==='handling') return car.handling;
  if(choice.stat==='reliability') return car.reliability;
  return racingSkill;
}

function streetRacingRunRace(trackId){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const track = STREET_RACING_TRACKS.find(t=>t.id===trackId);
  const car = activeStreetCar();
  if(!track || !car) return;
  const entry = rnd(track.entry[0], track.entry[1]);
  if(G.money<entry){
    flash(`Need ${fmt$(entry)} entry fee for ${track.name}.`,'warn');
    return;
  }
  const ev = pick(STREET_RACING_EVENTS);
  showPopup(
    `${track.name} Race Night`,
    `${ev.prompt}\n\nCar: ${car.name} · Level ${r.level} · Entry ${fmt$(entry)}`,
    ev.choices.map(ch=>({
      label:ch.label,
      cls:'btn-ghost',
      onClick:()=>streetRacingResolveRace(track, car, ev, ch, entry),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRacingResolveRace(track, car, ev, choice, entry){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  G.money -= entry;
  const raceSkill = r.skill||18;
  const choiceStat = streetRaceStatForChoice(car, choice, raceSkill);
  const pace = Math.floor(car.power*0.38 + car.grip*0.31 + car.handling*0.31 + raceSkill*0.8 + r.level*7);
  const riskPenalty = rnd(0, track.hazard + choice.risk + Math.max(0, 60-car.reliability));
  const roll = pace + choiceStat + rnd(-20,24) + choice.base - riskPenalty;
  r.races += 1;
  car.mileage = (car.mileage||0) + rnd(40,120);
  let resultType = 'warn';
  let resultMsg = '';
  let prize = 0;
  if(roll>=180){
    prize = rnd(track.payout[0], track.payout[1]) + rnd(track.payout[0], track.payout[1]);
    G.money += prize;
    r.wins += 1;
    r.podiums += 1;
    r.rep += rnd(18,32);
    r.skill = clamp(r.skill + rnd(4,8));
    G.happy = clamp(G.happy + rnd(8,14));
    G.social.reputation = clamp((G.social.reputation||50) + rnd(3,8));
    resultType = 'love';
    resultMsg = `Dominant win at ${track.name}. ${choice.label} paid off. Prize: ${fmt$(prize)}.`;
  } else if(roll>=145){
    prize = rnd(track.payout[0], track.payout[1]);
    G.money += prize;
    r.podiums += 1;
    r.rep += rnd(10,20);
    r.skill = clamp(r.skill + rnd(2,5));
    G.happy = clamp(G.happy + rnd(4,9));
    resultType = 'good';
    resultMsg = `Strong finish at ${track.name}. You made podium money: ${fmt$(prize)}.`;
  } else if(roll>=112){
    r.rep += rnd(3,9);
    r.skill = clamp(r.skill + rnd(1,3));
    G.stress = clamp((G.stress||35) + rnd(1,4));
    resultType = 'warn';
    resultMsg = `Mid-pack run at ${track.name}. You learned, but profit was thin this round.`;
  } else if(roll>=84){
    r.rep = Math.max(0, r.rep - rnd(4,10));
    r.skill = clamp(r.skill + rnd(0,2));
    G.stress = clamp((G.stress||35) + rnd(3,8));
    car.damage = clamp((car.damage||0) + rnd(8,20));
    resultType = 'bad';
    resultMsg = `Rough race at ${track.name}. Contact and mistakes cost you position.`;
  } else {
    r.rep = Math.max(0, r.rep - rnd(10,22));
    r.crashes += 1;
    car.damage = clamp((car.damage||0) + rnd(20,40));
    G.health = clamp(G.health - rnd(4,12));
    G.stress = clamp((G.stress||35) + rnd(7,14));
    resultType = 'bad';
    resultMsg = `Crash at ${track.name}. ${choice.label} backfired under pressure.`;
    if(Math.random()<0.45){
      const fine = rnd(1200,8500);
      G.money = Math.max(0, G.money - fine);
      r.fines += fine;
      r.heat = clamp((r.heat||0) + rnd(8,16));
      addEv(`Police crackdown after the crash. Fine paid: ${fmt$(fine)}.`, 'bad');
    }
  }
  r.totalPrize += prize;
  r.heat = clamp((r.heat||0) + rnd(1,6) + Math.floor(track.hazard/12));
  if(r.heat>65 && Math.random()<0.28){
    const extraFine = rnd(1800,12000);
    G.money = Math.max(0, G.money - extraFine);
    r.fines += extraFine;
    addEv(`Heat spike triggered extra enforcement. You paid ${fmt$(extraFine)} in penalties.`, 'bad');
  }
  if(car.damage>=70){
    const repair = rnd(3500,16000);
    if(G.money>=repair){
      G.money -= repair;
      car.damage = Math.max(12, car.damage - rnd(35,55));
      addEv(`Emergency repairs on ${car.name}: ${fmt$(repair)}.`, 'warn');
    } else if(Math.random()<0.25){
      car.reliability = Math.max(10, car.reliability - rnd(8,16));
      addEv(`${car.name} remains heavily damaged. Reliability dropped.`, 'bad');
    }
  }
  streetRacingRecalcLevel();
  addEv(resultMsg, resultType);
  flash(resultType==='bad' ? 'Race ended badly' : 'Race completed', resultType==='bad'?'bad':'good');
  renderStreetRacingCard();
  updateHUD();
}

function renderStreetRacingCard(){
  ensureStreetRacingState();
  const grid = document.getElementById('activities-grid');
  if(!grid || !grid.parentElement) return;
  let card = document.getElementById('street-racing-card');
  if(!card){
    card = document.createElement('div');
    card.id = 'street-racing-card';
    card.className = 'card';
    grid.parentElement.appendChild(card);
  }
  const r = G.activities.streetRacing;
  const car = activeStreetCar();
  const lvlMeta = STREET_RACING_LEVELS[Math.max(0, r.level-1)] || STREET_RACING_LEVELS[0];
  card.innerHTML = `
    <div class="card-title">Street Racing</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">
      Level: <strong>${lvlMeta.label}</strong> · Rep ${r.rep} · Skill ${r.skill} · Heat ${r.heat}
    </div>
    <div style="margin-bottom:10px;font-size:.76rem;color:var(--muted2)">
      Active Car: ${car?`${car.name} (P${car.power} G${car.grip} H${car.handling} R${car.reliability} DMG ${car.damage||0})`:'None'}
    </div>
    <div class="choice-grid">
      <div class="choice" onclick="streetRacingBuyCar()">
        <div class="choice-icon">🚗</div>
        <div class="choice-name">Buy Car</div>
        <div class="choice-desc">Expand your garage</div>
      </div>
      <div class="choice" onclick="streetRacingSelectCar()">
        <div class="choice-icon">🛞</div>
        <div class="choice-name">Choose Car</div>
        <div class="choice-desc">Set active racer</div>
      </div>
      <div class="choice" onclick="streetRacingOpenMods()">
        <div class="choice-icon">🔧</div>
        <div class="choice-name">Install Mods</div>
        <div class="choice-desc">Popup mod choices</div>
      </div>
      <div class="choice" onclick="streetRacingOpenTrack()">
        <div class="choice-icon">🏁</div>
        <div class="choice-name">Race Track</div>
        <div class="choice-desc">Choose level + track</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:.74rem;color:var(--muted2)">
      Races ${r.races} · Wins ${r.wins} · Podiums ${r.podiums} · Crashes ${r.crashes} · Fines ${fmt$(r.fines)} · Total Prize ${fmt$(r.totalPrize)}
    </div>
  `;
}

function streetRacingHeatCooldownYear(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  if((r.heat||0)>0) r.heat = Math.max(0, (r.heat||0) - rnd(3,8));
  if((r.heat||0)>=70 && Math.random()<0.2){
    const fine = rnd(800,5200);
    G.money = Math.max(0, (G.money||0) - fine);
    addEv(`Street racing heat drew enforcement attention. Fine paid: ${fmt$(fine)}.`, 'warn');
  }
}

const ACT_ORCHESTRA_RANKS = [
  { id:'reserve', label:'Reserve Player', minYears:0 },
  { id:'section', label:'Section Member', minYears:2 },
  { id:'principal', label:'Principal Chair', minYears:4 },
  { id:'concertmaster', label:'Concertmaster / Lead Chair', minYears:7 },
];

const ACT_ORCHESTRA_CENTERS = [
  { id:'civic', name:'Civic Arts Center', prestige:34, payout:[800,2200] },
  { id:'metro', name:'Metropolitan Hall', prestige:62, payout:[2600,6800] },
];

const ACT_ORCHESTRA_EVENTS = [
  {
    title:'Stand Light Fails',
    prompt:'Mid-piece, your stand light dies. Do you keep playing from memory or pause to adjust?',
    options:[
      { id:'memory', label:'Play from memory', reqSkill:52, safe:false },
      { id:'adjust', label:'Pause and adjust calmly', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Tempo Drift',
    prompt:'The strings are drifting ahead of the conductor. Do you anchor tempo or follow section panic?',
    options:[
      { id:'anchor', label:'Anchor to conductor', reqSkill:56, safe:false },
      { id:'follow', label:'Follow section', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Solo Spotlight',
    prompt:'A surprise solo line lands on your desk. Do you project confidently or play conservative?',
    options:[
      { id:'project', label:'Project confidently', reqSkill:60, safe:false },
      { id:'safe', label:'Play conservative', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Page Turn Disaster',
    prompt:'Your page turn sticks and the entrance is two beats away.',
    options:[
      { id:'wing', label:'Wing it by ear', reqSkill:58, safe:false },
      { id:'drop', label:'Drop one phrase and re-enter clean', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Conductor Callout',
    prompt:'The conductor asks your section for sharper articulation in front of everyone.',
    options:[
      { id:'adapt', label:'Adapt immediately', reqSkill:50, safe:false },
      { id:'blend', label:'Hide in the section blend', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Nerves Spike',
    prompt:'Your hands shake before the difficult run.',
    options:[
      { id:'breathe', label:'Breathing reset then attack run', reqSkill:54, safe:false },
      { id:'simplify', label:'Simplify phrasing for control', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Section Mismatch',
    prompt:'Your section bowings don’t match the principal chair.',
    options:[
      { id:'lead', label:'Lead a clean unified stroke', reqSkill:57, safe:false },
      { id:'mirror', label:'Mirror principal at last second', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Acoustic Echo',
    prompt:'The hall has heavy echo. Timing feels delayed.',
    options:[
      { id:'internal', label:'Rely on internal pulse', reqSkill:55, safe:false },
      { id:'watch', label:'Watch conductor only', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Broken Reed / String',
    prompt:'Your setup partially fails right before movement two.',
    options:[
      { id:'hotfix', label:'Quick hot-fix backstage', reqSkill:53, safe:false },
      { id:'swap', label:'Swap to backup and play safer', reqSkill:0, safe:true },
    ],
  },
  {
    title:'Encore Pressure',
    prompt:'Crowd demands an encore you only rehearsed once.',
    options:[
      { id:'take', label:'Take lead confidently', reqSkill:62, safe:false },
      { id:'defer', label:'Defer to principal chairs', reqSkill:0, safe:true },
    ],
  },
];

function ensureClubState(){
  if(!G.clubs || typeof G.clubs!=='object') G.clubs = {};
  if(!G.clubs.orchestra || typeof G.clubs.orchestra!=='object'){
    G.clubs.orchestra = {
      joined:false,
      instrument:'',
      rank:'reserve',
      years:0,
      rehearsals:0,
      performances:0,
      kicked:false,
      awards:0,
      rep:20,
    };
  }
  const o = G.clubs.orchestra;
  if(typeof o.joined!=='boolean') o.joined = false;
  if(typeof o.instrument!=='string') o.instrument = '';
  if(typeof o.rank!=='string') o.rank = 'reserve';
  if(typeof o.years!=='number') o.years = 0;
  if(typeof o.rehearsals!=='number') o.rehearsals = 0;
  if(typeof o.performances!=='number') o.performances = 0;
  if(typeof o.kicked!=='boolean') o.kicked = false;
  if(typeof o.awards!=='number') o.awards = 0;
  if(typeof o.rep!=='number') o.rep = 20;
}

function instrumentSkillById(inst){
  ensureBioShape?.();
  if(!inst) return 0;
  const sk = G.bio?.instrumentSkill?.[inst];
  return typeof sk==='number' ? sk : 0;
}

function instrumentLearnOrPractice(inst, amount, src=''){
  if(typeof gainInstrumentSkill==='function'){
    return gainInstrumentSkill(inst, amount, src);
  }
  if(!G.bio) G.bio = {};
  if(!G.bio.instrumentSkill) G.bio.instrumentSkill = {};
  const cur = typeof G.bio.instrumentSkill[inst]==='number' ? G.bio.instrumentSkill[inst] : 0;
  const next = Math.max(0, Math.min(100, cur + amount));
  G.bio.instrumentSkill[inst] = next;
  return next;
}

function orchestraCenterById(id){
  return ACT_ORCHESTRA_CENTERS.find(c=>c.id===id) || ACT_ORCHESTRA_CENTERS[0];
}

function orchestraRankMeta(rankId){
  return ACT_ORCHESTRA_RANKS.find(r=>r.id===rankId) || ACT_ORCHESTRA_RANKS[0];
}

function orchestraPromoteIfReady(){
  ensureClubState();
  const o = G.clubs.orchestra;
  if(!o.joined || o.kicked) return;
  const idx = ACT_ORCHESTRA_RANKS.findIndex(r=>r.id===o.rank);
  if(idx<0 || idx>=ACT_ORCHESTRA_RANKS.length-1) return;
  const next = ACT_ORCHESTRA_RANKS[idx+1];
  const sk = instrumentSkillById(o.instrument);
  if(o.years>=next.minYears && o.rehearsals>=next.minYears+2 && sk>=38+idx*12){
    o.rank = next.id;
    o.rep = clamp((o.rep||20) + rnd(8,14));
    addEv(`Orchestra promotion: you moved up to ${next.label}.`, 'love');
    flash(`🎼 Promoted to ${next.label}`,'good');
  }
}

function orchestraAudition(){
  ensureClubState();
  if((G.age||0)<12){
    flash('You are too young to audition right now.','warn');
    return;
  }
  const o = G.clubs.orchestra;
  if(o.joined){
    flash('You are already in orchestra.','warn');
    return;
  }
  const instruments = Object.keys((G.bio&&G.bio.instrumentSkill)||{});
  if(!instruments.length){
    showPopup('Orchestra Audition', 'You need instrument training first. Practice in Music or Activities.', [
      { label:'Close', cls:'btn-primary', onClick:()=>{} },
    ]);
    return;
  }
  showPopup(
    'Orchestra Audition',
    'Pick your audition instrument. Admission depends on skill and composure.',
    instruments.map(inst=>({
      label:`${inst} (${instrumentSkillById(inst)})`,
      cls:'btn-ghost',
      onClick:()=>orchestraResolveAudition(inst),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }])
  );
}

function orchestraResolveAudition(inst){
  ensureClubState();
  const o = G.clubs.orchestra;
  const skill = instrumentSkillById(inst);
  const chance = Math.max(0.08, Math.min(0.95, 0.18 + skill/110 + (G.smarts||50)/320));
  if(Math.random()<chance && skill>=22){
    o.joined = true;
    o.kicked = false;
    o.instrument = inst;
    o.rank = 'reserve';
    o.years = 0;
    o.rehearsals = 0;
    o.performances = 0;
    o.rep = 26;
    addEv(`Audition passed on ${inst}. You joined the orchestra as a reserve player.`, 'love');
    flash('🎻 Audition passed','good');
  } else {
    addEv(`Orchestra audition on ${inst} fell short this year.`, 'warn');
    flash('Audition unsuccessful','warn');
  }
}

function orchestraPractice(){
  ensureClubState();
  const o = G.clubs.orchestra;
  if(!o.joined || o.kicked){
    flash('You are not currently in the orchestra.','warn');
    return;
  }
  const gain = rnd(5,12);
  const skill = instrumentLearnOrPractice(o.instrument, gain, 'orchestra_practice');
  o.rehearsals += 1;
  o.rep = clamp((o.rep||20) + rnd(2,5));
  G.smarts = clamp((G.smarts||50) + rnd(1,3));
  G.happy = clamp((G.happy||50) + rnd(2,6));
  G.stress = clamp((G.stress||35) - rnd(1,4));
  addEv(`Orchestra rehearsal complete on ${o.instrument}. Skill now ${skill}.`, 'good');
  flash(`🎼 Rehearsal done · ${o.instrument} ${skill}`,'good');
  orchestraPromoteIfReady();
  updateHUD();
  renderActivities();
}

function orchestraPerformance(centerId){
  ensureClubState();
  const o = G.clubs.orchestra;
  if(!o.joined || o.kicked){
    flash('You need to be in orchestra first.','warn');
    return;
  }
  const center = orchestraCenterById(centerId);
  const event = pick(ACT_ORCHESTRA_EVENTS);
  const skill = instrumentSkillById(o.instrument);
  const rankIdx = Math.max(0, ACT_ORCHESTRA_RANKS.findIndex(r=>r.id===o.rank));
  const base = skill + rankIdx*6 + Math.floor((G.smarts||50)/8) + Math.floor((o.rep||20)/10) - Math.floor(center.prestige/9);
  showPopup(
    `${center.name} Performance`,
    `${event.prompt}\n\nInstrument: ${o.instrument} · Skill: ${skill} · Rank: ${orchestraRankMeta(o.rank).label}`,
    event.options.map(opt=>({
      label:opt.label,
      cls:opt.safe ? 'btn-ghost' : 'btn-primary',
      onClick:()=>orchestraResolvePerformance(center, event, opt, base),
    })).concat([{ label:'Cancel', cls:'btn-ghost', onClick:()=>{} }]),
    'normal'
  );
}

function orchestraResolvePerformance(center, event, option, baseScore){
  ensureClubState();
  const o = G.clubs.orchestra;
  const skill = instrumentSkillById(o.instrument);
  const req = option.reqSkill||0;
  const execution = baseScore + rnd(-12,14) + (option.safe?3:0) - (req>0 && skill<req ? 18 : 0);
  o.performances += 1;
  let payout = 0;
  let msg = '';
  let type = 'good';
  if(execution>=88){
    payout = rnd(center.payout[0], center.payout[1]) + rnd(2000,7000);
    G.money += payout;
    G.happy = clamp((G.happy||50) + rnd(9,16));
    G.social.reputation = clamp((G.social.reputation||50) + rnd(5,11));
    o.rep = clamp((o.rep||20) + rnd(10,16));
    instrumentLearnOrPractice(o.instrument, rnd(6,12), 'orchestra_peak');
    msg = `${event.title}: you delivered a standout performance at ${center.name}. Critics noticed.`;
    type = 'love';
    if(Math.random()<0.18){
      o.awards += 1;
      addEv('You received a young artist commendation from the orchestra board.', 'love');
    }
  } else if(execution>=62){
    payout = rnd(center.payout[0], center.payout[1]);
    G.money += payout;
    G.happy = clamp((G.happy||50) + rnd(4,9));
    o.rep = clamp((o.rep||20) + rnd(3,8));
    instrumentLearnOrPractice(o.instrument, rnd(3,7), 'orchestra_show');
    msg = `${event.title}: a solid performance at ${center.name}. Not perfect, but respected.`;
    type = 'good';
  } else if(execution>=45){
    payout = Math.floor(rnd(center.payout[0], center.payout[1]) * 0.45);
    G.money += payout;
    G.happy = clamp((G.happy||50) - rnd(1,5));
    o.rep = clamp((o.rep||20) - rnd(2,6));
    msg = `${event.title}: shaky execution. The set finished, but your section lead looked concerned.`;
    type = 'warn';
  } else {
    G.happy = clamp((G.happy||50) - rnd(6,13));
    G.stress = clamp((G.stress||35) + rnd(4,10));
    o.rep = clamp((o.rep||20) - rnd(7,15));
    msg = `${event.title}: performance collapsed under pressure at ${center.name}.`;
    type = 'bad';
    if(skill<28 || o.rep<16 || Math.random()<0.22){
      o.joined = false;
      o.kicked = true;
      addEv('The orchestra board removed you from the roster after repeated low-level performances.', 'bad');
      flash('Removed from orchestra','bad');
    }
  }
  addEv(`${msg} ${payout>0?`Pay: ${fmt$(payout)}.`:''}`, type);
  flash(type==='bad'?'Rough performance':'Performance completed', type==='bad'?'bad':'good');
  orchestraPromoteIfReady();
  updateHUD();
  renderActivities();
}

function orchestraYearlyProgress(){
  ensureClubState();
  const o = G.clubs.orchestra;
  if(!o.joined || o.kicked) return;
  o.years += 1;
  o.rep = clamp((o.rep||20) + rnd(1,4));
  if(Math.random()<0.08){
    o.rep = clamp((o.rep||20) - rnd(2,5));
    addEv('A stricter conductor this season raised standards across the orchestra.', 'warn');
  }
  orchestraPromoteIfReady();
}

function renderClubActivitiesCard(){
  ensureClubState();
  const grid = document.getElementById('activities-grid');
  if(!grid || !grid.parentElement) return;
  let clubsCard = document.getElementById('clubs-card');
  if(!clubsCard){
    clubsCard = document.createElement('div');
    clubsCard.id = 'clubs-card';
    clubsCard.className = 'card';
    grid.parentElement.appendChild(clubsCard);
  }
  const o = G.clubs.orchestra;
  const rankLabel = orchestraRankMeta(o.rank).label;
  const skill = o.instrument ? instrumentSkillById(o.instrument) : 0;
  clubsCard.innerHTML = `
    <div class="card-title">Clubs</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">
      Orchestra is now available. Audition with your best instrument and climb the ranks over years.
    </div>
    <div class="choice-grid">
      <div class="choice" onclick="orchestraAudition()">
        <div class="choice-icon">🎻</div>
        <div class="choice-name">${o.joined?'Re-Audition / Chair Check':'Orchestra Audition'}</div>
        <div class="choice-desc">${o.joined?`Current: ${rankLabel} · ${o.instrument} ${skill}`:'Requires instrument skill'}</div>
      </div>
      <div class="choice${o.joined?'':' disabled'}" onclick="${o.joined?'orchestraPractice()':''}">
        <div class="choice-icon">🎼</div>
        <div class="choice-name">Orchestra Practice</div>
        <div class="choice-desc">${o.joined?`Rehearsals ${o.rehearsals} · Rep ${o.rep}`:'Join orchestra first'}</div>
      </div>
      <div class="choice${o.joined?'':' disabled'}" onclick="${o.joined?'orchestraPerformance(\'civic\')':''}">
        <div class="choice-icon">🏛️</div>
        <div class="choice-name">Civic Arts Performance</div>
        <div class="choice-desc">Mid prestige · scenario-based result</div>
      </div>
      <div class="choice${o.joined?'':' disabled'}" onclick="${o.joined?'orchestraPerformance(\'metro\')':''}">
        <div class="choice-icon">🏟️</div>
        <div class="choice-name">Metropolitan Hall Performance</div>
        <div class="choice-desc">High prestige · higher rewards/risk</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:.74rem;color:var(--muted2)">
      ${o.joined?`Rank: ${rankLabel} · Years: ${o.years} · Performances: ${o.performances} · Awards: ${o.awards}${o.kicked?' · Status: Removed':''}`:'Not currently in orchestra.'}
    </div>
  `;
}

// ── TRAVEL ────────────────────────────────────────────────────
function openTravelPlanner(){
  if(G.age<16){ flash('You are too young to travel solo.','warn'); return; }
  const locOptions = TRAVEL_LOCATIONS.map((l,i)=>`<option value="${i}">${l.name} · ${l.country}</option>`).join('');
  const classOptions = TRAVEL_CLASSES.map(c=>`<option value="${c.id}">${c.label} (${c.desc})</option>`).join('');

  const companionOptions = getTravelCompanionOptions().map(o=>`<option value="${o.id}">${o.label}</option>`).join('');

  const html = `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div>
        <div style="font-size:.72rem;color:var(--muted2);margin-bottom:4px">Destination</div>
        <select id="travel-location" class="name-input" style="width:100%">${locOptions}</select>
      </div>
      <div>
        <div style="font-size:.72rem;color:var(--muted2);margin-bottom:4px">Flight Class</div>
        <select id="travel-class" class="name-input" style="width:100%">${classOptions}</select>
      </div>
      <div>
        <div style="font-size:.72rem;color:var(--muted2);margin-bottom:4px">Who’s Going</div>
        <select id="travel-companion" class="name-input" style="width:100%">${companionOptions}</select>
      </div>
      <div style="font-size:.72rem;color:var(--muted2)">Cost is based on destination, class, and party size.</div>
    </div>`;

  showPopupHTML('✈️ Plan a Trip', html, [
    { label:'Cancel', cls:'btn-ghost', onClick:()=>{} },
    { label:'Book Trip', cls:'btn-primary', onClick:()=>confirmTravel() },
  ], 'dark');
}

function getTravelCompanionOptions(){
  const opts = [{ id:'solo', label:'Solo', mult:1 }];
  if(G.spouse) opts.push({ id:'spouse', label:`With ${G.spouse.firstName}`, mult:1.7 });
  if(G.lovers && G.lovers.length){
    const lover = G.lovers[0];
    opts.push({ id:`lover:${lover.name}`, label:`With ${lover.firstName}`, mult:1.7 });
  }
  const friends = (G.friends||[]).filter(f=>f.alive);
  friends.slice(0,5).forEach(f=>{
    opts.push({ id:`friend:${f.name}`, label:`With ${f.firstName}`, mult:1.6 });
  });
  if((G.children||[]).some(c=>c.alive) && G.spouse){
    opts.push({ id:'family', label:'With Family', mult:2.6 });
  }
  return opts;
}

function confirmTravel(){
  const locIdx = parseInt(document.getElementById('travel-location')?.value||'0',10);
  const classId = document.getElementById('travel-class')?.value||'economy';
  const compId = document.getElementById('travel-companion')?.value||'solo';

  const loc = TRAVEL_LOCATIONS[locIdx];
  const cls = TRAVEL_CLASSES.find(c=>c.id===classId) || TRAVEL_CLASSES[0];
  const comp = getTravelCompanionOptions().find(o=>o.id===compId) || { id:'solo', label:'Solo', mult:1 };

  const base = loc.baseCost || 1200;
  const cost = Math.round(base * cls.costMult * comp.mult);

  if(G.money < cost){
    flash(`Need ${fmt$(cost)} for this trip.`, 'warn');
    return;
  }

  G.money -= cost;
  const luxury = (cls.luxury||0) + (loc.luxury||0);

  // Base stat impact
  G.happy = clamp(G.happy + rnd(10,18) + luxury*2);
  G.smarts = clamp(G.smarts + rnd(0,4) + (loc.culture||0));
  G.health = clamp(G.health + rnd(-4,4) + (cls.luxury>=2?2:0));
  G.looks = clamp(G.looks + (cls.luxury>=2?rnd(1,4):0));
  G.stress = clamp((G.stress||35) - rnd(5,12) - luxury);

  // Events
  const general = pick(TRAVEL_GENERAL_EVENTS);
  applyTravelEvent(general);
  const local = pick(loc.events||[]);
  if(local) applyTravelEvent(local);

  // Luxury visibility
  if(luxury>=3 && G.sm?.totalFame>=10){
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
    addEv('Luxury travel photos popped off online. Your fame ticked up.','good');
  }

  // Relationship effects
  if(comp.id!=='solo'){
    const relDelta = rnd(3,8);
    bumpTravelRelationship(comp.id, relDelta);
    if(Math.random()<0.15){
      bumpTravelRelationship(comp.id, -rnd(4,8));
      addEv('Travel stress caused a little tension. You smoothed it over later.','warn');
    }
  }

  // Log
  if(!G.travel.visited.includes(loc.name)) G.travel.visited.push(loc.name);
  G.travel.log.unshift({
    age:G.age, location:`${loc.name}, ${loc.country}`, class:cls.label, companion:comp.label, cost
  });
  if(G.travel.log.length>50) G.travel.log.pop();

  addEv(`Trip to ${loc.name}, ${loc.country}. Class: ${cls.label}. Cost: ${fmt$(cost)}.`, 'good');
  flash(`✈️ Traveled to ${loc.name}!`,'good');
  updateHUD();
  switchTab('life');
}

function applyTravelEvent(ev){
  if(!ev) return;
  if(ev.happy)  G.happy = clamp(G.happy + rnd(ev.happy[0], ev.happy[1]));
  if(ev.smarts) G.smarts = clamp(G.smarts + rnd(ev.smarts[0], ev.smarts[1]));
  if(ev.health) G.health = clamp(G.health + rnd(ev.health[0], ev.health[1]));
  if(ev.looks)  G.looks = clamp(G.looks + rnd(ev.looks[0], ev.looks[1]));
  if(ev.money)  G.money += rnd(ev.money[0], ev.money[1]);
  if(ev.happy && ev.happy[1]>0){
    G.stress = clamp((G.stress||35) - rnd(1,4));
  }
  addEv(ev.msg,'good');
}

function bumpTravelRelationship(compId, delta){
  if(compId==='spouse' && G.spouse){
    G.spouse.relation = clamp((G.spouse.relation||70) + delta);
    return;
  }
  if(compId==='family' && G.spouse){
    G.spouse.relation = clamp((G.spouse.relation||70) + Math.floor(delta*0.6));
    (G.children||[]).forEach(c=>{ if(c.alive) c.relation = clamp((c.relation||60)+Math.floor(delta*0.4)); });
    return;
  }
  if(compId.startsWith('lover:')){
    const name = compId.split('lover:')[1];
    const p = (G.lovers||[]).find(x=>x.name===name);
    if(p) p.relation = clamp((p.relation||70)+delta);
    return;
  }
  if(compId.startsWith('friend:')){
    const name = compId.split('friend:')[1];
    const f = (G.friends||[]).find(x=>x.name===name);
    if(f) f.relation = clamp((f.relation||60)+delta);
  }
}

// ── CRIME ─────────────────────────────────────────────────────
function heatPhase(h){
  const idx = Math.min(9, Math.max(0, Math.floor(h/10)));
  return HEAT_PHASES[idx];
}
