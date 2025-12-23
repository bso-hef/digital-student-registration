import React from "react";

import ChartContainer from "@/components/molecules/dashboard/ChartContainer";
import { StudentStatusBreakdown } from "@/types/dashboard";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import PieChartIcon from "@mui/icons-material/PieChart";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface StudentStatusChartProps {
  data: StudentStatusBreakdown;
  loading?: boolean;
  isLocked?: boolean;
}

const StudentStatusChart: React.FC<StudentStatusChartProps> = ({
  data,
  loading = false,
  isLocked = false,
}) => {
  const { t } = useTranslation();

  const chartData = [
    {
      id: 0,
      value: data.imported,
      label: t("dashboard.status.imported"),
      color: DASHBOARD_GRADIENTS.STATUS_IMPORTED,
    },
    {
      id: 1,
      value: data.invited,
      label: t("dashboard.status.invited"),
      color: DASHBOARD_GRADIENTS.STATUS_INVITED,
    },
    {
      id: 2,
      value: data.onboarded,
      label: t("dashboard.status.onboarded"),
      color: DASHBOARD_GRADIENTS.STATUS_ONBOARDED,
    },
    {
      id: 3,
      value: data.other,
      label: t("dashboard.status.other"),
      color: DASHBOARD_GRADIENTS.STATUS_OTHER,
    },
  ].filter((item) => item.value > 0);

  // Check if data is empty
  const isEmpty = chartData.length === 0;

  return (
    <ChartContainer
      title={t("dashboard.charts.studentStatus")}
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
          <PieChartIcon
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
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
            },
          ]}
          margin={{ right: 180 }}
        />
      )}
    </ChartContainer>
  );
};

export default StudentStatusChart;
