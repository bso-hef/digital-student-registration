import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import ParentsForm from "./index";

const meta: Meta<typeof ParentsForm> = {
  title: "Components/Organisms/Forms/ParentsForm",
  component: ParentsForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ParentsForm>;

export const Default: Story = {
  args: {
    data: {
      ansprechpartner1Art: "Vater",
      ansprechpartner1Vorname: "Peter",
      ansprechpartner1Nachname: "Mustermann",
      ansprechpartner1Plz: "12345",
      ansprechpartner1Ort: "Berlin",
      ansprechpartner1Straße: "Hauptstraße",
      ansprechpartner1HausNr: "42",
      ansprechpartner1Mobil: "+49 170 1234567",
      ansprechpartner1Telefon1: "+49 30 12345678",
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
