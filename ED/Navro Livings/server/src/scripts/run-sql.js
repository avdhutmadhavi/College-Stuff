require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");

async function main() {
  const file = path.resolve(__dirname, process.argv[2] || "");
  const sql = await fs.readFile(file, "utf8");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  try {
    await connection.query(sql);
    console.log(`Executed ${path.basename(file)} successfully.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`Could not execute database script (${error.code || error.name}). Check the MySQL account and configuration.`);
  process.exitCode = 1;
});
