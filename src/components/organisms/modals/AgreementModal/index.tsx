"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import { AgreementItem } from "@/types/settings";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import AppleSwitch from "@/components/atoms/AppleSwitch";

const FormWrap = styled(Box)(({ theme }) => ({
  maxHeight: 520,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

const SwitchRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SwitchLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (agreement: AgreementItem) => void;
  agreement?: AgreementItem | null;
  existingKeys?: string[];
};

const AgreementModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  agreement,
  existingKeys = [],
}) => {
  const { t } = useTranslation();
  const isEditMode = !!agreement;

  // Form state
  const [key, setKey] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [labelDe, setLabelDe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [icon, setIcon] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [required, setRequired] = useState(false);

  // Validation state
  const [touched, setTouched] = useState({
    key: false,
    labelEn: false,
    labelDe: false,
  });

  // Reset form when modal opens/closes or agreement changes
  useEffect(() => {
    if (open && agreement) {
      // Edit mode - populate with existing data
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot form initialization synced to modal open/agreement change; fields are user-editable afterwards, so this cannot be derived during render
      setKey(agreement.key);
      setLabelEn(agreement.labels.en);
      setLabelDe(agreement.labels.de);
      setDescriptionEn(agreement.description?.en || "");
      setDescriptionDe(agreement.description?.de || "");
      setIcon(agreement.icon || "");
      setEnabled(agreement.enabled);
      setRequired(agreement.required);
    } else if (open && !agreement) {
      // Add mode - reset to defaults
      setKey("");
      setLabelEn("");
      setLabelDe("");
      setDescriptionEn("");
      setDescriptionDe("");
      setIcon("");
      setEnabled(true);
      setRequired(false);
    }
    setTouched({ key: false, labelEn: false, labelDe: false });
  }, [open, agreement]);

  // Generate key from English label
  const generateKey = useCallback((label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }, []);

  // Auto-generate key when English label changes (only in add mode)
  useEffect(() => {
    if (!isEditMode && labelEn && !touched.key) {
      const generatedKey = generateKey(labelEn);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-fills the user-editable key field from the label until the user touches it; key is independently editable so it cannot be a pure derived value
      setKey(generatedKey);
    }
  }, [labelEn, isEditMode, touched.key, generateKey]);

  // Validation
  const errors = {
    key:
      touched.key && !key
        ? t("settings.agreements.validation.keyRequired")
        : touched.key && existingKeys.includes(key) && key !== agreement?.key
          ? t("settings.agreements.validation.keyExists")
          : "",
    labelEn:
      touched.labelEn && !labelEn
        ? t("settings.agreements.validation.labelRequired")
        : "",
    labelDe:
      touched.labelDe && !labelDe
        ? t("settings.agreements.validation.labelRequired")
        : "",
  };

  const isValid =
    key &&
    labelEn &&
    labelDe &&
    !errors.key &&
    !errors.labelEn &&
    !errors.labelDe;

  const handleSave = () => {
    if (!isValid) {
      setTouched({ key: true, labelEn: true, labelDe: true });
      return;
    }

    const agreementData: AgreementItem = {
      id: agreement?.id || key,
      key,
      labels: { en: labelEn, de: labelDe },
      description:
        descriptionEn || descriptionDe
          ? { en: descriptionEn, de: descriptionDe }
          : undefined,
      icon: icon || undefined,
      enabled,
      required,
      order: agreement?.order ?? 0, // Will be set by manager
    };

    onSave(agreementData);
    onClose();
  };

  const handleClose = () => {
    setTouched({ key: false, labelEn: false, labelDe: false });
    onClose();
  };

  // Ctrl+Enter or Cmd+Enter to submit (for forms with multiline fields)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && isValid) {
      event.preventDefault();
      handleSave();
    }
  };

  const contentChildren = (
    <Box onKeyDown={handleKeyDown}>
      <FormWrap>
        {/* Key Field */}
        <GeneralInput
          label={t("settings.agreements.fields.key")}
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setTouched((prev) => ({ ...prev, key: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, key: true }))}
          error={!!errors.key}
          helperText={
            errors.key ||
            (!isEditMode ? t("settings.agreements.keyHelperText") : undefined)
          }
          placeholder={
            isEditMode ? undefined : t("settings.agreements.keyPlaceholder")
          }
          fullWidth
          required
          disabled
        />

        {/* Label (English) */}
        <GeneralInput
          label={t("settings.agreements.fields.labelEn")}
          value={labelEn}
          onChange={(e) => {
            setLabelEn(e.target.value);
            setTouched((prev) => ({ ...prev, labelEn: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, labelEn: true }))}
          error={!!errors.labelEn}
          helperText={errors.labelEn}
          placeholder={t("settings.agreements.labelEnPlaceholder")}
          required
          fullWidth
        />

        {/* Label (German) */}
        <GeneralInput
          label={t("settings.agreements.fields.labelDe")}
          value={labelDe}
          onChange={(e) => {
            setLabelDe(e.target.value);
            setTouched((prev) => ({ ...prev, labelDe: true }));
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, labelDe: true }))}
          error={!!errors.labelDe}
          helperText={errors.labelDe}
          placeholder={t("settings.agreements.labelDePlaceholder")}
          required
          fullWidth
        />

        {/* Description (English) - Optional */}
        <GeneralInput
          label={t("settings.agreements.descriptionEn")}
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          placeholder={t("settings.agreements.descriptionEnPlaceholder")}
          multiline
          rows={3}
          fullWidth
        />

        {/* Description (German) - Optional */}
        <GeneralInput
          label={t("settings.agreements.descriptionDe")}
          value={descriptionDe}
          onChange={(e) => setDescriptionDe(e.target.value)}
          placeholder={t("settings.agreements.descriptionDePlaceholder")}
          multiline
          rows={3}
          fullWidth
        />

        {/* Icon - Optional */}
        <GeneralInput
          label={t("settings.agreements.icon")}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          helperText={t("settings.agreements.iconHelperText")}
          placeholder={t("settings.agreements.iconPlaceholder")}
          fullWidth
        />

        {/* Enabled Switch */}
        <SwitchRow>
          <SwitchLabel>{t("settings.agreements.fields.enabled")}</SwitchLabel>
          <AppleSwitch
            checked={enabled}
            onChange={(e, checked) => setEnabled(checked)}
          />
        </SwitchRow>

        {/* Required Switch */}
        <SwitchRow>
          <SwitchLabel>{t("settings.agreements.fields.required")}</SwitchLabel>
          <AppleSwitch
            checked={required}
            onChange={(e, checked) => setRequired(checked)}
          />
        </SwitchRow>
      </FormWrap>
    </Box>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        onAction={handleClose}
        isPrimary={false}
      />
      <GeneralButton
        label={t("general.Save")}
        onAction={handleSave}
        isPrimary={true}
        disabled={!isValid && Object.values(touched).some((t) => t)}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={handleClose}
      customTitle={
        isEditMode
          ? t("settings.agreements.editAgreement")
          : t("settings.agreements.addAgreement")
      }
      modalWidth={600}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
      onOpenInNewTab={
        "https://mui.com/material-ui/material-icons/?query=link&theme=Rounded"
      }
    />
  );
};

export default AgreementModal;
