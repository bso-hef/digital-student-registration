import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import SummaryForm from "./index";

const meta: Meta<typeof SummaryForm> = {
  title: "Components/Organisms/Forms/SummaryForm",
  component: SummaryForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SummaryForm>;

export const Default: Story = {
  args: {
    data: {
      changedData: "",
      schuelerId: 12345,
      datenschutz: true,
      personenabbild: "ja",
      teams: "ja",
      unterricht: "ja",
      schulordnung: true,
    },
  },
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector("div");
    expect(element).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector("div");
    expect(element).toBeInTheDocument();
  },
};
