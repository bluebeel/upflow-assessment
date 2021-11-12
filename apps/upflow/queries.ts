import axios from 'axios';
import { Invoice, PaginatedInvoices } from './types';

export async function fetchInvoices(
  page = 0,
  size = 10,
  column = 'due',
  direction = 'ASC'
): Promise<PaginatedInvoices> {
  const { data } = await axios.get<PaginatedInvoices>(
    `http://localhost:3333/invoices?page=${page}&size=${size}&column=${column}&direction=${direction}`
  );
  return data;
}

export async function deleteInvoice(id: string) {
  return axios.delete(`http://localhost:3333/invoices/${id}`);
}

export async function updateInvoice(id: string, invoice: Invoice) {
  return axios.put(`http://localhost:3333/invoices/${id}`, invoice);
}
