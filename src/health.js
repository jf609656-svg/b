//  health.js — Health tab, illnesses, doctor
// ═══════════════════════════════════════════════════════════════

// Illness chance per year — kept rare so it feels meaningful not annoying
const ILL_CHANCE = a => a<12?.04 : a<18?.06 : a<30?.07 : a<50?.11 : a<70?.18 : .26;

function rollIllness(){
  const a = G.age;
  if(Math.random() > ILL_CHANCE(a)) return;
  const eligible = ILLNESSES.filter(ill =>
    a>=ill[8] && a<=ill[9] && !G.medical.conditions.includes(ill[0])
  );
  if(!eligible.length) return;

  const weights = eligible.map(i=>i[7]?.022:1);
  const total   = weights.reduce((s,w)=>s+w,0);
  let rr = Math.random()*total, chosen=null;
  for(let i=0;i<eligible.length;i++){ rr-=weights[i]; if(rr<=0){chosen=eligible[i];break;} }
  if(!chosen) chosen=pick(eligible);

  G.medical.conditions.push(chosen[0]);
  G.health = clamp(G.health - chosen[4]);
  G.happy  = clamp(G.happy  - chosen[5]);

  // Under 18: parents cover the cost
  if(G.age < 18){
    addEv(`Diagnosed: ${chosen[1]}. ${chosen[3]}${chosen[7]?' This is serious.':''} Your parents paid the medical bills.`, 'bad');
    flash(`${chosen[2]} ${chosen[1]} — parents covered it`, 'bad');
  } else {
    G.money = Math.max(0, G.money - chosen[6]);
    addEv(`Diagnosed: ${chosen[1]}. ${chosen[3]}${chosen[7]?' This is serious.':''}`, 'bad');
    flash(`${chosen[2]} ${chosen[1]}`, 'bad');
  }

  // Spiral effects
  if(chosen[0]==='depression' && !G.medical.conditions.includes('anxiety') && Math.random()<.3){
    G.medical.conditions.push('anxiety');
    addEv('The depression brought a guest. Anxiety has moved in too.','bad');
  }
  if(chosen[0]==='burnout' && !G.medical.conditions.includes('depression') && Math.random()<.35){
    G.medical.conditions.push('depression');
    addEv('Burnout tipped into depression. The classic combo.','bad');
  }

  // Fatal check
  if(chosen[7] && G.health<30 && Math.random()<.38){
    addEv(`${chosen[1]} proved fatal. Your story ends here.`,'bad');
    setTimeout(()=>die(`${chosen[1]} proved fatal.`), 500);
  }
}

function renderHealth(){
  const hc = document.getElementById('health-content');
  let html  = '';

  // Current health
  html+=`<div class="card">
    <div class="card-title">Current Health</div>
    ${statBar('Health', G.health, 'bar-h')}
    <p style="font-size:.8rem;color:var(--muted2);margin-top:9px">${healthVerdict()}</p>
  </div>`;

  // Active conditions
  html+=`<div class="card"><div class="card-title">Active Conditions ${G.medical.conditions.length?`(${G.medical.conditions.length})`:''}</div>`;
  if(!G.medical.conditions.length){
    html+=`<p style="color:var(--muted2);font-size:.875rem">Clean bill of health. Don\'t jinx it.</p>`;
  } else {
    G.medical.conditions.forEach(id=>{
      const ill = ILLNESSES.find(i=>i[0]===id); if(!ill) return;
      const cost = Math.floor(ill[6]*1.5);
      html+=`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:1.5rem">${ill[2]}</span>
        <div style="flex:1">
          <div style="font-family:var(--fh);font-weight:700;font-size:.9rem">${ill[1]}</div>
          <div style="font-size:.72rem;color:var(--muted2)">${ill[3]}</div>
          <div style="font-size:.7rem;color:var(--danger);margin-top:2px">Treatment: ${fmt$(cost)}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="treatCondition('${id}')">Treat</button>
      </div>`;
    });
  }
  html+=`</div>`;

  // History
  if(G.medical.history.length){
    html+=`<div class="card"><div class="card-title">Survived</div>`;
    G.medical.history.forEach(id=>{
      const ill=ILLNESSES.find(i=>i[0]===id);
      if(ill) html+=`<div style="font-size:.82rem;color:var(--muted2);padding:3px 0">${ill[2]} ${ill[1]}</div>`;
    });
    html+=`</div>`;
  }

  // Doctor
  html+=`<div class="card"><div class="card-title">Doctor's Office</div>
    <div class="choice-grid">
      <div class="choice" onclick="visitDoctor('checkup')"><div class="choice-icon">🩺</div><div class="choice-name">General Checkup</div><div class="choice-desc">$200 · +Health</div></div>
      <div class="choice" onclick="visitDoctor('therapy')"><div class="choice-icon">🛋️</div><div class="choice-name">Therapy Session</div><div class="choice-desc">$150 · +Happy</div></div>
      <div class="choice" onclick="visitDoctor('plastic')"><div class="choice-icon">💉</div><div class="choice-name">Plastic Surgery</div><div class="choice-desc">$8,000 · +Looks (risky)</div></div>
      <div class="choice" onclick="visitDoctor('detox')"><div class="choice-icon">🥦</div><div class="choice-name">Detox Programme</div><div class="choice-desc">$500 · +Health</div></div>
    </div>
  </div>`;

  hc.innerHTML = html;
}

