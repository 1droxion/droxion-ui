import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSupabaseUrl } from "../lib/supabase-url.js";
const origin="https://example-ref.supabase.co";
test("accept a bare Supabase project origin",()=> {
  assert.equal(normalizeSupabaseUrl(origin),origin);
  assert.equal(normalizeSupabaseUrl(origin+"/"),origin);
});
test("strip a copied REST endpoint to avoid /rest/v1/rest/v1",()=> {
  assert.equal(normalizeSupabaseUrl(origin+"/rest/v1"),origin);
  assert.equal(normalizeSupabaseUrl(origin+"/rest/v1/"),origin);
});
test("reject misleading or unsafe URL paths",()=> {
  for (const input of [
    origin+"/dashboard/project/123",
    origin+"/rest/v1/demo_inquiries",
    origin+"?apikey=secret",
    "https://evil.example/rest/v1",
    "https://user:pass@example-ref.supabase.co/rest/v1",
    "",
  ]) assert.throws(()=>normalizeSupabaseUrl(input));
});
