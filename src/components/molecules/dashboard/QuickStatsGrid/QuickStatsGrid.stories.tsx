import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import QuickStatsGrid from "./index";

const meta: Meta<typeof QuickStatsGrid> = {
  title: "Components/Molecules/Dashboard/QuickStatsGrid",
  component: QuickStatsGrid,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof QuickStatsGrid>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector("div");
    expect(grid).toBeInTheDocument();
  },
};
