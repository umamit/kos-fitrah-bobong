// === Supabase Client & REST API Connector ===
const SUPABASE_CONFIG = {
  url: 'https://cyfeithwpexfqdtdsoov.supabase.co',
  anonKey: 'sb_publishable_2YNUf2aUUr-nFlBBEOPjiA_bFFcySQV'
};

function getSupabaseConfig() {
  const savedKey = localStorage.getItem('kosfitrah_supabase_key');
  return {
    url: SUPABASE_CONFIG.url,
    anonKey: savedKey || SUPABASE_CONFIG.anonKey
  };
}

async function supabaseFetch(table, options = {}) {
  const { url, anonKey } = getSupabaseConfig();
  if (!anonKey) return null;

  const endpoint = `${url}/rest/v1/${table}${options.query || ''}`;
  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
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
    console.warn('Supabase fetch notice, local sync active:', err);
    return null;
  }
}
