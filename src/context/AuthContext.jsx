import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@FinanceiroPro:user');
    const token = localStorage.getItem('@FinanceiroPro:token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('@FinanceiroPro:token', token);
      localStorage.setItem('@FinanceiroPro:user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao realizar login');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@FinanceiroPro:token');
    localStorage.removeItem('@FinanceiroPro:user');
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = response.data;
      
      localStorage.setItem('@FinanceiroPro:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar perfil');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
