"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GenderDisplay from "@/components/atoms/GenderDisplay";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import StudentStatus from "@/components/atoms/status/StudentStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import AddStudentsToClassModal from "@/components/organisms/modals/AddStudentsToClassModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import DataTable from "@/components/organisms/tables/DataTable";
import {
  addStudentsToClass,
  getClassStudents,
  removeStudentsFromClass,
} from "@/store/actions/classActions";
import { AppDispatch } from "@/store/store";
import { Student } from "@/types/db";
import { formatGermanDate } from "@/utils/date.utils";
import { filterStudents } from "@/utils/filter.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Box, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import { manageTableHeaders } from "./studentsTableConfig";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  padding: theme.spacing(2),
}));

const StudentClassSettingsTab = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { classId } = useParams();

  const { currentClassStudents } = useSelector(
    (state: RootState) => state.class,
  );
  // Ensure we always have a properly typed Student[] to avoid `never[]` inference
  const students: Student[] = useMemo(() => {
    const studentsFromState = currentClassStudents?.students ?? [];
    return Array.isArray(studentsFromState)
      ? (studentsFromState as Student[])
      : [];
  }, [currentClassStudents?.students]);
  const loading = currentClassStudents?.loading ?? false;

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [openStudentRemoveModal, setOpenStudentRemoveModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  // Fetch students for this class on mount
  useEffect(() => {
    if (classId && typeof classId === "string") {
      dispatch(getClassStudents(classId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const handleAddStudentModalOpen = useCallback(() => {
    setOpenStudentAddModal(true);
  }, []);

  const handleAddStudentModalClose = useCallback(() => {
    setOpenStudentAddModal(false);
  }, []);

  const handleRemoveStudentModalOpen = useCallback(() => {
    setOpenStudentRemoveModal(true);
  }, []);

  const handleRemoveStudentModalClose = useCallback(() => {
    setOpenStudentRemoveModal(false);
  }, []);

  const handleAddStudents = useCallback(
    (studentIds: string[]) => {
      if (classId && typeof classId === "string") {
        dispatch(addStudentsToClass(classId, studentIds));
        setOpenStudentAddModal(false);
      }
    },
    [dispatch, classId],
  );

  const handleRemoveStudents = useCallback(() => {
    if (classId && typeof classId === "string") {
      const ids = selectedItems.filter(
        (id) => students.findIndex((item: Student) => item._id === id) !== -1,
      );
      dispatch(removeStudentsFromClass(classId, ids as string[]));
      setSelectedItems([]);
      setClearSelected(true);
      handleRemoveStudentModalClose();
    }
  }, [
    dispatch,
    classId,
    handleRemoveStudentModalClose,
    selectedItems,
    students,
  ]);

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
        dateOfBirth: formatGermanDate(student?.dateOfBirth) || "-",
        gender: <GenderDisplay gender={student?.gender} />,
        status: <StudentStatus studentStatus={student?.status} />,
      };
    });
  }, [students, searchString]);

  return (
    <Fragment>
      <AddStudentsToClassModal
        open={openStudentAddModal}
        onClose={handleAddStudentModalClose}
        onAddStudents={handleAddStudents}
        classId={classId as string}
      />
      <ConfirmationModal
        open={openStudentRemoveModal}
        onClose={handleRemoveStudentModalClose}
        onConfirmation={handleRemoveStudents}
        title={`${t("settings.manageClass.removeFromClass")}?`}
        message={t("settings.manageClass.removeFromClassConfirmation")}
      />
      <AdminSettingsHeader
        isSubHeader
        title={t("settings.manageClass.classSettings.students")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
        <GeneralButton
          label={t("settings.manageClass.removeFromClass")}
          onAction={handleRemoveStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={selectedItems.length === 0}
          startIcon={<DeleteOutlineRoundedIcon />}
        />
        <GeneralButton
          label={t("general.Add")}
          onAction={handleAddStudentModalOpen}
          fullHeight={false}
          fullWidth={false}
          startIcon={<AddRoundedIcon />}
        />
      </AdminSettingsHeader>
      <StyledBox>
        <DataTable
          headers={manageTableHeaders(t)}
          data={getTableData()}
          loading={loading}
          setSelectedItems={setSelectedItems}
          clearSelected={clearSelected}
          setClearSelected={setClearSelected}
        />
      </StyledBox>
    </Fragment>
  );
};

export default StudentClassSettingsTab;
