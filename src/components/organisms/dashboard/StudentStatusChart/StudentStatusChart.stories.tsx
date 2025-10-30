import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import StudentStatusChart from "./index";

const meta: Meta<typeof StudentStatusChart> = {
  title: "Components/Organisms/Dashboard/StudentStatusChart",
  component: StudentStatusChart,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StudentStatusChart>;

export const Default: Story = {
  args: {
    data: {
      imported: 45,
      invited: 32,
      onboarded: 18,
      other: 5,
    },
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector("div");
    expect(chart).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    data: {
      imported: 0,
      invited: 0,
      onboarded: 0,
      other: 0,
    },
    loading: true,
  },
};
