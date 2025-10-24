import { PaletteMode, createTheme, responsiveFontSizes } from "@mui/material";

import {
  BASE_THEME_COLORS,
  DARK_THEME_COLORS,
  HIGH_CONTRAST_DARK_COLORS,
  HIGH_CONTRAST_LIGHT_COLORS,
  LIGHT_THEME_COLORS,
} from "../constants/theme.constants";

import { THEME } from "../constants/general.constants";
import MuiOverrides from "./overrides";

export interface AccessibilityOptions {
  highContrast?: boolean;
  dyslexiaFont?: boolean;
}

const baseTheme = {
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    h1: { fontSize: 96, fontWeight: 700 },
    h2: { fontSize: 60, fontWeight: 700 },
    h3: { fontSize: 48, fontWeight: 700 },
    h4: { fontSize: 34, fontWeight: 700 },
    h5: { fontSize: 24, fontWeight: 400 },
    h6: { fontSize: 20, fontWeight: 500 },
    body1: { fontSize: 18, fontWeight: 400 },
    body2: { fontSize: 16, fontWeight: 400 },
    body3: { fontSize: 14, fontWeight: 400 },
    subtle1: { fontSize: 16, fontWeight: 400 },
    subtle2: { fontSize: 14, fontWeight: 500 },
    overline: { fontSize: 12, fontWeight: 400 },
    caption: { fontSize: 12, fontWeight: 400 },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: { ...MuiOverrides },
};

