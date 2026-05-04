import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../services/utils';
import * as LucideIcons from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().min(1, 'A cor é obrigatória'),
  icon: z.string().min(1, 'O ícone é obrigatório'),
});

const availableIcons = [
  'Briefcase', 'Utensils', 'Home', 'Palmtree', 'Activity', 
  'ShoppingBag', 'Car', 'Plane', 'Book', 'Music', 
  'Smartphone', 'CreditCard', 'Gift', 'Coffee'
];

const availableColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#ec4899', '#71717a', '#0ea5e9', '#f97316'
];

export function CategoryForm({ onSubmit, defaultValues, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      type: 'EXPENSE',
      color: availableColors[0],
      icon: availableIcons[0]
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const type = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex p-1 bg-secondary rounded-lg">
        <label className={cn(
          "flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-all",
          type === 'INCOME' ? "bg-background text-success shadow-sm" : "text-muted-foreground"
        )}>
          <input type="radio" value="INCOME" {...register('type')} className="hidden" />
          Receita
        </label>
        <label className={cn(
          "flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-all",
          type === 'EXPENSE' ? "bg-background text-destructive shadow-sm" : "text-muted-foreground"
        )}>
          <input type="radio" value="EXPENSE" {...register('type')} className="hidden" />
          Despesa
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nome da Categoria</label>
        <Input placeholder="Ex: Alimentação, Lazer..." {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Cor</label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                selectedColor === color ? "border-foreground scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Ícone</label>
        <div className="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto p-2 border border-border rounded-md bg-input">
          {availableIcons.map((iconName) => {
            const Icon = LucideIcons[iconName];
            return (
              <button
                key={iconName}
                type="button"
                className={cn(
                  "p-2 rounded-md transition-all flex items-center justify-center",
                  selectedIcon === iconName ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
                onClick={() => setValue('icon', iconName)}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Salvar Categoria
        </Button>
      </div>
    </form>
  );
}
