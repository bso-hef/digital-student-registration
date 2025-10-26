import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ClassDistributionChart from "./index";

const meta: Meta<typeof ClassDistributionChart> = {
  title: "Components/Organisms/Dashboard/ClassDistributionChart",
  component: ClassDistributionChart,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ClassDistributionChart>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector("div");
    expect(chart).toBeInTheDocument();
  },
};
