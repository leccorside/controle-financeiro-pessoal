import { create } from 'zustand';

const mockTransactions = [
  { id: '1', description: 'Salário Mensal', type: 'INCOME', category: 'Trabalho', date: '2026-05-01', amount: 8500.00, status: 'PAID' },
  { id: '2', description: 'Aluguel Apartamento', type: 'EXPENSE', category: 'Moradia', date: '2026-05-05', amount: 2500.00, status: 'PENDING' },
  { id: '3', description: 'Supermercado', type: 'EXPENSE', category: 'Alimentação', date: '2026-05-06', amount: 850.40, status: 'OVERDUE' },
];

export const useTransactions = create((set) => ({
  transactions: mockTransactions,
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [
      { ...transaction, id: Math.random().toString(36).substr(2, 9), status: transaction.status || 'PENDING' }, 
      ...state.transactions
    ] 
  })),
  removeTransaction: (id) => set((state) => ({ 
    transactions: state.transactions.filter(t => t.id !== id) 
  })),
  updateTransaction: (id, updated) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updated } : t)
  })),
}));
