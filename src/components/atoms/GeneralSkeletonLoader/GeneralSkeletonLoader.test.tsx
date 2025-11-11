import { THEME } from "@/constants/general.constants";
import { describe, expect, it } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import { GeneralSkeletonLoader } from "./index";

/**
 * Component tests for GeneralSkeletonLoader
 * @file src/components/atoms/GeneralSkeletonLoader/GeneralSkeletonLoader.test.tsx
 */

describe("GeneralSkeletonLoader", () => {
  describe("Basic Rendering", () => {
    it("should render skeleton element", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with default animation", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-wave");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with default variant", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-rounded");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render without required props", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Dimensions", () => {
    it("should render with custom height", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={100} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "100px" });
    });

    it("should render with custom width", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader width={200} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ width: "200px" });
    });

    it("should render with both height and width", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={100} width={200} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "100px", width: "200px" });
    });

    it("should accept string dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height="50px" width="100%" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "50px", width: "100%" });
    });

    it("should accept number dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={80} width={160} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "80px", width: "160px" });
    });

    it("should handle zero dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={0} width={0} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should handle very large dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={1000} width={2000} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "1000px", width: "2000px" });
    });
  });

  describe("Animation Prop", () => {
    it("should use wave animation by default", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-wave");
      expect(skeleton).toBeInTheDocument();
    });

    it("should support pulse animation", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader animation="pulse" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("should support no animation", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader animation={false} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).not.toHaveClass("MuiSkeleton-wave");
      expect(skeleton).not.toHaveClass("MuiSkeleton-pulse");
    });

    it("should override default animation", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader animation="pulse" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-pulse");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Variant Prop", () => {
    it("should use rounded variant by default", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-rounded");
      expect(skeleton).toBeInTheDocument();
    });

    it("should support text variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="text" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-text");
      expect(skeleton).toBeInTheDocument();
    });

    it("should support rectangular variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="rectangular" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-rectangular");
      expect(skeleton).toBeInTheDocument();
    });

    it("should support circular variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="circular" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-circular");
      expect(skeleton).toBeInTheDocument();
    });

    it("should override default variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="text" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-text");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Avatar Mode", () => {
    it("should render with isAvatar false by default", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with isAvatar true", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={true} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with isAvatar false explicitly", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={false} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should not forward isAvatar prop to DOM", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={true} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).not.toHaveAttribute("isAvatar");
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

      const { container } = renderWithProviders(<GeneralSkeletonLoader />, {
        store,
      });

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
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

      const { container } = renderWithProviders(<GeneralSkeletonLoader />, {
        store,
      });

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render avatar mode in light theme", () => {
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

      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={true} />,
        { store },
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render avatar mode in dark theme", () => {
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

      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={true} />,
        { store },
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("should render with all custom props", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader
          height={100}
          width={200}
          animation="pulse"
          variant="circular"
          isAvatar={true}
        />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("MuiSkeleton-pulse");
      expect(skeleton).toHaveClass("MuiSkeleton-circular");
    });

    it("should render as avatar with custom dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader
          isAvatar={true}
          height={50}
          width={50}
          variant="circular"
        />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("MuiSkeleton-circular");
      expect(skeleton).toHaveStyle({ height: "50px", width: "50px" });
    });

    it("should render with animation and variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader animation="pulse" variant="rectangular" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveClass("MuiSkeleton-pulse");
      expect(skeleton).toHaveClass("MuiSkeleton-rectangular");
    });

    it("should render with dimensions and variant", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={100} width="100%" variant="text" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveClass("MuiSkeleton-text");
      expect(skeleton).toHaveStyle({ height: "100px", width: "100%" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle fractional dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={50.5} width={100.75} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "50.5px", width: "100.75px" });
    });

    it("should handle percentage dimensions", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height="50%" width="100%" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "50%", width: "100%" });
    });

    it("should handle mixed dimension types", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={100} width="50%" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "100px", width: "50%" });
    });

    it("should handle only height provided", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader height={100} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "100px" });
    });

    it("should handle only width provided", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader width={200} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ width: "200px" });
    });

    it("should render when no props provided", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Props Updates", () => {
    it("should update when dimensions change", () => {
      const { container, rerender } = renderWithProviders(
        <GeneralSkeletonLoader height={100} width={200} />,
      );

      let skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "100px", width: "200px" });

      rerender(<GeneralSkeletonLoader height={150} width={250} />);

      skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ height: "150px", width: "250px" });
    });

    it("should update when animation changes", () => {
      const { container, rerender } = renderWithProviders(
        <GeneralSkeletonLoader animation="wave" />,
      );

      let skeleton = container.querySelector(".MuiSkeleton-wave");
      expect(skeleton).toBeInTheDocument();

      rerender(<GeneralSkeletonLoader animation="pulse" />);

      skeleton = container.querySelector(".MuiSkeleton-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("should update when variant changes", () => {
      const { container, rerender } = renderWithProviders(
        <GeneralSkeletonLoader variant="rounded" />,
      );

      let skeleton = container.querySelector(".MuiSkeleton-rounded");
      expect(skeleton).toBeInTheDocument();

      rerender(<GeneralSkeletonLoader variant="circular" />);

      skeleton = container.querySelector(".MuiSkeleton-circular");
      expect(skeleton).toBeInTheDocument();
    });

    it("should update when isAvatar changes", () => {
      const { container, rerender } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={false} />,
      );

      let skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();

      rerender(<GeneralSkeletonLoader isAvatar={true} />);

      skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be non-interactive", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton?.tagName).toBe("SPAN");
    });

    it("should render as visual placeholder", () => {
      const { container } = renderWithProviders(<GeneralSkeletonLoader />);

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render circular variant for avatar placeholder", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader isAvatar={true} variant="circular" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-circular");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("MUI Skeleton Props Pass-through", () => {
    it("should pass through other skeleton props", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader data-testid="custom-skeleton" />,
      );

      const skeleton = container.querySelector(
        '[data-testid="custom-skeleton"]',
      );
      expect(skeleton).toBeInTheDocument();
    });

    it("should pass through className", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader className="custom-class" />,
      );

      const skeleton = container.querySelector(".custom-class");
      expect(skeleton).toBeInTheDocument();
    });

    it("should pass through style prop", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader style={{ margin: "10px" }} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-root");
      expect(skeleton).toHaveStyle({ margin: "10px" });
    });
  });

  describe("Use Cases", () => {
    it("should render as text placeholder", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="text" width="100%" />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-text");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render as avatar placeholder", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader
          isAvatar={true}
          variant="circular"
          height={40}
          width={40}
        />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-circular");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({ height: "40px", width: "40px" });
    });

    it("should render as card placeholder", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader
          variant="rectangular"
          height={200}
          width="100%"
        />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-rectangular");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render as button placeholder", () => {
      const { container } = renderWithProviders(
        <GeneralSkeletonLoader variant="rounded" height={40} width={100} />,
      );

      const skeleton = container.querySelector(".MuiSkeleton-rounded");
      expect(skeleton).toBeInTheDocument();
    });
  });
});
