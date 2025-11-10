"use client";

import { useState } from "react";

import CustomTitle from "@/components/atoms/CustomTitle";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { validateVerificationForm } from "@/lib/validate/student.validate";
import { verifyStudent } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Box, InputAdornment, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const StyledForm = styled(Form)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
}));

const StyledEndContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
}));

interface FormValues {
  firstName: string;
  lastName: string;
  uniqueIdentifier: string;
}

export default function StudentPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    uniqueIdentifier: "",
  };

  const handleVerification = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const studentId = await dispatch(
        verifyStudent(
          values.firstName,
          values.lastName,
          values.uniqueIdentifier,
        ),
      );

      if (studentId) {
        // Navigate to student onboarding page
        router.push(`/student/${studentId}`);
      }
    } catch (error) {
      // Error is already handled in the action (notification shown)
      console.error("Verification failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <CustomTitle
        title={t("auth.studentLogin.title")}
        subTitle={t("auth.studentLogin.subtitle")}
      />
      <Formik<FormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validateVerificationForm}
        onSubmit={handleVerification}
      >
        {({ handleSubmit, errors, touched, isValid, dirty }) => (
          <StyledForm>
            <Field
              component={TextField}
              name="firstName"
              placeholder={t("auth.studentLogin.firstNamePlaceholder")}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              disabled={isSubmitting}
              fullWidth
              style={{
                height: "50px",
                flexShrink: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Field
              component={TextField}
              name="lastName"
              placeholder={t("auth.studentLogin.lastNamePlaceholder")}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              disabled={isSubmitting}
              fullWidth
              style={{
                height: "50px",
                flexShrink: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Field
              component={TextField}
              name="uniqueIdentifier"
              placeholder={t("auth.studentLogin.verificationCodePlaceholder")}
              error={
                touched.uniqueIdentifier && Boolean(errors.uniqueIdentifier)
              }
              helperText={touched.uniqueIdentifier && errors.uniqueIdentifier}
              disabled={isSubmitting}
              inputProps={{
                style: { textTransform: "uppercase" },
                maxLength: 6,
              }}
              fullWidth
              style={{
                height: "50px",
                flexShrink: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <StyledEndContainer>
              <GeneralButton
                onAction={() => handleSubmit()}
                isPrimary={false}
                label={
                  isSubmitting
                    ? t("auth.studentLogin.verifying")
                    : t("auth.studentLogin.submit")
                }
                disabled={isSubmitting || !isValid || !dirty}
              />
            </StyledEndContainer>
          </StyledForm>
        )}
      </Formik>
    </Wrapper>
  );
}
