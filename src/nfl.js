//  nfl.js — NFL Career System
//  Entry via draft → full career → retirement → legacy
// ══════════════════════════════════════════════════════════════════

// ── NFL TEAMS ─────────────────────────────────────────────────────
const NFL_TEAMS = {
  AFC: {
    East:  ['Buffalo Bills','Miami Dolphins','New England Patriots','New York Jets'],
    North: ['Baltimore Ravens','Cincinnati Bengals','Cleveland Browns','Pittsburgh Steelers'],
    South: ['Houston Texans','Indianapolis Colts','Jacksonville Jaguars','Tennessee Titans'],
    West:  ['Denver Broncos','Kansas City Chiefs','Las Vegas Raiders','Los Angeles Chargers'],
  },
  NFC: {
    East:  ['Dallas Cowboys','New York Giants','Philadelphia Eagles','Washington Commanders'],
    North: ['Chicago Bears','Detroit Lions','Green Bay Packers','Minnesota Vikings'],
    South: ['Atlanta Falcons','Carolina Panthers','New Orleans Saints','Tampa Bay Buccaneers'],
    West:  ['Arizona Cardinals','Los Angeles Rams','San Francisco 49ers','Seattle Seahawks'],
  },
};
const NFL_ALL_TEAMS = Object.values(NFL_TEAMS).flatMap(d=>Object.values(d)).flat();

// ── NFL POSITIONS ─────────────────────────────────────────────────
const NFL_POSITIONS = {
  QB:  { label:'Quarterback',      icon:'🏈', statKeys:['pass_yds','pass_td','ints'],       cap:'offense' },
  RB:  { label:'Running Back',     icon:'🏃', statKeys:['rush_yds','td','rec'],              cap:'offense' },
  WR:  { label:'Wide Receiver',    icon:'⚡', statKeys:['rec','yds','td'],                  cap:'offense' },
  TE:  { label:'Tight End',        icon:'🎯', statKeys:['rec','yds','td'],                  cap:'offense' },
  OL:  { label:'Offensive Lineman',icon:'🧱', statKeys:['td'],                              cap:'offense' },
  DE:  { label:'Defensive End',    icon:'💪', statKeys:['sacks','tackles'],                 cap:'defense' },
  DT:  { label:'Defensive Tackle', icon:'🛡️', statKeys:['sacks','tackles'],                 cap:'defense' },
  LB:  { label:'Linebacker',       icon:'🔥', statKeys:['tackles','sacks','ints'],          cap:'defense' },
  CB:  { label:'Cornerback',       icon:'🦅', statKeys:['ints','tackles'],                  cap:'defense' },
  S:   { label:'Safety',           icon:'🔒', statKeys:['ints','tackles'],                  cap:'defense' },
  K:   { label:'Kicker',           icon:'⚽', statKeys:['td'],                              cap:'special' },
};

// ── ENDORSEMENT BRANDS ────────────────────────────────────────────
const NFL_ENDORSEMENTS = [
  { name:'Nike',         min:30, value:[500000,5000000],  desc:'Apparel deal. Logo on everything.' },
  { name:'Gatorade',     min:20, value:[200000,2000000],  desc:'Sideline visibility. Classic.' },
  { name:'State Farm',   min:40, value:[300000,3000000],  desc:'Insurance ads. Jake from State Farm energy.' },
  { name:'Campbell\'s',  min:25, value:[100000,800000],   desc:'Chunky Soup. Mama making it on TV.' },
  { name:'Pepsi',        min:35, value:[400000,4000000],  desc:'Beverage deal. Super Bowl ads.' },
  { name:'Subway',       min:20, value:[150000,1000000],  desc:'Eat Fresh. The footlong era.' },
  { name:'Under Armour', min:25, value:[300000,2500000],  desc:'Training gear. Intensity.' },
  { name:'Madden NFL',   min:50, value:[500000,2000000],  desc:'Video game cover. Curse discussion incoming.' },
  { name:'EA Sports',    min:45, value:[400000,1500000],  desc:'Franchise mode. Digital immortality.' },
  { name:'Head & Shoulders',min:15,value:[100000,500000], desc:'Shampoo. Troy Polamalu vibes.' },
  { name:'McDonalds',    min:30, value:[200000,1500000],  desc:'Golden Arches. Happy Meal edition.' },
  { name:'USAA',         min:35, value:[250000,1200000],  desc:'Military appreciation. Patriotic brand.' },
  { name:'Bose',         min:40, value:[300000,2000000],  desc:'Headphones on sideline. Required viewing.' },
  { name:'your own brand',min:60, value:[1000000,10000000],desc:'Fully independent. Your rules.' },
];

// ── CELEBRITY PARTNERS ────────────────────────────────────────────
const CELEB_GIRLFRIENDS = [
  { name:'a pop star',      fameMod:0.5,  prBoost:15, drama:0.2  },
  { name:'an actress',      fameMod:0.4,  prBoost:12, drama:0.15 },
  { name:'a model',         fameMod:0.3,  prBoost:10, drama:0.1  },
  { name:'a reality star',  fameMod:0.3,  prBoost:8,  drama:0.3  },
  { name:'a social media influencer', fameMod:0.2, prBoost:8, drama:0.2 },
  { name:'a fellow athlete',fameMod:0.4,  prBoost:10, drama:0.15 },
  { name:'a musician',      fameMod:0.35, prBoost:11, drama:0.18 },
  { name:'a CEO',           fameMod:0.25, prBoost:6,  drama:0.1  },
];

// ── OFF-FIELD DRAMA EVENTS ────────────────────────────────────────
const NFL_DRAMA = [
  { msg:'Cryptic tweet at 2am. PR team handled it. Barely.',          pubD:-8,  dark:1, type:'warn' },
  { msg:'Traffic stop. No charges. Massive news cycle anyway.',       pubD:-12, dark:1, type:'bad'  },
  { msg:'Beef with a teammate leaked to ESPN. Locker room: fractured.',pubD:-15,dark:1, type:'bad'  },
  { msg:'Anonymous source called you "difficult to coach." You denied it loudly.', pubD:-10, dark:0, type:'warn' },
  { msg:'You did a podcast. One clip went viral. All of it was wrong context.', pubD:-8, dark:0, type:'warn' },
  { msg:'Contract holdout. Fans split. Front office furious. You stood firm.',   pubD:-5,  dark:0, type:'warn' },
  { msg:'You donated $1M to your hometown school district. The internet loved it.',pubD:20, dark:0, type:'good' },
  { msg:'Social media beef with a pundit. You won. They doubled down. You won again.', pubD:5, dark:0, type:'good' },
  { msg:'Nightclub incident. Nothing charged. Photos: everywhere.',  pubD:-18, dark:2, type:'bad'  },
  { msg:'You showed up to training camp in a Rolls. The discourse: immediate.',  pubD:-3,  dark:0, type:'warn' },
  { msg:'You visited sick children at a hospital. No cameras. Someone posted it anyway.', pubD:18, dark:0, type:'good' },
  { msg:'Press conference meltdown. Seven minutes of gold. Memes still circulating.', pubD:-12, dark:0, type:'bad' },
];
// ── SUPER BOWL MOMENTS ────────────────────────────────────────────
const SB_MOMENTS = [
  'The drive down the field in the final two minutes. You could hear nothing but your own heartbeat.',
  'The locker room after. Confetti still falling. Your teammates\' faces.',
  'You called your mother from the field. She was crying before you said a word.',
  'The Lombardi Trophy felt lighter than you expected. Everything else: heavier.',
  'The halftime show was spectacular. You didn\'t see it. You were preparing.',
  'You gave an interview so good that clips still circulate years later.',
  'The city parade was six miles long. You threw your gloves into the crowd.',
];

