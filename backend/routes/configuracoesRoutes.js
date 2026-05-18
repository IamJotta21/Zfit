const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

/**
 * GET /api/configuracoes
 * Busca as configurações globais do sistema.
 */
router.get('/', async (req, res) => {
  try {
    const { data: config, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 é row not found
    res.status(200).json(config || {});
  } catch (erro) {
    console.error("Erro ao carregar configurações:", erro);
    res.status(500).json({ erro: "Falha ao buscar configurações globais." });
  }
});

/**
 * PUT /api/configuracoes
 * Salva as configurações avançadas do sistema (White-labeling, Automação, Motor de Treinos).
 */
router.put('/', async (req, res) => {
  try {
    const configuracoes = req.body;

    if (Object.keys(configuracoes).length === 0) {
      return res.status(400).json({ erro: "Nenhum parâmetro de configuração foi enviado." });
    }

    // Teremos apenas o ID 1 para a configuração global
    const { data: configAtualizada, error } = await supabase
      .from('configuracoes')
      .update(configuracoes)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ 
      mensagem: "Configurações avançadas salvas com sucesso!", 
      configuracoes: configAtualizada 
    });
  } catch (erro) {
    console.error("Erro ao atualizar configurações:", erro);
    res.status(500).json({ erro: "Falha ao salvar as configurações no banco de dados." });
  }
});

module.exports = router;
