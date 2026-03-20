//  nba.js — NBA Career System
//  Entry via draft → full career → legacy
// ══════════════════════════════════════════════════════════════════

// ── NBA TEAMS ─────────────────────────────────────────────────────
const NBA_TEAMS = {
  East: {
    Atlantic: ['Boston Celtics','Brooklyn Nets','New York Knicks','Philadelphia 76ers','Toronto Raptors'],
    Central:  ['Chicago Bulls','Cleveland Cavaliers','Detroit Pistons','Indiana Pacers','Milwaukee Bucks'],
    Southeast:['Atlanta Hawks','Charlotte Hornets','Miami Heat','Orlando Magic','Washington Wizards'],
  },
  West: {
    Northwest:['Denver Nuggets','Minnesota Timberwolves','Oklahoma City Thunder','Portland Trail Blazers','Utah Jazz'],
    Pacific:  ['Golden State Warriors','Los Angeles Clippers','Los Angeles Lakers','Phoenix Suns','Sacramento Kings'],
    Southwest:['Dallas Mavericks','Houston Rockets','Memphis Grizzlies','New Orleans Pelicans','San Antonio Spurs'],
  },
};
const NBA_ALL_TEAMS = Object.values(NBA_TEAMS).flatMap(d=>Object.values(d)).flat();

// ── NBA POSITIONS ─────────────────────────────────────────────────
const NBA_POSITIONS = {
  PG: { label:'Point Guard',        icon:'🎯', primary:'apg',  desc:'Floor general. Runs the show.' },
  SG: { label:'Shooting Guard',     icon:'⚡', primary:'ppg',  desc:'Scorer. Handles too.' },
  SF: { label:'Small Forward',      icon:'🔥', primary:'ppg',  desc:'Two-way. Versatile.' },
  PF: { label:'Power Forward',      icon:'💪', primary:'rpg',  desc:'Muscle and range.' },
  C:  { label:'Center',             icon:'🏰', primary:'rpg',  desc:'Rim presence. Anchor.' },
};

// ── NBA SNEAKER DEALS ─────────────────────────────────────────────
const NBA_SNEAKERS = [
  { brand:'Nike',           min:0,  base:[300000,3000000],   tier:'standard',    desc:'The swoosh. You\'re in the family.' },
  { brand:'Adidas',         min:0,  base:[250000,2500000],   tier:'standard',    desc:'Three stripes. Global reach.' },
  { brand:'Under Armour',   min:0,  base:[200000,1500000],   tier:'standard',    desc:'Steph Curry energy.' },
  { brand:'New Balance',    min:10, base:[300000,2000000],   tier:'standard',    desc:'The resurgence brand.' },
  { brand:'Jordan Brand',   min:30, base:[1000000,8000000],  tier:'premium',     desc:'The jumpman. Instant icon status.' },
  { brand:'Nike Signature', min:50, base:[5000000,20000000], tier:'signature',   desc:'Your own shoe. Your own line. Legacy.' },
  { brand:'Adidas Signature',min:45,base:[4000000,15000000], tier:'signature',   desc:'Your silhouette. Your colorways.' },
  { brand:'your own brand', min:70, base:[10000000,50000000],tier:'own_brand',   desc:'Total ownership. Maximum upside.' },
];

// ── NBA ENDORSEMENTS ──────────────────────────────────────────────
const NBA_ENDORSEMENTS = [
  { name:'Gatorade',       min:15, value:[300000,3000000],  desc:'Sports drink. Sideline visibility.' },
  { name:'State Farm',     min:25, value:[500000,5000000],  desc:'Like a good neighbor. The Jake era.' },
  { name:'2K Sports',      min:30, value:[400000,2000000],  desc:'NBA 2K cover. Gamers will have opinions.' },
  { name:'Apple',          min:50, value:[2000000,15000000],desc:'The most valuable brand in the world.' },
  { name:'Samsung',        min:40, value:[1000000,8000000], desc:'Galaxy. Global.' },
  { name:'Beats by Dre',   min:35, value:[500000,5000000],  desc:'Headphones at the tunnel walk. Mandatory.' },
  { name:'McDonald\'s',    min:20, value:[200000,2000000],  desc:'Happy Meal variant incoming.' },
  { name:'Sprite',         min:20, value:[300000,2500000],  desc:'Obey your thirst. The legacy slogan.' },
  { name:'Kia',            min:25, value:[400000,3000000],  desc:'NBA awards partner. Trophy presenter.' },
  { name:'Panini',         min:15, value:[200000,1500000],  desc:'Trading cards. Rookies always sell.' },
  { name:'Mountain Dew',   min:15, value:[150000,1200000],  desc:'Gaming crossover. High-energy brand.' },
  { name:'Body Armour',    min:20, value:[300000,3000000],  desc:'LeBron invested. You follow.' },
  { name:'your own brand', min:65, value:[5000000,40000000],desc:'Total independence. Total upside.' },
];

// ── CELEBRITY PARTNERS (NBA specific — bigger celebrity culture) ──
const NBA_CELEB_PARTNERS = [
  { name:'a chart-topping rapper',    fameMod:0.8,  prBoost:18, drama:0.2,  desc:'Culture collision. Headlines guaranteed.' },
  { name:'an R&B singer',            fameMod:0.7,  prBoost:16, drama:0.15, desc:'Music + basketball. The classic pairing.' },
  { name:'a supermodel',             fameMod:0.6,  prBoost:14, drama:0.12, desc:'Fashion week front rows. Social media gold.' },
  { name:'a pop star',               fameMod:0.75, prBoost:17, drama:0.18, desc:'Crossover fame. Tour cameos.' },
  { name:'an actress',               fameMod:0.55, prBoost:13, drama:0.14, desc:'Hollywood meets the arena.' },
  { name:'a social media mogul',     fameMod:0.5,  prBoost:12, drama:0.25, desc:'Content partnership. Drama risk.' },
  { name:'a fashion designer',       fameMod:0.45, prBoost:10, drama:0.1,  desc:'Runway appearances. Vogue features.' },
  { name:'a fellow NBA player',      fameMod:0.4,  prBoost:8,  drama:0.08, desc:'Power couple. League talk.' },
];

// ── NBA DRAMA EVENTS ──────────────────────────────────────────────
const NBA_DRAMA = [
  { msg:'You posted a cryptic tweet after the loss. The analyst class: activated.',         pubD:-8,  dark:0, type:'warn' },
  { msg:'Trade demand leaked. The front office denied it. You did not deny it.',           pubD:-12, dark:0, type:'warn' },
  { msg:'Tunnel walk fit went viral. Fashion Week called. The discourse: lengthy.',       pubD:10,  dark:0, type:'good' },
  { msg:'Beef with a teammate became a press conference issue. Coach was visibly tired.',   pubD:-14, dark:1, type:'bad'  },
  { msg:'You skipped shootaround for the third time this month.',                          pubD:-9,  dark:0, type:'bad'  },
  { msg:'You donated to youth basketball programs in five cities. Quietly. Someone noticed.',pubD:18, dark:0, type:'good' },
  { msg:'Appeared on a rap track. Verse: decent. The internet was divided.',              pubD:6,   dark:0, type:'warn' },
  { msg:'Press conference breakdown. Unexpectedly vulnerable. The clip went everywhere.',   pubD:5,   dark:0, type:'warn' },
  { msg:'Late night spotted at a club during a losing streak. ESPN had a chyron.',         pubD:-15, dark:1, type:'bad'  },
  { msg:'You showed up to practice in a $50,000 outfit. Zero apologies.',                  pubD:4,   dark:0, type:'warn' },
  { msg:'Instagram post supporting a controversial cause. Comments: chaotic.',            pubD:-6,  dark:0, type:'warn' },
  { msg:'You carried your entire hometown to a playoff game. Felt every second.',          pubD:16,  dark:0, type:'love' },
  { msg:'All-Star Game dunk attempt. It was either the best or worst thing anyone\'s seen.',pubD:8,  dark:0, type:'warn' },
  { msg:'Feature in GQ. Full shoot. Flawlessly executed.',                                 pubD:12,  dark:0, type:'good' },
];
NBA_DRAMA[2]  = { msg:'Tunnel walk fit went viral. Fashion Week called. The discourse: lengthy.',  pubD:10, dark:0, type:'good' };
NBA_DRAMA[6]  = { msg:'Appeared on a rap track. Verse: decent. The internet was divided.',        pubD:6,  dark:0, type:'warn' };

