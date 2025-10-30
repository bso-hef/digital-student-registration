import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import ThemeDropdown from "./index";

const meta: Meta<typeof ThemeDropdown> = {
  title: "Components/Atoms/Dropdowns/ThemeDropdown",
  component: ThemeDropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThemeDropdown>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector(".MuiSelect-select");
    expect(select).toBeInTheDocument();
  },
};
