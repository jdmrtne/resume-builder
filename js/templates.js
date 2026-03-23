// ─── RESUME TEMPLATE RENDERER ──────────────────────────────────────────────

const TEMPLATES = {
  classic: {
    name: 'Classic ATS',
    description: 'Traditional, recruiter-approved layout'
  },
  modern: {
    name: 'Modern Minimal',
    description: 'Clean lines, contemporary feel'
  },
  corporate: {
    name: 'Corporate',
    description: 'Professional navy header, structured'
  },
  creative: {
    name: 'Creative',
    description: 'Bold sidebar, vibrant accent'
  },
  graduate: {
    name: 'Graduate',
    description: 'Academic clean style'
  },
  executive: {
    name: 'Executive',
    description: 'Sophisticated serif elegance'
  },
  tech: {
    name: 'Tech Developer',
    description: 'Dark header, code-inspired'
  },
  marketing: {
    name: 'Marketing Pro',
    description: 'Bold typography, colorful accents'
  },
  designer: {
    name: 'Designer Portfolio',
    description: 'Visual, grid-based layout'
  },
  compact: {
    name: 'Compact One-Page',
    description: 'Dense, maximizes every inch'
  }
};

function renderResume(data, template, customization = {}) {
  if (!data) return '<div class="no-data">Fill in your resume details to see preview</div>';
  const fn = window[`renderTemplate_${template}`] || renderTemplate_classic;
  return fn(data, customization);
}

function buildContactLine(p, sep = ' · ') {
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(sep);
}

function renderSkillTags(arr, cls = '') {
  if (!arr || !arr.length) return '';
  return arr.map(s => `<span class="skill-tag ${cls}">${s}</span>`).join('');
}

function renderBullets(bullets = []) {
  return bullets.filter(Boolean).map(b => `<li>${b}</li>`).join('');
}

