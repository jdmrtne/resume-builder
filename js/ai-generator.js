// ─── MOCK AI BULLET POINT GENERATOR ────────────────────────────────────────

const BULLET_TEMPLATES = {
  default: [
    'Delivered high-quality {task} resulting in improved team efficiency by 25%',
    'Managed {task} for a cross-functional team, achieving project goals 2 weeks ahead of schedule',
    'Developed and implemented {task} strategy that increased productivity across the department',
    'Collaborated with stakeholders to streamline {task} processes, reducing turnaround time by 30%',
    'Executed {task} initiatives, contributing to a 20% improvement in overall performance metrics'
  ],
  software: [
    'Engineered {task} solutions using modern frameworks, reducing load time by 40%',
    'Built and maintained {task} features serving 10,000+ daily active users',
    'Architected scalable {task} system improving application performance by 35%',
    'Developed RESTful APIs for {task} enabling seamless third-party integrations',
    'Optimized {task} pipeline reducing deployment time from 2 hours to 20 minutes'
  ],
  sales: [
    'Generated $250K+ in revenue through strategic {task} and client relationship management',
    'Exceeded {task} targets by 40% through proactive outreach and personalized proposals',
    'Managed a portfolio of 50+ accounts by leveraging {task} best practices',
    'Closed high-value deals by presenting compelling {task} solutions to C-suite executives',
    'Grew territory revenue 30% YoY through effective {task} and pipeline management'
  ],
  marketing: [
    'Launched {task} campaigns achieving 3x ROI and 150K+ impressions in 30 days',
    'Developed {task} content strategy that grew organic traffic by 65% in 6 months',
    'Managed $200K+ advertising budget for {task} across digital channels',
    'Created {task} materials that increased lead generation by 45%',
    'Led {task} rebranding initiative resulting in 28% increase in brand recognition'
  ],
  customer_service: [
    'Handled 60+ {task} inquiries daily maintaining a 98% customer satisfaction rating',
    'Resolved complex {task} issues efficiently, reducing average handle time by 20%',
    'Trained 5 new team members on {task} procedures and CRM software best practices',
    'Maintained top 10% {task} performance metrics for 3 consecutive quarters',
    'Implemented {task} feedback system, identifying and resolving recurring issues for 500+ customers'
  ],
  management: [
    'Led a team of 12 in delivering {task} projects on time and within budget',
    'Developed {task} roadmap and OKRs aligned with company-wide strategic objectives',
    'Mentored and coached 8 direct reports on {task} skills, resulting in 2 promotions',
    'Reduced {task} operational costs by 18% through process optimization initiatives',
    'Facilitated cross-departmental {task} collaboration increasing project success rate to 95%'
  ]
};

const ROLE_MAP = {
  developer: 'software', engineer: 'software', programmer: 'software', frontend: 'software',
  backend: 'software', fullstack: 'software', devops: 'software', software: 'software',
  sales: 'sales', account: 'sales', business: 'sales', representative: 'sales',
  marketing: 'marketing', content: 'marketing', seo: 'marketing', brand: 'marketing',
  customer: 'customer_service', support: 'customer_service', service: 'customer_service',
  manager: 'management', director: 'management', lead: 'management', head: 'management', vp: 'management'
};

function detectRoleCategory(jobTitle) {
  const lower = jobTitle.toLowerCase();
  for (const [key, cat] of Object.entries(ROLE_MAP)) {
    if (lower.includes(key)) return cat;
  }
  return 'default';
}

function cleanTask(taskText) {
  return taskText
    .toLowerCase()
    .replace(/^(answering|handling|managing|doing|working on|helping with)\s+/i, '')
    .trim() || 'core responsibilities';
}

function generateBullets(jobTitle, taskDescription, count = 3) {
  const category = detectRoleCategory(jobTitle || '');
  const templates = BULLET_TEMPLATES[category] || BULLET_TEMPLATES.default;
  const task = cleanTask(taskDescription || 'daily tasks');

  // Shuffle templates
  const shuffled = [...templates].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map(template => {
    let bullet = template.replace(/{task}/g, task);
    // Capitalize first letter
    bullet = bullet.charAt(0).toUpperCase() + bullet.slice(1);
    // Add some variability to numbers
    bullet = bullet.replace(/\b(\d+)(%|\+|K)\b/g, (match, num, suffix) => {
      const variation = Math.floor(Math.random() * 15) - 7;
      const newNum = Math.max(5, parseInt(num) + variation);
      return `${newNum}${suffix}`;
    });
    return '• ' + bullet;
  });
}

function renderAIPanel(resumeData) {
  return `
    <div class="ai-panel">
      <div class="ai-header">
        <div class="ai-badge">✨ AI</div>
        <div>
          <h3>AI Bullet Generator</h3>
          <p>Generate stronger resume bullet points instantly</p>
        </div>
      </div>
      <div class="ai-form">
        <div class="ai-field">
          <label>Job Title / Role</label>
          <input type="text" id="ai-job-title" placeholder="e.g. Customer Service Representative" />
        </div>
        <div class="ai-field">
          <label>What did you do? (brief description)</label>
          <textarea id="ai-task" rows="3" placeholder="e.g. answering customer calls, resolving billing issues, using CRM"></textarea>
        </div>
        <div class="ai-field">
          <label>Number of bullets</label>
          <select id="ai-count">
            <option value="3">3 bullets</option>
            <option value="4">4 bullets</option>
            <option value="5">5 bullets</option>
          </select>
        </div>
        <button class="btn-ai" id="btn-generate-ai">✨ Generate Bullets</button>
      </div>
      <div id="ai-results" class="ai-results hidden"></div>
    </div>`;
}

function bindAIPanel() {
  const btn = document.getElementById('btn-generate-ai');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const title = document.getElementById('ai-job-title').value.trim();
    const task = document.getElementById('ai-task').value.trim();
    const count = parseInt(document.getElementById('ai-count').value);

    if (!title || !task) {
      alert('Please fill in both fields.');
      return;
    }

    btn.textContent = '✨ Generating…';
    btn.disabled = true;

    // Simulate AI delay
    setTimeout(() => {
      const bullets = generateBullets(title, task, count);
      const resultsEl = document.getElementById('ai-results');
      resultsEl.innerHTML = `
        <div class="ai-result-header">
          <span>Generated Bullets</span>
          <button class="btn-copy-all" id="btn-copy-bullets">Copy All</button>
        </div>
        ${bullets.map((b, i) => `
          <div class="ai-bullet-item">
            <p>${b}</p>
            <button class="btn-copy-one" data-text="${b.replace(/"/g, '&quot;')}">Copy</button>
          </div>`).join('')}
        <p class="ai-note">💡 Tip: Customize these bullets with specific details and metrics from your experience.</p>`;
      resultsEl.classList.remove('hidden');

      document.getElementById('btn-copy-bullets').addEventListener('click', () => {
        navigator.clipboard.writeText(bullets.join('\n'));
        document.getElementById('btn-copy-bullets').textContent = '✓ Copied!';
        setTimeout(() => { document.getElementById('btn-copy-bullets').textContent = 'Copy All'; }, 2000);
      });

      resultsEl.querySelectorAll('.btn-copy-one').forEach(b => {
        b.addEventListener('click', () => {
          navigator.clipboard.writeText(b.dataset.text);
          b.textContent = '✓';
          setTimeout(() => { b.textContent = 'Copy'; }, 1500);
        });
      });

      btn.textContent = '✨ Generate Bullets';
      btn.disabled = false;
    }, 800);
  });
}
