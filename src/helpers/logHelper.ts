import { db } from "../db";
import { tbLogs } from "../db/schema";

export const registerLog = async (userId: number, action: string): Promise<void> => {
  try {
    const dateTimeSP = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const [date, time] = dateTimeSP.split(', ');
    const [day, month, year] = date.split('/');
    const dateTimeISO = `${year}-${month}-${day} ${time}`;
    
    await db.insert(tbLogs).values({
      idUsuario: userId,
      acao: action,
      dataHora: dateTimeISO,
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
};

export const logAction = {
  create: (entity: string) => `Criou ${entity}`,
  update: (entity: string, id?: string | number) => 
    `Atualizou ${entity}${id ? ` (ID: ${id})` : ''}`,
  delete: (entity: string, id?: string | number) => 
    `Deletou ${entity}${id ? ` (ID: ${id})` : ''}`,
  login: () => "Realizou login",
  logout: () => "Realizou logout",
  changePassword: () => "Alterou a senha",
  custom: (description: string) => description,
};
