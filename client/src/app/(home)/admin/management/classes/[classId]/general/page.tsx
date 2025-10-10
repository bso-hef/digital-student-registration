"use client";

import React from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const GeneralClassSettingsTab = () => {
  const { t } = useTranslation();

  const handleSave = () => {
    console.log("save");
  };

  return (
    <Box>
      <AdminSettingsHeader
        isSubHeader
        title={t("settings.manageClass.classSettings.general")}
        onSave={handleSave}
      />
      hi
    </Box>
  );
};

export default GeneralClassSettingsTab;
