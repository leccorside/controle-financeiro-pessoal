import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Download, FileText, Table as TableIcon, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '../services/utils';

export default function Transactions() {
  const { transactions, fetchTransactions, addTransaction, removeTransaction, updateTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const exportMenuRef = useRef(null);
  
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    searchTerm: '',
    month: 'all',
    year: '2026',
    type: 'all',
    category: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchTransactions(filters);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  }, [fetchTransactions, filters.month, filters.year, filters.type, filters.category, filters.status]);

  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          t.category?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, filters.searchTerm]);

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

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

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Status', 'Valor'];
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      t.description,
      t.type === 'INCOME' ? 'Receita' : t.type === 'EXPENSE' ? 'Despesa' : 'Investimento',
      t.category?.name || 'Sem categoria',
      t.status,
      t.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Transações - Financeiro Pro', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    const tableColumn = ["Data", "Descrição", "Tipo", "Categoria", "Status", "Valor"];
    const tableRows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      t.description,
      t.type === 'INCOME' ? 'Receita' : t.type === 'EXPENSE' ? 'Despesa' : 'Investimento',
      t.category?.name || 'Sem categoria',
      t.status,
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: '#6366f1' }
    });

    doc.save(`transacoes_${new Date().getTime()}.pdf`);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Transações</h2>
          <p className="text-muted-foreground">Gerencie seu histórico financeiro detalhado.</p>
        </div>
        <div className="flex gap-2">
          {/* Dropdown de Exportação */}
          <div className="relative" ref={exportMenuRef}>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
              <Download size={18} />
              Exportar
              <ChevronDown size={14} className={cn("transition-transform", isExportMenuOpen ? "rotate-180" : "")} />
            </Button>
            
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-accent transition-colors border-b border-border/50"
                >
                  <TableIcon size={16} className="text-success" />
                  <span>Exportar como CSV</span>
                </button>
                <button 
                  onClick={exportToPDF}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-accent transition-colors"
                >
                  <FileText size={16} className="text-destructive" />
                  <span>Exportar como PDF</span>
                </button>
              </div>
            )}
          </div>

          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            Nova Transação
          </Button>
        </div>
      </div>

      <TransactionFilters filters={filters} setFilters={setFilters} />

      <TransactionTable 
        transactions={paginatedTransactions} 
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <p>
          Mostrando {paginatedTransactions.length} de {filteredTransactions.length} transações 
          {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Próximo
          </Button>
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
