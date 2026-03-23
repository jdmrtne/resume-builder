// ─── ATS ANALYZER ──────────────────────────────────────────────────────────

const ACTION_VERBS = ['managed','led','developed','created','implemented','designed','built','improved','increased','reduced','achieved','launched','coordinated','delivered','analyzed','collaborated','optimized','streamlined','generated','established','drove','spearheaded','executed','facilitated','orchestrated','oversaw','produced','grew','saved','transformed'];

const MEASURABLE_PATTERNS = [/\d+%/,/\$[\d,.]+/,/\d+\+/,/\d+x/,/\d+ (users|clients|customers|projects|teams|people|members)/i];

function analyzeATS(resumeData) {
  if (!resumeData) return { score: 0, issues: [], suggestions: [] };

  const issues = [];
  const suggestions = [];
  let score = 100;

  const p = resumeData.personal || {};

  // Personal completeness (20 pts)
  const personalFields = ['fullName','email','phone','location','summary'];
  const missingPersonal = personalFields.filter(f => !p[f] || p[f].trim() === '');
  if (missingPersonal.length > 0) {
    score -= missingPersonal.length * 3;
    suggestions.push(`Complete missing personal fields: ${missingPersonal.join(', ')}`);
  }

  // Summary (10 pts)
  if (!p.summary || p.summary.length < 50) {
    score -= 10;
    issues.push('Professional summary is missing or too short');
    suggestions.push('Add a 2-3 sentence professional summary with keywords');
  }

  // Experience (25 pts)
  const exp = resumeData.experience || [];
  if (exp.length === 0) {
    score -= 25;
    issues.push('No work experience added');
  } else {
    let bulletsWithVerbs = 0;
    let bulletsWithMetrics = 0;
    let totalBullets = 0;
    exp.forEach(e => {
      const bullets = e.bullets || [];
      totalBullets += bullets.length;
      bullets.forEach(b => {
        const lower = b.toLowerCase();
        if (ACTION_VERBS.some(v => lower.startsWith(v))) bulletsWithVerbs++;
        if (MEASURABLE_PATTERNS.some(p => p.test(b))) bulletsWithMetrics++;
      });
    });
    if (totalBullets < 3) { score -= 8; issues.push('Add more bullet points to experience entries'); }
    if (bulletsWithVerbs < totalBullets * 0.5) {
      score -= 5;
      suggestions.push('Start bullet points with strong action verbs (e.g., Led, Developed, Achieved)');
    }
    if (bulletsWithMetrics === 0) {
      score -= 7;
      suggestions.push('Add measurable achievements (e.g., "Increased sales by 35%")');
    }
  }

  // Education (10 pts)
  const edu = resumeData.education || [];
  if (edu.length === 0) {
    score -= 10;
    issues.push('No education section added');
  }

  // Skills (15 pts)
  const skills = resumeData.skills || {};
  const allSkills = [...(skills.technical || []), ...(skills.soft || []), ...(skills.tools || [])];
  if (allSkills.length < 5) {
    score -= 10;
    issues.push('Skills section has fewer than 5 entries');
    suggestions.push('Add at least 5-10 relevant skills');
  } else if (allSkills.length < 10) {
    score -= 5;
    suggestions.push('Consider adding more skills to improve keyword density');
  }

  // Contact completeness
  if (!p.linkedin) { score -= 2; suggestions.push('Add your LinkedIn profile URL'); }
  if (!p.email) { score -= 5; issues.push('Email address is required'); }
  if (!p.phone) { score -= 3; issues.push('Phone number is required'); }

  // Projects/Certs bonus
  if ((resumeData.projects || []).length > 0) score = Math.min(score + 3, 100);
  if ((resumeData.certifications || []).length > 0) score = Math.min(score + 2, 100);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, issues, suggestions };
}

function renderATSPanel(resumeData) {
  const { score, issues, suggestions } = analyzeATS(resumeData);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  return `
    <div class="ats-panel">
      <div class="ats-score-ring">
        <svg viewBox="0 0 100 100" class="ring-svg">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="8"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="${color}" stroke-width="8"
            stroke-dasharray="${2.64 * score} ${264 - 2.64 * score}"
            stroke-linecap="round" transform="rotate(-90 50 50)"/>
        </svg>
        <div class="ring-label">
          <span class="ring-num">${score}</span>
          <span class="ring-max">/100</span>
        </div>
      </div>
      <div class="ats-score-label" style="color:${color}">${label} ATS Score</div>

      ${issues.length > 0 ? `
        <div class="ats-section">
          <h4>⚠ Issues Found</h4>
          <ul>${issues.map(i => `<li class="ats-issue">${i}</li>`).join('')}</ul>
        </div>` : ''}

      ${suggestions.length > 0 ? `
        <div class="ats-section">
          <h4>💡 Suggestions</h4>
          <ul>${suggestions.map(s => `<li class="ats-suggestion">${s}</li>`).join('')}</ul>
        </div>` : ''}

      ${score === 100 ? '<div class="ats-perfect">🎉 Perfect ATS Score!</div>' : ''}
    </div>`;
}
