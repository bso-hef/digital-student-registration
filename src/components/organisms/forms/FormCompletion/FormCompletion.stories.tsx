import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import FormCompletion from "./index";

const meta: Meta<typeof FormCompletion> = {
  title: "Components/Organisms/Forms/FormCompletion",
  component: FormCompletion,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FormCompletion>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector("div");
    expect(element).toBeInTheDocument();
  },
};