export const getTheme = (
  mode: PaletteMode,
  accessibilityOptions?: AccessibilityOptions,
) => {
  const isDark = mode === THEME.DARK;
  const highContrast = accessibilityOptions?.highContrast || false;
  const dyslexiaFont = accessibilityOptions?.dyslexiaFont || false;

  // Font family based on dyslexia font setting
  const fontFamily = dyslexiaFont
    ? '"OpenDyslexic", Inter, sans-serif'
    : "Inter, sans-serif";

  // Select color palette based on high contrast setting
  const getColor = (normalLight: string, normalDark: string) => {
    if (highContrast) {
      return isDark
        ? HIGH_CONTRAST_DARK_COLORS.PRIMARY
        : HIGH_CONTRAST_LIGHT_COLORS.PRIMARY;
    }
    return isDark ? normalDark : normalLight;
  };

  const theme = createTheme({
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily,
    },
    palette: {
      mode: isDark ? THEME.DARK : THEME.LIGHT,
      primary: {
        tertiary: highContrast
          ? getColor(
              HIGH_CONTRAST_LIGHT_COLORS.PRIMARY,
              HIGH_CONTRAST_DARK_COLORS.PRIMARY,
            )
          : BASE_THEME_COLORS.PRIMARY.TERTIARY,
        light: highContrast
          ? getColor(
              HIGH_CONTRAST_LIGHT_COLORS.PRIMARY,
              HIGH_CONTRAST_DARK_COLORS.PRIMARY,
            )
          : BASE_THEME_COLORS.PRIMARY.LIGHT,
        main: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.PRIMARY
            : HIGH_CONTRAST_LIGHT_COLORS.PRIMARY
          : BASE_THEME_COLORS.PRIMARY.MAIN,
        dark: highContrast
          ? getColor(
              HIGH_CONTRAST_LIGHT_COLORS.PRIMARY,
              HIGH_CONTRAST_DARK_COLORS.PRIMARY,
            )
          : BASE_THEME_COLORS.PRIMARY.DARK,
        link: highContrast
          ? getColor(
              HIGH_CONTRAST_LIGHT_COLORS.PRIMARY,
              HIGH_CONTRAST_DARK_COLORS.PRIMARY,
            )
          : BASE_THEME_COLORS.PRIMARY.LINK,
      },
      secondary: {
        white: BASE_THEME_COLORS.SECONDARY.WHITE,
        light: BASE_THEME_COLORS.SECONDARY.LIGHT,
        main: BASE_THEME_COLORS.SECONDARY.MAIN,
        dark: BASE_THEME_COLORS.SECONDARY.DARK,
        black: BASE_THEME_COLORS.SECONDARY.BLACK,
      },
      success: {
        light: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.SUCCESS
            : HIGH_CONTRAST_LIGHT_COLORS.SUCCESS
          : BASE_THEME_COLORS.SUCCESS.LIGHT,
        main: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.SUCCESS
            : HIGH_CONTRAST_LIGHT_COLORS.SUCCESS
          : BASE_THEME_COLORS.SUCCESS.MAIN,
        dark: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.SUCCESS
            : HIGH_CONTRAST_LIGHT_COLORS.SUCCESS
          : BASE_THEME_COLORS.SUCCESS.DARK,
      },
      warning: {
        light: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.WARNING
            : HIGH_CONTRAST_LIGHT_COLORS.WARNING
          : BASE_THEME_COLORS.WARNING.LIGHT,
        main: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.WARNING
            : HIGH_CONTRAST_LIGHT_COLORS.WARNING
          : BASE_THEME_COLORS.WARNING.MAIN,
        dark: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.WARNING
            : HIGH_CONTRAST_LIGHT_COLORS.WARNING
          : BASE_THEME_COLORS.WARNING.DARK,
      },
      error: {
        light: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.ERROR
            : HIGH_CONTRAST_LIGHT_COLORS.ERROR
          : BASE_THEME_COLORS.ERROR.LIGHT,
        main: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.ERROR
            : HIGH_CONTRAST_LIGHT_COLORS.ERROR
          : BASE_THEME_COLORS.ERROR.MAIN,
        dark: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.ERROR
            : HIGH_CONTRAST_LIGHT_COLORS.ERROR
          : BASE_THEME_COLORS.ERROR.DARK,
      },
      info: {
        light: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.INFO
            : HIGH_CONTRAST_LIGHT_COLORS.INFO
          : BASE_THEME_COLORS.INFO.LIGHT,
        main: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.INFO
            : HIGH_CONTRAST_LIGHT_COLORS.INFO
          : BASE_THEME_COLORS.INFO.MAIN,
        dark: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.INFO
            : HIGH_CONTRAST_LIGHT_COLORS.INFO
          : BASE_THEME_COLORS.INFO.DARK,
      },
      background: {
        default: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.BACKGROUND
            : HIGH_CONTRAST_LIGHT_COLORS.BACKGROUND
          : isDark
            ? DARK_THEME_COLORS[850]
            : LIGHT_THEME_COLORS[100],
        paper: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.SURFACE
            : HIGH_CONTRAST_LIGHT_COLORS.SURFACE
          : isDark
            ? DARK_THEME_COLORS[800]
            : BASE_THEME_COLORS.SECONDARY.WHITE,
      },
      text: {
        default: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.TEXT
            : HIGH_CONTRAST_LIGHT_COLORS.TEXT
          : isDark
            ? LIGHT_THEME_COLORS[300]
            : BASE_THEME_COLORS.SECONDARY.MAIN,
        primary: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.PRIMARY
            : HIGH_CONTRAST_LIGHT_COLORS.PRIMARY
          : isDark
            ? BASE_THEME_COLORS.PRIMARY.LIGHT
            : BASE_THEME_COLORS.PRIMARY.MAIN,
        secondary: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.TEXT_SECONDARY
            : HIGH_CONTRAST_LIGHT_COLORS.TEXT_SECONDARY
          : isDark
            ? LIGHT_THEME_COLORS[300]
            : BASE_THEME_COLORS.SECONDARY.MAIN,
        link: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.PRIMARY
            : HIGH_CONTRAST_LIGHT_COLORS.PRIMARY
          : BASE_THEME_COLORS.PRIMARY.LINK,
        information: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.INFO
            : HIGH_CONTRAST_LIGHT_COLORS.INFO
          : BASE_THEME_COLORS.SECONDARY.LIGHT,
        informationLight: BASE_THEME_COLORS.SECONDARY.DARK,
        contrast: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.BACKGROUND
            : HIGH_CONTRAST_LIGHT_COLORS.BACKGROUND
          : isDark
            ? LIGHT_THEME_COLORS[100]
            : BASE_THEME_COLORS.SECONDARY.WHITE,
        hover: LIGHT_THEME_COLORS[200],
        disabled: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[600],
        warning: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.WARNING
            : HIGH_CONTRAST_LIGHT_COLORS.WARNING
          : BASE_THEME_COLORS.ERROR.DARK,
        system: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.TEXT
            : HIGH_CONTRAST_LIGHT_COLORS.TEXT
          : BASE_THEME_COLORS.SECONDARY.BLACK,
      },
      icon: {
        primary: isDark
          ? BASE_THEME_COLORS.PRIMARY.LIGHT
          : BASE_THEME_COLORS.PRIMARY.MAIN, // icon/primary
        secondary: isDark
          ? LIGHT_THEME_COLORS[600]
          : BASE_THEME_COLORS.SECONDARY.MAIN, // icon/secondary
        contrast: isDark
          ? LIGHT_THEME_COLORS[400]
          : BASE_THEME_COLORS.SECONDARY.WHITE, // icon/contrast
        information: isDark
          ? BASE_THEME_COLORS.SECONDARY.MAIN
          : BASE_THEME_COLORS.SECONDARY.LIGHT, // icon/information
        disabled: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[600], // icon/disabled
        alert: BASE_THEME_COLORS.ERROR.MAIN, // icon/alert
      },
      border: {
        // before divider
        default: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.BORDER
            : HIGH_CONTRAST_LIGHT_COLORS.BORDER
          : isDark
            ? BASE_THEME_COLORS.DIVIDER.DARK
            : BASE_THEME_COLORS.DIVIDER.LIGHT,
        primary: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.PRIMARY
            : HIGH_CONTRAST_LIGHT_COLORS.PRIMARY
          : isDark
            ? BASE_THEME_COLORS.PRIMARY.LIGHT
            : BASE_THEME_COLORS.PRIMARY.MAIN,
        hover: isDark
          ? BASE_THEME_COLORS.SECONDARY.MAIN
          : BASE_THEME_COLORS.SECONDARY.LIGHT,
        seperator: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.BORDER
            : HIGH_CONTRAST_LIGHT_COLORS.BORDER
          : isDark
            ? DARK_THEME_COLORS[650]
            : LIGHT_THEME_COLORS[400],
        inactive: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[500],
        error: highContrast
          ? isDark
            ? HIGH_CONTRAST_DARK_COLORS.ERROR
            : HIGH_CONTRAST_LIGHT_COLORS.ERROR
          : isDark
            ? BASE_THEME_COLORS.ERROR.MAIN
            : BASE_THEME_COLORS.ERROR.DARK,
      },
      surface: {
        button: {
          primary: BASE_THEME_COLORS.PRIMARY.MAIN, // surface/button/primary
          hover: BASE_THEME_COLORS.PRIMARY.DARK, // surface/button/hover
          secondary: isDark
            ? DARK_THEME_COLORS[650]
            : BASE_THEME_COLORS.PRIMARY.TERTIARY, // surface/button/secondary
          hoverLight: isDark ? DARK_THEME_COLORS[700] : LIGHT_THEME_COLORS[200], // surface/button/hoverLight
          disabled: isDark ? DARK_THEME_COLORS[700] : LIGHT_THEME_COLORS[300], // surface/button/disabled
          focused: isDark ? DARK_THEME_COLORS[750] : LIGHT_THEME_COLORS[400], // surface/button/focused
        },
        interface: {
          base: isDark
            ? DARK_THEME_COLORS[800]
            : BASE_THEME_COLORS.SECONDARY.WHITE, // surface/interface/base
          background: isDark ? DARK_THEME_COLORS[850] : LIGHT_THEME_COLORS[100], // surface/interface/background
          backElevation: isDark
            ? DARK_THEME_COLORS[900]
            : LIGHT_THEME_COLORS[200], // surface/interface/backElevation
          active: isDark ? DARK_THEME_COLORS[750] : LIGHT_THEME_COLORS[300], // surface/interface/active
          dark: isDark
            ? DARK_THEME_COLORS[850]
            : BASE_THEME_COLORS.SECONDARY.MAIN, // surface/interface/dark
          navigation: "rgba(83, 104, 134, 0.50)", // surface/interface/navigation
          overlay: "rgba(29, 29, 43, 0.60)", // surface/interface/overlay
          disabled: DARK_THEME_COLORS[900], // surface/interface/disabled
          boxShadow: isDark
            ? "rgba(29, 29, 43, 0.4)"
            : "rgba(87, 104, 131, 0.2)", // surface/interface/boxShadow
        },
        alert: {
          success: BASE_THEME_COLORS.SUCCESS.MAIN, // surface/alert/success
          warning: BASE_THEME_COLORS.WARNING.MAIN, // surface/alert/warning
          error: BASE_THEME_COLORS.ERROR.MAIN, // surface/alert/error
          info: BASE_THEME_COLORS.INFO.MAIN, // surface/alert/info
        },
      },
    },
  });
  return responsiveFontSizes(theme);
};

export default getTheme;
