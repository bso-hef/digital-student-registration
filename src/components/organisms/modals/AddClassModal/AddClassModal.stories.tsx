import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AddClassModal from "./index";

const meta: Meta<typeof AddClassModal> = {
  title: "Components/Organisms/Modals/AddClassModal",
  component: AddClassModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AddClassModal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};
