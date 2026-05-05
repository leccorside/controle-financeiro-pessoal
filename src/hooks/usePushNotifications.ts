import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const VAPID_PUBLIC_KEY = 'BHCE4xZNFpR7aV5S8IzW9d3QwE5-r8ouSj2zzHwRp2ckCPGlTGYnq7IXOrOcXjD_qKuKGYpNu2FIUYm0hv0EjJc';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = useCallback(async () => {
    try {
      setLoading(true);
      const registration = await navigator.serviceWorker.ready;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Enviar assinatura para o backend
      const subJSON = sub.toJSON();
      console.log('[Push Hook] Enviando assinatura para o backend:', subJSON);
      
      await api.post('/notifications/subscribe', {
        subscription: {
          endpoint: subJSON.endpoint,
          keys: {
            auth: subJSON.keys?.auth,
            p256dh: subJSON.keys?.p256dh
          }
        }
      });

      setSubscription(sub);
      setPermission(Notification.permission);
      return true;
    } catch (error) {
      console.error('Erro detalhado ao subscrever para push:', error);
      if (error instanceof Error) {
        console.error('Nome do erro:', error.name);
        console.error('Mensagem do erro:', error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      setLoading(true);
      if (subscription) {
        console.log('[Push Hook] Tentando desinscrever endpoint:', subscription.endpoint);
        await subscription.unsubscribe();
        
        // Avisar backend
        await api.post('/notifications/unsubscribe', {
          endpoint: subscription.endpoint
        });

        console.log('[Push Hook] Desinscrito com sucesso no browser e backend');
        setSubscription(null);
      }
      return true;
    } catch (error) {
      console.error('Erro ao desinscrever do push:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    subscription,
    permission,
    loading,
    subscribe,
    unsubscribe,
    isSubscribed: !!subscription
  };
}
