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
  args: {
    data: {
      arbeitgeberName: "Musterfirma GmbH",
      arbeitgeberOrt: "Berlin",
      arbeitgeberPlz: "12345",
      arbeitgeberStraße: "Firmenstraße",
      arbeitgeberHausNr: "10",
      arbeitgeberTelefon: "+49 30 9876543",
      ansprechpartnerVorname: "Anna",
      ansprechpartnerNachname: "Schmidt",
      ansprechpartnerEmail: "anna.schmidt@musterfirma.de",
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
