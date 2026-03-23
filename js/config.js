// ─── SUPABASE CLIENT ───────────────────────────────────────────────────────
// We intentionally use 'db' (not 'supabase') because the Supabase CDN already
// occupies window.supabase. Declaring 'const supabase' in global scope would
// collide with that existing property and throw a SyntaxError.

const SUPABASE_URL = 'https://svpzqfitcphmhqzansoe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r5c2naf1HqiCt_C2sK-cqw_MXYbo2bj';

// window.supabase = the CDN library  →  db = our initialized client
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── HELPERS ───────────────────────────────────────────────────────────────

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

async function getUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}
