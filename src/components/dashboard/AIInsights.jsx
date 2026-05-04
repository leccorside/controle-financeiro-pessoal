import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Sparkles, TrendingDown, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { cn } from '../../services/utils';

const mockInsights = [
  {
    id: '1',
    title: 'Economia em Alimentação',
    description: 'Seus gastos com restaurantes subiram 15% este mês. Que tal cozinhar em casa este fim de semana?',
    type: 'saving',
    icon: TrendingDown,
    color: 'text-success bg-success/10'
  },
  {
    id: '2',
    title: 'Dica de Investimento',
    description: 'Você manteve um saldo positivo por 3 meses. Já pensou em colocar R$ 500,00 no Tesouro Direto?',
    type: 'investment',
    icon: Lightbulb,
    color: 'text-primary bg-primary/10'
  },
  {
    id: '3',
    title: 'Meta de Reserva',
    description: 'Faltam apenas R$ 1.200,00 para você completar sua reserva de emergência de 3 meses.',
    type: 'goal',
    icon: Target,
    color: 'text-warning bg-warning/10'
  }
];

export function AIInsights() {
  return (
    <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="text-primary animate-pulse" size={20} />
            Insights da IA
          </CardTitle>
          <CardDescription>Análise inteligente do seu comportamento financeiro</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mockInsights.map((insight) => (
          <div 
            key={insight.id} 
            className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group cursor-pointer"
          >
            <div className={cn("p-2 rounded-lg shrink-0", insight.color)}>
              <insight.icon size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold">{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </div>
            <ArrowRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
