import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import SystemHealthWidget from "./index";

const meta: Meta<typeof SystemHealthWidget> = {
  title: "Components/Molecules/Dashboard/SystemHealthWidget",
  component: SystemHealthWidget,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SystemHealthWidget>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const widget = canvasElement.querySelector("div");
    expect(widget).toBeInTheDocument();
  },
};
