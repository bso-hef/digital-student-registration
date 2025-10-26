import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import GenderDisplay from "./index";

const meta: Meta<typeof GenderDisplay> = {
  title: "Components/Atoms/GenderDisplay",
  component: GenderDisplay,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GenderDisplay>;

export const Default: Story = {
  args: {
    gender: "male",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvasElement.querySelector("svg");
    expect(element).toBeInTheDocument();
  },
};
