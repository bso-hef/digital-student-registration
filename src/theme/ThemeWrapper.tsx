"use client";

import { useEffect, useState } from "react";

import { THEME } from "@/constants/general.constants";
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

  // Use Redux state directly - redux-persist handles persistence
  const userSelectedMode = currentTheme ?? THEME.LIGHT;

  // Resolve the base theme mode during render (converts "auto" to "light"/"dark")
  const baseResolvedMode = resolveThemeMode(userSelectedMode) as PaletteMode;

  // Tracks live system theme changes while in auto mode; null = use base
  const [systemMode, setSystemMode] = useState<PaletteMode | null>(null);

  // Subscribe to system theme changes when in auto mode
  useEffect(() => {
    // Only subscribe if user selected auto mode
    if (userSelectedMode !== THEME.AUTO) {
      return; // No cleanup needed
    }

    // Subscribe to system theme changes; reset on unmount/mode change so a
    // stale system value can never leak into a non-auto render
    const unsubscribe = subscribeToThemeChanges((newTheme) => {
      setSystemMode(newTheme as PaletteMode);
    });

    return () => {
      unsubscribe();
      setSystemMode(null);
    };
  }, [userSelectedMode]);

  // While in auto mode, prefer the live system mode once observed
  const resolvedMode =
    userSelectedMode === THEME.AUTO && systemMode !== null
      ? systemMode
      : baseResolvedMode;

  // Get the theme with accessibility options
  const theme = getTheme(resolvedMode, { highContrast, dyslexiaFont });

  // Load OpenDyslexic font when needed
  useEffect(() => {
    if (dyslexiaFont && typeof window !== "undefined") {
      // Import the font dynamically
      import("@fontsource/opendyslexic/400.css");
      import("@fontsource/opendyslexic/700.css");
    }
  }, [dyslexiaFont]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
