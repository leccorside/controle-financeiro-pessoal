import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Download } from 'lucide-react';

export default function Transactions() {
  const { transactions, fetchTransactions, addTransaction, removeTransaction, updateTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    month: 'all',
    year: '2026',
    type: 'all',
    category: 'all',
    status: 'all'
  });

  // Buscar dados da API sempre que os filtros mudarem
  React.useEffect(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters.month, filters.year, filters.type, filters.category, filters.status]);

  const filteredTransactions = useMemo(() => {
    // A filtragem por searchTerm ainda é feita no client para ser instantânea
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          t.category.name?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, filters.searchTerm]);

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
