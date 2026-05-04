import React from 'react';
import { cn } from '../../services/utils';
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
          <tr>
            <th className="px-6 py-4 font-semibold">Descrição</th>
            <th className="px-6 py-4 font-semibold">Tipo</th>
            <th className="px-6 py-4 font-semibold">Categoria</th>
            <th className="px-6 py-4 font-semibold">Data</th>
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
                    {transaction.type === 'INCOME' ? (
                      <ArrowUpCircle className="text-success" size={16} />
                    ) : (
                      <ArrowDownCircle className="text-destructive" size={16} />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      transaction.type === 'INCOME' ? "text-success" : "text-destructive"
                    )}>
                      {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground border border-border">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </td>
                <td className={cn(
                  "px-6 py-4 text-right font-semibold",
                  transaction.type === 'INCOME' ? "text-success" : "text-foreground"
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
              <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                Nenhuma transação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
