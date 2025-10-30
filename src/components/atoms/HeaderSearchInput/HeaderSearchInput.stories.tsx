import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import HeaderSearchInput from "./index";

const meta: Meta<typeof HeaderSearchInput> = {
  title: "Components/Atoms/HeaderSearchInput",
  component: HeaderSearchInput,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HeaderSearchInput>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  },
};
