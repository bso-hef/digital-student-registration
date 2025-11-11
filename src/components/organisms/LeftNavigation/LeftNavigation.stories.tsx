import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import LeftNavigation from "./index";

const meta: Meta<typeof LeftNavigation> = {
  title: "Components/Organisms/LeftNavigation",
  component: LeftNavigation,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LeftNavigation>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector("div");
    expect(nav).toBeInTheDocument();
  },
};
