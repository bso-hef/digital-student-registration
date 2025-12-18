import { appConfig, configHelpers } from "@/lib/config/app-config";
import { PaletteMode } from "@mui/material";

export type ThemeMode = PaletteMode | "auto";

export const THEME = {
  DARK: "dark" as PaletteMode,
  LIGHT: "light" as PaletteMode,
  AUTO: "auto" as ThemeMode,
} as const;

export const COLORS = {
  WHITE: "#ffffff",
  BLACK: "#000000",
  GREY: "#536886",
  ACCENT_COLOR: "#2b6e4a",
  RED: "#EE3426",
  LIGHT_RED: "#F44336",
  PINK: "#E91E63",
  PURPLE: "#9C27B0",
  DEEP_PURPLE: "#673AB7",
  INDIGO: "#3F51B5",
  LIGHT_BLUE: "#2196F3",
  CYAN: "#00BCD4",
  TEAL: "#009688",
  GREEN: "#37AC28",
  LIGHT_GREEN: "#4CAF50",
  LIME: "#8BC34A",
  AMBER: "#FFC107",
  ORANGE: "#FFAB2E",
  DEEP_ORANGE: "#FF9800",
  SUCCESS: "#4CAF50",
  INFO: "#2196F3",
  ERROR: "#F44336",
  WARNING: "#FFC107",
} as const;

export const LANGUAGES = {
  ENGLISH: {
    isoCode: "en",
    value: "English",
    key: "en",
  },
  GERMAN: {
    isoCode: "de",
    value: "German",
    key: "de-DE",
  },
} as const;

export type LanguageKey = keyof typeof LANGUAGES;

// Use centralized config for API URL
export const CONTEXT_PATH = appConfig.api.url;
export const NO_AVATAR_FOUND = `/images/no-avatar-found.png`;

export const STUDENT_STATUS = {
  IMPORTED: "imported",
  INVITED: "invited",
  ONBOARDED: "onboarded",
} as const;

// Wizard URL template with placeholder for short-id (used in PDF generation)
// This will automatically use the configured app URL from environment
export const WIZZARD_URL = `${appConfig.app.url}/student/{short-id}`;

// Helper function to get the actual wizard URL with a student short ID
export const getWizardUrl = (shortId: string): string =>
  configHelpers.getWizardUrl(shortId);

export const SCREEN_BLOCKER_TYPES = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
} as const;
