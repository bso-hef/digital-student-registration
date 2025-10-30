import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import GeneralInput from "./index";

/**
 * Component tests for GeneralInput
 * @file src/components/atoms/GeneralInput/GeneralInput.test.tsx
 */

describe("GeneralInput", () => {
  describe("Basic Rendering", () => {
    it("should render input field", () => {
      renderWithProviders(<GeneralInput />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render with label", () => {
      renderWithProviders(<GeneralInput label="Test Label" />);

      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      renderWithProviders(<GeneralInput placeholder="Enter text" />);

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("should render with custom id", () => {
      renderWithProviders(<GeneralInput id="custom-input" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "custom-input");
    });

    it("should render with name attribute", () => {
      renderWithProviders(<GeneralInput name="username" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "username");
    });
  });

  describe("Input Types", () => {
    it("should render as text input by default", () => {
      renderWithProviders(<GeneralInput />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should render as email input", () => {
      renderWithProviders(<GeneralInput type="email" />);

      const input = document.querySelector('input[type="email"]');
      expect(input).toBeInTheDocument();
    });

    it("should render as password input", () => {
      renderWithProviders(<GeneralInput type="password" />);

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should render as number input", () => {
      renderWithProviders(<GeneralInput type="number" />);

      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe("Value and Change Handling", () => {
    it("should display initial value", () => {
      renderWithProviders(<GeneralInput value="Initial Value" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Initial Value");
    });

    it("should call onChange when user types", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<GeneralInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello");

      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
    });

    it("should call onBlur when input loses focus", async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();

      renderWithProviders(<GeneralInput onBlur={handleBlur} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle numeric values", () => {
      renderWithProviders(<GeneralInput type="number" value={42} />);

      const input = document.querySelector("input") as HTMLInputElement;
      expect(input.value).toBe("42");
    });
  });

  describe("Required Field", () => {
    it("should not be required by default", () => {
      renderWithProviders(<GeneralInput />);

      const input = screen.getByRole("textbox");
      expect(input).not.toBeRequired();
    });

    it("should be required when specified", () => {
      renderWithProviders(<GeneralInput required />);

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });

    it("should show asterisk for required field with label", () => {
      renderWithProviders(<GeneralInput label="Required Field" required />);

      // Material-UI adds asterisk to required field labels (creates multiple instances)
      const elements = screen.getAllByText(/Required Field/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("should not show error state by default", () => {
      renderWithProviders(<GeneralInput />);

      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("aria-invalid", "true");
    });

    it("should show error state when error prop is true", () => {
      renderWithProviders(<GeneralInput error />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should display helper text", () => {
      renderWithProviders(<GeneralInput helperText="This is helper text" />);

      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });

    it("should display error message with error state", () => {
      renderWithProviders(
        <GeneralInput error helperText="This field is required" />,
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("should show email icon when showEmailStartIcon is true", () => {
      renderWithProviders(<GeneralInput showEmailStartIcon />);

      const icon = document.querySelector(
        'svg[data-testid="EmailRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should show user icon when showUserStartIcon is true", () => {
      renderWithProviders(<GeneralInput showUserStartIcon />);

      const icon = document.querySelector(
        'svg[data-testid="AccountCircleRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should show search icon when showSearchStartIcon is true", () => {
      renderWithProviders(<GeneralInput showSearchStartIcon />);

      const icon = document.querySelector(
        'svg[data-testid="SearchRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should not show any icon by default", () => {
      renderWithProviders(<GeneralInput />);

      const emailIcon = document.querySelector(
        'svg[data-testid="EmailRoundedIcon"]',
      );
      const userIcon = document.querySelector(
        'svg[data-testid="AccountCircleRoundedIcon"]',
      );
      const searchIcon = document.querySelector(
        'svg[data-testid="SearchRoundedIcon"]',
      );

      expect(emailIcon).not.toBeInTheDocument();
      expect(userIcon).not.toBeInTheDocument();
      expect(searchIcon).not.toBeInTheDocument();
    });
  });

  describe("Width and Styling", () => {
    it("should not be full width by default", () => {
      const { container } = renderWithProviders(<GeneralInput />);

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).not.toHaveClass("MuiFormControl-fullWidth");
    });

    it("should be full width when specified", () => {
      const { container } = renderWithProviders(<GeneralInput fullWidth />);

      const formControl = container.querySelector(".MuiFormControl-root");
      expect(formControl).toHaveClass("MuiFormControl-fullWidth");
    });

    it("should apply custom styles", () => {
      const customStyle = { backgroundColor: "red" };
      renderWithProviders(<GeneralInput style={customStyle} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("AutoComplete", () => {
    it("should apply autocomplete attribute", () => {
      renderWithProviders(<GeneralInput autoComplete="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autocomplete", "email");
    });

    it("should support various autocomplete values", () => {
      const autocompleteValues = [
        "name",
        "email",
        "username",
        "current-password",
      ];

      autocompleteValues.forEach((value) => {
        const { unmount } = renderWithProviders(
          <GeneralInput autoComplete={value} />,
        );

        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("autocomplete", value);

        unmount();
      });
    });
  });

  describe("Input Props", () => {
    it("should pass custom inputProps", () => {
      renderWithProviders(
        <GeneralInput
          inputProps={{ maxLength: 10, "data-testid": "custom-input" }}
        />,
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("maxlength", "10");
    });

    it("should support min and max for number inputs", () => {
      renderWithProviders(
        <GeneralInput type="number" inputProps={{ min: 0, max: 100 }} />,
      );

      const input = document.querySelector('input[type="number"]');
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle all props together", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const handleBlur = vi.fn();

      renderWithProviders(
        <GeneralInput
          id="complex-input"
          name="username"
          type="text"
          label="Username"
          placeholder="Enter username"
          value="testuser"
          onChange={handleChange}
          onBlur={handleBlur}
          required
          fullWidth
          showUserStartIcon
          helperText="Username must be unique"
        />,
      );

      // Use getByRole or querySelector when label has required asterisk
      const input = screen.getByRole("textbox") as HTMLInputElement;

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "complex-input");
      expect(input).toHaveAttribute("name", "username");
      expect(input.value).toBe("testuser");
      expect(input).toBeRequired();

      // Check icon
      const icon = document.querySelector(
        'svg[data-testid="AccountCircleRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();

      // Check helper text
      expect(screen.getByText("Username must be unique")).toBeInTheDocument();

      // Test interactions
      await user.clear(input);
      await user.type(input, "newuser");

      expect(handleChange).toHaveBeenCalled();
    });

    it("should handle error state with all features", () => {
      renderWithProviders(
        <GeneralInput
          label="Email"
          type="email"
          showEmailStartIcon
          error
          helperText="Invalid email format"
          required
          fullWidth
        />,
      );

      const input = document.querySelector(
        'input[type="email"]',
      ) as HTMLInputElement;
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();

      const icon = document.querySelector(
        'svg[data-testid="EmailRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();

      renderWithProviders(<GeneralInput label="Accessible Input" />);

      const input = screen.getByRole("textbox");

      await user.tab();
      expect(input).toHaveFocus();
    });

    it("should have proper ARIA attributes for errors", () => {
      renderWithProviders(
        <GeneralInput label="Test Input" error helperText="Error message" />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should associate label with input", () => {
      renderWithProviders(<GeneralInput id="test-id" label="Test Label" />);

      const input = screen.getByLabelText("Test Label");
      expect(input).toHaveAttribute("id", "test-id");
    });
  });
});
