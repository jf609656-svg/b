// ══ creation.js ══
// ═══════════════════════════════════════════════════════════════
//  creation.js — Character creation flow
// ═══════════════════════════════════════════════════════════════

function pickGender(g){
  G.gender = g;
  rollName();
  goTo('screen-create-name');
}

function rollName(){
  const fn = G.gender==='male' ? pick(NM) : G.gender==='female' ? pick(NF) : pick(NN);
  const el1 = document.getElementById('inp-first');
  const el2 = document.getElementById('inp-last');
  if(el1) el1.value = fn;
  if(el2) el2.value = pick(NS);
}

function confirmName(){
  const fn = (document.getElementById('inp-first').value||'').trim();
  const ln = (document.getElementById('inp-last').value||'').trim();
  if(!fn||!ln){ flash('Enter a name first!','warn'); return; }
  G.firstname = fn;
  G.lastname  = ln;
  rollStats();
  goTo('screen-create-stats');
}

function rollStats(){
  G.health = rnd(50,95);
  G.happy  = rnd(45,90);
  G.smarts = rnd(15,90);
  G.looks  = rnd(15,90);
  G.stress = rnd(22,48);
  G.money  = 0;
  G.age    = 0;
  G.state  = pick(STATES);
  G.family = genFamily();
  const dad = G.family.find(p=>p.role==='Father');
  const mom = G.family.find(p=>p.role==='Mother');
  G.traits = inheritTraits(dad, mom);

  document.getElementById('stat-preview').innerHTML =
    `<div class="stat-roll-card">
      ${statBar('Health',G.health,'bar-h')}
      ${statBar('Happiness',G.happy,'bar-p')}
      ${statBar('Smarts',G.smarts,'bar-s')}
      ${statBar('Looks',G.looks,'bar-l')}
    </div>`;

  // people preview using inline HTML so no dependency on relationships.js
  const famHTML = G.family.map(p=>`
    <div class="person-card">
      <div class="p-avatar av-fam">${p.role==='Father'?'👨':p.role==='Mother'?'👩':'🧒'}</div>
      <div><div class="p-name">${p.name}</div>
      <div class="p-role">${p.role} · Age ${p.age}</div></div>
    </div>`).join('');
  document.getElementById('family-preview').innerHTML =
    `<div class="card"><div class="card-title">Your Family</div>${famHTML}</div>`;
}

