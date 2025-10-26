import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AddressForm from "./index";

const meta: Meta<typeof AddressForm> = {
  title: "Components/Organisms/Forms/AddressForm",
  component: AddressForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AddressForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
