import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Download } from 'lucide-react';

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction, updateTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    month: 'all',
    year: '2026',
    type: 'all',
    category: 'all'
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Busca por texto
      const matchesSearch = t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Filtro de Tipo
      const matchesType = filters.type === 'all' || t.type === filters.type;
      
      // Filtro de Categoria
      const matchesCategory = filters.category === 'all' || t.category === filters.category;
      
      // Filtro de Mês e Ano
      const date = new Date(t.date);
      const matchesMonth = filters.month === 'all' || date.getMonth().toString() === filters.month;
      const matchesYear = filters.year === 'all' || date.getFullYear().toString() === filters.year;

      return matchesSearch && matchesType && matchesCategory && matchesMonth && matchesYear;
    });
  }, [transactions, filters]);

  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      removeTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Transações</h2>
          <p className="text-muted-foreground">Gerencie seu histórico financeiro detalhado.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Exportar
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            Nova Transação
          </Button>
        </div>
      </div>

      <TransactionFilters filters={filters} setFilters={setFilters} />

      <TransactionTable 
        transactions={filteredTransactions} 
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <p>Mostrando {filteredTransactions.length} de {transactions.length} transações</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm" disabled>Próximo</Button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      >
        <TransactionForm 
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          defaultValues={editingTransaction}
        />
      </Modal>
    </div>
  );
}
