export interface DashboardFilters {
  mes?: number;
  ano?: number;
}

export interface SalesBreakdown {
  totalCartao: string;
  totalPix: string;
  totalEspecie: string;
  totalOutro: string;
  totalGeral: string;
}

export interface ExpensesBreakdown {
  mercadorias: string;
  servicos: string;
  impostos: string;
  diversos: string;
  proventos: string;
  totalGeral: string;
}

export interface InvoicesBreakdown {
  pendente: string;
  pago: string;
  totalGeral: string;
}

export interface DailySales {
  diaSemana: string;
  total: string;
}

export interface DailyData {
  data: string;
  diaSemana: string;
  totalVendas: string;
  totalDespesas: string;
  totalDuplicatas: string;
  total: string;
  faturamentoLiquido: string;
}

export interface DashboardData {
  mes: number;
  ano: number;
  totalVendas: string;
  totalDespesas: string;
  totalDuplicatas: string;
  despesasOperacionais: string;
  despesasAdministrativas: string;
  despesasPessoais: string;
  faturamentoLiquido: string;
  margemLucro: string;
  mediaDiariaVendas: string;
  mediaDiariaDespesas: string;
  vendas: SalesBreakdown;
  despesas: ExpensesBreakdown;
  duplicatas: InvoicesBreakdown;
  vendasPorDiaSemana: DailySales[];
  numeroDiasMes: number;
  dadosDiarios: DailyData[];
}
