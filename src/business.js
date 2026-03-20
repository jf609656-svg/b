//  business.js — Founder, investing, and crypto systems
// ═══════════════════════════════════════════════════════

const STARTUP_OPTIONS_25 = [
  { id:'ai_copilot', icon:'🤖', name:'AI Workflow Copilot', sector:'SaaS', difficulty:4, startCost:18000, burnBase:26000, growthBias:0.18, risk:0.62, arpu:95, desc:'Automate repetitive office work.', win:'Enterprise pilot converted to annual contracts.', riskEv:'Model errors caused a client dispute.' },
  { id:'devtools_ci', icon:'🛠️', name:'Developer CI Platform', sector:'SaaS', difficulty:3, startCost:14000, burnBase:21000, growthBias:0.14, risk:0.48, arpu:85, desc:'CI observability and flaky test triage.', win:'Open-source traction doubled paid conversions.', riskEv:'A security issue forced emergency fixes.' },
  { id:'creator_analytics', icon:'📊', name:'Creator Analytics Suite', sector:'SaaS', difficulty:3, startCost:12000, burnBase:18000, growthBias:0.12, risk:0.45, arpu:55, desc:'Cross-platform creator dashboards.', win:'A creator network signed an annual deal.', riskEv:'Platform API changes broke key metrics.' },
  { id:'sales_enablement', icon:'🧲', name:'Sales Enablement OS', sector:'SaaS', difficulty:4, startCost:17000, burnBase:24000, growthBias:0.13, risk:0.5, arpu:120, desc:'Deal intelligence and pipeline coaching.', win:'Outbound campaigns set a revenue record.', riskEv:'A pricing shift triggered customer churn.' },
  { id:'health_scheduling', icon:'🩺', name:'Clinic Scheduling Cloud', sector:'SaaS', difficulty:5, startCost:26000, burnBase:30000, growthBias:0.16, risk:0.66, arpu:140, desc:'Scheduling and claims automation.', win:'A health network approved full rollout.', riskEv:'Compliance audit required costly changes.' },
  { id:'d2c_skincare', icon:'🧴', name:'D2C Skincare Brand', sector:'Consumer', difficulty:3, startCost:9000, burnBase:15000, growthBias:0.11, risk:0.49, arpu:42, desc:'Beauty products with subscriptions.', win:'A viral review doubled monthly orders.', riskEv:'Manufacturing delays triggered refunds.' },
  { id:'protein_snacks', icon:'🍫', name:'Protein Snack Startup', sector:'Consumer', difficulty:3, startCost:11000, burnBase:17000, growthBias:0.1, risk:0.46, arpu:28, desc:'High-protein snack line.', win:'Retail placement increased repeat revenue.', riskEv:'Ingredient costs crushed margins.' },
  { id:'eco_home_goods', icon:'♻️', name:'Eco Home Goods', sector:'Consumer', difficulty:2, startCost:8000, burnBase:12000, growthBias:0.08, risk:0.38, arpu:33, desc:'Sustainable home products.', win:'Sustainability press boosted conversion.', riskEv:'Fulfillment errors caused complaints.' },
  { id:'pet_food', icon:'🐾', name:'Premium Pet Food', sector:'Consumer', difficulty:4, startCost:15000, burnBase:23000, growthBias:0.12, risk:0.52, arpu:51, desc:'Specialized nutrition for pets.', win:'Vet partnerships drove growth.', riskEv:'A recall damaged customer trust.' },
  { id:'wearables_brand', icon:'⌚', name:'Wearables Brand', sector:'Consumer', difficulty:4, startCost:21000, burnBase:26000, growthBias:0.14, risk:0.59, arpu:76, desc:'Fitness wearables + mobile app.', win:'Celebrity collaboration sold out fast.', riskEv:'Hardware returns spiked unexpectedly.' },
  { id:'crossborder_store', icon:'📦', name:'Cross-border E-commerce', sector:'E-commerce', difficulty:3, startCost:12000, burnBase:19000, growthBias:0.11, risk:0.5, arpu:37, desc:'Import/export product marketplace.', win:'Shipping optimization improved margins.', riskEv:'Customs delays stalled growth.' },
  { id:'niche_marketplace', icon:'🛒', name:'Niche Marketplace', sector:'E-commerce', difficulty:4, startCost:16000, burnBase:21000, growthBias:0.13, risk:0.54, arpu:44, desc:'Marketplace for specialized buyers.', win:'Category leader switched exclusively to you.', riskEv:'Chargebacks forced anti-fraud spending.' },
  { id:'luxury_resale', icon:'👜', name:'Luxury Resale Platform', sector:'E-commerce', difficulty:5, startCost:25000, burnBase:32000, growthBias:0.15, risk:0.67, arpu:120, desc:'Authenticated resale for premium goods.', win:'Verification tech reduced return rates.', riskEv:'Counterfeit items created legal pressure.' },
  { id:'grocery_quick', icon:'🛵', name:'Quick Grocery Delivery', sector:'E-commerce', difficulty:5, startCost:28000, burnBase:38000, growthBias:0.17, risk:0.71, arpu:22, desc:'Rapid local grocery logistics.', win:'Dense routing made key zones profitable.', riskEv:'Driver shortages hurt reliability.' },
  { id:'print_on_demand', icon:'👕', name:'Print-on-Demand Studio', sector:'E-commerce', difficulty:2, startCost:6000, burnBase:9000, growthBias:0.07, risk:0.34, arpu:24, desc:'Creator merch and custom print lines.', win:'A viral drop beat all projections.', riskEv:'Algorithm changes cut discoverability.' },
  { id:'payments_api', icon:'💳', name:'Payments API Startup', sector:'FinTech', difficulty:5, startCost:30000, burnBase:42000, growthBias:0.19, risk:0.75, arpu:180, desc:'Embedded payments and risk tools.', win:'Enterprise onboarding accelerated volume.', riskEv:'Regulatory scrutiny increased costs.' },
  { id:'credit_scoring', icon:'📉', name:'Alt Credit Scoring', sector:'FinTech', difficulty:4, startCost:22000, burnBase:30000, growthBias:0.15, risk:0.63, arpu:110, desc:'Alternative underwriting engine.', win:'Default rates beat market benchmarks.', riskEv:'Bias concerns caused public backlash.' },
  { id:'robo_advisor', icon:'🤝', name:'Robo Advisor App', sector:'FinTech', difficulty:4, startCost:20000, burnBase:28000, growthBias:0.14, risk:0.57, arpu:78, desc:'Automated investing app.', win:'A rally boosted AUM and referrals.', riskEv:'Market drawdown increased churn.' },
  { id:'payroll_smb', icon:'🧾', name:'SMB Payroll Platform', sector:'FinTech', difficulty:3, startCost:15000, burnBase:22000, growthBias:0.11, risk:0.46, arpu:88, desc:'Payroll + tax compliance for SMBs.', win:'Accountant referrals scaled quickly.', riskEv:'Filing outage damaged reputation.' },
  { id:'insurtech_claims', icon:'🧯', name:'InsurTech Claims Engine', sector:'FinTech', difficulty:5, startCost:27000, burnBase:36000, growthBias:0.16, risk:0.69, arpu:150, desc:'Claims automation for insurers.', win:'Claims turnaround time dropped sharply.', riskEv:'Underwriting losses hit confidence.' },
  { id:'fitness_content', icon:'🏋️', name:'Fitness Content Brand', sector:'Media', difficulty:2, startCost:7000, burnBase:10000, growthBias:0.09, risk:0.35, arpu:18, desc:'Subscription workouts and challenges.', win:'A challenge series went viral.', riskEv:'Audience engagement fell for a season.' },
  { id:'indie_game_studio', icon:'🎮', name:'Indie Game Studio', sector:'Media', difficulty:4, startCost:19000, burnBase:25000, growthBias:0.13, risk:0.58, arpu:64, desc:'Small studio shipping premium games.', win:'Launch reviews exceeded expectations.', riskEv:'A delayed release burned runway.' },
  { id:'podcast_network', icon:'🎙️', name:'Podcast Network', sector:'Media', difficulty:3, startCost:10000, burnBase:15000, growthBias:0.1, risk:0.42, arpu:21, desc:'Ads + premium feeds for niche shows.', win:'A flagship show landed a sponsor.', riskEv:'Host controversy hurt advertiser demand.' },
  { id:'newsletter_media', icon:'✉️', name:'Newsletter Media House', sector:'Media', difficulty:2, startCost:5000, burnBase:8000, growthBias:0.08, risk:0.33, arpu:14, desc:'Paid newsletters with expert creators.', win:'Bundled subscriptions improved retention.', riskEv:'Open-rate decline forced a reset.' },
  { id:'esports_org', icon:'🏆', name:'Esports Organization', sector:'Media', difficulty:5, startCost:32000, burnBase:45000, growthBias:0.17, risk:0.74, arpu:52, desc:'Team operations + media rights + merch.', win:'Tournament run drove global attention.', riskEv:'Roster issues disrupted sponsors.' },
];

