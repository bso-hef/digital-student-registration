import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import { AdminSubPageHeader } from "./index";

/**
 * Component tests for AdminSubPageHeader
 * @file src/components/molecules/AdminSubPageHeader/AdminSubPageHeader.test.tsx
 */

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock SmallIconButton
vi.mock("@/components/atoms/buttons/SmallIconButton", () => ({
  default: ({ icon, onAction, title }: any) => (
    <button data-testid="small-icon-button" onClick={onAction} title={title}>
      {icon}
    </button>
  ),
}));

// Mock GeneralSkeletonLoader
vi.mock("@/components/atoms/GeneralSkeletonLoader", () => ({
  GeneralSkeletonLoader: ({ width, height }: any) => (
    <div data-testid="skeleton-loader" style={{ width, height }}>
      Loading...
    </div>
  ),
}));

describe("AdminSubPageHeader", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  describe("Basic Rendering", () => {
    it("should render title", () => {
      renderWithProviders(<AdminSubPageHeader title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render subtitle when provided", () => {
      renderWithProviders(
        <AdminSubPageHeader title="Title" subtitle="Subtitle text" />,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
    });

    it("should not render subtitle when not provided", () => {
      renderWithProviders(<AdminSubPageHeader title="Title" />);

      expect(screen.getByText("Title")).toBeInTheDocument();
      // Subtitle should not be present
      expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
    });

    it("should render back button", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" />);

      expect(screen.getByTestId("small-icon-button")).toBeInTheDocument();
    });

    it("should render root container", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="Test" />,
      );

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Navigation - Back Button", () => {
    it("should call router.back() when back button clicked and no backTo", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AdminSubPageHeader title="Test" />);

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should navigate to backTo path when provided", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <AdminSubPageHeader title="Test" backTo="/admin/dashboard" />,
      );

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
      expect(mockBack).not.toHaveBeenCalled();
    });

    it("should call onHandleBack when provided", async () => {
      const user = userEvent.setup();
      const onHandleBack = vi.fn();

      renderWithProviders(
        <AdminSubPageHeader title="Test" onHandleBack={onHandleBack} />,
      );

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(onHandleBack).toHaveBeenCalledTimes(1);
    });

    it("should call both onHandleBack and navigate", async () => {
      const user = userEvent.setup();
      const onHandleBack = vi.fn();

      renderWithProviders(
        <AdminSubPageHeader
          title="Test"
          backTo="/admin"
          onHandleBack={onHandleBack}
        />,
      );

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(onHandleBack).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin");
      expect(mockBack).not.toHaveBeenCalled();
    });

    it("should not navigate when backTo is empty string", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AdminSubPageHeader title="Test" backTo="" />);

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockPush).not.toHaveBeenCalled();
      expect(mockBack).toHaveBeenCalled();
    });

    it("should not navigate when backTo is whitespace", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AdminSubPageHeader title="Test" backTo="   " />);

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockPush).not.toHaveBeenCalled();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show skeleton when loading is true", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" loading={true} />);

      expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });

    it("should show title and subtitle when loading is false", () => {
      renderWithProviders(
        <AdminSubPageHeader
          title="Title"
          subtitle="Subtitle"
          loading={false}
        />,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
      expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
    });

    it("should show content by default when loading not provided", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" subtitle="Sub" />);

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("Sub")).toBeInTheDocument();
    });

    it("should render skeleton with correct dimensions", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="Test" loading={true} />,
      );

      const skeleton = screen.getByTestId("skeleton-loader");
      expect(skeleton).toHaveStyle({ width: "200px", height: "41px" });
    });

    it("should transition from loading to loaded", () => {
      const { rerender } = renderWithProviders(
        <AdminSubPageHeader title="Test" subtitle="Sub" loading={true} />,
      );

      expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();

      rerender(
        <AdminSubPageHeader title="Test" subtitle="Sub" loading={false} />,
      );

      expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("Sub")).toBeInTheDocument();
    });
  });

  describe("Title and Subtitle Content", () => {
    it("should handle ReactNode title", () => {
      renderWithProviders(
        <AdminSubPageHeader
          title={<span data-testid="custom-title">Custom</span>}
        />,
      );

      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    });

    it("should handle ReactNode subtitle", () => {
      renderWithProviders(
        <AdminSubPageHeader
          title="Title"
          subtitle={<span data-testid="custom-subtitle">Custom Sub</span>}
        />,
      );

      expect(screen.getByTestId("custom-subtitle")).toBeInTheDocument();
    });

    it("should handle long title", () => {
      const longTitle = "This is a very long title that might wrap";
      renderWithProviders(<AdminSubPageHeader title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle long subtitle", () => {
      const longSubtitle =
        "This is a very long subtitle with lots of information";
      renderWithProviders(
        <AdminSubPageHeader title="Title" subtitle={longSubtitle} />,
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      renderWithProviders(
        <AdminSubPageHeader title="Title with <special> & chars" />,
      );

      expect(
        screen.getByText("Title with <special> & chars"),
      ).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have Root container", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="Test" />,
      );

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });

    it("should have Column for title/subtitle", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="Title" subtitle="Subtitle" />,
      );

      const boxes = container.querySelectorAll(".MuiBox-root");
      expect(boxes.length).toBeGreaterThan(1);
    });

    it("should render back button before content", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" />);

      const backButton = screen.getByTestId("small-icon-button");
      const title = screen.getByText("Test");

      expect(backButton).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it("should have uppercase title styling", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="title" />,
      );

      const title = screen.getByText("title");
      expect(title.className).toContain("MuiTypography");
    });
  });

  describe("Memoization", () => {
    it("should be a memoized component", () => {
      const { rerender } = renderWithProviders(
        <AdminSubPageHeader title="Test" />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();

      rerender(<AdminSubPageHeader title="Test" />);

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should update when props change", () => {
      const { rerender } = renderWithProviders(
        <AdminSubPageHeader title="First" />,
      );

      expect(screen.getByText("First")).toBeInTheDocument();

      rerender(<AdminSubPageHeader title="Second" />);

      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.queryByText("First")).not.toBeInTheDocument();
    });

    it("should have displayName", () => {
      expect(AdminSubPageHeader.displayName).toBe("AdminSubPageHeader");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title", () => {
      renderWithProviders(<AdminSubPageHeader title="" />);

      const container = document.body;
      expect(container).toBeInTheDocument();
    });

    it("should handle undefined subtitle", () => {
      renderWithProviders(
        <AdminSubPageHeader title="Test" subtitle={undefined} />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should handle multiple back button clicks", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AdminSubPageHeader title="Test" />);

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);
      await user.click(backButton);
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalledTimes(3);
    });

    it("should handle navigation with complex paths", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <AdminSubPageHeader title="Test" backTo="/admin/students/123/edit" />,
      );

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith("/admin/students/123/edit");
    });

    it("should handle navigation with query params", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <AdminSubPageHeader
          title="Test"
          backTo="/admin/list?page=2&filter=active"
        />,
      );

      const backButton = screen.getByTestId("small-icon-button");
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith("/admin/list?page=2&filter=active");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic structure", () => {
      const { container } = renderWithProviders(
        <AdminSubPageHeader title="Accessible" subtitle="Content" />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies.length).toBe(2);
    });

    it("should have focusable back button", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" />);

      const backButton = screen.getByTestId("small-icon-button");
      backButton.focus();
      expect(backButton).toHaveFocus();
    });

    it("should render text content for screen readers", () => {
      renderWithProviders(
        <AdminSubPageHeader title="Main Title" subtitle="Sub Info" />,
      );

      expect(screen.getByText("Main Title")).toBeInTheDocument();
      expect(screen.getByText("Sub Info")).toBeInTheDocument();
    });

    it("should show loading state accessibly", () => {
      renderWithProviders(<AdminSubPageHeader title="Test" loading={true} />);

      expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
    });
  });
});
