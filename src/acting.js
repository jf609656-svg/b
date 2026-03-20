//  acting.js — Full Acting Career System
// ══════════════════════════════════════════════════════════════════

// ── DATA: ROLE TYPES ─────────────────────────────────────────────
// Each role: { id, label, icon, desc, minFame, minSkill, payMin, payMax, fameGain, skillGain, type }
const ACTING_ROLES = [
  // Commercials & background (any age/fame)
  { id:'commercial',   label:'TV Commercial',      icon:'📺', type:'commercial',
    desc:'Sell something. Smile. Cash the cheque.',
    minFame:0,  minSkill:0,  payMin:500,    payMax:5000,   fameGain:1, skillGain:3,
    projectType:'commercial' },
  { id:'extra',        label:'Background Extra',   icon:'🎬', type:'extra',
    desc:'You\'re in the scene. Nobody will notice. That\'s the job.',
    minFame:0,  minSkill:0,  payMin:150,    payMax:800,    fameGain:0, skillGain:2,
    projectType:'film' },
  { id:'indie_small',  label:'Indie Film (small)', icon:'🎞️', type:'supporting',
    desc:'Low budget. High passion. Maybe a festival run.',
    minFame:0,  minSkill:10, payMin:1000,   payMax:8000,   fameGain:2, skillGain:5,
    projectType:'film' },
  // TV roles
  { id:'tv_guest',     label:'TV Guest Role',      icon:'📡', type:'supporting',
    desc:'One episode. Make it count.',
    minFame:5,  minSkill:15, payMin:3000,   payMax:15000,  fameGain:3, skillGain:4,
    projectType:'tv' },
  { id:'tv_recurring', label:'Recurring TV Role',  icon:'🖥️', type:'supporting',
    desc:'Multiple episodes. A character arc begins.',
    minFame:10, minSkill:20, payMin:10000,  payMax:60000,  fameGain:5, skillGain:6,
    projectType:'tv' },
  { id:'tv_lead',      label:'TV Series Lead',     icon:'⭐', type:'lead',
    desc:'Your name is above the title. Pressure accordingly.',
    minFame:20, minSkill:35, payMin:50000,  payMax:300000, fameGain:12, skillGain:8,
    projectType:'tv' },
  // Streaming
  { id:'stream_supp',  label:'Streaming Supporting',icon:'🎧', type:'supporting',
    desc:'Netflix, HBO, Prime. Prestige content territory.',
    minFame:15, minSkill:25, payMin:20000,  payMax:100000, fameGain:7, skillGain:7,
    projectType:'streaming' },
  { id:'stream_lead',  label:'Streaming Lead',     icon:'💫', type:'lead',
    desc:'Streaming lead role. Global audience. Career-defining potential.',
    minFame:30, minSkill:45, payMin:100000, payMax:800000, fameGain:15, skillGain:10,
    projectType:'streaming' },
  // Films
  { id:'indie_lead',   label:'Indie Film Lead',    icon:'🎥', type:'lead',
    desc:'Your project. Your vision. Probably a festival circuit.',
    minFame:10, minSkill:30, payMin:5000,   payMax:50000,  fameGain:8, skillGain:10,
    projectType:'film' },
  { id:'blockbuster_s',label:'Blockbuster Supporting',icon:'🔥',type:'supporting',
    desc:'A big movie. You\'re not the star. That\'s fine for now.',
    minFame:25, minSkill:40, payMin:80000,  payMax:500000, fameGain:10, skillGain:8,
    projectType:'film' },
  { id:'blockbuster_l',label:'Blockbuster Lead',   icon:'🌟', type:'lead',
    desc:'Tentpole studio film. Opening weekend matters.',
    minFame:45, minSkill:55, payMin:500000, payMax:5000000,fameGain:25, skillGain:12,
    projectType:'film' },
  { id:'franchise',    label:'Franchise Film',     icon:'🦸', type:'lead',
    desc:'Sequels, merchandising, action figures with your face.',
    minFame:35, minSkill:45, payMin:200000, payMax:3000000,fameGain:20, skillGain:6,
    projectType:'film' },
  { id:'passion_proj', label:'Passion Project',    icon:'❤️', type:'lead',
    desc:'No studio notes. No commercial pressure. Just art.',
    minFame:20, minSkill:50, payMin:2000,   payMax:20000,  fameGain:5, skillGain:18,
    projectType:'film' },
];

