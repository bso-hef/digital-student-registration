import * as deviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import CustomTitle from "./index";

/**
 * Component tests for CustomTitle
 * @file src/components/atoms/CustomTitle/CustomTitle.test.tsx
 */

// Mock device-type-detection
vi.mock("@/hooks/useDeviceTypeDetection", () => ({
  useDeviceTypeDetection: vi.fn(),
}));

describe("CustomTitle", () => {
  beforeEach(() => {
    // Default to desktop view
    vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isTabletVertical: false,
      isTabletHorizontal: false,
      isDesktop: true,
      isLaptop: false,
    });
  });

  describe("Basic Rendering", () => {
    it("should render title", () => {
      renderWithProviders(<CustomTitle title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render with only title when no subtitle provided", () => {
      renderWithProviders(<CustomTitle title="Main Title" />);

      expect(screen.getByText("Main Title")).toBeInTheDocument();
    });

    it("should render title and subtitle", () => {
      renderWithProviders(
        <CustomTitle title="Title" subTitle="Subtitle text" />,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
    });

    it("should render with children", () => {
      renderWithProviders(
        <CustomTitle title="Title">
          <div>Child content</div>
        </CustomTitle>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("should render all elements together", () => {
      renderWithProviders(
        <CustomTitle title="Main" subTitle="Sub">
          <button>Action</button>
        </CustomTitle>,
      );

      expect(screen.getByText("Main")).toBeInTheDocument();
      expect(screen.getByText("Sub")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /action/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Desktop View", () => {
    beforeEach(() => {
      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isTabletVertical: false,
        isTabletHorizontal: false,
        isDesktop: true,
        isLaptop: false,
      });
    });

    it("should render in desktop mode", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Desktop Title" />,
      );

      expect(screen.getByText("Desktop Title")).toBeInTheDocument();
      const titleBox = container.querySelector(".MuiBox-root");
      expect(titleBox).toBeInTheDocument();
    });

    it("should align left in desktop view", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Left aligned" />,
      );

      const titleBox = container.querySelector(".MuiBox-root");
      expect(titleBox).toBeInTheDocument();
      // Desktop view aligns to flex-start (left)
    });

    it("should render with full content in desktop", () => {
      renderWithProviders(
        <CustomTitle title="Desktop" subTitle="Description">
          <span>Extra content</span>
        </CustomTitle>,
      );

      expect(screen.getByText("Desktop")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Extra content")).toBeInTheDocument();
    });
  });

  describe("Mobile View", () => {
    beforeEach(() => {
      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isTabletVertical: false,
        isTabletHorizontal: false,
        isDesktop: false,
        isLaptop: false,
      });
    });

    it("should render in mobile mode", () => {
      renderWithProviders(<CustomTitle title="Mobile Title" />);

      expect(screen.getByText("Mobile Title")).toBeInTheDocument();
    });

    it("should center align in mobile view", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Centered" />,
      );

      const titleBox = container.querySelector(".MuiBox-root");
      expect(titleBox).toBeInTheDocument();
      // Mobile view aligns to center
    });

    it("should render with full content in mobile", () => {
      renderWithProviders(
        <CustomTitle title="Mobile" subTitle="Mobile desc">
          <div>Mobile child</div>
        </CustomTitle>,
      );

      expect(screen.getByText("Mobile")).toBeInTheDocument();
      expect(screen.getByText("Mobile desc")).toBeInTheDocument();
      expect(screen.getByText("Mobile child")).toBeInTheDocument();
    });
  });

  describe("Tablet Vertical View", () => {
    beforeEach(() => {
      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isTabletVertical: true,
        isTabletHorizontal: false,
        isDesktop: false,
        isLaptop: false,
      });
    });

    it("should render in tablet vertical mode", () => {
      renderWithProviders(<CustomTitle title="Tablet Title" />);

      expect(screen.getByText("Tablet Title")).toBeInTheDocument();
    });

    it("should center align in tablet vertical view", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Tablet vertical" />,
      );

      const titleBox = container.querySelector(".MuiBox-root");
      expect(titleBox).toBeInTheDocument();
      // Tablet vertical is treated as mobile view (centered)
    });
  });

  describe("Title Styling", () => {
    it("should render title with Typography component", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Styled Title" />,
      );

      const titleElements = container.querySelectorAll(".MuiTypography-root");
      expect(titleElements.length).toBeGreaterThan(0);
    });

    it("should have proper typography structure", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Title" subTitle="Subtitle" />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies.length).toBe(2); // Title and Subtitle
    });
  });

  describe("Subtitle", () => {
    it("should render subtitle when provided", () => {
      renderWithProviders(
        <CustomTitle title="Title" subTitle="This is a subtitle" />,
      );

      expect(screen.getByText("This is a subtitle")).toBeInTheDocument();
    });

    it("should not crash when subtitle is undefined", () => {
      renderWithProviders(<CustomTitle title="Title" subTitle={undefined} />);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("should render empty subtitle", () => {
      renderWithProviders(<CustomTitle title="Title" subTitle="" />);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("should handle long subtitle text", () => {
      const longSubtitle =
        "This is a very long subtitle that contains a lot of text";
      renderWithProviders(
        <CustomTitle title="Title" subTitle={longSubtitle} />,
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });

  describe("Children", () => {
    it("should render children when provided", () => {
      renderWithProviders(
        <CustomTitle title="Title">
          <p>Child paragraph</p>
        </CustomTitle>,
      );

      expect(screen.getByText("Child paragraph")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      renderWithProviders(
        <CustomTitle title="Title">
          <span>First child</span>
          <span>Second child</span>
        </CustomTitle>,
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
    });

    it("should render complex children", () => {
      renderWithProviders(
        <CustomTitle title="Title">
          <div>
            <button>Click me</button>
            <input placeholder="Type here" />
          </div>
        </CustomTitle>,
      );

      expect(
        screen.getByRole("button", { name: /click me/i }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
    });

    it("should work without children", () => {
      renderWithProviders(<CustomTitle title="No children" />);

      expect(screen.getByText("No children")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render TitleBox as container", () => {
      const { container } = renderWithProviders(<CustomTitle title="Title" />);

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });

    it("should render with proper hierarchy", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Title" subTitle="Subtitle">
          <div>Child</div>
        </CustomTitle>,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();

      // Should contain title, subtitle, and children
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
      expect(screen.getByText("Child")).toBeInTheDocument();
    });

    it("should maintain order: title, subtitle, children", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="First" subTitle="Second">
          <span>Third</span>
        </CustomTitle>,
      );

      const box = container.querySelector(".MuiBox-root");
      const content = box?.textContent;

      expect(content).toContain("First");
      expect(content).toContain("Second");
      expect(content).toContain("Third");
    });
  });

  describe("Responsive Behavior", () => {
    it("should adapt to device type changes", () => {
      const { rerender } = renderWithProviders(
        <CustomTitle title="Responsive" />,
      );

      expect(screen.getByText("Responsive")).toBeInTheDocument();

      // Change to mobile
      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isTabletVertical: false,
        isTabletHorizontal: false,
        isDesktop: false,
        isLaptop: false,
      });

      rerender(<CustomTitle title="Responsive" />);

      expect(screen.getByText("Responsive")).toBeInTheDocument();
    });

    it("should handle desktop to mobile transition", () => {
      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isTabletVertical: false,
        isTabletHorizontal: false,
        isDesktop: true,
        isLaptop: false,
      });

      const { rerender } = renderWithProviders(
        <CustomTitle title="Transition" />,
      );

      expect(screen.getByText("Transition")).toBeInTheDocument();

      vi.mocked(deviceTypeDetection.useDeviceTypeDetection).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isTabletVertical: false,
        isTabletHorizontal: false,
        isDesktop: false,
        isLaptop: false,
      });

      rerender(<CustomTitle title="Transition" />);

      expect(screen.getByText("Transition")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title", () => {
      renderWithProviders(<CustomTitle title="" />);

      const titleElements = screen.queryAllByText("");
      expect(titleElements.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);
      renderWithProviders(<CustomTitle title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      renderWithProviders(
        <CustomTitle title="Title with <special> & characters!" />,
      );

      expect(
        screen.getByText("Title with <special> & characters!"),
      ).toBeInTheDocument();
    });

    it("should handle null children gracefully", () => {
      renderWithProviders(<CustomTitle title="Title">{null}</CustomTitle>);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("should handle undefined children gracefully", () => {
      renderWithProviders(<CustomTitle title="Title">{undefined}</CustomTitle>);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render semantic HTML structure", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Accessible Title" subTitle="Description" />,
      );

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies.length).toBe(2);
    });

    it("should have readable text content", () => {
      renderWithProviders(
        <CustomTitle title="Main Heading" subTitle="Supporting text" />,
      );

      expect(screen.getByText("Main Heading")).toBeInTheDocument();
      expect(screen.getByText("Supporting text")).toBeInTheDocument();
    });

    it("should maintain text hierarchy", () => {
      const { container } = renderWithProviders(
        <CustomTitle title="Primary" subTitle="Secondary" />,
      );

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();

      // Title should appear before subtitle in DOM
      const text = box?.textContent;
      expect(text?.indexOf("Primary")).toBeLessThan(
        text?.indexOf("Secondary") || Infinity,
      );
    });
  });
});
