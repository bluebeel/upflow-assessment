import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ColumnType, DataType } from '../table.types';
import { useTable } from '../table.hooks';
import { getBodyRows, getCol, getRow } from './utils';
import { randomData, columns } from './data';

interface TableProps<T> {
  columns: ColumnType<T>[];
  data: T[];
}

const Table = <T extends DataType>({ columns, data }: TableProps<T>) => {
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

describe('Table Selecting', () => {
  it('Should be able to select rows', () => {
    const table = render(<Table columns={columns} data={randomData} />);
    expect(table.baseElement).toBeTruthy();

    const checkbox = table.getByTestId('checkbox-0') as HTMLInputElement;
    const checkbox2 = table.getByTestId('checkbox-9') as HTMLInputElement;
    const toggleAllButton = table.getByTestId('toggle-all') as HTMLInputElement;

    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
    expect(table.getAllByTestId('selected-row')).toHaveLength(1);

    fireEvent.click(checkbox2);
    expect(table.getAllByTestId('selected-row')).toHaveLength(2);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(false);
    expect(table.queryAllByTestId('selected-row')).toHaveLength(1);

    fireEvent.click(checkbox2);
    expect(checkbox2.checked).toEqual(false);
    expect(table.queryAllByTestId('selected-row')).toHaveLength(0);

    // toggle all
    fireEvent.click(toggleAllButton);
    expect(table.queryAllByTestId('selected-row')).toHaveLength(10);

    // toggle all off
    fireEvent.click(toggleAllButton);
    expect(table.queryAllByTestId('selected-row')).toHaveLength(0);
  });
});
