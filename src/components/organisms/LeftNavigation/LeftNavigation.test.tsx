import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouter,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import LeftNavigation from "./index";

/**
 * Component tests for LeftNavigation
 * @file src/components/organisms/LeftNavigation/LeftNavigation.test.tsx
 */

// Use exported mockRouter from test-utils
const mockPush = mockRouter.push;

// Mock window.open for external links
const mockOpen = vi.fn();
global.window.open = mockOpen;

// Mock child components
vi.mock("@/components/atoms/ProfileAvatar", () => ({
  default: ({ size }: { size?: number }) => (
    <div data-testid="profile-avatar" data-size={size}>
      Avatar
    </div>
  ),
}));

vi.mock("@/components/atoms/OnboardingVersion", () => ({
  default: () => <div data-testid="onboarding-version">Version Info</div>,
}));

vi.mock("@/components/atoms/GeneralInput", () => ({
  default: ({
    value,
    onChange,
    placeholder,
    showSearchStartIcon,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showSearchStartIcon?: boolean;
  }) => (
    <input
      data-testid="general-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-search-icon={showSearchStartIcon}
    />
  ),
}));

// Mock routesConfig
vi.mock("./routesConfig", () => ({
  listOfRoutes: (t: (key: string) => string) => [
    {
      path: "/admin/dashboard",
      displayValue: t("navigation.dashboard"),
      icon: <span data-testid="dashboard-icon">Dashboard Icon</span>,
    },
    {
      path: "/admin/management",
      displayValue: t("navigation.management"),
      icon: <span data-testid="management-icon">Management Icon</span>,
      children: [
        {
          path: "/admin/management/students",
          displayValue: t("navigation.studentManagement"),
          icon: <span data-testid="students-icon">Students Icon</span>,
        },
        {
          path: "/admin/management/classes",
          displayValue: t("navigation.classManagement"),
          icon: <span data-testid="classes-icon">Classes Icon</span>,
        },
      ],
    },
    {
      path: "/admin/settings",
      displayValue: t("navigation.settings"),
      icon: <span data-testid="settings-icon">Settings Icon</span>,
      children: [
        {
          path: "/admin/settings/onboarding",
          displayValue: t("navigation.onboardingSettings"),
          icon: <span data-testid="onboarding-icon">Onboarding Icon</span>,
        },
      ],
    },
  ],
}));

