"use client";

import React, { useCallback, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import AddStudentModal from "@/components/organisms/modals/AddStudentModal";
import DataTable from "@/components/organisms/tables/DataTable";
import { ParsedMember, parseCSVFile } from "@/utils/csv.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
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

const StyledTableBox = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overflowX: "hidden",
  flex: 1,
  ...applicationScrollbar(theme),
}));

const ImportDataAdminPage = () => {
  const { t } = useTranslation();

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [csvData, setCsvData] = useState<ParsedMember[]>([]);

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

  const handleAddStudentModalOpen = useCallback(() => {
    setOpenStudentAddModal(true);
  }, []);

  const handleAddStudentModalClose = useCallback(() => {
    setOpenStudentAddModal(false);
    setCsvData([]);
  }, []);

  return (
    <Wrapper>
      <AddStudentModal
        open={openStudentAddModal}
        onClose={handleAddStudentModalClose}
        onUploadCSV={handleUploadCSV}
        csvData={csvData}
      />
      <AdminSettingsHeader title={t("navigation.manageData")}>
        <GeneralButton
          label="Schüler importieren"
          onAction={handleAddStudentModalOpen}
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
