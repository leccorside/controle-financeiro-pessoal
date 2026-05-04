import React, { useState } from 'react';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { Button } from '../components/ui/Button';
import { Plus, Download } from 'lucide-react';

const mockTransactions = [
  { id: '1', description: 'Salário Mensal', type: 'INCOME', category: 'Trabalho', date: '2026-05-01', amount: 8500.00 },
  { id: '2', description: 'Aluguel Apartamento', type: 'EXPENSE', category: 'Moradia', date: '2026-05-05', amount: 2500.00 },
  { id: '3', description: 'Supermercado', type: 'EXPENSE', category: 'Alimentação', date: '2026-05-06', amount: 850.40 },
  { id: '4', description: 'Freelance Design', type: 'INCOME', category: 'Trabalho', date: '2026-05-10', amount: 1200.00 },
  { id: '5', description: 'Assinatura Netflix', type: 'EXPENSE', category: 'Lazer', date: '2026-05-12', amount: 55.90 },
  { id: '6', description: 'Conta de Luz', type: 'EXPENSE', category: 'Contas Fixas', date: '2026-05-15', amount: 210.15 },
  { id: '7', description: 'Restaurante Fim de Semana', type: 'EXPENSE', category: 'Alimentação', date: '2026-05-16', amount: 180.00 },
];

export default function Transactions() {
  const [transactions] = useState(mockTransactions);

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
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} />
            Nova Transação
          </Button>
        </div>
      </div>

      <TransactionFilters />

      <TransactionTable transactions={transactions} />

      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <p>Mostrando {transactions.length} transações</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm" disabled>Próximo</Button>
        </div>
      </div>
    </div>
  );
}