// ─── 1. CLASSIC ATS ───────────────────────────────────────────────────────
function renderTemplate_classic(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#1a1a2e';
  const font = c.fontFamily || 'Georgia, serif';
  return `<div class="resume-doc" style="font-family:${font}">
  <style>
    .tpl-classic { --acc: ${accent}; }
    .tpl-classic h1 { color: var(--acc); }
    .tpl-classic .section-title { border-bottom: 2px solid var(--acc); color: var(--acc); }
  </style>
  <div class="tpl-classic">
    <div class="cls-header">
      <h1>${p.fullName || 'Your Name'}</h1>
      ${p.title ? `<p class="cls-title">${p.title}</p>` : ''}
      <p class="cls-contact">${buildContactLine(p)}</p>
    </div>
    ${p.summary ? `<div class="cls-section"><div class="section-title">Professional Summary</div><p class="cls-summary">${p.summary}</p></div>` : ''}
    ${renderExp_classic(d.experience)}
    ${renderEdu_classic(d.education)}
    ${renderSkills_classic(d.skills)}
    ${renderProjects_classic(d.projects)}
    ${renderCerts_classic(d.certifications)}
  </div></div>`;
}
function renderExp_classic(exp = []) {
  if (!exp.length) return '';
  return `<div class="cls-section"><div class="section-title">Work Experience</div>${exp.map(e => `
    <div class="cls-entry">
      <div class="cls-entry-head">
        <strong>${e.position || ''}</strong> — ${e.company || ''}
        <span class="cls-date">${e.startDate || ''} – ${e.current ? 'Present' : (e.endDate || '')}</span>
      </div>
      <ul>${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderEdu_classic(edu = []) {
  if (!edu.length) return '';
  return `<div class="cls-section"><div class="section-title">Education</div>${edu.map(e => `
    <div class="cls-entry">
      <div class="cls-entry-head">
        <strong>${e.degree || ''} in ${e.field || ''}</strong> — ${e.school || ''}
        <span class="cls-date">${e.startDate || ''} – ${e.endDate || ''}</span>
      </div>
      ${e.honors ? `<p class="cls-honors">${e.honors}</p>` : ''}
    </div>`).join('')}</div>`;
}
function renderSkills_classic(s = {}) {
  const all = [...(s.technical||[]),...(s.soft||[]),...(s.tools||[]),...(s.languages||[])];
  if (!all.length) return '';
  return `<div class="cls-section"><div class="section-title">Skills</div><p class="cls-skills">${all.join(' · ')}</p></div>`;
}
function renderProjects_classic(projects = []) {
  if (!projects.length) return '';
  return `<div class="cls-section"><div class="section-title">Projects</div>${projects.map(pr => `
    <div class="cls-entry">
      <div class="cls-entry-head"><strong>${pr.name || ''}</strong>${pr.link ? ` <a href="${pr.link}" class="proj-link">${pr.link}</a>` : ''}</div>
      ${pr.description ? `<p>${pr.description}</p>` : ''}
      ${pr.technologies ? `<p class="cls-tech">Technologies: ${pr.technologies}</p>` : ''}
    </div>`).join('')}</div>`;
}
function renderCerts_classic(certs = []) {
  if (!certs.length) return '';
  return `<div class="cls-section"><div class="section-title">Certifications</div>${certs.map(c => `
    <div class="cls-entry-inline"><strong>${c.name || ''}</strong> — ${c.issuer || ''} <span class="cls-date">${c.year || ''}</span></div>`).join('')}</div>`;
}

// ─── 2. MODERN MINIMAL ────────────────────────────────────────────────────
function renderTemplate_modern(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#3b7cf4';
  const font = c.fontFamily || "'Helvetica Neue', Arial, sans-serif";
  return `<div class="resume-doc tpl-modern" style="font-family:${font};--acc:${accent}">
    <div class="mod-top">
      <div class="mod-name-block">
        <h1>${p.fullName || 'Your Name'}</h1>
        ${p.title ? `<p class="mod-title">${p.title}</p>` : ''}
      </div>
      <div class="mod-contact-block">
        ${p.email ? `<div>✉ ${p.email}</div>` : ''}
        ${p.phone ? `<div>📞 ${p.phone}</div>` : ''}
        ${p.location ? `<div>📍 ${p.location}</div>` : ''}
        ${p.linkedin ? `<div>🔗 ${p.linkedin}</div>` : ''}
        ${p.portfolio ? `<div>🌐 ${p.portfolio}</div>` : ''}
      </div>
    </div>
    ${p.summary ? `<div class="mod-summary"><p>${p.summary}</p></div>` : ''}
    ${renderExp_modern(d.experience)}
    ${renderEdu_modern(d.education)}
    ${renderSkills_modern(d.skills)}
    ${renderProjects_modern(d.projects)}
    ${renderCerts_modern(d.certifications)}
  </div>`;
}
function renderExp_modern(exp = []) {
  if (!exp.length) return '';
  return `<div class="mod-section"><h2>Experience</h2>${exp.map(e => `
    <div class="mod-entry">
      <div class="mod-entry-row">
        <div><span class="mod-role">${e.position||''}</span> · ${e.company||''}</div>
        <span class="mod-date">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      </div>
      <ul class="mod-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderEdu_modern(edu = []) {
  if (!edu.length) return '';
  return `<div class="mod-section"><h2>Education</h2>${edu.map(e => `
    <div class="mod-entry">
      <div class="mod-entry-row">
        <div><span class="mod-role">${e.degree||''} — ${e.field||''}</span> · ${e.school||''}</div>
        <span class="mod-date">${e.startDate||''} – ${e.endDate||''}</span>
      </div>
      ${e.honors ? `<p class="mod-honors">${e.honors}</p>` : ''}
    </div>`).join('')}</div>`;
}
function renderSkills_modern(s = {}) {
  if (!s) return '';
  const sections = [['Technical',s.technical],['Soft Skills',s.soft],['Tools',s.tools],['Languages',s.languages]].filter(([,arr])=>arr&&arr.length);
  if (!sections.length) return '';
  return `<div class="mod-section"><h2>Skills</h2><div class="mod-skills-grid">${sections.map(([label,arr])=>`
    <div class="mod-skill-cat"><span class="mod-skill-label">${label}</span> ${arr.map(s=>`<span class="mod-skill-tag">${s}</span>`).join('')}</div>`).join('')}</div></div>`;
}
function renderProjects_modern(projects = []) {
  if (!projects.length) return '';
  return `<div class="mod-section"><h2>Projects</h2>${projects.map(pr => `
    <div class="mod-entry">
      <div class="mod-entry-row"><span class="mod-role">${pr.name||''}</span>${pr.link?`<a class="mod-link" href="${pr.link}">${pr.link}</a>`:''}</div>
      ${pr.description?`<p>${pr.description}</p>`:''}
      ${pr.technologies?`<p class="mod-tech-stack">Stack: ${pr.technologies}</p>`:''}
    </div>`).join('')}</div>`;
}
function renderCerts_modern(certs = []) {
  if (!certs.length) return '';
  return `<div class="mod-section"><h2>Certifications</h2><div class="mod-certs">${certs.map(c=>`
    <div class="mod-cert-item"><strong>${c.name||''}</strong> · ${c.issuer||''} · ${c.year||''}</div>`).join('')}</div></div>`;
}

// ─── 3. CORPORATE ─────────────────────────────────────────────────────────
function renderTemplate_corporate(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#1e3a5f';
  const font = c.fontFamily || "'Arial", 'sans-serif'";
  return `<div class="resume-doc tpl-corporate" style="--acc:${accent};font-family:${font}">
    <div class="corp-header" style="background:${accent}">
      <div class="corp-name-block">
        <h1>${p.fullName || 'Your Name'}</h1>
        ${p.title ? `<p class="corp-title">${p.title}</p>` : ''}
      </div>
      <div class="corp-contact">
        ${[p.email,p.phone,p.location,p.linkedin,p.portfolio].filter(Boolean).map(v=>`<span>${v}</span>`).join('')}
      </div>
    </div>
    ${p.summary?`<div class="corp-section"><div class="corp-sec-title">Executive Summary</div><p class="corp-summary">${p.summary}</p></div>`:''}
    ${renderExp_corp(d.experience,accent)}
    ${renderEdu_corp(d.education,accent)}
    ${renderSkills_corp(d.skills,accent)}
    ${renderProjects_corp(d.projects,accent)}
    ${renderCerts_corp(d.certifications,accent)}
  </div>`;
}
function renderExp_corp(exp=[],acc='#1e3a5f'){
  if(!exp.length)return'';
  return`<div class="corp-section"><div class="corp-sec-title" style="color:${acc}">Professional Experience</div>${exp.map(e=>`
    <div class="corp-entry">
      <div class="corp-entry-head">
        <div><strong class="corp-pos">${e.position||''}</strong><span class="corp-co"> | ${e.company||''}</span></div>
        <span class="corp-date" style="color:${acc}">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      </div>
      <ul class="corp-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderEdu_corp(edu=[],acc='#1e3a5f'){
  if(!edu.length)return'';
  return`<div class="corp-section"><div class="corp-sec-title" style="color:${acc}">Education</div>${edu.map(e=>`
    <div class="corp-entry">
      <div class="corp-entry-head">
        <div><strong>${e.degree||''} in ${e.field||''}</strong> | ${e.school||''}</div>
        <span class="corp-date" style="color:${acc}">${e.startDate||''} – ${e.endDate||''}</span>
      </div>
    </div>`).join('')}</div>`;
}
function renderSkills_corp(s={},acc='#1e3a5f'){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[])];
  if(!all.length)return'';
  return`<div class="corp-section"><div class="corp-sec-title" style="color:${acc}">Core Competencies</div><div class="corp-skills">${all.map(sk=>`<span class="corp-skill" style="border-color:${acc};color:${acc}">${sk}</span>`).join('')}</div></div>`;
}
function renderProjects_corp(projects=[],acc=''){
  if(!projects.length)return'';
  return`<div class="corp-section"><div class="corp-sec-title" style="color:${acc}">Key Projects</div>${projects.map(pr=>`
    <div class="corp-entry"><strong>${pr.name||''}</strong>${pr.description?` — ${pr.description}`:''}</div>`).join('')}</div>`;
}
function renderCerts_corp(certs=[],acc=''){
  if(!certs.length)return'';
  return`<div class="corp-section"><div class="corp-sec-title" style="color:${acc}">Certifications</div><div class="corp-certs">${certs.map(c=>`<span>${c.name} — ${c.issuer} (${c.year})</span>`).join('')}</div></div>`;
}

