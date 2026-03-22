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
  { id:1, label:'Rookie', minRep:0 },
  { id:2, label:'Street Runner', minRep:55 },
  { id:3, label:'Circuit Predator', minRep:120 },
  { id:4, label:'Underground Icon', minRep:220 },
  { id:5, label:'City Legend', minRep:340 },
];

const STREET_RACING_CARS = [
  { id:'hatch_starter', name:'Raptor S Hatch', class:'D', price:8500, power:34, accel:37, grip:38, handling:36, reliability:66 },
  { id:'old_muscle', name:'Ironbolt 78', class:'D', price:11000, power:45, accel:43, grip:28, handling:31, reliability:54 },
  { id:'turbo_compact', name:'VX Turbo Compact', class:'C', price:22000, power:56, accel:53, grip:52, handling:50, reliability:60 },
  { id:'awd_sedan', name:'Falcon AWD GT', class:'C', price:30000, power:63, accel:57, grip:58, handling:56, reliability:70 },
  { id:'drift_coupe', name:'Nightshade Coupe', class:'B', price:52000, power:74, accel:67, grip:65, handling:68, reliability:59 },
  { id:'track_r', name:'Apex R Track', class:'B', price:76000, power:82, accel:76, grip:78, handling:79, reliability:74 },
  { id:'super_gt', name:'Nova Super GT', class:'A', price:145000, power:96, accel:90, grip:86, handling:85, reliability:67 },
  { id:'hyper_x', name:'Hyperion X', class:'S', price:320000, power:112, accel:105, grip:95, handling:94, reliability:72 },
];

// Three distinct 2D race maps of increasing difficulty.
const STREET_RACING_TRACKS = [
  {
    id:'harbor_oval',
    name:'Liberty Bowl Speedway',
    reqLevel:1,
    difficulty:1,
    entry:[300,1200],
    payout:[1800,5600],
    hazard:9,
    laps:4,
    width:40,
    lengthKm:4.2,
    theme:{ bg:'#0a1322', road:'#243449', line:'#71d5ff', venueA:'#991b1b', venueB:'#1d4ed8' },
    path:[
      [110,118],[248,96],[386,86],[534,102],[620,150],[654,236],[628,322],[552,382],
      [484,430],[414,450],[334,430],[270,386],[236,330],[188,318],[132,342],[86,404],
      [44,338],[38,246],[58,168]
    ],
  },
  {
    id:'neon_chicane',
    name:'Neon Chicane Circuit',
    reqLevel:2,
    difficulty:2,
    entry:[900,2600],
    payout:[5200,14600],
    hazard:18,
    laps:3,
    width:34,
    lengthKm:5.6,
    theme:{ bg:'#140d1f', road:'#372047', line:'#ff6af4', venueA:'#7e22ce', venueB:'#1d4ed8' },
    path:[
      [78,110],[152,88],[248,82],[344,102],[430,142],[498,116],[570,96],[632,132],[662,206],
      [624,262],[566,286],[594,340],[650,396],[606,444],[524,456],[448,430],[382,392],[330,438],
      [252,472],[172,452],[106,414],[72,352],[50,284],[56,216]
    ],
  },
  {
    id:'mountain_serpent',
    name:'Mountain Serpent',
    reqLevel:3,
    difficulty:3,
    entry:[2500,6800],
    payout:[14000,38000],
    hazard:31,
    laps:2,
    width:29,
    lengthKm:8.4,
    theme:{ bg:'#0e1a14', road:'#2d3c33', line:'#9cff7b', venueA:'#166534', venueB:'#1e3a8a' },
    path:[
      [84,442],[144,394],[122,350],[96,304],[128,264],[178,232],[150,194],[170,154],[240,122],
      [316,96],[386,114],[430,150],[484,130],[552,98],[620,136],[654,186],[640,240],[602,278],
      [624,332],[666,386],[620,438],[560,452],[500,424],[450,392],[412,432],[362,468],[298,448],
      [242,474],[188,456],[146,420]
    ],
  },
];

const STREET_RACING_MODS = [
  { id:'ecu', name:'ECU Tune', minCost:1200, maxCost:6800, effect:{ power:[4,12], accel:[2,6] }, relHit:[1,4], desc:'More power and response, mild reliability hit.' },
  { id:'tires', name:'Semi-Slick Tires', minCost:900, maxCost:5500, effect:{ grip:[5,13], handling:[2,5] }, relHit:[0,2], desc:'Large grip boost and improved cornering feel.' },
  { id:'suspension', name:'Coilover Suspension', minCost:1400, maxCost:7200, effect:{ handling:[4,11], grip:[1,4] }, relHit:[1,3], desc:'Sharper turn-in and balance through corners.' },
  { id:'weight', name:'Weight Reduction', minCost:1600, maxCost:9800, effect:{ accel:[4,10], handling:[3,8] }, relHit:[3,8], desc:'Faster and lighter, but more fragile.' },
  { id:'turbo', name:'Turbo Upgrade', minCost:3000, maxCost:16000, effect:{ power:[8,18], accel:[5,12] }, relHit:[4,10], desc:'Big top-end and acceleration jump.' },
  { id:'brakes', name:'Track Brake Kit', minCost:1200, maxCost:7600, effect:{ handling:[3,8], grip:[2,6] }, relHit:[0,2], desc:'More stable late braking and transitions.' },
  { id:'nitrous', name:'Nitrous Shot', minCost:1800, maxCost:9200, effect:{ power:[6,15], accel:[4,11] }, relHit:[5,12], desc:'Huge short-burst speed at reliability risk.' },
  { id:'aero', name:'Aero Package', minCost:2000, maxCost:10500, effect:{ handling:[4,10], grip:[3,8] }, relHit:[1,4], desc:'Adds high-speed control and downforce.' },
];

const STREET_RACE_RUNTIME = {
  active:false,
  finished:false,
  raf:0,
  keys:{},
  onKeyDown:null,
  onKeyUp:null,
  opponents:[],
  cautionUntil:0,
  cautionReason:'',
  contactHits:0,
};

function streetRaceClampStat(v, min=0, max=160){
  return Math.max(min, Math.min(max, Math.round(v)));
}

