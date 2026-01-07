import { Response } from "express";
import { AuthRequest } from "../dtos/authDto";
import { ListLogsFilters } from "../dtos/logDto";
import { serviceListLogs, serviceExportLogsToCSV } from "../service/logService";

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { idUsuario, acao, dataInicio, dataFim, page, limit } = req.query;

    const filters: ListLogsFilters = {
      idUsuario: idUsuario ? Number(idUsuario) : undefined,
      acao: acao as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const result = await serviceListLogs(filters);

    res.status(200).json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erro ao listar logs:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar logs",
    });
  }
};

export const exportLogsToCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { idUsuario, acao, dataInicio, dataFim } = req.query;

    const filters: ListLogsFilters = {
      idUsuario: idUsuario ? Number(idUsuario) : undefined,
      acao: acao as string,
      dataInicio: dataInicio as string,
      dataFim: dataFim as string,
      page: 1,
      limit: 999999, // Buscar todos os registros
    };

    const csvContent = await serviceExportLogsToCSV(filters);

    // Configurar headers para download do arquivo
    const fileName = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Enviar BOM para UTF-8 (para Excel reconhecer acentuação)
    res.write('\uFEFF');
    res.end(csvContent);
  } catch (error: any) {
    console.error("Erro ao exportar logs:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao exportar logs",
    });
  }
};
