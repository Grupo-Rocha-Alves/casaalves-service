import { db } from "../db";
import { tbLogs, tbUsuarios } from "../db/schema";
import { eq, and, gte, lte, like, sql } from "drizzle-orm";
import { ListLogsFilters } from "../dtos/logDto";

export const listLogs = async (filters: ListLogsFilters) => {
  const { idUsuario, acao, dataInicio, dataFim, page = 1, limit = 10 } = filters;

  const conditions = [];

  if (idUsuario) {
    conditions.push(eq(tbLogs.idUsuario, idUsuario));
  }

  if (acao) {
    conditions.push(like(tbLogs.acao, `%${acao}%`));
  }

  if (dataInicio) {
    conditions.push(gte(tbLogs.dataHora, dataInicio));
  }

  if (dataFim) {
    conditions.push(lte(tbLogs.dataHora, dataFim));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(tbLogs)
    .where(whereClause);

  const offset = (page - 1) * limit;
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
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};
