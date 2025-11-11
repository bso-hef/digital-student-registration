import { THEME } from "@/constants/general.constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import MetricLabel from "./index";

/**
 * Component tests for MetricLabel
 * @file src/components/atoms/dashboard/MetricLabel/MetricLabel.test.tsx
 */

describe("MetricLabel", () => {
  describe("Basic Rendering", () => {
    it("should render label", () => {
      renderWithProviders(<MetricLabel label="Total Students" value={150} />);

      expect(screen.getByText("Total Students")).toBeInTheDocument();
    });

    it("should render numeric value", () => {
      renderWithProviders(<MetricLabel label="Count" value={42} />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render string value", () => {
      renderWithProviders(<MetricLabel label="Status" value="Active" />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render both label and value", () => {
      renderWithProviders(<MetricLabel label="Users" value={100} />);

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should render container box", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="Test" value="Value" />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });
  });

  describe("Value Types", () => {
    it("should handle zero value", () => {
      renderWithProviders(<MetricLabel label="Count" value={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle negative value", () => {
      renderWithProviders(<MetricLabel label="Change" value={-5} />);

      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("should handle large numbers", () => {
      renderWithProviders(<MetricLabel label="Population" value={1000000} />);

      expect(screen.getByText("1000000")).toBeInTheDocument();
    });

    it("should handle decimal numbers", () => {
      renderWithProviders(<MetricLabel label="Percentage" value={75.5} />);

      expect(screen.getByText("75.5")).toBeInTheDocument();
    });

    it("should handle empty string value", () => {
      renderWithProviders(<MetricLabel label="Label" value="" />);

      const container = screen.getByText("Label").parentElement;
      expect(container).toBeInTheDocument();
    });

    it("should handle long string value", () => {
      renderWithProviders(
        <MetricLabel
          label="Description"
          value="This is a very long description that might wrap"
        />,
      );

      expect(
        screen.getByText("This is a very long description that might wrap"),
      ).toBeInTheDocument();
    });
  });

  describe("Label Prop", () => {
    it("should handle short label", () => {
      renderWithProviders(<MetricLabel label="ID" value={123} />);

      expect(screen.getByText("ID")).toBeInTheDocument();
    });

    it("should handle long label", () => {
      renderWithProviders(
        <MetricLabel
          label="Very Long Label That Describes Something"
          value={10}
        />,
      );

      expect(
        screen.getByText("Very Long Label That Describes Something"),
      ).toBeInTheDocument();
    });

    it("should handle label with special characters", () => {
      renderWithProviders(<MetricLabel label="Users & Groups" value={50} />);

      expect(screen.getByText("Users & Groups")).toBeInTheDocument();
    });

    it("should handle label with numbers", () => {
      renderWithProviders(<MetricLabel label="Section 123" value={100} />);

      expect(screen.getByText("Section 123")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render Container as parent", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="Test" value={1} />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should render two Typography elements", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="Test" value={1} />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies.length).toBe(2);
    });

    it("should render label before value in DOM order", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="First" value="Second" />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies[0].textContent).toBe("First");
      expect(typographies[1].textContent).toBe("Second");
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

      renderWithProviders(<MetricLabel label="Test" value={100} />, { store });

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

      renderWithProviders(<MetricLabel label="Test" value={100} />, { store });

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  describe("Props Updates", () => {
    it("should update when label changes", () => {
      const { rerender } = renderWithProviders(
        <MetricLabel label="Original" value={10} />,
      );

      expect(screen.getByText("Original")).toBeInTheDocument();

      rerender(<MetricLabel label="Updated" value={10} />);

      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Original")).not.toBeInTheDocument();
    });

    it("should update when value changes", () => {
      const { rerender } = renderWithProviders(
        <MetricLabel label="Count" value={5} />,
      );

      expect(screen.getByText("5")).toBeInTheDocument();

      rerender(<MetricLabel label="Count" value={10} />);

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("should update both label and value", () => {
      const { rerender } = renderWithProviders(
        <MetricLabel label="First" value={1} />,
      );

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();

      rerender(<MetricLabel label="Second" value={2} />);

      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic structure", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="Accessible" value={100} />,
      );

      const box = container.querySelector(".MuiBox-root");
      const typographies = container.querySelectorAll(".MuiTypography-root");

      expect(box).toBeInTheDocument();
      expect(typographies.length).toBe(2);
    });

    it("should render readable text", () => {
      renderWithProviders(
        <MetricLabel label="Screen Reader Text" value={42} />,
      );

      expect(screen.getByText("Screen Reader Text")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should maintain label-value relationship in DOM", () => {
      const { container } = renderWithProviders(
        <MetricLabel label="Label" value="Value" />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      const labelIndex = Array.from(typographies).findIndex(
        (t) => t.textContent === "Label",
      );
      const valueIndex = Array.from(typographies).findIndex(
        (t) => t.textContent === "Value",
      );

      expect(labelIndex).toBeLessThan(valueIndex);
    });
  });

  describe("Edge Cases", () => {
    it("should handle value as zero string", () => {
      renderWithProviders(<MetricLabel label="Test" value="0" />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle boolean-like strings", () => {
      renderWithProviders(<MetricLabel label="Status" value="true" />);

      expect(screen.getByText("true")).toBeInTheDocument();
    });

    it("should handle special number formats", () => {
      renderWithProviders(<MetricLabel label="Percent" value="99.99%" />);

      expect(screen.getByText("99.99%")).toBeInTheDocument();
    });

    it("should handle currency strings", () => {
      renderWithProviders(<MetricLabel label="Price" value="$1,234.56" />);

      expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    });
  });
});
