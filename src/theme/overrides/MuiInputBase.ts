import { Theme } from "@mui/material";

const MuiInputBaseOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    borderColor: theme.palette.border.seperator,
    textTransform: "none !important",
    minHeight: 40,
  }),
};

export default MuiInputBaseOverride;
