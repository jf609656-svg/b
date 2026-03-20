// ══ social.js ══
// ═══════════════════════════════════════════════════════════════
//  social.js — Social life: parties, substances, group activities
// ═══════════════════════════════════════════════════════════════

function renderSocial(){
  const sc = document.getElementById('social-content');
  const a  = G.age;

  if(a<10){
    sc.innerHTML=`<div class="notif warn">Social life unlocks at age 10. Go play outside.</div>`; return;
  }

  const friends = G.friends.filter(f=>f.alive);
  let html = '';

  // ── Hang out with someone specific ───────────────────────────
  if(friends.length){
    html+=`<div class="card"><div class="card-title">Hang Out With...</div>`;
    friends.slice(0,6).forEach(f=>{
      html+=`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="p-avatar av-friend" style="width:36px;height:36px;font-size:1rem">🧑</div>
          <div>
            <div class="p-name" style="font-size:.875rem">${f.name}</div>
            <div class="p-role">${f.relation}% · ${relLabel(f.relation)} · Compat ${f.compat||'?'}%</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="hangWithFriend('${f.name}')">Hang Out</button>
      </div>`;
    });
    if(friends.length>6) html+=`<div style="font-size:.78rem;color:var(--muted2);margin-top:8px">+${friends.length-6} more friends on the People tab</div>`;
    html+=`</div>`;

    // Group stuff
    html+=`<div class="card"><div class="card-title">Group Activities</div>
      <div class="choice-grid">
        <div class="choice" onclick="groupAct('concert')"><div class="choice-icon">🎵</div><div class="choice-name">Concert</div><div class="choice-desc">$60 · +Happy +Rep</div></div>
        <div class="choice" onclick="groupAct('gaming')"><div class="choice-icon">🎮</div><div class="choice-name">Gaming Night</div><div class="choice-desc">Free · +Happy</div></div>
        <div class="choice" onclick="groupAct('prank')"><div class="choice-icon">🎭</div><div class="choice-name">Pull a Prank</div><div class="choice-desc">Risky · +Rep?</div></div>
        <div class="choice" onclick="groupAct('roadtrip')"><div class="choice-icon">🚗</div><div class="choice-name">Road Trip</div><div class="choice-desc">$50 · +Happy</div></div>
        ${a>=18?`<div class="choice" onclick="groupAct('bar')"><div class="choice-icon">🍸</div><div class="choice-name">Go to a Bar</div><div class="choice-desc">$40 · +Happy +Friends</div></div>`:''}
        ${a>=18?`<div class="choice" onclick="groupAct('trip')"><div class="choice-icon">✈️</div><div class="choice-name">Weekend Trip</div><div class="choice-desc">$200 · Legendary</div></div>`:''}
      </div>
    </div>`;
  } else {
    html+=`<div class="notif warn">No friends yet. Make some on the People tab.</div>`;
  }

  // ── House parties (13+) ───────────────────────────────────────
  if(a>=13){
    html+=`<div class="card">
      <div class="card-title">House Parties</div>
      <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">
        Parties attended: <strong style="color:var(--text)">${G.social.partyCount}</strong> ·
        ${G.social.partyCount>=20?'A legend of the party scene.':G.social.partyCount>=10?'You\'re a regular.':G.social.partyCount>=5?'Getting the hang of it.':'Just getting started.'}
      </p>
      <div class="choice-grid">
        <div class="choice" onclick="goToParty('attend')"><div class="choice-icon">🏠</div><div class="choice-name">Attend a Party</div><div class="choice-desc">+Rep +Happy (maybe)</div></div>
        ${a>=15?`<div class="choice" onclick="goToParty('throw')"><div class="choice-icon">🎉</div><div class="choice-name">Throw a Party</div><div class="choice-desc">$200 · Legendary?</div></div>`:''}
      </div>
    </div>`;
  }

  // ── Substances (13+) ─────────────────────────────────────────
  if(a>=13){
    const addicted = SUBSTANCES.filter(s=>G.social.drugFlags[s.id+'_hooked']);
    html+=`<div class="card">
      <div class="card-title">Substances</div>
      <p style="color:var(--muted2);font-size:.78rem;margin-bottom:10px">Your body. Your choices. Your consequences.</p>`;

    if(addicted.length){
      html+=`<div style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);border-radius:var(--r-sm);padding:10px 12px;margin-bottom:10px">
        <div style="font-size:.7rem;font-weight:700;color:var(--danger);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">⚠️ Active Addictions</div>
        ${addicted.map(s=>`<div style="font-size:.82rem;margin-bottom:2px">${s.icon} ${s.label} — draining health & money each year</div>`).join('')}
      </div>`;
    }

    html+=`<div class="choice-grid">`;
    SUBSTANCES.filter(s=>a>=s.minAge).forEach(s=>{
      const tried = G.social.drugFlags[s.id];
      const hooked= G.social.drugFlags[s.id+'_hooked'];
      html+=`<div class="choice" onclick="trySubstance('${s.id}')">
        <div class="choice-icon">${s.icon}</div>
        <div class="choice-name">${s.label}</div>
        <div class="choice-desc">${hooked?'⚠️ Addicted':''}${tried&&!hooked?'Used before':'First time'}</div>
      </div>`;
    });
    html+=`</div></div>`;
  }

  // ── Sleepovers (13-17) ───────────────────────────────────────
  if(a>=13 && a<=17 && friends.length){
    html+=`<div class="card">
      <div class="card-title">Sleepovers</div>
      <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">Teen nights that turn into stories.</p>
      <div class="choice-grid">
        <div class="choice" onclick="sleepoverEvent()"><div class="choice-icon">🛌</div><div class="choice-name">Have a Sleepover</div><div class="choice-desc">Choices + consequences</div></div>
      </div>
    </div>`;
  }

  sc.innerHTML = html;
}

