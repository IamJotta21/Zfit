require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importação das rotas modulares
const alunosRoutes = require('./routes/alunosRoutes');
const treinosRoutes = require('./routes/treinosRoutes');
const financeiroRoutes = require('./routes/financeiroRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');
const configuracoesRoutes = require('./routes/configuracoesRoutes');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Injeção de Rotas da API
app.use('/api/alunos', alunosRoutes);
app.use('/api/treinos', treinosRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/configuracoes', configuracoesRoutes);

// Rota de Health Check para verificar se o backend está online
app.get('/', (req, res) => {
  res.status(200).json({ status: "Zfit Backend Node.js Online!", version: "1.0.0" });
});

// Tratamento global para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ erro: "Rota não encontrada na API do Zfit." });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Zfit rodando na porta ${PORT}`);
  console.log(`🔗 Supabase configurado com sucesso!`);
});
