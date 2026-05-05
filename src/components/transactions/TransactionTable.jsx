import React from 'react';
import { cn } from '../../services/utils';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTransactions } from '../../hooks/useTransactions';

export function TransactionTable({ transactions, onEdit, onDelete }) {
  const { updateTransaction } = useTransactions();

  const getIcon = (type) => {
    switch (type) {
      case 'INCOME': return <ArrowUpCircle className="text-success" size={16} />;
      case 'EXPENSE': return <ArrowDownCircle className="text-destructive" size={16} />;
      case 'INVESTMENT': return <TrendingUp className="text-blue-500" size={16} />;
      default: return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'INCOME': return 'Receita';
      case 'EXPENSE': return 'Despesa';
      case 'INVESTMENT': return 'Investimento';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INCOME': return 'text-success';
      case 'EXPENSE': return 'text-destructive';
      case 'INVESTMENT': return 'text-blue-500';
      default: return 'text-foreground';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PAID': return 'bg-success/10 text-success border-success/20';
      case 'PENDING': return 'bg-warning/10 text-warning border-warning/20';
      case 'OVERDUE': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateTransaction(id, { status: newStatus });
  };

  const isOverdue = (transaction) => {
    if (transaction.status === 'PAID') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const transactionDate = new Date(transaction.date);
    return transactionDate < today && transaction.status === 'PENDING';
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-semibold">Descrição</th>
              <th className="px-6 py-4 font-semibold">Tipo</th>
              <th className="px-6 py-4 font-semibold">Categoria</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Vencimento</th>
              <th className="px-6 py-4 font-semibold text-right">Valor</th>
              <th className="px-6 py-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className={cn(
                    "hover:bg-primary/5 transition-colors group",
                    isOverdue(transaction) && "bg-destructive/5 hover:bg-destructive/10"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{transaction.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getIcon(transaction.type)}
                      <span className={cn("text-xs font-medium", getTypeColor(transaction.type))}>
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground border border-border">
                      {transaction.category?.name || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={transaction.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-center min-w-[80px]",
                        getStatusStyles(transaction.status)
                      )}
                    >
                      <option value="PAID">PAGO</option>
                      <option value="PENDING">PENDENTE</option>
                      <option value="OVERDUE">ATRASADO</option>
                    </select>
                  </td>
                  <td className={cn("px-6 py-4", isOverdue(transaction) ? "text-destructive font-bold" : "text-muted-foreground")}>
                    {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-semibold",
                    transaction.type === 'INCOME' ? "text-success" : 
                    transaction.type === 'INVESTMENT' ? "text-blue-500" : "text-foreground"
                  )}>
                    {transaction.type === 'EXPENSE' && '- '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={cn(
                "bg-card/40 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-md active:scale-[0.99] transition-all opacity-0 animate-fade-in",
                isOverdue(transaction) && "bg-destructive/10 border-destructive/30 shadow-destructive/5",
                index < 5 && `animate-stagger-${index + 1}`
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1 max-w-[70%]">
                  <h3 className="text-base font-bold uppercase tracking-tight text-foreground truncate font-heading">
                    {transaction.description}
                  </h3>
                  <p className={cn(
                    "text-[10px] font-semibold tracking-wider",
                    isOverdue(transaction) ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary bg-secondary/40 border border-border/50"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive bg-secondary/40 border border-border/50"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-3 border-t border-border/30">
                {/* Tipo */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Tipo</span>
                  <div className="flex items-center gap-2">
                    {getIcon(transaction.type)}
                    <span className={cn("text-xs font-bold", getTypeColor(transaction.type))}>
                      {getTypeLabel(transaction.type)}
                    </span>
                  </div>
                </div>

                {/* Categoria - Alinhada à Direita */}
                <div className="space-y-1.5 text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Categoria</span>
                  <div className="flex justify-end">
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 text-[10px] font-bold text-secondary-foreground border border-border/40">
                      {transaction.category?.name || 'Sem categoria'}
                    </span>
                  </div>
                </div>

                {/* Status - Label Acima */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Status</span>
                  <div className="relative inline-block">
                    <select
                      value={transaction.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                      className={cn(
                        "text-[9px] font-black px-3 py-1.5 rounded-full border-2 transition-all cursor-pointer focus:outline-none appearance-none text-center min-w-[100px] tracking-widest",
                        getStatusStyles(transaction.status)
                      )}
                    >
                      <option value="PAID">PAGO</option>
                      <option value="PENDING">PENDENTE</option>
                      <option value="OVERDUE">ATRASADO</option>
                    </select>
                  </div>
                </div>

                {/* Valor */}
                <div className="flex flex-col justify-end items-end">
                  <span className={cn(
                    "text-xl font-black tracking-tighter",
                    transaction.type === 'INCOME' ? "text-success" : 
                    transaction.type === 'INVESTMENT' ? "text-blue-500" : "text-foreground"
                  )}>
                    {transaction.type === 'EXPENSE' && '- '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground animate-fade-in shadow-inner">
            Nenhuma transação encontrada.
          </div>
        )}
      </div>



    </div>
  );

}