function streetRaceTrackById(id){
  return STREET_RACING_TRACKS.find(t=>t.id===id) || STREET_RACING_TRACKS[0];
}

function streetRaceCarMetaByModelId(modelId){
  return STREET_RACING_CARS.find(c=>c.id===modelId) || STREET_RACING_CARS[0];
}

function streetRacingRecomputeCarValue(car){
  const base = Math.max(1200, car.basePrice||car.value||5000);
  const ageYears = Math.max(0, (G.age||0) - (car.purchasedAge||G.age||0));
  const agePenalty = Math.min(0.62, ageYears*0.11);
  const mileagePenalty = Math.min(0.48, (car.mileage||0)/180000);
  const damagePenalty = Math.min(0.55, (car.damage||0)*0.008);
  const relBonus = ((car.reliability||50)-50)/240;
  const modBonus = (car.modBonuses?.power||0)*120 + (car.modBonuses?.accel||0)*115 + (car.modBonuses?.grip||0)*90 + (car.modBonuses?.handling||0)*95;
  const mult = Math.max(0.12, 1 - agePenalty - mileagePenalty - damagePenalty + relBonus);
  car.value = Math.max(900, Math.floor(base*mult + modBonus));
  return car.value;
}

function streetRacingNormalizeCar(car, idx, r){
  const modelId = car.modelId || car.baseId || car.id || STREET_RACING_CARS[0].id;
  const meta = streetRaceCarMetaByModelId(modelId);
  if(typeof r.nextCarUid!=='number') r.nextCarUid = 1;
  const uid = typeof car.uid==='string' && car.uid ? car.uid : `car_${modelId}_${r.nextCarUid++}`;
  const normalized = {
    uid,
    modelId,
    name:car.name || meta.name,
    class:car.class || meta.class,
    power:streetRaceClampStat(car.power ?? meta.power),
    accel:streetRaceClampStat(car.accel ?? car.power ?? meta.accel),
    grip:streetRaceClampStat(car.grip ?? meta.grip),
    handling:streetRaceClampStat(car.handling ?? Math.floor(((car.power ?? meta.power)+(car.grip ?? meta.grip))/2)),
    reliability:streetRaceClampStat(car.reliability ?? meta.reliability, 6, 120),
    mods:Array.isArray(car.mods)?car.mods:[],
    modBonuses:{
      power:streetRaceClampStat(car.modBonuses?.power||0, -99, 99),
      accel:streetRaceClampStat(car.modBonuses?.accel||0, -99, 99),
      grip:streetRaceClampStat(car.modBonuses?.grip||0, -99, 99),
      handling:streetRaceClampStat(car.modBonuses?.handling||0, -99, 99),
      reliabilityLoss:streetRaceClampStat(car.modBonuses?.reliabilityLoss||0, -99, 99),
    },
    value:Math.max(900, Math.floor(car.value ?? meta.price)),
    basePrice:Math.max(1000, Math.floor(car.basePrice ?? meta.price)),
    mileage:Math.max(0, Math.floor(car.mileage||0)),
    damage:streetRaceClampStat(car.damage||0, 0, 100),
    purchasedAge:typeof car.purchasedAge==='number' ? car.purchasedAge : (G.age||0),
    races:Math.max(0, Math.floor(car.races||0)),
    wins:Math.max(0, Math.floor(car.wins||0)),
  };
  streetRacingRecomputeCarValue(normalized);
  return normalized;
}

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
      losses:0,
      podiums:0,
      crashes:0,
      fines:0,
      totalPrize:0,
      maxTrackUnlocked:1,
      nextCarUid:1,
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
  if(typeof r.losses!=='number') r.losses = 0;
  if(typeof r.podiums!=='number') r.podiums = 0;
  if(typeof r.crashes!=='number') r.crashes = 0;
  if(typeof r.fines!=='number') r.fines = 0;
  if(typeof r.totalPrize!=='number') r.totalPrize = 0;
  if(typeof r.maxTrackUnlocked!=='number') r.maxTrackUnlocked = 1;
  if(typeof r.nextCarUid!=='number') r.nextCarUid = 1;
  r.garage = r.garage.map((car,idx)=>streetRacingNormalizeCar(car, idx, r));
  if(!r.garage.length){
    const starter = streetRacingNormalizeCar({
      uid:`car_${STREET_RACING_CARS[0].id}_${r.nextCarUid++}`,
      modelId:STREET_RACING_CARS[0].id,
      name:STREET_RACING_CARS[0].name,
      class:STREET_RACING_CARS[0].class,
      power:STREET_RACING_CARS[0].power,
      accel:STREET_RACING_CARS[0].accel,
      grip:STREET_RACING_CARS[0].grip,
      handling:STREET_RACING_CARS[0].handling,
      reliability:STREET_RACING_CARS[0].reliability,
      value:STREET_RACING_CARS[0].price,
      basePrice:STREET_RACING_CARS[0].price,
      purchasedAge:G.age||0,
    }, 0, r);
    r.garage.push(starter);
    r.activeCarId = starter.uid;
  }
  if(!r.activeCarId || !r.garage.some(c=>c.uid===r.activeCarId)){
    r.activeCarId = r.garage[0].uid;
  }
}

function streetCarById(uid){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  return r.garage.find(c=>c.uid===uid) || r.garage.find(c=>c.modelId===uid || c.uid===uid) || null;
}

function activeStreetCar(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  return streetCarById(r.activeCarId) || r.garage[0] || null;
}

function streetRacingCarModSummary(car){
  const m = car?.modBonuses||{};
  const parts = [];
  if((m.power||0)!==0) parts.push(`P ${m.power>=0?'+':''}${m.power}`);
  if((m.accel||0)!==0) parts.push(`A ${m.accel>=0?'+':''}${m.accel}`);
  if((m.grip||0)!==0) parts.push(`G ${m.grip>=0?'+':''}${m.grip}`);
  if((m.handling||0)!==0) parts.push(`H ${m.handling>=0?'+':''}${m.handling}`);
  if((m.reliabilityLoss||0)!==0) parts.push(`R -${m.reliabilityLoss}`);
  return parts.length ? parts.join(' · ') : 'No mods';
}

