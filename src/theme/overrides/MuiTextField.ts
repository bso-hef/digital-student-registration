import { Theme } from "@mui/material";

const MuiTextFieldOverride = {
  root: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.information,
    textTransform: "none" as const,

    "& .MuiOutlinedInput-root": {
      color: theme.palette.text.default,
      textTransform: "none" as const,
    },

    "& .MuiInputBase-input::placeholder": {
      color: theme.palette.text.default,
      opacity: 1,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.seperator,
      transition: "border-color 0.2s ease",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.hover,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.hover,
    },

    "& .MuiSvgIcon-root": {
      color: theme.palette.icon.secondary,
      fill: theme.palette.icon.secondary,
    },
  }),

  input: ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.information,
  }),
};

export default MuiTextFieldOverride;
