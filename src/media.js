//  media.js — Social Media System
//  Platforms: YouTube · TikTok · Instagram · Twitter/X · Twitch
// ══════════════════════════════════════════════════════════════════

// ── PLATFORM DEFINITIONS ──────────────────────────────────────────
const SM_PLATFORMS = {
  youtube: {
    id:'youtube', name:'YouTube', icon:'▶️',
    color:'#ff4444', gradient:'linear-gradient(135deg,#ff4444,#cc0000)',
    minAge:13, desc:'Long-form video. Build an audience that actually stays.',
    niches:['Gaming','Vlogs','Education','Comedy','Tech Reviews','Cooking','Fitness','Music'],
    actions:[
      { id:'upload',   label:'Upload a Video',    icon:'🎬', desc:'Post content · +Followers +Revenue',  cost:0   },
      { id:'collab',   label:'Collab with Creator',icon:'🤝', desc:'+Big follower boost · needs connections', cost:0 },
      { id:'sponsor',  label:'Take a Sponsorship', icon:'💰', desc:'Paid promotion · +Revenue',          cost:0   },
      { id:'grind',    label:'Upload Every Day',   icon:'😤', desc:'+Followers +Revenue · -Health',       cost:0   },
      { id:'buy_gear', label:'Upgrade Equipment',  icon:'📷', desc:'$500 · +Content quality permanently', cost:500 },
      { id:'shorts',   label:'Post YouTube Shorts',icon:'📱', desc:'Quick growth · lower revenue',        cost:0   },
    ],
    revenueMulti:2.2,
  },
  tiktok: {
    id:'tiktok', name:'TikTok', icon:'🎵',
    color:'#69c9d0', gradient:'linear-gradient(135deg,#69c9d0,#ee1d52)',
    minAge:13, desc:'Short-form chaos. One video can change everything overnight.',
    niches:['Dance','Comedy','Lifestyle','Food','Facts','Trends','Gaming','Fashion'],
    actions:[
      { id:'upload',   label:'Post a TikTok',      icon:'🎵', desc:'Post content · algorithm lottery',  cost:0   },
      { id:'trend',    label:'Jump on a Trend',     icon:'🔥', desc:'+Big reach · short-lived fame',     cost:0   },
      { id:'duet',     label:'Duet a Viral Video',  icon:'🎭', desc:'+Followers if it lands',            cost:0   },
      { id:'live',     label:'Go Live',             icon:'📡', desc:'+Gifts +Followers in real time',    cost:0   },
      { id:'grind',    label:'Post 3 Times a Day',  icon:'😤', desc:'+Followers +Revenue · -Health',     cost:0   },
      { id:'ads',      label:'Run Paid Promotion',  icon:'💸', desc:'$200 spend · +Followers guaranteed',cost:200 },
    ],
    revenueMulti:0.9,
  },
  instagram: {
    id:'instagram', name:'Instagram', icon:'📸',
    color:'#e1306c', gradient:'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
    minAge:13, desc:'Aesthetic content. Looks stat matters here more than anywhere.',
    niches:['Fitness','Travel','Fashion','Food','Photography','Lifestyle','Art','Memes'],
    actions:[
      { id:'upload',   label:'Post a Photo',        icon:'📸', desc:'Content · +Followers · looks matter',cost:0  },
      { id:'reel',     label:'Post a Reel',         icon:'🎬', desc:'+Reach +Followers',                 cost:0   },
      { id:'story',    label:'Daily Stories',       icon:'⭕', desc:'+Engagement +Streak',               cost:0   },
      { id:'collab',   label:'Brand Partnership',   icon:'💼', desc:'+Revenue · sponsored content',      cost:0   },
      { id:'photoshoot',label:'Professional Shoot', icon:'📷', desc:'$300 · +Content quality boost',     cost:300 },
      { id:'grind',    label:'Post Every Day',      icon:'😤', desc:'+Followers +Revenue · -Health',      cost:0  },
    ],
    revenueMulti:1.6,
  },
  twitter: {
    id:'twitter', name:'Twitter / X', icon:'🐦',
    color:'#1d9bf0', gradient:'linear-gradient(135deg,#1d9bf0,#0a5f9e)',
    minAge:13, desc:'Hot takes, threads, and drama. Smarts stat dominates here.',
    niches:['Politics','Tech','Comedy','Sports','Finance','News','Gaming','Culture'],
    actions:[
      { id:'upload',   label:'Post a Tweet',        icon:'💬', desc:'Smarts-driven · +Followers',        cost:0   },
      { id:'thread',   label:'Write a Thread',      icon:'📝', desc:'+Big reach if it goes viral',       cost:0   },
      { id:'ratio',    label:'Start Drama',         icon:'🔥', desc:'+Notoriety · controversy risk',     cost:0   },
      { id:'spaces',   label:'Host a Space',        icon:'🎙️', desc:'+Followers +Smarts boost',          cost:0   },
      { id:'substack', label:'Launch Newsletter',   icon:'📨', desc:'+Stable revenue stream',            cost:0   },
      { id:'grind',    label:'Tweet All Day',       icon:'😤', desc:'+Followers -Smarts -Health',        cost:0   },
    ],
    revenueMulti:1.1,
  },
  twitch: {
    id:'twitch', name:'Twitch', icon:'💜',
    color:'#9146ff', gradient:'linear-gradient(135deg,#9146ff,#6441a4)',
    minAge:13, desc:'Live streaming. Real-time community. The grind never stops.',
    niches:['FPS Games','RPGs','IRL','Just Chatting','Sports','Music','Cooking','Gambling'],
    actions:[
      { id:'stream_game',   label:'Stream a Game',       icon:'🎮', desc:'+Followers +Subs · most popular',   cost:0   },
      { id:'stream_irl',    label:'IRL Stream',          icon:'📹', desc:'+Authentic connection +Subs',       cost:0   },
      { id:'stream_chat',   label:'Just Chatting',       icon:'💬', desc:'+Community loyalty',               cost:0   },
      { id:'stream_music',  label:'Music Stream',        icon:'🎸', desc:'+Creative niche audience',          cost:0   },
      { id:'stream_cook',   label:'Cooking Stream',      icon:'🍳', desc:'+Cozy audience',                   cost:0   },
      { id:'charity',       label:'Charity Stream',      icon:'❤️',  desc:'+Fame +Goodwill +Donations',      cost:0   },
      { id:'marathon',      label:'24hr Marathon Stream',icon:'😤', desc:'+Massive boost · -Health severely', cost:0   },
      { id:'sub_push',      label:'Sub Drive',           icon:'💜', desc:'+Revenue push · community event',   cost:0   },
      { id:'collab_stream', label:'Collab Stream',       icon:'🤝', desc:'+Raid boost +Followers',           cost:0   },
      { id:'buy_gear',      label:'Upgrade Setup',       icon:'🖥️',  desc:'$800 · +Stream quality perma',    cost:800 },
    ],
    revenueMulti:2.8,
  },
};

// ── CONTENT QUALITY TIERS ────────────────────────────────────────
const SM_TIER = f =>
  f>=5000000?{label:'Mega Star',    icon:'🌟', color:'var(--accent3)'}:
  f>=1000000?{label:'A-List',       icon:'⭐', color:'var(--gold)'}:
  f>=500000 ?{label:'Famous',       icon:'🔥', color:'var(--gold)'}:
  f>=100000 ?{label:'Influencer',   icon:'📈', color:'var(--accent)'}:
  f>=10000  ?{label:'Rising Star',  icon:'🚀', color:'var(--accent)'}:
  f>=1000   ?{label:'Growing',      icon:'📊', color:'var(--muted2)'}:
             {label:'Nobody Yet',   icon:'👤', color:'var(--muted)'};

const HATE_COMMENTS = [
  'Lmao who even is this?','Your falloff needs to be studied.','Unfollowed. This is embarrassing.',
  'Ratio’d again.','PR team working overtime.','Nobody asked for this.',
  'I miss the old you (or do I?)','This is why I don’t look up to anyone.',
  'So out of touch it’s painful.','Stop pretending this is art.','We’re tired of you.',
  'Could’ve just apologized.','Another mid post.','Clout chasing is a disease.',
  'Is the talent in the room with us?','Your team is deleting comments fast.',
  'This ain’t it.','Unsubscribed.','Yikes.','Cringe.'
];

const BRAND_DEALS = [
  { id:'athleisure', name:'Pulse Athletics', fee:60000, fame:25 },
  { id:'tech', name:'NovaTech', fee:90000, fame:35 },
  { id:'lux', name:'Eclipse Luxury', fee:150000, fame:50 },
  { id:'energy', name:'VOLT Energy', fee:80000, fame:30 },
  { id:'auto', name:'Titan Motors', fee:200000, fame:60 },
  { id:'gaming', name:'HyperCore Gaming', fee:70000, fame:28 },
];

const SPONSOR_TIERS = [
  { tier:1, label:'Rookie Sponsor', fame:20, pay:40000, exclusive:false },
  { tier:2, label:'Major Sponsor',  fame:40, pay:90000, exclusive:true },
  { tier:3, label:'Elite Sponsor',  fame:65, pay:180000, exclusive:true },
];

const FANDOM_NAMES = [
  'Night Owls','Silver Echo','Glass Hearts','Northbound','Blue Static','Velvet Tide',
  'Starlight Crew','The Loud Ones','Late Shift','Golden Circuit','Neon Wolves','Soft Riot',
];

const SCANDAL_EVENTS = [
  { id:'leak',  msg:'A private message leak went viral. Screenshots everywhere.', hit:12 },
  { id:'pap',   msg:'Paparazzi caught you in a bad moment. The clip is looping.', hit:8 },
  { id:'tweet', msg:'An old post resurfaced. Context didn’t help.', hit:10 },
  { id:'fight', msg:'You were filmed arguing in public. It spread fast.', hit:9 },
  { id:'rumor', msg:'A rumor about you trended for a week. It felt personal.', hit:7 },
];

// ── VIRAL EVENT BANK ─────────────────────────────────────────────
const VIRAL_EVENTS = [
  { msg:'One of your posts blew up completely out of nowhere. The algorithm chose you today.', mult:8,  type:'love' },
  { msg:'A celebrity reposted your content. Your phone hasn\'t stopped since.', mult:12, type:'love' },
  { msg:'You went viral for something you posted three months ago. The internet found it.', mult:6,  type:'love' },
  { msg:'A news outlet covered you. Not entirely accurate. Still traffic.', mult:5,  type:'warn' },
  { msg:'You posted something that clearly resonated. The shares kept coming.', mult:4,  type:'good' },
];

// ── CONTROVERSY EVENT BANK ───────────────────────────────────────
const CONTROVERSY_EVENTS = [
  { msg:'Something you said was taken completely out of context. The pile-on was swift.', follLoss:.15, type:'bad' },
  { msg:'An old post resurfaced. Context: unclear. Internet reaction: decisive.', follLoss:.22, type:'bad' },
  { msg:'You accidentally got caught in someone else\'s drama. Collateral damage.', follLoss:.08, type:'bad' },
  { msg:'You posted something genuine. Half your audience loved it. Half cancelled you.', follLoss:.12, type:'warn' },
  { msg:'A brand dropped you mid-deal over a tweet from years ago. Ouch.', follLoss:.18, type:'bad' },
];

// ── FORMAT FOLLOWERS ─────────────────────────────────────────────
const fmtF = n => n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:`${n}`;

// ── INIT PLATFORM ────────────────────────────────────────────────
function smInit(pid){
  if(!G.sm.platforms[pid]){
    const p = SM_PLATFORMS[pid];
    G.sm.platforms[pid] = {
      active:true, followers:0, posts:0, revenue:0,
      level:1, fame:0, streak:0, niche:'', gear:1,
      subs:0,      // twitch subs
      subRevenue:0,// twitch sub revenue
    };
  }
}

