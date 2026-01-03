import { db } from "../db";
import { tbLogs } from "../db/schema";

export const registrarLog = async (idUsuario: number, acao: string): Promise<void> => {
  try {
    // Cria data/hora no timezone de São Paulo
    const dataHoraSP = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Converte para formato ISO que o PostgreSQL aceita
    const [data, hora] = dataHoraSP.split(', ');
    const [dia, mes, ano] = data.split('/');
    const dataHoraISO = `${ano}-${mes}-${dia} ${hora}`;
    
    await db.insert(tbLogs).values({
      idUsuario,
      acao,
      dataHora: dataHoraISO,
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
};

export const acaoLog = {
  criar: (entidade: string) => `Criou ${entidade}`,
  atualizar: (entidade: string, id?: string | number) => 
    `Atualizou ${entidade}${id ? ` (ID: ${id})` : ''}`,
  deletar: (entidade: string, id?: string | number) => 
    `Deletou ${entidade}${id ? ` (ID: ${id})` : ''}`,
  login: () => "Realizou login",
  logout: () => "Realizou logout",
  alterarSenha: () => "Alterou a senha",
  custom: (descricao: string) => descricao,
};
