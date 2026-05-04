import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Sparkles, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../services/utils';

export function AIInsights({ filters }) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/ai/insights', { params: filters });
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Erro ao buscar insights da IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [filters.month, filters.year]);

  return (
    <Card className="border-primary/20 bg-primary/5 text-card-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="text-primary animate-pulse" size={20} />
            Insights da IA
          </CardTitle>
          <CardDescription>Análise inteligente baseada nos seus dados reais</CardDescription>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={isLoading}
          className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
        >
          {isLoading ? 'Analisando...' : 'Atualizar Insights'}
        </button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="text-primary animate-spin" size={32} />
            <p className="text-sm text-muted-foreground animate-pulse">A IA está processando seus dados...</p>
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className="p-2 rounded-lg shrink-0 bg-primary/10 text-primary">
                <Lightbulb size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold">Dica Financeira</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight}
                </p>
              </div>
              <ArrowRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Sem dados suficientes para gerar insights.</p>
        )}
      </CardContent>
    </Card>
  );
}
