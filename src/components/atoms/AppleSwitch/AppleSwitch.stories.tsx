import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AppleSwitch from "./index";

const meta: Meta<typeof AppleSwitch> = {
  title: "Components/Atoms/AppleSwitch",
  component: AppleSwitch,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AppleSwitch>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchElement = canvas.getByRole("checkbox");
    expect(switchElement).toBeInTheDocument();
  },
};
