import { pool } from '../db.js';

export async function getSettings() {
  const result = await pool.query('SELECT * FROM settings LIMIT 1');
  return result.rows[0] || {};
}

export async function saveSettings({ apiUrl, apiKey }) {
  await pool.query(`INSERT INTO settings (api_url, api_key) VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET api_url = $1, api_key = $2`, [apiUrl, apiKey]);
}
