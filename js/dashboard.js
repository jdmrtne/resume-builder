// ─── DASHBOARD LOGIC ───────────────────────────────────────────────────────

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await requireAuth();
  if (!currentUser) return;

  document.getElementById('user-email').textContent = currentUser.email;
  const avatarEl = document.getElementById('user-avatar');
  if (avatarEl) avatarEl.textContent = currentUser.email[0].toUpperCase();
  loadResumes();

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.href = 'index.html';
  });

  document.getElementById('btn-create').addEventListener('click', createNewResume);
  document.querySelector('.create-card')?.addEventListener('click', createNewResume);
});

async function loadResumes() {
  const grid = document.getElementById('resume-grid');
  grid.innerHTML = '<div class="loading-spinner"><span></span> Loading resumes…</div>';

  const { data: resumes, error } = await db
    .from('resumes')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="empty-state"><p>Error loading resumes: ${error.message}</p></div>`;
    return;
  }

  if (!resumes || resumes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>No resumes yet</h3>
        <p>Create your first resume to get started!</p>
        <button class="btn-primary" onclick="createNewResume()">+ Create Resume</button>
      </div>`;
    return;
  }

  updateStats(resumes);

  grid.innerHTML = resumes.map(r => resumeCard(r)).join('');

  // Bind actions
  grid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === 'edit') editResume(id);
      if (action === 'duplicate') duplicateResume(id);
      if (action === 'delete') deleteResume(id, btn.closest('.resume-card'));
      if (action === 'toggle-public') togglePublic(id, btn);
    });
  });

  grid.querySelectorAll('.resume-card').forEach(card => {
    card.addEventListener('click', () => editResume(card.dataset.id));
  });
}

function updateStats(resumes) {
  document.getElementById('stat-total').textContent = resumes.length;
  const publicCount = resumes.filter(r => r.is_public).length;
  document.getElementById('stat-public').textContent = publicCount;
}

function resumeCard(r) {
  const data = r.data_json || {};
  const name = data.personal?.fullName || 'Unnamed Resume';
  const title = data.personal?.title || 'No title';
  const updated = new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const templateName = r.template || 'classic';
  const isPublic = r.is_public;
  const slug = r.public_slug || '';

  return `
    <div class="resume-card" data-id="${r.id}">
      <div class="card-template-badge">${templateName}</div>
      <div class="card-preview-thumb thumb-${templateName}">
        <div class="thumb-header"></div>
        <div class="thumb-lines">
          <div class="tl tl-w80"></div>
          <div class="tl tl-w60"></div>
          <div class="tl tl-w40"></div>
          <div class="tl tl-w70"></div>
          <div class="tl tl-w50"></div>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-name">${r.title || name}</h3>
        <p class="card-subtitle">${title}</p>
        <p class="card-date">Updated ${updated}</p>
        ${isPublic && slug ? `<a class="card-link" href="resume.html?slug=${slug}" target="_blank" onclick="event.stopPropagation()">🔗 View Public Link</a>` : ''}
      </div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="card-btn" data-action="edit" data-id="${r.id}" title="Edit">✏️</button>
        <button class="card-btn" data-action="duplicate" data-id="${r.id}" title="Duplicate">⧉</button>
        <button class="card-btn ${isPublic ? 'active' : ''}" data-action="toggle-public" data-id="${r.id}" title="${isPublic ? 'Make Private' : 'Make Public'}">🌐</button>
        <button class="card-btn danger" data-action="delete" data-id="${r.id}" title="Delete">🗑</button>
      </div>
    </div>`;
}

async function createNewResume() {
  const defaultData = {
    personal: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: '' },
    experience: [],
    education: [],
    skills: { technical: [], soft: [], tools: [], languages: [] },
    projects: [],
    certifications: []
  };

  const { data, error } = await db.from('resumes').insert({
    user_id: currentUser.id,
    title: 'New Resume',
    data_json: defaultData,
    template: 'classic',
    is_public: false
  }).select().single();

  if (error) { alert('Error creating resume: ' + error.message); return; }
  window.location.href = `builder.html?id=${data.id}`;
}

function editResume(id) {
  window.location.href = `builder.html?id=${id}`;
}

async function duplicateResume(id) {
  const { data: original } = await db.from('resumes').select('*').eq('id', id).single();
  if (!original) return;

  const { error } = await db.from('resumes').insert({
    user_id: currentUser.id,
    title: original.title + ' (Copy)',
    data_json: original.data_json,
    template: original.template,
    is_public: false
  });

  if (error) { alert('Error duplicating: ' + error.message); return; }
  loadResumes();
}

async function deleteResume(id, cardEl) {
  if (!confirm('Delete this resume? This cannot be undone.')) return;
  cardEl.style.opacity = '0.4';
  const { error } = await db.from('resumes').delete().eq('id', id);
  if (error) { alert('Error deleting: ' + error.message); cardEl.style.opacity = '1'; return; }
  loadResumes();
}

async function togglePublic(id, btn) {
  const { data: resume } = await db.from('resumes').select('is_public, public_slug').eq('id', id).single();
  const newPublic = !resume.is_public;
  const slug = resume.public_slug || generateSlug();

  const { error } = await db.from('resumes').update({
    is_public: newPublic,
    public_slug: newPublic ? slug : resume.public_slug
  }).eq('id', id);

  if (error) { alert('Error: ' + error.message); return; }
  loadResumes();
}

function generateSlug() {
  return Math.random().toString(36).slice(2, 10);
}
