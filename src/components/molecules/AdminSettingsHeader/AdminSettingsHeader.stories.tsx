import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AdminSettingsHeader from "./index";

const meta: Meta<typeof AdminSettingsHeader> = {
  title: "Components/Molecules/AdminSettingsHeader",
  component: AdminSettingsHeader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AdminSettingsHeader>;

export const Default: Story = {
  args: {
    title: "Settings",
    description: "Manage your application settings",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Settings");
    expect(title).toBeInTheDocument();
  },
};
