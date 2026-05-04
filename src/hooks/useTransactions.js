import { create } from 'zustand';
import api from '../services/api';

export const useTransactions = create((set) => ({
  transactions: [],
  summary: {
    income: 0,
    expense: 0,
    investment: 0,
    balance: 0,
    categorySpending: []
  },
  isLoading: false,

  fetchTransactions: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/transactions', { params });
      set({ transactions: response.data });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async (params = {}) => {
    try {
      const response = await api.get('/transactions/summary', { params });
      set({ summary: response.data });
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
    }
  },

  addTransaction: async (transaction) => {
    try {
      const response = await api.post('/transactions', transaction);
      set((state) => ({ 
        transactions: [response.data, ...state.transactions] 
      }));
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  removeTransaction: async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      set((state) => ({ 
        transactions: state.transactions.filter(t => t.id !== id) 
      }));
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      throw error;
    }
  },

  updateTransaction: async (id, updated) => {
    try {
      const response = await api.put(`/transactions/${id}`, updated);
      set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? response.data : t)
      }));
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  },
}));
