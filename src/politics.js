// politics.js — campaigning, governing, and survival gameplay
// ═══════════════════════════════════════════════════════════════

const POL_OFFICES = [
  { id:'mayor', label:'Mayor', minAge:28, launchCost:18000, termYears:4, difficulty:48, power:28 },
  { id:'governor', label:'Governor', minAge:32, launchCost:65000, termYears:4, difficulty:60, power:46 },
  { id:'president', label:'President', minAge:35, launchCost:250000, termYears:4, difficulty:72, power:64 },
];

const POL_FOCUS = [
  { id:'economy', label:'Economy', icon:'💰' },
  { id:'social', label:'Social Issues', icon:'🧑‍🤝‍🧑' },
  { id:'security', label:'National Security', icon:'🛡️' },
];

const POL_DEMOS = [
  { id:'youth', label:'Youth', icon:'🧢' },
  { id:'working', label:'Working Class', icon:'🧰' },
  { id:'elite', label:'Elite', icon:'🎩' },
];

const POL_TONES = [
  { id:'unity', label:'Unifying', icon:'🤝' },
  { id:'populist', label:'Populist', icon:'📣' },
  { id:'policy', label:'Policy-Heavy', icon:'📚' },
  { id:'hardline', label:'Hardline', icon:'🧱' },
];

const POL_POLICIES = {
  economy_tax_cut: {
    label:'Cut Taxes',
    category:'economy',
    capitalCost:18,
    immediate:{ approval:6, economy:4, stability:1, taxShift:-6, businessClimate:5 },
    ongoing:{ years:4, stability:-2, economy:1, deficit:5 },
  },
  economy_infra: {
    label:'Infrastructure Program',
    category:'economy',
    capitalCost:22,
    immediate:{ approval:2, economy:2, stability:4, education:2 },
    ongoing:{ years:5, economy:2, stability:2, deficit:3 },
  },
  healthcare_expand: {
    label:'Healthcare Expansion',
    category:'healthcare',
    capitalCost:20,
    immediate:{ approval:4, stability:4, healthcare:8, taxShift:3 },
    ongoing:{ years:4, stability:2, economy:-1, deficit:4 },
  },
  military_surge: {
    label:'Military Surge',
    category:'military',
    capitalCost:19,
    immediate:{ approval:2, stability:-1, security:7 },
    ongoing:{ years:4, stability:-1, economy:-1, deficit:5 },
  },
  education_invest: {
    label:'Education Investment',
    category:'education',
    capitalCost:17,
    immediate:{ approval:2, stability:2, education:8 },
    ongoing:{ years:5, economy:1, stability:2, deficit:2 },
  },
  law_reform: {
    label:'Justice Reform',
    category:'law',
    capitalCost:16,
    immediate:{ approval:3, stability:2, justice:8, policing:-4 },
    ongoing:{ years:4, stability:2, economy:0, deficit:1 },
  },
  law_crackdown: {
    label:'Law & Order Crackdown',
    category:'law',
    capitalCost:16,
    immediate:{ approval:2, stability:1, policing:8, justice:-4 },
    ongoing:{ years:4, stability:-1, economy:0, deficit:2 },
  },
};

const POL_CRISIS_TYPES = [
  { id:'recession', label:'Economic Recession', icon:'📉' },
  { id:'pandemic', label:'Pandemic Wave', icon:'🦠' },
  { id:'terror', label:'Terror Attack', icon:'💥' },
  { id:'war', label:'War Escalation', icon:'⚔️' },
];

