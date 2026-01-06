import { CreateExpenseDto, UpdateExpenseDto, ListExpensesFilters } from '../dtos/expensesDto';
import { createExpense, findExpenseById, updateExpense, deleteExpense, listExpenses } from '../repository/expensesRepository';
import { formatDateForDatabase } from '../helpers/dateHelper';
import { calculatePagination } from '../helpers/repositoryHelper';

export async function serviceCreateExpense(dto: CreateExpenseDto) {
  const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);

  const valor = String(dto.valor || '0.00');

  const newExpense = await createExpense({
    data: dto.data,
    mes: month,
    ano: year,
    diaSemana: dayOfWeek,
    tipo: dto.tipo,
    categoria: dto.categoria,
    descricao: dto.descricao,
    valor,
  });

  return newExpense;
}

export async function serviceGetExpenseById(expenseId: number) {
  const expense = await findExpenseById(expenseId);

  if (!expense) {
    throw new Error('Despesa não encontrada');
  }

  return expense;
}

export async function serviceUpdateExpense(expenseId: number, dto: UpdateExpenseDto) {
  const expenseExists = await findExpenseById(expenseId);

  if (!expenseExists) {
    throw new Error('Despesa não encontrada');
  }

  const updateData: any = {};

  if (dto.data !== undefined) {
    const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);
    updateData.data = dto.data;
    updateData.mes = month;
    updateData.ano = year;
    updateData.diaSemana = dayOfWeek;
  }

  if (dto.tipo !== undefined) {
    updateData.tipo = dto.tipo;
  }

  if (dto.categoria !== undefined) {
    updateData.categoria = dto.categoria;
  }

  if (dto.descricao !== undefined) {
    updateData.descricao = dto.descricao;
  }

  if (dto.valor !== undefined) {
    updateData.valor = String(dto.valor);
  }

  const updatedExpense = await updateExpense(expenseId, updateData);

  return updatedExpense;
}

export async function serviceDeleteExpense(expenseId: number) {
  const expenseExists = await findExpenseById(expenseId);

  if (!expenseExists) {
    throw new Error('Despesa não encontrada');
  }

  const deletedExpense = await deleteExpense(expenseId);

  return deletedExpense;
}

export async function serviceListExpenses(filters: ListExpensesFilters) {
  const { despesas, total } = await listExpenses(filters);
  const { pagination } = calculatePagination(total, filters.page, filters.limit);

  return {
    despesas,
    pagination,
  };
}
