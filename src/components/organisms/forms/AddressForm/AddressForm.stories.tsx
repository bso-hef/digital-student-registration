import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import AddressForm from "./index";

const meta: Meta<typeof AddressForm> = {
  title: "Components/Organisms/Forms/AddressForm",
  component: AddressForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AddressForm>;

export const Default: Story = {
  args: {
    data: {
      straße: "Hauptstraße",
      hausnr: 42,
      plz: 12345,
      ort: "Berlin",
      mobil: "+49 170 1234567",
      tel: "+49 30 12345678",
      mail: "max.mustermann@example.com",
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
