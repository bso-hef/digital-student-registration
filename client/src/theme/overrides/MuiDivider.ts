import { Theme } from "@mui/material";

const MuiDividerOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    borderColor: theme.palette.border.seperator,

    // For a vertical divider:
    "&.MuiDivider-vertical": {
      borderColor: theme.palette.border.seperator,
    },
  }),
};

export default MuiDividerOverride;
