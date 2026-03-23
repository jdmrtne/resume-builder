// ─── RESUME BUILDER MAIN LOGIC ─────────────────────────────────────────────

let resumeId = null;
let resumeData = null;
let currentTemplate = 'classic';
let customization = {};
let autoSaveTimer = null;
let activePanel = 'builder';
window.currentResumeTitle = 'resume';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  resumeId = params.get('id');
  if (!resumeId) { window.location.href = 'dashboard.html'; return; }

  await loadResume();
  setupNav();
  setupFormListeners();
  setupTemplatePanel();
  setupCustomizationPanel();
  setupToolPanels();
  setupExportButtons();
  populateForm();
  updatePreview();
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.href = 'index.html';
  });
});

// ─── LOAD / SAVE ──────────────────────────────────────────────────────────
async function loadResume() {
  const { data, error } = await db.from('resumes').select('*').eq('id', resumeId).single();
  if (error || !data) { alert('Resume not found'); window.location.href = 'dashboard.html'; return; }
  resumeData = data.data_json || getDefaultData();
  currentTemplate = data.template || 'classic';
  window.currentResumeTitle = data.title || 'resume';
  document.getElementById('resume-title-input').value = data.title || '';
  highlightTemplate(currentTemplate);
}

async function saveResume(silent = false) {
  if (!resumeId || !resumeData) return;
  collectFormData();
  const title = document.getElementById('resume-title-input').value.trim() || 'Untitled Resume';
  window.currentResumeTitle = title;
  const { error } = await db.from('resumes').update({
    title, data_json: resumeData, template: currentTemplate, updated_at: new Date().toISOString()
  }).eq('id', resumeId);
  if (!silent) {
    const btn = document.getElementById('btn-save');
    if (btn) { btn.textContent = '✓ Saved'; setTimeout(() => { btn.textContent = '💾 Save'; }, 2000); }
  }
}

function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => saveResume(true), 1500);
  updatePreview();
}

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────
function getDefaultData() {
  return {
    personal: { fullName:'',title:'',email:'',phone:'',location:'',linkedin:'',portfolio:'',summary:'' },
    experience: [], education: [],
    skills: { technical:[], soft:[], tools:[], languages:[] },
    projects: [], certifications: []
  };
}

// ─── NAV ──────────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      document.querySelectorAll('.nav-section-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
      document.getElementById(`section-${section}`)?.classList.add('active');
    });
  });

  document.getElementById('btn-save').addEventListener('click', () => saveResume(false));

  // Right panel tabs
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activePanel = tab.dataset.panel;
      document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
      document.getElementById(`panel-${activePanel}`)?.classList.add('active');
      if (activePanel === 'ats') updateATSPanel();
      if (activePanel === 'keywords') updateKeywordPanel();
      if (activePanel === 'ai') {
        document.getElementById('panel-ai').innerHTML = renderAIPanel(resumeData);
        bindAIPanel();
      }
    });
  });
}

