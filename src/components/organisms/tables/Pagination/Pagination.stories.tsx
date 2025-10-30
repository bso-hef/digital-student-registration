import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Components/Organisms/Tables/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
    })),
    rowsPerPage: 10,
    page: 0,
    handleChangePage: () => {},
    handleChangeRowsPerPage: () => {},
  },
  play: async ({ canvasElement }) => {
    const pagination = canvasElement.querySelector(".MuiPagination-root");
    expect(pagination).toBeInTheDocument();
  },
};
