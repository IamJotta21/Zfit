-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS public.alunos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  telefone TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status_presenca JSONB DEFAULT '[]'::jsonb
);

-- Tabela da Biblioteca de Treinos
CREATE TABLE IF NOT EXISTS public.treinos_biblioteca (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_treino TEXT NOT NULL,
  objetivo TEXT,
  nivel TEXT,
  observacoes TEXT,
  exercicios JSONB NOT NULL DEFAULT '[]'::jsonb,
  aluno_id UUID REFERENCES public.alunos(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Financeiro de Alunos
CREATE TABLE IF NOT EXISTS public.financeiro_alunos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  plano TEXT NOT NULL, -- Ex: 'Base', 'Ouro', 'Platina'
  data_inicio DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  valor_personalizado NUMERIC(10, 2) NOT NULL,
  status_pagamento TEXT NOT NULL DEFAULT 'PENDENTE', -- 'PAGO', 'PENDENTE', 'INADIMPLENTE'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações Avançadas do Sistema
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id INT PRIMARY KEY DEFAULT 1, -- Teremos apenas 1 registro de configuração global
  url_logo TEXT,
  cor_primaria_hex TEXT DEFAULT '#10b981',
  dias_tolerancia INT DEFAULT 3,
  lembrete_vencimento BOOLEAN DEFAULT true,
  notificacao_bloqueio BOOLEAN DEFAULT true,
  permitir_carga_fracionada BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração padrão inicial
INSERT INTO public.configuracoes (id) VALUES (1) ON CONFLICT DO NOTHING;
