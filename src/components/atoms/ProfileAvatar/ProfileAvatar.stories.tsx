import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ProfileAvatar from "./index";

const meta: Meta<typeof ProfileAvatar> = {
  title: "Components/Atoms/ProfileAvatar",
  component: ProfileAvatar,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ProfileAvatar>;

export const Default: Story = {
  args: {
    initialsFallback: "John Doe",
    size: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvasElement.querySelector(".MuiAvatar-root");
    expect(avatar).toBeInTheDocument();
  },
};
