import React from 'react';
import { Input } from '../ui/Input';
import { Search, Calendar, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

export function TransactionFilters({ filters, setFilters }) {
  const { categories } = useCategories();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
      <div className="relative w-full lg:w-64">
        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
        <Input 
          placeholder="Buscar transação..." 
          className="pl-10 h-10" 
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full lg:w-auto">
        {/* Mês */}
        <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3 h-10">
          <Calendar size={16} className="text-muted-foreground" />
          <select 
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer w-full uppercase"
          >
            <option value="all">Mês: Todos</option>
            <option value="0">Janeiro</option>
            <option value="1">Fevereiro</option>
            <option value="2">Março</option>
            <option value="3">Abril</option>
            <option value="4">Maio</option>
            <option value="5">Junho</option>
            <option value="6">Julho</option>
            <option value="7">Agosto</option>
            <option value="8">Setembro</option>
            <option value="9">Outubro</option>
            <option value="10">Novembro</option>
            <option value="11">Dezembro</option>
          </select>
        </div>

        {/* Ano */}
        <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3 h-10">
          <Calendar size={16} className="text-muted-foreground" />
          <select 
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer w-full uppercase"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3 h-10">
          <CheckCircle2 size={16} className="text-muted-foreground" />
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer w-full uppercase"
          >
            <option value="all">Status: Todos</option>
            <option value="PAID">PAGO</option>
            <option value="PENDING">PENDENTE</option>
            <option value="OVERDUE">ATRASADO</option>
          </select>
        </div>

        {/* Tipo */}
        <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3 h-10">
          <Layers size={16} className="text-muted-foreground" />
          <select 
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer w-full uppercase"
          >
            <option value="all">Tipo: Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
            <option value="INVESTMENT">Investimentos</option>
          </select>
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3 h-10">
          <Tag size={16} className="text-muted-foreground" />
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="bg-transparent border-none text-[10px] font-bold focus:ring-0 cursor-pointer w-full uppercase"
          >
            <option value="all">Categoria: Todas</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