function depthLabel(d){
  return d==='starter'?'Starter':d==='rotation'?'Rotation':'Bench';
}
function agentFocusLabel(f){
  return f==='money'?'Max Money':f==='rings'?'Championships':f==='market'?'Market & Brand':'Balanced';
}
function depthMult(d){
  return d==='starter'?1:d==='rotation'?0.7:0.4;
}
function chemMult(c){
  return clamp(0.9 + (c-50)/200, 0.75, 1.1);
}
function skillMult(s){
  return clamp(0.75 + (s||50)/200, 0.6, 1.25);
}
function calcNflLegacy(n){
  const score = Math.round(
    n.superBowlWins*12 + n.superBowlMVPs*8 + n.mvpAwards*10 + n.allPro*5 + n.proBowls*3 +
    (n.stats.pass_yds||0)/5000 + (n.stats.rush_yds||0)/2000 + (n.stats.yds||0)/2000 + (n.stats.tackles||0)/150
  );
  const tier = score>=70?'Legend':score>=45?'Hall of Fame':score>=28?'All-Time Great':score>=16?'Star':score>=8?'Solid':'Role Player';
  return { score, tier };
}

// ── NFL SEASON PASSIVE ────────────────────────────────────────────
function nflSeasonPassive(){
  const n = G.nfl;
  if(!n.active||n.retired) return;

  n.year++;
  n.age_entered = n.age_entered || G.age;
  const prevDepth = n.depth;
  const seasonAwards = [];

  // Injury check
  const injuryChance = clamp(0.05 + (100-n.durability)/200 + (G.age>=30?0.05:0) + (n.injuryRiskBoost||0), 0.04, 0.45);
  if(Math.random()<injuryChance){
    const inj=pick(['knee sprain','hamstring pull','shoulder strain','ankle sprain','rib contusion','concussion','back tightness']);
    n.injured=true; n.injuryWeeks=rnd(3,16); n.injuryHistory.push(inj);
    G.health=clamp(G.health-rnd(6,16));
    addEv(`Season injury: ${inj}. Projected ${n.injuryWeeks} weeks missed.`,`bad`);
  }

  const depthM = depthMult(n.depth);
  const chemM  = chemMult(n.chemistry);
  const skillM = skillMult(n.skill);
  const injM   = n.injured ? 0.35 : 1;
  const statM  = depthM * chemM * skillM * injM;

  // Base performance: health + skill + chemistry + random
  const perfBase = Math.min(100, (G.health*0.45 + (n.skill||50)*0.35 + rnd(10,30) + (n.chemistry-50)*0.3) * (0.7 + depthM*0.3));
  const isOffense = ['QB','RB','WR','TE'].includes(n.position);

  // Accumulate season stats
  if(n.position==='QB'){
    n.seasonStats.pass_yds = Math.floor(rnd(2800,5200)*statM);
    n.seasonStats.pass_td  = Math.floor(rnd(18,52)*statM);
    n.seasonStats.ints     = Math.floor(rnd(4,18)*chemM);
    n.stats.pass_yds += n.seasonStats.pass_yds;
    n.stats.pass_td  += n.seasonStats.pass_td;
    n.stats.ints     += n.seasonStats.ints;
  } else if(n.position==='RB'){
    n.seasonStats.yds = Math.floor(rnd(600,1800)*statM); n.seasonStats.td = Math.floor(rnd(4,16)*statM); n.seasonStats.rec = Math.floor(rnd(20,70)*statM);
    n.stats.rush_yds += n.seasonStats.yds; n.stats.td += n.seasonStats.td;
  } else if(n.position==='WR'||n.position==='TE'){
    n.seasonStats.rec = Math.floor(rnd(40,130)*statM); n.seasonStats.yds = Math.floor(rnd(500,1600)*statM); n.seasonStats.td = Math.floor(rnd(3,14)*statM);
    n.stats.rec += n.seasonStats.rec; n.stats.yds += n.seasonStats.yds; n.stats.td += n.seasonStats.td;
  } else {
    n.seasonStats.tackles = Math.floor(rnd(40,120)*statM); n.seasonStats.sacks = Math.floor(rnd(2,16)*statM); n.seasonStats.ints = Math.floor(rnd(0,8)*chemM);
    n.stats.tackles += n.seasonStats.tackles; n.stats.sacks += n.seasonStats.sacks;
  }

  // Contract payment
  if(n.contract.perYear>0){
    G.money += n.contract.perYear;
    n.totalEarned += n.contract.perYear;
  }

  // Endorsement income
  if(n.endorsementIncome>0){
    G.money += n.endorsementIncome;
    n.totalEarned += n.endorsementIncome;
    if(n.endorsementIncome>500000) addEv(`Endorsement checks: ${fmt$(n.endorsementIncome)} deposited. Your face is everywhere.`,'good');
  }

  // Determine season quality
  const quality = perfBase >= 80 ? 'elite' : perfBase >= 60 ? 'good' : perfBase >= 40 ? 'average' : 'poor';

  // Accolades
  if(quality==='elite'){
    if(Math.random()<0.35){ n.proBowls++; G.sm.totalFame=clamp(G.sm.totalFame+rnd(3,7));
      seasonAwards.push('Pro Bowl');
      addEv(`Pro Bowl selection! ${n.proBowls}× total. The league recognizes.`,'love');
      flash(`🏈 Pro Bowl! #${n.proBowls}`,'good'); }
    if(Math.random()<0.15){ n.allPro++;
      seasonAwards.push('All-Pro');
      addEv(`All-Pro selection. First team. The best at your position in the league.`,'love'); }
    if(Math.random()<0.06){ n.mvpAwards++;
      seasonAwards.push('MVP');
      G.sm.totalFame=clamp(G.sm.totalFame+rnd(8,15)); G.happy=clamp(G.happy+rnd(12,20));
      addEv(`NFL MVP! The most valuable player in the league. The speech was great.`,'love');
      flash('🏆 NFL MVP!!','good'); }
  }

  // ROY (year 1)
  if(n.year===2&&quality!=='poor'&&Math.random()<0.25){
    if(isOffense) n.offensiveROY=true; else n.defensiveROY=true;
    seasonAwards.push(isOffense?'Offensive ROY':'Defensive ROY');
    addEv(`NFL Rookie of the Year! The league is on notice.`,'love'); flash('🏆 Rookie of the Year!','good');
  }

  // Super Bowl run
  if(Math.random()<0.06+n.proBowls*0.02){
    nflSuperBowlRun(seasonAwards);
  } else {
    addEv(quality==='elite'
      ? `Elite ${n.position} season with ${n.team}. ${statSummaryNFL(n)}. The front office is very happy.`
      : quality==='good'
        ? `Solid season. ${statSummaryNFL(n)}. Starting spot secure.`
        : quality==='average'
          ? `Average season. The coaches want more.`
          : `Rough season. Trade rumors surfaced.`
      , quality==='elite'?'love':quality==='poor'?'bad':'good');
  }

  // Contract expiry
  n.contract.years = Math.max(0, n.contract.years-1);
  if(n.contract.years===0 && !n.retired){ n.freeAgent=true; addEv(`Contract expired. Free agent as of this offseason. The phones are ringing.`,'warn'); }

  // Passive public image drift
  n.publicImage = Math.max(20, Math.min(100, n.publicImage + rnd(-3,4)));

  // Injury recovery
  if(n.injured){
    n.injuryWeeks = Math.max(0, n.injuryWeeks-16);
    if(n.injuryWeeks===0){ n.injured=false; addEv('Fully cleared from your injury. Back to 100%.','good'); }
  }
  n.injuryRiskBoost = 0;

  // Age/injury check
  if(G.age>=33&&Math.random()<0.12){
    addEv(`Your body is telling you things at ${G.age}. Recovery takes longer. Nothing career-ending. Yet.`,'warn');
    G.health=clamp(G.health-rnd(3,8));
  }
  if(G.age>=38&&Math.random()<0.3){
    addEv(`The conversation about retirement is no longer theoretical.`,'warn');
  }

  // Drama event
  if(Math.random()<0.2) nflDramaEvent();

  // Roster competition update
  const roleScore = perfBase + (n.skill||50)*0.4 + n.chemistry*0.2 + rnd(-10,10) + (n.injured?-18:0);
  const newDepth = roleScore>=85?'starter':roleScore>=60?'rotation':'bench';
  if(!n.freeAgent&&!n.retired){
    if(newDepth!==prevDepth){
      n.depth=newDepth;
      addEv(`Depth chart update: you are now listed as ${depthLabel(n.depth).toLowerCase()}. Coaches based it on your tape.`, newDepth==='starter'?'love':'warn');
    }
  }

  // Season timeline log
  const seasonNum = n.year-1;
  n.seasonHistory = n.seasonHistory || [];
  n.seasonHistory.unshift({
    season:seasonNum,
    team:n.team,
    role:depthLabel(n.depth),
    awards:seasonAwards,
    statLine:statSummaryNFL(n),
  });
  if(n.seasonHistory.length>30) n.seasonHistory.pop();

  updateHUD();
}

