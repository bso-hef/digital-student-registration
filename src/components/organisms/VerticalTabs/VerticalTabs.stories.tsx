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
      {
        label: "Tab 1",
        link: "/admin/tab1",
        component: <div>Tab 1 Content</div>,
      },
      {
        label: "Tab 2",
        link: "/admin/tab2",
        component: <div>Tab 2 Content</div>,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const tabs = canvasElement.querySelector("ul");
    expect(tabs).toBeInTheDocument();
  },
};
