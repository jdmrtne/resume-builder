// ─── JOB DESCRIPTION KEYWORD MATCHER ─────────────────────────────────────

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','must','our','your','their','we','you','they','it','this','that','these','those','as','if','then','than','when','where','who','which','what','how','i','me','my','him','her','his','its','us','all','each','few','more','most','other','some','such','no','not','only','same','so','yet','both','just','because','while','although','though','since','before','after','above','below','between','through','during','about','against','between','into','through','within']);

function extractKeywords(text) {
  return text.toLowerCase()
    .replace(/[^\w\s+#.]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .filter((v, i, a) => a.indexOf(v) === i);
}

function extractResumeText(resumeData) {
  const parts = [];
  const p = resumeData.personal || {};
  if (p.title) parts.push(p.title);
  if (p.summary) parts.push(p.summary);
  (resumeData.experience || []).forEach(e => {
    if (e.position) parts.push(e.position);
    if (e.company) parts.push(e.company);
    (e.bullets || []).forEach(b => parts.push(b));
  });
  const s = resumeData.skills || {};
  [...(s.technical||[]), ...(s.soft||[]), ...(s.tools||[]), ...(s.languages||[])].forEach(sk => parts.push(sk));
  (resumeData.projects || []).forEach(pr => {
    if (pr.name) parts.push(pr.name);
    if (pr.description) parts.push(pr.description);
    if (pr.technologies) parts.push(pr.technologies);
  });
  (resumeData.certifications || []).forEach(c => {
    if (c.name) parts.push(c.name);
  });
  return parts.join(' ');
}

function matchKeywords(jobDescription, resumeData) {
  if (!jobDescription || !jobDescription.trim()) return { matched: [], missing: [], score: 0 };

  const jobKeywords = extractKeywords(jobDescription);
  const resumeText = extractResumeText(resumeData).toLowerCase();

  // Filter to meaningful tech/skill-like words (longer, more specific)
  const meaningfulKeywords = jobKeywords.filter(k => k.length >= 3);

  const matched = [];
  const missing = [];

  // Also check for multi-word tech terms
  const techTerms = extractTechTerms(jobDescription);

  techTerms.forEach(term => {
    const termLower = term.toLowerCase();
    if (resumeText.includes(termLower)) {
      matched.push(term);
    } else {
      missing.push(term);
    }
  });

  const score = techTerms.length > 0
    ? Math.round((matched.length / techTerms.length) * 100)
    : 0;

  return { matched, missing, score };
}

function extractTechTerms(text) {
  // Extract common tech/skill terms including multi-word ones
  const multiWord = [
    'machine learning', 'deep learning', 'natural language processing', 'computer vision',
    'data science', 'data analysis', 'data engineering', 'data visualization',
    'project management', 'agile methodology', 'scrum master', 'product management',
    'rest api', 'restful api', 'microservices', 'cloud computing', 'version control',
    'continuous integration', 'continuous deployment', 'ci/cd', 'devops', 'test driven development',
    'object oriented', 'functional programming', 'mobile development', 'full stack', 'front end', 'back end',
    'ui/ux', 'user experience', 'user interface', 'web development', 'api development',
    'database management', 'sql server', 'google cloud', 'amazon web services'
  ];

  const singleWord = [
    'javascript','typescript','python','java','c++','c#','ruby','go','rust','swift','kotlin','php','scala',
    'react','angular','vue','node','express','django','flask','spring','rails','laravel',
    'html','css','sass','scss','tailwind','bootstrap','webpack','vite','babel',
    'sql','mysql','postgresql','mongodb','redis','elasticsearch','firebase','supabase',
    'aws','azure','gcp','docker','kubernetes','terraform','ansible','jenkins',
    'git','github','gitlab','jira','confluence','slack','figma','sketch','xd',
    'pandas','numpy','tensorflow','pytorch','sklearn','keras','matplotlib','tableau','powerbi',
    'linux','bash','shell','nginx','apache','graphql','kafka','rabbitmq',
    'agile','scrum','kanban','waterfall','lean','devops','sre','devsecops',
    'excel','word','powerpoint','salesforce','hubspot','sap','oracle','adobe'
  ];

  const found = new Set();
  const lower = text.toLowerCase();

  multiWord.forEach(term => { if (lower.includes(term)) found.add(term.replace(/\b\w/g, c => c.toUpperCase())); });
  singleWord.forEach(term => {
    const re = new RegExp(`\\b${term.replace(/[+#]/g, '\\$&')}\\b`, 'i');
    if (re.test(text)) found.add(term.charAt(0).toUpperCase() + term.slice(1));
  });

  // Also catch capitalized words that look like tech (PascalCase, ALL_CAPS short words, etc.)
  const techish = text.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b|\b[A-Z]{2,10}\b|\b\w+\.js\b|\b\w+\+\+\b/g) || [];
  techish.filter(t => t.length > 2 && t.length < 20).forEach(t => found.add(t));

  return [...found];
}

function renderKeywordPanel(jobDescription, resumeData) {
  const { matched, missing, score } = matchKeywords(jobDescription, resumeData);

  if (!jobDescription || !jobDescription.trim()) {
    return `<div class="keyword-empty">Paste a job description above to see keyword matches.</div>`;
  }

  return `
    <div class="keyword-results">
      <div class="keyword-score">
        <span class="ks-num">${score}%</span>
        <span class="ks-label">Keyword Match Rate</span>
      </div>
      <div class="keyword-cols">
        <div class="kw-col matched">
          <h4>✓ Matched Keywords (${matched.length})</h4>
          <div class="kw-tags">${matched.map(k => `<span class="kw-tag match">${k}</span>`).join('') || '<span class="kw-none">None matched yet</span>'}</div>
        </div>
        <div class="kw-col missing">
          <h4>✗ Missing Keywords (${missing.length})</h4>
          <div class="kw-tags">${missing.map(k => `<span class="kw-tag miss">${k}</span>`).join('') || '<span class="kw-none">Great! No missing keywords</span>'}</div>
        </div>
      </div>
    </div>`;
}
