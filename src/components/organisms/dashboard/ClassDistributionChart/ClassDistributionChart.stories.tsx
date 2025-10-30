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
  args: {
    data: [
      { grade: "Grade 1", count: 45 },
      { grade: "Grade 2", count: 38 },
      { grade: "Grade 3", count: 52 },
      { grade: "Grade 4", count: 41 },
      { grade: "Grade 5", count: 48 },
      { grade: "Grade 6", count: 35 },
      { grade: "Grade 7", count: 43 },
      { grade: "Grade 8", count: 39 },
    ],
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector("div");
    expect(chart).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
};
