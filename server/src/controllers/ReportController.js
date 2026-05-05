const prisma = require('../lib/prisma');
const { startOfMonth, subMonths, format, endOfMonth } = require('date-fns');
const { ptBR } = require('date-fns/locale');

class ReportController {
  async getComparison(req, res) {
    try {
      const userId = req.user.id;
      const monthsToLookBack = 12;
      const today = new Date();

      // Buscar transações dos últimos 12 meses
      const startDate = startOfMonth(subMonths(today, monthsToLookBack));
      
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate
          }
        },
        include: {
          category: true
        },
        orderBy: {
          date: 'asc'
        }
      });

      // Agrupar por mês
      const monthlyData = {};
      
      transactions.forEach(t => {
        const monthKey = format(new Date(t.date), 'yyyy-MM');
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: format(new Date(t.date), 'MMM/yy', { locale: ptBR }),
            income: 0,
            expense: 0,
            categories: {}
          };
        }

        if (t.type === 'INCOME') {
          monthlyData[monthKey].income += Number(t.amount);
        } else if (t.type === 'EXPENSE') {
          monthlyData[monthKey].expense += Number(t.amount);
          
          const catName = t.category?.name || 'Outros';
          monthlyData[monthKey].categories[catName] = (monthlyData[monthKey].categories[catName] || 0) + Number(t.amount);
        }
      });

      const history = Object.keys(monthlyData).sort().map(key => ({
        key,
        ...monthlyData[key]
      }));

      // Calcular variações em relação ao mês anterior (se houver)
      const comparison = history.map((curr, idx) => {
        if (idx === 0) return { ...curr, variation: 0 };
        
        const prev = history[idx - 1];
        const variation = prev.expense > 0 
          ? ((curr.expense - prev.expense) / prev.expense) * 100 
          : 0;
          
        return {
          ...curr,
          variation: Number(variation.toFixed(2))
        };
      });

      res.json(comparison);
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo:', error);
      res.status(500).json({ error: 'Erro ao gerar dados do relatório' });
    }
  }
}

module.exports = new ReportController();
