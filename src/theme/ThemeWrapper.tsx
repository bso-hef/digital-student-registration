"use client";

import { useEffect } from "react";

import { THEME } from "@/constants/general.constants";
import { getCookie } from "@/utils/general.utils";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";

import getTheme from "@/theme";

import { RootState } from "@/store/reducers";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const { highContrast, dyslexiaFont } = useSelector((state: RootState) => ({
    highContrast: state.ui.highContrast,
    dyslexiaFont: state.ui.dyslexiaFont,
  }));

  const localStorageTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;

  const cookieTheme = getCookie("theme");

  const mode = localStorageTheme ?? cookieTheme ?? currentTheme ?? THEME.LIGHT;
  const theme = getTheme(mode, { highContrast, dyslexiaFont });

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