function statSummaryNFL(n){
  if(n.position==='QB') return `${n.seasonStats.pass_yds?.toLocaleString()||0} pass yds, ${n.seasonStats.pass_td||0} TDs`;
  if(n.position==='RB') return `${n.seasonStats.yds?.toLocaleString()||0} rush yds, ${n.seasonStats.td||0} TDs`;
  if(n.position==='WR'||n.position==='TE') return `${n.seasonStats.rec||0} rec, ${n.seasonStats.yds?.toLocaleString()||0} yds`;
  return `${n.seasonStats.tackles||0} tackles, ${n.seasonStats.sacks||0} sacks`;
}

function nflSuperBowlRun(seasonAwards){
  const n = G.nfl;
  const wins = Math.random()<(0.3 + n.proBowls*0.05 + n.allPro*0.08);
  if(wins){
    n.superBowlWins++;
    if(Array.isArray(seasonAwards)) seasonAwards.push('Super Bowl Champion');
    G.happy=clamp(G.happy+rnd(22,30)); G.sm.totalFame=clamp(G.sm.totalFame+rnd(12,22));
    n.publicImage=Math.min(100,n.publicImage+rnd(15,25));
    const isMVP = Math.random()<0.3;
    if(isMVP){ n.superBowlMVPs++; }
    if(isMVP&&Array.isArray(seasonAwards)) seasonAwards.push('Super Bowl MVP');
    const moment = pick(SB_MOMENTS);
    addEv(`SUPER BOWL CHAMPION with the ${n.team}! ${isMVP?'Super Bowl MVP! ':''} ${moment}`,'love');
    flash(`🏆 SUPER BOWL CHAMP! ${isMVP?'+ MVP!':''}`, 'good');
    // Massive contract incoming
    if(n.contract.years<=1){ nflSignNewContract(true); }
  } else {
    G.happy=clamp(G.happy-rnd(8,14)); n.publicImage=Math.max(30,n.publicImage-rnd(2,8));
    addEv(`Super Bowl. You made the run. Lost in the final minute. The silence after.`,'bad');
    flash(`Super Bowl loss. Gut punch.`,'bad');
  }
}

function nflDramaEvent(){
  const n = G.nfl;
  const ev = pick(NFL_DRAMA);
  n.publicImage=Math.max(5,Math.min(100,n.publicImage+ev.pubD));
  if(ev.dark) G.darkScore+=ev.dark;
  G.happy=clamp(G.happy+(ev.pubD>0?rnd(3,8):rnd(-5,0)));
  addEv(ev.msg, ev.type);
}

function nflSignNewContract(postSuperBowl=false){
  const n = G.nfl;
  const base = postSuperBowl ? 1.4 : 1.0;
  const skillTier = n.skill>=80?1.25:n.skill>=65?1.1:n.skill>=50?1.0:0.9;
  const tierMod = (n.allPro>0 ? 1.6 : n.proBowls>2 ? 1.3 : n.proBowls>0 ? 1.1 : 0.85) * skillTier;
  let perYear = Math.floor(rnd(2000000,45000000) * base * tierMod);
  const years   = rnd(1,4);
  let total   = perYear * years;
  let guar    = Math.floor(total * rnd(40,80)/100);
  if(n.agentFocus==='money'){ perYear=Math.floor(perYear*1.15); total=perYear*years; guar=Math.floor(guar*1.1); }
  if(n.agentFocus==='rings'){ perYear=Math.floor(perYear*0.9); total=perYear*years; n.publicImage=Math.min(100,n.publicImage+rnd(2,6)); }
  if(n.agentFocus==='market'){ n.endorsementIncome+=rnd(150000,800000); n.publicImage=Math.min(100,n.publicImage+rnd(3,7)); }
  n.contract = { years, totalValue:total, guaranteed:guar, perYear };
  n.freeAgent = false;
  addEv(`New contract: ${years} yr / ${fmt$(total)} total · ${fmt$(guar)} guaranteed · ${fmt$(perYear)}/yr.`,'love');
  flash(`💰 New NFL contract: ${fmt$(total)}`,'good');
}

