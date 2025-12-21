"use client";

import { useTheme } from "@mui/material";
import { Toaster } from "sonner";

/**
 * ThemedToaster component that integrates Sonner toast notifications
 * with the application's Material-UI theme.
 *
 * This component must be rendered inside the ThemeProvider context
 * to access custom theme properties like surface.interface.background.
 */
export function ThemedToaster() {
  const theme = useTheme();

  const backgroundColor = theme.palette.surface.interface.background;

  return (
    <Toaster
      position="top-right"
      richColors
      theme={theme.palette.mode}
      duration={4000}
      expand
      toastOptions={{
        style: {
          backgroundColor: backgroundColor,
          backdropFilter: "blur(15px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        },
      }}
    />
  );
}
