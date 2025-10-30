import HomeIcon from "@mui/icons-material/Home";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import SmallIconButton from "./index";

const meta: Meta<typeof SmallIconButton> = {
  title: "Components/Atoms/Buttons/SmallIconButton",
  component: SmallIconButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SmallIconButton>;

export const Default: Story = {
  args: {
    icon: <HomeIcon />,
    title: "Home",
    placement: "top",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const iconButton = canvas.getByLabelText("Home");
    expect(iconButton).toBeInTheDocument();
  },
};
