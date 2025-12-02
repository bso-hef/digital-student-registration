"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralDropdown from "@/components/atoms/dropdowns/GeneralDropdown";
import StudentStatus from "@/components/atoms/status/StudentStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import ClassAutocomplete from "@/components/molecules/ClassAutocomplete";
import AddStudentModal from "@/components/organisms/modals/AddStudentModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import GenerateQrDialog from "@/components/organisms/modals/GenerateQrModal";
import DataTable from "@/components/organisms/tables/DataTable";
import { getClasses } from "@/store/actions/classActions";
import {
  addStudents,
  deleteStudents,
  getStudents,
} from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { Student } from "@/types/db";
import { CreateStudentInput } from "@/types/student";
import { ParsedStudent, parseCSVFile } from "@/utils/csv.utils";
import { filterStudents } from "@/utils/filter.utils";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { Box, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import { manageTableHeaders } from "./manageTableConfig";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  flex: 1,
  minHeight: 0,
  color: theme.palette.text.default,
  overflow: "hidden",
}));

const StyledTableBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  padding: theme.spacing(4),
}));

const StudentManagementPage = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { students, loading } = useSelector(
    (state: RootState) => state.student,
  );
  const { classes } = useSelector((state: RootState) => state.class);

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [openStudentDeleteModal, setOpenStudentDeleteModal] = useState(false);
  const [openStudentQRModal, setOpenStudentQRModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [csvData, setCsvData] = useState<ParsedStudent[]>([]);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  useEffect(() => {
    dispatch(getStudents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getClasses());
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

  const handleDeleteStudentModalOpen = useCallback(() => {
    setOpenStudentDeleteModal(true);
  }, []);

  const handleDeleteStudentModalClose = useCallback(() => {
    setOpenStudentDeleteModal(false);
  }, []);

  const handleQRStudentModalOpen = useCallback(() => {
    setOpenStudentQRModal(true);
  }, []);

  const handleQRStudentModalClose = useCallback(() => {
    setOpenStudentQRModal(false);
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
      const currentClass = (
        student as Student & {
          currentClass?: { _id: string; name: string } | string | null;
        }
      ).currentClass;

      return {
        id: student?._id,
        firstName: student?.firstName,
        lastName: student?.lastName,
        class: (
          <ClassAutocomplete
            studentId={student._id}
            currentClass={currentClass}
            availableClasses={classes}
          />
        ),
        verificationCode: student?.verificationCode || "-",
        status: <StudentStatus studentStatus={student?.status} />,
      };
    });
  }, [students, searchString, classes]);

  const handleDeleteStudents = useCallback(() => {
    const ids = selectedItems.filter(
      (id) => students.findIndex((item: Student) => item._id === id) !== -1,
    );
    dispatch(deleteStudents(ids as string[]));
    setSelectedItems([]);
    setClearSelected(true);
    handleDeleteStudentModalClose();
  }, [dispatch, handleDeleteStudentModalClose, selectedItems, students]);

  return (
    <Wrapper>
      <AddStudentModal
        open={openStudentAddModal}
        onClose={handleAddStudentModalClose}
        onUploadCSV={handleUploadCSV}
        csvData={csvData}
        onAddStudents={handleAddStudents}
      />
      <ConfirmationModal
        open={openStudentDeleteModal}
        onClose={handleDeleteStudentModalClose}
        onConfirmation={handleDeleteStudents}
        title={`${t("settings.manageStudent.deleteStudents")}?`}
        message={t("settings.manageStudent.delete Student request")}
      />
      <GenerateQrDialog
        open={openStudentQRModal}
        onClose={handleQRStudentModalClose}
        students={students.filter((student: Student) =>
          selectedItems.includes(student._id),
        )}
      />
      <AdminSettingsHeader
        title={t("navigation.studentManagement")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
        <GeneralButton
          label={t("settings.manageStudent.deleteStudents")}
          onAction={handleDeleteStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={selectedItems.length === 0}
          startIcon={<DeleteOutlineRoundedIcon />}
        />
        <GeneralButton
          label={t("settings.manageStudent.generateQRCode")}
          onAction={handleQRStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={selectedItems.length === 0}
          startIcon={<QrCode2RoundedIcon />}
        />
        <GeneralButton
          label={t("settings.manageStudent.importStudents")}
          onAction={handleAddStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          startIcon={<UploadFileRoundedIcon />}
        />
      </AdminSettingsHeader>
      <StyledTableBox>
        <DataTable
          headers={manageTableHeaders(t)}
          data={getTableData()}
          loading={loading}
          setSelectedItems={setSelectedItems}
          clearSelected={clearSelected}
          setClearSelected={setClearSelected}
        />
      </StyledTableBox>
    </Wrapper>
  );
};

export default StudentManagementPage;