// ── RENDER MEDIA HUB ─────────────────────────────────────────────
function renderMedia(){
  const mc = document.getElementById('media-content');
  if(G.age < 13){
    mc.innerHTML=`<div class="notif warn">Social media unlocks at age 13. For now, just be a kid.</div>`; return;
  }

  const activePlatforms = Object.keys(G.sm.platforms).filter(k=>G.sm.platforms[k].active);
  const totalFollowers  = activePlatforms.reduce((s,k)=>s+G.sm.platforms[k].followers,0);
  const tier            = SM_TIER(G.sm.totalFame>0?totalFollowers:0);

  let html = '';

  // ── Global fame header ───────────────────────────────────────
  html+=`<div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.3rem">
          @${G.firstname.toLowerCase()}${G.lastname.toLowerCase().substring(0,3)}
          ${G.sm.verified?'<span class="verified-badge">✓ Verified</span>':''}
        </div>
        <div style="font-size:.75rem;color:var(--muted2);margin-top:2px">${tier.icon} <span style="color:${tier.color}">${tier.label}</span></div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--fh);font-weight:800;font-size:1.6rem">${fmtF(totalFollowers)}</div>
        <div style="font-size:.68rem;color:var(--muted2);text-transform:uppercase;letter-spacing:.06em">Total Followers</div>
      </div>
    </div>
    <div class="fame-bar-wrap">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px">
        <span style="font-size:.66rem;color:var(--muted2);text-transform:uppercase;letter-spacing:.07em">Fame</span>
        <span style="font-size:.66rem;color:var(--muted2)">${G.sm.totalFame}/100</span>
      </div>
      <div class="fame-bar-track"><div class="fame-bar-fill" style="width:${G.sm.totalFame}%"></div></div>
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(G.sm.totalRevenue)}</div><div class="sm-stat-lbl">Lifetime Earnings</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${activePlatforms.length}</div><div class="sm-stat-lbl">Platforms</div></div>
      ${G.sm.controversies?`<div class="sm-stat"><div class="sm-stat-val" style="color:var(--danger)">${G.sm.controversies}</div><div class="sm-stat-lbl">Controversies</div></div>`:''}
      ${G.sm.cancelCount?`<div class="sm-stat"><div class="sm-stat-val" style="color:var(--danger)">${G.sm.cancelCount}</div><div class="sm-stat-lbl">Times Cancelled</div></div>`:''}
    </div>
  </div>`;

  // ── Hate comments (controversy) ──────────────────────────────
  if(G.sm.controversies>=2 && activePlatforms.length){
    const sample = pick2(HATE_COMMENTS, 5);
    html+=`<div class="card" style="border-color:rgba(248,113,113,.25)">
      <div class="card-title" style="color:var(--danger)">Hate Comments</div>
      <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">The internet is loud right now.</div>
      ${sample.map(c=>`<div style="font-size:.82rem;color:var(--muted2);padding:4px 0">“${c}”</div>`).join('')}
    </div>`;
  }

  // ── PR / Publicist / Brand Deals ────────────────────────────
  html+=`<div class="card">
    <div class="card-title">PR & Brand Deals</div>
    <p style="color:var(--muted2);font-size:.78rem;margin-bottom:10px">
      Publicist: <strong style="color:${G.sm.publicist?'var(--accent)':'var(--muted2)'}">${G.sm.publicist?'Hired':'None'}</strong>
      · Controversies: <strong style="color:${G.sm.controversies? 'var(--danger)':'var(--muted2)'}">${G.sm.controversies}</strong>
    </p>
    <div class="choice-grid">
      ${!G.sm.publicist && G.sm.totalFame>=20?`<div class="choice" onclick="hirePublicist()"><div class="choice-icon">🧑‍💼</div><div class="choice-name">Hire Publicist</div><div class="choice-desc">$40k · reduces controversy impact</div></div>`:''}
      ${G.sm.publicist && G.sm.controversies>0?`<div class="choice" onclick="prRecovery()"><div class="choice-icon">🧯</div><div class="choice-name">PR Cleanup</div><div class="choice-desc">$25k · reduce controversy</div></div>`:''}
      ${G.sm.totalFame>=25?`<div class="choice" onclick="offerBrandDeal()"><div class="choice-icon">🤝</div><div class="choice-name">Seek Brand Deal</div><div class="choice-desc">Fame for cash</div></div>`:''}
    </div>
    ${G.sm.brandDeals.length?`<div style="font-size:.78rem;color:var(--muted2);margin-top:8px">Active deals: ${G.sm.brandDeals.map(d=>d.name).join(', ')}</div>`:''}
  </div>`;

  // ── Fandom / Merch / Sponsor Tier ───────────────────────────
  html+=`<div class="card">
    <div class="card-title">Fandom & Sponsorships</div>
    <p style="color:var(--muted2);font-size:.78rem;margin-bottom:10px">
      Fandom: <strong style="color:${G.sm.fandom.active?'var(--accent)':'var(--muted2)'}">${G.sm.fandom.active?G.sm.fandom.name:'None'}</strong>
      · Size: ${G.sm.fandom.size||0} · Loyalty: ${G.sm.fandom.loyalty||0}
    </p>
    <div class="choice-grid">
      ${!G.sm.fandom.active && G.sm.totalFame>=15?`<div class="choice" onclick="startFandom()"><div class="choice-icon">✨</div><div class="choice-name">Launch Fan Club</div><div class="choice-desc">Grow a fandom</div></div>`:''}
      ${G.sm.fandom.active?`<div class="choice" onclick="dropMerch()"><div class="choice-icon">🧢</div><div class="choice-name">Drop Merch</div><div class="choice-desc">Cash + loyalty</div></div>`:''}
      ${G.sm.fandom.active?`<div class="choice" onclick="meetGreet()"><div class="choice-icon">🤝</div><div class="choice-name">Meet & Greet</div><div class="choice-desc">+Loyalty · risk</div></div>`:''}
      ${G.sm.totalFame>=20?`<div class="choice" onclick="offerSponsorTier()"><div class="choice-icon">💼</div><div class="choice-name">Pursue Sponsor Tier</div><div class="choice-desc">Bigger contracts</div></div>`:''}
    </div>
    ${G.sm.sponsor.tier?`<div style="font-size:.78rem;color:var(--muted2);margin-top:8px">Sponsor: ${G.sm.sponsor.brand||'Unannounced'} · Tier ${G.sm.sponsor.tier} · Exclusive ${G.sm.sponsor.exclusive?'Yes':'No'}</div>`:''}
  </div>`;

  // ── Scandal handling ────────────────────────────────────────
  if(G.sm.controversies>0){
    html+=`<div class="card" style="border-color:rgba(251,191,36,.25)">
      <div class="card-title">Scandal Response</div>
      <div style="font-size:.78rem;color:var(--muted2);margin-bottom:8px">PR crisis level: ${G.sm.prCrisis}</div>
      <div class="choice-grid">
        <div class="choice" onclick="handleScandal('apology')"><div class="choice-icon">🕊️</div><div class="choice-name">Public Apology</div><div class="choice-desc">Reduce heat</div></div>
        <div class="choice" onclick="handleScandal('laylow')"><div class="choice-icon">🫥</div><div class="choice-name">Lay Low</div><div class="choice-desc">Fade it out</div></div>
        <div class="choice" onclick="handleScandal('clapback')"><div class="choice-icon">🔥</div><div class="choice-name">Clap Back</div><div class="choice-desc">Risky</div></div>
      </div>
    </div>`;
  }

  // ── Active platforms ─────────────────────────────────────────
  if(activePlatforms.length){
    activePlatforms.forEach(pid=>{ html += renderPlatformCard(pid); });
  }

  // ── Join a new platform ──────────────────────────────────────
  const available = Object.values(SM_PLATFORMS).filter(p=>
    G.age>=p.minAge && !G.sm.platforms[p.id]
  );
  if(available.length){
    html+=`<div class="card"><div class="card-title">Join a Platform</div>
      <div class="choice-grid">`;
    available.forEach(p=>{
      html+=`<div class="choice" onclick="smJoin('${p.id}')">
        <div class="choice-icon">${p.icon}</div>
        <div class="choice-name">${p.name}</div>
        <div class="choice-desc">${p.desc}</div>
      </div>`;
    });
    html+=`</div></div>`;
  }

  // ── Podcast (15+) ────────────────────────────────────────────
  html += renderPodcastSection();

  // ── OnlyFans (18+, female) ───────────────────────────────────
  if(G.age>=18 && G.gender==='female') html += renderOnlyFansSection();

  // ── SoundCloud / Music ───────────────────────────────────────
  if(G.age>=13) html += renderMusicSection();

  // ── Talk Show (1M+ followers) ────────────────────────────────
  const totalF = Object.keys(G.sm.platforms).reduce((s,k)=>s+G.sm.platforms[k].followers,0);
  if(totalF >= 1000000 || G.sm.totalFame >= 70) html += renderTalkShowSection();

  mc.innerHTML = html;
}

function renderPlatformCard(pid){
  const p   = SM_PLATFORMS[pid];
  const acc = G.sm.platforms[pid];
  const tier = SM_TIER(acc.followers);
  const levelPct = Math.min(100, ((acc.followers % 10000) / 10000)*100);

  let actionsHtml = '<div class="choice-grid">';
  p.actions.forEach(a=>{
    actionsHtml+=`<div class="choice" onclick="smAction('${pid}','${a.id}')">
      <div class="choice-icon">${a.icon}</div>
      <div class="choice-name">${a.label}</div>
      <div class="choice-desc">${a.desc}</div>
    </div>`;
  });
  actionsHtml+='</div>';

  // Niche picker
  const nichePicker = !acc.niche ? `
    <div style="margin-bottom:10px">
      <div style="font-size:.7rem;color:var(--muted2);margin-bottom:6px">Pick your niche:</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        ${p.niches.map(n=>`<button class="btn btn-ghost btn-sm" onclick="smPickNiche('${pid}','${n}')">${n}</button>`).join('')}
      </div>
    </div>` : '';

  return `<div class="sm-platform-card active">
    <div class="sm-platform-header">
      <div class="sm-icon" style="background:${p.gradient}">${p.icon}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px">
          <div class="sm-name">${p.name}</div>
          ${tier.icon !== '👤' ? `<span style="font-size:.72rem;color:${tier.color}">${tier.icon} ${tier.label}</span>`:''}
        </div>
        <div class="sm-handle" style="color:var(--muted2)">@${G.firstname.toLowerCase()}${G.lastname.toLowerCase().substring(0,3)} · ${acc.niche||'No niche yet'}</div>
      </div>
      <button class="btn btn-ghost btn-sm" style="font-size:.66rem" onclick="smLeave('${pid}')">Leave</button>
    </div>

    <div class="sm-stats-row">
      <div class="sm-stat">
        <div class="sm-stat-val">${fmtF(acc.followers)}</div>
        <div class="sm-stat-lbl">${pid==='twitch'?'Followers':'Followers'}</div>
      </div>
      ${pid==='twitch'?`<div class="sm-stat"><div class="sm-stat-val" style="color:var(--accent2)">${fmtF(acc.subs||0)}</div><div class="sm-stat-lbl">Subs</div></div>`:''}
      <div class="sm-stat">
        <div class="sm-stat-val">${acc.posts}</div>
        <div class="sm-stat-lbl">${pid==='twitch'?'Streams':'Posts'}</div>
      </div>
      <div class="sm-stat">
        <div class="sm-stat-val" style="color:var(--gold)">${fmt$(acc.revenue)}</div>
        <div class="sm-stat-lbl">Earned</div>
      </div>
      ${acc.streak>2?`<div class="sm-stat"><div class="sm-stat-val" style="color:var(--accent3)">🔥${acc.streak}</div><div class="sm-stat-lbl">Streak</div></div>`:''}
    </div>

    <div class="sm-level-bar">
      <div class="sm-level-fill" style="width:${levelPct}%;background:${p.gradient}"></div>
    </div>

    ${nichePicker}
    ${actionsHtml}
  </div>`;
}

function hirePublicist(){
  if(G.money<40000){ flash('Need $40,000','warn'); return; }
  G.money -= 40000;
  G.sm.publicist = true;
  addEv('You hired a publicist. The emails got more polite and more strategic.', 'good');
  flash('Publicist hired','good');
  renderMedia();
}

function prRecovery(){
  if(G.money<25000){ flash('Need $25,000','warn'); return; }
  G.money -= 25000;
  if(G.sm.controversies>0) G.sm.controversies--;
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
  addEv('PR cleanup done. The narrative softened a bit.', 'good');
  flash('PR cleanup complete','good');
  renderMedia();
}

function offerBrandDeal(){
  const options = BRAND_DEALS.filter(d=>G.sm.totalFame>=d.fame && !G.sm.brandDeals.find(x=>x.id===d.id));
  if(!options.length){ flash('No brand deals available yet.','warn'); return; }
  const pickDeal = pick(options);
  G.sm.brandDeals.push(pickDeal);
  G.money += pickDeal.fee;
  G.sm.totalRevenue += pickDeal.fee;
  addEv(`Brand deal signed with ${pickDeal.name}. +${fmt$(pickDeal.fee)}.`, 'love');
  flash(`Brand deal: ${pickDeal.name}`,'good');
  renderMedia();
}

function startFandom(){
  const name = pick(FANDOM_NAMES);
  G.sm.fandom = { active:true, name, size: rnd(2000,8000), loyalty: rnd(45,70), merchRevenue:0, meetCount:0, stalkerRisk:0 };
  addEv(`Your fanbase named itself "${name}". It stuck.`, 'love');
  flash(`Fan club launched: ${name}`,'good');
  renderMedia();
}

function dropMerch(){
  const f = G.sm.fandom;
  if(!f.active){ flash('No fandom yet.','warn'); return; }
  const rev = Math.floor((f.size * (f.loyalty/100)) * rnd(8,18));
  f.merchRevenue += rev;
  G.sm.totalRevenue += rev;
  G.money += rev;
  f.loyalty = clamp(f.loyalty + rnd(2,6));
  addEv(`Merch drop sold out fast. +${fmt$(rev)}.`, 'good');
  flash('Merch sold out','good');
  renderMedia();
}

function meetGreet(){
  const f = G.sm.fandom;
  if(!f.active){ flash('No fandom yet.','warn'); return; }
  f.meetCount++;
  const gain = rnd(3,7);
  f.loyalty = clamp(f.loyalty + gain);
  G.happy = clamp(G.happy + rnd(3,8));
  if(Math.random()<0.15){
    f.stalkerRisk += 5;
    addEv('A fan crossed a boundary at the meet‑and‑greet. Security stepped in.', 'warn');
  } else {
    addEv('Meet & greet went great. Fans were thrilled.', 'love');
  }
  renderMedia();
}

function offerSponsorTier(){
  const next = SPONSOR_TIERS.find(t=>t.tier===G.sm.sponsor.tier+1);
  if(!next){ flash('Already at top sponsor tier.','warn'); return; }
  if(G.sm.totalFame < next.fame){ flash(`Need ${next.fame} fame for ${next.label}.`,'warn'); return; }
  G.sm.sponsor.tier = next.tier;
  G.sm.sponsor.exclusive = next.exclusive;
  G.sm.sponsor.brand = pick(BRAND_DEALS).name;
  addEv(`Signed ${next.label} deal with ${G.sm.sponsor.brand}.`, 'love');
  flash('Sponsor tier upgraded','good');
  renderMedia();
}

