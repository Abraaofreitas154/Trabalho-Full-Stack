const express = require('express');
const cors = require('cors');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/produtos', produtoRoutes);

// Rota base
app.get('/', (req, res) => {
  res.json({ mensagem: 'API Fullstack rodando!', status: 'OK' });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

module.exports = app;

