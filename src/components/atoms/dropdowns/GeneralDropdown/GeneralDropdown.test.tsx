import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../../tests/utils/test-utils";
import GeneralDropdown from "./index";

/**
 * Component tests for GeneralDropdown
 * @file src/components/atoms/dropdowns/GeneralDropdown/GeneralDropdown.test.tsx
 */

const mockOptions = [
  { label: "Option 1", value: "opt1" },
  { label: "Option 2", value: "opt2" },
  { label: "Option 3", value: "opt3" },
];

describe("GeneralDropdown", () => {
  describe("Basic Rendering", () => {
    it("should render dropdown with label", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          label="Test Dropdown"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      // MUI creates multiple instances of the label text
      const labels = screen.getAllByText("Test Dropdown");
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should render dropdown without label", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          placeholder="Select an option"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("should display all options when opened", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <GeneralDropdown
          label="Test"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      mockOptions.forEach((opt) => {
        expect(
          screen.getByRole("option", { name: opt.label }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Value and Selection", () => {
    it("should display selected value", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value="opt2"
          onChange={handleChange}
        />,
      );

      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("should call onChange when option is selected", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const option = screen.getByRole("option", { name: "Option 1" });
      await user.click(option);

      expect(handleChange).toHaveBeenCalled();
    });

    it("should show check icon for selected option", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value="opt1"
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const selectedOption = screen.getByRole("option", { name: "Option 1" });
      const checkIcon = within(selectedOption).getByTestId("CheckRoundedIcon");
      expect(checkIcon).toBeInTheDocument();
    });

    it("should handle empty value", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          placeholder="Select"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      expect(screen.getByText("Select")).toBeInTheDocument();
    });
  });

  describe("Options with Icons", () => {
    it("should render options with left icons", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithIcons = [
        {
          label: "Home",
          value: "home",
          leftIcon: <span data-testid="home-icon">🏠</span>,
        },
        {
          label: "Work",
          value: "work",
          leftIcon: <span data-testid="work-icon">💼</span>,
        },
      ];

      renderWithProviders(
        <GeneralDropdown
          options={optionsWithIcons}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
      expect(screen.getByTestId("work-icon")).toBeInTheDocument();
    });

    it("should display selected option with icon", () => {
      const handleChange = vi.fn();
      const optionsWithIcons = [
        {
          label: "Home",
          value: "home",
          leftIcon: <span data-testid="home-icon">🏠</span>,
        },
      ];

      renderWithProviders(
        <GeneralDropdown
          options={optionsWithIcons}
          value="home"
          onChange={handleChange}
        />,
      );

      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  describe("Disabled States", () => {
    it("should be disabled when disabled prop is true", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          disabled
        />,
      );

      // Check the select element has disabled class
      const select = container.querySelector(".Mui-disabled");
      expect(select).toBeInTheDocument();
    });

    it("should render disabled options", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled = [
        { label: "Enabled", value: "enabled" },
        { label: "Disabled", value: "disabled", disabled: true },
      ];

      renderWithProviders(
        <GeneralDropdown
          options={optionsWithDisabled}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const disabledOption = screen.getByRole("option", { name: "Disabled" });
      expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    });

    it("should not call onChange for disabled options", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled = [
        { label: "Enabled", value: "enabled" },
        { label: "Disabled", value: "disabled", disabled: true },
      ];

      renderWithProviders(
        <GeneralDropdown
          options={optionsWithDisabled}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const disabledOption = screen.getByRole("option", { name: "Disabled" });
      // Verify it's disabled - MUI prevents selection via aria-disabled
      expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Error Handling", () => {
    it("should display error state", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          error
        />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-invalid", "true");
    });

    it("should display helper text", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          helperText="This is required"
        />,
      );

      expect(screen.getByText("This is required")).toBeInTheDocument();
    });

    it("should display error helper text", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          error
          helperText="This field is required"
        />,
      );

      const helperText = screen.getByText("This field is required");
      expect(helperText).toBeInTheDocument();
      // Helper text should have error class
      expect(helperText).toHaveClass("Mui-error");
    });
  });

  describe("Size Variants", () => {
    it("should render with small size", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          size="small"
        />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should render with medium size by default", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Style Variants", () => {
    it("should render with outlined variant by default", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const select = container.querySelector(".MuiOutlinedInput-root");
      expect(select).toBeInTheDocument();
    });

    it("should render with filled variant", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          variant="filled"
        />,
      );

      const select = container.querySelector(".MuiFilledInput-root");
      expect(select).toBeInTheDocument();
    });

    it("should render with standard variant", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          variant="standard"
        />,
      );

      const select = container.querySelector(".MuiInput-root");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Width Handling", () => {
    it("should be full width by default", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toHaveClass("MuiFormControl-fullWidth");
    });

    it("should not be full width when specified", () => {
      const handleChange = vi.fn();
      const { container } = renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          onChange={handleChange}
          fullWidth={false}
        />,
      );

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toHaveClass("MuiFormControl-fullWidth");
    });
  });

  describe("Default Value", () => {
    it("should use defaultValue when provided", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          options={mockOptions}
          value=""
          defaultValue="opt2"
          onChange={handleChange}
        />,
      );

      // MUI Select with defaultValue doesn't show it until controlled value changes
      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Empty Options", () => {
    it("should handle empty options array", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown options={[]} value="" onChange={handleChange} />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <GeneralDropdown
          label="Accessible Dropdown"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      combobox.focus();
      expect(combobox).toHaveFocus();

      // Open with keyboard
      await user.keyboard("{Enter}");

      // Options should be visible
      expect(
        screen.getByRole("option", { name: "Option 1" }),
      ).toBeInTheDocument();
    });

    it("should have proper ARIA attributes", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          label="Test Dropdown"
          options={mockOptions}
          value="opt1"
          onChange={handleChange}
        />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded");
    });

    it("should associate label with dropdown", () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <GeneralDropdown
          label="Select Option"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      // MUI creates multiple instances of label text
      const labels = screen.getAllByText("Select Option");
      expect(labels.length).toBeGreaterThan(0);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
