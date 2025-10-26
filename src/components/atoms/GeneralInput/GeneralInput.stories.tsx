import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import GeneralInput from "./index";

const meta: Meta<typeof GeneralInput> = {
  title: "Components/Atoms/GeneralInput",
  component: GeneralInput,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralInput>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    fullWidth: true,
    showEmailStartIcon: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  },
};
