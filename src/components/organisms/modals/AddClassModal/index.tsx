"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import { ClassCreateInput } from "@/types/class";
import { ParsedClass, convertToClassCreateInput } from "@/utils/classCSV.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Chip, LinearProgress, Typography, styled } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import CSVClassRow from "./CSVClassRow";

const StyledForm = styled(Box)(({ theme }) => ({
  height: "100%",
  maxHeight: 400,
  overflow: "hidden",
  overflowY: "auto",
  ...applicationScrollbar(theme),
}));

const StyledSummaryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  flexShrink: 0,
  marginBottom: theme.spacing(2),
}));

const StyledAddButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  border: `1px dashed ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

const StyledLoadingOverlay = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(6),
  minHeight: 200,
}));

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

// Create a default empty class entry
const createEmptyClass = (): ParsedClass => {
  const defaultFrom = dayjs().startOf("year");
  const defaultTo = dayjs().add(1, "year").startOf("year");

  return {
    name: "",
    schoolYearFrom: defaultFrom.toDate(),
    schoolYearTo: defaultTo.toDate(),
    grade: null,
    isVocational: false,
    requiresEmployerInfo: false,
    active: true,
    isValid: false,
    validationErrors: ["Name is required"],
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAddClass: (classes: ClassCreateInput[]) => void;
  onUploadCSV?: () => void;
  csvData?: ParsedClass[];
  isParsingCSV?: boolean;
  isImporting?: boolean;
};

const AddClassModal: React.FC<Props> = ({
  open,
  onClose,
  onAddClass,
  onUploadCSV,
  csvData = [],
  isParsingCSV = false,
  isImporting = false,
}) => {
  const { t } = useTranslation();
  const [classRows, setClassRows] = useState<ParsedClass[]>([]);

  const isLoading = isParsingCSV || isImporting;

  // Initialize with one empty row when modal opens
  useEffect(() => {
    if (open && csvData.length === 0) {
      setClassRows([createEmptyClass()]);
    }
  }, [open, csvData.length]);

  // Update rows when CSV data is provided
  useEffect(() => {
    if (csvData.length > 0) {
      setClassRows([...csvData]);
    }
  }, [csvData]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setClassRows([]);
    }
  }, [open]);

  // Validation summary
  const validationSummary = useMemo(() => {
    const valid = classRows.filter((item) => item.isValid).length;
    const invalid = classRows.length - valid;
    // Count warnings: valid classes that are missing grade
    const withWarnings = classRows.filter(
      (item) => item.isValid && item.grade === null,
    ).length;
    return { valid, invalid, withWarnings, total: classRows.length };
  }, [classRows]);

  // Check if form is valid (at least one valid class)
  const isFormValid = validationSummary.valid > 0;

  // Handle row change
  const handleRowChange = useCallback(
    (index: number, updatedClass: ParsedClass) => {
      setClassRows((prev) => {
        const newData = [...prev];
        newData[index] = updatedClass;
        return newData;
      });
    },
    [],
  );

  // Handle row deletion
  const handleRowDelete = useCallback((index: number) => {
    setClassRows((prev) => {
      // Don't delete if it's the last row
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Handle adding a new row
  const handleAddRow = useCallback(() => {
    setClassRows((prev) => [...prev, createEmptyClass()]);
  }, []);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;

    // Convert valid ParsedClass items to ClassCreateInput
    const classesToCreate = convertToClassCreateInput(classRows);
    onAddClass(classesToCreate);
  }, [isFormValid, classRows, onAddClass]);

  // Loading content
  const loadingContent = (
    <StyledLoadingOverlay>
      <Typography variant="h6" color="text.primary">
        {isParsingCSV
          ? t("modals.addClass.parsingCSV")
          : t("modals.addClass.importingClasses")}
      </Typography>
      <StyledProgressBar />
      <Typography variant="body2" color="text.secondary">
        {t("modals.addClass.pleaseWait")}
      </Typography>
    </StyledLoadingOverlay>
  );

  // Main content with collapsible rows
  const mainContent = (
    <>
      {classRows.length > 1 && (
        <StyledSummaryBox>
          <Chip
            icon={<CheckCircleOutlineRoundedIcon />}
            label={`${validationSummary.valid} ${t("modals.addClass.validClasses")}`}
            color="success"
            size="small"
            variant="outlined"
          />
          {validationSummary.withWarnings > 0 && (
            <Chip
              icon={<WarningAmberRoundedIcon />}
              label={`${validationSummary.withWarnings} ${t("modals.addClass.withWarnings")}`}
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
          {validationSummary.invalid > 0 && (
            <Chip
              icon={<WarningAmberRoundedIcon />}
              label={`${validationSummary.invalid} ${t("modals.addClass.invalidClasses")}`}
              color="error"
              size="small"
              variant="outlined"
            />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: "auto" }}
          >
            {t("modals.addClass.totalClasses", {
              count: validationSummary.total,
            })}
          </Typography>
        </StyledSummaryBox>
      )}
      <StyledForm>
        {classRows.map((classData, index) => (
          <CSVClassRow
            key={index}
            classData={classData}
            index={index}
            onChange={handleRowChange}
            onDelete={handleRowDelete}
            defaultExpanded={
              classRows.length === 1 || index === classRows.length - 1
            }
          />
        ))}
        <StyledAddButton onClick={handleAddRow}>
          <SmallIconButton
            icon={<AddRoundedIcon />}
            onAction={handleAddRow}
            noMargin
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {t("modals.addClass.addAnotherClass")}
          </Typography>
        </StyledAddButton>
      </StyledForm>
    </>
  );

  const contentChildren = isLoading ? loadingContent : mainContent;

  const actionsChildren = (
    <Fragment>
      {onUploadCSV && (
        <GeneralButton
          label={
            csvData.length > 0
              ? t("modals.addClass.uploadDifferentCsv")
              : t("modals.addClass.uploadCsv")
          }
          isPrimary={false}
          onAction={onUploadCSV}
          fullWidth={false}
          disabled={isLoading}
        />
      )}
      <GeneralButton
        label={t("general.Cancel")}
        isPrimary={false}
        onAction={onClose}
        fullWidth={false}
        disabled={isLoading}
      />
      <GeneralButton
        label={
          isImporting
            ? t("modals.addClass.importing")
            : validationSummary.valid > 1
              ? t("modals.addClass.importClasses", {
                  count: validationSummary.valid,
                })
              : t("modals.addClass.createClasses")
        }
        onAction={handleSubmit}
        disabled={!isFormValid || isLoading}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.addClass.title")}
      subtitle={
        csvData.length > 0
          ? t("modals.addClass.csvPreviewSubtitle")
          : t("modals.addClass.subtitle")
      }
      modalWidth={800}
      modalMaxHeight={680}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default AddClassModal;
