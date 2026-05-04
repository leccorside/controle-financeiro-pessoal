import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
});

export function ProfileForm({ onSubmit, defaultValues, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome</label>
        <Input placeholder="Seu nome" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">E-mail</label>
        <Input type="email" placeholder="email@exemplo.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Atualizar Perfil'}
        </Button>
      </div>
    </form>
  );
}
