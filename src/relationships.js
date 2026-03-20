// ══ relationships.js ══
// ═══════════════════════════════════════════════════════════════
//  relationships.js — Family, Romance, Friends, Children
// ═══════════════════════════════════════════════════════════════

// ── SUB-TAB NAVIGATION ──────────────────────────────────────────
function switchRelTab(tab){
  G.relTab = tab;
  ['family','romance','friends','children','pets','tree'].forEach(t=>{
    const el = document.getElementById('rtab-'+t);
    if(el) el.classList.toggle('active', t===tab);
  });
  renderRelationships();
}

function renderRelationships(){
  const tab = G.relTab || 'family';
  // Make sure correct tab is highlighted
  ['family','romance','friends','children','pets','tree'].forEach(t=>{
    const el = document.getElementById('rtab-'+t);
    if(el) el.classList.toggle('active', t===tab);
  });
  const rc = document.getElementById('rel-content');
  if(!rc) return;

  if(tab==='family')   rc.innerHTML = renderFamilyTab();
  if(tab==='romance')  rc.innerHTML = renderRomanceTab();
  if(tab==='friends')  rc.innerHTML = renderFriendsTab();
  if(tab==='children') rc.innerHTML = renderChildrenTab();
  if(tab==='pets')     rc.innerHTML = renderPetsTab();
  if(tab==='tree')     rc.innerHTML = renderFamilyTree();

  // Passive friend decay
  G.friends.filter(f=>f.alive).forEach(f=>{
    const drift = f.compat>=70 ? rnd(0,2) : f.compat<=40 ? rnd(1,4) : rnd(1,3);
    if(Math.random()<.04) f.relation=clamp(f.relation-drift);
  });
}

// ══════════════════════════════════════════════════════════════
//  FAMILY TAB
// ══════════════════════════════════════════════════════════════
function renderFamilyTab(){
  const alive = G.family.filter(p=>p.alive);
  const dead  = G.family.filter(p=>!p.alive);
  if(!alive.length) return `<div class="notif warn">No living family members.</div>`;

  let html = '';
  // Group by role
  const order = ['Father','Mother','Grandfather','Grandmother','Sibling'];
  order.forEach(role=>{
    const group = alive.filter(p=>p.role===role);
    group.forEach(p=>{ html += famPersonCard(p); });
  });
  if(dead.length){
    html += `<div class="section-header" style="margin-top:16px">In Memory</div>`;
    dead.forEach(p=>{ html+=`<div style="font-size:.82rem;color:var(--muted2);padding:3px 0">✝ ${p.name} · ${p.role}${p.age?' · Age '+p.age:''}</div>`; });
  }
  return html;
}

function renderFamilyTree(){
  const byRole = role => G.family.filter(p=>p.role===role && p.alive);
  const parents = [...byRole('Father'), ...byRole('Mother'), ...byRole('Stepfather'), ...byRole('Stepmother')];
  const grands  = [...byRole('Grandfather'), ...byRole('Grandmother')];
  const sibs    = [...byRole('Sibling'), ...byRole('Step-Sibling')];
  const kids    = G.children.filter(c=>c.alive);

  return `
  <div class="card">
    <div class="card-title">Family Tree</div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">Traits: ${G.traits?.join(', ')||'—'}</div>
    <div style="margin-bottom:8px"><strong>Parents</strong></div>
    ${parents.length?parents.map(p=>`<div style="font-size:.82rem;margin-bottom:4px">👤 ${p.name} · ${p.role}${p.traits?.length?` · Traits: ${p.traits.join(', ')}`:''}</div>`).join(''):'<div class="notif warn">No listed parents.</div>'}
    <div style="margin:10px 0 8px"><strong>Grandparents</strong></div>
    ${grands.length?grands.map(p=>`<div style="font-size:.82rem;margin-bottom:4px">👤 ${p.name} · ${p.role}</div>`).join(''):'<div style="font-size:.8rem;color:var(--muted2)">Unknown</div>'}
    <div style="margin:10px 0 8px"><strong>Siblings</strong></div>
    ${sibs.length?sibs.map(p=>`<div style="font-size:.82rem;margin-bottom:4px">👤 ${p.name} · ${p.role}</div>`).join(''):'<div style="font-size:.8rem;color:var(--muted2)">None</div>'}
    <div style="margin:10px 0 8px"><strong>Children</strong></div>
    ${kids.length?kids.map(p=>`<div style="font-size:.82rem;margin-bottom:4px">👤 ${p.name} · Age ${p.age}${p.custody?` · Custody: ${p.custody}`:''}</div>`).join(''):'<div style="font-size:.8rem;color:var(--muted2)">None</div>'}
  </div>`;
}

function famPersonCard(p){
  const icon = {Father:'👨',Mother:'👩',Grandfather:'👴',Grandmother:'👵',Sibling:'🧑'}[p.role]||'👤';
  const rc   = relColor(p.relation);
  const n    = p.name;
  const status = personStatus(p);
  return `
  <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
    <div style="display:flex;align-items:center;gap:11px;width:100%">
      <div class="p-avatar av-fam">${icon}</div>
      <div style="flex:1">
        <div class="p-name">${p.name}</div>
        <div class="p-role">${p.role}${p.age?' · Age '+p.age:''}</div>
        <div style="font-size:.68rem;color:var(--muted2);margin-top:1px">${status}</div>
        <div class="p-rel-wrap" style="margin-top:3px">
          <div class="p-rel-track" style="width:80px">
            <div class="p-rel-fill" style="width:${p.relation}%;background:${p.relation>=65?'var(--accent)':p.relation>=40?'var(--gold)':'var(--danger)'}"></div>
          </div>
        </div>
      </div>
      <div style="font-family:var(--fh);font-size:.78rem;color:var(--muted2)">${p.relation}%</div>
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','call')">📞 Call</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','visit')">🏠 Visit</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','gift')">🎁 Gift</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','meal')">🍽️ Meal</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','fight')">😤 Fight</button>
      ${G.age>=18?`<button class="btn btn-ghost btn-sm" onclick="famAct('${n}','borrow')">💸 Borrow</button>`:''}
    </div>
  </div>`;
}

