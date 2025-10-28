"use client";

import React, { useEffect, useState } from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import DropdownOptionsManager from "@/components/organisms/settings/DropdownOptionsManager";
import FieldConfigurationPanel from "@/components/organisms/settings/FieldConfigurationPanel";
import {
  getOnboardingSettings,
  updateOnboardingSettings,
} from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import {
  DropdownOption,
  FieldConfig,
  OnboardingSettings,
} from "@/types/settings";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Divider, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  width: "100%",
  height: "100vh",
  color: theme.palette.text.default,
  overflow: "hidden",
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  overflow: "hidden",
  overflowY: "auto",
  padding: theme.spacing(3),
  flex: 1,
  minHeight: 0,
  ...applicationScrollbar(theme),
}));

const Section = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "22px !important",
  lineHeight: "28px !important",
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.default,
  textAlign: "left",
}));

const AdminSettingsOnboardingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const onboarding = data?.onboarding;

  const [localSettings, setLocalSettings] = useState<OnboardingSettings | null>(
    null,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    gender: false,
    salutation: false,
    religion: false,
    language: false,
    fieldConfig: false,
  });

  useEffect(() => {
    if (!onboarding) {
      dispatch(getOnboardingSettings());
    }
  }, [dispatch, onboarding]);

  useEffect(() => {
    if (onboarding && !localSettings) {
      setLocalSettings(onboarding);
    }
  }, [onboarding, localSettings]);

  const handleDropdownChange = (
    key: keyof OnboardingSettings,
    options: DropdownOption[],
  ) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      [key]: options,
    });
    setHasChanges(true);
  };

  const handleFieldConfigChange = (fieldName: string, config: FieldConfig) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      fieldConfigs: {
        ...localSettings?.fieldConfigs,
        [fieldName]: config,
      },
    });
    setHasChanges(true);
  };

  const handleCollapseToggle = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSave = async () => {
    if (!localSettings) return;
    await dispatch(updateOnboardingSettings(localSettings));
    setHasChanges(false);
  };

  const fieldConfigItems = [
    {
      name: "geschlecht",
      label: t("settings.onboarding.fields.geschlecht.label"),
      description: t("settings.onboarding.fields.geschlecht.description"),
      config: localSettings?.fieldConfigs.geschlecht,
    },
    {
      name: "religion",
      label: t("settings.onboarding.fields.religion.label"),
      description: t("settings.onboarding.fields.religion.description"),
      config: localSettings?.fieldConfigs.religion,
    },
    {
      name: "familiensprache",
      label: t("settings.onboarding.fields.familiensprache.label"),
      description: t("settings.onboarding.fields.familiensprache.description"),
      config: localSettings?.fieldConfigs.familiensprache,
    },
  ];

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("navigation.onboardingSettings")}
        onSave={handleSave}
        disabled={!hasChanges || loading}
        onLoad={loading || !localSettings}
      />

      <ContentContainer>
        <Section>
          <SectionTitle>
            {t("settings.onboarding.dropdownOptions")}
          </SectionTitle>

          {/* Gender Options */}
          <EnhancedCollapse
            title={t("settings.onboarding.sections.gender.title")}
            subtitle={t("settings.onboarding.sections.gender.subtitle")}
            expanded={expandedSections.gender}
            onAction={() => handleCollapseToggle("gender")}
          >
            <DropdownOptionsManager
              options={localSettings?.genderOptions}
              onChange={(options) =>
                handleDropdownChange("genderOptions", options)
              }
            />
          </EnhancedCollapse>

          {/* Salutation Options */}
          <EnhancedCollapse
            title={t("settings.onboarding.sections.salutation.title")}
            subtitle={t("settings.onboarding.sections.salutation.subtitle")}
            expanded={expandedSections.salutation}
            onAction={() => handleCollapseToggle("salutation")}
          >
            <DropdownOptionsManager
              options={localSettings?.salutationOptions}
              onChange={(options) =>
                handleDropdownChange("salutationOptions", options)
              }
            />
          </EnhancedCollapse>

          {/* Religion Options */}
          <EnhancedCollapse
            title={t("settings.onboarding.sections.religion.title")}
            subtitle={t("settings.onboarding.sections.religion.subtitle")}
            expanded={expandedSections.religion}
            onAction={() => handleCollapseToggle("religion")}
          >
            <DropdownOptionsManager
              options={localSettings?.religionOptions}
              onChange={(options) =>
                handleDropdownChange("religionOptions", options)
              }
            />
          </EnhancedCollapse>

          {/* Language Options */}
          <EnhancedCollapse
            title={t("settings.onboarding.sections.language.title")}
            subtitle={t("settings.onboarding.sections.language.subtitle")}
            expanded={expandedSections.language}
            onAction={() => handleCollapseToggle("language")}
          >
            <DropdownOptionsManager
              options={localSettings?.languageOptions}
              onChange={(options) =>
                handleDropdownChange("languageOptions", options)
              }
            />
          </EnhancedCollapse>
        </Section>

        <Divider sx={{ my: 4 }} />

        <Section>
          <SectionTitle>
            {t("settings.onboarding.fieldConfiguration")}
          </SectionTitle>

          <EnhancedCollapse
            title={t("settings.onboarding.sections.fieldConfig.title")}
            subtitle={t("settings.onboarding.sections.fieldConfig.subtitle")}
            expanded={expandedSections.fieldConfig}
            onAction={() => handleCollapseToggle("fieldConfig")}
          >
            <FieldConfigurationPanel
              fields={fieldConfigItems}
              onChange={handleFieldConfigChange}
            />
          </EnhancedCollapse>
        </Section>
      </ContentContainer>
    </Wrapper>
  );
};

export default AdminSettingsOnboardingPage;