// ─── FORM POPULATION ──────────────────────────────────────────────────────
function populateForm() {
  const p = resumeData.personal || {};
  setVal('full-name', p.fullName);
  setVal('prof-title', p.title);
  setVal('email', p.email);
  setVal('phone', p.phone);
  setVal('location', p.location);
  setVal('linkedin', p.linkedin);
  setVal('portfolio', p.portfolio);
  setVal('summary', p.summary);

  // Experience
  const expContainer = document.getElementById('experience-list');
  expContainer.innerHTML = '';
  (resumeData.experience || []).forEach(e => addExperienceCard(e));

  // Education
  const eduContainer = document.getElementById('education-list');
  eduContainer.innerHTML = '';
  (resumeData.education || []).forEach(e => addEducationCard(e));

  // Skills
  const s = resumeData.skills || {};
  setVal('skills-technical', (s.technical||[]).join(', '));
  setVal('skills-soft', (s.soft||[]).join(', '));
  setVal('skills-tools', (s.tools||[]).join(', '));
  setVal('skills-languages', (s.languages||[]).join(', '));

  // Projects
  const projContainer = document.getElementById('projects-list');
  projContainer.innerHTML = '';
  (resumeData.projects || []).forEach(p => addProjectCard(p));

  // Certifications
  const certContainer = document.getElementById('certifications-list');
  certContainer.innerHTML = '';
  (resumeData.certifications || []).forEach(c => addCertCard(c));
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

// ─── COLLECT FORM DATA ────────────────────────────────────────────────────
function collectFormData() {
  resumeData = resumeData || getDefaultData();
  resumeData.personal = {
    fullName: getVal('full-name'),
    title: getVal('prof-title'),
    email: getVal('email'),
    phone: getVal('phone'),
    location: getVal('location'),
    linkedin: getVal('linkedin'),
    portfolio: getVal('portfolio'),
    summary: getVal('summary')
  };

  // Experience
  resumeData.experience = [];
  document.querySelectorAll('.exp-card').forEach(card => {
    const bullets = [];
    card.querySelectorAll('.bullet-input').forEach(bi => { if (bi.value.trim()) bullets.push(bi.value.trim()); });
    resumeData.experience.push({
      id: card.dataset.id || uid(),
      company: card.querySelector('.exp-company')?.value || '',
      position: card.querySelector('.exp-position')?.value || '',
      startDate: card.querySelector('.exp-start')?.value || '',
      endDate: card.querySelector('.exp-end')?.value || '',
      current: card.querySelector('.exp-current')?.checked || false,
      bullets
    });
  });

  // Education
  resumeData.education = [];
  document.querySelectorAll('.edu-card').forEach(card => {
    resumeData.education.push({
      id: card.dataset.id || uid(),
      school: card.querySelector('.edu-school')?.value || '',
      degree: card.querySelector('.edu-degree')?.value || '',
      field: card.querySelector('.edu-field')?.value || '',
      startDate: card.querySelector('.edu-start')?.value || '',
      endDate: card.querySelector('.edu-end')?.value || '',
      honors: card.querySelector('.edu-honors')?.value || ''
    });
  });

  // Skills
  resumeData.skills = {
    technical: splitSkills(getVal('skills-technical')),
    soft: splitSkills(getVal('skills-soft')),
    tools: splitSkills(getVal('skills-tools')),
    languages: splitSkills(getVal('skills-languages'))
  };

  // Projects
  resumeData.projects = [];
  document.querySelectorAll('.proj-card').forEach(card => {
    resumeData.projects.push({
      id: card.dataset.id || uid(),
      name: card.querySelector('.proj-name')?.value || '',
      description: card.querySelector('.proj-desc')?.value || '',
      technologies: card.querySelector('.proj-tech')?.value || '',
      link: card.querySelector('.proj-link')?.value || ''
    });
  });

  // Certifications
  resumeData.certifications = [];
  document.querySelectorAll('.cert-card').forEach(card => {
    resumeData.certifications.push({
      id: card.dataset.id || uid(),
      name: card.querySelector('.cert-name')?.value || '',
      issuer: card.querySelector('.cert-issuer')?.value || '',
      year: card.querySelector('.cert-year')?.value || ''
    });
  });
}

function getVal(id) { return document.getElementById(id)?.value?.trim() || ''; }
function splitSkills(str) { return str.split(',').map(s => s.trim()).filter(Boolean); }

// ─── FORM LISTENERS ───────────────────────────────────────────────────────
function setupFormListeners() {
  document.querySelectorAll('#section-personal input, #section-personal textarea').forEach(el => {
    el.addEventListener('input', scheduleAutoSave);
  });
  document.querySelectorAll('#section-skills input').forEach(el => {
    el.addEventListener('input', scheduleAutoSave);
  });

  // Add buttons
  document.getElementById('btn-add-exp')?.addEventListener('click', () => { addExperienceCard(); scheduleAutoSave(); });
  document.getElementById('btn-add-edu')?.addEventListener('click', () => { addEducationCard(); scheduleAutoSave(); });
  document.getElementById('btn-add-proj')?.addEventListener('click', () => { addProjectCard(); scheduleAutoSave(); });
  document.getElementById('btn-add-cert')?.addEventListener('click', () => { addCertCard(); scheduleAutoSave(); });

  document.getElementById('resume-title-input')?.addEventListener('input', scheduleAutoSave);
}

// ─── EXPERIENCE CARD ──────────────────────────────────────────────────────
function addExperienceCard(data = {}) {
  const id = data.id || uid();
  const container = document.getElementById('experience-list');
  const card = document.createElement('div');
  card.className = 'exp-card form-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="card-drag-header">
      <span class="drag-icon">⠿</span>
      <span class="card-label">${data.company || 'New Experience'}</span>
      <button class="card-remove" title="Remove">✕</button>
    </div>
    <div class="card-fields">
      <div class="field-row">
        <div class="field-group"><label>Company</label><input class="exp-company" value="${esc(data.company)}" placeholder="Company name"></div>
        <div class="field-group"><label>Position</label><input class="exp-position" value="${esc(data.position)}" placeholder="Job title"></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Start Date</label><input class="exp-start" value="${esc(data.startDate)}" placeholder="Jan 2022"></div>
        <div class="field-group"><label>End Date</label><input class="exp-end" value="${esc(data.endDate)}" placeholder="Dec 2023" ${data.current?'disabled':''}></div>
        <label class="checkbox-label"><input type="checkbox" class="exp-current" ${data.current?'checked':''}> Current</label>
      </div>
      <div class="field-group">
        <label>Responsibilities / Achievements</label>
        <div class="bullets-list">
          ${(data.bullets||['']).map(b => bulletInput(b)).join('')}
        </div>
        <button class="btn-add-bullet">+ Add Bullet</button>
      </div>
    </div>`;

  container.appendChild(card);
  bindCardEvents(card, 'exp-company', 'card-label');

  card.querySelector('.btn-add-bullet').addEventListener('click', () => {
    card.querySelector('.bullets-list').insertAdjacentHTML('beforeend', bulletInput(''));
    bindBulletRemove(card);
    scheduleAutoSave();
  });

  card.querySelector('.exp-current').addEventListener('change', (e) => {
    card.querySelector('.exp-end').disabled = e.target.checked;
    scheduleAutoSave();
  });

  bindBulletRemove(card);
}

function bulletInput(val = '') {
  return `<div class="bullet-row"><span class="bullet-dot">•</span><input class="bullet-input" value="${esc(val)}" placeholder="Describe your achievement…"><button class="remove-bullet" title="Remove">✕</button></div>`;
}

function bindBulletRemove(card) {
  card.querySelectorAll('.remove-bullet').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.bullet-row');
      if (card.querySelectorAll('.bullet-row').length > 1) { row.remove(); scheduleAutoSave(); }
    };
  });
  card.querySelectorAll('.bullet-input').forEach(inp => {
    inp.addEventListener('input', scheduleAutoSave);
  });
}

// ─── EDUCATION CARD ───────────────────────────────────────────────────────
function addEducationCard(data = {}) {
  const id = data.id || uid();
  const container = document.getElementById('education-list');
  const card = document.createElement('div');
  card.className = 'edu-card form-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="card-drag-header">
      <span class="drag-icon">⠿</span>
      <span class="card-label">${data.school || 'New Education'}</span>
      <button class="card-remove" title="Remove">✕</button>
    </div>
    <div class="card-fields">
      <div class="field-row">
        <div class="field-group"><label>School / University</label><input class="edu-school" value="${esc(data.school)}" placeholder="University name"></div>
        <div class="field-group"><label>Degree</label><input class="edu-degree" value="${esc(data.degree)}" placeholder="Bachelor's"></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Field of Study</label><input class="edu-field" value="${esc(data.field)}" placeholder="Computer Science"></div>
        <div class="field-group"><label>Honors / GPA</label><input class="edu-honors" value="${esc(data.honors)}" placeholder="Cum Laude, 3.8 GPA"></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Start Date</label><input class="edu-start" value="${esc(data.startDate)}" placeholder="Sep 2018"></div>
        <div class="field-group"><label>End Date</label><input class="edu-end" value="${esc(data.endDate)}" placeholder="May 2022"></div>
      </div>
    </div>`;
  container.appendChild(card);
  bindCardEvents(card, 'edu-school', 'card-label');
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────
function addProjectCard(data = {}) {
  const id = data.id || uid();
  const container = document.getElementById('projects-list');
  const card = document.createElement('div');
  card.className = 'proj-card form-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="card-drag-header">
      <span class="drag-icon">⠿</span>
      <span class="card-label">${data.name || 'New Project'}</span>
      <button class="card-remove" title="Remove">✕</button>
    </div>
    <div class="card-fields">
      <div class="field-row">
        <div class="field-group"><label>Project Name</label><input class="proj-name" value="${esc(data.name)}" placeholder="Project name"></div>
        <div class="field-group"><label>Link / URL</label><input class="proj-link" value="${esc(data.link)}" placeholder="https://github.com/..."></div>
      </div>
      <div class="field-group"><label>Technologies Used</label><input class="proj-tech" value="${esc(data.technologies)}" placeholder="React, Node.js, PostgreSQL"></div>
      <div class="field-group"><label>Description</label><textarea class="proj-desc" rows="3" placeholder="Briefly describe the project and your role…">${esc(data.description)}</textarea></div>
    </div>`;
  container.appendChild(card);
  bindCardEvents(card, 'proj-name', 'card-label');
}

// ─── CERT CARD ────────────────────────────────────────────────────────────
function addCertCard(data = {}) {
  const id = data.id || uid();
  const container = document.getElementById('certifications-list');
  const card = document.createElement('div');
  card.className = 'cert-card form-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="card-drag-header">
      <span class="drag-icon">⠿</span>
      <span class="card-label">${data.name || 'New Certification'}</span>
      <button class="card-remove" title="Remove">✕</button>
    </div>
    <div class="card-fields">
      <div class="field-row">
        <div class="field-group"><label>Certification Name</label><input class="cert-name" value="${esc(data.name)}" placeholder="AWS Certified Developer"></div>
        <div class="field-group"><label>Issuing Organization</label><input class="cert-issuer" value="${esc(data.issuer)}" placeholder="Amazon Web Services"></div>
        <div class="field-group field-sm"><label>Year</label><input class="cert-year" value="${esc(data.year)}" placeholder="2024" style="max-width:100px"></div>
      </div>
    </div>`;
  container.appendChild(card);
  bindCardEvents(card, 'cert-name', 'card-label');
}

function bindCardEvents(card, inputClass, labelClass) {
  card.querySelector('.card-remove').addEventListener('click', () => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => { card.remove(); scheduleAutoSave(); }, 200);
  });
  card.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      if (el.classList.contains(inputClass)) {
        card.querySelector('.' + labelClass).textContent = el.value || 'Entry';
      }
      scheduleAutoSave();
    });
  });
}

