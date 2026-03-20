// ══ core.js ══
// ═══════════════════════════════════════════════════════════════
//  core.js — Game state, utilities, HUD, age-up engine
// ═══════════════════════════════════════════════════════════════

// ── STATE ───────────────────────────────────────────────────────
const G = {
  // identity
  gender:'', firstname:'', lastname:'', state:'', age:0,
  // stats (0-100)
  health:80, happy:70, smarts:50, looks:50, stress:35,
  // money (raw dollars)
  money:0,
  // relationships extended
  children: [],         // { name, firstName, gender, age, alive, relation, school stage, career, uni }
  spouse: null,         // person obj with married:true, or null
  marriageYears: 0,     // years married
  divorces: 0,
  assets: { home:false, homeValue:0, savings:0 },   // shared assets tracked for divorce
  finance:{
    rent:0, mortgage:0, mortgageYears:0, debt:0, credit:680, investments:0, retirement:0,
    portfolio:{ indexFund:0, bonds:0, realEstateFund:0, ventureFund:0 },
    crypto:{
      btc:0, eth:0, sol:0, meme:0,
      marketCycle:'neutral', marketMomentum:0, lastYearPnl:0, lastEvent:'',
    },
    business:{
      active:false, name:'', sector:'', stage:'idea',
      employees:0, reputation:50, product:45, operations:45, marketing:40,
      burn:0, cashReserve:0, valuation:0, years:0, lastProfit:0, hasInvestor:false,
    },
    tax:{
      lastPaid:0, lastRefund:0, lastTaxableIncome:0, lastEffectiveRate:0, lastBracket:'None',
      lastStateRate:0, lastYearSummary:null, delinquentYears:0,
    }
  },
  housing:{ type:'none', comfort:40, neighborhood:50, roommates:0, roommateList:[], upkeep:0, utilities:0 },
  relTab: 'family',     // which sub-tab is active
  // relationships
  family:[], friends:[], lovers:[],
  pets:[],
  traits:[],
  familyFlags:{ parentsDivorced:false, stepFamilyAdded:false },
  // history
  lifeEvents:[], yearEvents:[],
  travel:{ log:[], visited:[] },
  // school
  school:{
    stage:'none',
    grade:0,
    gpa:2.5,
    trouble:0,
    expelled:false,
    teachers:[],
    classmates:[],
    sport:null,
    sportYears:0,
    sportMVP:false,
    bigGameWins:0,
    stateLine:null,       // 'All-State' | 'All-County' | null
    recruitingStars:0,    // 0-5 stars for college recruiting
    recruitingOffers:[],  // array of college names offering scholarships
    scholarshipOffer:null,// accepted scholarship { college, sport, fullRide }
    satScore:null,
    detentions:0,
    suspended:false,
    clubFlags:{},
    injuryHistory:[],
    // HS football specific
    football:{
      position:null,      // QB, RB, WR, TE, LB, DB, etc.
      stats:{ td:0, yds:0, tackles:0, ints:0 },
      allState:false,
      heisman:false,      // won HS equivalent award
    },
    // HS basketball specific
    basketball:{
      position:null,
      stats:{ pts:0, reb:0, ast:0 },
      allState:false,
    },
    uni:{
      enrolled:false, course:'', year:0, gpa:2.5,
      honors:false, clubs:[], hasResearch:false,
      professors:[], classmates:[], discipline:0,
      // College athletics
      sport:null,         // sport id or null
      sportYears:0,
      sportConference:'', // ACC, Big Ten, SEC, Pac-12, etc.
      collegeName:'',
      athleteStatus:null, // null | 'walk-on' | 'scholarship' | 'starter' | 'star' | 'consensus AA'
      athleteStats:{ td:0, yds:0, pts:0, reb:0, ast:0, tackles:0 },
      allConference:false,
      allAmerican:false,
      heisman:false,
      nationalChamp:false,
      draftEligible:false,  // declared for draft
      draftDeclared:false,
      draftRound:null,
      draftPick:null,
      draftTeam:null,
      nflDraftable:false,
      nbaNextStep:false,
      // Frat/Greek life
      frat:null,           // frat name or null
      fratRank:null,       // 'pledge'|'brother'|'officer'|'president'
      fratRep:0,
      // Campus life flags
      campusCrush:null,
      academicProbation:false,
    },
    graduated:false,
    degree:null,
    uniGpa:null,
  },
  // social
  social:{
    clique:null,
    rival:null,
    partyCount:0,
    reputation:50,
    drugFlags:{},     // { substanceId: true/false, substanceId_hooked: true/false }
    dramaFlags:{},
  },
  // health
  medical:{
    conditions:[],
    history:[],
  },
  // social media
  sm:{
    platforms:{},
    totalFame:0,
    totalRevenue:0,
    controversies:0,
    verified:false,
    cancelCount:0,
    collab:[],
    publicist:false,
    prCrisis:0,
    brandDeals:[],
    scandals:[],
    fandom:{ active:false, name:'', size:0, loyalty:50, merchRevenue:0, meetCount:0, stalkerRisk:0 },
    sponsor:{ tier:0, exclusive:false, brand:null, disputes:0 },
    // new
    onlyfans:{ active:false, subs:0, revenue:0, tier:'beginner', postCount:0 },
    podcast:{ active:false, name:'', episodes:0, listeners:0, revenue:0, guests:[] },
    music:{
      active:false, stageName:'', genre:'', subgenre:'',
      tracks:0, albums:0, eps:0, mixtapes:0,
      streams:0, revenue:0,
      label:null, labelTier:0,
      labelContract:null,
      publicOpinion:50, criticalScore:50,
      grammyNoms:0, grammyWins:0,
      instruments:[], instrumentSkill:{},
      isProducer:false, producerCredits:0, producerRevenue:0,
      bandMembers:[], inBand:false, bandName:'',
      beefs:[], controversies:[],
      tourActive:false, tourRevenue:0, tourDates:0,
      fansLost:0, collabs:[],
      chartsHit:0, platinums:0, golds:0,
      comebacks:0, retired:false,
    },
    talkShowAppearances:0,
  },
  // careers / jobs
  career:{
    employed:false,
    jobId:null,
    title:'',
    company:'',
    salary:0,
    level:0,
    years:0,
    performance:50,
    reputation:50,
    hrRisk:0,
    boss:null,
    coworkers:[],
    fired:false,
    bonusRate:0,
    stockUnits:0,
    stockValue:0,
    benefits:{ healthPlan:false, retirement:false },
    milestones:[],
    medSchool:{ enrolled:false, year:0, gpa:3.0, debt:0, completed:false, residency:false },
    lawSchool:{ enrolled:false, year:0, gpa:3.0, debt:0, completed:false, barPassed:false },
    licenses:{ medical:false, law:false },
  },
  // acting
  acting:{
    active:false,
    skill:0,
    hasAgent:false,
    agentTier:0,
    roles:[],
    activeRole:null,
    reputation:50,
    awardsNoms:0,
    awardsWins:0,
    typecastGenre:null,
    overexposed:false,
    filmCount:0,
    tvCount:0,
    streamCount:0,
    franchiseRoles:{},
    totalEarned:0,
    methodActor:false,
    totalProjects:0,
  },
  // nfl career
  nfl:{
    active:false,
    team:null, prevTeams:[],
    position:null,
    jerseyNumber:null,
    year:1,                    // years in league
    age_entered:null,
    contract:{ years:0, totalValue:0, guaranteed:0, perYear:0 },
    freeAgent:false,
    retired:false,
    depth:'bench',
    chemistry:50,
    durability:70,
    injured:false,
    injuryWeeks:0,
    injuryRiskBoost:0,
    skill:50,
    agentFocus:'balanced',
    // stats (career totals)
    stats:{ td:0, yds:0, rec:0, tackles:0, sacks:0, ints:0, rush_yds:0, pass_yds:0, pass_td:0 },
    seasonStats:{ td:0, yds:0, rec:0, tackles:0, sacks:0, ints:0 },
    // accolades
    proBowls:0, allPro:0,
    superBowlWins:0, superBowlMVPs:0,
    mvpAwards:0, offensiveROY:false, defensiveROY:false,
    // off-field
    endorsements:[], endorsementIncome:0,
    fines:0, suspensions:0,
    arrested:false,
    girlfriend:null,          // celeb or athlete partner
    publicImage:70,           // 0-100
    brand:null,               // personal brand name
    foundation:null,          // charity foundation
    // meta
    totalEarned:0,
    injuryHistory:[],
    seasonHistory:[],
    trainingCamp:false,
    holdout:false,
    tradeDemand:false,
  },
  // nba career
  nba:{
    active:false,
    team:null, prevTeams:[],
    position:null,
    jerseyNumber:null,
    year:1,
    age_entered:null,
    contract:{ years:0, totalValue:0, guaranteed:0, perYear:0 },
    freeAgent:false,
    retired:false,
    maxContract:false,
    depth:'bench',
    chemistry:50,
    durability:70,
    injured:false,
    agentFocus:'balanced',
    // stats (season averages)
    stats:{ ppg:0, rpg:0, apg:0, spg:0, bpg:0, fg_pct:0 },
    seasonStats:{ ppg:0, rpg:0, apg:0, spg:0, bpg:0 },
    careerGames:0,
    // accolades
    allStarSelections:0, allNBA:0,
    championshipRings:0, finalsLegend:false, finalsMVPs:0,
    mvpAwards:0, dopy:false, roy:false,  // DPOY, ROY
    scoringTitles:0, tripleDoubles:0,
    // off-field
    endorsements:[], endorsementIncome:0,
    fines:0, suspensions:0,
    girlfriend:null,
    publicImage:70,
    brand:null,
    foundation:null,
    sneakerDeal:null,
    sneakerRevenue:0,
    socialMediaPresence:50,
    // drama
    locker_drama:0,
    tradeDemand:false,
    // meta
    totalEarned:0,
    injuryHistory:[],
    seasonHistory:[],
    g_league:false,           // sent down to G-League
    twoWay:false,             // two-way contract
  },
  // mma career
  mma:{
    active:false,
    gymTier:0,
    discipline:{ bjj:0, wrestling:0, muaythai:0, judo:0, boxing:0 },
    mmaSkill:0,
    conditioning:45,
    fightIQ:40,
    confidence:50,
    injuries:[],
    injured:false,
    recoveryWeeks:0,
    trainingSessionsThisYear:0,
    sparsThisYear:0,
    compsThisYear:0,
    officialFightsThisYear:0,
    amateur:{
      wins:0, losses:0, draws:0,
      byKO:0, bySub:0, byDec:0,
      titleWins:0,
      log:[],
    },
    pro:{
      isPro:false, org:'regional',
      wins:0, losses:0, draws:0,
      byKO:0, bySub:0, byDec:0,
      streak:0,
      ranking:0,
      popularity:18,
      marketability:25,
      controversies:0,
      rivals:[],
      callouts:0,
      hype:0,
      recordLog:[],
      ufc:{
        inUFC:false,
        rank:0,
        wins:0, losses:0, draws:0,
        titleShots:0, titleWins:0, titleDefenses:0,
        interimTitleWins:0,
        champ:false,
        interimChamp:false,
        champWeight:'',
        champWeight2:'',
        doubleChampAttempt:false,
      },
      weightClass:'Lightweight',
      purse:12000,
    },
    totalEarned:0,
  },
  // meta
  darkScore:0,
  totalYears:0,
  proSportsTab:'nfl',
  crime:{
    heat:0,
    notoriety:0,
    record:[],
    log:[],
    skills:{ scam:0, hack:0, violence:0 },
    crew:[],
    currentHeist:null,
    police:{ closeness:0, arrested:false, sentence:0, inPrison:false },
    prison:{ respect:10, fear:10, protection:0, sanity:70, security:'Low', faction:null, guards:{ strict:50, corrupt:20 } },
    gang:{ joined:false, type:null, name:null, colors:'', symbol:'', style:'', territory:1, cred:10, notoriety:5, crew:[], leader:null, affiliation:'', clout:0 },
    drugs:{ active:false, tier:'low', supply:0, model:'street', heatMult:1.0, income:0, risk:0 },
    mafia:{ joined:false, rank:0, fear:10, respect:10, loyalty:40, obedience:50, earnings:0, heat:0,
      rackets:[], crew:[], territory:1, order:null, fronts:0, corruption:0 }
  },
  legal:{
    lawsuits:[],                 // { id, title, amount, severity, yearsOpen, kind }
    finesDue:0,
    probationYears:0,
    criminalStrikes:0,
    lawyer:{
      casesWon:0,
      settlements:0,
      profile:20,
      campaignWins:0,
      electedOffice:null,        // 'District Attorney' | 'Attorney General' | 'Governor'
      officeYears:0,
    },
  },
  gov:{
    approval:50,
    party:'Centrist',
    cycleYear:0,
    policy:{
      taxShift:0,                // basis points-ish in local model
      policing:50,
      justice:50,
      businessClimate:50,
      healthcare:50,
      education:50,
    },
    activeLaw:'Status Quo',
  },
};

