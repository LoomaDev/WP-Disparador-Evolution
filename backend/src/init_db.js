import { pool } from './db.js';

async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    api_url TEXT,
    global_api_key TEXT,
    default_message TEXT
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS instances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    instance_name VARCHAR(255) NOT NULL,
    integration VARCHAR(255),
    api_key TEXT NOT NULL,
    instance_id VARCHAR(255),
    hash TEXT,
    qrcode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}

initDB().then(() => {
  console.log('Tabelas users/settings verificadas/criadas');
  process.exit(0);
}).catch(err => {
  console.error('Erro ao criar tabelas:', err);
  process.exit(1);
});
