import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import StepForm from "./index";

const meta: Meta<typeof StepForm> = {
  title: "Components/Organisms/StepForm",
  component: StepForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StepForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector("div");
    expect(element).toBeInTheDocument();
  },
};
