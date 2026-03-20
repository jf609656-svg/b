// medical.js — deep medical career simulation
// Modular systems:
// - career state + progression
// - patient generation + evolution
// - probabilistic outcome engine
// - hospital environment / contracts

const MED_ROLE_META = {
  student:{
    label:'Medical Student',
    minYear:1,
    salary:0,
    stressBase:8,
    actions:['study','rotation','rest'],
    debtPerYear:MED_SCHOOL?.tuition||45000,
  },
  junior:{
    label:'Junior Doctor',
    minYear:1,
    salary:78000,
    stressBase:14,
    actions:['diagnose','order_tests','prescribe','manage','rest'],
  },
  resident:{
    label:'Specialist Trainee',
    minYear:2,
    salary:122000,
    stressBase:18,
    actions:['diagnose','order_tests','prescribe','manage','procedure','rest'],
  },
  consultant:{
    label:'Senior Doctor / Consultant',
    minYear:4,
    salary:245000,
    stressBase:16,
    actions:['diagnose','order_tests','prescribe','manage','procedure','policy','rest'],
  },
};

const MED_SPECIALISATIONS = [
  { id:'surgery', label:'Surgery', risk:1.28, reward:1.35, stress:1.22, repMult:1.15 },
  { id:'psychiatry', label:'Psychiatry', risk:0.92, reward:1.0, stress:0.95, repMult:1.05 },
  { id:'gp', label:'General Practice', risk:0.86, reward:0.96, stress:0.9, repMult:1.0 },
];

const MED_HOSPITAL_TYPES = [
  { id:'public', label:'Public Hospital', payMult:0.92, volume:1.25, lawsuit:1.08, ethicsBias:0.08 },
  { id:'private', label:'Private Hospital', payMult:1.22, volume:0.92, lawsuit:0.96, ethicsBias:-0.06 },
  { id:'teaching', label:'Teaching Hospital', payMult:1.02, volume:1.08, lawsuit:1.0, ethicsBias:0.03 },
];

const MED_CONDITIONS = [
  { id:'appendicitis', label:'Appendicitis', specialty:'surgery', severity:[42,78], risk:[12,40], symptoms:['Abdominal pain','Fever','Nausea'], hidden:['Rupture risk'] },
  { id:'gallstones', label:'Gallbladder Disease', specialty:'surgery', severity:[36,70], risk:[10,34], symptoms:['Upper abdominal pain','Bloating','Nausea'], hidden:['Infection'] },
  { id:'major_depression', label:'Major Depression', specialty:'psychiatry', severity:[28,76], risk:[8,30], symptoms:['Low mood','Sleep issues','Low motivation'], hidden:['Self-harm risk'] },
  { id:'panic_disorder', label:'Panic Disorder', specialty:'psychiatry', severity:[24,68], risk:[6,28], symptoms:['Chest tightness','Panic episodes','Dizziness'], hidden:['Substance misuse'] },
  { id:'hypertension', label:'Hypertension', specialty:'gp', severity:[22,62], risk:[14,40], symptoms:['Headaches','Fatigue','Dizziness'], hidden:['Stroke risk'] },
  { id:'diabetes2', label:'Type 2 Diabetes', specialty:'gp', severity:[30,74], risk:[18,45], symptoms:['Thirst','Frequent urination','Fatigue'], hidden:['Neuropathy risk'] },
  { id:'copd', label:'COPD', specialty:'gp', severity:[34,82], risk:[20,48], symptoms:['Breathlessness','Cough','Chest tightness'], hidden:['Respiratory failure'] },
  { id:'sepsis', label:'Sepsis', specialty:'surgery', severity:[58,96], risk:[40,78], symptoms:['High fever','Confusion','Rapid heart rate'], hidden:['Multi-organ failure'] },
];

const MED_TESTS = [
  { id:'bloods', label:'Blood Panel', cost:240, clarity:14, delay:0 },
  { id:'ct', label:'CT Scan', cost:1400, clarity:26, delay:0 },
  { id:'mri', label:'MRI', cost:2200, clarity:30, delay:1 },
  { id:'psych_eval', label:'Psych Evaluation', cost:380, clarity:18, delay:0 },
];