function sleepoverEvent(){
  const friend = pick(G.friends.filter(f=>f.alive));
  if(!friend){ flash('No friends available.','warn'); return; }
  showPopup(
    `Sleepover with ${friend.firstName}`,
    'The night is young. Do you keep it chill or do something wild?',
    [
      { label:'Keep It Chill', cls:'btn-ghost', onClick:()=>{
          G.happy = clamp(G.happy + rnd(6,10));
          friend.relation = clamp(friend.relation + rnd(4,8));
          addEv(`You and ${friend.firstName} stayed in, talked for hours, and fell asleep to a movie.`, 'love');
          updateHUD(); renderSocial();
        }},
      { label:'Do Something Wild', cls:'btn-primary', onClick:()=>{
          const outcomes = [
            {msg:`You and ${friend.firstName} snuck out at 2am. Adrenaline: high.`, happy:12, rep:6, bad:false},
            {msg:`You pulled a dumb prank with ${friend.firstName}. It went viral at school.`, happy:8, rep:10, bad:false},
            {msg:`You and ${friend.firstName} did something risky. You got caught.`, happy:-4, rep:-8, bad:true},
          ];
          const o = pick(outcomes);
          G.happy = clamp(G.happy + o.happy);
          G.social.reputation = clamp(G.social.reputation + o.rep);
          friend.relation = clamp(friend.relation + rnd(3,9));
          addEv(o.msg, o.bad?'bad':'warn');
          if(o.bad) G.darkScore++;
          updateHUD(); renderSocial();
        }},
    ]
  );
}

// ── HANG OUT WITH A SPECIFIC FRIEND ──────────────────────────────
function hangWithFriend(name){
  const friend = G.friends.find(f=>f.name===name&&f.alive);
  if(!friend){ flash('Can\'t find them.','warn'); return; }

  const eligible = HANGOUT_EVENTS.filter(e=>G.age>=e.minAge);
  const ev  = pick(eligible);
  const msg = ev.msg.replace(/{f}/g, friend.firstName);

  G.happy       = clamp(G.happy  + ev.happyD);
  G.health      = clamp(G.health + ev.healthD);
  G.smarts      = clamp(G.smarts + ev.smartsD);
  G.money       = G.money + ev.moneyD;
  G.social.reputation = clamp(G.social.reputation + ev.repD);
  friend.relation = clamp(friend.relation + rnd(4,11));

  addEv(msg, ev.type);
  flash(`Hung out with ${friend.firstName}!`);
  updateHUD(); renderSocial();
}

