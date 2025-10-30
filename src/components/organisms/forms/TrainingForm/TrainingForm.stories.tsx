import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import TrainingForm from "./index";

const meta: Meta<typeof TrainingForm> = {
  title: "Components/Organisms/Forms/TrainingForm",
  component: TrainingForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TrainingForm>;

export const Default: Story = {
  args: {
    data: {
      beruf: "Industriekaufmann",
      betriebEintritt: "2024-09-01",
      betriebName: "Ausbildungsbetrieb GmbH",
      betriebStraße: "Industriestraße",
      betriebHausNr: "50",
      betriebPlz: "10115",
      betriebOrt: "Berlin",
      betriebTel: "+49 30 123456",
      betriebMail: "info@ausbildungsbetrieb.de",
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
