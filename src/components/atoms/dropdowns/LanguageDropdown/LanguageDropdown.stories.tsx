import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import LanguageDropdown from "./index";

const meta: Meta<typeof LanguageDropdown> = {
  title: "Components/Atoms/Dropdowns/LanguageDropdown",
  component: LanguageDropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LanguageDropdown>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector(".MuiSelect-select");
    expect(select).toBeInTheDocument();
  },
};
