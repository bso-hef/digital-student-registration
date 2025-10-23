"use client";

import React, { Fragment, useCallback, useMemo, useState } from "react";

import GenderDisplay from "@/components/atoms/GenderDisplay";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import StudentStatus from "@/components/atoms/status/StudentStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import DataTable from "@/components/organisms/tables/DataTable";
import { Student } from "@/types/db";
import { filterStudents } from "@/utils/filter.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import { manageTableHeaders } from "./studentsTableConfig";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overflowX: "hidden",
  flex: 1,
  padding: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

const StudentClassSettingsTab = () => {
  const { t } = useTranslation();
  const { students, loading } = useSelector(
    (state: RootState) => state.student,
  );

  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  const handleAddStudentModalOpen = useCallback(() => {
    setOpenStudentAddModal(true);
  }, []);

  const handleAddStudentModalClose = useCallback(() => {
    setOpenStudentAddModal(false);
  }, []);

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
      const dateOfBirth =
        student?.dateOfBirth &&
        new Date(student.dateOfBirth).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

      return {
        id: student?._id,
        firstName: student?.firstName,
        lastName: student?.lastName,
        dateOfBirth: dateOfBirth || "-",
        gender: <GenderDisplay gender={student?.gender} />,
        class: student?.class,
        status: <StudentStatus studentStatus={student?.status} />,
      };
    });
  }, [students, searchString]);

  return (
    <Fragment>
      <AdminSettingsHeader
        isSubHeader
        title={t("settings.manageClass.classSettings.students")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
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