const MED_TREATMENTS = [
  { id:'medication', label:'Medication Plan', type:'med', base:16, risk:8, cost:480 },
  { id:'intensive_medication', label:'Aggressive Medication', type:'med', base:24, risk:14, cost:980 },
  { id:'therapy_program', label:'Therapy Program', type:'psych', base:20, risk:6, cost:620 },
  { id:'surgery_standard', label:'Surgery (Standard)', type:'procedure', base:34, risk:22, cost:6800 },
  { id:'surgery_high_risk', label:'Surgery (High-Risk)', type:'procedure', base:46, risk:36, cost:12800 },
  { id:'monitoring', label:'Monitoring + Follow-up', type:'care', base:12, risk:4, cost:300 },
];

function ensureMedicalCareerState(){
  if(!G.career) G.career = {};
  if(!G.career.medicalCareer || typeof G.career.medicalCareer!=='object'){
    G.career.medicalCareer = {};
  }
  const m = G.career.medicalCareer;
  if(typeof m.active!=='boolean') m.active = false;
  if(typeof m.role!=='string') m.role = 'student';
  if(typeof m.specialization!=='string') m.specialization = 'gp';
  if(typeof m.hospitalId!=='string') m.hospitalId = 'public';
  if(typeof m.knowledge!=='number') m.knowledge = 34;
  if(typeof m.skill!=='number') m.skill = 26;
  if(typeof m.stress!=='number') m.stress = 22;
  if(typeof m.reputation!=='number') m.reputation = 34;
  if(typeof m.ethics!=='number') m.ethics = 60;
  if(typeof m.burnout!=='number') m.burnout = 12;
  if(typeof m.casesHandled!=='number') m.casesHandled = 0;
  if(typeof m.correctDx!=='number') m.correctDx = 0;
  if(typeof m.misDx!=='number') m.misDx = 0;
  if(typeof m.majorFailures!=='number') m.majorFailures = 0;
  if(typeof m.bonuses!=='number') m.bonuses = 0;
  if(typeof m.penalties!=='number') m.penalties = 0;
  if(typeof m.investigations!=='number') m.investigations = 0;
  if(typeof m.malpracticeStrikes!=='number') m.malpracticeStrikes = 0;
  if(typeof m.insurance!=='number') m.insurance = 0;
  if(typeof m.patientVolume!=='number') m.patientVolume = 0;
  if(typeof m.timeBudget!=='number') m.timeBudget = 0;
  if(typeof m.lastSalary!=='number') m.lastSalary = 0;
  if(typeof m.lastYearSummary!=='object' || !m.lastYearSummary) m.lastYearSummary = {};
  if(!Array.isArray(m.patients)) m.patients = [];
  if(!Array.isArray(m.history)) m.history = [];
  if(typeof m.pendingBreakdown!=='boolean') m.pendingBreakdown = false;
  if(typeof m.lastSwitchYear!=='number') m.lastSwitchYear = -1;
  m.knowledge = clamp(m.knowledge);
  m.skill = clamp(m.skill);
  m.stress = clamp(m.stress);
  m.reputation = clamp(m.reputation);
  m.ethics = clamp(m.ethics);
  m.burnout = clamp(m.burnout);
}

function medicalHospitalMeta(id){
  return MED_HOSPITAL_TYPES.find(h=>h.id===id) || MED_HOSPITAL_TYPES[0];
}
function medicalSpecMeta(id){
  return MED_SPECIALISATIONS.find(s=>s.id===id) || MED_SPECIALISATIONS[2];
}
function medicalRoleMeta(id){
  return MED_ROLE_META[id] || MED_ROLE_META.student;
}
function medicalConditionMeta(id){
  return MED_CONDITIONS.find(c=>c.id===id) || MED_CONDITIONS[0];
}

function medicalStartCareer(){
  ensureMedicalCareerState();
  const c = G.career;
  const m = c.medicalCareer;
  if(!c.medSchool?.enrolled && !c.medSchool?.completed){
    flash('Medical career starts through med school.', 'warn');
    return;
  }
  m.active = true;
  if(c.medSchool.enrolled){
    m.role = 'student';
  } else if(c.licenses?.medical){
    m.role = 'junior';
  }
  m.timeBudget = 5;
  m.history.push({ age:G.age||0, text:'Medical career track activated.' });
  addEv('You committed to the medical career path. High stakes begin now.', 'good');
  renderJobs();
}

