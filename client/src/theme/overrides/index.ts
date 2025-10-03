import MuiCssBaselineOverride from "./MuiCssBaseline";
import MuiDateCalendarOverride from "./MuiDateCalendar";
import MuiDividerOverride from "./MuiDivider";
import MuiFormControlOverride from "./MuiFormControl";
import MuiFormControlLabelOverride from "./MuiFormControlLabel";
import MuiFormLabelOverride from "./MuiFormLabel";
import MuiInputBaseOverride from "./MuiInputBase";
import MuiOutlinedInputOverride from "./MuiOutlinedInput";
import MuiPickerPopperOverride from "./MuiPickerPopper";
import MuiTextFieldOverride from "./MuiTextField";

const overrides = {
  MuiCssBaseline: {
    styleOverrides: MuiCssBaselineOverride,
  },
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
  MuiPickerPopper: {
    styleOverrides: MuiPickerPopperOverride,
  },
  MuiDateCalendar: {
    styleOverrides: MuiDateCalendarOverride,
  },
};

export default overrides;
