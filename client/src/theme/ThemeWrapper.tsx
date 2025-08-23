"use client";

import { THEME } from "@/constants/generalConstants";
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

  const localStorageTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;

  const mode = currentTheme ?? localStorageTheme ?? THEME.DARK;
  const theme = getTheme(mode);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
