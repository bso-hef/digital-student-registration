"use client";

import React, { useEffect, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import AgreementsManager from "@/components/organisms/settings/AgreementsManager";
import {
  getAgreementSettings,
  updateAgreementSettings,
} from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { AgreementItem, AgreementSettings } from "@/types/settings";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, styled } from "@mui/material";
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

const AdminSettingsAgreementsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const agreementSettings = data?.agreements;

  const [localAgreements, setLocalAgreements] = useState<AgreementItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] =
    useState<AgreementItem | null>(null);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initializes editable local form state from fetched/redux agreement settings
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

  const handleAddAgreement = () => {
    setEditingAgreement(null);
    setModalOpen(true);
  };

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("navigation.agreementSettings")}
        onSave={handleSave}
        disabled={!hasChanges}
        onLoad={loading}
      >
        <GeneralButton
          label={t("settings.agreements.addAgreement")}
          startIcon={<AddRoundedIcon />}
          onAction={handleAddAgreement}
          isPrimary={false}
        />
      </AdminSettingsHeader>

      <ContentContainer>
        <AgreementsManager
          agreements={localAgreements}
          onChange={handleAgreementsChange}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          editingAgreement={editingAgreement}
          setEditingAgreement={setEditingAgreement}
        />
      </ContentContainer>
    </Wrapper>
  );
};

export default AdminSettingsAgreementsPage;
