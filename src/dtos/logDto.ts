export interface ListLogsFilters {
  idUsuario?: number;
  acao?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export interface LogResponse {
  idLog: number;
  idUsuario: number;
  nomeUsuario?: string;
  acao: string;
  dataHora: string;
}
