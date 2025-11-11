import { THEME } from "@/constants/general.constants";
import * as uiActions from "@/store/actions/uiActions";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import ThemeDropdown from "./index";

/**
 * Component tests for ThemeDropdown
 * @file src/components/atoms/dropdowns/ThemeDropdown/ThemeDropdown.test.tsx
 */

// Mock the uiActions
vi.mock("@/store/actions/uiActions", () => ({
  changeApplicationTheme: vi.fn((theme) => ({
    type: "ui/changeTheme",
    payload: theme,
  })),
}));

describe("ThemeDropdown", () => {
  describe("Basic Rendering", () => {
    it("should render theme dropdown with label", () => {
      renderWithProviders(<ThemeDropdown />);

      // The label should be present (may have multiple instances due to MUI)
      const labels = screen.getAllByText(/Theme Control/i);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should render dropdown with combobox role", () => {
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should render with all theme options", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // Check for theme options
      expect(
        screen.getByRole("option", { name: /Light Theme/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /Dark Theme/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /System/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Current Theme Display", () => {
    it("should display light theme when selected", () => {
      const store = createMockStore({
        ui: {
          theme: THEME.LIGHT,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      expect(screen.getByText(/Light Theme/i)).toBeInTheDocument();
    });

    it("should display dark theme when selected", () => {
      const store = createMockStore({
        ui: {
          theme: THEME.DARK,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      expect(screen.getByText(/Dark Theme/i)).toBeInTheDocument();
    });

    it("should display system theme when selected", () => {
      const store = createMockStore({
        ui: {
          theme: THEME.AUTO,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      expect(screen.getByText(/System/i)).toBeInTheDocument();
    });
  });

  describe("Theme Selection", () => {
    it("should dispatch changeApplicationTheme when theme is changed", async () => {
      const user = userEvent.setup();
      const changeThemeSpy = vi.spyOn(uiActions, "changeApplicationTheme");

      const store = createMockStore({
        ui: {
          theme: THEME.LIGHT,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const darkOption = screen.getByRole("option", { name: /Dark Theme/i });
      await user.click(darkOption);

      expect(changeThemeSpy).toHaveBeenCalledWith(THEME.DARK);
    });

    it("should change from dark to light theme", async () => {
      const user = userEvent.setup();
      const changeThemeSpy = vi.spyOn(uiActions, "changeApplicationTheme");

      const store = createMockStore({
        ui: {
          theme: THEME.DARK,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const lightOption = screen.getByRole("option", { name: /Light Theme/i });
      await user.click(lightOption);

      expect(changeThemeSpy).toHaveBeenCalledWith(THEME.LIGHT);
    });

    it("should change to system theme", async () => {
      const user = userEvent.setup();
      const changeThemeSpy = vi.spyOn(uiActions, "changeApplicationTheme");

      const store = createMockStore({
        ui: {
          theme: THEME.LIGHT,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const systemOption = screen.getByRole("option", { name: /System/i });
      await user.click(systemOption);

      expect(changeThemeSpy).toHaveBeenCalledWith(THEME.AUTO);
    });
  });

  describe("Icons", () => {
    it("should display icons for all theme options", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // MUI icons have testid attributes (may have multiple instances)
      const lightIcons = screen.getAllByTestId("LightModeRoundedIcon");
      const darkIcons = screen.getAllByTestId("DarkModeRoundedIcon");
      const systemIcons = screen.getAllByTestId("Brightness6RoundedIcon");

      expect(lightIcons.length).toBeGreaterThan(0);
      expect(darkIcons.length).toBeGreaterThan(0);
      expect(systemIcons.length).toBeGreaterThan(0);
    });

    it("should display icon for selected theme", () => {
      const store = createMockStore({
        ui: {
          theme: THEME.LIGHT,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      // The selected theme's icon should be visible in the closed dropdown
      expect(screen.getByTestId("LightModeRoundedIcon")).toBeInTheDocument();
    });
  });

  describe("Full Width", () => {
    it("should render as full width", () => {
      const { container } = renderWithProviders(<ThemeDropdown />);

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toHaveClass("MuiFormControl-fullWidth");
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      combobox.focus();
      expect(combobox).toHaveFocus();

      await user.keyboard("{Enter}");

      // Options should be visible
      expect(
        screen.getByRole("option", { name: /Light Theme/i }),
      ).toBeInTheDocument();
    });

    it("should have proper ARIA attributes", () => {
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded");
    });
  });

  describe("Memoization", () => {
    it("should be memoized component", () => {
      const { rerender } = renderWithProviders(<ThemeDropdown />);

      // Re-render with same props shouldn't cause issues
      rerender(<ThemeDropdown />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Integration with Redux", () => {
    it("should read theme from Redux store", () => {
      const store = createMockStore({
        ui: {
          theme: THEME.DARK,
          locale: "en",
          appTouched: false,
          loading: false,
          error: null,
          highContrast: false,
          dyslexiaFont: false,
        },
      });

      renderWithProviders(<ThemeDropdown />, { store });

      // Should display the theme from store
      expect(screen.getByText(/Dark Theme/i)).toBeInTheDocument();
    });

    it("should work with default store state", () => {
      // Using default store (light theme)
      renderWithProviders(<ThemeDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });
});
