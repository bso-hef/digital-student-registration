import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import OnboardingVersion from "./index";

const meta: Meta<typeof OnboardingVersion> = {
  title: "Components/Atoms/OnboardingVersion",
  component: OnboardingVersion,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof OnboardingVersion>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    expect(svg).toBeInTheDocument();
  },
};
