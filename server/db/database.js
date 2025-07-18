const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, 'travel.db'), (err) => {
  if (err) console.error("DB connection error", err.message);
  else console.log("SQLite database connected");
});

db.run(`PRAGMA foreign_keys = ON`);

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    profile_image TEXT DEFAULT NULL,
    reset_token TEXT,
    reset_expiry INTEGER
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS blogposts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    country_name TEXT NOT NULL,
    date_visited TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS blogpost_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blogpost_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (blogpost_id) REFERENCES blogposts(id) ON DELETE CASCADE
  )
`);

module.exports = db;
