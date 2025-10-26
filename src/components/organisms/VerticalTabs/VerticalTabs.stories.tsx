import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import VerticalTabs from "./index";

const meta: Meta<typeof VerticalTabs> = {
  title: "Components/Organisms/VerticalTabs",
  component: VerticalTabs,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof VerticalTabs>;

export const Default: Story = {
  args: {
    tabs: [
      { label: "Tab 1", content: <div>Content 1</div> },
      { label: "Tab 2", content: <div>Content 2</div> },
    ],
  },
  play: async ({ canvasElement }) => {
    const tabs = canvasElement.querySelector(".MuiTabs-root");
    expect(tabs).toBeInTheDocument();
  },
};