// ── UTILS ───────────────────────────────────────────────────────
const rnd   = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick  = a => a[Math.floor(Math.random()*a.length)];
const clamp = v => Math.min(100, Math.max(0, Math.round(v)));
const SAVE_KEY = 'lifesim_save_v2';
const SAVE_VERSION = 2;
const fmt$  = n => {
  if(n<0)      return `-$${Math.abs(n).toLocaleString()}`;
  if(n>=1e6)   return `$${(n/1e6).toFixed(2)}M`;
  if(n>=1e3)   return `$${(n/1e3).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
};
const relLabel = r => r>=85?'Inseparable':r>=70?'Very Close':r>=55?'Good':r>=40?'Decent':r>=25?'Distant':'Strained';
const relColor = r => r>=65?'rel-color-good':r>=40?'rel-color-ok':'rel-color-bad';

const FEDERAL_BRACKETS_SINGLE = [
  [11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24],
  [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
];
const FEDERAL_BRACKETS_MARRIED = [
  [23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24],
  [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
];
const NO_STATE_INCOME_TAX = new Set(['Alaska','Florida','Nevada','South Dakota','Tennessee','Texas','Washington','Wyoming','New Hampshire']);
const SOCIAL_SECURITY_WAGE_CAP = 168600;
const CRYPTO_COIN_META = {
  btc:  { label:'BTC',  vol:0.32, drift:0.12 },
  eth:  { label:'ETH',  vol:0.42, drift:0.14 },
  sol:  { label:'SOL',  vol:0.58, drift:0.16 },
  meme: { label:'MEME', vol:0.9,  drift:0.08 },
};

function ensureFinanceShape(){
  if(!G.finance) G.finance = {};
  if(typeof G.finance.rent!=='number') G.finance.rent = 0;
  if(typeof G.finance.mortgage!=='number') G.finance.mortgage = 0;
  if(typeof G.finance.mortgageYears!=='number') G.finance.mortgageYears = 0;
  if(typeof G.finance.debt!=='number') G.finance.debt = 0;
  if(typeof G.finance.credit!=='number') G.finance.credit = 680;
  if(typeof G.finance.investments!=='number') G.finance.investments = 0;
  if(typeof G.finance.retirement!=='number') G.finance.retirement = 0;
  if(!G.finance.portfolio) G.finance.portfolio = {};
  if(typeof G.finance.portfolio.indexFund!=='number') G.finance.portfolio.indexFund = 0;
  if(typeof G.finance.portfolio.bonds!=='number') G.finance.portfolio.bonds = 0;
  if(typeof G.finance.portfolio.realEstateFund!=='number') G.finance.portfolio.realEstateFund = 0;
  if(typeof G.finance.portfolio.ventureFund!=='number') G.finance.portfolio.ventureFund = 0;
  if(!G.finance.crypto) G.finance.crypto = {};
  if(typeof G.finance.crypto.btc!=='number') G.finance.crypto.btc = 0;
  if(typeof G.finance.crypto.eth!=='number') G.finance.crypto.eth = 0;
  if(typeof G.finance.crypto.sol!=='number') G.finance.crypto.sol = 0;
  if(typeof G.finance.crypto.meme!=='number') G.finance.crypto.meme = 0;
  if(typeof G.finance.crypto.marketCycle!=='string') G.finance.crypto.marketCycle = 'neutral';
  if(typeof G.finance.crypto.marketMomentum!=='number') G.finance.crypto.marketMomentum = 0;
  if(typeof G.finance.crypto.lastYearPnl!=='number') G.finance.crypto.lastYearPnl = 0;
  if(typeof G.finance.crypto.lastEvent!=='string') G.finance.crypto.lastEvent = '';
  if(!G.finance.business) G.finance.business = {};
  if(typeof G.finance.business.active!=='boolean') G.finance.business.active = false;
  if(typeof G.finance.business.name!=='string') G.finance.business.name = '';
  if(typeof G.finance.business.sector!=='string') G.finance.business.sector = '';
  if(typeof G.finance.business.stage!=='string') G.finance.business.stage = 'idea';
  if(typeof G.finance.business.employees!=='number') G.finance.business.employees = 0;
  if(typeof G.finance.business.reputation!=='number') G.finance.business.reputation = 50;
  if(typeof G.finance.business.product!=='number') G.finance.business.product = 45;
  if(typeof G.finance.business.operations!=='number') G.finance.business.operations = 45;
  if(typeof G.finance.business.marketing!=='number') G.finance.business.marketing = 40;
  if(typeof G.finance.business.burn!=='number') G.finance.business.burn = 0;
  if(typeof G.finance.business.cashReserve!=='number') G.finance.business.cashReserve = 0;
  if(typeof G.finance.business.valuation!=='number') G.finance.business.valuation = 0;
  if(typeof G.finance.business.years!=='number') G.finance.business.years = 0;
  if(typeof G.finance.business.lastProfit!=='number') G.finance.business.lastProfit = 0;
  if(typeof G.finance.business.hasInvestor!=='boolean') G.finance.business.hasInvestor = false;
  if(!G.finance.tax) G.finance.tax = {};
  if(typeof G.finance.tax.lastPaid!=='number') G.finance.tax.lastPaid = 0;
  if(typeof G.finance.tax.lastRefund!=='number') G.finance.tax.lastRefund = 0;
  if(typeof G.finance.tax.lastTaxableIncome!=='number') G.finance.tax.lastTaxableIncome = 0;
  if(typeof G.finance.tax.lastEffectiveRate!=='number') G.finance.tax.lastEffectiveRate = 0;
  if(typeof G.finance.tax.lastBracket!=='string') G.finance.tax.lastBracket = 'None';
  if(typeof G.finance.tax.lastStateRate!=='number') G.finance.tax.lastStateRate = 0;
  if(typeof G.finance.tax.delinquentYears!=='number') G.finance.tax.delinquentYears = 0;
  if(!G.finance.tax.lastYearSummary) G.finance.tax.lastYearSummary = null;
  if(typeof G.stress!=='number') G.stress = 35;
}

function ensureGovLegalShape(){
  if(!G.legal) G.legal = {};
  if(!Array.isArray(G.legal.lawsuits)) G.legal.lawsuits = [];
  if(typeof G.legal.finesDue!=='number') G.legal.finesDue = 0;
  if(typeof G.legal.probationYears!=='number') G.legal.probationYears = 0;
  if(typeof G.legal.criminalStrikes!=='number') G.legal.criminalStrikes = 0;
  if(!G.legal.lawyer) G.legal.lawyer = {};
  if(typeof G.legal.lawyer.casesWon!=='number') G.legal.lawyer.casesWon = 0;
  if(typeof G.legal.lawyer.settlements!=='number') G.legal.lawyer.settlements = 0;
  if(typeof G.legal.lawyer.profile!=='number') G.legal.lawyer.profile = 20;
  if(typeof G.legal.lawyer.campaignWins!=='number') G.legal.lawyer.campaignWins = 0;
  if(typeof G.legal.lawyer.electedOffice!=='string') G.legal.lawyer.electedOffice = null;
  if(typeof G.legal.lawyer.officeYears!=='number') G.legal.lawyer.officeYears = 0;

  if(!G.gov) G.gov = {};
  if(typeof G.gov.approval!=='number') G.gov.approval = 50;
  if(typeof G.gov.party!=='string') G.gov.party = 'Centrist';
  if(typeof G.gov.cycleYear!=='number') G.gov.cycleYear = 0;
  if(!G.gov.policy) G.gov.policy = {};
  if(typeof G.gov.policy.taxShift!=='number') G.gov.policy.taxShift = 0;
  if(typeof G.gov.policy.policing!=='number') G.gov.policy.policing = 50;
  if(typeof G.gov.policy.justice!=='number') G.gov.policy.justice = 50;
  if(typeof G.gov.policy.businessClimate!=='number') G.gov.policy.businessClimate = 50;
  if(typeof G.gov.policy.healthcare!=='number') G.gov.policy.healthcare = 50;
  if(typeof G.gov.policy.education!=='number') G.gov.policy.education = 50;
  if(typeof G.gov.activeLaw!=='string') G.gov.activeLaw = 'Status Quo';
}

function runYearStepSafe(label, fn){
  try{
    return fn();
  }catch(err){
    console.error(`Year-step error (${label})`, err);
    try{
      addEv(`A ${label} system hiccup occurred this year. The simulation recovered.`, 'warn');
    }catch(_e){}
    return null;
  }
}

function hasLocalStorage(){
  try{
    return typeof localStorage !== 'undefined';
  }catch(_e){
    return false;
  }
}

function snapshotGameState(){
  return JSON.parse(JSON.stringify(G));
}

function replaceGameState(state){
  if(!state || typeof state!=='object') return false;
  Object.keys(G).forEach(k=>delete G[k]);
  Object.assign(G, state);
  ensureFinanceShape();
  ensureGovLegalShape();
  if(typeof ensureMMAState==='function') ensureMMAState();
  if(typeof ensurePetState==='function') ensurePetState();
  if(!Array.isArray(G.pets)) G.pets = [];
  if(!G.relTab) G.relTab = 'family';
  if(typeof G.stress!=='number') G.stress = 35;
  return true;
}

function refreshSaveUI(){
  if(!hasLocalStorage()) return;
  let hasSave = false;
  try{
    hasSave = !!localStorage.getItem(SAVE_KEY);
  }catch(_e){}
  const cont = document.getElementById('btn-continue');
  const del = document.getElementById('btn-delete-save');
  if(cont){
    cont.style.display = hasSave ? 'inline-flex' : 'none';
  }
  if(del){
    del.style.display = hasSave ? 'inline-flex' : 'none';
  }
}

function saveGame(quiet=false){
  if(!hasLocalStorage()) return false;
  if(!G.firstname || !G.lastname) return false;
  const payload = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    name: `${G.firstname} ${G.lastname}`,
    age: G.age||0,
    state: snapshotGameState(),
  };
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    refreshSaveUI();
    if(!quiet) flash('Game saved 💾','good');
    return true;
  }catch(err){
    console.error('Save failed', err);
    if(!quiet) flash('Save failed (storage issue).','bad');
    return false;
  }
}

function loadGame(){
  if(!hasLocalStorage()){ flash('Local storage unavailable.','bad'); return false; }
  let raw = null;
  try{
    raw = localStorage.getItem(SAVE_KEY);
  }catch(_e){}
  if(!raw){ flash('No saved game found.','warn'); return false; }
  let payload = null;
  try{
    payload = JSON.parse(raw);
  }catch(err){
    console.error('Bad save JSON', err);
    flash('Save file is corrupted.','bad');
    return false;
  }
  if(!payload || !payload.state){
    flash('Invalid save data.','bad');
    return false;
  }
  const ok = replaceGameState(payload.state);
  if(!ok){
    flash('Could not load save.','bad');
    return false;
  }
  document.getElementById('hud').style.display = 'block';
  document.getElementById('tab-bar').style.display = 'flex';
  updateHUD();
  switchTab('life');
  flash(`Loaded ${payload.name||'save'} (age ${payload.age??G.age})`,'good');
  return true;
}

function deleteGameSave(){
  if(!hasLocalStorage()){ flash('Local storage unavailable.','bad'); return; }
  try{
    localStorage.removeItem(SAVE_KEY);
    refreshSaveUI();
    flash('Saved game deleted.','warn');
  }catch(_e){
    flash('Could not delete save.','bad');
  }
}

function calcProgressiveTax(income, brackets){
  const inc = Math.max(0, Math.floor(income));
  let tax = 0;
  let prev = 0;
  for(let i=0;i<brackets.length;i++){
    const cap = brackets[i][0];
    const rate = brackets[i][1];
    if(inc<=prev) break;
    const taxed = Math.min(inc, cap) - prev;
    if(taxed>0) tax += taxed * rate;
    prev = cap;
  }
  return Math.floor(tax);
}

function taxBracketLabel(taxableIncome, married){
  const br = married ? FEDERAL_BRACKETS_MARRIED : FEDERAL_BRACKETS_SINGLE;
  const income = Math.max(0, Math.floor(taxableIncome));
  for(let i=0;i<br.length;i++){
    if(income<=br[i][0]) return `${Math.round(br[i][1]*100)}%`;
  }
  return '37%';
}

function estimateStateIncomeTaxRate(){
  if(!G.state || NO_STATE_INCOME_TAX.has(G.state)) return 0;
  let seed = 0;
  for(let i=0;i<G.state.length;i++) seed += G.state.charCodeAt(i) * (i+3);
  const jitter = (seed % 36) / 1000; // 0.0% to 3.5%
  return Math.min(0.095, 0.028 + jitter);
}

function processAnnualTaxes(ledger, moneyAtYearStart, totalsAtYearStart){
  ensureFinanceShape();

  const creatorIncome = Math.max(0, (G.sm.totalRevenue||0) - (totalsAtYearStart.smRevenue||0));
  const actingIncome  = Math.max(0, (G.acting.totalEarned||0) - (totalsAtYearStart.actingEarned||0));
  const sportsIncome  = Math.max(0,
    ((G.nfl.totalEarned||0) - (totalsAtYearStart.nflEarned||0)) +
    ((G.nba.totalEarned||0) - (totalsAtYearStart.nbaEarned||0)) +
    ((G.mma?.totalEarned||0) - (totalsAtYearStart.mmaEarned||0))
  );
  ledger.creatorIncome += creatorIncome;
  ledger.actingIncome  += actingIncome;
  ledger.sportsIncome  += sportsIncome;

  const trackedIncome = ledger.wages + ledger.bonuses + ledger.creatorIncome + ledger.actingIncome + ledger.sportsIncome + ledger.investmentGains;
  const trackedExpenses = ledger.rentPaid + ledger.mortgagePaid + ledger.utilitiesPaid + ledger.upkeepPaid + ledger.debtInterest + ledger.retirementContrib + ledger.propertyTax;
  const cashDelta = G.money - moneyAtYearStart;
  const untrackedNet = cashDelta - (trackedIncome - trackedExpenses);
  if(untrackedNet>0) ledger.otherIncome += Math.floor(untrackedNet);

  const ordinaryIncome = ledger.wages + ledger.bonuses + ledger.creatorIncome + ledger.actingIncome + ledger.sportsIncome + ledger.otherIncome;
  const grossIncome = ordinaryIncome + ledger.investmentGains;
  const married = !!G.spouse;
  const standardDeduction = married ? 29200 : 14600;
  const retirementDeduction = Math.min(23000, ledger.retirementContrib);
  const mortgageInterestDeduction = Math.floor(Math.max(0, ledger.mortgagePaid) * 0.32);
  const totalDeductions = standardDeduction + retirementDeduction + mortgageInterestDeduction;
  const taxableOrdinary = Math.max(0, ordinaryIncome - totalDeductions);

  const fedBrackets = married ? FEDERAL_BRACKETS_MARRIED : FEDERAL_BRACKETS_SINGLE;
  const federalTax = calcProgressiveTax(taxableOrdinary, fedBrackets);
  const stateRate = estimateStateIncomeTaxRate();
  const govTaxAdj = (G.gov?.policy?.taxShift||0) / 1000;
  const stateTax = Math.floor(taxableOrdinary * stateRate);
  const payrollTax = Math.floor(Math.min(SOCIAL_SECURITY_WAGE_CAP, ledger.wages + ledger.bonuses) * (0.0765 + Math.max(-0.01, Math.min(0.01, govTaxAdj/3))));
  const capitalGainsTax = Math.floor(Math.max(0, ledger.investmentGains) * 0.15);
  const surtax = Math.floor(Math.max(0, taxableOrdinary) * Math.max(-0.02, Math.min(0.03, govTaxAdj)));

  const dependents = (G.children||[]).filter(ch=>ch && ch.alive!==false && ch.age<17).length;
  const childCredit = dependents * 1200;
  const educationCredit = (G.school.uni.enrolled || G.career.medSchool.enrolled || G.career.lawSchool.enrolled) ? 1000 : 0;
  const lowIncomeCredit = grossIncome>0 && grossIncome<26000 ? 450 : 0;
  const totalCredits = childCredit + educationCredit + lowIncomeCredit;

  const totalBeforeCredits = federalTax + stateTax + payrollTax + capitalGainsTax + surtax;
  const totalTax = Math.max(0, totalBeforeCredits - totalCredits);
  let refund = 0;
  let taxDebtLoaded = 0;

  if(totalTax>0){
    G.money -= totalTax;
    if(G.money<0){
      taxDebtLoaded = Math.abs(G.money);
      G.money = 0;
      const withPenalty = Math.floor(taxDebtLoaded * 1.15);
      G.finance.debt += withPenalty;
      G.finance.credit = Math.max(300, G.finance.credit - rnd(18,38));
      G.finance.tax.delinquentYears++;
      addEv(`Tax season hit hard. You couldn't cover ${fmt$(taxDebtLoaded)} and rolled ${fmt$(withPenalty)} into debt with penalties.`, 'bad');
    } else {
      G.finance.tax.delinquentYears = Math.max(0, G.finance.tax.delinquentYears-1);
    }
    addEv(`Taxes filed: paid ${fmt$(totalTax)} on ${fmt$(grossIncome)} income (${(grossIncome>0?(totalTax/grossIncome)*100:0).toFixed(1)}% effective).`, totalTax>Math.max(20000, grossIncome*0.22)?'warn':'');
  } else if(totalCredits>0){
    refund = Math.floor(totalCredits * 0.25);
    if(refund>0){
      G.money += refund;
      addEv(`Taxes filed: deductions and credits wiped your bill. Refund received: ${fmt$(refund)}.`, 'good');
    } else {
      addEv('Taxes filed: no tax owed this year after deductions and credits.', 'good');
    }
  }

  G.finance.tax.lastPaid = totalTax;
  G.finance.tax.lastRefund = refund;
  G.finance.tax.lastTaxableIncome = taxableOrdinary + Math.max(0, ledger.investmentGains);
  G.finance.tax.lastEffectiveRate = grossIncome>0 ? totalTax / grossIncome : 0;
  G.finance.tax.lastBracket = taxBracketLabel(taxableOrdinary, married);
  G.finance.tax.lastStateRate = stateRate;
  G.finance.tax.lastYearSummary = {
    grossIncome,
    ordinaryIncome,
    taxableOrdinary,
    deductions:totalDeductions,
    federalTax,
    stateTax,
    payrollTax,
    capitalGainsTax,
    surtax,
    propertyTax:ledger.propertyTax,
    credits:totalCredits,
    paid:totalTax,
    refund,
    taxDebtLoaded,
    effectiveRate:grossIncome>0 ? totalTax/grossIncome : 0,
  };
}

