// ─── RESUME TEMPLATE RENDERER ──────────────────────────────────────────────
// Templates inspired by 2025/2026 best practices:
// - Clean single-column ATS-safe layouts
// - Subtle color headers & dividers
// - Bold name + role headers
// - Timeline structures, sidebar variants
// - Smart white space, readable fonts

const TEMPLATES = {
  classic:    { name: 'Classic ATS',       description: 'Single-column, max ATS score' },
  modern:     { name: 'Modern Bold',        description: 'Bold name, clean dividers' },
  corporate:  { name: 'Corporate Blue',     description: 'Navy header, structured' },
  creative:   { name: 'Creative Sidebar',   description: 'Two-column with colored sidebar' },
  swiss:      { name: 'Swiss Minimal',      description: 'Google-style subtle accent' },
  executive:  { name: 'Executive',          description: 'Serif elegance, timeline feel' },
  tech:       { name: 'Tech Developer',     description: 'Dark header, code-inspired' },
  timeline:   { name: 'Timeline',           description: 'Vertical timeline structure' },
  twoColumn:  { name: 'Two-Column Pro',     description: 'Skills sidebar, bold headers' },
  compact:    { name: 'Compact One-Page',   description: 'Dense, maximizes every inch' }
};

function renderResume(data, template, customization = {}) {
  if (!data) return '<div class="no-data">Fill in your resume details to see preview</div>';
  const fn = window['renderTemplate_' + template] || renderTemplate_classic;
  return fn(data, customization);
}

function buildContactLine(p, sep) {
  sep = sep || ' · ';
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(sep);
}

function renderBullets(bullets) {
  bullets = bullets || [];
  return bullets.filter(Boolean).map(function(b) { return '<li>' + b + '</li>'; }).join('');
}

