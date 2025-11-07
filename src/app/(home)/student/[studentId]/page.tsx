"use client";

import { useEffect } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import StepForm from "@/components/organisms/StepForm";
import {
  clearStudentError,
  loadStudentForOnboarding,
} from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { OnboardingErrorCode, isValidationError } from "@/types/errors";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  styled,
} from "@mui/material";
import { useParams } from "next/navigation";
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

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  minHeight: "50vh",
}));

/**
 * Maps error codes to specific error details (title, message, severity)
 */
function getErrorDetails(
  error: unknown,
  t: ReturnType<typeof useTranslation>["t"],
) {
  // Check if it's a ValidationError with error code
  if (isValidationError(error)) {
    switch (error.code) {
      case OnboardingErrorCode.INVALID_STUDENT_ID:
        return {
          severity: "error" as const,
          title: t("onboarding.error.invalidStudentId.title"),
          message: t("onboarding.error.invalidStudentId.message"),
        };

      case OnboardingErrorCode.STUDENT_NOT_FOUND:
        return {
          severity: "error" as const,
          title: t("onboarding.error.studentNotFound.title"),
          message: t("onboarding.error.studentNotFound.message"),
        };

      case OnboardingErrorCode.NO_CLASS_ASSIGNED:
        return {
          severity: "warning" as const,
          title: t("onboarding.error.noClassAssigned.title"),
          message: t("onboarding.error.noClassAssigned.message"),
        };

      case OnboardingErrorCode.CLASS_INACTIVE:
        return {
          severity: "warning" as const,
          title: t("onboarding.error.classInactive.title"),
          message: t("onboarding.error.classInactive.message"),
        };

      case OnboardingErrorCode.ALREADY_ONBOARDED:
        return {
          severity: "info" as const,
          title: t("onboarding.error.alreadyOnboarded.title"),
          message: t("onboarding.error.alreadyOnboarded.message"),
        };

      default:
        // Fallback for unknown validation errors
        return {
          severity: "error" as const,
          title: t("onboarding.error.generic.title"),
          message: error.message || t("onboarding.error.generic.message"),
        };
    }
  }

  // Fallback for generic errors
  return {
    severity: "error" as const,
    title: t("onboarding.error.generic.title"),
    message:
      error instanceof Error
        ? error.message
        : t("onboarding.error.generic.message"),
  };
}

const StudentId = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { studentId } = useParams<{ studentId: string }>();
  const { loading, error } = useAppSelector((state) => state.student);

  useEffect(() => {
    // Load student data when component mounts
    if (studentId) {
      dispatch(loadStudentForOnboarding(studentId));
    }
  }, [studentId, dispatch]);

  // Loading state
  if (loading) {
    return (
      <Wrapper>
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6">{t("onboarding.loadingProfile")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("onboarding.loadingDetails")}
          </Typography>
        </LoadingContainer>
      </Wrapper>
    );
  }

  // Error state - display specific error based on error code
  if (error) {
    const errorDetails = getErrorDetails(error, t);

    const handleRetry = () => {
      // Clear the error first
      dispatch(clearStudentError());
      // Then retry loading
      dispatch(loadStudentForOnboarding(studentId));
    };

    return (
      <Wrapper sx={{ borderRadius: "8px" }}>
        <LoadingContainer>
          <Alert
            severity={errorDetails.severity}
            sx={{ maxWidth: 600, borderRadius: "8px" }}
          >
            <Typography variant="h6" gutterBottom>
              {errorDetails.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {errorDetails.message}
            </Typography>
            <GeneralButton
              onAction={handleRetry}
              label={t("onboarding.error.retry")}
              variant="contained"
              isPrimary={true}
            />
          </Alert>
        </LoadingContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <StepForm studentId={studentId} />
    </Wrapper>
  );
};

export default StudentId;
