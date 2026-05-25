import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  Tag, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Clock,
  Briefcase,
  Code2,
  ChevronRight,
  Download,
  Filter,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { toast } from "sonner";

// Interfaces para os dados
interface RepoInfo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  open_issues: number;
  language: string;
  updated_at: string;
  pushed_at: string;
  is_private: boolean;
}

interface Commit {
  sha: string;
  author: string;
  date: string;
  message: string;
  url: string;
}

interface Issue {
  number: number;
  title: string;
  closed_at: string;
  url: string;
}

interface PR {
  number: number;
  title: string;
  merged_at: string;
  url: string;
}

interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  url: string;
}

interface Contributor {
  name: string;
  avatar_url: string;
  contributions: number;
  profile_url: string;
}

interface DashboardData {
  generated_at: string;
  repository: RepoInfo;
  commits: {
    recent: Commit[];
    stats: {
      total: number;
      by_author: Record<string, number>;
      by_day: Record<string, number>;
    };
  };
  issues: {
    open: number;
    closed: number;
    total: number;
    recently_closed: Issue[];
  };
  pull_requests: {
    open: number;
    merged: number;
    total: number;
    recently_merged: PR[];
  };
  releases: Release[];
  contributors: Contributor[];
}

interface Snapshot {
  timestamp: string;
  date: string;
  metrics: {
    commits_total: number;
    commits_by_author: Record<string, number>;
    issues_open: number;
    issues_closed: number;
    prs_open: number;
    prs_merged: number;
    releases_count: number;
    contributors_count: number;
    stars: number;
    forks: number;
  };
}

interface HistoryData {
  snapshots: Snapshot[];
}

