import { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "@storybook/test";

import GeneralModal from "./index";

const meta: Meta<typeof GeneralModal> = {
  title: "Components/Organisms/Modals/GeneralModal",
  component: GeneralModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralModal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: "Modal Title",
    children: <div>Modal content goes here</div>,
  },
  play: async () => {
    const dialog = document.querySelector(".MuiDialog-root");
    expect(dialog).toBeInTheDocument();
  },
};
