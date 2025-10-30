import { THEME } from "@/constants/general.constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import HealthIndicator from "./index";

/**
 * Component tests for HealthIndicator
 * @file src/components/atoms/dashboard/HealthIndicator/HealthIndicator.test.tsx
 */

describe("HealthIndicator", () => {
  describe("Basic Rendering - Status Up", () => {
    it("should render with up status", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      expect(chip).toBeInTheDocument();
    });

    it("should render default label for up status", () => {
      renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should render status dot for up", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const statusDot = container.querySelector(".MuiBox-root");
      expect(statusDot).toBeInTheDocument();
    });

    it("should render as small chip", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-sizeSmall");
      expect(chip).toBeInTheDocument();
    });
  });

  describe("Basic Rendering - Status Down", () => {
    it("should render with down status", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="down" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      expect(chip).toBeInTheDocument();
    });

    it("should render default label for down status", () => {
      renderWithProviders(<HealthIndicator status="down" />);

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should render status dot for down", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="down" />,
      );

      const statusDot = container.querySelector(".MuiBox-root");
      expect(statusDot).toBeInTheDocument();
    });
  });

  describe("Custom Label", () => {
    it("should render custom label when provided for up status", () => {
      renderWithProviders(<HealthIndicator status="up" label="Online" />);

      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(screen.queryByText("UP")).not.toBeInTheDocument();
    });

    it("should render custom label when provided for down status", () => {
      renderWithProviders(<HealthIndicator status="down" label="Offline" />);

      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("DOWN")).not.toBeInTheDocument();
    });

    it("should handle long custom labels", () => {
      renderWithProviders(
        <HealthIndicator status="up" label="Service Running Successfully" />,
      );

      expect(
        screen.getByText("Service Running Successfully"),
      ).toBeInTheDocument();
    });

    it("should handle short custom labels", () => {
      renderWithProviders(<HealthIndicator status="up" label="OK" />);

      expect(screen.getByText("OK")).toBeInTheDocument();
    });

    it("should handle empty string label", () => {
      renderWithProviders(<HealthIndicator status="up" label="" />);

      // Empty string is falsy, so should fall back to default "UP"
      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should handle labels with special characters", () => {
      renderWithProviders(
        <HealthIndicator status="up" label="Status: Active" />,
      );

      expect(screen.getByText("Status: Active")).toBeInTheDocument();
    });
  });

  describe("Default Label Behavior", () => {
    it("should uppercase status when no label provided for up", () => {
      renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should uppercase status when no label provided for down", () => {
      renderWithProviders(<HealthIndicator status="down" />);

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should use toUpperCase method on status", () => {
      // Testing that "up" becomes "UP"
      renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render StyledChip as container", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      expect(chip).toBeInTheDocument();
    });

    it("should render chip with icon (status dot)", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      const icon = container.querySelector(".MuiBox-root");

      expect(chip).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });

    it("should render chip with label", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" label="Active" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      const label = container.querySelector(".MuiChip-label");

      expect(chip).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe("Active");
    });

    it("should have small size", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-sizeSmall");
      expect(chip).toBeInTheDocument();
    });
  });

  describe("Theme Integration", () => {
    it("should render in light theme with up status", () => {
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

      renderWithProviders(<HealthIndicator status="up" />, { store });

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should render in dark theme with up status", () => {
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

      renderWithProviders(<HealthIndicator status="up" />, { store });

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should render in light theme with down status", () => {
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

      renderWithProviders(<HealthIndicator status="down" />, { store });

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should render in dark theme with down status", () => {
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

      renderWithProviders(<HealthIndicator status="down" />, { store });

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });
  });

  describe("Props Updates", () => {
    it("should update when status changes from up to down", () => {
      const { rerender } = renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();

      rerender(<HealthIndicator status="down" />);

      expect(screen.getByText("DOWN")).toBeInTheDocument();
      expect(screen.queryByText("UP")).not.toBeInTheDocument();
    });

    it("should update when status changes from down to up", () => {
      const { rerender } = renderWithProviders(
        <HealthIndicator status="down" />,
      );

      expect(screen.getByText("DOWN")).toBeInTheDocument();

      rerender(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
      expect(screen.queryByText("DOWN")).not.toBeInTheDocument();
    });

    it("should update when label changes", () => {
      const { rerender } = renderWithProviders(
        <HealthIndicator status="up" label="Original" />,
      );

      expect(screen.getByText("Original")).toBeInTheDocument();

      rerender(<HealthIndicator status="up" label="Updated" />);

      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Original")).not.toBeInTheDocument();
    });

    it("should update when label is added", () => {
      const { rerender } = renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();

      rerender(<HealthIndicator status="up" label="Active" />);

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.queryByText("UP")).not.toBeInTheDocument();
    });

    it("should update when label is removed", () => {
      const { rerender } = renderWithProviders(
        <HealthIndicator status="up" label="Active" />,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();

      rerender(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
      expect(screen.queryByText("Active")).not.toBeInTheDocument();
    });

    it("should update both status and label", () => {
      const { rerender } = renderWithProviders(
        <HealthIndicator status="up" label="Online" />,
      );

      expect(screen.getByText("Online")).toBeInTheDocument();

      rerender(<HealthIndicator status="down" label="Offline" />);

      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic chip structure", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const chip = container.querySelector(".MuiChip-root");
      expect(chip).toBeInTheDocument();
    });

    it("should render readable text for up status", () => {
      renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should render readable text for down status", () => {
      renderWithProviders(<HealthIndicator status="down" />);

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should render custom label for screen readers", () => {
      renderWithProviders(
        <HealthIndicator status="up" label="Service is healthy" />,
      );

      expect(screen.getByText("Service is healthy")).toBeInTheDocument();
    });

    it("should have label element", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" />,
      );

      const label = container.querySelector(".MuiChip-label");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid status changes", () => {
      const { rerender } = renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();

      rerender(<HealthIndicator status="down" />);
      expect(screen.getByText("DOWN")).toBeInTheDocument();

      rerender(<HealthIndicator status="up" />);
      expect(screen.getByText("UP")).toBeInTheDocument();

      rerender(<HealthIndicator status="down" />);
      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should handle label with numbers", () => {
      renderWithProviders(<HealthIndicator status="up" label="Server 123" />);

      expect(screen.getByText("Server 123")).toBeInTheDocument();
    });

    it("should handle label with symbols", () => {
      renderWithProviders(
        <HealthIndicator status="up" label="✓ Operational" />,
      );

      expect(screen.getByText("✓ Operational")).toBeInTheDocument();
    });

    it("should maintain status dot with custom label", () => {
      const { container } = renderWithProviders(
        <HealthIndicator status="up" label="Custom" />,
      );

      const statusDot = container.querySelector(".MuiBox-root");
      expect(statusDot).toBeInTheDocument();
      expect(screen.getByText("Custom")).toBeInTheDocument();
    });
  });

  describe("Visual States", () => {
    it("should render up status indicator", () => {
      renderWithProviders(<HealthIndicator status="up" />);

      expect(screen.getByText("UP")).toBeInTheDocument();
    });

    it("should render down status indicator", () => {
      renderWithProviders(<HealthIndicator status="down" />);

      expect(screen.getByText("DOWN")).toBeInTheDocument();
    });

    it("should differentiate up and down visually", () => {
      const { container: upContainer } = renderWithProviders(
        <HealthIndicator status="up" />,
      );
      const { container: downContainer } = renderWithProviders(
        <HealthIndicator status="down" />,
      );

      expect(upContainer.querySelector(".MuiChip-root")).toBeInTheDocument();
      expect(downContainer.querySelector(".MuiChip-root")).toBeInTheDocument();
    });
  });
});
