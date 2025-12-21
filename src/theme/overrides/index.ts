import MuiCssBaselineOverride from "./MuiCssBaseline";
import MuiDateCalendarOverride from "./MuiDateCalendar";
import MuiDayCalendarOverride from "./MuiDayCalendar";
import MuiDividerOverride from "./MuiDivider";
import MuiFormControlOverride from "./MuiFormControl";
import MuiFormControlLabelOverride from "./MuiFormControlLabel";
import MuiFormLabelOverride from "./MuiFormLabel";
import MuiInputBaseOverride from "./MuiInputBase";
import MuiOutlinedInputOverride from "./MuiOutlinedInput";
import MuiPickerPopperOverride from "./MuiPickerPopper";
import MuiPickersArrowSwitcherOverride from "./MuiPickersArrowSwitcher";
import MuiPickersCalendarHeaderOverride from "./MuiPickersCalendarHeader";
import MuiPickersDayOverride from "./MuiPickersDay";
import MuiPickersYearOverride from "./MuiPickersYear";
import MuiSelectOverride from "./MuiSelect";
import MuiTextFieldOverride from "./MuiTextField";
import MuiYearCalendarOverride from "./MuiYearCalendar";

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
  MuiYearCalendar: {
    styleOverrides: MuiYearCalendarOverride,
  },
  MuiPickersYear: {
    styleOverrides: MuiPickersYearOverride,
  },
  MuiPickersDay: {
    styleOverrides: MuiPickersDayOverride,
  },
  MuiPickersCalendarHeader: {
    styleOverrides: MuiPickersCalendarHeaderOverride,
  },
  MuiDayCalendar: {
    styleOverrides: MuiDayCalendarOverride,
  },
  MuiPickersArrowSwitcher: {
    styleOverrides: MuiPickersArrowSwitcherOverride,
  },
  MuiSelect: {
    styleOverrides: MuiSelectOverride,
  },
};

export default overrides;