function handleScandal(type){
  if(G.sm.controversies<=0){ flash('No active controversies.','warn'); return; }
  if(type==='apology'){
    G.sm.controversies = Math.max(0, G.sm.controversies-1);
    G.sm.prCrisis = Math.max(0, G.sm.prCrisis-8);
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
    addEv('You issued a public apology. People moved on… a bit.', 'good');
  } else if(type==='laylow'){
    G.sm.prCrisis = Math.max(0, G.sm.prCrisis-5);
    if(Math.random()<0.5) G.sm.controversies = Math.max(0, G.sm.controversies-1);
    addEv('You laid low. The timeline found something else to argue about.', 'warn');
  } else if(type==='clapback'){
    G.sm.controversies += 1;
    G.sm.prCrisis += 6;
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,6));
    addEv('You clapped back. It went viral for better or worse.', 'warn');
  }
  renderMedia();
}

// ── JOIN / LEAVE ──────────────────────────────────────────────────
function smJoin(pid){
  smInit(pid);
  const p = SM_PLATFORMS[pid];
  addEv(`You created a ${p.name} account. @${G.firstname.toLowerCase()}${G.lastname.toLowerCase().substring(0,3)} is now live.`,'good');
  flash(`${p.icon} Joined ${p.name}!`,'good');
  updateHUD(); renderMedia();
}

function smLeave(pid){
  const p   = SM_PLATFORMS[pid];
  const acc = G.sm.platforms[pid];
  delete G.sm.platforms[pid];
  addEv(`You deleted your ${p.name} account. ${fmtF(acc.followers)} followers just became someone else's problem.`,'warn');
  flash(`Left ${p.name}.`,'warn');
  renderMedia();
}

function smPickNiche(pid, niche){
  G.sm.platforms[pid].niche = niche;
  flash(`Niche set: ${niche}`,'good');
  renderMedia();
}

// ── CORE ACTION ENGINE ────────────────────────────────────────────
function smAction(pid, actionId){
  smInit(pid);
  const p   = SM_PLATFORMS[pid];
  const acc = G.sm.platforms[pid];
  const act = p.actions.find(a=>a.id===actionId);

  // Cost check
  if(act.cost && G.money < act.cost){
    flash(`Need ${fmt$(act.cost)}`,'bad'); return;
  }
  if(act.cost) G.money -= act.cost;

  // Base performance: smarts + looks + niche bonus + gear
  const nicheBonus = acc.niche ? 1.2 : 1.0;
  const gearBonus  = acc.gear  || 1;
  const smartsW    = ['twitter','youtube'].includes(pid) ? (G.smarts/100) : (G.smarts/200);
  const looksW     = ['instagram','tiktok'].includes(pid) ? (G.looks/100) : (G.looks/200);
  const basePerf   = (0.4 + smartsW + looksW) * nicheBonus * gearBonus;

  // Random variance
  const roll = Math.random();
  let follGain = 0, revGain = 0, famGain = 0;
  let evMsg = '', evType = '';

  // ── Platform-specific action logic ──────────────────────────
  if(pid === 'twitch'){
    const result = twitchAction(actionId, acc, basePerf, roll);
    follGain = result.foll; revGain = result.rev; famGain = result.fame;
    evMsg = result.msg; evType = result.type;
    if(result.healthCost) G.health = clamp(G.health - result.healthCost);
    if(result.subGain)    acc.subs = (acc.subs||0) + result.subGain;
  } else {
    const result = genericAction(pid, actionId, acc, basePerf, roll, p);
    follGain = result.foll; revGain = result.rev; famGain = result.fame;
    evMsg = result.msg; evType = result.type;
    if(result.healthCost) G.health = clamp(G.health - result.healthCost);
    if(result.gearBoost)  acc.gear = Math.min(3, (acc.gear||1) + 1);
  }

  // Apply gains
  acc.followers  = Math.max(0, acc.followers + follGain);
  acc.revenue   += revGain;
  acc.posts++;
  acc.streak    = (actionId === 'grind' || actionId === 'upload' || actionId.startsWith('stream')) ? acc.streak+1 : Math.max(0,acc.streak-1);
  G.sm.totalRevenue += revGain;
  G.money           += revGain;
  G.sm.totalFame     = clamp(G.sm.totalFame + famGain);

  // Verify threshold
  if(!G.sm.verified && (acc.followers>=100000 || G.sm.totalFame>=60)){
    G.sm.verified = true;
    addEv('You got verified. The little checkmark. It means something, apparently.','love');
    flash('✓ Verified!','good');
  }

  // Viral chance (3% normally, higher with streak)
  if(Math.random() < (0.03 + acc.streak*0.004)){
    const ve = pick(VIRAL_EVENTS);
    const viralfoll = Math.floor(acc.followers * (ve.mult/10) * basePerf + rnd(500,5000));
    const viralrev  = Math.floor(viralfoll * p.revenueMulti * 0.004);
    acc.followers   += viralfoll;
    acc.revenue     += viralrev;
    G.money         += viralrev;
    G.sm.totalRevenue += viralrev;
    G.sm.totalFame   = clamp(G.sm.totalFame + rnd(5,15));
    addEv(`${p.icon} VIRAL on ${p.name}: ${ve.msg} +${fmtF(viralfoll)} followers!`, ve.type);
    flash(`🔥 VIRAL! +${fmtF(viralfoll)} on ${p.name}`,'good');
  }

  // Controversy chance (higher with dark score and drama actions)
  const prShield = G.sm.publicist ? 0.015 : 0;
  const controvChance = Math.max(0.01, 0.04 + (G.darkScore*0.005) + (actionId==='ratio'?0.15:0) + (actionId==='trend'?0.05:0) - prShield);
  if(Math.random() < controvChance){
    const ce       = pick(CONTROVERSY_EVENTS);
    const follLoss = Math.floor(acc.followers * ce.follLoss);
    acc.followers  = Math.max(0, acc.followers - follLoss);
    G.sm.controversies++;
    G.sm.totalFame = clamp(G.sm.totalFame - rnd(3,10));
    addEv(`${p.icon} ${ce.msg} (-${fmtF(follLoss)} followers)`, ce.type);
    flash(`⚠️ Controversy on ${p.name}!`,'bad');

    // Cancel risk
    if(G.sm.controversies >= 3 && Math.random() < 0.25){
      G.sm.cancelCount++;
      const bigLoss = Math.floor(acc.followers * 0.35);
      acc.followers  = Math.max(0, acc.followers - bigLoss);
      G.sm.totalFame = clamp(G.sm.totalFame - 20);
      G.happy        = clamp(G.happy - 15);
      addEv(`You got cancelled on ${p.name}. Lost ${fmtF(bigLoss)} followers. The discourse lasted three weeks.`,'bad');
      flash('🚨 You got cancelled!','bad');
    }
  }

  addEv(evMsg, evType);
  flash(`${p.icon} ${evMsg.substring(0,45)}${evMsg.length>45?'...':''}`);
  updateHUD(); renderMedia();
}

// ── GENERIC PLATFORM ACTION RESULTS ──────────────────────────────
function genericAction(pid, actionId, acc, basePerf, roll, p){
  let foll=0, rev=0, fame=0, msg='', type='', healthCost=0, gearBoost=false;
  const f = acc.followers;

  const baseFoll = () => Math.floor((rnd(20,200) + f*0.015) * basePerf * (0.5+roll));
  const baseRev  = () => Math.floor((f * p.revenueMulti * 0.0008) * (0.6+roll));

  switch(actionId){
    case 'upload':
      foll = baseFoll(); rev = baseRev(); fame = foll>500?1:0;
      msg = pick([
        `Posted new ${pid==='instagram'?'photo':'video'} content. The algorithm received it.`,
        `Your latest post is doing numbers. Quietly, but doing numbers.`,
        `New content up. ${foll>200?'Good response.':'It existed. People saw it.'}`,
      ]); break;
    case 'reel': case 'shorts':
      foll = Math.floor(baseFoll()*1.4); rev = Math.floor(baseRev()*0.7); fame = foll>800?1:0;
      msg = `Short-form content posted. Reach up. Revenue-per-view down. That's the deal.`; break;
    case 'story':
      foll = Math.floor(baseFoll()*0.4); rev = 0; acc.streak++;
      msg = `Stories posted. Core fans engaged. Streak maintained.`; type=''; break;
    case 'grind':
      foll = Math.floor(baseFoll()*2.2); rev = Math.floor(baseRev()*1.8); healthCost = rnd(4,9); fame = 1;
      msg = `You posted every single day this week. The algorithm rewarded you. Your sleep did not.`; type='warn'; break;
    case 'trend':
      if(roll>0.45){ foll=Math.floor(baseFoll()*3); rev=Math.floor(baseRev()*2); fame=2; msg=`You jumped on the trend at exactly the right moment. Timing is everything.`; type='good'; }
      else          { foll=Math.floor(baseFoll()*0.3); msg=`You jumped on the trend two days late. Everyone could tell.`; type='warn'; }
      break;
    case 'duet':
      if(roll>0.4){ foll=Math.floor(baseFoll()*2); fame=1; msg=`The duet landed well. Their audience noticed you.`; type='good'; }
      else          { foll=Math.floor(baseFoll()*0.5); msg=`The duet got views but mostly just for the original.`; }
      break;
    case 'live':
      foll=Math.floor(baseFoll()*0.8); rev=Math.floor(baseRev()*1.5); fame=1;
      msg=`Went live. The parasocial relationship deepened. Revenue from gifts came in.`; break;
    case 'thread':
      foll=Math.floor(baseFoll()*(G.smarts/60)); fame=G.smarts>70?2:1;
      rev=Math.floor(baseRev()*0.5);
      msg = G.smarts>65 ? `Your thread went places. People quoted it. Debated it. Shared it.` : `Thread posted. Decent engagement. Nothing viral.`; break;
    case 'ratio':
      if(roll>0.5){ foll=Math.floor(baseFoll()*2.5); fame=3; msg=`You won the ratio. The internet bowed, briefly.`; type='warn'; }
      else          { foll=0; fame=-1; msg=`You tried to start drama and got ratio'd back. Embarrassing.`; type='bad'; }
      break;
    case 'spaces':
      foll=Math.floor(baseFoll()*0.7); G.smarts=clamp(G.smarts+rnd(1,3));
      msg=`Twitter Space hosted. ${rnd(50,800)} listeners. Smarter by the end.`; break;
    case 'substack':
      rev=rnd(50,500); foll=Math.floor(baseFoll()*0.3);
      msg=`Newsletter published. Paying subscribers: ${rnd(5,50)}. Actual sustainable income.`; break;
    case 'ads':
      foll=Math.floor((rnd(500,3000))*basePerf); rev=0;
      msg=`Paid promotion ran. ${fmtF(foll)} new followers acquired.`; type='warn'; break;
    case 'collab': case 'brand_partner':
      if(G.friends.length>0||G.sm.totalFame>30){
        foll=Math.floor(baseFoll()*2.5); rev=Math.floor(baseRev()*2); fame=2;
        msg=`Collaboration went live. Both audiences saw it. Numbers moved.`; type='good';
      } else {
        msg=`You tried to set up a collab but don't have the connections yet.`; type='warn';
      } break;
    case 'sponsor':
      if(acc.followers>=5000){ rev=Math.floor(acc.followers*0.02*rnd(1,3)); foll=Math.floor(baseFoll()*0.5);
        msg=`Sponsorship deal completed. ${fmt$(rev)} for a single post. Capitalism: working.`; type='good'; }
      else{ msg=`Not enough followers for sponsorships yet. (Need 5K+)`; type='warn'; }
      break;
    case 'photoshoot':
      gearBoost=true; foll=Math.floor(baseFoll()*1.5);
      msg=`Professional shoot done. Content quality permanently improved. Worth every dollar.`; type='good'; break;
    case 'buy_gear':
      gearBoost=true; foll=Math.floor(baseFoll()*0.5);
      msg=`Gear upgraded. Production value noticeably better. Audience will notice.`; type='good'; break;
  }
  return {foll,rev,fame,msg,type,healthCost,gearBoost};
}

