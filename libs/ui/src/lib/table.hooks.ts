import { useMemo, useReducer, useEffect, ReactNode, useCallback } from 'react';

import {
  ColumnByNamesType,
  ColumnType,
  TableState,
  TableAction,
  DataType,
  UseTableReturnType,
  UseTableOptionsType,
  RowType,
  HeaderType,
  HeaderRenderType,
  ColumnStateType,
} from './table.types';
import { byTextAscending } from './table.utils';

const createReducer =
  <T extends DataType>() =>
  (state: TableState<T>, action: TableAction<T>): TableState<T> => {
    switch (action.type) {
      case 'SET_ROWS': {
        let rows = [...action.data];
        // preserve sorting if a sort is already enabled when data changes
        if (state.sortEnabled && state.sortColumn) {
          rows = sortByColumn(action.data, state.sortColumn, state.columns);
        }

        if (state.paginationEnabled) {
          rows = getPaginatedData(
            rows,
            state.pagination.perPage,
            state.pagination.page
          );
        }

        return {
          ...state,
          rows,
          originalRows: action.data,
        };
      }

      case 'NEXT_PAGE': {
        const nextPage =
          state.pagination.page === state.pagination.totalPages
            ? state.pagination.page
            : state.pagination.page + 1;
        const rows = state.paginationEnabled
          ? getPaginatedData(
              state.originalRows,
              state.pagination.perPage,
              nextPage
            )
          : state.rows;

        return {
          ...state,
          rows,
          pagination: {
            ...state.pagination,
            page: nextPage,
          },
          canNext:
            nextPage * state.pagination.perPage <
            state.pagination.totalPages * state.pagination.perPage,
          canPrev: nextPage !== 0,
        };
      }
      case 'PREV_PAGE': {
        const prevPage =
          state.pagination.page === 0 ? 0 : state.pagination.page - 1;
        const rows = state.paginationEnabled
          ? getPaginatedData(
              state.originalRows,
              state.pagination.perPage,
              prevPage
            )
          : state.rows;

        return {
          ...state,
          rows,
          pagination: {
            ...state.pagination,
            page: prevPage,
          },
          canNext:
            prevPage * state.pagination.perPage < state.originalRows.length,
          canPrev: prevPage !== 0,
        };
      }
      case 'TOGGLE_SORT': {
        if (!(action.columnName in state.columnsByName)) {
          throw new Error(`Invalid column, ${action.columnName} not found`);
        }

        let isAscending: boolean | null = null;

        let sortedRows: RowType<T>[] = [];

        // loop through all columns and set the sort parameter to off unless
        // it's the specified column (only one column at a time for )
        const columnCopy = state.columns.map((column) => {
          // if the row was found and we can sort it
          if (action.columnName === column.name && column.canSort) {
            if (action.isDescending !== undefined) {
              // force the sort order
              isAscending = !action.isDescending;
            } else {
              // if it's undefined, start by setting to ascending, otherwise toggle
              isAscending =
                column.isSortedDesc === undefined || column.isSortedDesc;
            }

            // default to sort by string
            const columnCompareFn =
              column.sort ||
              byTextAscending((object) => object.original[action.columnName]);
            sortedRows = state.rows.slice().sort((a, b) => {
              const result = columnCompareFn(a, b);
              return isAscending ? result : result * -1;
            });
            state.sortBy = {
              id: column.name,
              desc: !isAscending,
            };

            return {
              ...column,
              isSorted: true,
              isSortedDesc: !isAscending,
            };
          }
          // set sorting to false for all other columns
          return {
            ...column,
            isSorted: false,
            isSortedDesc: undefined,
          };
        });

        return {
          ...state,
          columns: columnCopy,
          rows: state.sortEnabled ? sortedRows : state.rows,
          sortColumn: action.columnName,
          columnsByName: getColumnsByName(columnCopy),
        };
      }
      case 'SELECT_ROW': {
        const stateCopy = { ...state };

        stateCopy.rows = stateCopy.rows.map((row) => {
          const newRow = { ...row };
          if (newRow.id === action.rowId) {
            newRow.selected = !newRow.selected;
          }
          return newRow;
        });

        stateCopy.originalRows = stateCopy.originalRows.map((row) => {
          const newRow = { ...row };
          if (newRow.id === action.rowId) {
            newRow.selected = !newRow.selected;
          }
          return newRow;
        });

        stateCopy.selectedRows = stateCopy.originalRows.filter(
          (row) => row.selected
        );

        stateCopy.toggleAllState =
          stateCopy.selectedRows.length === stateCopy.rows.length;

        return stateCopy;
      }

      case 'TOGGLE_ALL': {
        const stateCopyToggle = { ...state };
        const rowIds: Record<number, boolean> = {};

        const selected = state.selectedRows.length < state.rows.length;
        stateCopyToggle.rows = stateCopyToggle.rows.map((row) => {
          rowIds[row.id] = selected;
          return { ...row, selected };
        });

        stateCopyToggle.toggleAllState = selected;

        stateCopyToggle.originalRows = stateCopyToggle.originalRows.map(
          (row) => {
            return row.id in rowIds
              ? { ...row, selected: rowIds[row.id] }
              : { ...row };
          }
        );

        stateCopyToggle.selectedRows = stateCopyToggle.originalRows.filter(
          (row) => row.selected
        );

        return stateCopyToggle;
      }
      default:
        throw new Error('Invalid reducer action');
    }
  };

