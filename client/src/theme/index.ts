import { PaletteMode, createTheme, responsiveFontSizes } from "@mui/material";

import {
  BASE_THEME_COLORS,
  DARK_THEME_COLORS,
  LIGHT_THEME_COLORS,
} from "../constants/themeConstants";

import { THEME } from "../constants/generalConstants";
import MuiOverrides from "./overrides";

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

export const getTheme = (mode: PaletteMode) => {
  const isDark = mode === THEME.DARK;

  const theme = createTheme({
    ...baseTheme,
    palette: {
      mode: isDark ? THEME.DARK : THEME.LIGHT,
      primary: {
        tertiary: BASE_THEME_COLORS.PRIMARY.TERTIARY,
        light: BASE_THEME_COLORS.PRIMARY.LIGHT,
        main: BASE_THEME_COLORS.PRIMARY.MAIN,
        dark: BASE_THEME_COLORS.PRIMARY.DARK,
        link: BASE_THEME_COLORS.PRIMARY.LINK,
      },
      secondary: {
        white: BASE_THEME_COLORS.SECONDARY.WHITE,
        light: BASE_THEME_COLORS.SECONDARY.LIGHT,
        main: BASE_THEME_COLORS.SECONDARY.MAIN,
        dark: BASE_THEME_COLORS.SECONDARY.DARK,
        black: BASE_THEME_COLORS.SECONDARY.BLACK,
      },
      success: {
        light: BASE_THEME_COLORS.SUCCESS.LIGHT,
        main: BASE_THEME_COLORS.SUCCESS.MAIN, // surface/alert/success (green)
        dark: BASE_THEME_COLORS.SUCCESS.DARK,
      },
      warning: {
        light: BASE_THEME_COLORS.WARNING.LIGHT,
        main: BASE_THEME_COLORS.WARNING.MAIN, // surface/alert/warning (yellow)
        dark: BASE_THEME_COLORS.WARNING.DARK,
      },
      error: {
        light: BASE_THEME_COLORS.ERROR.LIGHT,
        main: BASE_THEME_COLORS.ERROR.MAIN, // surface/alert/error (red)
        dark: BASE_THEME_COLORS.ERROR.DARK,
      },
      info: {
        light: BASE_THEME_COLORS.INFO.LIGHT,
        main: BASE_THEME_COLORS.INFO.MAIN, // surface/alert/info (blue)
        dark: BASE_THEME_COLORS.INFO.DARK,
      },
      background: {
        default: isDark ? DARK_THEME_COLORS[850] : LIGHT_THEME_COLORS[100], // surface/interface/background
        paper: isDark
          ? DARK_THEME_COLORS[800]
          : BASE_THEME_COLORS.SECONDARY.WHITE, // surface/interface/base
      },
      text: {
        default: isDark
          ? LIGHT_THEME_COLORS[300]
          : BASE_THEME_COLORS.SECONDARY.MAIN, // text/default
        primary: isDark
          ? BASE_THEME_COLORS.PRIMARY.LIGHT
          : BASE_THEME_COLORS.PRIMARY.MAIN, // text/primary
        secondary: isDark
          ? LIGHT_THEME_COLORS[300]
          : BASE_THEME_COLORS.SECONDARY.MAIN, // text/default (Again there because of default mui import)
        link: BASE_THEME_COLORS.PRIMARY.LINK, // text/link
        information: BASE_THEME_COLORS.SECONDARY.LIGHT, // text/information
        informationLight: BASE_THEME_COLORS.SECONDARY.DARK, // text/informationLight
        contrast: isDark
          ? LIGHT_THEME_COLORS[100]
          : BASE_THEME_COLORS.SECONDARY.WHITE, // text/contrast
        hover: LIGHT_THEME_COLORS[200], // text/hover
        disabled: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[600], // text/disabled
        warning: BASE_THEME_COLORS.ERROR.DARK, // text/warning
        system: BASE_THEME_COLORS.SECONDARY.BLACK, // text/system
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
        default: isDark
          ? BASE_THEME_COLORS.DIVIDER.DARK
          : BASE_THEME_COLORS.DIVIDER.LIGHT, // divider/default
        primary: isDark
          ? BASE_THEME_COLORS.PRIMARY.LIGHT
          : BASE_THEME_COLORS.PRIMARY.MAIN, // divider/primary
        hover: isDark
          ? BASE_THEME_COLORS.SECONDARY.MAIN
          : BASE_THEME_COLORS.SECONDARY.LIGHT, // divider/hover
        seperator: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[400], // divider/seperator
        inactive: isDark ? DARK_THEME_COLORS[650] : LIGHT_THEME_COLORS[500], // divider/inactive
        error: isDark
          ? BASE_THEME_COLORS.ERROR.MAIN
          : BASE_THEME_COLORS.ERROR.DARK, // divider/error
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