const INVEST_PRODUCTS_V2 = [
  { key:'indexFund', label:'Index Fund', icon:'📈', min:-0.09, max:0.14, risk:1 },
  { key:'bonds', label:'Bond Fund', icon:'🧾', min:-0.03, max:0.07, risk:0 },
  { key:'realEstateFund', label:'REIT Fund', icon:'🏢', min:-0.14, max:0.18, risk:2 },
  { key:'ventureFund', label:'Venture Fund', icon:'🚀', min:-0.4, max:0.5, risk:4 },
  { key:'growthEtf', label:'Growth ETF', icon:'📊', min:-0.22, max:0.28, risk:3 },
  { key:'dividendFund', label:'Dividend Fund', icon:'💸', min:-0.06, max:0.11, risk:1 },
  { key:'commodities', label:'Commodities', icon:'🪙', min:-0.2, max:0.24, risk:3 },
  { key:'treasuries', label:'Treasuries', icon:'🏛️', min:-0.02, max:0.05, risk:0 },
];

const CRYPTO_COINS_V2 = [
  { id:'btc', label:'Bitcoin', icon:'₿', minAge:16, vol:0.05, drift:0.008, color:'#f7931a' },
  { id:'eth', label:'Ethereum', icon:'Ξ', minAge:16, vol:0.07, drift:0.01, color:'#8b8b8b' },
  { id:'sol', label:'Solana', icon:'◎', minAge:16, vol:0.095, drift:0.011, color:'#62f7c9' },
  { id:'meme', label:'Meme Coin', icon:'🐸', minAge:18, vol:0.14, drift:0.004, color:'#a7f34f' },
];