function portfolioPrincipal(){
  ensureFinanceShape();
  const p = G.finance.portfolio;
  return (G.finance.investments||0) + (p.indexFund||0) + (p.bonds||0) + (p.realEstateFund||0) + (p.ventureFund||0);
}

function processInvestmentAndCryptoYear(ledger){
  ensureFinanceShape();
  const p = G.finance.portfolio;
  // Legacy bucket stays as a simple broad market fund.
  if(G.finance.investments>0){
    const pct = rnd(-5,12)/100;
    const delta = Math.floor(G.finance.investments * pct);
    G.finance.investments = Math.max(0, G.finance.investments + delta);
    if(delta>=0){
      ledger.investmentGains += delta;
      addEv(`Investments gained ${fmt$(delta)} this year.`, 'good');
    } else {
      addEv(`Investments lost ${fmt$(Math.abs(delta))} this year.`, 'warn');
      G.stress = clamp(G.stress + rnd(1,3));
    }
  }

  const buckets = [
    { key:'indexFund', label:'Index fund', min:-0.08, max:0.14, stress:1 },
    { key:'bonds', label:'Bond fund', min:-0.02, max:0.07, stress:0 },
    { key:'realEstateFund', label:'REIT fund', min:-0.12, max:0.18, stress:2 },
    { key:'ventureFund', label:'Venture fund', min:-0.35, max:0.45, stress:4 },
  ];
  buckets.forEach(b=>{
    const value = p[b.key]||0;
    if(value<=0) return;
    const pct = rnd(Math.floor(b.min*100), Math.floor(b.max*100))/100;
    const delta = Math.floor(value * pct);
    p[b.key] = Math.max(0, value + delta);
    if(delta>=0){
      ledger.investmentGains += delta;
      if(delta>500) addEv(`${b.label} returned ${fmt$(delta)} this year.`, 'good');
    } else if(Math.abs(delta)>500){
      addEv(`${b.label} fell ${fmt$(Math.abs(delta))} this year.`, 'warn');
      G.stress = clamp(G.stress + b.stress);
    }
  });

  const c = G.finance.crypto;
  const momentumShift = rnd(-28,28)/100;
  c.marketMomentum = Math.max(-0.65, Math.min(0.75, (c.marketMomentum||0)*0.45 + momentumShift*0.55));
  c.marketCycle = c.marketMomentum>0.28?'bull':c.marketMomentum<-0.28?'bear':Math.abs(c.marketMomentum)<0.09?'neutral':c.marketMomentum>0?'recovery':'cooldown';
  let cryptoPnl = 0;
  Object.keys(CRYPTO_COIN_META).forEach(id=>{
    const val = c[id]||0;
    if(val<=0) return;
    const m = CRYPTO_COIN_META[id];
    const cyc = c.marketCycle==='bull'?0.25:c.marketCycle==='recovery'?0.12:c.marketCycle==='bear'?-0.27:c.marketCycle==='cooldown'?-0.11:0;
    const pct = Math.max(-0.88, m.drift + cyc + c.marketMomentum + (rnd(-100,100)/100)*m.vol);
    const delta = Math.floor(val * pct);
    c[id] = Math.max(0, val + delta);
    cryptoPnl += delta;
  });
  c.lastYearPnl = cryptoPnl;
  if(cryptoPnl>0){
    ledger.investmentGains += cryptoPnl;
    if(cryptoPnl>2000) addEv(`Crypto portfolio rallied in a ${c.marketCycle} market: +${fmt$(cryptoPnl)}.`, 'good');
  } else if(cryptoPnl<0){
    addEv(`Crypto drawdown this year: ${fmt$(Math.abs(cryptoPnl))}. Market regime: ${c.marketCycle}.`, Math.abs(cryptoPnl)>6000?'bad':'warn');
    G.stress = clamp(G.stress + (Math.abs(cryptoPnl)>6000 ? rnd(6,12) : rnd(2,6)));
  }
}

function processBusinessYear(ledger){
  ensureFinanceShape();
  const b = G.finance.business;
  if(!b.active) return;
  b.years++;
  const scale = 1 + b.employees*0.14 + Math.max(0,b.reputation-50)/130 + Math.max(0,b.product-45)/120 + Math.max(0,b.marketing-40)/160;
  const sectorMul =
    b.sector==='SaaS' ? 1.18 :
    b.sector==='E-commerce' ? 1.1 :
    (b.sector==='Fintech' || b.sector==='FinTech') ? 1.14 :
    (b.sector==='Media' || b.sector==='Media Brand') ? 1.06 :
    (b.sector==='Consumer' || b.sector==='Consumer Goods') ? 1.04 : 1;
  const revenue = Math.floor(rnd(30000,120000) * scale * sectorMul);
  const opex = Math.floor(12000 + b.burn + b.employees*rnd(7000,19000) + rnd(5000,24000));
  let profit = revenue - opex;
  if(Math.random()<0.14){
    const shock = Math.floor(revenue * rnd(10,28)/100);
    profit -= shock;
    addEv(`${b.name||'Your company'} had a rough quarter and unexpected costs of ${fmt$(shock)}.`, 'warn');
    G.stress = clamp(G.stress + rnd(3,7));
  }
  if(Math.random()<0.11){
    const boost = Math.floor(revenue * rnd(8,22)/100);
    profit += boost;
    addEv(`${b.name||'Your company'} landed a strong growth push worth ${fmt$(boost)}.`, 'good');
  }
  b.cashReserve += profit;
  b.lastProfit = profit;
  b.operations = clamp(b.operations + rnd(-2,3));
  b.product = clamp(b.product + rnd(-1,2));
  b.marketing = clamp(b.marketing + rnd(-2,3));
  b.reputation = clamp(b.reputation + rnd(-2,4) + (profit>0?1:-1));
  b.stage = b.cashReserve>2000000?'scale':b.cashReserve>500000?'growth':b.cashReserve>120000?'early traction':'idea';
  b.valuation = Math.max(0, Math.floor((Math.max(0,revenue) * (2.2 + b.reputation/80)) + b.cashReserve * 1.4));

  if(profit>0){
    const founderPay = Math.floor(profit * (b.hasInvestor?0.18:0.26));
    G.money += founderPay;
    ledger.otherIncome += founderPay;
    if(founderPay>0) addEv(`${b.name||'Your company'} paid you ${fmt$(founderPay)} this year.`, 'good');
    G.stress = clamp(G.stress - rnd(1,4));
  } else {
    G.stress = clamp(G.stress + rnd(4,9));
  }

  if(b.cashReserve < -120000){
    const bailout = Math.floor(Math.abs(b.cashReserve) * 1.12);
    G.finance.debt += bailout;
    b.active = false;
    b.cashReserve = 0;
    b.employees = 0;
    addEv(`${b.name||'Your company'} ran out of runway. It shut down and left ${fmt$(bailout)} in debt obligations.`, 'bad');
  }
}

