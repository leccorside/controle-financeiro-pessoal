import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../services/utils';

export default function Categories() {
  const { categories, addCategory, removeCategory, updateCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esta categoria? Transações vinculadas poderão ser afetadas.')) {
      removeCategory(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">Organize suas transações por grupos personalizados.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = LucideIcons[category.icon] || LucideIcons.HelpCircle;
          return (
            <Card key={category.id} className="group hover:border-primary/20 transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">{category.name}</h3>
                      <span className={cn(
                        "text-xs font-medium uppercase tracking-wider",
                        category.type === 'INCOME' ? "text-success" : "text-destructive"
                      )}>
                        {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditModal(category)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div 
                  className="h-1 w-full" 
                  style={{ backgroundColor: category.color, opacity: 0.3 }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <CategoryForm 
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          defaultValues={editingCategory}
        />
      </Modal>
    </div>
  );
}
