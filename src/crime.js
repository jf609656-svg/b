function addCrimeEv(text, type=''){
  G.crime.log.push({ text, type, age:G.age });
  if(G.crime.log.length>50) G.crime.log.shift();
}

function policeCheck(){
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

function renderCrime(){
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
    const heists = HEIST_LOCATIONS.filter(h=>C.notoriety>=h.minNotoriety).slice(0,4);
    html += `<div class="card">
      <div class="card-title">Big Crime (18+)</div>
      <div class="choice-grid">
        <div class="choice" onclick="kidnap('low')"><div class="choice-icon">🧢</div><div class="choice-name">Kidnap (Low)</div><div class="choice-desc">Risky</div></div>
        <div class="choice" onclick="kidnap('high')"><div class="choice-icon">👑</div><div class="choice-name">Kidnap (High)</div><div class="choice-desc">Very risky</div></div>
      </div>
      <div class="section-header" style="margin-top:10px">Heists</div>
      <div class="choice-grid">
        ${heists.map(h=>`<div class="choice" onclick="startHeist('${h.id}')"><div class="choice-icon">💰</div><div class="choice-name">${h.label}</div><div class="choice-desc">${fmt$(h.payout)} · Roles ${h.roles.length}</div></div>`).join('')}
      </div>
      ${heists.length===0?`<div class="notif warn" style="margin-top:8px">Notorious status too low for heists.</div>`:''}
    </div>`;
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

function startHeist(heistId){
  const h = HEIST_LOCATIONS.find(x=>x.id===heistId);
  if(!h) return;
  const pool = HEIST_CREW_POOL.filter(c=>{
    if(G.crime.notoriety<20) return c.skill<=60;
    if(G.crime.notoriety<40) return c.skill<=70;
    return true;
  });
  const driver = pick(pool.filter(c=>c.role==='Driver'));
  const gunman = pick(pool.filter(c=>c.role==='Gunman'));
  const hacker = h.roles.includes('Hacker') ? pick(pool.filter(c=>c.role==='Hacker')) : null;
  const crew = [driver, gunman].concat(hacker? [hacker] : []);
  showPopup(
    'Heist Plan',
    `${h.label} · Roles: ${h.roles.join(', ')}`,
    [
      { label:'Back Out', cls:'btn-ghost', onClick:()=>{} },
      { label:'Execute Heist', cls:'btn-primary', onClick:()=>executeHeist(h, crew) },
    ],
    'dark'
  );
}

function executeHeist(h, crew){
  const skill = crew.reduce((s,c)=>s+c.skill,0) / crew.length;
  const chance = 0.4 + (skill/200) - (G.crime.heat/200);
  const cut = crew.reduce((s,c)=>s+c.cut,0);
  if(Math.random()<chance){
    const take = Math.floor(h.payout * (1 - cut/100));
    G.money += take;
    G.crime.notoriety += Math.floor(h.heat/2);
    G.crime.heat = Math.min(100, G.crime.heat + h.heat);
    addEv(`Heist success: ${h.label}. You cleared ${fmt$(take)}.`, 'bad');
    addCrimeEv(`Heist success: ${h.label}.`, 'bad');
  } else {
    G.crime.heat = Math.min(100, G.crime.heat + h.heat + 10);
    G.health = clamp(G.health - rnd(8,16));
    addEv(`Heist failed at ${h.label}. You barely escaped.`, 'bad');
    addCrimeEv(`Heist failed: ${h.label}.`, 'bad');
  }
  G.crime.police.closeness = Math.min(100, G.crime.police.closeness + rnd(15,25));
  policeCheck();
  updateHUD(); renderCrime();
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
