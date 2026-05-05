import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { cn } from '../../services/utils';
import { Button } from '../ui/Button';
import api from '../../services/api';

export function NotificationPopup() {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Lógica de data robusta contra fuso horário
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA'); // Retorna YYYY-MM-DD

  const checkIsToday = (dateStr) => {
    if (!dateStr) return false;
    return dateStr.startsWith(todayStr);
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/transactions/alerts');
        if (response.data && response.data.length > 0) {
          setAlerts(response.data);
          const dismissedAlerts = JSON.parse(sessionStorage.getItem('dismissed_alerts') || '[]');
          const newAlerts = response.data.filter(a => !dismissedAlerts.includes(a.id));
          
          if (newAlerts.length > 0) {
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar alertas de vencimento:', error);
      }
    };

    if (!hasChecked) {
      fetchAlerts();
      setHasChecked(true);
    }
  }, [hasChecked]);

  const handleDismiss = () => {
    setIsVisible(false);
    const dismissedIds = alerts.map(a => a.id);
    sessionStorage.setItem('dismissed_alerts', JSON.stringify(dismissedIds));
  };

  if (!isVisible || alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-card border border-primary/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 bg-primary/10 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
              <Bell size={18} />
            </div>
            <span className="font-bold text-sm font-heading">Lembrete de Vencimento</span>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-primary/20 rounded-full transition-colors text-muted-foreground hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "p-3 rounded-xl border transition-colors flex flex-col gap-2",
                checkIsToday(alert.date) 
                  ? "bg-destructive/5 border-destructive/20" 
                  : "bg-accent/50 border-border"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-bold text-sm leading-tight">{alert.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                    <Calendar size={12} className="text-primary" />
                    {checkIsToday(alert.date) ? 'Vence Hoje' : 'Vence Amanhã'}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(alert.amount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-accent/20 border-t border-border flex items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground leading-tight">
            Você tem {alerts.length} {alerts.length === 1 ? 'pendência' : 'pendências'} para os próximos dias.
          </p>
          <Button size="sm" className="h-8 text-xs gap-1.5 px-4" onClick={handleDismiss}>
            Entendido
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
