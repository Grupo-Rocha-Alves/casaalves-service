import { db } from "../db";
import { tbLogs, tbUsuarios } from "../db/schema";
import { eq, and, gte, lte, ilike, sql, count } from "drizzle-orm";
import { ListLogsFilters } from "../dtos/logDto";
import { buildFilterConditions, calculatePagination } from "../helpers/repositoryHelper";

export const listLogs = async (filters: ListLogsFilters) => {
  const { idUsuario, acao, dataInicio, dataFim, page = 1, limit = 10 } = filters;

  const conditionBuilders = {
    idUsuario: (value: number) => eq(tbLogs.idUsuario, value),
    acao: (value: string) => ilike(tbLogs.acao, `%${value}%`),
    dataInicio: (value: string) => gte(tbLogs.dataHora, value),
    dataFim: (value: string) => lte(tbLogs.dataHora, value),
  };

  const conditions = buildFilterConditions({ idUsuario, acao, dataInicio, dataFim }, conditionBuilders);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbLogs)
    .where(whereClause);

  const { offset } = calculatePagination(Number(total), page, limit);

  const logs = await db
    .select({
      idLog: tbLogs.idLog,
      idUsuario: tbLogs.idUsuario,
      nomeUsuario: tbUsuarios.nome,
      acao: tbLogs.acao,
      dataHora: tbLogs.dataHora,
    })
    .from(tbLogs)
    .leftJoin(tbUsuarios, eq(tbLogs.idUsuario, tbUsuarios.idUsuario))
    .where(whereClause)
    .orderBy(sql`${tbLogs.dataHora} DESC`)
    .limit(limit)
    .offset(offset);

  return {
    logs,
    total: Number(total),
  };
};
