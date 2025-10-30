import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AccessibilityMenu from "./index";

const meta: Meta<typeof AccessibilityMenu> = {
  title: "Components/Molecules/AccessibilityMenu",
  component: AccessibilityMenu,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AccessibilityMenu>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByLabelText("Accessibility");
    expect(menu).toBeInTheDocument();
  },
};
