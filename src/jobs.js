//  jobs.js — Careers, coworkers, med/law school
// ═══════════════════════════════════════════════════════════════

function eduLevel(){
  const c = G.career;
  if(c.licenses.law) return 'law';
  if(c.licenses.medical) return 'med';
  if(G.school.graduated || (!G.school.uni.enrolled && G.school.uni.course)) return 'college';
  if(G.age>=18 || G.school.stage==='high' || G.school.stage==='middle' || G.school.stage==='elementary') return 'hs';
  return 'none';
}

function degreeName(){
  return G.school.uni.course || G.school.degree || '';
}

function collegePrestigeBonus(){
  const p = (G.school.uni.collegePrestige || 60);
  return Math.floor((p - 60) / 2);
}

function jobQualificationScore(){
  const gpa = G.school.uni.gpa || G.school.gpa || 2.5;
  const gpaBonus = (gpa - 2.5) * 10;
  return G.smarts + collegePrestigeBonus() + gpaBonus + (G.career.reputation-50)/2;
}

function jobEligible(j){
  if(G.age < j.minAge) return false;
  const edu = eduLevel();
  const needs = j.minEdu;
  const order = { none:0, hs:1, college:2, med:3, law:3 };
  if(order[edu] < order[needs]) return false;
  const score = jobQualificationScore();
  if(j.tier==='elite' && score < 90) return false;
  if(j.tier==='exec' && score < 80) return false;
  if(j.tier==='senior' && score < 70) return false;
  const deg = degreeName();
  if(j.degrees && j.degrees.length && deg && !j.degrees.includes(deg) && needs!=='med' && needs!=='law'){
    return false;
  }
  if(needs==='med' && !G.career.licenses.medical) return false;
  if(needs==='law' && !G.career.licenses.law) return false;
  return true;
}

function makeWorkPerson(role){
  const g = pick(['male','female']);
  const p = makePerson(role, g);
  p.age = Math.max(18, G.age + rnd(-12, 10));
  p.relation = rnd(35,80);
  p.attraction = rnd(10,90);
  p.hrRisk = 0;
  return p;
}

function genCoworkers(){
  const boss = makeWorkPerson('Boss');
  const count = rnd(2,5);
  const coworkers = [];
  for(let i=0;i<count;i++) coworkers.push(makeWorkPerson('Coworker'));
  return { boss, coworkers };
}

function startJob(job){
  const lvl = 0;
  const mult = JOB_LEVELS[lvl].payMult;
  const company = pick(COMPANIES);
  const crew = genCoworkers();
  const bonusRate = job.tier==='elite'?0.22:job.tier==='exec'?0.18:job.tier==='senior'?0.12:job.tier==='legal'?0.1:job.tier==='medical'?0.12:0.06;
  const benefits = { healthPlan:true, retirement: job.tier!=='teen' };

  G.career.employed = true;
  G.career.jobId = job.id;
  G.career.title = job.title;
  G.career.company = company;
  G.career.salary = Math.floor(job.basePay * mult);
  G.career.level = lvl;
  G.career.years = 0;
  G.career.performance = clamp(G.career.performance + rnd(-3,6));
  G.career.hrRisk = Math.max(0, G.career.hrRisk - 5);
  G.career.boss = crew.boss;
  G.career.coworkers = crew.coworkers;
  G.career.fired = false;
  G.career.bonusRate = bonusRate;
  G.career.benefits = benefits;
  if(job.tier==='elite' || job.tier==='exec'){
    G.career.stockUnits += rnd(10,40);
    G.career.stockValue = Math.max(10, G.career.stockValue || rnd(20,60));
  }

  addEv(`You started as ${job.title} at ${company}. Salary: ${fmt$(G.career.salary)}/yr.`, 'good');
  flash(`💼 Hired: ${job.title}`,'good');
  updateHUD(); renderJobs();
}

function applyForJob(jobId){
  const job = JOBS.find(j=>j.id===jobId);
  if(!job || !jobEligible(job)) return;

  const score = jobQualificationScore();
  const base = Math.min(0.85, 0.35 + score/200);
  const tierBoost = job.tier==='elite' ? -0.1 : job.tier==='exec' ? -0.05 : 0;
  const chance = Math.max(0.15, base + tierBoost);

  if(Math.random() < chance){
    startJob(job);
  } else {
    addEv(`You applied for ${job.title}. The email read: "We're going in a different direction."`, 'bad');
    flash('Rejected','bad');
  }
}