function streetRacingRecalcLevel(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  let lvl = 1;
  STREET_RACING_LEVELS.forEach(l=>{ if(r.rep>=l.minRep) lvl = l.id; });
  if(lvl>r.level){
    r.level = lvl;
    addEv(`Street racing level up: ${STREET_RACING_LEVELS[lvl-1].label}.`, 'love');
    flash(`🏁 Level ${lvl} unlocked`,'good');
  }
}

function streetRacingOpenGarage(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const rows = r.garage.map(c=>{
    const active = c.uid===r.activeCarId;
    const repairCost = Math.max(250, Math.floor(300 + (c.damage||0)*90 + (100-(c.reliability||50))*35));
    const sellValue = Math.max(600, Math.floor((c.value||0) * (1 - (c.damage||0)/180)));
    const ageYears = Math.max(0, (G.age||0) - (c.purchasedAge||G.age||0));
    return `
      <div style="border:1px solid var(--border);border-radius:10px;padding:8px;margin-bottom:8px;background:var(--surface2)">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
          <div style="font-weight:700">${active?'✅ ':''}${c.name} · Class ${c.class}</div>
          <div style="font-size:.75rem;color:var(--muted2)">Value ${fmt$(c.value||0)}</div>
        </div>
        <div style="font-size:.74rem;color:var(--muted2);margin:4px 0 7px">
          P ${c.power} · A ${c.accel} · G ${c.grip} · H ${c.handling} · R ${c.reliability} · Damage ${c.damage||0}%
          <br>Mileage ${(c.mileage||0).toLocaleString()} km · Owned ${ageYears}y · Mods: ${streetRacingCarModSummary(c)}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          <button class="btn ${active?'btn-primary':'btn-ghost'}" onclick="streetRacingSetActiveCar('${c.uid}')">${active?'Active':'Set Active'}</button>
          <button class="btn btn-ghost" onclick="streetRacingRepairCar('${c.uid}')">Repair (${fmt$(repairCost)})</button>
          <button class="btn btn-ghost" onclick="streetRacingSellCar('${c.uid}')">Sell (${fmt$(sellValue)})</button>
        </div>
      </div>`;
  }).join('') || '<div style="font-size:.78rem;color:var(--muted2)">Garage is empty.</div>';
  showPopupHTML('Street Garage', `<div style="max-height:58vh;overflow:auto;padding-right:4px">${rows}</div>`, [
    { label:'Close', cls:'btn-primary', onClick:()=>{} },
  ], 'dark');
}

function streetRacingSetActiveCar(uid){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const car = streetCarById(uid);
  if(!car){ flash('Car not found.','warn'); return; }
  r.activeCarId = car.uid;
  flash(`${car.name} is now active.`,'good');
  streetRacingOpenGarage();
  renderStreetRacingCard();
}

