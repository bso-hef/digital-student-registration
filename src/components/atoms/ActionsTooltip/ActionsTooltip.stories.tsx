import { Box } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ActionsTooltip from "./index";

const meta: Meta<typeof ActionsTooltip> = {
  title: "Components/Atoms/ActionsTooltip",
  component: ActionsTooltip,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ActionsTooltip>;

export const Default: Story = {
  args: {
    title: "Tooltip text",
    placement: "top",
    children: <Box style={{ width: "10%" }}>Hover me</Box>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByText("Hover me");
    expect(element).toBeInTheDocument();
  },
};
