import { PaletteMode } from "@mui/material";

export const THEME = {
  DARK: "dark" as PaletteMode,
  LIGHT: "light" as PaletteMode,
};

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
};

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
};

export const CONTEXT_PATH = process.env.NEXT_PUBLIC_API_URL || "";
// export const MY_URL = `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`;
// export const FILE_URL = `${MY_URL}/api/document/download/`;
// export const AVATAR_URL = `${MY_URL}/api/files/avatar`;
