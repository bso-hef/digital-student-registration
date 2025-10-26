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
  args: {},
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector("div");
    expect(chart).toBeInTheDocument();
  },
};