function ensurePoliticsState(){
  if(typeof ensureGovLegalShape==='function') ensureGovLegalShape();
  if(!G.gov) G.gov = {};
  const g = G.gov;

  if(typeof g.approval!=='number') g.approval = 50;
  if(typeof g.party!=='string') g.party = 'Centrist';
  if(typeof g.cycleYear!=='number') g.cycleYear = 0;
  if(!g.policy) g.policy = {};
  if(typeof g.policy.taxShift!=='number') g.policy.taxShift = 0;
  if(typeof g.policy.policing!=='number') g.policy.policing = 50;
  if(typeof g.policy.justice!=='number') g.policy.justice = 50;
  if(typeof g.policy.businessClimate!=='number') g.policy.businessClimate = 50;
  if(typeof g.policy.healthcare!=='number') g.policy.healthcare = 50;
  if(typeof g.policy.education!=='number') g.policy.education = 50;
  if(typeof g.activeLaw!=='string') g.activeLaw = 'Status Quo';

  if(typeof g.popularity!=='number') g.popularity = 35;
  if(typeof g.funding!=='number') g.funding = 0;
  if(typeof g.trust!=='number') g.trust = 50;
  if(typeof g.scandalRisk!=='number') g.scandalRisk = 12;
  if(typeof g.politicalCapital!=='number') g.politicalCapital = 38;
  if(typeof g.control!=='number') g.control = 44;
  if(typeof g.stability!=='number') g.stability = 55;
  if(typeof g.economy!=='number') g.economy = 52;
  if(typeof g.activism!=='number') g.activism = 8;
  if(typeof g.campaigningSkill!=='number') g.campaigningSkill = 20;
  if(typeof g.governingSkill!=='number') g.governingSkill = 20;
  if(typeof g.survivalSkill!=='number') g.survivalSkill = 20;
  if(typeof g.policiesPassed!=='number') g.policiesPassed = 0;
  if(typeof g.lastElectionResult!=='string') g.lastElectionResult = 'none';
  if(typeof g.legacyScore!=='number') g.legacyScore = 0;
  if(typeof g.legacyRank!=='string') g.legacyRank = 'Unproven';
  if(!Array.isArray(g.legacyHistory)) g.legacyHistory = [];
  if(!Array.isArray(g.policyStack)) g.policyStack = [];

  if(!g.office) g.office = {};
  if(typeof g.office.level!=='string') g.office.level = 'none';
  if(typeof g.office.label!=='string') g.office.label = 'Citizen';
  if(typeof g.office.inOffice!=='boolean') g.office.inOffice = false;
  if(typeof g.office.termYear!=='number') g.office.termYear = 0;
  if(typeof g.office.termsWon!=='number') g.office.termsWon = 0;
  if(typeof g.office.termLimit!=='number') g.office.termLimit = 2;
  if(typeof g.office.removed!=='boolean') g.office.removed = false;
  if(typeof g.office.nextElectionIn!=='number'){
    const officeMeta = POL_OFFICES.find(o=>o.id===g.office.level);
    g.office.nextElectionIn = officeMeta ? Math.max(0, officeMeta.termYears - g.office.termYear) : 0;
  }

  if(!g.campaign) g.campaign = {};
  const c = g.campaign;
  if(typeof c.active!=='boolean') c.active = false;
  if(typeof c.office!=='string') c.office = '';
  if(typeof c.entryPath!=='string') c.entryPath = '';
  if(typeof c.focus!=='string') c.focus = 'economy';
  if(typeof c.demographic!=='string') c.demographic = 'working';
  if(typeof c.tone!=='string') c.tone = 'unity';
  if(typeof c.popularity!=='number') c.popularity = g.popularity;
  if(typeof c.funding!=='number') c.funding = g.funding;
  if(typeof c.trust!=='number') c.trust = g.trust;
  if(typeof c.scandalRisk!=='number') c.scandalRisk = g.scandalRisk;
  if(typeof c.momentum!=='number') c.momentum = 0;
  if(typeof c.speeches!=='number') c.speeches = 0;
  if(typeof c.ads!=='number') c.ads = 0;
  if(typeof c.debates!=='number') c.debates = 0;
  if(typeof c.travel!=='number') c.travel = 0;
  if(!Array.isArray(c.events)) c.events = [];
  if(!c.regions) c.regions = {};
  if(typeof c.regions.urban!=='number') c.regions.urban = 50;
  if(typeof c.regions.suburban!=='number') c.regions.suburban = 50;
  if(typeof c.regions.rural!=='number') c.regions.rural = 50;

  if(!g.legislature) g.legislature = {};
  if(typeof g.legislature.upper!=='number') g.legislature.upper = 48;
  if(typeof g.legislature.lower!=='number') g.legislature.lower = 49;
  if(typeof g.legislature.opposition!=='number') g.legislature.opposition = 52;
  if(typeof g.legislature.gridlock!=='number') g.legislature.gridlock = 40;

  if(!g.world) g.world = {};
  if(typeof g.world.allies!=='number') g.world.allies = 6;
  if(typeof g.world.rivals!=='number') g.world.rivals = 3;
  if(typeof g.world.neutral!=='number') g.world.neutral = 12;
  if(typeof g.world.tension!=='number') g.world.tension = 38;
  if(typeof g.world.tradeDeals!=='number') g.world.tradeDeals = 0;
  if(typeof g.world.sanctions!=='number') g.world.sanctions = 0;
  if(typeof g.world.wars!=='number') g.world.wars = 0;
  if(typeof g.world.diplomacyWins!=='number') g.world.diplomacyWins = 0;

  if(!g.media) g.media = {};
  if(typeof g.media.bias!=='number') g.media.bias = rnd(-12,12);
  if(typeof g.media.heat!=='number') g.media.heat = 34;
  if(typeof g.media.lastNarrative!=='string') g.media.lastNarrative = 'Normal cycle';

  if(!g.ethics) g.ethics = {};
  if(typeof g.ethics.corruption!=='number') g.ethics.corruption = 8;
  if(typeof g.ethics.investigations!=='number') g.ethics.investigations = 0;
  if(typeof g.ethics.impeachmentRisk!=='number') g.ethics.impeachmentRisk = 4;
  if(typeof g.ethics.dirtyMoney!=='number') g.ethics.dirtyMoney = 0;
  if(typeof g.ethics.coverups!=='number') g.ethics.coverups = 0;
  if(typeof g.ethics.removedByImpeachment!=='boolean') g.ethics.removedByImpeachment = false;

  if(!g.crisis) g.crisis = {};
  if(!g.crisis.active) g.crisis.active = null;
  if(typeof g.crisis.resolved!=='number') g.crisis.resolved = 0;
  if(typeof g.crisis.mishandled!=='number') g.crisis.mishandled = 0;
  if(typeof g.crisis.lastOutcome!=='string') g.crisis.lastOutcome = 'none';

  if(!G.legal) return;
  if(!G.legal.lawyer) G.legal.lawyer = { profile:20, campaignWins:0, officeYears:0, electedOffice:null, casesWon:0, settlements:0 };
  const lw = G.legal.lawyer;
  if(lw.electedOffice && g.office.level==='none'){
    const map = { 'District Attorney':'mayor', 'Attorney General':'governor', 'Governor':'governor', 'President':'president' };
    const level = map[lw.electedOffice] || 'mayor';
    const meta = POL_OFFICES.find(o=>o.id===level);
    g.office.level = level;
    g.office.label = meta?.label || 'Office Holder';
    g.office.inOffice = true;
    g.office.termYear = Math.max(0, lw.officeYears||0);
    g.office.nextElectionIn = meta ? Math.max(0, meta.termYears - (g.office.termYear%meta.termYears)) : 0;
  }
}

function politicsEntryScores(){
  ensurePoliticsState();
  const fame = G.sm?.totalFame||0;
  const followers = Object.values(G.sm?.platforms||{}).reduce((acc,p)=>acc + (p.followers||0),0);
  const degree = (G.school?.degree || G.school?.uni?.course || '');
  const lawScore = (G.career?.licenses?.law?34:0) + Math.floor((G.legal?.lawyer?.profile||20)/2) + (degree==='Law'?8:0);
  const bizScore = (G.finance?.business?.active?18:0) + Math.min(36, Math.floor((G.money||0)/120000)) + Math.floor((G.career?.reputation||50)/3);
  const celebScore = fame + Math.min(28, Math.floor(followers/250000)) + Math.floor((G.acting?.reputation||50)/4);
  const activistScore = (G.gov.activism||8) + Math.floor((G.career?.reputation||50)/4) + (G.school?.uni?.clubs?.includes('Debate')?8:0);
  return {
    law: Math.max(0, lawScore),
    business: Math.max(0, bizScore),
    celebrity: Math.max(0, celebScore),
    activist: Math.max(0, activistScore),
  };
}

function politicsBestPath(){
  const scores = politicsEntryScores();
  return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'activist';
}

function politicsCredibilityBonus(){
  const degree = (G.school?.degree || G.school?.uni?.course || '');
  const highCred = ['Law','Political Science','Economics','Public Health','Business'];
  return (highCred.includes(degree)?8:0) + Math.floor((G.smarts||50)/12);
}

function politicsOfficeMeta(id){
  return POL_OFFICES.find(o=>o.id===id);
}

