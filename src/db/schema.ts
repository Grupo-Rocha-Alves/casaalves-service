import { pgTable, serial, date, integer, varchar, numeric, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tbControleVendas = pgTable("tb_controle_vendas", {
	idVenda: serial("id_venda").primaryKey().notNull(),
	data: date().notNull(),
	mes: integer().notNull(),
	ano: integer().notNull(),
	diaSemana: varchar("dia_semana", { length: 15 }).notNull(),
	totalCartao: numeric("total_cartao", { precision: 10, scale:  2 }).default('0').notNull(),
	totalPix: numeric("total_pix", { precision: 10, scale:  2 }).default('0').notNull(),
	totalEspecie: numeric("total_especie", { precision: 10, scale:  2 }).default('0').notNull(),
	totalOutro: numeric("total_outro", { precision: 10, scale:  2 }).default('0').notNull(),
	totalDia: numeric("total_dia", { precision: 10, scale:  2 }).default('0').notNull(),
});

export const tbLogs = pgTable("tb_logs", {
	idLog: serial("id_log").primaryKey().notNull(),
	idUsuario: integer("id_usuario").notNull(),
	acao: varchar({ length: 255 }).notNull(),
	dataHora: timestamp("data_hora", { mode: 'string', withTimezone: true }).default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'`).notNull(),
});

export const tbUsuarios = pgTable("tb_usuarios", {
	idUsuario: serial("id_usuario").primaryKey().notNull(),
	nome: varchar({ length: 45 }).notNull(),
	login: varchar({ length: 45 }).notNull(),
	senha: varchar({ length: 255 }).notNull(),
	nivelAcesso: integer("nivel_acesso").default(0).notNull(),
}, (table) => [
	unique("login_unique").on(table.login),
]);

export const tbControleDespesas = pgTable("tb_controle_despesas", {
	idDespesa: serial("id_despesa").primaryKey().notNull(),
	data: date().notNull(),
	mes: integer().notNull(),
	ano: integer().notNull(),
	diaSemana: varchar("dia_semana", { length: 15 }).notNull(),
	tipo: varchar({ length: 45 }).notNull(),
	categoria: varchar({ length: 45 }).notNull(),
	descricao: varchar({ length: 255 }).notNull(),
	valor: numeric({ precision: 10, scale:  2 }).default('0').notNull(),
});
