import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['ADMIN', 'USER']),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
});

export function UserForm({ onSubmit, defaultValues, onCancel }) {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues || {
      role: 'USER',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome Completo</label>
        <Input placeholder="Digite o nome..." {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">E-mail</label>
        <Input type="email" placeholder="email@exemplo.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
        </label>
        <Input type="password" placeholder="******" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cargo</label>
        <select 
          {...register('role')}
          className="flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="USER">Usuário Comum</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
        </Button>
      </div>
    </form>
  );
}