// ── TWITCH-SPECIFIC ACTIONS ───────────────────────────────────────
function twitchAction(actionId, acc, basePerf, roll){
  let foll=0, rev=0, fame=0, msg='', type='', healthCost=0, subGain=0;
  const f = acc.followers;
  const subs = acc.subs || 0;

  const baseFoll = () => Math.floor((rnd(10,150) + f*0.012) * basePerf * (0.5+roll));
  const baseRev  = () => Math.floor((subs*4.99*0.5) + (f*0.0006)); // sub revenue + bits estimate

  switch(actionId){
    case 'stream_game':
      foll=baseFoll(); subGain=Math.floor(foll*0.04); rev=baseRev();
      msg=pick([
        `Streamed for ${rnd(3,8)} hours. Chat was chaotic. Clip went viral on clips subreddit.`,
        `Gaming stream ran long. The community moment in hour 4 will be talked about.`,
        `You hit a clutch play on stream. Clip is circulating.`,
        `Good stream. Consistent viewership. The grind compounds.`,
      ]); break;
    case 'stream_irl':
      foll=Math.floor(baseFoll()*1.2); subGain=Math.floor(foll*0.05); rev=baseRev();
      msg=pick([
        `IRL stream from ${pick(['the city','a concert','a sports game','your car','a mall'])}. Authentic. Community loved it.`,
        `You IRL streamed and something unexpected happened. Chat went insane.`,
        `Real life content hit different today. Parasocial bond: strengthened.`,
      ]); break;
    case 'stream_chat':
      foll=Math.floor(baseFoll()*0.8); subGain=Math.floor(foll*0.06); rev=baseRev();
      msg=`Just Chatting stream. You talked for hours. Chat felt like a community tonight.`; break;
    case 'stream_music':
      foll=Math.floor(baseFoll()*0.9); subGain=Math.floor(foll*0.04); rev=Math.floor(baseRev()*0.8);
      msg=`Music stream ran ${rnd(2,5)} hours. Tight-knit audience. Unique niche carved out.`; break;
    case 'stream_cook':
      foll=Math.floor(baseFoll()*0.7); subGain=Math.floor(foll*0.05); rev=Math.floor(baseRev()*0.9);
      msg=`Cooking stream. You ${pick(['made pasta','attempted sushi','burned something interesting','cooked from a random ingredient challenge'])}. Chat kept you accountable.`; break;
    case 'charity':
      foll=Math.floor(baseFoll()*2); subGain=Math.floor(foll*0.08); fame=4;
      rev=rnd(1000,10000);
      msg=`Charity stream raised ${fmt$(rev)} for ${pick(['Children\'s Hospital','Mental Health org','Animal Shelter','Food Bank'])}. Community showed up.`; type='love'; break;
    case 'marathon':
      foll=Math.floor(baseFoll()*3.5); subGain=Math.floor(foll*0.07); rev=Math.floor(baseRev()*2.5);
      healthCost=rnd(15,25); fame=3;
      msg=`24-hour marathon stream completed. ${fmtF(foll)} new followers. You saw things in hour 20.`; type='warn'; break;
    case 'sub_push':
      subGain=Math.floor(subs*0.15 + rnd(20,200)); rev=Math.floor(subGain*4.99*0.5); foll=Math.floor(baseFoll()*0.5);
      msg=`Sub drive event ran. Chat came through. ${subGain} new subscribers.`; type='good'; break;
    case 'collab_stream':
      if(G.friends.length>0||G.sm.totalFame>20){
        foll=Math.floor(baseFoll()*2.8); subGain=Math.floor(foll*0.06); fame=2;
        msg=`Collab stream with another creator. Both audiences raided. Big night.`; type='good';
      } else {
        msg=`Can't set up a collab without connections. Build your network first.`; type='warn';
      } break;
    case 'buy_gear':
      acc.gear=(acc.gear||1)+1; foll=Math.floor(baseFoll()*0.3);
      msg=`Setup upgraded. Stream quality is noticeably better. Audience can tell.`; type='good'; break;
  }
  return {foll,rev,fame,msg,type,healthCost,subGain};
}

// ══════════════════════════════════════════════════════════════════
//  PODCAST SYSTEM
// ══════════════════════════════════════════════════════════════════

// Real-world inspired famous guests — pull from by fame threshold
const PODCAST_GUESTS = [
  // [name, description, fameNeeded, listenerBoost, type]
  { name:'Joe Rogan',        desc:'The goat. Three hours. No filter.',                fame:30,  boost:50000,  type:'comedian'  },
  { name:'Elon Musk',        desc:'He\'ll say something. It will trend.',             fame:60,  boost:150000, type:'tech'      },
  { name:'MrBeast',          desc:'Biggest YouTuber alive. Mutual promo.',            fame:40,  boost:80000,  type:'creator'   },
  { name:'Kim Kardashian',   desc:'She brings the entire internet with her.',         fame:50,  boost:100000, type:'celebrity' },
  { name:'Billie Eilish',    desc:'Genuine, weird, brilliant. Perfect episode.',      fame:40,  boost:70000,  type:'music'     },
  { name:'Kevin Hart',       desc:'Every joke lands. Every story is a movie.',        fame:35,  boost:60000,  type:'comedian'  },
  { name:'Alex Cooper',      desc:'Call Her Daddy energy. Instant crossover.',        fame:30,  boost:45000,  type:'podcaster' },
  { name:'Dwayne Johnson',   desc:'The most likeable person alive, statistically.',   fame:55,  boost:120000, type:'celebrity' },
  { name:'Andrew Huberman',  desc:'Protocols, sunlight, science. Huge audience.',     fame:35,  boost:55000,  type:'scientist' },
  { name:'Charli D\'Amelio', desc:'TikTok royalty. Cross-platform explosion.',        fame:25,  boost:40000,  type:'creator'   },
  { name:'Drake',            desc:'He doesn\'t do many. This is a big deal.',         fame:70,  boost:200000, type:'music'     },
  { name:'Taylor Swift',     desc:'She doesn\'t do podcasts. This is historic.',      fame:80,  boost:500000, type:'music'     },
  { name:'Barack Obama',     desc:'Statesman energy. Your credibility: maxed.',       fame:75,  boost:300000, type:'politics'  },
  { name:'Oprah Winfrey',    desc:'She built the template. Your podcast ascends.',    fame:65,  boost:200000, type:'media'     },
  { name:'Hasan Piker',      desc:'Political. Streamer. Half the internet loves him.',fame:30,  boost:40000,  type:'creator'   },
  { name:'your city mayor',  desc:'Local flavour. Surprisingly good content.',        fame:5,   boost:2000,   type:'local'     },
  { name:'a friend',         desc:'Parasocial gold. Your audience loves crossovers.', fame:0,   boost:500,    type:'friend'    },
];

function renderPodcastSection(){
  const pod = G.sm.podcast;
  if(G.age < 15) return '';

  if(!pod.active){
    return `<div class="card">
      <div class="card-title">🎙️ Start a Podcast</div>
      <p style="color:var(--muted2);font-size:.855rem;margin-bottom:12px">Available from age 15. Build a show, grow a loyal audience, invite famous guests.</p>
      <div style="margin-bottom:10px">
        <input id="pod-name-inp" type="text" placeholder="Your show name..." class="name-input" style="font-size:.9rem;padding:8px 12px">
      </div>
      <button class="btn btn-primary" onclick="startPodcast()">🎙️ Launch Podcast</button>
    </div>`;
  }

  const availableGuests = PODCAST_GUESTS.filter(g=>G.sm.totalFame>=g.fame && !pod.guests.includes(g.name));
  const hadGuests = pod.guests.length > 0;

  return `<div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between">
      <span>🎙️ ${pod.name || 'Your Podcast'}</span>
      ${pod.episodes>0?`<span class="badge badge-accent">Ep. ${pod.episodes}</span>`:''}
    </div>
    <div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap">
      <div class="sm-stat"><div class="sm-stat-val">${fmtF(pod.listeners)}</div><div class="sm-stat-lbl">Listeners</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${pod.episodes}</div><div class="sm-stat-lbl">Episodes</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(pod.revenue)}</div><div class="sm-stat-lbl">Earned</div></div>
    </div>
    ${pod.guests.length?`<div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">Past guests: ${pod.guests.slice(-5).join(', ')}</div>`:''}
    <div class="choice-grid">
      <div class="choice" onclick="podcastDo('solo')"><div class="choice-icon">🎤</div><div class="choice-name">Record Solo Episode</div><div class="choice-desc">+Listeners</div></div>
      <div class="choice" onclick="podcastDo('story')"><div class="choice-icon">📖</div><div class="choice-name">Story Episode</div><div class="choice-desc">+Loyal audience</div></div>
      <div class="choice" onclick="podcastDo('news')"><div class="choice-icon">📰</div><div class="choice-name">News & Commentary</div><div class="choice-desc">+Smarts +Listeners</div></div>
      <div class="choice" onclick="podcastDo('ad')"><div class="choice-icon">💰</div><div class="choice-name">Take an Ad Deal</div><div class="choice-desc">+Revenue</div></div>
    </div>
    ${availableGuests.length?`
    <div style="margin-top:12px">
      <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);margin-bottom:8px">Invite a Guest</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${availableGuests.slice(0,5).map(g=>`
          <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface3);border-radius:var(--r-sm);padding:8px 12px">
            <div>
              <div style="font-family:var(--fh);font-weight:700;font-size:.85rem">${g.name}</div>
              <div style="font-size:.72rem;color:var(--muted2)">${g.desc}</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="invitePodcastGuest('${g.name.replace(/'/g,"\\'")}')">Invite</button>
          </div>`).join('')}
      </div>
    </div>`:''}
  </div>`;
}

function startPodcast(){
  const inp = document.getElementById('pod-name-inp');
  const name = (inp&&inp.value.trim()) || `${G.firstname}'s Podcast`;
  G.sm.podcast = { active:true, name, episodes:0, listeners:rnd(10,50), revenue:0, guests:[] };
  addEv(`You launched "${name}". Episode one recorded. Eight listeners. One was your mom.`,'good');
  flash(`🎙️ "${name}" is live!`,'good');
  renderMedia();
}

function podcastDo(type){
  const pod = G.sm.podcast;
  pod.episodes++;
  let listenerGain = 0, rev = 0, msg = '';

  const base = Math.floor(pod.listeners * rnd(3,10)/100 + rnd(10,200));

  if(type==='solo'){
    listenerGain = base;
    msg = pick([
      `Episode ${pod.episodes} recorded. Unscripted, honest. Audience felt it.`,
      `You rambled for an hour and somehow it was compelling. The parasocial bond deepens.`,
      `Solo episode. You said something true. Comments: overwhelmingly positive.`,
    ]);
  } else if(type==='story'){
    listenerGain = Math.floor(base * 1.4);
    G.smarts = clamp(G.smarts + rnd(1,3));
    msg = `Story-driven episode. Narrative arc. Your best work yet. Listeners sent messages.`;
  } else if(type==='news'){
    listenerGain = Math.floor(base * (G.smarts/60));
    G.smarts = clamp(G.smarts + rnd(2,4));
    msg = `News commentary episode. Smarts-driven content. The discourse was had.`;
  } else if(type==='ad'){
    rev = Math.floor(pod.listeners * rnd(2,6) / 1000 * 30); // ~$30 CPM
    pod.revenue += rev; G.sm.totalRevenue += rev; G.money += rev;
    msg = `Ad deal paid ${fmt$(rev)}. You read it naturally. Mostly.`;
    addEv(msg,'good');
    flash(`Podcast ad: +${fmt$(rev)} 💰`,'good');
    updateHUD(); renderMedia(); return;
  }

  pod.listeners += listenerGain;
  G.happy = clamp(G.happy + rnd(3,6));
  addEv(msg,'good');
  flash(`🎙️ Episode ${pod.episodes} · +${fmtF(listenerGain)} listeners`,'good');
  updateHUD(); renderMedia();
}

function invitePodcastGuest(guestName){
  const pod   = G.sm.podcast;
  const guest = PODCAST_GUESTS.find(g=>g.name===guestName);
  if(!guest){ flash('Guest not found','bad'); return; }
  if(G.sm.totalFame < guest.fame){ flash(`Need ${guest.fame} fame to book ${guest.name}`,'bad'); return; }

  pod.guests.push(guest.name);
  pod.episodes++;
  pod.listeners += guest.boost;
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(3,12));
  G.happy = clamp(G.happy + rnd(8,16));
  const rev = Math.floor(pod.listeners * 0.02 * rnd(1,3));
  pod.revenue += rev; G.sm.totalRevenue += rev; G.money += rev;

  addEv(`${guest.name} on the podcast. Episode went massive. +${fmtF(guest.boost)} listeners. ${fmt$(rev)} in ad revenue.`,'love');
  flash(`🎙️ ${guest.name} episode! +${fmtF(guest.boost)} listeners`,'good');
  updateHUD(); renderMedia();
}

// ══════════════════════════════════════════════════════════════════
//  ONLYFANS SYSTEM (18+, female)
// ══════════════════════════════════════════════════════════════════

const OF_TIERS = {
  beginner: { label:'Beginner',  price:9.99,  subCap:500,     icon:'🌸' },
  regular:  { label:'Regular',   price:14.99, subCap:5000,    icon:'💖' },
  premium:  { label:'Premium',   price:24.99, subCap:50000,   icon:'💎' },
  elite:    { label:'Elite',     price:49.99, subCap:Infinity, icon:'👑' },
};

const OF_POST_TYPES = [
  { id:'photo',    label:'Post Photos',       icon:'📸', desc:'Standard content · +Subs',        subGain:[5,30],   happyMult:1.0 },
  { id:'video',    label:'Post a Video',       icon:'🎬', desc:'Better engagement · +More subs',  subGain:[10,60],  happyMult:1.0 },
  { id:'ppv',      label:'PPV Message',        icon:'💌', desc:'+Big revenue from existing subs', subGain:[0,5],    happyMult:1.0, ppv:true },
  { id:'tease',    label:'Free Tease Post',    icon:'👀', desc:'+Subs from your other platforms', subGain:[20,100], happyMult:1.0, crossPromo:true },
  { id:'live',     label:'Go Live',            icon:'📡', desc:'+Tips +Loyal subs',               subGain:[5,25],   happyMult:1.0 },
  { id:'collab',   label:'Collab with Creator',icon:'🤝', desc:'+Big sub boost',                  subGain:[30,150], happyMult:1.0 },
  { id:'bundle',   label:'Sell a Bundle',      icon:'📦', desc:'+Bulk revenue from archive',      subGain:[0,10],   happyMult:1.0 },
  { id:'upgrade',  label:'Upgrade Tier',       icon:'⬆️', desc:'Raise price · lose some subs',    subGain:[0,0],    happyMult:1.0 },
];

