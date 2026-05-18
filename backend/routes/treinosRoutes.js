const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

/**
 * GET /api/treinos
 * Busca todos os treinos da biblioteca.
 */
router.get('/', async (req, res) => {
  try {
    const { data: treinos, error } = await supabase
      .from('treinos_biblioteca')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(treinos);
  } catch (erro) {
    console.error("Erro ao listar treinos:", erro);
    res.status(500).json({ erro: "Falha ao buscar os treinos da biblioteca." });
  }
});

/**
 * POST /api/treinos
 * Salva um novo treino na biblioteca (Construtor Desacoplado).
 */
router.post('/', async (req, res) => {
  try {
    const { nome_treino, objetivo, nivel, observacoes, exercicios, aluno_id } = req.body;

    if (!nome_treino || !exercicios) {
      return res.status(400).json({ erro: "Nome do treino e a lista de exercícios são obrigatórios." });
    }

    // O aluno_id pode ser null se o treino for um modelo global da biblioteca
    const { data: treino, error } = await supabase
      .from('treinos_biblioteca')
      .insert([{
        nome_treino,
        objetivo,
        nivel,
        observacoes,
        exercicios, // JSONB estruturado via frontend
        aluno_id: aluno_id || null
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      mensagem: "Treino salvo com sucesso na biblioteca!", 
      treino 
    });
  } catch (erro) {
    console.error("Erro ao salvar treino:", erro);
    res.status(500).json({ erro: "Falha ao salvar o treino no banco de dados." });
  }
});

module.exports = router;
