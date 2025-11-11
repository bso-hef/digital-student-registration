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
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/validation.utils";
import { CheckCircle, ContentCopy, Download } from "@mui/icons-material";
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
  styled,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(2.5),
  },
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(3),
  },
  "& .MuiStep-root": {
    padding: 0,
    [theme.breakpoints.up("sm")]: {
      padding: "0 8px",
    },
  },
  "& .MuiStepLabel-root": {
    "& .MuiStepLabel-iconContainer": {
      paddingRight: 0,
    },
    "& .MuiSvgIcon-root": {
      width: 28,
      height: 28,
      color: theme.palette.border.seperator,
      transition: "all 0.3s ease",
      [theme.breakpoints.up("sm")]: {
        width: 32,
        height: 32,
      },
      [theme.breakpoints.up("md")]: {
        width: 36,
        height: 36,
      },
      "&.Mui-active": {
        color: theme.palette.surface.button.primary,
        transform: "scale(1.1)",
      },
      "&.Mui-completed": {
        color: theme.palette.surface.button.primary,
      },
    },
    "& .MuiStepIcon-text": {
      fill: theme.palette.text.contrast,
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    "& .MuiStepLabel-label": {
      marginTop: theme.spacing(0.5),
      fontSize: "0.65rem",
      fontWeight: 500,
      color: theme.palette.text.secondary,
      transition: "all 0.3s ease",
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(1),
        fontSize: "0.75rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "0.875rem",
      },
      "&.Mui-active": {
        color: theme.palette.text.primary,
        fontWeight: 600,
      },
      "&.Mui-completed": {
        color: theme.palette.text.primary,
        fontWeight: 500,
      },
    },
  },
}));

const StyledForm = styled(Form)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StepList = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
  },
}));

const StepListItem = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1rem",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledAlertError = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledAlertWarning = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  justifyContent: "flex-end",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(3.5),
  },
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(4),
  },
}));

const ButtonContainerSpaceBetween = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column-reverse",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(3.5),
    flexDirection: "row",
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const RecoveryCodeBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

const RecoveryCodeTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "monospace",
  letterSpacing: 1,
  fontSize: "1.25rem",
  wordBreak: "break-all",
  [theme.breakpoints.up("sm")]: {
    letterSpacing: 1.5,
    fontSize: "1.75rem",
  },
  [theme.breakpoints.up("md")]: {
    letterSpacing: 2,
    fontSize: "2.125rem",
  },
}));

const RecoveryButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    gap: theme.spacing(2),
  },
}));

export default function SetupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [recoveryCode, setRecoveryCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>("");

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

  const handlePasswordSubmit = async (email: string, password: string) => {
    const result = await dispatch(setupAdmin(email, password));

    if (result.success && result.recoveryCode) {
      // Store the recovery code to display in step 3
      setRecoveryCode(result.recoveryCode);
      setAdminEmail(email); // Store email for final setup completion
      handleNext(); // Move to recovery code step
    }
  };

  const handleSubmit = async (values: {
    email: string;
    password: string;
    recoveryCodeSaved: boolean;
  }) => {
    // This is for final submission if needed
    await handlePasswordSubmit(values.email, values.password);
  };

  const finalizeSetup = async () => {
    try {
      // Call the complete setup endpoint to mark system as setup
      const response = await fetch("/api/auth/setup/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete setup");
      }

      // Wait a bit then redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Error completing setup:", error);
      // Still redirect even if there's an error
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <AuthCard maxWidth={1000}>
      <AuthHeader>
        <Typography variant="h4">{t("auth.setup.title")}</Typography>
        <Typography variant="body1">{t("auth.setup.subtitle")}</Typography>
        <StyledStepper
          activeStep={activeStep}
          alternativeLabel
          connector={null}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </AuthHeader>

      <Formik
        initialValues={{
          email: "",
          password: "",
          recoveryCodeSaved: false,
        }}
        validationSchema={setupSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <StyledForm>
            <AuthContent>
              {/* Step 0: Welcome */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.welcome.title")}
                  </Typography>
                  <Typography variant="body1">
                    {t("auth.setup.welcome.description")}
                  </Typography>
                  <StepList>
                    <StepListItem variant="body1">
                      {t("auth.setup.welcome.step1")}
                    </StepListItem>
                    <StepListItem variant="body1">
                      {t("auth.setup.welcome.step2")}
                    </StepListItem>
                    <StepListItem variant="body1">
                      {t("auth.setup.welcome.step3")}
                    </StepListItem>
                  </StepList>
                  <StyledAlert severity="warning">
                    {t("auth.setup.welcome.warning")}
                  </StyledAlert>
                  <ButtonContainer>
                    <GeneralButton
                      onAction={handleNext}
                      label={t("auth.setup.welcome.startButton")}
                      maxWidth="auto"
                    />
                  </ButtonContainer>
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
                    as={StyledTextField}
                    fullWidth
                    name="email"
                    label={t("auth.setup.email.emailLabel")}
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <ButtonContainerSpaceBetween>
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
                  </ButtonContainerSpaceBetween>
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
                    label={t("auth.setup.password.passwordLabel")}
                    placeholder={t("auth.setup.password.passwordLabel")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password ? errors.password : undefined}
                    showCubeIcon
                    showEyeIcon
                    showProgressBar
                    showGuidelines
                    fullWidth
                    autoComplete="new-password"
                    required
                  />

                  <ButtonContainerSpaceBetween>
                    <GeneralButton
                      onAction={handleBack}
                      label={t("auth.common.back")}
                      isPrimary={false}
                      maxWidth="auto"
                    />
                    <GeneralButton
                      label={
                        isLoading
                          ? t("auth.setup.password.creatingAccount")
                          : t("auth.setup.password.createButton")
                      }
                      disabled={
                        !values.password ||
                        Boolean(errors.password) ||
                        isLoading
                      }
                      maxWidth="auto"
                      onAction={() =>
                        handlePasswordSubmit(values.email, values.password)
                      }
                    />
                  </ButtonContainerSpaceBetween>
                </Box>
              )}

              {/* Step 3: Recovery Code Display */}
              {activeStep === 3 && recoveryCode && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {t("auth.setup.recovery.title")}
                  </Typography>
                  <StyledAlertError severity="error">
                    {t("auth.setup.recovery.warning")}
                  </StyledAlertError>

                  <Typography variant="body1" paragraph>
                    {t("auth.setup.recovery.codeLabel")}
                  </Typography>

                  <RecoveryCodeBox>
                    <RecoveryCodeTypography variant="h4">
                      {recoveryCode}
                    </RecoveryCodeTypography>
                    <RecoveryButtonContainer>
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
                    </RecoveryButtonContainer>
                  </RecoveryCodeBox>

                  <ButtonContainer>
                    <GeneralButton
                      onAction={handleNext}
                      label={t("auth.setup.recovery.continueButton")}
                      maxWidth="auto"
                    />
                  </ButtonContainer>
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

                  <StyledAlertWarning severity="warning">
                    {t("auth.setup.confirmation.warning")}
                  </StyledAlertWarning>

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
          </StyledForm>
        )}
      </Formik>
    </AuthCard>
  );
}