function famAct(name, type){
  const p = G.family.find(x=>x.name===name);
  if(!p||!p.alive){ flash('They\'re no longer with us.','warn'); return; }
  const fn = p.firstName;

  if(type==='call'){
    p.relation = clamp(p.relation + rnd(4,10));
    G.happy    = clamp(G.happy    + rnd(4,8));
    addEv(pick([
      `Called ${fn}. They talked for 40 minutes without asking about you once. Still nice.`,
      `${fn} picked up on the first ring. Something about that hit different.`,
      `You and ${fn} talked for hours. Easier than expected.`,
    ]),'love');
    flash(`+Relationship with ${fn} 💚`);
  } else if(type==='visit'){
    G.happy = clamp(G.happy+rnd(7,13));
    p.relation = clamp(p.relation+rnd(8,14));
    addEv(pick([
      `You visited ${fn}. They fed you. You stayed too long. Perfect.`,
      `Spent the day with ${fn}. The house smells the same as it always has.`,
      `${fn} was surprised to see you. In the good way.`,
    ]),'love');
    flash(`+Happy +Relationship · visited ${fn}`);
  } else if(type==='meal'){
    const cost = rnd(30,90); G.money -= cost;
    p.relation = clamp(p.relation + rnd(6,13));
    G.happy    = clamp(G.happy    + rnd(6,11));
    addEv(`Dinner with ${fn}. Real conversations. (-$${cost})`,'love');
    flash(`Meal with ${fn}! 🍽️`);
  } else if(type==='gift'){
    if(G.money<100){ flash('Need $100 for a gift','warn'); return; }
    G.money -= 100;
    p.relation = clamp(p.relation + rnd(8,18));
    G.happy    = clamp(G.happy    + 4);
    addEv(`You got ${fn} a gift. Their face lit up. (-$100)`);
    flash(`${fn} loved it! 🎁`);
  } else if(type==='fight'){
    p.relation = clamp(p.relation - rnd(15,25)); G.happy = clamp(G.happy - rnd(8,14));
    addEv(pick([
      `You picked a fight with ${fn} about something old. It got bigger fast.`,
      `You and ${fn} said things that can't be unsaid.`,
    ]),'bad');
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='borrow'){
    if(p.relation<50){ flash(`${fn} doesn't trust you enough.`,'bad'); return; }
    const amt  = (p.role==='Father'||p.role==='Mother') ? rnd(500,4000) : rnd(100,800);
    if(Math.random()<p.relation/120){
      G.money += amt; p.relation = clamp(p.relation-12);
      addEv(`${fn} lent you ${fmt$(amt)}. They didn't look thrilled.`,'warn');
      flash(`+${fmt$(amt)} from ${fn}`);
    } else {
      p.relation = clamp(p.relation-9);
      addEv(`You asked ${fn} for money. Long pause. "I can't right now." Awkward.`,'bad');
      flash(`${fn} said no`,'bad');
    }
  }
  updateHUD(); renderRelationships();
}

