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

function ensureRelationshipDramaState(){
  if(!G.social) G.social = { reputation:50, dramaFlags:{} };
  if(typeof G.social.reputation!=='number') G.social.reputation = 50;
  if(!G.social.dramaFlags || typeof G.social.dramaFlags!=='object') G.social.dramaFlags = {};
  const d = G.social.dramaFlags;
  if(!Array.isArray(d.secretAffairs)) d.secretAffairs = [];
  if(typeof d.cheatingScandals!=='number') d.cheatingScandals = 0;
  if(typeof d.friendDrama!=='number') d.friendDrama = 0;
  if(typeof d.familyDrama!=='number') d.familyDrama = 0;
}

function ensurePersonRelationshipMemory(p){
  if(!p || typeof p!=='object') return;
  if(typeof p.relation!=='number') p.relation = 50;
  if(!p.relMemory || typeof p.relMemory!=='object') p.relMemory = {};
  const m = p.relMemory;
  if(typeof m.trust!=='number') m.trust = clamp((p.relation||50) + (p.compat ? Math.floor((p.compat-50)/6) : 0));
  if(typeof m.resentment!=='number') m.resentment = Math.max(0, Math.floor((50-(p.relation||50))/3));
  if(typeof m.promisesKept!=='number') m.promisesKept = 0;
  if(typeof m.promisesBroken!=='number') m.promisesBroken = 0;
  if(typeof m.conflicts!=='number') m.conflicts = 0;
  if(typeof m.supportMoments!=='number') m.supportMoments = 0;
  if(typeof m.lastMeaningfulYear!=='number') m.lastMeaningfulYear = G.age||0;
  if(!Array.isArray(m.history)) m.history = [];
}

function ensureRelationshipMemoryState(){
  (G.family||[]).forEach(ensurePersonRelationshipMemory);
  (G.friends||[]).forEach(ensurePersonRelationshipMemory);
  (G.lovers||[]).forEach(ensurePersonRelationshipMemory);
  (G.children||[]).forEach(ensurePersonRelationshipMemory);
  if(G.spouse) ensurePersonRelationshipMemory(G.spouse);
}

function applyRelationshipMemory(p, opts={}){
  ensurePersonRelationshipMemory(p);
  const m = p.relMemory;
  if(typeof opts.trust==='number') m.trust = clamp(m.trust + opts.trust);
  if(typeof opts.resentment==='number') m.resentment = clamp(m.resentment + opts.resentment);
  if(opts.keptPromise){ m.promisesKept += 1; m.trust = clamp(m.trust + 3); m.resentment = clamp(m.resentment - 2); }
  if(opts.brokePromise){ m.promisesBroken += 1; m.trust = clamp(m.trust - 5); m.resentment = clamp(m.resentment + 6); }
  if(opts.conflict){ m.conflicts += 1; m.resentment = clamp(m.resentment + 2); }
  if(opts.support){ m.supportMoments += 1; m.trust = clamp(m.trust + 2); m.resentment = clamp(m.resentment - 1); }
  if(typeof opts.relation==='number'){
    const memoryBias = Math.floor((m.trust - m.resentment)/24);
    p.relation = clamp((p.relation||50) + opts.relation + memoryBias);
  }
  m.lastMeaningfulYear = G.age||0;
  if(opts.note){
    m.history.push({ age:G.age, note:opts.note });
    if(m.history.length>10) m.history.shift();
  }
}

function relationshipMemoryRow(p){
  ensurePersonRelationshipMemory(p);
  const m = p.relMemory;
  return `<div style="font-size:.66rem;color:var(--muted2);margin-top:2px">Trust ${m.trust} · Resent ${m.resentment} · Promises +${m.promisesKept}/-${m.promisesBroken}</div>`;
}

function relationshipPopup(title, body, actions){
  if(typeof showPopup==='function'){
    showPopup(title, body, actions, 'normal');
  } else if(actions && actions[0] && typeof actions[0].onClick==='function'){
    actions[0].onClick();
  }
}

function runCondomChoicePopup(partner, source, onChoice){
  const fn = partner?.firstName || partner?.name || 'your partner';
  relationshipPopup(
    `Protection with ${fn}`,
    `You and ${fn} are about to have sex. Do you want to use a condom?`,
    [
      { label:'Use condom (safer)', cls:'btn-primary', onClick:()=>onChoice(true) },
      { label:'No condom', cls:'btn-ghost', onClick:()=>onChoice(false) },
      { label:'Not tonight', cls:'btn-ghost', onClick:()=>{
        addEv(`You decided to pause with ${fn}.`, 'warn');
        updateHUD(); renderRelationships();
      }},
    ]
  );
}

function applyCheatingScandal(otherName, label){
  ensureRelationshipDramaState();
  const d = G.social.dramaFlags;
  d.cheatingScandals++;
  G.social.reputation = clamp((G.social.reputation||50) - rnd(8,16));
  if(G.sm){
    G.sm.controversies = (G.sm.controversies||0) + 1;
    G.sm.cancelCount = Math.max(0, (G.sm.cancelCount||0) + (Math.random()<0.24?1:0));
  }
  addEv(`Cheating scandal: your involvement with ${otherName} became public (${label}).`, 'bad');
  flash('Cheating scandal exploded.','bad');

  if(G.spouse && G.spouse.alive){
    ensurePersonRelationshipMemory(G.spouse);
    const spouseName = G.spouse.firstName;
    const divorceChance = Math.min(0.9, 0.34 + d.cheatingScandals*0.12 + ((G.spouse.relation||50)<45 ? 0.2 : 0));
    if(Math.random()<divorceChance){
      G.divorces++;
      const split = Math.floor(G.money*0.38 + (G.assets?.homeValue||0)*0.42);
      G.money = Math.max(0, G.money - split);
      addEv(`${spouseName} filed for divorce after the scandal. Settlement cost: ${fmt$(split)}.`, 'bad');
      if(Array.isArray(G.children) && G.children.length){
        G.children.forEach(c=>{
          const r = Math.random();
          c.custody = r < 0.42 ? 'shared' : r < 0.6 ? 'you' : 'other';
          if(c.custody==='other') c.relation = clamp((c.relation||60) - rnd(6,14));
        });
        addEv('Custody arrangements changed after the scandal.', 'warn');
      }
      G.spouse = null;
      G.marriageYears = 0;
    } else {
      G.spouse.relation = clamp((G.spouse.relation||50) - rnd(18,34));
      applyRelationshipMemory(G.spouse, { trust:-18, resentment:18, conflict:true, brokePromise:true, note:'Cheating scandal damaged marriage trust' });
      addEv(`${spouseName} stayed, but trust was badly damaged.`, 'warn');
    }
  }
  if(Array.isArray(G.lovers) && G.lovers.length){
    G.lovers = G.lovers.filter(l=>Math.random()>0.28);
  }
  G.happy = clamp(G.happy - rnd(10,22));
  G.stress = clamp((G.stress||35) + rnd(8,16));
}

