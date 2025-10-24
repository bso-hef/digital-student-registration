import { Theme } from "@mui/material";

const MuiInputBaseOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    borderColor: theme.palette.border.seperator,
    textTransform: "none" as const,
    minHeight: 40,
  }),
};

export default MuiInputBaseOverride;
