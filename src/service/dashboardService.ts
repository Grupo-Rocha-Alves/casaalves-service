import { getDashboardData } from "../repository/dashboardRepository";
import { DashboardData, DailyData } from "../dtos/dashboardDto";

export const fetchDashboardData = async (
  mes?: number, 
  ano?: number,
  order: 'asc' | 'desc' = 'desc'
): Promise<DashboardData> => {
  const now = new Date();
  const currentMonth = mes ?? now.getMonth() + 1;
  const currentYear = ano ?? now.getFullYear();

  if (currentMonth < 1 || currentMonth > 12) {
    throw new Error("Mês inválido. Deve estar entre 1 e 12.");
  }

  if (currentYear < 2000 || currentYear > 2100) {
    throw new Error("Ano inválido.");
  }

  const data = await getDashboardData(currentMonth, currentYear, order);

  const totalVendas = parseFloat(data.vendas.totalGeral);
  const totalDespesas = parseFloat(data.totalDespesas);
  const totalDuplicatas = parseFloat(data.duplicatas.totalGeral);

  const faturamentoLiquido = totalVendas - totalDespesas - totalDuplicatas;

  const margemLucro = totalVendas > 0 ? (faturamentoLiquido / totalVendas) * 100 : 0;

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const mediaDiariaVendas = totalVendas / daysInMonth;

  const mediaDiariaDespesas = Math.abs(totalDespesas) / daysInMonth;

  const dadosDiariosComFaturamento: DailyData[] = data.dadosDiarios.map(dia => ({
    ...dia,
    totalDuplicatas: dia.totalDuplicatas,
    faturamentoLiquido: dia.total,
  }));

  return {
    mes: currentMonth,
    ano: currentYear,
    totalVendas: totalVendas.toFixed(2),
    totalDespesas: totalDespesas.toFixed(2),
    totalDuplicatas: totalDuplicatas.toFixed(2),
    despesasOperacionais: data.despesasOperacionais,
    despesasAdministrativas: data.despesasAdministrativas,
    despesasPessoais: data.despesasPessoais,
    faturamentoLiquido: faturamentoLiquido.toFixed(2),
    margemLucro: margemLucro.toFixed(2),
    mediaDiariaVendas: mediaDiariaVendas.toFixed(2),
    mediaDiariaDespesas: mediaDiariaDespesas.toFixed(2),
    vendas: data.vendas,
    despesas: data.despesas,
    duplicatas: data.duplicatas,
    vendasPorDiaSemana: data.vendasPorDiaSemana,
    numeroDiasMes: data.numeroDiasMes,
    dadosDiarios: dadosDiariosComFaturamento,
  };
};
