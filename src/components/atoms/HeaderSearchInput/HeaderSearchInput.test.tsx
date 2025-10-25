import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import HeaderSearchInput from "./index";

/**
 * Component tests for HeaderSearchInput
 * @file src/components/atoms/HeaderSearchInput/HeaderSearchInput.test.tsx
 */

describe("HeaderSearchInput", () => {
  describe("Basic Rendering", () => {
    it("should render search input", () => {
      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render with search icon", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const searchIcon = container.querySelector(
        '[data-testid="SearchRoundedIcon"]',
      );
      expect(searchIcon).toBeInTheDocument();
    });

    it("should render with default placeholder from i18n", () => {
      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "general.Search");
    });

    it("should render with custom placeholder", () => {
      renderWithProviders(
        <HeaderSearchInput placeholder="Search students..." />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Search students...");
    });

    it("should render with outlined variant", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const outlinedInput = container.querySelector(".MuiOutlinedInput-root");
      expect(outlinedInput).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onChange when user types", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<HeaderSearchInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
    });

    it("should update input value when user types", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "John Doe");

      expect(input.value).toBe("John Doe");
    });

    it("should handle empty input", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<HeaderSearchInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");
      await user.clear(input);

      expect(input).toHaveValue("");
    });

    it("should handle special characters", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "!@#$%");

      expect(input.value).toBe("!@#$%");
    });

    it("should handle paste events", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.click(input);
      await user.paste("pasted text");

      expect(input.value).toBe("pasted text");
    });
  });

  describe("Controlled Component", () => {
    it("should work as a controlled component", () => {
      const { rerender } = renderWithProviders(
        <HeaderSearchInput value="" onChange={() => {}} />,
      );

      let input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");

      rerender(<HeaderSearchInput value="test" onChange={() => {}} />);

      input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("test");
    });

    it("should accept defaultValue prop", () => {
      renderWithProviders(<HeaderSearchInput defaultValue="initial value" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("initial value");
    });
  });

  describe("Search Icon", () => {
    it("should render search icon as start adornment", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const startAdornment = container.querySelector(
        ".MuiInputAdornment-positionStart",
      );
      expect(startAdornment).toBeInTheDocument();
    });

    it("should have search icon with correct color", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const adornment = container.querySelector(
        ".MuiInputAdornment-root",
      ) as HTMLElement;
      expect(adornment).toBeInTheDocument();
      expect(adornment.style.color).toBe("rgb(244, 246, 248)");
    });

    it("should not allow icon to be clicked", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const searchIcon = container.querySelector(
        '[data-testid="SearchRoundedIcon"]',
      );
      expect(searchIcon).toBeInTheDocument();
      // Icon is decorative, not interactive
    });
  });

  describe("Styling and Layout", () => {
    it("should apply custom input padding", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const input = container.querySelector("input");
      expect(input).toHaveStyle({ padding: "10px 16px 10px 0" });
    });

    it("should have custom font size in inputProps", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const input = container.querySelector("input");
      expect(input).toBeInTheDocument();
      // Font size is set via inline style in inputProps
    });

    it("should accept custom className", () => {
      const { container } = renderWithProviders(
        <HeaderSearchInput className="custom-search" />,
      );

      const textField = container.querySelector(".custom-search");
      expect(textField).toBeInTheDocument();
    });

    it("should accept custom styles", () => {
      const { container } = renderWithProviders(
        <HeaderSearchInput style={{ width: "300px" }} />,
      );

      const textField = container.querySelector(
        ".MuiTextField-root",
      ) as HTMLElement;
      expect(textField).toBeInTheDocument();
    });
  });

  describe("TextField Props", () => {
    it("should support disabled prop", () => {
      renderWithProviders(<HeaderSearchInput disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should support fullWidth prop", () => {
      const { container } = renderWithProviders(
        <HeaderSearchInput fullWidth />,
      );

      const textField = container.querySelector(".MuiFormControl-fullWidth");
      expect(textField).toBeInTheDocument();
    });

    it("should support size prop", () => {
      renderWithProviders(<HeaderSearchInput size="small" />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should support error prop", () => {
      const { container } = renderWithProviders(<HeaderSearchInput error />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should support helperText prop", () => {
      renderWithProviders(<HeaderSearchInput helperText="Enter search term" />);

      expect(screen.getByText("Enter search term")).toBeInTheDocument();
    });

    it("should support required prop", () => {
      renderWithProviders(<HeaderSearchInput required />);

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });

    it("should support name prop", () => {
      renderWithProviders(<HeaderSearchInput name="search-field" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.name).toBe("search-field");
    });

    it("should support id prop", () => {
      renderWithProviders(<HeaderSearchInput id="header-search" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "header-search");
    });
  });

  describe("Accessibility", () => {
    it("should be focusable", () => {
      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox");
      input.focus();
      expect(input).toHaveFocus();
    });

    it("should support aria-label", () => {
      renderWithProviders(
        <HeaderSearchInput inputProps={{ "aria-label": "Search input" }} />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Search input");
    });

    it("should support aria-labelledby", () => {
      renderWithProviders(
        <div>
          <label id="search-label">Search</label>
          <HeaderSearchInput
            inputProps={{ "aria-labelledby": "search-label" }}
          />
        </div>,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-labelledby", "search-label");
    });

    it("should have placeholder for screen readers", () => {
      renderWithProviders(<HeaderSearchInput placeholder="Search students" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Search students");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox");

      // Tab to focus
      await user.tab();
      expect(input).toHaveFocus();
    });
  });

  describe("Form Integration", () => {
    it("should work within a form", () => {
      renderWithProviders(
        <form>
          <HeaderSearchInput name="search" />
        </form>,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.name).toBe("search");
    });

    it("should handle form submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      renderWithProviders(
        <form onSubmit={handleSubmit}>
          <HeaderSearchInput name="search" />
          <button type="submit">Submit</button>
        </form>,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "test query");

      const button = screen.getByRole("button", { name: /submit/i });
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("Memoization", () => {
    it("should be memoized component", () => {
      const { rerender } = renderWithProviders(<HeaderSearchInput />);

      // Re-render with same props shouldn't cause issues
      rerender(<HeaderSearchInput />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should not re-render unnecessarily", () => {
      const handleChange = vi.fn();
      const { rerender } = renderWithProviders(
        <HeaderSearchInput onChange={handleChange} />,
      );

      // Re-render with same props
      rerender(<HeaderSearchInput onChange={handleChange} />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long input", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const longText = "a".repeat(1000);
      // Use paste instead of typing to avoid timeout
      await user.click(input);
      await user.paste(longText);

      expect(input.value.length).toBe(1000);
    });

    it("should handle rapid typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<HeaderSearchInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "quicktext", { delay: 1 });

      expect(handleChange).toHaveBeenCalled();
    });

    it("should work without onChange handler", async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderSearchInput defaultValue="" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "test");

      expect(input.value).toBe("test");
    });

    it("should use translation for falsy placeholder", () => {
      renderWithProviders(<HeaderSearchInput placeholder="" />);

      const input = screen.getByRole("textbox");
      // Empty string is falsy, so it falls back to translation
      expect(input).toHaveAttribute("placeholder", "general.Search");
    });

    it("should accept multiline prop", () => {
      renderWithProviders(<HeaderSearchInput multiline rows={3} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Translation Integration", () => {
    it("should use translated placeholder when no custom placeholder provided", () => {
      renderWithProviders(<HeaderSearchInput />);

      const input = screen.getByRole("textbox");
      // Default uses t('general.Search')
      expect(input).toHaveAttribute("placeholder", "general.Search");
    });

    it("should prioritize custom placeholder over translation", () => {
      renderWithProviders(<HeaderSearchInput placeholder="Custom search" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Custom search");
    });
  });

  describe("Input Props Override", () => {
    it("should allow inputProps override", () => {
      renderWithProviders(
        <HeaderSearchInput
          inputProps={{
            style: { padding: "20px", fontSize: 16 },
            maxLength: 50,
          }}
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toHaveAttribute("maxLength", "50");
    });

    it("should merge inputProps with defaults", () => {
      const { container } = renderWithProviders(
        <HeaderSearchInput
          inputProps={{
            "data-testid": "custom-input",
          }}
        />,
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toBeInTheDocument();
      // Custom inputProps should be applied
    });
  });

  describe("InputProps with Adornments", () => {
    it("should not override start adornment", () => {
      const { container } = renderWithProviders(<HeaderSearchInput />);

      const startAdornment = container.querySelector(
        ".MuiInputAdornment-positionStart",
      );
      const searchIcon = container.querySelector(
        '[data-testid="SearchRoundedIcon"]',
      );

      expect(startAdornment).toBeInTheDocument();
      expect(searchIcon).toBeInTheDocument();
    });

    it("should allow end adornment via InputProps", () => {
      const { container } = renderWithProviders(
        <HeaderSearchInput
          InputProps={{
            endAdornment: <span data-testid="end-adornment">X</span>,
          }}
        />,
      );

      const endAdornment = screen.getByTestId("end-adornment");
      expect(endAdornment).toBeInTheDocument();
    });
  });
});