function ensureBusinessTabState(){
  if(typeof ensureAdvancedFinanceState === 'function') ensureAdvancedFinanceState();
  else ensureFinanceShape();
  if(!G.finance) G.finance = {};
  if(!G.finance.portfolio) G.finance.portfolio = {};
  INVEST_PRODUCTS_V2.forEach(p=>{
    if(typeof G.finance.portfolio[p.key] !== 'number') G.finance.portfolio[p.key] = 0;
  });
  if(!G.finance.crypto) G.finance.crypto = {};
  CRYPTO_COINS_V2.forEach(c=>{
    if(typeof G.finance.crypto[c.id] !== 'number') G.finance.crypto[c.id] = 0;
  });
  if(!G.finance.crypto.prices) G.finance.crypto.prices = { btc:100, eth:100, sol:100, meme:100 };
  if(!Array.isArray(G.finance.crypto.history)) G.finance.crypto.history = [];
  if(typeof G.finance.crypto.dayTradesThisYear !== 'number') G.finance.crypto.dayTradesThisYear = 0;
  if(typeof G.finance.crypto.traderSkill !== 'number') G.finance.crypto.traderSkill = 20;
  if(typeof G.finance.crypto.tradesWon !== 'number') G.finance.crypto.tradesWon = 0;
  if(typeof G.finance.crypto.tradesLost !== 'number') G.finance.crypto.tradesLost = 0;
  if(!G.finance.business) G.finance.business = {};
  const b = G.finance.business;
  if(typeof b.startupId !== 'string') b.startupId = '';
  if(typeof b.difficulty !== 'number') b.difficulty = 1;
  if(typeof b.complexity !== 'number') b.complexity = 20;
  if(typeof b.managementSkill !== 'number') b.managementSkill = 24;
  if(typeof b.founderExp !== 'number') b.founderExp = 0;
  if(typeof b.customerBase !== 'number') b.customerBase = 0;
  if(typeof b.equitySold !== 'number') b.equitySold = 0;
  if(typeof b.investorTier !== 'number') b.investorTier = 0;
  if(typeof b.investorName !== 'string') b.investorName = '';
  if(typeof b.actionsThisYear !== 'number') b.actionsThisYear = 0;
  if(typeof b.negativeYears !== 'number') b.negativeYears = 0;
  if(!Array.isArray(b.timeline)) b.timeline = [];
  if(!G.finance.crypto.history.length){
    const base = {
      btc:G.finance.crypto.prices.btc||100,
      eth:G.finance.crypto.prices.eth||100,
      sol:G.finance.crypto.prices.sol||100,
      meme:G.finance.crypto.prices.meme||100,
    };
    for(let i=0;i<18;i++){
      G.finance.crypto.history.push({
        age:Math.max(0, (G.age||0)-18+i),
        btc:Math.max(5, Math.floor(base.btc * (0.9 + i*0.008 + rnd(-3,3)/100))),
        eth:Math.max(5, Math.floor(base.eth * (0.9 + i*0.008 + rnd(-4,4)/100))),
        sol:Math.max(5, Math.floor(base.sol * (0.9 + i*0.009 + rnd(-5,5)/100))),
        meme:Math.max(5, Math.floor(base.meme * (0.9 + i*0.01 + rnd(-8,8)/100))),
      });
    }
  }
}

function startupById(id){ return STARTUP_OPTIONS_25.find(s=>s.id===id); }

function starDifficulty(n){ return '★'.repeat(Math.max(1, Math.min(5, n))); }

function businessSkillCeiling(b){
  const smartsBonus = Math.floor(((G.smarts||50)-50)*0.22);
  const fameBonus = Math.min(8, Math.floor((G.sm?.totalFame||0)/20));
  const investorBoost = (b.investorTier||0) * 4;
  return Math.max(20, Math.min(99, Math.floor((b.managementSkill||24) + (b.founderExp||0)*0.45 + smartsBonus + fameBonus + investorBoost)));
}

function businessActionCap(b){
  return 3 + (b.investorTier||0) + ((G.smarts||50)>=70 ? 1 : 0);
}

function businessSpendCheck(cost){
  if(cost<=0) return true;
  if(G.money < cost){ flash(`Need ${fmt$(cost)}.`,'warn'); return false; }
  G.money -= cost;
  return true;
}

function consumeBusinessAction(stressDelta){
  const b = G.finance.business;
  b.actionsThisYear = (b.actionsThisYear||0) + 1;
  if(typeof stressDelta === 'number'){
    G.stress = clamp((G.stress||35) + stressDelta);
  }
}

function portfolioTotalValue(){
  ensureBusinessTabState();
  const p = G.finance.portfolio;
  return (G.finance.investments||0) + INVEST_PRODUCTS_V2.reduce((sum, x)=>sum + (p[x.key]||0), 0);
}

function cryptoTotalValue(){
  ensureBusinessTabState();
  const c = G.finance.crypto;
  return CRYPTO_COINS_V2.reduce((sum, x)=>sum + (c[x.id]||0), 0);
}

function invest(amount){
  investAsset('indexFund', amount);
}

function investAsset(bucketId, amount){
  ensureBusinessTabState();
  const bucket = INVEST_PRODUCTS_V2.find(x=>x.key===bucketId);
  if(!bucket){ flash('Investment bucket not found.','warn'); return; }
  const buy = Math.floor(amount||0);
  if(buy<=0){ flash('Invalid amount.','warn'); return; }
  if(G.money<buy){ flash('Not enough cash.','warn'); return; }
  G.money -= buy;
  G.finance.portfolio[bucket.key] = (G.finance.portfolio[bucket.key]||0) + buy;
  G.stress = clamp((G.stress||35) + rnd(0,2) + bucket.risk);
  addEv(`You allocated ${fmt$(buy)} to ${bucket.label}.`, 'good');
  updateHUD();
  renderBusiness();
}

function withdrawAsset(bucketId, pct){
  ensureBusinessTabState();
  const bucket = INVEST_PRODUCTS_V2.find(x=>x.key===bucketId);
  if(!bucket){ flash('Investment bucket not found.','warn'); return; }
  const cur = G.finance.portfolio[bucket.key]||0;
  if(cur<=0){ flash('No position to sell.','warn'); return; }
  const ratio = Math.max(0.05, Math.min(1, pct||0.25));
  const amt = Math.floor(cur * ratio);
  if(amt<=0){ flash('Position too small.','warn'); return; }
  G.finance.portfolio[bucket.key] = Math.max(0, cur - amt);
  G.money += amt;
  G.stress = clamp((G.stress||35) - rnd(0,2));
  addEv(`You sold ${fmt$(amt)} from ${bucket.label}.`, 'good');
  updateHUD();
  renderBusiness();
}

function buyCrypto(assetId, amount){
  ensureBusinessTabState();
  const asset = CRYPTO_COINS_V2.find(a=>a.id===assetId);
  if(!asset){ flash('Crypto asset not found.','warn'); return; }
  if(G.age<asset.minAge){ flash(`${asset.label} unlocks at age ${asset.minAge}.`,'warn'); return; }
  const buy = Math.floor(amount||0);
  if(buy<=0){ flash('Invalid amount.','warn'); return; }
  if(G.money<buy){ flash('Not enough cash.','warn'); return; }
  G.money -= buy;
  G.finance.crypto[asset.id] = (G.finance.crypto[asset.id]||0) + buy;
  G.stress = clamp((G.stress||35) + rnd(1,4));
  addEv(`You bought ${fmt$(buy)} of ${asset.label}.`, 'warn');
  updateHUD();
  renderBusiness();
}

