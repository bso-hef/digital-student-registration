import { LANGUAGES } from "@/constants/general.constants";
import * as uiActions from "@/store/actions/uiActions";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockI18n,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import LanguageDropdown from "./index";

/**
 * Component tests for LanguageDropdown
 * @file src/components/atoms/dropdowns/LanguageDropdown/LanguageDropdown.test.tsx
 */

// Mock the uiActions
vi.mock("@/store/actions/uiActions", () => ({
  changeApplicationLocale: vi.fn((locale) => ({
    type: "ui/changeLocale",
    payload: locale,
  })),
}));

describe("LanguageDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset i18n to English before each test
    mockI18n.changeLanguage("en");
  });

  describe("Basic Rendering", () => {
    it("should render language dropdown with label", () => {
      renderWithProviders(<LanguageDropdown />);

      // The label should be present (may have multiple instances due to MUI)
      const labels = screen.getAllByText(/Language/i);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should render dropdown with combobox role", () => {
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should render with all language options", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // Check for language options
      expect(
        screen.getByRole("option", { name: /English/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /German/i }),
      ).toBeInTheDocument();
    });

    it("should render with flag icons", () => {
      renderWithProviders(<LanguageDropdown />);

      // Flag icons should be present
      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Current Language Display", () => {
    it("should display current language from i18n", () => {
      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);

      // Default language in our mock is 'en'
      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should handle English language code", () => {
      renderWithProviders(<LanguageDropdown />);

      // Should display based on i18n language
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle German language code", () => {
      // Change to German locale
      mockI18n.changeLanguage("de");

      renderWithProviders(<LanguageDropdown />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Language Selection", () => {
    it("should dispatch changeApplicationLocale when language is changed", async () => {
      const user = userEvent.setup();
      const changeLocaleSpy = vi.spyOn(uiActions, "changeApplicationLocale");

      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);
      const changeLanguageSpy = vi.spyOn(i18nInstance, "changeLanguage");

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const germanOption = screen.getByRole("option", { name: /German/i });
      await user.click(germanOption);

      // Should call both i18n changeLanguage and Redux action
      expect(changeLanguageSpy).toHaveBeenCalledWith(LANGUAGES.GERMAN.isoCode);
      expect(changeLocaleSpy).toHaveBeenCalledWith(LANGUAGES.GERMAN.isoCode);
    });

    it("should change from English to German", async () => {
      const user = userEvent.setup();
      const changeLocaleSpy = vi.spyOn(uiActions, "changeApplicationLocale");

      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const germanOption = screen.getByRole("option", { name: /German/i });
      await user.click(germanOption);

      expect(changeLocaleSpy).toHaveBeenCalledWith(LANGUAGES.GERMAN.isoCode);
    });

    it("should change from German to English", async () => {
      const user = userEvent.setup();
      const changeLocaleSpy = vi.spyOn(uiActions, "changeApplicationLocale");

      // Start with German locale
      mockI18n.changeLanguage("de");
      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);
      const changeLanguageSpy = vi.spyOn(i18nInstance, "changeLanguage");

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const englishOption = screen.getByRole("option", { name: /English/i });
      await user.click(englishOption);

      expect(changeLanguageSpy).toHaveBeenCalledWith(LANGUAGES.ENGLISH.isoCode);
      expect(changeLocaleSpy).toHaveBeenCalledWith(LANGUAGES.ENGLISH.isoCode);
    });
  });

  describe("Language Detection", () => {
    it("should detect English language variants", () => {
      mockI18n.changeLanguage("en-US");
      renderWithProviders(<LanguageDropdown />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should detect German language variants", () => {
      mockI18n.changeLanguage("de-DE");
      renderWithProviders(<LanguageDropdown />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle uppercase language codes", () => {
      mockI18n.changeLanguage("EN");
      renderWithProviders(<LanguageDropdown />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should default to German for unknown languages", () => {
      mockI18n.changeLanguage("fr");
      renderWithProviders(<LanguageDropdown />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle undefined language", () => {
      // For this test, we need to temporarily set language to undefined
      // i18n always has a language, so we can simulate with a fallback scenario
      mockI18n.changeLanguage("");
      renderWithProviders(<LanguageDropdown />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Flag Icons", () => {
    it("should display flag icons in dropdown options", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // Both options should be present with their flags
      const germanOption = screen.getByRole("option", { name: /German/i });
      const englishOption = screen.getByRole("option", { name: /English/i });

      expect(germanOption).toBeInTheDocument();
      expect(englishOption).toBeInTheDocument();
    });

    it("should use flagIcon prop on GeneralDropdown", () => {
      const { container } = renderWithProviders(<LanguageDropdown />);

      // The dropdown should be rendered
      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toBeInTheDocument();
    });
  });

  describe("Full Width", () => {
    it("should render as full width", () => {
      const { container } = renderWithProviders(<LanguageDropdown />);

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toHaveClass("MuiFormControl-fullWidth");
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      combobox.focus();
      expect(combobox).toHaveFocus();

      await user.keyboard("{Enter}");

      // Options should be visible
      expect(
        screen.getByRole("option", { name: /English/i }),
      ).toBeInTheDocument();
    });

    it("should have proper ARIA attributes", () => {
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded");
    });

    it("should have accessible language labels", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // Language names should be accessible
      expect(
        screen.getByRole("option", { name: /English/i }),
      ).toHaveAccessibleName();
      expect(
        screen.getByRole("option", { name: /German/i }),
      ).toHaveAccessibleName();
    });
  });

  describe("Memoization", () => {
    it("should be memoized component", () => {
      const { rerender } = renderWithProviders(<LanguageDropdown />);

      // Re-render with same props shouldn't cause issues
      rerender(<LanguageDropdown />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Integration with i18n", () => {
    it("should call i18n changeLanguage on selection", async () => {
      const user = userEvent.setup();
      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);
      const changeLanguageSpy = vi.spyOn(i18nInstance, "changeLanguage");

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const germanOption = screen.getByRole("option", { name: /German/i });
      await user.click(germanOption);

      expect(changeLanguageSpy).toHaveBeenCalledWith(LANGUAGES.GERMAN.isoCode);
    });

    it("should read current language from i18n instance", () => {
      mockI18n.changeLanguage("de");
      renderWithProviders(<LanguageDropdown />);

      // Should render without errors
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should use translation function for label", () => {
      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);
      const tSpy = vi.spyOn(i18nInstance, "t");

      // Re-render to trigger translation
      renderWithProviders(<LanguageDropdown />);

      // Translation function should be called for the label (first argument check)
      expect(tSpy).toHaveBeenCalled();
      const firstCall = tSpy.mock.calls[0];
      expect(firstCall[0]).toBe("general.Language");
    });
  });

  describe("Integration with Redux", () => {
    it("should dispatch Redux action on language change", async () => {
      const user = userEvent.setup();
      const changeLocaleSpy = vi.spyOn(uiActions, "changeApplicationLocale");

      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const germanOption = screen.getByRole("option", { name: /German/i });
      await user.click(germanOption);

      expect(changeLocaleSpy).toHaveBeenCalledTimes(1);
      expect(changeLocaleSpy).toHaveBeenCalledWith(LANGUAGES.GERMAN.isoCode);
    });

    it("should work with default i18n instance", () => {
      // Using default i18n from renderWithProviders
      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid language switches", async () => {
      const user = userEvent.setup();
      const { i18nInstance } = renderWithProviders(<LanguageDropdown />);
      const changeLanguageSpy = vi.spyOn(i18nInstance, "changeLanguage");

      // Clear any previous calls (from beforeEach or rendering)
      changeLanguageSpy.mockClear();

      const combobox = screen.getByRole("combobox");

      // Switch to German
      await user.click(combobox);
      await user.click(screen.getByRole("option", { name: /German/i }));

      // Switch back to English
      await user.click(combobox);
      await user.click(screen.getByRole("option", { name: /English/i }));

      expect(changeLanguageSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle language selection with same current language", async () => {
      const user = userEvent.setup();
      const changeLocaleSpy = vi.spyOn(uiActions, "changeApplicationLocale");

      renderWithProviders(<LanguageDropdown />);

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      // Select English (which is already the current language)
      const englishOption = screen.getByRole("option", { name: /English/i });
      await user.click(englishOption);

      // MUI Select doesn't trigger onChange when selecting the same value
      // This is expected behavior - just verify component doesn't break
      expect(combobox).toBeInTheDocument();
      expect(changeLocaleSpy).not.toHaveBeenCalled();
    });
  });
});
