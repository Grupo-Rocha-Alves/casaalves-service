import { ListLogsFilters } from "../dtos/logDto";
import { listLogs } from "../repository/logRepository";
import { calculatePagination } from "../helpers/repositoryHelper";

export const serviceListLogs = async (filters: ListLogsFilters) => {
  const { logs, total } = await listLogs(filters);
  const { pagination } = calculatePagination(total, filters.page, filters.limit);

  return {
    logs,
    pagination,
  };
};

export const serviceExportLogsToCSV = async (filters: ListLogsFilters) => {
  const { logs } = await listLogs(filters);

  const header = ['ID', 'ID Usuário', 'Nome Usuário', 'Ação', 'Data/Hora'];

  const rows = logs.map(log => [
    log.idLog,
    log.idUsuario,
    `"${log.nomeUsuario || 'N/A'}"`,
    `"${log.acao.replace(/"/g, '""')}"`,
    formatDateTimeForCSV(log.dataHora)
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

function formatDateTimeForCSV(dataHora: string): string {
  const date = new Date(dataHora);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
