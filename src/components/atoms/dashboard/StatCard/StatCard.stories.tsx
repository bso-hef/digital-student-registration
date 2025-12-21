import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import StatCard from "./index";

const meta: Meta<typeof StatCard> = {
  title: "Components/Atoms/Dashboard/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: "Total Students",
    value: 1234,
    icon: <GroupRoundedIcon />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();
  },
};
