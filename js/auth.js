// ─── AUTH PAGE LOGIC ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // If already logged in, go to dashboard
  const { data: { session } } = await db.auth.getSession();
  if (session) window.location.href = 'dashboard.html';

  // Tab switching
  document.querySelectorAll('.auth-tab, [data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.dataset.tab;
      if (!tab) return;
      switchTab(tab);
    });
  });

  document.getElementById('forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('forgot');
  });

  // Login
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  // Signup
  document.getElementById('btn-signup').addEventListener('click', handleSignup);

  // Forgot password
  document.getElementById('btn-forgot').addEventListener('click', handleForgot);
});

function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  const tabBtn = document.querySelector(`.auth-tab[data-tab="${tab}"]`);
  if (tabBtn) tabBtn.classList.add('active');
  const form = document.getElementById(`form-${tab}`);
  if (form) form.classList.add('active');
  clearAlerts();
}

function showAlert(formId, msg, type = 'error') {
  const el = document.getElementById(`${formId}-alert`);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}

function clearAlerts() {
  document.querySelectorAll('.alert').forEach(a => {
    a.className = 'alert';
    a.textContent = '';
  });
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.label || btn.textContent;
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  clearAlerts();

  if (!email || !password) return showAlert('login', 'Please fill in all fields.');

  const btn = document.getElementById('btn-login');
  btn.dataset.label = 'Sign In';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const { error } = await db.auth.signInWithPassword({ email, password });
  btn.disabled = false;
  btn.textContent = 'Sign In';

  if (error) return showAlert('login', error.message);
  window.location.href = 'dashboard.html';
}

async function handleSignup() {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  clearAlerts();

  if (!email || !password) return showAlert('signup', 'Please fill in all fields.');
  if (password.length < 8) return showAlert('signup', 'Password must be at least 8 characters.');
  if (password !== confirm) return showAlert('signup', 'Passwords do not match.');

  const btn = document.getElementById('btn-signup');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  const { error } = await db.auth.signUp({ email, password });
  btn.disabled = false;
  btn.textContent = 'Create Account';

  if (error) return showAlert('signup', error.message);
  showAlert('signup', '✓ Account created! Check your email to verify, then sign in.', 'success');
}

async function handleForgot() {
  const email = document.getElementById('forgot-email').value.trim();
  clearAlerts();

  if (!email) return showAlert('forgot', 'Please enter your email address.');

  const btn = document.getElementById('btn-forgot');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/resume-builder/index.html'
  });
  btn.disabled = false;
  btn.textContent = 'Send Reset Link';

  if (error) return showAlert('forgot', error.message);
  showAlert('forgot', '✓ Reset link sent! Check your email inbox.', 'success');
}
