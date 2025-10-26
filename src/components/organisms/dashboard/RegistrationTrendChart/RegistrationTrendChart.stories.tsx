import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import RegistrationTrendChart from "./index";

const meta: Meta<typeof RegistrationTrendChart> = {
  title: "Components/Organisms/Dashboard/RegistrationTrendChart",
  component: RegistrationTrendChart,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RegistrationTrendChart>;

export const Default: Story = {
  args: {
    data: [
      { date: "2025-01-01", count: 12 },
      { date: "2025-01-08", count: 18 },
      { date: "2025-01-15", count: 25 },
      { date: "2025-01-22", count: 22 },
      { date: "2025-01-29", count: 30 },
      { date: "2025-02-05", count: 35 },
      { date: "2025-02-12", count: 28 },
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
