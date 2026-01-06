import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  userLogin?: string;
  nivelAcesso?: number;
}

export interface CreateExpenseDto {
  data: string;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: string | number;
}

export interface UpdateExpenseDto {
  data?: string;
  tipo?: string;
  categoria?: string;
  descricao?: string;
  valor?: string | number;
}

export interface ExpenseResponse {
  idDespesa: number;
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: string;
}

export interface ListExpensesFilters {
  mes?: number;
  ano?: number;
  tipo?: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
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
