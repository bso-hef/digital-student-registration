"use client";

import React from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const AdminSettingsOnboardingPage = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <AdminSettingsHeader title={t("navigation.onboardingSettings")} />
      <Typography>{t("navigation.onboardingSettings")}</Typography>
    </Wrapper>
  );
};

export default AdminSettingsOnboardingPage;
