import MuiDividerOverride from "./MuiDivider";
import MuiFormControlOverride from "./MuiFormControl";
import MuiFormControlLabelOverride from "./MuiFormControlLabel";
import MuiFormLabelOverride from "./MuiFormLabel";
import MuiInputBaseOverride from "./MuiInputBase";
import MuiOutlinedInputOverride from "./MuiOutlinedInput";
import MuiTextFieldOverride from "./MuiTextField";

const overrides = {
  MuiDivider: {
    styleOverrides: MuiDividerOverride,
  },
  MuiFormControl: {
    styleOverrides: MuiFormControlOverride,
  },
  MuiFormControlLabel: {
    styleOverrides: MuiFormControlLabelOverride,
  },
  MuiFormLabel: {
    styleOverrides: MuiFormLabelOverride,
  },
  MuiInputBase: {
    styleOverrides: MuiInputBaseOverride,
  },
  MuiOutlinedInput: {
    styleOverrides: MuiOutlinedInputOverride,
  },
  MuiTextField: {
    styleOverrides: MuiTextFieldOverride,
  },
};

export default overrides;
