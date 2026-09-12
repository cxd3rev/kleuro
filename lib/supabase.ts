import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function isNewFormatApiKey(key: string) {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_");
}

function fetchWithoutNewKeyAsBearer(apiKey: string) {
  return (input: RequestInfo | URL, init?: RequestInit) => {
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

export function getSupabaseUrl() {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ||
    process.env.SUPABASE_URL?.replace(/\/$/, "") ||
    ""
  );
}

export function getSupabasePublishableKey() {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

let client: SupabaseClient | null = null;

export function getSupabase() {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();
  if (!url || !publishableKey) {
    return null;
  }
  if (publishableKey.startsWith("sb_secret_") || publishableKey.includes("service_role")) {
    throw new Error("SUPABASE_SECRET_IN_CLIENT");
  }
  if (client) {
    return client;
  }

  const options: Parameters<typeof createClient>[2] = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  };

  if (isNewFormatApiKey(publishableKey)) {
    options.global = {
      fetch: fetchWithoutNewKeyAsBearer(publishableKey),
    };
  }

  client = createClient(url, publishableKey, options);
  return client;
}

export async function probeLeadsTable() {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false as const, reason: "missing_env" };
  }

  const { error } = await supabase.from("leads").select("id").limit(1);
  if (error) {
    const blockedByRls =
      error.code === "42501" ||
      error.code === "PGRST301" ||
      /permission denied|not allowed|jwt/i.test(error.message);
    if (blockedByRls) {
      return { ok: true as const, reachable: true, publicRows: false };
    }
    return { ok: false as const, reason: error.message };
  }

  return { ok: true as const, reachable: true, publicRows: true };
}
