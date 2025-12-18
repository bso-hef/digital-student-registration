import React, { memo, useCallback, useEffect, useState } from "react";

import {
  calculatePasswordStrength,
  validatePasswordStrength,
} from "@/utils/validation.utils";
import CasinoIcon from "@mui/icons-material/Casino";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HttpsIcon from "@mui/icons-material/Https";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface PasswordValidation {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

interface PasswordInputProps {
  showCubeIcon?: boolean;
  showEyeIcon?: boolean;
  showPasswordStartIcon?: boolean;
  showProgressBar?: boolean;
  showGuidelines?: boolean;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onStrengthChange?: (strength: number) => void;
  onValidationFail?: () => void;
  id?: string;
  autoComplete?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  minLength?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = memo(
  ({
    showCubeIcon = false,
    showEyeIcon = true,
    showPasswordStartIcon = false,
    showProgressBar = false,
    showGuidelines = false,
    value,
    placeholder,
    onChange,
    onKeyDown,
    onStrengthChange,
    onValidationFail,
    id,
    autoComplete = "current-password",
    fullWidth = true,
    error = false,
    helperText,
    label,
    required = false,
    minLength = 8,
  }) => {
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] =
      useState<PasswordValidation>({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        hasSpecialChar: false,
        hasMinLength: false,
      });

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => event.preventDefault();

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const isValidPassword = (password: string): boolean => {
      const validation = validatePasswordStrength(password);
      return (
        validation.hasUppercase &&
        validation.hasLowercase &&
        validation.hasSpecialChar &&
        validation.hasNumber &&
        password.length >= minLength
      );
    };

    const checkValidations = useCallback(
      (password: string) => {
        const validation = validatePasswordStrength(password);
        setPasswordValidation({
          hasUpperCase: validation.hasUppercase,
          hasLowerCase: validation.hasLowercase,
          hasNumbers: validation.hasNumber,
          hasSpecialChar: validation.hasSpecialChar,
          hasMinLength: password.length >= minLength,
        });
      },
      [minLength],
    );

    const generatePassword = () => {
      const characters = {
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        special: '!@#$%^&*(),.?":{}|<>',
      };

      const getRandomChar = (str: string): string =>
        str[Math.floor(Math.random() * str.length)];

      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        // Generate a strong password with guaranteed 100% strength
        // Minimum 16 characters with balanced character distribution
        const password: string[] = [
          // 4 uppercase letters
          getRandomChar(characters.upper),
          getRandomChar(characters.upper),
          getRandomChar(characters.upper),
          getRandomChar(characters.upper),
          // 4 lowercase letters
          getRandomChar(characters.lower),
          getRandomChar(characters.lower),
          getRandomChar(characters.lower),
          getRandomChar(characters.lower),
          // 3 numbers
          getRandomChar(characters.numbers),
          getRandomChar(characters.numbers),
          getRandomChar(characters.numbers),
          // 3 special characters
          getRandomChar(characters.special),
          getRandomChar(characters.special),
          getRandomChar(characters.special),
        ];

        // Add 2 more random characters from all categories
        const allCharacters = Object.values(characters).join("");
        password.push(getRandomChar(allCharacters));
        password.push(getRandomChar(allCharacters));

        // Shuffle the password randomly
        const finalPassword = password.sort(() => Math.random() - 0.5).join("");

        // Verify the password meets all requirements and has 100% strength
        const strength = calculatePasswordStrength(finalPassword);
        if (strength === 100 && isValidPassword(finalPassword)) {
          onChange({
            target: { value: finalPassword },
          } as React.ChangeEvent<HTMLInputElement>);
          return;
        }

        attempts++;
      }

      // Fallback: If we couldn't generate a 100% password, notify
      onValidationFail?.();
    };

    const getProgressBarColor = (strength: number): string => {
      if (strength < 50) return "#FF0000";
      if (strength < 75) return "#FF8800";
      if (strength < 100) return "#FFA500";
      return "#008000";
    };

    useEffect(() => {
      checkValidations(value);
      const strength = calculatePasswordStrength(value);
      onStrengthChange?.(strength);
    }, [value, onStrengthChange, minLength, checkValidations]);

    return (
      <>
        <TextField
          type={showPassword ? "text" : "password"}
          required={required}
          fullWidth={fullWidth}
          placeholder={placeholder}
          label={label}
          name="password"
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          onKeyDown={onKeyDown}
          id={id}
          error={error}
          helperText={helperText}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: (theme) => theme.palette.border.seperator,
              },
              "&.Mui-focused fieldset": {
                borderColor: (theme) => theme.palette.surface.button.primary,
                borderWidth: 2,
              },
              "&.Mui-error fieldset": {
                borderColor: (theme) => theme.palette.error.main,
              },
            },
          }}
          InputProps={{
            startAdornment: showPasswordStartIcon ? (
              <InputAdornment position="start">
                <HttpsIcon
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                />
              </InputAdornment>
            ) : undefined,
            endAdornment: (
              <InputAdornment position="end">
                {showCubeIcon && (
                  <IconButton
                    onClick={generatePassword}
                    edge={showEyeIcon ? false : "end"}
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                    aria-label={t("general.generatePassword")}
                  >
                    <CasinoIcon />
                  </IconButton>
                )}
                {showEyeIcon && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        {showProgressBar && (
          <LinearProgress
            variant="determinate"
            value={calculatePasswordStrength(value)}
            sx={{
              width: "100%",
              borderRadius: "6px",
              marginTop: "10px",
              height: 6,
              backgroundColor: (theme) =>
                theme.palette.surface.interface.background,
              "& .MuiLinearProgress-bar": {
                backgroundColor: getProgressBarColor(
                  calculatePasswordStrength(value),
                ),
                borderRadius: "6px",
              },
            }}
          />
        )}
        {showGuidelines && (
          <Box sx={{ mt: 3, width: "100%" }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "150%",
                textAlign: "left",
                mb: 1,
              }}
            >
              {t("auth.passwordInput.guidelines")}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "150%",
                textAlign: "left",
                mb: 1.5,
                color: (theme) => theme.palette.text.secondary,
              }}
            >
              {t("auth.passwordInput.guidelinesText")}
            </Typography>
            <Box>
              {(
                Object.keys(passwordValidation) as Array<
                  keyof PasswordValidation
                >
              ).map((key) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  {passwordValidation[key] ? (
                    <CheckIcon
                      sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                    />
                  ) : (
                    <CloseIcon
                      sx={{ color: "error.main", mr: 1, fontSize: 20 }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: "150%",
                    }}
                  >
                    {t(`auth.passwordInput.${key}`)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
