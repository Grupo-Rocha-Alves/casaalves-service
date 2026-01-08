import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, ChangePasswordDto, UpdateUserDto, ListUsersFilters } from '../dtos/authDto';
import { createUser, findUserByLogin, findUserById, findUserByIdWithPassword, updateUserPassword, updateUser, listUsers, deleteUser } from '../repository/authRepository';
import { calculatePagination } from '../helpers/repositoryHelper';

export async function serviceRegister(dto: RegisterDto) {
  if (dto.login.includes(' ')) {
    throw new Error('O login não pode conter espaços');
  }

  const existingUser = await findUserByLogin(dto.login);

  if (existingUser) {
    throw new Error('Login já cadastrado');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(dto.senha, saltRounds);

  const newUser = await createUser({
    nome: dto.nome,
    login: dto.login,
    senha: hashedPassword,
    nivelAcesso: dto.nivelAcesso,
  });

  return newUser;
}

export async function serviceLogin(dto: LoginDto) {
  const user = await findUserByLogin(dto.login);

  if (!user) {
    throw new Error('Login ou senha inválidos');
  }

  const isPasswordValid = await bcrypt.compare(dto.senha, user.senha);

  if (!isPasswordValid) {
    throw new Error('Login ou senha inválidos');
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET não configurado');
  }

  const token = jwt.sign(
    {
      userId: user.idUsuario,
      nivelAcesso: user.nivelAcesso,
    },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      idUsuario: user.idUsuario,
      nome: user.nome,
      nivelAcesso: user.nivelAcesso,
    },
  };
}

export async function serviceGetUserById(userId: number) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

export async function serviceChangePassword(userId: number, dto: ChangePasswordDto) {
  if (dto.novaSenha !== dto.confirmarNovaSenha) {
    throw new Error('As senhas não coincidem');
  }

  if (dto.novaSenha.length < 6) {
    throw new Error('A nova senha deve ter no mínimo 6 caracteres');
  }

  const user = await findUserByIdWithPassword(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isPasswordValid = await bcrypt.compare(dto.senhaAtual, user.senha);

  if (!isPasswordValid) {
    throw new Error('Senha atual incorreta');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(dto.novaSenha, saltRounds);

  const updatedUser = await updateUserPassword(userId, hashedPassword);

  return updatedUser;
}

export async function serviceUpdateUser(targetUserId: number, dto: UpdateUserDto) {
  const existingUser = await findUserById(targetUserId);

  if (!existingUser) {
    throw new Error('Usuário não encontrado');
  }

  if (dto.login && dto.login !== existingUser.login) {
    const userWithSameLogin = await findUserByLogin(dto.login);
    if (userWithSameLogin) {
      throw new Error('Login já está em uso');
    }
  }

  const updateData: UpdateUserDto = { ...dto };
  if (dto.senha) {
    const saltRounds = 10;
    updateData.senha = await bcrypt.hash(dto.senha, saltRounds);
  }

  const updatedUser = await updateUser(targetUserId, updateData);

  return updatedUser;
}

export async function serviceListUsers(filters: ListUsersFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;

  if (page < 1) {
    throw new Error('Página deve ser maior ou igual a 1');
  }

  if (limit < 1 || limit > 100) {
    throw new Error('Limite deve estar entre 1 e 100');
  }

  const { users, total } = await listUsers({
    ...filters,
    page,
    limit,
  });

  const { pagination } = calculatePagination(total, page, limit);

  return {
    users,
    pagination,
  };
}

export async function serviceDeleteUser(userId: number) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw new Error('Usuário não encontrado');
  }

  const deletedUser = await deleteUser(userId);

  return deletedUser;
}
