"use client";

import React, { useEffect, useState } from "react";

import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import {
  StepDef,
  StepName,
  getStepIdByName,
} from "@/constants/studentSteps.constants";
import { useAgreementSettings } from "@/hooks/useAgreementSettings";
import { setEditingFromSummary } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Box,
  Checkbox,
  FormControlLabel,
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

const DataRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  padding: theme.spacing(1, 0),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(0.5),
  },
}));

const ConfirmationBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  marginTop: theme.spacing(2),
}));

const StyledDataRowLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  textAlign: "left",
  color: theme.palette.text.default,
  fontSize: "16px !important",
  lineHeight: "24px !important",
}));

const StyledDataRowValue = styled(Typography)(({ theme }) => ({
  fontSize: "16px !important",
  lineHeight: "24px !important",
  color: theme.palette.text.information,
  textAlign: "left",
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px !important",
  lineHeight: "24px !important",
  color: theme.palette.text.information,
  textAlign: "left",
}));

interface SummaryFormProps {
  onGoToStep?: (step: number) => void;
  activeSteps: StepDef[];
  onConfirmationChange?: (isConfirmed: boolean) => void;
}

const SummaryForm: React.FC<SummaryFormProps> = ({
  onGoToStep,
  activeSteps,
  onConfirmationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const studentData = useAppSelector((state) => state.student.data);
  const { enabledAgreements, getAgreementLabel } = useAgreementSettings();

  // All sections start collapsed by default
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    general: false,
    origin: false,
    address: false,
    contactPerson: false,
    education: false,
    training: false,
    companyContact: false,
    agreements: false,
  });

  const [confirmationChecked, setConfirmationChecked] = useState(false);

  // Notify parent when confirmation state changes
  useEffect(() => {
    if (onConfirmationChange) {
      onConfirmationChange(confirmationChecked);
    }
  }, [confirmationChecked, onConfirmationChange]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Handles edit button clicks by mapping semantic step names to step IDs
   * Only navigates if the step is currently active
   * Sets editing flag to show "Go back to summary" button
   */
  const handleEditStep = (stepName: StepName) => {
    if (!onGoToStep) return;

    const stepId = getStepIdByName(stepName, activeSteps);
    if (stepId !== null) {
      // Set flag to indicate we're editing from summary
      dispatch(setEditingFromSummary(true));
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
        <StyledDataRowLabel>{label}:</StyledDataRowLabel>
        <StyledDataRowValue>{value}</StyledDataRowValue>
      </DataRow>
    );
  };

  const renderAggreementRow = (label: string, value: boolean | undefined) => {
    if (value === undefined) return null;
    return (
      <DataRow>
        <StyledDataRowLabel>{label}:</StyledDataRowLabel>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleRoundedIcon
            fontSize="small"
            sx={{
              color: value ? "success.main" : "error.main",
            }}
          />
          <StyledDataRowValue>
            {value ? t("general.Accepted") : t("general.NotAccepted")}
          </StyledDataRowValue>
        </Box>
      </DataRow>
    );
  };

  // Helper to combine address parts
  const combineAddress = (
    street?: string,
    houseNr?: string,
    plz?: string,
    city?: string,
  ) => {
    if (!street || !houseNr || !plz || !city) return undefined;
    return `${street} ${houseNr}, ${plz} ${city}`;
  };

  return (
    <SummaryContainer>
      {/* General Information */}
      <EnhancedCollapse
        title={t("onboarding.summary.generalInfo")}
        expanded={expandedSections.general}
        onAction={() => toggleSection("general")}
        headerAction={
          <SmallIconButton
            icon={<EditRoundedIcon />}
            onAction={(e) => {
              e.stopPropagation();
              handleEditStep(StepName.GENERAL);
            }}
            title={t("general.Edit")}
            placement="top"
            hoverAllowed={true}
          />
        }
      >
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
      </EnhancedCollapse>

      {/* Origin/Immigration (Conditional - only if step is active) */}
      {getStepIdByName(StepName.ORIGIN, activeSteps) !== null && (
        <EnhancedCollapse
          title={t("onboarding.summary.origin")}
          expanded={expandedSections.origin}
          onAction={() => toggleSection("origin")}
          headerAction={
            <SmallIconButton
              icon={<EditRoundedIcon />}
              onAction={(e) => {
                e.stopPropagation();
                handleEditStep(StepName.ORIGIN);
              }}
              title={t("general.Edit")}
              placement="top"
              hoverAllowed={true}
            />
          }
        >
          {renderDataRow(
            t("onboarding.origin.familyLanguage"),
            studentData.familiensprache,
          )}
          {renderDataRow(
            t("onboarding.origin.immigrationYear"),
            studentData.zuzugsjahr,
          )}
        </EnhancedCollapse>
      )}

      {/* Address */}
      <EnhancedCollapse
        title={t("onboarding.summary.address")}
        expanded={expandedSections.address}
        onAction={() => toggleSection("address")}
        headerAction={
          <SmallIconButton
            icon={<EditRoundedIcon />}
            onAction={(e) => {
              e.stopPropagation();
              handleEditStep(StepName.ADDRESS);
            }}
            title={t("general.Edit")}
            placement="top"
            hoverAllowed={true}
          />
        }
      >
        {renderDataRow(
          t("onboarding.address.street"),
          studentData.straße && studentData.hausNr
            ? `${studentData.straße} ${studentData.hausNr}`
            : undefined,
        )}
        {renderDataRow(
          t("onboarding.address.city"),
          studentData.postleitzahl && studentData.ort
            ? `${studentData.postleitzahl} ${studentData.ort}`
            : undefined,
        )}
        {renderDataRow(t("onboarding.address.mobile"), studentData.mobil)}
        {renderDataRow(t("onboarding.address.phone"), studentData.telefon1)}
        {renderDataRow(t("onboarding.address.email"), studentData.email)}
      </EnhancedCollapse>

      {/* Contact Person(s) */}
      {studentData.ansprechpartner1Vorname && (
        <EnhancedCollapse
          title={t("onboarding.summary.contactPerson")}
          expanded={expandedSections.contactPerson}
          onAction={() => toggleSection("contactPerson")}
          headerAction={
            <SmallIconButton
              icon={<EditRoundedIcon />}
              onAction={(e) => {
                e.stopPropagation();
                handleEditStep(StepName.PARENTS);
              }}
              title={t("general.Edit")}
              placement="top"
              hoverAllowed={true}
            />
          }
        >
          {/* Contact Person 1 */}
          <StyledTitle>
            {t("onboarding.legalGuardian.contact1Title")}
          </StyledTitle>
          {renderDataRow(
            t("onboarding.legalGuardian.type"),
            studentData.ansprechpartner1Art,
          )}
          {renderDataRow(
            t("onboarding.legalGuardian.name"),
            studentData.ansprechpartner1Vorname &&
              studentData.ansprechpartner1Nachname
              ? `${studentData.ansprechpartner1Vorname} ${studentData.ansprechpartner1Nachname}`
              : undefined,
          )}
          {renderDataRow(
            t("onboarding.legalGuardian.address"),
            combineAddress(
              studentData.ansprechpartner1Straße,
              studentData.ansprechpartner1HausNr,
              studentData.ansprechpartner1Plz,
              studentData.ansprechpartner1Ort,
            ),
          )}
          {renderDataRow(
            t("onboarding.legalGuardian.mobile"),
            studentData.ansprechpartner1Mobil,
          )}
          {renderDataRow(
            t("onboarding.legalGuardian.phone"),
            studentData.ansprechpartner1Telefon1,
          )}

          {/* Contact Person 2 (if exists) */}
          {studentData.ansprechpartner2Vorname && (
            <>
              <StyledTitle>
                {t("onboarding.legalGuardian.contact2Title")}
              </StyledTitle>
              {renderDataRow(
                t("onboarding.legalGuardian.type"),
                studentData.ansprechpartner2Art,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.name"),
                studentData.ansprechpartner2Vorname &&
                  studentData.ansprechpartner2Nachname
                  ? `${studentData.ansprechpartner2Vorname} ${studentData.ansprechpartner2Nachname}`
                  : undefined,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.address"),
                combineAddress(
                  studentData.ansprechpartner2Straße,
                  studentData.ansprechpartner2HausNr,
                  studentData.ansprechpartner2Plz,
                  studentData.ansprechpartner2Ort,
                ),
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.mobile"),
                studentData.ansprechpartner2Mobil,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.phone"),
                studentData.ansprechpartner2Telefon1,
              )}
            </>
          )}

          {/* Contact Person 3 (if exists) */}
          {studentData.ansprechpartner3Vorname && (
            <>
              <StyledTitle>
                {t("onboarding.legalGuardian.contact3Title")}
              </StyledTitle>
              {renderDataRow(
                t("onboarding.legalGuardian.type"),
                studentData.ansprechpartner3Art,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.name"),
                studentData.ansprechpartner3Vorname &&
                  studentData.ansprechpartner3Nachname
                  ? `${studentData.ansprechpartner3Vorname} ${studentData.ansprechpartner3Nachname}`
                  : undefined,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.address"),
                combineAddress(
                  studentData.ansprechpartner3Straße,
                  studentData.ansprechpartner3HausNr,
                  studentData.ansprechpartner3Plz,
                  studentData.ansprechpartner3Ort,
                ),
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.mobile"),
                studentData.ansprechpartner3Mobil,
              )}
              {renderDataRow(
                t("onboarding.legalGuardian.phone"),
                studentData.ansprechpartner3Telefon1,
              )}
            </>
          )}
        </EnhancedCollapse>
      )}

      {/* Previous Education */}
      {studentData.vorhergehendeSchule && (
        <EnhancedCollapse
          title={t("onboarding.summary.education")}
          expanded={expandedSections.education}
          onAction={() => toggleSection("education")}
          headerAction={
            <SmallIconButton
              icon={<EditRoundedIcon />}
              onAction={(e) => {
                e.stopPropagation();
                handleEditStep(StepName.PRE_EDUCATION);
              }}
              title={t("general.Edit")}
              placement="top"
              hoverAllowed={true}
            />
          }
        >
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
            studentData.abschluesse,
          )}
        </EnhancedCollapse>
      )}

      {/* Vocational Training (Conditional - only if step is active) */}
      {getStepIdByName(StepName.TRAINING, activeSteps) !== null &&
        studentData.beruf && (
          <EnhancedCollapse
            title={t("onboarding.summary.training")}
            expanded={expandedSections.training}
            onAction={() => toggleSection("training")}
            headerAction={
              <SmallIconButton
                icon={<EditRoundedIcon />}
                onAction={(e) => {
                  e.stopPropagation();
                  handleEditStep(StepName.TRAINING);
                }}
                title={t("general.Edit")}
                placement="top"
                hoverAllowed={true}
              />
            }
          >
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
            {renderDataRow(
              t("onboarding.training.street"),
              studentData.betriebStraße,
            )}
            {renderDataRow(
              t("onboarding.training.houseNumber"),
              studentData.betriebHausNr,
            )}
            {renderDataRow(
              t("onboarding.training.postalCode"),
              studentData.betriebPlz,
            )}
            {renderDataRow(
              t("onboarding.training.city"),
              studentData.betriebOrt,
            )}
            {renderDataRow(
              t("onboarding.training.companyPhone"),
              studentData.betriebTelefon1,
            )}
            {renderDataRow(
              t("onboarding.training.companyEmail"),
              studentData.betriebEmail,
            )}
          </EnhancedCollapse>
        )}

      {/* Company Contact (Conditional - only if step is active) */}
      {getStepIdByName(StepName.COMPANY_CONTACT, activeSteps) !== null &&
        studentData.betriebApName && (
          <EnhancedCollapse
            title={t("onboarding.summary.companyContact")}
            expanded={expandedSections.companyContact}
            onAction={() => toggleSection("companyContact")}
            headerAction={
              <SmallIconButton
                icon={<EditRoundedIcon />}
                onAction={(e) => {
                  e.stopPropagation();
                  handleEditStep(StepName.COMPANY_CONTACT);
                }}
                title={t("general.Edit")}
                placement="top"
                hoverAllowed={true}
              />
            }
          >
            {/* Contact Person 1 */}
            <StyledTitle>
              {t("onboarding.companyContact.contact1Title")}
            </StyledTitle>
            {renderDataRow(
              t("onboarding.companyContact.salutation"),
              studentData.betriebApAnrede,
            )}
            {renderDataRow(
              t("onboarding.companyContact.name"),
              studentData.betriebApName,
            )}
            {renderDataRow(
              t("onboarding.companyContact.phone"),
              studentData.betriebApTelefon1,
            )}
            {renderDataRow(
              t("onboarding.companyContact.email"),
              studentData.betriebApEmail,
            )}

            {/* Contact Person 2 (if exists) */}
            {studentData.betriebAp2Name && (
              <>
                <StyledTitle>
                  {t("onboarding.companyContact.contact2Title")}
                </StyledTitle>
                {renderDataRow(
                  t("onboarding.companyContact.salutation"),
                  studentData.betriebAp2Anrede,
                )}
                {renderDataRow(
                  t("onboarding.companyContact.name"),
                  studentData.betriebAp2Name,
                )}
                {renderDataRow(
                  t("onboarding.companyContact.phone"),
                  studentData.betriebAp2Telefon1,
                )}
                {renderDataRow(
                  t("onboarding.companyContact.email"),
                  studentData.betriebAp2Email,
                )}
              </>
            )}
          </EnhancedCollapse>
        )}

      {/* Agreements (Read-only display - Dynamic from admin settings) */}
      <EnhancedCollapse
        title={t("onboarding.summary.agreements")}
        expanded={expandedSections.agreements}
        onAction={() => toggleSection("agreements")}
        headerAction={
          <SmallIconButton
            icon={<EditRoundedIcon />}
            onAction={(e) => {
              e.stopPropagation();
              handleEditStep(StepName.AGREEMENTS);
            }}
            title={t("general.Edit")}
            placement="top"
            hoverAllowed={true}
          />
        }
      >
        {enabledAgreements.map((agreement) => {
          const fieldName = agreement.key;
          const value = (studentData as Record<string, boolean>)?.[fieldName];
          const label = getAgreementLabel(agreement);

          return renderAggreementRow(label, value);
        })}
      </EnhancedCollapse>

      {/* Confirmation Checkbox */}
      <ConfirmationBox>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmationChecked}
              onChange={(e) => setConfirmationChecked(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t("onboarding.summary.confirmationText")}
            </Typography>
          }
        />
      </ConfirmationBox>
    </SummaryContainer>
  );
};

export default SummaryForm;
