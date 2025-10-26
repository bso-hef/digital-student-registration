import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AdminSubPageHeader from "./index";

const meta: Meta<typeof AdminSubPageHeader> = {
  title: "Components/Molecules/AdminSubPageHeader",
  component: AdminSubPageHeader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AdminSubPageHeader>;

export const Default: Story = {
  args: {
    title: "Class Details",
    subtitle: "View and manage class information",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Class Details");
    expect(title).toBeInTheDocument();
  },
};