function quitJob(){
  if(!G.career.employed){ flash('No job to quit.','warn'); return; }
  addEv(`You quit your job at ${G.career.company}. It was time.`, 'warn');
  G.career.employed = false;
  G.career.jobId = null;
  G.career.title = '';
  G.career.company = '';
  G.career.salary = 0;
  G.career.level = 0;
  G.career.years = 0;
  G.career.boss = null;
  G.career.coworkers = [];
  G.career.hrRisk = Math.max(0, G.career.hrRisk-10);
  renderJobs();
}

function jobAction(targetName, action){
  const c = G.career;
  if(!c.employed){ flash('No job right now.','warn'); return; }

  let t = null;
  if(action==='boss') t = c.boss;
  else t = c.coworkers.find(x=>x.name===targetName);

  const needsTarget = !['work','slack','ask_raise'].includes(action);
  if(needsTarget && !t){ flash('Could not find them.','warn'); return; }

  if(action==='befriend'){
    t.relation = clamp(t.relation + rnd(6,12));
    G.career.reputation = clamp(G.career.reputation + rnd(1,4));
    addEv(`You built rapport with ${t.firstName} at work. Connections matter.`, 'good');
  } else if(action==='troll'){
    t.relation = clamp(t.relation - rnd(10,18));
    G.career.hrRisk = clamp(G.career.hrRisk + rnd(6,12));
    addEv(`You trolled ${t.firstName} at work. It landed… badly.`, 'bad');
  } else if(action==='hang'){
    t.relation = clamp(t.relation + rnd(5,10));
    G.happy = clamp(G.happy + rnd(3,7));
    addEv(`You hung out with ${t.firstName} after work. They were cooler than expected.`, 'good');
  } else if(action==='hookup'){
    G.happy = clamp(G.happy + rnd(8,16));
    t.relation = clamp(t.relation + rnd(8,14));
    G.career.hrRisk = clamp(G.career.hrRisk + rnd(12,24));
    addEv(`You hooked up with ${t.firstName} from work. HR is not a fan of this storyline.`, 'warn');
    if(Math.random()<0.15){ G.career.reputation = clamp(G.career.reputation - 6); }
  } else if(action==='collab'){
    t.relation = clamp(t.relation + rnd(4,10));
    G.career.performance = clamp(G.career.performance + rnd(5,12));
    G.career.hrRisk = clamp(G.career.hrRisk + rnd(1,5));
    addEv(`You and ${t.firstName} collaborated on a project. It went well.`, 'good');
  } else if(action==='network'){
    c.reputation = clamp(c.reputation + rnd(4,8));
    addEv('You attended a networking event. Business cards were exchanged.','good');
  } else if(action==='ask_raise'){
    const rel = c.boss ? c.boss.relation : 50;
    const chance = (c.performance/100)*0.5 + (rel/100)*0.3;
    if(Math.random() < chance){
      const bump = Math.floor(c.salary * rnd(4,10) / 100);
      c.salary += bump;
      c.reputation = clamp(c.reputation + 3);
      addEv(`You asked for a raise. Approved. +${fmt$(bump)}/yr.`, 'good');
      flash('Raise approved!','good');
    } else {
      c.hrRisk = clamp(c.hrRisk + 5);
      addEv(`You asked for a raise. It was awkward. The answer was "not right now."`, 'warn');
      flash('Raise denied.','warn');
    }
  } else if(action==='work'){
    c.performance = clamp(c.performance + rnd(5,12));
    G.happy = clamp(G.happy - rnd(1,4));
    addEv('You put in a strong year at work. Performance improved.','good');
  } else if(action==='slack'){
    c.performance = clamp(c.performance - rnd(6,12));
    G.happy = clamp(G.happy + rnd(2,6));
    c.hrRisk = clamp(c.hrRisk + rnd(3,8));
    addEv('You slacked off at work. It felt good. Someone noticed.', 'warn');
  }

  updateHUD(); renderJobs();
}

