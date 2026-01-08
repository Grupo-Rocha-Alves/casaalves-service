import { Response } from 'express';
import { AuthRequest, RegisterDto, LoginDto, ChangePasswordDto, UpdateUserDto, ListUsersFilters } from '../dtos/authDto';
import { serviceRegister, serviceLogin, serviceGetUserById, serviceChangePassword, serviceUpdateUser, serviceListUsers, serviceDeleteUser } from '../service/authService';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome, login, senha, nivelAcesso } = req.body as RegisterDto;

    if (!nome || !login || !senha) {
      res.status(400).json({ 
        success: false, 
        message: 'Nome, login e senha são obrigatórios' 
      });
      return;
    }

    if (login.includes(' ')) {
      res.status(400).json({ 
        success: false, 
        message: 'O login não pode conter espaços' 
      });
      return;
    }

    const newUser = await serviceRegister({ nome, login, senha, nivelAcesso });

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: newUser,
    });
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    
    if (error.message === 'Email já cadastrado') {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao cadastrar usuário' 
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { login, senha } = req.body as LoginDto;

    if (!login || !senha) {
      res.status(400).json({ 
        success: false, 
        message: 'Login e senha são obrigatórios' 
      });
      return;
    }

    const data = await serviceLogin({ login, senha });

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data,
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    
    if (error.message === 'Login ou senha inválidos' || error.message === 'JWT_SECRET não configurado') {
      res.status(401).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao realizar login' 
    });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    const user = await serviceGetUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    
    if (error.message === 'Usuário não encontrado') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar informações do usuário' 
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    const { senhaAtual, novaSenha, confirmarNovaSenha } = req.body as ChangePasswordDto;

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      res.status(400).json({ 
        success: false, 
        message: 'Todos os campos são obrigatórios' 
      });
      return;
    }

    await serviceChangePassword(userId, { senhaAtual, novaSenha, confirmarNovaSenha });

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    
    if (error.message === 'As senhas não coincidem' || 
        error.message === 'A nova senha deve ter no mínimo 6 caracteres' ||
        error.message === 'Senha atual incorreta') {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    if (error.message === 'Usuário não encontrado') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao alterar senha' 
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = parseInt(req.params.id);
    
    if (isNaN(targetUserId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuário inválido' 
      });
      return;
    }

    const { nome, login, senha, nivelAcesso } = req.body as UpdateUserDto;

    if (!nome && !login && !senha && nivelAcesso === undefined) {
      res.status(400).json({ 
        success: false, 
        message: 'Pelo menos um campo deve ser fornecido para atualização' 
      });
      return;
    }

    const updateData: UpdateUserDto = {};
    if (nome) updateData.nome = nome;
    if (login) updateData.login = login;
    if (senha) updateData.senha = senha;
    if (nivelAcesso !== undefined) updateData.nivelAcesso = nivelAcesso;

    const updatedUser = await serviceUpdateUser(targetUserId, updateData);

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    
    if (error.message === 'Usuário não encontrado') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }

    if (error.message === 'Login já está em uso') {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar usuário' 
    });
  }
};

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome, nivelAcesso, page, limit } = req.query;

    const filters: ListUsersFilters = {};

    if (nome) filters.nome = String(nome);
    if (nivelAcesso) filters.nivelAcesso = parseInt(String(nivelAcesso));
    if (page) filters.page = parseInt(String(page));
    if (limit) filters.limit = parseInt(String(limit));

    const result = await serviceListUsers(filters);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error);
    
    if (error.message === 'Página deve ser maior ou igual a 1' || 
        error.message === 'Limite deve estar entre 1 e 100') {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao listar usuários' 
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = parseInt(req.params.id);
    
    if (isNaN(targetUserId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuário inválido' 
      });
      return;
    }

    const deletedUser = await serviceDeleteUser(targetUserId);

    res.status(200).json({
      success: true,
      message: 'Usuário excluído com sucesso',
      data: deletedUser,
    });
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    
    if (error.message === 'Usuário não encontrado') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao excluir usuário' 
    });
  }
};
