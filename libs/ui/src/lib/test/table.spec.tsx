import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ColumnType, DataType } from '../table.types';
import { useTable } from '../table.hooks';
import { getBodyRows, getCol, getRow } from './utils';

interface TableProps<T> {
  columns: ColumnType<T>[];
  data: T[];
}

const Table = <T extends DataType>({ columns, data }: TableProps<T>) => {
  const { headers, rows } = useTable<T>(columns, data);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} data-testid={`column-${header.name}`} >{header.render()}</th>
          ))}
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

const columns = [
  {
    name: 'firstName',
    label: 'First name',
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'age',
    label: 'Age',
  },
  {
    name: 'visits',
    label: 'Visits',
  },
  {
    name: 'status',
    label: 'Status',
  },
  {
    name: 'progress',
    label: 'Progress',
  },
];

const columnsWithRender = [
  {
    name: 'firstName',
    label: 'First name',
    render: ({ value }) => <h1 data-testid="first-name">Dear {value}</h1>,
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'age',
    label: 'Age',
    render: ({ value }) => <span data-testid="age">{value} y</span>,
  },
  {
    name: 'visits',
    label: 'Visits',
  },
  {
    name: 'status',
    label: 'Status',
  },
  {
    name: 'progress',
    label: 'Progress',
    render: ({ value }) => <span data-testid="progress">{value}%</span>,
  },
];

const columnsWithHeaderRender = [
  {
    name: 'firstName',
    label: 'First name',
    headerRender: ({ label }) => <h1 data-testid="first-name">{(label as string).toUpperCase()}</h1>,
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'age',
    label: 'Age',
  },
  {
    name: 'visits',
    label: 'Visits',
  },
  {
    name: 'status',
    label: 'Status',
  },
  {
    name: 'progress',
    label: 'Progress',
  },
];

const data = [
  {
    firstName: 'saikou',
    lastName: 'barry',
    age: 25,
    visits: 5,
    status: 'Single',
    progress: 75,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 29,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'derek',
    lastName: 'perkins',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'bergevin',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

describe('Table', () => {
  it('Should render a basic table', () => {
    const table = render(<Table columns={columns} data={data} />);
    expect(table.baseElement).toBeTruthy();
    expect(table.getByText('tanner')).toBeInTheDocument();
    expect(table.getByText('derek')).toBeInTheDocument();
    expect(table.getByText('joe')).toBeInTheDocument();
    expect(table.getByText('saikou')).toBeInTheDocument();
  });

  it('Should update table rows when data changes', () => {
    const table = render(<Table columns={columns} data={data} />);
    expect(getBodyRows(table)).toHaveLength(4);

    const newData = [
      ...data,
      {
        firstName: 'boubacar',
        lastName: 'barry',
        age: 28,
        visits: 20,
        status: 'Single',
        progress: 10,
      },
    ];
    table.rerender(<Table columns={columns} data={newData} />);

    expect(getBodyRows(table)).toHaveLength(5);
  });

  it('Should see custom row render HTML', () => {
    const table = render(<Table columns={columnsWithRender} data={data} />);
    expect(table.getAllByTestId('first-name')).toHaveLength(4);
    expect(table.getAllByTestId('age')).toHaveLength(4);
    expect(table.getAllByTestId('progress')).toHaveLength(4);

    const firstRow = getRow(table, 0);
    expect(firstRow.getByText('Dear saikou')).toBeInTheDocument();
    expect(firstRow.getByText('25 y')).toBeInTheDocument();
    expect(firstRow.getByText('75%')).toBeInTheDocument();
  });

  it('Should see custom header render HTML', () => {
    const table = render(<Table columns={columnsWithHeaderRender} data={data} />);
    expect(table.getAllByTestId('first-name')).toHaveLength(1);

    const col = getCol(table, "firstName");
    expect(col.getByText('FIRST NAME')).toBeInTheDocument();
  });
});
