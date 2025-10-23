"use client";

import React from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const StudentClassSettingsTab = () => {
  const { t } = useTranslation();

  const handleSave = () => {
    console.log("save");
  };

  return (
    <Box>
      <AdminSettingsHeader
        isSubHeader
        title={t("settings.manageClass.classSettings.students")}
        onSave={handleSave}
      />
      hi
    </Box>
  );
};

export default StudentClassSettingsTab;
