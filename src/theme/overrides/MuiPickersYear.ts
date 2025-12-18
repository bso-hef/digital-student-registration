import { Theme } from "@mui/material";

const MuiPickersYearOverride = {
  yearButton: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
    borderRadius: theme.spacing(1),

    "&:hover": {
      backgroundColor: theme.palette.surface.button.hoverLight,
    },

    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },

    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
      opacity: 0.5,
    },
  }),
};

export default MuiPickersYearOverride;
