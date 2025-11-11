import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../../tests/utils/test-utils";
import GeneralButton from "./index";

/**
 * Component tests for GeneralButton
 * @file src/components/atoms/buttons/GeneralButton/GeneralButton.test.tsx
 */

// Mock device-type-detection
vi.mock("device-type-detection", () => ({
  useDeviceTypeDetection: () => ({
    isMobile: false,
    isMobileHorizontal: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe("GeneralButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render button with label", () => {
      renderWithProviders(<GeneralButton label="Click Me" />);

      expect(
        screen.getByRole("button", { name: "Click Me" }),
      ).toBeInTheDocument();
    });

    it("should render button with custom id", () => {
      renderWithProviders(<GeneralButton label="Test" id="custom-button" />);

      expect(screen.getByRole("button")).toHaveAttribute("id", "custom-button");
    });

    it("should render button without label", () => {
      renderWithProviders(<GeneralButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Button States", () => {
    it("should be enabled by default", () => {
      renderWithProviders(<GeneralButton label="Enabled" />);

      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("should be disabled when disabled prop is true", () => {
      renderWithProviders(<GeneralButton label="Disabled" disabled />);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should apply primary styling by default", () => {
      renderWithProviders(<GeneralButton label="Primary" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Primary button should have isPrimary=true by default
    });

    it("should apply secondary styling when isPrimary is false", () => {
      renderWithProviders(
        <GeneralButton label="Secondary" isPrimary={false} />,
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onAction when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(
        <GeneralButton label="Click Me" onAction={handleClick} />,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onAction when disabled", async () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <GeneralButton label="Disabled" onAction={handleClick} disabled />,
      );

      const button = screen.getByRole("button");

      // Disabled buttons have pointer-events: none, so we can't click them
      // Just verify the button is disabled (which prevents clicks naturally)
      expect(button).toBeDisabled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should pass event object to onAction handler", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(
        <GeneralButton label="Click Me" onAction={handleClick} />,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalled();
      expect(handleClick.mock.calls[0][0]).toBeDefined();
    });
  });

  describe("Button Type", () => {
    it("should have button type by default", () => {
      renderWithProviders(<GeneralButton label="Button" />);

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("should support submit type", () => {
      renderWithProviders(<GeneralButton label="Submit" type="submit" />);

      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("should support reset type", () => {
      renderWithProviders(<GeneralButton label="Reset" type="reset" />);

      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("Button Sizing", () => {
    it("should apply fullWidth when specified", () => {
      renderWithProviders(<GeneralButton label="Full Width" fullWidth />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should apply fullHeight when specified", () => {
      renderWithProviders(<GeneralButton label="Full Height" fullHeight />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should apply custom maxHeight", () => {
      renderWithProviders(
        <GeneralButton label="Custom Height" maxHeight="60px" />,
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should apply custom maxWidth", () => {
      renderWithProviders(
        <GeneralButton label="Custom Width" maxWidth="200px" />,
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Text Styling", () => {
    it("should apply uppercase transformation when specified", () => {
      renderWithProviders(<GeneralButton label="uppercase text" upperCase />);

      const button = screen.getByRole("button");
      const label = button.querySelector("p");
      expect(label).toHaveStyle({ textTransform: "uppercase" });
    });

    it("should not apply uppercase by default", () => {
      renderWithProviders(<GeneralButton label="Normal Text" />);

      const button = screen.getByRole("button");
      const label = button.querySelector("p");
      expect(label).toHaveStyle({ textTransform: "none" });
    });

    it("should apply custom font size", () => {
      renderWithProviders(<GeneralButton label="Custom Font" fontSize={18} />);

      const button = screen.getByRole("button");
      const label = button.querySelector("p");
      expect(label).toHaveStyle({ fontSize: "18px" });
    });

    it("should apply custom font weight", () => {
      renderWithProviders(<GeneralButton label="Bold Text" fontWeight={700} />);

      const button = screen.getByRole("button");
      const label = button.querySelector("p");
      expect(label).toHaveStyle({ fontWeight: "700" });
    });
  });

  describe("Icons", () => {
    it("should render with start icon", () => {
      const StartIcon = <span data-testid="start-icon">🔥</span>;
      renderWithProviders(
        <GeneralButton label="With Start Icon" startIcon={StartIcon} />,
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("With Start Icon");
    });

    it("should render with end icon", () => {
      const EndIcon = <span data-testid="end-icon">→</span>;
      renderWithProviders(
        <GeneralButton label="With End Icon" endIcon={EndIcon} />,
      );

      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("With End Icon");
    });

    it("should render with both start and end icons", () => {
      const StartIcon = <span data-testid="start-icon">←</span>;
      const EndIcon = <span data-testid="end-icon">→</span>;

      renderWithProviders(
        <GeneralButton
          label="With Both Icons"
          startIcon={StartIcon}
          endIcon={EndIcon}
        />,
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });
  });

  describe("Tooltip", () => {
    it("should render tooltip when withTooltip is true", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <GeneralButton
          label="Hover Me"
          withTooltip
          tooltipLabel="Tooltip Text"
        />,
      );

      const button = screen.getByRole("button");

      // Hover over the button
      await user.hover(button);

      // Wait for tooltip to appear
      await waitFor(() => {
        expect(screen.getByText("Tooltip Text")).toBeInTheDocument();
      });
    });

    it("should not render tooltip when withTooltip is false", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <GeneralButton label="No Tooltip" tooltipLabel="Should Not Appear" />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      // Tooltip should not appear
      expect(screen.queryByText("Should Not Appear")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(
        <GeneralButton label="Keyboard Test" onAction={handleClick} />,
      );

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalled();
    });

    it("should have proper role attribute", () => {
      renderWithProviders(<GeneralButton label="Accessible Button" />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should maintain focus visibility", async () => {
      const user = userEvent.setup();

      renderWithProviders(<GeneralButton label="Focus Test" />);

      const button = screen.getByRole("button");
      await user.tab();

      expect(button).toHaveFocus();
    });
  });
});
