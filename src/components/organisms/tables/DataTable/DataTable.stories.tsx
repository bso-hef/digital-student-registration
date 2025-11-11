import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

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
    headers: [
      { id: "name", label: "Name", width: 170 },
      { id: "code", label: "Code", width: 100 },
    ],
    data: [
      { id: 1, name: "Item 1", code: "001" },
      { id: 2, name: "Item 2", code: "002" },
      { id: 3, name: "Item 3", code: "003" },
    ],
    dataSelection: true,
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector("table");
    expect(table).toBeInTheDocument();
  },
};
