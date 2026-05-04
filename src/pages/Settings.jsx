import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProfileForm } from '../components/settings/ProfileForm';
import { PasswordForm } from '../components/settings/PasswordForm';
import { User, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'password' | null

  const handleProfileSubmit = (data) => {
    console.log('Update profile:', data);
    // Na Fase 2 implementaremos a chamada real
    setActiveModal(null);
    alert('Perfil atualizado com sucesso!');
  };

  const handlePasswordSubmit = (data) => {
    console.log('Change password:', data);
    // Na Fase 2 implementaremos a chamada real
    setActiveModal(null);
    alert('Senha alterada com sucesso!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas preferências de conta e aplicativo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-primary" />
              Perfil
            </CardTitle>
            <CardDescription>Suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{user?.name || 'Johnathan Amorim'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">E-mail</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'admin@teste.com'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveModal('profile')}>
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon size={20} className="text-primary" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize o visual do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Tema Escuro</p>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notificações
            </CardTitle>
            <CardDescription>Escolha como deseja ser avisado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground italic">Opções de notificação serão ativadas na Fase 2.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Segurança
            </CardTitle>
            <CardDescription>Proteja sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => setActiveModal('password')}>
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      <Modal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        title="Editar Perfil"
      >
        <ProfileForm 
          onSubmit={handleProfileSubmit}
          onCancel={() => setActiveModal(null)}
          defaultValues={{
            name: user?.name || 'Johnathan Amorim',
            email: user?.email || 'admin@teste.com'
          }}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'password'}
        onClose={() => setActiveModal(null)}
        title="Alterar Senha"
      >
        <PasswordForm 
          onSubmit={handlePasswordSubmit}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>
    </div>
  );
}
