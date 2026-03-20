//  college_research.js — Research Projects for Elite Institutions
// ══════════════════════════════════════════════════════════════════

function showResearchProjects(){
  const u   = G.school.uni;
  const sc  = document.getElementById('school-content');
  const available = RESEARCH_PROJECTS.filter(p=>
    G.smarts >= p.minSmarts &&
    !u.researchComplete.includes(p.id) &&
    u.activeResearch !== p.label
  );

  let html = `<div class="card">
    <div class="card-title">🔬 Research Projects — ${u.collegeName}</div>
    <p style="color:var(--muted2);font-size:.82rem;margin-bottom:10px">
      As a student at a research institution studying ${u.course}, you have access to cutting-edge projects.
      ${u.activeResearch?`<br><span style="color:var(--accent)">Currently working on: ${u.activeResearch}</span>`:''}
    </p>`;

  if(u.activeResearch){
    html+=`<div class="notif good" style="margin-bottom:10px">
      You're currently working on "${u.activeResearch}". Age up to make progress, or submit it this year.
    </div>
    <button class="btn btn-primary" onclick="submitResearch()" style="margin-bottom:12px">📄 Submit Current Research</button>`;
  }

  html+=`<div class="choice-grid">`;
  available.forEach(p=>{
    html+=`<div class="choice${G.smarts<p.minSmarts?' disabled':''}" onclick="startResearch('${p.id}')">
      <div class="choice-icon">${p.icon}</div>
      <div class="choice-name">${p.label}</div>
      <div class="choice-desc">${p.desc}</div>
      <div style="font-size:.66rem;color:var(--gold);margin-top:3px">Grant: ${fmt$(p.grant)} · Min smarts: ${p.minSmarts}</div>
    </div>`;
  });
  if(!available.length && !u.activeResearch){
    html+=`<p style="color:var(--muted2);font-size:.855rem;grid-column:1/-1">No available projects right now. Raise your Smarts stat to unlock more.</p>`;
  }
  html+=`</div></div>
  <button class="btn btn-ghost" style="margin-top:8px;width:100%" onclick="renderSchool()">← Back</button>`;
  sc.innerHTML = html;
}

function startResearch(projectId){
  const u   = G.school.uni;
  const proj = RESEARCH_PROJECTS.find(p=>p.id===projectId);
  if(!proj) return;
  if(G.smarts < proj.minSmarts){ flash(`Need ${proj.minSmarts} Smarts`,'bad'); return; }
  if(u.activeResearch){ flash('Finish your current project first','warn'); return; }

  u.activeResearch = proj.label;
  u.hasResearch    = true;
  G.money += Math.floor(proj.grant * 0.3); // partial upfront grant
  G.smarts = clamp(G.smarts + Math.floor(proj.smartsBonus * 0.3));
  addEv(`Research started: "${proj.label}" at ${u.collegeName}. ${proj.desc} Grant instalment: ${fmt$(Math.floor(proj.grant*0.3))}.`,'good');
  flash(`🔬 Research started: ${proj.label}`,'good');
  updateHUD(); renderSchool();
}

function submitResearch(){
  const u    = G.school.uni;
  const proj = RESEARCH_PROJECTS.find(p=>p.label===u.activeResearch);
  if(!proj){ u.activeResearch=null; return; }

  u.researchComplete = u.researchComplete||[];
  u.researchComplete.push(proj.id);
  u.activeResearch = null;

  // Remaining grant + smarts boost
  G.money  += Math.floor(proj.grant * 0.7);
  G.smarts  = clamp(G.smarts + proj.smartsBonus);
  u.gpa     = parseFloat(Math.min(4.0, u.gpa + rnd(5,12)/100).toFixed(2));
  G.sm.totalFame = clamp(G.sm.totalFame + rnd(1,4));

  // Famous publication chance
  if(Math.random() < proj.famousChance){
    G.sm.totalFame = clamp(G.sm.totalFame + rnd(5,15));
    addEv(`Your research "${proj.label}" was published in a peer-reviewed journal. The scientific community noticed. Your name: in the literature.`,'love');
    flash(`📄 Published! +Fame 🔬`,'good');
  } else {
    addEv(`Research complete: "${proj.label}". Results submitted. GPA boost. Remaining grant: ${fmt$(Math.floor(proj.grant*0.7))} deposited.`,'good');
    flash(`🔬 Research submitted! +${fmt$(Math.floor(proj.grant*0.7))}`,'good');
  }

  // Multiple projects = distinguished researcher badge
  if(u.researchComplete.length>=3){
    addEv(`You've completed ${u.researchComplete.length} research projects. Your academic profile is exceptional. Grad school and elite employers will notice.`,'love');
    flash(`Distinguished Researcher 🔬`,'good');
  }
  updateHUD(); renderSchool();
}

// ── CAREER UNLOCK HELPER (used by Activities/Career tab in future) ─
function getCareerOptions(){
  const deg  = G.school.degree;
  const cd   = UNI_COURSES[deg];
  const elite = G.school.eliteGrad;
  const gpa   = G.school.uniGpa;

  if(!cd) return CAREERS_COMMON.slice(0,6);

  let base = [...(cd.careers||[])];
  // Elite school unlocks extra high-tier options
  if(elite && ELITE_SCHOOL_CAREERS[deg]){
    base = [...ELITE_SCHOOL_CAREERS[deg], ...base];
  }
  // Research boosts career options
  const researchBonus = (G.school.uni?.researchComplete?.length||0);
  if(researchBonus>=2) base.unshift('Academic Professor', 'Published Researcher');

  return base.slice(0,8);
}

