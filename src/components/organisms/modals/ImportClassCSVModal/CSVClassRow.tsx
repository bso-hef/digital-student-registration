import React, { memo, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import { ParsedClass } from "@/utils/classCSV.utils";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {
  Box,
  Collapse,
  Paper,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import AppleSwitch from "@/components/atoms/AppleSwitch";

const StyledRowHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "expanded" && prop !== "hasError",
})<{ expanded?: boolean; hasError?: boolean }>(
  ({ theme, expanded, hasError }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    backgroundColor: hasError
      ? theme.palette.error.light + "20"
      : expanded
        ? theme.palette.surface.button.focused
        : theme.palette.surface.interface.base,
    border: `1px solid ${hasError ? theme.palette.error.main : theme.palette.border.seperator}`,
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

const StyledFieldGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: theme.spacing(2),
}));

const StyledSwitchRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 0),
}));

interface CSVClassRowProps {
  classData: ParsedClass;
  index: number;
  onChange: (index: number, updatedClass: ParsedClass) => void;
  onDelete: (index: number) => void;
}

const CSVClassRow: React.FC<CSVClassRowProps> = ({
  classData,
  index,
  onChange,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const hasError = !classData.isValid;

  const handleFieldChange = (field: keyof ParsedClass, value: unknown) => {
    const updatedClass = { ...classData, [field]: value };

    // Re-validate after change
    const errors: string[] = [];
    if (!updatedClass.name || (updatedClass.name as string).trim() === "") {
      errors.push("Name is required");
    }
    if (!updatedClass.schoolYearFrom) {
      errors.push("School year from is required");
    }
    if (!updatedClass.schoolYearTo) {
      errors.push("School year to is required");
    }

    updatedClass.isValid = errors.length === 0;
    updatedClass.validationErrors = errors;

    onChange(index, updatedClass);
  };

  const handleDateChange = (
    field: "schoolYearFrom" | "schoolYearTo",
    value: Dayjs | null,
  ) => {
    handleFieldChange(field, value ? value.toDate() : null);
  };

  const parseDate = (value: string | Date | null | undefined): Dayjs | null => {
    if (!value) return null;
    if (value instanceof Date) return dayjs(value);
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : dayjs(d);
  };

  const formatSchoolYear = (): string => {
    const fromDate = parseDate(classData.schoolYearFrom);
    const toDate = parseDate(classData.schoolYearTo);

    if (fromDate && toDate) {
      return `${fromDate.year()}/${toDate.year()}`;
    }
    return "-";
  };

  return (
    <Paper elevation={0} sx={{ mb: 1 }}>
      <StyledRowHeader
        expanded={expanded}
        hasError={hasError}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center">
          {expanded ? (
            <KeyboardArrowUpRoundedIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownRoundedIcon fontSize="small" />
          )}
        </Box>

        <StyledHeaderInfo>
          <StyledHeaderText
            variant="body2"
            fontWeight={500}
            sx={{ minWidth: 120 }}
          >
            {classData.name || "-"}
          </StyledHeaderText>
          <StyledHeaderText
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 90 }}
          >
            {formatSchoolYear()}
          </StyledHeaderText>
          <StyledHeaderText
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 60 }}
          >
            {classData.grade !== null ? `Grade ${classData.grade}` : "-"}
          </StyledHeaderText>
          <StyledHeaderText variant="body2" color="text.secondary">
            {classData.isVocational ? t("general.Yes") : t("general.No")}
          </StyledHeaderText>
          {hasError && classData.validationErrors && (
            <Tooltip title={classData.validationErrors.join(", ")}>
              <ErrorOutlineRoundedIcon color="error" fontSize="small" />
            </Tooltip>
          )}
        </StyledHeaderInfo>

        <SmallIconButton
          icon={<DeleteOutlineRoundedIcon />}
          onAction={(e) => {
            e?.stopPropagation();
            onDelete(index);
          }}
          title={t("modals.importClassCSV.deleteRow")}
        />
      </StyledRowHeader>

      <Collapse in={expanded}>
        <StyledContent>
          <StyledFieldGrid>
            <GeneralInput
              label={t("modals.addClass.className") + " *"}
              value={classData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              error={!classData.name}
            />
            <DatePicker
              views={["year"]}
              label={t("modals.addClass.schoolYearFrom") + " *"}
              value={parseDate(classData.schoolYearFrom)}
              onChange={(value) => handleDateChange("schoolYearFrom", value)}
              format="YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: !classData.schoolYearFrom,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 2.5,
                    },
                  },
                },
              }}
            />
            <DatePicker
              views={["year"]}
              label={t("modals.addClass.schoolYearTo") + " *"}
              value={parseDate(classData.schoolYearTo)}
              onChange={(value) => handleDateChange("schoolYearTo", value)}
              format="YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: !classData.schoolYearTo,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 2.5,
                    },
                  },
                },
              }}
            />
            <GeneralInput
              label={t("modals.addClass.grade")}
              value={classData.grade ?? ""}
              onChange={(e) => {
                const v = e.target.value.trim();
                if (v === "") {
                  handleFieldChange("grade", null);
                } else {
                  const n = parseInt(v, 10);
                  if (Number.isFinite(n) && n >= 1 && n <= 14) {
                    handleFieldChange("grade", n);
                  }
                }
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </StyledFieldGrid>

          <Box sx={{ mt: 2 }}>
            <StyledSwitchRow>
              <Typography fontWeight={500}>
                {t("modals.addClass.companyClass")}
              </Typography>
              <AppleSwitch
                checked={classData.isVocational}
                onChange={(_, checked) =>
                  handleFieldChange("isVocational", checked)
                }
              />
            </StyledSwitchRow>
            <StyledSwitchRow>
              <Typography fontWeight={500}>
                {t("modals.addClass.requiresEmployerInfo")}
              </Typography>
              <AppleSwitch
                checked={classData.requiresEmployerInfo}
                onChange={(_, checked) =>
                  handleFieldChange("requiresEmployerInfo", checked)
                }
              />
            </StyledSwitchRow>
            <StyledSwitchRow>
              <Typography fontWeight={500}>
                {t("modals.addClass.active")}
              </Typography>
              <AppleSwitch
                checked={classData.active}
                onChange={(_, checked) => handleFieldChange("active", checked)}
              />
            </StyledSwitchRow>
          </Box>
        </StyledContent>
      </Collapse>
    </Paper>
  );
};

export default memo(CSVClassRow);
