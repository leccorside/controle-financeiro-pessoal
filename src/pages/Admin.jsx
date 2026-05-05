import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { UserForm } from '../components/admin/UserForm';
import { User, Shield, Trash2, Mail, Calendar, Search, Edit2, Loader2 } from 'lucide-react';
import api from '../services/api';
import { cn } from '../services/utils';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingUser) {
        const response = await api.put(`/users/${editingUser.id}`, data);
        setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
      } else {
        const response = await api.post('/users', data);
        setUsers([...users, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao salvar usuário');
    }
  };

  const toggleRole = async (user) => {
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      const response = await api.put(`/users/${user.id}`, { ...user, role: newRole });
      setUsers(users.map(u => u.id === user.id ? response.data : u));
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao alterar permissão');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Deseja realmente remover este usuário?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao excluir usuário');
      }
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
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreateModal}>Adicionar Usuário</Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="text-primary animate-spin" size={48} />
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <Card key={user.id} className="group border-primary/5 hover:border-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
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
                        Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-end sm:items-start gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "text-xs gap-2 w-full sm:w-auto justify-center",
                        user.role === 'ADMIN' ? "text-primary border-primary/20 bg-primary/5" : ""
                      )}
                      onClick={() => toggleRole(user)}
                    >
                      <Shield size={14} />
                      {user.role === 'ADMIN' ? 'Admin' : 'Tornar Admin'}
                    </Button>
                    
                    <div className="flex gap-2 justify-end w-full sm:w-auto">
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
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Nenhum usuário encontrado para "{searchTerm}".
            </div>
          )}
        </div>
      )}

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
