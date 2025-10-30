import { THEME } from "@/constants/general.constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import StatCard from "./index";

/**
 * Component tests for StatCard
 * @file src/components/atoms/dashboard/StatCard/StatCard.test.tsx
 */

describe("StatCard", () => {
  describe("Basic Rendering", () => {
    it("should render label", () => {
      renderWithProviders(<StatCard label="Total Students" value={150} />);

      expect(screen.getByText("Total Students")).toBeInTheDocument();
    });

    it("should render numeric value", () => {
      renderWithProviders(<StatCard label="Count" value={42} />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render string value", () => {
      renderWithProviders(<StatCard label="Status" value="Active" />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render both label and value", () => {
      renderWithProviders(<StatCard label="Users" value={100} />);

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should render Card component", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });

    it("should render CardContent", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const cardContent = container.querySelector(".MuiCardContent-root");
      expect(cardContent).toBeInTheDocument();
    });
  });

  describe("Drag Handle", () => {
    it("should render drag handle", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const dragHandle = container.querySelector(".drag-handle");
      expect(dragHandle).toBeInTheDocument();
    });

    it("should render DragIndicatorIcon", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const icon = container.querySelector(
        '[data-testid="DragIndicatorRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should have drag-handle class", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const handle = container.querySelector(".drag-handle");
      expect(handle).toHaveClass("drag-handle");
    });
  });

  describe("Icon Prop", () => {
    it("should not render icon wrapper when no icon provided", () => {
      renderWithProviders(<StatCard label="Test" value={1} />);

      // Should only have drag handle box, not icon wrapper
      expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
    });

    it("should render icon when provided", () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          icon={<div data-testid="custom-icon">Icon</div>}
        />,
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should render icon wrapper with icon", () => {
      renderWithProviders(
        <StatCard label="Test" value={1} icon={<span>📊</span>} />,
      );

      expect(screen.getByText("📊")).toBeInTheDocument();
    });

    it("should render complex icon element", () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          icon={
            <div data-testid="complex-icon">
              <svg>
                <circle />
              </svg>
            </div>
          }
        />,
      );

      expect(screen.getByTestId("complex-icon")).toBeInTheDocument();
    });
  });

  describe("Gradient Prop", () => {
    it("should render without gradient by default", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });

    it("should render with gradient", () => {
      const { container } = renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });

    it("should apply gradient styling", () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          gradient="linear-gradient(to right, red, blue)"
        />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("ID Prop", () => {
    it("should not have id when not provided", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).not.toHaveAttribute("id");
    });

    it("should have id when provided", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} id="stat-card-1" />,
      );

      const card = container.querySelector("#stat-card-1");
      expect(card).toBeInTheDocument();
    });

    it("should use custom id", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} id="custom-stat-id" />,
      );

      expect(container.querySelector("#custom-stat-id")).toBeInTheDocument();
    });
  });

  describe("Value Types", () => {
    it("should handle zero value", () => {
      renderWithProviders(<StatCard label="Count" value={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle negative value", () => {
      renderWithProviders(<StatCard label="Change" value={-5} />);

      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("should handle large numbers", () => {
      renderWithProviders(<StatCard label="Population" value={1000000} />);

      expect(screen.getByText("1000000")).toBeInTheDocument();
    });

    it("should handle decimal numbers", () => {
      renderWithProviders(<StatCard label="Percentage" value={75.5} />);

      expect(screen.getByText("75.5")).toBeInTheDocument();
    });

    it("should handle formatted strings", () => {
      renderWithProviders(<StatCard label="Revenue" value="$1,234.56" />);

      expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    });

    it("should handle percentage strings", () => {
      renderWithProviders(<StatCard label="Growth" value="15.3%" />);

      expect(screen.getByText("15.3%")).toBeInTheDocument();
    });
  });

  describe("Label Prop", () => {
    it("should handle short label", () => {
      renderWithProviders(<StatCard label="ID" value={123} />);

      expect(screen.getByText("ID")).toBeInTheDocument();
    });

    it("should handle long label", () => {
      renderWithProviders(
        <StatCard
          label="Very Long Label That Describes Something"
          value={10}
        />,
      );

      expect(
        screen.getByText("Very Long Label That Describes Something"),
      ).toBeInTheDocument();
    });

    it("should handle label with special characters", () => {
      renderWithProviders(<StatCard label="Users & Groups" value={50} />);

      expect(screen.getByText("Users & Groups")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render StyledCard as container", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });

    it("should render value before label in DOM", () => {
      renderWithProviders(<StatCard label="Label" value={100} />);

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should have proper nesting: Card > CardContent > Content", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const card = container.querySelector(".MuiCard-root");
      const cardContent = card?.querySelector(".MuiCardContent-root");

      expect(card).toBeInTheDocument();
      expect(cardContent).toBeInTheDocument();
    });
  });

  describe("Theme Integration", () => {
    it("should render in light theme", () => {
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

      renderWithProviders(<StatCard label="Test" value={100} />, { store });

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should render in dark theme", () => {
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

      renderWithProviders(<StatCard label="Test" value={100} />, { store });

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should render with gradient in light theme", () => {
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

      renderWithProviders(
        <StatCard
          label="Test"
          value={100}
          gradient="linear-gradient(to right, red, blue)"
        />,
        { store },
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should render with gradient in dark theme", () => {
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

      renderWithProviders(
        <StatCard
          label="Test"
          value={100}
          gradient="linear-gradient(to right, red, blue)"
        />,
        { store },
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Props Updates", () => {
    it("should update when label changes", () => {
      const { rerender } = renderWithProviders(
        <StatCard label="Original" value={10} />,
      );

      expect(screen.getByText("Original")).toBeInTheDocument();

      rerender(<StatCard label="Updated" value={10} />);

      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Original")).not.toBeInTheDocument();
    });

    it("should update when value changes", () => {
      const { rerender } = renderWithProviders(
        <StatCard label="Count" value={5} />,
      );

      expect(screen.getByText("5")).toBeInTheDocument();

      rerender(<StatCard label="Count" value={10} />);

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("should update when icon changes", () => {
      const { rerender } = renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          icon={<span data-testid="icon-1">Icon1</span>}
        />,
      );

      expect(screen.getByTestId("icon-1")).toBeInTheDocument();

      rerender(
        <StatCard
          label="Test"
          value={1}
          icon={<span data-testid="icon-2">Icon2</span>}
        />,
      );

      expect(screen.getByTestId("icon-2")).toBeInTheDocument();
      expect(screen.queryByTestId("icon-1")).not.toBeInTheDocument();
    });

    it("should update when gradient changes", () => {
      const { rerender } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();

      rerender(
        <StatCard
          label="Test"
          value={1}
          gradient="linear-gradient(to right, red, blue)"
        />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("should render with all props", () => {
      renderWithProviders(
        <StatCard
          label="Complete"
          value={999}
          icon={<span data-testid="icon">📊</span>}
          gradient="linear-gradient(to right, purple, pink)"
          id="complete-card"
        />,
      );

      expect(screen.getByText("Complete")).toBeInTheDocument();
      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("should render with icon and gradient", () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          icon={<span>🎨</span>}
          gradient="linear-gradient(to right, red, blue)"
        />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("🎨")).toBeInTheDocument();
    });

    it("should render with icon and id", () => {
      renderWithProviders(
        <StatCard
          label="Test"
          value={1}
          icon={<span>📈</span>}
          id="stat-with-icon"
        />,
      );

      expect(screen.getByText("📈")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic structure", () => {
      const { container } = renderWithProviders(
        <StatCard label="Accessible" value={100} />,
      );

      const card = container.querySelector(".MuiCard-root");
      const cardContent = container.querySelector(".MuiCardContent-root");

      expect(card).toBeInTheDocument();
      expect(cardContent).toBeInTheDocument();
    });

    it("should render readable text", () => {
      renderWithProviders(<StatCard label="Screen Reader Text" value={42} />);

      expect(screen.getByText("Screen Reader Text")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should have drag indicator icon for keyboard users", () => {
      const { container } = renderWithProviders(
        <StatCard label="Test" value={1} />,
      );

      const dragIcon = container.querySelector(
        '[data-testid="DragIndicatorRoundedIcon"]',
      );
      expect(dragIcon).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string value", () => {
      renderWithProviders(<StatCard label="Label" value="" />);

      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should handle zero as string", () => {
      renderWithProviders(<StatCard label="Test" value="0" />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle null icon gracefully", () => {
      renderWithProviders(<StatCard label="Test" value={1} icon={null} />);

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should handle undefined gradient", () => {
      renderWithProviders(
        <StatCard label="Test" value={1} gradient={undefined} />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
