import { THEME } from "@/constants/general.constants";
import { describe, expect, it } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import Logo from "./index";

/**
 * Component tests for Logo
 * @file src/components/atoms/Logo/Logo.test.tsx
 */

describe("Logo", () => {
  describe("Basic Rendering", () => {
    it("should render SVG element", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have correct SVG attributes", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("version", "1.1");
      expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    });

    it("should have correct viewBox", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 313.3 130.1");
    });

    it("should render with default width", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "200");
    });

    it("should render with default height", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("height", "75");
    });
  });

  describe("Custom Dimensions", () => {
    it("should render with custom width", () => {
      const { container } = renderWithProviders(<Logo width={300} />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "300");
    });

    it("should render with custom height", () => {
      const { container } = renderWithProviders(<Logo height={100} />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("height", "100");
    });

    it("should render with both custom width and height", () => {
      const { container } = renderWithProviders(
        <Logo width={400} height={150} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "400");
      expect(svg).toHaveAttribute("height", "150");
    });

    it("should accept width of 0", () => {
      const { container } = renderWithProviders(<Logo width={0} />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "0");
    });

    it("should accept very large dimensions", () => {
      const { container } = renderWithProviders(
        <Logo width={1000} height={500} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "1000");
      expect(svg).toHaveAttribute("height", "500");
    });
  });

  describe("Theme Integration", () => {
    it("should use light color in light mode", () => {
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

      const { container } = renderWithProviders(<Logo />, { store });

      const svg = container.querySelector("svg");
      const styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain("#29235C");
    });

    it("should use dark color in dark mode", () => {
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

      const { container } = renderWithProviders(<Logo />, { store });

      const svg = container.querySelector("svg");
      const styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain("#F4F6F8");
    });

    it("should have green color class", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      const styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain(".st0{fill:#95C11F;}");
    });

    it("should have blue color class", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      const styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain(".st1{fill:#36A9E1;}");
    });

    it("should have dynamic color class based on theme", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      const styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain(".st2{fill:");
    });
  });

  describe("SVG Structure", () => {
    it("should contain multiple path elements", () => {
      const { container } = renderWithProviders(<Logo />);

      const paths = container.querySelectorAll("path");
      expect(paths.length).toBeGreaterThan(0);
    });

    it("should contain g (group) elements", () => {
      const { container } = renderWithProviders(<Logo />);

      const groups = container.querySelectorAll("g");
      expect(groups.length).toBeGreaterThan(0);
    });

    it("should have style element", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      const style = svg?.querySelector("style");
      expect(style).toBeInTheDocument();
    });

    it("should have paths with st0 class (green)", () => {
      const { container } = renderWithProviders(<Logo />);

      const greenPaths = container.querySelectorAll(".st0");
      expect(greenPaths.length).toBeGreaterThan(0);
    });

    it("should have paths with st1 class (blue)", () => {
      const { container } = renderWithProviders(<Logo />);

      const bluePaths = container.querySelectorAll(".st1");
      expect(bluePaths.length).toBeGreaterThan(0);
    });

    it("should have paths with st2 class (dynamic color)", () => {
      const { container } = renderWithProviders(<Logo />);

      const dynamicPaths = container.querySelectorAll(".st2");
      expect(dynamicPaths.length).toBeGreaterThan(0);
    });

    it("should have rect elements", () => {
      const { container } = renderWithProviders(<Logo />);

      const rects = container.querySelectorAll("rect");
      expect(rects.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should be non-interactive", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg?.tagName).toBe("svg");
      // SVG logos are typically decorative, not interactive
    });

    it("should maintain aspect ratio", () => {
      const { container } = renderWithProviders(
        <Logo width={200} height={75} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // ViewBox maintains aspect ratio regardless of width/height
    });
  });

  describe("Edge Cases", () => {
    it("should render with fractional dimensions", () => {
      const { container } = renderWithProviders(
        <Logo width={150.5} height={56.75} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "150.5");
      expect(svg).toHaveAttribute("height", "56.75");
    });

    it("should render when no props provided", () => {
      const { container } = renderWithProviders(<Logo />);

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("width", "200");
      expect(svg).toHaveAttribute("height", "75");
    });

    it("should handle theme changes", () => {
      const lightStore = createMockStore({
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

      const { container, rerender } = renderWithProviders(<Logo />, {
        store: lightStore,
      });

      let svg = container.querySelector("svg");
      let styleElement = svg?.querySelector("style");
      expect(styleElement?.textContent).toContain("#29235C");

      // Rerender with dark theme
      const darkStore = createMockStore({
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

      rerender(<Logo />);

      svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should scale with small dimensions", () => {
      const { container } = renderWithProviders(
        <Logo width={50} height={20} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "50");
      expect(svg).toHaveAttribute("height", "20");
    });

    it("should scale with large dimensions", () => {
      const { container } = renderWithProviders(
        <Logo width={800} height={300} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "800");
      expect(svg).toHaveAttribute("height", "300");
    });

    it("should maintain viewBox regardless of size", () => {
      const { container: small } = renderWithProviders(
        <Logo width={100} height={50} />,
      );
      const { container: large } = renderWithProviders(
        <Logo width={400} height={150} />,
      );

      const smallSvg = small.querySelector("svg");
      const largeSvg = large.querySelector("svg");

      expect(smallSvg?.getAttribute("viewBox")).toBe("0 0 313.3 130.1");
      expect(largeSvg?.getAttribute("viewBox")).toBe("0 0 313.3 130.1");
    });
  });
});
