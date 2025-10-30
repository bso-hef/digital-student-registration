import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import AddStudentsToClassModal from "./index";

const meta: Meta<typeof AddStudentsToClassModal> = {
  title: "Components/Organisms/Modals/AddStudentsToClassModal",
  component: AddStudentsToClassModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AddStudentsToClassModal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    classId: "test-class-id",
  },
  play: async ({ canvasElement }) => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};
