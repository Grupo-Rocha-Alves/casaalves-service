import { CreateInvoiceDto, UpdateInvoiceDto, ListInvoicesFilters } from '../dtos/invoicesDto';
import { createInvoice, findInvoiceById, updateInvoice, deleteInvoice, listInvoices } from '../repository/invoicesRepository';
import { formatDateForDatabase } from '../helpers/dateHelper';
import { calculatePagination } from '../helpers/repositoryHelper';

export async function serviceCreateInvoice(dto: CreateInvoiceDto) {
  const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);

  const valor = String(dto.valor || '0.00');

  const newInvoice = await createInvoice({
    data: dto.data,
    mes: month,
    ano: year,
    diaSemana: dayOfWeek,
    valor,
    dataVencimento: dto.dataVencimento,
    dataPagamento: dto.dataPagamento,
    status: dto.status || 'Pendente',
    formaPagamento: dto.formaPagamento,
    nomeFornecedor: dto.nomeFornecedor,
    documentoFornecedor: dto.documentoFornecedor,
    descricao: dto.descricao,
  });

  return newInvoice;
}

export async function serviceGetInvoiceById(invoiceId: number) {
  const invoice = await findInvoiceById(invoiceId);

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  return invoice;
}

export async function serviceUpdateInvoice(invoiceId: number, dto: UpdateInvoiceDto) {
  const invoiceExists = await findInvoiceById(invoiceId);

  if (!invoiceExists) {
    throw new Error('Invoice not found');
  }

  const updateData: any = {};

  if (dto.data !== undefined) {
    const { month, year, dayOfWeek } = formatDateForDatabase(dto.data);
    updateData.data = dto.data;
    updateData.mes = month;
    updateData.ano = year;
    updateData.diaSemana = dayOfWeek;
  }

  if (dto.valor !== undefined) {
    updateData.valor = String(dto.valor);
  }

  if (dto.dataVencimento !== undefined) {
    updateData.dataVencimento = dto.dataVencimento;
  }

  if (dto.dataPagamento !== undefined) {
    updateData.dataPagamento = dto.dataPagamento;
  }

  if (dto.status !== undefined) {
    updateData.status = dto.status;
  }

  if (dto.formaPagamento !== undefined) {
    updateData.formaPagamento = dto.formaPagamento;
  }

  if (dto.nomeFornecedor !== undefined) {
    updateData.nomeFornecedor = dto.nomeFornecedor;
  }

  if (dto.documentoFornecedor !== undefined) {
    updateData.documentoFornecedor = dto.documentoFornecedor;
  }

  if (dto.descricao !== undefined) {
    updateData.descricao = dto.descricao;
  }

  const updatedInvoice = await updateInvoice(invoiceId, updateData);

  return updatedInvoice;
}

export async function serviceDeleteInvoice(invoiceId: number) {
  const invoiceExists = await findInvoiceById(invoiceId);

  if (!invoiceExists) {
    throw new Error('Invoice not found');
  }

  const deletedInvoice = await deleteInvoice(invoiceId);

  return deletedInvoice;
}

export async function serviceListInvoices(filters: ListInvoicesFilters) {
  const { invoices, total } = await listInvoices(filters);
  const { pagination } = calculatePagination(total, filters.page, filters.limit);

  return {
    invoices,
    pagination,
  };
}

export async function serviceExportInvoicesToCSV(filters: ListInvoicesFilters) {
  const { invoices } = await listInvoices(filters);

  const header = [
    'ID', 
    'Data', 
    'Mês', 
    'Ano', 
    'Dia da Semana', 
    'Valor (R$)', 
    'Data Vencimento',
    'Data Pagamento',
    'Status',
    'Forma Pagamento',
    'Nome Fornecedor',
    'Documento Fornecedor',
    'Descrição'
  ];

  const rows = invoices.map(invoice => [
    invoice.idDuplicata,
    formatDateForCSV(invoice.data),
    invoice.mes,
    invoice.ano,
    invoice.diaSemana,
    formatCurrency(invoice.valor),
    formatDateForCSV(invoice.dataVencimento),
    invoice.dataPagamento ? formatDateForCSV(invoice.dataPagamento) : '',
    `"${invoice.status}"`,
    invoice.formaPagamento ? `"${invoice.formaPagamento}"` : '',
    `"${invoice.nomeFornecedor}"`,
    `"${invoice.documentoFornecedor}"`,
    `"${invoice.descricao.replace(/"/g, '""')}"`
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