function processGovernmentYear(){
  ensureGovLegalShape();
  const g = G.gov;
  const p = g.policy;
  const L = G.legal;
  g.cycleYear++;

  // Sitting office bonuses/risks
  if(L.lawyer.electedOffice){
    L.lawyer.officeYears++;
    const officePay =
      L.lawyer.electedOffice==='Governor' ? rnd(140000,230000) :
      L.lawyer.electedOffice==='Attorney General' ? rnd(120000,190000) :
      rnd(90000,160000);
    G.money += officePay;
    if(Math.random()<0.14){
      g.approval = clamp(g.approval - rnd(6,14));
      G.stress = clamp((G.stress||35) + rnd(3,8));
      addEv(`A political controversy hit your office. Approval dropped sharply.`, 'warn');
    } else {
      g.approval = clamp(g.approval + rnd(1,5));
    }
  }

  // Election cycle every 4 years
  if(g.cycleYear%4===0){
    const parties = ['Centrist','Progressive','Conservative'];
    const winRoll = Math.random();
    if(winRoll<0.35) g.party = 'Progressive';
    else if(winRoll<0.7) g.party = 'Centrist';
    else g.party = 'Conservative';

    if(g.party==='Progressive'){
      p.taxShift = Math.max(-25, Math.min(25, p.taxShift + rnd(2,8)));
      p.policing = clamp(p.policing - rnd(2,6));
      p.justice = clamp(p.justice + rnd(3,8));
      p.businessClimate = clamp(p.businessClimate - rnd(1,4));
      p.healthcare = clamp(p.healthcare + rnd(4,9));
      p.education = clamp(p.education + rnd(3,8));
      g.activeLaw = pick(['Justice Reform Act','Consumer Protection Expansion','Public Healthcare Boost']);
    } else if(g.party==='Conservative'){
      p.taxShift = Math.max(-25, Math.min(25, p.taxShift - rnd(2,8)));
      p.policing = clamp(p.policing + rnd(3,9));
      p.justice = clamp(p.justice - rnd(2,7));
      p.businessClimate = clamp(p.businessClimate + rnd(3,8));
      p.healthcare = clamp(p.healthcare - rnd(2,6));
      p.education = clamp(p.education - rnd(1,5));
      g.activeLaw = pick(['Business Incentive Package','Mandatory Minimum Expansion','Tax Relief Bill']);
    } else {
      p.taxShift = Math.max(-25, Math.min(25, p.taxShift + rnd(-3,3)));
      p.policing = clamp(p.policing + rnd(-3,3));
      p.justice = clamp(p.justice + rnd(-3,3));
      p.businessClimate = clamp(p.businessClimate + rnd(-3,3));
      p.healthcare = clamp(p.healthcare + rnd(-3,3));
      p.education = clamp(p.education + rnd(-3,3));
      g.activeLaw = pick(['Bipartisan Budget Deal','Infrastructure & Services Act','Administrative Reform Bill']);
    }

    addEv(`Election year: ${g.party} coalition took power. New law passed: ${g.activeLaw}.`, 'warn');
    if(g.party==='Conservative' && L.lawyer.electedOffice && Math.random()<0.22){
      g.approval = clamp(g.approval - rnd(5,11));
    }
  }
}

function processLegalYear(){
  ensureGovLegalShape();
  const L = G.legal;
  const p = G.gov.policy;

  // Build legal risk from crime/business/controversy
  let legalRisk = 0;
  legalRisk += (G.crime.heat||0) / 120;
  legalRisk += (G.finance.business?.active ? 0.08 : 0);
  legalRisk += Math.min(0.18, (G.sm.controversies||0) * 0.02);
  legalRisk += (p.policing-50) / 420;
  legalRisk = Math.max(0, legalRisk);

  if(Math.random() < legalRisk){
    const demand = rnd(5000, 120000);
    const sev = rnd(1,5);
    const kind = pick(['Civil suit','Contract dispute','Regulatory action','Defamation claim']);
    L.lawsuits.push({
      id:`lawsuit_${G.age}_${Math.random().toString(36).slice(2,7)}`,
      title:kind,
      amount:demand,
      severity:sev,
      yearsOpen:0,
      kind,
    });
    addEv(`Legal trouble: ${kind} filed against you (${fmt$(demand)} exposure).`, 'warn');
  }

  // Process open lawsuits
  L.lawsuits = (L.lawsuits||[]).filter(s=>s && s.amount>0);
  const stillOpen = [];
  L.lawsuits.forEach(s=>{
    s.yearsOpen = (s.yearsOpen||0)+1;
    const lawyerBoost = (G.career.licenses?.law ? 0.1 : 0) + Math.min(0.18, (L.lawyer.casesWon||0)*0.01);
    const settleChance = Math.max(0.14, 0.3 + lawyerBoost - s.severity*0.03);
    if(Math.random()<settleChance){
      const payout = Math.floor(s.amount * rnd(45,95)/100);
      if(G.money>=payout){
        G.money -= payout;
      } else {
        const short = payout - Math.max(0,G.money);
        G.money = 0;
        G.finance.debt += Math.floor(short * 1.12);
      }
      addEv(`Resolved ${s.kind} for ${fmt$(payout)}.`, payout>50000?'bad':'warn');
      G.stress = clamp((G.stress||35) + rnd(2,7));
    } else if(s.yearsOpen>=3){
      const fine = Math.floor(s.amount * rnd(70,120)/100);
      L.finesDue += fine;
      addEv(`${s.kind} escalated to judgment. Fine imposed: ${fmt$(fine)}.`, 'bad');
      G.stress = clamp((G.stress||35) + rnd(6,12));
    } else {
      stillOpen.push(s);
    }
  });
  L.lawsuits = stillOpen;

  // Fines/probation mechanics
  if(L.finesDue>0){
    const payment = Math.min(L.finesDue, Math.max(0, Math.floor(G.money*0.35)));
    if(payment>0){
      G.money -= payment;
      L.finesDue -= payment;
      addEv(`Court-ordered fine payment: ${fmt$(payment)}. Remaining: ${fmt$(L.finesDue)}.`, 'warn');
    } else {
      L.probationYears += 1;
      addEv('Unpaid legal fines triggered an added year of probation.', 'bad');
    }
  }
  if(L.probationYears>0){
    L.probationYears = Math.max(0, L.probationYears-1);
    G.stress = clamp((G.stress||35) + rnd(2,6));
    if(Math.random()<0.2){
      G.happy = clamp(G.happy - rnd(2,6));
      addEv('Probation restrictions made this year harder.', 'warn');
    }
  }
}

// ── FLASH TOAST ─────────────────────────────────────────────────
let _flashTimer;
function flash(msg, type='good'){
  const el = document.getElementById('flash');
  el.textContent = msg;
  el.style.borderColor = type==='bad'?'var(--danger)':type==='warn'?'var(--gold)':type==='good'?'var(--accent)':'var(--accent2)';
  el.classList.add('show');
  clearTimeout(_flashTimer);
  _flashTimer = setTimeout(()=>el.classList.remove('show'), 2800);
}

// ── POPUP ──────────────────────────────────────────────────────
function showPopup(title, body, actions, tone='normal'){
  const overlay = document.getElementById('popup-overlay');
  const t = document.getElementById('popup-title');
  const b = document.getElementById('popup-body');
  const a = document.getElementById('popup-actions');
  const card = overlay.querySelector('.popup-card');
  if(!overlay||!t||!b||!a) return;
  t.textContent = title;
  b.textContent = body;
  a.innerHTML = '';
  if(card){
    card.classList.toggle('dark', tone==='dark');
  }
  actions.forEach(act=>{
    const btn = document.createElement('button');
    btn.className = `btn ${act.cls||'btn-ghost'}`;
    btn.textContent = act.label;
    if(act.disabled){
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    } else {
      btn.onclick = ()=>{ overlay.style.display='none'; act.onClick&&act.onClick(); };
    }
    a.appendChild(btn);
  });
  overlay.style.display = 'flex';
}

function showPopupHTML(title, html, actions, tone='normal'){
  const overlay = document.getElementById('popup-overlay');
  const t = document.getElementById('popup-title');
  const b = document.getElementById('popup-body');
  const a = document.getElementById('popup-actions');
  const card = overlay.querySelector('.popup-card');
  if(!overlay||!t||!b||!a) return;
  t.textContent = title;
  b.innerHTML = html;
  a.innerHTML = '';
  if(card){
    card.classList.toggle('dark', tone==='dark');
  }
  actions.forEach(act=>{
    const btn = document.createElement('button');
    btn.className = `btn ${act.cls||'btn-ghost'}`;
    btn.textContent = act.label;
    if(act.disabled){
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    } else {
      btn.onclick = ()=>{ overlay.style.display='none'; act.onClick&&act.onClick(); };
    }
    a.appendChild(btn);
  });
  overlay.style.display = 'flex';
}

function die(reason){
  showPopup('You Died', reason, [
    { label:'See Legacy', cls:'btn-primary', onClick:()=>showDeath() }
  ], 'dark');
}

// ── NAV ─────────────────────────────────────────────────────────
function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function switchTab(t){
  if(G.crime?.police?.inPrison && t!=='crime'){
    flash('You are in prison. Other tabs are locked.','warn');
    goTo('screen-crime');
    renderCrime();
    return;
  }
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  const tabEl = document.getElementById('tab-'+t);
  if(tabEl) tabEl.classList.add('active');
  const map = {
    life:          'screen-life',
    relationships: 'screen-relationships',
    school:        'screen-school',
    social:        'screen-social',
    media:         'screen-media',
    crime:         'screen-crime',
    jobs:          'screen-jobs',
    acting:        'screen-acting',
    prosports:     'screen-prosports',
    activities:    'screen-activities',
    health:        'screen-health',
  };
  if(map[t]) goTo(map[t]);
  if(t==='life')          renderLife();
  if(t==='relationships') renderRelationships();
  if(t==='school')        renderSchool();
  if(t==='social')        renderSocial();
  if(t==='media')         renderMedia();
  if(t==='crime')         renderCrime();
  if(t==='jobs')          renderJobs();
  if(t==='acting')        renderActing();
  if(t==='prosports')     renderProSports();
  if(t==='activities')    renderActivities();
  if(t==='health')        renderHealth();
}

// ── HUD ─────────────────────────────────────────────────────────
function updateHUD(){
  const sym = G.gender==='male'?'♂':G.gender==='female'?'♀':'⚧';
  document.getElementById('hud-name').textContent  = `${G.firstname} ${G.lastname}`;
  document.getElementById('hud-meta').textContent  = `${sym} · ${G.state}`;
  document.getElementById('hud-age').textContent   = G.age;
  document.getElementById('hud-money').textContent = `💵 ${fmt$(G.money)}`;
  document.getElementById('hud-bars').innerHTML =
    statBar('Health', G.health, 'bar-h') +
    statBar('Happy',  G.happy,  'bar-p') +
    statBar('Smarts', G.smarts, 'bar-s') +
    statBar('Looks',  G.looks,  'bar-l') +
    statBar('Stress', G.stress, 'bar-stress');
}

