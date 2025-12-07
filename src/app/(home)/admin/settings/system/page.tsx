"use client";

import React, { useCallback, useEffect } from "react";

import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import HealthIndicator from "@/components/atoms/dashboard/HealthIndicator";
import MetricLabel from "@/components/atoms/dashboard/MetricLabel";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { getDashboardHealth } from "@/store/actions/dashboardActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
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
  color: theme.palette.text.default,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(3),
}));

const StatusCard = styled(Card)(({ theme }) => ({
  background: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(2),
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 12px",
  marginBottom: theme.spacing(3),
}));

const StatusCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
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

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const AdminSystemPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { health, loading } = useAppSelector((state) => state.dashboard);

  const fetchHealth = useCallback(() => {
    dispatch(getDashboardHealth());
  }, [dispatch]);

  useEffect(() => {
    fetchHealth();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return (
    <Wrapper>
      <AdminSettingsHeader title={t("navigation.systemSettings")}>
        <SmallIconButton
          icon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onAction={fetchHealth}
          title={t("dashboard.actions.refresh")}
          placement="bottom"
          hugeIcon
          disabled={loading}
          noMargin
        />
      </AdminSettingsHeader>

      <ContentWrapper>
        {/* Overall Status */}
        <StatusCard>
          <StatusCardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <SectionTitle sx={{ mb: 0 }}>
                {t("dashboard.health.overallStatus")}
              </SectionTitle>
              {health && (
                <HealthIndicator
                  status={health.status}
                  label={t(`dashboard.health.${health.status}`)}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {health?.status === "up"
                ? t("dashboard.health.systemOperational")
                : t("dashboard.health.systemDown")}
            </Typography>
          </StatusCardContent>
        </StatusCard>

        {/* Database Status */}
        <StatusCard>
          <StatusCardContent>
            <SectionTitle>{t("dashboard.health.databaseStatus")}</SectionTitle>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">MongoDB</Typography>
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
          </StatusCardContent>
        </StatusCard>

        {/* System Metrics */}
        <StatusCard>
          <StatusCardContent>
            <SectionTitle>{t("dashboard.health.systemMetrics")}</SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.uptime")}
                  value={health ? formatUptime(health.meta.uptimeSec) : "-"}
                />
              </MetricCard>
              <MetricCard>
                <MetricLabel
                  label={t("dashboard.health.cpu")}
                  value={health ? `${health.meta.system.cpus} cores` : "-"}
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
                  value={health?.meta.system.platform || "-"}
                />
              </MetricCard>
            </MetricsGrid>
          </StatusCardContent>
        </StatusCard>

        {/* Server Info */}
        <StatusCard>
          <StatusCardContent>
            <SectionTitle>{t("dashboard.health.serverInfo")}</SectionTitle>
            <Divider sx={{ mb: 2 }} />
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
          </StatusCardContent>
        </StatusCard>
      </ContentWrapper>
    </Wrapper>
  );
};

export default AdminSystemPage;
