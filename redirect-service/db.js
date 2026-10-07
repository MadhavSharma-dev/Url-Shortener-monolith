const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const DB_PATH = process.env.DB_PATH || "/data/urls.db";
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Ensure urls table exists (read-only service, but needs the table)
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(schema);

module.exports = db;