function politicsStartCampaign(officeId){
  ensurePoliticsState();
  const g = G.gov;
  const office = politicsOfficeMeta(officeId);
  if(!office){ flash('Office not found.','warn'); return; }
  if(G.age < office.minAge){ flash(`Need age ${office.minAge}+ for ${office.label}.`,'warn'); return; }
  if(g.campaign.active){ flash('You already have an active campaign.','warn'); return; }
  if(g.office.inOffice && g.office.level===office.id && g.office.termsWon>=g.office.termLimit){
    flash(`Term limit reached for ${office.label}.`,'warn');
    return;
  }
  if(g.office.inOffice && g.office.level!==office.id && g.office.level==='president'){
    flash('You are currently President. Finish term before another office run.','warn');
    return;
  }

  const launchCost = office.launchCost + rnd(3000, 18000);
  if(G.money < launchCost){ flash(`Need ${fmt$(launchCost)} campaign launch funds.`,'warn'); return; }
  G.money -= launchCost;

  const path = politicsBestPath();
  const scores = politicsEntryScores();
  const fame = G.sm?.totalFame||0;
  const moneyFund = Math.min(85, Math.floor((G.money||0)/100000));
  const edu = politicsCredibilityBonus();
  const pathBonus = Math.floor((scores[path]||20)/8);

  g.campaign.active = true;
  g.campaign.office = office.id;
  g.campaign.entryPath = path;
  g.campaign.focus = 'economy';
  g.campaign.demographic = 'working';
  g.campaign.tone = 'unity';
  g.campaign.popularity = clamp(28 + pathBonus + Math.floor(fame/10) + rnd(-5,8));
  g.campaign.funding = Math.max(12000, launchCost + moneyFund*1200 + rnd(15000,60000));
  g.campaign.trust = clamp(42 + edu + Math.floor((g.activism||8)/8) + rnd(-4,6));
  g.campaign.scandalRisk = clamp(8 + Math.floor((g.ethics.corruption||8)/8) + rnd(0,10));
  g.campaign.momentum = rnd(-2,4);
  g.campaign.speeches = 0;
  g.campaign.ads = 0;
  g.campaign.debates = 0;
  g.campaign.travel = 0;
  g.campaign.events = [];
  g.campaign.regions = { urban:50, suburban:50, rural:50 };
  g.popularity = g.campaign.popularity;
  g.funding = g.campaign.funding;
  g.trust = g.campaign.trust;
  g.scandalRisk = g.campaign.scandalRisk;
  g.campaigningSkill = clamp((g.campaigningSkill||20) + rnd(2,6));
  addEv(`You launched a ${office.label} campaign via the ${path} path.`, 'love');
  flash(`🗳️ Campaign started: ${office.label}`,'good');
  renderPolitics();
}

function politicsSetCampaignFocus(focusId){
  ensurePoliticsState();
  const c = G.gov.campaign;
  if(!c.active){ flash('No active campaign.','warn'); return; }
  c.focus = focusId;
  c.momentum += rnd(0,2);
  addEv(`Campaign messaging now emphasizes ${focusId}.`, 'good');
  renderPolitics();
}

function politicsSetCampaignDemo(demoId){
  ensurePoliticsState();
  const c = G.gov.campaign;
  if(!c.active){ flash('No active campaign.','warn'); return; }
  c.demographic = demoId;
  addEv(`Campaign targeting shifted toward ${demoId}.`, 'good');
  renderPolitics();
}

function politicsSetCampaignTone(toneId){
  ensurePoliticsState();
  const c = G.gov.campaign;
  if(!c.active){ flash('No active campaign.','warn'); return; }
  c.tone = toneId;
  c.scandalRisk = clamp(c.scandalRisk + (toneId==='hardline'?3:toneId==='populist'?2:0) - (toneId==='policy'?1:0));
  addEv(`Speech tone changed to ${toneId}.`, 'warn');
  renderPolitics();
}

function politicsCampaignAction(kind, arg=''){
  ensurePoliticsState();
  const g = G.gov;
  const c = g.campaign;
  if(!c.active){ flash('No active campaign.','warn'); return; }

  if(kind==='speech'){
    const tone = arg || c.tone;
    c.speeches++;
    g.campaigningSkill = clamp((g.campaigningSkill||20) + rnd(1,3));
    if(tone==='unity'){
      c.popularity = clamp(c.popularity + rnd(2,6));
      c.trust = clamp(c.trust + rnd(3,7));
      c.scandalRisk = clamp(c.scandalRisk - rnd(1,3));
    } else if(tone==='populist'){
      c.popularity = clamp(c.popularity + rnd(4,8));
      c.trust = clamp(c.trust + rnd(-2,3));
      c.scandalRisk = clamp(c.scandalRisk + rnd(2,5));
    } else if(tone==='policy'){
      c.popularity = clamp(c.popularity + rnd(1,4));
      c.trust = clamp(c.trust + rnd(4,8));
      c.scandalRisk = clamp(c.scandalRisk - rnd(1,2));
    } else {
      c.popularity = clamp(c.popularity + rnd(2,7));
      c.trust = clamp(c.trust + rnd(-4,2));
      c.scandalRisk = clamp(c.scandalRisk + rnd(3,7));
    }
    addEv(`You delivered a ${tone} campaign speech.`, 'good');
  } else if(kind==='ads'){
    const adType = arg || 'positive';
    const spend = rnd(12000,70000);
    if(G.money < spend){ flash(`Need ${fmt$(spend)} for this ad buy.`,'warn'); return; }
    G.money -= spend;
    c.funding = Math.max(0, c.funding - spend);
    c.ads++;
    g.media.heat = clamp(g.media.heat + rnd(4,10));
    if(adType==='positive'){
      c.popularity = clamp(c.popularity + rnd(3,8));
      c.trust = clamp(c.trust + rnd(1,5));
      c.scandalRisk = clamp(c.scandalRisk + rnd(0,2));
      addEv(`Positive ad campaign aired statewide for ${fmt$(spend)}.`, 'good');
    } else {
      c.popularity = clamp(c.popularity + rnd(2,7));
      c.trust = clamp(c.trust - rnd(1,5));
      c.scandalRisk = clamp(c.scandalRisk + rnd(3,7));
      addEv(`Attack ads launched for ${fmt$(spend)}. They hit hard and polarized voters.`, 'warn');
    }
  } else if(kind==='debate'){
    c.debates++;
    const skill = (G.smarts||50) + (g.campaigningSkill||20) + (c.trust||50) - (c.scandalRisk||10);
    const winChance = Math.max(0.2, Math.min(0.85, 0.32 + skill/240));
    if(Math.random()<winChance){
      c.popularity = clamp(c.popularity + rnd(5,10));
      c.trust = clamp(c.trust + rnd(3,7));
      c.momentum += rnd(2,5);
      addEv('Debate win. Your clips spread all week.', 'love');
    } else {
      c.popularity = clamp(c.popularity - rnd(4,10));
      c.trust = clamp(c.trust - rnd(2,7));
      c.scandalRisk = clamp(c.scandalRisk + rnd(2,6));
      c.momentum -= rnd(1,4);
      addEv('Debate stumble. Opponents controlled the post-debate narrative.', 'bad');
    }
  } else if(kind==='travel'){
    const region = arg || pick(['urban','suburban','rural']);
    const travelCost = rnd(5000,18000);
    if(G.money < travelCost){ flash(`Need ${fmt$(travelCost)} to travel campaign route.`,'warn'); return; }
    G.money -= travelCost;
    c.travel++;
    c.regions[region] = clamp((c.regions[region]||50) + rnd(5,12));
    c.popularity = clamp(c.popularity + rnd(1,4));
    c.funding = Math.max(0, c.funding - Math.floor(travelCost*0.55));
    addEv(`Campaign travel to ${region} region improved support.`, 'good');
  } else if(kind==='endorsement'){
    const chance = 0.26 + (c.trust/260) + ((G.sm?.totalFame||0)/500) + ((G.career?.reputation||50)/320);
    if(Math.random()<chance){
      const cash = rnd(18000, 120000);
      c.funding += cash;
      c.popularity = clamp(c.popularity + rnd(2,6));
      c.trust = clamp(c.trust + rnd(2,5));
      c.events.push('endorsement');
      addEv(`A high-profile endorsement landed. Donors added ${fmt$(cash)}.`, 'love');
    } else {
      c.trust = clamp(c.trust - rnd(1,4));
      addEv('Major endorsement effort failed to convert this week.', 'warn');
    }
  } else if(kind==='grassroots'){
    const spend = rnd(2000,10000);
    if(G.money < spend){ flash(`Need ${fmt$(spend)} for grassroots ops.`,'warn'); return; }
    G.money -= spend;
    g.activism = clamp((g.activism||8) + rnd(4,9));
    c.trust = clamp(c.trust + rnd(3,7));
    c.popularity = clamp(c.popularity + rnd(1,4));
    c.scandalRisk = clamp(c.scandalRisk - rnd(1,3));
    addEv('Grassroots canvassing expanded volunteer momentum.', 'good');
  }

  g.popularity = c.popularity;
  g.funding = c.funding;
  g.trust = c.trust;
  g.scandalRisk = c.scandalRisk;
  renderPolitics();
}

