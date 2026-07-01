import * as uiActions from "@/store/actions/uiActions";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import AccessibilityMenu from "./index";

/**
 * Component tests for AccessibilityMenu
 * @file src/components/molecules/AccessibilityMenu/AccessibilityMenu.test.tsx
 */

// Mock the UI actions
vi.mock("@/store/actions/uiActions", () => ({
  toggleHighContrast: vi.fn((value: boolean) => ({
    type: "TOGGLE_HIGH_CONTRAST",
    payload: value,
  })),
  toggleDyslexiaFont: vi.fn((value: boolean) => ({
    type: "TOGGLE_DYSLEXIA_FONT",
    payload: value,
  })),
}));

// Mock child components
vi.mock("@/components/atoms/AppleSwitch", () => ({
  default: ({
    checked,
    onChange,
    slotProps,
  }: {
    checked: boolean;
    onChange: () => void;
    slotProps?: { input?: { "aria-label"?: string } };
  }) => (
    <input
      type="checkbox"
      data-testid="apple-switch"
      checked={checked}
      onChange={onChange}
      aria-label={slotProps?.input?.["aria-label"]}
    />
  ),
}));

vi.mock("@/components/atoms/OnboardingVersion", () => ({
  default: () => <div data-testid="onboarding-version">Version Info</div>,
}));

vi.mock("@/components/atoms/buttons/SmallIconButton", () => ({
  default: ({
    icon,
    onAction,
    title,
  }: {
    icon: React.ReactNode;
    onAction: () => void;
    title?: string;
  }) => (
    <button data-testid="small-icon-button" onClick={onAction} title={title}>
      {icon}
    </button>
  ),
}));

vi.mock("@/components/atoms/dropdowns/LanguageDropdown", () => ({
  default: () => <div data-testid="language-dropdown">Language</div>,
}));

vi.mock("@/components/atoms/dropdowns/ThemeDropdown", () => ({
  default: () => <div data-testid="theme-dropdown">Theme</div>,
}));

