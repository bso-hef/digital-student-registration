import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import StudentStatusChart from "./index";

const meta: Meta<typeof StudentStatusChart> = {
  title: "Components/Organisms/Dashboard/StudentStatusChart",
  component: StudentStatusChart,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StudentStatusChart>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector("div");
    expect(chart).toBeInTheDocument();
  },
};
