"use client";

import { useState } from "react";

import {
  AuthActions,
  AuthCard,
  AuthContent,
  AuthHeader,
} from "@/components/atoms/auth/AuthCard";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import PasswordInput from "@/components/atoms/inputs/PasswordInput";
import { resetPassword } from "@/store/actions/authActions";
import { AppDispatch, RootState } from "@/store/store";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  RECOVERY_CODE_REGEX,
} from "@/utils/validation.utils";
import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, TextField, Typography, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// Styled components
const StyledForm = styled(Form)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const BackToLoginContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
});

const BackToLoginTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  "&:hover": {
    textDecoration: "underline",
  },
});

const FormFieldsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const MonospaceTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& input": {
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
}));

const PasswordStrengthContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PasswordStrengthHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(0.5),
}));

const PasswordStrengthBarBackground = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 6,
  borderRadius: "6px",
  backgroundColor: theme.palette.surface.interface.background,
  overflow: "hidden",
}));

const PasswordStrengthBarFill = styled(Box)<{
  strength: number;
  color: string;
}>(({ strength, color }) => ({
  width: `${strength}%`,
  height: "100%",
  backgroundColor: color,
  transition: "all 0.3s ease",
}));

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validation schema with i18n
  const resetSchema = Yup.object().shape({
    email: Yup.string()
      .matches(EMAIL_REGEX, t("auth.validation.emailInvalid"))
      .required(t("auth.validation.emailRequired")),
    recoveryCode: Yup.string()
      .required(t("auth.validation.recoveryCodeRequired"))
      .matches(RECOVERY_CODE_REGEX, t("auth.validation.recoveryCodeFormat")),
    newPassword: Yup.string()
      .min(8, t("auth.validation.passwordMin"))
      .matches(PASSWORD_REGEX.UPPERCASE, t("auth.validation.passwordUppercase"))
      .matches(PASSWORD_REGEX.LOWERCASE, t("auth.validation.passwordLowercase"))
      .matches(PASSWORD_REGEX.NUMBER, t("auth.validation.passwordNumber"))
      .matches(
        PASSWORD_REGEX.SPECIAL_CHAR,
        t("auth.validation.passwordSpecialChar"),
      )
      .required(t("auth.validation.passwordRequired")),
  });

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return "#FF0000"; // Red
    if (strength < 75) return "#FF8800"; // Orange
    if (strength < 100) return "#FFA500"; // Light orange
    return "#008000"; // Green
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 50) return t("auth.setup.password.strengthWeak");
    if (strength < 75) return t("auth.setup.password.strengthMedium");
    return t("auth.setup.password.strengthStrong");
  };

  const handleSubmit = async (values: {
    email: string;
    recoveryCode: string;
    newPassword: string;
  }) => {
    const result = await dispatch(
      resetPassword(values.email, values.recoveryCode, values.newPassword),
    );

    if (result.success) {
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <AuthCard maxWidth={600}>
      <AuthHeader>
        <Typography variant="h4">{t("auth.resetPassword.title")}</Typography>
        <Typography variant="body1">
          {t("auth.resetPassword.subtitle")}
        </Typography>
      </AuthHeader>

      <Formik
        initialValues={{
          email: "",
          recoveryCode: "",
          newPassword: "",
        }}
        validationSchema={resetSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, submitForm }) => (
          <StyledForm>
            <AuthContent>
              <BackToLoginContainer>
                <StyledLink href="/login">
                  <BackToLoginTypography variant="body2" color="primary">
                    <ArrowBack fontSize="small" />
                    {t("auth.resetPassword.backToLogin")}
                  </BackToLoginTypography>
                </StyledLink>
              </BackToLoginContainer>

              <Alert severity="info">
                {t("auth.resetPassword.infoMessage")}
              </Alert>

              <FormFieldsContainer>
                <Field
                  as={StyledTextField}
                  fullWidth
                  name="email"
                  label={t("auth.resetPassword.emailLabel")}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={MonospaceTextField}
                  fullWidth
                  name="recoveryCode"
                  label={t("auth.resetPassword.recoveryCodeLabel")}
                  placeholder={t("auth.resetPassword.recoveryCodePlaceholder")}
                  error={touched.recoveryCode && Boolean(errors.recoveryCode)}
                  helperText={
                    touched.recoveryCode && errors.recoveryCode
                      ? errors.recoveryCode
                      : t("auth.resetPassword.recoveryCodeHelper")
                  }
                />

                <PasswordInput
                  value={values.newPassword}
                  onChange={(e) => setFieldValue("newPassword", e.target.value)}
                  onStrengthChange={(strength) => setPasswordStrength(strength)}
                  label={t("auth.resetPassword.newPasswordLabel")}
                  placeholder={t("auth.resetPassword.newPasswordLabel")}
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={
                    touched.newPassword ? errors.newPassword : undefined
                  }
                  showCubeIcon={true}
                  showEyeIcon={true}
                  showProgressBar={false}
                  showGuidelines={false}
                  autoComplete="new-password"
                  required
                />

                {values.newPassword && (
                  <PasswordStrengthContainer>
                    <PasswordStrengthHeader>
                      <Typography variant="caption">
                        {t("auth.setup.password.strengthLabel")}
                      </Typography>
                      <Typography variant="caption">
                        {getPasswordStrengthLabel(passwordStrength)}
                      </Typography>
                    </PasswordStrengthHeader>
                    <PasswordStrengthBarBackground>
                      <PasswordStrengthBarFill
                        strength={passwordStrength}
                        color={getPasswordStrengthColor(passwordStrength)}
                      />
                    </PasswordStrengthBarBackground>
                  </PasswordStrengthContainer>
                )}
              </FormFieldsContainer>
            </AuthContent>

            <AuthActions>
              <GeneralButton
                label={
                  isLoading
                    ? t("auth.resetPassword.resettingButton")
                    : t("auth.resetPassword.resetButton")
                }
                onAction={submitForm}
                disabled={
                  isLoading ||
                  !values.email ||
                  !values.recoveryCode ||
                  !values.newPassword ||
                  Boolean(errors.email) ||
                  Boolean(errors.recoveryCode) ||
                  Boolean(errors.newPassword)
                }
              />
            </AuthActions>
          </StyledForm>
        )}
      </Formik>
    </AuthCard>
  );
}
