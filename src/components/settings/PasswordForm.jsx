import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme a nova senha'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export function PasswordForm({ onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Senha Atual</label>
        <Input type="password" placeholder="******" {...register('currentPassword')} />
        {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nova Senha</label>
        <Input type="password" placeholder="******" {...register('newPassword')} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirmar Nova Senha</label>
        <Input type="password" placeholder="******" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
        </Button>
      </div>
    </form>
  );
}