// ── CHAMPIONSHIP MOMENTS ──────────────────────────────────────────
const FINALS_MOMENTS = [
  'You hit the series-clinching shot. The arena went white with noise.',
  'The dog pile. Sixty-eight grown men acting like children. Perfect.',
  'You cried on the court. The cameras found you. You didn\'t care.',
  'The trophy felt exactly as heavy as it should.',
  'Your post-game speech made the locker room go silent.',
  'You carried your city. They knew it. You all knew it.',
  'The parade route was six miles long. You threw your wristband into the crowd.',
];

function calcNbaLegacy(n){
  const score = Math.round(
    n.championshipRings*12 + n.finalsMVPs*10 + n.mvpAwards*10 + n.allNBA*5 + n.allStarSelections*3 +
    n.scoringTitles*5 + n.tripleDoubles/10 + (n.stats.ppg||0)*0.8 + (n.stats.rpg||0)*0.4 + (n.stats.apg||0)*0.5
  );
  const tier = score>=70?'Legend':score>=45?'Hall of Fame':score>=28?'All-Time Great':score>=16?'Star':score>=8?'Solid':'Role Player';
  return { score, tier };
}

// ── NBA SEASON PASSIVE ────────────────────────────────────────────
function nbaSeasonPassive(){
  const n = G.nba;
  if(!n.active||n.retired) return;

  n.year++;
  n.careerGames += rnd(55,82);
  n.age_entered = n.age_entered||G.age;
  const prevDepth = n.depth;
  const seasonAwards = [];

  // Injury check
  const injuryChance = clamp(0.05 + (100-n.durability)/200 + (G.age>=30?0.05:0) + (n.injuryRiskBoost||0), 0.04, 0.45);
  if(Math.random()<injuryChance){
    const inj=pick(['ankle sprain','knee soreness','hamstring pull','shoulder strain','back tightness','concussion']);
    n.injured=true; n.injuryWeeks=rnd(3,14); n.injuryHistory.push(inj);
    G.health=clamp(G.health-rnd(5,14));
    addEv(`Season injury: ${inj}. Out about ${n.injuryWeeks} weeks.`,`bad`);
  }

  const depthM = depthMult(n.depth);
  const chemM  = chemMult(n.chemistry);
  const skillM = skillMult(n.skill);
  const injM   = n.injured ? 0.4 : 1;
  const perfMod = ((G.health/100)*0.55 + (G.smarts/100)*0.15 + ((n.skill||50)/100)*0.2 + rnd(0,15)/100) * depthM * chemM * skillM * injM;
  switch(n.position){
    case 'PG':
      n.seasonStats.ppg  = +(rnd(12,35)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(5,12)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(3,7)*perfMod).toFixed(1);
      n.seasonStats.spg  = +(rnd(10,25)/10*perfMod).toFixed(1);
      break;
    case 'SG':
      n.seasonStats.ppg  = +(rnd(15,38)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(3,7)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(3,6)*perfMod).toFixed(1);
      n.seasonStats.spg  = +(rnd(10,20)/10*perfMod).toFixed(1);
      break;
    case 'SF':
      n.seasonStats.ppg  = +(rnd(14,35)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(3,8)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(5,9)*perfMod).toFixed(1);
      n.seasonStats.bpg  = +(rnd(5,15)/10*perfMod).toFixed(1);
      break;
    case 'PF':
      n.seasonStats.ppg  = +(rnd(12,28)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(7,13)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(2,5)*perfMod).toFixed(1);
      n.seasonStats.bpg  = +(rnd(10,25)/10*perfMod).toFixed(1);
      break;
    case 'C':
      n.seasonStats.ppg  = +(rnd(10,26)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(8,15)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(1,4)*perfMod).toFixed(1);
      n.seasonStats.bpg  = +(rnd(15,35)/10*perfMod).toFixed(1);
      break;
    default:
      n.seasonStats.ppg  = +(rnd(8,25)*perfMod).toFixed(1);
      n.seasonStats.rpg  = +(rnd(4,9)*perfMod).toFixed(1);
      n.seasonStats.apg  = +(rnd(2,7)*perfMod).toFixed(1);
  }

  // Carry into career stats (weighted average)
  const gp = n.year;
  n.stats.ppg  = +((n.stats.ppg*(gp-1)+n.seasonStats.ppg)/gp).toFixed(1);
  n.stats.rpg  = +((n.stats.rpg*(gp-1)+(n.seasonStats.rpg||0))/gp).toFixed(1);
  n.stats.apg  = +((n.stats.apg*(gp-1)+(n.seasonStats.apg||0))/gp).toFixed(1);
  n.stats.spg  = +((n.stats.spg*(gp-1)+(n.seasonStats.spg||0))/gp).toFixed(1);
  n.stats.bpg  = +((n.stats.bpg*(gp-1)+(n.seasonStats.bpg||0))/gp).toFixed(1);

  // Triple double check
  if(n.seasonStats.ppg>=10&&(n.seasonStats.rpg||0)>=10&&(n.seasonStats.apg||0)>=10){
    n.tripleDoubles+=rnd(5,30);
    addEv(`${n.tripleDoubles} career triple-doubles. The stat line is a personality now.`,'good');
  }

  // Contract payment
  if(n.contract.perYear>0){ G.money+=n.contract.perYear; n.totalEarned+=n.contract.perYear; }

  // Sneaker + endorsement income
  const brandTotal = (n.sneakerRevenue>0?Math.floor(n.sneakerRevenue/Math.max(1,n.year)):0)+n.endorsementIncome;
  if(brandTotal>0){ G.money+=brandTotal; n.totalEarned+=brandTotal; }
  if(n.sneakerDeal&&n.year<=3) addEv(`${n.sneakerDeal} checks: ${fmt$(brandTotal)} deposited.`,'good');

  // Quality
  const quality = n.seasonStats.ppg>=28?'mvp':n.seasonStats.ppg>=22?'allstar':n.seasonStats.ppg>=15?'solid':'below';

  // Accolades
  if(quality==='mvp'){
    if(Math.random()<0.18){ n.mvpAwards++; G.sm.totalFame=clamp(G.sm.totalFame+rnd(10,18));
      seasonAwards.push('MVP');
      G.happy=clamp(G.happy+rnd(14,22));
      addEv(`NBA MVP! The unanimous conversation. The league's best player. Your jersey: every arena.`,'love');
      flash('🏆 NBA MVP!!','good'); }
    if(Math.random()<0.4){ n.allStarSelections++; G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,8));
      seasonAwards.push('All-Star');
      addEv(`All-Star selection. ${n.allStarSelections} total. The arena in February always hits differently.`,'love');
      flash(`⭐ All-Star #${n.allStarSelections}`,'good'); }
    if(Math.random()<0.25){ n.allNBA++;
      seasonAwards.push('All-NBA');
      addEv(`All-NBA Team selection. The season officially recognized.`,'love'); }
  } else if(quality==='allstar'){
    if(Math.random()<0.3){ n.allStarSelections++;
      seasonAwards.push('All-Star');
      addEv(`All-Star selection #${n.allStarSelections}. The fans voted. The coaches confirmed.`,'love');
      flash(`⭐ All-Star!`,'good'); }
  }

  // Scoring title
  if(n.seasonStats.ppg>=28&&Math.random()<0.3){ n.scoringTitles++;
    seasonAwards.push('Scoring Title');
    addEv(`Scoring champion! ${n.seasonStats.ppg} PPG led the league.`,'love');
    flash(`🏆 Scoring title! ${n.seasonStats.ppg} PPG`,'good'); }

  // DPOY
  if((['PF','C','SF'].includes(n.position))&&(n.seasonStats.bpg||0)>=2.5&&Math.random()<0.12&&!n.dopy){
    n.dopy=true; addEv(`Defensive Player of the Year! The other end finally getting its due.`,'love');
    seasonAwards.push('DPOY');
    flash('🏆 DPOY!','good'); }

  // ROY year 1
  if(n.year===2&&quality!=='below'&&Math.random()<0.28&&!n.roy){
    n.roy=true; seasonAwards.push('ROY'); addEv(`Rookie of the Year! The league knew from opening night.`,'love');
    flash('🏆 Rookie of the Year!','good'); }

  // Championship run
  if(Math.random()<0.07+n.allStarSelections*0.02){ nbaChampionshipRun(seasonAwards); }
  else {
    const statLine = nbaStat(n);
    addEv(quality==='mvp'
      ? `MVP-caliber season: ${statLine}. The league can\'t look away.`
      : quality==='allstar'
        ? `All-Star level season: ${statLine}. Consistent and dangerous.`
        : quality==='solid'
          ? `Solid season: ${statLine}. Doing the work.`
          : `Below expectations. ${statLine}. The front office is watching.`
      , quality==='mvp'?'love':quality==='below'?'bad':'good');
  }

  // Contract
  n.contract.years=Math.max(0,n.contract.years-1);
  if(n.contract.years===0&&!n.retired){
    n.freeAgent=true;
    addEv(`Contract expired. Free agent. Every front office in the league is calling your agent.`,'warn');
    flash('🆓 Free Agent!','warn');
  }

  // Injury recovery
  if(n.injured){
    n.injuryWeeks = Math.max(0, n.injuryWeeks-16);
    if(n.injuryWeeks===0){ n.injured=false; addEv('Cleared from injury. Back to full strength.','good'); }
  }
  n.injuryRiskBoost = 0;

  // Age concerns
  if(G.age>=32&&Math.random()<0.1){ G.health=clamp(G.health-rnd(3,7));
    addEv(`Load management conversation started. Your body at ${G.age} needs more recovery time.`,'warn'); }
  if(G.age>=37&&Math.random()<0.25){
    addEv(`Father Time is undefeated. The retirement conversation is no longer theoretical.`,'warn'); }

  // Drama
  if(Math.random()<0.22) nbaDramaEvent();

  // Passive social media growth from NBA fame
  n.socialMediaPresence=Math.min(100,n.socialMediaPresence+rnd(0,3));
  if(n.socialMediaPresence>60&&Math.random()<0.1){
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(1,3));
  }

  // Roster competition update
  const roleScore = (n.seasonStats.ppg||0)*2 + (n.skill||50)*0.4 + n.chemistry*0.2 + rnd(-10,10) + (n.injured?-18:0);
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
    statLine:nbaStat(n),
  });
  if(n.seasonHistory.length>30) n.seasonHistory.pop();

  updateHUD();
}

