import { THEME } from "@/constants/general.constants";

/**
 * Detects the current system theme preference
 * @returns "dark" or "light" based on OS preference
 */
export const getSystemTheme = (): string => {
  // Check if the browser supports matchMedia
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return THEME.DARK;
  }
  // Default to light theme if no preference detected
  return THEME.LIGHT;
};

/**
 * Resolves the theme mode - converts "auto" to actual light/dark based on system preference
 * @param themeKey - The theme key (light, dark, or auto)
 * @returns "light" or "dark"
 */
export const resolveThemeMode = (themeKey: string): string => {
  if (themeKey === THEME.AUTO) {
    return getSystemTheme();
  }
  // Return the theme key as-is if it's already light or dark
  return themeKey === THEME.DARK ? THEME.DARK : THEME.LIGHT;
};

/**
 * Subscribes to system theme changes
 * @param callback - Called with new theme (light/dark) when OS preference changes
 * @returns Cleanup function to remove the listener
 */
export const subscribeToThemeChanges = (
  callback: (theme: string) => void,
): (() => void) => {
  // Check if matchMedia is supported
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {}; // Return no-op cleanup function
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Handler for theme changes
  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const newTheme = e.matches ? THEME.DARK : THEME.LIGHT;
    callback(newTheme);
  };

  // Type for older browsers that don't have addEventListener
  type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (
      listener: (e: MediaQueryListEvent | MediaQueryList) => void,
    ) => void;
    removeListener?: (
      listener: (e: MediaQueryListEvent | MediaQueryList) => void,
    ) => void;
  };

  const legacyMediaQuery = mediaQuery as LegacyMediaQueryList;

  // Add listener (modern way)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
  } else if (legacyMediaQuery.addListener) {
    // Fallback for older browsers
    legacyMediaQuery.addListener(handleChange);
  }

  // Return cleanup function
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handleChange);
    } else if (legacyMediaQuery.removeListener) {
      // Fallback for older browsers
      legacyMediaQuery.removeListener(handleChange);
    }
  };
};

/**
 * Checks if the browser supports system theme detection
 * @returns True if prefers-color-scheme is supported
 */
export const isSystemThemeSupported = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").media !== "not all"
  );
};
