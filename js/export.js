// ─── EXPORT FUNCTIONS ──────────────────────────────────────────────────────

function exportPDF() {
  const preview = document.getElementById('resume-preview');
  if (!preview) return;

  const opt = {
    margin: 0,
    filename: (window.currentResumeTitle || 'resume') + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const btn = document.getElementById('btn-export-pdf');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating PDF…'; }

  // Clone and prepare for print
  const clone = preview.cloneNode(true);
  clone.style.width = '210mm';
  clone.style.minHeight = '297mm';
  clone.style.padding = '0';
  clone.style.margin = '0';

  html2pdf().set(opt).from(preview).save().then(() => {
    if (btn) { btn.disabled = false; btn.textContent = '⬇ Download PDF'; }
  });
}

function printResume() {
  const preview = document.getElementById('resume-preview');
  if (!preview) return;

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <title>Resume</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: white; }
      @media print { body { margin: 0; } }
    </style>
    ${Array.from(document.styleSheets).map(ss => {
      try { return `<style>${Array.from(ss.cssRules).map(r => r.cssText).join('\n')}</style>`; }
      catch(e) { return `<link rel="stylesheet" href="${ss.href}">`; }
    }).join('\n')}
  </head><body>${preview.outerHTML}</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 500);
}

function exportPlainText(resumeData) {
  if (!resumeData) return;
  const lines = [];
  const p = resumeData.personal || {};

  if (p.fullName) lines.push(p.fullName.toUpperCase());
  if (p.title) lines.push(p.title);
  const contact = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean);
  if (contact.length) lines.push(contact.join(' | '));
  lines.push('');

  if (p.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('─'.repeat(40));
    lines.push(p.summary);
    lines.push('');
  }

  if ((resumeData.experience || []).length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('─'.repeat(40));
    resumeData.experience.forEach(e => {
      lines.push(`${e.position || ''} | ${e.company || ''}`);
      lines.push(`${e.startDate || ''} – ${e.current ? 'Present' : (e.endDate || '')}`);
      (e.bullets || []).forEach(b => lines.push(`  • ${b}`));
      lines.push('');
    });
  }

  if ((resumeData.education || []).length > 0) {
    lines.push('EDUCATION');
    lines.push('─'.repeat(40));
    resumeData.education.forEach(e => {
      lines.push(`${e.degree || ''} in ${e.field || ''} — ${e.school || ''}`);
      lines.push(`${e.startDate || ''} – ${e.endDate || ''}${e.honors ? ' | ' + e.honors : ''}`);
      lines.push('');
    });
  }

  const s = resumeData.skills || {};
  const allSkills = [
    ...(s.technical || []), ...(s.soft || []),
    ...(s.tools || []), ...(s.languages || [])
  ];
  if (allSkills.length > 0) {
    lines.push('SKILLS');
    lines.push('─'.repeat(40));
    if (s.technical?.length) lines.push('Technical: ' + s.technical.join(', '));
    if (s.soft?.length) lines.push('Soft Skills: ' + s.soft.join(', '));
    if (s.tools?.length) lines.push('Tools: ' + s.tools.join(', '));
    if (s.languages?.length) lines.push('Languages: ' + s.languages.join(', '));
    lines.push('');
  }

  if ((resumeData.projects || []).length > 0) {
    lines.push('PROJECTS');
    lines.push('─'.repeat(40));
    resumeData.projects.forEach(pr => {
      lines.push(`${pr.name || ''}`);
      if (pr.technologies) lines.push(`Technologies: ${pr.technologies}`);
      if (pr.description) lines.push(pr.description);
      if (pr.link) lines.push(pr.link);
      lines.push('');
    });
  }

  if ((resumeData.certifications || []).length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('─'.repeat(40));
    resumeData.certifications.forEach(c => {
      lines.push(`${c.name || ''} — ${c.issuer || ''} (${c.year || ''})`);
    });
    lines.push('');
  }

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (window.currentResumeTitle || 'resume') + '-ats.txt';
  a.click();
  URL.revokeObjectURL(url);
}
