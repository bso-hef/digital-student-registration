import { Box } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import ChartContainer from "./index";

const meta: Meta<typeof ChartContainer> = {
  title: "Components/Molecules/Dashboard/ChartContainer",
  component: ChartContainer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

export const Default: Story = {
  args: {
    title: "Chart Title",
    children: <Box>Chart Content</Box>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Chart Title");
    expect(title).toBeInTheDocument();
  },
};