function nbaStat(n){
  const s = n.seasonStats;
  return `${s.ppg} PPG · ${s.rpg||0} RPG · ${s.apg||0} APG`;
}

function nbaChampionshipRun(seasonAwards){
  const n = G.nba;
  const wins = Math.random()<(0.25+n.allStarSelections*0.04+n.allNBA*0.06);
  if(wins){
    n.championshipRings++;
    if(Array.isArray(seasonAwards)) seasonAwards.push('Champion');
    G.happy=clamp(G.happy+rnd(24,32));
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(14,24));
    n.publicImage=Math.min(100,n.publicImage+rnd(15,22));
    const isFMVP=Math.random()<0.32;
    if(isFMVP){ n.finalsMVPs++; n.finalsLegend=true; }
    if(isFMVP&&Array.isArray(seasonAwards)) seasonAwards.push('Finals MVP');
    const moment=pick(FINALS_MOMENTS);
    addEv(`NBA CHAMPION with the ${n.team}! ${isFMVP?'Finals MVP! ':''}Ring #${n.championshipRings}. ${moment}`,'love');
    flash(`🏆 NBA CHAMP! ${isFMVP?'+ Finals MVP!':''}  Ring #${n.championshipRings}`,'good');
    if(n.contract.years<=1) nbaSignContract(true);
  } else {
    G.happy=clamp(G.happy-rnd(8,15));
    addEv(`NBA Finals. You made the run. Lost in six. The silence in the locker room after game six.`,'bad');
    flash('Finals loss. The silence.','bad');
  }
}

function nbaDramaEvent(){
  const n=G.nba;
  const ev=pick(NBA_DRAMA);
  n.publicImage=Math.max(5,Math.min(100,n.publicImage+ev.pubD));
  if(ev.dark) G.darkScore+=ev.dark;
  G.happy=clamp(G.happy+(ev.pubD>0?rnd(3,8):rnd(-4,0)));
  addEv(ev.msg,ev.type);
}

function nbaSignContract(postChamp=false){
  const n=G.nba;
  const isSupermax=n.allStarSelections>=3||n.mvpAwards>=1||n.championshipRings>=1;
  const base=postChamp?1.35:1;
  const skillTier = n.skill>=80?1.25:n.skill>=65?1.1:n.skill>=50?1.0:0.9;
  const tierMod=(isSupermax?2.2:n.allStarSelections>0?1.5:1.0)*skillTier;
  let perYear=Math.floor(rnd(1200000,40000000)*base*tierMod);
  const years=rnd(1,5);
  let total=perYear*years;
  let guar=Math.floor(total*rnd(70,100)/100);
  if(n.agentFocus==='money'){ perYear=Math.floor(perYear*1.15); total=perYear*years; guar=Math.floor(guar*1.1); }
  if(n.agentFocus==='rings'){ perYear=Math.floor(perYear*0.9); total=perYear*years; n.publicImage=Math.min(100,n.publicImage+rnd(2,6)); }
  if(n.agentFocus==='market'){ n.endorsementIncome+=rnd(200000,1000000); n.publicImage=Math.min(100,n.publicImage+rnd(3,7)); }
  n.contract={years,totalValue:total,guaranteed:guar,perYear};
  n.freeAgent=false;
  if(isSupermax){ n.maxContract=true;
    addEv(`SUPERMAX contract: ${years}yr / ${fmt$(total)} · ${fmt$(guar)} guaranteed. You earned every zero.`,'love');
    flash(`💰 SUPERMAX! ${fmt$(total)}`,'good');
  } else {
    addEv(`New contract: ${years}yr / ${fmt$(total)} · ${fmt$(perYear)}/yr.`,'love');
    flash(`💰 New NBA contract: ${fmt$(total)}`,'good');
  }
}

// ── RENDER NBA ────────────────────────────────────────────────────
function renderNBA(){
  const nc=document.getElementById('nba-content');
  const n=G.nba;
  const u=G.school.uni;

  if(!n.active&&!n.retired){
    const eligible=u.nbaNextStep||(u.draftDeclared&&u.sport==='basketball');
    if(!eligible){
      nc.innerHTML=`<div class="notif warn"><strong>NBA Draft</strong> — Declare for the draft from the School tab after college basketball. Play hard enough to get noticed.</div>`;
      return;
    }
    nc.innerHTML=nbaDraftEntryScreen(u); return;
  }
  if(n.retired){ nc.innerHTML=nbaRetirementScreen(n); return; }
  nc.innerHTML=nbaActiveScreen(n);
}