// ─── 4. CREATIVE ─────────────────────────────────────────────────────────
function renderTemplate_creative(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#7c3aed';
  const font = c.fontFamily || "'Trebuchet MS', sans-serif";
  const initials = (p.fullName||'').split(' ').map(n=>n[0]||'').slice(0,2).join('').toUpperCase();
  return `<div class="resume-doc tpl-creative" style="--acc:${accent};font-family:${font}">
    <div class="cre-sidebar" style="background:${accent}">
      <div class="cre-avatar">${initials||'?'}</div>
      <h1 class="cre-name">${p.fullName||'Your Name'}</h1>
      ${p.title?`<p class="cre-role">${p.title}</p>`:''}
      <div class="cre-contact">
        ${p.email?`<div>✉<br>${p.email}</div>`:''}
        ${p.phone?`<div>📞<br>${p.phone}</div>`:''}
        ${p.location?`<div>📍<br>${p.location}</div>`:''}
        ${p.linkedin?`<div>🔗<br>${p.linkedin}</div>`:''}
      </div>
      ${renderSkills_creative(d.skills)}
    </div>
    <div class="cre-main">
      ${p.summary?`<div class="cre-section"><h2>About Me</h2><p>${p.summary}</p></div>`:''}
      ${renderExp_creative(d.experience)}
      ${renderEdu_creative(d.education)}
      ${renderProjects_creative(d.projects)}
      ${renderCerts_creative(d.certifications)}
    </div>
  </div>`;
}
function renderSkills_creative(s={}){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[]),...(s.languages||[])];
  if(!all.length)return'';
  return`<div class="cre-skills"><h3>Skills</h3>${all.map(sk=>`<div class="cre-skill-bar"><span>${sk}</span></div>`).join('')}</div>`;
}
function renderExp_creative(exp=[]){
  if(!exp.length)return'';
  return`<div class="cre-section"><h2>Experience</h2>${exp.map(e=>`
    <div class="cre-entry">
      <div class="cre-entry-dot"></div>
      <div class="cre-entry-body">
        <strong>${e.position||''}</strong> at ${e.company||''}<br>
        <span class="cre-date">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
        <ul>${renderBullets(e.bullets)}</ul>
      </div>
    </div>`).join('')}</div>`;
}
function renderEdu_creative(edu=[]){
  if(!edu.length)return'';
  return`<div class="cre-section"><h2>Education</h2>${edu.map(e=>`
    <div class="cre-entry">
      <div class="cre-entry-dot"></div>
      <div class="cre-entry-body">
        <strong>${e.degree||''} in ${e.field||''}</strong><br>${e.school||''}
        <span class="cre-date"> · ${e.startDate||''} – ${e.endDate||''}</span>
      </div>
    </div>`).join('')}</div>`;
}
function renderProjects_creative(projects=[]){
  if(!projects.length)return'';
  return`<div class="cre-section"><h2>Projects</h2>${projects.map(pr=>`
    <div class="cre-project">
      <strong>${pr.name||''}</strong>
      ${pr.description?`<p>${pr.description}</p>`:''}
      ${pr.technologies?`<p class="cre-tech">${pr.technologies}</p>`:''}
    </div>`).join('')}</div>`;
}
function renderCerts_creative(certs=[]){
  if(!certs.length)return'';
  return`<div class="cre-section"><h2>Certifications</h2>${certs.map(c=>`<p>🏅 ${c.name||''} — ${c.issuer||''} ${c.year?`(${c.year})`:''}</p>`).join('')}</div>`;
}

