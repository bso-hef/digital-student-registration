import { useEffect } from "react";

/**
 * Custom hook to manage document title
 *
 * Features:
 * - Sets document.title when component mounts
 * - Updates title when the provided title changes
 * - Cleans up by restoring previous title on unmount
 * - Prevents race conditions with multiple components trying to set title
 *
 * @param title - The title to set (e.g., "Dashboard | Admin | DSR")
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   useDocumentTitle("Dashboard | Admin | DSR");
 *   return <div>Dashboard Content</div>;
 * }
 * ```
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    // Store the current title before we change it
    const previousTitle = document.title;

    // Update to new title
    if (title) {
      document.title = title;
    }

    // Cleanup: restore previous title when component unmounts
    return () => {
      // Only restore if the current title is still the one we set
      // This prevents overwriting titles from components that mounted after us
      if (document.title === title) {
        document.title = previousTitle;
      }
    };
  }, [title]);
}
