"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import StudentStatus from "@/components/atoms/status/StudentStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import AddStudentModal from "@/components/organisms/modals/AddStudentModal";
import DataTable from "@/components/organisms/tables/DataTable";
import { addStudents, getStudents } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { Student } from "@/types/db";
import { CreateStudentInput } from "@/types/student";
import { ParsedStudent, parseCSVFile } from "@/utils/csv.utils";
import { filterStudents } from "@/utils/filter.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import { manageTableHeaders } from "./manageTableConfig";

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
  const dispatch: AppDispatch = useDispatch();
  const { students, loading } = useSelector(
    (state: RootState) => state.student,
  );

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [csvData, setCsvData] = useState<ParsedStudent[]>([]);

  useEffect(() => {
    dispatch(getStudents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const rows = (await parseCSVFile(file)) ?? [];
        setCsvData(rows as ParsedStudent[]);
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

  const handleAddStudents = useCallback(
    (students: CreateStudentInput[]) => {
      dispatch(addStudents(students));
      handleAddStudentModalClose();
    },
    [dispatch, handleAddStudentModalClose],
  );

  const handleSearchString = useMemo(
    () =>
      debounce(
        function (text: string) {
          if (isString(text) && (text.length > 2 || text.length === 0)) {
            setSearchString(text);
          }
        },
        500,
        {
          leading: true,
          trailing: true,
        },
      ),
    [setSearchString],
  );

  const getTableData = useCallback(() => {
    return filterStudents(searchString, students).map((student: Student) => {
      return {
        id: student?._id,
        firstName: student?.firstName,
        lastName: student?.lastName,
        class: student?.class,
        status: <StudentStatus studentStatus={student?.status} />,
      };
    });
  }, [students, searchString]);

  return (
    <Wrapper>
      <AddStudentModal
        open={openStudentAddModal}
        onClose={handleAddStudentModalClose}
        onUploadCSV={handleUploadCSV}
        csvData={csvData}
        onAddStudents={handleAddStudents}
      />
      <AdminSettingsHeader
        title={t("navigation.manageData")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
        <GeneralButton
          label={t("settings.manageData.importStudents")}
          onAction={handleAddStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary
        />
      </AdminSettingsHeader>
      <StyledTableBox>
        <DataTable
          headers={manageTableHeaders(t)}
          data={getTableData()}
          loading={loading}
        />
      </StyledTableBox>
    </Wrapper>
  );
};

export default ImportDataAdminPage;