function sellCrypto(assetId, pct){
  ensureBusinessTabState();
  const asset = CRYPTO_COINS_V2.find(a=>a.id===assetId);
  if(!asset){ flash('Crypto asset not found.','warn'); return; }
  const cur = G.finance.crypto[asset.id]||0;
  if(cur<=0){ flash(`No ${asset.label} position to sell.`, 'warn'); return; }
  const ratio = Math.max(0.05, Math.min(1, pct||0.25));
  const amt = Math.floor(cur * ratio);
  if(amt<=0){ flash('Position too small.','warn'); return; }
  G.finance.crypto[asset.id] = Math.max(0, cur - amt);
  G.money += amt;
  G.stress = clamp((G.stress||35) - rnd(1,4));
  addEv(`You sold ${fmt$(amt)} of ${asset.label}.`, 'good');
  updateHUD();
  renderBusiness();
}

function startBusiness(startupId){
  ensureBusinessTabState();
  const b = G.finance.business;
  if(b.active){ flash('You already run a startup.','warn'); return; }
  const s = startupById(startupId);
  if(!s){ flash('Startup not found.','warn'); return; }
  if(G.age<18){ flash('Founder mode unlocks at age 18.','warn'); return; }
  if(G.money<s.startCost){ flash(`Need ${fmt$(s.startCost)} to launch this startup.`,'warn'); return; }

  G.money -= s.startCost;
  b.active = true;
  b.startupId = s.id;
  b.name = `${pick(['Nova','Apex','Pulse','Vertex','Orbit','Prime','Blue','Cinder'])} ${pick(['Labs','Ventures','Systems','Collective','Works','Studio'])}`;
  b.sector = s.sector;
  b.stage = 'idea';
  b.employees = 1;
  b.reputation = clamp(38 + Math.floor((G.smarts||50)/5) + rnd(-6,6));
  b.product = clamp(42 + Math.floor((G.smarts||50)/4) + rnd(-8,8));
  b.operations = clamp(40 + rnd(-7,7));
  b.marketing = clamp(38 + rnd(-7,7));
  b.burn = s.burnBase;
  b.cashReserve = Math.floor(s.startCost * 0.75);
  b.valuation = Math.floor(s.startCost * (2 + s.difficulty*0.3));
  b.years = 0;
  b.lastProfit = 0;
  b.hasInvestor = false;
  b.difficulty = s.difficulty;
  b.complexity = 18 + s.difficulty*8;
  b.managementSkill = Math.max(20, b.managementSkill||24);
  b.founderExp = b.founderExp||0;
  b.customerBase = rnd(80, 450);
  b.equitySold = 0;
  b.investorTier = 0;
  b.investorName = '';
  b.actionsThisYear = 0;
  b.negativeYears = 0;
  b.timeline = [{ year:G.age, text:`Founded ${b.name} (${s.name})` }];

  G.stress = clamp((G.stress||35) + rnd(8,14));
  addEv(`You launched ${b.name}: ${s.name}. Difficulty ${starDifficulty(s.difficulty)}.`, 'love');
  if(!G.career.milestones) G.career.milestones = [];
  G.career.milestones.push({ year:G.age, text:`Founded ${b.name} (${s.name})` });
  updateHUD();
  renderBusiness();
}

function businessRaise(round){
  const b = G.finance.business;
  const s = startupById(b.startupId);
  const fame = G.sm?.totalFame || 0;
  const fameBoost = Math.min(0.24, fame/420);
  const traction = Math.min(0.35, (b.customerBase||0)/60000) + (b.product||40)/360 + (b.reputation||40)/360;
  const difficultyPenalty = (b.difficulty||1) * 0.025;
  const cycleBoost = (G.finance.crypto.marketCycle==='bull' ? 0.03 : G.finance.crypto.marketCycle==='bear' ? -0.03 : 0);
  let chance = 0.24 + fameBoost + traction + cycleBoost - difficultyPenalty;
  if(round==='series') chance -= 0.06;
  chance = Math.max(0.07, Math.min(0.88, chance));
  if(Math.random() < chance){
    const tierUp = round==='seed' ? 1 : 2;
    const raise = round==='seed' ? rnd(90000,450000) : rnd(350000,2200000);
    const equity = round==='seed' ? rnd(8,16) : rnd(10,22);
    const investor = pick(['Northline Capital','Archer Ventures','Summit One','Red Harbor','Atlas Growth','Aurora Partners','Cobalt Ventures']);
    b.cashReserve += raise;
    b.valuation += Math.floor(raise * (1.1 + rnd(10,45)/100));
    b.hasInvestor = true;
    b.investorTier = Math.max(b.investorTier||0, tierUp);
    b.investorName = investor;
    b.equitySold = Math.min(85, (b.equitySold||0) + equity);
    b.stage = round==='seed' ? 'seed' : 'growth';
    b.managementSkill = clamp((b.managementSkill||24) + rnd(1,4));
    addEv(`${investor} invested ${fmt$(raise)} in ${b.name}. Fame and traction helped your pitch.`, 'love');
  } else {
    b.reputation = clamp((b.reputation||45) - rnd(1,4));
    G.stress = clamp((G.stress||35) + rnd(3,8));
    addEv(`Investor meetings ended in "not this round" for ${b.name}.`, 'warn');
  }
}

