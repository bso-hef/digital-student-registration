import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import OriginForm from "./index";

const meta: Meta<typeof OriginForm> = {
  title: "Components/Organisms/Forms/OriginForm",
  component: OriginForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof OriginForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
