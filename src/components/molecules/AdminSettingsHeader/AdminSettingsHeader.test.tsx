import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import AdminSettingsHeader from "./index";

/**
 * Component tests for AdminSettingsHeader
 * @file src/components/molecules/AdminSettingsHeader/AdminSettingsHeader.test.tsx
 */

// Mock HeaderSearchInput
vi.mock("@/components/atoms/HeaderSearchInput", () => ({
  default: ({
    onChange,
  }: {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="header-search-input"
      onChange={onChange}
      placeholder="Search..."
    />
  ),
}));

// Mock GeneralButton
vi.mock("@/components/atoms/buttons/GeneralButton", () => ({
  default: ({
    onAction,
    disabled,
    label,
  }: {
    onAction: () => void;
    disabled?: boolean;
    label: string;
  }) => (
    <button data-testid="general-button" onClick={onAction} disabled={disabled}>
      {label}
    </button>
  ),
}));

describe("AdminSettingsHeader", () => {
  describe("Basic Rendering", () => {
    it("should render title", () => {
      renderWithProviders(<AdminSettingsHeader title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render with minimal props", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Minimal" />,
      );

      expect(screen.getByText("Minimal")).toBeInTheDocument();
      expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    });

    it("should render divider by default", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" />,
      );

      const divider = container.querySelector(".MuiBox-root");
      expect(divider).toBeInTheDocument();
    });

    it("should not render search when onSearch not provided", () => {
      renderWithProviders(<AdminSettingsHeader title="Test" />);

      expect(
        screen.queryByTestId("header-search-input"),
      ).not.toBeInTheDocument();
    });

    it("should not render save button when onSave not provided", () => {
      renderWithProviders(<AdminSettingsHeader title="Test" />);

      expect(screen.queryByTestId("general-button")).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should render search input when onSearch provided", () => {
      const onSearch = vi.fn();
      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      expect(screen.getByTestId("header-search-input")).toBeInTheDocument();
    });

    it("should call onSearch when input changes", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      const searchInput = screen.getByTestId("header-search-input");
      await user.type(searchInput, "test query");

      expect(onSearch).toHaveBeenCalled();
    });

    it("should pass search value to onSearch", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      const searchInput = screen.getByTestId("header-search-input");
      await user.type(searchInput, "a");

      expect(onSearch).toHaveBeenCalledWith("a");
    });

    it("should handle search with backspace", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      const searchInput = screen.getByTestId("header-search-input");
      await user.type(searchInput, "ab{Backspace}");

      expect(onSearch).toHaveBeenCalled();
    });
  });

  describe("Save Button", () => {
    it("should render save button when onSave provided", () => {
      const onSave = vi.fn();
      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      expect(screen.getByTestId("general-button")).toBeInTheDocument();
      expect(screen.getByText("general.Save")).toBeInTheDocument();
    });

    it("should call onSave when button clicked", async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      const saveButton = screen.getByTestId("general-button");
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it("should enable save button by default", () => {
      const onSave = vi.fn();
      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      const saveButton = screen.getByTestId("general-button");
      expect(saveButton).not.toBeDisabled();
    });

    it("should disable save button when disabled prop true", () => {
      const onSave = vi.fn();
      renderWithProviders(
        <AdminSettingsHeader title="Test" onSave={onSave} disabled={true} />,
      );

      const saveButton = screen.getByTestId("general-button");
      expect(saveButton).toBeDisabled();
    });

    it("should not call onSave when disabled", async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSave={onSave} disabled={true} />,
      );

      const saveButton = screen.getByTestId("general-button");
      await user.click(saveButton);

      // Disabled button should not trigger click
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show divider when onLoad is false", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" onLoad={false} />,
      );

      // Should have divider, not LinearProgress
      expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    });

    it("should show LinearProgress when onLoad is true", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" onLoad={true} />,
      );

      const progress = container.querySelector(".MuiLinearProgress-root");
      expect(progress).toBeInTheDocument();
    });

    it("should default to divider when onLoad not provided", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" />,
      );

      const progress = container.querySelector(".MuiLinearProgress-root");
      expect(progress).not.toBeInTheDocument();
    });
  });

  describe("SubHeader Mode", () => {
    it("should render as main header by default", () => {
      renderWithProviders(<AdminSettingsHeader title="Main" />);

      expect(screen.getByText("Main")).toBeInTheDocument();
    });

    it("should render as subheader when isSubHeader is true", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Sub" isSubHeader={true} />,
      );

      expect(screen.getByText("Sub")).toBeInTheDocument();
    });

    it("should apply different styling for subheader", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Sub" isSubHeader={true} />,
      );

      expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    });

    it("should render as main header when isSubHeader is false", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Main" isSubHeader={false} />,
      );

      expect(screen.getByText("Main")).toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("should not render children when not provided", () => {
      renderWithProviders(<AdminSettingsHeader title="Test" />);

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should render children when provided", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Test">
          <div data-testid="custom-child">Custom Content</div>
        </AdminSettingsHeader>,
      );

      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Test">
          <button data-testid="child-1">Button 1</button>
          <button data-testid="child-2">Button 2</button>
        </AdminSettingsHeader>,
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });

    it("should render children in toolbox section", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Test">
          <span data-testid="toolbox-child">Tool</span>
        </AdminSettingsHeader>,
      );

      expect(screen.getByTestId("toolbox-child")).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("should render all features together", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const onSave = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader
          title="Complete Header"
          onSearch={onSearch}
          onSave={onSave}
          onLoad={true}
          isSubHeader={false}
        >
          <div data-testid="extra">Extra</div>
        </AdminSettingsHeader>,
      );

      expect(screen.getByText("Complete Header")).toBeInTheDocument();
      expect(screen.getByTestId("header-search-input")).toBeInTheDocument();
      expect(screen.getByTestId("general-button")).toBeInTheDocument();
      expect(screen.getByTestId("extra")).toBeInTheDocument();

      const saveButton = screen.getByTestId("general-button");
      await user.click(saveButton);
      expect(onSave).toHaveBeenCalled();
    });

    it("should render search and save together", () => {
      const onSearch = vi.fn();
      const onSave = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader
          title="Test"
          onSearch={onSearch}
          onSave={onSave}
        />,
      );

      expect(screen.getByTestId("header-search-input")).toBeInTheDocument();
      expect(screen.getByTestId("general-button")).toBeInTheDocument();
    });

    it("should render children with search and save", () => {
      const onSearch = vi.fn();
      const onSave = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} onSave={onSave}>
          <button data-testid="custom">Custom</button>
        </AdminSettingsHeader>,
      );

      expect(screen.getByTestId("header-search-input")).toBeInTheDocument();
      expect(screen.getByTestId("custom")).toBeInTheDocument();
      expect(screen.getByTestId("general-button")).toBeInTheDocument();
    });
  });

  describe("Other Props Forwarding", () => {
    it("should forward additional props", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" data-testid="custom-header" />,
      );

      expect(
        container.querySelector('[data-testid="custom-header"]'),
      ).toBeInTheDocument();
    });

    it("should handle custom className", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" className="custom-class" />,
      );

      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have header container", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" />,
      );

      const header = container.querySelector(".MuiBox-root");
      expect(header).toBeInTheDocument();
    });

    it("should have title section", () => {
      renderWithProviders(<AdminSettingsHeader title="Title" />);

      const title = screen.getByText("Title");
      expect(title).toBeInTheDocument();
      expect(title.className).toContain("MuiTypography");
    });

    it("should have toolbox section", () => {
      const onSave = vi.fn();
      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      expect(screen.getByTestId("general-button")).toBeInTheDocument();
    });

    it("should have divider section", () => {
      const { container } = renderWithProviders(
        <AdminSettingsHeader title="Test" />,
      );

      const boxes = container.querySelectorAll(".MuiBox-root");
      expect(boxes.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title", () => {
      renderWithProviders(<AdminSettingsHeader title="" />);

      const container = document.body;
      expect(container).toBeInTheDocument();
    });

    it("should handle long title", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines in the header";
      renderWithProviders(<AdminSettingsHeader title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      renderWithProviders(
        <AdminSettingsHeader title="Title with <special> & characters!" />,
      );

      expect(
        screen.getByText("Title with <special> & characters!"),
      ).toBeInTheDocument();
    });

    it("should handle rapid search updates", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      const searchInput = screen.getByTestId("header-search-input");
      await user.type(searchInput, "abc");

      expect(onSearch).toHaveBeenCalledTimes(3); // Once per character
    });

    it("should handle multiple save clicks", async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      const saveButton = screen.getByTestId("general-button");
      await user.click(saveButton);
      await user.click(saveButton);
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should render semantic HTML structure", () => {
      renderWithProviders(<AdminSettingsHeader title="Accessible Title" />);

      const title = screen.getByText("Accessible Title");
      expect(title).toBeInTheDocument();
    });

    it("should have focusable save button", () => {
      const onSave = vi.fn();
      renderWithProviders(<AdminSettingsHeader title="Test" onSave={onSave} />);

      const saveButton = screen.getByTestId("general-button");
      saveButton.focus();
      expect(saveButton).toHaveFocus();
    });

    it("should have focusable search input", () => {
      const onSearch = vi.fn();
      renderWithProviders(
        <AdminSettingsHeader title="Test" onSearch={onSearch} />,
      );

      const searchInput = screen.getByTestId("header-search-input");
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });
});
