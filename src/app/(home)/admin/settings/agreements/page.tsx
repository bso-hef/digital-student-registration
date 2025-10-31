"use client";

import React, { useEffect, useState } from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import AgreementsManager from "@/components/organisms/settings/AgreementsManager";
import {
  getAgreementSettings,
  updateAgreementSettings,
} from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { AgreementItem, AgreementSettings } from "@/types/settings";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Typography, styled } from "@mui/material";
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

const AdminSettingsAgreementsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const agreementSettings = data?.agreements;

  const [localAgreements, setLocalAgreements] = useState<AgreementItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch agreement settings on mount (always fetch to get defaults)
  useEffect(() => {
    dispatch(getAgreementSettings());
  }, [dispatch]);

  // Initialize local state from Redux
  useEffect(() => {
    if (
      agreementSettings?.agreements &&
      agreementSettings.agreements.length > 0
    ) {
      setLocalAgreements(agreementSettings.agreements);
    }
  }, [agreementSettings]);

  const handleAgreementsChange = (agreements: AgreementItem[]) => {
    setLocalAgreements(agreements);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const settingsToSave: AgreementSettings = {
      agreements: localAgreements,
    };

    await dispatch(updateAgreementSettings(settingsToSave));
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (agreementSettings?.agreements) {
      setLocalAgreements(agreementSettings.agreements);
      setHasChanges(false);
    }
  };

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("navigation.agreementSettings")}
        onSave={handleSave}
        onCancel={handleCancel}
        hasChanges={hasChanges}
        loading={loading}
      />

      <ContentContainer>
        <Section>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("settings.agreements.description")}
          </Typography>

          <EnhancedCollapse
            title={t("settings.agreements.schoolAgreements")}
            subtitle={t("settings.agreements.schoolAgreementsSubtitle")}
            expanded={true}
          >
            <AgreementsManager
              agreements={localAgreements}
              onChange={handleAgreementsChange}
            />
          </EnhancedCollapse>
        </Section>
      </ContentContainer>
    </Wrapper>
  );
};

export default AdminSettingsAgreementsPage;
