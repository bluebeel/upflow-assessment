import {
  useTable,
  ColumnType,
  DataType,
  PaginatorType,
} from '@upflow-assessment/ui';
import React from 'react';

export interface TableProps<T> {
  /**
   * The core columns configuration object for the entire table. Must be memoized.
   */
  columns: ColumnType<T>[];
  /**
   * The data array that you want to display on the table. Must be memoized.
   */
  data: T[];
  /**
   * Enables sorting detection functionality, but does not automatically perform row sorting.
   * Turn this on if you wish to implement your own sorting outside of the table (eg. server-side or manual row grouping/nesting)
   */
  manualSortBy?: boolean;

  onSort?: (sort: { id: string; desc: boolean }) => void;

  /**
   * Enables pagination functionality, but does not automatically perform row pagination.
   * Turn this on if you wish to implement your own pagination outside of the table (eg. server-side pagination or any other manual pagination technique)
   */
  manualPagination?: boolean;

  /**
   * A object representing a page.
   * Required if manualPagination is set to true.
   * Determines the amount of rows on any given page.
   * The index of the page that should be displayed via the page instance value
   * Determine the amount of pages available
   */
  page?: { size: number; index: number; count: number; totalPages: number };

  onPagination?: (page: number, pageSize: number) => void;
}

export const Table = <T extends DataType>({
  columns,
  data,
  onSort,
  manualSortBy = false,
  manualPagination = false,
  page,
  onPagination,
}: TableProps<T>) => {
  const {
    headers,
    rows,
    sortBy,
    pagination,
    canNext,
    canPrev,
    nextPage,
    prevPage,
  } = useTable<T>(columns, data, { manualSortBy, manualPagination, page });

  React.useEffect(() => {
    if (sortBy) {
      onSort(sortBy);
    }
  }, [sortBy]);

  React.useEffect(() => {
    if (onPagination) {
      onPagination(pagination.page, pagination.perPage);
    }
  }, [pagination]);

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer select-none"
                key={idx}
                {...header.getProps()}
              >
                {header.label}
                <span>
                  {header.isSorted ? (header.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.cells.map((cell, idx) => (
                <td
                  key={idx}
                  className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                >
                  {cell.render()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <nav
        className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {pagination.page * pagination.perPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {(pagination.page + 1) * pagination.perPage <= pagination.totalItems
                ? (pagination.page + 1) * pagination.perPage
                : pagination.totalItems}
            </span>{' '}
            of <span className="font-medium">{pagination.totalItems}</span>{' '}
            results
          </p>
        </div>
        <div className="flex justify-between flex-1 sm:justify-end">
          <button
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
            disabled={!canPrev}
            onClick={() => prevPage()}
          >
            Previous
          </button>
          <button
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
            disabled={!canNext}
            onClick={() => nextPage()}
          >
            Next
          </button>
        </div>
      </nav>
    </>
  );
};

export default Table;
