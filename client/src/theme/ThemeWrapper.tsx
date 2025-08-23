"use client";

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

  const localStorageTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;

  const cookieTheme = getCookie("theme");

  const mode = localStorageTheme ?? cookieTheme ?? currentTheme ?? THEME.DARK;
  const theme = getTheme(mode);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
