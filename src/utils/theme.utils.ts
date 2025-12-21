import { THEME } from "@/constants/general.constants";

export const getSystemTheme = (): string => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return THEME.DARK;
  }
  return THEME.LIGHT;
};

export const resolveThemeMode = (themeKey: string): string => {
  if (themeKey === THEME.AUTO) {
    return getSystemTheme();
  }
  return themeKey === THEME.DARK ? THEME.DARK : THEME.LIGHT;
};

export const subscribeToThemeChanges = (
  callback: (theme: string) => void,
): (() => void) => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const newTheme = e.matches ? THEME.DARK : THEME.LIGHT;
    callback(newTheme);
  };

  type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (
      listener: (e: MediaQueryListEvent | MediaQueryList) => void,
    ) => void;
    removeListener?: (
      listener: (e: MediaQueryListEvent | MediaQueryList) => void,
    ) => void;
  };

  const legacyMediaQuery = mediaQuery as LegacyMediaQueryList;

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
  } else if (legacyMediaQuery.addListener) {
    legacyMediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handleChange);
    } else if (legacyMediaQuery.removeListener) {
      legacyMediaQuery.removeListener(handleChange);
    }
  };
};

export const isSystemThemeSupported = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").media !== "not all"
  );
};
