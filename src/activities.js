// ══ activities.js ══
// ═══════════════════════════════════════════════════════════════
//  activities.js — Activities tab
// ═══════════════════════════════════════════════════════════════

function renderActivities(){
  const eligible = ACTIVITIES.filter(a=>G.age>=a.minAge);
  document.getElementById('activities-grid').innerHTML = eligible.map((a,i)=>`
    <div class="choice" onclick="runActivity(${ACTIVITIES.indexOf(a)})">
      <div class="choice-icon">${a.icon}</div>
      <div class="choice-name">${a.name}</div>
      <div class="choice-desc">${a.desc}</div>
    </div>`).join('');
}

function runActivity(i){
  ACTIVITIES[i].fn();
  updateHUD();
  switchTab('life');
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
