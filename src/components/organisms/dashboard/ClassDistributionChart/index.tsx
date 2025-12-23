import React from "react";

import ChartContainer from "@/components/molecules/dashboard/ChartContainer";
import { GradeDistribution } from "@/types/dashboard";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface ClassDistributionChartProps {
  data: GradeDistribution[];
  loading?: boolean;
  isLocked?: boolean;
}

const ClassDistributionChart: React.FC<ClassDistributionChartProps> = ({
  data,
  loading = false,
  isLocked = false,
}) => {
  const { t } = useTranslation();

  const xLabels = data.map((item) =>
    item.grade !== null
      ? t("dashboard.charts.gradeLabel", { grade: item.grade })
      : t("dashboard.charts.noGrade"),
  );
  const yValues = data.map((item) => item.count);

  // Check if data is empty
  const isEmpty = data.length === 0;

  return (
    <ChartContainer
      title={t("dashboard.charts.classDistribution")}
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
          <BarChartIcon
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
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: xLabels,
            },
          ]}
          series={[
            {
              data: yValues,
              label: t("dashboard.quickStats.totalClasses"),
              color: DASHBOARD_GRADIENTS.CHART_BAR,
            },
          ]}
          margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
        />
      )}
    </ChartContainer>
  );
};

export default ClassDistributionChart;
