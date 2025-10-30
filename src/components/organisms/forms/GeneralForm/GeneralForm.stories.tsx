import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import GeneralForm from "./index";

const meta: Meta<typeof GeneralForm> = {
  title: "Components/Organisms/Forms/GeneralForm",
  component: GeneralForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralForm>;

export const Default: Story = {
  args: {
    data: {
      eintrittschule: "2024-09-01",
      klassenname: "10A",
      vorname: "Max",
      nachname: "Mustermann",
      geburtsname: "Mustermann",
      geschlecht: "male",
      geburtsdatum: "2008-05-15",
      geburtsland: "Deutschland",
      geburtsort: "Berlin",
      religion: "katholisch",
      staatsangehoerigkeit1: "deutsch",
      staatsangehoerigkeit2: "",
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