function streetRacingRepairCar(uid){
  ensureStreetRacingState();
  const car = streetCarById(uid);
  if(!car){ flash('Car not found.','warn'); return; }
  const cost = Math.max(250, Math.floor(300 + (car.damage||0)*90 + (100-(car.reliability||50))*35));
  if((G.money||0)<cost){
    flash(`Need ${fmt$(cost)} for repairs.`,'warn');
    return;
  }
  G.money -= cost;
  car.damage = Math.max(0, (car.damage||0) - rnd(35,70));
  car.reliability = streetRaceClampStat((car.reliability||50) + rnd(12,24), 6, 120);
  streetRacingRecomputeCarValue(car);
  addEv(`Repaired ${car.name} for ${fmt$(cost)}.`, 'good');
  flash('Car repaired','good');
  streetRacingOpenGarage();
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingSellCar(uid){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const idx = r.garage.findIndex(c=>c.uid===uid);
  if(idx<0){ flash('Car not found.','warn'); return; }
  const car = r.garage[idx];
  const sale = Math.max(600, Math.floor((car.value||0) * (1 - (car.damage||0)/180)));
  G.money += sale;
  r.garage.splice(idx,1);
  if(!r.garage.length){
    r.activeCarId = '';
  } else if(r.activeCarId===uid){
    r.activeCarId = r.garage[0].uid;
  }
  addEv(`Sold ${car.name} for ${fmt$(sale)}.`, 'warn');
  flash(`Sold for ${fmt$(sale)}`,'good');
  streetRacingOpenGarage();
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingBuyCar(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const ownedByModel = new Set(r.garage.map(c=>c.modelId));
  const market = STREET_RACING_CARS.filter(c=>!ownedByModel.has(c.id));
  if(!market.length){
    flash('You already own all available models.','warn');
    return;
  }
  showPopup(
    'Street Racing Market',
    'Choose a car to add to your garage.',
    market.slice(0,8).map(c=>({
      label:`${c.name} · ${c.class} · ${fmt$(c.price)} · P${c.power} A${c.accel} G${c.grip} H${c.handling} R${c.reliability}`,
      cls:'btn-ghost',
      onClick:()=>streetRacingConfirmBuy(c.id),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRacingConfirmBuy(modelId){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const meta = streetRaceCarMetaByModelId(modelId);
  if((G.money||0) < meta.price){
    flash(`Need ${fmt$(meta.price)} to buy ${meta.name}.`,'warn');
    return;
  }
  G.money -= meta.price;
  const car = streetRacingNormalizeCar({
    uid:`car_${meta.id}_${r.nextCarUid++}`,
    modelId:meta.id,
    name:meta.name,
    class:meta.class,
    power:meta.power,
    accel:meta.accel,
    grip:meta.grip,
    handling:meta.handling,
    reliability:meta.reliability,
    value:meta.price,
    basePrice:meta.price,
    purchasedAge:G.age||0,
  }, r.garage.length, r);
  r.garage.push(car);
  r.activeCarId = car.uid;
  addEv(`Bought ${car.name} for ${fmt$(meta.price)}.`, 'good');
  flash(`New car: ${car.name}`,'good');
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingModEffectLabel(mod){
  const parts = [];
  Object.keys(mod.effect||{}).forEach(k=>{
    const range = mod.effect[k];
    parts.push(`+${k[0].toUpperCase()}${k.slice(1)} ${range[0]}-${range[1]}`);
  });
  parts.push(`-Reliability ${mod.relHit[0]}-${mod.relHit[1]}`);
  return parts.join(' · ');
}

function streetRacingOpenMods(){
  ensureStreetRacingState();
  const car = activeStreetCar();
  if(!car){ flash('No active race car selected.','warn'); return; }
  showPopup(
    `${car.name} Mod Shop`,
    'Pick a mod package. Each mod now clearly shows stat effects.',
    STREET_RACING_MODS.map(m=>({
      label:`${m.name} · ${fmt$(m.minCost)}-${fmt$(m.maxCost)} · ${streetRacingModEffectLabel(m)}`,
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
  const r = G.activities.streetRacing;
  if(!mod || !car) return;
  const cost = rnd(mod.minCost, mod.maxCost);
  if((G.money||0)<cost){
    flash(`Need ${fmt$(cost)} for ${mod.name}.`,'warn');
    return;
  }
  G.money -= cost;
  const effectRoll = {};
  Object.keys(mod.effect||{}).forEach(k=>{
    const range = mod.effect[k];
    effectRoll[k] = rnd(range[0], range[1]);
  });
  const relLoss = rnd(mod.relHit[0], mod.relHit[1]);
  car.power = streetRaceClampStat((car.power||0) + (effectRoll.power||0));
  car.accel = streetRaceClampStat((car.accel||0) + (effectRoll.accel||0));
  car.grip = streetRaceClampStat((car.grip||0) + (effectRoll.grip||0));
  car.handling = streetRaceClampStat((car.handling||0) + (effectRoll.handling||0));
  car.reliability = streetRaceClampStat((car.reliability||0) - relLoss, 6, 120);
  if(!car.modBonuses) car.modBonuses = { power:0, accel:0, grip:0, handling:0, reliabilityLoss:0 };
  car.modBonuses.power += effectRoll.power||0;
  car.modBonuses.accel += effectRoll.accel||0;
  car.modBonuses.grip += effectRoll.grip||0;
  car.modBonuses.handling += effectRoll.handling||0;
  car.modBonuses.reliabilityLoss += relLoss;
  car.mods.push({ id:mod.id, name:mod.name, effects:effectRoll, relLoss, cost, age:G.age||0 });
  if(car.mods.length>14) car.mods.shift();
  r.skill = clamp((r.skill||18) + rnd(1,3));
  streetRacingRecomputeCarValue(car);
  addEv(`Installed ${mod.name} on ${car.name} for ${fmt$(cost)} (${streetRacingModEffectLabel(mod)}).`, 'good');
  flash(`Mod installed: ${mod.name}`,'good');
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingOpenTrack(){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const unlocked = STREET_RACING_TRACKS.filter(t=>t.reqLevel<=r.level);
  if(!unlocked.length){
    flash('No tracks unlocked yet. Earn more rep first.','warn');
    return;
  }
  showPopup(
    '2D Race Tracks',
    'Launch an actual playable race map. Arrow keys or WASD to drive.',
    unlocked.map(t=>({
      label:`${t.name} · Difficulty ${t.difficulty} · Laps ${t.laps} · Entry ${fmt$(t.entry[0])}-${fmt$(t.entry[1])}`,
      cls:'btn-ghost',
      onClick:()=>streetRacingLaunchMiniRace(t.id),
    })).concat([{ label:'Cancel', cls:'btn-primary', onClick:()=>{} }]),
    'normal'
  );
}

function streetRaceBuildPathMetrics(points){
  const segs = [];
  let total = 0;
  for(let i=0;i<points.length;i++){
    const a = points[i];
    const b = points[(i+1)%points.length];
    const dx = b[0]-a[0];
    const dy = b[1]-a[1];
    const len = Math.hypot(dx,dy) || 1;
    segs.push({ ax:a[0], ay:a[1], bx:b[0], by:b[1], dx, dy, len, cum:total });
    total += len;
  }
  return { points, segs, total:Math.max(1,total) };
}

function streetRaceProjectToPath(x, y, metrics){
  let best = null;
  metrics.segs.forEach(s=>{
    const vx = x - s.ax;
    const vy = y - s.ay;
    const t = Math.max(0, Math.min(1, (vx*s.dx + vy*s.dy) / (s.len*s.len)));
    const px = s.ax + s.dx*t;
    const py = s.ay + s.dy*t;
    const dist = Math.hypot(x-px, y-py);
    if(!best || dist<best.dist){
      best = { dist, px, py, seg:s, t, progress:s.cum + s.len*t };
    }
  });
  return best;
}

function streetRacePointAtDistance(metrics, d){
  const wrapped = ((d%metrics.total)+metrics.total)%metrics.total;
  const seg = metrics.segs.find(s=>wrapped>=s.cum && wrapped<=s.cum+s.len) || metrics.segs[0];
  const t = Math.max(0, Math.min(1, (wrapped-seg.cum)/seg.len));
  return { x:seg.ax + seg.dx*t, y:seg.ay + seg.dy*t, angle:Math.atan2(seg.dy, seg.dx) };
}

function streetRaceTimeFmt(ms){
  const sec = Math.max(0, Math.floor(ms/1000));
  const m = Math.floor(sec/60);
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

function streetRaceDrawCar(ctx, x, y, angle, color, label){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-11,-7,22,14);
  ctx.fillStyle = '#dbeafe';
  ctx.fillRect(0,-5,8,10);
  ctx.fillStyle = '#0b0f17';
  ctx.fillRect(-9,-6,3,3);
  ctx.fillRect(-9,3,3,3);
  ctx.fillRect(6,-6,3,3);
  ctx.fillRect(6,3,3,3);
  ctx.restore();
  if(label){
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '11px system-ui';
    ctx.fillText(label, x-10, y-12);
  }
}

function streetRaceDrawAmericanStadium(ctx, canvas){
  ctx.fillStyle = 'rgba(17,24,39,0.96)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // Crowd bowl with layered stands.
  ctx.fillStyle = 'rgba(30,41,59,0.68)';
  ctx.fillRect(6,6,canvas.width-12,canvas.height-12);
  ctx.fillStyle = 'rgba(15,23,42,0.88)';
  ctx.fillRect(18,18,canvas.width-36,canvas.height-36);
  // Seating stripe pattern.
  for(let y=22; y<74; y+=6){
    ctx.fillStyle = (y%12===0) ? 'rgba(220,38,38,0.26)' : 'rgba(37,99,235,0.22)';
    ctx.fillRect(20,y,canvas.width-40,3);
  }
  for(let y=canvas.height-76; y<canvas.height-22; y+=6){
    ctx.fillStyle = (y%12===0) ? 'rgba(220,38,38,0.22)' : 'rgba(37,99,235,0.20)';
    ctx.fillRect(20,y,canvas.width-40,3);
  }
  ctx.fillStyle = 'rgba(191,24,32,0.22)';
  ctx.fillRect(12,12,canvas.width-24,36);
  ctx.fillStyle = 'rgba(30,64,175,0.2)';
  ctx.fillRect(12,canvas.height-48,canvas.width-24,36);
  ctx.strokeStyle = 'rgba(226,232,240,0.3)';
  ctx.lineWidth = 2;
  const poles = 10;
  for(let i=0;i<poles;i++){
    const t = (i/poles) * Math.PI * 2;
    const cx = canvas.width/2 + Math.cos(t)*(canvas.width*0.46);
    const cy = canvas.height/2 + Math.sin(t)*(canvas.height*0.40);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy-16);
    ctx.stroke();
    ctx.fillStyle = 'rgba(253,224,71,0.52)';
    ctx.beginPath();
    ctx.arc(cx, cy-18, 3, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(canvas.width*0.34, canvas.height*0.47, canvas.width*0.32, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('AMERICAN STREET SERIES', canvas.width*0.37, canvas.height*0.465);
  // Flag pennants.
  for(let x=28; x<canvas.width-28; x+=52){
    ctx.fillStyle = 'rgba(248,250,252,0.72)';
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x+12, 16);
    ctx.lineTo(x, 20);
    ctx.closePath();
    ctx.fill();
  }
}

function streetRaceApplyBarrierCollision(entity, track, proj){
  const barrierLimit = track.width * 0.60;
  if(proj.dist <= barrierLimit) return false;
  const nx = entity.x - proj.px;
  const ny = entity.y - proj.py;
  const nLen = Math.hypot(nx, ny) || 1;
  const ux = nx / nLen;
  const uy = ny / nLen;
  entity.x = proj.px + ux * barrierLimit;
  entity.y = proj.py + uy * barrierLimit;
  entity.speed = -Math.abs(entity.speed) * 0.34;
  return true;
}

function streetRacingDrawMiniRace(runtime){
  const { ctx, canvas, track, path } = runtime;
  const theme = track.theme||{ bg:'#111827', road:'#374151', line:'#a7f3d0' };
  streetRaceDrawAmericanStadium(ctx, canvas);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = track.width + 12;
  ctx.beginPath();
  path.points.forEach((p,idx)=>{
    if(idx===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.setLineDash([6,4]);
  ctx.beginPath();
  path.points.forEach((p,idx)=>{
    if(idx===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = theme.road;
  ctx.lineWidth = track.width;
  ctx.beginPath();
  path.points.forEach((p,idx)=>{
    if(idx===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 2;
  ctx.setLineDash([8,8]);
  ctx.beginPath();
  path.points.forEach((p,idx)=>{
    if(idx===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  const startA = path.points[0];
  const startB = path.points[1];
  const ang = Math.atan2(startB[1]-startA[1], startB[0]-startA[0]) + Math.PI/2;
  ctx.save();
  ctx.translate(startA[0], startA[1]);
  ctx.rotate(ang);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-track.width*0.45, -3, track.width*0.9, 6);
  ctx.restore();

  (runtime.opponents||[]).forEach((op, idx)=>{
    streetRaceDrawCar(ctx, op.x, op.y, op.angle, op.color||'#ef4444', `R${idx+1}`);
  });
  streetRaceDrawCar(ctx, runtime.player.x, runtime.player.y, runtime.player.angle, '#60a5fa', 'You');
}

function streetRacingMiniRaceCleanup(){
  const rt = STREET_RACE_RUNTIME;
  if(rt.raf) cancelAnimationFrame(rt.raf);
  rt.raf = 0;
  if(rt.onKeyDown) window.removeEventListener('keydown', rt.onKeyDown);
  if(rt.onKeyUp) window.removeEventListener('keyup', rt.onKeyUp);
  rt.onKeyDown = null;
  rt.onKeyUp = null;
  rt.keys = {};
  rt.active = false;
}

function streetRacingAbortMiniRace(){
  const rt = STREET_RACE_RUNTIME;
  if(!rt.active || rt.finished) return;
  rt.finished = true;
  streetRacingMiniRaceCleanup();
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  r.races += 1;
  r.losses += 1;
  r.rep = Math.max(0, r.rep - rnd(4,10));
  r.heat = clamp((r.heat||0) + rnd(2,6));
  addEv('You forfeited the race and took a reputation hit.', 'warn');
  flash('Race forfeited','warn');
  renderStreetRacingCard();
  updateHUD();
}

function streetRacingResolveMiniRace(track, entry, winner){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const car = activeStreetCar();
  if(!car) return;
  const rt = STREET_RACE_RUNTIME;
  const elapsedMs = Math.max(0, Math.floor(performance.now() - (rt.startTs||performance.now())));
  const qualMs = Math.max(0, Math.floor(rt.qualTime||0));
  const offTrackHits = Math.floor((rt.offTrackFrames||0)/16);
  r.races += 1;
  car.races = (car.races||0) + 1;
  car.mileage = Math.max(0, (car.mileage||0) + Math.floor(track.lengthKm*110) + Math.floor(elapsedMs/500));
  car.damage = streetRaceClampStat((car.damage||0) + Math.max(0, offTrackHits-rnd(0,3)), 0, 100);
  r.heat = clamp((r.heat||0) + rnd(1,6) + track.difficulty*2 + Math.floor(offTrackHits/2));

  let payout = 0;
  if(winner==='player'){
    payout = rnd(track.payout[0], track.payout[1]) + Math.floor((car.power+car.accel+car.grip+car.handling)/5);
    G.money += payout;
    r.totalPrize += payout;
    r.wins += 1;
    r.podiums += 1;
    car.wins = (car.wins||0) + 1;
    r.rep += rnd(12,22) + track.difficulty*4;
    r.skill = clamp((r.skill||18) + rnd(2,5));
    G.happy = clamp((G.happy||50) + rnd(5,11));
    G.stress = clamp((G.stress||35) - rnd(2,7));
    addEv(`2D race win at ${track.name}. Prize: ${fmt$(payout)}. Qualifying: ${streetRaceTimeFmt(qualMs)} · Race: ${streetRaceTimeFmt(elapsedMs)}.`, 'love');
    flash('🏁 You won the race!', 'good');
  } else {
    r.losses += 1;
    r.rep = Math.max(0, r.rep - rnd(3,9));
    r.skill = clamp((r.skill||18) + rnd(0,2));
    G.stress = clamp((G.stress||35) + rnd(2,8));
    if(Math.random()<0.28){
      const fine = rnd(900,5400);
      G.money = Math.max(0, (G.money||0) - fine);
      r.fines += fine;
      addEv(`Race loss at ${track.name}. Enforcement fine: ${fmt$(fine)}.`, 'bad');
    } else {
      addEv(`You lost at ${track.name}. Rival pace and errors cost the run.`, 'warn');
    }
    flash('Race lost', 'warn');
  }

  if((car.damage||0)>=72){
    const repair = Math.floor(2200 + car.damage*70);
    if((G.money||0)>=repair && Math.random()<0.6){
      G.money -= repair;
      car.damage = Math.max(10, (car.damage||0) - rnd(28,45));
      addEv(`Post-race repair on ${car.name}: ${fmt$(repair)}.`, 'warn');
    } else if(Math.random()<0.35){
      car.reliability = streetRaceClampStat((car.reliability||50) - rnd(5,11), 6, 120);
      addEv(`${car.name} remains battered. Reliability dropped.`, 'bad');
    }
  }

  streetRacingRecomputeCarValue(car);
  streetRacingRecalcLevel();
  renderStreetRacingCard();
  updateHUD();
}

function streetRaceLeaderboard(runtime){
  const racers = [{ key:'you', name:'You', lap:runtime.player.lap, prog:runtime.player.prevProgress }]
    .concat((runtime.opponents||[]).map((op, idx)=>({
      key:`op${idx}`, name:`R${idx+1}`, lap:op.lap, prog:op.progress,
    })));
  racers.sort((a,b)=>{
    if(a.lap!==b.lap) return b.lap - a.lap;
    return b.prog - a.prog;
  });
  return racers;
}

function streetRaceCalcQualiScore(car, track, isPlayer){
  const base =
    (car.power||40)*0.34 +
    (car.accel||40)*0.28 +
    (car.grip||40)*0.2 +
    (car.handling||40)*0.2 +
    (car.reliability||40)*0.08 -
    (track.difficulty||1)*4.2;
  const skillTerm = (G.activities?.streetRacing?.skill||18) * (isPlayer ? 0.95 : 0.75);
  return base + skillTerm + rnd(-18, 18) / 10;
}

function streetRaceApplyQualifyingGrid(rt, track, car){
  const path = rt.path;
  const playerQuali = streetRaceCalcQualiScore(car, track, true);
  const quali = [{ id:'you', score:playerQuali }]
    .concat((rt.opponents||[]).map((op, idx)=>({
      id:op.id,
      score:streetRaceCalcQualiScore(car, track, false) - idx*0.8 + rnd(-12,12)/10,
    })));
  quali.sort((a,b)=>b.score-a.score);
  rt.qualiOrder = quali.map(q=>q.id);
  rt.playerGrid = rt.qualiOrder.indexOf('you') + 1;
  rt.qualTime = Math.max(36000, Math.floor(98000 - playerQuali*380));
}

function streetRacingMiniRaceLoop(){
  const rt = STREET_RACE_RUNTIME;
  if(!rt.active || rt.finished) return;
  if(!document.getElementById('street-race-canvas')){
    streetRacingMiniRaceCleanup();
    return;
  }
  const now = performance.now();
  const dt = Math.min(42, Math.max(10, now - (rt.lastTs||now)));
  rt.lastTs = now;
  const ds = dt / 16.67;
  const p = rt.player;
  const keys = rt.keys;
  if(now < (rt.cautionUntil||0)){
    p.speed = Math.min(p.speed, p.maxSpeed * 0.58);
  }
  const throttle = !!(keys.arrowup || keys.w);
  const brake = !!(keys.arrowdown || keys.s);
  const left = !!(keys.arrowleft || keys.a || keys.h);
  const right = !!(keys.arrowright || keys.d || keys.l);
  const brakeAssist = !!(keys.k);
  const throttleAssist = !!(keys.j);
  const effectiveThrottle = throttle || throttleAssist;
  const effectiveBrake = brake || brakeAssist;
  if(effectiveThrottle) p.speed += p.accelRate*ds;
  if(effectiveBrake) p.speed -= p.brakeRate*ds;
  p.speed *= Math.pow(p.drag, ds);
  if(Math.abs(p.speed)<0.02) p.speed = 0;
  const turnInput = (left?-1:0) + (right?1:0);
  const turnRate = p.turnRate * (0.35 + Math.min(1, Math.abs(p.speed)/Math.max(0.1,p.maxSpeed)));
  p.angle += turnInput * turnRate * ds * (p.speed>=0 ? 1 : -1);
  p.x += Math.cos(p.angle) * p.speed * ds * p.speedScale;
  p.y += Math.sin(p.angle) * p.speed * ds * p.speedScale;

  const proj = streetRaceProjectToPath(p.x, p.y, rt.path);
  const hitBarrier = streetRaceApplyBarrierCollision(p, rt.track, proj);
  if(hitBarrier){
    rt.offTrackFrames += 2;
    rt.playerCar.damage = streetRaceClampStat((rt.playerCar.damage||0) + 1, 0, 100);
  }
  if(p.prevProgress > rt.path.total*0.86 && proj.progress < rt.path.total*0.14 && Math.abs(p.speed)>0.6){
    p.lap += 1;
  }
  p.prevProgress = proj.progress;

  (rt.opponents||[]).forEach(op=>{
    op.progress += op.speed * ds;
    if(op.progress>=rt.path.total){
      op.progress -= rt.path.total;
      op.lap += 1;
    }
    const aiPoint = streetRacePointAtDistance(rt.path, op.progress);
    op.x = aiPoint.x;
    op.y = aiPoint.y;
    op.angle = aiPoint.angle;
  });

  // Car-to-car contact with simple rebound and caution trigger.
  const racers = [{ kind:'player', ref:p }].concat((rt.opponents||[]).map(op=>({ kind:'op', ref:op })));
  for(let i=0;i<racers.length;i++){
    for(let j=i+1;j<racers.length;j++){
      const a = racers[i].ref;
      const b = racers[j].ref;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx,dy);
      if(d>0 && d<19){
        const nx = dx/d;
        const ny = dy/d;
        const push = (19-d)*0.55;
        a.x -= nx*push*0.5; a.y -= ny*push*0.5;
        b.x += nx*push*0.5; b.y += ny*push*0.5;
        const av = a.speed||0;
        const bv = b.speed||0;
        a.speed = -Math.abs(av)*0.20 + bv*0.08;
        b.speed = -Math.abs(bv)*0.20 + av*0.08;
        if(Math.random()<0.22){
          rt.offTrackFrames += 1;
          rt.playerCar.damage = streetRaceClampStat((rt.playerCar.damage||0) + 1, 0, 100);
        }
        if((rt.cautionUntil||0) < now + 2200){
          rt.cautionUntil = now + 2200;
          rt.cautionReason = 'Contact on track';
        }
      }
    }
  }

  const maxOppLap = Math.max(0, ...(rt.opponents||[]).map(op=>op.lap||0));
  if(p.lap>=rt.track.laps || maxOppLap>=rt.track.laps){
    rt.finished = true;
    const leaders = streetRaceLeaderboard(rt);
    const playerWins = leaders[0]?.key==='you';
    streetRacingMiniRaceCleanup();
    streetRacingResolveMiniRace(rt.track, rt.entry, playerWins?'player':'ai');
    return;
  }

  streetRacingDrawMiniRace(rt);
  const statusEl = document.getElementById('street-race-status');
  if(statusEl){
    const leaders = streetRaceLeaderboard(rt).slice(0,5).map((x,idx)=>`${idx+1}. ${x.name}`).join(' · ');
    const caution = now < (rt.cautionUntil||0)
      ? `<div style="color:#fde68a">⚠️ Yellow flag: ${rt.cautionReason||'Incident'} · Slow zone active</div>`
      : '';
    statusEl.innerHTML = `
      <div><strong>${rt.track.name}</strong> · Lap ${Math.min(rt.track.laps, p.lap+1)}/${rt.track.laps}</div>
      <div>Time ${streetRaceTimeFmt(now-rt.startTs)} · Speed ${Math.floor(Math.abs(p.speed)*76)} km/h</div>
      <div>Positioning: ${leaders} · Barrier hits ${Math.floor(rt.offTrackFrames/2)}</div>
      ${caution}
    `;
  }
  rt.raf = requestAnimationFrame(streetRacingMiniRaceLoop);
}

function streetRacingStartMiniRace(track, car, entry){
  const canvas = document.getElementById('street-race-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx){
    flash('Canvas race unavailable in this browser.','warn');
    return;
  }
  const path = streetRaceBuildPathMetrics(track.path);
  const start = streetRacePointAtDistance(path, path.total*0.02);
  const rt = STREET_RACE_RUNTIME;
  rt.active = true;
  rt.finished = false;
  rt.track = track;
  rt.entry = entry;
  rt.qualifying = null;
  rt.canvas = canvas;
  rt.ctx = ctx;
  rt.path = path;
  rt.startTs = performance.now();
  rt.lastTs = rt.startTs;
  rt.offTrackFrames = 0;
  rt.cautionUntil = 0;
  rt.cautionReason = '';
  rt.qualiOrder = [];
  rt.playerGrid = 1;
  rt.playerCar = car;
  rt.player = {
    x:start.x, y:start.y, angle:start.angle, speed:0,
    maxSpeed:3.6 + (car.power/52) + (car.accel/74),
    accelRate:0.072 + (car.accel/2400),
    brakeRate:0.075 + (car.grip/3000),
    drag:0.988 - Math.min(0.022, track.difficulty*0.003),
    turnRate:0.048 + (car.handling/2600) + (car.grip/4800),
    speedScale:1.3 + (car.power/190),
    lap:0,
    prevProgress:path.total*0.02,
  };
  const opponentCount = rnd(4,5);
  const palette = ['#ef4444','#f97316','#22c55e','#a855f7','#eab308'];
  rt.opponents = [];
  for(let i=0;i<opponentCount;i++){
    const startPos = streetRacePointAtDistance(path, path.total*(0.12 + i*0.05));
    rt.opponents.push({
      id:`op_${i+1}`,
      progress:path.total*(0.12 + i*0.05),
      speed:2.3 + track.difficulty*0.24 + rnd(0,20)/100 + Math.max(0, (track.reqLevel - (G.activities.streetRacing.level||1))*0.12),
      x:startPos.x,
      y:startPos.y,
      angle:startPos.angle,
      lap:0,
      color:palette[i%palette.length],
    });
  }
  streetRaceApplyQualifyingGrid(rt, track, car);
  // Snap cars to their grid spots after qualifying order is known.
  rt.player.lap = 0;
  rt.player.prevProgress = rt.player.progress;
  const pPt = streetRacePointAtDistance(path, rt.player.progress);
  rt.player.x = pPt.x; rt.player.y = pPt.y; rt.player.angle = pPt.angle;
  (rt.opponents||[]).forEach(op=>{
    op.lap = 0;
    const pt = streetRacePointAtDistance(path, op.progress);
    op.x = pt.x; op.y = pt.y; op.angle = pt.angle;
  });
  // Qualifying determines starting grid.
  const playerQuali = streetRaceCalcQualiScore(car, track, true);
  const quali = [{ id:'you', score:playerQuali }]
    .concat(rt.opponents.map((op, idx)=>({ id:op.id, score:streetRaceCalcQualiScore(car, track, false) - idx*0.8 + rnd(-12,12)/10 })));
  quali.sort((a,b)=>b.score-a.score);
  rt.qualiOrder = quali.map(q=>q.id);
  rt.playerGrid = rt.qualiOrder.indexOf('you') + 1;
  const spacing = 0.04;
  rt.qualiOrder.forEach((id, idx)=>{
    const pAt = streetRacePointAtDistance(path, path.total*(0.02 - idx*spacing));
    if(id==='you'){
      rt.player.x = pAt.x;
      rt.player.y = pAt.y;
      rt.player.angle = pAt.angle;
      rt.player.prevProgress = ((0.02 - idx*spacing) % 1 + 1) % 1 * path.total;
    } else {
      const op = rt.opponents.find(o=>o.id===id);
      if(op){
        op.x = pAt.x; op.y = pAt.y; op.angle = pAt.angle;
        op.progress = ((0.02 - idx*spacing) % 1 + 1) % 1 * path.total;
      }
    }
  });
  rt.keys = {};
  rt.onKeyDown = (e)=>{
    const k = String(e.key||'').toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','h','j','k','l'].includes(k)){
      rt.keys[k] = true;
      e.preventDefault();
    }
  };
  rt.onKeyUp = (e)=>{
    const k = String(e.key||'').toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','h','j','k','l'].includes(k)){
      rt.keys[k] = false;
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', rt.onKeyDown);
  window.addEventListener('keyup', rt.onKeyUp);
  streetRacingMiniRaceLoop();
}

function streetRacingLaunchMiniRace(trackId){
  ensureStreetRacingState();
  const r = G.activities.streetRacing;
  const track = streetRaceTrackById(trackId);
  const car = activeStreetCar();
  if(!car){ flash('Buy a car first.','warn'); return; }
  if((r.level||1) < (track.reqLevel||1)){
    flash(`Need street racing level ${track.reqLevel} for ${track.name}.`,'warn');
    return;
  }
  const entry = rnd(track.entry[0], track.entry[1]);
  if((G.money||0)<entry){
    flash(`Need ${fmt$(entry)} entry fee for ${track.name}.`,'warn');
    return;
  }
  G.money -= entry;
  const html = `
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="font-size:.78rem;color:var(--muted2)">
        Car: <strong>${car.name}</strong> · Stats P${car.power} A${car.accel} G${car.grip} H${car.handling} R${car.reliability}
        <br>Track: <strong>${track.name}</strong> · Difficulty ${track.difficulty} · Laps ${track.laps} · Entry ${fmt$(entry)}
        <br>Grid: <strong>5-6 total cars</strong> (you + 4-5 rivals) · Barrier walls enabled
      </div>
      <canvas id="street-race-canvas" width="700" height="540" style="width:100%;max-width:700px;border:1px solid var(--border);border-radius:10px;background:#0b0f17"></canvas>
      <div id="street-race-status" style="font-size:.78rem;color:var(--muted2)">Use Arrow keys/WASD (or H/J/K/L on Mac keyboards). Stay on track.</div>
    </div>`;
  showPopupHTML(`🏁 2D Race: ${track.name}`, html, [
    { label:'Forfeit Race', cls:'btn-ghost', onClick:()=>streetRacingAbortMiniRace() },
  ], 'dark');
  setTimeout(()=>streetRacingStartMiniRace(track, car, entry), 20);
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
  const lvlMeta = STREET_RACING_LEVELS[Math.max(0, (r.level||1)-1)] || STREET_RACING_LEVELS[0];
  const unlockedCount = STREET_RACING_TRACKS.filter(t=>t.reqLevel<=r.level).length;
  card.innerHTML = `
    <div class="card-title">Street Racing</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">
      Level: <strong>${lvlMeta.label}</strong> · Rep ${r.rep} · Skill ${r.skill} · Heat ${r.heat}
    </div>
    <div style="margin-bottom:10px;font-size:.76rem;color:var(--muted2)">
      Active Car: ${car?`${car.name} (P${car.power} A${car.accel} G${car.grip} H${car.handling} R${car.reliability} DMG ${car.damage||0}%)`:'None'}
      ${car?`<br>Mods: ${streetRacingCarModSummary(car)} · Value ${fmt$(car.value||0)} · Mileage ${(car.mileage||0).toLocaleString()} km`:''}
    </div>
    <div class="choice-grid">
      <div class="choice" onclick="streetRacingOpenGarage()">
        <div class="choice-icon">🧰</div>
        <div class="choice-name">Garage</div>
        <div class="choice-desc">View cars, sell, repair, set active</div>
      </div>
      <div class="choice" onclick="streetRacingBuyCar()">
        <div class="choice-icon">🚗</div>
        <div class="choice-name">Buy Car</div>
        <div class="choice-desc">Add a new model to your garage</div>
      </div>
      <div class="choice" onclick="streetRacingOpenMods()">
        <div class="choice-icon">🔧</div>
        <div class="choice-name">Mod Shop</div>
        <div class="choice-desc">See exact stat effects before buying</div>
      </div>
      <div class="choice" onclick="streetRacingOpenTrack()">
        <div class="choice-icon">🗺️</div>
        <div class="choice-name">2D Race Tracks</div>
        <div class="choice-desc">${unlockedCount}/3 maps unlocked · playable mini-game</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:.74rem;color:var(--muted2)">
      Races ${r.races} · Wins ${r.wins} · Losses ${r.losses} · Podiums ${r.podiums} · Crashes ${r.crashes}
      · Fines ${fmt$(r.fines)} · Total Prize ${fmt$(r.totalPrize)}
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
    r.fines += fine;
    addEv(`Street racing heat drew enforcement attention. Fine paid: ${fmt$(fine)}.`, 'warn');
  }
  let depreciationEvents = 0;
  (r.garage||[]).forEach(car=>{
    const before = car.value||0;
    const wear = rnd(0,2) + Math.floor((car.mileage||0)/24000);
    car.reliability = streetRaceClampStat((car.reliability||50) - wear, 6, 120);
    if(Math.random()<0.22) car.damage = streetRaceClampStat((car.damage||0) + rnd(1,4), 0, 100);
    streetRacingRecomputeCarValue(car);
    if(before - (car.value||0) > 1200) depreciationEvents += 1;
  });
  if(depreciationEvents>0){
    addEv(`Your garage depreciated over time (${depreciationEvents} car${depreciationEvents>1?'s':''} dropped in value).`, 'warn');
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
