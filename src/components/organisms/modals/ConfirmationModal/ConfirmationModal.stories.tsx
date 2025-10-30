import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import ConfirmationModal from "./index";

const meta: Meta<typeof ConfirmationModal> = {
  title: "Components/Organisms/Modals/ConfirmationModal",
  component: ConfirmationModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ConfirmationModal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    onConfirm: () => {},
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
  },
  play: async () => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};
