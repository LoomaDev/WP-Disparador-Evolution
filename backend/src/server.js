import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import instanceRoutes from './routes/instances.js';
import settingsRoutes from './routes/settings.js';
import listsRoutes from './routes/lists.js';
import contactsRoutes from './routes/contacts.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/instances', instanceRoutes);

app.use('/api/lists', listsRoutes);
app.use('/api', contactsRoutes);

app.get('/', (req, res) => {
  res.send('WP Disparador Backend rodando!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
