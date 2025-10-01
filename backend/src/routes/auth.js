import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

// Registro de super admin (apenas para setup inicial)
router.post('/register', async (req, res) => {
  const { username, password, isSuperAdmin } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query('INSERT INTO users (username, password, is_super_admin) VALUES ($1, $2, $3) RETURNING id', [username, hash, !!isSuperAdmin]);
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha inválida.' });
    const token = jwt.sign({ id: user.id, isSuperAdmin: user.is_super_admin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, isSuperAdmin: user.is_super_admin } });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

export default router;