function businessAction(action){
  ensureBusinessTabState();
  const b = G.finance.business;
  if(!b.active){ flash('No active startup to manage.','warn'); return; }
  const s = startupById(b.startupId);
  const cap = businessActionCap(b);
  if((b.actionsThisYear||0) >= cap && action!=='exit' && action!=='shutdown'){
    flash(`Action cap reached this year (${cap}). Age up to continue.`,'warn');
    return;
  }

  if(action==='build'){
    const cost = 2600 + s.difficulty*900 + b.employees*650;
    if(!businessSpendCheck(cost)) return;
    b.product = clamp(b.product + rnd(4,10));
    b.operations = clamp(b.operations + rnd(1,4));
    b.complexity = clamp(b.complexity + rnd(2,6));
    b.customerBase += rnd(80,320);
    consumeBusinessAction(rnd(3,7));
    addEv(`${b.name} shipped a major product sprint.`, 'good');
  } else if(action==='market'){
    const cost = 2200 + s.difficulty*700 + rnd(600,2400);
    if(!businessSpendCheck(cost)) return;
    b.marketing = clamp(b.marketing + rnd(4,9));
    b.reputation = clamp(b.reputation + rnd(2,6));
    b.customerBase += rnd(120,540);
    b.complexity = clamp(b.complexity + rnd(1,4));
    consumeBusinessAction(rnd(2,6));
    addEv(`${b.name} launched a growth campaign.`, 'good');
  } else if(action==='hire'){
    const hireCost = 7500 + b.employees*3300;
    if(!businessSpendCheck(hireCost)) return;
    b.employees += 1;
    b.operations = clamp(b.operations + rnd(2,5));
    b.burn += rnd(8000,18000);
    b.complexity = clamp(b.complexity + rnd(4,8));
    consumeBusinessAction(rnd(3,7));
    addEv(`You hired at ${b.name}. Team size: ${b.employees}.`, 'warn');
  } else if(action==='systems'){
    const cost = 3500 + s.difficulty*850;
    if(!businessSpendCheck(cost)) return;
    b.operations = clamp(b.operations + rnd(5,11));
    b.managementSkill = clamp((b.managementSkill||24) + rnd(3,8));
    b.burn = Math.max(4000, b.burn - rnd(2000,7000));
    b.complexity = clamp(b.complexity - rnd(3,8));
    consumeBusinessAction(rnd(1,3));
    addEv(`You built internal systems and playbooks at ${b.name}.`, 'good');
  } else if(action==='learn'){
    const cost = 1200 + s.difficulty*350;
    if(!businessSpendCheck(cost)) return;
    b.managementSkill = clamp((b.managementSkill||24) + rnd(4,9));
    b.founderExp += rnd(2,5);
    b.complexity = clamp(b.complexity - rnd(1,4));
    consumeBusinessAction(-rnd(1,3));
    addEv('You invested in founder education and advisory sessions.', 'good');
  } else if(action==='cut'){
    if(b.employees<=1){ flash('No team to cut.','warn'); return; }
    b.employees -= 1;
    b.burn = Math.max(4000, b.burn - rnd(7000,15000));
    b.reputation = clamp(b.reputation - rnd(2,6));
    b.operations = clamp(b.operations - rnd(1,4));
    b.complexity = clamp(b.complexity - rnd(0,3));
    consumeBusinessAction(rnd(1,4));
    addEv(`Cost-cutting reduced runway pressure at ${b.name}.`, 'bad');
  } else if(action==='raise_seed'){
    consumeBusinessAction(rnd(2,5));
    businessRaise('seed');
  } else if(action==='raise_series'){
    if((b.investorTier||0)<1){ flash('Raise a seed round first.','warn'); return; }
    consumeBusinessAction(rnd(2,6));
    businessRaise('series');
  } else if(action==='salary'){
    if(b.cashReserve<10000){ flash('Need at least $10k in reserve.','warn'); return; }
    const pay = Math.floor(Math.min(b.cashReserve*0.35, rnd(7000,42000)));
    b.cashReserve -= pay;
    G.money += pay;
    consumeBusinessAction(-rnd(1,4));
    addEv(`Founder salary paid from ${b.name}: ${fmt$(pay)}.`, 'good');
  } else if(action==='exit'){
    if(b.valuation<220000){ flash('Valuation too low to exit right now.','warn'); return; }
    const retain = 1 - ((b.equitySold||0)/100);
    const exitMultiple = (b.investorTier||0)>=2 ? rnd(18,28)/100 : rnd(14,24)/100;
    const payout = Math.floor(Math.max(0.05, retain) * b.valuation * exitMultiple);
    G.money += payout;
    G.career.reputation = clamp((G.career.reputation||50) + rnd(8,15));
    G.sm.totalFame = clamp((G.sm.totalFame||0) + rnd(2,8));
    G.stress = clamp((G.stress||35) - rnd(8,16));
    addEv(`You exited ${b.name} for ${fmt$(payout)}.`, 'love');
    G.finance.business = {
      active:false, name:'', sector:'', stage:'idea', employees:0, reputation:50, product:45, operations:45, marketing:40,
      burn:0, cashReserve:0, valuation:0, years:0, lastProfit:0, hasInvestor:false,
      startupId:'', difficulty:1, complexity:20, managementSkill:b.managementSkill||30, founderExp:(b.founderExp||0)+4,
      customerBase:0, equitySold:0, investorTier:0, investorName:'', actionsThisYear:0, negativeYears:0, timeline:[],
    };
  } else if(action==='shutdown'){
    addEv(`You shut down ${b.name} and preserved what capital was left.`, 'warn');
    G.finance.business = {
      active:false, name:'', sector:'', stage:'idea', employees:0, reputation:50, product:45, operations:45, marketing:40,
      burn:0, cashReserve:0, valuation:0, years:0, lastProfit:0, hasInvestor:false,
      startupId:'', difficulty:1, complexity:20, managementSkill:b.managementSkill||28, founderExp:(b.founderExp||0)+2,
      customerBase:0, equitySold:0, investorTier:0, investorName:'', actionsThisYear:0, negativeYears:0, timeline:[],
    };
    G.stress = clamp((G.stress||35) - rnd(2,6));
  }

  updateHUD();
  renderBusiness();
}

