import { create } from 'zustand';
import api from '../services/api';

export const useCategories = create((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    try {
      const response = await api.post('/categories', category);
      set((state) => ({ categories: [...state.categories, response.data] }));
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  removeCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({ 
        categories: state.categories.filter(c => c.id !== id) 
      }));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
  },

  updateCategory: async (id, updated) => {
    try {
      const response = await api.put(`/categories/${id}`, updated);
      set((state) => ({
        categories: state.categories.map(c => c.id === id ? response.data : c)
      }));
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },
}));