function politicsCampaignEvent(){
  ensurePoliticsState();
  const c = G.gov.campaign;
  if(!c.active) return;
  const roll = Math.random();
  if(roll<0.22){
    c.scandalRisk = clamp(c.scandalRisk + rnd(5,12));
    c.trust = clamp(c.trust - rnd(4,10));
    c.popularity = clamp(c.popularity - rnd(2,8));
    addEv('Campaign scandal leak. Trust took a hit.', 'bad');
  } else if(roll<0.45){
    c.popularity = clamp(c.popularity - rnd(3,9));
    c.momentum -= rnd(1,4);
    addEv('Debate clip went viral for the wrong reason.', 'warn');
  } else if(roll<0.7){
    c.popularity = clamp(c.popularity + rnd(3,9));
    c.trust = clamp(c.trust + rnd(2,6));
    c.momentum += rnd(2,5);
    addEv('A viral campaign moment boosted your numbers.', 'love');
  } else {
    c.funding += rnd(12000,70000);
    c.trust = clamp(c.trust + rnd(1,4));
    addEv('Surprise endorsement and donor wave improved momentum.', 'good');
  }
}

function politicsResolveCampaign(){
  ensurePoliticsState();
  const g = G.gov;
  const c = g.campaign;
  if(!c.active) return;
  const office = politicsOfficeMeta(c.office);
  if(!office) return;

  const regionsAvg = Math.floor(((c.regions.urban||50)+(c.regions.suburban||50)+(c.regions.rural||50))/3);
  const mediaDrag = Math.floor((g.media.heat||30)/9) - Math.floor((g.media.bias||0)/8);
  const score =
    c.popularity*0.28 +
    c.trust*0.22 +
    regionsAvg*0.14 +
    Math.min(35, c.funding/18000)*0.16 +
    (g.campaigningSkill||20)*0.13 +
    (c.momentum||0)*2.1 -
    c.scandalRisk*0.2 -
    mediaDrag +
    rnd(-10,10);
  const threshold = office.difficulty + (office.id==='president' ? 8 : 0) - Math.floor((G.sm?.totalFame||0)/12);
  const won = score >= threshold;

  g.lastElectionResult = won ? 'won' : 'lost';
  if(won){
    g.office.level = office.id;
    g.office.label = office.label;
    g.office.inOffice = true;
    g.office.termYear = 0;
    g.office.termsWon = (g.office.termsWon||0) + 1;
    g.office.nextElectionIn = office.termYears;
    g.office.removed = false;
    g.approval = clamp(Math.floor((c.popularity + c.trust)/2) + rnd(-3,5));
    g.politicalCapital = clamp((g.politicalCapital||38) + office.power/4 + rnd(4,9));
    g.control = clamp((g.control||44) + office.power/5 + rnd(3,8));
    g.stability = clamp((g.stability||55) + rnd(1,5));
    g.governingSkill = clamp((g.governingSkill||20) + rnd(2,6));
    if(G.legal?.lawyer){
      G.legal.lawyer.campaignWins = (G.legal.lawyer.campaignWins||0) + 1;
      G.legal.lawyer.electedOffice = office.label;
      G.legal.lawyer.officeYears = G.legal.lawyer.officeYears||0;
    }
    addEv(`Election victory: you became ${office.label}.`, 'love');
    flash(`🏛️ Elected ${office.label}`,'good');
  } else {
    g.approval = clamp((g.approval||50) - rnd(1,4));
    g.politicalCapital = clamp((g.politicalCapital||38) + rnd(0,2));
    addEv(`Election loss for ${office.label}. You remained out of office.`, 'warn');
    flash('Election lost.','warn');
  }

  c.active = false;
  c.momentum = 0;
}

function politicsLegislativeRoll(difficulty){
  ensurePoliticsState();
  const g = G.gov;
  const leg = g.legislature;
  const score =
    (g.control||44)*0.35 +
    (g.politicalCapital||38)*0.35 +
    (leg.upper||48)*0.18 +
    (leg.lower||49)*0.18 -
    (leg.opposition||52)*0.22 -
    (leg.gridlock||40)*0.14 +
    rnd(-16,16);
  if(score >= difficulty + 8) return 'pass';
  if(score >= difficulty - 7) return 'compromise';
  return 'blocked';
}

function politicsApplyPolicyOngoing(){
  ensurePoliticsState();
  const g = G.gov;
  const kept = [];
  (g.policyStack||[]).forEach(item=>{
    g.stability = clamp((g.stability||55) + (item.stability||0));
    g.economy = clamp((g.economy||52) + (item.economy||0));
    if(item.deficit){
      g.politicalCapital = clamp((g.politicalCapital||38) - Math.ceil(item.deficit/3));
    }
    item.yearsLeft--;
    if(item.yearsLeft>0) kept.push(item);
  });
  g.policyStack = kept;
}

