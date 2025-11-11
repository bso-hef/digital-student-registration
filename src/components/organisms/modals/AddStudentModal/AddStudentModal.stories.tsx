import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import AddStudentModal from "./index";

const meta: Meta<typeof AddStudentModal> = {
  title: "Components/Organisms/Modals/AddStudentModal",
  component: AddStudentModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AddStudentModal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};
