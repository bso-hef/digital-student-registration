"use client";

import React from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import { formatGermanDate } from "@/utils/date.utils";
import { WarningRounded } from "@mui/icons-material";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
}));

const WarningBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.warning.dark
      : theme.palette.warning.light,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.warning.main}`,
}));

const WarningIcon = styled(WarningRounded)(({ theme }) => ({
  color: theme.palette.warning.dark,
  fontSize: 28,
  flexShrink: 0,
}));

const StudentInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

const WarningText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  lineHeight: 1.5,
  color: theme.palette.text.primary,
}));

interface DuplicateWarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    daysSinceUpdate: number;
    status?: string;
  };
}

/**
 * DuplicateWarningModal component shows a warning when attempting to create
 * a student with credentials similar to an existing, recently updated student
 */
const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  open,
  onClose,
  onConfirm,
  studentData,
}) => {
  const { t } = useTranslation();

  const getDaysText = (days: number) => {
    if (days === 0) return t("modals.duplicateWarning.today");
    if (days === 1) return t("modals.duplicateWarning.yesterday");
    return t("modals.duplicateWarning.daysAgo", { count: days });
  };

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.duplicateWarning.title")}
      modalWidth={500}
      contentChildren={
        <ContentContainer>
          <WarningBox>
            <WarningIcon />
            <WarningText>
              {t("modals.duplicateWarning.message", {
                days: studentData.daysSinceUpdate,
                daysText: getDaysText(studentData.daysSinceUpdate),
              })}
            </WarningText>
          </WarningBox>

          <StudentInfo>
            <InfoRow>
              <InfoLabel>{t("modals.duplicateWarning.firstName")}:</InfoLabel>
              <InfoValue>{studentData.firstName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>{t("modals.duplicateWarning.lastName")}:</InfoLabel>
              <InfoValue>{studentData.lastName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>{t("modals.duplicateWarning.dateOfBirth")}:</InfoLabel>
              <InfoValue>{formatGermanDate(studentData.dateOfBirth)}</InfoValue>
            </InfoRow>
            {studentData.status && (
              <InfoRow>
                <InfoLabel>{t("modals.duplicateWarning.status")}:</InfoLabel>
                <InfoValue>{t(`general.${studentData.status}`)}</InfoValue>
              </InfoRow>
            )}
          </StudentInfo>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.8125rem" }}
          >
            {t("modals.duplicateWarning.confirmText")}
          </Typography>
        </ContentContainer>
      }
      actionsChildren={
        <>
          <GeneralButton
            label={t("modals.duplicateWarning.cancel")}
            isPrimary={false}
            onAction={onClose}
          />
          <GeneralButton
            label={t("modals.duplicateWarning.createAnyway")}
            isPrimary={true}
            onAction={onConfirm}
          />
        </>
      }
    />
  );
};

export default DuplicateWarningModal;
