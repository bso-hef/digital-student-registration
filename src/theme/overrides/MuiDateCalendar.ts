import { Theme } from "@mui/material";

const MuiDateCalendarOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.surface.interface.background,
    color: theme.palette.text.default,

    // Add subtle divider below header
    "& .MuiPickersCalendarHeader-root": {
      borderBottom: `1px solid ${theme.palette.border.seperator}`,
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }),
};

export default MuiDateCalendarOverride;
