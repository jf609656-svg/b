// ══ death.js ══
// ═══════════════════════════════════════════════════════════════
//  death.js — Legacy screen
// ═══════════════════════════════════════════════════════════════

const EPITAPHS = [
  'They lived. They tried. Mostly.',
  'More interesting than their LinkedIn suggested.',
  'Left the world slightly confused but genuinely entertained.',
  'The funeral was well-attended. People came for the sandwiches.',
  'Remembered fondly, mostly accurately.',
  'They had opinions. Loudly, frequently, and occasionally correctly.',
  'A life fully lived, partially documented.',
  'Went out doing what they loved. (Unclear what that was.)',
  'Asked not to be remembered like this. Remembered like this anyway.',
  'They once parallel-parked on the first try. It defined them.',
];

function showDeath(){
  const avg = (G.health+G.happy+G.smarts+G.looks)/4;
  const grade = avg>=82?'Extraordinary':avg>=68?'Well-Lived':avg>=52?'Decent':avg>=36?'Rough Around the Edges':'A Cautionary Tale';

  const sport = G.school.sport ? HS_SPORTS.find(s=>s.id===G.school.sport) : null;
  const addictions = SUBSTANCES.filter(s=>G.social.drugFlags[s.id+'_hooked']);
  const darkEnding = G.darkScore >= 15;

  document.getElementById('death-content').innerHTML=`
    <div style="font-size:3.5rem;margin-bottom:14px">${darkEnding?'💀':'⚰️'}</div>
    <h1 style="font-family:var(--fh);font-weight:800;font-size:2.3rem;letter-spacing:-.03em;margin-bottom:6px">${G.firstname} ${G.lastname}</h1>
    <div style="color:var(--muted2);margin-bottom:5px;font-size:.9rem">${G.age} years old · ${G.state}</div>
    <div style="color:var(--muted);font-style:italic;font-size:.82rem;margin-bottom:28px">"${pick(EPITAPHS)}"</div>

    <div class="stat-roll-card" style="width:100%;max-width:360px;margin-bottom:14px">
      ${statBar('Health',G.health,'bar-h')}
      ${statBar('Happiness',G.happy,'bar-p')}
      ${statBar('Smarts',G.smarts,'bar-s')}
      ${statBar('Looks',G.looks,'bar-l')}
    </div>

    <div class="money-tag" style="margin-bottom:24px;font-size:.9rem">💵 ${fmt$(Math.max(0,G.money))} left behind</div>

    <div class="card" style="text-align:left;width:100%;max-width:360px;margin-bottom:24px">
      <div class="card-title">Life Summary</div>
      <p style="margin-bottom:5px">🤝 Friends made: ${G.friends.length}</p>
      <p style="margin-bottom:5px">❤️ Relationships: ${G.lovers.length + (G.spouse?1:0)}</p>
      ${G.spouse?`<p style="margin-bottom:5px">💍 Married to ${G.spouse.firstName} · ${G.marriageYears} year${G.marriageYears!==1?'s':''}</p>`:''}
      ${G.divorces>0?`<p style="margin-bottom:5px">💔 Divorces: ${G.divorces}</p>`:''}
      ${G.children.length>0?`<p style="margin-bottom:5px">👶 Children: ${G.children.length} (${G.children.filter(c=>c.adopted).length} adopted)</p>`:''}
      <p style="margin-bottom:5px">👨‍👩‍👧 Family members: ${G.family.length}</p>
      <p style="margin-bottom:5px">📖 Life events: ${G.lifeEvents.length}</p>
      <p style="margin-bottom:5px">🧠 Final stress: ${G.stress||35}/100</p>
      ${G.school.uni.course?`<p style="margin-bottom:5px">🎓 Degree: ${G.school.uni.course}</p>`:''}
      ${G.school.gpa>=3.7?`<p style="margin-bottom:5px">⭐ Honor Roll GPA: ${G.school.gpa.toFixed(1)}</p>`:''}
      ${sport&&G.school.sportMVP?`<p style="margin-bottom:5px">🏆 ${sport.label} MVP</p>`:''}
      ${sport?`<p style="margin-bottom:5px">${sport.icon} ${sport.label}: ${G.school.bigGameWins} big game wins</p>`:''}
      ${G.social.partyCount>0?`<p style="margin-bottom:5px">🎉 Parties: ${G.social.partyCount}</p>`:''}
      ${addictions.length?`<p style="margin-bottom:5px">⚠️ Addictions: ${addictions.map(s=>s.icon).join('')}</p>`:''}
      ${G.medical.history.length?`<p style="margin-bottom:5px">🏥 Conditions survived: ${G.medical.history.length}</p>`:''}
      ${G.sm.totalRevenue>0?`<p style="margin-bottom:5px">📱 Online earnings: ${fmt$(G.sm.totalRevenue)}</p>`:''}
      ${G.sm.music&&G.sm.music.streams>0?`<p style="margin-bottom:5px">🎵 Music streams: ${fmtF(G.sm.music.streams)}</p>`:''}
      ${G.sm.podcast&&G.sm.podcast.episodes>0?`<p style="margin-bottom:5px">🎙️ Podcast episodes: ${G.sm.podcast.episodes} · ${fmtF(G.sm.podcast.listeners)} listeners</p>`:''}
      ${G.sm.talkShowAppearances>0?`<p style="margin-bottom:5px">📺 Talk show appearances: ${G.sm.talkShowAppearances}</p>`:''}
      ${G.acting.active&&G.acting.totalProjects>0?`<p style="margin-bottom:5px">🎭 Acting projects: ${G.acting.totalProjects} · ${fmt$(G.acting.totalEarned)} earned</p>`:''}
      ${G.acting.awardsWins>0?`<p style="margin-bottom:5px">🏆 Awards won: ${G.acting.awardsWins}</p>`:''}
      ${G.acting.awardsNoms>0&&!G.acting.awardsWins?`<p style="margin-bottom:5px">⭐ Award nominations: ${G.acting.awardsNoms}</p>`:''}
      ${G.nfl.active||G.nfl.retired?`<p style="margin-bottom:5px">🏈 NFL: ${G.nfl.year-1} seasons · ${G.nfl.superBowlWins} rings · ${G.nfl.proBowls}× Pro Bowl · ${fmt$(G.nfl.totalEarned)}</p>`:''}
      ${G.nfl.mvpAwards>0?`<p style="margin-bottom:5px">🏆 NFL MVP × ${G.nfl.mvpAwards}</p>`:''}
      ${G.nfl.superBowlMVPs>0?`<p style="margin-bottom:5px">🏆 Super Bowl MVP × ${G.nfl.superBowlMVPs}</p>`:''}
      ${G.nba.active||G.nba.retired?`<p style="margin-bottom:5px">🏀 NBA: ${G.nba.year-1} seasons · ${G.nba.championshipRings} rings · ${G.nba.allStarSelections}× All-Star · ${fmt$(G.nba.totalEarned)}</p>`:''}
      ${G.nba.mvpAwards>0?`<p style="margin-bottom:5px">🏆 NBA MVP × ${G.nba.mvpAwards}</p>`:''}
      ${G.nba.sneakerDeal?`<p style="margin-bottom:5px">👟 Sneaker deal: ${G.nba.sneakerDeal} · ${fmt$(G.nba.sneakerRevenue)} lifetime</p>`:''}
      ${G.mma&&G.mma.active?`<p style="margin-bottom:5px">🥋 MMA: Amateur ${G.mma.amateur.wins}-${G.mma.amateur.losses}${G.mma.amateur.draws?`-${G.mma.amateur.draws}`:''} · Pro ${G.mma.pro.wins}-${G.mma.pro.losses}${G.mma.pro.draws?`-${G.mma.pro.draws}`:''} · ${fmt$(G.mma.totalEarned)} earned</p>`:''}
      ${G.mma&&G.mma.pro&&G.mma.pro.ufc&&G.mma.pro.ufc.inUFC?`<p style="margin-bottom:5px">🏟️ UFC: ${G.mma.pro.ufc.wins}-${G.mma.pro.ufc.losses}${G.mma.pro.ufc.draws?`-${G.mma.pro.ufc.draws}`:''} · ${G.mma.pro.ufc.champ?'Champion':''}${G.mma.pro.ufc.interimChamp?' Interim Champion':''}${G.mma.pro.ufc.champWeight2?' · Double Champ':''}</p>`:''}
      ${G.finance&&G.finance.business&&G.finance.business.active?`<p style="margin-bottom:5px">🏢 Business: ${G.finance.business.name||'Founder venture'} · ${fmt$(G.finance.business.valuation||0)} valuation</p>`:''}
      ${G.finance&&G.finance.crypto?`<p style="margin-bottom:5px">🪙 Crypto holdings: ${fmt$((G.finance.crypto.btc||0)+(G.finance.crypto.eth||0)+(G.finance.crypto.sol||0)+(G.finance.crypto.meme||0))}</p>`:''}
      ${(G.nfl.endorsementIncome+G.nba.endorsementIncome)>0?`<p style="margin-bottom:5px">💼 Endorsements: ${fmt$(G.nfl.endorsementIncome+G.nba.endorsementIncome)} total</p>`:''}
      ${G.sm.onlyfans&&G.sm.onlyfans.revenue>0?`<p style="margin-bottom:5px">💗 OnlyFans lifetime: ${fmt$(G.sm.onlyfans.revenue)}</p>`:''}
      ${G.social.rival?`<p style="margin-bottom:5px">😤 Unresolved nemesis: ${G.social.rival.firstName}. They outlived you. They\'re smug about it.</p>`:''}
      <hr class="div">
      <p style="font-size:.85rem">Verdict: <strong style="color:var(--accent)">${grade}</strong></p>
      <p style="font-size:.78rem;color:var(--muted2);margin-top:3px">Dark score: ${G.darkScore} ${G.darkScore>=15?'· You lived a complicated life.':G.darkScore>=8?'· A few rough patches.':''}</p>
    </div>
    <button class="btn btn-primary btn-lg" onclick="location.reload()">🔄 Play Again</button>`;

  document.getElementById('hud').style.display    = 'none';
  document.getElementById('tab-bar').style.display = 'none';
  goTo('screen-death');
}


// ══════════════════════════════════════════════════════════════════
