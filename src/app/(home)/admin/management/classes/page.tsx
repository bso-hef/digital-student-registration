"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import ClassStatus from "@/components/atoms/status/ClassStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AddClassModal from "@/components/organisms/modals/AddClassModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import DataTable from "@/components/organisms/tables/DataTable";
import {
  addClass,
  clearCurrentClass,
  deleteClasses,
  getClasses,
  setCurrentClass,
} from "@/store/actions/classActions";
import { AppDispatch } from "@/store/store";
import { ClassCreateInput, ClassInterface } from "@/types/class";
import { filterClasses } from "@/utils/filter.utils";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Box, styled } from "@mui/material";
import { debounce, isString } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import { classTableHeaders } from "./manageTableConfig";

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

const ClassManagementPage = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { classes, loading } = useSelector((state: RootState) => state.class);

  useDocumentTitle("Class Management | Admin | DSR");

  const [openClassAddModal, setOpenClassAddModal] = useState(false);
  const [openClassDeleteModal, setOpenClassDeleteModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  useEffect(() => {
    dispatch(getClasses());

    return () => {
      dispatch(clearCurrentClass());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClassModalOpen = useCallback(() => {
    setOpenClassAddModal(true);
  }, []);

  const handleAddClassModalClose = useCallback(() => {
    setOpenClassAddModal(false);
  }, []);

  const handleDeleteClassModalOpen = useCallback(() => {
    setOpenClassDeleteModal(true);
  }, []);

  const handleDeleteClassModalClose = useCallback(() => {
    setOpenClassDeleteModal(false);
  }, []);

  const handleAddClass = useCallback(
    (classData: ClassCreateInput[]) => {
      dispatch(addClass(classData));
      handleAddClassModalClose();
    },
    [dispatch, handleAddClassModalClose],
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
    type YearLike = Date | string | null | undefined;

    const toYear = (v: YearLike): number | null => {
      if (!v) return null;
      const d = v instanceof Date ? v : new Date(v);
      const y = d.getFullYear();
      return Number.isFinite(y) ? y : null;
    };

    const getStudentsCount = (c: ClassInterface): number => {
      if (typeof c.studentCount === "number") return c.studentCount;
      const maybe = (c as unknown as { students?: unknown }).students;
      return Array.isArray(maybe) ? maybe.length : 0;
    };

    return filterClasses(searchString, classes).map((c: ClassInterface) => {
      const yFrom = toYear(c.schoolYearFrom as YearLike);
      const yTo = toYear(c.schoolYearTo as YearLike);
      const schoolYear =
        yFrom && yTo ? `${yFrom}/${yTo}` : t("general.Unknown");

      return {
        id: c._id,
        name: (
          <Link
            href={`/admin/management/classes/${c._id}/general`}
            onClick={() => dispatch(setCurrentClass(c._id))}
          >
            {c?.name}
          </Link>
        ),
        schoolYear: (
          <Link
            href={`/admin/management/classes/${c._id}/general`}
            onClick={() => dispatch(setCurrentClass(c._id))}
          >
            {schoolYear}
          </Link>
        ),
        grade: (
          <Link
            href={`/admin/management/classes/${c._id}/general`}
            onClick={() => dispatch(setCurrentClass(c._id))}
          >
            {typeof c.grade === "number" && Number.isFinite(c.grade)
              ? c.grade
              : "–"}
          </Link>
        ),
        studentCount: (
          <Link
            href={`/admin/management/classes/${c._id}/general`}
            onClick={() => dispatch(setCurrentClass(c._id))}
          >
            {getStudentsCount(c)}
          </Link>
        ),
        isVocational: c.isVocational ? t("general.Yes") : t("general.No"),
        status: <ClassStatus active={Boolean(c.active)} />,
      };
    });
  }, [classes, dispatch, searchString, t]);

  const handleDeleteClasses = useCallback(() => {
    const ids = selectedItems.filter(
      (id) =>
        classes.findIndex((item: ClassInterface) => item._id === id) !== -1,
    );
    dispatch(deleteClasses(ids as string[]));
    setSelectedItems([]);
    setClearSelected(true);
    handleDeleteClassModalClose();
  }, [dispatch, handleDeleteClassModalClose, selectedItems, classes]);

  return (
    <Wrapper>
      <AddClassModal
        open={openClassAddModal}
        onClose={handleAddClassModalClose}
        onAddClass={handleAddClass}
      />
      <ConfirmationModal
        open={openClassDeleteModal}
        onClose={handleDeleteClassModalClose}
        onConfirmation={handleDeleteClasses}
        title={`${t("settings.manageClass.deleteClasses")}?`}
        message={t("settings.manageClass.deleteClassRequest")}
      />
      <AdminSettingsHeader
        title={t("navigation.classManagement")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
        <GeneralButton
          label={t("settings.manageClass.deleteClasses")}
          onAction={handleDeleteClassModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={selectedItems.length === 0}
          startIcon={<DeleteOutlineRoundedIcon />}
        />
        <GeneralButton
          label={t("settings.manageClass.addClass")}
          onAction={handleAddClassModalOpen}
          fullHeight={false}
          fullWidth={false}
        />
      </AdminSettingsHeader>
      <StyledTableBox>
        <DataTable
          headers={classTableHeaders(t)}
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

export default ClassManagementPage;