function renderOnlyFansSection(){
  const of = G.sm.onlyfans;
  if(!of.active){
    return `<div class="card" style="border-color:rgba(244,114,182,.2)">
      <div class="card-title" style="color:var(--accent3)">💗 OnlyFans</div>
      <p style="color:var(--muted2);font-size:.855rem;margin-bottom:12px">
        18+ · Subscription content platform. High earning potential. Permanent internet history. Your call.
      </p>
      <div class="choice-grid">
        <div class="choice" onclick="startOnlyFans()" style="border-color:rgba(244,114,182,.3)">
          <div class="choice-icon">💗</div><div class="choice-name">Start OnlyFans</div><div class="choice-desc">High risk · high reward</div>
        </div>
      </div>
    </div>`;
  }

  const tier = OF_TIERS[of.tier];
  const monthlyRev = Math.floor(of.subs * tier.price * 0.8);

  return `<div class="card" style="border-color:rgba(244,114,182,.25)">
    <div class="card-title" style="color:var(--accent3)">💗 OnlyFans ${tier.icon}</div>
    <div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--accent3)">${of.subs.toLocaleString()}</div><div class="sm-stat-lbl">Subscribers</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${of.postCount}</div><div class="sm-stat-lbl">Posts</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(of.revenue)}</div><div class="sm-stat-lbl">Total Earned</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--success)">~${fmt$(monthlyRev)}</div><div class="sm-stat-lbl">Per Month</div></div>
    </div>
    <div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">
      Tier: <strong style="color:var(--accent3)">${tier.label}</strong> · $${tier.price}/mo · Max ${tier.subCap===Infinity?'Unlimited':tier.subCap.toLocaleString()} subs
    </div>
    <div class="choice-grid">
      ${OF_POST_TYPES.map(pt=>`
        <div class="choice" onclick="ofPost('${pt.id}')" style="border-color:rgba(244,114,182,.2)">
          <div class="choice-icon">${pt.icon}</div>
          <div class="choice-name">${pt.label}</div>
          <div class="choice-desc">${pt.desc}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

function startOnlyFans(){
  G.sm.onlyfans = { active:true, subs:0, revenue:0, tier:'beginner', postCount:0 };
  G.darkScore++;
  addEv('You started an OnlyFans. The account is live. The internet is eternal. You know this.','warn');
  flash('💗 OnlyFans live!','good');
  renderMedia();
}

function ofPost(type){
  const of    = G.sm.onlyfans;
  const tier  = OF_TIERS[of.tier];
  const pt    = OF_POST_TYPES.find(p=>p.id===type);
  of.postCount++;

  // Cross-promo: bonus if you have other platforms
  const activePlatforms = Object.keys(G.sm.platforms).length;

  if(type==='upgrade'){
    const tiers = ['beginner','regular','premium','elite'];
    const idx   = tiers.indexOf(of.tier);
    if(idx>=tiers.length-1){ flash('Already at Elite tier.','warn'); return; }
    const newTier = tiers[idx+1];
    const oldSubs = of.subs;
    of.tier  = newTier;
    of.subs  = Math.floor(of.subs * 0.7); // lose 30% on price increase
    addEv(`Upgraded to ${OF_TIERS[newTier].label} tier ($${OF_TIERS[newTier].price}/mo). Lost ${(oldSubs-of.subs).toLocaleString()} subs but revenue per sub is higher.`,'warn');
    flash(`Tier upgraded to ${OF_TIERS[newTier].label}!`,'good');
    renderMedia(); return;
  }

  if(type==='ppv'){
    // PPV revenue from existing subs
    const ppvBuy  = Math.floor(of.subs * rnd(10,35)/100);
    const ppvRev  = ppvBuy * rnd(5,25);
    of.revenue        += ppvRev;
    G.sm.totalRevenue += ppvRev;
    G.money           += ppvRev;
    addEv(`PPV message sent. ${ppvBuy.toLocaleString()} subs purchased it. +${fmt$(ppvRev)}.`,'good');
    flash(`PPV: +${fmt$(ppvRev)} 💌`,'good');
    updateHUD(); renderMedia(); return;
  }

  if(type==='bundle'){
    if(of.postCount<10){ flash('Need 10+ posts for a bundle','warn'); return; }
    const bundleRev = Math.floor(of.subs * rnd(5,20)/100) * rnd(15,40);
    of.revenue        += bundleRev;
    G.sm.totalRevenue += bundleRev;
    G.money           += bundleRev;
    addEv(`Archive bundle sold. ${fmt$(bundleRev)} from fans buying the back catalogue.`,'good');
    flash(`Bundle revenue: +${fmt$(bundleRev)}`,'good');
    updateHUD(); renderMedia(); return;
  }

  // Subscriber gain
  let subGain = rnd(pt.subGain[0], pt.subGain[1]);

  // Looks stat boosts OF significantly
  subGain = Math.floor(subGain * (0.5 + G.looks/100));

  // Cross-promo bonus
  if(type==='tease') subGain += Math.floor(activePlatforms * rnd(10,40));

  // Collab needs connections
  if(type==='collab' && G.friends.length===0){ flash('Need friends/connections for collabs','warn'); return; }
  if(type==='collab') subGain = Math.floor(subGain * 1.5);

  // Cap at tier max
  const cap = OF_TIERS[of.tier].subCap;
  of.subs = Math.min(cap, of.subs + subGain);

  const lines = {
    photo:   ['Photos posted. Response was immediate and enthusiastic.','New photo set up. Subscribers engaged heavily.'],
    video:   ['Video content posted. Completion rate high. Subs gained.','Video did numbers. Retention was strong.'],
    tease:   ['Free tease post on your other platforms. Funnel working.','Teaser content went up. Conversions coming in.'],
    live:    ['Live stream ran. Tips came in. Community moment happened.','Went live. Chat was active. Tips flew in.'],
    collab:  ['Collab content posted. Both audiences merged. Big gains.'],
  };
  const msg = lines[type] ? pick(lines[type]) : `Content posted. +${subGain.toLocaleString()} subscribers.`;
  addEv(`${msg} (+${subGain.toLocaleString()} subs)`,'good');
  flash(`💗 +${subGain.toLocaleString()} subs`,'good');
  updateHUD(); renderMedia();
}

// ══════════════════════════════════════════════════════════════════
//  MUSIC SYSTEM (SoundCloud → full career)
// ══════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
//  MUSIC SYSTEM — Full Industry Expansion
// ══════════════════════════════════════════════════════════════════

// ── GENRE DEFINITIONS ─────────────────────────────────────────────
const MUSIC_GENRES_DATA = {
  'Rap/Hip-Hop': {
    icon:'🎤', desc:'Bars, beats, and authenticity. The internet\'s genre.',
    instruments:[], skillStat:'smarts', streamMult:1.4, beefChance:0.18,
    subgenres:['Trap','Drill','Conscious Hip-Hop','Mumble Rap','Boom Bap','Melodic Rap'],
    grammarLabel:'Best Rap Album',
  },
  'R&B': {
    icon:'🎶', desc:'Groove, soul, and melody. Timeless.',
    instruments:['piano','vocals'], skillStat:'looks', streamMult:1.2, beefChance:0.05,
    subgenres:['Neo-Soul','Contemporary R&B','Alt R&B','Gospel-R&B'],
    grammarLabel:'Best R&B Album',
  },
  'Pop': {
    icon:'⭐', desc:'Catchy hooks and mass appeal. The biggest ceiling.',
    instruments:['vocals','keyboard'], skillStat:'looks', streamMult:1.6, beefChance:0.08,
    subgenres:['Synth-Pop','Indie Pop','Electropop','Teen Pop','Dark Pop'],
    grammarLabel:'Best Pop Album',
  },
  'Alternative': {
    icon:'🖤', desc:'Outside the mainstream. Critical darling territory.',
    instruments:['guitar','bass','drums'], skillStat:'smarts', streamMult:0.9, beefChance:0.04,
    subgenres:['Indie Rock','Post-Punk Revival','Shoegaze','Emo','Art Rock'],
    grammarLabel:'Best Alternative Album',
  },
  'EDM': {
    icon:'🎧', desc:'Festivals, drops, and DJ sets. Global reach.',
    instruments:['keyboard','synthesizer'], skillStat:'smarts', streamMult:1.3, beefChance:0.03,
    subgenres:['House','Techno','Dubstep','Future Bass','Trance','Drum & Bass'],
    grammarLabel:'Best Dance Recording',
  },
  'Indie': {
    icon:'🎸', desc:'DIY ethos. Cult following. Critical cred.',
    instruments:['guitar','bass','drums'], skillStat:'smarts', streamMult:0.8, beefChance:0.02,
    subgenres:['Lo-Fi','Bedroom Pop','Folk-Indie','Math Rock','Twee'],
    grammarLabel:'Best Alternative Album',
  },
  'Country': {
    icon:'🤠', desc:'Storytelling, twang, and massive touring revenue.',
    instruments:['guitar','banjo','fiddle'], skillStat:'smarts', streamMult:1.1, beefChance:0.06,
    subgenres:['Country Pop','Outlaw Country','Bluegrass','Americana','Bro Country'],
    grammarLabel:'Best Country Album',
  },
  'Rock': {
    icon:'🔥', desc:'Guitars loud. Drums louder. Legacy eternal.',
    instruments:['guitar','bass','drums'], skillStat:'health', streamMult:1.0, beefChance:0.07,
    subgenres:['Classic Rock','Metal','Punk','Grunge','Post-Rock','Garage Rock'],
    grammarLabel:'Best Rock Album',
  },
  'Classical/Jazz': {
    icon:'🎻', desc:'Instrument mastery required. Prestige ceiling: infinite.',
    instruments:['piano','violin','saxophone','trumpet'], skillStat:'smarts', streamMult:0.5, beefChance:0.01,
    subgenres:['Jazz','Neo-Classical','Orchestral','Chamber Music','Fusion'],
    grammarLabel:'Best Classical Album',
  },
  'Latin': {
    icon:'💃', desc:'Crossover potential. Global chart domination.',
    instruments:['vocals','guitar'], skillStat:'looks', streamMult:1.5, beefChance:0.08,
    subgenres:['Reggaeton','Bachata','Salsa','Latin Pop','Corridos'],
    grammarLabel:'Best Latin Album',
  },
  'K-Pop/J-Pop': {
    icon:'✨', desc:'Aesthetic maximalism and obsessive fandom.',
    instruments:['vocals'], skillStat:'looks', streamMult:1.8, beefChance:0.04,
    subgenres:['K-Pop Idol','Solo K-Pop','J-Pop','City Pop'],
    grammarLabel:'Best Pop Album',
  },
  'Soul/Gospel': {
    icon:'🙏', desc:'Raw emotion. Church roots. Community.',
    instruments:['piano','vocals','organ'], skillStat:'happy', streamMult:0.9, beefChance:0.02,
    subgenres:['Soul','Gospel','Funk','Blues'],
    grammarLabel:'Best Gospel Album',
  },
};

// ── INSTRUMENTS ───────────────────────────────────────────────────
const INSTRUMENTS = {
  guitar:      { icon:'🎸', desc:'Essential for Rock, Indie, Country',      skillBonus:{rock:20,indie:20,country:15,alternative:15} },
  piano:       { icon:'🎹', desc:'Versatile. Helps across all genres',       skillBonus:{classical:30,rnb:20,pop:15,soul:20} },
  drums:       { icon:'🥁', desc:'Rock, Alternative, EDM production',        skillBonus:{rock:20,alternative:20,edm:10} },
  bass:        { icon:'🎵', desc:'Groove. Holds the band together',          skillBonus:{rock:15,indie:15,rnb:10} },
  violin:      { icon:'🎻', desc:'Classical, Country crossover',             skillBonus:{classical:25,country:10} },
  saxophone:   { icon:'🎷', desc:'Jazz, Soul, R&B',                         skillBonus:{classical:20,rnb:15,soul:20} },
  vocals:      { icon:'🎤', desc:'Technique and range. Universal',           skillBonus:{pop:20,rnb:20,kpop:25,soul:20} },
  keyboard:    { icon:'🎹', desc:'Production, EDM, Pop',                     skillBonus:{edm:20,pop:15} },
  synthesizer: { icon:'🎛️', desc:'EDM, Alternative, experimental',          skillBonus:{edm:25,alternative:15} },
  banjo:       { icon:'🪕', desc:'Country, Folk, Bluegrass',                 skillBonus:{country:25} },
};

// ── LABELS ────────────────────────────────────────────────────────
const MUSIC_LABELS_DATA = [
  { id:'self',    name:'Self-Released',    tier:0, advanceMin:0,      advanceMax:0,       royalty:0.85, albumsOwed:0, prestige:5  },
  { id:'indie',   name:'Indie Label',      tier:1, advanceMin:20000,  advanceMax:100000,  royalty:0.70, albumsOwed:2, prestige:20 },
  { id:'mid',     name:'Mid-Size Label',   tier:2, advanceMin:200000, advanceMax:800000,  royalty:0.55, albumsOwed:3, prestige:45 },
  { id:'major',   name:'Major Label',      tier:3, advanceMin:500000, advanceMax:5000000, royalty:0.20, albumsOwed:4, prestige:80 },
  { id:'leaving', name:'Left Label',       tier:0, advanceMin:0,      advanceMax:0,       royalty:0.85, albumsOwed:0, prestige:10 },
];

// ── REAL COLLABS ──────────────────────────────────────────────────
const MUSIC_COLLABS = [
  { name:'a local rapper',    fame:0,  streams:10000,    rev:40,    desc:'Local scene collab. Authentic. Growing.' },
  { name:'a producer',        fame:0,  streams:5000,     rev:20,    desc:'Beat was hard. Low-key cult following.' },
  { name:'Lil Uzi Vert',      fame:20, streams:500000,   rev:2000,  desc:'Melody-driven bars. Chart-ready result.' },
  { name:'Cardi B',           fame:25, streams:600000,   rev:2400,  desc:'She brought the energy. Mutually beneficial.' },
  { name:'Post Malone',       fame:30, streams:800000,   rev:3200,  desc:'Laid back collab. Both audiences loved it.' },
  { name:'Billie Eilish',     fame:35, streams:900000,   rev:3600,  desc:'Creative chemistry. Both fanbases collided.' },
  { name:'The Weeknd',        fame:40, streams:1500000,  rev:6000,  desc:'Dark pop vibes. Critically acclaimed.' },
  { name:'Doja Cat',          fame:40, streams:1200000,  rev:4800,  desc:'Social media ran with it. Viral instantly.' },
  { name:'Travis Scott',      fame:45, streams:2000000,  rev:8000,  desc:'He added a verse. Chart impact: immediate.' },
  { name:'Olivia Rodrigo',    fame:40, streams:1800000,  rev:7200,  desc:'Emotional collab. Critics went insane.' },
  { name:'Bad Bunny',         fame:45, streams:2500000,  rev:10000, desc:'Latin crossover. Global chart impact.' },
  { name:'SZA',               fame:45, streams:1600000,  rev:6400,  desc:'R&B royalty. A moment in time.' },
  { name:'Kendrick Lamar',    fame:55, streams:3000000,  rev:12000, desc:'Critically acclaimed. The discourse lasted months.' },
  { name:'Beyoncé',           fame:65, streams:5000000,  rev:20000, desc:'The BeyHive activated. Everything changed.' },
  { name:'Drake',             fame:60, streams:4000000,  rev:16000, desc:'A Drake feature. Career-defining moment.' },
  { name:'Jay-Z',             fame:70, streams:3500000,  rev:14000, desc:'Hip-hop royalty endorsed you. Legacy secured.' },
  { name:'Taylor Swift',      fame:75, streams:8000000,  rev:32000, desc:'A Swift collab. History was made.' },
  { name:'Eminem',            fame:65, streams:3000000,  rev:12000, desc:'He came with bars. The fanbase exploded.' },
  { name:'Rihanna',           fame:70, streams:4500000,  rev:18000, desc:'Iconic. Everything about this was iconic.' },
];

// ── BEEF TARGETS ──────────────────────────────────────────────────
const BEEF_TARGETS = [
  { name:'a local rapper',       fameDiff:0,  dissTracks:['They can\'t rap','They\'re fake','They\'re irrelevant'],      resPctFame:2 },
  { name:'an up-and-comer',      fameDiff:5,  dissTracks:['They bit your style','Subliminal shots fired'],               resPctFame:5 },
  { name:'a label rival',        fameDiff:10, dissTracks:['Label politics leaked to press','Public shots on Twitter'],    resPctFame:10 },
  { name:'a genre legend',       fameDiff:20, dissTracks:['They said your music is commercial trash','Called you out'],   resPctFame:20 },
  { name:'a pop star',           fameDiff:5,  dissTracks:['Twitter beef turned diss track','Interviewed and said stuff'], resPctFame:8 },
  { name:'your ex-label',        fameDiff:15, dissTracks:['Label told your story wrong','Contract dispute went public'],  resPctFame:15 },
];

// ── MUSIC CONTROVERSY EVENTS ──────────────────────────────────────
const MUSIC_CONTROVERSIES = [
  { msg:'Old tweets surfaced. Context: complicated. Reaction: immediate.',        opinDmg:-20, fameDmg:-5,  type:'bad' },
  { msg:'A show got cancelled mid-tour. Official reason: "health". Actual reason: who knows.', opinDmg:-12, fameDmg:-3, type:'warn' },
  { msg:'Accused of ghostwriting. Your response was either too confident or not confident enough.', opinDmg:-15, fameDmg:-2, type:'bad' },
  { msg:'Beef escalated publicly. Diss track dropped. Internet chose sides. You were not the majority pick.', opinDmg:-18, fameDmg:3, type:'bad' },
  { msg:'Cancelled for old lyrics. The discourse ran two weeks. Streaming went up somehow.', opinDmg:-25, fameDmg:0, type:'bad' },
  { msg:'Caught lip-syncing at a major award show. The reaction was disproportionate to the crime.', opinDmg:-14, fameDmg:-2, type:'bad' },
  { msg:'Signed a deal that fans called a sell-out. Merch: unavoidable. Integrity: debated.', opinDmg:-10, fameDmg:0, type:'warn' },
  { msg:'Label beef went public. Finances discussed openly. Messy.', opinDmg:-8, fameDmg:2, type:'warn' },
];


// ── RANDOM INDUSTRY EVENTS ────────────────────────────────────────
function musicIndustryEvent(){
  const mus = G.sm.music;
  const events = [
    ()=>{ addEv('A late-night TV performance request came in. Visibility: high.','love'); mus.publicOpinion=Math.min(100,mus.publicOpinion+5); G.sm.totalFame=clamp(G.sm.totalFame+2); },
    ()=>{ const d=rnd(5000,80000); G.money+=d; G.sm.totalRevenue+=d; addEv(`Sync licensing deal. One of your tracks in a movie/show/ad. +${fmt$(d)}.`,'good'); },
    ()=>{ mus.criticalScore=Math.min(100,mus.criticalScore+rnd(3,8)); addEv('Pitchfork reviewed your project. The score was better than expected.','good'); },
    ()=>{ mus.criticalScore=Math.max(0,mus.criticalScore-rnd(5,12)); addEv('A critic published a harsh take. The argument is not entirely wrong.','bad'); },
    ()=>{ if(G.friends.length>0){const f=pick(G.friends.filter(x=>x.alive)||[{firstName:'Someone'}]); addEv(`${f.firstName} turned up on a track. Organic. Listeners noticed.`); mus.streams+=rnd(10000,50000); }},
    ()=>{ mus.publicOpinion=Math.min(100,mus.publicOpinion+rnd(5,15)); addEv('Positive press cycle. Interviews, profiles, a well-placed feature. Good timing.','good'); },
    ()=>{ const rev=rnd(5000,40000); G.money+=rev; G.sm.totalRevenue+=rev; addEv(`Festival booking. ${fmt$(rev)} plus the exposure.`,'love'); mus.tourActive=true; },
    ()=>{ if(!mus.retired){ mus.publicOpinion=Math.max(30,mus.publicOpinion-rnd(3,10)); addEv('Oversaturation — you released too much. Audience attention dropped slightly.','warn'); }},
    ()=>{ if(mus.instruments.length>0){ const inst=pick(mus.instruments); const sk=mus.instrumentSkill[inst]||0; mus.instrumentSkill[inst]=Math.min(100,sk+rnd(5,15)); addEv(`Extended practice on ${inst}. Skill up. It shows in the recordings.`); }},
    ()=>{ addEv('Fan-shot live footage went viral. Algorithm loved it. Organic growth.','love'); G.sm.totalFame=clamp(G.sm.totalFame+rnd(2,6)); mus.streams+=rnd(50000,300000); },
  ];
  pick(events)();
}

// ── GENRE HELPERS ─────────────────────────────────────────────────
const MUSIC_GENRES = Object.keys(MUSIC_GENRES_DATA);
function genreIcon(g){ return (MUSIC_GENRES_DATA[g]||{}).icon || '🎵'; }
function genreKey(g){ return g.toLowerCase().replace(/[\s\/\-]/g,'').substring(0,8); }

// Instrument skill bonus for a genre
function instBonus(mus){
  if(!mus.instruments.length) return 1;
  const gd = MUSIC_GENRES_DATA[mus.genre];
  if(!gd) return 1;
  let bonus = 1;
  mus.instruments.forEach(inst=>{
    const skill = (mus.instrumentSkill[inst]||0)/100;
    const ibData = INSTRUMENTS[inst];
    if(ibData){
      const gk = genreKey(mus.genre);
      const gb  = ibData.skillBonus[gk] || 5;
      bonus += (gb/100) * skill;
    }
  });
  return bonus;
}

// ── RENDER MUSIC SECTION ──────────────────────────────────────────
function renderMusicSection(){
  const mus = G.sm.music;
  if(G.age < 13) return '';

  if(!mus.active){
    return `<div class="card">
      <div class="card-title">🎵 Music Career</div>
      <p style="color:var(--muted2);font-size:.855rem;margin-bottom:12px">Start on SoundCloud, blow up, sign a deal — or stay independent. Choose your genre and your path.</p>
      <div style="margin-bottom:10px">
        <input id="stage-name-inp" type="text" placeholder="Your stage name (or real name)..." class="name-input" style="font-size:.9rem;padding:8px 12px">
      </div>
      <div class="choice-grid">
        ${MUSIC_GENRES.map(g=>`
          <div class="choice" onclick="startMusic('${g}')">
            <div class="choice-icon">${genreIcon(g)}</div>
            <div class="choice-name">${g}</div>
            <div class="choice-desc">${MUSIC_GENRES_DATA[g].desc}</div>
          </div>`).join('')}
      </div>
    </div>`;
  }

  if(mus.retired){
    return `<div class="card">
      <div class="card-title">🎵 ${mus.stageName} — Retired</div>
      <p style="color:var(--muted2);font-size:.855rem;margin-bottom:10px">
        ${mus.grammyWins>0?`${mus.grammyWins}× Grammy winner. `:''} ${fmtF(mus.streams)} total streams. Legacy secured.
      </p>
      <div class="choice-grid">
        <div class="choice" onclick="musicDo('comeback')">
          <div class="choice-icon">🔥</div><div class="choice-name">Stage a Comeback</div><div class="choice-desc">The internet never forgets you</div>
        </div>
      </div>
    </div>`;
  }

  const gd = MUSIC_GENRES_DATA[mus.genre]||{};
  const opinionColor = mus.publicOpinion>=70?'var(--success)':mus.publicOpinion>=45?'var(--gold)':'var(--danger)';
  const critColor    = mus.criticalScore>=70?'var(--accent)':mus.criticalScore>=45?'var(--gold)':'var(--muted2)';
  const labelName    = mus.label || 'Independent';
  const availCollabs = MUSIC_COLLABS.filter(c=>G.sm.totalFame>=c.fame && !mus.collabs?.includes(c.name));
  const availBeefTargets = BEEF_TARGETS.filter(b=>G.sm.totalFame>=b.resPctFame && !mus.beefs.find(x=>x.artist===b.name&&!x.resolved));
  const activeBeefs = mus.beefs.filter(b=>!b.resolved);

  let html = `<div class="card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px">
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.4rem">${mus.stageName}</div>
        <div style="font-size:.75rem;color:var(--muted2)">${gd.icon||'🎵'} ${mus.genre}${mus.subgenre?' · '+mus.subgenre:''} · ${labelName}</div>
        ${mus.inBand?`<div style="font-size:.72rem;color:var(--accent2);margin-top:2px">🎸 ${mus.bandName}</div>`:''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${mus.grammyWins>0?`<div style="font-size:.72rem;color:var(--gold)">🏆 ${mus.grammyWins}× Grammy</div>`:''}
        ${mus.grammyNoms>0&&!mus.grammyWins?`<div style="font-size:.72rem;color:var(--muted2)">${mus.grammyNoms}× Nominated</div>`:''}
        ${mus.platinums>0?`<span class="badge badge-gold">💿 Platinum×${mus.platinums}</span>`:''}
        ${mus.golds>0&&!mus.platinums?`<span class="badge badge-accent">🥇 Gold</span>`:''}
      </div>
    </div>

    <!-- Stats row -->
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px">
      <div class="sm-stat"><div class="sm-stat-val">${mus.tracks}</div><div class="sm-stat-lbl">Tracks</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${mus.albums}</div><div class="sm-stat-lbl">Albums</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${fmtF(mus.streams)}</div><div class="sm-stat-lbl">Streams</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(mus.revenue+mus.producerRevenue)}</div><div class="sm-stat-lbl">Earned</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:${opinionColor}">${mus.publicOpinion}</div><div class="sm-stat-lbl">Public Opinion</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:${critColor}">${mus.criticalScore}</div><div class="sm-stat-lbl">Critical Score</div></div>
      ${mus.chartsHit>0?`<div class="sm-stat"><div class="sm-stat-val" style="color:var(--accent2)">${mus.chartsHit}</div><div class="sm-stat-lbl">Charts Hit</div></div>`:''}
    </div>

    <!-- Instrument skills -->
    ${mus.instruments.length?`<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap">
      ${mus.instruments.map(i=>`<div style="background:var(--surface3);border-radius:var(--r-sm);padding:4px 10px;font-size:.72rem">
        ${INSTRUMENTS[i].icon} ${i} <span style="color:var(--accent)">${mus.instrumentSkill[i]||0}</span>
      </div>`).join('')}
    </div>`:''}

    ${activeBeefs.length?`<div style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);border-radius:var(--r-sm);padding:8px 12px;margin-bottom:10px;font-size:.78rem">
      🔥 Active beef with: ${activeBeefs.map(b=>`${b.artist} (intensity ${b.intensity}/10)`).join(', ')}
    </div>`:''}

    ${mus.tourActive?`<div class="notif good" style="margin-bottom:10px;font-size:.78rem">🚌 On tour — ${mus.tourDates} shows · ${fmt$(mus.tourRevenue)} earned so far</div>`:''}
  </div>

  <!-- Core actions -->
  <div class="card"><div class="card-title">Create & Release</div>
    <div class="choice-grid">
      <div class="choice" onclick="musicDo('record')"><div class="choice-icon">🎙️</div><div class="choice-name">Record a Track</div><div class="choice-desc">Singles drive streaming</div></div>
      <div class="choice" onclick="musicDo('ep')"><div class="choice-icon">💿</div><div class="choice-name">Drop an EP</div><div class="choice-desc">3–5 tracks · bigger push</div></div>
      <div class="choice" onclick="musicDo('mixtape')"><div class="choice-icon">📼</div><div class="choice-name">Drop a Mixtape</div><div class="choice-desc">Free · builds fanbase</div></div>
      <div class="choice" onclick="musicDo('album')"><div class="choice-icon">🎵</div><div class="choice-name">Release an Album</div><div class="choice-desc">10+ tracks · career move</div></div>
      <div class="choice" onclick="musicDo('deluxe')"><div class="choice-icon">💎</div><div class="choice-name">Deluxe Edition</div><div class="choice-desc">Extend an existing album</div></div>
      <div class="choice" onclick="musicDo('produce')"><div class="choice-icon">🎛️</div><div class="choice-name">${mus.isProducer?'Produce for Artists':'Become a Producer'}</div><div class="choice-desc">${mus.isProducer?`${mus.producerCredits} credits · passive royalties`:'Beat-making as a career'}</div></div>
    </div>
  </div>

  <!-- Career moves -->
  <div class="card"><div class="card-title">Career</div>
    <div class="choice-grid">
      <div class="choice" onclick="musicDo('perform')"><div class="choice-icon">🎤</div><div class="choice-name">Live Show</div><div class="choice-desc">+Fame +Revenue</div></div>
      <div class="choice" onclick="musicDo('tour')"><div class="choice-icon">🚌</div><div class="choice-name">${mus.tourActive?'End Tour':'Go on Tour'}</div><div class="choice-desc">${mus.tourActive?'Wrap the current run':'Big money · needs fame'}</div></div>
      <div class="choice" onclick="musicDo('promote')"><div class="choice-icon">📢</div><div class="choice-name">Promote on Socials</div><div class="choice-desc">Links your platforms</div></div>
      <div class="choice" onclick="musicDo('interview')"><div class="choice-icon">🎙️</div><div class="choice-name">Press Interview</div><div class="choice-desc">+Public opinion · risky</div></div>
      ${!mus.label||mus.label==='Left Label'?`<div class="choice" onclick="musicDo('label')"><div class="choice-icon">🏷️</div><div class="choice-name">Seek Label Deal</div><div class="choice-desc">Advance vs creative control</div></div>`:''}
      ${mus.label&&mus.label!=='Left Label'&&mus.label!=='Self-Released'?`<div class="choice" onclick="musicDo('leave_label')"><div class="choice-icon">🚪</div><div class="choice-name">Leave Label</div><div class="choice-desc">Reclaim masters · lose advance</div></div>`:''}
      ${!mus.inBand?`<div class="choice" onclick="musicDo('form_band')"><div class="choice-icon">🎸</div><div class="choice-name">Form a Band</div><div class="choice-desc">Shared success, shared drama</div></div>`:`<div class="choice" onclick="musicDo('band_drama')"><div class="choice-icon">💥</div><div class="choice-name">Band Drama</div><div class="choice-desc">Rifts. Arguments. Creative tension.</div></div>`}
      <div class="choice" onclick="musicDo('retire')"><div class="choice-icon">😴</div><div class="choice-name">Announce Retirement</div><div class="choice-desc">Go out on your terms</div></div>
    </div>
  </div>

  <!-- Instruments -->
  <div class="card"><div class="card-title">Instruments & Skills</div>
    <div class="choice-grid">
      ${Object.entries(INSTRUMENTS).map(([id,data])=>{
        const hasIt = mus.instruments.includes(id);
        const skill = mus.instrumentSkill[id]||0;
        return `<div class="choice" onclick="musicInstrument('${id}')">
          <div class="choice-icon">${data.icon}</div>
          <div class="choice-name">${id.charAt(0).toUpperCase()+id.slice(1)}</div>
          <div class="choice-desc">${hasIt?`Skill: ${skill}/100`:`${data.desc}`}</div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Beef section -->
  <div class="card" style="border-color:rgba(248,113,113,.2)">
    <div class="card-title" style="color:var(--danger)">Beef & Drama 🔥</div>
    <div class="choice-grid">
      ${availBeefTargets.slice(0,4).map(bt=>`
        <div class="choice" onclick="startBeef('${bt.name.replace(/'/g,"\\'")}')">
          <div class="choice-icon">💀</div>
          <div class="choice-name">Beef w/ ${bt.name}</div>
          <div class="choice-desc">${bt.dissTracks[0]}</div>
        </div>`).join('')}
      ${activeBeefs.map(b=>`
        <div class="choice" onclick="beefAction('${b.artist.replace(/'/g,"\\'")}','diss')">
          <div class="choice-icon">🎤</div>
          <div class="choice-name">Diss ${b.artist}</div>
          <div class="choice-desc">Drop a diss track · escalates</div>
        </div>
        <div class="choice" onclick="beefAction('${b.artist.replace(/'/g,"\\'")}','squash')">
          <div class="choice-icon">🤝</div>
          <div class="choice-name">Squash w/ ${b.artist}</div>
          <div class="choice-desc">End it. Move on.</div>
        </div>`).join('')}
    </div>
  </div>

  <!-- Collabs -->
  ${availCollabs.length?`<div class="card"><div class="card-title">Features & Collabs</div>
    <div style="display:flex;flex-direction:column;gap:5px">
      ${availCollabs.slice(0,6).map(c=>`
        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface3);border-radius:var(--r-sm);padding:8px 12px">
          <div>
            <div style="font-family:var(--fh);font-weight:700;font-size:.85rem">${c.name}</div>
            <div style="font-size:.72rem;color:var(--muted2)">${c.desc}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="musicCollab('${c.name.replace(/'/g,"\\'")}')">Collab</button>
        </div>`).join('')}
    </div>
  </div>`:''}`;

  return html;
}

// ── START MUSIC ───────────────────────────────────────────────────
function startMusic(genre){
  const inp  = document.getElementById('stage-name-inp');
  const name = (inp&&inp.value.trim()) || G.firstname;
  const gd   = MUSIC_GENRES_DATA[genre];
  // Pick random subgenre
  const sub  = gd&&gd.subgenres ? pick(gd.subgenres) : '';
  G.sm.music = {
    active:true, stageName:name, genre, subgenre:sub,
    tracks:0, albums:0, eps:0, mixtapes:0,
    streams:0, revenue:0, label:'Self-Released', labelTier:0, labelContract:null,
    publicOpinion:50, criticalScore:50,
    grammyNoms:0, grammyWins:0,
    instruments:[], instrumentSkill:{},
    isProducer:false, producerCredits:0, producerRevenue:0,
    bandMembers:[], inBand:false, bandName:'',
    beefs:[], controversies:[],
    tourActive:false, tourRevenue:0, tourDates:0,
    fansLost:0, collabs:[],
    chartsHit:0, platinums:0, golds:0, comebacks:0, retired:false,
  };
  addEv(`You uploaded your first track on SoundCloud as "${name}". Genre: ${genre} — ${sub}. It has 23 plays. You know all 23.`,'good');
  flash(`🎵 ${name} is live!`,'good');
  renderMedia();
}

// ── MAIN MUSIC ACTION ─────────────────────────────────────────────
function musicDo(type){
  const mus = G.sm.music;
  if(!mus.active) return;
  const gd = MUSIC_GENRES_DATA[mus.genre]||{streamMult:1};
  const ib = instBonus(mus);
  const base = Math.floor((rnd(1,3) + mus.tracks * 0.5 + G.sm.totalFame * 2) * gd.streamMult * ib * (mus.publicOpinion/60));

  if(type==='record'){
    mus.tracks++;
    const streams = Math.floor(rnd(200,3000) * base / 3 + rnd(100,500));
    mus.streams += streams;
    mus.criticalScore = Math.min(100, mus.criticalScore + rnd(0,3));
    G.sm.totalFame = clamp(G.sm.totalFame + (streams>5000?2:1));
    addEv(`Track recorded as "${mus.stageName}". ${fmtF(streams)} streams first week. ${ib>1.2?'The instrumental skill shows in the mix.':''}`,'good');
    flash(`🎙️ Track dropped! +${fmtF(streams)} streams`,'good');
    if(gd.beefChance && Math.random()<gd.beefChance*0.3) musicIndustryEvent();
  }
  else if(type==='ep'){
    if(mus.tracks<3){ flash('Need 3+ tracks for an EP','warn'); return; }
    mus.eps++; mus.tracks+=2; // ep adds new tracks
    const streams = Math.floor(rnd(5000,30000) * base / 3 * 1.2);
    mus.streams += streams; mus.criticalScore = Math.min(100, mus.criticalScore+rnd(2,6));
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,5));
    G.happy = clamp(G.happy + rnd(5,10));
    addEv(`EP dropped. ${fmtF(streams)} streams. The blogs are talking.`,'love');
    flash(`💿 EP out! +${fmtF(streams)} streams`,'good');
  }
  else if(type==='mixtape'){
    if(mus.tracks<5){ flash('Need 5+ tracks for a mixtape','warn'); return; }
    mus.mixtapes++; mus.tracks+=3;
    const streams = Math.floor(rnd(8000,60000) * base / 3);
    mus.streams += streams; G.sm.totalFame = clamp(G.sm.totalFame + rnd(3,8));
    G.happy = clamp(G.happy + rnd(8,14));
    addEv(`Mixtape dropped free on DatPiff/SoundCloud. ${fmtF(streams)} streams. Organic fanbase building.`,'love');
    flash(`📼 Mixtape out! +${fmtF(streams)} streams`,'good');
  }
  else if(type==='album'){
    if(mus.tracks<10){ flash('Need 10+ tracks for an album','warn'); return; }
    mus.albums++; mus.tracks+=4;
    const streams = Math.floor(rnd(50000,500000) * base / 3 * (mus.labelTier+1));
    const rev = Math.floor(streams * (mus.labelContract?mus.labelContract.royaltyRate:0.85) * 0.004);
    mus.streams += streams; mus.revenue += rev;
    G.sm.totalRevenue += rev; G.money += rev;
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(8,20));
    G.happy = clamp(G.happy + rnd(12,20));
    mus.criticalScore = Math.min(100, mus.criticalScore + rnd(3,12));
    // Label album obligation
    if(mus.labelContract){
      mus.labelContract.albumsDone++;
      if(mus.labelContract.albumsDone>=mus.labelContract.albumsOwed){
        addEv(`Contract fulfilled with ${mus.label}. You\'re free to renegotiate or go independent.`,'love');
        flash('Label contract complete!','good');
      }
    }
    addEv(`Album released. ${fmtF(streams)} streams first week. ${fmt$(rev)} earned. ${G.sm.totalFame>=60?'Career-defining.':G.sm.totalFame>=40?'Momentum is real.':'People are listening.'}`,'love');
    flash(`🎵 ALBUM OUT! ${fmtF(streams)} streams`,'good');
    // Chart chance on album
    if(Math.random()<0.4+mus.publicOpinion/200){ mus.chartsHit++; addEv(`Charted on Billboard. #${Math.max(1,Math.floor(100-mus.publicOpinion-streams/1000000))} this week.`,'love'); }
  }
  else if(type==='deluxe'){
    if(mus.albums<1){ flash('Need an album first','warn'); return; }
    mus.tracks+=2;
    const streams = Math.floor(rnd(20000,100000) * (mus.publicOpinion/60));
    mus.streams+=streams;
    addEv(`Deluxe edition dropped with new tracks. ${fmtF(streams)} additional streams from the re-run.`,'good');
    flash(`💎 Deluxe edition out!`,'good');
  }
  else if(type==='produce'){
    if(!mus.isProducer){
      mus.isProducer=true;
      addEv('You stepped into the producer role. Beat-making, A&R, studio time. Different energy entirely.','good');
      flash('🎛️ Now a producer!','good');
    } else {
      mus.producerCredits += rnd(1,4);
      const rev = rnd(5000,50000) * mus.producerCredits;
      mus.producerRevenue += rev; G.sm.totalRevenue += rev; G.money += rev;
      mus.criticalScore = Math.min(100, mus.criticalScore + rnd(1,4));
      addEv(`Produced ${rnd(1,4)} tracks for other artists. +${fmt$(rev)} in royalties. Producer credits: ${mus.producerCredits}.`,'good');
      flash(`🎛️ Produced! +${fmt$(rev)}`,'good');
    }
  }
  else if(type==='perform'){
    if(G.sm.totalFame<8){ flash('Build more of a following first','warn'); return; }
    const rev = Math.floor(rnd(1000,8000) * (1 + G.sm.totalFame/25));
    mus.revenue += rev; G.sm.totalRevenue += rev; G.money += rev;
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
    G.happy = clamp(G.happy + rnd(8,15));
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(2,6));
    addEv(pick([
      `Live show. ${fmt$(rev)} earned. The crowd knew every word. You felt it.`,
      `Performance at a venue. ${fmt$(rev)}. You owned that stage.`,
      `Show done. ${fmt$(rev)}. The set was tight. Front row was wild.`,
    ]),'love');
    flash(`🎤 Performed! +${fmt$(rev)}`,'good');
  }
  else if(type==='tour'){
    if(!mus.tourActive){
      if(G.sm.totalFame<20){ flash('Need 20+ fame to book a tour','warn'); return; }
      mus.tourActive=true; mus.tourRevenue=0; mus.tourDates=0;
      addEv(`Tour announced. Dates selling. The road life starts now.`,'love');
      flash('🚌 Tour started!','good');
    } else {
      mus.tourActive=false;
      addEv(`Tour wrapped. ${mus.tourDates} shows total. ${fmt$(mus.tourRevenue)} earned. Your back hurts.`,'love');
      flash(`Tour done! Earned ${fmt$(mus.tourRevenue)}`,'good');
    }
  }
  else if(type==='promote'){
    const plats = Object.keys(G.sm.platforms).length;
    const streams = rnd(2000,15000) * Math.max(1,plats);
    mus.streams += streams;
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(1,4));
    // Social media followers also grow from music fame
    Object.keys(G.sm.platforms).forEach(pid=>{
      G.sm.platforms[pid].followers += rnd(500,5000);
    });
    addEv(`Promoted the music on ${plats>0?'your platforms':'social media'}. ${fmtF(streams)} new streams. Social crossover working.`,'good');
    flash(`📢 Promoted! +${fmtF(streams)} streams`,'good');
  }
  else if(type==='interview'){
    const roll = Math.random();
    if(roll>0.3){
      mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(5,15));
      mus.criticalScore = Math.min(100, mus.criticalScore + rnd(2,6));
      G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,6));
      addEv(pick([
        'Interview went perfectly. Candid, sharp, funny. Clips everywhere.',
        'Press junket done. Every outlet ran the quote you wanted them to run.',
        'Long-form interview. You spoke your truth. Audience responded.',
      ]),'good');
      flash('+Public opinion · interview nailed','good');
    } else {
      mus.publicOpinion = Math.max(0, mus.publicOpinion - rnd(8,20));
      mus.controversies.push({year:G.age, desc:'Said something in an interview that landed badly.'});
      G.sm.controversies++;
      addEv('Interview clip went viral for the wrong reason. Clarification posted. Damage: partial.','bad');
      flash('⚠️ Interview controversy','bad');
    }
  }
  else if(type==='label'){
    if(G.sm.totalFame<15){ flash('Need 15+ fame for label interest','bad'); return; }
    const tier = G.sm.totalFame>=65?3 : G.sm.totalFame>=40?2 : G.sm.totalFame>=25?1 : 0;
    if(tier===0){ flash('Fame too low for even an indie deal yet','bad'); return; }
    const ld = MUSIC_LABELS_DATA.find(l=>l.tier===tier);
    const advance = rnd(ld.advanceMin, ld.advanceMax);
    mus.label = ld.name; mus.labelTier = tier;
    mus.labelContract = { advance, royaltyRate:ld.royalty, albumsOwed:ld.albumsOwed, albumsDone:0 };
    G.money += advance; G.sm.totalRevenue += advance;
    mus.publicOpinion = Math.min(100, mus.publicOpinion + ld.prestige*0.3);
    addEv(`Signed to ${ld.name}! ${fmt$(advance)} advance. Royalty rate: ${Math.floor(ld.royalty*100)}%. You owe them ${ld.albumsOwed} album${ld.albumsOwed!==1?'s':''}.`,'love');
    flash(`🏷️ Signed to ${ld.name}! +${fmt$(advance)}`,'good');
  }
  else if(type==='leave_label'){
    const old = mus.label;
    mus.label='Left Label'; mus.labelTier=0;
    mus.labelContract=null;
    mus.publicOpinion = Math.max(0, mus.publicOpinion - rnd(5,15));
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,5)); // drama = press
    addEv(`Left ${old}. Statement posted: "creative differences." Lawyers: involved. Masters: still theirs.`,'warn');
    flash(`Left ${old}.`,'warn');
  }
  else if(type==='form_band'){
    const bandNames = ['The','Dead','Black','White','Electric','Velvet','Ghost','Crystal','Dark','Neon'];
    const bandSuffix= ['Sun','Wave','Road','Fire','Storm','Dream','Light','Hour','Star','Edge'];
    const bName = pick(bandNames)+' '+pick(bandSuffix);
    mus.inBand=true; mus.bandName=bName;
    const members = [makePerson('Friend'),makePerson('Friend'),makePerson('Friend')];
    mus.bandMembers = members.map(m=>m.firstName);
    members.forEach(m=>{ m.role='Friend'; G.friends.push(m); });
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(5,12));
    addEv(`Formed ${bName} with ${mus.bandMembers.slice(0,2).join(' and ')}. Band dynamic immediately complicated. Also kind of magic.`,'love');
    flash(`🎸 ${bName} formed!`,'good');
  }
  else if(type==='band_drama'){
    const outcomes=[
      {msg:`Creative control dispute in ${mus.bandName}. You all said things.`, opin:-5, happy:-8, resolve:false},
      {msg:`${pick(mus.bandMembers)||'A bandmate'} wants to go solo. The writing is on the wall.`, opin:-3, happy:-10, resolve:false},
      {msg:`${mus.bandName} drama resolved over a long dinner. Stronger now.`, opin:3, happy:5, resolve:true},
      {msg:`${mus.bandName} broke up. Official statement: "mutual decision." Reality: messier.`, opin:-8, happy:-15, resolve:true, breakup:true},
    ];
    const o = pick(outcomes);
    mus.publicOpinion = Math.min(100,Math.max(0,mus.publicOpinion+o.opin));
    G.happy = clamp(G.happy+o.happy);
    if(o.breakup){ mus.inBand=false; mus.bandName=''; }
    addEv(o.msg, o.happy<0?'bad':'warn');
    flash(o.breakup?'Band broke up.':'Band drama handled.', o.happy<0?'bad':'warn');
  }
  else if(type==='comeback'){
    mus.retired=false; mus.comebacks++;
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(10,25));
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(5,15));
    addEv(`Comeback announced. "${mus.stageName} is back." The internet cares more than you expected.`,'love');
    flash(`🔥 ${mus.stageName} is BACK`,'good');
  }
  else if(type==='retire'){
    mus.retired=true;
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(5,15));
    addEv(`You announced your retirement. The tribute posts came in. You read them all.`,'love');
    flash('Retired. The legacy is set.','good');
  }
  updateHUD(); renderMedia();
}

