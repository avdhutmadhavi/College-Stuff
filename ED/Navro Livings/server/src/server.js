require("dotenv").config();
const app = require("./app");

const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || "127.0.0.1";
const server = app.listen(port, host, () => {
  console.log(`NAVRO Living API listening on ${host}:${port}`);
});

async function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
