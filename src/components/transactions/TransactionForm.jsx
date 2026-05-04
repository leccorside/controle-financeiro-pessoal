import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../services/utils';

const transactionSchema = z.object({
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  amount: z.string().min(1, 'O valor é obrigatório'),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.string().min(1, 'A categoria é obrigatória'),
  date: z.string().min(1, 'A data é obrigatória'),
});

export function TransactionForm({ onSubmit, defaultValues, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const type = watch('type');

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="flex p-1 bg-secondary rounded-lg mb-4">
        <label className={cn(
          "flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-all",
          type === 'INCOME' ? "bg-background text-success shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}>
          <input type="radio" value="INCOME" {...register('type')} className="hidden" />
          Receita
        </label>
        <label className={cn(
          "flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-all",
          type === 'EXPENSE' ? "bg-background text-destructive shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}>
          <input type="radio" value="EXPENSE" {...register('type')} className="hidden" />
          Despesa
        </label>
        <label className={cn(
          "flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-all",
          type === 'INVESTMENT' ? "bg-background text-blue-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}>
          <input type="radio" value="INVESTMENT" {...register('type')} className="hidden" />
          Investimento
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Input placeholder="Ex: Salário, Aluguel, Mercado..." {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor (R$)</label>
          <Input type="number" step="0.01" placeholder="0,00" {...register('amount')} />
          {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data</label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoria</label>
        <select 
          {...register('category')}
          className="flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione...</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Moradia">Moradia</option>
          <option value="Lazer">Lazer</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
          <option value="Investimentos">Investimentos</option>
        </select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
