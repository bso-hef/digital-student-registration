"use client";

import React, { useEffect } from "react";

import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import DraggableChartGrid from "@/components/molecules/dashboard/DraggableChartGrid";
import DraggableStatsGrid from "@/components/molecules/dashboard/DraggableStatsGrid";
import {
  getDashboardActivity,
  getDashboardStats,
  loadDashboardLayout,
  refreshDashboard,
  resetDashboardLayout,
  setDashboardLayout,
  toggleDashboardLock,
} from "@/store/actions/dashboardActions";
import { AppDispatch, RootState } from "@/store/store";
import { DashboardLayout } from "@/types/dashboard";
import { applicationScrollbar } from "@/utils/styling.utils";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Box, CircularProgress, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  overflowY: "auto",
  color: theme.palette.text.default,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  overflow: "hidden",
  overflowY: "auto",
  padding: theme.spacing(3),
  flex: 1,
  minHeight: 0,
  ...applicationScrollbar(theme),
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
});

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { stats, loading, error, layout, recentActivity, activityLoading } =
    useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(loadDashboardLayout());
    dispatch(getDashboardStats());
    dispatch(getDashboardActivity());

    // Auto-refresh stats every 5 minutes
    const statsInterval = setInterval(() => {
      dispatch(getDashboardStats());
      dispatch(getDashboardActivity(true));
    }, 300000);

    return () => {
      clearInterval(statsInterval);
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(refreshDashboard());
  };

  const handleResetLayout = () => {
    dispatch(resetDashboardLayout());
  };

  const handleToggleLock = () => {
    dispatch(toggleDashboardLock());
  };

  const handleStatsReorder = (newOrder: string[]) => {
    const newLayout: DashboardLayout = {
      ...layout,
      quickStats: newOrder,
    };
    dispatch(setDashboardLayout(newLayout));
  };

  const handleChartsReorder = (newOrder: string[]) => {
    const newLayout: DashboardLayout = {
      ...layout,
      charts: newOrder,
    };
    dispatch(setDashboardLayout(newLayout));
  };

  if (loading && !stats) {
    return (
      <Wrapper>
        <AdminSettingsHeader title={t("dashboard.title")} />
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Wrapper>
    );
  }

  if (error && !stats) {
    return (
      <Wrapper>
        <AdminSettingsHeader title={t("dashboard.title")} />
        <ContentWrapper>
          <Box textAlign="center" py={4}>
            {t("dashboard.errors.loadFailed")}
          </Box>
        </ContentWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <AdminSettingsHeader title={t("dashboard.title")} onLoad={loading}>
        <SmallIconButton
          icon={<RestartAltRoundedIcon />}
          onAction={handleResetLayout}
          hugeIcon
          title={t("dashboard.resetLayout")}
          placement="bottom"
        />
        <SmallIconButton
          icon={layout.isLocked ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
          onAction={handleToggleLock}
          hugeIcon
          title={
            layout.isLocked
              ? t("dashboard.unlockLayout")
              : t("dashboard.lockLayout")
          }
          placement="bottom"
        />
        <SmallIconButton
          icon={<RefreshRoundedIcon />}
          onAction={handleRefresh}
          disabled={loading}
          hugeIcon
          title={t("dashboard.health.refresh")}
          placement="bottom"
          noMargin
        />
      </AdminSettingsHeader>

      <ContentWrapper>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Quick Stats Section - Draggable */}
          {stats?.quickStats && layout?.quickStats && (
            <DraggableStatsGrid
              stats={stats.quickStats}
              order={layout.quickStats}
              onReorder={handleStatsReorder}
              isLocked={layout.isLocked}
            />
          )}

          {/* Charts Section - Draggable */}
          {layout?.charts && (
            <DraggableChartGrid
              stats={stats}
              loading={loading}
              recentActivity={recentActivity}
              activityLoading={activityLoading}
              order={layout.charts}
              onReorder={handleChartsReorder}
              isLocked={layout.isLocked}
            />
          )}
        </Box>
      </ContentWrapper>
    </Wrapper>
  );
};

export default DashboardPage;