function dayTrade(assetId, direction, stake){
  ensureBusinessTabState();
  const asset = CRYPTO_COINS_V2.find(c=>c.id===assetId);
  if(!asset){ flash('Asset not found.','warn'); return; }
  const c = G.finance.crypto;
  if(c.dayTradesThisYear>=4){ flash('Max 4 day trades per year. Age up to reset.', 'warn'); return; }
  if(G.age<asset.minAge){ flash(`${asset.label} unlocks at age ${asset.minAge}.`,'warn'); return; }
  const risk = Math.floor(stake||0);
  if(risk<=0 || G.money<risk){ flash('Not enough cash for this trade.','warn'); return; }
  G.money -= risk;

  const trend = c.marketCycle==='bull' ? 0.012 : c.marketCycle==='bear' ? -0.012 : 0;
  const edge = ((c.traderSkill||20)-40)/1500;
  const move = (rnd(-100,100)/100) * asset.vol + trend + edge;
  const signed = direction==='short' ? -move : move;
  const leverage = 3;
  const pnlRaw = risk * signed * leverage;
  const pnl = Math.floor(Math.max(-risk, pnlRaw));
  const returned = Math.max(0, risk + pnl);
  G.money += returned;
  c.dayTradesThisYear += 1;
  c.prices[asset.id] = Math.max(5, Math.floor((c.prices[asset.id]||100) * (1 + move)));
  if(pnl>=0){
    c.tradesWon += 1;
    c.traderSkill = clamp((c.traderSkill||20) + rnd(1,3));
    G.stress = clamp((G.stress||35) + rnd(0,2));
    addEv(`Day trade win on ${asset.label}: +${fmt$(pnl)} (${direction}).`, 'good');
  } else {
    c.tradesLost += 1;
    c.traderSkill = clamp((c.traderSkill||20) + rnd(0,2));
    G.stress = clamp((G.stress||35) + rnd(2,6));
    addEv(`Day trade loss on ${asset.label}: ${fmt$(pnl)} (${direction}).`, 'bad');
  }
  updateHUD();
  renderBusiness();
}

function processInvestmentAndCryptoYear(ledger){
  ensureBusinessTabState();
  const p = G.finance.portfolio;
  const c = G.finance.crypto;
  let totalDelta = 0;

  const cycleAdj = c.marketCycle==='bull' ? 0.03 : c.marketCycle==='bear' ? -0.04 : c.marketCycle==='recovery' ? 0.012 : 0;
  INVEST_PRODUCTS_V2.forEach(asset=>{
    const cur = p[asset.key]||0;
    if(cur<=0) return;
    const pct = rnd(Math.floor((asset.min + cycleAdj)*100), Math.floor((asset.max + cycleAdj)*100))/100;
    const delta = Math.floor(cur * pct);
    p[asset.key] = Math.max(0, cur + delta);
    totalDelta += delta;
    if(delta < -700){
      G.stress = clamp((G.stress||35) + asset.risk);
    }
  });

  if((G.finance.investments||0)>0){
    const pct = rnd(-6,13)/100;
    const delta = Math.floor(G.finance.investments * pct);
    G.finance.investments = Math.max(0, G.finance.investments + delta);
    totalDelta += delta;
  }

  c.marketMomentum = Math.max(-0.7, Math.min(0.8, (c.marketMomentum||0)*0.55 + rnd(-30,30)/100*0.45));
  c.marketCycle = c.marketMomentum>0.3 ? 'bull' : c.marketMomentum<-0.3 ? 'bear' : Math.abs(c.marketMomentum)<0.08 ? 'neutral' : c.marketMomentum>0 ? 'recovery' : 'cooldown';

  let cryptoDelta = 0;
  CRYPTO_COINS_V2.forEach(asset=>{
    const held = c[asset.id]||0;
    const cycleDrift = c.marketCycle==='bull' ? 0.07 : c.marketCycle==='bear' ? -0.08 : c.marketCycle==='recovery' ? 0.03 : 0;
    const pct = asset.drift + cycleDrift + rnd(-100,100)/100 * asset.vol;
    const clipped = Math.max(-0.75, Math.min(1.4, pct));
    c.prices[asset.id] = Math.max(5, Math.floor((c.prices[asset.id]||100) * (1 + clipped)));
    if(held>0){
      const delta = Math.floor(held * clipped);
      c[asset.id] = Math.max(0, held + delta);
      cryptoDelta += delta;
    }
  });
  totalDelta += cryptoDelta;

  c.history.push({
    age:G.age,
    btc:c.prices.btc||100,
    eth:c.prices.eth||100,
    sol:c.prices.sol||100,
    meme:c.prices.meme||100,
  });
  if(c.history.length>48) c.history.shift();
  c.lastYearPnl = totalDelta;
  c.dayTradesThisYear = 0;

  if(totalDelta>=0){
    ledger.investmentGains += totalDelta;
    if(totalDelta>1200) addEv(`Portfolio + crypto added ${fmt$(totalDelta)} this year.`, 'good');
  } else {
    G.stress = clamp((G.stress||35) + rnd(1,4));
    if(Math.abs(totalDelta)>1200) addEv(`Markets pulled back ${fmt$(Math.abs(totalDelta))} this year.`, 'warn');
  }
}

