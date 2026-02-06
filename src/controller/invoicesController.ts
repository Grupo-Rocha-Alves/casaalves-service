import { Response } from 'express';
import { AuthRequest, CreateInvoiceDto, UpdateInvoiceDto, ListInvoicesFilters } from '../dtos/invoicesDto';
import { 
  serviceCreateInvoice, 
  serviceGetInvoiceById, 
  serviceUpdateInvoice, 
  serviceDeleteInvoice, 
  serviceListInvoices,
  serviceExportInvoicesToCSV
} from '../service/invoicesService';

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      data, 
      valor, 
      dataVencimento, 
      dataPagamento, 
      status, 
      formaPagamento, 
      nomeFornecedor, 
      documentoFornecedor, 
      descricao 
    } = req.body as CreateInvoiceDto;

    if (!data) {
      res.status(400).json({ 
        success: false, 
        message: 'Data é obrigatória' 
      });
      return;
    }

    if (!dataVencimento) {
      res.status(400).json({ 
        success: false, 
        message: 'Data de vencimento é obrigatória' 
      });
      return;
    }

    if (!nomeFornecedor) {
      res.status(400).json({ 
        success: false, 
        message: 'Nome do fornecedor é obrigatório' 
      });
      return;
    }

    if (!documentoFornecedor) {
      res.status(400).json({ 
        success: false, 
        message: 'Documento do fornecedor é obrigatório' 
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

    const newInvoice = await serviceCreateInvoice({ 
      data, 
      valor: valor || 0,
      dataVencimento,
      dataPagamento,
      status,
      formaPagamento,
      nomeFornecedor,
      documentoFornecedor,
      descricao
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice,
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Error creating invoice' 
    });
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid ID' 
      });
      return;
    }

    const invoice = await serviceGetInvoiceById(invoiceId);

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    
    if (error.message === 'Invoice not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching invoice' 
    });
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid ID' 
      });
      return;
    }

    const updateData = req.body as UpdateInvoiceDto;

    const updatedInvoice = await serviceUpdateInvoice(invoiceId, updateData);

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: updatedInvoice,
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    
    if (error.message === 'Invoice not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating invoice' 
    });
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid ID' 
      });
      return;
    }

    await serviceDeleteInvoice(invoiceId);

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    
    if (error.message === 'Invoice not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting invoice' 
    });
  }
};

export const listInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      mes, 
      ano, 
      status, 
      nomeFornecedor, 
      documentoFornecedor, 
      formaPagamento,
      dataInicio, 
      dataFim,
      dataVencimentoInicio,
      dataVencimentoFim,
      dataPagamentoInicio,
      dataPagamentoFim,
      page, 
      limit 
    } = req.query;

    const filters: ListInvoicesFilters = {
      mes: mes ? parseInt(mes as string) : undefined,
      ano: ano ? parseInt(ano as string) : undefined,
      status: status as string,
      nomeFornecedor: nomeFornecedor as string,
      documentoFornecedor: documentoFornecedor as string,
      formaPagamento: formaPagamento as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      dataVencimentoInicio: dataVencimentoInicio as string,
      dataVencimentoFim: dataVencimentoFim as string,
      dataPagamentoInicio: dataPagamentoInicio as string,
      dataPagamentoFim: dataPagamentoFim as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    };

    const result = await serviceListInvoices(filters);

    res.status(200).json({
      success: true,
      data: result.invoices,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Error listing invoices:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Error listing invoices' 
    });
  }
};

export const exportInvoicesToCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      mes, 
      ano, 
      status, 
      nomeFornecedor, 
      documentoFornecedor, 
      formaPagamento,
      dataInicio, 
      dataFim,
      dataVencimentoInicio,
      dataVencimentoFim,
      dataPagamentoInicio,
      dataPagamentoFim
    } = req.query;

    const filters: ListInvoicesFilters = {
      mes: mes ? parseInt(mes as string) : undefined,
      ano: ano ? parseInt(ano as string) : undefined,
      status: status as string,
      nomeFornecedor: nomeFornecedor as string,
      documentoFornecedor: documentoFornecedor as string,
      formaPagamento: formaPagamento as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      dataVencimentoInicio: dataVencimentoInicio as string,
      dataVencimentoFim: dataVencimentoFim as string,
      dataPagamentoInicio: dataPagamentoInicio as string,
      dataPagamentoFim: dataPagamentoFim as string,
      page: 1,
      limit: 999999,
    };

    const csvContent = await serviceExportInvoicesToCSV(filters);

    const fileName = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.write('\uFEFF');
    res.end(csvContent);
  } catch (error: any) {
    console.error('Error exporting invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting invoices',
    });
  }
};