// ── INSTRUMENT ACTION ─────────────────────────────────────────────
function musicInstrument(instId){
  const mus  = G.sm.music;
  const data = INSTRUMENTS[instId];
  if(!data) return;

  if(!mus.instruments.includes(instId)){
    mus.instruments.push(instId);
    mus.instrumentSkill[instId] = rnd(5,20);
    addEv(`You started learning ${instId}. ${data.icon} ${data.desc}. Current skill: ${mus.instrumentSkill[instId]}.`,'good');
    flash(`${data.icon} Learning ${instId}!`,'good');
  } else {
    const gain = rnd(5,18);
    mus.instrumentSkill[instId] = Math.min(100, (mus.instrumentSkill[instId]||0) + gain);
    G.smarts = clamp(G.smarts + rnd(1,3));
    G.happy  = clamp(G.happy  + rnd(2,5));
    addEv(`Practiced ${instId}. Skill up to ${mus.instrumentSkill[instId]}. ${mus.instrumentSkill[instId]>=80?'You\'re genuinely good now.':''}`,'good');
    flash(`${data.icon} ${instId} skill: ${mus.instrumentSkill[instId]}`,'good');
  }
  updateHUD(); renderMedia();
}

// ── BEEF SYSTEM ───────────────────────────────────────────────────
function startBeef(targetName){
  const mus    = G.sm.music;
  const target = BEEF_TARGETS.find(b=>b.name===targetName);
  if(!target) return;

  mus.beefs.push({ artist:targetName, intensity:1, resolved:false });
  mus.publicOpinion = Math.max(0, mus.publicOpinion - rnd(3,8));
  mus.streams += rnd(10000,50000); // beef = streams
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
  addEv(`You started beef with ${targetName}. ${pick(target.dissTracks)}. The timeline noticed.`,'warn');
  flash(`🔥 Beef started with ${targetName}`,'warn');
  updateHUD(); renderMedia();
}

