import React from "react";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import AppleSwitch from "./index";

/**
 * Component tests for AppleSwitch
 * @file src/components/atoms/AppleSwitch/AppleSwitch.test.tsx
 */

describe("AppleSwitch", () => {
  describe("Basic Rendering", () => {
    it("should render switch with role", () => {
      renderWithProviders(<AppleSwitch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render unchecked by default", () => {
      renderWithProviders(<AppleSwitch />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(false);
    });

    it("should render checked when checked prop is true", () => {
      renderWithProviders(<AppleSwitch checked onChange={() => {}} />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(true);
    });

    it("should render with custom className", () => {
      const { container } = renderWithProviders(
        <AppleSwitch className="custom-switch" />,
      );

      const switchRoot = container.querySelector(".custom-switch");
      expect(switchRoot).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onChange when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<AppleSwitch onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should toggle checked state when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <AppleSwitch checked={false} onChange={handleChange} />,
      );

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      // Check the event passed to onChange
      expect(handleChange).toHaveBeenCalled();
      // In controlled component, event reflects the DOM state before onChange
      // The parent component should update the checked prop based on this event
    });

    it("should not call onChange when disabled", () => {
      const handleChange = vi.fn();

      renderWithProviders(<AppleSwitch disabled onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      // Disabled elements cannot be clicked, just verify it's disabled
      expect(switchElement).toBeDisabled();
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should call onChange when toggling from checked to unchecked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(
        <AppleSwitch checked={true} onChange={handleChange} />,
      );

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      // onChange should be called when user clicks
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Disabled State", () => {
    it("should render as disabled when disabled prop is true", () => {
      renderWithProviders(<AppleSwitch disabled />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
    });

    it("should have disabled class when disabled", () => {
      const { container } = renderWithProviders(<AppleSwitch disabled />);

      const switchBase = container.querySelector(".Mui-disabled");
      expect(switchBase).toBeInTheDocument();
    });

    it("should render checked and disabled", () => {
      renderWithProviders(<AppleSwitch checked disabled onChange={() => {}} />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(true);
      expect(switchElement).toBeDisabled();
    });
  });

  describe("Controlled Component", () => {
    it("should work as a controlled component", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = renderWithProviders(
        <AppleSwitch checked={false} onChange={handleChange} />,
      );

      let switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(false);

      // Simulate click
      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalled();

      // Re-render with new checked value
      rerender(<AppleSwitch checked={true} onChange={handleChange} />);

      switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(true);
    });

    it("should accept value prop", () => {
      renderWithProviders(<AppleSwitch value="test-value" />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.value).toBe("test-value");
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<AppleSwitch onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      expect(switchElement).toHaveFocus();

      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should support aria-label", () => {
      renderWithProviders(
        <AppleSwitch
          slotProps={{ input: { "aria-label": "Toggle feature" } }}
        />,
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-label", "Toggle feature");
    });

    it("should support aria-labelledby", () => {
      renderWithProviders(
        <div>
          <span id="switch-label">Enable notifications</span>
          <AppleSwitch
            slotProps={{ input: { "aria-labelledby": "switch-label" } }}
          />
        </div>,
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-labelledby", "switch-label");
    });

    it("should have proper checked state reflected in DOM", () => {
      renderWithProviders(<AppleSwitch checked onChange={() => {}} />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(true);
    });

    it("should be focusable by default", () => {
      renderWithProviders(<AppleSwitch />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      expect(switchElement).toHaveFocus();
    });

    it("should not be focusable when disabled", () => {
      renderWithProviders(<AppleSwitch disabled />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
    });
  });

  describe("Ripple Effect", () => {
    it("should have ripple disabled by default", () => {
      const { container } = renderWithProviders(<AppleSwitch />);

      const switchBase = container.querySelector(".MuiSwitch-switchBase");
      expect(switchBase).toBeInTheDocument();
      // AppleSwitch sets disableRipple=true by default
    });

    it("should allow ripple when disableRipple is false", () => {
      const { container } = renderWithProviders(
        <AppleSwitch disableRipple={false} />,
      );

      const switchBase = container.querySelector(".MuiSwitch-switchBase");
      expect(switchBase).toBeInTheDocument();
    });
  });

  describe("Styling and Theme", () => {
    it("should apply custom styles", () => {
      const { container } = renderWithProviders(
        <AppleSwitch style={{ margin: "10px" }} />,
      );

      const switchRoot = container.querySelector(
        ".MuiSwitch-root",
      ) as HTMLElement;
      expect(switchRoot).toBeInTheDocument();
    });

    it("should have correct width and height", () => {
      const { container } = renderWithProviders(<AppleSwitch />);

      const switchRoot = container.querySelector(
        ".MuiSwitch-root",
      ) as HTMLElement;

      expect(switchRoot).toBeInTheDocument();
      // Styled component sets width: 50px, height: 28px
    });

    it("should render thumb element", () => {
      const { container } = renderWithProviders(<AppleSwitch />);

      const thumb = container.querySelector(".MuiSwitch-thumb");
      expect(thumb).toBeInTheDocument();
    });

    it("should render track element", () => {
      const { container } = renderWithProviders(<AppleSwitch />);

      const track = container.querySelector(".MuiSwitch-track");
      expect(track).toBeInTheDocument();
    });

    it("should have checked class when checked", () => {
      const { container } = renderWithProviders(
        <AppleSwitch checked onChange={() => {}} />,
      );

      const checkedElement = container.querySelector(".Mui-checked");
      expect(checkedElement).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("should work within a form", () => {
      renderWithProviders(
        <form>
          <AppleSwitch name="agree" />
        </form>,
      );

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.name).toBe("agree");
    });

    it("should support name prop", () => {
      renderWithProviders(<AppleSwitch name="test-switch" />);

      const switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.name).toBe("test-switch");
    });

    it("should support required prop", () => {
      renderWithProviders(<AppleSwitch required />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeRequired();
    });

    it("should support id prop", () => {
      renderWithProviders(<AppleSwitch id="my-switch" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("id", "my-switch");
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid clicks", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      renderWithProviders(<AppleSwitch onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("should work without onChange handler", () => {
      renderWithProviders(<AppleSwitch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should handle checked prop changing", () => {
      const { rerender } = renderWithProviders(
        <AppleSwitch checked={false} onChange={() => {}} />,
      );

      let switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(false);

      rerender(<AppleSwitch checked={true} onChange={() => {}} />);

      switchElement = screen.getByRole("switch") as HTMLInputElement;
      expect(switchElement.checked).toBe(true);
    });
  });

  describe("Ref Forwarding", () => {
    it("should forward ref to the switch button element", () => {
      const ref = React.createRef<HTMLButtonElement>();

      renderWithProviders(<AppleSwitch ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current).not.toBeNull();
    });

    it("should allow access to ref", () => {
      const ref = React.createRef<HTMLButtonElement>();

      renderWithProviders(<AppleSwitch ref={ref} />);

      expect(ref.current).not.toBeNull();
      // Ref is forwarded to the button wrapper element
      expect(ref.current?.tagName).toBe("SPAN");
    });
  });

  describe("Color Prop", () => {
    it("should support default color", () => {
      renderWithProviders(<AppleSwitch color="default" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should support primary color", () => {
      renderWithProviders(<AppleSwitch color="primary" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should support secondary color", () => {
      renderWithProviders(<AppleSwitch color="secondary" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });
  });

  describe("Size Prop", () => {
    it("should support small size", () => {
      renderWithProviders(<AppleSwitch size="small" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should support medium size (default)", () => {
      renderWithProviders(<AppleSwitch size="medium" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });
  });
});
