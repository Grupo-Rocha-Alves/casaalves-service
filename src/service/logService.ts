import { ListLogsFilters } from "../dtos/logDto";
import { listLogs } from "../repository/logRepository";

export const serviceListLogs = async (filters: ListLogsFilters) => {
  return await listLogs(filters);
};