// ─── 1. CLASSIC ATS ──────────────────────────────────────────────────────
function renderTemplate_classic(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#1a365d';
  var font = c.fontFamily || 'Georgia, serif';
  return '<div class="resume-doc tpl-classic" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="cls-header">' +
      '<h1>' + (p.fullName || 'Your Name') + '</h1>' +
      (p.title ? '<p class="cls-jobtitle">' + p.title + '</p>' : '') +
      '<p class="cls-contact">' + buildContactLine(p) + '</p>' +
    '</div>' +
    (p.summary ? '<div class="cls-section"><div class="cls-sec-title">Professional Summary</div><p class="cls-summary">' + p.summary + '</p></div>' : '') +
    _cls_exp(d.experience) +
    _cls_edu(d.education) +
    _cls_skills(d.skills) +
    _cls_projects(d.projects) +
    _cls_certs(d.certifications) +
  '</div>';
}
function _cls_exp(exp) {
  if (!exp || !exp.length) return '';
  return '<div class="cls-section"><div class="cls-sec-title">Work Experience</div>' +
    exp.map(function(e) {
      return '<div class="cls-entry">' +
        '<div class="cls-row"><strong>' + (e.position||'') + '</strong><span class="cls-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
        '<div class="cls-company">' + (e.company||'') + '</div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _cls_edu(edu) {
  if (!edu || !edu.length) return '';
  return '<div class="cls-section"><div class="cls-sec-title">Education</div>' +
    edu.map(function(e) {
      return '<div class="cls-entry">' +
        '<div class="cls-row"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong><span class="cls-date">' + (e.endDate||'') + '</span></div>' +
        '<div class="cls-company">' + (e.school||'') + (e.honors ? ' · ' + e.honors : '') + '</div>' +
      '</div>';
    }).join('') + '</div>';
}
function _cls_skills(s) {
  if (!s) return '';
  var all = [].concat(s.technical||[]).concat(s.soft||[]).concat(s.tools||[]).concat(s.languages||[]);
  if (!all.length) return '';
  return '<div class="cls-section"><div class="cls-sec-title">Skills</div><p class="cls-skills-line">' + all.join(' · ') + '</p></div>';
}
function _cls_projects(projects) {
  if (!projects || !projects.length) return '';
  return '<div class="cls-section"><div class="cls-sec-title">Projects</div>' +
    projects.map(function(pr) {
      return '<div class="cls-entry">' +
        '<div class="cls-row"><strong>' + (pr.name||'') + '</strong>' + (pr.link ? '<a class="cls-link" href="' + pr.link + '">' + pr.link + '</a>' : '') + '</div>' +
        (pr.technologies ? '<div class="cls-company">' + pr.technologies + '</div>' : '') +
        (pr.description ? '<p class="cls-proj-desc">' + pr.description + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
}
function _cls_certs(certs) {
  if (!certs || !certs.length) return '';
  return '<div class="cls-section"><div class="cls-sec-title">Certifications</div>' +
    certs.map(function(c) { return '<p class="cls-cert">' + (c.name||'') + ' — ' + (c.issuer||'') + (c.year ? ' (' + c.year + ')' : '') + '</p>'; }).join('') +
  '</div>';
}

// ─── 2. MODERN BOLD ──────────────────────────────────────────────────────
function renderTemplate_modern(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#2563eb';
  var font = c.fontFamily || "'Helvetica Neue', Arial, sans-serif";
  return '<div class="resume-doc tpl-modern" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="mod-header" style="border-top:4px solid ' + acc + '">' +
      '<div class="mod-name-block">' +
        '<h1>' + (p.fullName||'Your Name') + '</h1>' +
        (p.title ? '<p class="mod-title" style="color:' + acc + '">' + p.title + '</p>' : '') +
      '</div>' +
      '<div class="mod-contact">' +
        [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean)
          .map(function(v){ return '<span>' + v + '</span>'; }).join('') +
      '</div>' +
    '</div>' +
    (p.summary ? '<div class="mod-section"><h2 style="color:' + acc + '">Summary</h2><p>' + p.summary + '</p></div>' : '') +
    _mod_exp(d.experience, acc) +
    _mod_edu(d.education, acc) +
    _mod_skills(d.skills, acc) +
    _mod_projects(d.projects, acc) +
    _mod_certs(d.certifications, acc) +
  '</div>';
}
function _mod_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="mod-section"><h2 style="color:' + acc + '">Experience</h2>' +
    exp.map(function(e) {
      return '<div class="mod-entry">' +
        '<div class="mod-row">' +
          '<div><strong class="mod-pos">' + (e.position||'') + '</strong><span class="mod-co"> · ' + (e.company||'') + '</span></div>' +
          '<span class="mod-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span>' +
        '</div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _mod_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="mod-section"><h2 style="color:' + acc + '">Education</h2>' +
    edu.map(function(e) {
      return '<div class="mod-entry">' +
        '<div class="mod-row">' +
          '<div><strong>' + (e.degree||'') + (e.field ? ' – ' + e.field : '') + '</strong><span class="mod-co"> · ' + (e.school||'') + '</span></div>' +
          '<span class="mod-date">' + (e.endDate||'') + '</span>' +
        '</div>' +
        (e.honors ? '<p class="mod-honors">' + e.honors + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
}
function _mod_skills(s, acc) {
  if (!s) return '';
  var cats = [['Technical', s.technical], ['Tools', s.tools], ['Soft Skills', s.soft], ['Languages', s.languages]].filter(function(x){ return x[1] && x[1].length; });
  if (!cats.length) return '';
  return '<div class="mod-section"><h2 style="color:' + acc + '">Skills</h2>' +
    '<div class="mod-skills-grid">' +
    cats.map(function(x) {
      return '<div class="mod-skill-row"><span class="mod-skill-label">' + x[0] + ':</span>' +
        x[1].map(function(sk){ return '<span class="mod-tag" style="border-color:' + acc + ';color:' + acc + '">' + sk + '</span>'; }).join('') +
      '</div>';
    }).join('') + '</div></div>';
}
function _mod_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="mod-section"><h2 style="color:' + acc + '">Projects</h2>' +
    projects.map(function(pr) {
      return '<div class="mod-entry"><div class="mod-row"><strong>' + (pr.name||'') + '</strong>' +
        (pr.link ? '<a class="mod-link" style="color:' + acc + '" href="' + pr.link + '">' + pr.link + '</a>' : '') + '</div>' +
        (pr.technologies ? '<p class="mod-tech">' + pr.technologies + '</p>' : '') +
        (pr.description ? '<p>' + pr.description + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
}
function _mod_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="mod-section"><h2 style="color:' + acc + '">Certifications</h2>' +
    certs.map(function(c){ return '<p class="mod-cert">' + (c.name||'') + ' · ' + (c.issuer||'') + ' · ' + (c.year||'') + '</p>'; }).join('') +
  '</div>';
}

// ─── 3. CORPORATE BLUE ───────────────────────────────────────────────────
function renderTemplate_corporate(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#1e3a5f';
  var font = c.fontFamily || 'Arial, sans-serif';
  return '<div class="resume-doc tpl-corporate" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="corp-header" style="background:' + acc + '">' +
      '<h1>' + (p.fullName||'Your Name') + '</h1>' +
      (p.title ? '<p class="corp-title">' + p.title + '</p>' : '') +
      '<div class="corp-contacts">' +
        [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean)
          .map(function(v){ return '<span>' + v + '</span>'; }).join('') +
      '</div>' +
    '</div>' +
    (p.summary ? '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Executive Summary</div><p>' + p.summary + '</p></div>' : '') +
    _corp_exp(d.experience, acc) +
    _corp_edu(d.education, acc) +
    _corp_skills(d.skills, acc) +
    _corp_projects(d.projects, acc) +
    _corp_certs(d.certifications, acc) +
  '</div>';
}
function _corp_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Professional Experience</div>' +
    exp.map(function(e) {
      return '<div class="corp-entry">' +
        '<div class="corp-row">' +
          '<div><strong>' + (e.position||'') + '</strong><span class="corp-co"> | ' + (e.company||'') + '</span></div>' +
          '<span class="corp-date" style="color:' + acc + '">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span>' +
        '</div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _corp_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Education</div>' +
    edu.map(function(e) {
      return '<div class="corp-row"><div><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong> | ' + (e.school||'') + '</div><span class="corp-date" style="color:' + acc + '">' + (e.endDate||'') + '</span></div>';
    }).join('') + '</div>';
}
function _corp_skills(s, acc) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).soft||[]).concat((s||{}).tools||[]);
  if (!all.length) return '';
  return '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Core Competencies</div>' +
    '<div class="corp-skills">' + all.map(function(sk){ return '<span class="corp-skill" style="border-color:' + acc + ';color:' + acc + '">' + sk + '</span>'; }).join('') + '</div></div>';
}
function _corp_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Key Projects</div>' +
    projects.map(function(pr){ return '<div class="corp-row"><strong>' + (pr.name||'') + '</strong>' + (pr.description ? ' — ' + pr.description : '') + '</div>'; }).join('') + '</div>';
}
function _corp_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="corp-section"><div class="corp-label" style="color:' + acc + '">Certifications</div>' +
    certs.map(function(c){ return '<p class="corp-cert-item">' + (c.name||'') + ' — ' + (c.issuer||'') + ' (' + (c.year||'') + ')</p>'; }).join('') + '</div>';
}

// ─── 4. CREATIVE SIDEBAR ────────────────────────────────────────────────
function renderTemplate_creative(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#7c3aed';
  var font = c.fontFamily || "'Trebuchet MS', sans-serif";
  var initials = (p.fullName||'').split(' ').map(function(n){ return n[0]||''; }).slice(0,2).join('').toUpperCase();
  return '<div class="resume-doc tpl-creative" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="cre-sidebar" style="background:' + acc + '">' +
      '<div class="cre-avatar">' + (initials||'?') + '</div>' +
      '<h1>' + (p.fullName||'Your Name') + '</h1>' +
      (p.title ? '<p class="cre-role">' + p.title + '</p>' : '') +
      '<div class="cre-contact-list">' +
        [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean)
          .map(function(v){ return '<div class="cre-contact-item">' + v + '</div>'; }).join('') +
      '</div>' +
      _cre_sidebar_skills(d.skills) +
      _cre_sidebar_certs(d.certifications) +
    '</div>' +
    '<div class="cre-main">' +
      (p.summary ? '<div class="cre-section"><h2>About Me</h2><p>' + p.summary + '</p></div>' : '') +
      _cre_exp(d.experience) +
      _cre_edu(d.education) +
      _cre_projects(d.projects) +
    '</div>' +
  '</div>';
}
function _cre_sidebar_skills(s) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).tools||[]).concat((s||{}).soft||[]).concat((s||{}).languages||[]);
  if (!all.length) return '';
  return '<div class="cre-sb-section"><h3>Skills</h3>' + all.map(function(sk){ return '<div class="cre-sb-item">' + sk + '</div>'; }).join('') + '</div>';
}
function _cre_sidebar_certs(certs) {
  if (!certs || !certs.length) return '';
  return '<div class="cre-sb-section"><h3>Certifications</h3>' + certs.map(function(c){ return '<div class="cre-sb-item">' + (c.name||'') + '</div>'; }).join('') + '</div>';
}
function _cre_exp(exp) {
  if (!exp || !exp.length) return '';
  return '<div class="cre-section"><h2>Experience</h2>' +
    exp.map(function(e) {
      return '<div class="cre-entry">' +
        '<div class="cre-entry-dot"></div>' +
        '<div class="cre-entry-body">' +
          '<strong>' + (e.position||'') + '</strong> <span class="cre-co">@ ' + (e.company||'') + '</span>' +
          '<span class="cre-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span>' +
          '<ul>' + renderBullets(e.bullets) + '</ul>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
}
function _cre_edu(edu) {
  if (!edu || !edu.length) return '';
  return '<div class="cre-section"><h2>Education</h2>' +
    edu.map(function(e) {
      return '<div class="cre-entry"><div class="cre-entry-dot"></div><div class="cre-entry-body"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong><br>' + (e.school||'') + '<span class="cre-date"> · ' + (e.endDate||'') + '</span></div></div>';
    }).join('') + '</div>';
}
function _cre_projects(projects) {
  if (!projects || !projects.length) return '';
  return '<div class="cre-section"><h2>Projects</h2>' +
    projects.map(function(pr) {
      return '<div class="cre-project"><strong>' + (pr.name||'') + '</strong>' +
        (pr.technologies ? '<span class="cre-tech"> · ' + pr.technologies + '</span>' : '') +
        (pr.description ? '<p>' + pr.description + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
}

// ─── 5. SWISS MINIMAL ────────────────────────────────────────────────────
function renderTemplate_swiss(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#d97706';
  var font = c.fontFamily || "'Helvetica Neue', Helvetica, Arial, sans-serif";
  return '<div class="resume-doc tpl-swiss" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="swi-header">' +
      '<div class="swi-name-col">' +
        '<h1>' + (p.fullName||'Your Name') + '</h1>' +
        (p.title ? '<p class="swi-title">' + p.title + '</p>' : '') +
      '</div>' +
      '<div class="swi-contact-col">' +
        [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean)
          .map(function(v){ return '<div>' + v + '</div>'; }).join('') +
      '</div>' +
    '</div>' +
    '<div class="swi-rule" style="background:' + acc + '"></div>' +
    (p.summary ? '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Profile</div><p>' + p.summary + '</p></div>' : '') +
    _swi_exp(d.experience, acc) +
    _swi_edu(d.education, acc) +
    _swi_skills(d.skills, acc) +
    _swi_projects(d.projects, acc) +
    _swi_certs(d.certifications, acc) +
  '</div>';
}
function _swi_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Experience</div><div class="swi-entries">' +
    exp.map(function(e) {
      return '<div class="swi-entry">' +
        '<div class="swi-left-col"><span class="swi-date">' + (e.startDate||'') + '<br>–<br>' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
        '<div class="swi-right-col"><strong>' + (e.position||'') + '</strong><div class="swi-co">' + (e.company||'') + '</div><ul>' + renderBullets(e.bullets) + '</ul></div>' +
      '</div>';
    }).join('') + '</div></div>';
}
function _swi_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Education</div><div class="swi-entries">' +
    edu.map(function(e) {
      return '<div class="swi-entry">' +
        '<div class="swi-left-col"><span class="swi-date">' + (e.endDate||'') + '</span></div>' +
        '<div class="swi-right-col"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong><div class="swi-co">' + (e.school||'') + (e.honors ? ' · ' + e.honors : '') + '</div></div>' +
      '</div>';
    }).join('') + '</div></div>';
}
function _swi_skills(s, acc) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).soft||[]).concat((s||{}).tools||[]).concat((s||{}).languages||[]);
  if (!all.length) return '';
  return '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Skills</div><p class="swi-skills">' + all.join(' · ') + '</p></div>';
}
function _swi_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Projects</div><div class="swi-entries">' +
    projects.map(function(pr) {
      return '<div class="swi-entry"><div class="swi-left-col"></div><div class="swi-right-col"><strong>' + (pr.name||'') + '</strong>' +
        (pr.technologies ? '<div class="swi-co">' + pr.technologies + '</div>' : '') +
        (pr.description ? '<p>' + pr.description + '</p>' : '') +
      '</div></div>';
    }).join('') + '</div></div>';
}
function _swi_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="swi-section"><div class="swi-label" style="color:' + acc + '">Certifications</div><div class="swi-entries">' +
    certs.map(function(c){ return '<div class="swi-entry"><div class="swi-left-col"><span class="swi-date">' + (c.year||'') + '</span></div><div class="swi-right-col"><strong>' + (c.name||'') + '</strong><div class="swi-co">' + (c.issuer||'') + '</div></div></div>'; }).join('') +
  '</div></div>';
}

// ─── 6. EXECUTIVE ────────────────────────────────────────────────────────
function renderTemplate_executive(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#7f1d1d';
  var font = c.fontFamily || "Garamond, 'Times New Roman', serif";
  return '<div class="resume-doc tpl-executive" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="exec-header">' +
      '<h1>' + (p.fullName||'Your Name') + '</h1>' +
      (p.title ? '<p class="exec-title" style="color:' + acc + '">' + p.title + '</p>' : '') +
      '<div class="exec-rule" style="border-color:' + acc + '"></div>' +
      '<p class="exec-contact">' + buildContactLine(p, ' · ') + '</p>' +
    '</div>' +
    (p.summary ? '<div class="exec-section"><h2 style="color:' + acc + '">Executive Profile</h2><p class="exec-summary">' + p.summary + '</p></div>' : '') +
    _exec_exp(d.experience, acc) +
    _exec_edu(d.education, acc) +
    _exec_skills(d.skills, acc) +
    _exec_certs(d.certifications, acc) +
  '</div>';
}
function _exec_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="exec-section"><h2 style="color:' + acc + '">Career History</h2>' +
    exp.map(function(e) {
      return '<div class="exec-entry">' +
        '<div class="exec-row"><div><em>' + (e.company||'') + '</em> — <strong>' + (e.position||'') + '</strong></div><span class="exec-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _exec_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="exec-section"><h2 style="color:' + acc + '">Education</h2>' +
    edu.map(function(e){ return '<p class="exec-edu-item"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong> · ' + (e.school||'') + ' · ' + (e.endDate||'') + '</p>'; }).join('') +
  '</div>';
}
function _exec_skills(s, acc) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).soft||[]).concat((s||{}).tools||[]);
  if (!all.length) return '';
  return '<div class="exec-section"><h2 style="color:' + acc + '">Core Competencies</h2>' +
    '<div class="exec-skills">' + all.map(function(sk){ return '<span class="exec-skill">' + sk + '</span>'; }).join('') + '</div></div>';
}
function _exec_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="exec-section"><h2 style="color:' + acc + '">Certifications</h2>' +
    certs.map(function(c){ return '<p class="exec-cert">▸ ' + (c.name||'') + ' — ' + (c.issuer||'') + ' (' + (c.year||'') + ')</p>'; }).join('') +
  '</div>';
}

