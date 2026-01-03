import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  userLogin?: string;
  nivelAcesso?: number;
}

export interface JwtPayload {
  userId: number;
  login: string;
  nivelAcesso: number;
}

export interface RegisterDto {
  nome: string;
  login: string;
  senha: string;
  nivelAcesso?: number;
}

export interface LoginDto {
  login: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      idUsuario: number;
      nome: string;
      nivelAcesso: number;
    };
  };
}

export interface UserResponse {
  idUsuario: number;
  nome: string;
  login: string;
  nivelAcesso: number;
}

export interface ChangePasswordDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

export interface UpdateUserDto {
  nome?: string;
  login?: string;
  senha?: string;
  nivelAcesso?: number;
}

export interface ListUsersFilters {
  nome?: string;
  login?: string;
  nivelAcesso?: number;
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
