"use client";

import React from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import { WarningRounded } from "@mui/icons-material";
import { Box, Chip, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  lineHeight: "20px !important",
  color: theme.palette.text.default,
}));

const ClassChipsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const ClassChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
  color: theme.palette.text.primary,
  "& .MuiChip-label": {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
}));

interface MissingClassesWarningModalProps {
  open: boolean;
  onClose: () => void;
  onCreateClasses: () => void;
  onImportAnyway: () => void;
  missingClasses: string[];
  isCreatingClasses?: boolean;
}

const MissingClassesWarningModal: React.FC<MissingClassesWarningModalProps> = ({
  open,
  onClose,
  onCreateClasses,
  onImportAnyway,
  missingClasses,
  isCreatingClasses = false,
}) => {
  const { t } = useTranslation();

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.missingClasses.title")}
      subtitle={t("modals.missingClasses.hint")}
      modalWidth={600}
      contentChildren={
        <ContentContainer>
          <ClassChipsContainer>
            <StyledTitle>{t("modals.missingClasses.message")}</StyledTitle>
            <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {missingClasses.map((className) => (
                <ClassChip key={className} label={className} />
              ))}
            </Box>
          </ClassChipsContainer>
        </ContentContainer>
      }
      actionsChildren={
        <>
          <GeneralButton
            label={
              isCreatingClasses
                ? t("modals.missingClasses.creating")
                : t("modals.missingClasses.createAndImport")
            }
            isPrimary={true}
            onAction={onCreateClasses}
            disabled={isCreatingClasses}
          />
          <GeneralButton
            label={t("modals.missingClasses.importAnyway")}
            isPrimary={false}
            onAction={onImportAnyway}
            disabled={isCreatingClasses}
          />
        </>
      }
    />
  );
};

export default MissingClassesWarningModal;
