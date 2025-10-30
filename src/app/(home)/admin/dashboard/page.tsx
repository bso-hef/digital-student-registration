"use client";

import React, { useEffect } from "react";

import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import DraggableChartGrid from "@/components/molecules/dashboard/DraggableChartGrid";
import DraggableStatsGrid from "@/components/molecules/dashboard/DraggableStatsGrid";
import {
  getDashboardHealth,
  getDashboardStats,
  loadDashboardLayout,
  refreshDashboard,
  resetDashboardLayout,
  setDashboardLayout,
} from "@/store/actions/dashboardActions";
import { AppDispatch, RootState } from "@/store/store";
import { DashboardLayout } from "@/types/dashboard";
import { applicationScrollbar } from "@/utils/styling.utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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

  const { stats, health, loading, error, layout } = useSelector(
    (state: RootState) => state.dashboard,
  );

  useEffect(() => {
    dispatch(loadDashboardLayout());
    dispatch(getDashboardStats());
    dispatch(getDashboardHealth());

    // Auto-refresh health data every 30 seconds
    const healthInterval = setInterval(() => {
      dispatch(getDashboardHealth(true)); // silent refresh
    }, 30000);

    // Auto-refresh stats every 5 minutes
    const statsInterval = setInterval(() => {
      dispatch(getDashboardStats());
    }, 300000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(statsInterval);
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(refreshDashboard());
  };

  const handleResetLayout = () => {
    dispatch(resetDashboardLayout());
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
          icon={<RestartAltIcon />}
          onAction={handleResetLayout}
          hugeIcon
          title={t("dashboard.resetLayout")}
          placement="bottom"
        />
        <SmallIconButton
          icon={<RefreshIcon />}
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
            />
          )}

          {/* Charts Section - Draggable */}
          {layout?.charts && (
            <DraggableChartGrid
              stats={stats}
              health={health}
              loading={loading}
              order={layout.charts}
              onReorder={handleChartsReorder}
            />
          )}
        </Box>
      </ContentWrapper>
    </Wrapper>
  );
};

export default DashboardPage;