// ─── 5. GRADUATE ─────────────────────────────────────────────────────────
function renderTemplate_graduate(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#047857';
  const font = c.fontFamily || "'Palatino Linotype', serif";
  return `<div class="resume-doc tpl-graduate" style="--acc:${accent};font-family:${font}">
    <div class="grad-header">
      <h1>${p.fullName||'Your Name'}</h1>
      ${p.title?`<p class="grad-title">${p.title}</p>`:''}
      <div class="grad-contact">${buildContactLine(p,' | ')}</div>
      <div class="grad-line" style="background:${accent}"></div>
    </div>
    ${renderEdu_grad(d.education,accent)}
    ${p.summary?`<div class="grad-section"><h2 style="color:${accent}">Objective</h2><p>${p.summary}</p></div>`:''}
    ${renderExp_grad(d.experience,accent)}
    ${renderSkills_grad(d.skills,accent)}
    ${renderProjects_grad(d.projects,accent)}
    ${renderCerts_grad(d.certifications,accent)}
  </div>`;
}
function renderEdu_grad(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="grad-section"><h2 style="color:${acc}">Education</h2>${edu.map(e=>`
    <div class="grad-entry">
      <div class="grad-row"><strong>${e.degree||''} in ${e.field||''}</strong><span>${e.startDate||''} – ${e.endDate||''}</span></div>
      <div>${e.school||''}${e.honors?` · <em>${e.honors}</em>`:''}</div>
    </div>`).join('')}</div>`;
}
function renderExp_grad(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="grad-section"><h2 style="color:${acc}">Experience</h2>${exp.map(e=>`
    <div class="grad-entry">
      <div class="grad-row"><strong>${e.position||''}</strong> — ${e.company||''}<span>${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span></div>
      <ul>${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderSkills_grad(s={},acc){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[]),...(s.languages||[])];
  if(!all.length)return'';
  return`<div class="grad-section"><h2 style="color:${acc}">Skills & Competencies</h2><p>${all.join(' · ')}</p></div>`;
}
function renderProjects_grad(projects=[],acc){
  if(!projects.length)return'';
  return`<div class="grad-section"><h2 style="color:${acc}">Projects & Research</h2>${projects.map(pr=>`
    <div class="grad-entry"><strong>${pr.name||''}</strong>${pr.technologies?` [${pr.technologies}]`:''}<br>${pr.description||''}</div>`).join('')}</div>`;
}
function renderCerts_grad(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="grad-section"><h2 style="color:${acc}">Certifications & Awards</h2>${certs.map(c=>`<p>${c.name||''} — ${c.issuer||''} (${c.year||''})</p>`).join('')}</div>`;
}

// ─── 6. EXECUTIVE ─────────────────────────────────────────────────────────
function renderTemplate_executive(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#8b0000';
  const font = c.fontFamily || "'Garamond', 'Times New Roman', serif";
  return `<div class="resume-doc tpl-executive" style="--acc:${accent};font-family:${font}">
    <div class="exec-header">
      <h1>${p.fullName||'Your Name'}</h1>
      ${p.title?`<p class="exec-title">${p.title}</p>`:''}
      <div class="exec-rule" style="border-color:${accent}"></div>
      <p class="exec-contact">${buildContactLine(p,' · ')}</p>
    </div>
    ${p.summary?`<div class="exec-section"><h2>Executive Profile</h2><p class="exec-summary">${p.summary}</p></div>`:''}
    ${renderExp_exec(d.experience,accent)}
    ${renderEdu_exec(d.education,accent)}
    ${renderSkills_exec(d.skills,accent)}
    ${renderCerts_exec(d.certifications,accent)}
  </div>`;
}
function renderExp_exec(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="exec-section"><h2 style="color:${acc}">Career History</h2>${exp.map(e=>`
    <div class="exec-entry">
      <div class="exec-entry-head">
        <div><em class="exec-co">${e.company||''}</em> — <strong>${e.position||''}</strong></div>
        <span class="exec-date">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      </div>
      <ul class="exec-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderEdu_exec(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="exec-section"><h2 style="color:${acc}">Education</h2>${edu.map(e=>`
    <div class="exec-entry exec-edu">
      <strong>${e.degree||''} in ${e.field||''}</strong> · ${e.school||''} · ${e.endDate||''}</div>`).join('')}</div>`;
}
function renderSkills_exec(s={},acc){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[])];
  if(!all.length)return'';
  return`<div class="exec-section"><h2 style="color:${acc}">Core Competencies</h2><div class="exec-skills">${all.map(sk=>`<span class="exec-skill">${sk}</span>`).join('')}</div></div>`;
}
function renderCerts_exec(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="exec-section"><h2 style="color:${acc}">Professional Development</h2>${certs.map(c=>`<p class="exec-cert">• ${c.name||''} — ${c.issuer||''} (${c.year||''})</p>`).join('')}</div>`;
}

// ─── 7. TECH DEVELOPER ────────────────────────────────────────────────────
function renderTemplate_tech(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#00d4aa';
  const font = c.fontFamily || "'Courier New', monospace";
  return `<div class="resume-doc tpl-tech" style="--acc:${accent}">
    <div class="tech-header">
      <div class="tech-terminal-bar"><span></span><span></span><span></span></div>
      <div class="tech-name-line"><span class="tech-prompt" style="color:${accent}">❯</span> <h1>${p.fullName||'Your Name'}</h1></div>
      <p class="tech-title" style="color:${accent}">${p.title||'Software Developer'}</p>
      <div class="tech-contact" style="font-family:${font}">
        ${[p.email,p.phone,p.location,p.linkedin,p.portfolio].filter(Boolean).map(v=>`<span>${v}</span>`).join(' · ')}
      </div>
    </div>
    ${p.summary?`<div class="tech-section"><div class="tech-sec-title" style="color:${accent}">// ABOUT</div><p class="tech-summary">${p.summary}</p></div>`:''}
    ${renderSkills_tech(d.skills,accent,font)}
    ${renderExp_tech(d.experience,accent)}
    ${renderProjects_tech(d.projects,accent,font)}
    ${renderEdu_tech(d.education,accent)}
    ${renderCerts_tech(d.certifications,accent)}
  </div>`;
}
function renderSkills_tech(s={},acc,font){
  if(!s)return'';
  const sections=[['Technical',s.technical],['Tools & Platforms',s.tools],['Languages',s.languages],['Soft Skills',s.soft]].filter(([,arr])=>arr&&arr.length);
  if(!sections.length)return'';
  return`<div class="tech-section"><div class="tech-sec-title" style="color:${acc}">// TECH STACK</div>
    <div class="tech-skills-grid">${sections.map(([label,arr])=>`
      <div class="tech-skill-group"><span class="tech-skill-label" style="color:${acc}">${label}:</span>
        <div class="tech-tags">${arr.map(sk=>`<span class="tech-tag" style="border-color:${acc}">${sk}</span>`).join('')}</div>
      </div>`).join('')}</div></div>`;
}
function renderExp_tech(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="tech-section"><div class="tech-sec-title" style="color:${acc}">// EXPERIENCE</div>${exp.map(e=>`
    <div class="tech-entry">
      <div class="tech-entry-head">
        <span class="tech-func" style="color:${acc}">function</span> <strong>${e.position||''}()</strong> <span class="tech-co">@ ${e.company||''}</span>
        <span class="tech-date">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      </div>
      <ul class="tech-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderProjects_tech(projects=[],acc,font){
  if(!projects.length)return'';
  return`<div class="tech-section"><div class="tech-sec-title" style="color:${acc}">// PROJECTS</div>${projects.map(pr=>`
    <div class="tech-entry">
      <div class="tech-proj-head"><strong>${pr.name||''}</strong> ${pr.link?`<a class="tech-link" style="color:${acc}" href="${pr.link}">[${pr.link}]</a>`:''}</div>
      ${pr.technologies?`<p class="tech-stack" style="font-family:${font};color:${acc}">&gt; ${pr.technologies}</p>`:''}
      ${pr.description?`<p>${pr.description}</p>`:''}
    </div>`).join('')}</div>`;
}
function renderEdu_tech(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="tech-section"><div class="tech-sec-title" style="color:${acc}">// EDUCATION</div>${edu.map(e=>`
    <div class="tech-entry-inline"><strong>${e.degree||''} in ${e.field||''}</strong> · ${e.school||''} · ${e.endDate||''}</div>`).join('')}</div>`;
}
function renderCerts_tech(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="tech-section"><div class="tech-sec-title" style="color:${acc}">// CERTIFICATIONS</div>${certs.map(c=>`
    <div class="tech-entry-inline"><span style="color:${acc}">✓</span> ${c.name||''} — ${c.issuer||''} (${c.year||''})</div>`).join('')}</div>`;
}

