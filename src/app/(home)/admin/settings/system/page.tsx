"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import HealthIndicator from "@/components/atoms/dashboard/HealthIndicator";
import MetricLabel from "@/components/atoms/dashboard/MetricLabel";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import { getDashboardHealth } from "@/store/actions/dashboardActions";
import { getSettings, updateSettings } from "@/store/actions/settingsActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { WlanSettings } from "@/types/settings";
import { applicationScrollbar } from "@/utils/styling.utils";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  color: theme.palette.text.default,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  padding: theme.spacing(3),
  overflowY: "auto",
  ...applicationScrollbar(theme),
}));

const MetricsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

const MetricCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.surface.interface.backElevation,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.border.seperator}`,
}));

const formatUptime = (seconds: number, t: (key: string) => string): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) {
    const dayLabel =
      days === 1
        ? t("dashboard.health.uptimeDay")
        : t("dashboard.health.uptimeDays");
    parts.push(`${days} ${dayLabel}`);
  }
  if (hours > 0) {
    const hourLabel =
      hours === 1
        ? t("dashboard.health.uptimeHour")
        : t("dashboard.health.uptimeHours");
    parts.push(`${hours} ${hourLabel}`);
  }
  if (minutes > 0 || parts.length === 0) {
    const minuteLabel =
      minutes === 1
        ? t("dashboard.health.uptimeMinute")
        : t("dashboard.health.uptimeMinutes");
    parts.push(`${minutes} ${minuteLabel}`);
  }

  return parts.join(", ");
};

const formatPlatform = (platform: string): string => {
  const platformMap: Record<string, string> = {
    darwin: "macOS",
    linux: "Linux",
    win32: "Windows",
  };
  return (
    platformMap[platform] ||
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
};

const defaultWlanSettings: WlanSettings = {
  enabled: false,
  ssid: "",
  password: "",
  securityType: "WPA2",
  hidden: false,
};

const AdminSystemPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { health, loading } = useAppSelector((state) => state.dashboard);
  const appSettings = useAppSelector((state) => state.appSettings.data);

  const [showPassword, setShowPassword] = useState(false);
  const [localWlanSettings, setLocalWlanSettings] =
    useState<WlanSettings>(defaultWlanSettings);
  const [expandedSections, setExpandedSections] = useState({
    mobileBlocker: true,
    wlan: true,
    overallStatus: true,
    systemMetrics: true,
    serverInfo: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const savedWlanSettings = appSettings?.system?.wlan;

  // Sync local state when settings are loaded from server
  useEffect(() => {
    if (savedWlanSettings) {
      setLocalWlanSettings(savedWlanSettings);
    }
  }, [savedWlanSettings]);

  // Check if WLAN settings have been modified
  const isWlanDirty = useMemo(() => {
    if (!savedWlanSettings) {
      // If no saved settings, check if local differs from defaults
      return (
        localWlanSettings.enabled !== defaultWlanSettings.enabled ||
        localWlanSettings.ssid !== defaultWlanSettings.ssid ||
        localWlanSettings.password !== defaultWlanSettings.password ||
        localWlanSettings.securityType !== defaultWlanSettings.securityType ||
        localWlanSettings.hidden !== defaultWlanSettings.hidden
      );
    }
    return (
      localWlanSettings.enabled !== savedWlanSettings.enabled ||
      localWlanSettings.ssid !== savedWlanSettings.ssid ||
      localWlanSettings.password !== savedWlanSettings.password ||
      localWlanSettings.securityType !== savedWlanSettings.securityType ||
      localWlanSettings.hidden !== savedWlanSettings.hidden
    );
  }, [localWlanSettings, savedWlanSettings]);

  const fetchHealth = useCallback(() => {
    dispatch(getDashboardHealth());
  }, [dispatch]);

  useEffect(() => {
    fetchHealth();
    dispatch(getSettings());

    // Auto-refresh health every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth, dispatch]);

  const handleMobileBlockerToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.checked;
    dispatch(
      updateSettings({
        system: {
          mobileBlockerEnabled: newValue,
          wlan: savedWlanSettings,
        },
      }),
    );
  };

  const handleWlanChange = (field: keyof WlanSettings, value: unknown) => {
    setLocalWlanSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveWlan = () => {
    dispatch(
      updateSettings({
        system: {
          mobileBlockerEnabled:
            appSettings?.system?.mobileBlockerEnabled ?? true,
          wlan: localWlanSettings,
        },
      }),
    );
  };

  return (
    <Wrapper>
      <AdminSettingsHeader title={t("navigation.systemSettings")}>
        <SmallIconButton
          icon={
            loading ? <CircularProgress size={20} /> : <RefreshRoundedIcon />
          }
          onAction={fetchHealth}
          title={t("dashboard.actions.refresh")}
          placement="bottom"
          hugeIcon
          disabled={loading}
          noMargin
        />
      </AdminSettingsHeader>

      <ContentWrapper>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Mobile Blocker Settings */}
          <EnhancedCollapse
            title={t("settings.system.mobileBlocker")}
            subtitle={t("settings.system.mobileBlockerDescription")}
            expanded={expandedSections.mobileBlocker}
            onAction={() => toggleSection("mobileBlocker")}
          >
            <Box display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={
                  <Switch
                    checked={appSettings?.system?.mobileBlockerEnabled ?? true}
                    onChange={handleMobileBlockerToggle}
                    color="primary"
                  />
                }
                label={
                  appSettings?.system?.mobileBlockerEnabled
                    ? t("settings.system.mobileBlockerEnabled")
                    : t("settings.system.mobileBlockerDisabled")
                }
                sx={{ ml: 0 }}
              />
            </Box>
          </EnhancedCollapse>

          {/* WLAN Configuration */}
          <EnhancedCollapse
            title={t("settings.system.wlan.title")}
            subtitle={t("settings.system.wlan.description")}
            expanded={expandedSections.wlan}
            onAction={() => toggleSection("wlan")}
            headerAction={
              <GeneralButton
                label={t("general.Save")}
                isPrimary={false}
                disabled={!isWlanDirty}
                onAction={handleSaveWlan}
              />
            }
          >
            <Box display="flex" justifyContent="flex-start" sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localWlanSettings.enabled}
                    onChange={(e) =>
                      handleWlanChange("enabled", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={t("settings.system.wlan.enabled")}
                sx={{ ml: 0 }}
              />
            </Box>

            {localWlanSettings.enabled && (
              <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
                <TextField
                  label={t("settings.system.wlan.ssid")}
                  value={localWlanSettings.ssid}
                  onChange={(e) => handleWlanChange("ssid", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder={t("settings.system.wlan.ssidPlaceholder")}
                />

                <TextField
                  label={t("settings.system.wlan.password")}
                  type={showPassword ? "text" : "password"}
                  value={localWlanSettings.password}
                  onChange={(e) => handleWlanChange("password", e.target.value)}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOffRoundedIcon />
                            ) : (
                              <VisibilityRoundedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <FormControl fullWidth size="small">
                  <InputLabel>
                    {t("settings.system.wlan.securityType")}
                  </InputLabel>
                  <Select
                    value={localWlanSettings.securityType}
                    label={t("settings.system.wlan.securityType")}
                    onChange={(e) =>
                      handleWlanChange("securityType", e.target.value)
                    }
                  >
                    <MenuItem value="WPA">WPA</MenuItem>
                    <MenuItem value="WPA2">WPA2</MenuItem>
                    <MenuItem value="WPA3">WPA3</MenuItem>
                    <MenuItem value="WEP">WEP</MenuItem>
                    <MenuItem value="nopass">
                      {t("settings.system.wlan.noPassword")}
                    </MenuItem>
                  </Select>
                </FormControl>

                <Box display="flex" justifyContent="flex-start">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localWlanSettings.hidden}
                        onChange={(e) =>
                          handleWlanChange("hidden", e.target.checked)
                        }
                        color="primary"
                        size="small"
                      />
                    }
                    label={t("settings.system.wlan.hidden")}
                    sx={{ ml: 0 }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    p: 1.5,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  {t("settings.system.wlan.securityWarning")}
                </Typography>
              </Box>
            )}
          </EnhancedCollapse>

          {/* Overall Status */}
          <EnhancedCollapse
            title={t("dashboard.health.overallStatus")}
            subtitle={
              health?.status === "up"
                ? t("dashboard.health.systemOperational")
                : t("dashboard.health.systemDown")
            }
            expanded={expandedSections.overallStatus}
            onAction={() => toggleSection("overallStatus")}
            headerAction={
              health && (
                <HealthIndicator
                  status={health.status}
                  label={t(`dashboard.health.${health.status}`)}
                />
              )
            }
          >
            {/* Database Status */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <StorageRoundedIcon fontSize="small" color="action" />
                <Typography variant="body2">MongoDB</Typography>
              </Box>
              {health && (
                <HealthIndicator status={health.checks.mongo.status} />
              )}
            </Box>
            {health?.checks.mongo.error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, fontSize: "0.875rem" }}
              >
                {health.checks.mongo.error}
              </Typography>
            )}

            {/* Redis Status */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1,
                mt: 1,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <StorageRoundedIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {t("dashboard.health.redis")}
                </Typography>
              </Box>
              {health && (
                <HealthIndicator
                  status={health.checks.redis?.status || "down"}
                />
              )}
            </Box>
            {health?.checks.redis?.error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, fontSize: "0.875rem" }}
              >
                {health.checks.redis.error}
              </Typography>
            )}
          </EnhancedCollapse>

          {/* System Metrics */}
          <EnhancedCollapse
            title={t("dashboard.health.systemMetrics")}
            expanded={expandedSections.systemMetrics}
            onAction={() => toggleSection("systemMetrics")}
          >
            <MetricsGrid>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.uptime")}
                  value={health ? formatUptime(health.meta.uptimeSec, t) : "-"}
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.cpu")}
                  value={
                    health
                      ? `${health.meta.system.cpus} ${t("dashboard.health.cores")}`
                      : "-"
                  }
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.memoryFree")}
                  value={health?.meta.system.freemem || "-"}
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.memoryTotal")}
                  value={health?.meta.system.totalmem || "-"}
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.nodeVersion")}
                  value={health?.meta.node || "-"}
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.platform")}
                  value={
                    health ? formatPlatform(health.meta.system.platform) : "-"
                  }
                />
              </MetricCard>
            </MetricsGrid>
          </EnhancedCollapse>

          {/* Server Info */}
          <EnhancedCollapse
            title={t("dashboard.health.serverInfo")}
            expanded={expandedSections.serverInfo}
            onAction={() => toggleSection("serverInfo")}
          >
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {t("dashboard.health.service")}
                </Typography>
                <Typography variant="body2">
                  {health?.meta.service || "-"}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {t("dashboard.health.version")}
                </Typography>
                <Typography variant="body2">
                  {health?.meta.version || "-"}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {t("dashboard.health.hostname")}
                </Typography>
                <Typography variant="body2">
                  {health?.meta.system.hostname || "-"}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {t("dashboard.health.architecture")}
                </Typography>
                <Typography variant="body2">
                  {health?.meta.system.arch || "-"}
                </Typography>
              </Box>
            </Box>
          </EnhancedCollapse>
        </Box>
      </ContentWrapper>
    </Wrapper>
  );
};

export default AdminSystemPage;
