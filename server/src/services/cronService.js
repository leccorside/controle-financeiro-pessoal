const cron = require('node-cron');
const prisma = require('../lib/prisma');
const webpush = require('web-push');

// Configurar Web Push (redundante se já configurado no Controller, mas seguro aqui também)
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:exemplo@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Função para buscar despesas atrasadas e notificar usuários
 */
async function checkOverdueExpenses() {
  console.log('[CRON] Verificando despesas atrasadas...');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar transações pendentes que venceram antes de hoje
    const overdueTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING',
        type: 'EXPENSE',
        date: {
          lt: today
        }
      },
      include: {
        user: {
          include: {
            pushSubscriptions: true
          }
        }
      }
    });

    console.log(`[CRON] Encontradas ${overdueTransactions.length} transações atrasadas.`);

    for (const transaction of overdueTransactions) {
      const { user, description, amount } = transaction;

      if (user.pushSubscriptions && user.pushSubscriptions.length > 0) {
        const payload = JSON.stringify({
          title: '⚠️ Conta Atrasada!',
          body: `A despesa "${description}" no valor de R$ ${amount.toFixed(2)} está vencida.`,
          data: {
            url: '/transactions'
          },
          icon: '/favicon.svg',
          badge: '/favicon.svg'
        });

        for (const sub of user.pushSubscriptions) {
          const pushConfig = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh
            }
          };

          webpush.sendNotification(pushConfig, payload)
            .catch(err => {
              if (err.statusCode === 410 || err.statusCode === 404) {
                return prisma.pushSubscription.delete({ where: { id: sub.id } });
              }
              console.error(`[CRON] Erro ao enviar push para usuário ${user.id}:`, err.message);
            });
        }
      }
    }
  } catch (error) {
    console.error('[CRON] Erro ao processar job de atrasos:', error);
  }
}

/**
 * Job para enviar relatórios mensais consolidado no dia 1º
 */
async function sendMonthlyReports() {
  console.log('[CRON] Gerando relatórios mensais...');
  
  try {
    const { startOfMonth, subMonths, endOfMonth, format } = require('date-fns');
    const { ptBR } = require('date-fns/locale');
    const { sendMonthlyReport } = require('./emailService');

    const lastMonthDate = subMonths(new Date(), 1);
    const startDate = startOfMonth(lastMonthDate);
    const endDate = endOfMonth(lastMonthDate);
    const monthLabel = format(lastMonthDate, 'MMMM/yyyy', { locale: ptBR });

    const users = await prisma.user.findMany();

    for (const user of users) {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: { category: true }
      });

      if (transactions.length === 0) continue;

      const reportData = {
        month: monthLabel,
        income: 0,
        expense: 0,
        categories: {}
      };

      transactions.forEach(t => {
        if (t.type === 'INCOME') reportData.income += Number(t.amount);
        else if (t.type === 'EXPENSE') {
          reportData.expense += Number(t.amount);
          const catName = t.category?.name || 'Outros';
          reportData.categories[catName] = (reportData.categories[catName] || 0) + Number(t.amount);
        }
      });

      await sendMonthlyReport(user, reportData);
    }
    
    console.log('[CRON] Todos os relatórios mensais foram enviados.');
  } catch (error) {
    console.error('[CRON] Erro ao enviar relatórios mensais:', error);
  }
}

// Job Diário: Alertas de atraso (09:00)
cron.schedule('0 9 * * *', checkOverdueExpenses);

// Job Mensal: Relatórios Consolidado (Dia 1º às 08:00)
cron.schedule('0 8 1 * *', sendMonthlyReports);

module.exports = { checkOverdueExpenses, sendMonthlyReports };
