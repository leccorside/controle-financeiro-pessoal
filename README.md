# 💰 Financeiro Pro — Controle Financeiro Inteligente

Sistema web moderno e responsivo para controle financeiro pessoal, integrando gestão de receitas, despesas e insights inteligentes com uma interface premium.

![Dashboard Preview](src/assets/hero.png)

## ✨ Funcionalidades
- **Dashboard Dinâmico**: Visão geral de saldo, receitas e despesas com gráficos interativos.
- **Gráficos de Performance**: Fluxo de caixa mensal e distribuição de gastos por categoria.
- **Gestão Financeira**: Controle total de transações e categorias personalizadas.
- **Insights com IA Real**: Integração com Groq/Gemini para análise financeira personalizada.
- **Notificações Push**: 
  - Alertas automáticos de contas atrasadas via Cron Job.
  - Envio de notificações personalizadas via Painel Admin.
  - Controle de ativação nas configurações do usuário.
- **Sistema de Autenticação**: Login/Cadastro seguro com JWT e proteção de rotas.
- **Painel Administrativo**: Gestão de usuários, permissões e disparos de notificações.
- **Design System Premium**: Dark mode nativo e interface 100% responsiva.

## 🚀 Tecnologias Utilizadas
- **Frontend**: [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Zustand](https://github.com/pmndrs/zustand).
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma ORM](https://www.prisma.io/).
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (via [Neon.tech](https://neon.tech/)).
- **IA**: [Groq](https://groq.com/) / [Google Gemini](https://ai.google.dev/).
- **Notificações**: [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API).

## 📦 Como Instalar e Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (ou conta no Neon.tech)

### Passo a Passo

1. **Clonar e Instalar**
   ```bash
   git clone https://github.com/leccorside/controle-financeiro-pessoal.git
   cd controle-financeiro
   npm install
   cd server && npm install
   ```

2. **Configurar Variáveis de Ambiente**
   Crie um arquivo `.env` na pasta `server/` com as chaves:
   ```env
   DATABASE_URL=...
   JWT_SECRET=...
   GROQ_API_KEY=...
   VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   VAPID_SUBJECT=mailto:seu@email.com
   ```

3. **Rodar o Projeto**
   - Frontend: `npm run dev` (na raiz)
   - Backend: `npm run dev` (na pasta `/server`)

---

## 🛠️ Roadmap de Desenvolvimento

### FASE 1: Frontend & UI (Concluído ✅)
- [x] Estrutura base e Design System.
- [x] Dashboards e Gráficos.

### FASE 2: Backend & Integração (Concluído ✅)
- [x] Setup Node.js + Prisma + PostgreSQL (Neon).
- [x] API de Autenticação Real (JWT).
- [x] Integração com IA Real (Groq/Gemini).
- [x] Deploy em Produção (Vercel/Neon).

### FASE 3: Funcionalidades Avançadas (Em andamento 🚀)
- [x] Implementação de Notificações Push.
- [x] Cron Job para automação de alertas.
- [x] Destaque visual de transações atrasadas.
- [ ] Relatórios avançados de exportação.
- [ ] Metas de economia personalizadas.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Johnathan Amorim](https://github.com/leccorside)