function maybeExposeAffair(otherName, label, baseChance=0.24){
  ensureRelationshipDramaState();
  const fameBoost = Math.min(0.22, (G.sm?.totalFame||0)/420);
  const controversyBoost = Math.min(0.16, (G.sm?.controversies||0)/30);
  const chance = Math.max(0.04, Math.min(0.9, baseChance + fameBoost + controversyBoost));
  if(Math.random()<chance){
    applyCheatingScandal(otherName, label);
    return true;
  }
  G.social.dramaFlags.secretAffairs.push({ year:G.age, with:otherName, label });
  if(G.social.dramaFlags.secretAffairs.length>8) G.social.dramaFlags.secretAffairs.shift();
  addEv(`Your secret with ${otherName} stayed hidden for now.`, 'warn');
  return false;
}

function renderRelationships(){
  ensureRelationshipDramaState();
  ensureRelationshipMemoryState();
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
        ${relationshipMemoryRow(p)}
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
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','moment')">🗨️ Moment</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','meal')">🍽️ Meal</button>
      <button class="btn btn-ghost btn-sm" onclick="famAct('${n}','fight')">😤 Fight</button>
      ${G.age>=18?`<button class="btn btn-ghost btn-sm" onclick="famAct('${n}','borrow')">💸 Borrow</button>`:''}
    </div>
  </div>`;
}

function famAct(name, type){
  ensureRelationshipDramaState();
  const p = G.family.find(x=>x.name===name);
  if(!p||!p.alive){ flash('They\'re no longer with us.','warn'); return; }
  ensurePersonRelationshipMemory(p);
  const fn = p.firstName;

  if(type==='call'){
    p.relation = clamp(p.relation + rnd(4,10));
    G.happy    = clamp(G.happy    + rnd(4,8));
    addEv(pick([
      `Called ${fn}. They talked for 40 minutes without asking about you once. Still nice.`,
      `${fn} picked up on the first ring. Something about that hit different.`,
      `You and ${fn} talked for hours. Easier than expected.`,
    ]),'love');
    applyRelationshipMemory(p, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'Answered call and reconnected' });
    flash(`+Relationship with ${fn} 💚`);
  } else if(type==='visit'){
    G.happy = clamp(G.happy+rnd(7,13));
    p.relation = clamp(p.relation+rnd(8,14));
    addEv(pick([
      `You visited ${fn}. They fed you. You stayed too long. Perfect.`,
      `Spent the day with ${fn}. The house smells the same as it always has.`,
      `${fn} was surprised to see you. In the good way.`,
    ]),'love');
    applyRelationshipMemory(p, { trust:rnd(3,6), resentment:-rnd(1,3), support:true, keptPromise:true, note:'In-person family visit' });
    flash(`+Happy +Relationship · visited ${fn}`);
  } else if(type==='moment'){
    relationshipPopup(
      `${fn}: family moment`,
      `${fn} opens up about something real. How do you respond?`,
      [
        { label:'Listen and support', cls:'btn-primary', onClick:()=>{
          p.relation = clamp(p.relation + rnd(8,16));
          G.happy = clamp(G.happy + rnd(4,9));
          addEv(`You listened to ${fn} without judgment. It brought you closer.`, 'love');
          applyRelationshipMemory(p, { trust:rnd(5,9), resentment:-rnd(1,4), support:true, keptPromise:true, note:'Supported during vulnerable moment' });
          updateHUD(); renderRelationships();
        }},
        { label:'Set a hard boundary', cls:'btn-ghost', onClick:()=>{
          p.relation = clamp(p.relation - rnd(1,6));
          G.stress = clamp((G.stress||35) - rnd(0,3));
          addEv(`You set boundaries with ${fn}. It was tense, but healthier long-term.`, 'warn');
          applyRelationshipMemory(p, { trust:rnd(1,3), resentment:rnd(0,2), note:'Set firm boundary in tough talk' });
          updateHUD(); renderRelationships();
        }},
        { label:'Turn it into gossip', cls:'btn-ghost', onClick:()=>{
          p.relation = clamp(p.relation - rnd(8,16));
          G.social.reputation = clamp((G.social.reputation||50) - rnd(2,6));
          G.social.dramaFlags.familyDrama = (G.social.dramaFlags.familyDrama||0) + 1;
          addEv(`Family gossip spread after your conversation with ${fn}. Trust dropped.`, 'bad');
          applyRelationshipMemory(p, { trust:-rnd(6,12), resentment:rnd(6,12), brokePromise:true, conflict:true, note:'Betrayed private conversation' });
          updateHUD(); renderRelationships();
        }},
      ]
    );
    return;
  } else if(type==='meal'){
    const cost = rnd(30,90); G.money -= cost;
    p.relation = clamp(p.relation + rnd(6,13));
    G.happy    = clamp(G.happy    + rnd(6,11));
    addEv(`Dinner with ${fn}. Real conversations. (-$${cost})`,'love');
    applyRelationshipMemory(p, { trust:rnd(2,4), resentment:-rnd(0,2), support:true, note:'Shared meal and conversation' });
    flash(`Meal with ${fn}! 🍽️`);
  } else if(type==='gift'){
    if(G.money<100){ flash('Need $100 for a gift','warn'); return; }
    G.money -= 100;
    p.relation = clamp(p.relation + rnd(8,18));
    G.happy    = clamp(G.happy    + 4);
    addEv(`You got ${fn} a gift. Their face lit up. (-$100)`);
    applyRelationshipMemory(p, { trust:rnd(3,7), resentment:-rnd(0,2), keptPromise:true, note:'Gave meaningful gift' });
    flash(`${fn} loved it! 🎁`);
  } else if(type==='fight'){
    p.relation = clamp(p.relation - rnd(15,25)); G.happy = clamp(G.happy - rnd(8,14));
    addEv(pick([
      `You picked a fight with ${fn} about something old. It got bigger fast.`,
      `You and ${fn} said things that can't be unsaid.`,
    ]),'bad');
    applyRelationshipMemory(p, { trust:-rnd(4,9), resentment:rnd(6,12), conflict:true, brokePromise:true, note:'Escalated into family fight' });
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='borrow'){
    if(p.relation<50){ flash(`${fn} doesn't trust you enough.`,'bad'); return; }
    const amt  = (p.role==='Father'||p.role==='Mother') ? rnd(500,4000) : rnd(100,800);
    if(Math.random()<p.relation/120){
      G.money += amt; p.relation = clamp(p.relation-12);
      addEv(`${fn} lent you ${fmt$(amt)}. They didn't look thrilled.`,'warn');
      applyRelationshipMemory(p, { trust:-rnd(1,4), resentment:rnd(2,6), note:'Borrowed money from family member' });
      flash(`+${fmt$(amt)} from ${fn}`);
    } else {
      p.relation = clamp(p.relation-9);
      addEv(`You asked ${fn} for money. Long pause. "I can't right now." Awkward.`,'bad');
      applyRelationshipMemory(p, { trust:-rnd(2,6), resentment:rnd(3,8), conflict:true, note:'Money ask denied' });
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
          ${G.repro?.pregnant && G.gender==='female' ? `<div style="font-size:.68rem;color:var(--accent3);margin-top:2px">🤰 You are pregnant · due around age ${G.repro.dueAge||'?'}.</div>` : ''}
          ${s.pregnant ? `<div style="font-size:.68rem;color:var(--accent3);margin-top:2px">🤰 ${s.firstName} is pregnant · due around age ${s.pregnantDueAge||'?'}. </div>` : ''}
          ${relationshipMemoryRow(s)}
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
          ${l.pregnant ? `<div style="font-size:.68rem;color:var(--accent3);margin-top:2px">🤰 Pregnant · due around age ${l.pregnantDueAge||'?'}. </div>` : ''}
          ${relationshipMemoryRow(l)}
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
  ensureRelationshipDramaState();
  const s = G.spouse;
  if(!s||!s.alive){ flash('No spouse.','warn'); return; }
  ensurePersonRelationshipMemory(s);
  const fn = s.firstName;

  if(type==='date'){
    const cost=rnd(40,150); G.money-=cost;
    s.relation=clamp(s.relation+rnd(7,15)); G.happy=clamp(G.happy+rnd(10,16));
    addEv(pick([`Date night with ${fn}. You forgot your phones existed.`,`You and ${fn} went out. Table for two. No interruptions. Perfect.`]),'love');
    applyRelationshipMemory(s, { trust:rnd(3,7), resentment:-rnd(1,3), support:true, keptPromise:true, note:'Intentional spouse date night' });
    flash(`Date with ${fn}! 💘`);
  } else if(type==='movie'){
    s.relation=clamp(s.relation+rnd(4,9)); G.happy=clamp(G.happy+rnd(5,10));
    addEv(pick([`Movie night with ${fn}. You both picked something different and compromised badly. Loved every minute.`,`You and ${fn} watched something together. The comments section you provided was unnecessary but appreciated.`]),'love');
    applyRelationshipMemory(s, { trust:rnd(1,4), resentment:-rnd(0,2), note:'Low-stakes quality time together' });
    flash(`Movie night with ${fn} 🎬`);
  } else if(type==='trip'){
    if(G.money<400){ flash('Need $400 for a trip','warn'); return; }
    G.money-=rnd(400,1200); s.relation=clamp(s.relation+rnd(12,22)); G.happy=clamp(G.happy+rnd(14,20));
    addEv(`Trip away with ${fn}. You remembered why you chose each other.`,'love');
    applyRelationshipMemory(s, { trust:rnd(4,8), resentment:-rnd(1,4), keptPromise:true, support:true, note:'Shared getaway restored closeness' });
    flash(`+Relationship · trip with ${fn} ✈️`,'good');
  } else if(type==='convo'){
    const roll = Math.random();
    if(roll>0.25){
      s.relation=clamp(s.relation+rnd(6,12)); G.happy=clamp(G.happy+rnd(5,9));
      addEv(pick([`You and ${fn} had a real conversation. Not about logistics. About everything else.`,`2am conversation with ${fn}. Some things said that needed saying.`]),'love');
      applyRelationshipMemory(s, { trust:rnd(3,7), resentment:-rnd(0,2), support:true, note:'Honest late-night spouse talk' });
    } else {
      s.relation=clamp(s.relation-rnd(3,8)); G.happy=clamp(G.happy-4);
      addEv(`The conversation with ${fn} surfaced something unresolved. Progress, technically.`,'warn');
      applyRelationshipMemory(s, { trust:-rnd(1,4), resentment:rnd(1,4), conflict:true, note:'Conversation reopened unresolved issues' });
    }
    flash(`💬 Deep talk with ${fn}`);
  } else if(type==='makeout'){
    s.relation=clamp(s.relation+rnd(5,12)); G.happy=clamp(G.happy+rnd(6,11));
    addEv(pick([`You and ${fn} had a moment. The good kind.`,`Spontaneous moment with ${fn}. Marriage isn't dead.`]),'love');
    applyRelationshipMemory(s, { trust:rnd(2,5), resentment:-rnd(0,2), note:'Affection without pressure' });
    flash(`😘`);
  } else if(type==='intimate'){
    runCondomChoicePopup(s, 'spouse_intimacy', (usedCondom)=>{
      s.relation=clamp(s.relation+rnd(8,16)); G.happy=clamp(G.happy+rnd(8,14));
      addEv(`Intimate time with ${fn}. The connection: real.${usedCondom?' You used protection.':''}`,'love');
      applyRelationshipMemory(s, { trust:rnd(3,7), resentment:-rnd(1,2), support:true, note:'Intimacy strengthened attachment' });
      if(typeof attemptRelationshipPregnancy==='function'){
        attemptRelationshipPregnancy(s, { condom:usedCondom, source:'spouse_intimacy' });
      }
      flash('🔥','good');
      updateHUD(); renderRelationships();
    });
    return;
  } else if(type==='anniversary'){
    if(G.marriageYears<1){ flash('Not married yet!','warn'); return; }
    const cost=rnd(100,500); G.money-=cost;
    s.relation=clamp(s.relation+rnd(10,20)); G.happy=clamp(G.happy+rnd(12,20));
    addEv(`Anniversary celebration with ${fn}. Year ${G.marriageYears}. You said things worth saying. (-$${cost})`,'love');
    applyRelationshipMemory(s, { trust:rnd(4,9), resentment:-rnd(1,4), keptPromise:true, support:true, note:'Anniversary effort delivered' });
    flash(`🥂 Happy Anniversary!`,'good');
  } else if(type==='counselling'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=200;
    s.relation=clamp(s.relation+rnd(8,18)); G.happy=clamp(G.happy+rnd(3,8));
    addEv(`Marriage counselling with ${fn}. Awkward and necessary. The therapist was good. (-$200)`,'good');
    applyRelationshipMemory(s, { trust:rnd(5,10), resentment:-rnd(2,5), keptPromise:true, support:true, note:'Attended marriage counselling' });
    flash(`+Relationship · counselling 🛋️`,'good');
  } else if(type==='fight'){
    s.relation=clamp(s.relation-rnd(12,22)); G.happy=clamp(G.happy-rnd(8,14));
    addEv(pick([`You and ${fn} had a real fight. Not the kind that passes easily.`,`Things got heated with ${fn}. Some of it was fair. Some of it wasn't.`]),'bad');
    applyRelationshipMemory(s, { trust:-rnd(5,11), resentment:rnd(6,14), conflict:true, brokePromise:true, note:'Major spouse conflict' });
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='cheat'){
    G.darkScore++;
    if(Math.random()<0.58){
      applyCheatingScandal('an affair partner', 'spousal infidelity');
    } else {
      G.happy=clamp(G.happy+4);
      addEv(`You cheated on ${fn} and hid it for now.`, 'warn');
      maybeExposeAffair('an affair partner', 'hidden spousal affair', 0.3);
      flash('Hidden for now.','warn');
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
    applyRelationshipMemory(s, { trust:-20, resentment:20, conflict:true, brokePromise:true, note:'Divorce finalized' });
    flash(`Divorced from ${fn}. -${fmt$(split)}`,'warn');
    G.spouse = null; G.marriageYears = 0;
  }
  updateHUD(); renderRelationships();
}

function relationshipYearsWithPerson(p){
  if(!p || typeof p!=='object') return 0;
  if(typeof p.anniversaryYear==='number' && Number.isFinite(p.anniversaryYear)){
    return Math.max(0, (G.age||0) - p.anniversaryYear);
  }
  if(typeof p.relStartedAge!=='number' || !Number.isFinite(p.relStartedAge)){
    // Older saves may not track start year; default to "not fresh" to avoid over-triggering.
    p.relStartedAge = Math.max(0, (G.age||0) - 2);
  }
  return Math.max(0, (G.age||0) - (p.relStartedAge||0));
}

function maybeGangSpecialDateBetrayal(l){
  const gang = G.crime?.gang;
  if(!l || !gang || !gang.joined) return false;
  const beefLevel = gang.beef?.level || 0;
  const beefScore = gang.beef?.score || 0;
  const highBeef = beefLevel >= 2 || beefScore >= 45;
  if(!highBeef) return false;
  if((l.relation||50) > 45) return false;
  if(relationshipYearsWithPerson(l) >= 2) return false;

  const betrayalChance = Math.max(0.06, Math.min(0.48,
    0.12 +
    ((45 - (l.relation||45)) / 130) +
    (beefLevel>=3 ? 0.11 : 0.05) +
    ((gang.notoriety||0) / 420)
  ));
  if(Math.random() >= betrayalChance) return false;

  const fn = l.firstName || l.name || 'your partner';
  relationshipPopup(
    `Setup on the "Special Date"`,
    `${fn} invited you out, but it was a setup. Rival shooters jumped you because of gang beef.`,
    [
      { label:'What happened?', cls:'btn-primary', onClick:()=>{
        const heat = G.crime?.heat || 0;
        const fatalRisk = Math.max(0.06, Math.min(0.58,
          0.12 + beefLevel*0.08 + heat/320 + (gang.recentViolence||0)/300 - (G.health||50)/260
        ));
        const hardRobberyRisk = 0.58;
        const roll = Math.random();
        const moneyLoss = Math.max(120, Math.floor(Math.min((G.money||0) * 0.36, rnd(350, 9000))));
        const injury = rnd(5, 18);

        G.lovers = (G.lovers||[]).filter(x=>x.name!==l.name);
        applyRelationshipMemory(l, {
          trust:-15, resentment:15, conflict:true, brokePromise:true,
          note:'Partner betrayed and set you up during gang beef'
        });
        G.social.dramaFlags.partnerBetrayals = (G.social.dramaFlags.partnerBetrayals||0) + 1;

        if(roll < fatalRisk){
          addEv(`${fn} betrayed you and set you up. The ambush was fatal.`, 'bad');
          die(`Killed in a gang setup after a special date with ${fn}.`);
          return;
        }
        if(roll < fatalRisk + hardRobberyRisk){
          G.money = Math.max(0, (G.money||0) - moneyLoss);
          G.health = clamp((G.health||80) - injury);
          G.crime.heat = Math.min(100, (G.crime.heat||0) + rnd(7,16));
          addEv(`${fn} betrayed you. You survived, but got robbed for ${fmt$(moneyLoss)} and injured.`, 'bad');
        } else {
          G.health = clamp((G.health||80) - injury);
          G.crime.heat = Math.min(100, (G.crime.heat||0) + rnd(8,18));
          addEv(`${fn} tried to set you up, but you escaped wounded. The relationship is over.`, 'bad');
        }
        updateHUD(); renderRelationships();
      }},
    ]
  );
  return true;
}

function runLoverEncounterPopup(l, type){
  const fn = l.firstName;
  ensurePersonRelationshipMemory(l);
  const complete = ()=>{ updateHUD(); renderRelationships(); };
  if(type==='date'){
    relationshipPopup(`Date with ${fn}`, `How do you play tonight?`, [
      { label:'Go all out', cls:'btn-primary', onClick:()=>{
        const cost = rnd(120,420);
        G.money -= cost;
        l.relation = clamp(l.relation + rnd(12,22));
        G.happy = clamp(G.happy + rnd(10,18));
        addEv(`Luxury date with ${fn}. Sparks everywhere. (-${fmt$(cost)})`, 'love');
        applyRelationshipMemory(l, { trust:rnd(4,8), resentment:-rnd(1,3), keptPromise:true, support:true, note:'High-effort luxury date' });
        if(G.spouse) maybeExposeAffair(fn, 'public date spotted online', 0.26);
        complete();
      }},
      { label:'Keep it low-key', cls:'btn-ghost', onClick:()=>{
        const cost = rnd(30,110);
        G.money -= cost;
        l.relation = clamp(l.relation + rnd(7,13));
        G.happy = clamp(G.happy + rnd(6,11));
        addEv(`Simple date night with ${fn}. Calm and real. (-${fmt$(cost)})`, 'love');
        applyRelationshipMemory(l, { trust:rnd(2,5), resentment:-rnd(0,2), keptPromise:true, note:'Low-key reliable date' });
        complete();
      }},
      { label:'Cancel last minute', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(8,15));
        addEv(`You canceled on ${fn} late. They were hurt.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(4,8), resentment:rnd(4,9), brokePromise:true, note:'Last-minute cancellation' });
        complete();
      }},
    ]);
    return true;
  }
  if(type==='convo'){
    relationshipPopup(`${fn} wants to talk`, `The conversation gets serious.`, [
      { label:'Be honest', cls:'btn-primary', onClick:()=>{
        l.relation = clamp(l.relation + rnd(6,14));
        G.happy = clamp(G.happy + rnd(4,9));
        addEv(`You were vulnerable with ${fn}. It deepened trust.`, 'love');
        applyRelationshipMemory(l, { trust:rnd(4,8), resentment:-rnd(1,3), support:true, note:'Mutual vulnerability in conversation' });
        complete();
      }},
      { label:'Deflect', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(3,9));
        addEv(`You avoided the hard conversation with ${fn}.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(2,5), resentment:rnd(2,5), note:'Avoided hard discussion' });
        complete();
      }},
      { label:'Start a fight', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(10,18));
        G.happy = clamp(G.happy - rnd(5,11));
        addEv(`The talk with ${fn} blew up into an argument.`, 'bad');
        applyRelationshipMemory(l, { trust:-rnd(5,10), resentment:rnd(5,11), conflict:true, note:'Conversation escalated into fight' });
        complete();
      }},
    ]);
    return true;
  }
  if(type==='movie'){
    relationshipPopup(`Movie plan with ${fn}`, `What vibe are you going for tonight?`, [
      { label:'Their pick', cls:'btn-primary', onClick:()=>{
        l.relation = clamp(l.relation + rnd(5,11));
        G.happy = clamp(G.happy + rnd(4,9));
        addEv(`You watched ${fn}'s pick and made them feel seen.`, 'good');
        applyRelationshipMemory(l, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'Chose partner preference' });
        complete();
      }},
      { label:'Your pick', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation + rnd(2,7));
        G.happy = clamp(G.happy + rnd(3,7));
        addEv(`Movie night with ${fn}. You talked more than watched.`, 'love');
        applyRelationshipMemory(l, { trust:rnd(1,3), note:'Shared chill movie night' });
        complete();
      }},
      { label:'Argue about choices', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(3,8));
        addEv(`Movie debate turned into a petty argument with ${fn}.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(1,4), resentment:rnd(2,5), conflict:true, note:'Petty argument over plans' });
        complete();
      }},
    ]);
    return true;
  }
  if(type==='makeout'){
    relationshipPopup(`Chemistry check with ${fn}`, `The tension is obvious.`, [
      { label:'Lean in', cls:'btn-primary', onClick:()=>{
        l.relation = clamp(l.relation + rnd(7,13));
        G.happy = clamp(G.happy + rnd(6,12));
        addEv(`You and ${fn} shared a perfect spontaneous moment.`, 'love');
        applyRelationshipMemory(l, { trust:rnd(2,5), resentment:-rnd(0,2), note:'Spontaneous affection reinforced bond' });
        if(G.spouse) maybeExposeAffair(fn, 'public makeout sighting', 0.2);
        complete();
      }},
      { label:'Keep it subtle', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation + rnd(3,7));
        addEv(`You kept things subtle with ${fn}, but the connection grew.`, 'good');
        applyRelationshipMemory(l, { trust:rnd(1,3), note:'Subtle but positive intimacy signal' });
        complete();
      }},
      { label:'Pull away', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(4,9));
        addEv(`${fn} felt rejected when you pulled away.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(2,5), resentment:rnd(2,5), brokePromise:true, note:'Pulled away during intimate moment' });
        complete();
      }},
    ]);
    return true;
  }
  if(type==='intimate'){
    relationshipPopup(`Private moment with ${fn}`, `Things get intense between you two.`, [
      { label:'Keep it private', cls:'btn-primary', onClick:()=>{
        runCondomChoicePopup(l, 'lover_intimacy', (usedCondom)=>{
          l.relation = clamp(l.relation + rnd(9,16));
          G.happy = clamp(G.happy + rnd(8,14));
          addEv(`An intimate night with ${fn} brought you closer.${usedCondom?' You used protection.':''}`, 'love');
          applyRelationshipMemory(l, { trust:rnd(4,8), resentment:-rnd(1,3), support:true, note:'Private intimacy increased trust' });
          if(typeof attemptRelationshipPregnancy==='function'){
            attemptRelationshipPregnancy(l, { condom:usedCondom, source:'lover_intimacy' });
          }
          if(G.spouse) maybeExposeAffair(fn, 'private affair rumor', 0.24);
          complete();
        });
      }},
      { label:'Post a hint online', cls:'btn-ghost', onClick:()=>{
        runCondomChoicePopup(l, 'lover_intimacy', (usedCondom)=>{
          l.relation = clamp(l.relation + rnd(4,10));
          G.sm.totalFame = clamp((G.sm.totalFame||0) + rnd(1,4));
          addEv(`You posted suggestive clues about ${fn}. Attention surged.${usedCondom?' You used protection.':''}`, 'warn');
          applyRelationshipMemory(l, { trust:-rnd(1,4), resentment:rnd(2,6), note:'Private moment used for public clout' });
          if(typeof attemptRelationshipPregnancy==='function'){
            attemptRelationshipPregnancy(l, { condom:usedCondom, source:'lover_intimacy' });
          }
          if(G.spouse || (G.lovers||[]).length>1) maybeExposeAffair(fn, 'social media leak', 0.42);
          complete();
        });
      }},
      { label:'Back out', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(4,10));
        addEv(`You pulled back with ${fn}. Mixed feelings all around.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(2,5), resentment:rnd(2,5), brokePromise:true, note:'Backed out at vulnerable moment' });
        complete();
      }},
    ]);
    return true;
  }
  if(type==='special'){
    if(maybeGangSpecialDateBetrayal(l)) return true;
    relationshipPopup(`Plan something special for ${fn}?`, `This can be unforgettable if you commit.`, [
      { label:'Grand gesture', cls:'btn-primary', onClick:()=>{
        const cost = rnd(250,900);
        if(G.money<cost){ flash(`Need ${fmt$(cost)}`,'warn'); complete(); return; }
        G.money -= cost;
        l.relation = clamp(l.relation + rnd(14,24));
        G.happy = clamp(G.happy + rnd(12,20));
        addEv(`You planned a huge romantic gesture for ${fn}. It landed perfectly. (-${fmt$(cost)})`, 'love');
        applyRelationshipMemory(l, { trust:rnd(5,10), resentment:-rnd(1,4), keptPromise:true, support:true, note:'Grand gesture delivered' });
        complete();
      }},
      { label:'Thoughtful surprise', cls:'btn-ghost', onClick:()=>{
        const cost = rnd(80,240);
        G.money -= cost;
        l.relation = clamp(l.relation + rnd(8,14));
        G.happy = clamp(G.happy + rnd(7,12));
        addEv(`You surprised ${fn} with something meaningful. (-${fmt$(cost)})`, 'good');
        applyRelationshipMemory(l, { trust:rnd(3,6), resentment:-rnd(1,2), keptPromise:true, note:'Thoughtful surprise strengthened bond' });
        complete();
      }},
      { label:'Do nothing', cls:'btn-ghost', onClick:()=>{
        l.relation = clamp(l.relation - rnd(2,7));
        addEv(`${fn} expected effort and felt disappointed.`, 'warn');
        applyRelationshipMemory(l, { trust:-rnd(2,5), resentment:rnd(2,6), brokePromise:true, note:'Missed expected special effort' });
        complete();
      }},
    ]);
    return true;
  }
  return false;
}

function loveAct(name, type){
  ensureRelationshipDramaState();
  const l = G.lovers.find(x=>x.name===name);
  if(!l||!l.alive){ renderRelationships(); return; }
  ensurePersonRelationshipMemory(l);
  const fn = l.firstName;
  if(['date','movie','convo','makeout','intimate','special'].includes(type)){
    if(runLoverEncounterPopup(l, type)) return;
  }

  if(type==='date'){
    const cost=rnd(30,120); G.money-=cost;
    l.relation=clamp(l.relation+rnd(8,16)); G.happy=clamp(G.happy+rnd(10,16));
    l.milestones = l.milestones || {};
    if(!l.milestones.firstDate){ l.milestones.firstDate = true; addEv(`First real date with ${fn}. You were both nervous.`, 'love'); }
    addEv(pick([`Date with ${fn}. You forgot to check your phone for hours. Rare.`,`You and ${fn} went somewhere new. Both a little nervous. Worth it.`]),'love');
    applyRelationshipMemory(l, { trust:rnd(3,7), resentment:-rnd(1,3), keptPromise:true, support:true, note:'Relationship date night' });
    flash(`Date with ${fn}! 💘`);
  } else if(type==='movie'){
    l.relation=clamp(l.relation+rnd(4,9)); G.happy=clamp(G.happy+rnd(5,9));
    addEv(`Movie night with ${fn}. Couch, snacks, the whole thing. Exactly right.`,'love');
    applyRelationshipMemory(l, { trust:rnd(1,4), resentment:-rnd(0,2), note:'Shared movie downtime' });
    flash(`🎬 Movie night`);
  } else if(type==='convo'){
    l.relation=clamp(l.relation+rnd(5,12)); G.happy=clamp(G.happy+rnd(4,9));
    addEv(pick([`You and ${fn} had a 2am conversation about life. No answers. Best night in weeks.`,`Deep talk with ${fn}. The kind where time disappears.`]),'love');
    applyRelationshipMemory(l, { trust:rnd(3,6), resentment:-rnd(0,2), support:true, note:'Late-night deep talk' });
    flash(`💬 Deep talk with ${fn}`);
  } else if(type==='makeout'){
    l.relation=clamp(l.relation+rnd(6,12)); G.happy=clamp(G.happy+rnd(7,12));
    l.milestones = l.milestones || {};
    if(!l.milestones.firstKiss){ l.milestones.firstKiss = true; addEv(`First kiss with ${fn}. Time paused.`, 'love'); }
    addEv(pick([`You and ${fn} had a moment. The kind you replay.`,`A completely unplanned moment with ${fn}. Perfect.`]),'love');
    applyRelationshipMemory(l, { trust:rnd(2,5), resentment:-rnd(0,2), note:'Affection reinforced chemistry' });
    flash(`😘`);
  } else if(type==='intimate'){
    l.relation=clamp(l.relation+rnd(8,15)); G.happy=clamp(G.happy+rnd(8,14));
    l.milestones = l.milestones || {};
    if(!l.milestones.intimate){ l.milestones.intimate = true; addEv(`You and ${fn} crossed a new line together.`, 'love'); }
    addEv(`Intimate with ${fn}. Something deepened between you.`,'love');
    applyRelationshipMemory(l, { trust:rnd(3,7), resentment:-rnd(1,2), support:true, note:'Intimate connection deepened trust' });
    if(typeof attemptRelationshipPregnancy==='function'){
      attemptRelationshipPregnancy(l, { condom:false, source:'lover_intimacy' });
    }
    flash(`🔥`);
  } else if(type==='special'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=rnd(200,600); l.relation=clamp(l.relation+rnd(14,22)); G.happy=clamp(G.happy+rnd(12,20));
    addEv(pick([`You planned something special for ${fn}. The look on their face was worth every cent.`,`Special evening with ${fn}. You put in the effort. It showed.`]),'love');
    applyRelationshipMemory(l, { trust:rnd(4,8), resentment:-rnd(1,3), keptPromise:true, note:'Special date effort delivered' });
    flash(`✨ Special date! +Big relationship boost`,'good');
  } else if(type==='fight'){
    l.relation=clamp(l.relation-rnd(12,22)); G.happy=clamp(G.happy-rnd(7,13));
    addEv(`You and ${fn} had a bad fight. ${Math.random()>0.5?'Things were said.':'It got loud.'}`,'bad');
    applyRelationshipMemory(l, { trust:-rnd(4,10), resentment:rnd(5,11), conflict:true, brokePromise:true, note:'Romantic conflict escalation' });
    flash(`Fight with ${fn}`,'bad');
  } else if(type==='propose'){
    if(G.age<18){ flash('Too young to propose.','warn'); return; }
    if(l.relation>70){
      l.role='Partner'; G.happy=clamp(G.happy+22);
      l.milestones = l.milestones || {};
      l.milestones.engaged = true;
      addEv(`You proposed to ${fn}. They said YES! 💍 You both cried. It was perfect.`,'love');
      applyRelationshipMemory(l, { trust:rnd(6,12), resentment:-rnd(1,4), keptPromise:true, support:true, note:'Proposal accepted' });
      flash(`Engaged to ${fn}! 💍`,'good');
    } else {
      G.lovers=G.lovers.filter(x=>x.name!==name);
      G.happy=clamp(G.happy-26);
      addEv(`You proposed to ${fn}. They said no. Then immediately blocked you.`,'bad');
      applyRelationshipMemory(l, { trust:-15, resentment:15, conflict:true, brokePromise:true, note:'Proposal rejected' });
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
    applyRelationshipMemory(G.spouse, { trust:rnd(8,14), resentment:-rnd(2,5), keptPromise:true, support:true, note:'Wedding and commitment formalized' });
    flash(`💒 Married ${fn}!`,'good');
  } else if(type==='cheat'){
    G.darkScore++;
    if(Math.random()<0.52){
      G.lovers=G.lovers.filter(x=>x.name!==name);
      G.happy=clamp(G.happy-22); G.social.reputation=clamp(G.social.reputation-14);
      addEv(`You cheated on ${fn}. They found out.`, 'bad');
      applyRelationshipMemory(l, { trust:-15, resentment:15, conflict:true, brokePromise:true, note:'Cheating discovered by lover' });
      if(G.spouse) maybeExposeAffair(fn, 'cheating with lover exposed', 0.5);
      flash(`${fn} is gone.`,'bad');
    } else {
      G.happy=clamp(G.happy+4);
      addEv(`You cheated on ${fn} and hid it for now.`, 'warn');
      applyRelationshipMemory(l, { trust:-rnd(2,6), resentment:rnd(2,6), brokePromise:true, note:'Cheating hidden for now' });
      if(G.spouse) maybeExposeAffair(fn, 'secret lover affair', 0.3);
    }
  } else if(type==='breakup'){
    applyRelationshipMemory(l, { trust:-10, resentment:10, conflict:true, brokePromise:true, note:'Relationship ended by breakup' });
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
    p.relStartedAge = G.age||0;
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
          ${relationshipMemoryRow(f)}
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
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','story')">🎲 Scenario</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','compliment')">💬 Compliment</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','advice')">🧠 Ask Advice</button>
        <button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','compete')">🏆 Compete</button>
        ${G.age>=16?`<button class="btn btn-ghost btn-sm" onclick="friendAct('${n}','hookup')">🔥 Hook Up</button>`:''}
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
  ensureRelationshipDramaState();
  const f = G.friends.find(x=>x.name===name);
  if(!f||!f.alive){ flash('Can\'t find them.','warn'); return; }
  ensurePersonRelationshipMemory(f);
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
    applyRelationshipMemory(f, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'General hangout' });
    addEv(msg, ev.type); flash(`Hung out with ${fn}!`);
  } else if(type==='meal'){
    const cost=rnd(20,60); G.money-=cost;
    f.relation=clamp(f.relation+rnd(5,12)+compBoost); G.happy=clamp(G.happy+rnd(5,9));
    applyRelationshipMemory(f, { trust:rnd(1,4), resentment:-rnd(0,2), note:'Shared meal with friend' });
    addEv(`Grabbed food with ${fn}. (-$${cost}) Easy conversation.`,'love');
    flash(`🍽️ Food with ${fn}`);
  } else if(type==='story'){
    relationshipPopup(
      `${fn}: what kind of night?`,
      `You and ${fn} have the evening free.`,
      [
        { label:'Spontaneous adventure', cls:'btn-primary', onClick:()=>{
          f.relation = clamp(f.relation + rnd(6,13) + compBoost);
          G.happy = clamp(G.happy + rnd(6,12));
          G.stress = clamp((G.stress||35) - rnd(2,5));
          addEv(`You and ${fn} improvised an unforgettable night.`, 'love');
          applyRelationshipMemory(f, { trust:rnd(3,7), resentment:-rnd(1,3), support:true, keptPromise:true, note:'Spontaneous adventure followed through' });
          updateHUD(); renderRelationships();
        }},
        { label:'Venting session', cls:'btn-ghost', onClick:()=>{
          f.relation = clamp(f.relation + rnd(3,8));
          G.happy = clamp(G.happy + rnd(2,6));
          G.stress = clamp((G.stress||35) - rnd(1,4));
          addEv(`You and ${fn} vented about life and left lighter.`, 'good');
          applyRelationshipMemory(f, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'Mutual venting built trust' });
          updateHUD(); renderRelationships();
        }},
        { label:'Flake last minute', cls:'btn-ghost', onClick:()=>{
          f.relation = clamp(f.relation - rnd(4,11));
          G.social.dramaFlags.friendDrama = (G.social.dramaFlags.friendDrama||0) + 1;
          addEv(`You bailed on ${fn}. They took it personally.`, 'warn');
          applyRelationshipMemory(f, { trust:-rnd(3,7), resentment:rnd(3,8), brokePromise:true, note:'Bailed last minute on plans' });
          updateHUD(); renderRelationships();
        }},
      ]
    );
    return;
  } else if(type==='compliment'){
    if(Math.random()>.18){
      f.relation=clamp(f.relation+rnd(5,10)+compBoost); G.happy=clamp(G.happy+4);
      applyRelationshipMemory(f, { trust:rnd(1,4), resentment:-rnd(0,2), support:true, note:'Delivered sincere compliment' });
      addEv(`You said something genuine to ${fn}. People don't do that enough.`);
      flash(`${fn} appreciated that 💚`);
    } else {
      addEv(`You complimented ${fn} and it came out weird. Polite smile. Awkward.`,'warn');
      flash('That landed oddly.','warn');
    }
  } else if(type==='advice'){
    G.smarts=clamp(G.smarts+rnd(1,4)); G.happy=clamp(G.happy+rnd(3,7));
    f.relation=clamp(f.relation+rnd(3,8));
    applyRelationshipMemory(f, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'Sought and respected advice' });
    addEv(`You asked ${fn} for advice. They gave it straight. You needed to hear it.`,'good');
    flash(`+Smarts · advice from ${fn}`,'good');
  } else if(type==='compete'){
    if(Math.random()<.5){
      G.happy=clamp(G.happy+9); f.relation=clamp(f.relation-4);
      applyRelationshipMemory(f, { trust:-rnd(0,3), resentment:rnd(1,4), note:'Won competition with minor ego friction' });
      addEv(`You beat ${fn}. You were gracious about it. (You weren't.)`);
      flash('You won. Friend slightly annoyed.');
    } else {
      G.happy=clamp(G.happy-4); f.relation=clamp(f.relation+5);
      applyRelationshipMemory(f, { trust:rnd(1,4), resentment:-rnd(0,2), note:'Handled losing and respected friend' });
      addEv(`${fn} beat you. You congratulated them through gritted teeth.`,'warn');
    }
  } else if(type==='hookup'){
    relationshipPopup(
      `Chemistry with ${fn}`,
      `The vibe turns romantic. What do you do?`,
      [
        { label:'Make a move', cls:'btn-primary', onClick:()=>{
          const chance = Math.min(0.9, 0.34 + (f.relation||50)/170 + (f.compat||50)/220 + (G.looks||50)/300);
          if(Math.random()<chance){
            f.relation = clamp(f.relation + rnd(10,18));
            G.happy = clamp(G.happy + rnd(8,14));
            addEv(`You hooked up with ${fn}. The friendship changed instantly.`, 'love');
            if(typeof attemptRelationshipPregnancy==='function'){
              attemptRelationshipPregnancy(f, { condom:false, source:'friend_hookup' });
            }
            if(!G.lovers.some(x=>x.name===f.name) && Math.random()<0.72){
              const lover = { ...f, role:'Lover', relation:Math.max(55, f.relation), milestones:{ intimate:true }, relStartedAge:G.age||0 };
              ensurePersonRelationshipMemory(lover);
              G.friends = G.friends.filter(x=>x.name!==f.name);
              G.lovers.push(lover);
              addEv(`${fn} is now more than a friend.`, 'love');
            }
            applyRelationshipMemory(f, { trust:rnd(4,8), resentment:-rnd(1,3), note:'Hookup moved relationship forward' });
            if(G.spouse || G.lovers.length>1) maybeExposeAffair(fn, 'hookup with a friend', 0.28);
          } else {
            f.relation = clamp(f.relation - rnd(10,18));
            addEv(`You made a move on ${fn}. It landed badly and things got awkward.`, 'bad');
            applyRelationshipMemory(f, { trust:-rnd(5,9), resentment:rnd(6,11), conflict:true, note:'Romantic move rejected by friend' });
          }
          updateHUD(); renderRelationships();
        }},
        { label:'Keep it platonic', cls:'btn-ghost', onClick:()=>{
          f.relation = clamp(f.relation + rnd(2,6));
          addEv(`You chose to keep things platonic with ${fn}.`, 'good');
          applyRelationshipMemory(f, { trust:rnd(1,3), resentment:-rnd(0,1), note:'Set platonic boundary clearly' });
          updateHUD(); renderRelationships();
        }},
        { label:'Start a secret affair', cls:'btn-ghost', onClick:()=>{
          f.relation = clamp(f.relation + rnd(6,12));
          G.darkScore++;
          addEv(`You and ${fn} started something secret.`, 'warn');
          applyRelationshipMemory(f, { trust:-rnd(1,4), resentment:rnd(1,4), brokePromise:true, note:'Secret affair started with friend' });
          maybeExposeAffair(fn, 'secret affair with a friend', 0.36);
          updateHUD(); renderRelationships();
        }},
      ]
    );
    return;
  } else if(type==='loan'){
    const amt = rnd(50,500);
    if(G.money<amt){ flash(`You don't have $${amt} to lend`,'warn'); return; }
    G.money-=amt;
    f.relation=clamp(f.relation+rnd(8,16));
    applyRelationshipMemory(f, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, note:'Loaned money to friend' });
    const repaid = Math.random()<0.6;
    if(repaid){
      addEv(`You lent ${fn} $${amt}. They paid it back. Every cent. You thought about this more than you'd admit.`,'good');
      G.money+=amt;
      applyRelationshipMemory(f, { trust:rnd(2,4), resentment:-rnd(0,2), keptPromise:true, note:'Friend repaid loan' });
    } else {
      addEv(`You lent ${fn} $${amt}. It's been a while. The money: gone. The friendship: complicated.`,'warn');
      applyRelationshipMemory(f, { trust:-rnd(2,5), resentment:rnd(2,6), brokePromise:true, note:'Friend did not repay loan' });
    }
    flash(repaid?`${fn} paid back $${amt}!`:`Lent ${fn} $${amt}`,'warn');
  } else if(type==='ditch'){
    applyRelationshipMemory(f, { trust:-10, resentment:10, conflict:true, brokePromise:true, note:'Friendship severed' });
    G.friends=G.friends.filter(x=>x.name!==name);
    G.happy=clamp(G.happy+rnd(-5,2));
    addEv(`You cut ${fn} out. Clean break. Whether it was right is another question.`,'warn');
    flash(`${fn} removed from your life`,'warn');
  }
  updateHUD(); renderRelationships();
}

