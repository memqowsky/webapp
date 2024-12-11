import Database from 'better-sqlite3';

const db = new Database('users.db');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function registerUser(username, password) {
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  try {
    stmt.run(username, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Username already exists' };
  }
}

export function loginUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password);
  return user ? { success: true } : { success: false, error: 'Invalid credentials' };
}