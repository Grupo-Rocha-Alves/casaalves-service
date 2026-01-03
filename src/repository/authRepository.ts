import { db } from "../db";
import { tbUsuarios } from "../db/schema";
import { eq, like, and, count } from "drizzle-orm";
import { RegisterDto, UpdateUserDto, ListUsersFilters } from "../dtos/authDto";

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
  const updateData: any = {};

  if (data.nome !== undefined) updateData.nome = data.nome;
  if (data.login !== undefined) updateData.login = data.login;
  if (data.senha !== undefined) updateData.senha = data.senha;
  if (data.nivelAcesso !== undefined) updateData.nivelAcesso = data.nivelAcesso;

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

  const conditions = [];

  if (nome) {
    conditions.push(like(tbUsuarios.nome, `%${nome}%`));
  }

  if (nivelAcesso !== undefined) {
    conditions.push(eq(tbUsuarios.nivelAcesso, nivelAcesso));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(tbUsuarios)
    .where(whereClause);

  const offset = (page - 1) * limit;

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
