import React, { memo, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import GeneralDropdown from "@/components/atoms/dropdowns/GeneralDropdown";
import { ParsedStudent } from "@/utils/csv.utils";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Collapse,
  Divider,
  Paper,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const StyledRowHeader = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "expanded" && prop !== "hasError" && prop !== "hasWarning",
})<{ expanded?: boolean; hasError?: boolean; hasWarning?: boolean }>(
  ({ theme, expanded, hasError, hasWarning }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    backgroundColor: hasError
      ? theme.palette.error.light + "20"
      : hasWarning
        ? theme.palette.warning.light + "20"
        : expanded
          ? theme.palette.surface.button.focused
          : theme.palette.surface.interface.base,
    border: `1px solid ${
      hasError
        ? theme.palette.error.main
        : hasWarning
          ? theme.palette.warning.main
          : theme.palette.border.seperator
    }`,
    borderRadius: expanded ? theme.spacing(1, 1, 0, 0) : theme.spacing(1),
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const StyledHeaderInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  flex: 1,
  minWidth: 0,
});

const StyledHeaderText = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StyledContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.border.seperator}`,
  borderTop: "none",
  borderRadius: theme.spacing(0, 0, 1, 1),
  backgroundColor: theme.palette.background.paper,
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
}));

const StyledFieldGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: theme.spacing(2),
}));

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "diverse", label: "Diverse" },
];

interface CSVStudentRowProps {
  student: ParsedStudent;
  index: number;
  onChange: (index: number, updatedStudent: ParsedStudent) => void;
  onDelete: (index: number) => void;
}

const CSVStudentRow: React.FC<CSVStudentRowProps> = ({
  student,
  index,
  onChange,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Compute validation errors (required fields)
  const validationErrors: string[] = [];
  if (!student.firstName)
    validationErrors.push(t("modals.addStudent.firstNameRequired"));
  if (!student.lastName)
    validationErrors.push(t("modals.addStudent.lastNameRequired"));
  if (!student.dateOfBirth)
    validationErrors.push(t("modals.addStudent.dateOfBirthRequired"));

  const hasError = validationErrors.length > 0;

  // Compute warnings (optional but recommended fields)
  const warningMessages: string[] = [];
  if (!student.className) {
    warningMessages.push(t("modals.addStudent.classNameMissing"));
  }
  if (!student.employer?.companyName) {
    warningMessages.push(t("modals.addStudent.employerMissing"));
  }
  const hasWarning = !hasError && warningMessages.length > 0;

  const handleFieldChange = (field: string, value: string | undefined) => {
    const updatedStudent = { ...student };

    // Handle nested fields
    if (field.includes(".")) {
      const parts = field.split(".");
      if (parts[0] === "address") {
        updatedStudent.address = {
          ...updatedStudent.address,
          [parts[1]]: value,
        };
      } else if (parts[0] === "employer") {
        updatedStudent.employer = {
          ...updatedStudent.employer,
          [parts[1]]: value,
        };
      }
    } else {
      (updatedStudent as Record<string, unknown>)[field] = value;
    }

    onChange(index, updatedStudent);
  };

  const handleDateChange = (field: string, value: dayjs.Dayjs | null) => {
    const formattedValue = value ? value.format("DD.MM.YYYY") : "";
    handleFieldChange(field, formattedValue);
  };

  const summaryText = `${student.firstName || "-"} ${student.lastName || "-"}`;
  const dobText = student.dateOfBirth || "-";
  const classText = student.className || "-";
  const employerText = student.employer?.companyName || "-";

  return (
    <Paper elevation={0} sx={{ mb: 1 }}>
      <StyledRowHeader
        expanded={expanded}
        hasError={hasError}
        hasWarning={hasWarning}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? (
            <KeyboardArrowUpRoundedIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownRoundedIcon fontSize="small" />
          )}
        </Box>

        <StyledHeaderInfo>
          <StyledHeaderText
            variant="body2"
            sx={{ fontWeight: 500, minWidth: 150 }}
          >
            {summaryText}
          </StyledHeaderText>
          <StyledHeaderText
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 90 }}
          >
            {dobText}
          </StyledHeaderText>
          <StyledHeaderText
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 80 }}
          >
            {classText}
          </StyledHeaderText>
          <StyledHeaderText variant="body2" color="text.secondary">
            {employerText}
          </StyledHeaderText>
          {hasError && (
            <Tooltip title={validationErrors.join(", ")}>
              <ErrorOutlineRoundedIcon color="error" fontSize="small" />
            </Tooltip>
          )}
          {hasWarning && (
            <Tooltip title={warningMessages.join(", ")}>
              <WarningAmberRoundedIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
        </StyledHeaderInfo>

        <SmallIconButton
          icon={<DeleteOutlineRoundedIcon />}
          onAction={(e) => {
            e?.stopPropagation();
            onDelete(index);
          }}
          title={t("modals.addStudent.deleteRow")}
        />
      </StyledRowHeader>

      <Collapse in={expanded}>
        <StyledContent>
          {/* Personal Information Section */}
          <StyledSection>
            <StyledSectionTitle>
              {t("modals.addStudent.personalInfo")}
            </StyledSectionTitle>
            <StyledFieldGrid>
              <GeneralInput
                label={t("modals.addStudent.firstName") + " *"}
                value={student.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                error={!student.firstName}
              />
              <GeneralInput
                label={t("modals.addStudent.lastName") + " *"}
                value={student.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                error={!student.lastName}
              />
              <GeneralInput
                label={t("modals.addStudent.birthName")}
                value={student.birthName || ""}
                onChange={(e) => handleFieldChange("birthName", e.target.value)}
              />
              <GeneralDropdown
                label={t("modals.addStudent.gender")}
                value={student.gender || ""}
                options={GENDER_OPTIONS}
                onChange={(event) =>
                  handleFieldChange("gender", event.target.value as string)
                }
              />
              <DatePicker
                label={t("modals.addStudent.dateOfBirth") + " *"}
                value={
                  student.dateOfBirth
                    ? dayjs(student.dateOfBirth, "DD.MM.YYYY")
                    : null
                }
                onChange={(value) => handleDateChange("dateOfBirth", value)}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    error: !student.dateOfBirth,
                  },
                }}
              />
              <GeneralInput
                label={t("modals.addStudent.birthplace")}
                value={student.birthplace || ""}
                onChange={(e) =>
                  handleFieldChange("birthplace", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.birthCountry")}
                value={student.birthCountry || ""}
                onChange={(e) =>
                  handleFieldChange("birthCountry", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.religion")}
                value={student.religion || ""}
                onChange={(e) => handleFieldChange("religion", e.target.value)}
              />
              <GeneralInput
                label={t("modals.addStudent.nationality")}
                value={student.nationality || ""}
                onChange={(e) =>
                  handleFieldChange("nationality", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.secondNationality")}
                value={student.secondNationality || ""}
                onChange={(e) =>
                  handleFieldChange("secondNationality", e.target.value)
                }
              />
            </StyledFieldGrid>
          </StyledSection>

          <Divider sx={{ my: 2 }} />

          {/* Address & Contact Section */}
          <StyledSection>
            <StyledSectionTitle>
              {t("modals.addStudent.addressContact")}
            </StyledSectionTitle>
            <StyledFieldGrid>
              <GeneralInput
                label={t("modals.addStudent.street")}
                value={student.address?.street || ""}
                onChange={(e) =>
                  handleFieldChange("address.street", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.city")}
                value={student.address?.city || ""}
                onChange={(e) =>
                  handleFieldChange("address.city", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.zip")}
                value={student.address?.zip || ""}
                onChange={(e) =>
                  handleFieldChange("address.zip", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.phone")}
                value={student.phone || ""}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
              <GeneralInput
                label={t("modals.addStudent.mobile")}
                value={student.mobile || ""}
                onChange={(e) => handleFieldChange("mobile", e.target.value)}
              />
              <GeneralInput
                label={t("modals.addStudent.email")}
                value={student.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            </StyledFieldGrid>
          </StyledSection>

          <Divider sx={{ my: 2 }} />

          {/* Class & School Section */}
          <StyledSection>
            <StyledSectionTitle>
              {t("modals.addStudent.classSchool")}
            </StyledSectionTitle>
            <StyledFieldGrid>
              <GeneralInput
                label={t("modals.addStudent.class")}
                value={student.className || ""}
                onChange={(e) => handleFieldChange("className", e.target.value)}
              />
              <DatePicker
                label={t("modals.addStudent.schoolEntryDate")}
                value={
                  student.schoolEntryDate
                    ? dayjs(student.schoolEntryDate, "DD.MM.YYYY")
                    : null
                }
                onChange={(value) => handleDateChange("schoolEntryDate", value)}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: { size: "small" },
                }}
              />
              <GeneralInput
                label={t("modals.addStudent.previousSchool")}
                value={student.previousSchool || ""}
                onChange={(e) =>
                  handleFieldChange("previousSchool", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.previousSchoolType")}
                value={student.previousSchoolType || ""}
                onChange={(e) =>
                  handleFieldChange("previousSchoolType", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.degrees")}
                value={student.degrees || ""}
                onChange={(e) => handleFieldChange("degrees", e.target.value)}
              />
            </StyledFieldGrid>
          </StyledSection>

          <Divider sx={{ my: 2 }} />

          {/* Employer Section */}
          <StyledSection>
            <StyledSectionTitle>
              {t("modals.addStudent.employerInfo")}
            </StyledSectionTitle>
            <StyledFieldGrid>
              <GeneralInput
                label={t("modals.addStudent.companyName")}
                value={student.employer?.companyName || ""}
                onChange={(e) =>
                  handleFieldChange("employer.companyName", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.companyAddress")}
                value={student.employer?.address || ""}
                onChange={(e) =>
                  handleFieldChange("employer.address", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.contactName")}
                value={student.employer?.contactName || ""}
                onChange={(e) =>
                  handleFieldChange("employer.contactName", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.contactPhone")}
                value={student.employer?.contactPhone || ""}
                onChange={(e) =>
                  handleFieldChange("employer.contactPhone", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.contactEmail")}
                value={student.employer?.contactEmail || ""}
                onChange={(e) =>
                  handleFieldChange("employer.contactEmail", e.target.value)
                }
              />
              <GeneralInput
                label={t("modals.addStudent.profession")}
                value={student.profession || ""}
                onChange={(e) =>
                  handleFieldChange("profession", e.target.value)
                }
              />
              <DatePicker
                label={t("modals.addStudent.trainingStartDate")}
                value={
                  student.trainingStartDate
                    ? dayjs(student.trainingStartDate, "DD.MM.YYYY")
                    : null
                }
                onChange={(value) =>
                  handleDateChange("trainingStartDate", value)
                }
                format="DD.MM.YYYY"
                slotProps={{
                  textField: { size: "small" },
                }}
              />
            </StyledFieldGrid>
          </StyledSection>
        </StyledContent>
      </Collapse>
    </Paper>
  );
};

export default memo(CSVStudentRow);
