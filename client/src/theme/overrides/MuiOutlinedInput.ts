import { Theme } from "@mui/material";

const MuiOutlinedInputOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    ".MuiSelect-icon": {
      color: theme.palette.icon.secondary,
    },
    ".MuiSelect-root": {
      borderColor: theme.palette.border.seperator,
    },
    "&.Mui-disabled": {
      // tint the outline (fieldset)
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.border.seperator,
      },
      // tint the input text
      "& .MuiInputBase-input": {
        color: theme.palette.text.disabled,
      },
      // tint the select‐dropdown icon when disabled
      "& .MuiSelect-icon": {
        color: theme.palette.text.disabled,
      },
    },
  }),
  input: ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.surface.interface.base,
    backgroundImage: "none",
    textTransform: "none",
    fontSize: 16,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    minHeight: 24,

    "&.MuiInputBase-input.MuiOutlinedInput-input::placeholder": {
      color: theme.palette.text.information,
      opacity: 0.5,
    },

    "&:hover": {
      borderColor: theme.palette.border.hover,
    },
  }),
  notchedOutline: ({ theme }: { theme: Theme }) => ({
    borderColor: theme.palette.border.seperator,
  }),
};

export default MuiOutlinedInputOverride;
