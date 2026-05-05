import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, 
  AlertCircle, Download, FileText, BarChart3, PieChart, Loader2
} from 'lucide-react';
import api from '../services/api';
import { cn } from '../services/utils';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { useTheme } from '../context/ThemeContext';

export default function Reports() {
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = React.useRef(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get('/reports/comparison');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do relatório:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const latestMonth = useMemo(() => data[data.length - 1] || {}, [data]);
  const previousMonth = useMemo(() => data[data.length - 2] || {}, [data]);

  const stats = useMemo(() => {
    if (!latestMonth.key) return [];
    
    return [
      {
        title: 'Receita no Mês',
        value: latestMonth.income,
        variation: previousMonth.income > 0 
          ? ((latestMonth.income - previousMonth.income) / previousMonth.income) * 100 
          : 0,
        icon: ArrowUpRight,
        color: 'text-success'
      },
      {
        title: 'Gastos no Mês',
        value: latestMonth.expense,
        variation: latestMonth.variation, // Já vem calculado do backend
        icon: ArrowDownRight,
        color: 'text-destructive'
      },
      {
        title: 'Saldo Líquido',
        value: latestMonth.income - latestMonth.expense,
        variation: 0,
        icon: BarChart3,
        color: 'text-primary'
      }
    ];
  }, [latestMonth, previousMonth]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const element = reportRef.current;
      
      const dataUrl = await toPng(element, {
        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
        cacheBust: true,
        skipFonts: true,
        filter: (node) => {
          if (node.classList && node.classList.contains('no-export')) return false;
          if (node.hasAttribute && node.hasAttribute('data-html2canvas-ignore')) return false;
          return true;
        },
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio_financeiro_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente ou use o Chrome.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={reportRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-heading tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Analise sua evolução financeira detalhadamente.</p>
        </div>
        <div className="flex gap-2" data-html2canvas-ignore>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isExporting ? 'Gerando...' : 'Exportar PDF'}
          </Button>
        </div>
      </div>

      {/* Cards de Resumo Comparativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stat.value)}
                </span>
                {stat.variation !== 0 && (
                  <span className={cn(
                    "text-xs font-bold flex items-center",
                    stat.variation > 0 ? "text-destructive" : "text-success"
                  )}>
                    {stat.variation > 0 ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                    {Math.abs(stat.variation)}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução Mensal */}
        <Card className="lg:col-span-2 border-primary/5">
          <CardHeader>
            <CardTitle>Evolução Mensal (Últimos 12 meses)</CardTitle>
            <CardDescription>Comparativo entre Receitas e Despesas acumuladas por mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name="Receitas"
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    name="Despesas"
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparativo de Gastos por Categoria (Mês Atual) */}
        <Card className="border-primary/5">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição das despesas no mês de {latestMonth.month}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={Object.entries(latestMonth.categories || {}).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    fontSize={10} 
                    stroke="#888" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" name="Valor" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card de Insights Rápidos */}
        <Card className="border-primary/5 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-primary" />
              <CardTitle>Insights do Mês</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
              <p className="text-sm">
                {latestMonth.variation > 0 ? (
                  <>Você gastou <span className="text-destructive font-bold">{latestMonth.variation}% a mais</span> em comparação ao mês passado. Considere revisar seus gastos variáveis.</>
                ) : (
                  <>Parabéns! Seus gastos <span className="text-success font-bold">diminuíram {Math.abs(latestMonth.variation)}%</span> em relação ao mês anterior.</>
                )}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Maiores Categorias:</h4>
              {Object.entries(latestMonth.categories || {})
                .sort((a,b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, value], i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}</span>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
