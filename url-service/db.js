const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = process.env.DB_PATH || "/data/urls.db";
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

// Open (or create) the SQLite database
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Run schema if tables don't exist yet
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(schema);

module.exports = db;
