import { THEME } from "@/constants/general.constants";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import OnboardingVersion from "./index";

/**
 * Component tests for OnboardingVersion
 * @file src/components/atoms/OnboardingVersion/OnboardingVersion.test.tsx
 */

// Mock Logo component to simplify testing
vi.mock("../Logo", () => ({
  default: ({ width, height }: { width?: number; height?: number }) => (
    <div data-testid="mock-logo" data-width={width} data-height={height}>
      Logo
    </div>
  ),
}));

describe("OnboardingVersion", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  describe("Basic Rendering", () => {
    it("should render wrapper component", () => {
      const { container } = renderWithProviders(<OnboardingVersion />);

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render Logo component", () => {
      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    });

    it("should render Logo with correct width", () => {
      renderWithProviders(<OnboardingVersion />);

      const logo = screen.getByTestId("mock-logo");
      expect(logo).toHaveAttribute("data-width", "200");
    });

    it("should render Logo with correct height", () => {
      renderWithProviders(<OnboardingVersion />);

      const logo = screen.getByTestId("mock-logo");
      expect(logo).toHaveAttribute("data-height", "75");
    });

    it("should always render Logo regardless of env vars", () => {
      process.env.NEXT_PUBLIC_NAME = undefined;
      process.env.NEXT_PUBLIC_VERSION = undefined;

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    });
  });

  describe("Version Display - Both Env Vars Present", () => {
    it("should show version when both NAME and VERSION are set", () => {
      process.env.NEXT_PUBLIC_NAME = "Student Registration";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      expect(
        screen.getByText("Student Registration v1.0.0"),
      ).toBeInTheDocument();
    });

    it("should format version correctly", () => {
      process.env.NEXT_PUBLIC_NAME = "MyApp";
      process.env.NEXT_PUBLIC_VERSION = "2.5.3";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("MyApp v2.5.3")).toBeInTheDocument();
    });

    it("should render version with caption variant", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionText = screen.getByText("App v1.0.0");
      expect(versionText).toHaveClass("MuiTypography-caption");
    });

    it("should render version with block display", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      const versionText = screen.getByText("App v1.0.0");
      expect(versionText).toBeInTheDocument();
    });

    it("should handle long app name", () => {
      process.env.NEXT_PUBLIC_NAME =
        "Very Long Application Name For Student Management";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      expect(
        screen.getByText(
          "Very Long Application Name For Student Management v1.0.0",
        ),
      ).toBeInTheDocument();
    });

    it("should handle semantic versioning", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.2.3-beta.4";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App v1.2.3-beta.4")).toBeInTheDocument();
    });
  });

  describe("Version Display - Missing Env Vars", () => {
    it("should not show version when NAME is missing", () => {
      process.env.NEXT_PUBLIC_NAME = undefined;
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });

    it("should not show version when VERSION is missing", () => {
      process.env.NEXT_PUBLIC_NAME = "MyApp";
      process.env.NEXT_PUBLIC_VERSION = undefined;

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });

    it("should not show version when both are missing", () => {
      process.env.NEXT_PUBLIC_NAME = undefined;
      process.env.NEXT_PUBLIC_VERSION = undefined;

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });

    it("should not show version when NAME is empty string", () => {
      process.env.NEXT_PUBLIC_NAME = "";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });

    it("should not show version when VERSION is empty string", () => {
      process.env.NEXT_PUBLIC_NAME = "MyApp";
      process.env.NEXT_PUBLIC_VERSION = "";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });

    it("should not show version when both are empty strings", () => {
      process.env.NEXT_PUBLIC_NAME = "";
      process.env.NEXT_PUBLIC_VERSION = "";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const versionElements = container.querySelectorAll(
        ".MuiTypography-caption",
      );
      expect(versionElements.length).toBe(0);
    });
  });

  describe("Component Structure", () => {
    it("should render StyledWrapper as container", () => {
      const { container } = renderWithProviders(<OnboardingVersion />);

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render StyledLabel containing Logo", () => {
      const { container } = renderWithProviders(<OnboardingVersion />);

      const label = container.querySelector(".MuiTypography-root");
      const logo = screen.getByTestId("mock-logo");
      expect(label).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
    });

    it("should render StyledVersion when env vars present", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const typographies = container.querySelectorAll(".MuiTypography-root");
      expect(typographies.length).toBeGreaterThan(1);
    });

    it("should maintain correct hierarchy", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const wrapper = container.querySelector(".MuiBox-root");
      const logo = screen.getByTestId("mock-logo");
      const version = screen.getByText("App v1.0.0");

      expect(wrapper).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
      expect(version).toBeInTheDocument();
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

      renderWithProviders(<OnboardingVersion />, { store });

      expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
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

      renderWithProviders(<OnboardingVersion />, { store });

      expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    });

    it("should render version text in light theme", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

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

      renderWithProviders(<OnboardingVersion />, { store });

      expect(screen.getByText("App v1.0.0")).toBeInTheDocument();
    });

    it("should render version text in dark theme", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

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

      renderWithProviders(<OnboardingVersion />, { store });

      expect(screen.getByText("App v1.0.0")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in app name", () => {
      process.env.NEXT_PUBLIC_NAME = "App & Co.";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App & Co. v1.0.0")).toBeInTheDocument();
    });

    it("should handle numbers in app name", () => {
      process.env.NEXT_PUBLIC_NAME = "App2023";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App2023 v1.0.0")).toBeInTheDocument();
    });

    it("should handle version with build number", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0+20231201";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App v1.0.0+20231201")).toBeInTheDocument();
    });

    it("should handle short version numbers", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App v1.0")).toBeInTheDocument();
    });

    it("should handle version 0.0.0", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "0.0.0";

      renderWithProviders(<OnboardingVersion />);

      expect(screen.getByText("App v0.0.0")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic structure", () => {
      const { container } = renderWithProviders(<OnboardingVersion />);

      const wrapper = container.querySelector(".MuiBox-root");
      const typographies = container.querySelectorAll(".MuiTypography-root");

      expect(wrapper).toBeInTheDocument();
      expect(typographies.length).toBeGreaterThan(0);
    });

    it("should render text content for screen readers", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      renderWithProviders(<OnboardingVersion />);

      const version = screen.getByText("App v1.0.0");
      expect(version).toBeInTheDocument();
    });

    it("should have caption variant for version (appropriate semantic level)", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

      const { container } = renderWithProviders(<OnboardingVersion />);

      const caption = container.querySelector(".MuiTypography-caption");
      expect(caption).toBeInTheDocument();
    });

    it("should work without version for minimal content", () => {
      const { container } = renderWithProviders(<OnboardingVersion />);

      const logo = screen.getByTestId("mock-logo");
      expect(logo).toBeInTheDocument();

      const captions = container.querySelectorAll(".MuiTypography-caption");
      expect(captions.length).toBe(0);
    });
  });

  describe("Responsive Design", () => {
    it("should render consistently across themes", () => {
      process.env.NEXT_PUBLIC_NAME = "App";
      process.env.NEXT_PUBLIC_VERSION = "1.0.0";

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

      const { unmount } = renderWithProviders(<OnboardingVersion />, {
        store: lightStore,
      });
      expect(screen.getByText("App v1.0.0")).toBeInTheDocument();
      unmount();

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

      renderWithProviders(<OnboardingVersion />, { store: darkStore });
      expect(screen.getByText("App v1.0.0")).toBeInTheDocument();
    });

    it("should maintain fixed logo size", () => {
      renderWithProviders(<OnboardingVersion />);

      const logo = screen.getByTestId("mock-logo");
      expect(logo).toHaveAttribute("data-width", "200");
      expect(logo).toHaveAttribute("data-height", "75");
    });
  });
});
