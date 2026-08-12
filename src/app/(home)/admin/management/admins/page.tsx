"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import adminService, {
  AdminAccount,
  AdminInput,
} from "@/lib/services/adminService";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  color: theme.palette.text.default,
}));

const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  ...applicationScrollbar(theme),
}));

const FormFields = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
}));

const emptyForm: AdminInput = {
  email: "",
  firstName: "",
  lastName: "",
  active: true,
  password: "",
};

const getError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) return error.response?.data?.error || fallback;
  return fallback;
};

export default function AdminManagementPage() {
  const { t, i18n } = useTranslation();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [form, setForm] = useState<AdminInput>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAll();
      setAdmins(response.data.data);
    } catch (error) {
      errorNotification(
        getError(error, t("settings.manageAdmins.errors.load")),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial API loading state is owned by this page
    void loadAdmins();
  }, [loadAdmins]);

  const filteredAdmins = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return admins;
    return admins.filter((admin) =>
      `${admin.firstName} ${admin.lastName} ${admin.email}`
        .toLowerCase()
        .includes(needle),
    );
  }, [admins, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setRecoveryCode(null);
    setFormOpen(true);
  };
  const openEdit = (admin: AdminAccount) => {
    setEditing(admin);
    setForm({
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      active: admin.active,
      password: "",
    });
    setRecoveryCode(null);
    setFormOpen(true);
  };
  const closeForm = () => {
    if (!saving) {
      setFormOpen(false);
      setRecoveryCode(null);
    }
  };

  const isValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    (editing
      ? !form.password ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)
      : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password || ""));

  const saveAdmin = async () => {
    if (!isValid) return;
    try {
      setSaving(true);
      if (editing) {
        await adminService.update(editing.id, form);
        successNotification(t("settings.manageAdmins.messages.updated"));
        setFormOpen(false);
      } else {
        const response = await adminService.create(form);
        setRecoveryCode(response.data.recoveryCode || null);
        successNotification(t("settings.manageAdmins.messages.created"));
      }
      await loadAdmins();
    } catch (error) {
      errorNotification(
        getError(error, t("settings.manageAdmins.errors.save")),
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.delete(deleteTarget.id);
      setDeleteTarget(null);
      successNotification(t("settings.manageAdmins.messages.deleted"));
      await loadAdmins();
    } catch (error) {
      errorNotification(
        getError(error, t("settings.manageAdmins.errors.delete")),
      );
    }
  };

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("navigation.adminManagement")}
        onSearch={setQuery}
      >
        <GeneralButton
          label={t("settings.manageAdmins.add")}
          onAction={openCreate}
          fullHeight={false}
          fullWidth={false}
          startIcon={<AddRoundedIcon />}
        />
      </AdminSettingsHeader>
      <Content>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <Table stickyHeader aria-label={t("navigation.adminManagement")}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("settings.manageAdmins.name")}</TableCell>
                  <TableCell>{t("settings.manageAdmins.email")}</TableCell>
                  <TableCell>{t("settings.manageAdmins.status")}</TableCell>
                  <TableCell>{t("settings.manageAdmins.lastLogin")}</TableCell>
                  <TableCell align="right">
                    {t("settings.manageAdmins.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>
                      {[admin.firstName, admin.lastName]
                        .filter(Boolean)
                        .join(" ") || "–"}
                      {admin.isCurrentUser && (
                        <Chip
                          size="small"
                          label={t("settings.manageAdmins.you")}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={admin.active ? "success" : "default"}
                        label={t(
                          admin.active
                            ? "settings.manageAdmins.active"
                            : "settings.manageAdmins.inactive",
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {admin.lastLogin
                        ? new Intl.DateTimeFormat(i18n.language, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(admin.lastLogin))
                        : t("settings.manageAdmins.never")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t("settings.manageAdmins.edit")}>
                        <IconButton
                          onClick={() => openEdit(admin)}
                          aria-label={t("settings.manageAdmins.edit")}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          admin.isCurrentUser
                            ? t("settings.manageAdmins.cannotDeleteSelf")
                            : t("settings.manageAdmins.delete")
                        }
                      >
                        <span>
                          <IconButton
                            disabled={admin.isCurrentUser}
                            onClick={() => setDeleteTarget(admin)}
                            aria-label={t("settings.manageAdmins.delete")}
                          >
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography sx={{ py: 4 }} color="text.secondary">
                        {t("settings.manageAdmins.empty")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Content>

      <GeneralModal
        open={formOpen}
        onCloseModal={closeForm}
        customTitle={
          editing
            ? t("settings.manageAdmins.editTitle")
            : t("settings.manageAdmins.addTitle")
        }
        subtitle={
          recoveryCode
            ? t("settings.manageAdmins.recoverySubtitle")
            : t("settings.manageAdmins.formSubtitle")
        }
        disableBackdropClick={saving}
        contentChildren={
          recoveryCode ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              <Typography sx={{ mb: 1 }}>
                {t("settings.manageAdmins.recoveryWarning")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  component="code"
                  sx={{ fontWeight: 700, letterSpacing: 1 }}
                >
                  {recoveryCode}
                </Typography>
                <Tooltip title={t("settings.manageAdmins.copy")}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      void navigator.clipboard.writeText(recoveryCode)
                    }
                  >
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Alert>
          ) : (
            <FormFields>
              <TextField
                label={t("settings.manageAdmins.firstName")}
                value={form.firstName}
                onChange={(event) =>
                  setForm({ ...form, firstName: event.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                label={t("settings.manageAdmins.lastName")}
                value={form.lastName}
                onChange={(event) =>
                  setForm({ ...form, lastName: event.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                required
                type="email"
                label={t("settings.manageAdmins.email")}
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                sx={{ gridColumn: "1 / -1" }}
              />
              <TextField
                required={!editing}
                type="password"
                autoComplete="new-password"
                label={
                  editing
                    ? t("settings.manageAdmins.newPassword")
                    : t("settings.manageAdmins.password")
                }
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                helperText={t(
                  editing
                    ? "settings.manageAdmins.passwordOptional"
                    : "settings.manageAdmins.passwordHelp",
                )}
                sx={{ gridColumn: "1 / -1" }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    disabled={editing?.isCurrentUser}
                    onChange={(event) =>
                      setForm({ ...form, active: event.target.checked })
                    }
                  />
                }
                label={t("settings.manageAdmins.activeAccount")}
                sx={{ gridColumn: "1 / -1" }}
              />
            </FormFields>
          )
        }
        actionsChildren={
          recoveryCode ? (
            <Button variant="contained" onClick={closeForm}>
              {t("general.Close")}
            </Button>
          ) : (
            <>
              <Button onClick={closeForm} disabled={saving}>
                {t("general.Cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={() => void saveAdmin()}
                disabled={!isValid || saving}
              >
                {saving ? <CircularProgress size={20} /> : t("general.Save")}
              </Button>
            </>
          )
        }
      />

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirmation={() => void deleteAdmin()}
        title={t("settings.manageAdmins.deleteTitle")}
        message={t("settings.manageAdmins.deleteConfirm", {
          email: deleteTarget?.email,
        })}
      />
    </Wrapper>
  );
}
