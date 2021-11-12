/* eslint-disable @typescript-eslint/no-explicit-any */
export type ColumnType<T> = {
  name: string;
  label?: string;
  hidden?: boolean;
  defaultCanSort?: boolean;
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  render?: ({ value, row, column }: { value: any; row: T; column: string }) => React.ReactNode;
  headerRender?: HeaderRenderType;
};

export type ColumnStateType<T> = {
  name: string;
  label: string;
  hidden: boolean;
  canSort: boolean;
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  isSorted: boolean;
  isSortedDesc: boolean | undefined;
  headerRender?: HeaderRenderType;
};

export type HeaderRenderType = ({ label }: { label: any }) => React.ReactNode;

// this is the type saved as state and returned
export type HeaderType<T> = {
  name: string;
  label?: string;
  hidden?: boolean;
  canSort: boolean;
  isSorted: boolean;
  isSortedDesc: boolean | undefined;
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  render: () => React.ReactNode;
  getProps: () => Record<string, unknown>;
};

export type DataType = Record<string, any>;

export type ColumnByNamesType<T> = {
  [key: string]: ColumnType<T>;
};

export interface RowType<T extends DataType> {
  id: number;
  cells: CellType[];
  hidden?: boolean;
  selected?: boolean;
  original: T;
}

export type CellType = {
  value: any;
  render: () => React.ReactNode;
};

export interface UseTableOptionsType {
  manualSortBy?: boolean;
  manualPagination?: boolean;
  page?: { size: number; index: number; count: number; totalPages: number };
}

export interface UseTableReturnType<T> {
  headers: HeaderType<T>[];
  originalRows: RowType<T>[];
  rows: RowType<T>[];
  selectedRows: RowType<T>[];
  dispatch: React.Dispatch<TableAction<T>>;
  toggleSort: (columnName: string, isDescending?: boolean) => void;
  selectRow: (id: number) => void;
  toggleAll: () => void;
  toggleAllState: boolean;
  pagination: PaginatorType;
  sortBy: { id: string; desc: boolean } | null;
  nextPage: () => void;
  prevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export type PaginatorType = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
};

export type TableState<T extends DataType> = {
  columnsByName: ColumnByNamesType<T>;
  columns: ColumnStateType<T>[];
  rows: RowType<T>[];
  originalRows: RowType<T>[];
  selectedRows: RowType<T>[];
  sortColumn: string | null;
  sortBy: { id: string; desc: boolean } | null;
  sortEnabled: boolean;
  toggleAllState: boolean;
  pagination: PaginatorType;
  paginationEnabled: boolean;
  nextPage: () => void;
  prevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
};

export type TableAction<T extends DataType> =
  | { type: 'TOGGLE_SORT'; columnName: string; isDescending?: boolean }
  | { type: 'SELECT_ROW'; rowId: number }
  | { type: 'SET_ROWS'; data: RowType<T>[] }
  | { type: 'NEXT_PAGE'; }
  | { type: 'PREV_PAGE'; }
  | { type: 'TOGGLE_ALL' };