function beefAction(artistName, action){
  const mus  = G.sm.music;
  const beef = mus.beefs.find(b=>b.artist===artistName && !b.resolved);
  if(!beef) return;

  if(action==='diss'){
    beef.intensity = Math.min(10, beef.intensity + rnd(1,3));
    const streams = rnd(50000, 500000) * (beef.intensity/5);
    mus.streams += streams; mus.tracks++;
    mus.publicOpinion = Math.max(10, mus.publicOpinion - rnd(3,10));
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(2,8));
    addEv(`Diss track dropped targeting ${artistName}. ${fmtF(streams)} streams. Beef intensity: ${beef.intensity}/10. The internet is watching.`,'warn');
    flash(`🎤 Diss track! +${fmtF(streams)} streams`,'good');
    // Chance they diss back
    if(Math.random()<0.5){
      mus.streams += rnd(20000,100000);
      addEv(`${artistName} responded. Diss track out. The cycle continues. Streaming numbers up for both sides.`,'bad');
    }
  } else if(action==='squash'){
    beef.resolved=true;
    mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(5,12));
    G.happy = clamp(G.happy + rnd(5,10));
    addEv(`Beef with ${artistName} squashed. Photo together posted. Internet: "this is what we needed."`, 'good');
    flash(`🤝 Beef squashed w/ ${artistName}`,'good');
  }
  updateHUD(); renderMedia();
}

