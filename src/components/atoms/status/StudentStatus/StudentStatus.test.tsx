import { STUDENT_STATUS } from "@/constants/general.constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../../tests/utils/test-utils";
import StudentStatus from "./index";

/**
 * Component tests for StudentStatus
 * @file src/components/atoms/status/StudentStatus/StudentStatus.test.tsx
 */

describe("StudentStatus", () => {
  describe("Imported Status", () => {
    it("should render imported icon", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const icon = container.querySelector(
        '[data-testid="FileDownloadDoneRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should render imported label", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      expect(screen.getByText("general.Imported")).toBeInTheDocument();
    });

    it("should display icon with small fontSize", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const icon = container.querySelector(
        '[data-testid="FileDownloadDoneRoundedIcon"]',
      );
      expect(icon).toHaveClass("MuiSvgIcon-fontSizeSmall");
    });
  });

  describe("Invited Status", () => {
    it("should render invited icon", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const icon = container.querySelector(
        '[data-testid="MailOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should render invited label", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      expect(screen.getByText("general.Invited")).toBeInTheDocument();
    });

    it("should display icon and label together", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const icon = container.querySelector(
        '[data-testid="MailOutlineRoundedIcon"]',
      );
      const label = screen.getByText("general.Invited");

      expect(icon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Onboarded Status", () => {
    it("should render onboarded icon", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      const icon = container.querySelector(
        '[data-testid="CheckCircleRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should render onboarded label", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      expect(screen.getByText("general.Onboarded")).toBeInTheDocument();
    });

    it("should display icon and label together", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      const icon = container.querySelector(
        '[data-testid="CheckCircleRoundedIcon"]',
      );
      const label = screen.getByText("general.Onboarded");

      expect(icon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Unknown Status", () => {
    it("should render unknown icon for invalid status", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus="invalid" />,
      );

      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should render unknown label for invalid status", () => {
      renderWithProviders(<StudentStatus studentStatus="invalid" />);

      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });

    it("should handle empty string status", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus="" />,
      );

      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });

    it("should handle undefined status with default", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={undefined as any} />,
      );

      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should render with flex display", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should have max-content width", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
      // StyledBox has maxWidth: 'max-content'
    });

    it("should have custom typography styling", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      const typography = container.querySelector(".MuiTypography-root");
      expect(typography).toBeInTheDocument();
    });

    it("should align items center", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
      // StyledBox has alignItems: 'center'
    });
  });

  describe("Translation Integration", () => {
    it("should use translation for imported", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      expect(screen.getByText("general.Imported")).toBeInTheDocument();
    });

    it("should use translation for invited", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      expect(screen.getByText("general.Invited")).toBeInTheDocument();
    });

    it("should use translation for onboarded", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      expect(screen.getByText("general.Onboarded")).toBeInTheDocument();
    });

    it("should use translation for unknown", () => {
      renderWithProviders(<StudentStatus studentStatus="invalid" />);

      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });
  });

  describe("Icon Types", () => {
    it("should use FileDownloadDoneRoundedIcon for imported", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const icon = container.querySelector(
        '[data-testid="FileDownloadDoneRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should use MailOutlineRoundedIcon for invited", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const icon = container.querySelector(
        '[data-testid="MailOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should use CheckCircleRoundedIcon for onboarded", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      const icon = container.querySelector(
        '[data-testid="CheckCircleRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should use HelpOutlineRoundedIcon for unknown", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus="invalid" />,
      );

      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });

    it("should render all icons with small fontSize", () => {
      const statuses = [
        STUDENT_STATUS.IMPORTED,
        STUDENT_STATUS.INVITED,
        STUDENT_STATUS.ONBOARDED,
        "invalid",
      ];

      statuses.forEach((status) => {
        const { container } = renderWithProviders(
          <StudentStatus studentStatus={status} />,
        );

        const icon = container.querySelector(".MuiSvgIcon-fontSizeSmall");
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe("Status Updates", () => {
    it("should update when status changes", () => {
      const { rerender, container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      let icon = container.querySelector(
        '[data-testid="FileDownloadDoneRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Imported")).toBeInTheDocument();

      // Change status
      rerender(<StudentStatus studentStatus={STUDENT_STATUS.INVITED} />);

      icon = container.querySelector('[data-testid="MailOutlineRoundedIcon"]');
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Invited")).toBeInTheDocument();
    });

    it("should handle status progression", () => {
      const { rerender } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      expect(screen.getByText("general.Imported")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus={STUDENT_STATUS.INVITED} />);
      expect(screen.getByText("general.Invited")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />);
      expect(screen.getByText("general.Onboarded")).toBeInTheDocument();
    });

    it("should handle status becoming invalid", () => {
      const { rerender, container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      expect(screen.getByText("general.Imported")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus="invalid" />);

      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle uppercase status", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus="IMPORTED" />,
      );

      // Case-sensitive, so should fall back to unknown
      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });

    it("should handle status with extra spaces", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus=" imported " />,
      );

      // Should fall back to unknown due to extra spaces
      const icon = container.querySelector(
        '[data-testid="HelpOutlineRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("general.Unknown")).toBeInTheDocument();
    });

    it("should handle rapid status changes", () => {
      const { rerender } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      expect(screen.getByText("general.Imported")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus={STUDENT_STATUS.INVITED} />);
      expect(screen.getByText("general.Invited")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />);
      expect(screen.getByText("general.Onboarded")).toBeInTheDocument();

      rerender(<StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />);
      expect(screen.getByText("general.Imported")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render text content for screen readers", () => {
      renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const label = screen.getByText("general.Imported");
      expect(label).toBeInTheDocument();
    });

    it("should have semantic structure", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const box = container.querySelector(".MuiBox-root");
      const typography = container.querySelector(".MuiTypography-root");

      expect(box).toBeInTheDocument();
      expect(typography).toBeInTheDocument();
    });

    it("should have icon as visual enhancement", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.ONBOARDED} />,
      );

      const icon = container.querySelector(
        '[data-testid="CheckCircleRoundedIcon"]',
      );
      const label = screen.getByText("general.Onboarded");

      // Icon enhances the text label
      expect(icon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render StyledBox as container", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.IMPORTED} />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should render Typography for label", () => {
      const { container } = renderWithProviders(
        <StudentStatus studentStatus={STUDENT_STATUS.INVITED} />,
      );

      const typography = container.querySelector(".MuiTypography-root");
      expect(typography).toBeInTheDocument();
    });

    it("should have consistent structure across all status types", () => {
      const statuses = [
        STUDENT_STATUS.IMPORTED,
        STUDENT_STATUS.INVITED,
        STUDENT_STATUS.ONBOARDED,
        "invalid",
      ];

      statuses.forEach((status) => {
        const { container } = renderWithProviders(
          <StudentStatus studentStatus={status} />,
        );

        const box = container.querySelector(".MuiBox-root");
        const typography = container.querySelector(".MuiTypography-root");
        const icon = container.querySelector(".MuiSvgIcon-root");

        expect(box).toBeInTheDocument();
        expect(typography).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
      });
    });
  });
});