function politicsPassPolicy(policyId){
  ensurePoliticsState();
  const g = G.gov;
  if(!g.office.inOffice){ flash('You need office to govern policy.','warn'); return; }
  const p = POL_POLICIES[policyId];
  if(!p){ flash('Policy not found.','warn'); return; }
  const result = politicsLegislativeRoll(52 + p.capitalCost/2);
  const capSpend = Math.max(6, Math.floor(p.capitalCost * (result==='compromise'?0.6:1)));
  if((g.politicalCapital||38) < capSpend){
    flash(`Need ${capSpend} political capital.`,'warn');
    return;
  }
  g.politicalCapital = clamp((g.politicalCapital||38) - capSpend);
  g.policiesPassed += (result==='blocked'?0:1);

  const mult = result==='pass' ? 1 : result==='compromise' ? 0.55 : 0;
  if(result==='blocked'){
    g.approval = clamp((g.approval||50) - rnd(2,5));
    addEv(`${p.label} was blocked in the legislature.`, 'warn');
    renderPolitics();
    return;
  }

  const im = p.immediate;
  g.approval = clamp((g.approval||50) + Math.floor((im.approval||0)*mult));
  g.economy = clamp((g.economy||52) + Math.floor((im.economy||0)*mult));
  g.stability = clamp((g.stability||55) + Math.floor((im.stability||0)*mult));
  g.policy.taxShift = Math.max(-25, Math.min(25, g.policy.taxShift + Math.floor((im.taxShift||0)*mult)));
  g.policy.businessClimate = clamp(g.policy.businessClimate + Math.floor((im.businessClimate||0)*mult));
  g.policy.healthcare = clamp(g.policy.healthcare + Math.floor((im.healthcare||0)*mult));
  g.policy.education = clamp(g.policy.education + Math.floor((im.education||0)*mult));
  g.policy.justice = clamp(g.policy.justice + Math.floor((im.justice||0)*mult));
  g.policy.policing = clamp(g.policy.policing + Math.floor((im.policing||0)*mult));
  g.activeLaw = p.label;
  g.governingSkill = clamp((g.governingSkill||20) + rnd(1,4));

  const og = p.ongoing;
  g.policyStack.push({
    id: `${policyId}_${G.age}_${Math.random().toString(36).slice(2,6)}`,
    label: p.label,
    yearsLeft: Math.max(1, Math.floor(og.years * (result==='compromise'?0.7:1))),
    stability: Math.floor((og.stability||0) * (result==='compromise'?0.6:1)),
    economy: Math.floor((og.economy||0) * (result==='compromise'?0.6:1)),
    deficit: Math.ceil((og.deficit||0) * (result==='compromise'?0.6:1)),
  });

  addEv(`${p.label} ${result==='pass'?'passed':'passed as a compromise'} in ${g.office.label} office.`, result==='pass'?'good':'warn');
  renderPolitics();
}

function politicsDiplomacyAction(kind){
  ensurePoliticsState();
  const g = G.gov;
  const w = g.world;
  if(!g.office.inOffice){ flash('Diplomacy unlocks while in office.','warn'); return; }

  if(kind==='trade'){
    const roll = Math.random();
    if(roll<0.68){
      w.tradeDeals++;
      w.allies = Math.min(20, w.allies + rnd(0,1));
      w.tension = clamp(w.tension - rnd(2,6));
      g.economy = clamp((g.economy||52) + rnd(2,6));
      g.approval = clamp((g.approval||50) + rnd(1,4));
      addEv('Trade deal signed. Markets responded positively.', 'good');
    } else {
      w.tension = clamp(w.tension + rnd(2,6));
      g.approval = clamp((g.approval||50) - rnd(1,4));
      addEv('Trade talks collapsed publicly.', 'warn');
    }
  } else if(kind==='sanction'){
    w.sanctions++;
    w.rivals = Math.min(12, w.rivals + rnd(0,1));
    w.tension = clamp(w.tension + rnd(3,9));
    g.stability = clamp((g.stability||55) - rnd(1,4));
    g.approval = clamp((g.approval||50) + rnd(-2,2));
    addEv('You imposed sanctions on a rival state.', 'warn');
  } else if(kind==='summit'){
    const chance = 0.4 + (g.trust||50)/250 + ((g.campaigningSkill||20)/300);
    if(Math.random()<chance){
      w.diplomacyWins++;
      w.tension = clamp(w.tension - rnd(4,10));
      w.allies = Math.min(20, w.allies + rnd(1,2));
      g.stability = clamp((g.stability||55) + rnd(2,6));
      g.approval = clamp((g.approval||50) + rnd(1,4));
      addEv('Diplomatic summit succeeded. Alliance confidence improved.', 'love');
    } else {
      w.tension = clamp(w.tension + rnd(2,6));
      addEv('Diplomatic summit ended without agreement.', 'warn');
    }
  } else if(kind==='military'){
    w.wars += (Math.random()<0.35?1:0);
    w.tension = clamp(w.tension + rnd(5,12));
    g.stability = clamp((g.stability||55) - rnd(2,6));
    g.approval = clamp((g.approval||50) + rnd(-3,4));
    addEv('Military posture escalated regional tensions.', 'warn');
  }
  renderPolitics();
}

function politicsSpawnCrisis(){
  ensurePoliticsState();
  const g = G.gov;
  if(g.crisis.active) return;
  const pressure = (g.world.tension||38)/120 + (100-(g.stability||55))/180 + (g.economy<45?0.08:0);
  if(Math.random() >= Math.min(0.42, 0.12 + pressure)) return;
  const crisis = pick(POL_CRISIS_TYPES);
  g.crisis.active = {
    id: crisis.id,
    label: crisis.label,
    icon: crisis.icon,
    severity: rnd(38,92),
    age: G.age,
  };
  addEv(`Crisis: ${crisis.label}. National pressure is rising.`, 'bad');
}

function politicsHandleCrisis(response){
  ensurePoliticsState();
  const g = G.gov;
  const c = g.crisis.active;
  if(!c){ flash('No active crisis right now.','warn'); return; }
  const sev = c.severity||55;
  let chance = 0.26 + (g.governingSkill||20)/210 + (g.politicalCapital||38)/260;
  if(response==='aggressive'){
    chance += (c.id==='terror'||c.id==='war') ? 0.2 : -0.08;
    g.politicalCapital = clamp((g.politicalCapital||38) - rnd(3,8));
    g.world.tension = clamp((g.world.tension||38) + rnd(1,6));
  } else if(response==='diplomatic'){
    chance += (c.id==='war'||c.id==='pandemic'||c.id==='recession') ? 0.16 : -0.03;
    g.politicalCapital = clamp((g.politicalCapital||38) - rnd(2,6));
    g.world.tension = clamp((g.world.tension||38) - rnd(2,7));
  } else {
    chance += (c.id==='recession' ? 0.06 : -0.12);
    g.politicalCapital = clamp((g.politicalCapital||38) + rnd(0,2));
  }
  chance = Math.max(0.08, Math.min(0.88, chance - sev/260));

  if(Math.random()<chance){
    g.crisis.resolved++;
    g.crisis.lastOutcome = 'resolved';
    g.approval = clamp((g.approval||50) + rnd(4,10));
    g.stability = clamp((g.stability||55) + rnd(4,9));
    g.survivalSkill = clamp((g.survivalSkill||20) + rnd(2,6));
    addEv(`Crisis managed successfully with a ${response} response.`, 'love');
  } else {
    g.crisis.mishandled++;
    g.crisis.lastOutcome = 'mishandled';
    g.approval = clamp((g.approval||50) - rnd(6,14));
    g.stability = clamp((g.stability||55) - rnd(6,14));
    g.ethics.impeachmentRisk = clamp((g.ethics.impeachmentRisk||4) + rnd(2,7));
    addEv(`Crisis response backfired. Approval and stability dropped.`, 'bad');
  }
  g.crisis.active = null;
  renderPolitics();
}

