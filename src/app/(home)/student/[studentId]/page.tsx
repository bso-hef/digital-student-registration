"use client";

import { useEffect } from "react";

import StepForm from "@/components/organisms/StepForm";
import { loadStudentForOnboarding } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  styled,
} from "@mui/material";
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

interface StudentIdProps {
  params: { studentId: string };
}

const StudentId = ({ params }: StudentIdProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { studentId } = params;
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
          <Typography variant="h6">
            {t("onboarding.loading", "Lade Daten...")}
          </Typography>
        </LoadingContainer>
      </Wrapper>
    );
  }

  // Error state - check if it's because student already completed onboarding
  if (error) {
    const isAlreadyOnboarded = error.message?.includes(
      "already completed onboarding",
    );

    return (
      <Wrapper>
        <LoadingContainer>
          <Alert
            severity={isAlreadyOnboarded ? "info" : "error"}
            sx={{ maxWidth: 600 }}
          >
            <Typography variant="h6" gutterBottom>
              {isAlreadyOnboarded
                ? t(
                    "onboarding.alreadyCompleted",
                    "Einschreibung bereits abgeschlossen",
                  )
                : t("onboarding.error", "Fehler beim Laden")}
            </Typography>
            <Typography variant="body2">
              {isAlreadyOnboarded
                ? t(
                    "onboarding.alreadyCompletedDetails",
                    "Diese Einschreibung wurde bereits abgeschlossen. Wenn Sie Änderungen vornehmen müssen, wenden Sie sich bitte an den Administrator.",
                  )
                : error.message ||
                  t(
                    "onboarding.errorDetails",
                    "Die Schülerdaten konnten nicht geladen werden. Bitte überprüfen Sie die URL oder kontaktieren Sie den Administrator.",
                  )}
            </Typography>
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
