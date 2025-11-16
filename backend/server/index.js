import express from 'express';
import { PORT } from './config.js';
import { pool } from './db.js';

const app = express();

app.get('/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ ok: true, result: rows[0].result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
