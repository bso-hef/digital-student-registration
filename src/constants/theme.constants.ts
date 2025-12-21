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

export const HIGH_CONTRAST_LIGHT_COLORS = {
  BACKGROUND: "#FFFFFF",
  SURFACE: "#FFFFFF",
  TEXT: "#000000",
  TEXT_SECONDARY: "#1A1A1A",
  BORDER: "#000000",
  BORDER_STRONG: "#000000",
  PRIMARY: "#005A9C",
  SUCCESS: "#0F5D0F",
  ERROR: "#C10000",
  WARNING: "#7A4A00",
  INFO: "#005F8C",
};

export const HIGH_CONTRAST_DARK_COLORS = {
  BACKGROUND: "#000000",
  SURFACE: "#000000",
  TEXT: "#FFFFFF",
  TEXT_SECONDARY: "#E6E6E6",
  BORDER: "#FFFFFF",
  BORDER_STRONG: "#FFFFFF",
  PRIMARY: "#66CFFF",
  SUCCESS: "#5AFF5A",
  ERROR: "#FF6B6B",
  WARNING: "#FFB84D",
  INFO: "#4DC3FF",
};

export const DASHBOARD_GRADIENTS = {
  TOTAL_STUDENTS: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    solid: "#667eea",
    light: "#8b95ee",
    dark: "#5661c4",
  },
  TOTAL_CLASSES: {
    gradient: "linear-gradient(135deg, #667eea 0%, #4fc3f7 100%)",
    solid: "#5aa0f1",
    light: "#7eb2f4",
    dark: "#4685d4",
  },
  UNASSIGNED: {
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    solid: "#f375b3",
    light: "#f693c7",
    dark: "#d95e9a",
  },
  ACTIVE_CLASSES: {
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    solid: "#27cfff",
    light: "#52d9ff",
    dark: "#1eb8e6",
  },
  ONBOARDING_PROGRESS: {
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    solid: "#25c76b",
    light: "#4de88d",
    dark: "#1cb35f",
  },
  // Chart colors - distinct for each chart type
  CHART_LINE: "#8b5cf6", // Purple - Registration Trend
  CHART_BAR: "#14b8a6", // Teal - Class Distribution
  // Status colors for pie chart - distinct from each other
  STATUS_IMPORTED: "#3b82f6", // Blue - Created/Imported
  STATUS_INVITED: "#f59e0b", // Amber/Orange - Invited
  STATUS_ONBOARDED: "#22c55e", // Green - Onboarded/Enrolled
  STATUS_OTHER: "#6b7280", // Gray - Other
  // Legacy - keep for backwards compatibility
  CHART_PRIMARY: "#8b5cf6",
  CHART_SECONDARY: "#3b82f6",
  CHART_ACCENT: "#f093fb",
  CHART_SUCCESS: "#22c55e",
};
