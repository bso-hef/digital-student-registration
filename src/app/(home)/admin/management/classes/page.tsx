"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import ClassStatus from "@/components/atoms/status/ClassStatus";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import AddClassModal from "@/components/organisms/modals/AddClassModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import TeacherQuickManageModal from "@/components/organisms/modals/TeacherQuickManageModal";
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
import {
  ParsedClass,
  buildClassDataCsv,
  downloadBlob,
  parseClassCSVFile,
} from "@/utils/classCSV.utils";
import { filterClasses } from "@/utils/filter.utils";
import { successNotification } from "@/utils/notification.utils";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
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

  const [openClassAddModal, setOpenClassAddModal] = useState(false);
  const [openClassDeleteModal, setOpenClassDeleteModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  // CSV Import state
  const [csvData, setCsvData] = useState<ParsedClass[]>([]);
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Quick manage modal state
  const [openQuickManageModal, setOpenQuickManageModal] = useState(false);

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
    setCsvData([]);
    setIsParsingCSV(false);
    setIsImporting(false);
  }, []);

  const handleDeleteClassModalOpen = useCallback(() => {
    setOpenClassDeleteModal(true);
  }, []);

  const handleDeleteClassModalClose = useCallback(() => {
    setOpenClassDeleteModal(false);
  }, []);

  const handleAddClass = useCallback(
    (classData: ClassCreateInput[]) => {
      setIsImporting(true);
      dispatch(addClass(classData));
      setTimeout(() => {
        handleAddClassModalClose();
      }, 500);
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

  // CSV Import handler - opens file picker
  const handleUploadCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsParsingCSV(true);
        // Open modal if not already open
        if (!openClassAddModal) {
          setOpenClassAddModal(true);
        }
        try {
          const rows = await parseClassCSVFile(file);
          if (rows && rows.length > 0) {
            setCsvData(rows);
          }
        } finally {
          setIsParsingCSV(false);
        }
      }
    };
    input.click();
  }, [openClassAddModal]);

  // Direct export - no modal
  const handleExport = useCallback(() => {
    const classesToExport =
      selectedItems.length > 0
        ? classes.filter((c: ClassInterface) =>
            selectedItems.includes(c._id as string | number),
          )
        : classes;

    const csvBlob = buildClassDataCsv(classesToExport);
    const filename = `classes_export_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(csvBlob, filename);

    successNotification(t("settings.manageClass.exportSuccess"));
  }, [classes, selectedItems, t]);

  // Quick manage handlers
  const handleQuickManageModalOpen = useCallback(() => {
    setOpenQuickManageModal(true);
  }, []);

  const handleQuickManageModalClose = useCallback(() => {
    setOpenQuickManageModal(false);
  }, []);

  const handleQuickManageAddClass = useCallback(
    (classData: ClassCreateInput[]) => {
      dispatch(addClass(classData));
    },
    [dispatch],
  );

  const handleQuickManageDeleteClass = useCallback(
    (ids: string[]) => {
      dispatch(deleteClasses(ids));
    },
    [dispatch],
  );

  return (
    <Wrapper>
      <AddClassModal
        open={openClassAddModal}
        onClose={handleAddClassModalClose}
        onAddClass={handleAddClass}
        onUploadCSV={handleUploadCSV}
        csvData={csvData}
        isParsingCSV={isParsingCSV}
        isImporting={isImporting}
      />
      <ConfirmationModal
        open={openClassDeleteModal}
        onClose={handleDeleteClassModalClose}
        onConfirmation={handleDeleteClasses}
        title={`${t("settings.manageClass.deleteClasses")}?`}
        message={t("settings.manageClass.deleteClassRequest")}
      />
      <TeacherQuickManageModal
        open={openQuickManageModal}
        onClose={handleQuickManageModalClose}
        classes={classes}
        onAddClass={handleQuickManageAddClass}
        onDeleteClass={handleQuickManageDeleteClass}
      />
      <AdminSettingsHeader
        title={t("navigation.classManagement")}
        onSearch={(value: string) => {
          handleSearchString(value);
        }}
      >
        <GeneralButton
          label={t("settings.manageClass.exportCSV")}
          onAction={handleExport}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          startIcon={<FileDownloadRoundedIcon />}
        />
        <GeneralButton
          label={t("settings.manageClass.quickManage")}
          onAction={handleQuickManageModalOpen}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          startIcon={<TuneRoundedIcon />}
        />
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
          label={t("settings.manageClass.importClasses")}
          onAction={handleAddClassModalOpen}
          fullHeight={false}
          fullWidth={false}
          startIcon={<UploadFileRoundedIcon />}
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
