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

// Agendar para rodar todos os dias às 09:00 da manhã
// '0 9 * * *'
// Para testes, podemos colocar para rodar a cada minuto: '* * * * *'
// Mas vamos manter o padrão diário e deixar uma nota.
cron.schedule('0 9 * * *', checkOverdueExpenses);

// Exportar para inicialização manual se necessário
module.exports = { checkOverdueExpenses };