function statBar(label, val, cls){
  const v = clamp(val);
  return `<div class="stat-row">
    <div class="stat-lbl">${label}</div>
    <div class="stat-track"><div class="stat-fill ${cls}" style="width:${v}%"></div></div>
    <div class="stat-num">${v}</div>
  </div>`;
}

// ── EVENTS ──────────────────────────────────────────────────────
function addEv(text, type=''){
  const ev = {text, type};
  G.lifeEvents.push(ev);
  G.yearEvents.push(ev);
  // Track darkness
  if(type==='bad') G.darkScore++;
}

// ── PERSON FACTORY ──────────────────────────────────────────────
// ── CAREER / STATUS BANK ────────────────────────────────────────
// Used for family, friends, lovers, children once they're adult
const CAREERS_COMMON = [
  'Teacher','Nurse','Accountant','Retail Manager','Truck Driver','Construction Worker',
  'Chef','Office Administrator','Mechanic','Sales Rep','Security Guard','Cleaner',
  'Delivery Driver','Barista','Warehouse Worker','Receptionist','Data Entry Clerk',
  'Social Worker','Paramedic','Electrician','Plumber','Hair Stylist','Cashier',
  'Bank Teller','Insurance Agent','Librarian','Dental Hygienist','Real Estate Agent',
  'Personal Trainer','Graphic Designer','Web Developer','Marketing Coordinator',
  'HR Manager','Journalist','Photographer','Pharmacist','Physical Therapist',
];
const CAREERS_PRESTIGE = [
  'Doctor','Lawyer','Software Engineer','Investment Banker','Professor','Architect',
  'Surgeon','CEO','CFO','Politician','Judge','Pilot','Astronaut','Neuroscientist',
];
const CAREERS_CREATIVE = [
  'Actor','Musician','Writer','Artist','Filmmaker','Fashion Designer','Comedian',
  'YouTuber','Podcaster','Tattoo Artist','Interior Designer','Game Developer',
];
const CAREERS_RARE = [
  'Professional Athlete','Grammy-Winning Artist','Oscar-Winning Actor',
  'Billionaire Entrepreneur','Rockstar','Famous Chef','Olympian',
];

function randomCareer(){
  const r = Math.random();
  if(r < 0.60) return pick(CAREERS_COMMON);
  if(r < 0.82) return pick(CAREERS_PRESTIGE);
  if(r < 0.95) return pick(CAREERS_CREATIVE);
  return pick(CAREERS_RARE);
}

function personStatus(p){
  // Returns a short status string for display beside a person
  if(!p.alive) return '✝ Deceased';
  const a = p.age || 0;
  if(a < 5)  return '🍼 Toddler';
  if(a < 11) return '🎒 Elementary School';
  if(a < 14) return '📚 Middle School';
  if(a < 18) return '🏫 High School';
  if(p.uniEnrolled) return `🎓 University (${p.uniCourse||'Undeclared'})`;
  if(p.career) return `💼 ${p.career}`;
  if(a < 22) return '🔍 Finding their way';
  return '💼 Working';
}

function assignAdultCareer(p){
  if(!p.career && p.age >= 18 && !p.uniEnrolled){
    p.career = randomCareer();
  }
}

function makePerson(role, gender){
  const g  = gender || pick(['male','female']);
  const fn = g==='male' ? pick(NM) : pick(NF);
  return {
    name: `${fn} ${pick(NS)}`,
    firstName: fn,
    gender: g,
    role,
    relation: rnd(40,80),
    alive: true,
    age: 0,
    career: null,
    uniEnrolled: false,
    uniCourse: '',
    anniversaryYear: null,   // for spouse
    traits: [],
    compat: rnd(30,90),
  };
}

function genFamily(){
  const fam = [];
  const dad = makePerson('Father','male');
  dad.name = `${dad.firstName} ${G.lastname}`;
  dad.age = rnd(22,38); dad.relation = rnd(55,95);
  dad.career = randomCareer();
  dad.traits = pickTraits(3);
  fam.push(dad);

  const mom = makePerson('Mother','female');
  mom.name = `${mom.firstName} ${G.lastname}`;
  mom.age = rnd(20,36); mom.relation = rnd(55,95);
  mom.career = randomCareer();
  mom.traits = pickTraits(3);
  fam.push(mom);

  // Grandparents (dad's side)
  if(Math.random()<0.8){
    const gpd = makePerson('Grandfather','male');
    gpd.name = `${gpd.firstName} ${G.lastname}`;
    gpd.age  = rnd(55,80); gpd.relation = rnd(40,85);
    gpd.career = rnd(0,1)?'Retired '+randomCareer():'Retired';
    gpd.alive  = gpd.age < 78 || Math.random()>0.45;
    gpd.traits = pickTraits(2);
    fam.push(gpd);
  }
  if(Math.random()<0.75){
    const gmd = makePerson('Grandmother','female');
    gmd.name = `${gmd.firstName} ${G.lastname}`;
    gmd.age  = rnd(53,78); gmd.relation = rnd(45,90);
    gmd.career = 'Retired';
    gmd.alive  = gmd.age < 80 || Math.random()>0.4;
    gmd.traits = pickTraits(2);
    fam.push(gmd);
  }
  // Mom's side grandparents
  if(Math.random()<0.7){
    const gpm = makePerson('Grandfather','male');
    gpm.name  = `${gpm.firstName} ${pick(NS)}`;
    gpm.age   = rnd(55,82); gpm.relation = rnd(35,80);
    gpm.career= 'Retired';
    gpm.alive = gpm.age < 79 || Math.random()>0.5;
    gpm.traits = pickTraits(2);
    fam.push(gpm);
  }
  if(Math.random()<0.72){
    const gmm = makePerson('Grandmother','female');
    gmm.name  = `${gmm.firstName} ${pick(NS)}`;
    gmm.age   = rnd(52,79); gmm.relation = rnd(40,88);
    gmm.career= 'Retired';
    gmm.alive = gmm.age < 81 || Math.random()>0.42;
    gmm.traits = pickTraits(2);
    fam.push(gmm);
  }

  const sibCount = rnd(0,3);
  for(let i=0;i<sibCount;i++){
    const s = makePerson('Sibling');
    s.name = `${s.firstName} ${G.lastname}`;
    s.age  = rnd(0,14); s.relation = rnd(30,75);
    if(s.age>=18) s.career = randomCareer();
    s.traits = inheritTraits(dad, mom);
    fam.push(s);
  }
  return fam;
}