function medicalSetSpecialization(specId){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  if(!m.active){ flash('Start medical track first.','warn'); return; }
  const meta = medicalSpecMeta(specId);
  if(!meta){ flash('Specialization not found.','warn'); return; }
  if(m.role==='student'){
    flash('Choose specialization after graduation.','warn');
    return;
  }
  if(m.lastSwitchYear===G.age){
    flash('You already switched this year.','warn');
    return;
  }
  m.specialization = meta.id;
  m.lastSwitchYear = G.age||0;
  m.stress = clamp(m.stress + rnd(2,6));
  m.reputation = clamp(m.reputation + rnd(0,3));
  addEv(`You shifted into ${meta.label} focus. Expectations changed immediately.`, 'warn');
  renderJobs();
}

function medicalMoveHospital(hospitalId){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  if(!m.active){ flash('Start medical track first.','warn'); return; }
  const meta = medicalHospitalMeta(hospitalId);
  if(!meta){ flash('Hospital not found.','warn'); return; }
  if(m.hospitalId===meta.id){ flash('Already at this hospital type.','warn'); return; }
  m.hospitalId = meta.id;
  m.reputation = clamp(m.reputation + rnd(-2,4));
  m.stress = clamp(m.stress + rnd(1,4));
  addEv(`You moved to a ${meta.label}. Workload and incentives shifted.`, 'good');
  renderJobs();
}

function medicalStudentAction(action){
  ensureMedicalCareerState();
  const c = G.career;
  const m = c.medicalCareer;
  if(!m.active || m.role!=='student'){ flash('Student actions unavailable.','warn'); return; }
  if(action==='study'){
    m.knowledge = clamp(m.knowledge + rnd(4,9));
    m.skill = clamp(m.skill + rnd(1,4));
    m.stress = clamp(m.stress + rnd(3,8));
    G.smarts = clamp(G.smarts + rnd(2,5));
    addEv('You buried yourself in anatomy and pathology study blocks.', 'good');
  } else if(action==='rotation'){
    m.knowledge = clamp(m.knowledge + rnd(2,6));
    m.skill = clamp(m.skill + rnd(3,8));
    m.reputation = clamp(m.reputation + rnd(1,4));
    m.stress = clamp(m.stress + rnd(2,7));
    addEv('Clinical rotation sharpened your practical judgement.', 'good');
  } else if(action==='rest'){
    m.stress = clamp(m.stress - rnd(6,14));
    m.burnout = clamp(m.burnout - rnd(5,12));
    G.happy = clamp(G.happy + rnd(3,8));
    addEv('You stepped back, recovered, and protected your long-term performance.', 'good');
  }
  renderJobs();
}