// ─── 7. TECH DEVELOPER ───────────────────────────────────────────────────
function renderTemplate_tech(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#00d4aa';
  var font = c.fontFamily || "'Courier New', monospace";
  return '<div class="resume-doc tpl-tech" style="--acc:' + acc + '">' +
    '<div class="tec-header">' +
      '<div class="tec-dots"><span></span><span></span><span></span></div>' +
      '<div class="tec-name-row"><span class="tec-prompt" style="color:' + acc + '">❯</span><h1>' + (p.fullName||'Your Name') + '</h1></div>' +
      '<p class="tec-role" style="color:' + acc + ';font-family:' + font + '">' + (p.title||'') + '</p>' +
      '<div class="tec-contact" style="font-family:' + font + '">' +
        [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' · ') +
      '</div>' +
    '</div>' +
    (p.summary ? '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// ABOUT</div><p class="tec-summary">' + p.summary + '</p></div>' : '') +
    _tec_skills(d.skills, acc, font) +
    _tec_exp(d.experience, acc) +
    _tec_projects(d.projects, acc, font) +
    _tec_edu(d.education, acc) +
    _tec_certs(d.certifications, acc) +
  '</div>';
}
function _tec_skills(s, acc, font) {
  if (!s) return '';
  var cats = [['Technical', s.technical], ['Tools', s.tools], ['Languages', s.languages], ['Soft', s.soft]].filter(function(x){ return x[1] && x[1].length; });
  if (!cats.length) return '';
  return '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// TECH STACK</div>' +
    '<div class="tec-stack-grid">' +
    cats.map(function(x){ return '<div class="tec-stack-row"><span class="tec-cat" style="color:' + acc + ';font-family:' + font + '">' + x[0] + ':</span>' + x[1].map(function(sk){ return '<span class="tec-tag" style="border-color:' + acc + '">' + sk + '</span>'; }).join('') + '</div>'; }).join('') +
    '</div></div>';
}
function _tec_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// EXPERIENCE</div>' +
    exp.map(function(e) {
      return '<div class="tec-entry">' +
        '<span class="tec-fn" style="color:' + acc + '">function</span> <strong>' + (e.position||'').replace(/\s/g,'_') + '()</strong><span class="tec-co"> @ ' + (e.company||'') + '</span><span class="tec-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _tec_projects(projects, acc, font) {
  if (!projects || !projects.length) return '';
  return '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// PROJECTS</div>' +
    projects.map(function(pr) {
      return '<div class="tec-entry"><strong>' + (pr.name||'') + '</strong>' +
        (pr.link ? '<a class="tec-link" style="color:' + acc + '" href="' + pr.link + '"> [' + pr.link + ']</a>' : '') +
        (pr.technologies ? '<div class="tec-stack-line" style="font-family:' + font + ';color:' + acc + '">&gt; ' + pr.technologies + '</div>' : '') +
        (pr.description ? '<p>' + pr.description + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
}
function _tec_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// EDUCATION</div>' +
    edu.map(function(e){ return '<p class="tec-edu">' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + ' · ' + (e.school||'') + ' · ' + (e.endDate||'') + '</p>'; }).join('') +
  '</div>';
}
function _tec_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="tec-section"><div class="tec-stitle" style="color:' + acc + '">// CERTIFICATIONS</div>' +
    certs.map(function(c){ return '<p class="tec-edu"><span style="color:' + acc + '">✓</span> ' + (c.name||'') + ' · ' + (c.issuer||'') + ' (' + (c.year||'') + ')</p>'; }).join('') +
  '</div>';
}

// ─── 8. TIMELINE ────────────────────────────────────────────────────────
function renderTemplate_timeline(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#0891b2';
  var font = c.fontFamily || "'Optima', 'Candara', sans-serif";
  return '<div class="resume-doc tpl-timeline" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="tl-header" style="border-left:5px solid ' + acc + '">' +
      '<h1>' + (p.fullName||'Your Name') + '</h1>' +
      (p.title ? '<p class="tl-title" style="color:' + acc + '">' + p.title + '</p>' : '') +
      '<p class="tl-contact">' + buildContactLine(p, ' · ') + '</p>' +
    '</div>' +
    (p.summary ? '<div class="tl-section"><h2 style="color:' + acc + '">Profile</h2><p>' + p.summary + '</p></div>' : '') +
    _tl_exp(d.experience, acc) +
    _tl_edu(d.education, acc) +
    _tl_skills(d.skills, acc) +
    _tl_projects(d.projects, acc) +
    _tl_certs(d.certifications, acc) +
  '</div>';
}
function _tl_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="tl-section"><h2 style="color:' + acc + '">Experience</h2><div class="tl-track">' +
    exp.map(function(e) {
      return '<div class="tl-item">' +
        '<div class="tl-node" style="background:' + acc + '"></div>' +
        '<div class="tl-line" style="background:' + acc + '"></div>' +
        '<div class="tl-content">' +
          '<div class="tl-row"><strong>' + (e.position||'') + '</strong><span class="tl-date" style="color:' + acc + '">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
          '<div class="tl-org">' + (e.company||'') + '</div>' +
          '<ul>' + renderBullets(e.bullets) + '</ul>' +
        '</div>' +
      '</div>';
    }).join('') + '</div></div>';
}
function _tl_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="tl-section"><h2 style="color:' + acc + '">Education</h2><div class="tl-track">' +
    edu.map(function(e) {
      return '<div class="tl-item">' +
        '<div class="tl-node" style="background:' + acc + '"></div>' +
        '<div class="tl-content"><div class="tl-row"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong><span class="tl-date" style="color:' + acc + '">' + (e.endDate||'') + '</span></div><div class="tl-org">' + (e.school||'') + '</div></div>' +
      '</div>';
    }).join('') + '</div></div>';
}
function _tl_skills(s, acc) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).soft||[]).concat((s||{}).tools||[]).concat((s||{}).languages||[]);
  if (!all.length) return '';
  return '<div class="tl-section"><h2 style="color:' + acc + '">Skills</h2><div class="tl-skill-pills">' + all.map(function(sk){ return '<span class="tl-pill" style="background:' + acc + '">' + sk + '</span>'; }).join('') + '</div></div>';
}
function _tl_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="tl-section"><h2 style="color:' + acc + '">Projects</h2><div class="tl-track">' +
    projects.map(function(pr) {
      return '<div class="tl-item"><div class="tl-node" style="background:' + acc + '"></div><div class="tl-content"><strong>' + (pr.name||'') + '</strong>' + (pr.technologies ? '<span class="tl-org"> · ' + pr.technologies + '</span>' : '') + (pr.description ? '<p>' + pr.description + '</p>' : '') + '</div></div>';
    }).join('') + '</div></div>';
}
function _tl_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="tl-section"><h2 style="color:' + acc + '">Certifications</h2>' + certs.map(function(c){ return '<p class="tl-cert">🏅 ' + (c.name||'') + ' · ' + (c.issuer||'') + ' · ' + (c.year||'') + '</p>'; }).join('') + '</div>';
}