function nbaDraftEntryScreen(u){
  const round=u.draftRound||2; const pick_=u.draftPick||30;
  const team=u.draftTeam||pick(NBA_ALL_TEAMS);
  const salary=round===1&&pick_<=5?rnd(8000000,14000000):round===1?rnd(3000000,8000000):rnd(1700000,3000000);
  const isLottery=round===1&&pick_<=14;
  const isTop5=pick_<=5;
  return `
  <div class="card" style="border-color:rgba(94,234,212,.3);text-align:center;padding:28px 20px">
    <div style="font-size:3rem;margin-bottom:10px">🏀</div>
    <div style="font-family:var(--fh);font-weight:800;font-size:1.6rem;margin-bottom:6px">NBA Draft Night</div>
    <div style="color:var(--muted2);font-size:.9rem;margin-bottom:20px">Barclays Center. Your name is about to be called.</div>
    <div style="background:var(--surface2);border-radius:var(--r);padding:16px;margin-bottom:20px">
      <div style="font-size:.7rem;color:var(--muted2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Selected</div>
      <div style="font-family:var(--fh);font-weight:800;font-size:1.6rem;color:${isTop5?'var(--gold)':isLottery?'var(--accent)':'var(--text)'}">
        ${isTop5?'TOP 5 PICK — ':isLottery?'LOTTERY PICK — ':''}Round ${round}, Pick ${pick_}
      </div>
      <div style="font-size:1.1rem;margin-top:6px">${team}</div>
      <div style="font-size:.8rem;color:var(--muted2);margin-top:6px">
        ${isTop5?'Franchise cornerstone. The city is already making jerseys.':isLottery?'Lottery money. All eyes on you.':round===1?'First round security. Earn your minutes.':'Second round. Prove them wrong.'}
      </div>
    </div>
    <div style="font-family:var(--fh);font-weight:700;font-size:.9rem;color:var(--gold);margin-bottom:16px">Rookie deal: ~${fmt$(salary)}/yr</div>
    <button class="btn btn-primary btn-lg btn-block" onclick="nbaEnterLeague('${team}','${u.position||'SG'}',${round},${pick_},${salary})">
      Sign Rookie Contract →
    </button>
  </div>`;
}

function nbaEnterLeague(team,pos,round,draftPick,salary){
  const n=G.nba;
  n.active=true; n.team=team;
  n.position=pos||'SG';
  n.jerseyNumber=pick([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,30,31,32,33,34,35]);
  n.age_entered=G.age;
  n.depth=round===1&&draftPick<=14?'starter':round===1?'rotation':'bench';
  n.skill=clamp(45+rnd(0,12)+(round===1?10:0));
  n.chemistry=clamp(45+rnd(0,15));
  const isLottery=round===1&&draftPick<=14;
  const years=isLottery?4:round===1?3:2;
  n.contract={years,totalValue:salary*years,guaranteed:salary*years,perYear:salary};
  G.money+=salary; n.totalEarned+=salary;
  G.sm.totalFame=clamp(G.sm.totalFame+rnd(10,22));
  n.publicImage=60+rnd(0,20);
  n.socialMediaPresence=50+rnd(0,20);
  // Two-way if late pick
  if(round===2&&draftPick>40){ n.twoWay=true;
    addEv(`Two-way contract with the ${team}. G-League and NBA. You\'re proving something.`,'good');
  } else {
    addEv(`${team} pick #${draftPick}. #${n.jerseyNumber}. ${n.position}. ${fmt$(salary)}/yr. The dream is real.`,'love');
  }
  flash(`🏀 Welcome to the NBA! ${team}`,'good');
  updateHUD(); renderNBA();
}

