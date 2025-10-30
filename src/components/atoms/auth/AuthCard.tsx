import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";

/**
 * Main authentication card container
 * Responsive design with proper max-widths for different screen sizes
 */
export const AuthCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "maxWidth",
})<{ maxWidth?: number }>(({ theme, maxWidth = 600 }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.surface.interface.base,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  border: `1px solid ${theme.palette.border.seperator}`,
  boxShadow: theme.shadows[4],
  width: "100%",
  maxWidth: maxWidth,
  margin: "0 auto",
  overflow: "hidden",
  minHeight: 0,
  maxHeight: "100%",
  textAlign: "left",
  // Large desktop (lg and up): Full specified maxWidth
  [theme.breakpoints.down("lg")]: {
    maxWidth: `min(${maxWidth}px, 85%)`,
    padding: theme.spacing(5),
  },
  // Tablet (md): Reduce to 90% with less padding
  [theme.breakpoints.down("md")]: {
    maxWidth: "90%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1.5),
  },
  // Mobile landscape and small tablets (sm): 95% width
  [theme.breakpoints.down("sm")]: {
    maxWidth: "95%",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
  },
  // Very small mobile (xs): Full width with minimal padding
  [theme.breakpoints.down(400)]: {
    maxWidth: "100%",
    padding: theme.spacing(2),
    borderRadius: 0,
    border: "none",
    boxShadow: "none",
  },
}));

/**
 * Header section for title and subtitle
 */
export const AuthHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "left",
  marginBottom: theme.spacing(4),
  gap: theme.spacing(1),
  "& .MuiTypography-h4": {
    color: theme.palette.text.primary,
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.75rem",
    },
    [theme.breakpoints.down(400)]: {
      fontSize: "1.5rem",
    },
  },
  "& .MuiTypography-h5": {
    color: theme.palette.text.primary,
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.25rem",
    },
    [theme.breakpoints.down(400)]: {
      fontSize: "1.1rem",
    },
  },
  "& .MuiTypography-body1, & .MuiTypography-body2": {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.down(400)]: {
      fontSize: "0.8rem",
    },
  },
  "& .MuiStepper-root": {
    width: "100%",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    "& .MuiStepLabel-label": {
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.75rem",
      },
      [theme.breakpoints.down(500)]: {
        display: "none",
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(3),
    gap: theme.spacing(0.5),
  },
  [theme.breakpoints.down(400)]: {
    marginBottom: theme.spacing(2),
  },
}));

/**
 * Content section for forms and main content
 * Includes custom scrollbar and overflow handling
 */
export const AuthContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
  overflow: "auto",
  flex: 1,
  minHeight: 0,
  textAlign: "left",
  ...applicationScrollbar(theme),
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(0),
  },
  "& .MuiAlert-root": {
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem",
    },
  },
  "& .MuiButton-root": {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem",
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
  },
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1.5),
  },
  [theme.breakpoints.down(400)]: {
    gap: theme.spacing(1),
  },
}));

/**
 * Actions section for buttons
 * Responsive button layout
 */
export const AuthActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  width: "100%",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2.5),
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2.5),
    paddingTop: theme.spacing(2),
    "& > button, & > div": {
      width: "100%",
    },
  },
  [theme.breakpoints.down(400)]: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
}));

/**
 * Container for auth pages that centers content and handles overflow
 */
export const AuthPageContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "100%",
  padding: "2rem 1rem",
}));