// ── GENRES ───────────────────────────────────────────────────────
const ACTING_GENRES = [
  { id:'action',   label:'Action',      icon:'💥', desc:'Stunts, explosions, franchise potential.',        successMod:1.2 },
  { id:'drama',    label:'Drama',       icon:'😢', desc:'Awards bait. Critics love it.',                  successMod:0.9, criticBoost:15 },
  { id:'comedy',   label:'Comedy',      icon:'😂', desc:'Hard to do well. Audiences love it when it lands.',successMod:1.1 },
  { id:'horror',   label:'Horror',      icon:'👻', desc:'Cheap to make. Cult following guaranteed.',       successMod:1.0 },
  { id:'scifi',    label:'Sci-Fi',      icon:'🚀', desc:'Franchise starter. Nerd fandom: enormous.',      successMod:1.15 },
  { id:'romance',  label:'Romance',     icon:'💖', desc:'Looks stat helps. Mass audience appeal.',        successMod:1.05 },
  { id:'thriller', label:'Thriller',    icon:'🔪', desc:'Prestige tone. Streaming loves this.',           successMod:1.0 },
  { id:'biopic',   label:'Biopic',      icon:'🎭', desc:'Awards runway. Transformation required.',        successMod:0.85, criticBoost:20 },
];

// ── AGENT TIERS ──────────────────────────────────────────────────
const AGENT_TIERS = [
  { tier:0, name:'No Agent',         icon:'🚶', fee:0,    roleMod:1.0,  desc:'Auditioning alone. Possible. Slower.' },
  { tier:1, name:'Local Agent',      icon:'🤝', fee:0.10, roleMod:1.2,  desc:'10% cut. Opens regional doors.' },
  { tier:2, name:'Mid-Tier Agency',  icon:'📋', fee:0.15, roleMod:1.5,  desc:'15% cut. Real industry access.' },
  { tier:3, name:'Top Hollywood Agency',icon:'⭐',fee:0.20,roleMod:2.0, desc:'20% cut. The biggest roles call you first.' },
];

// ── ON-SET DRAMA EVENTS ───────────────────────────────────────────
const ONSET_DRAMA = [
  { msg:'You and your co-star had a genuine falling-out on set. Took three mediators and a craft services bribe to resolve.', repD:-8,  happyD:-10, type:'bad' },
  { msg:'The director hated your interpretation of the character. You hated their notes. A creative détente was reached.',    repD:-5,  happyD:-8,  type:'bad' },
  { msg:'You had brilliant chemistry with your co-star. Nobody expected it. The director kept the cameras rolling.',         repD:8,   happyD:12,  type:'love' },
  { msg:'You walked off set after a disagreement. Came back two hours later. Nobody discussed it further.',                  repD:-12, happyD:-6,  type:'bad' },
  { msg:'You covered for a co-star having a rough day. Word got back to the director. Reputation in the room: elevated.',    repD:10,  happyD:8,   type:'good' },
  { msg:'You were the last person to get your lines on the day. Every single day. The crew was patient about it. Mostly.',   repD:-4,  happyD:-3,  type:'warn' },
  { msg:'Your improvised line made it into the final cut. The director said "that\'s the one." Career moment.',              repD:8,   happyD:15,  type:'love' },
  { msg:'You connected with the director deeply on this project. They\'ve already mentioned the next one.',                  repD:12,  happyD:10,  type:'love' },
  { msg:'A rumour circulated that you were difficult to work with. The origin: unclear. The damage: moderate.',              repD:-15, happyD:-8,  type:'bad'  },
  { msg:'You went full method for this role. It was uncomfortable for everyone around you. The performance: undeniable.',    repD:5,   happyD:-5,  type:'warn' },
];

// ── AUDIENCE/BOX OFFICE OUTCOMES ─────────────────────────────────
const BOX_OFFICE = [
  { tier:'Flop',        min:0,   max:25,  adjective:'completely bombed',   repMod:-15, fanMod:-12, moneyMult:0.2 },
  { tier:'Moderate',   min:26,  max:55,  adjective:'did okay',             repMod:0,   fanMod:2,   moneyMult:1.0 },
  { tier:'Hit',        min:56,  max:80,  adjective:'was a genuine hit',    repMod:8,   fanMod:10,  moneyMult:1.8 },
  { tier:'Blockbuster',min:81,  max:100, adjective:'was a blockbuster',    repMod:18,  fanMod:25,  moneyMult:3.0 },
];

// ── AWARDS ───────────────────────────────────────────────────────
const ACTING_AWARDS = [
  { name:'Screen Actors Guild Award',   prestige:65, fameBoost:8  },
  { name:'Golden Globe',               prestige:72, fameBoost:12 },
  { name:'Academy Award (Oscar)',       prestige:95, fameBoost:22 },
  { name:'Emmy Award',                 prestige:70, fameBoost:10 },
  { name:'BAFTA',                      prestige:68, fameBoost:9  },
  { name:'Critics Choice Award',        prestige:55, fameBoost:6  },
];

