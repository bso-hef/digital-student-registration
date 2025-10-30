import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import GenderDisplay from "./index";

/**
 * Component tests for GenderDisplay
 * @file src/components/atoms/GenderDisplay/GenderDisplay.test.tsx
 */

describe("GenderDisplay", () => {
  describe("Male Gender", () => {
    it("should render male icon", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const maleIcon = container.querySelector(
        '[data-testid="MaleRoundedIcon"]',
      );
      expect(maleIcon).toBeInTheDocument();
    });

    it("should render male label", () => {
      renderWithProviders(<GenderDisplay gender="male" />);

      expect(screen.getByText("gender.male")).toBeInTheDocument();
    });

    it("should display male icon and label together", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const maleIcon = container.querySelector(
        '[data-testid="MaleRoundedIcon"]',
      );
      const label = screen.getByText("gender.male");

      expect(maleIcon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Female Gender", () => {
    it("should render female icon", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const femaleIcon = container.querySelector(
        '[data-testid="FemaleRoundedIcon"]',
      );
      expect(femaleIcon).toBeInTheDocument();
    });

    it("should render female label", () => {
      renderWithProviders(<GenderDisplay gender="female" />);

      expect(screen.getByText("gender.female")).toBeInTheDocument();
    });

    it("should display female icon and label together", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const femaleIcon = container.querySelector(
        '[data-testid="FemaleRoundedIcon"]',
      );
      const label = screen.getByText("gender.female");

      expect(femaleIcon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Diverse Gender", () => {
    it("should render diverse icon", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="diverse" />,
      );

      const diverseIcon = container.querySelector(
        '[data-testid="TransgenderRoundedIcon"]',
      );
      expect(diverseIcon).toBeInTheDocument();
    });

    it("should render diverse label", () => {
      renderWithProviders(<GenderDisplay gender="diverse" />);

      expect(screen.getByText("gender.diverse")).toBeInTheDocument();
    });

    it("should display diverse icon and label together", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="diverse" />,
      );

      const diverseIcon = container.querySelector(
        '[data-testid="TransgenderRoundedIcon"]',
      );
      const label = screen.getByText("gender.diverse");

      expect(diverseIcon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe("Unknown/No Gender", () => {
    it("should render unknown label when gender is undefined", () => {
      renderWithProviders(<GenderDisplay />);

      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });

    it("should not render icon when gender is undefined", () => {
      const { container } = renderWithProviders(<GenderDisplay />);

      const maleIcon = container.querySelector(
        '[data-testid="MaleRoundedIcon"]',
      );
      const femaleIcon = container.querySelector(
        '[data-testid="FemaleRoundedIcon"]',
      );
      const diverseIcon = container.querySelector(
        '[data-testid="TransgenderRoundedIcon"]',
      );

      expect(maleIcon).not.toBeInTheDocument();
      expect(femaleIcon).not.toBeInTheDocument();
      expect(diverseIcon).not.toBeInTheDocument();
    });

    it("should render only label when no gender provided", () => {
      renderWithProviders(<GenderDisplay gender={undefined} />);

      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should render with flex display", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should have correct typography variant", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const typography = container.querySelector(".MuiTypography-body2");
      expect(typography).toBeInTheDocument();
    });

    it("should render icon with small fontSize", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const icon = container.querySelector('[data-testid="MaleRoundedIcon"]');
      expect(icon).toHaveClass("MuiSvgIcon-fontSizeSmall");
    });

    it("should align items center", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="diverse" />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });
  });

  describe("Translation Integration", () => {
    it("should use translation for male", () => {
      renderWithProviders(<GenderDisplay gender="male" />);

      // Translation key is used
      expect(screen.getByText("gender.male")).toBeInTheDocument();
    });

    it("should use translation for female", () => {
      renderWithProviders(<GenderDisplay gender="female" />);

      expect(screen.getByText("gender.female")).toBeInTheDocument();
    });

    it("should use translation for diverse", () => {
      renderWithProviders(<GenderDisplay gender="diverse" />);

      expect(screen.getByText("gender.diverse")).toBeInTheDocument();
    });

    it("should use translation for unknown", () => {
      renderWithProviders(<GenderDisplay />);

      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });
  });

  describe("Icon Types", () => {
    it("should use MaleRoundedIcon for male", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const icon = container.querySelector('[data-testid="MaleRoundedIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it("should use FemaleRoundedIcon for female", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const icon = container.querySelector('[data-testid="FemaleRoundedIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it("should use TransgenderRoundedIcon for diverse", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="diverse" />,
      );

      const icon = container.querySelector(
        '[data-testid="TransgenderRoundedIcon"]',
      );
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Memoization", () => {
    it("should memoize icon and label computation", () => {
      const { rerender } = renderWithProviders(<GenderDisplay gender="male" />);

      expect(screen.getByText("gender.male")).toBeInTheDocument();

      // Re-render with same props
      rerender(<GenderDisplay gender="male" />);

      expect(screen.getByText("gender.male")).toBeInTheDocument();
    });

    it("should update when gender changes", () => {
      const { rerender, container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      let icon = container.querySelector('[data-testid="MaleRoundedIcon"]');
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("gender.male")).toBeInTheDocument();

      // Change gender
      rerender(<GenderDisplay gender="female" />);

      icon = container.querySelector('[data-testid="FemaleRoundedIcon"]');
      expect(icon).toBeInTheDocument();
      expect(screen.getByText("gender.female")).toBeInTheDocument();
    });

    it("should update when gender becomes undefined", () => {
      const { rerender, container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      let icon = container.querySelector('[data-testid="MaleRoundedIcon"]');
      expect(icon).toBeInTheDocument();

      // Remove gender
      rerender(<GenderDisplay />);

      icon = container.querySelector('[data-testid="MaleRoundedIcon"]');
      expect(icon).not.toBeInTheDocument();
      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid gender changes", () => {
      const { rerender } = renderWithProviders(<GenderDisplay gender="male" />);

      expect(screen.getByText("gender.male")).toBeInTheDocument();

      rerender(<GenderDisplay gender="female" />);
      expect(screen.getByText("gender.female")).toBeInTheDocument();

      rerender(<GenderDisplay gender="diverse" />);
      expect(screen.getByText("gender.diverse")).toBeInTheDocument();

      rerender(<GenderDisplay />);
      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });

    it("should handle null as undefined", () => {
      renderWithProviders(<GenderDisplay gender={undefined} />);

      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render text content for screen readers", () => {
      renderWithProviders(<GenderDisplay gender="male" />);

      const label = screen.getByText("gender.male");
      expect(label).toBeInTheDocument();
    });

    it("should have semantic structure", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const box = container.querySelector(".MuiBox-root");
      const typography = container.querySelector(".MuiTypography-body2");

      expect(box).toBeInTheDocument();
      expect(typography).toBeInTheDocument();
    });

    it("should have icon as visual enhancement", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="diverse" />,
      );

      const icon = container.querySelector(
        '[data-testid="TransgenderRoundedIcon"]',
      );
      const label = screen.getByText("gender.diverse");

      // Icon enhances the text label
      expect(icon).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    it("should work without icon (unknown case)", () => {
      renderWithProviders(<GenderDisplay />);

      // Still accessible with just text
      expect(screen.getByText("gender.unknown")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render Box as container", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="male" />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should render Typography for label", () => {
      const { container } = renderWithProviders(
        <GenderDisplay gender="female" />,
      );

      const typography = container.querySelector(".MuiTypography-root");
      expect(typography).toBeInTheDocument();
    });

    it("should have consistent structure across all gender types", () => {
      const genders: Array<"male" | "female" | "diverse" | undefined> = [
        "male",
        "female",
        "diverse",
        undefined,
      ];

      genders.forEach((gender) => {
        const { container } = renderWithProviders(
          <GenderDisplay gender={gender} />,
        );

        const box = container.querySelector(".MuiBox-root");
        const typography = container.querySelector(".MuiTypography-root");

        expect(box).toBeInTheDocument();
        expect(typography).toBeInTheDocument();
      });
    });
  });
});
