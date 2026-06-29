"use client";

import { useEffect, useReducer } from "react";

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

  // Resolve the theme mode during render. For "auto" this reads the live system
  // preference (getSystemTheme), so it is always current on every render.
  const resolvedMode = resolveThemeMode(userSelectedMode) as PaletteMode;

  // resolveThemeMode is not reactive on its own, so force a re-render when the
  // OS theme changes while in auto mode. We only need a re-render trigger, not a
  // stored value — which avoids any setState in the effect body or its cleanup.
  const [, onSystemThemeChange] = useReducer((tick: number) => tick + 1, 0);

  // Subscribe to system theme changes when in auto mode
  useEffect(() => {
    // Only subscribe if user selected auto mode
    if (userSelectedMode !== THEME.AUTO) {
      return; // No cleanup needed
    }

    return subscribeToThemeChanges(() => onSystemThemeChange());
  }, [userSelectedMode]);

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
