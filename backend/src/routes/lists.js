import express from 'express';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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

// Listar listas do usuário
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar listas.' });
  }
});

// Criar lista
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome da lista obrigatório.' });
  try {
    const result = await pool.query('INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *', [req.user.id, name]);
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Erro ao criar lista.' });
  }
});

// Excluir lista (e contatos)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM lists WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao excluir lista.' });
  }
});

// Upload de CSV para importar contatos
router.post('/:id/upload', auth, upload.single('file'), async (req, res) => {
  const listId = req.params.id;
  if (!req.file) return res.status(400).json({ error: 'Arquivo CSV obrigatório.' });
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv(['nome', 'numero']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const contact of results) {
          if (contact.nome && contact.numero) {
            await pool.query('INSERT INTO contacts (list_id, nome, numero) VALUES ($1, $2, $3)', [listId, contact.nome, contact.numero]);
          }
        }
        fs.unlinkSync(req.file.path);
        res.json({ success: true, imported: results.length });
      } catch {
        res.status(500).json({ error: 'Erro ao importar contatos.' });
      }
    });
});

// Cadastro manual de contato
router.post('/:id/contact', auth, async (req, res) => {
  const listId = req.params.id;
  const { nome, numero } = req.body;
  if (!nome || !numero) return res.status(400).json({ error: 'Nome e número obrigatórios.' });
  try {
    await pool.query('INSERT INTO contacts (list_id, nome, numero) VALUES ($1, $2, $3)', [listId, nome, numero]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar contato.' });
  }
});

// Download modelo de CSV
router.get('/csv-model', auth, (req, res) => {
  const filePath = path.join(process.cwd(), 'backend', 'csv_model.csv');
  res.download(filePath, 'modelo_contatos.csv');
});

export default router;