// ══════════════════════════════════════════════════════════════
//  ROMANCE TAB
// ══════════════════════════════════════════════════════════════
function renderRomanceTab(){
  let html = '';

  // Spouse block
  if(G.spouse && G.spouse.alive){
    const s = G.spouse;
    const rc = relColor(s.relation);
    const status = personStatus(s);
    html += `
    <div class="card" style="border-color:rgba(244,114,182,.25)">
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:10px">
        <div class="p-avatar av-love">💍</div>
        <div style="flex:1">
          <div class="p-name">${s.name}</div>
          <div class="p-role">Spouse · Age ${s.age} · Married ${G.marriageYears} yr${G.marriageYears!==1?'s':''} · Compat ${s.compat||'?'}%</div>
          <div style="font-size:.68rem;color:var(--muted2);margin-top:1px">${status}</div>
          <div class="p-rel-wrap" style="margin-top:4px">
            <div class="p-rel-track" style="width:80px">
              <div class="p-rel-fill" style="width:${s.relation}%;background:${s.relation>=65?'var(--accent)':s.relation>=40?'var(--gold)':'var(--danger)'}"></div>
            </div>
          </div>
        </div>
        <div style="font-family:var(--fh);font-size:.78rem;color:${rc==='rel-color-good'?'var(--accent)':rc==='rel-color-ok'?'var(--gold)':'var(--danger)'}">${s.relation}%</div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('date')">💘 Date Night</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('movie')">🎬 Movie Night</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('trip')">✈️ Trip</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('convo')">💬 Deep Talk</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('makeout')">😘 Make Out</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('intimate')">🔥 Be Intimate</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('anniversary')">🥂 Anniversary</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('counselling')">🛋️ Counselling</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('fight')">😤 Fight</button>
        <button class="btn btn-ghost btn-sm" onclick="spouseAct('cheat')">😈 Cheat</button>
        <button class="btn btn-ghost btn-sm btn-danger" style="margin-left:auto" onclick="spouseAct('divorce')">💔 Divorce</button>
      </div>
    </div>`;
  }

  // Active lovers (non-spouse)
  const lovers = G.lovers.filter(l=>l.alive);
  lovers.forEach(l=>{
    const n = l.name;
    const status = personStatus(l);
    html+=`
    <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:11px;width:100%">
        <div class="p-avatar av-love">${l.role==='Partner'?'💍':'❤️'}</div>
        <div style="flex:1">
          <div class="p-name">${l.name} ${l.role==='Partner'?'<span style="font-size:.7rem;color:var(--gold)">💍 Engaged</span>':''}</div>
          <div class="p-role">${l.role==='Partner'?'Fiancé(e)':'Partner'} · Age ${l.age||'?'} · Compat ${l.compat||'?'}%</div>
          <div style="font-size:.68rem;color:var(--muted2)">${status}</div>
          <div class="p-rel-wrap" style="margin-top:3px">
            <div class="p-rel-track" style="width:80px">
              <div class="p-rel-fill" style="width:${l.relation}%;background:${l.relation>=65?'var(--accent)':l.relation>=40?'var(--gold)':'var(--danger)'}"></div>
            </div>
          </div>
        </div>
        <div style="font-family:var(--fh);font-size:.78rem;color:var(--muted2)">${l.relation}%</div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','date')">💘 Date</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','movie')">🎬 Movie</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','convo')">💬 Deep Talk</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','makeout')">😘 Make Out</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','intimate')">🔥 Be Intimate</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','special')">✨ Special Date</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','fight')">😤 Fight</button>
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','propose')">💍 Propose</button>
        ${l.role==='Partner'?`<button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','wedding')">💒 Plan Wedding</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="loveAct('${n}','cheat')">😈 Cheat</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger)" onclick="loveAct('${n}','breakup')">💔 Break Up</button>
      </div>
    </div>`;
  });

  if(!G.spouse && !lovers.length){
    html += `<div class="notif warn" style="margin-bottom:12px">Nobody special right now.</div>`;
  }

  // Start dating button
  if(G.age>=16 && !G.spouse){
    html += `<button class="btn btn-ghost" style="width:100%;margin-top:8px" onclick="tryDate()">💘 Start Dating Someone New</button>`;
  }

  return html || '<div class="notif warn">Nobody special right now.</div>';
}

function spouseAct(type){
  const s = G.spouse;
  if(!s||!s.alive){ flash('No spouse.','warn'); return; }
  const fn = s.firstName;

  if(type==='date'){
    const cost=rnd(40,150); G.money-=cost;
    s.relation=clamp(s.relation+rnd(7,15)); G.happy=clamp(G.happy+rnd(10,16));
    addEv(pick([`Date night with ${fn}. You forgot your phones existed.`,`You and ${fn} went out. Table for two. No interruptions. Perfect.`]),'love');
    flash(`Date with ${fn}! 💘`);
  } else if(type==='movie'){
    s.relation=clamp(s.relation+rnd(4,9)); G.happy=clamp(G.happy+rnd(5,10));
    addEv(pick([`Movie night with ${fn}. You both picked something different and compromised badly. Loved every minute.`,`You and ${fn} watched something together. The comments section you provided was unnecessary but appreciated.`]),'love');
    flash(`Movie night with ${fn} 🎬`);
  } else if(type==='trip'){
    if(G.money<400){ flash('Need $400 for a trip','warn'); return; }
    G.money-=rnd(400,1200); s.relation=clamp(s.relation+rnd(12,22)); G.happy=clamp(G.happy+rnd(14,20));
    addEv(`Trip away with ${fn}. You remembered why you chose each other.`,'love');
    flash(`+Relationship · trip with ${fn} ✈️`,'good');
  } else if(type==='convo'){
    const roll = Math.random();
    if(roll>0.25){
      s.relation=clamp(s.relation+rnd(6,12)); G.happy=clamp(G.happy+rnd(5,9));
      addEv(pick([`You and ${fn} had a real conversation. Not about logistics. About everything else.`,`2am conversation with ${fn}. Some things said that needed saying.`]),'love');
    } else {
      s.relation=clamp(s.relation-rnd(3,8)); G.happy=clamp(G.happy-4);
      addEv(`The conversation with ${fn} surfaced something unresolved. Progress, technically.`,'warn');
    }
    flash(`💬 Deep talk with ${fn}`);
  } else if(type==='makeout'){
    s.relation=clamp(s.relation+rnd(5,12)); G.happy=clamp(G.happy+rnd(6,11));
    addEv(pick([`You and ${fn} had a moment. The good kind.`,`Spontaneous moment with ${fn}. Marriage isn't dead.`]),'love');
    flash(`😘`);
  } else if(type==='intimate'){
    s.relation=clamp(s.relation+rnd(8,16)); G.happy=clamp(G.happy+rnd(8,14));
    addEv(`Intimate time with ${fn}. The connection: real.`,'love');
    flash(`🔥`);
    // Baby chance
    if(G.age>=18 && G.age<=45 && Math.random()<0.12){
      addEv(`${fn} is pregnant. A new chapter begins.`,'love');
      flash('🍼 Baby on the way!','good');
      setTimeout(()=>haveChild(s),100);
    }
  } else if(type==='anniversary'){
    if(G.marriageYears<1){ flash('Not married yet!','warn'); return; }
    const cost=rnd(100,500); G.money-=cost;
    s.relation=clamp(s.relation+rnd(10,20)); G.happy=clamp(G.happy+rnd(12,20));
    addEv(`Anniversary celebration with ${fn}. Year ${G.marriageYears}. You said things worth saying. (-$${cost})`,'love');
    flash(`🥂 Happy Anniversary!`,'good');
  } else if(type==='counselling'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=200;
    s.relation=clamp(s.relation+rnd(8,18)); G.happy=clamp(G.happy+rnd(3,8));
    addEv(`Marriage counselling with ${fn}. Awkward and necessary. The therapist was good. (-$200)`,'good');
    flash(`+Relationship · counselling 🛋️`,'good');
  } else if(type==='fight'){
    s.relation=clamp(s.relation-rnd(12,22)); G.happy=clamp(G.happy-rnd(8,14));
    addEv(pick([`You and ${fn} had a real fight. Not the kind that passes easily.`,`Things got heated with ${fn}. Some of it was fair. Some of it wasn't.`]),'bad');
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='cheat'){
    G.darkScore++;
    if(Math.random()<0.52){
      G.divorces++;
      const split = Math.floor(G.money*0.5 + G.assets.homeValue*0.5);
      G.money = Math.max(0, G.money - split);
      G.happy = clamp(G.happy-28); G.social.reputation=clamp(G.social.reputation-15);
      addEv(`You cheated on ${fn}. They found out. Divorce proceedings: immediate. Cost: ${fmt$(split)}.`,'bad');
      flash(`${fn} found out. Divorce. -${fmt$(split)}`,'bad');
      if(G.children.length){
        G.children.forEach(c=>{
          const r = Math.random();
          c.custody = r < 0.4 ? 'shared' : r < 0.6 ? 'you' : 'other';
          if(c.custody==='other') c.relation = clamp(c.relation - rnd(8,16));
        });
        addEv('Custody was decided. Co‑parenting begins.', 'warn');
      }
      G.spouse = null;
    } else {
      G.happy=clamp(G.happy+4);
      addEv(`You cheated on ${fn} and got away with it. The universe keeps score.`,'warn');
      flash('Got away with it. For now.','warn');
    }
  } else if(type==='divorce'){
    G.divorces++;
    const split = Math.floor(G.money*0.5 + G.assets.homeValue*0.5);
    G.money = Math.max(0, G.money - split);
    G.happy = clamp(G.happy-20);
    if(G.children.length){
      G.children.forEach(c=>{
        const base = (G.spouse?.relation||50)/100;
        const r = Math.random();
        c.custody = r < 0.45+base*0.2 ? 'shared' : r < 0.7 ? 'you' : 'other';
        if(c.custody==='other') c.relation = clamp(c.relation - rnd(6,14));
      });
      addEv('Custody was decided. Co‑parenting begins.', 'warn');
    }
    addEv(`You and ${fn} divorced after ${G.marriageYears} year${G.marriageYears!==1?'s':''}. Assets split. Lawyers expensive. Life: continuing.`,'bad');
    flash(`Divorced from ${fn}. -${fmt$(split)}`,'warn');
    G.spouse = null; G.marriageYears = 0;
  }
  updateHUD(); renderRelationships();
}

function loveAct(name, type){
  const l = G.lovers.find(x=>x.name===name);
  if(!l||!l.alive){ renderRelationships(); return; }
  const fn = l.firstName;

  if(type==='date'){
    const cost=rnd(30,120); G.money-=cost;
    l.relation=clamp(l.relation+rnd(8,16)); G.happy=clamp(G.happy+rnd(10,16));
    l.milestones = l.milestones || {};
    if(!l.milestones.firstDate){ l.milestones.firstDate = true; addEv(`First real date with ${fn}. You were both nervous.`, 'love'); }
    addEv(pick([`Date with ${fn}. You forgot to check your phone for hours. Rare.`,`You and ${fn} went somewhere new. Both a little nervous. Worth it.`]),'love');
    flash(`Date with ${fn}! 💘`);
  } else if(type==='movie'){
    l.relation=clamp(l.relation+rnd(4,9)); G.happy=clamp(G.happy+rnd(5,9));
    addEv(`Movie night with ${fn}. Couch, snacks, the whole thing. Exactly right.`,'love');
    flash(`🎬 Movie night`);
  } else if(type==='convo'){
    l.relation=clamp(l.relation+rnd(5,12)); G.happy=clamp(G.happy+rnd(4,9));
    addEv(pick([`You and ${fn} had a 2am conversation about life. No answers. Best night in weeks.`,`Deep talk with ${fn}. The kind where time disappears.`]),'love');
    flash(`💬 Deep talk with ${fn}`);
  } else if(type==='makeout'){
    l.relation=clamp(l.relation+rnd(6,12)); G.happy=clamp(G.happy+rnd(7,12));
    l.milestones = l.milestones || {};
    if(!l.milestones.firstKiss){ l.milestones.firstKiss = true; addEv(`First kiss with ${fn}. Time paused.`, 'love'); }
    addEv(pick([`You and ${fn} had a moment. The kind you replay.`,`A completely unplanned moment with ${fn}. Perfect.`]),'love');
    flash(`😘`);
  } else if(type==='intimate'){
    l.relation=clamp(l.relation+rnd(8,15)); G.happy=clamp(G.happy+rnd(8,14));
    l.milestones = l.milestones || {};
    if(!l.milestones.intimate){ l.milestones.intimate = true; addEv(`You and ${fn} crossed a new line together.`, 'love'); }
    addEv(`Intimate with ${fn}. Something deepened between you.`,'love');
    flash(`🔥`);
  } else if(type==='special'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=rnd(200,600); l.relation=clamp(l.relation+rnd(14,22)); G.happy=clamp(G.happy+rnd(12,20));
    addEv(pick([`You planned something special for ${fn}. The look on their face was worth every cent.`,`Special evening with ${fn}. You put in the effort. It showed.`]),'love');
    flash(`✨ Special date! +Big relationship boost`,'good');
  } else if(type==='fight'){
    l.relation=clamp(l.relation-rnd(12,22)); G.happy=clamp(G.happy-rnd(7,13));
    addEv(`You and ${fn} had a bad fight. ${Math.random()>0.5?'Things were said.':'It got loud.'}`,'bad');
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='propose'){
    if(G.age<18){ flash('Too young to propose.','warn'); return; }
    if(l.relation>70){
      l.role='Partner'; G.happy=clamp(G.happy+22);
      l.milestones = l.milestones || {};
      l.milestones.engaged = true;
      addEv(`You proposed to ${fn}. They said YES! 💍 You both cried. It was perfect.`,'love');
      flash(`Engaged to ${fn}! 💍`,'good');
    } else {
      G.lovers=G.lovers.filter(x=>x.name!==name);
      G.happy=clamp(G.happy-26);
      addEv(`You proposed to ${fn}. They said no. Then immediately blocked you.`,'bad');
      flash('Rejected. Forever remembered.','bad');
    }
  } else if(type==='wedding'){
    if(l.role!=='Partner'){ flash('Need to be engaged first','warn'); return; }
    if(G.money<5000){ flash('Need $5,000 for a wedding','warn'); return; }
    const weddingCost = rnd(5000,30000);
    if(G.money<weddingCost){ flash(`Wedding costs ${fmt$(weddingCost)}. Save up.`,'warn'); return; }
    G.money -= weddingCost;
    l.married = true;
    G.spouse = {...l, role:'Spouse', anniversaryYear:G.age};
    G.spouse.milestones = G.spouse.milestones || {};
    G.spouse.milestones.married = true;
    G.marriageYears = 0;
    G.lovers = G.lovers.filter(x=>x.name!==name);
    G.happy = clamp(G.happy+28);
    G.social.reputation = clamp(G.social.reputation+rnd(5,10));
    addEv(`You married ${fn}! 💒 ${fmt$(weddingCost)} wedding. ${pick(['It was perfect.','The speeches made people cry.','Everybody danced.','Best day of your life, and you\'ve had some good ones.'])} (-${fmt$(weddingCost)})`,'love');
    flash(`💒 Married ${fn}!`,'good');
  } else if(type==='cheat'){
    G.darkScore++;
    if(Math.random()<0.52){
      G.lovers=G.lovers.filter(x=>x.name!==name);
      G.happy=clamp(G.happy-22); G.social.reputation=clamp(G.social.reputation-14);
      addEv(`You cheated on ${fn}. They found out. They always find out.`,'bad');
      flash(`${fn} is gone.`,'bad');
    } else {
      G.happy=clamp(G.happy+4);
      addEv(`You cheated on ${fn} and got away with it. For now.`,'warn');
    }
  } else if(type==='breakup'){
    G.lovers=G.lovers.filter(x=>x.name!==name);
    G.happy=clamp(G.happy-13);
    addEv(`You broke up with ${fn}. It wasn't right and you both knew it.`,'bad');
    flash(`Broke up with ${fn}.`,'warn');
  }
  updateHUD(); renderRelationships();
}

// ── MEET NEW PEOPLE ──────────────────────────────────────────────
function tryMakeFriend(){
  if(G.age<5){ flash('Too young.','warn'); return; }
  const p = makePerson('Friend');
  p.age = Math.max(0, G.age + rnd(-3,3));
  assignAdultCareer(p);
  const rc = document.getElementById('rel-content');
  rc.innerHTML = `
    <div class="person-card">
      <div class="p-avatar av-friend">🧑</div>
      <div><div class="p-name">${p.name}</div>
      <div class="p-role">Age ${p.age} · ${personStatus(p)}</div></div>
    </div>
    <p style="color:var(--muted2);font-size:.85rem;margin:10px 0">How do you approach them?</p>
    <div class="choice-grid">
      <div class="choice" onclick='doMakeFriend(${JSON.stringify(p).replace(/'/g,"\\'")},"warm")'><div class="choice-icon">😊</div><div class="choice-name">Be Warm</div><div class="choice-desc">Open & friendly</div></div>
      <div class="choice" onclick='doMakeFriend(${JSON.stringify(p).replace(/'/g,"\\'")},"joke")'><div class="choice-icon">😂</div><div class="choice-name">Crack a Joke</div><div class="choice-desc">High risk, high reward</div></div>
      <div class="choice" onclick='doMakeFriend(${JSON.stringify(p).replace(/'/g,"\\'")},"cool")'><div class="choice-icon">😎</div><div class="choice-name">Play it Cool</div><div class="choice-desc">Casual vibes</div></div>
      <div class="choice" onclick="switchRelTab('friends')"><div class="choice-icon">🚶</div><div class="choice-name">Walk Away</div><div class="choice-desc">Maybe another time</div></div>
    </div>`;
}

function doMakeFriend(p, style){
  let rel, ok=true;
  if(style==='warm')      rel = rnd(55,85);
  else if(style==='cool') rel = rnd(40,70);
  else {
    if(Math.random()>.42){ rel = rnd(65,95); }
    else { ok=false; G.happy=clamp(G.happy-4); flash('Joke bombed. Awkward.','bad'); }
  }
  if(ok){
    p.relation = rel; p.compat = rnd(30,90); G.friends.push(p);
    addEv(`New friend: ${p.firstName}! 🤝`,'love');
    G.happy = clamp(G.happy+5);
    flash(`${p.firstName} is now your friend!`);
    updateHUD();
  }
  G.relTab = 'friends';
  renderRelationships();
}

function tryDate(){
  if(G.age<16){ flash('Too young to date.','warn'); return; }
  const p = makePerson('Lover'); p.age = Math.max(16, G.age+rnd(-4,4));
  assignAdultCareer(p);
  const rc = document.getElementById('rel-content');
  rc.innerHTML = `
    <div class="person-card">
      <div class="p-avatar av-love">❤️</div>
      <div><div class="p-name">${p.name}</div>
      <div class="p-role">Age ${p.age} · ${personStatus(p)}</div></div>
    </div>
    <p style="color:var(--muted2);font-size:.85rem;margin:10px 0">You notice ${p.firstName}...</p>
    <div class="choice-grid">
      <div class="choice" onclick='doDate(${JSON.stringify(p).replace(/'/g,"\\'")},"ask")'><div class="choice-icon">💬</div><div class="choice-name">Ask Them Out</div><div class="choice-desc">Bold move</div></div>
      <div class="choice" onclick='doDate(${JSON.stringify(p).replace(/'/g,"\\'")},"flirt")'><div class="choice-icon">😏</div><div class="choice-name">Flirt First</div><div class="choice-desc">Warm them up</div></div>
      <div class="choice" onclick="addEv('You admired someone from afar. Said nothing. Classic.','warn');G.relTab='romance';renderRelationships()"><div class="choice-icon">👀</div><div class="choice-name">Admire From Afar</div><div class="choice-desc">Safe. Lonely.</div></div>
    </div>`;
}

function doDate(p, style){
  const bonus    = G.looks/200;
  const threshold = style==='ask' ? .46 : .36;
  if(Math.random()+bonus > threshold){
    p.relation = rnd(60,90); p.role='Lover'; p.compat = rnd(30,90); G.lovers.push(p);
    addEv(`You and ${p.firstName} started dating! ❤️`,'love');
    G.happy = clamp(G.happy+16);
    flash(`${p.firstName} said yes! 💕`,'good');
    updateHUD();
  } else {
    addEv(`You asked ${p.firstName} out. They said no. They were kind about it. Somehow worse.`,'bad');
    G.happy = clamp(G.happy-8);
    flash('They said no. Ouch.','bad');
    updateHUD();
  }
  G.relTab = 'romance';
  renderRelationships();
}

// ══════════════════════════════════════════════════════════════
//  FRIENDS TAB
// ══════════════════════════════════════════════════════════════
function renderFriendsTab(){
  const alive = G.friends.filter(f=>f.alive);
  let html = '';
  if(!alive.length) html += `<div class="notif warn" style="margin-bottom:12px">No friends yet. Go meet people.</div>`;

  alive.forEach(f=>{
    const n = f.name;
    const status = personStatus(f);
    html+=`
    <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:11px;width:100%">
        <div class="p-avatar av-friend">🧑</div>
        <div style="flex:1">
          <div class="p-name">${f.name}</div>
          <div class="p-role">Friend · Age ${f.age||'?'} · ${relLabel(f.relation)} · Compat ${f.compat||'?'}%</div>
          <div style="font-size:.68rem;color:var(--muted2)">${status}</div>
          <div class="p-rel-wrap" style="margin-top:3px">
            <div class="p-rel-track" style="width:80px">
              <div class="p-rel-fill" style="width:${f.relation}%;background:${f.relation>=65?'var(--accent)':f.relation>=40?'var(--gold)':'var(--danger)'}"></div>
            </div>
          </div>
        </div>
        <div style="font-family:var(--fh);font-size:.78rem;color:var(--muted2)">${f.relation}%</div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','hangout')">🍺 Hang Out</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','meal')">🍽️ Grab Food</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','compliment')">💬 Compliment</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','advice')">🧠 Ask Advice</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','compete')">🏆 Compete</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','loan')">💸 Lend Money</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger)" onclick="friendAct('${n}','ditch')">🚮 Ditch</button>
      </div>
    </div>`;
  });

  if(G.age>=5){
    html += `<button class="btn btn-ghost" style="width:100%;margin-top:8px" onclick="tryMakeFriend()">+ Meet Someone New</button>`;
  }
  return html;
}

function friendAct(name, type){
  const f = G.friends.find(x=>x.name===name);
  if(!f||!f.alive){ flash('Can\'t find them.','warn'); return; }
  const fn = f.firstName;
  const compBoost = f.compat>=70 ? 2 : f.compat<=40 ? -2 : 0;

  if(type==='hangout'){
    const eligible = HANGOUT_EVENTS.filter(e=>G.age>=e.minAge);
    const ev  = pick(eligible);
    const msg = ev.msg.replace(/{f}/g, fn);
    G.happy=clamp(G.happy+ev.happyD); G.health=clamp(G.health+ev.healthD);
    G.smarts=clamp(G.smarts+ev.smartsD); G.money+=ev.moneyD;
    G.social.reputation=clamp(G.social.reputation+ev.repD);
    f.relation=clamp(f.relation+rnd(4,10)+compBoost);
    addEv(msg, ev.type); flash(`Hung out with ${fn}!`);
  } else if(type==='meal'){
    const cost=rnd(20,60); G.money-=cost;
    f.relation=clamp(f.relation+rnd(5,12)+compBoost); G.happy=clamp(G.happy+rnd(5,9));
    addEv(`Grabbed food with ${fn}. (-$${cost}) Easy conversation.`,'love');
    flash(`🍽️ Food with ${fn}`);
  } else if(type==='compliment'){
    if(Math.random()>.18){
      f.relation=clamp(f.relation+rnd(5,10)+compBoost); G.happy=clamp(G.happy+4);
      addEv(`You said something genuine to ${fn}. People don't do that enough.`);
      flash(`${fn} appreciated that 💚`);
    } else {
      addEv(`You complimented ${fn} and it came out weird. Polite smile. Awkward.`,'warn');
      flash('That landed oddly.','warn');
    }
  } else if(type==='advice'){
    G.smarts=clamp(G.smarts+rnd(1,4)); G.happy=clamp(G.happy+rnd(3,7));
    f.relation=clamp(f.relation+rnd(3,8));
    addEv(`You asked ${fn} for advice. They gave it straight. You needed to hear it.`,'good');
    flash(`+Smarts · advice from ${fn}`,'good');
  } else if(type==='compete'){
    if(Math.random()<.5){
      G.happy=clamp(G.happy+9); f.relation=clamp(f.relation-4);
      addEv(`You beat ${fn}. You were gracious about it. (You weren't.)`);
      flash('You won. Friend slightly annoyed.');
    } else {
      G.happy=clamp(G.happy-4); f.relation=clamp(f.relation+5);
      addEv(`${fn} beat you. You congratulated them through gritted teeth.`,'warn');
    }
  } else if(type==='loan'){
    const amt = rnd(50,500);
    if(G.money<amt){ flash(`You don't have $${amt} to lend`,'warn'); return; }
    G.money-=amt;
    f.relation=clamp(f.relation+rnd(8,16));
    const repaid = Math.random()<0.6;
    if(repaid){
      addEv(`You lent ${fn} $${amt}. They paid it back. Every cent. You thought about this more than you'd admit.`,'good');
      G.money+=amt;
    } else {
      addEv(`You lent ${fn} $${amt}. It's been a while. The money: gone. The friendship: complicated.`,'warn');
    }
    flash(repaid?`${fn} paid back $${amt}!`:`Lent ${fn} $${amt}`,'warn');
  } else if(type==='ditch'){
    G.friends=G.friends.filter(x=>x.name!==name);
    G.happy=clamp(G.happy+rnd(-5,2));
    addEv(`You cut ${fn} out. Clean break. Whether it was right is another question.`,'warn');
    flash(`${fn} removed from your life`,'warn');
  }
  updateHUD(); renderRelationships();
}

// ══════════════════════════════════════════════════════════════
//  CHILDREN TAB
// ══════════════════════════════════════════════════════════════
function renderChildrenTab(){
  const living = G.children.filter(c=>c.alive);
  let html = '';

  if(!living.length){
    html += `<div class="notif warn" style="margin-bottom:12px">No children yet.</div>`;
  }

  living.forEach(c=>{
    const n = c.name;
    const status = personStatus(c);
    const isAdult = c.age>=18;
    html+=`
    <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:11px;width:100%">
        <div class="p-avatar" style="background:linear-gradient(135deg,#1e3f5f,#1e5f4f)">${c.age<5?'👶':c.age<13?'🧒':c.age<18?'👦':'🧑'}</div>
        <div style="flex:1">
          <div class="p-name">${c.name} <span style="font-size:.7rem;color:var(--muted2)">· your child</span></div>
          <div class="p-role">Age ${c.age} · ${relLabel(c.relation)}${c.custody?` · Custody: ${c.custody}`:''}</div>
          <div style="font-size:.68rem;color:var(--muted2)">${status}</div>
          <div class="p-rel-wrap" style="margin-top:3px">
            <div class="p-rel-track" style="width:80px">
              <div class="p-rel-fill" style="width:${c.relation}%;background:${c.relation>=65?'var(--accent)':c.relation>=40?'var(--gold)':'var(--danger)'}"></div>
            </div>
          </div>
        </div>
        <div style="font-family:var(--fh);font-size:.78rem;color:var(--muted2)">${c.relation}%</div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
        <button class="btn btn-ghost btn-sm" onclick="childAct('${n}','time')">🎮 Spend Time</button>
        <button class="btn btn-ghost btn-sm" onclick="childAct('${n}','gift')">🎁 Gift</button>
        <button class="btn btn-ghost btn-sm" onclick="childAct('${n}','teach')">📖 Teach</button>
        <button class="btn btn-ghost btn-sm" onclick="childAct('${n}','praise')">⭐ Praise</button>
        ${!isAdult?`<button class="btn btn-ghost btn-sm" onclick="childAct('${n}','push')">💪 Push Them</button>`:''}
        ${isAdult?`<button class="btn btn-ghost btn-sm" onclick="childAct('${n}','advice')">🧠 Give Advice</button>`:''}
        ${isAdult?`<button class="btn btn-ghost btn-sm" onclick="childAct('${n}','uni')">🎓 Fund Uni</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="childAct('${n}','hug')">🤗 Hug</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger)" onclick="childAct('${n}','neglect')">😔 Neglect</button>
      </div>
    </div>`;
  });

  // Options: try for baby, adopt
  html += `<div class="card" style="margin-top:12px">
    <div class="card-title">Expand Your Family</div>
    <div class="choice-grid">
      ${G.spouse&&G.age>=18&&G.age<=48?`<div class="choice" onclick="tryForBaby()"><div class="choice-icon">🍼</div><div class="choice-name">Try for a Baby</div><div class="choice-desc">With your spouse</div></div>`:''}
      ${G.age>=21?`<div class="choice" onclick="tryAdopt()"><div class="choice-icon">💗</div><div class="choice-name">Adopt a Child</div><div class="choice-desc">Give a child a home · $3,000+</div></div>`:''}
    </div>
  </div>`;

  return html;
}

function childAct(name, type){
  const c = G.children.find(x=>x.name===name);
  if(!c||!c.alive){ flash('Can\'t find them.','warn'); return; }
  const fn = c.firstName;
  const isAdult = c.age>=18;

  if(type==='time'){
    c.relation=clamp(c.relation+rnd(6,14)); G.happy=clamp(G.happy+rnd(8,14));
    addEv(c.age<5
      ? `You played with ${fn}. Pure joy. No complications. Just blocks and sounds and laughter.`
      : c.age<13
        ? pick([`You and ${fn} played video games for hours. They beat you three times. You let them once.`,`You took ${fn} to the park. Simple. Perfect.`])
        : pick([`You hung out with ${fn}. They're becoming their own person. Remarkable and terrifying.`,`You and ${fn} watched a movie together. They fell asleep. You didn't move.`])
    ,'love');
    flash(`+Relationship with ${fn} 💚`);
  } else if(type==='gift'){
    const cost = c.age<13 ? rnd(20,80) : rnd(50,200);
    if(G.money<cost){ flash(`Need $${cost}`,'warn'); return; }
    G.money-=cost;
    c.relation=clamp(c.relation+rnd(8,16)); G.happy=clamp(G.happy+rnd(5,10));
    addEv(`You got ${fn} ${c.age<5?'a toy':'a gift'}. The reaction was everything. (-$${cost})`,'love');
    flash(`${fn} loved it! 🎁`);
  } else if(type==='teach'){
    c.relation=clamp(c.relation+rnd(3,8));
    G.smarts=clamp(G.smarts+rnd(1,3));
    addEv(c.age<13
      ? `You taught ${fn} something today. You could see the moment it clicked.`
      : `You shared something you know with ${fn}. They actually listened.`
    ,'good');
    flash(`+Relationship · taught ${fn} 📖`,'good');
  } else if(type==='praise'){
    c.relation=clamp(c.relation+rnd(5,11)); G.happy=clamp(G.happy+rnd(4,8));
    addEv(`You told ${fn} you were proud of them. They didn't say much. It landed.`,'love');
    flash(`⭐ ${fn} appreciated it`);
  } else if(type==='push'){
    if(Math.random()>0.4){
      c.relation=clamp(c.relation-rnd(3,8)); G.happy=clamp(G.happy-3);
      addEv(`You pushed ${fn} hard this year. They resented it a little. Might pay off.`,'warn');
      flash(`${fn} pushed hard. -Relationship`,'warn');
    } else {
      c.relation=clamp(c.relation+rnd(2,6)); G.happy=clamp(G.happy+4);
      addEv(`You pushed ${fn} and they rose to it. The pride in both of you is real.`,'good');
      flash(`${fn} responded well! +Relationship`,'good');
    }
  } else if(type==='hug'){
    c.relation=clamp(c.relation+rnd(4,10)); G.happy=clamp(G.happy+rnd(5,10));
    addEv(`You hugged ${fn}. They let you for a second longer than usual.`,'love');
    flash(`🤗`);
  } else if(type==='advice'){
    c.relation=clamp(c.relation+rnd(4,10));
    addEv(`You gave ${fn} advice. They're ${c.age}. Whether they take it is entirely up to them.`,'good');
    flash(`Advice given to ${fn}`,'good');
  } else if(type==='uni'){
    const cost=rnd(10000,25000);
    if(G.money<cost){ flash(`Need ${fmt$(cost)}`,'bad'); return; }
    G.money-=cost;
    if(!c.uniEnrolled){ c.uniEnrolled=true; c.uniCourse=pick(['Medicine','Law','Engineering','Business','Computer Science','Arts','Psychology']); }
    c.relation=clamp(c.relation+rnd(8,16));
    addEv(`You funded ${fn}'s university education. (-${fmt$(cost)}) They'll carry this with them.`,'love');
    flash(`${fn} funded for uni! 🎓`,'good');
  } else if(type==='neglect'){
    c.relation=clamp(c.relation-rnd(8,16)); G.happy=clamp(G.happy-rnd(5,10));
    G.darkScore++;
    addEv(`You neglected ${fn} this year. They noticed. They always notice.`,'bad');
    flash(`-Relationship with ${fn}`,'bad');
  }
  updateHUD(); renderRelationships();
}

function haveChild(otherParent){
  const gender = pick(['male','female']);
  const fn = gender==='male' ? pick(NM) : pick(NF);
  const child = {
    name: `${fn} ${G.lastname}`,
    firstName: fn,
    gender,
    role: 'Child',
    relation: rnd(70,90),
    alive: true,
    age: 0,
    career: null,
    uniEnrolled: false,
    uniCourse: '',
    uniYear: 0,
    adopted: false,
    custody: 'you',
  };
  G.children.push(child);
  return child;
}

function tryForBaby(){
  if(!G.spouse){ flash('Need a spouse to try for a baby','warn'); return; }
  if(G.age>48){ flash('Too old to have children naturally','warn'); return; }
  if(Math.random()<0.55){
    const c = haveChild(G.spouse);
    G.happy=clamp(G.happy+rnd(15,25));
    addEv(`${G.spouse.firstName} is pregnant! ${c.firstName} will arrive soon.`,'love');
    flash('🍼 Baby on the way!','good');
  } else {
    addEv('You tried for a baby. It didn\'t happen this time. Keep trying or give it time.','warn');
    flash('Not this time. Keep trying.','warn');
  }
  renderRelationships();
}

function tryAdopt(){
  if(G.money<3000){ flash('Adoption costs at least $3,000','warn'); return; }
  const cost = rnd(3000,15000);
  if(G.money<cost){ flash(`This adoption costs ${fmt$(cost)}`,'warn'); return; }
  G.money -= cost;
  const gender = pick(['male','female']);
  const fn = gender==='male' ? pick(NM) : pick(NF);
  const childAge = rnd(0,12);
  const child = {
    name:`${fn} ${G.lastname}`,
    firstName:fn, gender, role:'Child',
    relation:rnd(55,80), alive:true, age:childAge,
    career:null, uniEnrolled:false, uniCourse:'', uniYear:0, adopted:true,
    custody: 'you',
  };
  G.children.push(child);
  G.happy=clamp(G.happy+rnd(14,22));
  addEv(`You adopted ${fn}, age ${childAge}. They looked at you and your entire world reoriented. (-${fmt$(cost)})`,'love');
  flash(`💗 Adopted ${fn}!`,'good');
  renderRelationships();
}

// ══════════════════════════════════════════════════════════════
//  PETS TAB
// ══════════════════════════════════════════════════════════════
const PET_SPECIES = [
  { id:'dog',    label:'Dog',    icon:'🐶', minAge:8,  fee:[120,650], annual:[350,1500], lifespan:[10,15] },
  { id:'cat',    label:'Cat',    icon:'🐱', minAge:8,  fee:[90,450],  annual:[280,1200], lifespan:[12,18] },
  { id:'bird',   label:'Bird',   icon:'🦜', minAge:10, fee:[60,300],  annual:[120,650],  lifespan:[6,12] },
  { id:'rabbit', label:'Rabbit', icon:'🐰', minAge:8,  fee:[50,220],  annual:[140,700],  lifespan:[7,12] },
  { id:'reptile',label:'Reptile',icon:'🦎', minAge:12, fee:[100,550], annual:[180,900],  lifespan:[8,16] },
];

const PET_NAMES = [
  'Milo','Luna','Coco','Rocky','Bella','Simba','Nala','Mocha','Pepper','Oreo',
  'Daisy','Leo','Chai','Loki','Mochi','Scout','Biscuit','Maple','Poppy','Nova'
];

function ensurePetState(){
  if(!Array.isArray(G.pets)) G.pets = [];
  G.pets.forEach(p=>{
    if(typeof p.alive!=='boolean') p.alive = true;
    if(typeof p.health!=='number') p.health = 70;
    if(typeof p.happiness!=='number') p.happiness = 65;
    if(typeof p.bond!=='number') p.bond = 55;
    if(typeof p.age!=='number') p.age = 0;
    if(typeof p.annualCost!=='number') p.annualCost = 350;
    if(typeof p.lifespan!=='number') p.lifespan = 12;
  });
}

function renderPetsTab(){
  ensurePetState();
  const alive = G.pets.filter(p=>p.alive);
  const departed = G.pets.filter(p=>!p.alive);
  let html = '';

  html += `<div class="card">
    <div class="card-title">Pets</div>
    <p style="font-size:.78rem;color:var(--muted2)">Companionship lowers stress but adds annual care costs and responsibility.</p>
  </div>`;

  if(alive.length){
    alive.forEach(p=>{
      html += `
      <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:11px;width:100%">
          <div class="p-avatar av-friend">${p.icon||'🐾'}</div>
          <div style="flex:1">
            <div class="p-name">${p.name}</div>
            <div class="p-role">${p.label||p.species||'Pet'} · Age ${p.age} · Annual care ${fmt$(p.annualCost||0)}</div>
            <div class="p-role">Bond ${p.bond}% · Health ${p.health}% · Happiness ${p.happiness}%</div>
          </div>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
          <button class="btn btn-ghost btn-sm" onclick="petAct('${p.id}','play')">🎾 Play</button>
          <button class="btn btn-ghost btn-sm" onclick="petAct('${p.id}','feed')">🍖 Feed</button>
          <button class="btn btn-ghost btn-sm" onclick="petAct('${p.id}','train')">🦴 Train</button>
          <button class="btn btn-ghost btn-sm" onclick="petAct('${p.id}','groom')">🧼 Groom</button>
          <button class="btn btn-ghost btn-sm" onclick="petAct('${p.id}','vet')">🩺 Vet</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger)" onclick="petAct('${p.id}','rehome')">🏠 Rehome</button>
        </div>
      </div>`;
    });
  } else {
    html += `<div class="notif warn" style="margin-bottom:12px">No pets yet.</div>`;
  }

  html += `<div class="card"><div class="card-title">Adopt a Pet</div><div class="choice-grid">`;
  PET_SPECIES.forEach(s=>{
    html += `<div class="choice" onclick="adoptPet('${s.id}')">
      <div class="choice-icon">${s.icon}</div>
      <div class="choice-name">${s.label}</div>
      <div class="choice-desc">Adoption ${fmt$(rnd(s.fee[0], s.fee[1]))} · lifespan ${s.lifespan[0]}-${s.lifespan[1]} yr</div>
    </div>`;
  });
  html += `</div></div>`;

  if(departed.length){
    html += `<div class="card"><div class="card-title">In Memory</div>`;
    departed.forEach(p=>{
      html += `<div style="font-size:.8rem;color:var(--muted2);padding:3px 0">✝ ${p.name} · ${p.label||p.species} · Age ${p.age}</div>`;
    });
    html += `</div>`;
  }
  return html;
}

function adoptPet(speciesId){
  ensurePetState();
  const s = PET_SPECIES.find(x=>x.id===speciesId);
  if(!s){ flash('Species not found','warn'); return; }
  if(G.age < s.minAge){ flash(`${s.label} adoption unlocks at age ${s.minAge}.`,'warn'); return; }
  const fee = rnd(s.fee[0], s.fee[1]);
  if(G.age>=18){
    if(G.money<fee){ flash(`Need ${fmt$(fee)} for adoption fees.`,'warn'); return; }
    G.money -= fee;
  }
  const name = pick(PET_NAMES);
  const pet = {
    id:`pet_${G.age}_${Math.random().toString(36).slice(2,8)}`,
    species:s.id, label:s.label, icon:s.icon,
    name,
    age:0,
    health:rnd(62,90),
    happiness:rnd(60,90),
    bond:rnd(45,72),
    annualCost:rnd(s.annual[0], s.annual[1]),
    lifespan:rnd(s.lifespan[0], s.lifespan[1]),
    alive:true,
  };
  G.pets.push(pet);
  G.happy = clamp(G.happy + rnd(6,14));
  G.stress = clamp((G.stress||35) - rnd(4,10));
  addEv(`You adopted ${name} the ${s.label.toLowerCase()}. Your home instantly felt warmer.${G.age>=18?` (-${fmt$(fee)})`:''}`, 'love');
  flash(`${s.icon} ${name} joined your family!`,'good');
  updateHUD();
  renderRelationships();
}

function petAct(petId, action){
  ensurePetState();
  const p = G.pets.find(x=>x.id===petId);
  if(!p || !p.alive){ flash('Pet not found.','warn'); return; }

  if(action==='play'){
    p.happiness = clamp(p.happiness + rnd(8,16));
    p.bond = clamp(p.bond + rnd(5,10));
    G.happy = clamp(G.happy + rnd(3,8));
    G.stress = clamp((G.stress||35) - rnd(3,7));
    addEv(`You spent quality play time with ${p.name}.`, 'good');
  } else if(action==='feed'){
    const cost = rnd(15,70);
    if(G.age>=18 && G.money<cost){ flash(`Need ${fmt$(cost)} for food.`,'warn'); return; }
    if(G.age>=18) G.money -= cost;
    p.health = clamp(p.health + rnd(3,9));
    p.happiness = clamp(p.happiness + rnd(2,6));
    addEv(`You stocked up food and fed ${p.name}.${G.age>=18?` (-${fmt$(cost)})`:''}`, 'good');
  } else if(action==='train'){
    p.bond = clamp(p.bond + rnd(4,9));
    p.happiness = clamp(p.happiness + rnd(1,5));
    G.smarts = clamp(G.smarts + rnd(0,2));
    G.stress = clamp((G.stress||35) - rnd(1,4));
    addEv(`Training session with ${p.name}. Better behavior, stronger bond.`, 'good');
  } else if(action==='groom'){
    const cost = rnd(40,180);
    if(G.age>=18 && G.money<cost){ flash(`Need ${fmt$(cost)} for grooming.`,'warn'); return; }
    if(G.age>=18) G.money -= cost;
    p.happiness = clamp(p.happiness + rnd(2,7));
    p.health = clamp(p.health + rnd(1,4));
    G.happy = clamp(G.happy + rnd(1,4));
    addEv(`${p.name} got groomed and looks immaculate.${G.age>=18?` (-${fmt$(cost)})`:''}`, 'good');
  } else if(action==='vet'){
    const cost = rnd(120,950);
    if(G.age>=18 && G.money<cost){ flash(`Need ${fmt$(cost)} for vet care.`,'warn'); return; }
    if(G.age>=18) G.money -= cost;
    p.health = clamp(p.health + rnd(12,24));
    p.happiness = clamp(p.happiness + rnd(3,9));
    G.stress = clamp((G.stress||35) - rnd(2,5));
    addEv(`Vet visit for ${p.name}. They are doing much better now.${G.age>=18?` (-${fmt$(cost)})`:''}`, 'good');
  } else if(action==='rehome'){
    p.alive = false;
    p.health = clamp(p.health);
    G.happy = clamp(G.happy - rnd(7,16));
    G.stress = clamp((G.stress||35) + rnd(4,10));
    addEv(`You rehomed ${p.name}. It was the practical decision, but it hurt.`, 'warn');
  }

  updateHUD();
  renderRelationships();
}