function politicsEthicsAction(kind){
  ensurePoliticsState();
  const g = G.gov;
  const e = g.ethics;
  if(kind==='clean'){
    e.corruption = clamp((e.corruption||8) - rnd(3,8));
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) - rnd(2,5));
    g.trust = clamp((g.trust||50) + rnd(2,5));
    addEv('You rejected shady channels and stayed transparent.', 'good');
  } else if(kind==='donation'){
    const boost = rnd(20000,120000);
    e.dirtyMoney += boost;
    e.corruption = clamp((e.corruption||8) + rnd(4,10));
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) + rnd(2,6));
    if(g.campaign.active){
      g.campaign.funding += boost;
    } else {
      g.politicalCapital = clamp((g.politicalCapital||38) + rnd(2,6));
    }
    addEv(`You accepted questionable donations (+${fmt$(boost)} support).`, 'warn');
  } else if(kind==='abuse'){
    e.corruption = clamp((e.corruption||8) + rnd(6,13));
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) + rnd(4,10));
    g.control = clamp((g.control||44) + rnd(2,6));
    g.trust = clamp((g.trust||50) - rnd(4,10));
    addEv('You abused executive power for short-term gains.', 'bad');
  } else if(kind==='coverup'){
    e.coverups = (e.coverups||0) + 1;
    e.corruption = clamp((e.corruption||8) + rnd(4,9));
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) + rnd(5,12));
    g.scandalRisk = clamp((g.scandalRisk||12) - rnd(1,4));
    addEv('You attempted a cover-up. It may buy time, not safety.', 'warn');
  }
  renderPolitics();
}

function politicsCheckInvestigations(){
  ensurePoliticsState();
  const g = G.gov;
  const e = g.ethics;
  const risk = Math.max(0, (e.corruption||8)/130 + (e.coverups||0)*0.07 + (g.media.heat||30)/360);
  if(Math.random()<risk){
    e.investigations += 1;
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) + rnd(5,12));
    g.trust = clamp((g.trust||50) - rnd(3,8));
    g.approval = clamp((g.approval||50) - rnd(2,7));
    addEv('Investigation opened into your administration.', 'bad');
  }
}

function politicsTryImpeachment(){
  ensurePoliticsState();
  const g = G.gov;
  if(!g.office.inOffice) return;
  const e = g.ethics;
  const trigger = (e.impeachmentRisk||4) + (e.corruption||8) + (g.scandalRisk||12);
  if(trigger < 155 || Math.random()>0.28) return;

  addEv('Impeachment proceedings started against your office.', 'bad');
  const surviveChance = Math.max(0.08, Math.min(0.82,
    0.22 + (g.control||44)/220 + (g.approval||50)/260 - (e.corruption||8)/260 - (e.investigations||0)*0.05
  ));
  if(Math.random()<surviveChance){
    g.approval = clamp((g.approval||50) - rnd(5,11));
    g.politicalCapital = clamp((g.politicalCapital||38) - rnd(8,16));
    e.impeachmentRisk = clamp((e.impeachmentRisk||4) - rnd(6,12));
    addEv('You survived impeachment, but support was damaged.', 'warn');
  } else {
    e.removedByImpeachment = true;
    g.office.inOffice = false;
    g.office.removed = true;
    g.office.label = 'Removed from Office';
    g.office.level = 'none';
    g.office.termYear = 0;
    g.office.nextElectionIn = 0;
    g.approval = clamp((g.approval||50) - rnd(14,26));
    G.legal.finesDue += rnd(25000,180000);
    if(G.legal?.lawyer){
      G.legal.lawyer.electedOffice = null;
    }
    addEv('You were removed from office after impeachment.', 'bad');
    flash('Removed from office.','bad');
    politicsFinalizeLegacy('removed');
  }
}

function politicsResolveIncumbentElection(){
  ensurePoliticsState();
  const g = G.gov;
  const o = g.office;
  if(!o.inOffice) return;
  const office = politicsOfficeMeta(o.level);
  if(!office) return;
  if(o.termYear < office.termYears) return;
  if(o.level==='president' && o.termsWon>=o.termLimit){
    addEv('Term limit reached. You cannot run again for President.', 'warn');
    o.inOffice = false;
    o.level = 'none';
    o.label = 'Citizen';
    o.termYear = 0;
    o.nextElectionIn = 0;
    if(G.legal?.lawyer) G.legal.lawyer.electedOffice = null;
    politicsFinalizeLegacy('term_limited');
    return;
  }

  const score =
    (g.approval||50)*0.32 +
    (g.economy||52)*0.23 +
    (g.stability||55)*0.2 +
    Math.min(20, (g.policiesPassed||0))*0.9 +
    ((g.crisis.resolved||0) - (g.crisis.mishandled||0))*3.5 -
    (g.ethics.corruption||8)*0.16 -
    (g.ethics.impeachmentRisk||4)*0.2 +
    rnd(-12,12);
  const threshold = office.difficulty + 2 + (o.termsWon>=1 ? 4 : 0);
  const won = score >= threshold;
  if(won){
    o.termsWon += 1;
    o.termYear = 0;
    o.nextElectionIn = office.termYears;
    g.approval = clamp((g.approval||50) + rnd(1,5));
    g.politicalCapital = clamp((g.politicalCapital||38) + rnd(3,8));
    addEv(`Reelection victory! You secured another term as ${office.label}.`, 'love');
  } else {
    addEv(`You lost reelection as ${office.label}.`, 'bad');
    o.inOffice = false;
    o.level = 'none';
    o.label = 'Citizen';
    o.termYear = 0;
    o.nextElectionIn = 0;
    if(G.legal?.lawyer) G.legal.lawyer.electedOffice = null;
    politicsFinalizeLegacy('defeated');
  }
}

function politicsFinalizeLegacy(reason='completed'){
  ensurePoliticsState();
  const g = G.gov;
  const score =
    (g.economy||52)*0.28 +
    (g.stability||55)*0.3 +
    (g.policiesPassed||0)*2.2 +
    (g.crisis.resolved||0)*4.5 -
    (g.world.wars||0)*7 -
    (g.ethics.corruption||8)*0.55 -
    (g.crisis.mishandled||0)*4.2;
  g.legacyScore = Math.round(score);
  g.legacyRank =
    score>=92 ? 'Legendary' :
    score>=72 ? 'Great' :
    score>=50 ? 'Average' : 'Failure';
  g.legacyHistory.push({
    age:G.age,
    rank:g.legacyRank,
    score:g.legacyScore,
    reason,
    officeYears:G.legal?.lawyer?.officeYears||0,
  });
}

