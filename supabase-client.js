// === Supabase Auth & REST API Client (Vanilla JS) ===
const SUPABASE_CONFIG = {
  url: 'https://cyfeithwpexfqdtdsoov.supabase.co',
  anonKey: 'sb_publishable_2YNUf2aUUr-nFlBBEOPjiA_bFFcySQV'
};

function getAuthToken() {
  const session = localStorage.getItem('kosfitrah_supabase_session');
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    return parsed.access_token || null;
  } catch (e) { return null; }
}

function saveAuthSession(sessionData) {
  localStorage.setItem('kosfitrah_supabase_session', JSON.stringify(sessionData));
}

function clearAuthSession() {
  localStorage.removeItem('kosfitrah_supabase_session');
}

// Supabase Auth: Sign In with Email & Password
async function supabaseSignIn(email, password) {
  const endpoint = `${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login gagal.');
  saveAuthSession(data);
  return data;
}

// Supabase Auth: Sign Out
async function supabaseSignOut() {
  const token = getAuthToken();
  if (token) {
    fetch(`${SUPABASE_CONFIG.url}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${token}`
      }
    }).catch(() => {});
  }
  clearAuthSession();
}

// Supabase REST Fetch Helper with Token
async function supabaseFetch(table, options = {}) {
  const token = getAuthToken() || SUPABASE_CONFIG.anonKey;
  const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/${table}${options.query || ''}`;
  const headers = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation'
  };

  try {
    const res = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Supabase request note:', err);
    return null;
  }
}
