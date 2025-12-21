import { Theme } from "@mui/material";

const MuiYearCalendarOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.surface.interface.background,
    color: theme.palette.text.default,
  }),
};

export default MuiYearCalendarOverride;
