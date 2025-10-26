import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import PreEducationForm from "./index";

const meta: Meta<typeof PreEducationForm> = {
  title: "Components/Organisms/Forms/PreEducationForm",
  component: PreEducationForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PreEducationForm>;

export const Default: Story = {
  args: {
    data: {
      vorhergehendeSchule: "Realschule Berlin",
      vorhergehendeStufe: "10. Klasse",
      vorhergehendeSchulform: "Realschule",
      abschluesse: "Realschulabschluss",
    },
  },
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
