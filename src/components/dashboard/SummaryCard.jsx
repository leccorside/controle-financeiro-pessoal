import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../services/utils';

export function SummaryCard({ title, value, icon: Icon, trend, type = 'default' }) {
  const typeStyles = {
    income: 'text-success bg-success/10',
    expense: 'text-destructive bg-destructive/10',
    investment: 'text-blue-500 bg-blue-500/10',
    default: 'text-primary bg-primary/10',
  };

  return (
    <Card className="overflow-hidden border-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </h3>
          </div>
          <div className={cn('p-3 rounded-xl', typeStyles[type])}>
            <Icon size={24} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-muted-foreground">em relação ao mês passado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