function jobSpecial(action){
  const c = G.career;
  if(!c.employed){ flash('No job right now.','warn'); return; }
  const job = JOBS.find(j=>j.id===c.jobId) || {};
  const tier = job.tier || 'entry';

  if(action==='case_win'){
    c.performance = clamp(c.performance + rnd(8,16));
    c.reputation = clamp(c.reputation + rnd(6,12));
    G.happy = clamp(G.happy + rnd(4,8));
    addEv('You won a major case. Your name carried weight afterward.','love');
  } else if(action==='settlement'){
    const bonus = Math.floor(c.salary * 0.06);
    G.money += bonus;
    c.performance = clamp(c.performance + rnd(4,8));
    addEv(`You negotiated a settlement. Bonus: ${fmt$(bonus)}.`, 'good');
  } else if(action==='surgery'){
    c.performance = clamp(c.performance + rnd(8,14));
    G.happy = clamp(G.happy + rnd(3,7));
    addEv('Successful surgery. It reminded you why you chose medicine.','love');
  } else if(action==='night_shift'){
    c.performance = clamp(c.performance + rnd(4,10));
    G.health = clamp(G.health - rnd(4,10));
    addEv('You took a brutal night shift. Patients were saved. You lost sleep.','warn');
  } else if(action==='launch'){
    c.performance = clamp(c.performance + rnd(6,12));
    c.reputation = clamp(c.reputation + rnd(4,8));
    addEv('Product launch shipped on time. Leadership noticed.','good');
  } else if(action==='deal'){
    const bonus = Math.floor(c.salary * 0.08);
    G.money += bonus;
    c.performance = clamp(c.performance + rnd(5,9));
    addEv(`You closed a deal. Bonus: ${fmt$(bonus)}.`, 'good');
  } else if(action==='mentor'){
    c.reputation = clamp(c.reputation + rnd(5,10));
    G.happy = clamp(G.happy + rnd(4,7));
    addEv('You mentored someone at work. It felt meaningful.','good');
  } else if(action==='mistake'){
    c.performance = clamp(c.performance - rnd(8,14));
    c.hrRisk = clamp(c.hrRisk + rnd(8,16));
    addEv('A serious mistake happened on your watch. HR took notes.','bad');
  } else if(action==='press'){
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));
    addEv('You got featured in a trade publication. Small fame boost.','good');
  }

  updateHUD(); renderJobs();
}

function setRent(id){
  const opt = HOUSING_OPTIONS.find(o=>o.id===id);
  if(!opt){ flash('Housing option not found','warn'); return; }
  if(G.finance.credit < opt.minCredit){ flash('Credit score too low','warn'); return; }
  G.finance.rent = opt.rent;
  G.housing.type = opt.id;
  G.housing.comfort = opt.comfort;
  G.housing.neighborhood = opt.neighborhood;
  G.housing.utilities = opt.rent<1000?80:opt.rent<1600?110:140;
  G.housing.upkeep = 0;
  G.housing.roommates = opt.id==='room' ? rnd(1,3) : opt.id==='studio' ? rnd(0,1) : 0;
  G.housing.roommateList = [];
  addEv(`You moved into a ${opt.label}. Rent: ${fmt$(opt.rent*12)}/yr.`, 'good');
  renderJobs();
}

function buyHome(id){
  const opt = HOME_OPTIONS.find(o=>o.id===id);
  if(!opt){ flash('Home option not found','warn'); return; }
  if(G.finance.credit < opt.minCredit){ flash('Credit score too low','warn'); return; }
  const down = Math.floor(opt.price * opt.downPct);
  if(G.money < down){ flash(`Need ${fmt$(down)} for down payment`,'warn'); return; }
  G.money -= down;
  G.assets.home = true;
  G.assets.homeValue = opt.price;
  const annualRate = opt.rate;
  const annualPay = Math.floor(opt.price * annualRate);
  G.finance.mortgage = annualPay;
  G.finance.mortgageYears = opt.years;
  G.finance.rent = 0;
  G.housing.type = opt.id;
  G.housing.comfort = opt.comfort;
  G.housing.neighborhood = opt.neighborhood;
  G.housing.utilities = 180;
  G.housing.upkeep = Math.floor(opt.price * 0.005);
  G.housing.roommates = 0;
  G.housing.roommateList = [];
  addEv(`You bought a ${opt.label}. Down payment: ${fmt$(down)}. Mortgage: ${fmt$(annualPay)}/yr.`, 'love');
  renderJobs();
}

