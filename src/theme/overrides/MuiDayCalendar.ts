import { Theme } from "@mui/material";

const MuiDayCalendarOverride = {
  weekDayLabel: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
  }),

  weekContainer: ({ theme }: { theme: Theme }) => ({
    margin: theme.spacing(0.5, 0),
  }),
};

export default MuiDayCalendarOverride;