// ── AGE UP ENGINE ────────────────────────────────────────────────
function ageUp(){
  ensureFinanceShape();
  ensureGovLegalShape();
  if(typeof ensureMMAState==='function') ensureMMAState();
  G.age++;
  G.yearEvents = [];
  G.totalYears++;
  const a = G.age;
  const moneyAtYearStart = G.money;
  const totalsAtYearStart = {
    smRevenue: G.sm.totalRevenue||0,
    actingEarned: G.acting.totalEarned||0,
    nflEarned: G.nfl.totalEarned||0,
    nbaEarned: G.nba.totalEarned||0,
    mmaEarned: G.mma?.totalEarned||0,
  };
  const yearLedger = {
    wages:0, bonuses:0,
    creatorIncome:0, actingIncome:0, sportsIncome:0, investmentGains:0, otherIncome:0,
    rentPaid:0, mortgagePaid:0, utilitiesPaid:0, upkeepPaid:0, debtInterest:0, propertyTax:0,
    retirementContrib:0,
  };

  // ── Passive stat drift ───────────────────────────────────────
  if(a>40) G.health = clamp(G.health - rnd(0,2));
  if(a>60) G.health = clamp(G.health - rnd(0,3));
  G.happy  = clamp(G.happy  + rnd(-4,5));
  G.smarts = clamp(G.smarts + rnd(-1,2));
  G.stress = clamp((G.stress||35) + rnd(-3,4));
  if(a<25)      G.looks = clamp(G.looks + rnd(0,2));
  else if(a>32) G.looks = clamp(G.looks - rnd(0,2));

  // ── School stage progression ─────────────────────────────────
  if(a===5)  { G.school.stage='elementary'; G.school.grade=1; addEv('You started elementary school. Everything feels huge.'); }
  if(a===11) { G.school.stage='middle';     G.school.grade=6; addEv('Middle school starts. The social hierarchy assembles.'); }
  if(a===14) { G.school.stage='high';       G.school.grade=9; addEv('High school. Freshman year. Survival mode: on.'); }
  if(a>=5  && a<=10) G.school.grade = a-4;
  if(a>=11 && a<=13) G.school.grade = a-5;
  if(a>=14 && a<=17) G.school.grade = a-5;

  // ── Milestones ───────────────────────────────────────────────
  if(a===16) addEv('You got your driver\'s license. Freedom. Near-misses. Petrol costs.');
  if(a===18) addEv('You turned 18. A legal adult. The future: open road or cliff edge, TBD.');
  if(a===21) addEv('You turned 21. You can finally do everything you\'ve already been doing, legally.');
  if(a===30) addEv('Welcome to your 30s. Life gets serious. Also genuinely better.');
  if(a===40) addEv('Middle age arrives. You answer the door. You\'re wiser than you look.');
  if(a===65) addEv('Retirement age. Time is finally yours to burn.');
  if(a===80) addEv('You\'ve outlived most. Every day is a real gift now.');

  // ── Family aging & mortality ─────────────────────────────────
  G.family.forEach(p => {
    if(p.age) p.age++;
    assignAdultCareer(p);
    const deathAge = (p.role==='Grandfather'||p.role==='Grandmother') ? 74 : 72;
    const deathChance = (p.role==='Grandfather'||p.role==='Grandmother') ? .07 : .045;
    if(p.alive && p.age > deathAge && Math.random() < deathChance){
      p.alive = false;
      G.happy = clamp(G.happy - rnd(12,20));
      addEv(`${p.firstName} passed away. The world got quieter.`, 'bad');
    }
  });

  // ── Step-family dynamics ─────────────────────────────────────
  if(a>=14 && !G.familyFlags.parentsDivorced){
    const parentsAlive = G.family.some(p=>p.role==='Father'&&p.alive) && G.family.some(p=>p.role==='Mother'&&p.alive);
    if(parentsAlive && Math.random()<0.03){
      G.familyFlags.parentsDivorced = true;
      addEv('Your parents separated. The house felt different after that.', 'bad');
    }
  }
  if(G.familyFlags.parentsDivorced && !G.familyFlags.stepFamilyAdded && Math.random()<0.25){
    G.familyFlags.stepFamilyAdded = true;
    const stepRole = Math.random()<0.5 ? 'Stepfather' : 'Stepmother';
    const step = makePerson(stepRole, stepRole==='Stepfather'?'male':'female');
    step.age = rnd(28,45); step.relation = rnd(35,70); step.traits = pickTraits(2);
    G.family.push(step);
    if(Math.random()<0.5){
      const ss = makePerson('Step-Sibling');
      ss.age = rnd(5,18); ss.relation = rnd(20,60); ss.traits = pickTraits(2);
      G.family.push(ss);
    }
    addEv('A step-family member joined your life. Adjustments followed.', 'warn');
  }

  // ── Children aging ───────────────────────────────────────────
  G.children.forEach(c => {
    c.age++;
    if(c.custody==='other' && Math.random()<0.25){
      c.relation = clamp(c.relation - rnd(2,6));
      addEv(`Co‑parenting with ${c.firstName} was tough this year.`, 'warn');
    }
    if(c.age===5)  addEv(`${c.firstName} started school. They're growing up fast.`,'love');
    if(c.age===13) addEv(`${c.firstName} hit their teenage years. Everything is dramatic now.`,'warn');
    if(c.age===18){
      assignAdultCareer(c);
      addEv(`${c.firstName} turned 18. They're an adult. Officially your problem in a different way.`,'love');
    }
    if(c.age>=18 && Math.random()<0.06 && !c.uniEnrolled && !c.career){
      const courses=['Medicine','Law','Engineering','Business','Computer Science','Arts','Psychology'];
      c.uniEnrolled=true; c.uniCourse=pick(courses);
      G.happy=clamp(G.happy+rnd(6,12));
      addEv(`${c.firstName} got accepted to university studying ${c.uniCourse}! ${G.money>=20000?'They asked about tuition.':''}`,'love');
      if(G.money>=20000 && Math.random()<0.5){
        G.money-=rnd(8000,20000);
        addEv(`You contributed to ${c.firstName}'s tuition. Worth every cent.`,'good');
      }
    }
    if(c.uniEnrolled && Math.random()<0.25){
      // uni progress
      c.uniYear = (c.uniYear||1) + 1;
      if(c.uniYear>4){ c.uniEnrolled=false; c.career=randomCareer(); addEv(`${c.firstName} graduated! Now working as a ${c.career}.`,'love'); }
    }
    assignAdultCareer(c);
    // mortality for older children (adults)
    if(c.alive && c.age>70 && Math.random()<0.04){
      c.alive=false; G.happy=clamp(G.happy-rnd(20,30));
      addEv(`${c.firstName} passed away. A parent should never outlive their child.`,'bad');
    }
  });

  // ── Pets aging, care costs, companionship ─────────────────────
  if(!Array.isArray(G.pets)) G.pets = [];
  G.pets.forEach(p=>{
    if(!p || !p.alive) return;
    p.age = (p.age||0) + 1;
    p.health = clamp((p.health??70) + rnd(-3,2));
    p.happiness = clamp((p.happiness??65) + rnd(-4,3));
    p.bond = clamp((p.bond??55) + (p.happiness>=60 ? rnd(0,2) : rnd(-2,1)));

    const annualCare = p.annualCost||0;
    if(G.age>=18 && annualCare>0){
      if(G.money>=annualCare){
        G.money -= annualCare;
      } else {
        const deficit = annualCare - Math.max(0, G.money);
        G.money = 0;
        G.finance.debt += Math.floor(deficit * 1.08);
        p.happiness = clamp(p.happiness - rnd(6,12));
        G.stress = clamp((G.stress||35) + rnd(4,8));
        addEv(`${p.name}'s care costs were hard to cover this year. Debt increased by ${fmt$(Math.floor(deficit*1.08))}.`, 'warn');
      }
    }

    if(p.happiness>=70 && p.bond>=70){
      G.happy = clamp(G.happy + rnd(1,3));
      G.stress = clamp((G.stress||35) - rnd(2,5));
    } else if(p.happiness<=30){
      G.happy = clamp(G.happy - rnd(1,3));
      G.stress = clamp((G.stress||35) + rnd(2,4));
    }

    const lifespan = p.lifespan||14;
    if(p.health<35 && Math.random()<0.2){
      const vetBill = rnd(250,1400);
      if(G.age>=18 && G.money>=vetBill){
        G.money -= vetBill;
        p.health = clamp(p.health + rnd(8,16));
        addEv(`${p.name} needed urgent vet care. You paid ${fmt$(vetBill)} and they recovered.`, 'warn');
      } else if(G.age>=18){
        p.health = clamp(p.health - rnd(5,12));
        addEv(`${p.name} needed veterinary care, but finances were tight.`, 'bad');
      } else if(Math.random()<0.6){
        p.health = clamp(p.health + rnd(6,12));
        addEv(`Your family took ${p.name} to the vet and covered the bill.`, 'good');
      }
    }

    const oldAgeRisk = p.age>lifespan ? Math.min(0.75, 0.16 + (p.age-lifespan)*0.08) : 0;
    if(oldAgeRisk>0 && Math.random()<oldAgeRisk){
      p.alive = false;
      G.happy = clamp(G.happy - rnd(12,26));
      G.stress = clamp((G.stress||35) + rnd(6,14));
      addEv(`${p.name} passed away peacefully at age ${p.age}. You miss them deeply.`, 'bad');
    }
  });

  // ── Spouse aging & marriage anniversary ─────────────────────
  if(G.spouse && G.spouse.alive){
    G.spouse.age++;
    G.marriageYears++;
    assignAdultCareer(G.spouse);
    if(G.spouse.age>72 && Math.random()<0.04){
      G.spouse.alive=false; G.happy=clamp(G.happy-rnd(25,35));
      addEv(`${G.spouse.firstName} passed away. The loss is indescribable.`,'bad');
      G.spouse=null;
    }
    // Anniversary milestone
    if(G.marriageYears>0 && G.marriageYears%5===0){
      addEv(`${G.marriageYears}-year anniversary with ${G.spouse.firstName}. Time moves differently when you're happy.`,'love');
      flash(`💍 ${G.marriageYears} years married!`,'good');
    }
    // Passive relationship drift
    const compDrift = (G.spouse.compat>=70 ? rnd(-1,2) : G.spouse.compat<=40 ? rnd(-4,1) : rnd(-2,2));
    const drift = compDrift;
    G.spouse.relation = Math.max(10, Math.min(100, G.spouse.relation+drift));
    // Marriage in trouble warning
    if(G.spouse.relation<35 && Math.random()<0.3){
      addEv(`Things with ${G.spouse.firstName} feel strained. Something needs to give.`,'warn');
    }
  }

  // ── Siblings getting careers as they age ────────────────────
  G.friends.forEach(f=>{ if(f.age) f.age++; assignAdultCareer(f); });
  G.lovers.forEach(l=>{
    if(l.age) l.age++;
    assignAdultCareer(l);
    if(l.compat<=35 && l.relation<45 && Math.random()<0.15){
      addEv(`You and ${l.firstName} grew apart. The relationship ended.`, 'bad');
      G.lovers = G.lovers.filter(x=>x.name!==l.name);
    }
  });

  // ── Random life event pool ───────────────────────────────────
  const eligible = LIFE_EVENTS.filter(e => a>=e[0] && a<=e[1]);
  if(eligible.length && Math.random()<0.65){
    const ev = pick(eligible);
    G.happy  = clamp(G.happy  + ev[2]);
    G.health = clamp(G.health + ev[3]);
    G.smarts = clamp(G.smarts + ev[4]);
    G.money  = G.money + ev[5];
    addEv(ev[6], ev[7]);
  }
  // Occasional double event
  if(eligible.length && Math.random()<0.25){
    const ev = pick(eligible);
    G.happy  = clamp(G.happy  + ev[2]);
    G.health = clamp(G.health + ev[3]);
    G.smarts = clamp(G.smarts + ev[4]);
    G.money  = G.money + ev[5];
    addEv(ev[6], ev[7]);
  }

  // ── Illness roll ─────────────────────────────────────────────
  runYearStepSafe('health', ()=>rollIllness());

  // ── Ongoing condition drain ──────────────────────────────────
  if(G.medical.conditions.includes('depression')) G.happy  = clamp(G.happy-4);
  if(G.medical.conditions.includes('anxiety'))    G.happy  = clamp(G.happy-3);
  if(G.medical.conditions.includes('heartdis'))   G.health = clamp(G.health-3);
  if(G.medical.conditions.includes('cancer'))     G.health = clamp(G.health-5);
  if(G.medical.conditions.includes('diabetes'))   G.health = clamp(G.health-2);
  if(G.medical.conditions.includes('backpain'))   G.happy  = clamp(G.happy-2);
  if(G.medical.conditions.includes('insomnia'))   G.happy  = clamp(G.happy-2);
  if(G.medical.conditions.includes('burnout'))    { G.happy=clamp(G.happy-3); G.smarts=clamp(G.smarts-1); }

  // ── Addiction drain ──────────────────────────────────────────
  SUBSTANCES.forEach(s => {
    if(G.social.drugFlags[s.id+'_hooked']){
      G.health = clamp(G.health - rnd(1,3));
      G.happy  = clamp(G.happy  - rnd(1,2));
      G.money  -= rnd(20,80); // habit costs money
    }
  });

  // ── Reputation passive drift toward 50 ──────────────────────
  const rep = G.social.reputation;
  if(rep !== 50) G.social.reputation = clamp(rep + (rep>50?-1:1));

  // ── Careers: med/law school progression ─────────────────────
  if(G.career.medSchool.enrolled){
    const ms = G.career.medSchool;
    ms.debt += MED_SCHOOL.tuition;
    G.money -= MED_SCHOOL.tuition;
    ms.gpa = Math.max(2.2, Math.min(4.0, ms.gpa + (rnd(-8,10)/100)));
    ms.year++;
    addEv(`Med school year ${Math.min(ms.year, MED_SCHOOL.years)} complete. GPA: ${ms.gpa.toFixed(2)}.`, 'warn');
    if(ms.year > MED_SCHOOL.years){
      ms.enrolled = false;
      ms.completed = true;
      G.career.licenses.medical = true;
      addEv('You graduated med school and earned your medical license. Doctor title unlocked.', 'love');
      flash('🩺 Medical license earned','good');
    }
  }

  if(G.career.lawSchool.enrolled){
    const ls = G.career.lawSchool;
    ls.debt += LAW_SCHOOL.tuition;
    G.money -= LAW_SCHOOL.tuition;
    ls.gpa = Math.max(2.2, Math.min(4.0, ls.gpa + (rnd(-8,10)/100)));
    ls.year++;
    addEv(`Law school year ${Math.min(ls.year, LAW_SCHOOL.years)} complete. GPA: ${ls.gpa.toFixed(2)}.`, 'warn');
    if(ls.year > LAW_SCHOOL.years){
      ls.enrolled = false;
      ls.completed = true;
      // Bar exam check
      const passChance = 0.4 + (ls.gpa/4)*0.35 + (G.smarts/100)*0.2;
      if(Math.random() < passChance){
        ls.barPassed = true;
        G.career.licenses.law = true;
        addEv('You passed the bar. You are now a licensed attorney.', 'love');
        flash('⚖️ Bar passed','good');
      } else {
        addEv('You failed the bar exam. You can retake it next year.', 'bad');
      }
    }
  } else if(G.career.lawSchool.completed && !G.career.lawSchool.barPassed){
    const ls = G.career.lawSchool;
    const passChance = 0.3 + (ls.gpa/4)*0.35 + (G.smarts/100)*0.2;
    if(Math.random() < passChance){
      ls.barPassed = true;
      G.career.licenses.law = true;
      addEv('You passed the bar on the retake. You are now a licensed attorney.', 'love');
      flash('⚖️ Bar passed','good');
    } else {
      addEv('Bar exam retake didn’t go your way. Another try next year.', 'warn');
    }
  }

  // ── Careers: salary + promotions + HR risk ──────────────────
  if(G.career.employed){
    const c = G.career;
    G.money += c.salary;
    yearLedger.wages += c.salary;
    c.years++;
    c.performance = clamp(c.performance + rnd(-4,6));
    c.reputation = clamp(c.reputation + rnd(-2,3));
    if(c.salary>0) addEv(`Annual salary received: ${fmt$(c.salary)} from ${c.company}.`, 'good');
    G.stress = clamp(G.stress + rnd(1,4) + (c.hrRisk>=60?2:0) - (c.performance>=78?1:0));

    // coworker drift
    c.coworkers.forEach(w=>{ w.relation = clamp(w.relation + rnd(-2,4)); });

    // Promotion chance
    const nextLevel = JOB_LEVELS[c.level+1];
    if(nextLevel && c.years >= nextLevel.minYears && c.performance>=70 && Math.random()<0.35){
      c.level++;
      const old = c.salary;
      c.salary = Math.floor(c.salary * (nextLevel.payMult/JOB_LEVELS[c.level-1].payMult));
      c.milestones.push({ year:G.age, text:`Promoted to ${JOB_LEVELS[c.level].label}` });
      addEv(`Promotion! You advanced to ${JOB_LEVELS[c.level].label} level. Salary: ${fmt$(c.salary)}/yr.`, 'good');
      flash('📈 Promoted!','good');
    }

    // HR risk consequences
    if(c.hrRisk>75 && Math.random()<0.35){
      addEv(`HR opened an investigation at ${c.company}. It did not go well. You were fired.`, 'bad');
      flash('Fired. HR investigation.','bad');
      c.employed = false; c.fired = true; c.jobId=null; c.title=''; c.company=''; c.salary=0; c.level=0; c.years=0;
      c.coworkers=[]; c.boss=null; c.hrRisk=30;
    } else if(c.hrRisk>55 && Math.random()<0.25){
      c.hrRisk = clamp(c.hrRisk - rnd(8,16));
      addEv('HR gave you a formal warning. You toed the line. For now.', 'warn');
    }
  }

  // ── Careers: bonuses and benefits ────────────────────────────
  if(G.career.employed && G.career.salary>0){
    const bonus = Math.floor(G.career.salary * G.career.bonusRate * (G.career.performance/100));
    if(bonus>0){
      G.money += bonus;
      yearLedger.bonuses += bonus;
      addEv(`Annual bonus: ${fmt$(bonus)} from ${G.career.company}.`, 'good');
    }
    if(G.career.benefits.healthPlan) G.health = clamp(G.health + rnd(1,3));
    if(G.career.benefits.healthPlan && Math.random()<0.3) G.stress = clamp(G.stress - 1);
    if(G.career.stockUnits>0 && G.career.stockValue>0){
      const drift = rnd(-8,12) / 100;
      G.career.stockValue = Math.max(5, Math.floor(G.career.stockValue * (1+drift)));
      const equity = G.career.stockUnits * G.career.stockValue;
      if(equity>0 && Math.random()<0.25){
        const cashout = Math.floor(equity * 0.2);
        G.money += cashout;
        G.career.stockUnits = Math.max(0, G.career.stockUnits - Math.floor(G.career.stockUnits*0.2));
        addEv(`You cashed out some stock options: ${fmt$(cashout)}.`, 'good');
      }
    }

    // Auto-retirement contributions for employed adults with retirement benefits.
    if(G.age>=22 && G.career.benefits.retirement && G.career.salary>0){
      const employeeRate = G.career.level>=4 ? 0.08 : G.career.level>=2 ? 0.06 : 0.04;
      const employeeContrib = Math.floor(G.career.salary * employeeRate);
      const employerMatch = Math.floor(employeeContrib * 0.5);
      if(employeeContrib>0){
        const actualContrib = Math.min(employeeContrib, Math.max(0, G.money));
        if(actualContrib>0){
          G.money -= actualContrib;
          G.finance.retirement += actualContrib + employerMatch;
          yearLedger.retirementContrib += actualContrib;
          addEv(`Retirement contributions: ${fmt$(actualContrib)} (+${fmt$(employerMatch)} employer match).`, 'good');
        }
      }
    }
  }

  // ── Finance: housing, debt, investments ─────────────────────
  if(G.finance.rent>0){
    const rentAnnual = G.finance.rent * 12;
    G.money -= rentAnnual;
    yearLedger.rentPaid += rentAnnual;
    addEv(`Rent paid: ${fmt$(rentAnnual)} this year.`, '');
  }
  if(G.finance.mortgage>0){
    G.money -= G.finance.mortgage;
    yearLedger.mortgagePaid += G.finance.mortgage;
    G.finance.mortgageYears = Math.max(0, G.finance.mortgageYears-1);
    addEv(`Mortgage paid: ${fmt$(G.finance.mortgage)} this year.`, '');
    if(G.finance.mortgageYears===0){
      G.finance.mortgage = 0;
      addEv('Mortgage paid off. The house is fully yours.', 'love');
      flash('🏠 Mortgage paid off','good');
    }
  }
  if(G.housing.utilities>0){
    const util = G.housing.utilities * 12;
    G.money -= util;
    yearLedger.utilitiesPaid += util;
    addEv(`Utilities paid: ${fmt$(util)} this year.`, '');
  }
  if(G.housing.upkeep>0){
    G.money -= G.housing.upkeep;
    yearLedger.upkeepPaid += G.housing.upkeep;
    addEv(`Home upkeep: ${fmt$(G.housing.upkeep)} this year.`, '');
  }
  if(G.assets.home && G.assets.homeValue>0){
    const propertyTax = Math.floor(G.assets.homeValue * 0.0095);
    if(propertyTax>0){
      G.money -= propertyTax;
      yearLedger.propertyTax += propertyTax;
      addEv(`Property tax: ${fmt$(propertyTax)} this year.`, '');
    }
  }
  if(G.housing.roommates>0 && Math.random()<0.6){
    const ev = pick(ROOMMATE_EVENTS);
    G.happy = clamp(G.happy + ev.happy);
    G.housing.comfort = clamp(G.housing.comfort + ev.comfort);
    addEv(ev.msg, ev.happy>=0?'good':'warn');
  }
  if(G.housing.type!=='none' && Math.random()<0.25){
    const ev = pick(NEIGHBORHOOD_EVENTS);
    G.housing.comfort = clamp(G.housing.comfort + ev.comfort);
    G.housing.neighborhood = clamp(G.housing.neighborhood + ev.neighborhood);
    if(G.assets.home) G.assets.homeValue = Math.max(0, Math.floor(G.assets.homeValue * (1 + ev.value/100)));
    addEv(ev.msg, ev.comfort>=0?'good':'warn');
  }
  // Comfort effects
  if(G.housing.comfort>=70) G.happy = clamp(G.happy + 2);
  if(G.housing.comfort<=30) G.happy = clamp(G.happy - 3);
  if(G.finance.debt>0){
    const interest = Math.floor(G.finance.debt * 0.08);
    G.finance.debt += interest;
    yearLedger.debtInterest += interest;
    addEv(`Debt interest accrued: ${fmt$(interest)}.`, 'warn');
    G.stress = clamp(G.stress + (G.finance.debt>200000?8:G.finance.debt>75000?5:3));
  }
  runYearStepSafe('investments', ()=>processInvestmentAndCryptoYear(yearLedger));
  runYearStepSafe('business', ()=>processBusinessYear(yearLedger));
  runYearStepSafe('government', ()=>processGovernmentYear());
  runYearStepSafe('legal', ()=>processLegalYear());

  // ── HS sport passive bonus ───────────────────────────────────
  if(G.age>=14 && G.age<=17 && G.school.sport){
    const sp = HS_SPORTS.find(s=>s.id===G.school.sport);
    if(sp){
      G.health = clamp(G.health + rnd(1, Math.floor(sp.healthBonus/3)));
      G.school.sportYears++;
    }
  }

  // ── Passive: Podcast listener growth & revenue ───────────────
  if(G.sm.podcast.active && G.sm.podcast.episodes>0){
    const podGrowth = Math.floor(G.sm.podcast.listeners * rnd(2,8) / 100);
    G.sm.podcast.listeners += podGrowth;
    const podRev = Math.floor(G.sm.podcast.listeners * 0.002 * rnd(1,3));
    G.sm.podcast.revenue += podRev;
    G.sm.totalRevenue    += podRev;
    G.money              += podRev;
    if(podRev>0) addEv(`Podcast passive income: ${fmt$(podRev)} this year. ${fmtF(G.sm.podcast.listeners)} listeners.`,'good');
  }

  // ── Passive: Music streaming revenue ─────────────────────────
  if(G.sm.music.active && G.sm.music.tracks>0){
    const mus = G.sm.music;
    const instBonus = mus.instruments.length>0 ? 1 + mus.instruments.length*0.08 : 1;
    const opinionMult = 0.5 + (mus.publicOpinion/100);
    const newStreams = Math.floor((mus.streams * rnd(3,12)/100 + mus.tracks * rnd(100,800)) * opinionMult * instBonus);
    mus.streams += newStreams;
    // Rate per stream (label gives better rate)
    const streamRate = mus.labelTier>=3 ? 0.006 : mus.labelTier>=2 ? 0.005 : 0.004;
    const musicRev = Math.floor(newStreams * streamRate);
    // Producer royalties
    const prodRev = mus.isProducer ? Math.floor(mus.producerCredits * rnd(500,3000)) : 0;
    if(prodRev>0){ mus.producerRevenue+=prodRev; G.sm.totalRevenue+=prodRev; G.money+=prodRev; }
    // Tour revenue
    if(mus.tourActive){
      const tourRev = Math.floor(rnd(50000,500000) * (mus.publicOpinion/100));
      mus.tourRevenue+=tourRev; mus.tourDates+=rnd(10,40);
      G.sm.totalRevenue+=tourRev; G.money+=tourRev;
      addEv(`Tour continues: ${mus.tourDates} shows total. +${fmt$(tourRev)} this year.`,'good');
    }
    mus.revenue += musicRev;
    G.sm.totalRevenue += musicRev;
    G.money += musicRev;
    if(musicRev>50) addEv(`Music streaming: ${fmtF(newStreams)} new streams · ${fmt$(musicRev)} earned.`,'good');

    // Passive public opinion drift
    if(mus.publicOpinion>50) mus.publicOpinion = Math.max(50, mus.publicOpinion - rnd(0,2));
    if(mus.publicOpinion<50) mus.publicOpinion = Math.min(50, mus.publicOpinion + rnd(0,1));

    // Beef escalation
    mus.beefs.filter(b=>!b.resolved).forEach(b=>{
      if(Math.random()<0.3){
        b.intensity = Math.min(10, b.intensity+1);
        if(b.intensity>=8 && Math.random()<0.4){
          b.resolved=true;
          addEv(`The beef with ${b.artist} finally died down. Mostly.`,'warn');
        } else if(b.intensity>=5){
          addEv(`The ${b.artist} beef is still going. Both sides posting. Streaming up.`,'warn');
          mus.streams += rnd(100000,500000);
        }
      }
    });

    // Grammy nomination passive (albums needed, critical score)
    if(mus.albums>0 && mus.criticalScore>60 && Math.random()<0.07+mus.criticalScore/500){
      mus.grammyNoms++;
      G.sm.totalFame = clamp(G.sm.totalFame + rnd(3,8));
      addEv(`Grammy nomination! Category: ${pick(['Best New Artist','Best Rap Album','Best Pop Album','Album of the Year','Song of the Year','Best R&B Album','Best Alternative Album','Record of the Year'])}. ${mus.grammyNoms} nomination${mus.grammyNoms>1?'s':''} total.`,'love');
      flash(`🏆 Grammy nominated!`,'good');
      // Win roll
      if(Math.random()<0.28+mus.criticalScore/300){
        mus.grammyWins++;
        G.sm.totalFame = clamp(G.sm.totalFame + rnd(8,18));
        G.happy = clamp(G.happy + rnd(15,25));
        addEv(`YOU WON THE GRAMMY. The speech. The tears. The afterparty. Career defined.`,'love');
        flash(`🏆🏆 GRAMMY WIN!!`,'good');
      }
    }

    // Chart hit
    if(mus.tracks>0 && Math.random()<0.05+mus.publicOpinion/400){
      mus.chartsHit++;
      const chartPos = Math.max(1, Math.floor(100-(mus.publicOpinion*0.8)-(mus.criticalScore*0.3)));
      addEv(`Charted at #${chartPos} on the Billboard Hot 100. ${chartPos<=10?'Top 10. The industry is watching.':chartPos<=40?'Mid-chart. Steady.':'Lower chart but still there.'}`,'love');
      if(chartPos<=10) G.sm.totalFame = clamp(G.sm.totalFame + rnd(4,10));
      // Certification check
      if(mus.streams>=1000000000 && !mus.platinums){ mus.platinums=1; addEv('RIAA Platinum certified! 🥇','love'); }
      else if(mus.streams>=500000000 && !mus.golds){ mus.golds=1; addEv('RIAA Gold certified! 🥇','good'); }
    }

    // Viral song chance
    if(Math.random()<0.04+G.sm.totalFame/500){
      const viralStreams = rnd(500000,5000000);
      const viralRev = Math.floor(viralStreams * streamRate);
      mus.streams += viralStreams; mus.revenue += viralRev;
      G.sm.totalRevenue += viralRev; G.money += viralRev;
      G.sm.totalFame = clamp(G.sm.totalFame + rnd(5,20));
      addEv(`One of your tracks went viral. ${fmtF(viralStreams)} streams this week. ${fmt$(viralRev)} deposited.`,'love');
      flash(`🔥 Track went viral! +${fmt$(viralRev)}`,'good');
    }

    // Random music industry event
    if(Math.random()<0.15) musicIndustryEvent();
  }

  // ── Passive: OnlyFans revenue ─────────────────────────────────
  if(G.sm.onlyfans.active && G.sm.onlyfans.subs>0){
    const ofTiers = {beginner:9.99, regular:14.99, premium:24.99, elite:49.99};
    const price   = ofTiers[G.sm.onlyfans.tier]||9.99;
    const ofRev   = Math.floor(G.sm.onlyfans.subs * price * 0.8); // 80% cut
    G.sm.onlyfans.revenue += ofRev;
    G.sm.totalRevenue     += ofRev;
    G.money               += ofRev;
    // Churn — some subs leave
    const churn = Math.floor(G.sm.onlyfans.subs * rnd(3,10)/100);
    G.sm.onlyfans.subs = Math.max(0, G.sm.onlyfans.subs - churn);
    if(ofRev>0) addEv(`OnlyFans: ${fmt$(ofRev)} this month from ${G.sm.onlyfans.subs.toLocaleString()} subscribers.`,'good');
  }

  // ── Passive: Talk show invite ─────────────────────────────────
  const totalFollTalkShow = Object.keys(G.sm.platforms).reduce((s,k)=>s+G.sm.platforms[k].followers,0);
  if((totalFollTalkShow>=1000000||G.sm.totalFame>=70) && G.age>=18 && Math.random()<0.08){
    addEv(`You got invited to appear on a talk show. Your platform is big enough to warrant a segment.`,'love');
    flash('📺 Talk show invite!','good');
  }

  // ── Passive: Acting — annual events ──────────────────────────
  if(G.acting.active){
    runYearStepSafe('acting', ()=>actingPassive());
  }

  // ── Passive: NFL season ───────────────────────────────────────
  if(G.nfl.active && !G.nfl.retired){
    runYearStepSafe('NFL', ()=>nflSeasonPassive());
  }

  // ── Passive: NBA season ───────────────────────────────────────
  if(G.nba.active && !G.nba.retired){
    runYearStepSafe('NBA', ()=>nbaSeasonPassive());
  }
  if(G.mma && (G.mma.active || G.mma.pro?.isPro)){
    runYearStepSafe('MMA', ()=>mmaSeasonPassive());
  }

  // ── Fame -> Social Media growth ──────────────────────────────
  const activePlatforms = Object.keys(G.sm.platforms).filter(k=>G.sm.platforms[k].active);
  if(activePlatforms.length){
    let fameBoost = 0;
    if(G.nfl.active || G.nfl.retired) fameBoost += 1.8;
    if(G.nba.active || G.nba.retired) fameBoost += 1.8;
    if(G.mma && (G.mma.pro.isPro || G.mma.pro.ufc.inUFC)) fameBoost += 1.5;
    if(G.acting.active) fameBoost += 0.9;
    if(G.sm.music && G.sm.music.active) fameBoost += 1.2;
    if(G.sm.totalFame>=40) fameBoost += 0.6;
    if(G.sm.totalFame>=70) fameBoost += 0.8;
    if(fameBoost>0){
      activePlatforms.forEach(pid=>{
        const acc = G.sm.platforms[pid];
        const base = Math.floor((acc.followers*0.05 + rnd(200,2000)) * fameBoost);
        acc.followers += base;
        acc.revenue += Math.floor(base * 0.002 * (SM_PLATFORMS[pid].revenueMulti||1));
      });
    }
  }

  // ── Fame: fandom growth, merch, sponsor payout ───────────────
  if(G.sm.fandom.active){
    const f = G.sm.fandom;
    const fameScale = 1 + (G.sm.totalFame/100);
    const growth = Math.floor((rnd(500,4000) + f.size*0.08) * fameScale);
    f.size += growth;
    f.loyalty = clamp(f.loyalty + rnd(-2,3) + (G.sm.publicist?1:0) - (G.sm.controversies>0?2:0));
    const merch = Math.floor(f.size * (f.loyalty/100) * 0.015);
    f.merchRevenue += merch;
    G.sm.totalRevenue += merch; G.money += merch;
    if(merch>0) addEv(`Merch sales: ${fmt$(merch)} from ${f.name}.`, 'good');
  }

  if(G.sm.sponsor.tier>0){
    const tier = SPONSOR_TIERS.find(t=>t.tier===G.sm.sponsor.tier);
    if(tier){
      let pay = tier.pay;
      if(G.sm.sponsor.exclusive) pay = Math.floor(pay*1.2);
      G.money += pay; G.sm.totalRevenue += pay;
      addEv(`Sponsor payout from ${G.sm.sponsor.brand||'your sponsor'}: ${fmt$(pay)}.`, 'good');
      if(G.sm.controversies>=3 && Math.random()<0.2){
        G.sm.sponsor.disputes++;
        addEv(`Sponsor dispute: ${G.sm.sponsor.brand} wants you to clean up the headlines.`, 'warn');
      }
    }
  }

  // ── Fame: scandal chance ─────────────────────────────────────
  if(G.sm.totalFame>=30 && Math.random()<0.08 + (G.sm.controversies*0.02)){
    const sc = pick(SCANDAL_EVENTS);
    G.sm.scandals.push({ year:G.age, id:sc.id, msg:sc.msg });
    G.sm.controversies++;
    G.sm.prCrisis += sc.hit;
    G.sm.totalFame = clamp(G.sm.totalFame - sc.hit);
    addEv(sc.msg, 'bad');
    if(activePlatforms.length){
      activePlatforms.forEach(pid=>{
        const acc = G.sm.platforms[pid];
        const loss = Math.floor(acc.followers * 0.06);
        acc.followers = Math.max(0, acc.followers - loss);
      });
    }
  }

  // ── Crime: heat decay & retaliation ─────────────────────────
  if(G.crime.heat>0){
    G.crime.heat = Math.max(0, G.crime.heat - rnd(3,8));
  }
  if(G.crime.heat>=70 && Math.random()<0.2){
    const loss = rnd(200,2000);
    G.money = Math.max(0, G.money - loss);
    G.health = clamp(G.health - rnd(4,10));
    addEv(`Rival criminals targeted you. You lost ${fmt$(loss)} and took a hit.`, 'bad');
  }

  // ── Police closeness drift ───────────────────────────────────
  if(G.crime.police.closeness>0) G.crime.police.closeness = Math.max(0, G.crime.police.closeness - rnd(1,3));

  // ── Prison sentence progress ────────────────────────────────
  if(G.crime.police.inPrison){
    G.crime.police.sentence = Math.max(0, G.crime.police.sentence-1);
    if(G.crime.police.sentence===0){
      G.crime.police.inPrison = false;
      G.crime.heat = Math.min(100, G.crime.heat + 10);
      addEv('You were released from prison.', 'warn');
      addCrimeEv('Released from prison.', 'warn');
    }
  }

  // ── Mafia progression / risk ────────────────────────────────
  const M = G.crime.mafia;
  if(M.joined){
    if(M.earnings>5000 && M.loyalty>50 && M.respect>40 && M.rank<4 && Math.random()<0.2){
      M.rank++;
      addCrimeEv(`Promoted to ${MAFIA_RANKS[M.rank]}.`, 'bad');
    }
    if(M.loyalty<20 && Math.random()<0.2){
      M.rank = Math.max(0, M.rank-1);
      addCrimeEv('Demoted for disloyalty.', 'bad');
    }
    if(G.crime.police.inPrison && Math.random()<0.25){
      M.rank = Math.max(0, M.rank-1);
      addCrimeEv('Lost rank while incarcerated.', 'bad');
    }
    // Income from rackets
    const base = M.rackets.reduce((s,r)=>s+r.income,0);
    if(base>0){
      const income = Math.floor(base * (1 + M.territory*0.08));
      G.money += income; M.earnings += income;
      G.crime.heat = Math.min(100, G.crime.heat + Math.floor(base/800));
      addCrimeEv(`Mafia income collected: ${fmt$(income)}.`, 'bad');
    }
    // Crew betrayal risk
    M.crew.forEach(c=>{
      if(c.greed>70 && Math.random()<0.1){ addCrimeEv(`${c.name} skimmed money.`, 'bad'); }
      if(c.loyalty<30 && Math.random()<0.05){ addCrimeEv(`${c.name} flipped to police.`, 'bad'); G.crime.heat=Math.min(100,G.crime.heat+10); }
    });
  }

  // ── Stress system: multi-source pressure & consequences ───────
  if(G.money<0) G.stress = clamp(G.stress + rnd(8,14));
  else if(G.money<5000) G.stress = clamp(G.stress + rnd(2,5));
  if(G.finance.debt>0) G.stress = clamp(G.stress + (G.finance.debt>120000?5:G.finance.debt>40000?3:1));
  if(G.spouse && G.spouse.relation<40) G.stress = clamp(G.stress + rnd(2,6));
  if(G.children.length>=3) G.stress = clamp(G.stress + rnd(1,3));
  if(G.crime.heat>=65) G.stress = clamp(G.stress + rnd(3,8));
  if(G.sm.controversies>=3) G.stress = clamp(G.stress + rnd(2,6));
  if(G.medical.conditions.length>=2) G.stress = clamp(G.stress + rnd(2,5));
  if(G.housing.comfort>=72) G.stress = clamp(G.stress - rnd(1,3));
  if(G.happy>=75) G.stress = clamp(G.stress - rnd(1,2));

  if(G.stress>=90){
    G.health = clamp(G.health - rnd(5,11));
    G.happy = clamp(G.happy - rnd(6,12));
    G.smarts = clamp(G.smarts - rnd(1,3));
    if(!G.medical.conditions.includes('burnout') && Math.random()<0.35){
      G.medical.conditions.push('burnout');
      addEv('Chronic stress tipped into burnout. Everything feels heavier.', 'bad');
    } else {
      addEv('Extreme stress hit your body hard this year.', 'bad');
    }
  } else if(G.stress>=72){
    G.happy = clamp(G.happy - rnd(3,7));
    G.health = clamp(G.health - rnd(1,4));
    addEv('High stress made this year harder than it needed to be.', 'warn');
  } else if(G.stress<=28){
    G.happy = clamp(G.happy + rnd(1,4));
    if(Math.random()<0.4) G.health = clamp(G.health + rnd(1,3));
  }

  // ── Annual tax filing + post-tax credit drift ────────────────
  if(G.age>=18){
    runYearStepSafe('tax', ()=>processAnnualTaxes(yearLedger, moneyAtYearStart, totalsAtYearStart));
  } else {
    G.finance.tax.lastPaid = 0;
    G.finance.tax.lastRefund = 0;
    G.finance.tax.lastTaxableIncome = 0;
    G.finance.tax.lastEffectiveRate = 0;
    G.finance.tax.lastBracket = 'Dependent';
    G.finance.tax.lastStateRate = 0;
    G.finance.tax.lastYearSummary = null;
  }

  if(G.money < 0){
    G.finance.credit = Math.max(300, G.finance.credit - rnd(15,40));
  } else if(G.finance.debt>0){
    G.finance.credit = Math.max(300, G.finance.credit - rnd(2,8));
  } else {
    G.finance.credit = Math.min(850, G.finance.credit + rnd(1,6));
  }

  updateHUD();
  switchTab('life');
  renderLife();
  saveGame(true);
}