function nbaActiveScreen(n){
  const pos=NBA_POSITIONS[n.position]||{label:n.position,icon:'🏀'};
  const imgColor=n.publicImage>=70?'var(--success)':n.publicImage>=45?'var(--gold)':'var(--danger)';
  const statLine=nbaStat(n);
  const history=n.seasonHistory||[];

  return `
  <!-- Header -->
  <div class="card" style="border-color:rgba(94,234,212,.25)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-family:var(--fh);font-weight:800;font-size:1.5rem">${G.firstname} ${G.lastname}</div>
        <div style="font-size:.8rem;color:var(--muted2);margin-top:2px">${pos.icon} ${pos.label} · ${n.team} · #${n.jerseyNumber} · Year ${n.year-1}</div>
        ${n.freeAgent?'<span class="badge badge-gold" style="margin-top:4px">🆓 Free Agent</span>':''}
        ${n.maxContract?'<span class="badge badge-gold" style="margin-top:4px">💰 Max Contract</span>':''}
        ${n.twoWay?'<span class="badge badge-danger" style="margin-top:4px">Two-Way</span>':''}
        ${n.g_league?'<span class="badge badge-danger" style="margin-top:4px">G-League</span>':''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${n.championshipRings?`<div style="color:var(--gold);font-family:var(--fh);font-weight:800">🏆×${n.championshipRings}</div>`:''}
        ${n.allStarSelections?`<div style="font-size:.72rem;color:var(--muted2)">${n.allStarSelections}× All-Star</div>`:''}
        ${n.mvpAwards?`<div style="font-size:.72rem;color:var(--gold)">${n.mvpAwards}× MVP</div>`:''}
        ${n.scoringTitles?`<div style="font-size:.72rem;color:var(--accent)">🏀 ${n.scoringTitles}× Scoring Champ</div>`:''}
      </div>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.contract.perYear)}</div><div class="sm-stat-lbl">Per Year</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.contract.years}yr</div><div class="sm-stat-lbl">Left</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:${imgColor}">${n.publicImage}</div><div class="sm-stat-lbl">Public Image</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${depthLabel(n.depth)}</div><div class="sm-stat-lbl">Role</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.chemistry}</div><div class="sm-stat-lbl">Chemistry</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.durability}</div><div class="sm-stat-lbl">Durability</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.skill}</div><div class="sm-stat-lbl">Skill</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.totalEarned)}</div><div class="sm-stat-lbl">Career Earned</div></div>
    </div>
    <div style="font-size:.78rem;color:var(--muted2)">Season avg: ${statLine}</div>
    <div style="font-size:.76rem;color:var(--muted2);margin-top:2px">Career: ${n.stats.ppg} PPG · ${n.stats.rpg} RPG · ${n.stats.apg} APG · ${n.careerGames} GP</div>
    ${n.injured?`<div class="badge badge-danger" style="margin-top:6px">🩹 Injured (${n.injuryWeeks} weeks)</div>`:''}
    <div style="font-size:.72rem;color:var(--muted2);margin-top:4px">Agent focus: ${agentFocusLabel(n.agentFocus)}</div>
    ${n.sneakerDeal?`<div style="margin-top:6px"><span class="badge badge-accent">👟 ${n.sneakerDeal}</span></div>`:''}
    ${n.endorsements.length?`<div style="margin-top:5px;display:flex;gap:5px;flex-wrap:wrap">${n.endorsements.map(e=>`<span class="badge badge-accent">${e}</span>`).join('')}</div>`:''}
    ${n.partner?`<div style="font-size:.76rem;color:var(--accent3);margin-top:6px">💑 With ${n.partner.name}</div>`:''}
    ${n.brand?`<div style="font-size:.76rem;color:var(--accent2);margin-top:4px">🏷️ ${n.brand}</div>`:''}
    ${n.foundation?`<div style="font-size:.76rem;color:var(--success);margin-top:4px">❤️ ${n.foundation}</div>`:''}
  </div>

  <!-- On court -->
  <div class="card"><div class="card-title">On the Court</div>
    <div class="choice-grid">
      <div class="choice" onclick="nbaAct('train')"><div class="choice-icon">💪</div><div class="choice-name">Offseason Training</div><div class="choice-desc">+Health +Performance</div></div>
      <div class="choice" onclick="nbaAct('film')"><div class="choice-icon">📹</div><div class="choice-name">Film Study</div><div class="choice-desc">+Smarts +IQ</div></div>
      <div class="choice" onclick="nbaAct('skill_focus')"><div class="choice-icon">🎯</div><div class="choice-name">Position Focus</div><div class="choice-desc">Sharpen your specific role</div></div>
      <div class="choice" onclick="nbaAct('skills')"><div class="choice-icon">🎯</div><div class="choice-name">Skills Trainer</div><div class="choice-desc">+Specific skill improvement</div></div>
      <div class="choice" onclick="nbaAct('load_manage')"><div class="choice-icon">🛌</div><div class="choice-name">Load Management</div><div class="choice-desc">Rest. Miss a game. Stay healthy.</div></div>
      <div class="choice" onclick="nbaAct('team_bond')"><div class="choice-icon">🧩</div><div class="choice-name">Team Chemistry</div><div class="choice-desc">Build trust and timing</div></div>
      <div class="choice" onclick="nbaAct('rehab_plan')"><div class="choice-icon">🏥</div><div class="choice-name">Rehab Plan</div><div class="choice-desc">Structured recovery path</div></div>
      <div class="choice" onclick="nbaAct('play_hurt')"><div class="choice-icon">😤</div><div class="choice-name">Play Through Pain</div><div class="choice-desc">High risk. Big reward.</div></div>
      <div class="choice" onclick="nbaAct('workout')"><div class="choice-icon">🏋️</div><div class="choice-name">Body Transformation</div><div class="choice-desc">+Health +Looks</div></div>
    </div>
  </div>

  <!-- Team & Contract -->
  <div class="card"><div class="card-title">Team & Business</div>
    <div class="choice-grid">
      ${n.freeAgent?`<div class="choice" onclick="nbaAct('sign')"><div class="choice-icon">✍️</div><div class="choice-name">Sign Contract</div><div class="choice-desc">Evaluate your market</div></div>`:''}
      ${!n.freeAgent?`<div class="choice" onclick="nbaAct('extension')"><div class="choice-icon">📋</div><div class="choice-name">Request Extension</div><div class="choice-desc">Lock in your future</div></div>`:''}
      <div class="choice" onclick="nbaAct('agent_focus')"><div class="choice-icon">🧑‍💼</div><div class="choice-name">Agent Strategy</div><div class="choice-desc">Set negotiation priority</div></div>
      <div class="choice" onclick="nbaAct('role_request')"><div class="choice-icon">📈</div><div class="choice-name">Role Discussion</div><div class="choice-desc">Ask for a bigger role</div></div>
      <div class="choice" onclick="nbaAct('trade_demand')"><div class="choice-icon">🚪</div><div class="choice-name">Request Trade</div><div class="choice-desc">Force a move</div></div>
      <div class="choice" onclick="nbaAct('player_empowerment')"><div class="choice-icon">💬</div><div class="choice-name">Player Empowerment</div><div class="choice-desc">Publicly shape your future</div></div>
      <div class="choice" onclick="nbaAct('super_team')"><div class="choice-icon">🤝</div><div class="choice-name">Build a Super Team</div><div class="choice-desc">Recruit another star to join</div></div>
      <div class="choice" onclick="nbaAct('mentor')"><div class="choice-icon">🧑‍🏫</div><div class="choice-name">Mentor Young Players</div><div class="choice-desc">+Legacy +Public image</div></div>
      <div class="choice" onclick="nbaAct('retire')"><div class="choice-icon">👋</div><div class="choice-name">Retire</div><div class="choice-desc">Go out on top. Or don\'t.</div></div>
    </div>
  </div>

  <!-- Sneakers -->
  <div class="card"><div class="card-title">👟 Sneaker Deal</div>
    ${n.sneakerDeal
      ? `<div style="margin-bottom:10px">
           <div style="font-family:var(--fh);font-weight:700">${n.sneakerDeal}</div>
           <div style="font-size:.76rem;color:var(--muted2)">Revenue: ${fmt$(n.sneakerRevenue)} lifetime</div>
         </div>
         <div class="choice-grid">
           <div class="choice" onclick="nbaAct('sneaker_collab')"><div class="choice-icon">🎨</div><div class="choice-name">Design New Colorway</div><div class="choice-desc">Limited drop. Social media event.</div></div>
           <div class="choice" onclick="nbaAct('sneaker_release')"><div class="choice-icon">🚀</div><div class="choice-name">Signature Release</div><div class="choice-desc">Major drop. Revenue spike.</div></div>
         </div>`
      : `<p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">No sneaker deal yet. Build your profile.</p>
         <div class="choice-grid">
           ${NBA_SNEAKERS.filter(s=>G.sm.totalFame>=s.min&&s.name!==n.sneakerDeal).slice(0,6).map(s=>`
             <div class="choice${G.sm.totalFame<s.min?' disabled':''}" onclick="nbaSneakerDeal('${s.brand.replace(/'/g,"\\'")}')">
               <div class="choice-icon">👟</div>
               <div class="choice-name">${s.brand}</div>
               <div class="choice-desc">${s.desc}</div>
               <div style="font-size:.66rem;color:var(--gold);margin-top:3px">${fmt$(s.base[0])}–${fmt$(s.base[1])}</div>
             </div>`).join('')}
         </div>`}
  </div>

  <!-- Endorsements -->
  <div class="card"><div class="card-title">Endorsements & Brand</div>
    ${n.endorsements.length?`<div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">Active: ${n.endorsements.join(', ')}<br>Annual: ${fmt$(n.endorsementIncome)}</div>`:''}
    <div class="choice-grid">
      ${NBA_ENDORSEMENTS.filter(e=>G.sm.totalFame>=e.min&&!n.endorsements.includes(e.name)).slice(0,4).map(e=>`
        <div class="choice" onclick="nbaEndorse('${e.name.replace(/'/g,"\\'")}')">
          <div class="choice-icon">💼</div><div class="choice-name">${e.name}</div>
          <div class="choice-desc">${e.desc}</div>
          <div style="font-size:.66rem;color:var(--gold);margin-top:3px">${fmt$(e.value[0])}–${fmt$(e.value[1])}/yr</div>
        </div>`).join('')}
      ${!n.brand?`<div class="choice" onclick="nbaAct('brand')"><div class="choice-icon">🏷️</div><div class="choice-name">Launch Brand</div><div class="choice-desc">Clothing, lifestyle, media company</div></div>`:''}
      ${!n.foundation?`<div class="choice" onclick="nbaAct('foundation')"><div class="choice-icon">❤️</div><div class="choice-name">Start Foundation</div><div class="choice-desc">LeBron energy. Give back.</div></div>`:''}
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

  <!-- Celeb life -->
  <div class="card"><div class="card-title">Celebrity Life</div>
    <div class="choice-grid">
      ${!n.partner?`<div class="choice" onclick="nbaAct('date_celeb')"><div class="choice-icon">💑</div><div class="choice-name">Date a Celebrity</div><div class="choice-desc">NBA + music/entertainment. Culture.</div></div>`:''}
      ${n.partner?`<div class="choice" onclick="nbaAct('relationship')"><div class="choice-icon">💖</div><div class="choice-name">Relationship Events</div><div class="choice-desc">Red carpets. Paparazzi. Drama.</div></div>`:''}
      <div class="choice" onclick="nbaAct('tunnel_walk')"><div class="choice-icon">👗</div><div class="choice-name">Tunnel Walk Fit</div><div class="choice-desc">Fashion Week energy. Pre-game ritual.</div></div>
      <div class="choice" onclick="nbaAct('all_star_weekend')"><div class="choice-icon">⭐</div><div class="choice-name">All-Star Weekend</div><div class="choice-desc">The league\'s biggest social event.</div></div>
      <div class="choice" onclick="nbaAct('music_collab')"><div class="choice-icon">🎵</div><div class="choice-name">Music Collab</div><div class="choice-desc">Feature on a track. Basketball + rap.</div></div>
      <div class="choice" onclick="nbaAct('press')"><div class="choice-icon">🎙️</div><div class="choice-name">Press Conference</div><div class="choice-desc">Shape the narrative.</div></div>
      <div class="choice" onclick="nbaAct('buy_car')"><div class="choice-icon">🚗</div><div class="choice-name">Buy a Supercar</div><div class="choice-desc">$600K · tunnel walk prop.</div></div>
      <div class="choice" onclick="nbaAct('buy_house')"><div class="choice-icon">🏡</div><div class="choice-name">Buy a Mansion</div><div class="choice-desc">$8M · compound goals.</div></div>
      <div class="choice" onclick="nbaAct('charity')"><div class="choice-icon">🤝</div><div class="choice-name">Charity Appearance</div><div class="choice-desc">+Legacy +Public image.</div></div>
      <div class="choice" onclick="nbaAct('invest')"><div class="choice-icon">📈</div><div class="choice-name">Business Investment</div><div class="choice-desc">Maverick Carter strategy.</div></div>
    </div>
  </div>`;
}

function nbaAct(type){
  const n=G.nba;
  if(type==='train'){
    showPopup('🏀 Training Camp Focus',
      'Pick your camp emphasis.',
      [
        { label:'Shooting volume', action:()=>{ n.skill=clamp(n.skill+rnd(4,8)); n.publicImage=Math.min(100,n.publicImage+rnd(2,5));
          addEv('Training camp was a shot lab. Rhythm looks automatic.','good'); renderNBA(); } },
        { label:'Handle & creation', action:()=>{ n.skill=clamp(n.skill+rnd(3,7)); G.smarts=clamp(G.smarts+rnd(2,4));
          addEv('Handle-focused camp. You get to your spots easier now.','good'); renderNBA(); } },
        { label:'Defense & conditioning', action:()=>{ G.health=clamp(G.health+rnd(4,8)); n.durability=clamp(n.durability+rnd(3,7));
          addEv('Defense and conditioning. You stay in front of anyone.','good'); renderNBA(); } },
        { label:'Leadership reps', action:()=>{ n.chemistry=clamp(n.chemistry+rnd(5,10)); n.publicImage=Math.min(100,n.publicImage+rnd(3,6));
          addEv('You ran the group all camp. Coaches trust you with the huddle.','good'); renderNBA(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='film'){
    G.smarts=clamp(G.smarts+rnd(2,6)); n.skill=clamp(n.skill+rnd(1,4)); n.chemistry=clamp(n.chemistry+rnd(2,4));
    addEv(`Film session. You catalogued every tendency of your next matchup. You saw something nobody else saw.`,'good');
    flash(`+Smarts · film 📹`,'good');
  } else if(type==='skill_focus'){
    const pos = NBA_POSITIONS[n.position]||{label:n.position,icon:'🏀'};
    showPopup(`🎯 ${pos.label} Focus`,
      `Pick your focus this offseason.`,
      [
        { label:'Shot creation', action:()=>{ n.skill=clamp(n.skill+rnd(4,8)); addEv('Shot creation work. The footwork looks surgical now.','good'); renderNBA(); } },
        { label:'Playmaking & IQ', action:()=>{ G.smarts=clamp(G.smarts+rnd(3,6)); n.skill=clamp(n.skill+rnd(2,5)); n.chemistry=clamp(n.chemistry+rnd(2,5));
          addEv('Playmaking reps. You read the floor a half-second faster.','good'); renderNBA(); } },
        { label:'Defense & conditioning', action:()=>{ G.health=clamp(G.health+rnd(3,7)); n.skill=clamp(n.skill+rnd(2,5)); n.durability=clamp(n.durability+rnd(2,5));
          addEv('Defense focus. Legs feel stronger, rotations are sharper.','good'); renderNBA(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='skills'){
    G.health=clamp(G.health+rnd(2,5)); G.smarts=clamp(G.smarts+rnd(1,3)); n.skill=clamp(n.skill+rnd(2,5));
    const skills=['post moves','three-point shot','ball handling','defensive footwork','mid-range game'];
    addEv(`Skills trainer. ${pick(skills)} specifically. The work: surgical.`,'good');
    flash(`Skills work done 🎯`,'good');
  } else if(type==='load_manage'){
    G.health=clamp(G.health+rnd(6,14)); n.durability=clamp(n.durability+rnd(3,6));
    n.publicImage=Math.max(20,n.publicImage-rnd(3,7));
    addEv(`Load management. Missed the game. Felt great for the next one. Media had opinions. They always do.`,'warn');
    flash(`+Health · load managed 🛌`,'good');
  } else if(type==='rehab_plan'){
    showPopup('🏥 Rehab Plan',
      n.injured?'You\'re currently injured. Choose your rehab path.':'You\'re healthy, but preventative rehab helps.',
      [
        { label:'Aggressive rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(2,6)); n.durability=clamp(n.durability-rnd(1,4)); }
          else { n.durability=clamp(n.durability+rnd(1,3)); }
          addEv('Aggressive rehab. Faster return, more wear risk.','warn'); renderNBA();
        }},
        { label:'Balanced rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(2,4)); }
          n.durability=clamp(n.durability+rnd(2,5)); n.chemistry=clamp(n.chemistry+rnd(1,3));
          addEv('Balanced rehab. Staff approved.','good'); renderNBA();
        }},
        { label:'Conservative rehab', action:()=>{ 
          if(n.injured){ n.injuryWeeks=Math.max(0,n.injuryWeeks-rnd(1,3)); }
          n.durability=clamp(n.durability+rnd(4,8)); G.health=clamp(G.health+rnd(2,5));
          addEv('Conservative rehab. Slower return, stronger long-term body.','good'); renderNBA();
        }},
      ],
      'dark'
    );
    return;
  } else if(type==='team_bond'){
    n.chemistry=clamp(n.chemistry+rnd(6,12)); n.publicImage=Math.min(100,n.publicImage+rnd(2,5));
    addEv('Extra reps with the unit. Timing got smoother. The locker room trusts you more.','good');
    flash('🧩 Chemistry up','good');
  } else if(type==='play_hurt'){
    if(Math.random()<0.35){
      const inj=pick(['knee strain','ankle sprain','hamstring pull','thumb fracture','calf tightness']);
      n.injuryHistory.push(inj); n.injured=true; n.injuryWeeks=rnd(3,8); G.health=clamp(G.health-rnd(14,28));
      addEv(`Played through it and it became ${inj}. Out 3-6 weeks. Load management discourse: vindicated.`,'bad');
      flash(`Injury: ${inj}`,'bad');
    } else {
      n.injuryRiskBoost=clamp((n.injuryRiskBoost||0)+0.1,0,0.35);
      G.happy=clamp(G.happy+rnd(8,15)); n.publicImage=Math.min(100,n.publicImage+rnd(4,8));
      addEv(`Played through the pain. Dropped 34 anyway. The tape does not lie.`,'love');
      flash(`Played through it! 34-point game!`,'good');
    }
  } else if(type==='workout'){
    G.health=clamp(G.health+rnd(4,10)); G.looks=clamp(G.looks+rnd(2,5)); n.durability=clamp(n.durability+rnd(2,5));
    addEv(`Body transformation. Posted the before/after. The internet responded.`,'good');
    flash(`+Health +Looks 🏋️`,'good');
  } else if(type==='agent_focus'){
    showPopup('🧑‍💼 Agent Strategy',
      'Choose what your agent prioritizes in negotiations.',
      [
        { label:'Max money', action:()=>{ n.agentFocus='money'; addEv('Agent focus set: money.','good'); renderNBA(); } },
        { label:'Championship chase', action:()=>{ n.agentFocus='rings'; addEv('Agent focus set: rings.','good'); renderNBA(); } },
        { label:'Market & brand', action:()=>{ n.agentFocus='market'; addEv('Agent focus set: market.','good'); renderNBA(); } },
        { label:'Balanced', action:()=>{ n.agentFocus='balanced'; addEv('Agent focus set: balanced.','good'); renderNBA(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='role_request'){
    showPopup('📈 Role Discussion',
      'Talk to the coaching staff about your role.',
      [
        { label:'Push for starter', action:()=>{ n.depth='starter'; n.chemistry=clamp(n.chemistry+rnd(-6,6));
          addEv('You pushed for a starting role. The minutes are yours to keep.','warn'); renderNBA(); } },
        { label:'Accept rotation', action:()=>{ n.depth='rotation'; n.chemistry=clamp(n.chemistry+rnd(2,6));
          addEv('You embraced a rotation role. Coaches trust you in big moments.','good'); renderNBA(); } },
        { label:'Stay patient', action:()=>{ n.depth='bench'; n.chemistry=clamp(n.chemistry+rnd(1,4)); G.happy=clamp(G.happy+rnd(2,5));
          addEv('You stayed patient. Opportunity will come.','good'); renderNBA(); } },
      ],
      'dark'
    );
    return;
  } else if(type==='sign'){
    nbaSignContract();
  } else if(type==='extension'){
    if(n.contract.years>1){ flash('More than 1 year left','warn'); return; }
    nbaSignContract();
  } else if(type==='trade_demand'){
    const newTeam=pick(NBA_ALL_TEAMS.filter(t=>t!==n.team));
    n.prevTeams.push(n.team); n.team=newTeam;
    n.publicImage=Math.max(20,n.publicImage-rnd(8,15));
    n.chemistry=clamp(n.chemistry-rnd(6,12)); n.depth='rotation';
    addEv(`Trade demand granted. ${newTeam}. The front office publicly called it "a mutual decision." It was not.`,'warn');
    flash(`Traded to ${newTeam}`,'warn');
  } else if(type==='player_empowerment'){
    n.publicImage=Math.max(20,n.publicImage+(Math.random()>0.5?rnd(5,12):rnd(-10,-4)));
    addEv(`Public statement about your future. Half the league agreed. Front office: alarmed.`,'warn');
    flash(`Player empowerment moment 💬`,'warn');
  } else if(type==='super_team'){
    if(G.sm.totalFame<40){ flash('Need 40 fame to attract stars','warn'); return; }
    n.publicImage=Math.max(20,n.publicImage+(Math.random()>0.4?rnd(5,10):rnd(-8,-2)));
    addEv(Math.random()>0.5
      ? `A fellow star confirmed they\'re joining ${n.team} in free agency. The league is reacting.`
      : `Your recruiting pitch was rejected. They chose another market. The press found out.`,'warn');
    flash(`Super team move: results pending 🤝`,'warn');
  } else if(type==='mentor'){
    n.publicImage=Math.min(100,n.publicImage+rnd(5,10));
    addEv(`You mentored younger players. No cameras. Leaked anyway. League: impressed.`,'good');
    flash(`+Public Image · mentored rookies 🧑‍🏫`,'good');
  } else if(type==='retire'){
    n.retired=true; G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,10));
    addEv(`Retirement announced. ${n.championshipRings>0?n.championshipRings+'× champion. ':''}${n.allStarSelections}× All-Star. The tribute videos: immaculate.`,'love');
    flash(`🏀 Retired from the NBA.`,'good');
  } else if(type==='brand'){
    n.brand=G.firstname+' Inc.';
    n.endorsementIncome+=rnd(500000,5000000);
    addEv(`You launched ${n.brand}. Media company, clothing line, production house. The full empire.`,'love');
    flash(`🏷️ ${n.brand} launched!`,'good');
  } else if(type==='foundation'){
    n.foundation='The '+G.lastname+' Foundation';
    n.publicImage=Math.min(100,n.publicImage+rnd(8,15));
    addEv(`${n.foundation} launched. Education + youth sports. The press: universally good.`,'love');
    flash(`❤️ ${n.foundation} launched!`,'good');
  } else if(type==='date_celeb'){
    const gf=pick(NBA_CELEB_PARTNERS);
    n.partner={name:gf.name,drama:gf.drama};
    G.sm.totalFame=clamp(G.sm.totalFame+Math.floor(rnd(5,12)*gf.fameMod));
    n.publicImage=Math.min(100,n.publicImage+gf.prBoost);
    addEv(`You and ${gf.name} went public at a ${pick(['Knicks game','music video shoot','Met Gala','NBA Awards','charity gala'])}. Every outlet: coverage.`,'love');
    flash(`💑 Dating ${gf.name}!`,'good');
  } else if(type==='relationship'){
    if(!n.partner) return;
    if(Math.random()<n.partner.drama){
      n.publicImage=Math.max(20,n.publicImage-rnd(8,18)); G.darkScore++;
      addEv(`Drama with ${n.partner.name}. TMZ had it before either of you could respond. The discourse: weeks-long.`,'bad');
      flash(`Drama with ${n.partner.name}`,'bad');
      if(Math.random()<0.25){ n.partner=null; addEv('You and them split. Publicly. The internet had takes for days.','warn'); }
    } else {
      G.happy=clamp(G.happy+rnd(6,12)); n.publicImage=Math.min(100,n.publicImage+rnd(4,8));
      addEv(`${pick(['Court-side together','Met Gala appearance','Vogue feature','Concert together'])} with ${n.partner.name}. Flawless coverage.`,'love');
      flash(`+Image 📸`,'good');
    }
  } else if(type==='tunnel_walk'){
    n.publicImage=Math.min(100,n.publicImage+rnd(5,12));
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(1,3));
    const fits=['Off-White x Nike collab','full Prada suit','Louis Vuitton carry-all','vintage Versace','custom Amiri'];
    addEv(`Tunnel walk: ${pick(fits)}. The Fashion Instagram pages lost it. Pre-game ritual: iconic.`,'love');
    flash(`Tunnel walk! +Image 👗`,'good');
  } else if(type==='all_star_weekend'){
    G.happy=clamp(G.happy+rnd(12,20)); G.sm.totalFame=clamp(G.sm.totalFame+rnd(3,8));
    n.publicImage=Math.min(100,n.publicImage+rnd(6,12));
    const events=['dunk contest appearance','three-point contest runner-up','celebrity game cameo','the All-Star party','the Skills Challenge'];
    addEv(`All-Star Weekend. ${pick(events)}. The league\'s biggest entertainment weekend and you were everywhere.`,'love');
    flash(`All-Star Weekend! +Fame +Image ⭐`,'good');
  } else if(type==='music_collab'){
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(2,6));
    G.sm.music&&G.sm.music.active ? G.sm.music.streams+=rnd(100000,800000) : null;
    addEv(Math.random()>0.4
      ? `You appeared on a track with a major artist. The verse: competent. The placement: huge.`
      : `You recorded something. The track dropped. Your verse went viral for the right reasons.`,'good');
    flash(`Music collab! +Fame 🎵`,'good');
  } else if(type==='press'){
    if(Math.random()>0.3){
      n.publicImage=Math.min(100,n.publicImage+rnd(5,12));
      addEv(`Press conference. Sharp, direct, and funny. The clips: distributed everywhere. You won.`,'good');
      flash(`Press nailed! +Image 🎙️`,'good');
    } else {
      n.publicImage=Math.max(20,n.publicImage-rnd(6,14));
      addEv(`Press conference. One line went viral in the worst way. Meme by the following morning.`,'bad');
      flash(`Press slip 😬`,'bad');
    }
  } else if(type==='buy_car'){
    if(G.money<600000){ flash('Need $600K','bad'); return; }
    G.money-=600000; G.happy=clamp(G.happy+rnd(9,15));
    addEv(`New ${pick(['Rolls-Royce Cullinan','Lamborghini Urus','Ferrari 488','Bentley Bentayga','custom Maybach'])}. Arrived in it for shootaround. Security cleared it immediately.`,'love');
    flash(`🚗 New car! $600K.`,'good');
  } else if(type==='buy_house'){
    if(G.money<8000000){ flash('Need $8M','bad'); return; }
    G.money-=8000000; G.happy=clamp(G.happy+rnd(12,20)); G.assets.home=true; G.assets.homeValue=8000000;
    addEv(`${pick(['Beverly Hills','Miami Beach','Manhattan penthouse','Houston estate','Bel Air'])} property acquired. Court in the backyard. Pool house for the crew.`,'love');
    flash(`🏡 Mansion! $8M.`,'good');
  } else if(type==='charity'){
    n.publicImage=Math.min(100,n.publicImage+rnd(7,14));
    addEv(`Charity event. You stayed three hours past the scheduled time. A kid you talked to posted about it. Millions saw.`,'love');
    flash(`+Public Image ❤️`,'good');
  } else if(type==='invest'){
    const amt=rnd(500000,5000000);
    if(G.money<amt){ flash(`Need ${fmt$(amt)} to invest`,'warn'); return; }
    G.money-=amt;
    const returns=Math.random()>0.4;
    if(returns){
      const profit=Math.floor(amt*rnd(120,300)/100);
      G.money+=profit; addEv(`Business investment paid off. ${fmt$(amt)} → ${fmt$(profit)}. Maverick Carter strategy: working.`,'love');
      flash(`+${fmt$(profit-amt)} return! 📈`,'good');
    } else {
      addEv(`Business investment: too early to tell. The company is pivoting. Again.`,'warn');
      flash(`Investment: pending 📈`,'warn');
    }
  } else if(type==='sneaker_collab'){
    const rev=rnd(500000,3000000); n.sneakerRevenue+=rev; n.totalEarned+=rev; G.money+=rev;
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(2,5));
    addEv(`New colorway dropped. Limited to 5,000 pairs. Sold out in 11 minutes. Resell market: insane.`,'love');
    flash(`👟 Colorway dropped! +${fmt$(rev)}`,'good');
  } else if(type==='sneaker_release'){
    const rev=rnd(2000000,12000000); n.sneakerRevenue+=rev; n.totalEarned+=rev; G.money+=rev;
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,9));
    addEv(`Signature shoe launch. Global release. ${fmt$(rev)} in first-week revenue. The shoe culture is yours.`,'love');
    flash(`👟 Signature shoe launch! +${fmt$(rev)}`,'good');
  }
  updateHUD(); renderNBA();
}

