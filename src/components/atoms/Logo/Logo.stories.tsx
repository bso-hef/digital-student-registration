import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import Logo from "./index";

const meta: Meta<typeof Logo> = {
  title: "Components/Atoms/Logo",
  component: Logo,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    width: 200,
    height: 75,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvasElement.querySelector("svg");
    expect(svg).toBeInTheDocument();
  },
};
