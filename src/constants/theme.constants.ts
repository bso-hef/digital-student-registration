export const BASE_THEME_COLORS = {
  PRIMARY: {
    TERTIARY: "#D1F3F4",
    LIGHT: "#82D7DA",
    MAIN: "#4DBFC3",
    DARK: "#5AA5A7",
    LINK: "#3BB1B5",
  },
  SECONDARY: {
    WHITE: "#FFFFFF",
    LIGHT: "#7B7A7E",
    MAIN: "#515053",
    DARK: "#282829",
    BLACK: "#000000",
  },
  SUCCESS: {
    LIGHT: "#8BC34A",
    MAIN: "#45BB36",
    DARK: "#37AC28",
  },
  WARNING: {
    LIGHT: "#F7BF6B",
    MAIN: "#F2B04F",
    DARK: "#FFAB2E",
  },
  ERROR: {
    LIGHT: "#EB7C7E",
    MAIN: "#EF5B5C",
    DARK: "#EE3426",
  },
  INFO: {
    LIGHT: "#4FC3F7",
    MAIN: "#03A9F4",
    DARK: "#039BE5",
  },
  DIVIDER: {
    LIGHT: "rgba(0, 0, 0, 0.12)",
    DARK: "rgba(255, 255, 255, 0.12)",
  },
  GRADIENT:
    "linear-gradient( 90deg, #0052CC 0%, #007DFF 33%, #66FF99 66%, #7AC883 100%)",
};

export const LIGHT_THEME_COLORS = {
  100: "#FAFAFA",
  200: "#F3F5F7",
  300: "#F2F2F2",
  400: "#D8DFE0",
  500: "#B8C0C2",
  600: "#6F7071",
};

export const DARK_THEME_COLORS = {
  650: "#4F5052",
  700: "#343536",
  750: "#2A2A2B",
  800: "#202021",
  850: "#18191B",
  900: "#121314",
};

// High Contrast Mode Colors (WCAG AAA Compliant - 7:1 ratio)
export const HIGH_CONTRAST_LIGHT_COLORS = {
  BACKGROUND: "#FFFFFF",
  SURFACE: "#FFFFFF",
  TEXT: "#000000",
  TEXT_SECONDARY: "#1A1A1A",
  BORDER: "#000000",
  BORDER_STRONG: "#000000",
  PRIMARY: "#005A9C", // Dark blue with high contrast
  SUCCESS: "#0F5D0F", // Dark green
  ERROR: "#C10000", // Dark red
  WARNING: "#7A4A00", // Dark orange
  INFO: "#005F8C", // Dark cyan
};

export const HIGH_CONTRAST_DARK_COLORS = {
  BACKGROUND: "#000000",
  SURFACE: "#000000",
  TEXT: "#FFFFFF",
  TEXT_SECONDARY: "#E6E6E6",
  BORDER: "#FFFFFF",
  BORDER_STRONG: "#FFFFFF",
  PRIMARY: "#66CFFF", // Bright blue
  SUCCESS: "#5AFF5A", // Bright green
  ERROR: "#FF6B6B", // Bright red
  WARNING: "#FFB84D", // Bright orange
  INFO: "#4DC3FF", // Bright cyan
};