function relationshipYearPulse(){
  ensureRelationshipDramaState();
  ensureRelationshipMemoryState();
  const d = G.social.dramaFlags;
  const aliveFriends = (G.friends||[]).filter(f=>f && f.alive!==false);
  const aliveFamily = (G.family||[]).filter(f=>f && f.alive!==false);
  const aliveLovers = (G.lovers||[]).filter(l=>l && l.alive!==false);

  const allTracked = aliveFriends.concat(aliveFamily).concat(aliveLovers).concat(G.spouse?[G.spouse]:[]);
  allTracked.forEach(p=>{
    ensurePersonRelationshipMemory(p);
    const m = p.relMemory;
    if((G.age - (m.lastMeaningfulYear||G.age))>=2){
      m.trust = clamp(m.trust - rnd(1,3));
      if(Math.random()<0.45) m.resentment = clamp(m.resentment + rnd(0,2));
    } else if(Math.random()<0.35){
      m.resentment = clamp(m.resentment - rnd(0,1));
    }
  });

  if(aliveFriends.length && Math.random()<0.18){
    const f = pick(aliveFriends);
    const fm = f.relMemory||{};
    const positiveChance = Math.max(0.2, Math.min(0.85, 0.46 + (fm.trust||50)/260 - (fm.resentment||0)/280));
    if(Math.random()<positiveChance){
      f.relation = clamp((f.relation||50) + rnd(2,7) + Math.floor(((fm.trust||50)-(fm.resentment||0))/35));
      applyRelationshipMemory(f, { trust:rnd(1,4), resentment:-rnd(0,2), support:true, note:'Yearly check-in strengthened friendship' });
      addEv(`${f.firstName} checked in during a rough week. Real friend energy.`, 'good');
    } else {
      f.relation = clamp((f.relation||50) - rnd(3,9));
      d.friendDrama = (d.friendDrama||0) + 1;
      applyRelationshipMemory(f, { trust:-rnd(1,4), resentment:rnd(2,6), conflict:true, note:'Yearly misunderstanding' });
      addEv(`A misunderstanding with ${f.firstName} cooled the friendship this year.`, 'warn');
    }
  }

  if(aliveFamily.length && Math.random()<0.16){
    const m = pick(aliveFamily);
    const mm = m.relMemory||{};
    if(Math.random()<0.45 && G.age>=18){
      const ask = rnd(300,3000);
      const helpChance = Math.max(0.2, Math.min(0.9, 0.45 + (mm.trust||50)/250 - (mm.resentment||0)/260));
      if(G.money>=ask && Math.random()<helpChance){
        G.money -= ask;
        m.relation = clamp((m.relation||50) + rnd(4,9));
        applyRelationshipMemory(m, { trust:rnd(2,5), resentment:-rnd(0,2), support:true, keptPromise:true, note:'Provided requested family support' });
        addEv(`${m.firstName} needed support. You covered ${fmt$(ask)}.`, 'good');
      } else {
        m.relation = clamp((m.relation||50) - rnd(4,10));
        d.familyDrama = (d.familyDrama||0) + 1;
        applyRelationshipMemory(m, { trust:-rnd(1,4), resentment:rnd(2,6), conflict:true, note:'Support request created tension' });
        addEv(`Family tension rose with ${m.firstName} over money and boundaries.`, 'warn');
      }
    }
  }

  if(aliveLovers.length>1 && Math.random()<0.22){
    const l = pick(aliveLovers);
    const lm = l.relMemory||{};
    const jealousyHit = rnd(6,12) + Math.floor((lm.resentment||0)/18) - Math.floor((lm.trust||50)/35);
    l.relation = clamp((l.relation||50) - Math.max(3, jealousyHit));
    applyRelationshipMemory(l, { trust:-rnd(2,6), resentment:rnd(4,9), conflict:true, note:'Jealousy triggered by multiple partners' });
    addEv(`${l.firstName} suspects you're seeing someone else. Trust dropped.`, 'bad');
    maybeExposeAffair(l.firstName, 'lover jealousy spiral', 0.22);
  }

  if(G.spouse && aliveLovers.length && Math.random()<0.14){
    ensurePersonRelationshipMemory(G.spouse);
    const spm = G.spouse.relMemory||{};
    const leakChance = Math.max(0.16, Math.min(0.58, 0.3 + (spm.resentment||0)/220 - (spm.trust||50)/350));
    maybeExposeAffair(pick(aliveLovers).firstName, 'a leaked message thread', leakChance);
  }
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
          ${relationshipMemoryRow(c)}
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
    relMemory:{
      trust:rnd(62,88),
      resentment:rnd(0,8),
      promisesKept:0,
      promisesBroken:0,
      conflicts:0,
      supportMoments:0,
      lastMeaningfulYear:G.age||0,
      history:[],
    },
  };
  G.children.push(child);
  ensurePersonRelationshipMemory(child);
  return child;
}

function tryForBaby(){
  if(!G.spouse){ flash('Need a spouse to try for a baby','warn'); return; }
  if((G.gender==='female' && G.repro?.pregnant) || (G.spouse.gender==='female' && G.spouse.pregnant)){
    flash('You are already expecting.','warn');
    return;
  }
  if(typeof attemptRelationshipPregnancy==='function'){
    const result = attemptRelationshipPregnancy(G.spouse, { condom:false, source:'try_for_baby' });
    if(!result.pregnant){
      addEv('You tried for a baby. It didn\'t happen this time. Keep trying or give it time.','warn');
      flash('Not this time. Keep trying.','warn');
    }
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
    relMemory:{
      trust:rnd(55,84),
      resentment:rnd(0,12),
      promisesKept:0,
      promisesBroken:0,
      conflicts:0,
      supportMoments:0,
      lastMeaningfulYear:G.age||0,
      history:[],
    },
  };
  G.children.push(child);
  ensurePersonRelationshipMemory(child);
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



