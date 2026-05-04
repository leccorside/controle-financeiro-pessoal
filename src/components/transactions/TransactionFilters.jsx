import React from 'react';
import { Input } from '../ui/Input';
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

export function TransactionFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
        <Input placeholder="Buscar transação..." className="pl-10" />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Calendar size={16} />
          Este Mês
        </Button>
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Filter size={16} />
          Tipo
        </Button>
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Filter size={16} />
          Categoria
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button variant="primary" size="sm">
          Filtrar
        </Button>
      </div>
    </div>
  );
}
