/**
 * The Supabase JS client adds /rest/v1, /auth/v1 and other API paths itself.
 * Settings → Data API sometimes shows a full endpoint; use only the project origin.
 * Never log raw environment URLs, since they may contain tokens or query strings.
 */
export function normalizeSupabaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Supabase Project URL is missing.");
  }
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new Error("Supabase Project URL is invalid.");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username || parsed.password ||
    parsed.search || parsed.hash ||
    !/^[a-z0-9-]+\.supabase\.co$/i.test(parsed.hostname)
  ) {
    throw new Error("Supabase Project URL must be a project https://...supabase.co origin.");
  }
  // The user may have copied Supabase's REST endpoint instead of Project URL.
  const path = parsed.pathname.replace(/\/+$/, "");
  if (path && path !== "/rest/v1") {
    throw new Error("Supabase Project URL contains an unexpected API path.");
  }
  return parsed.origin;
}