// ── GROUP ACTIVITIES ─────────────────────────────────────────────
function groupAct(type){
  const alive = G.friends.filter(f=>f.alive);
  const crew  = alive.slice(0, Math.min(4, alive.length));
  const names = crew.length
    ? (crew.length===1 ? crew[0].firstName : crew.slice(0,-1).map(f=>f.firstName).join(', ') + ' and ' + crew[crew.length-1].firstName)
    : 'a few people';

  function bumpCrew(){ crew.forEach(f=>f.relation=clamp(f.relation+rnd(4,9))); }

  if(type==='concert'){
    if(G.money<60){ flash('Need $60','warn'); return; }
    G.money-=60; G.happy=clamp(G.happy+rnd(12,19));
    G.social.reputation=clamp(G.social.reputation+rnd(4,8)); bumpCrew();
    addEv(pick([
      `You and ${names} went to a concert. Lost each other twice. Reunited at the merch stand. Perfect.`,
      `Concert with ${names}. The opener was better than the headliner. You\'ll argue about this for years.`,
      `You crowd-surfed with ${names}. Dropped twice. Several bruises. Zero regrets.`,
    ]),'love');
  } else if(type==='gaming'){
    G.happy=clamp(G.happy+rnd(9,15)); bumpCrew();
    addEv(pick([
      `Six-hour gaming session with ${names}. Trash talk, snacks, no sleep. Perfect Saturday.`,
      `Gaming night with ${names}. Someone rage-quit. Everyone laughed. Bonds strengthened.`,
      `You dominated the session with ${names}. You are insufferable about it. Worth it.`,
    ]));
  } else if(type==='prank'){
    bumpCrew();
    if(Math.random()>.42){
      G.happy=clamp(G.happy+rnd(10,16)); G.social.reputation=clamp(G.social.reputation+rnd(6,13));
      addEv(`You and ${names} pulled off a flawless prank. Legendary status. Evidence: minimal.`,'warn');
    } else {
      G.happy=clamp(G.happy-rnd(3,8)); G.social.reputation=clamp(G.social.reputation-rnd(5,13));
      addEv(`The prank with ${names} backfired. Wrong target, wrong time. Everyone scattered.`,'bad');
    }
  } else if(type==='roadtrip'){
    if(G.money<50){ flash('Need $50','warn'); return; }
    G.money-=50; G.happy=clamp(G.happy+rnd(12,18)); bumpCrew();
    addEv(`Road trip with ${names}. Got lost twice. Diner at 2am. Laughed the entire way home.`,'love');
  } else if(type==='bar'){
    if(G.money<40){ flash('Need $40','warn'); return; }
    G.money-=40; G.happy=clamp(G.happy+rnd(9,16)); G.health=clamp(G.health-rnd(1,4)); bumpCrew();
    addEv(pick([
      `Bar night with ${names}. You all talked too loud and tipped too well. Perfect evening.`,
      `Out with ${names}. Someone ended up on the dance floor doing something memorable.`,
      `A proper night out with ${names}. You woke up with new context for everyone involved.`,
    ]));
  } else if(type==='trip'){
    if(G.money<200){ flash('Need $200','warn'); return; }
    G.money-=200; G.happy=clamp(G.happy+rnd(16,24)); bumpCrew();
    addEv(`Weekend trip with ${names}. Two days. Twelve stories. The kind of trip you bring up for the rest of your life.`,'love');
  }
  updateHUD(); renderSocial();
}

// ── HOUSE PARTIES ────────────────────────────────────────────────
function goToParty(type){
  G.social.partyCount++;

  if(type==='attend'){
    const ev = pick(PARTY_EVENTS);
    G.happy             = clamp(G.happy  + ev.happyD);
    G.health            = clamp(G.health + ev.healthD);
    G.social.reputation = clamp(G.social.reputation + ev.repD);
    addEv(ev.msg, ev.type);
    // Chance to meet a new person at a party
    if(Math.random()<.28){
      const nf = makePerson('Friend'); nf.age = G.age+rnd(-3,3);
      G.friends.push(nf);
      addEv(`You met ${nf.firstName} at the party. Got their number. Actually texted them. Wild.`,'love');
    }
  } else if(type==='throw'){
    if(G.money<200){ flash('Need $200 to throw a party','warn'); return; }
    G.money -= 200;
    G.friends.filter(f=>f.alive).forEach(f=>f.relation=clamp(f.relation+rnd(5,10)));
    const legendary = Math.random()<.3;
    if(legendary){
      G.social.reputation = clamp(G.social.reputation+22);
      G.happy = clamp(G.happy+16);
      addEv('You threw the most legendary party of the year. Cops came at midnight. Nobody cares. It\'s a memory forever.','love');
      flash('LEGENDARY PARTY 🎉','good');
    } else {
      G.happy = clamp(G.happy+13); G.social.reputation = clamp(G.social.reputation+12);
      addEv('Your house party was a certified hit. The playlist was perfect. You didn\'t break anything expensive.','love');
      flash('Great party! +Rep 🎉','good');
    }
  }
  updateHUD(); renderSocial();
}

// ── SUBSTANCES ───────────────────────────────────────────────────
function trySubstance(id){
  const s = SUBSTANCES.find(x=>x.id===id);
  if(!s) return;

  const firstTime = !G.social.drugFlags[id];
  G.social.drugFlags[id] = true;
  G.darkScore++;

  const happyGain   = rnd(s.happyRange[0],  s.happyRange[1]);
  const healthLoss  = rnd(Math.abs(s.healthRange[0]), Math.abs(s.healthRange[1]));
  const smartsShift = rnd(s.smartsRange[0], s.smartsRange[1]);

  G.happy  = clamp(G.happy  + happyGain);
  G.health = clamp(G.health - healthLoss);
  G.smarts = clamp(G.smarts + smartsShift);

  const msg = firstTime ? s.firstLine : pick(s.lines);
  addEv(msg, firstTime?'warn':'bad');

  // Addiction roll
  if(Math.random() < s.addictChance){
    G.social.drugFlags[id+'_hooked'] = true;
    addEv(`Something about ${s.label.toLowerCase()} has a grip on you. It\'s not a phase anymore.`,'bad');
    flash(`⚠️ Addiction forming: ${s.icon}`,'bad');
    G.health=clamp(G.health-6); G.happy=clamp(G.happy-9);
    G.darkScore+=2;
  }

  // Context-aware dark tone unlock
  if(G.darkScore>=10 && !G.social.dramaFlags['darkTone']){
    G.social.dramaFlags['darkTone'] = true;
    // Future events will check this flag for darker variants
  }

  updateHUD(); renderSocial();
}


