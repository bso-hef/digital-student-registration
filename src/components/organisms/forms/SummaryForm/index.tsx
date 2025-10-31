"use client";

import React from "react";

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
}

const SummaryForm: React.FC<SummaryFormProps> = ({ onGoToStep }) => {
  const { t } = useTranslation();
  const studentData = useAppSelector((state) => state.student.data);

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
        {t("onboarding.summary.title", "Zusammenfassung")}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t(
          "onboarding.summary.description",
          "Bitte überprüfen Sie Ihre Angaben vor der Übermittlung.",
        )}
      </Typography>

      {/* General Information */}
      <SectionPaper elevation={1}>
        <SectionHeader>
          <Typography variant="h6">
            {t("onboarding.summary.generalInfo", "Allgemeine Daten")}
          </Typography>
          {onGoToStep && (
            <IconButton
              size="small"
              onClick={() => onGoToStep(1)}
              title={t("general.Edit", "Bearbeiten")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </SectionHeader>
        <Divider />
        {renderDataRow(
          t("onboarding.general.firstName", "Vorname"),
          studentData.vorname,
        )}
        {renderDataRow(
          t("onboarding.general.lastName", "Nachname"),
          studentData.nachname,
        )}
        {renderDataRow(
          t("onboarding.general.birthName", "Geburtsname"),
          studentData.geburtsname,
        )}
        {renderDataRow(
          t("onboarding.general.gender", "Geschlecht"),
          studentData.geschlecht,
        )}
        {renderDataRow(
          t("onboarding.general.birthDate", "Geburtsdatum"),
          studentData.geburtsdatum,
        )}
        {renderDataRow(
          t("onboarding.general.birthPlace", "Geburtsort"),
          studentData.geburtsort,
        )}
        {renderDataRow(
          t("onboarding.general.birthCountry", "Geburtsland"),
          studentData.geburtsland,
        )}
        {renderDataRow(
          t("onboarding.general.religion", "Religion"),
          studentData.religion,
        )}
        {renderDataRow(
          t("onboarding.general.nationality1", "Staatsangehörigkeit 1"),
          studentData.staatsangehoerigkeit1,
        )}
        {renderDataRow(
          t("onboarding.general.nationality2", "Staatsangehörigkeit 2"),
          studentData.staatsangehoerigkeit2,
        )}
      </SectionPaper>

      {/* Address */}
      <SectionPaper elevation={1}>
        <SectionHeader>
          <Typography variant="h6">
            {t("onboarding.summary.address", "Adresse und Kontakt")}
          </Typography>
          {onGoToStep && (
            <IconButton
              size="small"
              onClick={() => onGoToStep(3)}
              title={t("general.Edit", "Bearbeiten")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </SectionHeader>
        <Divider />
        {renderDataRow(
          t("onboarding.address.street", "Straße"),
          `${studentData.straße} ${studentData.hausNr}`,
        )}
        {renderDataRow(
          t("onboarding.address.city", "Ort"),
          `${studentData.postleitzahl} ${studentData.ort}`,
        )}
        {renderDataRow(
          t("onboarding.address.mobile", "Mobilnummer"),
          studentData.mobil,
        )}
        {renderDataRow(
          t("onboarding.address.phone", "Telefon"),
          studentData.telefon1,
        )}
        {renderDataRow(
          t("onboarding.address.email", "E-Mail"),
          studentData.email,
        )}
      </SectionPaper>

      {/* Contact Person */}
      {studentData.ansprechpartner1Vorname && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.contactPerson", "Ansprechpartner")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => onGoToStep(4)}
                title={t("general.Edit", "Bearbeiten")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.parents.type", "Art"),
            studentData.ansprechpartner1Art,
          )}
          {renderDataRow(
            t("onboarding.parents.name", "Name"),
            `${studentData.ansprechpartner1Vorname} ${studentData.ansprechpartner1Nachname}`,
          )}
          {renderDataRow(
            t("onboarding.parents.address", "Adresse"),
            `${studentData.ansprechpartner1Straße} ${studentData.ansprechpartner1HausNr}, ${studentData.ansprechpartner1Plz} ${studentData.ansprechpartner1Ort}`,
          )}
          {renderDataRow(
            t("onboarding.parents.mobile", "Mobilnummer"),
            studentData.ansprechpartner1Mobil,
          )}
          {renderDataRow(
            t("onboarding.parents.phone", "Telefon"),
            studentData.ansprechpartner1Telefon1,
          )}
        </SectionPaper>
      )}

      {/* Previous Education */}
      {studentData.vorhergehendeSchule && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.education", "Vorbildung")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => onGoToStep(5)}
                title={t("general.Edit", "Bearbeiten")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.preEducation.previousSchool", "Vorherige Schule"),
            studentData.vorhergehendeSchule,
          )}
          {renderDataRow(
            t("onboarding.preEducation.schoolType", "Schulform"),
            studentData.vorhergehendeSchulform,
          )}
          {renderDataRow(
            t("onboarding.preEducation.level", "Stufe"),
            studentData.vorhergehendeStufe,
          )}
          {renderDataRow(
            t("onboarding.preEducation.degrees", "Abschlüsse"),
            studentData.abschlüsse,
          )}
        </SectionPaper>
      )}

      {/* Vocational Training */}
      {studentData.beruf && (
        <SectionPaper elevation={1}>
          <SectionHeader>
            <Typography variant="h6">
              {t("onboarding.summary.training", "Ausbildung")}
            </Typography>
            {onGoToStep && (
              <IconButton
                size="small"
                onClick={() => onGoToStep(6)}
                title={t("general.Edit", "Bearbeiten")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </SectionHeader>
          <Divider />
          {renderDataRow(
            t("onboarding.training.profession", "Beruf"),
            studentData.beruf,
          )}
          {renderDataRow(
            t("onboarding.training.startDate", "Ausbildungsbeginn"),
            studentData.betriebEintritt,
          )}
          {renderDataRow(
            t("onboarding.training.company", "Betrieb"),
            studentData.betriebName,
          )}
        </SectionPaper>
      )}
    </SummaryContainer>
  );
};

export default SummaryForm;
