import React from "react";

import { SelectChangeEvent } from "@mui/material";
import { useField } from "formik";

import GeneralDropdown from "../GeneralDropdown";

type Option = {
  label: string;
  value: string | number;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
};

interface FormikDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  flagIcon?: boolean;
  required?: boolean;
}

/**
 * Formik-integrated dropdown component that wraps GeneralDropdown
 * Handles form state, validation, and error display automatically
 */
const FormikDropdown: React.FC<FormikDropdownProps> = ({
  name,
  label,
  options,
  placeholder,
  disabled = false,
  fullWidth = true,
  size = "medium",
  variant = "outlined",
  flagIcon = false,
  required = false,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    helpers.setValue(event.target.value);
    helpers.setTouched(true);
  };

  return (
    <GeneralDropdown
      value={field.value ?? ""}
      onChange={handleChange}
      options={options}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      flagIcon={flagIcon}
      required={required}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

export default FormikDropdown;
