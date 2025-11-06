"use client";

import React from "react";

import {
  StepDef,
  StepName,
  getStepIdByName,
} from "@/constants/studentSteps.constants";
import { useAppSelector } from "@/store/store";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const SummaryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
  maxWidth: "900px",
  margin: "0 auto",
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const DataRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "200px 1fr",
  gap: theme.spacing(2),
  padding: theme.spacing(1, 0),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(0.5),
  },
}));

interface SummaryFormProps {
  onGoToStep?: (step: number) => void;
  activeSteps: StepDef[];
}

const SummaryForm: React.FC<SummaryFormProps> = ({
  onGoToStep,
  activeSteps,
}) => {
  const { t } = useTranslation();
  const studentData = useAppSelector((state) => state.student.data);

  /**
   * Handles edit button clicks by mapping semantic step names to step IDs
   * Only navigates if the step is currently active
   */
  const handleEditStep = (stepName: StepName) => {
    if (!onGoToStep) return;

    const stepId = getStepIdByName(stepName, activeSteps);
    if (stepId !== null) {
      onGoToStep(stepId);
    } else {
      console.warn(
        `Cannot navigate to ${stepName}: step is not active or does not exist`,
      );
    }
  };

  const renderDataRow = (label: string, value: string | undefined) => {
    if (!value) return null;
    return (
      <DataRow>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}:
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </DataRow>
    );
  };

  return (
    <SummaryContainer>
      <Typography variant="h5" gutterBottom>
        {t("onboarding.summary.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t("onboarding.summary.description")}
      </Typography>

      {/* General Information */}
      <SectionPaper elevation={1}>
        <SectionHeader>
          <Typography variant="h6">
            {t("onboarding.summary.generalInfo")}
          </Typography>
          {onGoToStep && (
            <IconButton
              size="small"
              onClick={() => handleEditStep(StepName.GENERAL)}
              title={t("general.Edit")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </SectionHeader>
        <Divider />
        {renderDataRow(t("onboarding.general.firstName"), studentData.vorname)}
        {renderDataRow(t("onboarding.general.lastName"), studentData.nachname)}
        {renderDataRow(
          t("onboarding.general.birthName"),
          studentData.geburtsname,
        )}
        {renderDataRow(t("onboarding.general.gender"), studentData.geschlecht)}
        {renderDataRow(
          t("onboarding.general.birthDate"),
          studentData.geburtsdatum,
        )}
        {renderDataRow(
          t("onboarding.general.birthPlace"),
          studentData.geburtsort,
        )}
        {renderDataRow(
          t("onboarding.general.birthCountry"),
          studentData.geburtsland,
        )}
        {renderDataRow(t("onboarding.general.religion"), studentData.religion)}
        {renderDataRow(
          t("onboarding.general.nationality1"),
          studentData.staatsangehoerigkeit1,
        )}
        {renderDataRow(
          t("onboarding.general.nationality2"),
          studentData.staatsangehoerigkeit2,
        )}
      </SectionPaper>

      {/* Address */}
      <SectionPaper elevation={1}>
        <SectionHeader>
          <Typography variant="h6">
            {t("onboarding.summary.address")}
          </Typography>
          {onGoToStep && (
            <IconButton
              size="small"
              onClick={() => handleEditStep(StepName.ADDRESS)}
              title={t("general.Edit")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </SectionHeader>
        <Divider />
        {renderDataRow(
          t("onboarding.address.street"),
          `${studentData.straße} ${studentData.hausNr}`,
        )}
        {renderDataRow(
          t("onboarding.address.city"),
          `${studentData.postleitzahl} ${studentData.ort}`,
        )}
        {renderDataRow(t("onboarding.address.mobile"), studentData.mobil)}
        {renderDataRow(t("onboarding.address.phone"), studentData.telefon1)}
        {renderDataRow(t("onboarding.address.email"), studentData.email)}
      </SectionPaper>

      {/* Contact Person */}
      {studentData.ansprechpartner1Vorname && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.contactPerson")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => handleEditStep(StepName.PARENTS)}
                title={t("general.Edit")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.parents.type"),
            studentData.ansprechpartner1Art,
          )}
          {renderDataRow(
            t("onboarding.parents.name"),
            `${studentData.ansprechpartner1Vorname} ${studentData.ansprechpartner1Nachname}`,
          )}
          {renderDataRow(
            t("onboarding.parents.address"),
            `${studentData.ansprechpartner1Straße} ${studentData.ansprechpartner1HausNr}, ${studentData.ansprechpartner1Plz} ${studentData.ansprechpartner1Ort}`,
          )}
          {renderDataRow(
            t("onboarding.parents.mobile"),
            studentData.ansprechpartner1Mobil,
          )}
          {renderDataRow(
            t("onboarding.parents.phone"),
            studentData.ansprechpartner1Telefon1,
          )}
        </SectionPaper>
      )}

      {/* Previous Education */}
      {studentData.vorhergehendeSchule && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.education")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => handleEditStep(StepName.PRE_EDUCATION)}
                title={t("general.Edit")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.preEducation.previousSchool"),
            studentData.vorhergehendeSchule,
          )}
          {renderDataRow(
            t("onboarding.preEducation.schoolType"),
            studentData.vorhergehendeSchulform,
          )}
          {renderDataRow(
            t("onboarding.preEducation.level"),
            studentData.vorhergehendeStufe,
          )}
          {renderDataRow(
            t("onboarding.preEducation.degrees"),
            studentData.abschlüsse,
          )}
        </SectionPaper>
      )}

      {/* Vocational Training */}
      {studentData.beruf && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.training")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => handleEditStep(StepName.TRAINING)}
                title={t("general.Edit")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.training.profession"),
            studentData.beruf,
          )}
          {renderDataRow(
            t("onboarding.training.startDate"),
            studentData.betriebEintritt,
          )}
          {renderDataRow(
            t("onboarding.training.company"),
            studentData.betriebName,
          )}
        </SectionPaper>
      )}
    </SummaryContainer>
  );
};

export default SummaryForm;