// ── RENDER NFL ────────────────────────────────────────────────────
function renderNFL(){
  const nc = document.getElementById('nfl-content');
  const n  = G.nfl;
  const u  = G.school.uni;

  // Entry gate
  if(!n.active && !n.retired){
    const eligible = u.nflDraftable || (u.draftDeclared && u.sport==='football');
    if(!eligible){
      nc.innerHTML=`<div class="notif warn">
        <strong>NFL Draft</strong> — Declare for the draft from the School tab after at least 3 college football seasons.
        ${u.sport!=='football'?'<br>You need to play college football first.':''}
      </div>`; return;
    }
    nc.innerHTML=nflDraftEntryScreen(u); return;
  }

  if(n.retired){
    nc.innerHTML=nflRetirementScreen(n); return;
  }

  // Active career screen
  nc.innerHTML=nflActiveScreen(n);
}

function nflDraftEntryScreen(u){
  const round = u.draftRound||7; const pick_=u.draftPick||32;
  const team  = u.draftTeam||pick(NFL_ALL_TEAMS);
  const salary = round===1?rnd(5000000,35000000):round<=3?rnd(1000000,5000000):rnd(600000,1000000);
  return `
  <div class="card" style="border-color:rgba(251,191,36,.3);text-align:center;padding:28px 20px">
    <div style="font-size:3rem;margin-bottom:10px">🏈</div>
    <div style="font-family:var(--fh);font-weight:800;font-size:1.6rem;margin-bottom:6px">NFL Draft Day</div>
    <div style="color:var(--muted2);font-size:.9rem;margin-bottom:20px">The commissioner is at the podium.</div>
    <div style="background:var(--surface2);border-radius:var(--r);padding:16px;margin-bottom:20px">
      <div style="font-size:.7rem;color:var(--muted2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Selected</div>
      <div style="font-family:var(--fh);font-weight:800;font-size:1.4rem;color:var(--gold)">Round ${round}, Pick ${pick_}</div>
      <div style="font-size:1.1rem;margin-top:6px">${team}</div>
      <div style="font-size:.8rem;color:var(--muted2);margin-top:4px">${round===1?'First round money. Life-changing.':round<=3?'Solid pick. Real roster spot.':'Fighting for that 53-man roster.'}</div>
    </div>
    <div style="font-family:var(--fh);font-weight:700;font-size:.9rem;color:var(--gold);margin-bottom:16px">Rookie contract: ~${fmt$(salary)}/yr</div>
    <button class="btn btn-primary btn-lg btn-block" onclick="nflEnterLeague('${team}','${u.sport==='football'?(G.school.football&&G.school.football.position||'WR'):'WR'}',${round},${salary})">
      Sign Rookie Contract →
    </button>
  </div>`;
}

function nflEnterLeague(team, position, round, salary){
  const n = G.nfl;
  n.active=true; n.team=team; n.position=position||'WR';
  n.jerseyNumber=rnd(1,99);
  n.age_entered=G.age;
  n.depth=round===1?'starter':round<=3?'rotation':'bench';
  n.skill=clamp(45+rnd(0,12)+(round===1?10:round<=3?6:0));
  n.chemistry=clamp(45+rnd(0,15));
  const years=round<=2?4:round<=5?3:2;
  n.contract={years, totalValue:salary*years, guaranteed:Math.floor(salary*years*0.6), perYear:salary};
  G.money+=salary; n.totalEarned+=salary;
  G.sm.totalFame=clamp(G.sm.totalFame+rnd(8,18));
  n.publicImage=65+rnd(0,15);
  addEv(`${team} rookie. #${n.jerseyNumber}. ${n.position}. ${fmt$(salary)}/yr. You made it.`,'love');
  flash(`🏈 Welcome to the NFL! ${team}`,'good');
  updateHUD(); renderNFL();
}

