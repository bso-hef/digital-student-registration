import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import DraggableStatsGrid from "./index";

const meta: Meta<typeof DraggableStatsGrid> = {
  title: "Components/Molecules/Dashboard/DraggableStatsGrid",
  component: DraggableStatsGrid,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DraggableStatsGrid>;

export const Default: Story = {
  args: {
    stats: {
      totalStudents: 156,
      totalClasses: 12,
      unassignedStudents: 8,
      activeClasses: 10,
    },
    order: [
      "totalStudents",
      "totalClasses",
      "unassignedStudents",
      "activeClasses",
    ],
    onReorder: (newOrder: string[]) => {
      console.log("Stats reordered:", newOrder);
    },
  },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector("div");
    expect(grid).toBeInTheDocument();
  },
};
