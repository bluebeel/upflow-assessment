import { Story, Meta } from '@storybook/react';
import type { TableProps } from './table';
import Table, { TableWithSelection } from './table';
import { Data, columns, randomData } from './test/data';

export default {
  component: Table,
  title: 'Table',
} as Meta;

const Template: Story<TableProps<Data>> = (args) => <Table<Data> {...args} />;
const TemplateWithSelection: Story<TableProps<Data>> = (args) => (
  <TableWithSelection<Data> {...args} />
);

export const BasicTable = Template.bind({});
BasicTable.storyName = 'Basic Table';
BasicTable.args = {
  columns: columns,
  data: randomData,
};

export const ManualSortingTable = Template.bind({});
ManualSortingTable.storyName = 'Table with manual sorting';
ManualSortingTable.args = {
  columns: columns,
  data: randomData,
  manualSortBy: true,
};

export const TableWithSelectionStory = TemplateWithSelection.bind({});
TableWithSelectionStory.storyName = 'Table with selection';
TableWithSelectionStory.args = {
  columns: columns,
  data: randomData,
};
