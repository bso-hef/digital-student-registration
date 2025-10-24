import { THEME } from "@/constants/general.constants";
import { isFirefox } from "@/utils/general.utils";
import { Theme } from "@mui/material";

const MuiCssBaselineOverride = (theme: Theme) => {
  const isDark = theme.palette.mode === THEME.DARK;
  const thumb = isDark
    ? theme.palette.text.primary
    : theme.palette.text.disabled;
  const track = theme.palette.surface.interface.background;
  const background = isDark
    ? theme.palette.primary.main
    : theme.palette.primary.light;

  return {
    // WebKit (Chrome, Edge, Safari)
    "*::-webkit-scrollbar": {
      width: 4,
      height: 4,
      borderRadius: 4,
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      backgroundColor: track,
    },
    "*::-webkit-scrollbar-thumb": {
      borderRadius: 4,
      backgroundColor: thumb,
    },
    "*::-webkit-scrollbar-thumb:hover": {
      backgroundColor: background,
      cursor: "pointer",
    },

    // For document scrolling, explicitly include html/body (some browsers/layouts respond better to this)
    "html::-webkit-scrollbar, body::-webkit-scrollbar": {
      width: 4,
      height: 4,
    },
    "html::-webkit-scrollbar-track, body::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      backgroundColor: track,
    },
    "html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb": {
      borderRadius: 4,
      backgroundColor: thumb,
    },
    "html::-webkit-scrollbar-thumb:hover, body::-webkit-scrollbar-thumb:hover":
      {
        backgroundColor: background,
        cursor: "pointer",
      },

    /* --- Firefox --- */
    ...(isFirefox && {
      "*": { scrollbarWidth: "thin", scrollbarColor: `${thumb} ${track}` },
      "html, body": {
        scrollbarWidth: "thin",
        scrollbarColor: `${thumb} ${track}`,
      },
    }),

    /* --- Accessibility --- */
    "@media (forced-colors: active)": {
      "*": { scrollbarColor: "auto" },
      "html, body": { scrollbarWidth: "auto" },
    },

    /* --- Reduced Motion --- */
    "@media (prefers-reduced-motion: reduce)": {
      "*": {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.01ms !important",
        scrollBehavior: "auto !important",
      },
    },

    /* --- OpenDyslexic Font Import --- */
    "@import": [
      "url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap')",
    ],
  };
};

export default MuiCssBaselineOverride;
