import { Response } from "express";
import { AuthRequest } from "../dtos/authDto";
import { ListLogsFilters } from "../dtos/logDto";
import { serviceListLogs } from "../service/logService";

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
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error("Erro ao listar logs:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar logs",
    });
  }
};
