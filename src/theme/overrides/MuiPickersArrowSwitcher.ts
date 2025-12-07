import { Theme } from "@mui/material";

const MuiPickersArrowSwitcherOverride = {
  button: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.icon.secondary,

    "&:hover": {
      backgroundColor: theme.palette.surface.button.hoverLight,
    },

    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
      opacity: 0.4,
    },
  }),
};

export default MuiPickersArrowSwitcherOverride;
