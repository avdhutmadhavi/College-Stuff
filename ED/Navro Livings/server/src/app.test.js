const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.DB_HOST = "127.0.0.1";
process.env.DB_USER = "navro_test_invalid";
process.env.DB_PASSWORD = "test-only-placeholder";
process.env.DB_NAME = "navro_living";

const app = require("./app");
const pool = require("./config/database");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await pool.end();
});

test("rejects invalid garden enquiries before database access", async () => {
  const response = await fetch(`${baseUrl}/enquiries`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "", email: "not-an-email", consent: false }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.ok(Array.isArray(body.details));
});

test("rejects duplicate checkout quantities over the limit before database access", async () => {
  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Sample visitor",
      email: "visitor@example.test",
      phone: "0000000000",
      address: "10 Sample Garden Road",
      city: "Sample City",
      postalCode: "000000",
      items: [{ productId: 1, quantity: 20 }, { productId: 1, quantity: 1 }],
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.match(body.details[0].message, /quantity/i);
});

test("returns a generic error instead of success when MySQL cannot authenticate", async () => {
  const response = await fetch(`${baseUrl}/enquiries`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Sample visitor",
      email: "visitor@example.test",
      message: "I would like to ask about a small balcony garden.",
      consent: true,
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 500);
  assert.equal(body.error, "The request could not be completed. Please try again later.");
  assert.doesNotMatch(JSON.stringify(body), /test-only-placeholder|navro_test_invalid|INSERT|stack|ER_ACCESS/);
});

test("reports database health failure without exposing diagnostics", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();
  assert.equal(response.status, 500);
  assert.doesNotMatch(JSON.stringify(body), /test-only-placeholder|navro_test_invalid|SELECT|stack|ER_ACCESS/);
});

test("returns JSON for an unknown API route", async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Route not found." });
});
