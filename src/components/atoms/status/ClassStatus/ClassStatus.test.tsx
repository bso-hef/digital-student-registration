import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../../tests/utils/test-utils";
import ClassStatus from "./index";

/**
 * Component tests for ClassStatus
 * @file src/components/atoms/status/ClassStatus/ClassStatus.test.tsx
 */

describe("ClassStatus", () => {
  describe("Active Status", () => {
    it("should render active icon when active is true", () => {
      renderWithProviders(<ClassStatus active={true} />);

      // CheckCircleRoundedIcon should be present
      const svg = document.querySelector(
        'svg[data-testid="CheckCircleRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
    });

    it('should render "Active" label when active is true', () => {
      renderWithProviders(<ClassStatus active={true} />);

      // Should show "Active" text (or translated version)
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });

    it("should render active status with label by default", () => {
      renderWithProviders(<ClassStatus active={true} />);

      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });
  });

  describe("Inactive Status", () => {
    it("should render inactive icon when active is false", () => {
      renderWithProviders(<ClassStatus active={false} />);

      // CancelRoundedIcon should be present
      const svg = document.querySelector(
        'svg[data-testid="CancelRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
    });

    it('should render "Inactive" label when active is false', () => {
      renderWithProviders(<ClassStatus active={false} />);

      // Should show "Inactive" text (or translated version)
      expect(screen.getByText(/Inactive/i)).toBeInTheDocument();
    });
  });

  describe("Incomplete Status", () => {
    it("should render incomplete icon when incomplete is true", () => {
      renderWithProviders(<ClassStatus active={false} incomplete={true} />);

      // WarningAmberRoundedIcon should be present
      const svg = document.querySelector(
        'svg[data-testid="WarningAmberRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
    });

    it('should render "Incomplete" label when incomplete is true', () => {
      renderWithProviders(<ClassStatus active={false} incomplete={true} />);

      // Should show "Incomplete" text (or translated version)
      expect(screen.getByText(/Incomplete/i)).toBeInTheDocument();
    });

    it("should prioritize incomplete over active status", () => {
      renderWithProviders(<ClassStatus active={true} incomplete={true} />);

      // Should show incomplete status even though active is true
      expect(screen.getByText(/Incomplete/i)).toBeInTheDocument();
      expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();

      const svg = document.querySelector(
        'svg[data-testid="WarningAmberRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
    });

    it("should prioritize incomplete over inactive status", () => {
      renderWithProviders(<ClassStatus active={false} incomplete={true} />);

      // Should show incomplete status even though active is false
      expect(screen.getByText(/Incomplete/i)).toBeInTheDocument();
      expect(screen.queryByText(/Inactive/i)).not.toBeInTheDocument();

      const svg = document.querySelector(
        'svg[data-testid="WarningAmberRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
    });

    it("should show active status when incomplete is false", () => {
      renderWithProviders(<ClassStatus active={true} incomplete={false} />);

      // Should show active status when not incomplete
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
      expect(screen.queryByText(/Incomplete/i)).not.toBeInTheDocument();
    });
  });

  describe("Label Display", () => {
    it("should show label when showLabel is true", () => {
      renderWithProviders(<ClassStatus active={true} showLabel={true} />);

      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });

    it("should hide label when showLabel is false", () => {
      renderWithProviders(<ClassStatus active={true} showLabel={false} />);

      expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    });

    it("should show label by default", () => {
      renderWithProviders(<ClassStatus active={false} />);

      expect(screen.getByText(/Inactive/i)).toBeInTheDocument();
    });
  });

  describe("Icon and Label Combination", () => {
    it("should render both icon and label for active status", () => {
      renderWithProviders(<ClassStatus active={true} showLabel={true} />);

      const svg = document.querySelector(
        'svg[data-testid="CheckCircleRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });

    it("should render both icon and label for inactive status", () => {
      renderWithProviders(<ClassStatus active={false} showLabel={true} />);

      const svg = document.querySelector(
        'svg[data-testid="CancelRoundedIcon"]',
      );
      expect(svg).toBeInTheDocument();
      expect(screen.getByText(/Inactive/i)).toBeInTheDocument();
    });

    it("should render only icon when showLabel is false", () => {
      renderWithProviders(<ClassStatus active={true} showLabel={false} />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should render within a container", () => {
      const { container } = renderWithProviders(<ClassStatus active={true} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render with proper structure", () => {
      renderWithProviders(<ClassStatus active={true} />);

      // Should have an icon (svg element)
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();

      // Should have text
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });
  });
});
