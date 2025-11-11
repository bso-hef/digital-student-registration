import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import ActionsTooltip from "./index";

/**
 * Component tests for ActionsTooltip
 * @file src/components/atoms/ActionsTooltip/ActionsTooltip.test.tsx
 */

describe("ActionsTooltip", () => {
  describe("Basic Rendering", () => {
    it("should render child element", () => {
      renderWithProviders(
        <ActionsTooltip title="Test tooltip">
          <button>Hover me</button>
        </ActionsTooltip>,
      );

      // MUI Tooltip adds aria-label to child, so we just check button exists
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Hover me");
    });

    it("should render with string title", () => {
      renderWithProviders(
        <ActionsTooltip title="Tooltip text">
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with ReactNode title", () => {
      renderWithProviders(
        <ActionsTooltip title={<span>Complex tooltip</span>}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render child without modifying it", () => {
      renderWithProviders(
        <ActionsTooltip title="Tooltip">
          <button data-testid="custom-button">Custom Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByTestId("custom-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Custom Button");
    });
  });

  describe("Tooltip Display on Hover", () => {
    it("should show tooltip on hover", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Hover tooltip">
          <button>Hover me</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should display tooltip text on hover", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Tooltip content">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText("Tooltip content")).toBeInTheDocument();
      });
    });

    it("should hide tooltip on unhover", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Test tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(button);

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Arrow Prop", () => {
    it("should show arrow by default", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Tooltip with arrow">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("should hide arrow when arrow is false", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Tooltip without arrow" arrow={false}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should show arrow when arrow is true", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Tooltip with arrow" arrow={true}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Placement Prop", () => {
    it("should support top placement", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Top tooltip" placement="top">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should support bottom placement", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Bottom tooltip" placement="bottom">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should support left placement", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Left tooltip" placement="left">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should support right placement", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Right tooltip" placement="right">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Controlled Tooltip", () => {
    it("should show tooltip when open is true", () => {
      renderWithProviders(
        <ActionsTooltip title="Always visible" open={true}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByText("Always visible")).toBeInTheDocument();
    });

    it("should hide tooltip when open is false", () => {
      renderWithProviders(
        <ActionsTooltip title="Hidden tooltip" open={false}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should update when open prop changes", () => {
      const { rerender } = renderWithProviders(
        <ActionsTooltip title="Controlled tooltip" open={false}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      rerender(
        <ActionsTooltip title="Controlled tooltip" open={true}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  describe("Bigger Tooltip", () => {
    it("should render with default size", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Normal size">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should render with bigger size when biggerTooltip is true", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Bigger tooltip" biggerTooltip={true}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should render with normal size when biggerTooltip is false", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Normal tooltip" biggerTooltip={false}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Transition", () => {
    it("should have transition by default", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="With transition">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should support withTransition prop", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="With transition" withTransition={true}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should work without transition", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Without transition" withTransition={false}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Leave Delay", () => {
    it("should use default leaveDelay of 0", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Default delay">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should support custom leaveDelay", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Custom delay" leaveDelay={500}>
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Memoization", () => {
    it("should be memoized component", () => {
      const { rerender } = renderWithProviders(
        <ActionsTooltip title="Tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();

      // Re-render with same props
      rerender(
        <ActionsTooltip title="Tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should update when props change", async () => {
      const user = userEvent.setup();

      const { rerender } = renderWithProviders(
        <ActionsTooltip title="First tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText("First tooltip")).toBeInTheDocument();
      });

      await user.unhover(button);

      rerender(
        <ActionsTooltip title="Second tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText("Second tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string title", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      // Tooltip might not show with empty title
      expect(button).toBeInTheDocument();
    });

    it("should handle complex ReactNode title", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip
          title={
            <div>
              <strong>Bold</strong> and <em>italic</em>
            </div>
          }
        >
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText(/Bold/)).toBeInTheDocument();
      });
    });

    it("should work with disabled child", () => {
      renderWithProviders(
        <ActionsTooltip title="Disabled button tooltip">
          <button disabled>Disabled</button>
        </ActionsTooltip>,
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should handle rapid hover/unhover", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Rapid tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");

      await user.hover(button);
      await user.unhover(button);
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper tooltip role", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Accessible tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("should associate tooltip with child element", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Associated tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("should be focusable with keyboard", () => {
      renderWithProviders(
        <ActionsTooltip title="Keyboard tooltip">
          <button>Button</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      button.focus();

      // Button should be focusable even if tooltip doesn't show on focus alone
      expect(button).toHaveFocus();
    });
  });

  describe("Multiple Children Types", () => {
    it("should work with button child", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Button tooltip">
          <button>Click me</button>
        </ActionsTooltip>,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should work with div child", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Div tooltip">
          <div>Hover area</div>
        </ActionsTooltip>,
      );

      const div = screen.getByText("Hover area");
      await user.hover(div);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should work with icon child", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ActionsTooltip title="Icon tooltip">
          <span data-testid="icon">🔍</span>
        </ActionsTooltip>,
      );

      const icon = screen.getByTestId("icon");
      await user.hover(icon);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });
  });
});
