"use client";

import React, { useCallback, useEffect, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralDropdown from "@/components/atoms/dropdowns/GeneralDropdown";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import DataTable from "@/components/organisms/tables/DataTable";
import {
  clearAuditLogs,
  deleteSelectedAuditLogs,
  exportAuditLogs,
  getAuditLogs,
  setAuditLogFilters,
} from "@/store/actions/auditLogActions";
import { AppDispatch, RootState } from "@/store/store";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Box, SelectChangeEvent, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { auditTableHeaders, formatAuditTableData } from "./auditTableConfig";

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

const DetailsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  fontFamily: "Inter, sans-serif",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  maxHeight: "60vh",
  overflow: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
}));

const AdminSettingsAuditPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { logs, loading, filters } = useSelector(
    (state: RootState) => state.auditLog,
  );

  const [selectedLog, setSelectedLog] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [clearSelected, setClearSelected] = useState(false);

  useEffect(() => {
    dispatch(getAuditLogs());
    // Set up polling for realtime updates every 30 seconds
    const pollInterval = setInterval(() => {
      dispatch(getAuditLogs());
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [dispatch]);

  const handleCategoryFilter = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      const value = event.target.value as string;
      dispatch(
        setAuditLogFilters({
          ...filters,
          category: value === "all" ? undefined : value,
        }),
      );
    },
    [dispatch, filters],
  );

  const handleStatusFilter = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      const value = event.target.value as string;
      dispatch(
        setAuditLogFilters({
          ...filters,
          status: value === "all" ? undefined : value,
        }),
      );
    },
    [dispatch, filters],
  );

  const handleExport = useCallback(
    (format: "csv" | "json") => {
      // If items are selected, add them to filters
      const exportFilters =
        selectedItems.length > 0
          ? { ...filters, ids: selectedItems.join(",") }
          : filters;
      dispatch(exportAuditLogs(format, exportFilters));
    },
    [dispatch, filters, selectedItems],
  );

  const handleClearLogs = useCallback(() => {
    dispatch(clearAuditLogs());
    setShowClearModal(false);
  }, [dispatch]);

  const handleDeleteSelected = useCallback(() => {
    const ids = selectedItems.filter((id) =>
      logs.find((log) => log._id === id),
    );
    dispatch(deleteSelectedAuditLogs(ids as string[]));
    setSelectedItems([]);
    setClearSelected(true);
    setShowDeleteModal(false);
  }, [dispatch, logs, selectedItems]);

  const handleRowClick = useCallback(
    (id: string | number) => {
      const log = logs.find((l) => l._id === id);
      if (log) {
        setSelectedLog(log as unknown as Record<string, unknown>);
        setShowDetailsModal(true);
      }
    },
    [logs],
  );

  const hasSelection = selectedItems.length > 0;
  const hasData = logs.length > 0;

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("navigation.auditLog")}
        onSearch={(value: string) => {
          dispatch(setAuditLogFilters({ ...filters, search: value }));
        }}
      >
        {hasSelection ? (
          <GeneralButton
            label={t("audit.deleteSelected")}
            onAction={() => setShowDeleteModal(true)}
            fullHeight={false}
            fullWidth={false}
            isPrimary={false}
            startIcon={<DeleteOutlineRoundedIcon />}
          />
        ) : (
          <GeneralButton
            label={t("audit.clearLogs")}
            onAction={() => setShowClearModal(true)}
            fullHeight={false}
            fullWidth={false}
            isPrimary={false}
            disabled={!hasData}
            startIcon={<DeleteSweepRoundedIcon />}
          />
        )}
        <GeneralButton
          label={hasSelection ? t("audit.exportSelected") : t("audit.export")}
          onAction={() => handleExport("csv")}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
          disabled={!hasData}
          startIcon={<DownloadRoundedIcon />}
        />
      </AdminSettingsHeader>

      <StyledTableBox>
        <FiltersBox>
          <Box sx={{ minWidth: 200 }}>
            <GeneralDropdown
              value={filters.category || "all"}
              onChange={handleCategoryFilter}
              label={t("audit.filterByCategory")}
              size="small"
              options={[
                { value: "all", label: t("general.All") },
                { value: "student", label: t("audit.category.student") },
                { value: "class", label: t("audit.category.class") },
                { value: "settings", label: t("audit.category.settings") },
                { value: "auth", label: t("audit.category.auth") },
                { value: "system", label: t("audit.category.system") },
              ]}
            />
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <GeneralDropdown
              value={filters.status || "all"}
              onChange={handleStatusFilter}
              label={t("audit.filterByStatus")}
              size="small"
              options={[
                { value: "all", label: t("general.All") },
                { value: "success", label: t("audit.status.success") },
                { value: "failure", label: t("audit.status.failure") },
                { value: "partial", label: t("audit.status.partial") },
              ]}
            />
          </Box>
        </FiltersBox>

        <DataTable
          headers={auditTableHeaders(t)}
          data={formatAuditTableData(logs, t)}
          loading={loading}
          onClickRowItem={handleRowClick}
          dataSelection={true}
          setSelectedItems={setSelectedItems}
          clearSelected={clearSelected}
          setClearSelected={setClearSelected}
        />
      </StyledTableBox>

      {/* Details Modal */}
      <GeneralModal
        open={showDetailsModal}
        onCloseModal={() => setShowDetailsModal(false)}
        customTitle={t("audit.logDetails")}
        modalWidth={900}
        contentChildren={
          selectedLog && (
            <DetailsContainer>
              {JSON.stringify(selectedLog, null, 2)}
            </DetailsContainer>
          )
        }
        actionsChildren={
          <GeneralButton
            label={t("general.Close")}
            onAction={() => setShowDetailsModal(false)}
          />
        }
      />

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        open={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirmation={handleClearLogs}
        title={t("audit.clearLogsConfirm")}
        message={t("audit.clearLogsWarning")}
      />

      {/* Delete Selected Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirmation={handleDeleteSelected}
        title={t("audit.deleteSelectedConfirm")}
        message={t("audit.deleteSelectedWarning")}
      />
    </Wrapper>
  );
};

export default AdminSettingsAuditPage;
