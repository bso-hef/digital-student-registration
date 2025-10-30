import React from "react";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  styled,
} from "@mui/material";

type Option = {
  label: string;
  value: string | number;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
};

interface GeneralDropdownProps {
  defaultValue?: string | number;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  error?: boolean;
  invisibleOutline?: boolean;
  helperText?: string;
  flagIcon?: boolean;
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledDropdown = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

const StyledLabel = styled(InputLabel, {
  shouldForwardProp: (prop) => prop !== "disabled",
})(({ theme, disabled }) => ({
  fontSize: "16px !important",
  lineHeight: "20px !important",
  fontWeight: 400,
  color: disabled ? theme.palette.text.disabled : theme.palette.text.default,
}));

const StyledLeftIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "flagIcon",
})<{ flagIcon?: boolean }>(({ theme, flagIcon }) => ({
  fontSize: flagIcon ? undefined : "24px",
  height: flagIcon ? undefined : 28,
  color: theme.palette.icon.disabled,
  marginRight: theme.spacing(1),
  "& svg": {
    height: 24,
    width: 24,
    fontSize: "24px",
  },
  "& path": {
    fill: theme.palette.icon.disabled,
  },
}));

const StyledMenuItemText = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  color: theme.palette.text.default,
  fontFamily: "Roboto, sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "24px !important",
}));

const StyledCheckIcon = styled(Box)(({ theme }) => ({
  fontSize: "18px",
  height: 22,
  color: theme.palette.icon.primary,
  marginLeft: theme.spacing(1),
  "& svg": {
    height: 18,
    width: 18,
    fontSize: "18px",
  },
  "& path": {
    fill: theme.palette.icon.primary,
  },
}));

const GeneralDropdown: React.FC<GeneralDropdownProps> = ({
  value,
  defaultValue,
  onChange,
  options = [],
  label,
  placeholder,
  disabled = false,
  size = "medium",
  variant = "outlined",
  fullWidth = true,
  error = false,
  invisibleOutline = false,
  helperText,
  flagIcon = false,
}) => {
  return (
    <StyledDropdown fullWidth>
      <StyledLabel disabled={disabled}>{label}</StyledLabel>
      <Select
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        displayEmpty
        error={error}
        variant={variant}
        label={label}
        IconComponent={ExpandMoreRoundedIcon}
        style={{ maxHeight: 24, height: 24 }}
        renderValue={(selected) => {
          if (selected === "" || selected == null) {
            return (
              placeholder && (
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
              )
            );
          }
          const match = options.find((o) => o.value === selected);
          if (!match) return "";
          return (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, height: 24 }}
            >
              {match.leftIcon && (
                <StyledLeftIcon>{match.leftIcon}</StyledLeftIcon>
              )}
              <StyledMenuItemText>{match.label}</StyledMenuItemText>
            </Box>
          );
        }}
        sx={
          invisibleOutline
            ? {
                "& fieldset": {
                  border: "none",
                },
              }
            : {}
        }
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options?.map((opt) => {
          const isSelected = value === opt.value;

          return (
            <MenuItem key={opt.value} disabled={opt.disabled} value={opt.value}>
              {opt?.leftIcon && (
                <StyledLeftIcon flagIcon={flagIcon}>
                  {opt.leftIcon}
                </StyledLeftIcon>
              )}
              <StyledMenuItemText>{opt.label}</StyledMenuItemText>
              <Box flexGrow={1} />
              {isSelected && (
                <StyledCheckIcon>
                  <CheckRoundedIcon />
                </StyledCheckIcon>
              )}
            </MenuItem>
          );
        })}
      </Select>

      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </StyledDropdown>
  );
};

export default GeneralDropdown;
