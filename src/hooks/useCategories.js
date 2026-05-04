import { create } from 'zustand';

const mockCategories = [
  { id: '1', name: 'Trabalho', type: 'INCOME', color: '#10b981', icon: 'Briefcase' },
  { id: '2', name: 'Alimentação', type: 'EXPENSE', color: '#8b5cf6', icon: 'Utensils' },
  { id: '3', name: 'Moradia', type: 'EXPENSE', color: '#6366f1', icon: 'Home' },
  { id: '4', name: 'Lazer', type: 'EXPENSE', color: '#f59e0b', icon: 'Palmtree' },
  { id: '5', name: 'Saúde', type: 'EXPENSE', color: '#ef4444', icon: 'Activity' },
];

export const useCategories = create((set) => ({
  categories: mockCategories,
  addCategory: (category) => set((state) => ({ 
    categories: [...state.categories, { ...category, id: Math.random().toString(36).substr(2, 9) }] 
  })),
  removeCategory: (id) => set((state) => ({ 
    categories: state.categories.filter(c => c.id !== id) 
  })),
  updateCategory: (id, updated) => set((state) => ({
    categories: state.categories.map(c => c.id === id ? { ...c, ...updated } : c)
  })),
}));
