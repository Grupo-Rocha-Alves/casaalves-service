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
