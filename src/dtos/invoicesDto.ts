import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  userLogin?: string;
  nivelAcesso?: number;
}

export interface CreateInvoiceDto {
  data: string;
  valor: string | number;
  dataVencimento: string;
  dataPagamento?: string;
  status?: string;
  formaPagamento?: string;
  nomeFornecedor: string;
  documentoFornecedor: string;
  descricao: string;
}

export interface UpdateInvoiceDto {
  data?: string;
  valor?: string | number;
  dataVencimento?: string;
  dataPagamento?: string;
  status?: string;
  formaPagamento?: string;
  nomeFornecedor?: string;
  documentoFornecedor?: string;
  descricao?: string;
}

export interface InvoiceResponse {
  idDuplicata: number;
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string | null;
  status: string;
  formaPagamento: string | null;
  nomeFornecedor: string;
  documentoFornecedor: string;
  descricao: string;
}

export interface ListInvoicesFilters {
  mes?: number;
  ano?: number;
  status?: string;
  nomeFornecedor?: string;
  documentoFornecedor?: string;
  formaPagamento?: string;
  dataInicio?: string;
  dataFim?: string;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  dataPagamentoInicio?: string;
  dataPagamentoFim?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