// ── MUSIC COLLAB (enhanced) ───────────────────────────────────────
function musicCollab(artistName){
  const mus    = G.sm.music;
  const collab = MUSIC_COLLABS.find(c=>c.name===artistName);
  if(!collab){ flash('Artist not found','bad'); return; }
  if(G.sm.totalFame<collab.fame){ flash(`Need ${collab.fame} fame to work with ${collab.name}`,'bad'); return; }

  if(!mus.collabs) mus.collabs=[];
  mus.collabs.push(collab.name);
  mus.tracks++;
  const ib = instBonus(mus);
  const streams = Math.floor(collab.streams * ib);
  mus.streams += streams;
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(5,20));
  const rev = Math.floor(streams * 0.004 * (mus.labelContract?mus.labelContract.royaltyRate:0.85));
  mus.revenue += rev; G.sm.totalRevenue += rev; G.money += rev;
  G.happy = clamp(G.happy + rnd(10,18));
  mus.publicOpinion = Math.min(100, mus.publicOpinion + rnd(3,10));
  mus.criticalScore = Math.min(100, mus.criticalScore + rnd(2,8));

  addEv(`Collab with ${collab.name} released. ${collab.desc} +${fmtF(streams)} streams. ${fmt$(rev)} earned.`,'love');
  flash(`🎵 Collab with ${collab.name}!`,'good');
  // Cross-platform boost
  Object.keys(G.sm.platforms).forEach(pid=>{
    G.sm.platforms[pid].followers += Math.floor(streams/100);
  });
  updateHUD(); renderMedia();
}



// ══════════════════════════════════════════════════════════════════
//  TALK SHOW SYSTEM
// ══════════════════════════════════════════════════════════════════

const TALK_SHOWS = [
  { name:'The Tonight Show',   host:'Jimmy Fallon',  fame:40,  fameGain:8,  happyGain:15, moneyGain:50000  },
  { name:'Late Night',         host:'Seth Meyers',   fame:30,  fameGain:5,  happyGain:10, moneyGain:25000  },
  { name:'The Late Show',      host:'Stephen Colbert',fame:45, fameGain:10, happyGain:14, moneyGain:60000  },
  { name:'Good Morning America',host:'Robin Roberts', fame:35, fameGain:6,  happyGain:10, moneyGain:30000  },
  { name:'The View',           host:'Whoopi Goldberg',fame:30, fameGain:5,  happyGain:8,  moneyGain:20000  },
  { name:'Jimmy Kimmel Live',  host:'Jimmy Kimmel',  fame:35,  fameGain:7,  happyGain:12, moneyGain:40000  },
  { name:'Ellen (rerun era)',   host:'Ellen',         fame:25,  fameGain:4,  happyGain:12, moneyGain:20000  },
  { name:'Hot Ones',           host:'Sean Evans',    fame:20,  fameGain:6,  happyGain:14, moneyGain:5000   },
  { name:'60 Minutes',         host:'Anderson Cooper',fame:60, fameGain:15, happyGain:8,  moneyGain:0      },
  { name:'The Joe Rogan Experience',host:'Joe Rogan', fame:30, fameGain:12, happyGain:10, moneyGain:0      },
];

function renderTalkShowSection(){
  const totalF = Object.keys(G.sm.platforms).reduce((s,k)=>s+G.sm.platforms[k].followers,0);
  const available = TALK_SHOWS.filter(s=>G.sm.totalFame>=s.fame);

  return `<div class="card">
    <div class="card-title">📺 Talk Shows & Interviews</div>
    <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">
      Appearances: <strong style="color:var(--text)">${G.sm.talkShowAppearances}</strong> · Fame: <strong style="color:var(--accent2)">${G.sm.totalFame}/100</strong>
    </p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${available.map(show=>`
        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface3);border-radius:var(--r-sm);padding:9px 13px">
          <div>
            <div style="font-family:var(--fh);font-weight:700;font-size:.88rem">${show.name}</div>
            <div style="font-size:.72rem;color:var(--muted2)">Hosted by ${show.host} · ${show.moneyGain>0?fmt$(show.moneyGain)+' appearance fee':'No fee · prestige play'}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="doTalkShow('${show.name.replace(/'/g,"\\'")}')">Appear</button>
        </div>`).join('')}
    </div>
  </div>`;
}

function doTalkShow(showName){
  const show = TALK_SHOWS.find(s=>s.name===showName);
  if(!show){ flash('Show not found','bad'); return; }
  if(G.sm.totalFame<show.fame){ flash(`Need ${show.fame} fame for ${show.name}`,'bad'); return; }

  G.sm.talkShowAppearances++;
  G.sm.totalFame  = clamp(G.sm.totalFame + show.fameGain);
  G.happy         = clamp(G.happy + show.happyGain);
  if(show.moneyGain>0){ G.money += show.moneyGain; G.sm.totalRevenue += show.moneyGain; }

  // Follower boost across all active platforms
  Object.keys(G.sm.platforms).forEach(pid=>{
    const boost = Math.floor(rnd(1000,10000) * (show.fameGain/5));
    G.sm.platforms[pid].followers += boost;
  });

  const outcomes = [
    `You appeared on ${show.name} with ${show.host}. Charming. Funny. The clips are everywhere.`,
    `The ${show.name} interview with ${show.host} went better than expected. You left nothing on the table.`,
    `${show.host} asked the question everyone wanted to ask. Your answer was perfect. Trending by morning.`,
    `${show.name} booked you. You showed up. You delivered. The internet has thoughts.`,
  ];

  addEv(pick(outcomes), 'love');
  if(show.moneyGain>0) addEv(`Appearance fee: ${fmt$(show.moneyGain)} deposited.`,'good');
  flash(`📺 ${show.name} appearance done!`,'good');
  updateHUD(); renderMedia();
}


// ══════════════════════════════════════════════════════════════════
