import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../dtos/authDto";

export const authMiddleware = (minLevel: number = 0) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: "Token não fornecido",
        });
        return;
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2) {
        res.status(401).json({
          success: false,
          message: "Formato de token inválido",
        });
        return;
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({
          success: false,
          message: "Token mal formatado",
        });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET não configurado");
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      req.userId = decoded.userId;
      req.userLogin = decoded.login;
      req.nivelAcesso = decoded.nivelAcesso;

      if (decoded.nivelAcesso < minLevel) {
        res.status(403).json({
          success: false,
          message: "Acesso negado: nível de permissão insuficiente",
        });
        return;
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: "Token expirado",
        });
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: "Token inválido",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Erro ao validar token",
      });
    }
  };
};
