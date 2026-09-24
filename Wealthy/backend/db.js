const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'wealthy.db');

fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id       TEXT PRIMARY KEY,
    user_id  TEXT,
    type     TEXT NOT NULL,
    category TEXT NOT NULL,
    amount   REAL NOT NULL,
    date     TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bookmarks (
    id      TEXT PRIMARY KEY,
    user_id TEXT
  );
`);

function addColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((col) => col.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

addColumn('transactions', 'user_id', 'TEXT');
addColumn('bookmarks', 'user_id', 'TEXT');

db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);');
db.exec('CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(candidate, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function parseUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function createUser(name, email, password) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) return { error: 'Пользователь с такой почтой уже существует' };
  db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
    name.trim(),
    email.toLowerCase().trim(),
    hashPassword(password)
  );
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  return { user: parseUser(user) };
}

function findUserByEmail(email) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  return parseUser(row);
}

function findUserById(id) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
  return parseUser(row);
}

function checkPassword(email, password) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash)) return null;
  return parseUser(row);
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, Number(userId));
  return token;
}

function getUserByToken(token) {
  if (!token) return null;
  const row = db
    .prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?')
    .get(token);
  return parseUser(row);
}

function deleteSession(token) {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

const parseTx = (row) => (row ? { ...row, amount: Number(row.amount) } : null);

function listTransactions(month, userId = null) {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, mm] = month.split('-').map(Number);
    const start = new Date(Date.UTC(year, mm - 1, 1)).toISOString();
    const end = new Date(Date.UTC(year, mm, 1)).toISOString();
    const rows = db
      .prepare(
        'SELECT * FROM transactions WHERE user_id IS ? AND date >= ? AND date < ? ORDER BY date DESC, id DESC'
      )
      .all(userId, start, end);
    return rows.map(parseTx);
  }
  const rows = db
    .prepare('SELECT * FROM transactions WHERE user_id IS ? ORDER BY date DESC, id DESC')
    .all(userId);
  return rows.map(parseTx);
}

function insertTransaction(tx, userId = null) {
  const createdAt = tx.date ? new Date(tx.date).toISOString() : new Date().toISOString();
  db.prepare(
    'INSERT INTO transactions (id, user_id, type, category, amount, date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(String(tx.id), userId, tx.type, tx.category, Number(tx.amount), createdAt);
  return getTransaction(tx.id, userId);
}

function getTransaction(id, userId = null) {
  return parseTx(
    db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id IS ?').get(String(id), userId)
  );
}

function updateTransaction(id, tx, userId = null) {
  db.prepare(
    'UPDATE transactions SET type = ?, category = ?, amount = ?, date = ? WHERE id = ? AND user_id IS ?'
  ).run(tx.type, tx.category, Number(tx.amount), new Date(tx.date).toISOString(), String(id), userId);
  return getTransaction(id, userId);
}

function deleteTransaction(id, userId = null) {
  const result = db
    .prepare('DELETE FROM transactions WHERE id = ? AND user_id IS ?')
    .run(String(id), userId);
  return result.changes > 0;
}

function listBookmarks(userId = null) {
  return db
    .prepare('SELECT id FROM bookmarks WHERE user_id IS ? ORDER BY id')
    .all(userId)
    .map((row) => row.id);
}

function addBookmark(id, userId = null) {
  db.prepare('INSERT OR IGNORE INTO bookmarks (id, user_id) VALUES (?, ?)').run(String(id), userId);
  return String(id);
}

function removeBookmark(id, userId = null) {
  const result = db
    .prepare('DELETE FROM bookmarks WHERE id = ? AND user_id IS ?')
    .run(String(id), userId);
  return result.changes > 0;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  checkPassword,
  createSession,
  getUserByToken,
  deleteSession,
  listTransactions,
  insertTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  listBookmarks,
  addBookmark,
  removeBookmark,
};