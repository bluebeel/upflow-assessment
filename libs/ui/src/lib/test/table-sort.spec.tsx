import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ColumnType, DataType } from '../table.types';
import { useTable } from '../table.hooks';
import { getBodyRows, getCol, getRow } from './utils';
import { randomData, columns } from './data';

interface TableProps<T> {
  columns: ColumnType<T>[];
  data: T[];
  manualSortBy?: boolean;
}

const Table = <T extends DataType>({
  columns,
  data,
  manualSortBy,
}: TableProps<T>) => {
  const { headers, rows, toggleSort } = useTable<T>(columns, data, {
    manualSortBy,
  });

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th
              key={idx}
              data-testid={`column-${header.name}`}
              onClick={() => toggleSort(header.name)}
            >
              {header.label}

              {header.isSorted ? (
                <span data-testid={`sorted-${header.name}`}></span>
              ) : null}
            </th>
          ))}
          <th data-testid="not-a-column" onClick={() => toggleSort('fake')}>
            Fake column
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} data-testid={`row-${idx}`}>
            {row.cells.map((cell, idx) => (
              <td key={idx}>{cell.render()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

describe('Table Sorting', () => {
  it('Should render a table with sorting enabled', () => {
    const table = render(
      <Table columns={columns} data={randomData} />
    );
    expect(table.baseElement).toBeTruthy();
    expect(getBodyRows(table)).toHaveLength(10);

    const customerColumn = table.getByTestId('column-customer');
    // should be sorted in ascending order
    fireEvent.click(customerColumn);
    expect(table.queryByTestId('sorted-customer')).toBeInTheDocument();

    let firstRow = getRow(table, 0);
    expect(firstRow.getByText('Feedmix')).toBeInTheDocument();

    // should be sorted in descending order
    fireEvent.click(customerColumn);

    firstRow = getRow(table, 0);
    expect(firstRow.getByText('Trilia')).toBeInTheDocument();
  });

  it('Should sort by dates correctly', () => {
    const table = render(
      <Table columns={columns} data={randomData} />
    );
    expect(table.baseElement).toBeTruthy();
    expect(getBodyRows(table)).toHaveLength(10);

    const dueColumn = table.getByTestId('column-due');
    // should be sorted in ascending order
    fireEvent.click(dueColumn);
    expect(table.queryByTestId('sorted-due')).toBeInTheDocument();

    let firstRow = getRow(table, 0);
    let lastRow = getRow(table, 9);
    expect(firstRow.getByText('Gabtune')).toBeInTheDocument();
    expect(lastRow.getByText('Feedmix')).toBeInTheDocument();

    // should be sorted in descending order
    fireEvent.click(dueColumn);

    firstRow = getRow(table, 0);
    lastRow = getRow(table, 9);
    expect(firstRow.getByText('Feedmix')).toBeInTheDocument();
    expect(lastRow.getByText('Gabtune')).toBeInTheDocument();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Should throw error when sorting a column that does not exist', () => {
    const table = render(
      <Table columns={columns} data={randomData} manualSortBy={true} />
    );
    expect(table.baseElement).toBeTruthy();
    const button = table.getByTestId('not-a-column');

    expect(() => fireEvent.click(button)).toThrowError();
  });
});
