# 💰 Financeiro Pro — Controle Financeiro Inteligente

Sistema web moderno e responsivo para controle financeiro pessoal, integrando gestão de receitas, despesas e insights inteligentes com uma interface premium.

![Dashboard Preview](src/assets/hero.png)

## ✨ Funcionalidades (Fase 1 - Frontend)

- **Dashboard Inteligente**: Visão geral de saldo, receitas e despesas com gráficos dinâmicos.
- **Gráficos de Performance**: Fluxo de caixa mensal e distribuição de gastos por categoria usando Recharts.
- **Gestão de Transações**: CRUD completo (Criar, Editar, Excluir) com formulários validados.
- **Categorias Personalizadas**: Gerenciamento de categorias com escolha de cores e ícones.
- **Insights de IA (Mock)**: Sugestões automáticas para economia e investimentos.
- **Sistema de Autenticação (Mock)**: Telas de Login/Cadastro com proteção de rotas privadas.
- **Painel Administrativo**: Gestão de usuários e permissões (Exclusivo para perfis ADMIN).
- **Design System Premium**:
  - 🌙 Dark Mode nativo.
  - 🎨 Paleta de cores sofisticada.
  - 📱 Layout 100% Responsivo (Mobile First).

## 🚀 Tecnologias Utilizadas

- **Core**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Gerenciamento de Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Roteamento**: [React Router v6](https://reactrouter.com/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Tipografia**: Google Fonts (Inter & Outfit)

## 📦 Como Instalar e Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Passo a Passo

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/leccorside/controle-financeiro-pessoal.git
   cd controle-financeiro
   ```

2. **Instalar dependências**

   ```bash
   npm install
   ```

3. **Rodar o projeto em modo desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acessar no navegador**
   Abra [http://localhost:5173](http://localhost:5173) para visualizar o projeto.

---

## 🛠️ Roadmap de Desenvolvimento

### FASE 1: Frontend & UI (Concluído ✅)

- [x] Estrutura base e Design System.
- [x] Dashboards e Gráficos.
- [x] CRUDs com dados mockados.

### FASE 2: Backend & Integração (Próxima Etapa 🚧)

- [ ] Setup Node.js + Prisma + PostgreSQL.
- [ ] API de Autenticação Real (JWT).
- [ ] Endpoints de Transações e Categorias.
- [ ] Integração com IA Real (OpenAI/Gemini).
- [ ] Deploy em Produção (Vercel/Neon).

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Johnathan Amorim](https://github.com/leccorside)
