import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import HealthIndicator from "./index";

const meta: Meta<typeof HealthIndicator> = {
  title: "Components/Atoms/Dashboard/HealthIndicator",
  component: HealthIndicator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HealthIndicator>;

export const Default: Story = {
  args: {
    status: "up",
    label: "Operational",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvasElement.querySelector(".MuiChip-root");
    expect(chip).toBeInTheDocument();
  },
};