// Safety wrapper: never let one runtime error permanently block Age Up.
const __ageUpImpl = ageUp;
ageUp = function(){
  try{
    __ageUpImpl();
  }catch(err){
    console.error('Fatal ageUp error', err);
    try{
      addEv('A simulation error occurred this year. The game recovered automatically.', 'warn');
      flash('Recovered from age-up error. Try again.','warn');
      updateHUD();
      switchTab('life');
      renderLife();
    }catch(_e){}
  }
};

// Refresh title-screen continue button once scripts are loaded.
setTimeout(()=>{ try{ refreshSaveUI(); }catch(_e){} }, 0);

// ── LIFE TAB ────────────────────────────────────────────────────
function renderLife(){
  document.getElementById('life-year-label').textContent = `Age ${G.age} — This Year`;
  const recent = [...G.yearEvents].reverse().slice(0,8);
  document.getElementById('event-log').innerHTML = recent.length
    ? recent.map(e=>`
        <li class="event-item ${e.type||''}">
          <div class="ev-pip-wrap"><span class="edot ${e.type||''}"></span></div>
          <span class="ev-text">${e.text}</span>
        </li>`).join('')
    : `<li class="event-item">
        <div class="ev-pip-wrap"><span class="edot"></span></div>
        <span class="ev-text" style="color:var(--muted2)">A quiet year. Nothing much happened. Sometimes that's okay.</span>
       </li>`;

  const aa = document.getElementById('age-up-area');
  if(G.age>=90){
    aa.innerHTML=`<div class="notif bad" style="margin-bottom:10px">You have reached the end of your life.</div>
      <button class="btn btn-danger btn-block btn-lg" onclick="showDeath()">See Your Legacy →</button>`;
  } else {
    aa.innerHTML=`<button class="btn btn-purple btn-block btn-lg" style="margin-top:10px" onclick="ageUp()">
      ⏩ Age Up → Year ${G.age+1}
    </button>`;
  }
}
