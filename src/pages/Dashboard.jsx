import React from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { AIInsights } from '../components/dashboard/AIInsights';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
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

const mockData = {
  summary: {
    balance: 12500.50,
    income: 18400.00,
    expenses: 5899.50,
  },
  monthlyEvolution: [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Fev', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Abr', income: 2780, expense: 3908 },
    { name: 'Mai', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ],
  categorySpending: [
    { name: 'Alimentação', value: 2400, color: '#8b5cf6' },
    { name: 'Transporte', value: 800, color: '#10b981' },
    { name: 'Lazer', value: 1200, color: '#f59e0b' },
    { name: 'Saúde', value: 500, color: '#ef4444' },
    { name: 'Educação', value: 999.50, color: '#6366f1' },
  ]
};

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Aqui está um resumo das suas finanças este mês.</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Saldo Atual" 
          value={mockData.summary.balance} 
          icon={Wallet} 
          trend={12}
        />
        <SummaryCard 
          title="Receitas" 
          value={mockData.summary.income} 
          icon={TrendingUp} 
          type="income"
          trend={5}
        />
        <SummaryCard 
          title="Despesas" 
          value={mockData.summary.expenses} 
          icon={TrendingDown} 
          type="expense"
          trend={-2}
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
            <CardDescription>Comparativo mensal entre receitas e despesas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.monthlyEvolution}>
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
                <Bar dataKey="income" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
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
            <CardDescription>Distribuição das suas despesas este mês.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col md:flex-row items-center gap-4">
            {/* Legenda na Esquerda */}
            <div className="flex flex-col justify-center gap-3 pl-4 min-w-[150px]">
              {mockData.categorySpending.map((category) => (
                <div key={category.name} className="flex items-center gap-3 group cursor-default">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                  <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Gráfico na Direita */}
            <div className="flex-1 w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.categorySpending.map((entry, index) => (
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

      <AIInsights />
    </div>
  );
}
