import { Theme } from "@mui/material";

const MuiPickersCalendarHeaderOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  }),

  label: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
    fontWeight: 600,
  }),

  switchViewButton: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.icon.secondary,
    "&:hover": {
      backgroundColor: theme.palette.surface.button.hoverLight,
    },
  }),

  switchViewIcon: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.icon.secondary,
  }),
};

export default MuiPickersCalendarHeaderOverride;
