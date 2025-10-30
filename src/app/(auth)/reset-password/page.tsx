"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
  calculatePasswordStrength,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  RECOVERY_CODE_REGEX,
} from "@/utils/validation.utils";
import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("auth.validation.passwordMatch"))
      .required(t("auth.validation.confirmPasswordRequired")),
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
    confirmPassword: string;
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
          confirmPassword: "",
        }}
        validationSchema={resetSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, submitForm }) => (
          <Form
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <AuthContent>
              <Box sx={{ mb: 2 }}>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <ArrowBack fontSize="small" />
                    {t("auth.resetPassword.backToLogin")}
                  </Typography>
                </Link>
              </Box>

              <Alert severity="info">
                {t("auth.resetPassword.infoAlert")}
              </Alert>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label={t("auth.resetPassword.emailLabel")}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
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
                  sx={{ mb: 3 }}
                  inputProps={{
                    style: { textTransform: "uppercase", fontFamily: "monospace" },
                  }}
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

                <PasswordInput
                  value={values.confirmPassword}
                  onChange={(e) =>
                    setFieldValue("confirmPassword", e.target.value)
                  }
                  label={t("auth.resetPassword.confirmNewPasswordLabel")}
                  placeholder={t("auth.resetPassword.confirmNewPasswordLabel")}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={
                    touched.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                  showCubeIcon={false}
                  showEyeIcon={true}
                  showProgressBar={false}
                  showGuidelines={false}
                  autoComplete="new-password"
                  required
                />

                {values.newPassword && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption">
                        {t("auth.setup.password.strengthLabel")}
                      </Typography>
                      <Typography variant="caption">
                        {getPasswordStrengthLabel(passwordStrength)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 6,
                        borderRadius: "6px",
                        backgroundColor: (theme) =>
                          theme.palette.surface.interface.background,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${passwordStrength}%`,
                          height: "100%",
                          backgroundColor: getPasswordStrengthColor(
                            passwordStrength,
                          ),
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>
                )}

              </Box>
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
                  !values.confirmPassword ||
                  Boolean(errors.email) ||
                  Boolean(errors.recoveryCode) ||
                  Boolean(errors.newPassword) ||
                  Boolean(errors.confirmPassword)
                }
              />
            </AuthActions>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
