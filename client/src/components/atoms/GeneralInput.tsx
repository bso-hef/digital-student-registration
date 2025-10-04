"use client";

import React from "react";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment, TextField, styled } from "@mui/material";

const StyledInput = styled(TextField)(({ theme }) => ({
  flexShrink: 0,
  borderRadius: theme.spacing(0.5),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "stretch",
  fontFamily: "Inter",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "150%",
  backdropFilter: "blur(25px)",
}));

interface GeneralInputProps {
  type?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  sx?: object;
  autoComplete?: string;
  id?: string;
  name?: string;
  required?: boolean;
  showEmailStartIcon?: boolean;
  showUserStartIcon?: boolean;
  showSearchStartIcon?: boolean;
  error?: boolean;
  helperText?: string;
}

const GeneralInput: React.FC<GeneralInputProps> = ({
  type,
  value,
  onChange,
  label,
  placeholder,
  fullWidth,
  style,
  autoComplete,
  id,
  name,
  required = false,
  showEmailStartIcon,
  showUserStartIcon,
  showSearchStartIcon,
  error,
  helperText,
}) => {
  return (
    <StyledInput
      style={style}
      fullWidth={fullWidth}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      label={label}
      placeholder={placeholder}
      name={name}
      id={id}
      required={required}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {showEmailStartIcon && <EmailRoundedIcon />}
            {showUserStartIcon && <AccountCircleRoundedIcon />}
            {showSearchStartIcon && <SearchRoundedIcon />}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default GeneralInput;