function nflActiveScreen(n){
  const pos = NFL_POSITIONS[n.position]||{label:n.position,icon:'🏈'};
  const imgColor = n.publicImage>=70?'var(--success)':n.publicImage>=45?'var(--gold)':'var(--danger)';
  const statStr  = statSummaryNFL(n);
  const history  = n.seasonHistory||[];

  return `
  <!-- Header -->
  <div class="card" style="border-color:rgba(251,191,36,.25)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.5rem">${G.firstname} "${n.team.split(' ').pop()}" ${G.lastname}</div>
        <div style="font-size:.8rem;color:var(--muted2);margin-top:2px">${pos.icon} ${pos.label} · ${n.team} · #${n.jerseyNumber} · Year ${n.year-1} in league</div>
        ${n.freeAgent?'<span class="badge badge-gold" style="margin-top:4px">🆓 Free Agent</span>':''}
        ${n.holdout?'<span class="badge badge-danger" style="margin-top:4px">⚠️ Holdout</span>':''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${n.superBowlWins?`<div style="color:var(--gold);font-family:var(--fh);font-weight:800">🏆×${n.superBowlWins}</div>`:''}
        ${n.proBowls?`<div style="font-size:.72rem;color:var(--muted2)">${n.proBowls}× Pro Bowl</div>`:''}
        ${n.mvpAwards?`<div style="font-size:.72rem;color:var(--gold)">${n.mvpAwards}× MVP</div>`:''}
      </div>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.contract.perYear)}</div><div class="sm-stat-lbl">Per Year</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.contract.years}yr left</div><div class="sm-stat-lbl">Contract</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:${imgColor}">${n.publicImage}</div><div class="sm-stat-lbl">Public Image</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${depthLabel(n.depth)}</div><div class="sm-stat-lbl">Role</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.chemistry}</div><div class="sm-stat-lbl">Chemistry</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.durability}</div><div class="sm-stat-lbl">Durability</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.skill}</div><div class="sm-stat-lbl">Skill</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.totalEarned)}</div><div class="sm-stat-lbl">Career Earned</div></div>
    </div>
    <div style="font-size:.76rem;color:var(--muted2)">Season: ${statStr}</div>
    ${n.injured?`<div class="badge badge-danger" style="margin-top:6px">🩹 Injured (${n.injuryWeeks} weeks)</div>`:''}
    <div style="font-size:.72rem;color:var(--muted2);margin-top:4px">Agent focus: ${agentFocusLabel(n.agentFocus)}</div>
    ${n.endorsements.length?`<div style="margin-top:6px;display:flex;gap:5px;flex-wrap:wrap">${n.endorsements.map(e=>`<span class="badge badge-accent">${e}</span>`).join('')}</div>`:''}
    ${n.girlfriend?`<div style="font-size:.76rem;color:var(--accent3);margin-top:6px">💑 Dating ${n.girlfriend.name}</div>`:''}
    ${n.brand?`<div style="font-size:.76rem;color:var(--accent2);margin-top:4px">🏷️ Brand: ${n.brand}</div>`:''}
    ${n.foundation?`<div style="font-size:.76rem;color:var(--success);margin-top:4px">❤️ Foundation: ${n.foundation}</div>`:''}
  </div>

  <!-- On-field -->
  <div class="card"><div class="card-title">On the Field</div>
    <div class="choice-grid">
      <div class="choice" onclick="nflAct('train')"><div class="choice-icon">💪</div><div class="choice-name">Training Camp</div><div class="choice-desc">+Performance next season</div></div>
      <div class="choice" onclick="nflAct('film')"><div class="choice-icon">📹</div><div class="choice-name">Film Study</div><div class="choice-desc">+Smarts +Next season</div></div>
      <div class="choice" onclick="nflAct('skill_focus')"><div class="choice-icon">🎯</div><div class="choice-name">Position Focus</div><div class="choice-desc">Sharpen your specific role</div></div>
      <div class="choice" onclick="nflAct('workout')"><div class="choice-icon">🏋️</div><div class="choice-name">Offseason Workout</div><div class="choice-desc">+Health +Longevity</div></div>
      <div class="choice" onclick="nflAct('team_bond')"><div class="choice-icon">🧩</div><div class="choice-name">Team Chemistry</div><div class="choice-desc">Build trust in the locker room</div></div>
      <div class="choice" onclick="nflAct('camp_skip')"><div class="choice-icon">🏖️</div><div class="choice-name">Skip OTAs</div><div class="choice-desc">Rest. Coach won't like it.</div></div>
      <div class="choice" onclick="nflAct('injury_rehab')"><div class="choice-icon">🩹</div><div class="choice-name">Injury Prevention</div><div class="choice-desc">Reduce injury risk</div></div>
      <div class="choice" onclick="nflAct('rehab_plan')"><div class="choice-icon">🏥</div><div class="choice-name">Rehab Plan</div><div class="choice-desc">Structured recovery path</div></div>
      <div class="choice" onclick="nflAct('play_hurt')"><div class="choice-icon">😤</div><div class="choice-name">Play Through It</div><div class="choice-desc">High risk. High reward.</div></div>
    </div>
  </div>

  <!-- Contract & team -->
  <div class="card"><div class="card-title">Contract & Team</div>
    <div class="choice-grid">
      ${n.freeAgent?`<div class="choice" onclick="nflAct('sign_contract')"><div class="choice-icon">✍️</div><div class="choice-name">Sign a Contract</div><div class="choice-desc">Evaluate offers</div></div>`:''}
      ${!n.freeAgent?`<div class="choice" onclick="nflAct('extension')"><div class="choice-icon">📋</div><div class="choice-name">Request Extension</div><div class="choice-desc">Lock in long-term</div></div>`:''}
      <div class="choice" onclick="nflAct('agent_focus')"><div class="choice-icon">🧑‍💼</div><div class="choice-name">Agent Strategy</div><div class="choice-desc">Set your negotiation priority</div></div>
      <div class="choice" onclick="nflAct('role_request')"><div class="choice-icon">📈</div><div class="choice-name">Role Discussion</div><div class="choice-desc">Ask for a bigger role</div></div>
      <div class="choice" onclick="nflAct('holdout')"><div class="choice-icon">⛔</div><div class="choice-name">${n.holdout?'End Holdout':'Stage Holdout'}</div><div class="choice-desc">${n.holdout?'Report to camp':'Leverage for more money'}</div></div>
      <div class="choice" onclick="nflAct('trade_demand')"><div class="choice-icon">🚪</div><div class="choice-name">Request Trade</div><div class="choice-desc">Force a move</div></div>
      <div class="choice" onclick="nflAct('mentor')"><div class="choice-icon">🧑‍🏫</div><div class="choice-name">Mentor a Rookie</div><div class="choice-desc">+Legacy +Public image</div></div>
      <div class="choice" onclick="nflAct('retire')"><div class="choice-icon">👋</div><div class="choice-name">Announce Retirement</div><div class="choice-desc">Go out on your terms</div></div>
    </div>
  </div>

  <!-- Endorsements -->
  <div class="card"><div class="card-title">Endorsements & Brand</div>
    <div style="margin-bottom:10px">
      ${n.endorsements.length?`<div style="font-size:.78rem;color:var(--muted2)">Current: ${n.endorsements.join(', ')}<br>Annual income: ${fmt$(n.endorsementIncome)}</div>`:
        `<div style="font-size:.78rem;color:var(--muted2)">No endorsements yet. Build your public image.</div>`}
    </div>
    <div class="choice-grid">
      ${NFL_ENDORSEMENTS.filter(e=>G.sm.totalFame>=e.min&&!n.endorsements.includes(e.name)).slice(0,6).map(e=>`
        <div class="choice" onclick="nflEndorse('${e.name.replace(/'/g,"\\'")}')">
          <div class="choice-icon">💼</div>
          <div class="choice-name">${e.name}</div>
          <div class="choice-desc">${e.desc}</div>
          <div style="font-size:.66rem;color:var(--gold);margin-top:3px">${fmt$(e.value[0])}–${fmt$(e.value[1])}/yr</div>
        </div>`).join('')}
      ${!n.brand?`<div class="choice" onclick="nflAct('start_brand')"><div class="choice-icon">🏷️</div><div class="choice-name">Launch Personal Brand</div><div class="choice-desc">Your own clothing/lifestyle line</div></div>`:''}
      ${!n.foundation?`<div class="choice" onclick="nflAct('foundation')"><div class="choice-icon">❤️</div><div class="choice-name">Start a Foundation</div><div class="choice-desc">+Legacy +Public image</div></div>`:''}
    </div>
  </div>

  <!-- Awards timeline -->
  <div class="card"><div class="card-title">Awards & Timeline</div>
    ${history.length?`
      <div style="display:flex;flex-direction:column;gap:6px">
        ${history.slice(0,6).map(s=>`
          <div style="padding:8px;border:1px solid var(--border);border-radius:10px;background:var(--surface2)">
            <div style="font-size:.78rem;color:var(--muted2)">Year ${s.season} · ${s.team} · ${s.role}</div>
            <div style="font-size:.85rem;margin-top:2px">${s.statLine}</div>
            ${s.awards&&s.awards.length?`<div style="font-size:.72rem;color:var(--gold);margin-top:4px">🏆 ${s.awards.join(', ')}</div>`:''}
          </div>
        `).join('')}
      </div>
    `:`<div style="font-size:.78rem;color:var(--muted2)">No seasons logged yet.</div>`}
  </div>

  <!-- Lifestyle -->
  <div class="card"><div class="card-title">Lifestyle & Celebrity</div>
    <div class="choice-grid">
      ${!n.girlfriend?`<div class="choice" onclick="nflAct('date_celeb')"><div class="choice-icon">💑</div><div class="choice-name">Date a Celebrity</div><div class="choice-desc">Fame boost. Drama risk.</div></div>`:''}
      ${n.girlfriend?`<div class="choice" onclick="nflAct('relationship')"><div class="choice-icon">💖</div><div class="choice-name">Relationship Events</div><div class="choice-desc">Paparazzi. Red carpets.</div></div>`:''}
      <div class="choice" onclick="nflAct('party')"><div class="choice-icon">🎉</div><div class="choice-name">Athlete Party</div><div class="choice-desc">Off-season. Other pros.</div></div>
      <div class="choice" onclick="nflAct('charity_event')"><div class="choice-icon">🤝</div><div class="choice-name">Charity Appearance</div><div class="choice-desc">+Public image</div></div>
      <div class="choice" onclick="nflAct('press')"><div class="choice-icon">🎙️</div><div class="choice-name">Press Conference</div><div class="choice-desc">Shape the narrative</div></div>
      <div class="choice" onclick="nflAct('madden_cover')"><div class="choice-icon">🎮</div><div class="choice-name">Accept Madden Cover</div><div class="choice-desc">Fame. The curse.</div></div>
      <div class="choice" onclick="nflAct('buy_car')"><div class="choice-icon">🚗</div><div class="choice-name">Buy a Supercar</div><div class="choice-desc">$400K · You earned it.</div></div>
      <div class="choice" onclick="nflAct('buy_house')"><div class="choice-icon">🏡</div><div class="choice-name">Buy a Mansion</div><div class="choice-desc">$5M · The dream.</div></div>
    </div>
  </div>`;
}

