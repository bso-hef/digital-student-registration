import { Theme } from "@mui/material";

const MuiPickersDayOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
    borderRadius: "50%",

    "&:hover": {
      backgroundColor: theme.palette.surface.button.hoverLight,
    },

    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
      "&:focus": {
        backgroundColor: theme.palette.primary.main,
      },
    },

    "&.MuiPickersDay-today": {
      border: `1px solid ${theme.palette.primary.main}`,
      "&:not(.Mui-selected)": {
        backgroundColor: "transparent",
      },
    },

    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
      opacity: 0.5,
    },

    "&.MuiPickersDay-dayOutsideMonth": {
      color: theme.palette.text.disabled,
    },
  }),
};

export default MuiPickersDayOverride;
