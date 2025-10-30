import React from "react";

import ChartContainer from "@/components/molecules/dashboard/ChartContainer";
import { GradeDistribution } from "@/types/dashboard";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTranslation } from "react-i18next";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface ClassDistributionChartProps {
  data: GradeDistribution[];
  loading?: boolean;
}

const ClassDistributionChart: React.FC<ClassDistributionChartProps> = ({
  data,
  loading = false,
}) => {
  const { t } = useTranslation();

  const xLabels = data.map((item) => item.grade);
  const yValues = data.map((item) => item.count);

  return (
    <ChartContainer
      title={t("dashboard.charts.classDistribution")}
      loading={loading}
      height={300}
    >
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
            color: DASHBOARD_GRADIENTS.TOTAL_CLASSES.solid,
          },
        ]}
        margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
      />
    </ChartContainer>
  );
};

export default ClassDistributionChart;