// ─── TEMPLATE PANEL ───────────────────────────────────────────────────────
var SAMPLE_DATA_BUILDER = {
  personal: { fullName: 'Alex Morgan', title: 'Senior Product Designer', email: 'alex@email.com', phone: '+1 (415) 555-0192', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexmorgan', portfolio: 'alexmorgan.design', summary: 'Creative product designer with 8+ years building user-centered digital experiences. Led design systems adopted by 200+ engineers.' },
  experience: [{ company: 'Stripe', position: 'Senior Product Designer', startDate: 'Mar 2021', endDate: '', current: true, bullets: ['Led redesign of checkout flow, improving conversion by 34%', 'Built design system used across 12 product teams'] }, { company: 'Airbnb', position: 'Product Designer', startDate: 'Jun 2018', endDate: 'Feb 2021', current: false, bullets: ['Designed host onboarding, reducing drop-off by 28%'] }],
  education: [{ school: 'Carnegie Mellon University', degree: "Bachelor's", field: 'HCI', startDate: 'Sep 2013', endDate: 'May 2017', honors: 'Cum Laude' }],
  skills: { technical: ['Figma', 'Prototyping', 'User Research', 'Wireframing'], tools: ['Jira', 'Zeplin', 'HTML/CSS', 'Notion'], soft: ['Leadership', 'Communication'], languages: ['English (Native)', 'French (Conversational)'] },
  projects: [{ name: 'DesignOS', description: 'Open-source design token system', technologies: 'Figma, Storybook, CSS', link: 'github.com/alexmorgan/designos' }],
  certifications: [{ name: 'Google UX Design Certificate', issuer: 'Google', year: '2022' }]
};

// Called by hardcoded thumbnail onclick handlers
function selectTemplate(key, el) {
  currentTemplate = key;
  // Update active state
  document.querySelectorAll('.btpl-card').forEach(function(c) {
    c.classList.toggle('active', c.dataset.template === key);
  });
  updatePreview();
  saveResume(true);
}

function setupTemplatePanel() {
  const grid = document.getElementById('template-grid');
  if (!grid) return;

  Object.entries(TEMPLATES).forEach(([key, tpl]) => {
    const div = document.createElement('div');
    div.className = `template-card-sm ${key === currentTemplate ? 'active' : ''}`;
    div.dataset.template = key;

    const previewData = (resumeData && resumeData.personal && resumeData.personal.fullName) ? resumeData : SAMPLE_DATA_BUILDER;
    const previewHtml = renderResume(previewData, key, {});

    div.innerHTML = `
      <div class="tpl-frame-sm">
        <div class="tpl-scaler-sm">${previewHtml}</div>
        <div class="tpl-card-sm-overlay">
          <button class="tpl-sm-select-btn">Use</button>
        </div>
      </div>
      <span class="tpl-sm-name">${tpl.name}</span>`;

    div.querySelector('.tpl-sm-select-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      currentTemplate = key;
      highlightTemplate(key);
      updatePreview();
      saveResume(true);
    });
    div.addEventListener('click', () => {
      currentTemplate = key;
      highlightTemplate(key);
      updatePreview();
      saveResume(true);
    });
    grid.appendChild(div);
  });
}

