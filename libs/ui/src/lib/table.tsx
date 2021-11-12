import { useTable } from './table.hooks';
import './table.module.css';
import { ColumnType, DataType } from './table.types';

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
}

const Table = <T extends DataType>({
  columns,
  data,
  manualSortBy = false,
}: TableProps<T>) => {
  const { headers, rows } = useTable<T>(columns, data, {
    manualSortBy,
  });

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} {...header.getProps()}>
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
          <tr key={idx}>
            {row.cells.map((cell, idx) => (
              <td key={idx}>{cell.render()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const TableWithSelection = <T extends DataType>({
  columns,
  data,
}: TableProps<T>) => {
  const { headers, rows, selectRow, selectedRows, toggleAll } = useTable<T>(
    columns,
    data
  );

  return (
    <>
      <button data-testid="toggle-all" onClick={() => toggleAll()}></button>
      <table>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                data-testid={`column-${header.name}`}
                {...header.getProps()}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} data-testid={`row-${idx}`}>
              <td>
                <input
                  type="checkbox"
                  data-testid={`checkbox-${row.id}`}
                  checked={row.selected}
                  onChange={() => selectRow(row.id)}
                ></input>
              </td>
              {row.cells.map((cell, idx) => (
                <td key={idx}>{cell.render()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <tbody>
          {selectedRows.map((row, rowIdx) => (
            <tr key={rowIdx} data-testid="selected-row">
              {row.cells.map((cell, idx) => (
                <td key={idx}>{cell.render()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
