import { db } from "../db";
import { tbUsuarios } from "../db/schema";
import { eq, like, and, count } from "drizzle-orm";
import { RegisterDto, UpdateUserDto, ListUsersFilters } from "../dtos/authDto";
import { buildUpdateData, buildFilterConditions, calculatePagination } from "../helpers/repositoryHelper";

export const createUser = async (data: RegisterDto & { senha: string }) => {
  const [newUser] = await db
    .insert(tbUsuarios)
    .values({
      nome: data.nome,
      login: data.login,
      senha: data.senha,
      nivelAcesso: data.nivelAcesso || 1,
    })
    .returning({
      idUsuario: tbUsuarios.idUsuario,
      nome: tbUsuarios.nome,
      login: tbUsuarios.login,
      nivelAcesso: tbUsuarios.nivelAcesso,
    });

  return newUser;
};

export const findUserByLogin = async (login: string) => {
  const [user] = await db
    .select()
    .from(tbUsuarios)
    .where(eq(tbUsuarios.login, login))
    .limit(1);

  return user;
};

export const findUserById = async (id: number) => {
  const [user] = await db
    .select({
      idUsuario: tbUsuarios.idUsuario,
      nome: tbUsuarios.nome,
      login: tbUsuarios.login,
      nivelAcesso: tbUsuarios.nivelAcesso,
    })
    .from(tbUsuarios)
    .where(eq(tbUsuarios.idUsuario, id))
    .limit(1);

  return user;
};

export const updateUserPassword = async (
  userId: number,
  newHashedPassword: string
) => {
  const [updatedUser] = await db
    .update(tbUsuarios)
    .set({ senha: newHashedPassword })
    .where(eq(tbUsuarios.idUsuario, userId))
    .returning({
      idUsuario: tbUsuarios.idUsuario,
      nome: tbUsuarios.nome,
      login: tbUsuarios.login,
    });

  return updatedUser;
};

export const findUserByIdWithPassword = async (id: number) => {
  const [user] = await db
    .select()
    .from(tbUsuarios)
    .where(eq(tbUsuarios.idUsuario, id))
    .limit(1);

  return user;
};

export const updateUser = async (userId: number, data: UpdateUserDto) => {
  const updateData = buildUpdateData(data);

  const [updatedUser] = await db
    .update(tbUsuarios)
    .set(updateData)
    .where(eq(tbUsuarios.idUsuario, userId))
    .returning({
      idUsuario: tbUsuarios.idUsuario,
      nome: tbUsuarios.nome,
      login: tbUsuarios.login,
      nivelAcesso: tbUsuarios.nivelAcesso,
    });

  return updatedUser;
};

export const listUsers = async (filters: ListUsersFilters) => {
  const { nome, nivelAcesso, page = 1, limit = 10 } = filters;

  const conditionBuilders = {
    nome: (value: string) => like(tbUsuarios.nome, `%${value}%`),
    nivelAcesso: (value: number) => eq(tbUsuarios.nivelAcesso, value),
  };

  const conditions = buildFilterConditions({ nome, nivelAcesso }, conditionBuilders);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbUsuarios)
    .where(whereClause);

  const { offset } = calculatePagination(Number(total), page, limit);

  const users = await db
    .select({
      idUsuario: tbUsuarios.idUsuario,
      nome: tbUsuarios.nome,
      login: tbUsuarios.login,
      nivelAcesso: tbUsuarios.nivelAcesso,
    })
    .from(tbUsuarios)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  return {
    users,
    total: Number(total),
  };
};
