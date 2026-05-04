const prisma = require('../lib/prisma');

const getTransactions = async (req, res) => {
  try {
    const { month, year, type, category, status } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (month && month !== 'all') {
      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 0);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (type && type !== 'all') where.type = type;
    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') {
      where.category = {
        name: category
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { date: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações.' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, categoryId, date, status } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        status: status || 'PENDING',
        date: new Date(date),
        userId: req.user.id,
        categoryId
      },
      include: {
        category: true
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar transação.' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, categoryId, date, status } = req.body;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: amount ? parseFloat(amount) : undefined,
        type,
        status,
        date: date ? new Date(date) : undefined,
        categoryId
      },
      include: {
        category: true
      }
    });

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar transação.' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transação excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir transação.' });
  }
};

const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

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

    const summary = transactions.reduce((acc, t) => {
      if (t.type === 'INCOME') acc.income += t.amount;
      if (t.type === 'EXPENSE') acc.expense += t.amount;
      if (t.type === 'INVESTMENT') acc.investment += t.amount;
      return acc;
    }, { income: 0, expense: 0, investment: 0 });

    summary.balance = summary.income - summary.expense;

    // Agregação por categoria (apenas despesas)
    const categorySpending = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true }
    });

    // Buscar nomes das categorias para o gráfico
    const categories = await prisma.category.findMany({
      where: { id: { in: categorySpending.map(c => c.categoryId) } }
    });

    const categorySummary = categorySpending.map(cs => {
      const cat = categories.find(c => c.id === cs.categoryId);
      return {
        name: cat.name,
        value: cs._sum.amount,
        color: cat.color
      };
    });

    res.json({
      ...summary,
      categorySpending: categorySummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar resumo.' });
  }
};

module.exports = { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getSummary
};
