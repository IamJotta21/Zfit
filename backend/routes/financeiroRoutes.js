const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

/**
 * GET /api/financeiro
 * Busca todos os registros financeiros com os nomes dos alunos vinculados.
 */
router.get('/', async (req, res) => {
  try {
    const { data: financeiro, error } = await supabase
      .from('financeiro_alunos')
      .select(`
        *,
        alunos (nome)
      `);

    if (error) throw error;
    res.status(200).json(financeiro);
  } catch (erro) {
    console.error("Erro ao listar financeiro:", erro);
    res.status(500).json({ erro: "Falha ao buscar os dados financeiros." });
  }
});

/**
 * PUT /api/financeiro/:alunoId
 * Atualiza inline os dados do contrato financeiro de um aluno específico.
 */
router.put('/:alunoId', async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { plano, data_inicio, data_vencimento, valor_personalizado, status_pagamento } = req.body;

    // Constrói o objeto de atualização dinamicamente apenas com os campos enviados
    const payload = {};
    if (plano !== undefined) payload.plano = plano;
    if (data_inicio !== undefined) payload.data_inicio = data_inicio;
    if (data_vencimento !== undefined) payload.data_vencimento = data_vencimento;
    if (valor_personalizado !== undefined) payload.valor_personalizado = valor_personalizado;
    if (status_pagamento !== undefined) payload.status_pagamento = status_pagamento;

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ erro: "Nenhum dado financeiro foi enviado para atualização." });
    }

    const { data: financeiro, error } = await supabase
      .from('financeiro_alunos')
      .update(payload)
      .eq('aluno_id', alunoId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ 
      mensagem: "Contrato financeiro atualizado com sucesso!", 
      financeiro 
    });
  } catch (erro) {
    console.error(`Erro ao atualizar financeiro do aluno ${req.params.alunoId}:`, erro);
    res.status(500).json({ erro: "Falha ao processar a atualização financeira." });
  }
});

module.exports = router;
