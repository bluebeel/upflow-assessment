export interface Invoice {
  id: number;
  customer: string;
  status: string;
  due: Date;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedInvoices {
  count: number;
  results: Invoice[];
  totalPages: number;
  currentPage: number;
}
