import { Request, Response } from "express";
import { fetchDashboardData } from "../service/dashboardService";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const mes = req.query.mes ? parseInt(req.query.mes as string) : undefined;
    const ano = req.query.ano ? parseInt(req.query.ano as string) : undefined;
    const order = (req.query.order as 'asc' | 'desc') || 'desc';

    if ((req.query.mes && isNaN(mes!)) || (req.query.ano && isNaN(ano!))) {
      return res.status(400).json({
        error: "Parâmetros inválidos. 'mes' e 'ano' devem ser números.",
      });
    }

    if (order !== 'asc' && order !== 'desc') {
      return res.status(400).json({
        error: "Parâmetro 'order' inválido. Deve ser 'asc' ou 'desc'.",
      });
    }

    const dashboardData = await fetchDashboardData(mes, ano, order);

    return res.status(200).json(dashboardData);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("inválido")) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }

    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      error: "Erro ao buscar dados do dashboard.",
    });
  }
};
