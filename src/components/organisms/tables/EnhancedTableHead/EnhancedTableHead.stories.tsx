import { Table } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import EnhancedTableHead from "./index";

const meta: Meta<typeof EnhancedTableHead> = {
  title: "Components/Organisms/Tables/EnhancedTableHead",
  component: EnhancedTableHead,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EnhancedTableHead>;

export const Default: Story = {
  args: {
    headers: [
      { id: "name", label: "Name", numeric: false, sortable: true },
      { id: "code", label: "Code", numeric: false, sortable: true },
    ],
    order: "asc",
    orderBy: "name",
    numSelected: 0,
    rowCount: 2,
    onSelectAllClick: () => {},
    onRequestSort: () => {},
    dataSelection: true,
  },
  render: (args) => (
    <Table>
      <EnhancedTableHead {...args} />
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const thead = canvasElement.querySelector("thead");
    expect(thead).toBeInTheDocument();
  },
};
