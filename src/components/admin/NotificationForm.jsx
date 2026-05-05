import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Bell, Link as LinkIcon, Image as ImageIcon, Send, Loader2 } from 'lucide-react';

const notificationSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  message: z.string().min(1, 'A mensagem é obrigatória'),
  url: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
});

export function NotificationForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      url: '/',
      icon: '',
      image: '',
    }
  });

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            Título da Notificação
          </label>
          <Input 
            {...register('title')}
            placeholder="Ex: Nova funcionalidade disponível!"
            error={errors.title?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Conteúdo da Mensagem</label>
          <textarea 
            {...register('message')}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva o conteúdo da notificação..."
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <LinkIcon size={16} className="text-muted-foreground" />
              Link de Destino
            </label>
            <Input 
              {...register('url')}
              placeholder="Ex: /dashboard ou https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon size={16} className="text-muted-foreground" />
              URL da Imagem (Opcional)
            </label>
            <Input 
              {...register('image')}
              placeholder="https://exemplo.com/imagem.png"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button 
          type="submit" 
          className="gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Enviar para Todos os Dispositivos
        </Button>
      </div>
    </form>
  );
}
