import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import OriginForm from "./index";

const meta: Meta<typeof OriginForm> = {
  title: "Components/Organisms/Forms/OriginForm",
  component: OriginForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof OriginForm>;

export const Default: Story = {
  args: {
    data: {
      herkunftsland: "Türkei",
      zuzugsjahr: 2010,
      familiensprache: "Türkisch",
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
