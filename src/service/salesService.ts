import { CreateSaleDto, UpdateSaleDto, ListSalesFilters } from '../dtos/salesDto';
import { createSales, findSaleById, findSaleByDate, updateSale, deleteSale, listSales } from '../repository/salesRepository';
import { formatDateForDatabase } from '../helpers/dateHelper';
import { calculatePagination } from '../helpers/repositoryHelper';

const calculateTotalOfDay = (
  totalCartao: string | number,
  totalPix: string | number,
  totalEspecie: string | number,
  totalOutro: string | number
): string => {
  const cartao = parseFloat(String(totalCartao)) || 0;
  const pix = parseFloat(String(totalPix)) || 0;
  const especie = parseFloat(String(totalEspecie)) || 0;
  const outro = parseFloat(String(totalOutro)) || 0;

  const total = cartao + pix + especie + outro;
  return total.toFixed(2);
};

export async function serviceCreateSale(dto: CreateSaleDto) {
  // Verifica se já existe uma venda para esta data
  const existingSale = await findSaleByDate(dto.data);
  if (existingSale) {
    throw new Error('Já existe uma venda cadastrada para esta data');
  }

  const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);

  const totalCartao = String(dto.totalCartao || '0.00');
  const totalPix = String(dto.totalPix || '0.00');
  const totalEspecie = String(dto.totalEspecie || '0.00');
  const totalOutro = String(dto.totalOutro || '0.00');

  const totalDia = calculateTotalOfDay(totalCartao, totalPix, totalEspecie, totalOutro);

  const newVenda = await createSales({
    data: dto.data,
    mes: month,
    ano: year,
    diaSemana: dayOfWeek,
    totalCartao,
    totalPix,
    totalEspecie,
    totalOutro,
    totalDia,
  });

  return newVenda;
}

export async function serviceGetSaleById(saleId: number) {
  const sale = await findSaleById(saleId);

  if (!sale) {
    throw new Error('Venda não encontrada');
  }

  return sale;
}

export async function serviceUpdateSale(saleId: number, dto: UpdateSaleDto) {
  const saleExists = await findSaleById(saleId);

  if (!saleExists) {
    throw new Error('Venda não encontrada');
  }

  const updateData: any = {};

  if (dto.data !== undefined) {
    const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);
    updateData.data = dto.data;
    updateData.mes = month;
    updateData.ano = year;
    updateData.diaSemana = dayOfWeek;
  }

  if (dto.totalCartao !== undefined) {
    updateData.totalCartao = String(dto.totalCartao);
  }

  if (dto.totalPix !== undefined) {
    updateData.totalPix = String(dto.totalPix);
  }

  if (dto.totalEspecie !== undefined) {
    updateData.totalEspecie = String(dto.totalEspecie);
  }

  if (dto.totalOutro !== undefined) {
    updateData.totalOutro = String(dto.totalOutro);
  }

  if (
    dto.totalCartao !== undefined ||
    dto.totalPix !== undefined ||
    dto.totalEspecie !== undefined ||
    dto.totalOutro !== undefined
  ) {
    const finalCartao = updateData.totalCartao || saleExists.totalCartao;
    const finalPix = updateData.totalPix || saleExists.totalPix;
    const finalEspecie = updateData.totalEspecie || saleExists.totalEspecie;
    const finalOutro = updateData.totalOutro || saleExists.totalOutro;

    updateData.totalDia = calculateTotalOfDay(finalCartao, finalPix, finalEspecie, finalOutro);
  }

  const updatedVenda = await updateSale(saleId, updateData);

  return updatedVenda;
}

export async function serviceDeleteSale(saleId: number) {
  const saleExists = await findSaleById(saleId);

  if (!saleExists) {
    throw new Error('Venda não encontrada');
  }

  const deletedVenda = await deleteSale(saleId);

  return deletedVenda;
}

export async function serviceListSales(filters: ListSalesFilters) {
  const { vendas, total } = await listSales(filters);
  const { pagination } = calculatePagination(total, filters.page, filters.limit);

  return {
    vendas,
    pagination,
  };
}

export async function serviceExportSalesToCSV(filters: ListSalesFilters) {
  const { vendas } = await listSales(filters);

  const header = ['ID', 'Data', 'Mês', 'Ano', 'Dia da Semana', 'Cartão (R$)', 'PIX (R$)', 'Espécie (R$)', 'Outro (R$)', 'Total (R$)'];

  const rows = vendas.map(venda => [
    venda.idVenda,
    formatDateForCSV(venda.data),
    venda.mes,
    venda.ano,
    venda.diaSemana,
    formatCurrency(venda.totalCartao),
    formatCurrency(venda.totalPix),
    formatCurrency(venda.totalEspecie),
    formatCurrency(venda.totalOutro),
    formatCurrency(venda.totalDia)
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

function formatDateForCSV(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toFixed(2).replace('.', ',');
}