function processGovernmentYear(){
  ensurePoliticsState();
  const g = G.gov;
  const o = g.office;

  g.cycleYear++;
  politicsApplyPolicyOngoing();

  // Global media pressure and narrative
  g.media.heat = clamp((g.media.heat||34) + rnd(-4,7) + (g.campaign.active?4:0));
  if(g.media.heat>=70){
    g.media.lastNarrative = 'Hyper-polarized news cycle';
    g.approval = clamp((g.approval||50) - rnd(1,4));
  } else if(g.media.heat<=30){
    g.media.lastNarrative = 'Low-intensity cycle';
  } else {
    g.media.lastNarrative = pick(['Policy-driven cycle','Campaign theater cycle','Economy-focused cycle']);
  }

  if(g.campaign.active){
    if(Math.random()<0.55) politicsCampaignEvent();
    g.campaign.funding = Math.max(0, g.campaign.funding - rnd(8000,26000));
    if(g.campaign.funding<=0){
      g.campaign.trust = clamp(g.campaign.trust - rnd(1,4));
      g.campaign.popularity = clamp(g.campaign.popularity - rnd(1,3));
    }
    if(Math.random()<0.4 || g.campaign.momentum>=6){
      politicsResolveCampaign();
    }
  }

  if(o.inOffice){
    o.termYear++;
    const meta = politicsOfficeMeta(o.level);
    if(meta) o.nextElectionIn = Math.max(0, meta.termYears - o.termYear);
    if(G.legal?.lawyer){
      G.legal.lawyer.electedOffice = o.label;
      G.legal.lawyer.officeYears = (G.legal.lawyer.officeYears||0) + 1;
    }

    // Office income and governing stress
    const officePay =
      o.level==='president' ? rnd(350000,520000) :
      o.level==='governor' ? rnd(160000,260000) : rnd(90000,180000);
    G.money += officePay;
    G.stress = clamp((G.stress||35) + rnd(2,7));
    g.governingSkill = clamp((g.governingSkill||20) + rnd(0,2));

    // Legislature drift and control
    g.legislature.upper = clamp(g.legislature.upper + rnd(-4,4) + ((g.approval||50)>=60?1:0));
    g.legislature.lower = clamp(g.legislature.lower + rnd(-4,4) + ((g.approval||50)>=60?1:0));
    g.legislature.opposition = clamp(g.legislature.opposition + rnd(-4,4) + ((g.approval||50)<45?2:0));
    g.legislature.gridlock = clamp(g.legislature.gridlock + rnd(-3,5) + ((g.legislature.opposition||52)>60?2:0));
    g.control = clamp(Math.floor((g.legislature.upper + g.legislature.lower)/2) - Math.floor(g.legislature.gridlock/5));

    // Approval and capital drift
    const economyEffect = Math.floor(((g.economy||52)-50)/6);
    const scandalPenalty = Math.floor((g.scandalRisk||12)/14) + Math.floor((g.ethics.corruption||8)/18);
    g.approval = clamp((g.approval||50) + rnd(-4,4) + economyEffect - scandalPenalty);
    g.politicalCapital = clamp((g.politicalCapital||38) + rnd(-4,5) + ((g.approval||50)>=58?2:0) - ((g.legislature.gridlock||40)>=65?2:0));
    g.stability = clamp((g.stability||55) + rnd(-3,4) - ((g.world.tension||38)>=70?2:0));
  } else {
    g.approval = clamp((g.approval||50) + rnd(-2,2));
    g.politicalCapital = clamp((g.politicalCapital||38) + rnd(-1,2));
  }

  // World pressure and crisis generation
  g.world.tension = clamp((g.world.tension||38) + rnd(-3,5) + ((g.world.rivals||3)>=6?2:0));
  politicsSpawnCrisis();
  if(g.crisis.active && o.inOffice && Math.random()<0.3){
    addEv(`Unresolved crisis ongoing: ${g.crisis.active.label}.`, 'warn');
    g.approval = clamp((g.approval||50) - rnd(1,4));
  }

  politicsCheckInvestigations();
  politicsTryImpeachment();
  politicsResolveIncumbentElection();

  // Keep legacy preview fresh even mid-career.
  politicsFinalizeLegacy('in_progress');
}

function politicsQuickAction(action){
  ensurePoliticsState();
  if(action==='campaign_mayor') return politicsStartCampaign('mayor');
  if(action==='campaign_governor') return politicsStartCampaign('governor');
  if(action==='campaign_president') return politicsStartCampaign('president');
  if(action==='policy_business') return politicsPassPolicy('economy_tax_cut');
  if(action==='policy_justice') return politicsPassPolicy('law_reform');
  if(action==='policy_policing') return politicsPassPolicy('law_crackdown');
}

