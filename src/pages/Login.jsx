import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Wallet, Loader2, Mail, Lock, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para Recuperação de Senha
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotStatus, setForgotStatus] = useState({ type: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsForgotSubmitting(true);
    setForgotStatus({ type: 'idle', message: '' });
    
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStatus({ type: 'success', message: response.data.message });
      setForgotEmail('');
    } catch (err) {
      setForgotStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Erro ao processar solicitação. Verifique se o e-mail está correto.' 
      });
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-primary/10 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center pb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4 shadow-xl shadow-primary/20 animate-in zoom-in duration-500">
            <Wallet size={32} />
          </div>
          <CardTitle className="text-3xl font-heading font-bold tracking-tight">Financeiro Pro</CardTitle>
          <CardDescription className="text-base">Entre para gerenciar suas finanças</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-foreground/80">Senha</label>
                <button 
                  type="button"
                  onClick={() => {
                    setForgotStatus({ type: 'idle', message: '' });
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar na conta'
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Ainda não tem acesso?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Criar conta gratuita
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Modal de Recuperação de Senha Otimizado */}
      <Modal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)}
        title="Recuperar Acesso"
      >
        <div className="space-y-6">
          {forgotStatus.type === 'success' ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">E-mail enviado!</h4>
                <p className="text-muted-foreground text-sm">
                  {forgotStatus.message}
                </p>
              </div>
              <Button 
                onClick={() => setShowForgotModal(false)}
                className="w-full h-11"
              >
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Informe o seu e-mail cadastrado e enviaremos uma senha temporária para você recuperar seu acesso.
              </p>
              
              {forgotStatus.type === 'error' && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
                  {forgotStatus.message}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-mail cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 h-11"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-11 order-2 sm:order-1"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-11 order-1 sm:order-2"
                  disabled={isForgotSubmitting}
                >
                  {isForgotSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Enviar Senha'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