function nbaSneakerDeal(brand){
  const n=G.nba;
  const sd=NBA_SNEAKERS.find(s=>s.brand===brand);
  if(!sd){ flash('Brand not found','bad'); return; }
  if(G.sm.totalFame<sd.min){ flash(`Need ${sd.min} fame`,'bad'); return; }
  const val=rnd(sd.base[0],sd.base[1]);
  n.sneakerDeal=brand; n.sneakerRevenue=val*rnd(3,7); // total deal value
  n.endorsementIncome+=val;
  G.money+=val; n.totalEarned+=val;
  G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,10));
  addEv(`${brand} deal signed. ${fmt$(val)}/yr. Your shoe drops next spring.`,'love');
  flash(`👟 ${brand} deal! +${fmt$(val)}/yr`,'good');
  updateHUD(); renderNBA();
}

function nbaEndorse(brand){
  const n=G.nba;
  const ed=NBA_ENDORSEMENTS.find(e=>e.name===brand);
  if(!ed){ flash('Brand not found','bad'); return; }
  if(G.sm.totalFame<ed.min){ flash(`Need ${ed.min} fame`,'bad'); return; }
  const val=rnd(ed.value[0],ed.value[1]);
  n.endorsements.push(brand); n.endorsementIncome+=val;
  G.money+=val; n.totalEarned+=val;
  addEv(`${brand} endorsement: ${fmt$(val)}/yr. Your face in every commercial break.`,'love');
  flash(`💼 ${brand}! +${fmt$(val)}/yr`,'good');
  updateHUD(); renderNBA();
}