// ── PASSIVE ACTING YEAR-OVER-YEAR ────────────────────────────────
function actingPassive(){
  const act = G.acting;
  if(!act.active) return;

  // Active project wraps
  if(act.activeRole){
    wrapProject(act.activeRole);
    act.activeRole = null;
  }

  // Reputation drift toward 50
  if(act.reputation !== 50){
    act.reputation = Math.max(0, Math.min(100, act.reputation + (act.reputation>50 ? -1 : 1)));
  }

  // Overexposure recovery
  if(act.overexposed && Math.random()<0.4){
    act.overexposed = false;
    addEv('You took a break from the spotlight. The industry\'s appetite for you has renewed somewhat.','good');
  }

  // Annual awards ceremony (if eligible)
  if(act.roles.length>0 && Math.random()<0.08 + (act.reputation/400)){
    actingAwardEvent();
  }

  // Passive: skin care, keep looks up if acting
  if(Math.random()<0.15) G.looks = clamp(G.looks + rnd(0,2));

  // Random on-set event if active last year
  if(act.totalProjects>0 && Math.random()<0.12){
    const ev = pick(ONSET_DRAMA);
    act.reputation = Math.max(0, Math.min(100, act.reputation + ev.repD));
    G.happy = clamp(G.happy + ev.happyD);
    addEv(ev.msg, ev.type);
  }
}

// ── WRAP PROJECT ─────────────────────────────────────────────────
function wrapProject(role){
  const act = G.acting;
  const roleData = ACTING_ROLES.find(r=>r.id===role.roleId);
  if(!roleData) return;

  // Performance score: skill + fame + effort
  const effortBonus  = role.effort==='full'?20 : role.effort==='method'?30 : 5;
  const methodPenalty = role.effort==='method' ? rnd(0,25) : 0; // wild card — might bomb
  const fameMod      = Math.floor(G.sm.totalFame * 0.5);
  const musicBonus   = G.sm.music.active ? 5 : 0; // musician crossover bonus
  const rawScore     = clamp(act.skill*0.5 + fameMod + effortBonus + G.looks*0.2 - methodPenalty + rnd(-10,10));

  // Genre modifier
  const genreData = ACTING_GENRES.find(g=>g.id===role.genre);
  const genreMod  = genreData ? genreData.successMod : 1.0;
  const criticBoost = genreData && genreData.criticBoost ? genreData.criticBoost : 0;

  // Audience score vs critics score (can differ)
  const audienceScore = clamp(rawScore * genreMod + rnd(-8,8));
  const criticsScore  = clamp(rawScore*0.9 + criticBoost + rnd(-12,12));

  // Box office tier
  const boResult   = BOX_OFFICE.find(b=>audienceScore>=b.min && audienceScore<=b.max) || BOX_OFFICE[0];

  // Pay calculation
  const agentFee   = AGENT_TIERS[act.agentTier].fee;
  let pay = Math.floor(rnd(roleData.payMin, roleData.payMax) * boResult.moneyMult * (1-agentFee));

  // % of profits option
  if(role.dealType==='percentage'){
    const profitShare = Math.floor(pay * rnd(1,3));
    pay = profitShare;
  }

  // Overexposure: penalty if too many projects
  if(act.overexposed){ pay = Math.floor(pay*0.7); }

  // Apply results
  G.money            += pay;
  act.totalEarned    += pay;
  G.sm.totalRevenue  += pay;
  act.reputation     = Math.max(0, Math.min(100, act.reputation + boResult.repMod + (audienceScore>70?5:0)));
  G.sm.totalFame     = clamp(G.sm.totalFame + roleData.fameGain * (boResult.tier==='Blockbuster'?2:boResult.tier==='Hit'?1.5:boResult.tier==='Flop'?0.3:1));
  G.happy            = clamp(G.happy + (boResult.tier==='Flop'?-12:boResult.tier==='Blockbuster'?18:8));
  act.skill          = Math.min(100, act.skill + roleData.skillGain);

  // Typecast check
  if(!role.isPassionProject){
    const genreCount = act.roles.filter(r=>r.genre===role.genre).length;
    if(genreCount>=3 && !act.typecastGenre){
      act.typecastGenre = role.genre;
      addEv(`You\'ve done so many ${genreData?genreData.label:'similar'} projects that the industry is starting to see you as just that. Typecast risk is real.`,'warn');
    }
  }

  // Franchise tracking
  if(roleData.id==='franchise'){
    const fn = role.franchiseName || 'Unknown Franchise';
    act.franchiseRoles[fn] = (act.franchiseRoles[fn]||0)+1;
    if(act.franchiseRoles[fn]>=2) addEv(`${fn}: instalment ${act.franchiseRoles[fn]} wrapped. The franchise machine keeps rolling.`,'good');
  }

  // Project count tracking
  if(roleData.projectType==='film')      act.filmCount++;
  if(roleData.projectType==='tv')        act.tvCount++;
  if(roleData.projectType==='streaming') act.streamCount++;

  // Music + acting synergy
  if(G.sm.music.active && role.hasSoundtrack){
    const synStreams = rnd(50000, 500000);
    G.sm.music.streams += synStreams;
    addEv(`The ${role.projectName} soundtrack features your music. +${fmtF(synStreams)} streams.`,'love');
    flash(`🎵🎬 Soundtrack synergy! +${fmtF(synStreams)} streams`,'good');
  }

  // Save to history
  act.roles.push({
    roleId:role.roleId, genre:role.genre, projectName:role.projectName,
    boTier:boResult.tier, audienceScore, criticsScore, pay, year:G.age,
  });
  act.totalProjects++;

  // Overexposure: flag if >3 projects in recent history
  const recentProjects = act.roles.filter(r=>r.year>=G.age-2).length;
  if(recentProjects>=4 && !act.overexposed){
    act.overexposed=true;
    addEv('You\'ve taken on too much at once. The industry is starting to use the word "overexposed." Take a breath.','warn');
  }

  // Result announcement
  const performStr = audienceScore>=75?'stellar':audienceScore>=55?'solid':audienceScore>=35?'average':'weak';
  addEv(`"${role.projectName}" ${boResult.adjective}. Your performance was ${performStr}. 
    Critics: ${criticsScore}/100 · Audience: ${audienceScore}/100. 
    Pay: ${fmt$(pay)}.${boResult.tier==='Blockbuster'?' The industry is calling.':`${boResult.tier==='Flop'?' Your agent is quiet.':`${boResult.tier==='Hit'?' Good notices everywhere.':''}`}`}`,
    boResult.tier==='Flop'?'bad':boResult.tier==='Blockbuster'?'love':'good'
  );
  flash(`🎬 "${role.projectName}" — ${boResult.tier}! +${fmt$(pay)}`,'good');
  updateHUD();
}

