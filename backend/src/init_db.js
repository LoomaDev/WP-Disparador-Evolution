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
}

initDB().then(() => {
  console.log('Tabelas users/settings verificadas/criadas');
  process.exit(0);
}).catch(err => {
  console.error('Erro ao criar tabelas:', err);
  process.exit(1);
});