function medicalGeneratePatient(seed=''){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  const spec = medicalSpecMeta(m.specialization);
  const preferred = MED_CONDITIONS.filter(c=>c.specialty===spec.id);
  const pool = preferred.length && Math.random()<0.72 ? preferred : MED_CONDITIONS;
  const cond = pick(pool);
  const sev = rnd(cond.severity[0], cond.severity[1]);
  const risks = rnd(cond.risk[0], cond.risk[1]);
  const visibleCount = Math.max(1, Math.min(cond.symptoms.length, rnd(1, cond.symptoms.length)));
  const symptoms = cond.symptoms.slice(0, visibleCount);
  const p = {
    id:`pt_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    year:G.age||0,
    label:`Patient ${rnd(100,999)}`,
    conditionId:cond.id,
    hiddenCondition:pick(cond.hidden||['Complication risk']),
    symptoms,
    severity:sev,
    riskFactors:risks,
    diagnosed:false,
    diagnosisType:'unknown',
    treatmentId:'',
    treatmentProgress:0,
    status:'active',
    critical:false,
    notes:seed||'',
  };
  p.critical = p.severity>=80 || p.riskFactors>=70;
  return p;
}

function medicalEnsurePatientLoad(){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  if(!m.active || m.role==='student') return;
  const hospital = medicalHospitalMeta(m.hospitalId);
  const role = medicalRoleMeta(m.role);
  const base = Math.max(1, Math.floor((hospital.volume||1) * (role.minYear>=4?3:role.minYear>=2?2:1.5)));
  while((m.patients||[]).filter(p=>p.status==='active').length < base){
    m.patients.push(medicalGeneratePatient('auto intake'));
  }
  m.patientVolume = (m.patients||[]).filter(p=>p.status==='active').length;
  m.timeBudget = Math.max(2, 5 - Math.min(2, Math.floor(m.patientVolume/4)));
}

function medicalDiagnosisProbability(patient){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  const spec = medicalSpecMeta(m.specialization);
  const specMatch = medicalConditionMeta(patient.conditionId).specialty===spec.id ? 8 : -6;
  const stressPenalty = Math.floor((m.stress||0)/6) + Math.floor((m.burnout||0)/8);
  return clamp((m.knowledge||30) + specMatch - stressPenalty + rnd(-12,12));
}

function medicalSurgeryProbability(patient){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  const spec = medicalSpecMeta(m.specialization);
  const specMult = spec.id==='surgery' ? 1.12 : 0.88;
  const base = (m.skill||20) - Math.floor((m.stress||0)/4) - Math.floor((m.burnout||0)/5) - Math.floor((patient.severity||40)/9);
  return clamp(Math.floor(base * specMult) + rnd(-14,14));
}

function medicalOutcomeTier(score){
  if(score>=78) return 'success';
  if(score>=55) return 'partial';
  if(score>=32) return 'failure';
  return 'critical_failure';
}

function medicalApplyOutcome(patient, context, outcome){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  const hospital = medicalHospitalMeta(m.hospitalId);
  const repBoost = context==='diagnosis' ? 4 : context==='treatment' ? 5 : 7;
  const repLoss = context==='diagnosis' ? 6 : context==='treatment' ? 8 : 12;
  if(outcome==='success'){
    patient.severity = Math.max(0, (patient.severity||0) - rnd(18,34));
    patient.riskFactors = Math.max(0, (patient.riskFactors||0) - rnd(10,22));
    m.reputation = clamp((m.reputation||40) + repBoost);
    m.stress = clamp((m.stress||20) + rnd(1,4));
    G.money += rnd(600,2400);
    patient.status = patient.severity<=18 ? 'discharged' : 'active';
  } else if(outcome==='partial'){
    patient.severity = Math.max(0, (patient.severity||0) - rnd(8,18));
    patient.riskFactors = Math.max(0, (patient.riskFactors||0) - rnd(4,10));
    m.reputation = clamp((m.reputation||40) + rnd(1,3));
    m.stress = clamp((m.stress||20) + rnd(2,6));
    G.money += rnd(200,1200);
  } else if(outcome==='failure'){
    patient.severity = clamp((patient.severity||0) + rnd(6,14));
    patient.riskFactors = clamp((patient.riskFactors||0) + rnd(5,11));
    m.reputation = clamp((m.reputation||40) - repLoss);
    m.stress = clamp((m.stress||20) + rnd(7,14));
    G.money = Math.max(0, G.money - rnd(600,2600));
    m.malpracticeStrikes = (m.malpracticeStrikes||0) + (Math.random()<0.22*hospital.lawsuit ? 1 : 0);
  } else {
    patient.severity = clamp((patient.severity||0) + rnd(14,26));
    patient.riskFactors = clamp((patient.riskFactors||0) + rnd(10,22));
    patient.critical = true;
    m.reputation = clamp((m.reputation||40) - Math.floor(repLoss*1.6));
    m.stress = clamp((m.stress||20) + rnd(12,22));
    G.money = Math.max(0, G.money - rnd(1800,7200));
    m.majorFailures = (m.majorFailures||0) + 1;
    m.malpracticeStrikes = (m.malpracticeStrikes||0) + 1;
    if(Math.random()<0.26){
      patient.status = 'deceased';
    }
  }
}

function medicalPickActivePatient(){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  const active = (m.patients||[]).filter(p=>p.status==='active');
  if(!active.length){
    medicalEnsurePatientLoad();
  }
  const now = (m.patients||[]).filter(p=>p.status==='active');
  return now.length ? pick(now) : null;
}

function medicalAction(action){
  ensureMedicalCareerState();
  const m = G.career.medicalCareer;
  if(!m.active){ flash('Medical track not active.','warn'); return; }
  if(m.role==='student') return medicalStudentAction(action);
  if((m.timeBudget||0)<=0){ flash('No medical time budget left this year.','warn'); return; }
  medicalEnsurePatientLoad();
  const p = medicalPickActivePatient();
  if(!p){ flash('No active patients right now.','warn'); return; }
  const cond = medicalConditionMeta(p.conditionId);

  if(action==='diagnose'){
    const score = medicalDiagnosisProbability(p);
    const tier = medicalOutcomeTier(score);
    p.diagnosed = true;
    p.diagnosisType = tier==='success' ? 'correct' : tier==='partial' ? 'uncertain' : 'incorrect';
    if(p.diagnosisType==='correct') m.correctDx = (m.correctDx||0) + 1;
    if(p.diagnosisType==='incorrect') m.misDx = (m.misDx||0) + 1;
    medicalApplyOutcome(p, 'diagnosis', tier);
    addEv(`Diagnosis on ${p.label}: ${p.diagnosisType} (${tier.replace('_',' ')}).`, tier==='success'?'good':tier==='partial'?'warn':'bad');
  } else if(action==='order_tests'){
    const test = pick(MED_TESTS);
    const cost = test.cost;
    const profitPenalty = Math.random()<0.35 ? rnd(0,200) : 0;
    G.money = Math.max(0, G.money - profitPenalty);
    p.riskFactors = Math.max(0, (p.riskFactors||0) - Math.floor(test.clarity*0.4));
    p.severity = Math.max(0, (p.severity||0) - Math.floor(test.clarity*0.2));
    m.knowledge = clamp((m.knowledge||30) + rnd(1,4));
    m.stress = clamp((m.stress||20) + rnd(1,3));
    m.ethics = clamp((m.ethics||60) + (test.id==='ct' || test.id==='mri' ? -1 : 1));
    addEv(`Ordered ${test.label} for ${p.label}. Diagnostic clarity improved.`, 'good');
    m.penalties += profitPenalty>0 ? 1 : 0;
    m.bonuses += profitPenalty===0 ? 1 : 0;
    void cost; // cost represented in economy abstraction via penalty/profit drift.
  } else if(action==='prescribe'){
    const tx = pick(MED_TREATMENTS.filter(t=>t.type==='med' || t.type==='psych' || t.type==='care'));
    const score = clamp((m.skill||20) + (m.knowledge||30) - Math.floor((m.stress||0)/4) - Math.floor((p.severity||0)/10) + rnd(-10,12));
    const tier = medicalOutcomeTier(score);
    p.treatmentId = tx.id;
    p.treatmentProgress = (p.treatmentProgress||0) + 1;
    medicalApplyOutcome(p, 'treatment', tier);
    m.ethics = clamp((m.ethics||60) + (tx.id==='intensive_medication' ? -2 : 1));
    addEv(`Treatment plan (${tx.label}) for ${p.label}: ${tier.replace('_',' ')}.`, tier==='success'?'good':tier==='partial'?'warn':'bad');
  } else if(action==='procedure'){
    const tx = pick(MED_TREATMENTS.filter(t=>t.type==='procedure'));
    const score = medicalSurgeryProbability(p) - Math.floor((tx.risk||0)/2) + rnd(-8,10);
    const tier = medicalOutcomeTier(score);
    p.treatmentId = tx.id;
    p.treatmentProgress = (p.treatmentProgress||0) + 1;
    medicalApplyOutcome(p, 'procedure', tier);
    m.skill = clamp((m.skill||20) + (tier==='success'?rnd(2,5):tier==='partial'?rnd(1,3):0));
    m.ethics = clamp((m.ethics||60) + (tx.id==='surgery_high_risk' ? -3 : 1));
    addEv(`Procedure (${tx.label}) on ${p.label}: ${tier.replace('_',' ')}.`, tier==='success'?'good':tier==='partial'?'warn':'bad');
  } else if(action==='manage'){
    p.severity = Math.max(0, (p.severity||0) - rnd(4,10));
    p.riskFactors = Math.max(0, (p.riskFactors||0) - rnd(2,8));
    p.treatmentProgress = (p.treatmentProgress||0) + 1;
    m.knowledge = clamp((m.knowledge||30) + rnd(1,3));
    m.skill = clamp((m.skill||20) + rnd(1,3));
    m.stress = clamp((m.stress||20) + rnd(1,4));
    m.ethics = clamp((m.ethics||60) + rnd(0,2));
    addEv(`You coordinated ongoing care for ${p.label}.`, 'good');
    if(p.severity<=14) p.status='discharged';
  } else if(action==='policy'){
    const profitFirst = Math.random()<0.5;
    if(profitFirst){
      m.ethics = clamp((m.ethics||60) - rnd(3,8));
      m.reputation = clamp((m.reputation||40) + rnd(-3,3));
      G.money += rnd(800,2800);
      addEv('You prioritized high-margin hospital policy. Revenue rose, ethics took a hit.', 'warn');
    } else {
      m.ethics = clamp((m.ethics||60) + rnd(3,7));
      m.reputation = clamp((m.reputation||40) + rnd(2,6));
      G.money += rnd(200,1200);
      addEv('You pushed patient-first policy changes and accepted lower margins.', 'good');
    }
    m.stress = clamp((m.stress||20) + rnd(2,6));
  } else if(action==='rest'){
    m.stress = clamp((m.stress||20) - rnd(7,16));
    m.burnout = clamp((m.burnout||12) - rnd(6,14));
    G.happy = clamp(G.happy + rnd(4,10));
    if(m.stress<=22 && Math.random()<0.24){
      m.ethics = clamp((m.ethics||60) + 1);
    }
    addEv('You rested and prevented burnout from spiraling.', 'good');
  }

  m.timeBudget = Math.max(0, (m.timeBudget||0) - 1);
  m.casesHandled = (m.casesHandled||0) + 1;
  if((p.status==='deceased' || p.critical) && Math.random()<0.3){
    addEv(`${p.label} became critical after ${cond.label} complications.`, 'bad');
  }
  renderJobs();
}

function medicalProgressYear(){
  ensureMedicalCareerState();
  const c = G.career;
  const m = c.medicalCareer;

  if(!m.active && (c.medSchool?.enrolled || c.medSchool?.completed || c.licenses?.medical)){
    m.active = true;
  }
  if(!m.active) return;

  // Education progression is still primarily handled in core.js.
  if(c.medSchool?.enrolled){
    m.role = 'student';
  } else if(c.licenses?.medical){
    if(m.role==='student') m.role = 'junior';
    if(m.role==='junior' && (m.casesHandled||0)>=24 && (m.knowledge||0)>=58){
      m.role = 'resident';
      addEv('You entered specialist training as a resident.', 'good');
    } else if(m.role==='resident' && (m.casesHandled||0)>=72 && (m.skill||0)>=66 && (m.reputation||0)>=60){
      m.role = 'consultant';
      addEv('You were promoted to senior doctor / consultant.', 'love');
    }
  }

  const role = medicalRoleMeta(m.role);
  const spec = medicalSpecMeta(m.specialization);
  const hosp = medicalHospitalMeta(m.hospitalId);

  // Annual salary (if licensed doctor track)
  if(m.role!=='student' && c.licenses?.medical){
    const salary = Math.floor(role.salary * (hosp.payMult||1) * (1 + (m.reputation-50)/260));
    m.lastSalary = Math.max(0, salary);
    G.money += m.lastSalary;
    m.bonuses += Math.random()<0.22 ? 1 : 0;
    if(Math.random()<0.22){
      const bonus = Math.floor(m.lastSalary * (0.03 + (m.reputation/1200)));
      G.money += bonus;
      addEv(`Medical performance bonus: ${fmt$(bonus)}.`, 'good');
    }
  }

  // Insurance + debt + malpractice
  if(m.role!=='student'){
    const premium = Math.floor(1800 + (m.malpracticeStrikes||0)*1600 + (spec.risk*900));
    m.insurance = premium;
    G.money = Math.max(0, G.money - premium);
    if(Math.random()<Math.min(0.55, (m.malpracticeStrikes||0)*0.12 + (m.majorFailures||0)*0.08)){
      const lawsuit = rnd(12000, 240000);
      const covered = Math.floor(lawsuit * (0.45 + Math.min(0.35, (m.ethics||50)/200)));
      const pay = Math.max(0, lawsuit - covered);
      G.money = Math.max(0, G.money - pay);
      m.penalties += 1;
      m.reputation = clamp(m.reputation - rnd(5,14));
      m.stress = clamp(m.stress + rnd(8,18));
      addEv(`Malpractice claim settled. Insurance covered ${fmt$(covered)}; you paid ${fmt$(pay)}.`, 'bad');
      if(Math.random()<0.2){
        m.investigations += 1;
        addEv('Medical board opened an investigation into your recent case decisions.', 'warn');
      }
    }
  } else {
    // Student debt accrual sits in medSchool debt in core loop.
    m.stress = clamp(m.stress + rnd(2,6));
  }

  // Patient timeline evolution
  medicalEnsurePatientLoad();
  (m.patients||[]).forEach(p=>{
    if(p.status!=='active') return;
    const untreated = !p.treatmentId;
    const worsening = untreated ? rnd(4,12) : rnd(-4,6);
    p.severity = clamp((p.severity||0) + worsening);
    if(untreated) p.riskFactors = clamp((p.riskFactors||0) + rnd(2,8));
    if((p.severity||0)>=92 && Math.random()<0.24){
      p.status = 'deceased';
      m.majorFailures = (m.majorFailures||0) + 1;
      m.reputation = clamp(m.reputation - rnd(6,16));
      m.stress = clamp(m.stress + rnd(6,14));
      addEv(`${p.label} deteriorated before effective intervention and died.`, 'bad');
    } else if((p.severity||0)<=10 && (p.riskFactors||0)<=18){
      p.status = 'discharged';
    }
  });
  m.patients = (m.patients||[]).filter(p=>p.status==='active' || p.status==='critical').slice(-16);
  m.patientVolume = (m.patients||[]).filter(p=>p.status==='active').length;
  m.timeBudget = Math.max(2, 5 - Math.min(2, Math.floor(m.patientVolume/4)));

  // Stress/burnout integration with global systems
  m.stress = clamp(m.stress + role.stressBase + Math.floor(m.patientVolume/2) - Math.floor((m.ethics||50)/28));
  m.burnout = clamp(m.burnout + Math.floor(m.stress/16) + (m.role==='resident'?3:0) - rnd(0,4));
  if(m.burnout>=82 && !m.pendingBreakdown){
    m.pendingBreakdown = true;
  }
  if(m.pendingBreakdown && Math.random()<0.45){
    G.happy = clamp(G.happy - rnd(10,22));
    G.health = clamp(G.health - rnd(6,16));
    G.stress = clamp((G.stress||35) + rnd(10,22));
    m.reputation = clamp(m.reputation - rnd(4,11));
    m.burnout = clamp(m.burnout - rnd(8,16));
    m.pendingBreakdown = false;
    if(!G.medical.conditions.includes('burnout')) G.medical.conditions.push('burnout');
    addEv('Burnout breakdown: you hit a wall and had to step back medically and mentally.', 'bad');
  }

  // Career risk gates
  if(m.investigations>=3 && Math.random()<0.24){
    c.employed = false;
    c.jobId = null; c.title = ''; c.company = ''; c.salary = 0; c.level = 0;
    m.reputation = clamp(m.reputation - rnd(8,16));
    addEv('Medical board action suspended your current hospital contract.', 'bad');
  }
  if(m.majorFailures>=4 && Math.random()<0.2){
    c.licenses.medical = false;
    m.active = false;
    addEv('Your medical license was revoked after repeated catastrophic outcomes.', 'bad');
  }

  // Ethics + relationship side effects
  if(m.stress>=70){
    G.stress = clamp((G.stress||35) + rnd(4,10));
    if(G.spouse && G.spouse.alive && Math.random()<0.24){
      G.spouse.relation = clamp((G.spouse.relation||50) - rnd(2,7));
      addEv('Medical workload strained your relationship at home.', 'warn');
    }
  }
  if(m.ethics<35 && Math.random()<0.26){
    m.reputation = clamp(m.reputation - rnd(2,8));
    addEv('Questionable ethics decisions hurt your credibility this year.', 'bad');
  } else if(m.ethics>72 && Math.random()<0.22){
    m.reputation = clamp(m.reputation + rnd(2,6));
    addEv('Patient-first decisions boosted your professional reputation.', 'good');
  }

  m.history.push({
    age:G.age||0,
    role:m.role,
    spec:m.specialization,
    rep:m.reputation,
    stress:m.stress,
    burnout:m.burnout,
    ethics:m.ethics,
    patients:m.patientVolume,
  });
  if(m.history.length>18) m.history.shift();
  m.lastYearSummary = {
    role: role.label,
    hospital: hosp.label,
    specialization: spec.label,
    patientVolume: m.patientVolume,
    salary: m.lastSalary||0,
    stress: m.stress,
    burnout: m.burnout,
    reputation: m.reputation,
    ethics: m.ethics,
  };
}

function renderMedicalCareerCard(){
  ensureMedicalCareerState();
  const c = G.career;
  const m = c.medicalCareer;
  const role = medicalRoleMeta(m.role);
  const spec = medicalSpecMeta(m.specialization);
  const hosp = medicalHospitalMeta(m.hospitalId);
  const activePatients = (m.patients||[]).filter(p=>p.status==='active');
  const latest = activePatients.slice(0,4);

  let html = `<div class="card">
    <div class="card-title">Medical Career System</div>
    <p style="font-size:.78rem;color:var(--muted2)">
      Role: <strong style="color:var(--text)">${role.label}</strong> · Specialty: <strong style="color:var(--text)">${spec.label}</strong> · Hospital: <strong style="color:var(--text)">${hosp.label}</strong>
    </p>
    <p style="font-size:.74rem;color:var(--muted2)">
      Knowledge ${m.knowledge} · Skill ${m.skill} · Stress ${m.stress} · Reputation ${m.reputation} · Ethics ${m.ethics} · Burnout ${m.burnout}
    </p>
    <p style="font-size:.74rem;color:var(--muted2)">
      Cases ${m.casesHandled} · Correct Dx ${m.correctDx} · MisDx ${m.misDx} · Major failures ${m.majorFailures} · Malpractice strikes ${m.malpracticeStrikes}
    </p>
    <p style="font-size:.74rem;color:var(--muted2)">
      Time budget ${m.timeBudget}/year · Patient volume ${m.patientVolume} · Insurance ${fmt$(m.insurance||0)}
    </p>`;

  if(!m.active){
    html += `<div class="choice-grid" style="margin-top:10px">
      <div class="choice" onclick="medicalStartCareer()"><div class="choice-icon">🩺</div><div class="choice-name">Activate Medical Track</div><div class="choice-desc">Enable deep med simulation</div></div>
    </div>`;
  } else {
    html += `<div class="choice-grid" style="margin-top:10px">
      ${m.role==='student'
        ? `<div class="choice" onclick="medicalAction('study')"><div class="choice-icon">📚</div><div class="choice-name">Study</div><div class="choice-desc">+Knowledge</div></div>
           <div class="choice" onclick="medicalAction('rotation')"><div class="choice-icon">🏥</div><div class="choice-name">Clinical Rotation</div><div class="choice-desc">+Skill +Rep</div></div>
           <div class="choice" onclick="medicalAction('rest')"><div class="choice-icon">🧘</div><div class="choice-name">Recover</div><div class="choice-desc">-Stress -Burnout</div></div>`
        : `<div class="choice" onclick="medicalAction('diagnose')"><div class="choice-icon">🔎</div><div class="choice-name">Diagnose Patient</div><div class="choice-desc">Uncertain info</div></div>
           <div class="choice" onclick="medicalAction('order_tests')"><div class="choice-icon">🧪</div><div class="choice-name">Order Tests</div><div class="choice-desc">Improve clarity</div></div>
           <div class="choice" onclick="medicalAction('prescribe')"><div class="choice-icon">💊</div><div class="choice-name">Prescribe</div><div class="choice-desc">Treatment plan</div></div>
           <div class="choice" onclick="medicalAction('manage')"><div class="choice-icon">📋</div><div class="choice-name">Manage Care</div><div class="choice-desc">Ongoing management</div></div>
           <div class="choice" onclick="medicalAction('procedure')"><div class="choice-icon">🔬</div><div class="choice-name">Procedure / Surgery</div><div class="choice-desc">High impact</div></div>
           ${m.role==='consultant' ? `<div class="choice" onclick="medicalAction('policy')"><div class="choice-icon">⚖️</div><div class="choice-name">Policy Decision</div><div class="choice-desc">Ethics vs profit</div></div>` : ''}
           <div class="choice" onclick="medicalAction('rest')"><div class="choice-icon">🧘</div><div class="choice-name">Recover</div><div class="choice-desc">Reduce burnout</div></div>`
      }
    </div>`;

    if(m.role!=='student'){
      html += `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${MED_SPECIALISATIONS.map(s=>`<button class="btn btn-ghost btn-sm${m.specialization===s.id?' disabled':''}" onclick="medicalSetSpecialization('${s.id}')">${s.label}</button>`).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${MED_HOSPITAL_TYPES.map(h=>`<button class="btn btn-ghost btn-sm${m.hospitalId===h.id?' disabled':''}" onclick="medicalMoveHospital('${h.id}')">${h.label}</button>`).join('')}
      </div>`;
    }
  }

  if(latest.length){
    html += `<div style="margin-top:10px;border-top:1px solid var(--border);padding-top:8px">
      <div style="font-size:.72rem;color:var(--muted2);margin-bottom:6px">Active patient board</div>
      ${latest.map(p=>`<div style="font-size:.74rem;color:var(--muted2);padding:4px 0;border-bottom:1px dashed rgba(255,255,255,.08)">
        ${p.label} · Symptoms: ${p.symptoms.join(', ')} · Severity ${p.severity} · Risk ${p.riskFactors} · Dx ${p.diagnosisType}
      </div>`).join('')}
    </div>`;
  }

  html += `</div>`;
  return html;
}
