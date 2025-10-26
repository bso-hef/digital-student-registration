import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import CustomTitle from "./index";

const meta: Meta<typeof CustomTitle> = {
  title: "Components/Atoms/CustomTitle",
  component: CustomTitle,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CustomTitle>;

export const Default: Story = {
  args: {
    title: "Welcome",
    subTitle: "Get started with your registration",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Welcome");
    expect(title).toBeInTheDocument();
  },
};
