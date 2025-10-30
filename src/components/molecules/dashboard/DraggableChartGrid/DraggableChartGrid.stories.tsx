import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import DraggableChartGrid from "./index";

const meta: Meta<typeof DraggableChartGrid> = {
  title: "Components/Molecules/Dashboard/DraggableChartGrid",
  component: DraggableChartGrid,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DraggableChartGrid>;

export const Default: Story = {
  args: {
    stats: {
      registrationTrend: [
        { date: "2025-01-01", count: 12 },
        { date: "2025-01-08", count: 18 },
        { date: "2025-01-15", count: 25 },
      ],
      classDistribution: [
        { grade: "Grade 1", count: 45 },
        { grade: "Grade 2", count: 38 },
        { grade: "Grade 3", count: 52 },
      ],
      studentStatus: {
        imported: 45,
        invited: 32,
        onboarded: 18,
        other: 5,
      },
    },
    health: {
      status: "healthy",
      uptime: 99.9,
      lastCheck: "2025-01-26T10:00:00Z",
      meta: {
        uptimeSec: 86400,
        version: "1.0.0",
        system: {
          cpus: 4,
          memory: 16384,
          platform: "linux",
        },
      },
      checks: {
        mongo: {
          status: "healthy",
          responseTime: 12,
        },
        redis: {
          status: "healthy",
          responseTime: 5,
        },
      },
      services: {
        database: "healthy",
        api: "healthy",
        cache: "healthy",
      },
    },
    loading: false,
    order: [
      "registrationTrend",
      "studentStatus",
      "classDistribution",
      "systemHealth",
    ],
    onReorder: (newOrder: string[]) => {
      console.log("Charts reordered:", newOrder);
    },
  },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector("div");
    expect(grid).toBeInTheDocument();
  },
};
