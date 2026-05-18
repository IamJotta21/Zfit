const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

/**
 * GET /api/alunos
 * Lista todos os alunos matriculados e seus dados de frequência.
 */
router.get('/', async (req, res) => {
  try {
    const { data: alunos, error } = await supabase
      .from('alunos')
      .select('*')
      .order('data_cadastro', { ascending: false });

    if (error) throw error;
    res.status(200).json(alunos);
  } catch (erro) {
    console.error("Erro ao listar alunos:", erro);
    res.status(500).json({ erro: "Falha ao buscar a lista de alunos." });
  }
});

/**
 * POST /api/alunos
 * Cadastra um novo aluno no sistema e dispara a criação da sua linha financeira.
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, codigo_acesso, plano_inicial, valor_plano } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "O nome do aluno é obrigatório." });
    }

    // 1. Inserir aluno no Supabase utilizando a coluna JSONB status_presenca para armazenar o código de acesso
    const { data: aluno, error: errorAluno } = await supabase
      .from('alunos')
      .insert([{ 
        nome, 
        email, 
        telefone, 
        status_presenca: [{ codigo_acesso: codigo_acesso || nome }] 
      }])
      .select()
      .single();

    if (errorAluno) throw errorAluno;

    // 2. Criar automaticamente a linha no Financeiro para o novo aluno
    const dataInicio = new Date();
    const dataVencimento = new Date();
    dataVencimento.setMonth(dataVencimento.getMonth() + 1); // Vence daqui a 1 mês

    const { error: errorFinanceiro } = await supabase
      .from('financeiro_alunos')
      .insert([{
        aluno_id: aluno.id,
        plano: plano_inicial || 'Base',
        data_inicio: dataInicio.toISOString().split('T')[0],
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        valor_personalizado: valor_plano || 49.90,
        status_pagamento: 'PENDENTE'
      }]);

    if (errorFinanceiro) throw errorFinanceiro;

    res.status(201).json({ 
      mensagem: "Aluno cadastrado com sucesso e contrato financeiro gerado!", 
      aluno 
    });
  } catch (erro) {
    console.error("Erro ao cadastrar aluno:", erro);
    res.status(500).json({ erro: "Falha ao cadastrar o aluno no sistema." });
  }
});

module.exports = router;
