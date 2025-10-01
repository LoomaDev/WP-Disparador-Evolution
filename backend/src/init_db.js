import { pool } from './db.js';

async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE
  )`);
}

initDB().then(() => {
  console.log('Tabela users verificada/criada');
  process.exit(0);
}).catch(err => {
  console.error('Erro ao criar tabela users:', err);
  process.exit(1);
});
