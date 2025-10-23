import { Theme } from "@mui/material";

const MuiDateCalendarOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.surface.interface.background,
    color: theme.palette.text.default,
  }),
};

export default MuiDateCalendarOverride;
