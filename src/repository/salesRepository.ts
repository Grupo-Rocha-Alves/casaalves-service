import { db } from "../db";
import { tbControleVendas } from "../db/schema";
import { eq, and, gte, lte, count } from "drizzle-orm";
import { ListSalesFilters } from "../dtos/salesDto";
import { buildUpdateData, buildFilterConditions, calculatePagination } from "../helpers/repositoryHelper";

export const createSales = async (data: {
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  totalCartao: string;
  totalPix: string;
  totalEspecie: string;
  totalOutro: string;
  totalDia: string;
}) => {
  const [newSale] = await db
    .insert(tbControleVendas)
    .values({
      data: data.data,
      mes: data.mes,
      ano: data.ano,
      diaSemana: data.diaSemana,
      totalCartao: data.totalCartao,
      totalPix: data.totalPix,
      totalEspecie: data.totalEspecie,
      totalOutro: data.totalOutro,
      totalDia: data.totalDia,
    })
    .returning();

  return newSale;
};

export const findSaleById = async (id: number) => {
  const [sale] = await db
    .select()
    .from(tbControleVendas)
    .where(eq(tbControleVendas.idVenda, id))
    .limit(1);

  return sale;
};

export const updateSale = async (
  saleId: number,
  data: {
    data?: string;
    mes?: number;
    ano?: number;
    diaSemana?: string;
    totalCartao?: string;
    totalPix?: string;
    totalEspecie?: string;
    totalOutro?: string;
    totalDia?: string;
  }
) => {
  const updateData = buildUpdateData(data);

  const [updatedSale] = await db
    .update(tbControleVendas)
    .set(updateData)
    .where(eq(tbControleVendas.idVenda, saleId))
    .returning();

  return updatedSale;
};

export const deleteSale = async (saleId: number) => {
  const [deletedSale] = await db
    .delete(tbControleVendas)
    .where(eq(tbControleVendas.idVenda, saleId))
    .returning();

  return deletedSale;
};

export const listSales = async (filters: ListSalesFilters) => {
  const { mes, ano, dataInicio, dataFim, page = 1, limit = 10 } = filters;

  const conditionBuilders = {
    mes: (value: number) => eq(tbControleVendas.mes, value),
    ano: (value: number) => eq(tbControleVendas.ano, value),
    dataInicio: (value: string) => gte(tbControleVendas.data, value),
    dataFim: (value: string) => lte(tbControleVendas.data, value),
  };

  const conditions = buildFilterConditions({ mes, ano, dataInicio, dataFim }, conditionBuilders);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbControleVendas)
    .where(whereClause);

  const { offset } = calculatePagination(Number(total), page, limit);

  const vendas = await db
    .select()
    .from(tbControleVendas)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  return {
    vendas,
    total: Number(total),
  };
};
