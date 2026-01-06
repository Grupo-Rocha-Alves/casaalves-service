import { Response, NextFunction } from "express";
import { AuthRequest } from "../dtos/authDto";
import { registerLog } from "../helpers/logHelper";

export const logMiddleware = (actionDescription: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const method = req.method.toUpperCase();
    
    if (method === 'GET') {
      next();
      return;
    }

    const originalSend = res.send;
    res.send = function (data: any) {
      res.send = originalSend;
      const result = res.send(data);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let userId = req.userId;
        
        if (!userId) {
          try {
            const responseData = typeof data === 'string' ? JSON.parse(data) : data;
            userId = responseData?.data?.user?.idUsuario || responseData?.data?.idUsuario;
          } catch (error) {
            console.error("Erro ao capturar userId da resposta:", error);
          }
        }
        
        if (userId) {
          registerLog(userId, actionDescription).catch((error) => {
            console.error("Erro ao registrar log no middleware:", error);
          });
        }
      }
      
      return result;
    };

    next();
  };
};
