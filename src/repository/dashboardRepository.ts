import { db } from "../db";
import { tbControleVendas, tbControleDespesas, tbControleDuplicatas } from "../db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export const getDashboardData = async (mes: number, ano: number, order: 'asc' | 'desc' = 'desc') => {
  const [salesData] = await db
    .select({
      totalCartao: sql<string>`COALESCE(SUM(${tbControleVendas.totalCartao}), 0)`,
      totalPix: sql<string>`COALESCE(SUM(${tbControleVendas.totalPix}), 0)`,
      totalEspecie: sql<string>`COALESCE(SUM(${tbControleVendas.totalEspecie}), 0)`,
      totalOutro: sql<string>`COALESCE(SUM(${tbControleVendas.totalOutro}), 0)`,
      totalGeral: sql<string>`COALESCE(SUM(${tbControleVendas.totalDia}), 0)`,
    })
    .from(tbControleVendas)
    .where(and(
      eq(tbControleVendas.mes, mes),
      eq(tbControleVendas.ano, ano)
    ));

  const [totalExpenses] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${tbControleDespesas.valor}), 0)`,
    })
    .from(tbControleDespesas)
    .where(and(
      eq(tbControleDespesas.mes, mes),
      eq(tbControleDespesas.ano, ano)
    ));

  const [expensesData] = await db
    .select({
      mercadorias: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDespesas.categoria} = 'Mercadorias' THEN ${tbControleDespesas.valor} ELSE 0 END), 0)`,
      servicos: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDespesas.categoria} = 'Serviços' THEN ${tbControleDespesas.valor} ELSE 0 END), 0)`,
      impostos: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDespesas.categoria} = 'Impostos' THEN ${tbControleDespesas.valor} ELSE 0 END), 0)`,
      diversos: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDespesas.categoria} = 'Diversos' THEN ${tbControleDespesas.valor} ELSE 0 END), 0)`,
      proventos: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDespesas.categoria} = 'Proventos' THEN ${tbControleDespesas.valor} ELSE 0 END), 0)`,
    })
    .from(tbControleDespesas)
    .where(and(
      eq(tbControleDespesas.mes, mes),
      eq(tbControleDespesas.ano, ano)
    ));

  const despesasOperacionais = parseFloat(expensesData.mercadorias) + parseFloat(expensesData.servicos);

  const despesasAdministrativas = parseFloat(expensesData.impostos) + parseFloat(expensesData.diversos);

  const despesasPessoais = parseFloat(expensesData.proventos);

  const [invoicesData] = await db
    .select({
      pendente: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDuplicatas.status} = 'Pendente' THEN ${tbControleDuplicatas.valor} ELSE 0 END), 0)`,
      pago: sql<string>`COALESCE(SUM(CASE WHEN ${tbControleDuplicatas.status} = 'Pago' THEN ${tbControleDuplicatas.valor} ELSE 0 END), 0)`,
      totalGeral: sql<string>`COALESCE(SUM(${tbControleDuplicatas.valor}), 0)`,
    })
    .from(tbControleDuplicatas)
    .where(and(
      eq(tbControleDuplicatas.mes, mes),
      eq(tbControleDuplicatas.ano, ano)
    ));

  const salesByDayOfWeek = await db
    .select({
      diaSemana: tbControleVendas.diaSemana,
      total: sql<string>`COALESCE(SUM(${tbControleVendas.totalDia}), 0)`,
    })
    .from(tbControleVendas)
    .where(and(
      eq(tbControleVendas.mes, mes),
      eq(tbControleVendas.ano, ano)
    ))
    .groupBy(tbControleVendas.diaSemana);

  const [daysCount] = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${tbControleVendas.data})`,
    })
    .from(tbControleVendas)
    .where(and(
      eq(tbControleVendas.mes, mes),
      eq(tbControleVendas.ano, ano)
    ));

  const salesByDate = await db
    .select({
      data: tbControleVendas.data,
      diaSemana: tbControleVendas.diaSemana,
      totalVendas: sql<string>`COALESCE(SUM(${tbControleVendas.totalDia}), 0)`,
    })
    .from(tbControleVendas)
    .where(and(
      eq(tbControleVendas.mes, mes),
      eq(tbControleVendas.ano, ano)
    ))
    .groupBy(tbControleVendas.data, tbControleVendas.diaSemana);

  const expensesByDate = await db
    .select({
      data: tbControleDespesas.data,
      total: sql<string>`COALESCE(SUM(${tbControleDespesas.valor}), 0)`,
    })
    .from(tbControleDespesas)
    .where(and(
      eq(tbControleDespesas.mes, mes),
      eq(tbControleDespesas.ano, ano)
    ))
    .groupBy(tbControleDespesas.data);

  const invoicesByDate = await db
    .select({
      data: tbControleDuplicatas.data,
      total: sql<string>`COALESCE(SUM(${tbControleDuplicatas.valor}), 0)`,
    })
    .from(tbControleDuplicatas)
    .where(and(
      eq(tbControleDuplicatas.mes, mes),
      eq(tbControleDuplicatas.ano, ano)
    ))
    .groupBy(tbControleDuplicatas.data);

  const dailyDataMap = new Map<string, any>();

  salesByDate.forEach(sale => {
    dailyDataMap.set(sale.data, {
      data: sale.data,
      diaSemana: sale.diaSemana,
      totalVendas: sale.totalVendas,
      totalDespesas: "0",
      totalDuplicatas: "0",
      total: "0"
    });
  });

  expensesByDate.forEach(expense => {
    if (dailyDataMap.has(expense.data)) {
      dailyDataMap.get(expense.data).totalDespesas = expense.total;
    }
  });

  invoicesByDate.forEach(invoice => {
    if (dailyDataMap.has(invoice.data)) {
      dailyDataMap.get(invoice.data).totalDuplicatas = invoice.total;
    }
  });

  const dailyData = Array.from(dailyDataMap.values()).map(item => {
    const total = (parseFloat(item.totalVendas) - parseFloat(item.totalDespesas) - parseFloat(item.totalDuplicatas)).toFixed(2);
    return {
      ...item,
      total
    };
  }).sort((a, b) => {
    if (order === 'asc') {
      return a.data.localeCompare(b.data);
    }
    return b.data.localeCompare(a.data);
  });

  return {
    vendas: salesData,
    totalDespesas: totalExpenses.total,
    despesas: {
      ...expensesData,
      totalGeral: totalExpenses.total,
    },
    duplicatas: invoicesData,
    despesasOperacionais: despesasOperacionais.toString(),
    despesasAdministrativas: despesasAdministrativas.toString(),
    despesasPessoais: despesasPessoais.toString(),
    vendasPorDiaSemana: salesByDayOfWeek,
    numeroDiasMes: daysCount.count,
    dadosDiarios: dailyData,
  };
};