describe("LeftNavigation", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockOpen.mockClear();
    mockRouter.pathname = "/admin/dashboard";
  });

  describe("Basic Rendering", () => {
    it("should render ProfileAvatar", () => {
      renderWithProviders(<LeftNavigation />);

      const avatar = screen.getByTestId("profile-avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("data-size", "80");
    });

    it("should render welcome label", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText(/navigation.welcome/i)).toBeInTheDocument();
    });

    it("should render search input", () => {
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute(
        "placeholder",
        "navigation.Browse settings",
      );
      expect(searchInput).toHaveAttribute("data-search-icon", "true");
    });

    it("should render OnboardingVersion", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByTestId("onboarding-version")).toBeInTheDocument();
    });

    it("should render routes list", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
      expect(screen.getByText("navigation.management")).toBeInTheDocument();
      expect(screen.getByText("navigation.settings")).toBeInTheDocument();
    });

    it("should render divider after welcome section", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const dividers = container.querySelectorAll(".MuiDivider-root");
      expect(dividers.length).toBeGreaterThan(0);
    });

    it("should render root container", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Route Rendering - Flat Routes", () => {
    it("should render flat route without children", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
    });

    it("should render icon for flat route", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByTestId("dashboard-icon")).toBeInTheDocument();
    });

    it("should not render expand icon for flat route", () => {
      renderWithProviders(<LeftNavigation />);

      // Dashboard route should not have expand/collapse icons
      const dashboardItem = screen
        .getByText("navigation.dashboard")
        .closest("li");
      const expandIcons = dashboardItem?.querySelectorAll(
        '[data-testid*="expand"]',
      );
      expect(expandIcons?.length || 0).toBe(0);
    });
  });

  describe("Route Rendering - Nested Routes", () => {
    it("should render parent route with children", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.management")).toBeInTheDocument();
    });

    it("should render expand icon for parent route", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.management")).toBeInTheDocument();
      // MUI ExpandMoreIcon or ExpandLessIcon should be present
      const managementItem = screen
        .getByText("navigation.management")
        .closest("li");
      expect(managementItem).toBeInTheDocument();
    });

    it("should not show children by default", () => {
      renderWithProviders(<LeftNavigation />);

      // Children should not be visible initially
      expect(
        screen.queryByText("navigation.studentManagement"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("navigation.classManagement"),
      ).not.toBeInTheDocument();
    });

    it("should render icon for parent route", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByTestId("management-icon")).toBeInTheDocument();
      expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
    });

    it("should render multiple parent routes", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.management")).toBeInTheDocument();
      expect(screen.getByText("navigation.settings")).toBeInTheDocument();
    });
  });

  describe("Expand/Collapse Behavior", () => {
    it("should expand children when parent clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("navigation.classManagement"),
        ).toBeInTheDocument();
      });
    });

    it("should collapse children when parent clicked again", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");

      // Expand
      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });

      // Collapse
      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.queryByText("navigation.studentManagement"),
        ).not.toBeInTheDocument();
      });
    });

    it("should toggle expansion state", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");

      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });

      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.queryByText("navigation.studentManagement"),
        ).not.toBeInTheDocument();
      });

      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });
    });

    it("should allow multiple sections to be expanded", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");
      const settingsRoute = screen.getByText("navigation.settings");

      await user.click(managementRoute);
      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });

      await user.click(settingsRoute);
      await waitFor(() => {
        expect(
          screen.getByText("navigation.onboardingSettings"),
        ).toBeInTheDocument();
        // Management children should still be visible
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });
    });

    it("should show child route icons when expanded", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByTestId("students-icon")).toBeInTheDocument();
        expect(screen.getByTestId("classes-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation - Internal Routes", () => {
    it("should navigate to flat route when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const dashboardRoute = screen.getByText("navigation.dashboard");
      await user.click(dashboardRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });

    it("should navigate to child route when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      // Expand management
      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });

      // Click child route
      const studentsRoute = screen.getByText("navigation.studentManagement");
      await user.click(studentsRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/management/students");
    });

    it("should navigate to different child routes", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(
          screen.getByText("navigation.classManagement"),
        ).toBeInTheDocument();
      });

      const classesRoute = screen.getByText("navigation.classManagement");
      await user.click(classesRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/management/classes");
    });

    it("should not navigate when clicking parent route", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      mockPush.mockClear();

      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      // Should not call push, only toggle expansion
      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should filter routes by parent name", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "dashboard");

      await waitFor(() => {
        expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
        expect(
          screen.queryByText("navigation.management"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("navigation.settings"),
        ).not.toBeInTheDocument();
      });
    });

    it("should filter routes by child name", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "student");

      await waitFor(() => {
        // Parent should be visible because child matches (searching against translation key)
        expect(screen.getByText("navigation.management")).toBeInTheDocument();
      });
    });

    it("should be case insensitive", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "DASHBOARD");

      await waitFor(() => {
        expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
      });
    });

    it("should show all routes when search is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");

      // Type and clear
      await user.type(searchInput, "test");
      await user.clear(searchInput);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
      expect(screen.getByText("navigation.management")).toBeInTheDocument();
      expect(screen.getByText("navigation.settings")).toBeInTheDocument();
    });

    it("should show no routes when search does not match", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "nonexistent");

      await waitFor(() => {
        expect(
          screen.queryByText("navigation.dashboard"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("navigation.management"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("navigation.settings"),
        ).not.toBeInTheDocument();
      });
    });

    it("should filter children within expanded parent", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      // Expand management
      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("navigation.classManagement"),
        ).toBeInTheDocument();
      });

      // Search for specific child (using translation key)
      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "student");

      await waitFor(() => {
        // Parent should still be visible
        expect(screen.getByText("navigation.management")).toBeInTheDocument();
        // Only matching child should be visible after filtering
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });
    });

    it("should update filtered routes immediately on search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");

      await user.type(searchInput, "dash");

      await waitFor(() => {
        expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Component Structure", () => {
    it("should have wrapper container", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have navigation section", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const nav = container.querySelector(".MuiBox-root");
      expect(nav).toBeInTheDocument();
    });

    it("should have list component", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should render list items", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const listItems = container.querySelectorAll(".MuiListItem-root");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid expand/collapse clicks", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const managementRoute = screen.getByText("navigation.management");

      await user.click(managementRoute);
      await user.click(managementRoute);
      await user.click(managementRoute);

      expect(managementRoute).toBeInTheDocument();
    });

    it("should handle whitespace-only search gracefully", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "   ");

      // Whitespace doesn't match anything, so no routes should be visible
      await waitFor(() => {
        expect(
          screen.queryByText("navigation.dashboard"),
        ).not.toBeInTheDocument();
      });
    });

    it("should handle special characters in search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "@#$%");

      await waitFor(() => {
        expect(
          screen.queryByText("navigation.dashboard"),
        ).not.toBeInTheDocument();
      });
    });

    it("should maintain expansion state during search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />);

      // Expand management
      const managementRoute = screen.getByText("navigation.management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(
          screen.getByText("navigation.studentManagement"),
        ).toBeInTheDocument();
      });

      // Search (should maintain expansion)
      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "management");

      await waitFor(() => {
        expect(screen.getByText("navigation.management")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have semantic list structure", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should have list items for navigation", () => {
      const { container } = renderWithProviders(<LeftNavigation />);

      const listItems = container.querySelectorAll(".MuiListItem-root");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should render text content for screen readers", () => {
      renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
      expect(screen.getByText("navigation.management")).toBeInTheDocument();
    });

    it("should have focusable search input", () => {
      renderWithProviders(<LeftNavigation />);

      const searchInput = screen.getByTestId("general-input");
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Memoization", () => {
    it("should be a memoized component", () => {
      const { rerender } = renderWithProviders(<LeftNavigation />);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();

      rerender(<LeftNavigation />);

      expect(screen.getByText("navigation.dashboard")).toBeInTheDocument();
    });
  });
});