// ─── 9. TWO-COLUMN PRO ───────────────────────────────────────────────────
function renderTemplate_twoColumn(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#0f4c75';
  var font = c.fontFamily || "'Gill Sans', 'Segoe UI', sans-serif";
  return '<div class="resume-doc tpl-twocol" style="font-family:' + font + ';--acc:' + acc + '">' +
    '<div class="tc-header" style="background:' + acc + '">' +
      '<h1>' + (p.fullName||'Your Name') + '</h1>' +
      (p.title ? '<p class="tc-title">' + p.title + '</p>' : '') +
    '</div>' +
    '<div class="tc-body">' +
      '<div class="tc-left">' +
        '<div class="tc-contact-block">' +
          [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean)
            .map(function(v){ return '<div class="tc-contact-item">' + v + '</div>'; }).join('') +
        '</div>' +
        _tc_skills(d.skills, acc) +
        _tc_certs(d.certifications, acc) +
      '</div>' +
      '<div class="tc-right">' +
        (p.summary ? '<div class="tc-section"><h2 style="border-bottom:2px solid ' + acc + ';color:' + acc + '">Summary</h2><p>' + p.summary + '</p></div>' : '') +
        _tc_exp(d.experience, acc) +
        _tc_edu(d.education, acc) +
        _tc_projects(d.projects, acc) +
      '</div>' +
    '</div>' +
  '</div>';
}
function _tc_skills(s, acc) {
  if (!s) return '';
  var cats = [['Technical', s.technical], ['Tools', s.tools], ['Soft Skills', s.soft], ['Languages', s.languages]].filter(function(x){ return x[1] && x[1].length; });
  if (!cats.length) return '';
  return '<div class="tc-sb-section">' + cats.map(function(x){ return '<div><h3 style="color:' + acc + '">' + x[0] + '</h3>' + x[1].map(function(sk){ return '<div class="tc-skill-item">· ' + sk + '</div>'; }).join('') + '</div>'; }).join('') + '</div>';
}
function _tc_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="tc-sb-section"><h3 style="color:' + acc + '">Certifications</h3>' + certs.map(function(c){ return '<div class="tc-skill-item">🏅 ' + (c.name||'') + '</div>'; }).join('') + '</div>';
}
function _tc_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="tc-section"><h2 style="border-bottom:2px solid ' + acc + ';color:' + acc + '">Experience</h2>' +
    exp.map(function(e) {
      return '<div class="tc-entry">' +
        '<div class="tc-row"><div><strong>' + (e.position||'') + '</strong> · ' + (e.company||'') + '</div><span class="tc-date">' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div>';
}
function _tc_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="tc-section"><h2 style="border-bottom:2px solid ' + acc + ';color:' + acc + '">Education</h2>' +
    edu.map(function(e){ return '<div class="tc-row"><div><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong> · ' + (e.school||'') + '</div><span class="tc-date">' + (e.endDate||'') + '</span></div>'; }).join('') +
  '</div>';
}
function _tc_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="tc-section"><h2 style="border-bottom:2px solid ' + acc + ';color:' + acc + '">Projects</h2>' +
    projects.map(function(pr){ return '<div class="tc-entry"><strong>' + (pr.name||'') + '</strong>' + (pr.technologies ? '<span class="tc-tech"> · ' + pr.technologies + '</span>' : '') + (pr.description ? '<p>' + pr.description + '</p>' : '') + '</div>'; }).join('') +
  '</div>';
}

