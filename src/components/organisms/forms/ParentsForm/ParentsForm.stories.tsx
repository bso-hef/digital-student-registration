import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ParentsForm from "./index";

const meta: Meta<typeof ParentsForm> = {
  title: "Components/Organisms/Forms/ParentsForm",
  component: ParentsForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ParentsForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