function beginLife(){
  // reset all systems
  G.lifeEvents = [{ text:`You were born in ${G.state}. Your story begins.`, type:'' }];
  G.yearEvents  = [...G.lifeEvents];
  G.travel = { log:[], visited:[] };
  G.school = {
    stage:'none', grade:0, gpa:2.5,
    trouble:0, expelled:false, teachers:[], classmates:[],
    sport:null, sportYears:0, sportMVP:false, bigGameWins:0,
    stateLine:null, recruitingStars:0, recruitingOffers:[], scholarshipOffer:null,
    satScore:null, detentions:0, suspended:false, clubFlags:{},
    injuryHistory:[],
    football:{ position:null, stats:{td:0,yds:0,tackles:0,ints:0}, allState:false, heisman:false },
    basketball:{ position:null, stats:{pts:0,reb:0,ast:0}, allState:false },
    uni:{
      enrolled:false, course:'', year:0, gpa:2.5, honors:false, clubs:[], hasResearch:false,
      sport:null, sportYears:0, sportConference:'', collegeName:'',
      athleteStatus:null, athleteStats:{td:0,yds:0,pts:0,reb:0,ast:0,tackles:0},
      allConference:false, allAmerican:false, heisman:false, nationalChamp:false,
      draftEligible:false, draftDeclared:false, draftRound:null, draftPick:null, draftTeam:null,
      nflDraftable:false, nbaNextStep:false,
      frat:null, fratRank:null, fratRep:0,
      campusCrush:null, academicProbation:false,
      professors:[], classmates:[], discipline:0,
    },
    graduated:false, degree:null, uniGpa:null,
  };
  G.social = {
    clique:null, rival:null, partyCount:0,
    reputation:50, drugFlags:{}, dramaFlags:{}
  };
  G.medical    = { conditions:[], history:[] };
  G.sm = {
    platforms:{}, totalFame:0, totalRevenue:0, controversies:0,
    verified:false, cancelCount:0, collab:[], publicist:false, prCrisis:0, brandDeals:[],
    scandals:[], fandom:{ active:false, name:'', size:0, loyalty:50, merchRevenue:0, meetCount:0, stalkerRisk:0 },
    sponsor:{ tier:0, exclusive:false, brand:null, disputes:0 },
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
  };
  G.career = {
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
    medSchool:{ enrolled:false, year:0, gpa:3.0, debt:0, completed:false, residency:false },
    lawSchool:{ enrolled:false, year:0, gpa:3.0, debt:0, completed:false, barPassed:false },
    licenses:{ medical:false, law:false },
  };
  G.acting = {
    active:false, skill:0, hasAgent:false, agentTier:0,
    roles:[], activeRole:null, reputation:50,
    awardsNoms:0, awardsWins:0, typecastGenre:null,
    overexposed:false, filmCount:0, tvCount:0, streamCount:0,
    franchiseRoles:{}, totalEarned:0, methodActor:false, totalProjects:0,
  };
  G.nfl = {
    active:false, team:null, prevTeams:[], position:null, jerseyNumber:null,
    year:1, age_entered:null, contract:{years:0,totalValue:0,guaranteed:0,perYear:0},
    freeAgent:false, retired:false,
    depth:'bench', chemistry:50, durability:70, injured:false, injuryWeeks:0, injuryRiskBoost:0, skill:50, agentFocus:'balanced',
    stats:{td:0,yds:0,rec:0,tackles:0,sacks:0,ints:0,rush_yds:0,pass_yds:0,pass_td:0},
    seasonStats:{td:0,yds:0,rec:0,tackles:0,sacks:0,ints:0},
    proBowls:0, allPro:0, superBowlWins:0, superBowlMVPs:0, mvpAwards:0,
    offensiveROY:false, defensiveROY:false,
    endorsements:[], endorsementIncome:0, fines:0, suspensions:0, arrested:false,
    girlfriend:null, publicImage:70, brand:null, foundation:null,
    totalEarned:0, injuryHistory:[], seasonHistory:[], trainingCamp:false, holdout:false, tradeDemand:false,
  };
  G.nba = {
    active:false, team:null, prevTeams:[], position:null, jerseyNumber:null,
    year:1, age_entered:null, contract:{years:0,totalValue:0,guaranteed:0,perYear:0},
    freeAgent:false, retired:false, maxContract:false,
    depth:'bench', chemistry:50, durability:70, injured:false, injuryWeeks:0, injuryRiskBoost:0, skill:50, agentFocus:'balanced',
    injuryWeeks:0, injuryRiskBoost:0, skill:50,
    stats:{ppg:0,rpg:0,apg:0,spg:0,bpg:0,fg_pct:0},
    seasonStats:{ppg:0,rpg:0,apg:0,spg:0,bpg:0},
    careerGames:0,
    allStarSelections:0, allNBA:0, championshipRings:0, finalsLegend:false, finalsMVPs:0,
    mvpAwards:0, dopy:false, roy:false, scoringTitles:0, tripleDoubles:0,
    endorsements:[], endorsementIncome:0, fines:0, suspensions:0,
    girlfriend:null, publicImage:70, brand:null, foundation:null,
    sneakerDeal:null, sneakerRevenue:0, socialMediaPresence:50, locker_drama:0,
    tradeDemand:false, totalEarned:0, injuryHistory:[], seasonHistory:[], g_league:false, twoWay:false,
  };
  G.mma = {
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
    amateur:{ wins:0, losses:0, draws:0, byKO:0, bySub:0, byDec:0, titleWins:0, log:[] },
    pro:{
      isPro:false, org:'regional',
      wins:0, losses:0, draws:0,
      byKO:0, bySub:0, byDec:0,
      streak:0, ranking:0, popularity:18, marketability:25, controversies:0,
      rivals:[], callouts:0, hype:0, recordLog:[],
      ufc:{ inUFC:false, rank:0, wins:0, losses:0, draws:0, titleShots:0, titleWins:0, titleDefenses:0, interimTitleWins:0, champ:false, interimChamp:false, champWeight:'', champWeight2:'', doubleChampAttempt:false },
      weightClass:'Lightweight', purse:12000,
    },
    totalEarned:0,
  };
  G.children    = [];
  G.pets        = [];
  G.spouse      = null;
  G.marriageYears = 0;
  G.divorces    = 0;
  G.assets      = { home:false, homeValue:0, savings:0 };
  G.finance     = {
    rent:0, mortgage:0, mortgageYears:0, debt:0, credit:680, investments:0, retirement:0,
    portfolio:{ indexFund:0, bonds:0, realEstateFund:0, ventureFund:0, growthEtf:0, dividendFund:0, commodities:0, treasuries:0 },
    crypto:{
      btc:0, eth:0, sol:0, meme:0,
      marketCycle:'neutral', marketMomentum:0, lastYearPnl:0, lastEvent:'',
      prices:{ btc:100, eth:100, sol:100, meme:100 }, history:[],
      dayTradesThisYear:0, traderSkill:20, tradesWon:0, tradesLost:0,
    },
    business:{
      active:false, name:'', sector:'', stage:'idea',
      employees:0, reputation:50, product:45, operations:45, marketing:40,
      burn:0, cashReserve:0, valuation:0, years:0, lastProfit:0, hasInvestor:false,
      startupId:'', difficulty:1, complexity:20, managementSkill:24, founderExp:0,
      customerBase:0, equitySold:0, investorTier:0, investorName:'', actionsThisYear:0, negativeYears:0, timeline:[],
      marketShare:12, moat:24, warReadiness:28, priceWar:false, espionageRisk:8, prHeat:12, openDisputes:0, rivals:[],
    },
    empire:{
      holdings:[], nextHoldingId:1,
      totalAcquisitions:0, totalFranchises:0, totalSmallBiz:0,
      lastYearCashflow:0, lastYearValueDelta:0,
    },
    tax:{
      lastPaid:0, lastRefund:0, lastTaxableIncome:0, lastEffectiveRate:0, lastBracket:'None',
      lastStateRate:0, lastYearSummary:null, delinquentYears:0,
    }
  };
  G.housing     = { type:'none', comfort:40, neighborhood:50, roommates:0, roommateList:[], upkeep:0, utilities:0 };
  G.relTab      = 'family';
  G.stress     = 35;
  G.darkScore  = 0;
  G.totalYears = 0;
  G.traits = [];
  G.familyFlags = { parentsDivorced:false, stepFamilyAdded:false };
  G.proSportsTab = 'nfl';
  G.crime = { heat:0, notoriety:0, record:[], log:[], skills:{ scam:0, hack:0, violence:0 }, crew:[], currentHeist:null,
    police:{ closeness:0, arrested:false, sentence:0, inPrison:false },
    prison:{ respect:10, fear:10, protection:0, sanity:70, security:'Low', faction:null, guards:{ strict:50, corrupt:20 } },
    gang:{ joined:false, type:null, name:null, colors:'', symbol:'', style:'', territory:1, cred:10, notoriety:5, crew:[], leader:null, affiliation:'', clout:0 },
    drugs:{ active:false, tier:'low', supply:0, model:'street', heatMult:1.0, income:0, risk:0 },
    mafia:{ joined:false, rank:0, fear:10, respect:10, loyalty:40, obedience:50, earnings:0, heat:0,
      rackets:[], crew:[], territory:1, order:null, fronts:0, corruption:0 },
  };
  G.legal = {
    lawsuits:[],
    finesDue:0,
    probationYears:0,
    criminalStrikes:0,
    lawyer:{ casesWon:0, settlements:0, profile:20, campaignWins:0, electedOffice:null, officeYears:0 },
  };
  G.gov = {
    approval:50,
    party:'Centrist',
    cycleYear:0,
    policy:{ taxShift:0, policing:50, justice:50, businessClimate:50, healthcare:50, education:50 },
    activeLaw:'Status Quo',
  };
  G.career = {
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
  };

  document.getElementById('hud').style.display    = 'block';
  document.getElementById('tab-bar').style.display = 'flex';
  if(typeof ensureGovLegalShape==='function') ensureGovLegalShape();
  updateHUD();
  switchTab('life');
  if(typeof saveGame==='function') saveGame(true);
}

