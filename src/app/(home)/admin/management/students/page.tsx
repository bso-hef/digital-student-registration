"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import GeneralDropdown from "@/components/atoms/dropdowns/GeneralDropdown";
import StudentStatus from "@/components/atoms/status/StudentStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import ClassAutocomplete from "@/components/molecules/ClassAutocomplete";
import AddStudentModal from "@/components/organisms/modals/AddStudentModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import ExportStudentDataModal from "@/components/organisms/modals/ExportStudentDataModal";
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
import { successNotification } from "@/utils/notification.utils";
import { copyText } from "@/utils/string.utils";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FileDownloadDoneRoundedIcon from "@mui/icons-material/FileDownloadDoneRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { Box, SelectChangeEvent, Typography, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import { useRouter } from "next/navigation";
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

const FiltersBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  alignItems: "center",
}));

const StudentManagementPage = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { students, loading } = useSelector(
    (state: RootState) => state.student,
  );
  const { classes } = useSelector((state: RootState) => state.class);

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [openStudentDeleteModal, setOpenStudentDeleteModal] = useState(false);
  const [openStudentQRModal, setOpenStudentQRModal] = useState(false);
  const [openStudentExportModal, setOpenStudentExportModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [csvData, setCsvData] = useState<ParsedStudent[]>([]);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Filter states
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
        setIsParsingCSV(true);
        try {
          const rows = (await parseCSVFile(file)) ?? [];
          setCsvData(rows as ParsedStudent[]);
        } finally {
          setIsParsingCSV(false);
        }
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

  const handleExportStudentModalOpen = useCallback(() => {
    setOpenStudentExportModal(true);
  }, []);

  const handleExportStudentModalClose = useCallback(() => {
    setOpenStudentExportModal(false);
  }, []);

  const handleAddStudents = useCallback(
    async (students: CreateStudentInput[]) => {
      setIsImporting(true);
      try {
        await dispatch(addStudents(students));
        handleAddStudentModalClose();
      } finally {
        setIsImporting(false);
      }
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

  // Filter handlers
  const handleClassFilter = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      setClassFilter(event.target.value as string);
    },
    [],
  );

  const handleStatusFilter = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      setStatusFilter(event.target.value as string);
    },
    [],
  );

  const getTableData = useCallback(() => {
    // Apply search filter first
    let filteredStudents = filterStudents(searchString, students);

    // Helper to extract class ID from currentClass (can be object, string, or null)
    const getClassId = (
      currentClass: { _id: string; name: string } | string | null | undefined,
    ): string | null | undefined => {
      if (!currentClass) return currentClass;
      if (typeof currentClass === "string") return currentClass;
      return currentClass._id;
    };

    // Apply class filter
    if (classFilter && classFilter !== "all") {
      filteredStudents = filteredStudents.filter((student: Student) => {
        const studentWithClass = student as Student & {
          currentClass?: { _id: string; name: string } | string | null;
        };
        const classId = getClassId(studentWithClass.currentClass);

        // Filter for unassigned students
        if (classFilter === "unassigned") {
          return !classId;
        }

        return classId === classFilter;
      });
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filteredStudents = filteredStudents.filter(
        (student: Student) => student.status === statusFilter,
      );
    }

    return filteredStudents.map((student: Student) => {
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
        verificationCode: student?.verificationCode ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmallIconButton
              icon={<ContentCopyRoundedIcon />}
              onAction={async (e) => {
                e.stopPropagation();
                await copyText(student.verificationCode!);
                successNotification(
                  t("settings.manageStudent.verificationCodeCopied"),
                );
              }}
              noMargin
            />
            <Typography variant="body2">{student.verificationCode}</Typography>
          </Box>
        ) : (
          "-"
        ),
        status: (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <StudentStatus studentStatus={student?.status} />
          </Box>
        ),
      };
    });
  }, [students, searchString, classes, classFilter, statusFilter, t]);

  const handleDeleteStudents = useCallback(() => {
    const ids = selectedItems.filter(
      (id) => students.findIndex((item: Student) => item._id === id) !== -1,
    );
    dispatch(deleteStudents(ids as string[]));
    setSelectedItems([]);
    setClearSelected(true);
    handleDeleteStudentModalClose();
  }, [dispatch, handleDeleteStudentModalClose, selectedItems, students]);

  const handleRowClick = useCallback(
    (id: string | number) => {
      router.push(`/admin/management/students/${id}/general`);
    },
    [router],
  );

  return (
    <Wrapper>
      <AddStudentModal
        open={openStudentAddModal}
        onClose={handleAddStudentModalClose}
        onUploadCSV={handleUploadCSV}
        csvData={csvData}
        onAddStudents={handleAddStudents}
        isParsingCSV={isParsingCSV}
        isImporting={isImporting}
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
      <ExportStudentDataModal
        open={openStudentExportModal}
        onClose={handleExportStudentModalClose}
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
          label={t("settings.manageStudent.exportStudentData")}
          onAction={handleExportStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={selectedItems.length === 0}
          startIcon={<FileDownloadRoundedIcon />}
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
        {students.length > 0 && (
          <FiltersBox>
            <Box sx={{ minWidth: 200 }}>
              <GeneralDropdown
                value={classFilter}
                onChange={handleClassFilter}
                label={t("settings.manageStudent.filterByClass")}
                size="small"
                options={[
                  { value: "all", label: t("general.All") },
                  {
                    value: "unassigned",
                    label: t("settings.manageStudent.notAssigned"),
                  },
                  ...classes.map((c) => ({ value: c._id, label: c.name })),
                ]}
              />
            </Box>

            <Box sx={{ minWidth: 200 }}>
              <GeneralDropdown
                value={statusFilter}
                onChange={handleStatusFilter}
                label={t("settings.manageStudent.filterByStatus")}
                size="small"
                options={[
                  { value: "all", label: t("general.All") },
                  {
                    value: "imported",
                    label: t("dashboard.status.imported"),
                    leftIcon: <FileDownloadDoneRoundedIcon />,
                  },
                  {
                    value: "invited",
                    label: t("dashboard.status.invited"),
                    leftIcon: <MailOutlineRoundedIcon />,
                  },
                  {
                    value: "onboarded",
                    label: t("dashboard.status.onboarded"),
                    leftIcon: <CheckCircleRoundedIcon />,
                  },
                ]}
              />
            </Box>
          </FiltersBox>
        )}

        <DataTable
          headers={manageTableHeaders(t)}
          data={getTableData()}
          loading={loading}
          setSelectedItems={setSelectedItems}
          clearSelected={clearSelected}
          setClearSelected={setClearSelected}
          onClickRowItem={handleRowClick}
        />
      </StyledTableBox>
    </Wrapper>
  );
};

export default StudentManagementPage;