function processBusinessYear(ledger){
  ensureBusinessTabState();
  const b = G.finance.business;
  if(!b.active) return;
  const s = startupById(b.startupId);
  if(!s) return;

  b.years += 1;
  b.founderExp += rnd(1,3);
  const ceiling = businessSkillCeiling(b);
  const overload = Math.max(0, (b.complexity||20) - ceiling);
  const overloadPenalty = Math.min(0.55, overload * 0.012);
  const climate = ((G.gov?.policy?.businessClimate||50)-50)/260;

  const growthFactor = Math.max(0.15, 0.55 + (b.product||40)/140 + (b.marketing||40)/170 + s.growthBias + climate - overloadPenalty + rnd(-8,14)/100);
  const grossAdds = Math.floor((rnd(120,1400) + (b.marketing||40)*11 + (b.product||40)*8) * growthFactor / Math.max(0.8, s.difficulty*0.7));
  const churnRate = Math.max(0.04, 0.12 + s.risk*0.1 + overloadPenalty*0.5 - (b.operations||40)/280);
  const churn = Math.floor((b.customerBase||0) * churnRate);
  b.customerBase = Math.max(0, (b.customerBase||0) + grossAdds - churn);

  const efficiency = Math.max(0.18, 0.28 + (b.operations||40)/180 + (b.product||40)/220 - overloadPenalty);
  const revenue = Math.floor((b.customerBase||0) * s.arpu * efficiency);
  const operatingCost = Math.floor((b.burn||0) + (b.employees||0)*rnd(15000,36000) + rnd(3000,18000));
  const profit = revenue - operatingCost;
  b.lastProfit = profit;
  b.cashReserve += profit;
  b.valuation = Math.max(0, Math.floor(Math.max(0,revenue) * (1.6 + s.growthBias*2 + (b.reputation||40)/120) + Math.max(0,b.cashReserve)*1.15));

  if(profit>0){
    const founderTake = Math.floor(profit * ((b.hasInvestor||b.equitySold>0) ? 0.08 : 0.16));
    if(founderTake>0){
      G.money += founderTake;
      ledger.otherIncome += founderTake;
    }
    b.reputation = clamp((b.reputation||50) + rnd(1,4));
    if(revenue > Math.max(150000, operatingCost*1.5)) b.stage = 'growth';
  } else {
    b.reputation = clamp((b.reputation||50) - rnd(1,3));
    G.stress = clamp((G.stress||35) + rnd(2,6));
  }

  if(Math.random()<0.24){
    if(Math.random()<0.52){
      b.customerBase += rnd(150,900);
      b.reputation = clamp((b.reputation||50) + rnd(2,5));
      addEv(`${s.win}`, 'good');
    } else {
      const hit = rnd(3000,22000) + s.difficulty*2200;
      b.cashReserve -= hit;
      b.operations = clamp((b.operations||45) - rnd(1,4));
      G.stress = clamp((G.stress||35) + rnd(2,6));
      addEv(`${s.riskEv} (-${fmt$(hit)}).`, 'warn');
    }
  }

  if((b.hasInvestor||b.equitySold>0) && Math.random()<0.18){
    b.complexity = clamp((b.complexity||20) + rnd(2,5));
    G.stress = clamp((G.stress||35) + rnd(1,4));
    addEv(`Investor reporting increased pressure at ${b.name}.`, 'warn');
  }

  if((b.cashReserve||0)<0){
    b.negativeYears = (b.negativeYears||0) + 1;
  } else {
    b.negativeYears = 0;
  }

  if((b.negativeYears||0)>=2){
    addEv(`${b.name} ran out of runway and shut down.`, 'bad');
    G.finance.debt += Math.abs(Math.floor(b.cashReserve||0));
    G.finance.business = {
      active:false, name:'', sector:'', stage:'idea', employees:0, reputation:50, product:45, operations:45, marketing:40,
      burn:0, cashReserve:0, valuation:0, years:0, lastProfit:0, hasInvestor:false,
      startupId:'', difficulty:1, complexity:20, managementSkill:Math.max(24, b.managementSkill||24), founderExp:(b.founderExp||0)+2,
      customerBase:0, equitySold:0, investorTier:0, investorName:'', actionsThisYear:0, negativeYears:0, timeline:[],
    };
    return;
  }

  b.timeline.push({ year:G.age, text:`Revenue ${fmt$(revenue)} · Profit ${fmt$(profit)} · Customers ${(b.customerBase||0).toLocaleString()}` });
  if(b.timeline.length>8) b.timeline.shift();
  b.complexity = clamp((b.complexity||20) + rnd(0,3) + Math.floor((b.employees||0)/8) - Math.floor((b.managementSkill||24)/35));
  b.actionsThisYear = 0;
}

function sparkBars(values, color){
  if(!values || !values.length) return '<div style="height:44px"></div>';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(1, max-min);
  return `<div style="display:flex;align-items:flex-end;gap:2px;height:44px">${values.map(v=>{
    const h = 8 + Math.round(((v-min)/spread)*36);
    return `<span style="display:block;width:4px;height:${h}px;background:${color};border-radius:2px;opacity:.9"></span>`;
  }).join('')}</div>`;
}

function cryptoSeries(assetId, take){
  ensureBusinessTabState();
  const hist = G.finance.crypto.history||[];
  const arr = hist.map(x=>x[assetId]||100);
  return arr.slice(Math.max(0, arr.length-(take||24)));
}

