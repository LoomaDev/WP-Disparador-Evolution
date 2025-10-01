import express from 'express';
import { pool } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Middleware de autenticação (simplificado)
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

// Buscar configurações do usuário
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings WHERE user_id = $1', [req.user.id]);
    res.json(result.rows[0] || {});
  } catch {
    res.status(500).json({ error: 'Erro ao buscar configurações.' });
  }
});

// Atualizar configurações
router.post('/', auth, async (req, res) => {
  const { apiUrl, globalApiKey, defaultMessage } = req.body;
  try {
    await pool.query(
      `INSERT INTO settings (user_id, api_url, global_api_key, default_message)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET api_url = $2, global_api_key = $3, default_message = $4`,
      [req.user.id, apiUrl, globalApiKey, defaultMessage]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao salvar configurações.' });
  }
});

export default router;