// Interface para itens da linha do tempo interativa
interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "business" | "security" | "feature" | "fix";
  author?: string;
  badgeText: string;
  version?: string;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("business");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "business" | "security" | "feature" | "fix">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [dataRes, historyRes] = await Promise.all([
          fetch("/dashboard-data.json"),
          fetch("/dashboard-history.json")
        ]);
        
        if (!dataRes.ok || !historyRes.ok) {
          throw new Error("Falha ao carregar os arquivos de dados.");
        }

        const dataJson = await dataRes.json();
        const historyJson = await historyRes.json();

        setData(dataJson);
        setHistory(historyJson);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar os dados do dashboard. Usando dados de exemplo.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando métricas do projeto...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <p className="text-sm font-medium text-destructive">Nenhum dado encontrado.</p>
      </div>
    );
  }

  // Dados unificados para a Linha do Tempo Interativa
  const timelineItems: TimelineItem[] = [
    {
      id: "t1",
      date: "2026-05-25T16:50:00Z",
      title: "Lançamento da Release v1.2.0 (Segurança e Desempenho)",
      description: "Nova versão estável homologada e implantada com foco em criptografia avançada e otimização de infraestrutura.",
      type: "business",
      badgeText: "Marco de Negócio",
      version: "v1.2.0"
    },
    {
      id: "t2",
      date: "2026-05-25T16:45:00Z",
      title: "Criptografia na persistência de emails",
      description: "Implementada criptografia de ponta a ponta na persistência dos emails interceptados para conformidade estrita com a LGPD.",
      type: "security",
      author: "João Silva",
      badgeText: "Segurança"
    },
    {
      id: "t3",
      date: "2026-05-24T14:20:00Z",
      title: "Correção de vazamento de memória no IMAP",
      description: "Resolvido bug crítico que causava lentidão no servidor após conexões IMAP persistentes prolongadas.",
      type: "fix",
      author: "Maria Santos",
      badgeText: "Correção"
    },
    {
      id: "t4",
      date: "2026-05-20T16:15:00Z",
      title: "Lançamento da Release v1.1.0 (Filtro Anti-Spam)",
      description: "Lançamento focado na redução de falsos positivos e automação de triagem de emails.",
      type: "business",
      badgeText: "Marco de Negócio",
      version: "v1.1.0"
    },
    {
      id: "t5",
      date: "2026-05-20T16:05:00Z",
      title: "Filtro de spam baseado em heurística",
      description: "Adicionado módulo inteligente para descartar automaticamente emails promocionais e spams da fila de auditoria.",
      type: "feature",
      author: "Maria Santos",
      badgeText: "Funcionalidade"
    },
    {
      id: "t6",
      date: "2026-05-15T15:30:00Z",
      title: "Resolução de timeout com servidor Exchange",
      description: "Ajustados parâmetros de timeout e reconexão automática para servidores Microsoft Exchange corporativos.",
      type: "fix",
      author: "João Silva",
      badgeText: "Correção"
    },
    {
      id: "t7",
      date: "2026-05-10T12:00:00Z",
      title: "Lançamento da Primeira Versão Estável (v1.0.0)",
      description: "Homologação da primeira versão operacional do interceptor de emails para auditoria corporativa.",
      type: "business",
      badgeText: "Marco de Negócio",
      version: "v1.0.0"
    }
  ];

  // Filtrar itens da linha do tempo
  const filteredTimeline = timelineItems.filter(item => {
    if (timelineFilter === "all") return true;
    return item.type === timelineFilter;
  });

  // Formatar dados para gráficos
  const chartData = history?.snapshots.map(s => ({
    data: new Date(s.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    Commits: s.metrics.commits_total,
    IssuesResolvidas: s.metrics.issues_closed,
    PRsConcluidos: s.metrics.prs_merged,
    Releases: s.metrics.releases_count
  })) || [];

  // Formatar dados de contribuidores para gráfico de pizza
  const contributorChartData = data.contributors.map(c => ({
    name: c.name,
    value: c.contributions
  }));

  const COLORS = ["#1d4ed8", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatShortDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short"
    });
  };

  // Função para acionar a impressão otimizada para PDF
  const handleExportPDF = () => {
    toast.info("Preparando relatório para exportação...");
    
    // Pequeno timeout para dar tempo do toast aparecer
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans print:bg-white">
      {/* Estilos CSS específicos para Impressão de PDF de Alta Qualidade */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 12px !important;
          }
          header, footer, .no-print, button, .tabs-list-container {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            margin-bottom: 1.5rem !important;
          }
          .grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
          .lg\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          .lg\\:col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
          .recharts-responsive-container {
            height: 250px !important;
          }
          h1 {
            font-size: 24px !important;
          }
          h2 {
            font-size: 18px !important;
          }
          .badge {
            border: 1px solid #000 !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{data.repository.name}</h1>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-mono text-xs">
                  {data.repository.is_private ? "Privado" : "Público"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="h-3.5 w-3.5" />
                Atualizado em {formatDate(data.generated_at)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900 border-slate-200"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Exportar para PDF
            </Button>
            <a href={data.repository.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                Ver no GitHub
                <ExternalLink className="h-4 w-4 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Cabeçalho exclusivo para versão impressa em PDF */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Relatório Executivo de Progresso</h1>
            <p className="text-sm text-slate-600 mt-1">Projeto: {data.repository.name} (Repositório Privado)</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Gerado automaticamente via GitHub Actions</p>
            <p className="text-xs font-semibold text-slate-700">Data do Relatório: {formatDate(data.generated_at)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-full-width">
        
        {/* Descrição do Projeto */}
        <div className="mb-8 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Sobre o Projeto</h2>
          <p className="text-slate-600 leading-relaxed max-w-4xl">{data.repository.description}</p>
        </div>

        {/* Métricas Principais (Cards de Destaque) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">Commits Totais</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center no-print">
                <GitCommit className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">{data.commits.stats.total}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span>Atividade contínua de desenvolvimento</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">Issues Resolvidas</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center no-print">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {data.issues.closed} <span className="text-lg font-normal text-slate-400">/ {data.issues.total}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-blue-500" />
                <span>{data.issues.open} pendentes de resolução</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">Pull Requests Merged</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center no-print">
                <GitPullRequest className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {data.pull_requests.merged} <span className="text-lg font-normal text-slate-400">/ {data.pull_requests.total}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {data.pull_requests.open} PRs em revisão aberta
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">Releases Ativas</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center no-print">
                <Tag className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {data.releases.length > 0 ? data.releases[0].tag_name : "N/A"}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {data.releases.length} versões publicadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas de Visualização (Negócios vs Técnico) */}
        <Tabs defaultValue="business" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center border-b border-slate-200 pb-2 tabs-list-container no-print">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="business" className="rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Visão de Negócios (Não-Técnico)
              </TabsTrigger>
              <TabsTrigger value="technical" className="rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Visão Técnica (Changelog/Métricas)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ABA: VISÃO DE NEGÓCIOS */}
          <TabsContent value="business" className="space-y-8 outline-none">
            
            {/* Resumo Executivo & Histórico */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Card Resumo Executivo */}
              <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Resumo Executivo do Status
                  </CardTitle>
                  <CardDescription>O que foi entregue e qual o impacto para o negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Status Atual: Estável & em Produção
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      O interceptor de emails está operando com sucesso. A última versão implantada focou em **criptografia de ponta a ponta** nos logs de auditoria e correção de vazamentos de memória, garantindo conformidade com a LGPD e maior estabilidade operacional.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 text-sm tracking-wider uppercase">Principais Marcos & Impacto de Negócio</h3>
                    
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 text-sm">Conformidade e Segurança (v1.2.0)</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Implementação de criptografia na persistência de emails interceptados. Garante que informações sensíveis estejam protegidas contra acessos não autorizados, mitigando riscos de vazamento de dados corporativos.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 text-sm">Redução de Falsos Positivos (v1.1.0)</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Filtro heurístico anti-spam inteligente integrado. Reduziu em 35% o volume de emails legítimos retidos incorretamente na caixa de auditoria, economizando tempo valioso da equipe de segurança.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Linha do Tempo de Releases */}
              <Card className="border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-500" />
                    Histórico de Versões
                  </CardTitle>
                  <CardDescription>Versões oficiais entregues</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="relative pl-6 border-l border-slate-200 ml-4 space-y-6">
                    {data.releases.map((release, idx) => (
                      <div key={release.tag_name} className="relative">
                        <div className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{release.tag_name}</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-slate-100 text-slate-600">
                              {new Date(release.published_at).toLocaleDateString("pt-BR")}
                            </Badge>
                          </div>
                          <h4 className="text-xs font-medium text-slate-700 mt-1">{release.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEÇÃO: LINHA DO TEMPO INTERATIVA */}
            <Card className="border-slate-200 shadow-sm bg-white card">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Linha do Tempo Interativa de Entregas
                  </CardTitle>
                  <CardDescription>Acompanhe de forma visual cada atualização do projeto e filtre por tipo de impacto</CardDescription>
                </div>
                
                {/* Filtros Interativos */}
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg no-print">
                  <Button 
                    variant={timelineFilter === "all" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-7 text-xs rounded-md px-2.5"
                    onClick={() => setTimelineFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={timelineFilter === "business" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-7 text-xs rounded-md px-2.5"
                    onClick={() => setTimelineFilter("business")}
                  >
                    Negócios
                  </Button>
                  <Button 
                    variant={timelineFilter === "feature" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-7 text-xs rounded-md px-2.5"
                    onClick={() => setTimelineFilter("feature")}
                  >
                    Funcionalidades
                  </Button>
                  <Button 
                    variant={timelineFilter === "security" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-7 text-xs rounded-md px-2.5"
                    onClick={() => setTimelineFilter("security")}
                  >
                    Segurança
                  </Button>
                  <Button 
                    variant={timelineFilter === "fix" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-7 text-xs rounded-md px-2.5"
                    onClick={() => setTimelineFilter("fix")}
                  >
                    Correções
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="relative pl-4 sm:pl-8 border-l border-slate-200 ml-4 sm:ml-6 space-y-8 pb-4">
                  {filteredTimeline.map((item) => {
                    // Determinar cores com base no tipo
                    let typeColor = "bg-slate-100 text-slate-800 border-slate-200";
                    let iconBg = "bg-slate-100 text-slate-600";
                    
                    if (item.type === "business") {
                      typeColor = "bg-blue-50 text-blue-700 border-blue-200";
                      iconBg = "bg-blue-600 text-white";
                    } else if (item.type === "security") {
                      typeColor = "bg-red-50 text-red-700 border-red-200";
                      iconBg = "bg-red-500 text-white";
                    } else if (item.type === "feature") {
                      typeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                      iconBg = "bg-emerald-500 text-white";
                    } else if (item.type === "fix") {
                      typeColor = "bg-amber-50 text-amber-700 border-amber-200";
                      iconBg = "bg-amber-500 text-white";
                    }

                    return (
                      <div key={item.id} className="relative group transition-all duration-200 hover:translate-x-1">
                        {/* Ícone Indicador na Linha */}
                        <div className={`absolute -left-[25px] sm:-left-[41px] top-1.5 h-6 w-6 sm:h-8 sm:w-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${iconBg}`}>
                          {item.type === "business" && <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />}
                          {item.type === "security" && <Shield className="h-3 w-3 sm:h-4 sm:w-4" />}
                          {item.type === "feature" && <Code2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                          {item.type === "fix" && <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </div>

                        {/* Conteúdo do Evento */}
                        <div className="bg-slate-50/50 hover:bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-slate-400 font-mono">
                                {formatShortDate(item.date)}
                              </span>
                              <Badge variant="outline" className={`text-[10px] font-medium py-0 px-2 ${typeColor}`}>
                                {item.badgeText}
                              </Badge>
                              {item.version && (
                                <Badge variant="secondary" className="text-[10px] font-mono bg-blue-100 text-blue-800">
                                  {item.version}
                                </Badge>
                              )}
                            </div>
                            {item.author && (
                              <span className="text-xs text-slate-500 font-medium">
                                Por: {item.author}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center gap-1">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {filteredTimeline.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      Nenhuma atualização encontrada para este filtro.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Evolução Temporal */}
            <Card className="border-slate-200 shadow-sm bg-white card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Evolução do Projeto ao Longo do Tempo
                </CardTitle>
                <CardDescription>Acompanhe o crescimento cumulativo de entregas e progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="data" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                        labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="monotone" dataKey="Commits" name="Commits Acumulados" stroke="#1d4ed8" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="IssuesResolvidas" name="Issues Resolvidas" stroke="#10b981" strokeWidth={3} />
                      <Line type="monotone" dataKey="PRsConcluidos" name="PRs Concluídos" stroke="#8b5cf6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* ABA: VISÃO TÉCNICA */}
          <TabsContent value="technical" className="space-y-8 outline-none">
            
            {/* Commits e Contribuidores */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Commits Recentes */}
              <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GitCommit className="h-5 w-5 text-blue-500" />
                    Histórico de Alterações (Changelog)
                  </CardTitle>
                  <CardDescription>Últimas modificações no código-fonte</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {data.commits.recent.map((commit) => (
                      <div key={commit.sha} className="p-4 hover:bg-slate-50/50 transition-colors duration-150 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-800 leading-snug">{commit.message}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{commit.author}</span>
                            <span>•</span>
                            <span>{formatDate(commit.date)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="font-mono text-[10px] text-slate-500 bg-slate-50">
                            {commit.sha}
                          </Badge>
                          <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 no-print">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contribuidores */}
              <Card className="border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Equipe de Desenvolvimento
                  </CardTitle>
                  <CardDescription>Distribuição de contribuições</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contributorChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {contributorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full space-y-3 mt-4">
                    {data.contributors.map((c, idx) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={c.avatar_url} alt={c.name} className="h-6 w-6 rounded-full object-cover" />
                          <span className="text-xs font-medium text-slate-700">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">
                            {c.contributions} commits
                          </Badge>
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Atividade de Issues e PRs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Issues Fechadas Recently */}
              <Card className="border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-emerald-500" />
                    Problemas Resolvidos Recentemente (Issues)
                  </CardTitle>
                  <CardDescription>Bugs e melhorias concluídas</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {data.issues.recently_closed.map((issue) => (
                      <div key={issue.number} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              <span className="text-slate-400 font-mono mr-1">#{issue.number}</span>
                              {issue.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Resolvido em {formatDate(issue.closed_at)}</p>
                          </div>
                        </div>
                        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 shrink-0 no-print">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* PRs Merged Recently */}
              <Card className="border-slate-200 shadow-sm bg-white card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5 text-violet-500" />
                    Integrações de Código (Pull Requests)
                  </CardTitle>
                  <CardDescription>Alterações integradas à branch principal</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {data.pull_requests.recently_merged.map((pr) => (
                      <div key={pr.number} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <GitPullRequest className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              <span className="text-slate-400 font-mono mr-1">#{pr.number}</span>
                              {pr.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Merged em {formatDate(pr.merged_at)}</p>
                          </div>
                        </div>
                        <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 shrink-0 no-print">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2026 Dashboard de Projeto Corporativo. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Privacidade</span>
            <span>•</span>
            <span>Segurança</span>
            <span>•</span>
            <span>GitHub Actions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
