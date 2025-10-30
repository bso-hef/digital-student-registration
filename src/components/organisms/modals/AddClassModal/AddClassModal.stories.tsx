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
    onClose: () => {
      console.log("Modal closed");
    },
    onAddClass: (classes) => {
      console.log("Classes added:", classes);
    },
  },
  play: async ({ canvasElement }) => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    onAddClass: () => {},
  },
};
