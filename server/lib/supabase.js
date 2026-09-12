const { createClient } = require("@supabase/supabase-js");

function isNewFormatApiKey(key) {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_");
}

function fetchWithoutNewKeyAsBearer(apiKey) {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", apiKey);
    }
    const authorization = headers.get("Authorization");
    if (authorization && /^Bearer\s+sb_(secret|publishable)_/i.test(authorization)) {
      headers.delete("Authorization");
    }
    return fetch(input, { ...init, headers });
  };
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return null;
  }

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };

  if (isNewFormatApiKey(serviceRoleKey)) {
    options.global = {
      fetch: fetchWithoutNewKeyAsBearer(serviceRoleKey),
    };
  }

  return createClient(url, serviceRoleKey, options);
}

module.exports = { getSupabaseAdmin };