// ─── 8. MARKETING PRO ────────────────────────────────────────────────────
function renderTemplate_marketing(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#e11d48';
  const font = c.fontFamily || "'Futura', 'Century Gothic', sans-serif";
  return `<div class="resume-doc tpl-marketing" style="--acc:${accent};font-family:${font}">
    <div class="mkt-header" style="border-left:6px solid ${accent}">
      <h1>${p.fullName||'Your Name'}</h1>
      <p class="mkt-title" style="color:${accent}">${p.title||''}</p>
      <div class="mkt-contact">${buildContactLine(p,' · ')}</div>
    </div>
    ${p.summary?`<div class="mkt-section"><h2 style="color:${accent}">Brand Statement</h2><p class="mkt-summary">${p.summary}</p></div>`:''}
    ${renderExp_mkt(d.experience,accent)}
    ${renderSkills_mkt(d.skills,accent)}
    ${renderEdu_mkt(d.education,accent)}
    ${renderProjects_mkt(d.projects,accent)}
    ${renderCerts_mkt(d.certifications,accent)}
  </div>`;
}
function renderExp_mkt(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="mkt-section"><h2 style="color:${acc}">Professional Experience</h2>${exp.map(e=>`
    <div class="mkt-entry">
      <div class="mkt-entry-head">
        <div><strong>${e.position||''}</strong> · ${e.company||''}</div>
        <span class="mkt-date" style="color:${acc}">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      </div>
      <ul class="mkt-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderSkills_mkt(s={},acc){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[]),...(s.languages||[])];
  if(!all.length)return'';
  return`<div class="mkt-section"><h2 style="color:${acc}">Core Skills</h2><div class="mkt-skills">${all.map(sk=>`<span class="mkt-skill" style="background:${acc}">${sk}</span>`).join('')}</div></div>`;
}
function renderEdu_mkt(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="mkt-section"><h2 style="color:${acc}">Education</h2>${edu.map(e=>`
    <div class="mkt-entry-inline"><strong>${e.degree||''}</strong> in ${e.field||''} · ${e.school||''} · ${e.endDate||''}</div>`).join('')}</div>`;
}
function renderProjects_mkt(projects=[],acc){
  if(!projects.length)return'';
  return`<div class="mkt-section"><h2 style="color:${acc}">Campaigns & Projects</h2>${projects.map(pr=>`
    <div class="mkt-entry"><strong>${pr.name||''}</strong>${pr.description?` — ${pr.description}`:''}</div>`).join('')}</div>`;
}
function renderCerts_mkt(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="mkt-section"><h2 style="color:${acc}">Certifications</h2>${certs.map(c=>`<p>🏅 ${c.name||''} · ${c.issuer||''} · ${c.year||''}</p>`).join('')}</div>`;
}

// ─── 9. DESIGNER PORTFOLIO ────────────────────────────────────────────────
function renderTemplate_designer(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#f97316';
  const font = c.fontFamily || "'Gill Sans', 'Optima', sans-serif";
  const initials = (p.fullName||'').split(' ').map(n=>n[0]||'').slice(0,2).join('').toUpperCase();
  return `<div class="resume-doc tpl-designer" style="--acc:${accent};font-family:${font}">
    <div class="des-header">
      <div class="des-avatar" style="background:${accent}">${initials||'?'}</div>
      <div class="des-name-block">
        <h1>${p.fullName||'Your Name'}</h1>
        ${p.title?`<p class="des-title">${p.title}</p>`:''}
        <div class="des-contact">${buildContactLine(p,' · ')}</div>
      </div>
    </div>
    <div class="des-body">
      <div class="des-left">
        ${p.summary?`<div class="des-section"><h2>Profile</h2><p>${p.summary}</p></div>`:''}
        ${renderSkills_des(d.skills,accent)}
        ${renderCerts_des(d.certifications,accent)}
      </div>
      <div class="des-right">
        ${renderExp_des(d.experience,accent)}
        ${renderProjects_des(d.projects,accent)}
        ${renderEdu_des(d.education,accent)}
      </div>
    </div>
  </div>`;
}
function renderSkills_des(s={},acc){
  if(!s)return'';
  const sections=[['Design Tools',s.tools],['Technical',s.technical],['Soft Skills',s.soft],['Languages',s.languages]].filter(([,arr])=>arr&&arr.length);
  if(!sections.length)return'';
  return`<div class="des-section">${sections.map(([label,arr])=>`
    <div class="des-skill-cat"><h3>${label}</h3>${arr.map(sk=>`<div class="des-skill-bar"><span class="des-skill-fill" style="background:${acc}"></span><span>${sk}</span></div>`).join('')}</div>`).join('')}</div>`;
}
function renderExp_des(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="des-section"><h2 style="border-left:3px solid ${acc};padding-left:8px">Experience</h2>${exp.map(e=>`
    <div class="des-entry">
      <strong>${e.position||''}</strong> · ${e.company||''}
      <span class="des-date" style="color:${acc}">${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span>
      <ul>${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderProjects_des(projects=[],acc){
  if(!projects.length)return'';
  return`<div class="des-section"><h2 style="border-left:3px solid ${acc};padding-left:8px">Portfolio</h2>${projects.map(pr=>`
    <div class="des-project" style="border-left:2px solid ${acc}">
      <strong>${pr.name||''}</strong>${pr.link?` · <a href="${pr.link}" style="color:${acc}">${pr.link}</a>`:''}
      ${pr.description?`<p>${pr.description}</p>`:''}
      ${pr.technologies?`<p class="des-tech">${pr.technologies}</p>`:''}
    </div>`).join('')}</div>`;
}
function renderEdu_des(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="des-section"><h2 style="border-left:3px solid ${acc};padding-left:8px">Education</h2>${edu.map(e=>`
    <div class="des-entry"><strong>${e.degree||''}</strong> · ${e.school||''} · ${e.endDate||''}</div>`).join('')}</div>`;
}
function renderCerts_des(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="des-section"><h2>Certifications</h2>${certs.map(c=>`<p>🏅 ${c.name||''}</p>`).join('')}</div>`;
}

// ─── 10. COMPACT ONE-PAGE ─────────────────────────────────────────────────
function renderTemplate_compact(d, c = {}) {
  const p = d.personal || {};
  const accent = c.accentColor || '#0f766e';
  const font = c.fontFamily || "'Calibri', 'Candara', sans-serif";
  return `<div class="resume-doc tpl-compact" style="--acc:${accent};font-family:${font};font-size:0.82em">
    <div class="cmp-header">
      <div><h1>${p.fullName||'Your Name'}</h1><span class="cmp-title" style="color:${accent}">${p.title||''}</span></div>
      <div class="cmp-contact">${[p.email,p.phone,p.location,p.linkedin,p.portfolio].filter(Boolean).map(v=>`<span>${v}</span>`).join(' | ')}</div>
    </div>
    ${p.summary?`<div class="cmp-section"><span class="cmp-label" style="color:${accent}">SUMMARY</span><p>${p.summary}</p></div>`:''}
    ${renderExp_compact(d.experience,accent)}
    ${renderSkills_compact(d.skills,accent)}
    ${renderEdu_compact(d.education,accent)}
    ${renderProjects_compact(d.projects,accent)}
    ${renderCerts_compact(d.certifications,accent)}
  </div>`;
}
function renderExp_compact(exp=[],acc){
  if(!exp.length)return'';
  return`<div class="cmp-section"><span class="cmp-label" style="color:${acc}">EXPERIENCE</span>${exp.map(e=>`
    <div class="cmp-entry">
      <div class="cmp-row"><strong>${e.position||''}</strong>, ${e.company||''}<span>${e.startDate||''} – ${e.current?'Present':(e.endDate||'')}</span></div>
      <ul class="cmp-bullets">${renderBullets(e.bullets)}</ul>
    </div>`).join('')}</div>`;
}
function renderSkills_compact(s={},acc){
  const all=[...(s.technical||[]),...(s.soft||[]),...(s.tools||[]),...(s.languages||[])];
  if(!all.length)return'';
  return`<div class="cmp-section"><span class="cmp-label" style="color:${acc}">SKILLS</span><p>${all.join(' · ')}</p></div>`;
}
function renderEdu_compact(edu=[],acc){
  if(!edu.length)return'';
  return`<div class="cmp-section"><span class="cmp-label" style="color:${acc}">EDUCATION</span>${edu.map(e=>`
    <div class="cmp-row"><strong>${e.degree||''} in ${e.field||''}</strong> · ${e.school||''}<span>${e.endDate||''}</span></div>`).join('')}</div>`;
}
function renderProjects_compact(projects=[],acc){
  if(!projects.length)return'';
  return`<div class="cmp-section"><span class="cmp-label" style="color:${acc}">PROJECTS</span>${projects.map(pr=>`
    <div class="cmp-entry"><strong>${pr.name||''}</strong>${pr.technologies?` [${pr.technologies}]`:''} — ${pr.description||''}</div>`).join('')}</div>`;
}
function renderCerts_compact(certs=[],acc){
  if(!certs.length)return'';
  return`<div class="cmp-section"><span class="cmp-label" style="color:${acc}">CERTIFICATIONS</span><p>${certs.map(c=>`${c.name} (${c.issuer}, ${c.year})`).join(' · ')}</p></div>`;
}
