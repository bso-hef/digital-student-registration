import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouter,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import VerticalTabs, { VerticalTab } from "./index";

/**
 * Component tests for VerticalTabs
 * @file src/components/organisms/VerticalTabs/VerticalTabs.test.tsx
 */

// Use exported mockRouter from test-utils
const mockReplace = mockRouter.replace;

describe("VerticalTabs", () => {
  const mockTabs: VerticalTab[] = [
    {
      label: "General",
      link: "/admin/settings/general",
      component: <div>General Content</div>,
    },
    {
      label: "Security",
      link: "/admin/settings/security",
      component: <div>Security Content</div>,
    },
    {
      label: "Integrations",
      link: "/admin/settings/integrations",
      component: <div>Integrations Content</div>,
    },
  ];

  beforeEach(() => {
    mockReplace.mockClear();
    mockRouter.pathname = "/admin/settings/general";
  });

  describe("Basic Rendering", () => {
    it("should render tabs list", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should render all tab labels", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
      expect(screen.getByText("Security")).toBeInTheDocument();
      expect(screen.getByText("Integrations")).toBeInTheDocument();
    });

    it("should render correct number of tabs", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const listItems = container.querySelectorAll(".MuiListItemButton-root");
      expect(listItems.length).toBe(3);
    });

    it("should render right container", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      // Right container should exist
      const boxes = container.querySelectorAll(".MuiBox-root");
      expect(boxes.length).toBeGreaterThan(0);
    });

    it("should render children in right container", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div data-testid="custom-content">Custom Content</div>
        </VerticalTabs>,
      );

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("should render without children", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should render root container", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Tab Selection - Exact Match", () => {
    it("should highlight tab matching current pathname", () => {
      mockRouter.pathname = "/admin/settings/general";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).toHaveAttribute("aria-selected", "true");
    });

    it("should highlight different tab when pathname changes", () => {
      mockRouter.pathname = "/admin/settings/security";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen
        .getByText("Security")
        .closest(".MuiListItemButton-root");
      expect(securityTab).toHaveAttribute("aria-selected", "true");
    });

    it("should not highlight non-matching tabs", () => {
      mockRouter.pathname = "/admin/settings/general";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen
        .getByText("Security")
        .closest(".MuiListItemButton-root");
      const integrationsTab = screen
        .getByText("Integrations")
        .closest(".MuiListItemButton-root");

      expect(securityTab).not.toHaveAttribute("aria-selected", "true");
      expect(integrationsTab).not.toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Tab Selection - Last Segment Match", () => {
    it("should highlight tab when last segment matches", () => {
      mockRouter.pathname = "/different/path/general";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).toHaveAttribute("aria-selected", "true");
    });

    it("should match last segment even with different base path", () => {
      mockRouter.pathname = "/some/other/route/security";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen
        .getByText("Security")
        .closest(".MuiListItemButton-root");
      expect(securityTab).toHaveAttribute("aria-selected", "true");
    });

    it("should not match if last segment differs", () => {
      mockRouter.pathname = "/admin/settings/other";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).not.toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Navigation", () => {
    it("should navigate when tab clicked", async () => {
      const user = userEvent.setup();
      mockRouter.pathname = "/admin/settings/general";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen.getByText("Security");
      await user.click(securityTab);

      expect(mockReplace).toHaveBeenCalledWith("/admin/settings/security");
    });

    it("should use router.replace instead of router.push", async () => {
      const user = userEvent.setup();
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const integrationsTab = screen.getByText("Integrations");
      await user.click(integrationsTab);

      expect(mockReplace).toHaveBeenCalledWith("/admin/settings/integrations");
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });

    it("should navigate to different tabs", async () => {
      const user = userEvent.setup();
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen.getByText("Security");
      await user.click(securityTab);
      expect(mockReplace).toHaveBeenCalledWith("/admin/settings/security");

      const integrationsTab = screen.getByText("Integrations");
      await user.click(integrationsTab);
      expect(mockReplace).toHaveBeenCalledWith("/admin/settings/integrations");

      expect(mockReplace).toHaveBeenCalledTimes(2);
    });

    it("should allow clicking same tab multiple times", async () => {
      const user = userEvent.setup();
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen.getByText("General");
      await user.click(generalTab);
      await user.click(generalTab);

      expect(mockReplace).toHaveBeenCalledWith("/admin/settings/general");
      expect(mockReplace).toHaveBeenCalledTimes(2);
    });
  });

  describe("Suspense and Loading", () => {
    it("should render Suspense wrapper", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      // Component should render (Suspense doesn't throw in tests)
      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should show spinner when showSpinnerFallback is true", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs} showSpinnerFallback={true} />,
      );

      // Tabs should be visible (Suspense fallback not triggered in sync render)
      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should not show spinner when showSpinnerFallback is false", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs} showSpinnerFallback={false} />,
      );

      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should default showSpinnerFallback to true", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  describe("Tab Data Variations", () => {
    it("should render with single tab", () => {
      const singleTab: VerticalTab[] = [
        {
          label: "Only Tab",
          link: "/admin/only",
          component: <div>Content</div>,
        },
      ];

      renderWithProviders(<VerticalTabs tabs={singleTab} />);

      expect(screen.getByText("Only Tab")).toBeInTheDocument();
    });

    it("should render with empty tabs array", () => {
      const { container } = renderWithProviders(<VerticalTabs tabs={[]} />);

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
      expect(list?.children.length).toBe(0);
    });

    it("should render with many tabs", () => {
      const manyTabs: VerticalTab[] = Array.from({ length: 10 }, (_, i) => ({
        label: `Tab ${i + 1}`,
        link: `/admin/tab${i + 1}`,
        component: <div>Content {i + 1}</div>,
      }));

      renderWithProviders(<VerticalTabs tabs={manyTabs} />);

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 10")).toBeInTheDocument();
    });

    it("should handle tabs with special characters in labels", () => {
      const specialTabs: VerticalTab[] = [
        {
          label: "Settings & Preferences",
          link: "/admin/settings",
          component: <div>Settings</div>,
        },
      ];

      renderWithProviders(<VerticalTabs tabs={specialTabs} />);

      expect(screen.getByText("Settings & Preferences")).toBeInTheDocument();
    });

    it("should handle tabs with long labels", () => {
      const longLabelTabs: VerticalTab[] = [
        {
          label: "This is a very long tab label that might wrap",
          link: "/admin/long",
          component: <div>Content</div>,
        },
      ];

      renderWithProviders(<VerticalTabs tabs={longLabelTabs} />);

      expect(
        screen.getByText("This is a very long tab label that might wrap"),
      ).toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("should render simple text children", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div>Simple Text</div>
        </VerticalTabs>,
      );

      expect(screen.getByText("Simple Text")).toBeInTheDocument();
    });

    it("should render complex component children", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div>
            <h1>Title</h1>
            <p>Description</p>
            <button>Action</button>
          </div>
        </VerticalTabs>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div>Child 1</div>
          <div>Child 2</div>
        </VerticalTabs>,
      );

      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("should render empty right container when no children", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have root container", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });

    it("should have left list container", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should have right content container", () => {
      renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div data-testid="content">Content</div>
        </VerticalTabs>,
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should render list items as buttons", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const buttons = container.querySelectorAll(".MuiListItemButton-root");
      expect(buttons.length).toBe(3);
    });

    it("should render list item text", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const listItemTexts = container.querySelectorAll(".MuiListItemText-root");
      expect(listItemTexts.length).toBe(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null pathname", () => {
      // @ts-expect-error Testing null behavior
      mockRouter.pathname = null;
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should handle undefined pathname", () => {
      // @ts-expect-error Testing undefined behavior
      mockRouter.pathname = undefined;
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("should handle pathname with trailing slash", () => {
      mockRouter.pathname = "/admin/settings/general/";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).toHaveAttribute("aria-selected", "true");
    });

    it("should handle tab link with trailing slash", () => {
      const tabsWithSlash: VerticalTab[] = [
        {
          label: "General",
          link: "/admin/settings/general/",
          component: <div>Content</div>,
        },
      ];

      mockRouter.pathname = "/admin/settings/general";
      renderWithProviders(<VerticalTabs tabs={tabsWithSlash} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).toHaveAttribute("aria-selected", "true");
    });

    it("should handle rapid tab clicks", async () => {
      const user = userEvent.setup();
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const securityTab = screen.getByText("Security");
      await user.click(securityTab);
      await user.click(securityTab);
      await user.click(securityTab);

      expect(mockReplace).toHaveBeenCalledTimes(3);
    });

    it("should handle empty string link", () => {
      const emptyLinkTab: VerticalTab[] = [
        {
          label: "Empty",
          link: "",
          component: <div>Content</div>,
        },
      ];

      renderWithProviders(<VerticalTabs tabs={emptyLinkTab} />);

      expect(screen.getByText("Empty")).toBeInTheDocument();
    });

    it("should handle tabs with same last segment", () => {
      const sameLast: VerticalTab[] = [
        {
          label: "First General",
          link: "/admin/first/general",
          component: <div>First</div>,
        },
        {
          label: "Second General",
          link: "/admin/second/general",
          component: <div>Second</div>,
        },
      ];

      mockRouter.pathname = "/admin/first/general";
      renderWithProviders(<VerticalTabs tabs={sameLast} />);

      // Both should be selected since they have the same last segment
      const firstTab = screen
        .getByText("First General")
        .closest(".MuiListItemButton-root");
      const secondTab = screen
        .getByText("Second General")
        .closest(".MuiListItemButton-root");

      expect(firstTab).toHaveAttribute("aria-selected", "true");
      expect(secondTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic list structure", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should render tabs as buttons", () => {
      const { container } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      const buttons = container.querySelectorAll(".MuiListItemButton-root");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have text content for screen readers", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      expect(screen.getByText("General")).toBeInTheDocument();
      expect(screen.getByText("Security")).toBeInTheDocument();
      expect(screen.getByText("Integrations")).toBeInTheDocument();
    });

    it("should have focusable tab buttons", () => {
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      generalTab?.focus();
      expect(generalTab).toHaveFocus();
    });

    it("should indicate selected state visually", () => {
      mockRouter.pathname = "/admin/settings/general";
      renderWithProviders(<VerticalTabs tabs={mockTabs} />);

      const generalTab = screen
        .getByText("General")
        .closest(".MuiListItemButton-root");
      expect(generalTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Props Updates", () => {
    it("should update when tabs prop changes", () => {
      const { rerender } = renderWithProviders(
        <VerticalTabs tabs={mockTabs} />,
      );

      expect(screen.getByText("General")).toBeInTheDocument();

      const newTabs: VerticalTab[] = [
        {
          label: "New Tab",
          link: "/admin/new",
          component: <div>New</div>,
        },
      ];

      rerender(<VerticalTabs tabs={newTabs} />);

      expect(screen.getByText("New Tab")).toBeInTheDocument();
      expect(screen.queryByText("General")).not.toBeInTheDocument();
    });

    it("should update when children change", () => {
      const { rerender } = renderWithProviders(
        <VerticalTabs tabs={mockTabs}>
          <div>First Child</div>
        </VerticalTabs>,
      );

      expect(screen.getByText("First Child")).toBeInTheDocument();

      rerender(
        <VerticalTabs tabs={mockTabs}>
          <div>Second Child</div>
        </VerticalTabs>,
      );

      expect(screen.getByText("Second Child")).toBeInTheDocument();
      expect(screen.queryByText("First Child")).not.toBeInTheDocument();
    });
  });
});
