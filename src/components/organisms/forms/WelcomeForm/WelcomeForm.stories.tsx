import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import WelcomeForm from "./index";

const meta: Meta<typeof WelcomeForm> = {
  title: "Components/Organisms/Forms/WelcomeForm",
  component: WelcomeForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof WelcomeForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector("div");
    expect(element).toBeInTheDocument();
  },
};