// ─── 10. COMPACT ONE-PAGE ────────────────────────────────────────────────
function renderTemplate_compact(d, c) {
  c = c || {};
  var p = d.personal || {};
  var acc = c.accentColor || '#065f46';
  var font = c.fontFamily || "Calibri, 'Candara', sans-serif";
  return '<div class="resume-doc tpl-compact" style="font-family:' + font + ';font-size:0.82em;--acc:' + acc + '">' +
    '<div class="cmp-header">' +
      '<div><h1>' + (p.fullName||'Your Name') + '</h1>' + (p.title ? '<span class="cmp-title" style="color:' + acc + '">' + p.title + '</span>' : '') + '</div>' +
      '<div class="cmp-contact">' + [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' | ') + '</div>' +
    '</div>' +
    (p.summary ? '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">SUMMARY</span><p>' + p.summary + '</p></div>' : '') +
    _cmp_exp(d.experience, acc) +
    _cmp_skills(d.skills, acc) +
    _cmp_edu(d.education, acc) +
    _cmp_projects(d.projects, acc) +
    _cmp_certs(d.certifications, acc) +
  '</div>';
}
function _cmp_exp(exp, acc) {
  if (!exp || !exp.length) return '';
  return '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">EXPERIENCE</span><div class="cmp-body">' +
    exp.map(function(e) {
      return '<div class="cmp-entry">' +
        '<div class="cmp-row"><strong>' + (e.position||'') + '</strong>, ' + (e.company||'') + '<span>' + (e.startDate||'') + ' – ' + (e.current ? 'Present' : (e.endDate||'')) + '</span></div>' +
        '<ul>' + renderBullets(e.bullets) + '</ul>' +
      '</div>';
    }).join('') + '</div></div>';
}
function _cmp_skills(s, acc) {
  var all = [].concat((s||{}).technical||[]).concat((s||{}).soft||[]).concat((s||{}).tools||[]).concat((s||{}).languages||[]);
  if (!all.length) return '';
  return '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">SKILLS</span><div class="cmp-body"><p>' + all.join(' · ') + '</p></div></div>';
}
function _cmp_edu(edu, acc) {
  if (!edu || !edu.length) return '';
  return '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">EDUCATION</span><div class="cmp-body">' +
    edu.map(function(e){ return '<div class="cmp-row"><strong>' + (e.degree||'') + (e.field ? ' in ' + e.field : '') + '</strong> · ' + (e.school||'') + '<span>' + (e.endDate||'') + '</span></div>'; }).join('') +
  '</div></div>';
}
function _cmp_projects(projects, acc) {
  if (!projects || !projects.length) return '';
  return '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">PROJECTS</span><div class="cmp-body">' +
    projects.map(function(pr){ return '<div class="cmp-entry"><strong>' + (pr.name||'') + '</strong>' + (pr.technologies ? ' [' + pr.technologies + ']' : '') + (pr.description ? ' — ' + pr.description : '') + '</div>'; }).join('') +
  '</div></div>';
}
function _cmp_certs(certs, acc) {
  if (!certs || !certs.length) return '';
  return '<div class="cmp-section"><span class="cmp-label" style="color:' + acc + '">CERTIFICATIONS</span><div class="cmp-body"><p>' + certs.map(function(c){ return (c.name||'') + ' (' + (c.issuer||'') + ', ' + (c.year||'') + ')'; }).join(' · ') + '</p></div></div>';
}
