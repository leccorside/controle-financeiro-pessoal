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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

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
      <div className="flex items-center justify-between">
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

      <TransactionFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
