const { generateInsights } = require('../services/aiService');
const prisma = require('../lib/prisma');

const getAIInsights = async (req, res) => {
  try {
    const { month, year } = req.query;

    // 1. Buscar dados reais do banco para o resumo
    const where = { userId: req.user.id };
    if (month && month !== 'all') {
      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 0);
      where.date = { gte: startDate, lte: endDate };
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    const transactions = await prisma.transaction.findMany({ where });
    
    // SE NÃO HOUVER TRANSAÇÕES, NÃO CHAMA A IA
    if (transactions.length === 0) {
      return res.json({ 
        insights: ["Ainda não temos dados suficientes para gerar insights. Comece cadastrando suas primeiras transações!"],
        status: 'no_data' 
      });
    }

    // Verificar se a API Key está configurada antes de chamar o serviço
    const provider = process.env.AI_PROVIDER || 'gemini';
    const hasApiKey = (provider === 'openai' && process.env.OPENAI_API_KEY) || 
                      (provider === 'gemini' && process.env.GEMINI_API_KEY) ||
                      (provider === 'groq' && process.env.GROQ_API_KEY);

    if (!hasApiKey) {
      return res.json({
        insights: ["Para receber dicas da IA, configure sua API Key do Gemini ou OpenAI no arquivo .env do servidor."],
        status: 'no_config'
      });
    }

    // Calcular resumo para o prompt
    const summary = transactions.reduce((acc, t) => {
      if (t.type === 'INCOME') acc.income += t.amount;
      if (t.type === 'EXPENSE') acc.expense += t.amount;
      if (t.type === 'INVESTMENT') acc.investment += t.amount;
      return acc;
    }, { income: 0, expense: 0, investment: 0 });

    summary.balance = summary.income - summary.expense;

    const categorySpending = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true }
    });

    const categories = await prisma.category.findMany({
      where: { id: { in: categorySpending.map(c => c.categoryId) } }
    });

    summary.categorySpending = categorySpending.map(cs => ({
      name: categories.find(c => c.id === cs.categoryId)?.name || 'Outros',
      value: cs._sum.amount
    }));

    // 2. Chamar o serviço de IA
    const insights = await generateInsights(summary);
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAIInsights };
