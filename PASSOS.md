# 🚀 Roteiro de Implementação — Sistema de Controle Financeiro

Este documento descreve os passos para a construção do projeto, dividido em duas fases principais. A **Fase 1** foca no desenvolvimento do Frontend com dados mockados para testes imediatos, e a **Fase 2** foca na construção do Backend e integração final.

---

## FASE 1 - FRONTEND (Dados Mock)

Nesta fase, o objetivo é criar toda a interface e experiência do usuário (UX) sem depender de uma API real.

### Passo 1: Setup Inicial do Projeto
- Inicializar projeto com React + Vite.
- Configurar TailwindCSS e biblioteca de ícones Lucide React.
- Estruturar pastas: `src/components`, `src/pages`, `src/hooks`, `src/context`, `src/services`, `src/styles`.
- **Commit:** `feat: setup inicial do projeto com react e tailwindcss`

### Passo 2: Design System e Tema (Dark/Light)
- Configurar tokens de cores e fontes no `tailwind.config.js`.
- Implementar `ThemeProvider` para gerenciar modo escuro/claro.
- Criar componentes base: Botões, Inputs e Cards estilizados.
- **Commit:** `feat: implementação do design system e suporte a dark mode`

### Passo 3: Layout Base e Navegação
- Criar a `Sidebar` (responsiva e colapsável) e o `Header`.
- Configurar o `React Router` para navegação entre páginas.
- Implementar o container principal que envolve as páginas.
- **Commit:** `feat: estrutura de layout base e navegação`

### Passo 4: Telas de Autenticação (UI Mock)
- Desenvolver telas de Login e Cadastro.
- Criar um `AuthContext` mockado que simula login bem-sucedido e protege rotas.
- **Commit:** `feat: telas de login e cadastro com autenticação mockada`

### Passo 5: Dashboard - Resumo e Gráficos (Mock)
- Criar cards de resumo (Receitas, Despesas, Saldo).
- Integrar `Recharts` para exibir gráficos de pizza (categorias) e linha (evolução).
- Utilizar dados estáticos para popular os componentes.
- **Commit:** `feat: dashboard com resumo financeiro e gráficos mockados`

### Passo 6: Listagem de Transações e Filtros (Mock)
- Desenvolver a tabela de transações com design responsivo.
- Implementar componentes de filtro por data, tipo e categoria.
- **Commit:** `feat: listagem de transações com filtros e dados mockados`

### Passo 7: CRUD de Transações - Formulários e Modais (Mock)
- Criar modais para "Nova Transação" e "Editar Transação".
- Validar campos com `React Hook Form` e `Zod`.
- Simular a persistência de dados no estado local (Zustand ou Context).
- **Commit:** `feat: funcionalidade de crud de transações (mock)`

### Passo 8: Gerenciamento de Categorias (Mock)
- Criar tela para visualizar e gerenciar categorias de gastos/receitas.
- Implementar seletor de cores e ícones para as categorias.
- **Commit:** `feat: gerenciamento de categorias com dados mockados`

### Passo 9: Interface de Insights de IA (Mock)
- Criar seção no Dashboard para exibir sugestões automáticas.
- Estilizar mensagens de "Dicas da IA" com feedbacks visuais premium.
- **Commit:** `feat: interface de insights de ia com mensagens mockadas`

### Passo 10: Painel Administrativo - Usuários (Mock)
- Desenvolver a interface de gestão de usuários (exclusivo para ADMIN).
- Listagem de usuários cadastrados e alteração de permissões.
- **Commit:** `feat: interface do painel administrativo (mock)`

---

## FASE 2 - BACKEND

Nesta fase, construiremos a infraestrutura de dados e a lógica de servidor.

### Passo 11: Setup do Backend e Banco de Dados
- Inicializar projeto Node.js e configurar o Prisma ORM.
- Definir os modelos no `schema.prisma` (User, Category, Transaction).
- Configurar banco de dados PostgreSQL (via Docker ou serviço Cloud).
- **Commit:** `feat: setup do backend, prisma e banco de dados`

### Passo 12: Autenticação com JWT e Segurança
- Implementar rotas de registro e login no servidor.
- Configurar hash de senha com `bcrypt` e geração de tokens `JWT`.
- Criar middlewares de proteção de rotas.
- **Commit:** `feat: implementação de autenticação real com jwt e bcrypt`

### Passo 13: API de Categorias
- Desenvolver os endpoints CRUD para categorias.
- Garantir que usuários só acessem suas próprias categorias ou categorias globais.
- **Commit:** `feat: endpoints da api para gerenciamento de categorias`

### Passo 14: API de Transações
- Desenvolver os endpoints CRUD para transações.
- Implementar lógica de agregação no banco para retornar totais de saldo/gastos.
- **Commit:** `feat: endpoints da api para gerenciamento de transações`

### Passo 15: Integração com Inteligência Artificial
- Configurar integração com a API da OpenAI ou Google Gemini.
- Criar o serviço que processa os gastos do usuário e solicita insights à IA.
- **Commit:** `feat: integração com api de ia para geração de insights`

### Passo 16: API Administrativa e Gestão de Usuários
- Implementar rotas de gerenciamento de usuários.
- Adicionar verificação de nível de acesso (Role: ADMIN).
- **Commit:** `feat: endpoints administrativos para gestão de usuários`

### Passo 17: Integração Frontend + API
- Substituir todos os `services` mockados do frontend por chamadas reais via `Axios`.
- Implementar `React Query` ou `SWR` para cache e sincronização de dados.
- **Commit:** `feat: integração completa do frontend com a api real`

### Passo 18: Finalização e Deploy
- Realizar testes de ponta a ponta (E2E).
- Configurar CI/CD e realizar deploy no Vercel (Frontend/Backend) e Neon (Banco).
- **Commit:** `chore: refinamentos finais e configurações de deploy`
