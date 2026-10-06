import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyRetell } from "../api/webhooks/retell.js";
import { verifyCal } from "../lib/server.js";

test("Retell webhook requires correct signature", () => {
  const body = '{"event":"call_analyzed"}', secret = "fake-testing-secret", now = 1_700_000_000_000;
  const ts = String(now);
  const digest = createHmac("sha256", secret).update(body+ts).digest("hex");
  assert.equal(verifyRetell(body, "v="+ts+",d="+digest, secret, now), true);
  assert.equal(verifyRetell(body+" ", "v="+ts+",d="+digest, secret, now), false);
  assert.equal(verifyRetell(body, "v="+ts+",d="+digest, "wrong", now), false);
  assert.equal(verifyRetell(body, "v="+ts+",d="+digest, secret, now+300001), false);
});
test("Cal webhook requires correct signature", () => {
  const body = '{"triggerEvent":"BOOKING_CREATED"}', secret = "fake-testing-secret";
  const signature = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifyCal(body,signature,secret), true);
  assert.equal(verifyCal(body+"x",signature,secret), false);
  assert.equal(verifyCal(body,signature,"different"), false);
  assert.equal(verifyCal(body,"",secret), false);
});
