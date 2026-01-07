import { db } from "../db";
import { tbControleDespesas } from "../db/schema";
import { eq, and, gte, lte, count, sql } from "drizzle-orm";
import { ListExpensesFilters } from "../dtos/expensesDto";
import { buildUpdateData, buildFilterConditions, calculatePagination } from "../helpers/repositoryHelper";

export const createExpense = async (data: {
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: string;
}) => {
  const [newExpense] = await db
    .insert(tbControleDespesas)
    .values({
      data: data.data,
      mes: data.mes,
      ano: data.ano,
      diaSemana: data.diaSemana,
      tipo: data.tipo,
      categoria: data.categoria,
      descricao: data.descricao,
      valor: data.valor,
    })
    .returning();

  return newExpense;
};

export const findExpenseById = async (id: number) => {
  const [expense] = await db
    .select()
    .from(tbControleDespesas)
    .where(eq(tbControleDespesas.idDespesa, id))
    .limit(1);

  return expense;
};

export const updateExpense = async (
  expenseId: number,
  data: {
    data?: string;
    mes?: number;
    ano?: number;
    diaSemana?: string;
    tipo?: string;
    categoria?: string;
    descricao?: string;
    valor?: string;
  }
) => {
  const updateData = buildUpdateData(data);

  const [updatedExpense] = await db
    .update(tbControleDespesas)
    .set(updateData)
    .where(eq(tbControleDespesas.idDespesa, expenseId))
    .returning();

  return updatedExpense;
};

export const deleteExpense = async (expenseId: number) => {
  const [deletedExpense] = await db
    .delete(tbControleDespesas)
    .where(eq(tbControleDespesas.idDespesa, expenseId))
    .returning();

  return deletedExpense;
};

export const listExpenses = async (filters: ListExpensesFilters) => {
  const { mes, ano, tipo, categoria, dataInicio, dataFim, page = 1, limit = 10 } = filters;

  const conditionBuilders = {
    mes: (value: number) => eq(tbControleDespesas.mes, value),
    ano: (value: number) => eq(tbControleDespesas.ano, value),
    tipo: (value: string) => eq(tbControleDespesas.tipo, value),
    categoria: (value: string) => eq(tbControleDespesas.categoria, value),
    dataInicio: (value: string) => gte(tbControleDespesas.data, value),
    dataFim: (value: string) => lte(tbControleDespesas.data, value),
  };

  const conditions = buildFilterConditions({ mes, ano, tipo, categoria, dataInicio, dataFim }, conditionBuilders);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbControleDespesas)
    .where(whereClause);

  const { offset } = calculatePagination(Number(total), page, limit);

  const despesas = await db
    .select()
    .from(tbControleDespesas)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(sql`${tbControleDespesas.data} DESC`);

  return {
    despesas,
    total: Number(total),
  };
};
