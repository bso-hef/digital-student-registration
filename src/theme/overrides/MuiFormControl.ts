import { Theme } from "@mui/material";

const MuiFormControl = {
  root: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.default,
  }),
};

export default MuiFormControl;
