import React, { useState, useEffect } from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { AIInsights } from '../components/dashboard/AIInsights';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const mockMonths = [
  { value: 'all', label: 'Todos os meses' },
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
];

const mockYears = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const { summary, fetchSummary } = useTransactions();

  useEffect(() => {
    fetchSummary({ month: selectedMonth, year: selectedYear });
  }, [fetchSummary, selectedMonth, selectedYear]);

  // Transformar dados do gráfico de barras (Fluxo de Caixa)
  // Por enquanto, usaremos apenas o dado do mês selecionado ou uma visão simples
  const barData = [
    {
      name: selectedMonth === 'all' ? 'Ano' : mockMonths.find(m => m.value === selectedMonth)?.label,
      income: summary.income,
      expense: summary.expense,
      investment: summary.investment,
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Aqui está um resumo das suas finanças reais.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-card p-1 px-3 rounded-lg border border-border shadow-sm h-10">
            <Calendar size={16} className="text-muted-foreground" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer pr-8"
            >
              {mockMonths.map(month => (
                <option key={month.value} value={month.value} className="bg-card">
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-card p-1 px-3 rounded-lg border border-border shadow-sm h-10">
            <Calendar size={16} className="text-muted-foreground" />
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer pr-8"
            >
              {mockYears.map(year => (
                <option key={year.value} value={year.value} className="bg-card">
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Saldo Atual" 
          value={summary.balance} 
          icon={Wallet} 
        />
        <SummaryCard 
          title="Receitas" 
          value={summary.income} 
          icon={TrendingUp} 
          type="income"
        />
        <SummaryCard 
          title="Despesas" 
          value={summary.expense} 
          icon={TrendingDown} 
          type="expense"
        />
        <SummaryCard 
          title="Investimentos" 
          value={summary.investment} 
          icon={LineChart} 
          type="investment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução Mensal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChartIcon size={20} className="text-primary" />
              <CardTitle>Fluxo de Caixa</CardTitle>
            </div>
            <CardDescription>
              Comparativo de entradas e saídas no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--secondary)', opacity: 0.2 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="income" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="investment" name="Investimento" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Gastos por Categoria */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              <CardTitle>Gastos por Categoria</CardTitle>
            </div>
            <CardDescription>Distribuição das suas despesas reais.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-row items-center gap-2 md:gap-4 overflow-hidden">
            <div className="flex flex-col justify-center gap-3 pl-2 md:pl-4 min-w-[100px] md:min-w-[150px]">
              {summary.categorySpending.length > 0 ? (
                summary.categorySpending.map((category) => (
                  <div key={category.name} className="flex items-start gap-3 group cursor-default">
                    <div className="w-3 h-3 rounded-full shadow-sm mt-1" style={{ backgroundColor: category.color }} />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                        {category.name}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/80">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.value)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">Sem despesas registradas.</p>
              )}
            </div>
            
            <div className="flex-1 h-full min-h-[200px] md:min-h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {summary.categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIInsights filters={{ month: selectedMonth, year: selectedYear }} />
    </div>
  );
}
