import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import GeneralForm from "./index";

const meta: Meta<typeof GeneralForm> = {
  title: "Components/Organisms/Forms/GeneralForm",
  component: GeneralForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
