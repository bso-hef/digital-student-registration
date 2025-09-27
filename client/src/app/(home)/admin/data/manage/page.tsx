"use client";

import React, { useCallback, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import DataTable from "@/components/organisms/tables/DataTable";
import { ParsedMember, parseCSVFile } from "@/utils/csv.utils";
import { Box, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import { manageTableHeaders, mockManageTableData } from "./manageTableConfig";

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

const StyledTableBox = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const ImportDataAdminPage = () => {
  const [csvData, setCsvData] = useState<ParsedMember[]>([]);
  const { t } = useTranslation();

  const handleUploadCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
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
      <AdminSettingsHeader title={t("navigation.manageData")}>
        <GeneralButton
          label="Schüler importieren"
          onAction={handleUploadCSV}
          fullHeight={false}
          fullWidth={false}
          isPrimary
        />
      </AdminSettingsHeader>
      <StyledTableBox>
        <DataTable headers={manageTableHeaders} data={mockManageTableData} />
      </StyledTableBox>
    </Wrapper>
  );
};

export default ImportDataAdminPage;
