import React, { useState, useRef } from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Download, Upload, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Papa from 'papaparse';
import { cn } from '../services/utils';

export default function Categories() {
  const { categories, fetchCategories, addCategory, removeCategory, updateCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const exportToCSV = () => {
    const headers = ['Nome', 'Tipo', 'Cor', 'Ícone'];
    const rows = categories.map(c => [
      c.name,
      c.type === 'INCOME' ? 'Receita' : c.type === 'EXPENSE' ? 'Despesa' : 'Investimento',
      c.color,
      c.icon
    ]);

    const csvContent = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `categorias_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const importedData = results.data;
          let count = 0;

          for (const row of importedData) {
            const typeMap = { 'Receita': 'INCOME', 'Despesa': 'EXPENSE', 'Investimento': 'INVESTMENT' };
            
            const categoryData = {
              name: row['Nome'],
              type: typeMap[row['Tipo']] || 'EXPENSE',
              color: row['Cor'] || '#3b82f6',
              icon: row['Ícone'] || 'Tag'
            };

            await addCategory(categoryData);
            count++;
          }

          alert(`${count} categorias importadas com sucesso!`);
          fetchCategories();
        } catch (error) {
          console.error('Erro ao importar categorias:', error);
          alert('Erro ao processar o arquivo CSV.');
        } finally {
          setIsImporting(false);
          event.target.value = '';
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">Organize suas transações por grupos personalizados.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <Button 
            variant="outline" 
            className="w-full sm:w-auto gap-2" 
            onClick={() => fileInputRef.current.click()}
            disabled={isImporting}
          >
            {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Importar
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto gap-2" 
            onClick={exportToCSV}
          >
            <Download size={18} />
            Exportar
          </Button>
          <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            Nova Categoria
          </Button>
        </div>
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
                        category.type === 'INCOME' ? "text-success" : 
                        category.type === 'INVESTMENT' ? "text-blue-500" : "text-destructive"
                      )}>
                        {category.type === 'INCOME' ? 'Receita' : 
                         category.type === 'INVESTMENT' ? 'Investimento' : 'Despesa'}
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
