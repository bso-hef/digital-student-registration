import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ClassStatus from "./index";

const meta: Meta<typeof ClassStatus> = {
  title: "Components/Atoms/Status/ClassStatus",
  component: ClassStatus,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ClassStatus>;

export const Default: Story = {
  args: {
    active: true,
    showLabel: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvasElement.querySelector("svg");
    expect(icon).toBeInTheDocument();
  },
};
