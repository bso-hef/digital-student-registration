"use client";

import React, { Fragment, useCallback, useMemo } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { ClassInterface } from "@/types/class";
import { buildClassDataCsv, downloadBlob } from "@/utils/classCSV.utils";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import GeneralModal from "../GeneralModal";

const StyledContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  textAlign: "center",
}));

const StyledIconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
}));

const StyledInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  width: "100%",
}));

type ExportClassDataModalProps = {
  open: boolean;
  onClose: () => void;
  classes: ClassInterface[];
  selectedIds: (string | number)[];
};

const ExportClassDataModal: React.FC<ExportClassDataModalProps> = ({
  open,
  onClose,
  classes,
  selectedIds,
}) => {
  const { t } = useTranslation();

  // Determine which classes to export
  const classesToExport = useMemo(() => {
    if (selectedIds.length === 0) {
      return classes;
    }
    return classes.filter((c) => selectedIds.includes(c._id));
  }, [classes, selectedIds]);

  const isExportingAll = selectedIds.length === 0;

  // Handle export
  const handleExport = useCallback(() => {
    if (classesToExport.length === 0) return;

    const blob = buildClassDataCsv(classesToExport);
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = isExportingAll
      ? `classes_export_${timestamp}.csv`
      : `classes_selected_${classesToExport.length}_${timestamp}.csv`;

    downloadBlob(blob, filename);
    onClose();
  }, [classesToExport, isExportingAll, onClose]);

  const contentChildren = (
    <StyledContent>
      <StyledIconContainer>
        <SchoolRoundedIcon sx={{ fontSize: 40 }} />
      </StyledIconContainer>

      <Box>
        <Typography variant="h6" gutterBottom>
          {isExportingAll
            ? t("modals.exportClassData.exportAllTitle")
            : t("modals.exportClassData.exportSelectedTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isExportingAll
            ? t("modals.exportClassData.exportAllDescription")
            : t("modals.exportClassData.exportSelectedDescription")}
        </Typography>
      </Box>

      <StyledInfoBox>
        <Typography variant="body2" color="text.secondary">
          {t("modals.exportClassData.classCount")}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {classesToExport.length}
        </Typography>
      </StyledInfoBox>

      <Typography variant="caption" color="text.secondary">
        {t("modals.exportClassData.csvInfo")}
      </Typography>
    </StyledContent>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        isPrimary={false}
        onAction={onClose}
        fullWidth={false}
      />
      <GeneralButton
        label={t("modals.exportClassData.download")}
        onAction={handleExport}
        fullWidth={false}
        disabled={classesToExport.length === 0}
        startIcon={<FileDownloadRoundedIcon />}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.exportClassData.title")}
      subtitle={t("modals.exportClassData.subtitle")}
      modalWidth={480}
      modalMaxHeight={500}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default ExportClassDataModal;
