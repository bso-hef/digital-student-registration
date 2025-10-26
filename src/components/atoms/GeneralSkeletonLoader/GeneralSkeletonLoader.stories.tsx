import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import { GeneralSkeletonLoader } from "./index";

const meta: Meta<typeof GeneralSkeletonLoader> = {
  title: "Components/Atoms/GeneralSkeletonLoader",
  component: GeneralSkeletonLoader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GeneralSkeletonLoader>;

export const Default: Story = {
  args: {
    height: 100,
    width: "100%",
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector(".MuiSkeleton-root");
    expect(skeleton).toBeInTheDocument();
  },
};