function healthVerdict(){
  const h = G.health;
  if(h>=85) return 'Peak condition. You could run a marathon. You won\'t. But you could.';
  if(h>=65) return 'Pretty healthy. The occasional ache. Nothing dramatic.';
  if(h>=45) return 'Getting rough. Your body is sending strongly-worded letters.';
  if(h>=25) return 'Your organs are staging a coordinated walkout. See a doctor.';
  return 'Critical. Every day is borrowed time and the interest is compounding.';
}

function treatCondition(id){
  const ill  = ILLNESSES.find(i=>i[0]===id);
  const cost = Math.floor(ill[6]*1.5);
  const parentsPay = G.age < 18;
  if(!parentsPay && G.money<cost){ flash(`Need ${fmt$(cost)} for treatment`,'bad'); return; }
  if(!parentsPay) G.money -= cost;
  G.health  = clamp(G.health + ill[4]);
  G.happy   = clamp(G.happy  + Math.floor(ill[5]/2));
  G.medical.conditions = G.medical.conditions.filter(c=>c!==id);
  G.medical.history.push(id);
  if(parentsPay){
    addEv(`Treated ${ill[1]}. Your parents covered the ${fmt$(cost)} bill. They didn't make it weird. This time.`);
    flash(`${ill[1]} treated — parents paid 🩺`,'good');
  } else {
    addEv(`Treated ${ill[1]}. You feel better. Your bank account does not. (-${fmt$(cost)})`);
    flash(`${ill[1]} treated! 🩺`,'good');
  }
  updateHUD(); renderHealth();
}

function visitDoctor(type){
  if(type==='checkup'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=200; G.health=clamp(G.health+rnd(5,13));
    addEv('Annual checkup. Doctor said "looking good" while clearly concerned. (+Health)');
    flash('+Health 🩺','good');
  } else if(type==='therapy'){
    if(G.money<150){ flash('Need $150','warn'); return; }
    G.money-=150; G.happy=clamp(G.happy+rnd(8,17));
    if(G.medical.conditions.includes('depression')&&Math.random()>.44){
      G.medical.conditions=G.medical.conditions.filter(c=>c!=='depression');
      G.medical.history.push('depression');
      addEv('Therapy is working. The darkness is lifting. Slowly, but lifting. 🛋️');
    } else if(G.medical.conditions.includes('anxiety')&&Math.random()>.48){
      G.medical.conditions=G.medical.conditions.filter(c=>c!=='anxiety');
      G.medical.history.push('anxiety');
      addEv('The anxiety is more manageable now. You have tools now. 🛋️');
    } else if(G.medical.conditions.includes('burnout')&&Math.random()>.5){
      G.medical.conditions=G.medical.conditions.filter(c=>c!=='burnout');
      G.medical.history.push('burnout');
      addEv('Therapy helped address the burnout. You feel human again. 🛋️');
    } else {
      addEv('Therapy session. You cried a bit. Helped more than you expected. (+Happy)');
    }
    flash('+Happy 🛋️','good');
  } else if(type==='plastic'){
    if(G.money<8000){ flash('Need $8,000','warn'); return; }
    G.money-=8000;
    if(Math.random()>.27){
      const boost=rnd(8,20); G.looks=clamp(G.looks+boost);
      addEv(`Plastic surgery went perfectly. You look fantastic. Suspiciously so. (+${boost} Looks)`);
      flash('+Looks 💉','good');
    } else {
      G.looks=clamp(G.looks-rnd(6,15)); G.health=clamp(G.health-10);
      addEv('The surgery did not go as planned. Nobody is allowed to comment.','bad');
      flash('Surgery botched. -Looks -Health','bad');
    }
  } else if(type==='detox'){
    if(G.money<500){ flash('Need $500','warn'); return; }
    G.money-=500; G.health=clamp(G.health+rnd(10,22));
    if(G.medical.conditions.includes('burnout')){
      G.medical.conditions=G.medical.conditions.filter(c=>c!=='burnout');
      G.medical.history.push('burnout');
      addEv('Detox cleared the burnout. You feel like a person again. (+Health)');
    } else {
      addEv('Detox complete. You feel annoyingly virtuous. (+Health)');
    }
    flash('+Health 🥦','good');
  }
  updateHUD(); renderHealth();
}


