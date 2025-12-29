import React from "react";

import ChartContainer from "@/components/molecules/dashboard/ChartContainer";
import { RegistrationTrendItem } from "@/types/dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslation } from "react-i18next";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface RegistrationTrendChartProps {
  data: RegistrationTrendItem[];
  loading?: boolean;
  isLocked?: boolean;
}

const RegistrationTrendChart: React.FC<RegistrationTrendChartProps> = ({
  data,
  loading = false,
  isLocked = false,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const xLabels = data.map((item) => formatDate(item.date));
  const yValues = data.map((item) => item.count);

  // Check if data is empty
  const isEmpty = data.length === 0;

  return (
    <ChartContainer
      title={t("dashboard.charts.registrationTrend")}
      loading={loading}
      height={300}
      isLocked={isLocked}
    >
      {isEmpty ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <ShowChartIcon
            sx={{
              fontSize: 64,
              color: "text.secondary",
              opacity: 0.3,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            {t("dashboard.charts.noData")}
          </Typography>
        </Box>
      ) : (
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
            },
          ]}
          series={[
            {
              data: yValues,
              label: t("dashboard.quickStats.totalStudents"),
              color: DASHBOARD_GRADIENTS.CHART_LINE,
              curve: "linear",
              showMark: true,
            },
          ]}
          margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
        />
      )}
    </ChartContainer>
  );
};

export default RegistrationTrendChart;
