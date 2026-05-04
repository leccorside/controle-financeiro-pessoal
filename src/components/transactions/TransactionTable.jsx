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

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
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
              <tr key={transaction.id} className="hover:bg-primary/5 transition-colors group">
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
                    {transaction.category}
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
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
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
  );
}
