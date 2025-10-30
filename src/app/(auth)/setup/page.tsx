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
import { setupAdmin } from "@/store/actions/authActions";
import { AppDispatch, RootState } from "@/store/store";
import {
  calculatePasswordStrength,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from "@/utils/validation.utils";
import {
  CheckCircle,
  ContentCopy,
  Download,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function SetupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [recoveryCode, setRecoveryCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Steps array with i18n
  const steps = [
    t("auth.setup.steps.welcome"),
    t("auth.setup.steps.email"),
    t("auth.setup.steps.password"),
    t("auth.setup.steps.recovery"),
    t("auth.setup.steps.confirmation"),
  ];

  // Validation schema with i18n
  const setupSchema = Yup.object().shape({
    email: Yup.string()
      .matches(EMAIL_REGEX, t("auth.validation.emailInvalid"))
      .required(t("auth.validation.emailRequired")),
    password: Yup.string()
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
      .oneOf([Yup.ref("password")], t("auth.validation.passwordMatch"))
      .required(t("auth.validation.confirmPasswordRequired")),
    recoveryCodeSaved: Yup.boolean()
      .oneOf([true], t("auth.validation.recoveryCodeConfirmRequired"))
      .required(),
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const copyRecoveryCode = () => {
    navigator.clipboard.writeText(recoveryCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadRecoveryCode = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Digital Student Registration - Admin Recovery Code\n\n` +
          `Recovery Code: ${recoveryCode}\n\n` +
          `IMPORTANT: Keep this code in a safe place. You will need it to reset your password if you forget it.\n` +
          `Generated: ${new Date().toLocaleString()}`,
      ],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = `recovery-code-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
    password: string;
    confirmPassword: string;
    recoveryCodeSaved: boolean;
  }) => {
    const result = await dispatch(setupAdmin(values.email, values.password));

    if (result.success && result.recoveryCode) {
      // Store the recovery code to display in step 3
      setRecoveryCode(result.recoveryCode);
      handleNext(); // Move to recovery code step
    }
  };

  const finalizeSetup = () => {
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <AuthCard maxWidth={1000}>
      <AuthHeader>
        <Typography variant="h4">{t("auth.setup.title")}</Typography>
        <Typography variant="body1">{t("auth.setup.subtitle")}</Typography>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={null}
          sx={{
            mt: { xs: 2, sm: 2.5, md: 3 },
            width: "100%",
            "& .MuiStep-root": {
              padding: { xs: 0, sm: "0 8px" },
            },
            "& .MuiStepLabel-root": {
              "& .MuiStepLabel-iconContainer": {
                paddingRight: 0,
              },
              "& .MuiSvgIcon-root": {
                width: { xs: 28, sm: 32, md: 36 },
                height: { xs: 28, sm: 32, md: 36 },
                color: (theme) => theme.palette.border.seperator,
                transition: "all 0.3s ease",
                "&.Mui-active": {
                  color: (theme) => theme.palette.surface.button.primary,
                  transform: "scale(1.1)",
                },
                "&.Mui-completed": {
                  color: (theme) => theme.palette.surface.button.primary,
                },
              },
              "& .MuiStepIcon-text": {
                fill: (theme) => theme.palette.text.contrast,
                fontSize: "0.875rem",
                fontWeight: 600,
              },
              "& .MuiStepLabel-label": {
                marginTop: { xs: 0.5, sm: 1 },
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                fontWeight: 500,
                color: (theme) => theme.palette.text.secondary,
                transition: "all 0.3s ease",
                "&.Mui-active": {
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 600,
                },
                "&.Mui-completed": {
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 500,
                },
              },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </AuthHeader>

      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          recoveryCodeSaved: false,
        }}
        validationSchema={setupSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <AuthContent>
              {/* Step 0: Welcome */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.welcome.title")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {t("auth.setup.welcome.description")}
                  </Typography>
                  <Box component="ul" sx={{ pl: { xs: 2, sm: 3 }, mb: 2 }}>
                    <Typography
                      component="li"
                      variant="body1"
                      paragraph
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {t("auth.setup.welcome.step1")}
                    </Typography>
                    <Typography
                      component="li"
                      variant="body1"
                      paragraph
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {t("auth.setup.welcome.step2")}
                    </Typography>
                    <Typography
                      component="li"
                      variant="body1"
                      paragraph
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {t("auth.setup.welcome.step3")}
                    </Typography>
                  </Box>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {t("auth.setup.welcome.warning")}
                  </Alert>
                  <Box
                    sx={{
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <GeneralButton
                      onAction={handleNext}
                      label={t("auth.setup.welcome.startButton")}
                      maxWidth="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Step 1: Email Input */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.email.title")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {t("auth.setup.email.description")}
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label={t("auth.setup.email.emailLabel")}
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ mt: 2 }}
                  />
                  <Box
                    sx={{
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      justifyContent: "space-between",
                      gap: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <GeneralButton
                      onAction={handleBack}
                      label={t("auth.common.back")}
                      isPrimary={false}
                      maxWidth="auto"
                    />
                    <GeneralButton
                      onAction={handleNext}
                      label={t("auth.common.next")}
                      disabled={!values.email || Boolean(errors.email)}
                      maxWidth="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Step 2: Password Input */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.password.title")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {t("auth.setup.password.description")}
                  </Typography>
                  <PasswordInput
                    value={values.password}
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    onStrengthChange={(strength) =>
                      setPasswordStrength(strength)
                    }
                    label={t("auth.setup.password.passwordLabel")}
                    placeholder={t("auth.setup.password.passwordLabel")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password ? errors.password : undefined}
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
                    label={t("auth.setup.password.confirmPasswordLabel")}
                    placeholder={t("auth.setup.password.confirmPasswordLabel")}
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

                  {values.password && (
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

                  <Box
                    sx={{
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      justifyContent: "space-between",
                      gap: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <GeneralButton
                      onAction={handleBack}
                      label={t("auth.common.back")}
                      isPrimary={false}
                      maxWidth="auto"
                    />
                    <GeneralButton
                      type="submit"
                      label={
                        isLoading
                          ? t("auth.setup.password.creatingAccount")
                          : t("auth.setup.password.createButton")
                      }
                      disabled={
                        !values.password ||
                        !values.confirmPassword ||
                        Boolean(errors.password) ||
                        Boolean(errors.confirmPassword) ||
                        isLoading
                      }
                      maxWidth="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Step 3: Recovery Code Display */}
              {activeStep === 3 && recoveryCode && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.recovery.title")}
                  </Typography>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {t("auth.setup.recovery.warning")}
                  </Alert>

                  <Typography variant="body1" paragraph>
                    {t("auth.setup.recovery.codeLabel")}
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: "background.default",
                      p: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: 2,
                      border: 1,
                      borderColor: "divider",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "monospace",
                        letterSpacing: { xs: 1, sm: 1.5, md: 2 },
                        fontSize: {
                          xs: "1.25rem",
                          sm: "1.75rem",
                          md: "2.125rem",
                        },
                        wordBreak: "break-all",
                      }}
                    >
                      {recoveryCode}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1.5, sm: 2 },
                        justifyContent: "center",
                      }}
                    >
                      <GeneralButton
                        onAction={copyRecoveryCode}
                        label={
                          copied
                            ? t("auth.setup.recovery.copied")
                            : t("auth.setup.recovery.copyButton")
                        }
                        startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                        isPrimary={false}
                        maxWidth="auto"
                      />
                      <GeneralButton
                        onAction={downloadRecoveryCode}
                        label={t("auth.setup.recovery.downloadButton")}
                        startIcon={<Download />}
                        isPrimary={false}
                        maxWidth="auto"
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <GeneralButton
                      onAction={handleNext}
                      label={t("auth.setup.recovery.continueButton")}
                      maxWidth="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Step 4: Confirmation */}
              {activeStep === 4 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.confirmation.title")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {t("auth.setup.confirmation.description")}
                  </Typography>

                  <Alert severity="warning" sx={{ my: 3 }}>
                    {t("auth.setup.confirmation.warning")}
                  </Alert>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.recoveryCodeSaved}
                        onChange={(e) =>
                          setFieldValue("recoveryCodeSaved", e.target.checked)
                        }
                      />
                    }
                    label={t("auth.setup.confirmation.checkboxLabel")}
                  />
                  {touched.recoveryCodeSaved && errors.recoveryCodeSaved && (
                    <Typography color="error" variant="caption" display="block">
                      {errors.recoveryCodeSaved}
                    </Typography>
                  )}
                </Box>
              )}
            </AuthContent>
            {activeStep === 4 && (
              <AuthActions>
                <GeneralButton
                  label={t("auth.setup.confirmation.completeButton")}
                  onAction={finalizeSetup}
                  disabled={!values.recoveryCodeSaved}
                />
              </AuthActions>
            )}
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
