import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { UserForm } from '../components/admin/UserForm';
import { User, Shield, Trash2, Mail, Calendar, Search, Edit2 } from 'lucide-react';
import { cn } from '../services/utils';

const mockUsers = [
  { id: '1', name: 'Johnathan Amorim', email: 'admin@teste.com', role: 'ADMIN', createdAt: '2026-01-10' },
  { id: '2', name: 'Maria Silva', email: 'maria@teste.com', role: 'USER', createdAt: '2026-02-15' },
  { id: '3', name: 'Ricardo Santos', email: 'ricardo@teste.com', role: 'USER', createdAt: '2026-03-20' },
  { id: '4', name: 'Ana Oliveira', email: 'ana@teste.com', role: 'USER', createdAt: '2026-04-05' },
];

export default function Admin() {
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      const newUser = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const toggleRole = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' };
      }
      return u;
    }));
  };

  const deleteUser = (userId) => {
    if (confirm('Deseja realmente remover este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Painel Administrativo</h2>
        <p className="text-muted-foreground">Gerencie os usuários do sistema e suas permissões.</p>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <Input placeholder="Buscar por nome ou e-mail..." className="pl-10" />
        </div>
        <Button onClick={handleOpenCreateModal}>Adicionar Usuário</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="group border-primary/5 hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                    <User size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold flex items-center gap-2">
                      {user.name}
                      {user.role === 'ADMIN' && (
                        <Shield size={14} className="text-primary" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={12} />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "text-xs gap-2",
                      user.role === 'ADMIN' ? "text-primary border-primary/20 bg-primary/5" : ""
                    )}
                    onClick={() => toggleRole(user.id)}
                  >
                    <Shield size={14} />
                    {user.role === 'ADMIN' ? 'Admin' : 'Tornar Admin'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => handleOpenEditModal(user)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
      >
        <UserForm 
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          defaultValues={editingUser}
        />
      </Modal>
    </div>
  );
}