function nbaRetirementScreen(n){
  const goat=n.championshipRings>=4||n.mvpAwards>=4||(n.allStarSelections>=14&&n.championshipRings>=2);
  return `
  <div class="card" style="text-align:center;padding:28px 20px">
    <div style="font-size:3rem;margin-bottom:12px">🏀</div>
    <div style="font-family:var(--fh);font-weight:800;font-size:1.5rem;margin-bottom:6px">${G.firstname} ${G.lastname} — Retired</div>
    ${goat?'<div class="badge badge-gold" style="margin-bottom:10px">🐐 GOAT Discussion</div>':''}
    <div style="color:var(--muted2);font-size:.85rem;margin-bottom:20px">${n.year-1} seasons · Started with ${n.team}${n.prevTeams.length?' · '+n.prevTeams.length+' other teams':''}</div>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${n.championshipRings}</div><div class="sm-stat-lbl">Rings</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.allStarSelections}</div><div class="sm-stat-lbl">All-Stars</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.mvpAwards}</div><div class="sm-stat-lbl">MVPs</div></div>
      <div class="sm-stat"><div class="sm-stat-val">${n.stats.ppg}</div><div class="sm-stat-lbl">Career PPG</div></div>
      <div class="sm-stat"><div class="sm-stat-val" style="color:var(--gold)">${fmt$(n.totalEarned)}</div><div class="sm-stat-lbl">Career Earned</div></div>
    </div>
    ${n.sneakerDeal?`<div style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">👟 ${n.sneakerDeal} · ${fmt$(n.sneakerRevenue)} lifetime sneaker revenue</div>`:''}
    <div class="badge badge-accent" style="margin-bottom:10px">Legacy: ${calcNbaLegacy(n).tier} (${calcNbaLegacy(n).score})</div>
    <div class="choice-grid" style="margin-top:16px">
      <div class="choice" onclick="nbaPostCareer('unretire')"><div class="choice-icon">🔄</div><div class="choice-name">Un-Retire</div><div class="choice-desc">One more year. You know you want to.</div></div>
      <div class="choice" onclick="nbaPostCareer('broadcast')"><div class="choice-icon">📺</div><div class="choice-name">Broadcasting</div><div class="choice-desc">Inside the NBA energy.</div></div>
      <div class="choice" onclick="nbaPostCareer('ownership')"><div class="choice-icon">🏢</div><div class="choice-name">Buy Ownership Stake</div><div class="choice-desc">Become a team owner.</div></div>
      <div class="choice" onclick="nbaPostCareer('coaching')"><div class="choice-icon">📋</div><div class="choice-name">Coaching Staff</div><div class="choice-desc">Give back to the game.</div></div>
      <div class="choice" onclick="nbaPostCareer('hof')"><div class="choice-icon">🏛️</div><div class="choice-name">Basketball Hall of Fame</div><div class="choice-desc">Springfield calls.</div></div>
    </div>
  </div>`;
}

function nbaPostCareer(type){
  const n=G.nba;
  if(type==='unretire'){
    n.retired=false; addEv(`Comeback announced. The league welcomed you back. They always do.`,'warn');
    flash('Back in the league!','good');
  } else if(type==='broadcast'){
    G.money+=rnd(1000000,5000000); G.sm.totalFame=clamp(G.sm.totalFame+rnd(4,8));
    addEv(`Broadcasting deal. You\'re the analyst they always wanted. The takes: unfiltered.`,'good');
    flash(`📺 Broadcaster! +${fmt$(2500000)}`,'good');
  } else if(type==='ownership'){
    const cost=rnd(50000000,200000000);
    if(G.money<cost){ flash(`Need ${fmt$(cost)} for an ownership stake`,'bad'); return; }
    G.money-=cost; n.publicImage=Math.min(100,n.publicImage+rnd(10,20));
    G.sm.totalFame=clamp(G.sm.totalFame+rnd(8,16));
    addEv(`You bought a minority ownership stake in an NBA franchise. The Jordan precedent: followed.`,'love');
    flash(`🏢 Team owner! -${fmt$(cost)}`,'good');
  } else if(type==='coaching'){
    addEv(`Joined a coaching staff. Player development first. Head coach discussion: inevitable.`,'good');
    flash('📋 Coaching','good');
  } else if(type==='hof'){
    const eligible=n.allStarSelections>=5||n.championshipRings>=2||n.mvpAwards>=2||n.scoringTitles>=2||n.finalsMVPs>=1;
    if(eligible){
      G.sm.totalFame=clamp(G.sm.totalFame+rnd(12,22)); G.happy=clamp(G.happy+rnd(18,26));
      addEv(`BASKETBALL HALL OF FAME INDUCTEE. Springfield, Massachusetts. The speech. The bronze. Eternal.`,'love');
      flash('🏛️ HALL OF FAME!','good');
    } else {
      addEv(`Hall of Fame voters passed this year. The ballot: competitive. Build the legacy more.`,'warn');
      flash('Not yet. Keep the legacy building.','warn');
    }
  }
  updateHUD(); renderNBA();
}


// ══════════════════════════════════════════════════════════════════
