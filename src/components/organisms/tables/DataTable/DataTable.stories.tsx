import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import DataTable from "./index";

const meta: Meta<typeof DataTable> = {
  title: "Components/Organisms/Tables/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    columns: [
      { id: "name", label: "Name", minWidth: 170 },
      { id: "code", label: "Code", minWidth: 100 },
    ],
    rows: [
      { name: "Item 1", code: "001" },
      { name: "Item 2", code: "002" },
    ],
  },
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector("table");
    expect(table).toBeInTheDocument();
  },
};