// ── AWARDS EVENT ─────────────────────────────────────────────────
function actingAwardEvent(){
  const act = G.acting;
  // Need at least one good recent role
  const goodRoles = act.roles.filter(r=>r.audienceScore>=60 || r.criticsScore>=65);
  if(!goodRoles.length) return;

  act.awardsNoms++;
  const award = pick(ACTING_AWARDS.filter(a => act.reputation >= a.prestige*0.5));
  if(!award) return;

  // Win chance: reputation + skill + last role scores
  const lastRole = act.roles[act.roles.length-1];
  const winChance = 0.18 + act.skill/300 + (lastRole?lastRole.criticsScore/400:0) + act.reputation/500;

  addEv(`${award.name} nomination! Your work on "${(lastRole||{}).projectName||'a recent project'}" earned a nod. Nomination ${act.awardsNoms} total.`,'love');
  flash(`🏆 ${award.name} nomination!`,'good');
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,6));

  if(Math.random() < winChance){
    act.awardsWins++;
    G.sm.totalFame  = clamp(G.sm.totalFame + award.fameBoost);
    G.happy         = clamp(G.happy + rnd(18,28));
    act.reputation  = Math.min(100, act.reputation + rnd(10,18));
    addEv(`YOU WON THE ${award.name.toUpperCase()}. The speech. The statue. The aftermath. A career defined.`,'love');
    flash(`🏆🏆 WON THE ${award.name}!`,'good');
  }
}

