"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { ClassCreateInput } from "@/types/class";
import { ParsedClass, convertToClassCreateInput } from "@/utils/classCSV.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Box, Chip, LinearProgress, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import GeneralModal from "../GeneralModal";
import CSVClassRow from "./CSVClassRow";

const StyledPreviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledSummaryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  flexShrink: 0,
}));

const StyledRowsContainer = styled(Box)(({ theme }) => ({
  maxHeight: 400,
  overflow: "auto",
  paddingBottom: theme.spacing(1),
  ...applicationScrollbar(theme),
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

const StyledProgressBar = styled(LinearProgress)({
  width: "100%",
  maxWidth: 400,
  height: 8,
  borderRadius: 4,
});

const StyledEmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
}));

type ImportClassCSVModalProps = {
  open: boolean;
  onClose: () => void;
  onImportClasses: (classes: ClassCreateInput[]) => void;
  onUploadCSV: () => void;
  csvData?: ParsedClass[];
  isParsingCSV?: boolean;
  isImporting?: boolean;
};

const ImportClassCSVModal: React.FC<ImportClassCSVModalProps> = ({
  open,
  onClose,
  onImportClasses,
  onUploadCSV,
  csvData = [],
  isParsingCSV = false,
  isImporting = false,
}) => {
  const { t } = useTranslation();
  const [editableData, setEditableData] = useState<ParsedClass[]>([]);

  const isLoading = isParsingCSV || isImporting;

  // Initialize editable data when csvData changes
  useEffect(() => {
    if (csvData.length > 0) {
      setEditableData([...csvData]);
    }
  }, [csvData]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setEditableData([]);
    }
  }, [open]);

  // Validation summary
  const validationSummary = useMemo(() => {
    const valid = editableData.filter((item) => item.isValid).length;
    const invalid = editableData.length - valid;
    return { valid, invalid, total: editableData.length };
  }, [editableData]);

  // Handle row update
  const handleRowChange = useCallback(
    (index: number, updatedClass: ParsedClass) => {
      setEditableData((prev) => {
        const newData = [...prev];
        newData[index] = updatedClass;
        return newData;
      });
    },
    [],
  );

  // Handle row deletion
  const handleRowDelete = useCallback((index: number) => {
    setEditableData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle import
  const handleImport = useCallback(() => {
    const classesToImport = convertToClassCreateInput(editableData);
    if (classesToImport.length > 0) {
      onImportClasses(classesToImport);
    }
  }, [editableData, onImportClasses]);

  const hasValidClasses = validationSummary.valid > 0;

  // Loading content
  const loadingContent = (
    <StyledLoadingOverlay>
      <Typography variant="h6" color="text.primary">
        {isParsingCSV
          ? t("modals.importClassCSV.parsingCSV")
          : t("modals.importClassCSV.importingClasses")}
      </Typography>
      <StyledProgressBar />
      <Typography variant="body2" color="text.secondary">
        {t("modals.importClassCSV.pleaseWait")}
      </Typography>
    </StyledLoadingOverlay>
  );

  // Empty state content
  const emptyContent = (
    <StyledEmptyState>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {t("modals.importClassCSV.noData")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("modals.importClassCSV.uploadToStart")}
      </Typography>
    </StyledEmptyState>
  );

  // Preview content
  const previewContent = (
    <StyledPreviewContainer>
      <StyledSummaryBox>
        <Chip
          icon={<CheckCircleOutlineRoundedIcon />}
          label={`${validationSummary.valid} ${t("modals.importClassCSV.validClasses")}`}
          color="success"
          size="small"
          variant="outlined"
        />
        {validationSummary.invalid > 0 && (
          <Chip
            icon={<ErrorOutlineRoundedIcon />}
            label={`${validationSummary.invalid} ${t("modals.importClassCSV.invalidClasses")}`}
            color="error"
            size="small"
            variant="outlined"
          />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {t("modals.importClassCSV.totalClasses", {
            count: validationSummary.total,
          })}
        </Typography>
      </StyledSummaryBox>

      <Typography variant="caption" color="text.secondary">
        {t("modals.importClassCSV.clickToExpand")}
      </Typography>

      <StyledRowsContainer>
        {editableData.map((classData, index) => (
          <CSVClassRow
            key={index}
            classData={classData}
            index={index}
            onChange={handleRowChange}
            onDelete={handleRowDelete}
          />
        ))}
      </StyledRowsContainer>
    </StyledPreviewContainer>
  );

  const contentChildren = isLoading
    ? loadingContent
    : editableData.length > 0
      ? previewContent
      : emptyContent;

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        isPrimary={false}
        onAction={onClose}
        fullWidth={false}
        disabled={isLoading}
      />
      <GeneralButton
        label={
          editableData.length > 0
            ? t("modals.importClassCSV.uploadDifferentFile")
            : t("modals.importClassCSV.uploadCSV")
        }
        isPrimary={false}
        onAction={onUploadCSV}
        fullWidth={false}
        disabled={isLoading}
      />
      <GeneralButton
        label={
          isImporting
            ? t("modals.importClassCSV.importing")
            : t("modals.importClassCSV.importClasses", {
                count: validationSummary.valid,
              })
        }
        disabled={!hasValidClasses || isLoading}
        onAction={handleImport}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.importClassCSV.title")}
      subtitle={t("modals.importClassCSV.subtitle")}
      modalWidth={800}
      modalMaxHeight={650}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
      maxWidth="lg"
    />
  );
};

export default ImportClassCSVModal;