export const useTable = <T extends DataType>(
  columns: ColumnType<T>[],
  data: T[],
  options?: UseTableOptionsType
): UseTableReturnType<T> => {
  const columnsWithSorting: ColumnStateType<T>[] = useMemo(() => {
    return columns.map((column) => {
      return {
        ...column,
        label: column.label || column.name,
        hidden: !!column.hidden,
        sort: column.sort,
        canSort:
          column.defaultCanSort !== undefined ? column.defaultCanSort : true,
        isSorted: false,
        isSortedDesc: undefined,
      };
    });
  }, [columns]);
  const columnsByName = useMemo(
    () => getColumnsByName(columnsWithSorting),
    [columnsWithSorting]
  );

  const tableData: RowType<T>[] = useMemo(() => {
    const preparedData = prepareData(data, columnsWithSorting);

    const newData = preparedData.map((row, idx) => {
      return {
        id: idx,
        selected: false,
        hidden: false,
        original: row,
        cells: Object.entries(row)
          .map(([column, value]) => {
            return {
              hidden: columnsByName[column].hidden,
              field: column,
              value: value,
              render: makeRender(value, columnsByName[column].render, row, columnsByName[column].name),
            };
          })
          .filter((cell) => !cell.hidden),
      };
    });
    return newData;
  }, [data, columnsWithSorting, columnsByName]);

  const page = options?.page;

  if (!!options?.manualPagination && page === undefined) {
    throw new Error(`manualPagination is set to true. Missing page props`);
  }

  const reducer = createReducer<T>();

  const [state, dispatch] = useReducer(reducer, {
    columns: columnsWithSorting,
    columnsByName: columnsByName,
    originalRows: tableData,
    rows: tableData,
    selectedRows: [],
    toggleAllState: false,
    sortColumn: null,
    sortBy: null,
    sortEnabled:
      options?.manualSortBy !== undefined ? !options.manualSortBy : true,
    paginationEnabled:
      options?.manualPagination !== undefined
        ? !options.manualPagination
        : true,
    pagination: {
      page: options?.manualPagination && page ? page.index : 0,
      perPage: options?.manualPagination && page ? page.size : 10,
      totalPages:
        options?.manualPagination && page
          ? page.totalPages
          : Math?.floor(tableData.length / 10),
      totalItems:
        options?.manualPagination && page ? page.count : tableData.length,
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    nextPage: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    prevPage: () => {},
    canNext: true,
    canPrev: false,
  });

  state.nextPage = useCallback(() => {
    dispatch({ type: 'NEXT_PAGE' });
  }, []);
  state.prevPage = useCallback(() => {
    dispatch({ type: 'PREV_PAGE' });
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_ROWS', data: tableData });
  }, [tableData]);

  useEffect(() => {
    if (options?.page) {
      state.pagination.totalItems = options.page.count;
      state.pagination.totalPages = options.page.totalPages;
    }
  }, [options?.page])

  const headers: HeaderType<T>[] = useMemo(() => {
    return [
      ...state.columns.map((column) => {
        return {
          ...column,
          render: makeHeaderRender(column.label, column.headerRender),
          getProps() {
            if (column.canSort) {
              return {
                onClick() {
                  dispatch({ type: 'TOGGLE_SORT', columnName: column.name });
                },
              };
            }

            return {};
          },
        };
      }),
    ];
  }, [state.columns]);

  return {
    headers: headers.filter((column) => !column.hidden),
    rows: state.rows,
    originalRows: state.originalRows,
    selectedRows: state.selectedRows,
    dispatch,
    selectRow: (rowId: number) => dispatch({ type: 'SELECT_ROW', rowId }),
    toggleAll: () => dispatch({ type: 'TOGGLE_ALL' }),
    toggleSort: (columnName: string, isDescending?: boolean) =>
      dispatch({ type: 'TOGGLE_SORT', columnName, isDescending }),
    pagination: state.pagination,
    toggleAllState: state.toggleAllState,
    sortBy: state.sortBy,
    nextPage: state.nextPage,
    prevPage: state.prevPage,
    canNext: state.canNext,
    canPrev: state.canPrev,
  };
};

const makeRender = <T extends DataType>(
  value: any,
  render: (({ value, row, column }: { value: any; row: T; column: string }) => ReactNode) | undefined,
  row: T,
  column: string
) => {
  return render ? () => render({ row, value, column }) : () => value;
};

const makeHeaderRender = (
  label: string,
  render: HeaderRenderType | undefined
) => {
  return render ? () => render({ label }) : () => label;
};

const prepareData = <T extends DataType>(
  data: T[],
  columns: ColumnType<T>[]
): T[] => {
  return data.map((row: T) => {
    const newRow: any = {};
    columns.forEach((column) => {
      newRow[column.name] = row[column.name];
    });
    return newRow;
  });
};

const sortByColumn = <T extends DataType>(
  data: RowType<T>[],
  sortColumn: string,
  columns: ColumnStateType<T>[]
): RowType<T>[] => {
  let isAscending: boolean | null | undefined = null;
  let sortedRows: RowType<T>[] = [...data];

  columns.forEach((column) => {
    // if the row was found
    if (sortColumn === column.name) {
      isAscending = !column.isSortedDesc;

      // default to sort by string
      const columnCompareFn =
        column.sort || byTextAscending((object) => object.original[sortColumn]);
      sortedRows = data.sort((a, b) => {
        const result = columnCompareFn(a, b);
        return isAscending ? result : result * -1;
      });
    }
  });

  return sortedRows;
};

const getColumnsByName = <T extends DataType>(
  columns: ColumnType<T>[]
): ColumnByNamesType<T> => {
  const columnsByName: ColumnByNamesType<T> = {};
  columns.forEach((column) => {
    const col: Pick<ColumnType<T>, 'label' | 'render' | 'hidden' | 'name'> = {
      name: column.name,
      label: column.label,
    };

    if (column.render) {
      col['render'] = column.render;
    }
    col['hidden'] = column.hidden;
    columnsByName[column.name] = col;
  });

  return columnsByName;
};

const getPaginatedData = <T extends DataType>(
  rows: RowType<T>[],
  perPage: number,
  page: number
) => {
  const start = page * perPage;
  const end = start + perPage;
  return rows.slice(start, end);
};
