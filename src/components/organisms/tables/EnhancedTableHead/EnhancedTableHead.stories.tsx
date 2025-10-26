import { Table } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

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
    headCells: [
      { id: "name", label: "Name", numeric: false },
      { id: "code", label: "Code", numeric: false },
    ],
    order: "asc",
    orderBy: "name",
    onRequestSort: () => {},
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
