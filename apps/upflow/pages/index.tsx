import React from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Invoice } from '../types';
import Table from '../components/Table';
import { useRouter } from 'next/router';
import { deleteInvoice, fetchInvoices, updateInvoice } from '../queries';
import EditableCell from '../components/EditableCell';


interface QueryParams {
  page: number;
  size: number;
  column: string;
  direction: string;
}

export function Index() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [params, setParams] = React.useState({} as QueryParams);

  const { status, data, error, refetch } = useQuery(
    ['invoices', params.page, params.size, params.column, params.direction],
    () =>
      fetchInvoices(params.page, params.size, params.column, params.direction),
    { keepPreviousData: true, staleTime: 5000, enabled: router.isReady }
  );

  const deleteInvoiceMutation = useMutation((id: string) => deleteInvoice(id), {
    onSuccess: () => refetch(),
  });

  const updateInvoiceMutation = useMutation(
    (payload: { id: string; invoice: Invoice }) =>
      updateInvoice(payload.id, payload.invoice),
    {
      onSuccess: () => refetch(),
    }
  );

  // Prefetch the next page!
  React.useEffect(() => {
    if (data?.currentPage + 1 < data?.totalPages) {
      queryClient.prefetchQuery(
        [
          'invoices',
          params.page + 1,
          params.size,
          params.column,
          params.direction,
        ],
        () =>
          fetchInvoices(
            params.page + 1,
            params.size,
            params.column,
            params.direction
          )
      );
    }
  }, [
    data,
    params.page,
    params.size,
    params.column,
    params.direction,
    queryClient,
  ]);

  React.useEffect(() => {
    if (router.isReady) {
      setParams({
        page: router.query.page ? Number(router.query.page) : 0,
        size: router.query.size ? Number(router.query.size) : 10,
        column: router.query.column ? (router.query.column as string) : 'due',
        direction: router.query.direction
          ? (router.query.direction as string)
          : 'DESC',
      });
    }
  }, [router]);

  const deleteRow = async (row: Invoice) => {
    await deleteInvoiceMutation.mutate(row.id.toString());
  };

  const onUpdate = async (row: Invoice) => {
    await updateInvoiceMutation.mutate({ id: row.id.toString(), invoice: row });
  };

  const columns = React.useMemo(
    () => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'customer',
        label: 'Customer',
        render: ({
          value,
          row,
          column,
        }: {
          value: any;
          row: Invoice;
          column: string;
        }) => {
          return (
            <EditableCell
              value={value}
              row={row}
              column={column}
              onUpdate={onUpdate}
            />
          );
        },
      },
      {
        name: 'status',
        label: 'Status',
        render: ({ value, row }: { value: any; row: Invoice }) => {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {value}
            </span>
          );
        },
      },
      {
        name: 'due',
        label: 'Due',
        sort: (a: any, b: any) => {
          return (
            Number(new Date(a.original.due)) - Number(new Date(b.original.due))
          );
        },
      },
      {
        name: 'amount',
        label: 'Outstanding amount',
        sort: (a: any, b: any) => {
          return (
            Number(new Date(a.original.amount)) -
            Number(new Date(b.original.amount))
          );
        },
        render: ({
          value,
          row,
          column,
        }: {
          value: any;
          row: Invoice;
          column: string;
        }) => {
          return (
            <EditableCell
              value={value}
              row={row}
              column={column}
              onUpdate={onUpdate}
            />
          );
        },
      },
      { name: 'currency', label: 'Currency' },
      {
        name: 'action',
        defaultCanSort: false,
        render: ({ value, row }: { value: any; row: Invoice }) => {
          return (
            <button
              className="text-indigo-600 hover:text-indigo-900"
              onClick={() => deleteRow(row)}
            >
              Delete
            </button>
          );
        },
      },
    ],
    []
  );

  const onSort = (sort: any) => {
    router.push(
      `/?column=${sort.id}&direction=${sort.desc ? 'DESC' : 'ASC'}&page=${
        params.page
      }&size=${params.size}`,
      undefined,
      { shallow: true }
    );
  };

  const onPagination = (page, pageSize) => {
    if (router.isReady) {
      router.push(
        `/?column=${params.column}&direction=${params.direction}&page=${page}&size=${pageSize}`,
        undefined,
        { shallow: true }
      );
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto my-8">
      <Table
        columns={columns}
        data={data?.results ? data.results : []}
        onSort={onSort}
        manualSortBy={true}
        onPagination={onPagination}
        manualPagination={true}
        page={{
          size: params.size,
          index: params.page,
          count: data?.count,
          totalPages: data?.totalPages,
        }}
      />
    </div>
  );
}

export default Index;