function highlightTemplate(key) {
  document.querySelectorAll('.btpl-card, .template-card-sm').forEach(t => {
    t.classList.toggle('active', t.dataset.template === key);
  });
}

// ─── CUSTOMIZATION ────────────────────────────────────────────────────────
function setupCustomizationPanel() {
  const colorInput = document.getElementById('accent-color');
  const fontSelect = document.getElementById('font-family');
  const sizeInput = document.getElementById('font-size');

  if (colorInput) {
    colorInput.addEventListener('input', () => {
      customization.accentColor = colorInput.value;
      scheduleAutoSave();
    });
  }
  if (fontSelect) {
    fontSelect.addEventListener('change', () => {
      customization.fontFamily = fontSelect.value;
      scheduleAutoSave();
    });
  }
  if (sizeInput) {
    sizeInput.addEventListener('input', () => {
      customization.fontSize = sizeInput.value + 'px';
      document.getElementById('font-size-label').textContent = sizeInput.value + 'px';
      scheduleAutoSave();
    });
  }
}

// ─── TOOL PANELS ──────────────────────────────────────────────────────────
function setupToolPanels() {
  document.getElementById('panel-ai').innerHTML = renderAIPanel(resumeData);
  bindAIPanel();

  const jobDesc = document.getElementById('job-description');
  if (jobDesc) {
    jobDesc.addEventListener('input', debounce(updateKeywordPanel, 600));
  }
}

