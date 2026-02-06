import { db } from "../db";
import { tbControleDuplicatas } from "../db/schema";
import { eq, and, gte, lte, count, sql, ilike } from "drizzle-orm";
import { ListInvoicesFilters } from "../dtos/invoicesDto";
import { buildUpdateData, buildFilterConditions, calculatePagination } from "../helpers/repositoryHelper";

export const createInvoice = async (data: {
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  valor: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  formaPagamento?: string;
  nomeFornecedor: string;
  documentoFornecedor: string;
  descricao: string;
}) => {
  const [newInvoice] = await db
    .insert(tbControleDuplicatas)
    .values({
      data: data.data,
      mes: data.mes,
      ano: data.ano,
      diaSemana: data.diaSemana,
      valor: data.valor,
      dataVencimento: data.dataVencimento,
      dataPagamento: data.dataPagamento || null,
      status: data.status,
      formaPagamento: data.formaPagamento || null,
      nomeFornecedor: data.nomeFornecedor,
      documentoFornecedor: data.documentoFornecedor,
      descricao: data.descricao,
    })
    .returning();

  return newInvoice;
};

export const findInvoiceById = async (id: number) => {
  const [invoice] = await db
    .select()
    .from(tbControleDuplicatas)
    .where(eq(tbControleDuplicatas.idDuplicata, id))
    .limit(1);

  return invoice;
};

export const updateInvoice = async (
  invoiceId: number,
  data: {
    data?: string;
    mes?: number;
    ano?: number;
    diaSemana?: string;
    valor?: string;
    dataVencimento?: string;
    dataPagamento?: string;
    status?: string;
    formaPagamento?: string;
    nomeFornecedor?: string;
    documentoFornecedor?: string;
    descricao?: string;
  }
) => {
  const updateData = buildUpdateData(data);

  const [updatedInvoice] = await db
    .update(tbControleDuplicatas)
    .set(updateData)
    .where(eq(tbControleDuplicatas.idDuplicata, invoiceId))
    .returning();

  return updatedInvoice;
};

export const deleteInvoice = async (invoiceId: number) => {
  const [deletedInvoice] = await db
    .delete(tbControleDuplicatas)
    .where(eq(tbControleDuplicatas.idDuplicata, invoiceId))
    .returning();

  return deletedInvoice;
};

export const listInvoices = async (filters: ListInvoicesFilters) => {
  const { 
    mes, 
    ano, 
    status, 
    nomeFornecedor, 
    documentoFornecedor, 
    formaPagamento,
    dataInicio, 
    dataFim,
    dataVencimentoInicio,
    dataVencimentoFim,
    dataPagamentoInicio,
    dataPagamentoFim,
    page = 1, 
    limit = 10 
  } = filters;

  const conditionBuilders = {
    mes: (value: number) => eq(tbControleDuplicatas.mes, value),
    ano: (value: number) => eq(tbControleDuplicatas.ano, value),
    status: (value: string) => ilike(tbControleDuplicatas.status, `%${value}%`),
    nomeFornecedor: (value: string) => ilike(tbControleDuplicatas.nomeFornecedor, `%${value}%`),
    documentoFornecedor: (value: string) => ilike(tbControleDuplicatas.documentoFornecedor, `%${value}%`),
    formaPagamento: (value: string) => ilike(tbControleDuplicatas.formaPagamento, `%${value}%`),
    dataInicio: (value: string) => gte(tbControleDuplicatas.data, value),
    dataFim: (value: string) => lte(tbControleDuplicatas.data, value),
    dataVencimentoInicio: (value: string) => gte(tbControleDuplicatas.dataVencimento, value),
    dataVencimentoFim: (value: string) => lte(tbControleDuplicatas.dataVencimento, value),
    dataPagamentoInicio: (value: string) => gte(tbControleDuplicatas.dataPagamento, value),
    dataPagamentoFim: (value: string) => lte(tbControleDuplicatas.dataPagamento, value),
  };

  const conditions = buildFilterConditions(
    { 
      mes, 
      ano, 
      status, 
      nomeFornecedor, 
      documentoFornecedor, 
      formaPagamento,
      dataInicio, 
      dataFim,
      dataVencimentoInicio,
      dataVencimentoFim,
      dataPagamentoInicio,
      dataPagamentoFim
    }, 
    conditionBuilders
  );
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbControleDuplicatas)
    .where(whereClause);

  const { offset } = calculatePagination(Number(total), page, limit);

  const invoices = await db
    .select()
    .from(tbControleDuplicatas)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(sql`${tbControleDuplicatas.data} DESC`);

  return {
    invoices,
    total: Number(total),
  };
};
