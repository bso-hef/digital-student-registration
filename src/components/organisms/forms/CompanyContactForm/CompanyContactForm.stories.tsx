import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import CompanyContactForm from "./index";

const meta: Meta<typeof CompanyContactForm> = {
  title: "Components/Organisms/Forms/CompanyContactForm",
  component: CompanyContactForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CompanyContactForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    expect(form).toBeInTheDocument();
  },
};