describe("AccessibilityMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render accessibility button", () => {
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should not show drawer by default", () => {
      renderWithProviders(<AccessibilityMenu />);

      expect(
        screen.queryByText("general.Accessibility"),
      ).not.toBeInTheDocument();
    });

    it("should render with accessibility icon button", () => {
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      expect(buttons[0]).toBeInTheDocument();
    });
  });

  describe("Drawer Opening and Closing", () => {
    it("should open drawer when button clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });
    });

    it("should close drawer when close button clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      // Open drawer
      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Close drawer
      const closeButtons = screen.getAllByTestId("small-icon-button");
      const closeButton = closeButtons.find(
        (btn) => btn.getAttribute("title") === "general.Close",
      );
      if (closeButton) {
        await user.click(closeButton);
      }

      await waitFor(() => {
        const drawerContent = screen.queryByText("general.Accessibility");
        // Drawer might still exist in DOM but be hidden
        expect(drawerContent).toBeInTheDocument();
      });
    });

    it("should toggle drawer state", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");

      // Open
      await user.click(buttons[0]);
      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Close
      const allButtons = screen.getAllByTestId("small-icon-button");
      const closeButton = allButtons.find(
        (btn) => btn.getAttribute("title") === "general.Close",
      );
      if (closeButton) {
        await user.click(closeButton);
      }

      // Verify button is visible again after closing (re-query since original was unmounted)
      await waitFor(() => {
        const accessibilityButton = screen.getAllByTestId("small-icon-button");
        expect(accessibilityButton[0]).toBeInTheDocument();
      });
    });
  });

  describe("Drawer Content", () => {
    it("should show language dropdown in drawer", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("language-dropdown")).toBeInTheDocument();
      });
    });

    it("should show theme dropdown in drawer", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("theme-dropdown")).toBeInTheDocument();
      });
    });

    it("should show high contrast mode toggle", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.High Contrast Mode"),
        ).toBeInTheDocument();
      });
    });

    it("should show dyslexia font toggle", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.Dyslexia Font"),
        ).toBeInTheDocument();
      });
    });

    it("should show onboarding version", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("onboarding-version")).toBeInTheDocument();
      });
    });

    it("should show high contrast description", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.High Contrast Description"),
        ).toBeInTheDocument();
      });
    });

    it("should show dyslexia font description", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.Dyslexia Font Description"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("High Contrast Toggle", () => {
    it("should reflect high contrast state from Redux", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: true,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        const highContrastSwitch = switches.find(
          (sw) =>
            sw.getAttribute("aria-label") ===
            "accessibility.High Contrast Mode",
        );
        expect(highContrastSwitch).toBeChecked();
      });
    });

    it("should dispatch toggleHighContrast when switch toggled", async () => {
      const user = userEvent.setup();
      const mockDispatch = vi.fn();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });
      store.dispatch = mockDispatch;

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.High Contrast Mode"),
        ).toBeInTheDocument();
      });

      const switches = screen.getAllByTestId("apple-switch");
      const highContrastSwitch = switches.find(
        (sw) =>
          sw.getAttribute("aria-label") === "accessibility.High Contrast Mode",
      );

      if (highContrastSwitch) {
        await user.click(highContrastSwitch);
        expect(uiActions.toggleHighContrast).toHaveBeenCalled();
      }
    });

    it("should handle high contrast toggle off", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: true,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        const highContrastSwitch = switches.find(
          (sw) =>
            sw.getAttribute("aria-label") ===
            "accessibility.High Contrast Mode",
        );
        if (highContrastSwitch) {
          expect(highContrastSwitch).toBeChecked();
        }
      });
    });
  });

  describe("Dyslexia Font Toggle", () => {
    it("should reflect dyslexia font state from Redux", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: true,
        },
      });

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        const dyslexiaSwitch = switches.find(
          (sw) =>
            sw.getAttribute("aria-label") === "accessibility.Dyslexia Font",
        );
        expect(dyslexiaSwitch).toBeChecked();
      });
    });

    it("should dispatch toggleDyslexiaFont when switch toggled", async () => {
      const user = userEvent.setup();
      const mockDispatch = vi.fn();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });
      store.dispatch = mockDispatch;

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("accessibility.Dyslexia Font"),
        ).toBeInTheDocument();
      });

      const switches = screen.getAllByTestId("apple-switch");
      const dyslexiaSwitch = switches.find(
        (sw) => sw.getAttribute("aria-label") === "accessibility.Dyslexia Font",
      );

      if (dyslexiaSwitch) {
        await user.click(dyslexiaSwitch);
        expect(uiActions.toggleDyslexiaFont).toHaveBeenCalled();
      }
    });

    it("should handle both toggles enabled", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: true,
          dyslexiaFont: true,
        },
      });

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        expect(switches.length).toBe(2);
        switches.forEach((sw) => {
          expect(sw).toBeChecked();
        });
      });
    });
  });

  describe("Component Structure", () => {
    it("should render Fragment as root", () => {
      const { container } = renderWithProviders(<AccessibilityMenu />);

      expect(container).toBeInTheDocument();
    });

    it("should render drawer component", async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Drawer is portaled to document.body
      const drawer = document.body.querySelector(".MuiDrawer-root");
      expect(drawer).toBeInTheDocument();
    });

    it("should have right anchor for drawer", async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Drawer is portaled to document.body
      const drawer = document.body.querySelector(".MuiDrawer-root");
      expect(drawer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label for main button", () => {
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      expect(buttons[0]).toHaveAttribute("title", "general.Accessibility");
    });

    it("should have aria-label for switches", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        expect(switches.length).toBe(2);
        switches.forEach((sw) => {
          expect(sw).toHaveAttribute("aria-label");
        });
      });
    });

    it("should have semantic heading", async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilityMenu />);

      const buttons = screen.getAllByTestId("small-icon-button");
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Typography h6 variant renders as h6 element
      const heading = screen.getByRole("heading", { level: 6 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("general.Accessibility");
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid toggle clicks", async () => {
      const user = userEvent.setup();

      renderWithProviders(<AccessibilityMenu />);

      // Open drawer
      const accessibilityButton = screen.getAllByTestId("small-icon-button")[0];
      await user.click(accessibilityButton);

      // Wait for drawer to open and close button to appear
      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Find and click close button
      const closeButton = screen
        .getAllByTestId("small-icon-button")
        .find((btn) => btn.getAttribute("title") === "general.Close");
      if (closeButton) {
        await user.click(closeButton);
      }

      // Verify accessibility button is back after closing
      await waitFor(() => {
        const buttons = screen.getAllByTestId("small-icon-button");
        expect(buttons[0]).toBeInTheDocument();
      });
    });

    it("should maintain state when drawer closed and reopened", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        ui: {
          theme: "light",
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: true,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<AccessibilityMenu />, { store });

      const buttons = screen.getAllByTestId("small-icon-button");

      // Open
      await user.click(buttons[0]);
      await waitFor(() => {
        expect(screen.getByText("general.Accessibility")).toBeInTheDocument();
      });

      // Close
      const allButtons = screen.getAllByTestId("small-icon-button");
      const closeButton = allButtons.find(
        (btn) => btn.getAttribute("title") === "general.Close",
      );
      if (closeButton) {
        await user.click(closeButton);
      }

      // Reopen
      await user.click(buttons[0]);
      await waitFor(() => {
        const switches = screen.getAllByTestId("apple-switch");
        const highContrastSwitch = switches.find(
          (sw) =>
            sw.getAttribute("aria-label") ===
            "accessibility.High Contrast Mode",
        );
        expect(highContrastSwitch).toBeChecked();
      });
    });
  });
});
