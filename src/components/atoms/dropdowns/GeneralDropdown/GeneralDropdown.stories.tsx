import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import GeneralDropdown from "./index";

const meta: Meta<typeof GeneralDropdown> = {
  title: "Components/Atoms/Dropdowns/GeneralDropdown",
  component: GeneralDropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralDropdown>;

export const Default: Story = {
  args: {
    label: "Select Option",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
    ],
    value: "1",
    onChange: () => {},
    fullWidth: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvasElement.querySelector(".MuiSelect-select");
    expect(select).toBeInTheDocument();
  },
};