function renderPolitics(){
  ensurePoliticsState();
  const el = document.getElementById('politics-content');
  if(!el) return;
  if(G.age < 18){
    el.innerHTML = `<div class="notif warn">Politics unlocks at age 18.</div>`;
    return;
  }
  const g = G.gov;
  const c = g.campaign;
  const o = g.office;
  const entry = politicsEntryScores();
  const officeMeta = o.inOffice ? politicsOfficeMeta(o.level) : null;
  const followers = Object.values(G.sm?.platforms||{}).reduce((acc,p)=>acc + (p.followers||0),0);

  let html = '';
  html += `<div class="card">
    <div class="card-title">Politics Overview</div>
    <p style="font-size:.78rem;color:var(--muted2)">Office: <strong style="color:var(--text)">${o.inOffice?o.label:'No Office'}</strong> ${o.inOffice?`· Term year ${o.termYear}/${officeMeta?.termYears||4}`:''}</p>
    <p style="font-size:.78rem;color:var(--muted2)">Approval ${g.approval}% · Political Capital ${g.politicalCapital} · Control ${g.control}% · Stability ${g.stability}%</p>
    <p style="font-size:.76rem;color:var(--muted2)">Economy Index ${g.economy} · Media: ${g.media.lastNarrative} · Crisis: ${g.crisis.active?`${g.crisis.active.icon} ${g.crisis.active.label}`:'None'}</p>
  </div>`;

  html += `<div class="card">
    <div class="card-title">Entry Paths (Starting Advantages)</div>
    <p style="font-size:.76rem;color:var(--muted2)">Law ${entry.law} · Business ${entry.business} · Celebrity ${entry.celebrity} · Activist ${entry.activist}</p>
    <p style="font-size:.74rem;color:var(--muted2)">Fame: ${(G.sm?.totalFame||0)} · Followers: ${fmtF(followers)} · Money: ${fmt$(G.money)} · Education credibility: +${politicsCredibilityBonus()}</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('grassroots')">✊ Build Grassroots</button>
      <button class="btn btn-ghost btn-sm" onclick="switchTab('media')">📱 Grow Fame</button>
      <button class="btn btn-ghost btn-sm" onclick="switchTab('business')">💼 Build Wealth</button>
      <button class="btn btn-ghost btn-sm" onclick="switchTab('jobs')">⚖️ Build Law Profile</button>
    </div>
  </div>`;

  html += `<div class="card">
    <div class="card-title">Run for Office</div>
    <div class="choice-grid">
      ${POL_OFFICES.map(off=>`<div class="choice" onclick="politicsStartCampaign('${off.id}')">
        <div class="choice-icon">🗳️</div>
        <div class="choice-name">${off.label}</div>
        <div class="choice-desc">Age ${off.minAge}+ · launch ~${fmt$(off.launchCost)}</div>
      </div>`).join('')}
    </div>
  </div>`;

  if(c.active){
    html += `<div class="card">
      <div class="card-title">Active Campaign: ${politicsOfficeMeta(c.office)?.label||c.office}</div>
      <p style="font-size:.78rem;color:var(--muted2)">Popularity ${c.popularity}% · Funding ${fmt$(c.funding)} · Trust ${c.trust}% · Scandal Risk ${c.scandalRisk}%</p>
      <p style="font-size:.76rem;color:var(--muted2)">Focus: ${c.focus} · Demographic: ${c.demographic} · Tone: ${c.tone} · Momentum: ${c.momentum}</p>
      <p style="font-size:.76rem;color:var(--muted2)">Regional support → Urban ${c.regions.urban}% · Suburban ${c.regions.suburban}% · Rural ${c.regions.rural}%</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${POL_TONES.map(t=>`<button class="btn btn-ghost btn-sm" onclick="politicsSetCampaignTone('${t.id}')">${t.icon} ${t.label}</button>`).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${POL_FOCUS.map(f=>`<button class="btn btn-ghost btn-sm" onclick="politicsSetCampaignFocus('${f.id}')">${f.icon} ${f.label}</button>`).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${POL_DEMOS.map(d=>`<button class="btn btn-ghost btn-sm" onclick="politicsSetCampaignDemo('${d.id}')">${d.icon} ${d.label}</button>`).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('speech', G.gov.campaign.tone)">🎤 Give Speech</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('ads','positive')">📺 Positive Ads</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('ads','attack')">🧨 Attack Ads</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('debate')">🥊 Debate Opponent</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('travel', pick(['urban','suburban','rural']))">✈️ Campaign Travel</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsCampaignAction('endorsement')">🤝 Seek Endorsement</button>
      </div>
      <div style="margin-top:10px">
        <button class="btn btn-primary btn-sm" onclick="politicsResolveCampaign()">🧮 Resolve Election Now</button>
      </div>
    </div>`;
  }

  if(o.inOffice){
    html += `<div class="card">
      <div class="card-title">Governing</div>
      <p style="font-size:.78rem;color:var(--muted2)">Legislature: Upper ${g.legislature.upper}% · Lower ${g.legislature.lower}% · Opposition ${g.legislature.opposition}% · Gridlock ${g.legislature.gridlock}%</p>
      <div class="choice-grid">
        <div class="choice" onclick="politicsPassPolicy('economy_tax_cut')"><div class="choice-icon">💵</div><div class="choice-name">Cut Taxes</div><div class="choice-desc">Short-term pop, long-term budget drag</div></div>
        <div class="choice" onclick="politicsPassPolicy('economy_infra')"><div class="choice-icon">🏗️</div><div class="choice-name">Infrastructure</div><div class="choice-desc">Slower build, durable gains</div></div>
        <div class="choice" onclick="politicsPassPolicy('healthcare_expand')"><div class="choice-icon">🏥</div><div class="choice-name">Healthcare Expansion</div><div class="choice-desc">Stability up, cost pressure</div></div>
        <div class="choice" onclick="politicsPassPolicy('military_surge')"><div class="choice-icon">⚔️</div><div class="choice-name">Military Surge</div><div class="choice-desc">Security optics, tension risk</div></div>
        <div class="choice" onclick="politicsPassPolicy('education_invest')"><div class="choice-icon">🎓</div><div class="choice-name">Education Investment</div><div class="choice-desc">Long-run development</div></div>
        <div class="choice" onclick="politicsPassPolicy('law_reform')"><div class="choice-icon">⚖️</div><div class="choice-name">Justice Reform</div><div class="choice-desc">Trust boost, policing down</div></div>
        <div class="choice" onclick="politicsPassPolicy('law_crackdown')"><div class="choice-icon">🚓</div><div class="choice-name">Law & Order</div><div class="choice-desc">Order up, justice concerns</div></div>
      </div>
    </div>`;

    html += `<div class="card">
      <div class="card-title">World & Diplomacy</div>
      <p style="font-size:.78rem;color:var(--muted2)">Allies ${g.world.allies} · Rivals ${g.world.rivals} · Tension ${g.world.tension}% · Trade Deals ${g.world.tradeDeals}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="politicsDiplomacyAction('trade')">📦 Trade Deal</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsDiplomacyAction('sanction')">⛔ Sanctions</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsDiplomacyAction('summit')">🕊️ Summit</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsDiplomacyAction('military')">🪖 Military Action</button>
      </div>
    </div>`;
  }

  if(g.crisis.active){
    html += `<div class="card">
      <div class="card-title">Crisis Management</div>
      <p style="font-size:.8rem;color:var(--muted2)">${g.crisis.active.icon} ${g.crisis.active.label} · Severity ${g.crisis.active.severity}%</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="politicsHandleCrisis('aggressive')">⚔️ Aggressive Response</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsHandleCrisis('diplomatic')">🕊️ Diplomatic Response</button>
        <button class="btn btn-ghost btn-sm" onclick="politicsHandleCrisis('wait')">🕰️ Wait / Observe</button>
      </div>
    </div>`;
  }

  html += `<div class="card">
    <div class="card-title">Ethics, Media & Survival</div>
    <p style="font-size:.78rem;color:var(--muted2)">Media Bias ${g.media.bias} · Media Heat ${g.media.heat}% · Corruption ${g.ethics.corruption}% · Impeachment Risk ${g.ethics.impeachmentRisk}%</p>
    <p style="font-size:.76rem;color:var(--muted2)">Investigations ${g.ethics.investigations} · Coverups ${g.ethics.coverups} · Dirty support ${fmt$(g.ethics.dirtyMoney||0)}</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-ghost btn-sm" onclick="politicsEthicsAction('clean')">🧼 Stay Clean</button>
      <button class="btn btn-ghost btn-sm" onclick="politicsEthicsAction('donation')">💼 Shady Donations</button>
      <button class="btn btn-ghost btn-sm" onclick="politicsEthicsAction('abuse')">🧩 Abuse Power</button>
      <button class="btn btn-ghost btn-sm" onclick="politicsEthicsAction('coverup')">🕳️ Cover Up</button>
    </div>
  </div>`;

  html += `<div class="card">
    <div class="card-title">Reelection & Legacy</div>
    <p style="font-size:.78rem;color:var(--muted2)">Last election: ${g.lastElectionResult} · Office terms won: ${g.office.termsWon||0} · Next election in: ${g.office.nextElectionIn||0} years</p>
    <p style="font-size:.78rem;color:var(--muted2)">Legacy Rank: <strong style="color:${g.legacyRank==='Legendary'?'var(--accent)':g.legacyRank==='Great'?'var(--accent2)':g.legacyRank==='Average'?'var(--gold)':'var(--danger)'}">${g.legacyRank}</strong> · Score ${g.legacyScore}</p>
    ${g.legacyHistory.length?`<div style="font-size:.74rem;color:var(--muted2)">Recent legacy records: ${g.legacyHistory.slice(-3).map(x=>`${x.age}: ${x.rank} (${x.reason})`).join(' · ')}</div>`:''}
  </div>`;

  el.innerHTML = html;
}

