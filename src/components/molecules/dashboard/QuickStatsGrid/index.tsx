import React from "react";

import StatCard from "@/components/atoms/dashboard/StatCard";
import { QuickStats } from "@/types/dashboard";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface QuickStatsGridProps {
  stats: QuickStats;
}

const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
      }}
    >
      <StatCard
        id="totalStudents"
        label={t("dashboard.quickStats.totalStudents")}
        value={stats.totalStudents}
        icon={<SchoolRoundedIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.TOTAL_STUDENTS.gradient}
      />
      <StatCard
        id="totalClasses"
        label={t("dashboard.quickStats.totalClasses")}
        value={stats.totalClasses}
        icon={<ClassRoundedIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.TOTAL_CLASSES.gradient}
      />
      <StatCard
        id="unassignedStudents"
        label={t("dashboard.quickStats.unassignedStudents")}
        value={stats.unassignedStudents}
        icon={<PersonOffRoundedIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.UNASSIGNED.gradient}
      />
      <StatCard
        id="activeClasses"
        label={t("dashboard.quickStats.activeClasses")}
        value={stats.activeClasses}
        icon={<CheckCircleRoundedIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.ACTIVE_CLASSES.gradient}
      />
    </Box>
  );
};

export default QuickStatsGrid;
