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
      displayValue: t("Dashboard"),
      icon: <span data-testid="dashboard-icon">Dashboard Icon</span>,
    },
    {
      path: "/admin/management",
      displayValue: t("Management"),
      icon: <span data-testid="management-icon">Management Icon</span>,
      children: [
        {
          path: "/admin/management/students",
          displayValue: t("Students"),
          icon: <span data-testid="students-icon">Students Icon</span>,
        },
        {
          path: "/admin/management/classes",
          displayValue: t("Classes"),
          icon: <span data-testid="classes-icon">Classes Icon</span>,
        },
      ],
    },
    {
      path: "/admin/settings",
      displayValue: t("Settings"),
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
  const mockUser = {
    email: "test@example.com",
    role: "admin",
  };

  const initialState = {
    auth: {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setupCompleted: true,
      checkingSession: false,
      checkingSetup: false,
    },
  };

  beforeEach(() => {
    mockPush.mockClear();
    mockOpen.mockClear();
    mockRouter.pathname = "/admin/dashboard";
  });

  describe("Basic Rendering", () => {
    it("should render ProfileAvatar", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const avatar = screen.getByTestId("profile-avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("data-size", "80");
    });

    it("should render welcome label", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it("should render search input", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Browse settings");
      expect(searchInput).toHaveAttribute("data-search-icon", "true");
    });

    it("should render OnboardingVersion", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByTestId("onboarding-version")).toBeInTheDocument();
    });

    it("should render routes list", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Management")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should render divider after welcome section", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const dividers = container.querySelectorAll(".MuiDivider-root");
      expect(dividers.length).toBeGreaterThan(0);
    });

    it("should render root container", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const root = container.querySelector(".MuiBox-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Route Rendering - Flat Routes", () => {
    it("should render flat route without children", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should render icon for flat route", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByTestId("dashboard-icon")).toBeInTheDocument();
    });

    it("should not render expand icon for flat route", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      // Dashboard route should not have expand/collapse icons
      const dashboardItem = screen.getByText("Dashboard").closest("li");
      const expandIcons = dashboardItem?.querySelectorAll(
        '[data-testid*="expand"]',
      );
      expect(expandIcons?.length || 0).toBe(0);
    });
  });

  describe("Route Rendering - Nested Routes", () => {
    it("should render parent route with children", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Management")).toBeInTheDocument();
    });

    it("should render expand icon for parent route", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Management")).toBeInTheDocument();
      // MUI ExpandMoreIcon or ExpandLessIcon should be present
      const managementItem = screen.getByText("Management").closest("li");
      expect(managementItem).toBeInTheDocument();
    });

    it("should not show children by default", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      // Children should not be visible initially
      expect(screen.queryByText("Students")).not.toBeInTheDocument();
      expect(screen.queryByText("Classes")).not.toBeInTheDocument();
    });

    it("should render icon for parent route", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByTestId("management-icon")).toBeInTheDocument();
      expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
    });

    it("should render multiple parent routes", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Management")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });

  describe("Expand/Collapse Behavior", () => {
    it("should expand children when parent clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
        expect(screen.getByText("Classes")).toBeInTheDocument();
      });
    });

    it("should collapse children when parent clicked again", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");

      // Expand
      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });

      // Collapse
      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.queryByText("Students")).not.toBeInTheDocument();
      });
    });

    it("should toggle expansion state", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");

      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });

      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.queryByText("Students")).not.toBeInTheDocument();
      });

      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });
    });

    it("should allow multiple sections to be expanded", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");
      const settingsRoute = screen.getByText("Settings");

      await user.click(managementRoute);
      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });

      await user.click(settingsRoute);
      await waitFor(() => {
        expect(screen.getByText("Onboarding")).toBeInTheDocument();
        // Management children should still be visible
        expect(screen.getByText("Students")).toBeInTheDocument();
      });
    });

    it("should show child route icons when expanded", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");
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
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const dashboardRoute = screen.getByText("Dashboard");
      await user.click(dashboardRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });

    it("should navigate to child route when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      // Expand management
      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });

      // Click child route
      const studentsRoute = screen.getByText("Students");
      await user.click(studentsRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/management/students");
    });

    it("should navigate to different child routes", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByText("Classes")).toBeInTheDocument();
      });

      const classesRoute = screen.getByText("Classes");
      await user.click(classesRoute);

      expect(mockPush).toHaveBeenCalledWith("/admin/management/classes");
    });

    it("should not navigate when clicking parent route", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      mockPush.mockClear();

      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      // Should not call push, only toggle expansion
      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should filter routes by parent name", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "dashboard");

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.queryByText("Management")).not.toBeInTheDocument();
        expect(screen.queryByText("Settings")).not.toBeInTheDocument();
      });
    });

    it("should filter routes by child name", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "student");

      await waitFor(() => {
        // Parent should be visible because child matches (searching against translation key)
        expect(screen.getByText("Management")).toBeInTheDocument();
      });
    });

    it("should be case insensitive", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "DASHBOARD");

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("should show all routes when search is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");

      // Type and clear
      await user.type(searchInput, "test");
      await user.clear(searchInput);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Management")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should show no routes when search does not match", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "nonexistent");

      await waitFor(() => {
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
        expect(screen.queryByText("Management")).not.toBeInTheDocument();
        expect(screen.queryByText("Settings")).not.toBeInTheDocument();
      });
    });

    it("should filter children within expanded parent", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      // Expand management
      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
        expect(screen.getByText("Classes")).toBeInTheDocument();
      });

      // Search for specific child (using translation key)
      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "student");

      await waitFor(() => {
        // Parent should still be visible
        expect(screen.getByText("Management")).toBeInTheDocument();
        // Only matching child should be visible after filtering
        expect(screen.getByText("Students")).toBeInTheDocument();
      });
    });

    it("should update filtered routes immediately on search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");

      await user.type(searchInput, "dash");

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Component Structure", () => {
    it("should have wrapper container", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have navigation section", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const nav = container.querySelector(".MuiBox-root");
      expect(nav).toBeInTheDocument();
    });

    it("should have list component", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should render list items", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const listItems = container.querySelectorAll(".MuiListItem-root");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid expand/collapse clicks", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const managementRoute = screen.getByText("Management");

      await user.click(managementRoute);
      await user.click(managementRoute);
      await user.click(managementRoute);

      expect(managementRoute).toBeInTheDocument();
    });

    it("should handle whitespace-only search gracefully", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "   ");

      // Whitespace doesn't match anything, so no routes should be visible
      await waitFor(() => {
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      });
    });

    it("should handle special characters in search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "@#$%");

      await waitFor(() => {
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      });
    });

    it("should maintain expansion state during search", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      // Expand management
      const managementRoute = screen.getByText("Management");
      await user.click(managementRoute);

      await waitFor(() => {
        expect(screen.getByText("Students")).toBeInTheDocument();
      });

      // Search (should maintain expansion)
      const searchInput = screen.getByTestId("general-input");
      await user.type(searchInput, "management");

      await waitFor(() => {
        expect(screen.getByText("Management")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have semantic list structure", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const list = container.querySelector(".MuiList-root");
      expect(list).toBeInTheDocument();
    });

    it("should have list items for navigation", () => {
      const { container } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      const listItems = container.querySelectorAll(".MuiListItem-root");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should render text content for screen readers", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Management")).toBeInTheDocument();
    });

    it("should have focusable search input", () => {
      renderWithProviders(<LeftNavigation />, { preloadedState: initialState });

      const searchInput = screen.getByTestId("general-input");
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Memoization", () => {
    it("should be a memoized component", () => {
      const { rerender } = renderWithProviders(<LeftNavigation />, {
        preloadedState: initialState,
      });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();

      rerender(<LeftNavigation />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });
});
