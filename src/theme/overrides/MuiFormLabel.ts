import { Theme } from "@mui/material";

const MuiFormLabelOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    fontSize: "14px !important",
  }),
};

export default MuiFormLabelOverride;
