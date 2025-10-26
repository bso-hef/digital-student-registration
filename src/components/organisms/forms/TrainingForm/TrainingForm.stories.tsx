import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import TrainingForm from "./index";

const meta: Meta<typeof TrainingForm> = {
  title: "Components/Organisms/Forms/TrainingForm",
  component: TrainingForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TrainingForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
