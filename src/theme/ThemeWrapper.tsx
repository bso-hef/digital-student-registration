"use client";

import { useEffect, useState } from "react";

import { THEME } from "@/constants/general.constants";
import { getCookie } from "@/utils/general.utils";
import { PaletteMode } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { shallowEqual, useSelector } from "react-redux";

import getTheme from "@/theme";
import { resolveThemeMode, subscribeToThemeChanges } from "@/utils/theme.utils";

import { RootState } from "@/store/reducers";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const { highContrast, dyslexiaFont } = useSelector(
    (state: RootState) => ({
      highContrast: state.ui.highContrast,
      dyslexiaFont: state.ui.dyslexiaFont,
    }),
    shallowEqual,
  );

  const localStorageTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;

  const cookieTheme = getCookie("theme");

  const userSelectedMode =
    localStorageTheme ?? cookieTheme ?? currentTheme ?? THEME.LIGHT;

  // Resolve the actual theme mode (converts "auto" to "light" or "dark")
  const [resolvedMode, setResolvedMode] = useState<PaletteMode>(
    () => resolveThemeMode(userSelectedMode) as PaletteMode,
  );

  // Subscribe to system theme changes when in auto mode
  useEffect(() => {
    // Update resolved mode when user selection changes
    setResolvedMode(resolveThemeMode(userSelectedMode) as PaletteMode);

    // Only subscribe if user selected auto mode
    if (userSelectedMode !== THEME.AUTO) {
      return; // No cleanup needed
    }

    // Subscribe to system theme changes
    const unsubscribe = subscribeToThemeChanges((newTheme) => {
      setResolvedMode(newTheme as PaletteMode);
    });

    // Cleanup subscription on unmount or when theme changes
    return unsubscribe;
  }, [userSelectedMode]);

  // Get the theme with accessibility options
  const theme = getTheme(resolvedMode, { highContrast, dyslexiaFont });

  // Load OpenDyslexic font when needed
  useEffect(() => {
    if (dyslexiaFont && typeof window !== "undefined") {
      // Import the font dynamically
      // @ts-expect-error - Dynamic font loading
      import("@fontsource/opendyslexic/400.css");
      // @ts-expect-error - Dynamic font loading
      import("@fontsource/opendyslexic/700.css");
    }
  }, [dyslexiaFont]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
