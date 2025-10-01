import express from 'express';
import { pool } from '../db.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Middleware de autenticação
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

// Listar instâncias
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instances WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar instâncias.' });
  }
});

// Criar instância
router.post('/', auth, async (req, res) => {
  const { instanceName, integration, apiKey } = req.body;
  if (!instanceName || !integration || !apiKey) return res.status(400).json({ error: 'Dados obrigatórios.' });
  try {
    // Chamada à Evolution API
    const evolutionRes = await axios.post(`${process.env.EVOLUTION_API_URL}/instances`, {
      instanceName,
      integration,
      apiKey
    }, {
      headers: { 'Authorization': `Bearer ${process.env.EVOLUTION_GLOBAL_API_KEY}` }
    });
    const { instanceId, qrcode, hash } = evolutionRes.data;
    // Salvar no banco
    await pool.query('INSERT INTO instances (user_id, instance_name, integration, api_key, instance_id, hash, qrcode) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.user.id, instanceName, integration, apiKey, instanceId, hash, qrcode]);
    res.json({ success: true, instanceId, qrcode });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar instância.' });
  }
});

// Deletar instância
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM instances WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao deletar instância.' });
  }
});

export default router;
