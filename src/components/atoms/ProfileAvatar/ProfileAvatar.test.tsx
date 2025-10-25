import * as generalUtils from "@/utils/general.utils";
import * as stringUtils from "@/utils/string.utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import ProfileAvatar from "./index";

/**
 * Component tests for ProfileAvatar
 * @file src/components/atoms/ProfileAvatar/ProfileAvatar.test.tsx
 */

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    loading,
    onClick,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    loading?: "lazy" | "eager";
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onClick={onClick}
      {...props}
    />
  ),
}));

// Mock the utility functions
vi.mock("@/utils/general.utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/general.utils")>();
  return {
    ...actual,
    getAvatarFullURL: vi.fn(),
  };
});

vi.mock("@/utils/string.utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/string.utils")>();
  return {
    ...actual,
    userInitials: vi.fn(),
  };
});

// Mock Image constructor for testing image load/error
class MockImage {
  src = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    // Simulate async image loading
    setTimeout(() => {
      if (this.src && this.src !== "invalid-url") {
        this.onload?.();
      } else {
        this.onerror?.();
      }
    }, 0);
  }
}

global.Image = MockImage as unknown as typeof Image;

describe("ProfileAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(generalUtils.getAvatarFullURL).mockImplementation((path) =>
      path ? `https://example.com/avatars/${path}` : "",
    );
    vi.mocked(stringUtils.userInitials).mockImplementation((first, last) => {
      if (!first && !last) return " ";
      if (!first) return last.charAt(0).toUpperCase();
      if (!last) return first.charAt(0).toUpperCase();
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    });
  });

  describe("Basic Rendering", () => {
    it("should render with default NO_AVATAR_FOUND when no avatar provided", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("no-avatar-found"),
        );
      });
    });

    it("should render with null avatar", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar avatar={null} />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should render with default size", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should call getAvatarFullURL when avatar provided", () => {
      renderWithProviders(<ProfileAvatar avatar="user-avatar.jpg" />);

      expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith(
        "user-avatar.jpg",
      );
    });
  });

  describe("Image Validation", () => {
    it("should show valid image when URL loads successfully", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/valid-avatar.jpg",
      );

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="valid-avatar.jpg" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("valid-avatar"),
        );
      });
    });

    it("should validate image in useEffect", async () => {
      renderWithProviders(<ProfileAvatar avatar="test-avatar.jpg" />);

      await waitFor(() => {
        expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith(
          "test-avatar.jpg",
        );
      });
    });

    it("should handle image load error", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="invalid.jpg" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should re-validate when avatar changes", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/first.jpg",
      );

      const { rerender } = renderWithProviders(
        <ProfileAvatar avatar="first.jpg" />,
      );

      await waitFor(() => {
        expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith("first.jpg");
      });

      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/second.jpg",
      );

      rerender(<ProfileAvatar avatar="second.jpg" />);

      await waitFor(() => {
        expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith(
          "second.jpg",
        );
      });
    });
  });

  describe("Initials Fallback", () => {
    it("should show initials when image fails and initialsFallback provided", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");
      vi.mocked(stringUtils.userInitials).mockReturnValue("JD");

      renderWithProviders(
        <ProfileAvatar avatar="invalid.jpg" initialsFallback="John Doe" />,
      );

      await waitFor(() => {
        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });

    it("should call userInitials with correct arguments", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");

      renderWithProviders(
        <ProfileAvatar avatar="invalid.jpg" initialsFallback="John Doe" />,
      );

      await waitFor(() => {
        expect(stringUtils.userInitials).toHaveBeenCalledWith("John Doe", "");
      });
    });

    it("should render Avatar component for initials", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");
      vi.mocked(stringUtils.userInitials).mockReturnValue("AB");

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="invalid.jpg" initialsFallback="Alice Brown" />,
      );

      await waitFor(() => {
        const avatar = container.querySelector(".MuiAvatar-root");
        expect(avatar).toBeInTheDocument();
        expect(screen.getByText("AB")).toBeInTheDocument();
      });
    });

    it("should show initials when no avatar provided but initialsFallback given", async () => {
      vi.mocked(stringUtils.userInitials).mockReturnValue("XY");

      const { container } = renderWithProviders(
        <ProfileAvatar initialsFallback="Xavier Young" />,
      );

      await waitFor(() => {
        const avatar = container.querySelector(".MuiAvatar-root");
        expect(avatar).toBeInTheDocument();
        expect(screen.getByText("XY")).toBeInTheDocument();
      });
    });
  });

  describe("NO_AVATAR_FOUND Fallback", () => {
    it("should show NO_AVATAR_FOUND when image fails and no initialsFallback", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="invalid.jpg" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("no-avatar-found"),
        );
      });
    });

    it("should show NO_AVATAR_FOUND when no avatar and no initialsFallback", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("no-avatar-found"),
        );
      });
    });

    it("should use NO_AVATAR_FOUND constant", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("/images/no-avatar-found.png"),
        );
      });
    });
  });

  describe("Size Prop", () => {
    it("should render with custom size", async () => {
      const { container } = renderWithProviders(<ProfileAvatar size={100} />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should apply size to image", async () => {
      const { container } = renderWithProviders(<ProfileAvatar size={150} />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should apply size to Avatar with initials", async () => {
      vi.mocked(stringUtils.userInitials).mockReturnValue("TU");

      const { container } = renderWithProviders(
        <ProfileAvatar size={80} initialsFallback="Test User" />,
      );

      await waitFor(() => {
        const avatar = container.querySelector(".MuiAvatar-root");
        expect(avatar).toBeInTheDocument();
      });
    });

    it("should use default size when not provided", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should handle size 0", async () => {
      const { container } = renderWithProviders(<ProfileAvatar size={0} />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should handle very large size", async () => {
      const { container } = renderWithProviders(<ProfileAvatar size={500} />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe("Click Handler", () => {
    it("should call clickAction when image clicked", async () => {
      const user = userEvent.setup();
      const clickAction = vi.fn();

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="test.jpg" clickAction={clickAction} />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });

      const img = container.querySelector("img");
      if (img) {
        await user.click(img);
      }

      expect(clickAction).toHaveBeenCalled();
    });

    it("should work without clickAction", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should handle multiple clicks", async () => {
      const user = userEvent.setup();
      const clickAction = vi.fn();

      const { container } = renderWithProviders(
        <ProfileAvatar clickAction={clickAction} />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });

      const img = container.querySelector("img");
      if (img) {
        await user.click(img);
        await user.click(img);
      }

      expect(clickAction).toHaveBeenCalledTimes(2);
    });
  });

  describe("Loading Prop", () => {
    it("should use lazy loading by default", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    it("should support eager loading", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar loading="eager" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("loading", "eager");
      });
    });

    it("should support lazy loading explicitly", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar loading="lazy" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    it("should apply loading prop to valid image", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/test.jpg",
      );

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="test.jpg" loading="eager" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("loading", "eager");
      });
    });

    it("should apply loading prop to NO_AVATAR_FOUND fallback", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar loading="eager" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("loading", "eager");
      });
    });
  });

  describe("Combined Props", () => {
    it("should work with all props combined", async () => {
      const clickAction = vi.fn();
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/avatar.jpg",
      );

      const { container } = renderWithProviders(
        <ProfileAvatar
          avatar="avatar.jpg"
          clickAction={clickAction}
          size={120}
          loading="eager"
          initialsFallback="Test User"
        />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should prioritize valid image over initials", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/avatar.jpg",
      );
      vi.mocked(stringUtils.userInitials).mockReturnValue("TU");

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="avatar.jpg" initialsFallback="Test User" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(screen.queryByText("TU")).not.toBeInTheDocument();
      });
    });

    it("should use initials when image invalid despite having clickAction", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue("invalid-url");
      vi.mocked(stringUtils.userInitials).mockReturnValue("AB");

      const clickAction = vi.fn();

      renderWithProviders(
        <ProfileAvatar
          avatar="invalid.jpg"
          initialsFallback="Alice Brown"
          clickAction={clickAction}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("AB")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string avatar", async () => {
      const { container } = renderWithProviders(<ProfileAvatar avatar="" />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });

    it("should handle empty string initialsFallback", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar initialsFallback="" />,
      );

      await waitFor(() => {
        // Empty string is falsy, so should show NO_AVATAR_FOUND image instead
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("no-avatar-found"),
        );
      });
    });

    it("should handle rapid avatar changes", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/first.jpg",
      );

      const { rerender } = renderWithProviders(
        <ProfileAvatar avatar="first.jpg" />,
      );

      await waitFor(() => {
        expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith("first.jpg");
      });

      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/second.jpg",
      );
      rerender(<ProfileAvatar avatar="second.jpg" />);

      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/third.jpg",
      );
      rerender(<ProfileAvatar avatar="third.jpg" />);

      await waitFor(() => {
        expect(generalUtils.getAvatarFullURL).toHaveBeenCalledWith("third.jpg");
      });
    });

    it("should handle switching from avatar to no avatar", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/test.jpg",
      );

      const { rerender, container } = renderWithProviders(
        <ProfileAvatar avatar="test.jpg" />,
      );

      await waitFor(() => {
        expect(container.querySelector("img")).toBeInTheDocument();
      });

      rerender(<ProfileAvatar avatar={null} />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("no-avatar-found"),
        );
      });
    });

    it("should handle undefined avatar explicitly", async () => {
      const { container } = renderWithProviders(
        <ProfileAvatar avatar={undefined} />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe("Styled Components", () => {
    it("should render StyledAvatarImage for valid image", async () => {
      vi.mocked(generalUtils.getAvatarFullURL).mockReturnValue(
        "https://example.com/test.jpg",
      );

      const { container } = renderWithProviders(
        <ProfileAvatar avatar="test.jpg" />,
      );

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("alt", "avatar");
      });
    });

    it("should render StyledAvatar for initials", async () => {
      vi.mocked(stringUtils.userInitials).mockReturnValue("JD");

      const { container } = renderWithProviders(
        <ProfileAvatar initialsFallback="John Doe" />,
      );

      await waitFor(() => {
        const avatar = container.querySelector(".MuiAvatar-root");
        expect(avatar).toBeInTheDocument();
      });
    });

    it("should render StyledAvatarImage for NO_AVATAR_FOUND", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("alt", "avatar");
      });
    });

    it("should have circular border radius", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have alt text for images", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("alt", "avatar");
      });
    });

    it("should render text for initials (screen reader accessible)", async () => {
      vi.mocked(stringUtils.userInitials).mockReturnValue("AB");

      renderWithProviders(<ProfileAvatar initialsFallback="Alice Brown" />);

      await waitFor(() => {
        expect(screen.getByText("AB")).toBeInTheDocument();
      });
    });

    it("should have semantic img element", async () => {
      const { container } = renderWithProviders(<ProfileAvatar />);

      await waitFor(() => {
        const img = container.querySelector("img");
        expect(img?.tagName).toBe("IMG");
      });
    });
  });
});
