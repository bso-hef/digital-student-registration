import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import DraggableChartGrid from "./index";

const meta: Meta<typeof DraggableChartGrid> = {
  title: "Components/Molecules/Dashboard/DraggableChartGrid",
  component: DraggableChartGrid,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DraggableChartGrid>;

export const Default: Story = {
  args: {
    items: [],
  },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector("div");
    expect(grid).toBeInTheDocument();
  },
};