function upgradeHome(id){
  const up = HOME_UPGRADES.find(u=>u.id===id);
  if(!up){ flash('Upgrade not found','warn'); return; }
  if(G.money<up.cost){ flash(`Need ${fmt$(up.cost)}`,'warn'); return; }
  G.money -= up.cost;
  if(up.comfort) G.housing.comfort = clamp(G.housing.comfort + up.comfort);
  if(up.neighborhood) G.housing.neighborhood = clamp(G.housing.neighborhood + up.neighborhood);
  addEv(`Home upgrade: ${up.label}.`, 'good');
  renderJobs();
}

function moveNeighborhood(){
  if(G.housing.type==='none'){ flash('No home to move.','warn'); return; }
  if(G.money<2000){ flash('Need $2,000 to move.','warn'); return; }
  G.money -= 2000;
  const shift = rnd(-6,12);
  G.housing.neighborhood = clamp(G.housing.neighborhood + shift);
  addEv('You moved to a new neighborhood. It feels different.', 'warn');
  renderJobs();
}

function ensureRoommates(){
  const h = G.housing;
  if(h.roommates<=0) return;
  if(h.roommateList.length>=h.roommates) return;
  const needed = h.roommates - h.roommateList.length;
  for(let i=0;i<needed;i++){
    const p = makePerson('Roommate');
    p.age = Math.max(18, G.age + rnd(-6,6));
    p.relation = rnd(30,70);
    h.roommateList.push(p);
  }
}

function roommateAct(name, type){
  const h = G.housing;
  const r = h.roommateList.find(x=>x.name===name);
  if(!r){ flash('Roommate not found','warn'); return; }
  if(type==='resolve'){
    r.relation = clamp(r.relation + rnd(4,10));
    h.comfort = clamp(h.comfort + rnd(2,5));
    addEv(`You resolved a conflict with ${r.firstName}.`, 'good');
  } else if(type==='kick'){
    h.roommateList = h.roommateList.filter(x=>x.name!==name);
    h.roommates = Math.max(0, h.roommates-1);
    h.comfort = clamp(h.comfort + rnd(2,6));
    addEv(`You kicked out ${r.firstName}. It was tense.`, 'warn');
  } else if(type==='replace'){
    h.roommateList = h.roommateList.filter(x=>x.name!==name);
    const p = makePerson('Roommate');
    p.age = Math.max(18, G.age + rnd(-6,6));
    p.relation = rnd(30,70);
    h.roommateList.push(p);
    addEv(`You replaced ${r.firstName} with ${p.firstName}.`, 'warn');
  }
  renderJobs();
}

function sellHome(){
  if(!G.assets.home){ flash('No home to sell.','warn'); return; }
  const value = Math.floor(G.assets.homeValue * (0.92 + rnd(0,12)/100));
  G.money += value;
  G.assets.home = false;
  G.assets.homeValue = 0;
  G.finance.mortgage = 0;
  G.finance.mortgageYears = 0;
  G.housing = { type:'none', comfort:40, neighborhood:50, roommates:0, roommateList:[], upkeep:0, utilities:0 };
  addEv(`You sold your home for ${fmt$(value)}.`, 'good');
  renderJobs();
}

function refinanceMortgage(){
  if(G.finance.mortgage<=0){ flash('No mortgage to refinance.','warn'); return; }
  if(G.finance.credit<700){ flash('Need 700+ credit to refinance.','warn'); return; }
  const old = G.finance.mortgage;
  const newPay = Math.max(0, Math.floor(old * 0.88));
  G.finance.mortgage = newPay;
  addEv(`Refinanced mortgage. New payment: ${fmt$(newPay)}/yr.`, 'good');
  renderJobs();
}

function invest(amount){
  if(G.money < amount){ flash('Not enough cash to invest','warn'); return; }
  G.money -= amount;
  G.finance.investments += amount;
  addEv(`You invested ${fmt$(amount)}.`, 'good');
  renderJobs();
}