function renderBusiness(){
  const bc = document.getElementById('business-content');
  if(!bc) return;
  ensureBusinessTabState();

  const b = G.finance.business;
  const c = G.finance.crypto;
  const p = G.finance.portfolio;
  const portfolioTotal = portfolioTotalValue();
  const cryptoTotal = cryptoTotalValue();
  const ceiling = businessSkillCeiling(b);
  const overload = Math.max(0, (b.complexity||20) - ceiling);

  let html = `<div class="card">
    <div class="card-title">Founder + Capital Markets</div>
    <p style="font-size:.8rem;color:var(--muted2)">Business systems moved out of Jobs. Founder difficulty is now skill-capped: complexity can outgrow your management ability unless you train and systemize.</p>
    <p style="font-size:.78rem;color:var(--muted2)">Portfolio: ${fmt$(portfolioTotal)} · Crypto: ${fmt$(cryptoTotal)} · Day trades used: ${c.dayTradesThisYear||0}/4</p>
  </div>`;

  html += `<div class="card"><div class="card-title">Startups (25 Paths)</div>`;
  if(!b.active){
    html += `<p style="font-size:.78rem;color:var(--muted2);margin-bottom:10px">Each startup has unique cost, risk, and event flavor. Fame helps fundraising success later.</p><div class="choice-grid">`;
    STARTUP_OPTIONS_25.forEach(s=>{
      html += `<div class="choice" onclick="startBusiness('${s.id}')">
        <div class="choice-icon">${s.icon}</div>
        <div class="choice-name">${s.name}</div>
        <div class="choice-desc">${s.sector} · ${starDifficulty(s.difficulty)} · ${fmt$(s.startCost)} start · ${fmt$(s.burnBase)}/yr burn</div>
        <div class="choice-desc">${s.desc}</div>
      </div>`;
    });
    html += `</div>`;
  } else {
    const s = startupById(b.startupId);
    const cap = businessActionCap(b);
    html += `<p style="font-size:.78rem;color:var(--muted2)"><strong style="color:var(--text)">${b.name}</strong> · ${s?.name||'Startup'} · ${s?.sector||b.sector}</p>
      <p style="font-size:.78rem;color:var(--muted2)">Difficulty ${starDifficulty(b.difficulty||1)} · Stage ${b.stage} · Employees ${b.employees}</p>
      <p style="font-size:.78rem;color:var(--muted2)">Customers ${(b.customerBase||0).toLocaleString()} · Burn ${fmt$(b.burn||0)}/yr · Reserve ${fmt$(b.cashReserve||0)} · Valuation ${fmt$(b.valuation||0)}</p>
      <p style="font-size:.78rem;color:var(--muted2)">Product ${b.product} · Ops ${b.operations} · Marketing ${b.marketing} · Reputation ${b.reputation}</p>
      <p style="font-size:.78rem;color:${overload>0?'var(--danger)':'var(--muted2)'}">Skill ceiling ${ceiling} vs complexity ${b.complexity||0} ${overload>0?`(Overload +${overload}, yearly execution penalty)`:''}</p>
      <p style="font-size:.78rem;color:var(--muted2)">Actions this year: ${b.actionsThisYear||0}/${cap} · Investor: ${b.hasInvestor?`${b.investorName} (Tier ${b.investorTier}, ${b.equitySold}% sold)`:'Bootstrapped'}</p>
      <div class="choice-grid">
        <div class="choice" onclick="businessAction('build')"><div class="choice-icon">🛠️</div><div class="choice-name">Build Product</div><div class="choice-desc">Ship features, raise complexity</div></div>
        <div class="choice" onclick="businessAction('market')"><div class="choice-icon">📣</div><div class="choice-name">Growth Campaign</div><div class="choice-desc">Acquire customers faster</div></div>
        <div class="choice" onclick="businessAction('hire')"><div class="choice-icon">🧑‍💼</div><div class="choice-name">Hire</div><div class="choice-desc">Scale team, burn, complexity</div></div>
        <div class="choice" onclick="businessAction('systems')"><div class="choice-icon">⚙️</div><div class="choice-name">Systemize Ops</div><div class="choice-desc">Raise skill, reduce overload</div></div>
        <div class="choice" onclick="businessAction('learn')"><div class="choice-icon">🎓</div><div class="choice-name">Founder Training</div><div class="choice-desc">Raise management ceiling</div></div>
        <div class="choice" onclick="businessAction('cut')"><div class="choice-icon">✂️</div><div class="choice-name">Cut Burn</div><div class="choice-desc">Protect runway, reputation risk</div></div>
        <div class="choice" onclick="businessAction('raise_seed')"><div class="choice-icon">💰</div><div class="choice-name">Raise Seed</div><div class="choice-desc">Fame/traction increases odds</div></div>
        <div class="choice${(b.investorTier||0)<1?' disabled':''}" onclick="businessAction('raise_series')"><div class="choice-icon">🏦</div><div class="choice-name">Raise Series</div><div class="choice-desc">${(b.investorTier||0)>=1?'Larger round, more pressure':'Needs seed investor'}</div></div>
        <div class="choice" onclick="businessAction('salary')"><div class="choice-icon">🏧</div><div class="choice-name">Founder Salary</div><div class="choice-desc">Pay from business reserve</div></div>
        <div class="choice" onclick="businessAction('exit')"><div class="choice-icon">🏁</div><div class="choice-name">Exit Company</div><div class="choice-desc">Liquidity event</div></div>
        <div class="choice" onclick="businessAction('shutdown')"><div class="choice-icon">🧯</div><div class="choice-name">Shut Down</div><div class="choice-desc">Stop losses and reset</div></div>
      </div>
      ${(b.timeline||[]).length?`<div style="margin-top:10px">${(b.timeline||[]).slice().reverse().map(t=>`<div style="font-size:.75rem;color:var(--muted2);padding:2px 0">• Age ${t.year}: ${t.text}</div>`).join('')}</div>`:''}`;
  }
  html += `</div>`;

  html += `<div class="card">
    <div class="card-title">Investing Suite</div>
    <p style="font-size:.78rem;color:var(--muted2)">Build diversified positions and rebalance over time.</p>
    <div class="choice-grid">
      ${INVEST_PRODUCTS_V2.map(a=>`<div class="choice">
        <div class="choice-icon">${a.icon}</div>
        <div class="choice-name">${a.label}</div>
        <div class="choice-desc">Holding ${fmt$(p[a.key]||0)}</div>
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" onclick="investAsset('${a.key}',1000)">Buy $1k</button>
          <button class="btn btn-ghost btn-sm" onclick="withdrawAsset('${a.key}',0.25)">Sell 25%</button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;

  html += `<div class="card">
    <div class="card-title">Crypto + Day Trading</div>
    <p style="font-size:.78rem;color:var(--muted2)">Cycle: ${c.marketCycle||'neutral'} · Trader skill ${c.traderSkill||20} · W/L ${c.tradesWon||0}/${c.tradesLost||0}</p>
    <div class="choice-grid">
      ${CRYPTO_COINS_V2.map(a=>`<div class="choice">
        <div class="choice-icon">${a.icon}</div>
        <div class="choice-name">${a.label}</div>
        <div class="choice-desc">Holding ${fmt$(c[a.id]||0)} · Index ${(c.prices?.[a.id]||100).toLocaleString()}</div>
        ${sparkBars(cryptoSeries(a.id, 24), a.color)}
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" onclick="buyCrypto('${a.id}',1000)">Buy $1k</button>
          <button class="btn btn-ghost btn-sm" onclick="sellCrypto('${a.id}',0.25)">Sell 25%</button>
          <button class="btn btn-ghost btn-sm" onclick="dayTrade('${a.id}','long',1000)">Day Long</button>
          <button class="btn btn-ghost btn-sm" onclick="dayTrade('${a.id}','short',1000)">Day Short</button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;

  bc.innerHTML = html;
}

