const prisma = require('../lib/prisma');
const webpush = require('web-push');

// Configurar Web Push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:exemplo@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class NotificationController {
  async subscribe(req, res) {
    try {
      const { subscription } = req.body;
      const userId = req.user.id;

      console.log('[Push] Recebendo tentativa de subscrição para usuário:', userId);

      if (!subscription || !subscription.endpoint || !subscription.keys) {
        console.error('[Push] Assinatura incompleta:', subscription);
        return res.status(400).json({ error: 'Assinatura inválida ou incompleta' });
      }

      const { endpoint, keys } = subscription;

      if (!keys.auth || !keys.p256dh) {
        console.error('[Push] Chaves de criptografia ausentes:', keys);
        return res.status(400).json({ error: 'Chaves de criptografia são obrigatórias' });
      }

      // Salvar ou atualizar assinatura
      await prisma.pushSubscription.upsert({
        where: { endpoint },
        update: {
          auth: keys.auth,
          p256dh: keys.p256dh,
          userId: userId
        },
        create: {
          endpoint,
          auth: keys.auth,
          p256dh: keys.p256dh,
          userId: userId
        }
      });

      console.log('[Push] Subscrição salva com sucesso para:', endpoint);
      res.status(201).json({ message: 'Inscrito com sucesso para notificações push' });
    } catch (error) {
      console.error('Erro detalhado ao subscrever:', error);
      res.status(500).json({ error: 'Erro interno ao salvar assinatura', details: error.message });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint não fornecido' });
      }

      console.log('[Push] Removendo assinatura para endpoint:', endpoint);

      // Usar deleteMany para evitar erro se o registro não existir
      await prisma.pushSubscription.deleteMany({
        where: { endpoint }
      });

      res.status(200).json({ message: 'Assinatura removida com sucesso' });
    } catch (error) {
      console.error('Erro detalhado ao desinscrever:', error);
      res.status(500).json({ error: 'Erro ao remover assinatura', details: error.message });
    }
  }

  async sendCustom(req, res) {
    try {
      const { title, message, url, icon, image, userId } = req.body;

      // Apenas admin pode enviar (middleware deve garantir isso)
      
      let subscriptions;
      if (userId) {
        subscriptions = await prisma.pushSubscription.findMany({
          where: { userId }
        });
      } else {
        subscriptions = await prisma.pushSubscription.findMany();
      }

      const payload = JSON.stringify({
        title: title || 'Notificação',
        body: message || '',
        data: {
          url: url || '/'
        },
        icon: icon || '/favicon.svg',
        image: image || null
      });

      const sendPromises = subscriptions.map(sub => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh
          }
        };

        return webpush.sendNotification(pushConfig, payload)
          .catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              // Assinatura expirada ou inválida, remover do banco
              return prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
            console.error('Erro ao enviar push:', err);
          });
      });

      await Promise.all(sendPromises);

      res.json({ message: `Notificação enviada para ${subscriptions.length} dispositivos` });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      res.status(500).json({ error: 'Erro ao processar envio de notificações' });
    }
  }

  async runOverdueJob(req, res) {
    try {
      const { checkOverdueExpenses } = require('../services/cronService');
      await checkOverdueExpenses();
      res.json({ message: 'Job de notificações de atraso executado com sucesso!' });
    } catch (error) {
      console.error('Erro ao executar job manual:', error);
      res.status(500).json({ error: 'Erro ao executar o job de notificações' });
    }
  }
}

module.exports = new NotificationController();
