"use client";

import React, { useCallback, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { ParsedMember, parseCSVFile } from "@/utils/csv.utils";
import { Box, styled } from "@mui/material";

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

const UploadAdminPage = () => {
  const [csvData, setCsvData] = useState<ParsedMember[]>([]);

  const handleUploadCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const rows = (await parseCSVFile(file)) ?? [];
        setCsvData(rows);
      }
    };
    input.click();
  }, []);

  return (
    <Wrapper>
      <AdminSettingsHeader title="Daten hochladen" />
      <GeneralButton
        label="Upload CSV"
        onAction={handleUploadCSV}
        fullHeight={false}
        fullWidth={false}
        isPrimary={false}
      />
    </Wrapper>
  );
};

export default UploadAdminPage;
