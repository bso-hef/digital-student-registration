import React from "react";

import StatCard from "@/components/atoms/dashboard/StatCard";
import { QuickStats } from "@/types/dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClassIcon from "@mui/icons-material/Class";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SchoolIcon from "@mui/icons-material/School";
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
        icon={<SchoolIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.TOTAL_STUDENTS.gradient}
      />
      <StatCard
        id="totalClasses"
        label={t("dashboard.quickStats.totalClasses")}
        value={stats.totalClasses}
        icon={<ClassIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.TOTAL_CLASSES.gradient}
      />
      <StatCard
        id="unassignedStudents"
        label={t("dashboard.quickStats.unassignedStudents")}
        value={stats.unassignedStudents}
        icon={<PersonOffIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.UNASSIGNED.gradient}
      />
      <StatCard
        id="activeClasses"
        label={t("dashboard.quickStats.activeClasses")}
        value={stats.activeClasses}
        icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
        gradient={DASHBOARD_GRADIENTS.ACTIVE_CLASSES.gradient}
      />
    </Box>
  );
};

export default QuickStatsGrid;