// ── RENDER ACTING TAB ─────────────────────────────────────────────
function renderActing(){
  const ac = document.getElementById('acting-content');
  const act= G.acting;

  if(G.age < 16){
    ac.innerHTML=`<div class="notif warn">Acting unlocks at 16. For now, just watch movies and study the craft.</div>`;
    return;
  }

  if(!act.active){
    ac.innerHTML=`
    <div class="card">
      <div class="card-title">🎭 Start Your Acting Career</div>
      <p style="color:var(--muted2);font-size:.875rem;margin-bottom:16px">
        Hollywood is open. Or the indie scene. Or commercials. Everyone starts somewhere.
        ${G.sm.music.active?' Your music fame gives you a head start in auditions.':''}
      </p>
      <div class="choice-grid cols-1">
        <div class="choice" onclick="actingEnter()">
          <div class="choice-icon">🎭</div>
          <div class="choice-name">Enter the Industry</div>
          <div class="choice-desc">Start at the bottom. Work your way up. It's the only way.</div>
        </div>
      </div>
    </div>`;
    return;
  }

  const agentData = AGENT_TIERS[act.agentTier];
  const repColor  = act.reputation>=70?'var(--success)':act.reputation>=45?'var(--gold)':'var(--danger)';
  const skillColor = act.skill>=70?'var(--accent)':act.skill>=40?'var(--gold)':'var(--muted2)';
  const typecastWarn = act.typecastGenre
    ? `<div class="notif warn" style="margin-bottom:10px">⚠️ Typecasting risk: You keep taking ${act.typecastGenre} roles. Branch out or embrace it.</div>`
    : '';
  const overexpWarn = act.overexposed
    ? `<div class="notif bad" style="margin-bottom:10px">📉 Overexposed. The industry needs a break from you. Wait it out or take only passion projects.</div>`
    : '';

  let html = `${typecastWarn}${overexpWarn}
  <div class="card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px">
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.4rem">${G.firstname} ${G.lastname}</div>
        <div style="font-size:.76rem;color:var(--muted2);margin-top:2px">${agentData.icon} ${agentData.name} · ${act.methodActor?'⚗️ Method Actor · ':''} ${act.totalProjects} projects</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${act.awardsWins>0?`<div style="font-size:.72rem;color:var(--gold)">🏆 ${act.awardsWins}× Award Winner</div>`:''}
        ${act.awardsNoms>0&&!act.awardsWins?`<div style="font-size:.72rem;color:var(--muted2)">${act.awardsNoms}× Nominated</div>`:''}
      </div>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">
      <div class="sm-stat"><div class="sm-stat-val" style="color:${skillColor}">${act.skill}</div><div class="sm-stat-lbl">Acting Skill</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:${repColor}">${act.reputation}</div><div class="sm-stat-lbl">Reputation</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(act.totalEarned)}</div><div class="sm-stat-lbl">Total Earned</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${act.filmCount}</div><div class="sm-stat-lbl">Films</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${act.tvCount+act.streamCount}</div><div class="sm-stat-lbl">TV/Stream</div></div>
    </div>
    ${act.activeRole?`<div class="notif good" style="font-size:.78rem">🎬 Currently filming: "${act.activeRole.projectName}" — wraps next year.</div>`:''}
  </div>

  <!-- Auditions / Roles available -->
  <div class="card">
    <div class="card-title">Auditions & Roles Available</div>
    <p style="color:var(--muted2);font-size:.8rem;margin-bottom:12px">Availability based on your skill, fame, and reputation. Agent improves access.</p>
    <div class="choice-grid">
      ${ACTING_ROLES.filter(r=>{
        const meetsSkill = act.skill >= r.minSkill;
        const meetsFame  = G.sm.totalFame >= r.minFame;
        const agentMod   = agentData.roleMod;
        return meetsSkill && meetsFame && !act.activeRole;
      }).map(r=>`
        <div class="choice${act.overexposed&&r.id!=='passion_proj'?' disabled':''}" onclick="actingAudition('${r.id}')">
          <div class="choice-icon">${r.icon}</div>
          <div class="choice-name">${r.label}</div>
          <div class="choice-desc">${r.desc}</div>
          <div style="font-size:.66rem;color:var(--gold);margin-top:3px">${fmt$(r.payMin)}–${fmt$(r.payMax)}</div>
        </div>`).join('')}
    </div>
    ${act.activeRole?`<div style="font-size:.8rem;color:var(--muted2);margin-top:10px">Finish your current project before auditioning for another.</div>`:''}
  </div>

  <!-- Training -->
  <div class="card">
    <div class="card-title">Training & Craft</div>
    <div class="choice-grid">
      <div class="choice" onclick="actingTrain('class')">
        <div class="choice-icon">🎓</div><div class="choice-name">Acting Classes</div>
        <div class="choice-desc">$300 · +Skill meaningfully</div>
      </div>
      <div class="choice" onclick="actingTrain('workshop')">
        <div class="choice-icon">🏛️</div><div class="choice-name">Intensive Workshop</div>
        <div class="choice-desc">$800 · +Big skill boost</div>
      </div>
      <div class="choice" onclick="actingTrain('coach')">
        <div class="choice-icon">🧑‍🏫</div><div class="choice-name">Private Coach</div>
        <div class="choice-desc">$1,500 · +Skill +Reputation</div>
      </div>
      <div class="choice" onclick="actingTrain('method')">
        <div class="choice-icon">⚗️</div><div class="choice-name">${act.methodActor?'Method Training':'Go Method'}</div>
        <div class="choice-desc">${act.methodActor?'+Deep skill, volatile results':'Commit fully. Career-altering risk/reward.'}</div>
      </div>
      <div class="choice" onclick="actingTrain('self')">
        <div class="choice-icon">📖</div><div class="choice-name">Self-Study</div>
        <div class="choice-desc">Free · Small skill gain</div>
      </div>
      <div class="choice" onclick="actingTrain('improv')">
        <div class="choice-icon">🎤</div><div class="choice-name">Improv Class</div>
        <div class="choice-desc">$200 · +Skill +Happy +Smarts</div>
      </div>
    </div>
  </div>

  <!-- Agent -->
  <div class="card">
    <div class="card-title">Representation</div>
    <p style="color:var(--muted2);font-size:.8rem;margin-bottom:10px">
      Current: <strong style="color:var(--text)">${agentData.icon} ${agentData.name}</strong> · ${agentData.fee>0?`Takes ${Math.floor(agentData.fee*100)}% of earnings`:'No fees'}
    </p>
    <div class="choice-grid">
      ${AGENT_TIERS.filter(a=>a.tier>0&&a.tier>act.agentTier).map(a=>`
        <div class="choice${G.sm.totalFame<a.tier*15?' disabled':''}" onclick="actingAgent(${a.tier})">
          <div class="choice-icon">${a.icon}</div>
          <div class="choice-name">${a.name}</div>
          <div class="choice-desc">${a.desc}</div>
          ${G.sm.totalFame<a.tier*15?`<div class="choice-req">Need ${a.tier*15} fame</div>`:''}
        </div>`).join('')}
      ${act.agentTier>0?`<div class="choice" onclick="actingAgent(0)" style="border-color:rgba(248,113,113,.3)">
        <div class="choice-icon">🚪</div><div class="choice-name">Fire Agent</div><div class="choice-desc">Go independent</div>
      </div>`:''}
    </div>
  </div>

  <!-- Last 5 roles -->
  ${act.roles.length?`<div class="card">
    <div class="card-title">Filmography</div>
    ${act.roles.slice().reverse().slice(0,5).map(r=>{
      const rd = ACTING_ROLES.find(x=>x.id===r.roleId);
      const gd = ACTING_GENRES.find(g=>g.id===r.genre);
      const tierColor = r.boTier==='Blockbuster'?'var(--gold)':r.boTier==='Hit'?'var(--success)':r.boTier==='Flop'?'var(--danger)':'var(--muted2)';
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:1.4rem">${rd?rd.icon:'🎬'}</div>
        <div style="flex:1">
          <div style="font-family:var(--fh);font-weight:700;font-size:.88rem">"${r.projectName}"</div>
          <div style="font-size:.72rem;color:var(--muted2)">${gd?gd.icon+' '+gd.label:''} · Age ${r.year} · ${fmt$(r.pay)}</div>
          <div style="font-size:.7rem;color:var(--muted2)">Audience: ${r.audienceScore} · Critics: ${r.criticsScore}</div>
        </div>
        <span style="font-family:var(--fh);font-size:.75rem;font-weight:700;color:${tierColor}">${r.boTier}</span>
      </div>`;
    }).join('')}
  </div>`:''}`;

  ac.innerHTML = html;
}

// ── ENTER ACTING ──────────────────────────────────────────────────
function actingEnter(){
  G.acting.active = true;
  // Music fame gives starting bonus
  const musicBonus = G.sm.music.active ? 10 : 0;
  G.acting.skill   = Math.min(30, rnd(5,15) + musicBonus);
  addEv(`You started pursuing acting. Headshots taken. IMDB page: blank. Ambition: enormous.`,'good');
  flash('🎭 Acting career started!','good');
  renderActing();
}

// ── AUDITION ─────────────────────────────────────────────────────
function actingAudition(roleId){
  const act     = G.acting;
  const roleData= ACTING_ROLES.find(r=>r.id===roleId);
  if(!roleData){ flash('Role not found','bad'); return; }
  if(act.activeRole){ flash('Already filming a project','warn'); return; }

  const agentMod = AGENT_TIERS[act.agentTier].roleMod;
  // Audition pass chance: skill + fame + looks + agent
  const passChance = Math.min(0.92,
    (act.skill/200) + (G.sm.totalFame/200) + (G.looks/350) + (agentMod-1)*0.15 + 0.30
  );

  if(Math.random() > passChance){
    act.skill = Math.min(100, act.skill + rnd(1,3)); // learn from rejection
    addEv(`You auditioned for a ${roleData.label} role. They went in a different direction. Classic. (+1-3 skill from the experience).`,'bad');
    flash(`Audition for ${roleData.label}: no callback`,'bad');
    updateHUD(); renderActing(); return;
  }

  // Got the role — now choose genre, contract, effort
  showRoleOptions(roleData);
}

function showRoleOptions(roleData){
  const ac = document.getElementById('acting-content');
  const isFranchise = roleData.id === 'franchise';

  // Franchise name pool
  const franchiseNames = [
    'Starlancer Universe','Shadow Protocol','The Meridian Files','Titan Protocol','Nexus Chronicles',
    'Ironblade Legacy','The Veilborn Saga','Echo Protocol','Phantom Drift','The Axiom Sequence',
  ];

  ac.innerHTML=`
  <div class="card">
    <div class="card-title" style="color:var(--accent)">🎉 You Got the Role!</div>
    <div style="font-family:var(--fh);font-weight:800;font-size:1.4rem;margin-bottom:4px">${roleData.label}</div>
    <p style="color:var(--muted2);font-size:.85rem;margin-bottom:18px">${roleData.desc} · Pay range: ${fmt$(roleData.payMin)}–${fmt$(roleData.payMax)}</p>

    <div class="card-title">Pick a Genre</div>
    <div class="choice-grid" id="genre-pick" style="margin-bottom:16px">
      ${ACTING_GENRES.map(g=>`
        <div class="choice" id="genre-${g.id}" onclick="selectActingGenre('${g.id}','${roleData.id}')">
          <div class="choice-icon">${g.icon}</div>
          <div class="choice-name">${g.label}</div>
          <div class="choice-desc">${g.desc}</div>
        </div>`).join('')}
    </div>
  </div>

  <div class="card" id="role-confirm-card" style="display:none">
    <div class="card-title">Deal Structure</div>
    <div class="choice-grid" id="deal-pick" style="margin-bottom:14px">
      <div class="choice" id="deal-fixed" onclick="selectDeal('fixed','${roleData.id}')">
        <div class="choice-icon">💵</div><div class="choice-name">Fixed Pay</div>
        <div class="choice-desc">Safe. Guaranteed. Lower ceiling.</div>
      </div>
      <div class="choice" id="deal-pct" onclick="selectDeal('percentage','${roleData.id}')">
        <div class="choice-icon">📈</div><div class="choice-name">% of Profits</div>
        <div class="choice-desc">High risk. If it hits, you're set.</div>
      </div>
    </div>

    <div class="card-title">Your Effort Level</div>
    <div class="choice-grid" id="effort-pick">
      <div class="choice" id="effort-full" onclick="selectEffort('full','${roleData.id}')">
        <div class="choice-icon">💪</div><div class="choice-name">Give It Everything</div>
        <div class="choice-desc">Max performance bonus. Physically costly.</div>
      </div>
      <div class="choice" id="effort-method" onclick="selectEffort('method','${roleData.id}')">
        <div class="choice-icon">⚗️</div><div class="choice-name">Go Method</div>
        <div class="choice-desc">Biggest upside, biggest risk. Volatile results.</div>
      </div>
      <div class="choice" id="effort-chill" onclick="selectEffort('chill','${roleData.id}')">
        <div class="choice-icon">😎</div><div class="choice-name">Steady & Professional</div>
        <div class="choice-desc">Reliable. No surprises. Lower ceiling.</div>
      </div>
    </div>
  </div>`;

  // Store partial selection in temp
  window._actingPick = {
    roleId: roleData.id,
    genre: null,
    dealType: 'fixed',
    effort: 'full',
    franchiseName: isFranchise ? pick(franchiseNames) : null,
  };
}

let _actingGenreSelected = false, _actingDealSelected = false;

function selectActingGenre(genre, roleId){
  window._actingPick.genre = genre;
  // Highlight selected
  ACTING_GENRES.forEach(g=>{
    const el = document.getElementById('genre-'+g.id);
    if(el) el.style.borderColor = g.id===genre?'var(--accent)':'';
  });
  document.getElementById('role-confirm-card').style.display='block';
}

function selectDeal(dealType, roleId){
  window._actingPick.dealType = dealType;
  ['fixed','pct'].forEach(d=>{
    const el=document.getElementById('deal-'+d);
    if(el) el.style.borderColor=d===dealType.replace('percentage','pct')||d===dealType?'var(--accent)':'';
  });
}

function selectEffort(effort, roleId){
  window._actingPick.effort = effort;
  // Commit the role
  commitActingRole(window._actingPick);
}

function commitActingRole(pick_){
  const act      = G.acting;
  const roleData = ACTING_ROLES.find(r=>r.id===pick_.roleId);
  if(!roleData||!pick_.genre){ flash('Select a genre first','warn'); return; }

  // Generate a project name
  const projectNames = {
    action:  ['Reckoning','Fallout','Overdrive','Breach','Shockwave','Retaliation','Deadzone'],
    drama:   ['Aftermath','The Quiet Between','Broken Hours','Before the Light','All We Leave','Undone'],
    comedy:  ['The Big Mistake','Perfectly Flawed','Unscripted','Total Disaster','Better Late'],
    horror:  ['The Hollow','Don\'t Look Back','What Feeds','Severed','The Waiting Dark','Stillwater'],
    scifi:   ['Parallax','The Last Signal','Resonance','Horizon Protocol','Voidborne','Phase Shift'],
    romance: ['The Distance Between','One Last Summer','Not Like This','Still Standing','Close Enough'],
    thriller:['The Asset','Dark Thread','Without Trace','Pressure','The Arrangement','Closed Circuit'],
    biopic:  ['Against All Odds','The Real Story','Who I Was','Rise','Becoming','Unfiltered'],
  };
  const names = projectNames[pick_.genre] || ['Untitled Project'];
  const projName = pick(names) + (Math.random()<0.4?' '+rnd(2,3):'');

  // Soundtrack tie-in possible
  const hasSoundtrack = G.sm.music.active && Math.random()<0.25;

  act.activeRole = {
    roleId: pick_.roleId,
    genre: pick_.genre,
    projectName: projName,
    dealType: pick_.dealType,
    effort: pick_.effort,
    franchiseName: pick_.franchiseName,
    hasSoundtrack,
    isPassionProject: pick_.roleId==='passion_proj',
  };

  if(hasSoundtrack){
    addEv(`You\'re contributing to the ${projName} soundtrack as well. Music and acting worlds colliding.`,'love');
  }

  const effortLabels = { full:'giving it everything', method:'going full method', chill:'staying professional' };
  addEv(`Role confirmed: ${roleData.label} in "${projName}" (${ACTING_GENRES.find(g=>g.id===pick_.genre).label}). You\'re ${effortLabels[pick_.effort]}. Filming starts.`,'love');
  flash(`🎬 "${projName}" — filming!`,'good');
  updateHUD(); renderActing();
}

// ── TRAINING ─────────────────────────────────────────────────────
function actingTrain(type){
  const act = G.acting;
  const costs = { class:300, workshop:800, coach:1500, method:0, self:0, improv:200 };
  const cost  = costs[type] || 0;
  if(cost && G.money < cost){ flash(`Need ${fmt$(cost)}`,'bad'); return; }
  if(cost) G.money -= cost;

  if(type==='class'){
    const gain = rnd(5,12);
    act.skill = Math.min(100, act.skill+gain);
    addEv(`Acting class. Scene work, cold reads, monologues. Skill +${gain}. (-${fmt$(cost)})`,'good');
    flash(`+${gain} Acting Skill 🎓`,'good');
  } else if(type==='workshop'){
    const gain = rnd(10,20);
    act.skill = Math.min(100, act.skill+gain);
    G.smarts = clamp(G.smarts+rnd(2,4));
    addEv(`Intensive acting workshop. Three days. Breakthrough moment on day two. Skill +${gain}. (-${fmt$(cost)})`,'good');
    flash(`+${gain} Acting Skill 🏛️`,'good');
  } else if(type==='coach'){
    const gain = rnd(12,22);
    act.skill = Math.min(100, act.skill+gain);
    act.reputation = Math.min(100, act.reputation+rnd(4,8));
    addEv(`Private acting coach. Personalised, intense. Industry connections made. Skill +${gain}. (-${fmt$(cost)})`,'good');
    flash(`+${gain} Skill +Reputation 🧑‍🏫`,'good');
  } else if(type==='method'){
    if(!act.methodActor){
      act.methodActor = true;
      act.skill = Math.min(100, act.skill+rnd(8,15));
      G.happy = clamp(G.happy-rnd(5,10));
      addEv('You committed to method acting. You will stay in character. You will make choices. The results will be extreme.','warn');
      flash('⚗️ Method Actor unlocked','warn');
    } else {
      const gain = rnd(5,18);
      act.skill = Math.min(100, act.skill+gain);
      G.happy = clamp(G.happy + rnd(-10,8));
      addEv(`Method training session. Skill +${gain}. Your grip on reality: slightly loosened for your art.`,'warn');
      flash(`+${gain} Method skill ⚗️`,'warn');
    }
  } else if(type==='self'){
    const gain = rnd(2,6);
    act.skill = Math.min(100, act.skill+gain);
    addEv(`Self-study: screenwriting, watching performances, reading scripts. Skill +${gain}.`);
    flash(`+${gain} Acting Skill 📖`,'good');
  } else if(type==='improv'){
    const gain = rnd(4,9);
    act.skill = Math.min(100, act.skill+gain);
    G.happy = clamp(G.happy+rnd(6,10));
    G.smarts = clamp(G.smarts+rnd(2,4));
    addEv(`Improv class. You said "yes and" for two hours. Genuinely fun. Skill +${gain}. (-${fmt$(cost)})`,'good');
    flash(`+${gain} Skill +Happy +Smarts 🎤`,'good');
  }
  updateHUD(); renderActing();
}

// ── AGENT ─────────────────────────────────────────────────────────
function actingAgent(tier){
  const act = G.acting;
  if(tier===0){
    act.agentTier=0; act.hasAgent=false;
    addEv('You fired your agent. Going independent. Bold. Chaotic.','warn');
    flash('Agent fired.','warn');
  } else {
    if(G.sm.totalFame<tier*15){ flash(`Need ${tier*15} fame for this tier`,'bad'); return; }
    act.agentTier=tier; act.hasAgent=true;
    const a = AGENT_TIERS[tier];
    addEv(`Signed with ${a.name}. They take ${Math.floor(a.fee*100)}%. They open doors you can\'t open alone.`,'good');
    flash(`${a.icon} Signed with ${a.name}!`,'good');
  }
  updateHUD(); renderActing();
}


// ══════════════════════════════════════════════════════════════════
