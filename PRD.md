# 📄 PRD — Sistema de Controle Financeiro Pessoal (Web)

## 1. Visão Geral

Sistema web responsivo para controle financeiro pessoal, permitindo gerenciamento de receitas, despesas, categorias e análise inteligente dos gastos com apoio de IA.

- **Plataforma:** Web (Responsivo - Mobile + Desktop)
- **Frontend:** React (Vite ou Next.js recomendado)
- **Backend:** Node.js (API REST ou Serverless)
- **Banco de Dados:** PostgreSQL
- **Deploy:** Vercel (frontend + serverless functions)

---

## 2. Objetivo

Permitir que usuários controlem suas finanças de forma simples, visual e inteligente, oferecendo insights automatizados para economia e melhoria financeira.

---

## 3. Perfis de Usuário

### 👤 USER

- Gerenciar receitas e despesas
- Visualizar dashboard
- Categorizar transações
- Receber insights de IA

### 🛠️ ADMIN

- Todas permissões do USER
- Criar/editar/remover usuários
- Gerenciar categorias globais
- Visualizar dados gerais do sistema

---

## 4. Funcionalidades

### 4.1 Autenticação

- Login (email/senha)
- Cadastro
- Recuperação de senha
- Controle de sessão (JWT)

---

### 4.2 Dashboard

**Componentes:**

- Total de receitas
- Total de despesas
- Saldo atual

**Gráficos:**

- Pizza (gastos por categoria)
- Linha (evolução mensal)
- Barra (receitas vs despesas)

---

### 4.3 Transações

**Tipos:**

- Receita
- Despesa

**Campos:**

- Valor
- Categoria
- Data
- Descrição
- Tipo

**Funcionalidades:**

- CRUD completo
- Filtros por data, categoria e tipo

---

### 4.4 Categorias

**Tipos:**

- Receitas
- Despesas

**Funcionalidades:**

- CRUD
- Ícones (Lucide / FontAwesome)
- Cor personalizada

---

### 4.5 Inteligência Artificial

**Funções:**

- Análise de gastos
- Sugestões automáticas
- Identificação de padrões
- Insights mensais

**Exemplos:**

- "Você está gastando muito com alimentação"
- "Reduza 15% em transporte para economizar R$300"

---

### 4.6 Gestão de Usuários (ADMIN)

- Criar usuários
- Editar usuários
- Remover usuários
- Definir permissões (ADMIN / USER)

---

### 4.7 Tema (UI/UX)

- Dark mode (padrão)
- Alternar para Light
- Persistência da escolha

---

### 4.8 Responsividade

- Mobile-first
- Layout adaptável
- Sidebar colapsável

---

## 5. Requisitos Funcionais

- CRUD de transações
- CRUD de categorias
- Dashboard com gráficos
- Autenticação
- Controle de permissões
- IA com sugestões

---

## 6. Requisitos Não Funcionais

- Alta performance (<300ms)
- Segurança (JWT + bcrypt)
- Escalável (serverless)
- UX intuitiva

---

## 7. Modelagem de Dados

### users

```sql
id UUID PRIMARY KEY,
name TEXT,
email TEXT UNIQUE,
password TEXT,
role VARCHAR CHECK (role IN ('ADMIN','USER')),
created_at TIMESTAMP
```

### categories

```sql
id UUID PRIMARY KEY,
name TEXT,
type VARCHAR CHECK (type IN ('INCOME','EXPENSE')),
icon TEXT,
color TEXT,
user_id UUID
```

### transactions

```sql
id UUID PRIMARY KEY,
amount DECIMAL,
type VARCHAR CHECK (type IN ('INCOME','EXPENSE')),
description TEXT,
date DATE,
category_id UUID,
user_id UUID,
created_at TIMESTAMP
```

---

## 8. Arquitetura

### Frontend

- React
- TailwindCSS
- Zustand ou Redux
- Recharts / Chart.js

### Backend

- Node.js
- API REST / Serverless
- Prisma ORM

### Deploy

- Vercel
- PostgreSQL (Neon / Supabase)

---

## 9. Fluxos

### Login

1. Usuário envia credenciais
2. Sistema valida
3. Retorna JWT
4. Redireciona

### Criar Transação

1. Preenche dados
2. Seleciona categoria
3. Salva
4. Atualiza dashboard

### IA

1. Analisa histórico
2. Gera insights
3. Exibe no dashboard

---

## 10. UI Componentes

- Sidebar
- Header
- Cards financeiros
- Gráficos
- Tabelas
- Modais
- Botões com ícones

---

## 11. Segurança

- bcrypt (hash de senha)
- JWT
- Proteção de rotas
- Validação backend

---

## 12. Diferenciais

- IA integrada
- Dark mode
- Dashboard completo
- Multiusuário com roles
- Categorias personalizadas

---

## 13. Roadmap

### MVP

- Login
- CRUD transações
- Dashboard básico

### Fase 2

- Categorias
- Tema dark/light

### Fase 3

- IA insights
- Admin panel

### Fase 4

- Analytics avançado

---

## 14. Futuro

- Open Finance
- App mobile
- Exportação (PDF/Excel)
- Metas financeiras
- Notificações
