import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  userLogin?: string;
  nivelAcesso?: number;
}

export interface CreateSaleDto {
  data: string;
  totalCartao: string | number;
  totalPix: string | number;
  totalEspecie: string | number;
  totalOutro: string | number;
}

export interface UpdateSaleDto {
  data?: string;
  totalCartao?: string | number;
  totalPix?: string | number;
  totalEspecie?: string | number;
  totalOutro?: string | number;
}

export interface SaleResponse {
  idVenda: number;
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  totalCartao: string;
  totalPix: string;
  totalEspecie: string;
  totalOutro: string;
  totalDia: string;
}

export interface ListSalesFilters {
  mes?: number;
  ano?: number;
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
