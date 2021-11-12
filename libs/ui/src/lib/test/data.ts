export const randomData = [
  {
    id: 1,
    customer: 'Jaxbean',
    status: 'Unsent',
    due: '5/9/2021',
    amount: '$3107.34',
    currency: 'CNY',
  },
  {
    id: 2,
    customer: 'Feedmix',
    status: 'Unsent',
    due: '10/12/2021',
    amount: '$2720.85',
    currency: 'COP',
  },
  {
    id: 3,
    customer: 'Kwideo',
    status: 'Unsent',
    due: '6/1/2021',
    amount: '$4880.58',
    currency: 'PEN',
  },
  {
    id: 4,
    customer: 'Jatri',
    status: 'Due',
    due: '2/23/2021',
    amount: '$5970.24',
    currency: 'CLP',
  },
  {
    id: 5,
    customer: 'Gabtype',
    status: 'Due',
    due: '6/18/2021',
    amount: '$5517.17',
    currency: 'THB',
  },
  {
    id: 6,
    customer: 'Gabtune',
    status: 'Overdue',
    due: '1/5/2021',
    amount: '$4977.29',
    currency: 'PLN',
  },
  {
    id: 7,
    customer: 'Tazz',
    status: 'Voided',
    due: '8/7/2021',
    amount: '$617.31',
    currency: 'CAD',
  },
  {
    id: 8,
    customer: 'Roodel',
    status: 'Unsent',
    due: '5/6/2021',
    amount: '$4096.74',
    currency: 'PLN',
  },
  {
    id: 9,
    customer: 'Kimia',
    status: 'Voided',
    due: '7/21/2021',
    amount: '$9044.68',
    currency: 'NOK',
  },
  {
    id: 10,
    customer: 'Trilia',
    status: 'Due',
    due: '9/1/2021',
    amount: '$8400.89',
    currency: 'PHP',
  },
];

export type Data = {
  id: number;
  customer: string;
  status: string;
  due: string;
  amount: string;
  currency: string;
};

export const columns = [
  {
    name: 'id',
    hidden: true,
  },
  { name: 'customer', label: 'Customer' },
  { name: 'status', label: 'Status' },
  {
    name: 'due',
    label: 'Due',
    sort: (a: any, b: any) => {
      return Number(new Date(a.original.due)) - Number(new Date(b.original.due));
    },
  },
  { name: 'amount', label: 'Outstanding amount' },
  { name: 'currency', label: 'Currency' },
];
