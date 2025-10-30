import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import GenerateQrModal from "./index";

const meta: Meta<typeof GenerateQrModal> = {
  title: "Components/Organisms/Modals/GenerateQrModal",
  component: GenerateQrModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GenerateQrModal>;

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
