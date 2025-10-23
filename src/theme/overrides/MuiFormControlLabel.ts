import { Theme } from "@mui/material";

const MuiFormControlLabelOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
    marginLeft: 0,
  }),
  label: ({ theme }: { theme: Theme }) => ({
    fontSize: "14px",
    fontWeight: 400,
    color: theme.palette.text.default,
  }),
};

export default MuiFormControlLabelOverride;
