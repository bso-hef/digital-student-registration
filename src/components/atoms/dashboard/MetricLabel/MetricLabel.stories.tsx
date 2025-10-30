import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import MetricLabel from "./index";

const meta: Meta<typeof MetricLabel> = {
  title: "Components/Atoms/Dashboard/MetricLabel",
  component: MetricLabel,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MetricLabel>;

export const Default: Story = {
  args: {
    label: "Total Students",
    value: "1,234",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Total Students");
    expect(label).toBeInTheDocument();
  },
};
