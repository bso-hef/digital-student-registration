import React from "react";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type Option = {
  label: string;
  value: string | number;
};

interface GeneralDropdownProps {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 180,
  borderRadius: theme.spacing(2),
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
  },
  "& .MuiSelect-outlined": {
    borderRadius: theme.spacing(2),
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: "18px !important",
  fontFamily: "Inter",
  fontWeight: 500,
  lineHeight: "24px",
  height: 50,
  color: theme.palette.text.default,
  padding: theme.spacing(1.2, 2),
  borderBottom: `1px solid ${theme.palette.border.seperator}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  ":last-child": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hoverLight,
  },
  "&:active": {
    backgroundColor: theme.palette.surface.button.focused,
  },
}));

const GeneralDropdown: React.FC<GeneralDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <StyledFormControl
      variant="outlined"
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        renderValue={(selected) => {
          if (!selected && placeholder) {
            return <em>{placeholder}</em>;
          }
          const option = options.find((o) => o.value === selected);
          return option ? option.label : "";
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              padding: 0,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[3],
            },
          },
        }}
      >
        {placeholder && (
          <StyledMenuItem value="">
            <em>{placeholder}</em>
          </StyledMenuItem>
        )}
        {options.map((option) => (
          <StyledMenuItem key={option.value} value={option.value}>
            <ListItemText primary={option.label} />
            {value === option.value && (
              <ListItemIcon sx={{ minWidth: "28px", color: "primary.main" }}>
                <CheckRoundedIcon fontSize="small" />
              </ListItemIcon>
            )}
          </StyledMenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default GeneralDropdown;
