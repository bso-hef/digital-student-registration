import HomeIcon from "@mui/icons-material/Home";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import GeneralButton from "./index";

const meta: Meta<typeof GeneralButton> = {
  title: "Components/Atoms/Buttons/GeneralButton",
  component: GeneralButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralButton>;

export const Default: Story = {
  args: {
    label: "Click me",
    isPrimary: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    expect(button).toBeInTheDocument();
  },
};
