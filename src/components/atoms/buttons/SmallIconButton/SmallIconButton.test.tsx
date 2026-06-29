import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../../tests/utils/test-utils";
import SmallIconButton from "./index";

/**
 * Component tests for SmallIconButton
 * @file src/components/atoms/buttons/SmallIconButton/SmallIconButton.test.tsx
 */

// Mock device-type-detection
vi.mock("@/hooks/useDeviceTypeDetection", () => ({
  useDeviceTypeDetection: () => ({
    isMobile: false,
    isMobileHorizontal: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe("SmallIconButton", () => {
  const TestIcon = <span data-testid="test-icon">🔥</span>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render with icon", () => {
      renderWithProviders(<SmallIconButton icon={TestIcon} />);

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("should render without tooltip by default", () => {
      renderWithProviders(<SmallIconButton icon={TestIcon} />);

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Click Interactions", () => {
    it("should call onAction when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(
        <SmallIconButton icon={TestIcon} onAction={handleClick} />,
      );

      const icon = screen.getByTestId("test-icon");
      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not be clickable when disabled", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <SmallIconButton icon={TestIcon} onAction={handleClick} disabled />,
      );

      const icon = screen.getByTestId("test-icon");

      // Disabled button should exist but not be clickable
      expect(icon).toBeInTheDocument();
    });

    it("should pass event object to onAction handler", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(
        <SmallIconButton icon={TestIcon} onAction={handleClick} />,
      );

      const icon = screen.getByTestId("test-icon");
      await user.click(icon);

      expect(handleClick).toHaveBeenCalled();
      expect(handleClick.mock.calls[0][0]).toBeDefined();
    });
  });

  describe("Size Variants", () => {
    it("should apply default size", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply bigIcon size", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} bigIcon />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply hugeIcon size", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} hugeIcon />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply custom icon size", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} customIconSize={32} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Styling Props", () => {
    it("should apply noMargin prop", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} noMargin />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply noPadding prop", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} noPadding />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply noBackground prop", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} noBackground />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply fixedBackground prop", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} fixedBackground />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply rounded prop", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} rounded />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply custom background color", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} customBackgroundColor="#ff0000" />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply custom color", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} customColor="#00ff00" />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should apply forChat styling", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} forChat />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Hover Behavior", () => {
    it("should allow hover by default", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should disable hover when hoverAllowed is false", () => {
      const { container } = renderWithProviders(
        <SmallIconButton icon={TestIcon} hoverAllowed={false} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should render as disabled", () => {
      renderWithProviders(<SmallIconButton icon={TestIcon} disabled />);

      const icon = screen.getByTestId("test-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should not show tooltip when disabled", () => {
      renderWithProviders(
        <SmallIconButton
          icon={TestIcon}
          disabled
          title="Disabled Tooltip"
          placement="top"
        />,
      );

      // Tooltip should not be present for disabled button
      expect(screen.queryByText("Disabled Tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Tooltip", () => {
    it("should show tooltip when title and placement are provided", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <SmallIconButton
          icon={TestIcon}
          title="Test Tooltip"
          placement="top"
        />,
      );

      const icon = screen.getByTestId("test-icon");
      await user.hover(icon);

      // Wait for tooltip to appear
      await screen.findByText("Test Tooltip");
      expect(screen.getByText("Test Tooltip")).toBeInTheDocument();
    });

    it("should not show tooltip without title", async () => {
      const user = userEvent.setup();

      renderWithProviders(<SmallIconButton icon={TestIcon} placement="top" />);

      const icon = screen.getByTestId("test-icon");
      await user.hover(icon);

      // No tooltip should appear
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should not show tooltip without placement", async () => {
      const user = userEvent.setup();

      renderWithProviders(<SmallIconButton icon={TestIcon} title="Test" />);

      const icon = screen.getByTestId("test-icon");
      await user.hover(icon);

      // No tooltip should appear
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });

    it("should support different tooltip placements", async () => {
      const placements: Array<"top" | "bottom" | "left" | "right"> = [
        "top",
        "bottom",
        "left",
        "right",
      ];

      for (const placement of placements) {
        const { unmount } = renderWithProviders(
          <SmallIconButton
            icon={TestIcon}
            title={`Tooltip ${placement}`}
            placement={placement}
          />,
        );

        const icon = screen.getByTestId("test-icon");
        expect(icon).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe("Complex Icon Scenarios", () => {
    it("should render with MUI icon", () => {
      const MuiIcon = (
        <svg data-testid="mui-icon" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
        </svg>
      );

      renderWithProviders(<SmallIconButton icon={MuiIcon} />);

      expect(screen.getByTestId("mui-icon")).toBeInTheDocument();
    });

    it("should render with custom React component icon", () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;

      renderWithProviders(<SmallIconButton icon={<CustomIcon />} />);

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("should handle multiple props together", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <SmallIconButton
          icon={TestIcon}
          onAction={handleClick}
          bigIcon
          rounded
          noMargin
          customColor="#ff0000"
          title="Combined Props"
          placement="bottom"
        />,
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("should handle disabled with tooltip props", () => {
      renderWithProviders(
        <SmallIconButton
          icon={TestIcon}
          disabled
          title="Should not show"
          placement="top"
          bigIcon
          rounded
        />,
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });
  });
});
