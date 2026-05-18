require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERRO CRÍTICO: Variáveis do Supabase não encontradas no arquivo .env");
  console.error("Certifique-se de definir SUPABASE_URL e SUPABASE_ANON_KEY.");
  process.exit(1);
}

// Cria o cliente global do Supabase para persistência de dados
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