function updateATSPanel() {
  collectFormData();
  const panel = document.getElementById('panel-ats');
  if (panel) panel.innerHTML = renderATSPanel(resumeData);
}

function updateKeywordPanel() {
  collectFormData();
  const jobDesc = document.getElementById('job-description')?.value || '';
  const results = document.getElementById('keyword-results');
  if (results) results.innerHTML = renderKeywordPanel(jobDesc, resumeData);
}

// ─── EXPORT BUTTONS ───────────────────────────────────────────────────────
function setupExportButtons() {
  document.getElementById('btn-export-pdf')?.addEventListener('click', exportPDF);
  document.getElementById('btn-print')?.addEventListener('click', printResume);
  document.getElementById('btn-export-txt')?.addEventListener('click', () => { collectFormData(); exportPlainText(resumeData); });
  document.getElementById('btn-publish')?.addEventListener('click', publishResume);
}

async function publishResume() {
  const btn = document.getElementById('btn-publish');
  btn.disabled = true; btn.textContent = '⏳ Publishing…';
  await saveResume(true);

  const { data: resume } = await db.from('resumes').select('is_public, public_slug').eq('id', resumeId).single();
  const slug = resume.public_slug || Math.random().toString(36).slice(2,10);
  const newPublic = !resume.is_public;

  await db.from('resumes').update({ is_public: newPublic, public_slug: slug }).eq('id', resumeId);

  btn.disabled = false;
  if (newPublic) {
    const url = `${window.location.origin}${window.location.pathname.replace('builder.html','resume.html')}?slug=${slug}`;
    btn.textContent = '🌐 Published!';
    showPublishLink(url);
  } else {
    btn.textContent = '🔗 Publish Online';
  }
}

function showPublishLink(url) {
  let modal = document.getElementById('publish-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'publish-modal';
    modal.className = 'publish-modal';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="publish-modal-inner">
      <h3>🎉 Resume Published!</h3>
      <p>Share this link with recruiters:</p>
      <div class="publish-link-row">
        <input type="text" value="${url}" readonly id="publish-url">
        <button onclick="navigator.clipboard.writeText('${url}');this.textContent='✓ Copied!'">Copy</button>
      </div>
      <a href="${url}" target="_blank" class="btn-primary">View Resume →</a>
      <button class="close-modal" onclick="this.closest('#publish-modal').remove()">Close</button>
    </div>`;
}

// ─── PREVIEW ──────────────────────────────────────────────────────────────
function updatePreview() {
  collectFormData();
  const preview = document.getElementById('resume-preview');
  if (!preview) return;
  preview.innerHTML = renderResume(resumeData, currentTemplate, customization);
  // Refit scale after content may have changed height
  if (typeof fitPreview === 'function') setTimeout(fitPreview, 50);
}

// ─── UTILS ────────────────────────────────────────────────────────────────
function esc(str) {
  return (str || '').toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
