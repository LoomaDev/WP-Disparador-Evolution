import express from 'express';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// Listar contatos de uma lista
router.get('/:listId/contacts', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts WHERE list_id = $1 ORDER BY id DESC', [req.params.listId]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar contatos.' });
  }
});

// Excluir contato
router.delete('/:listId/contacts/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = $1 AND list_id = $2', [req.params.id, req.params.listId]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao excluir contato.' });
  }
});

export default router;
