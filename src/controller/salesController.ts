import { Response } from 'express';
import { AuthRequest, CreateSaleDto, UpdateSaleDto, ListSalesFilters } from '../dtos/salesDto';
import { 
  serviceCreateSale, 
  serviceGetSaleById, 
  serviceUpdateSale, 
  serviceDeleteSale, 
  serviceListSales 
} from '../service/salesService';

export const createSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, totalCartao, totalPix, totalEspecie, totalOutro } = req.body as CreateSaleDto;

    if (!data) {
      res.status(400).json({ 
        success: false, 
        message: 'Data é obrigatória' 
      });
      return;
    }

    const newVenda = await serviceCreateSale({ 
      data, 
      totalCartao: totalCartao || 0, 
      totalPix: totalPix || 0, 
      totalEspecie: totalEspecie || 0, 
      totalOutro: totalOutro || 0 
    });

    res.status(201).json({
      success: true,
      message: 'Venda cadastrada com sucesso',
      data: newVenda,
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar venda:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao cadastrar venda' 
    });
  }
};

export const getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saleId = parseInt(req.params.id);

    if (isNaN(saleId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    const sale = await serviceGetSaleById(saleId);

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error: any) {
    console.error('Erro ao buscar venda:', error);
    
    if (error.message === 'Venda não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar venda' 
    });
  }
};

export const updateSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saleId = parseInt(req.params.id);

    if (isNaN(saleId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    const updateData = req.body as UpdateSaleDto;

    const updatedSale = await serviceUpdateSale(saleId, updateData);

    res.status(200).json({
      success: true,
      message: 'Venda atualizada com sucesso',
      data: updatedSale,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar venda:', error);
    
    if (error.message === 'Venda não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar venda' 
    });
  }
};

export const deleteSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saleId = parseInt(req.params.id);

    if (isNaN(saleId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID inválido' 
      });
      return;
    }

    await serviceDeleteSale(saleId);

    res.status(200).json({
      success: true,
      message: 'Venda excluída com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao excluir venda:', error);
    
    if (error.message === 'Venda não encontrada') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao excluir venda' 
    });
  }
};

export const listSales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mes, ano, dataInicio, dataFim, page, limit } = req.query;

    const filters: ListSalesFilters = {
      mes: mes ? parseInt(mes as string) : undefined,
      ano: ano ? parseInt(ano as string) : undefined,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    };

    const result = await serviceListSales(filters);

    res.status(200).json({
      success: true,
      data: result.vendas,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Erro ao listar vendas:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao listar vendas' 
    });
  }
};
