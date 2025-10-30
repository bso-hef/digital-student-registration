import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import StudentStatus from "./index";

const meta: Meta<typeof StudentStatus> = {
  title: "Components/Atoms/Status/StudentStatus",
  component: StudentStatus,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StudentStatus>;

export const Default: Story = {
  args: {
    studentStatus: "onboarded",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvasElement.querySelector("svg");
    expect(icon).toBeInTheDocument();
  },
};