function payDebt(amount){
  if(G.finance.debt<=0){ flash('No debt to pay.','warn'); return; }
  if(G.money < amount){ flash('Not enough cash.','warn'); return; }
  G.money -= amount;
  G.finance.debt = Math.max(0, G.finance.debt - amount);
  G.finance.credit = Math.min(850, G.finance.credit + 5);
  addEv(`Debt payment: ${fmt$(amount)}. Remaining debt: ${fmt$(G.finance.debt)}.`, 'good');
  renderJobs();
}

function renderJobs(){
  ensureFinanceShape();
  const jc = document.getElementById('jobs-content');
  if(G.age < 16){
    jc.innerHTML = `<div class="notif warn">Jobs unlock at age 16.</div>`; return;
  }

  let html = '';
  const c = G.career;

  // Current job
  if(c.employed){
    html += `<div class="card">
      <div class="card-title">Current Job</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div>
          <div style="font-family:var(--fh);font-weight:800;font-size:1.1rem">${c.title}</div>
          <div style="font-size:.78rem;color:var(--muted2)">${c.company} · ${fmt$(c.salary)}/yr · ${JOB_LEVELS[c.level]?.label||'Entry'} level</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.72rem;color:var(--muted2)">Performance</div>
          <div style="font-family:var(--fh);font-weight:800">${c.performance}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="jobAction('', 'work')">🏗️ Work Hard</button>
        <button class="btn btn-ghost btn-sm" onclick="jobAction('', 'slack')">🛋️ Slack Off</button>
        <button class="btn btn-ghost btn-sm" onclick="jobAction('', 'ask_raise')">💬 Ask Raise</button>
        <button class="btn btn-ghost btn-sm" onclick="quitJob()">🚪 Quit</button>
      </div>
      <div style="margin-top:10px;font-size:.72rem;color:${c.hrRisk>60?'var(--danger)':c.hrRisk>35?'var(--gold)':'var(--muted2)'}">
        HR Risk: ${c.hrRisk}/100
      </div>
    </div>`;

    // Perks & milestones
    html += `<div class="card">
      <div class="card-title">Perks & Milestones</div>
      <p style="font-size:.78rem;color:var(--muted2)">Bonus rate: ${Math.floor(c.bonusRate*100)}% · Health plan: ${c.benefits.healthPlan?'Yes':'No'} · Retirement: ${c.benefits.retirement?'Yes':'No'}</p>
      ${c.stockUnits>0?`<p style="font-size:.78rem;color:var(--muted2)">Stock: ${c.stockUnits} units @ ${fmt$(c.stockValue)} ea</p>`:''}
      ${c.milestones.length?`<div style="font-size:.78rem;color:var(--muted2)">${c.milestones.slice(-3).map(m=>`${m.year}: ${m.text}`).join(' · ')}</div>`:'<div style="font-size:.78rem;color:var(--muted2)">No milestones yet.</div>'}
    </div>`;

    // Special actions by career type
    const job = JOBS.find(j=>j.id===c.jobId) || {};
    const isLegal   = job.minEdu==='law';
    const isMedical = job.minEdu==='med';
    const isTech    = ['jdev','swe','swe_s','pm'].includes(job.id);
    const isFin     = ['analyst','ib','quant','fin_mgr'].includes(job.id);
    const isEdu     = ['teacher','principal'].includes(job.id);
    html += `<div class="card"><div class="card-title">Special Actions</div>
      <div class="choice-grid">
        ${isLegal?`<div class="choice" onclick="jobSpecial('case_win')"><div class="choice-icon">⚖️</div><div class="choice-name">Win a Case</div><div class="choice-desc">+Reputation +Performance</div></div>
        <div class="choice" onclick="jobSpecial('settlement')"><div class="choice-icon">🤝</div><div class="choice-name">Negotiate Settlement</div><div class="choice-desc">+Bonus</div></div>`:''}
        ${isMedical?`<div class="choice" onclick="jobSpecial('surgery')"><div class="choice-icon">🩺</div><div class="choice-name">Successful Surgery</div><div class="choice-desc">+Performance</div></div>
        <div class="choice" onclick="jobSpecial('night_shift')"><div class="choice-icon">🌙</div><div class="choice-name">Night Shift</div><div class="choice-desc">+Performance -Health</div></div>`:''}
        ${isTech?`<div class="choice" onclick="jobSpecial('launch')"><div class="choice-icon">🚀</div><div class="choice-name">Ship Launch</div><div class="choice-desc">+Performance +Rep</div></div>`:''}
        ${isFin?`<div class="choice" onclick="jobSpecial('deal')"><div class="choice-icon">💼</div><div class="choice-name">Close Deal</div><div class="choice-desc">+Bonus</div></div>`:''}
        ${isEdu?`<div class="choice" onclick="jobSpecial('mentor')"><div class="choice-icon">📚</div><div class="choice-name">Mentor Student</div><div class="choice-desc">+Rep +Happy</div></div>`:''}
        <div class="choice" onclick="jobSpecial('press')"><div class="choice-icon">📰</div><div class="choice-name">Industry Feature</div><div class="choice-desc">+Fame</div></div>
        <div class="choice" onclick="jobSpecial('mistake')"><div class="choice-icon">⚠️</div><div class="choice-name">Major Mistake</div><div class="choice-desc">-Performance +HR Risk</div></div>
      </div>
    </div>`;

    if(c.boss){
      html += `<div class="card">
        <div class="card-title">Boss</div>
        <div class="person-card" style="margin-bottom:6px">
          <div class="p-avatar av-fam">🧑‍💼</div>
          <div>
            <div class="p-name">${c.boss.name}</div>
            <div class="p-role">Boss · Relation ${c.boss.relation}%</div>
          </div>
        </div>
      </div>`;
    }

    if(c.coworkers.length){
      html += `<div class="card"><div class="card-title">Coworkers</div>`;
      c.coworkers.forEach(w=>{
        html += `
        <div class="person-card" style="flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:11px;width:100%">
            <div class="p-avatar av-friend">🧑‍💻</div>
            <div style="flex:1">
              <div class="p-name">${w.name}</div>
              <div class="p-role">Relation ${w.relation}% · Attraction ${w.attraction}%</div>
            </div>
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;padding-left:53px">
            <button class="btn btn-ghost btn-sm" onclick="jobAction('${w.name}','befriend')">🤝 Befriend</button>
            <button class="btn btn-ghost btn-sm" onclick="jobAction('${w.name}','hang')">🍻 Hang Out</button>
            <button class="btn btn-ghost btn-sm" onclick="jobAction('${w.name}','collab')">🧩 Collaborate</button>
            <button class="btn btn-ghost btn-sm" onclick="jobAction('${w.name}','troll')">😈 Troll</button>
            <button class="btn btn-ghost btn-sm" onclick="jobAction('${w.name}','hookup')">🔥 Hook Up</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }
  } else {
    html += `<div class="notif warn">You are not currently employed.</div>`;
  }

  // Graduate school options
  const deg = degreeName();
  if(!c.medSchool.enrolled && !c.medSchool.completed && (deg==='Medicine' || deg==='Biology')){
    html += `<div class="card">
      <div class="card-title">Medical School</div>
      <p style="font-size:.8rem;color:var(--muted2)">Requires GPA ${MED_SCHOOL.minGPA}+ · ${MED_SCHOOL.years} years · ${fmt$(MED_SCHOOL.tuition)}/yr</p>
      <button class="btn btn-primary btn-sm" onclick="startMedSchool()">Apply to Med School</button>
    </div>`;
  }
  if(c.medSchool.enrolled){
    html += `<div class="card">
      <div class="card-title">Medical School (Year ${c.medSchool.year}/${MED_SCHOOL.years})</div>
      <p style="font-size:.8rem;color:var(--muted2)">GPA: ${c.medSchool.gpa.toFixed(2)} · Debt: ${fmt$(c.medSchool.debt)}</p>
    </div>`;
  }

  if(!c.lawSchool.enrolled && !c.lawSchool.completed && (deg==='Law' || deg==='Political Science')){
    html += `<div class="card">
      <div class="card-title">Law School</div>
      <p style="font-size:.8rem;color:var(--muted2)">Requires GPA ${LAW_SCHOOL.minGPA}+ · ${LAW_SCHOOL.years} years · ${fmt$(LAW_SCHOOL.tuition)}/yr</p>
      <button class="btn btn-primary btn-sm" onclick="startLawSchool()">Apply to Law School</button>
    </div>`;
  }
  if(c.lawSchool.enrolled){
    html += `<div class="card">
      <div class="card-title">Law School (Year ${c.lawSchool.year}/${LAW_SCHOOL.years})</div>
      <p style="font-size:.8rem;color:var(--muted2)">GPA: ${c.lawSchool.gpa.toFixed(2)} · Debt: ${fmt$(c.lawSchool.debt)}</p>
    </div>`;
  }

  // Finances
  const tax = G.finance.tax || {};
  const effPct = ((tax.lastEffectiveRate||0)*100).toFixed(1);
  const statePct = ((tax.lastStateRate||0)*100).toFixed(1);
  const filedLine = tax.lastPaid>0
    ? `Paid ${fmt$(tax.lastPaid)} · ${effPct}% effective · Federal bracket ${tax.lastBracket||'None'}`
    : tax.lastRefund>0
      ? `Refund ${fmt$(tax.lastRefund)} · Federal bracket ${tax.lastBracket||'None'}`
      : 'No filing yet this life.';
  html += `<div class="card">
    <div class="card-title">Finances</div>
    <p style="font-size:.78rem;color:var(--muted2)">Credit score: <strong style="color:${G.finance.credit>=720?'var(--accent)':G.finance.credit>=660?'var(--gold)':'var(--danger)'}">${G.finance.credit}</strong></p>
    <p style="font-size:.78rem;color:var(--muted2)">Rent: ${G.finance.rent?fmt$(G.finance.rent*12)+'/yr':'None'} · Mortgage: ${G.finance.mortgage?fmt$(G.finance.mortgage)+'/yr':'None'} · Debt: ${fmt$(G.finance.debt)}</p>
    <p style="font-size:.78rem;color:var(--muted2)">Investments: ${fmt$(G.finance.investments)} · Retirement: ${fmt$(G.finance.retirement||0)}</p>
    <p style="font-size:.78rem;color:var(--muted2)">Last tax filing: ${filedLine}</p>
    <p style="font-size:.78rem;color:var(--muted2)">State tax estimate: ${statePct}% · Taxable income: ${fmt$(tax.lastTaxableIncome||0)}</p>
    ${tax.delinquentYears>0?`<div class="notif bad" style="margin-bottom:10px">⚠️ Tax delinquency: ${tax.delinquentYears} year(s) unresolved. Penalties are compounding your debt.</div>`:''}
    <div class="choice-grid">
      ${HOUSING_OPTIONS.map(o=>`<div class="choice" onclick="setRent('${o.id}')">
        <div class="choice-icon">🏠</div><div class="choice-name">${o.label}</div><div class="choice-desc">${fmt$(o.rent*12)}/yr · ${o.minCredit}+ credit</div>
      </div>`).join('')}
    </div>
    <div class="choice-grid" style="margin-top:10px">
      ${HOME_OPTIONS.map(o=>`<div class="choice" onclick="buyHome('${o.id}')">
        <div class="choice-icon">🏡</div><div class="choice-name">${o.label}</div><div class="choice-desc">${fmt$(o.price)} · ${o.minCredit}+ credit</div>
      </div>`).join('')}
    </div>
    <div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="invest(1000)"><div class="choice-icon">📈</div><div class="choice-name">Invest $1k</div><div class="choice-desc">Long-term growth</div></div>
      <div class="choice" onclick="invest(5000)"><div class="choice-icon">📈</div><div class="choice-name">Invest $5k</div><div class="choice-desc">Long-term growth</div></div>
      <div class="choice" onclick="invest(10000)"><div class="choice-icon">📈</div><div class="choice-name">Invest $10k</div><div class="choice-desc">Long-term growth</div></div>
      <div class="choice" onclick="payDebt(1000)"><div class="choice-icon">💳</div><div class="choice-name">Pay Debt $1k</div><div class="choice-desc">Boost credit</div></div>
    </div>
  </div>`;

  // Home & Living
  html += `<div class="card">
    <div class="card-title">Home & Living</div>
    <p style="font-size:.78rem;color:var(--muted2)">Type: ${G.housing.type} · Comfort ${G.housing.comfort} · Neighborhood ${G.housing.neighborhood}</p>
    <p style="font-size:.78rem;color:var(--muted2)">Roommates: ${G.housing.roommates} · Utilities: ${fmt$(G.housing.utilities*12)}/yr · Upkeep: ${fmt$(G.housing.upkeep)}/yr</p>
    <div class="choice-grid">
      ${HOME_UPGRADES.map(u=>`<div class="choice" onclick="upgradeHome('${u.id}')">
        <div class="choice-icon">🛠️</div><div class="choice-name">${u.label}</div><div class="choice-desc">${fmt$(u.cost)} · +Comfort</div>
      </div>`).join('')}
      <div class="choice" onclick="moveNeighborhood()"><div class="choice-icon">🚚</div><div class="choice-name">Move Neighborhood</div><div class="choice-desc">$2,000 · change vibes</div></div>
      ${G.assets.home?`<div class="choice" onclick="refinanceMortgage()"><div class="choice-icon">🏦</div><div class="choice-name">Refinance</div><div class="choice-desc">Lower payment</div></div>`:''}
      ${G.assets.home?`<div class="choice" onclick="sellHome()"><div class="choice-icon">🏷️</div><div class="choice-name">Sell Home</div><div class="choice-desc">Cash out</div></div>`:''}
    </div>
  </div>`;

  // Roommates
  if(G.housing.roommates>0){
    ensureRoommates();
    html += `<div class="card">
      <div class="card-title">Roommates</div>
      ${G.housing.roommateList.map(r=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
          <div><div class="p-name">${r.name}</div><div class="p-role">Relation ${r.relation}%</div></div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="roommateAct('${r.name}','resolve')">Resolve</button>
            <button class="btn btn-ghost btn-sm" onclick="roommateAct('${r.name}','kick')">Kick Out</button>
            <button class="btn btn-ghost btn-sm" onclick="roommateAct('${r.name}','replace')">Replace</button>
          </div>
        </div>`).join('')}
    </div>`;
  }

  // Job market
  const eligible = JOBS.filter(jobEligible);
  html += `<div class="card"><div class="card-title">Job Market</div>`;
  if(!eligible.length){
    html += `<div class="notif warn">No jobs you qualify for right now. Improve your education or skills.</div>`;
  } else {
    html += `<div class="choice-grid">`;
    eligible.slice(0,16).forEach(j=>{
      html += `<div class="choice" onclick="applyForJob('${j.id}')">
        <div class="choice-icon">💼</div>
        <div class="choice-name" style="font-size:.8rem">${j.title}</div>
        <div class="choice-desc">${j.tier.toUpperCase()} · ${fmt$(j.basePay)}/yr base</div>
      </div>`;
    });
    html += `</div>`;
  }
  html += `</div>`;

  jc.innerHTML = html;
}

function startMedSchool(){
  if(eduLevel()!=='college'){ flash('Need a bachelor’s degree first','warn'); return; }
  if(G.school.uni.gpa < MED_SCHOOL.minGPA){ flash(`Need GPA ${MED_SCHOOL.minGPA}+`, 'warn'); return; }
  G.career.medSchool.enrolled = true;
  G.career.medSchool.year = 1;
  G.career.medSchool.gpa = Math.max(3.0, G.school.uni.gpa || 3.0);
  addEv('You were accepted into med school. The grind begins.', 'good');
  flash('🩺 Med school started','good');
  renderJobs();
}

function startLawSchool(){
  if(eduLevel()!=='college'){ flash('Need a bachelor’s degree first','warn'); return; }
  if(G.school.uni.gpa < LAW_SCHOOL.minGPA){ flash(`Need GPA ${LAW_SCHOOL.minGPA}+`, 'warn'); return; }
  G.career.lawSchool.enrolled = true;
  G.career.lawSchool.year = 1;
  G.career.lawSchool.gpa = Math.max(3.0, G.school.uni.gpa || 3.0);
  addEv('You were accepted into law school. Casebooks acquired.', 'good');
  flash('⚖️ Law school started','good');
  renderJobs();
}

// ═══════════════════════════════════════════════════════════════
