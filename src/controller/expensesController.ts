import { Response } from 'express';
import { AuthRequest, CreateExpenseDto, UpdateExpenseDto, ListExpensesFilters } from '../dtos/expensesDto';
import { 
  serviceCreateExpense, 
  serviceGetExpenseById, 
  serviceUpdateExpense, 
  serviceDeleteExpense, 
  serviceListExpenses,
  serviceExportExpensesToCSV
} from '../service/expensesService';

export const createExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, tipo, categoria, descricao, valor } = req.body as CreateExpenseDto;

    if (!data) {
      res.status(400).json({ 
        success: false, 
        message: 'Data é obrigatória' 
      });
      return;
    }

    if (!tipo) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo é obrigatório' 
      });
      return;
    }

    if (!categoria) {
      res.status(400).json({ 
        success: false, 
        message: 'Categoria é obrigatória' 
      });
      return;
    }

    if (!descricao) {
      res.status(400).json({ 
        success: false, 
        message: 'Descrição é obrigatória' 
      });
      return;
    }

    const newExpense = await serviceCreateExpense({ 
      data, 
      tipo,
      categoria,
      descricao,
      valor: valor || 0
    });

    res.status(201).json({
      success: true,
      message: 'Despesa cadastrada com sucesso',
      data: newExpense,
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar despesa:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao cadastrar despesa' 
    });
  }
};

export const getExpenseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenseId = parseInt(req.params.id);

    if (isNaN(expenseId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    const expense = await serviceGetExpenseById(expenseId);

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    console.error('Erro ao buscar despesa:', error);
    
    if (error.message === 'Despesa não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar despesa' 
    });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenseId = parseInt(req.params.id);

    if (isNaN(expenseId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    const updateData = req.body as UpdateExpenseDto;

    const updatedExpense = await serviceUpdateExpense(expenseId, updateData);

    res.status(200).json({
      success: true,
      message: 'Despesa atualizada com sucesso',
      data: updatedExpense,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar despesa:', error);
    
    if (error.message === 'Despesa não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar despesa' 
    });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenseId = parseInt(req.params.id);

    if (isNaN(expenseId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    await serviceDeleteExpense(expenseId);

    res.status(200).json({
      success: true,
      message: 'Despesa excluída com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao excluir despesa:', error);
    
    if (error.message === 'Despesa não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao excluir despesa' 
    });
  }
};

export const listExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mes, ano, tipo, categoria, dataInicio, dataFim, page, limit } = req.query;

    const filters: ListExpensesFilters = {
      mes: mes ? parseInt(mes as string) : undefined,
      ano: ano ? parseInt(ano as string) : undefined,
      tipo: tipo as string,
      categoria: categoria as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    };

    const result = await serviceListExpenses(filters);

    res.status(200).json({
      success: true,
      data: result.despesas,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Erro ao listar despesas:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao listar despesas' 
    });
  }
};

export const exportExpensesToCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mes, ano, tipo, categoria, dataInicio, dataFim } = req.query;

    const filters: ListExpensesFilters = {
      mes: mes ? parseInt(mes as string) : undefined,
      ano: ano ? parseInt(ano as string) : undefined,
      tipo: tipo as string,
      categoria: categoria as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: 1,
      limit: 999999,
    };

    const csvContent = await serviceExportExpensesToCSV(filters);

    const fileName = `despesas_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.write('\uFEFF');
    res.end(csvContent);
  } catch (error: any) {
    console.error('Erro ao exportar despesas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar despesas',
    });
  }
};
