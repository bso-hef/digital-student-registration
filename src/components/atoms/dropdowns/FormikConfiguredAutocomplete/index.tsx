import React, { useEffect, useMemo, useRef, useState } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { DropdownOption, OnboardingSettings } from "@/types/settings";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { useField } from "formik";

interface FormikConfiguredAutocompleteProps {
  name: string;
  fieldConfigKey: keyof OnboardingSettings["fieldConfigs"];
  label?: string;
  options: DropdownOption[];
  emptyValue?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

type ConfiguredAutocompleteOption = DropdownOption | string;

const filterConfiguredOptions =
  createFilterOptions<ConfiguredAutocompleteOption>({
    stringify: (option) =>
      typeof option === "string" ? option : `${option.label} ${option.value}`,
  });

/**
 * Formik-integrated autocomplete for option lists managed by backend settings.
 * Supports selecting configured values and, when enabled, committing custom
 * text input when the field loses focus.
 */
const FormikConfiguredAutocomplete: React.FC<
  FormikConfiguredAutocompleteProps
> = ({
  name,
  fieldConfigKey,
  label,
  options,
  emptyValue = "",
  placeholder,
  disabled = false,
  fullWidth = true,
  size = "medium",
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const { fieldConfigs } = useOnboardingSettings();
  const fieldConfig = fieldConfigs?.[fieldConfigKey] ?? {
    required: false,
    visible: true,
    allowCustom: false,
  };
  const { allowCustom, required, visible } = fieldConfig;
  const inputValueRef = useRef(field.value || emptyValue);

  const enabledOptions = useMemo(
    () =>
      options
        .filter((option) => option.enabled)
        .sort((a, b) => a.order - b.order),
    [options],
  );

  const configuredOption = enabledOptions.find(
    (option) => option.value === field.value,
  );
  const fieldDisplayValue =
    configuredOption?.label ?? (allowCustom ? field.value || "" : "");
  const [inputState, setInputState] = useState({
    fieldValue: field.value,
    text: fieldDisplayValue,
  });
  const inputValue =
    inputState.fieldValue === field.value ? inputState.text : fieldDisplayValue;

  useEffect(() => {
    inputValueRef.current = field.value || emptyValue;
  }, [emptyValue, field.value]);

  const selectedValue =
    enabledOptions.find((option) => option.value === field.value) ??
    (allowCustom && field.value ? field.value : null);

  const setValue = (value: string) => {
    inputValueRef.current = value;
    helpers.setValue(value);
  };

  if (!visible) {
    return null;
  }

  return (
    <Autocomplete<ConfiguredAutocompleteOption, false, false, boolean>
      options={enabledOptions}
      value={selectedValue}
      inputValue={inputValue}
      freeSolo={allowCustom}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      isOptionEqualToValue={(option, value) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const valueToCompare = typeof value === "string" ? value : value.value;
        return optionValue === valueToCompare;
      }}
      filterOptions={(availableOptions, params) => {
        const filtered = filterConfiguredOptions(availableOptions, params);
        const customValue = params.inputValue.trim();
        const alreadyExists = enabledOptions.some(
          (option) =>
            option.value.toLocaleLowerCase() ===
              customValue.toLocaleLowerCase() ||
            option.label.toLocaleLowerCase() ===
              customValue.toLocaleLowerCase(),
        );

        if (allowCustom && customValue && !alreadyExists) {
          filtered.push(customValue);
        }

        return filtered;
      }}
      onChange={(_, newValue) => {
        const value =
          typeof newValue === "string"
            ? newValue
            : newValue?.value || emptyValue;
        setValue(value);
        setInputState({
          fieldValue: value,
          text: typeof newValue === "string" ? newValue : newValue?.label || "",
        });
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "input") {
          inputValueRef.current = newInputValue;
          setInputState({ fieldValue: field.value, text: newInputValue });
        }
      }}
      onBlur={() => {
        if (allowCustom) {
          const value = inputValueRef.current.trim() || emptyValue;
          const matchingOption = enabledOptions.find(
            (option) => option.value === value,
          );
          setValue(value);
          setInputState({
            fieldValue: value,
            text: matchingOption?.label ?? value,
          });
        }
        helpers.setTouched(true);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          label={label}
          placeholder={placeholder}
          required={required}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error ? meta.error : undefined}
        />
      )}
    />
  );
};

export default FormikConfiguredAutocomplete;
