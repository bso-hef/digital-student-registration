import { applicationScrollbar } from "@/utils/styling.utils";
import { Theme } from "@mui/material";

const MuiPickersPopperOverride = {
  paper: ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.surface.interface.background,
    color: theme.palette.text.default,
    border: `1px solid ${theme.palette.border.seperator}`,
    boxShadow:
      "0 10px 30px rgba(2, 6, 23, 0.12), 0 2px 8px rgba(2, 6, 23, 0.08)",
    borderRadius: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    overflow: "hidden",
    overflowY: "auto",
    ...applicationScrollbar(theme),
  }),
};

export default MuiPickersPopperOverride;
