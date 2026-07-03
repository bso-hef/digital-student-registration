"use client";

import { useState } from "react";

import {
  AuthActions,
  AuthCard,
  AuthContent,
  AuthHeader,
} from "@/components/atoms/auth/AuthCard";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { loginUser } from "@/store/actions/authActions";
import { AppDispatch, RootState } from "@/store/store";
import { EMAIL_REGEX } from "@/utils/validation.utils";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// Styled components
const StyledForm = styled(Form)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const ForgotPasswordContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(1),
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
  fontSize: "0.875rem",
});

const HoverableTypography = styled(Typography)({
  "&:hover": {
    textDecoration: "underline",
  },
});

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const error = searchParams.get("error");

  // Create validation schema with i18n
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(EMAIL_REGEX, t("auth.validation.emailInvalid"))
      .required(t("auth.validation.emailRequired")),
    password: Yup.string().required(t("auth.validation.passwordRequired")),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await dispatch(loginUser(values.email, values.password));

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <AuthCard maxWidth={500}>
      <AuthHeader>
        <Typography variant="h4">{t("auth.login.title")}</Typography>
        <Typography variant="body1">{t("auth.login.subtitle")}</Typography>
      </AuthHeader>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, submitForm, isValid, dirty }) => {
          const handleKeyDown = (event: React.KeyboardEvent) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              isValid &&
              dirty &&
              !isLoading
            ) {
              event.preventDefault();
              submitForm();
            }
          };

          return (
            <StyledForm>
              <AuthContent>
                {error && (
                  <Alert severity="error">
                    {error === "CredentialsSignin"
                      ? t("auth.login.invalidCredentials")
                      : t("auth.login.loginError")}
                  </Alert>
                )}

                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label={t("auth.login.emailLabel")}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  margin="normal"
                  label={t("auth.login.passwordLabel")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  onKeyDown={handleKeyDown}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffRounded />
                            ) : (
                              <VisibilityRounded />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <ForgotPasswordContainer>
                  <StyledLink href="/reset-password">
                    <HoverableTypography variant="body2" color="primary">
                      {t("auth.login.forgotPassword")}
                    </HoverableTypography>
                  </StyledLink>
                </ForgotPasswordContainer>
              </AuthContent>

              <AuthActions>
                <GeneralButton
                  label={
                    isLoading
                      ? t("auth.login.signingIn")
                      : t("auth.login.signInButton")
                  }
                  onAction={submitForm}
                  disabled={
                    isLoading ||
                    !values.email ||
                    !values.password ||
                    Boolean(errors.email) ||
                    Boolean(errors.password)
                  }
                />
              </AuthActions>
            </StyledForm>
          );
        }}
      </Formik>
    </AuthCard>
  );
}