function nflAct(type){
  const n = G.nfl;
  if(type==='train'){
    showPopup('🏈 Training Camp Focus',
      'Pick what you want camp to prioritize. The staff takes notes.',
      [
        { label:'Speed & agility', action:()=>{ G.health=clamp(G.health+rnd(3,7)); n.skill=clamp(n.skill+rnd(4,8));
          addEv('Training camp focused on speed and agility. Your cuts look sharper.','good'); renderNFL(); } },
        { label:'Strength & power', action:()=>{ G.health=clamp(G.health+rnd(5,10)); n.durability=clamp(n.durability+rnd(3,7));
          addEv('Power-focused camp. You feel sturdier through contact.','good'); renderNFL(); } },
        { label:'Playbook & timing', action:()=>{ G.smarts=clamp(G.smarts+rnd(2,5)); n.skill=clamp(n.skill+rnd(2,6)); n.chemistry=clamp(n.chemistry+rnd(4,8));
          addEv('Playbook mastery and timing. The unit moves as one.','good'); renderNFL(); } },
        { label:'Leadership reps', action:()=>{ n.publicImage=Math.min(100,n.publicImage+rnd(3,7)); n.chemistry=clamp(n.chemistry+rnd(5,10));
          addEv('You led the locker room all camp. Coaches took notice.','good'); renderNFL(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='film'){
    G.smarts=clamp(G.smarts+rnd(2,5)); n.publicImage=Math.min(100,n.publicImage+2);
    n.skill=clamp(n.skill+rnd(1,4)); n.chemistry=clamp(n.chemistry+rnd(2,4));
    addEv(`Film room. You saw things in the defense nobody else caught. It'll show.`,'good');
    flash(`+Smarts · film session`,'good');
  } else if(type==='skill_focus'){
    const pos = NFL_POSITIONS[n.position]||{label:n.position,icon:'🏈'};
    showPopup(`🎯 ${pos.label} Focus`,
      `Choose a focus this offseason. It boosts your position skill and slightly changes your role outlook.`,
      [
        { label:'Technique work', action:()=>{ n.skill=clamp(n.skill+rnd(4,8)); n.chemistry=clamp(n.chemistry+rnd(1,3));
          addEv('Refined technique. You look smoother, faster, more efficient. Coaches noticed.','good'); renderNFL(); } },
        { label:'Strength & burst', action:()=>{ G.health=clamp(G.health+rnd(3,7)); n.skill=clamp(n.skill+rnd(2,6));
          addEv('Focused on power and burst. The film looks violent in a good way.','good'); renderNFL(); } },
        { label:'Playbook mastery', action:()=>{ G.smarts=clamp(G.smarts+rnd(3,6)); n.skill=clamp(n.skill+rnd(2,5)); n.chemistry=clamp(n.chemistry+rnd(2,5));
          addEv('Mastered the playbook. Everyone trusts you to make the right adjustment.','good'); renderNFL(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='workout'){
    G.health=clamp(G.health+rnd(5,12)); G.looks=clamp(G.looks+rnd(1,4)); n.durability=clamp(n.durability+rnd(2,5));
    addEv(`Offseason workout regime. You posted the results. The internet responded.`,'good');
    flash(`+Health +Looks 💪`,'good');
  } else if(type==='team_bond'){
    n.chemistry=clamp(n.chemistry+rnd(6,12)); n.publicImage=Math.min(100,n.publicImage+rnd(2,5));
    addEv('Team trip and extra reps. The locker room trusts you more. Timing feels automatic now.','good');
    flash('🧩 Chemistry up','good');
  } else if(type==='camp_skip'){
    n.publicImage=Math.max(20,n.publicImage-rnd(5,12)); G.happy=clamp(G.happy+rnd(8,14));
    n.chemistry=clamp(n.chemistry-rnd(6,12));
    addEv(`Skipped OTAs. "Personal reasons." Coach was diplomatic about it. Privately: not.`,'warn');
    flash(`Skipped OTAs. Coach unhappy.`,'warn');
  } else if(type==='injury_rehab'){
    G.health=clamp(G.health+rnd(8,18)); n.durability=clamp(n.durability+rnd(6,12)); n.injuryRiskBoost=0;
    addEv(`You invested in your body this offseason. Trainer, therapist, biometrics. Age is a choice.`,'good');
    flash(`+Health · injury prevention 🩹`,'good');
  } else if(type==='rehab_plan'){
    showPopup('🏥 Rehab Plan',
      n.injured?'You\'re currently injured. Choose how aggressive your rehab will be.':'You\'re healthy, but you can still invest in preventative rehab.',
      [
        { label:'Aggressive rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(3,7)); n.durability=clamp(n.durability-rnd(1,4)); }
          else { n.durability=clamp(n.durability+rnd(1,3)); }
          addEv('Aggressive rehab plan. Faster timeline, higher wear-and-tear risk.','warn'); renderNFL();
        }},
        { label:'Balanced rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(2,5)); }
          n.durability=clamp(n.durability+rnd(2,5)); n.chemistry=clamp(n.chemistry+rnd(1,3));
          addEv('Balanced rehab plan. Consistent progress. Staff approves.','good'); renderNFL();
        }},
        { label:'Conservative rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(1,3)); }
          n.durability=clamp(n.durability+rnd(4,8)); G.health=clamp(G.health+rnd(2,5));
          addEv('Conservative rehab plan. Slower return, stronger long-term body.','good'); renderNFL();
        }},
      ],
      'dark'
    );
    return;
  } else if(type==='play_hurt'){
    if(Math.random()<0.4){
      const inj=pick(['knee sprain','hamstring pull','shoulder strain','ankle sprain','rib contusion']);
      n.injuryHistory.push(inj); n.injured=true; n.injuryWeeks=rnd(4,10); G.health=clamp(G.health-rnd(15,30));
      addEv(`You played through it and it became something worse. ${inj}. Out 4-8 weeks.`,'bad');
      flash(`Injury: ${inj} 🩹`,'bad');
    } else {
      n.injuryRiskBoost=clamp((n.injuryRiskBoost||0)+0.1,0,0.35);
      G.happy=clamp(G.happy+rnd(8,15)); n.publicImage=Math.min(100,n.publicImage+rnd(3,7));
      addEv(`You played through the pain and the performance tape was electric. Warrior mentality.`,'love');
      flash(`Played through it! Elite tape.`,'good');
    }
  } else if(type==='agent_focus'){
    showPopup('🧑‍💼 Agent Strategy',
      'Choose what your agent prioritizes in negotiations.',
      [
        { label:'Max money', action:()=>{ n.agentFocus='money'; addEv('Agent focus set: money. They will push for every dollar.','good'); renderNFL(); } },
        { label:'Championship chase', action:()=>{ n.agentFocus='rings'; addEv('Agent focus set: rings. You\'ll take less to win.','good'); renderNFL(); } },
        { label:'Market & brand', action:()=>{ n.agentFocus='market'; addEv('Agent focus set: market. Bigger city, bigger brand.','good'); renderNFL(); } },
        { label:'Balanced', action:()=>{ n.agentFocus='balanced'; addEv('Agent focus set: balanced.','good'); renderNFL(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='role_request'){
    showPopup('📈 Role Discussion',
      'Talk to the coaching staff about your role. Bigger role means bigger expectations.',
      [
        { label:'Push for starter', action:()=>{ n.depth='starter'; n.chemistry=clamp(n.chemistry+rnd(-6,6));
          addEv('You asked for the starting role. The staff agreed — but now the spotlight is real.','warn'); renderNFL(); } },
        { label:'Accept rotation', action:()=>{ n.depth='rotation'; n.chemistry=clamp(n.chemistry+rnd(2,6));
          addEv('You embraced a rotation role. Coaches trust you in key moments.','good'); renderNFL(); } },
        { label:'Stay patient', action:()=>{ n.depth='bench'; n.chemistry=clamp(n.chemistry+rnd(1,4)); G.happy=clamp(G.happy+rnd(2,5));
          addEv('You kept your head down. Opportunity will come.','good'); renderNFL(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='sign_contract'){
    nflSignNewContract();
  } else if(type==='extension'){
    if(n.contract.years>1){ flash('More than 1 year left — teams won\'t negotiate yet.','warn'); return; }
    nflSignNewContract();
  } else if(type==='holdout'){
    if(!n.holdout){
      n.holdout=true; n.publicImage=Math.max(20,n.publicImage-rnd(8,15)); n.chemistry=clamp(n.chemistry-rnd(6,12));
      addEv(`Holdout announced. "Not about the money." It is about the money.`,'warn');
      flash(`⛔ Holdout started`,'warn');
    } else {
      n.holdout=false; n.publicImage=Math.min(100,n.publicImage+rnd(5,10));
      nflSignNewContract();
    }
  } else if(type==='trade_demand'){
    const newTeam=pick(NFL_ALL_TEAMS.filter(t=>t!==n.team));
    n.prevTeams.push(n.team); n.team=newTeam; n.publicImage=Math.max(20,n.publicImage-rnd(5,12));
    n.chemistry=clamp(n.chemistry-rnd(6,12)); n.depth='rotation';
    addEv(`Trade demand honored. You\'re now with the ${newTeam}. Fresh start. New city. New contract incoming.`,'warn');
    flash(`Traded to ${newTeam}`,'warn');
  } else if(type==='mentor'){
    n.publicImage=Math.min(100,n.publicImage+rnd(5,12));
    addEv(`You mentored a rookie. Quietly. No cameras. The league noticed anyway.`,'good');
    flash(`+Public Image · mentored a rookie`,'good');
  } else if(type==='retire'){
    n.retired=true;
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(3,8));
    addEv(`You announced your retirement. ${n.superBowlWins>0?'Champion. ':''}${n.proBowls>0?n.proBowls+'× Pro Bowler. ':''}The tribute reel: immaculate.`,'love');
    flash(`🏈 Retired from the NFL.`,'good');
  } else if(type==='start_brand'){
    const bName=G.firstname+' Collection';
    n.brand=bName; n.endorsementIncome+=rnd(200000,2000000);
    addEv(`You launched your personal brand: ${bName}. First drop sold out.`,'love');
    flash(`🏷️ ${bName} launched!`,'good');
  } else if(type==='foundation'){
    n.foundation=`The ${G.lastname} Foundation`;
    n.publicImage=Math.min(100,n.publicImage+rnd(8,15));
    addEv(`${n.foundation} launched. Focus: youth athletics in underserved communities. The press was overwhelmingly positive.`,'good');
    flash(`❤️ ${n.foundation} launched!`,'good');
  } else if(type==='date_celeb'){
    const gf=pick(CELEB_GIRLFRIENDS);
    n.girlfriend={name:gf.name, drama:gf.drama};
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,10)*gf.fameMod);
    n.publicImage=Math.min(100,n.publicImage+gf.prBoost);
    addEv(`You and ${gf.name} went public. Combined paparazzi value: astronomical.`,'love');
    flash(`💑 Dating ${gf.name}!`,'good');
  } else if(type==='relationship'){
    if(!n.girlfriend) return;
    if(Math.random()<n.girlfriend.drama){
      n.publicImage=Math.max(20,n.publicImage-rnd(8,18)); G.darkScore++;
      addEv(`Relationship drama with ${n.girlfriend.name}. TMZ had the story before either of you.`,'bad');
      flash(`Drama with ${n.girlfriend.name}`,'bad');
      if(Math.random()<0.3){ n.girlfriend=null; addEv('You and them split publicly. The internet had takes.','warn'); }
    } else {
      G.happy=clamp(G.happy+rnd(6,12)); n.publicImage=Math.min(100,n.publicImage+rnd(3,7));
      addEv(`Red carpet appearance with ${n.girlfriend.name}. You both looked incredible. Good press.`,'love');
      flash(`Red carpet! +Image 📸`,'good');
    }
  } else if(type==='party'){
    G.happy=clamp(G.happy+rnd(10,18)); G.health=clamp(G.health-rnd(2,6));
    if(Math.random()<0.2){ G.darkScore++; n.publicImage=Math.max(20,n.publicImage-rnd(5,12));
      addEv(`The athlete party got a little out of hand. Nothing charged. Photos: circulating.`,'warn');
    } else {
      addEv(`Off-season party with other pros. What happens in Vegas, etc.`,'good');
    }
    flash(`Party 🎉`);
  } else if(type==='charity_event'){
    n.publicImage=Math.min(100,n.publicImage+rnd(6,14));
    addEv(`Charity appearance. You stayed longer than required. Kids got your number.`,'love');
    flash(`+Public Image ❤️`,'good');
  } else if(type==='press'){
    if(Math.random()>0.35){
      n.publicImage=Math.min(100,n.publicImage+rnd(4,10));
      addEv(`Press conference. Every question answered directly. The media ate it up.`,'good');
      flash(`Press: nailed it 🎙️`,'good');
    } else {
      n.publicImage=Math.max(20,n.publicImage-rnd(5,14));
      addEv(`Press conference. One answer went viral for the wrong reason. Already a meme.`,'bad');
      flash(`Press slip 😬`,'bad');
    }
  } else if(type==='madden_cover'){
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(6,12)); n.endorsementIncome+=rnd(500000,2000000);
    const cursed=Math.random()<0.45;
    addEv(`Madden cover athlete! ${fmt$(n.endorsementIncome)} deal. ${cursed?'The Madden curse is real. You know this. You accepted anyway.':'The curse: avoided. This year.'}`, cursed?'warn':'love');
    flash(`🎮 Madden cover! +${fmt$(n.endorsementIncome/1000000, 1)}M`,'good');
    if(cursed){ G.health=clamp(G.health-rnd(8,20)); addEv('The curse hit. Injury in week 3.','bad'); }
  } else if(type==='buy_car'){
    if(G.money<400000){ flash('Need $400K','bad'); return; }
    G.money-=400000; G.happy=clamp(G.happy+rnd(8,14));
    addEv(`New Lamborghini. Custom color. You drove it to practice once. Security risk, apparently.`,'love');
    flash(`🚗 Supercar acquired. $400K.`,'good');
  } else if(type==='buy_house'){
    if(G.money<5000000){ flash('Need $5M for a mansion','bad'); return; }
    G.money-=5000000; G.happy=clamp(G.happy+rnd(12,20)); G.assets.home=true; G.assets.homeValue=5000000;
    addEv(`Mansion purchased. Pool, gym, theater, court in the driveway. Every cliché: necessary.`,'love');
    flash(`🏡 Mansion secured. $5M.`,'good');
  }
  updateHUD(); renderNFL();
}

function nflEndorse(brand){
  const n  = G.nfl;
  const ed = NFL_ENDORSEMENTS.find(e=>e.name===brand);
  if(!ed){ flash('Brand not found','bad'); return; }
  if(G.sm.totalFame<ed.min){ flash(`Need ${ed.min} fame`,'bad'); return; }
  if(n.endorsements.includes(brand)){ flash('Already endorsed','warn'); return; }
  const val = rnd(ed.value[0],ed.value[1]);
  n.endorsements.push(brand); n.endorsementIncome+=val;
  addEv(`${brand} endorsement signed. ${fmt$(val)}/yr. Your face: everywhere.`,'love');
  flash(`💼 ${brand} deal! +${fmt$(val)}/yr`,'good');
  updateHUD(); renderNFL();
}

function nflRetirementScreen(n){
  return `
  <div class="card" style="text-align:center;padding:28px 20px">
    <div style="font-size:3rem;margin-bottom:12px">🏈</div>
    <div style="font-family:var(--fh);font-weight:800;font-size:1.5rem;margin-bottom:6px">${G.firstname} ${G.lastname} — Retired</div>
    <div style="color:var(--muted2);font-size:.85rem;margin-bottom:20px">${n.year-1} seasons · ${n.team}${n.prevTeams.length?' and '+n.prevTeams.length+' other teams':''}</div>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${n.superBowlWins}</div><div class="sm-stat-lbl">SB Rings</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.proBowls}</div><div class="sm-stat-lbl">Pro Bowls</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.allPro}</div><div class="sm-stat-lbl">All-Pro</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.totalEarned)}</div><div class="sm-stat-lbl">Career Earned</div></div>
    </div>
    ${n.mvpAwards?`<div class="badge badge-gold" style="margin-bottom:10px">🏆 ${n.mvpAwards}× NFL MVP</div>`:''}
    ${n.superBowlMVPs?`<div class="badge badge-gold" style="margin-bottom:10px">🏆 ${n.superBowlMVPs}× SB MVP</div>`:''}
    <div class="badge badge-accent" style="margin-bottom:10px">Legacy: ${calcNflLegacy(n).tier} (${calcNflLegacy(n).score})</div>
    <div class="choice-grid" style="margin-top:16px">
      <div class="choice" onclick="nflAct('unretire')"><div class="choice-icon">🔄</div><div class="choice-name">Un-Retire</div><div class="choice-desc">One more season. You know you want to.</div></div>
      <div class="choice" onclick="nflPostCareer('broadcast')"><div class="choice-icon">📺</div><div class="choice-name">Broadcasting Career</div><div class="choice-desc">TV analyst. Your takes: delivered.</div></div>
      <div class="choice" onclick="nflPostCareer('coaching')"><div class="choice-icon">📋</div><div class="choice-name">Coaching</div><div class="choice-desc">Give back to the game.</div></div>
      <div class="choice" onclick="nflPostCareer('hof')"><div class="choice-icon">🏛️</div><div class="choice-name">Hall of Fame Eligibility</div><div class="choice-desc">Check your legacy.</div></div>
    </div>
  </div>`;
}

function nflPostCareer(type){
  const n = G.nfl;
  if(type==='unretire'){
    n.retired=false; addEv(`You came out of retirement. The league welcomed you back. One more season.`,'warn');
    flash('Back in the league!','good');
  } else if(type==='broadcast'){
    G.money+=rnd(500000,3000000); G.sm.totalFame=clamp(G.sm.totalFame+rnd(3,7));
    addEv(`Broadcasting deal. You\'re in the booth now. The takes are your own.`,'good');
    flash(`📺 Broadcaster! +${fmt$(1500000)}`,'good');
  } else if(type==='coaching'){
    addEv(`You joined a coaching staff. Position coach to start. The game never really ends.`,'good');
    flash('📋 Coaching career begins','good');
  } else if(type==='hof'){
    const eligible = n.proBowls>=5||n.superBowlWins>=2||n.allPro>=3||n.mvpAwards>=1;
    if(eligible){
      addEv(`INDUCTED INTO THE PRO FOOTBALL HALL OF FAME. Canton, Ohio. A bronze bust of your face. Eternal.`,'love');
      flash('🏛️ HALL OF FAME!','good'); G.sm.totalFame=clamp(G.sm.totalFame+rnd(10,20));
    } else {
      addEv(`HOF voters passed this year. Career not yet considered a lock. Keep building the legacy.`,'warn');
    }
  }
  updateHUD(); renderNFL();
}


// ══════════════════════════════════════════════════════════════════
