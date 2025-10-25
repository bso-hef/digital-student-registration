import React from "react";

import HealthIndicator from "@/components/atoms/dashboard/HealthIndicator";
import MetricLabel from "@/components/atoms/dashboard/MetricLabel";
import { HealthReport } from "@/types/dashboard";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 8px",
  height: "100%",
  position: "relative",
  cursor: "grab",
  transition: "all 0.3s ease-in-out",
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    border: `2px dashed ${theme.palette.border.hover}`,
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 6px 20px",
    transform: "scale(1.01)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
}));

const MetricsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const DragHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0.4,
  transition: "opacity 0.2s ease-in-out",
  color: theme.palette.text.secondary,
  cursor: "grab",
  zIndex: 2,
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    opacity: 0.8,
  },
}));

interface SystemHealthWidgetProps {
  health: HealthReport | null;
}

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ health }) => {
  const { t } = useTranslation();

  if (!health) {
    return (
      <StyledCard>
        <DragHandle className="drag-handle">
          <DragIndicatorRoundedIcon
            sx={{
              fontSize: 24,
            }}
          />
        </DragHandle>
        <StyledCardContent>
          <Title>{t("dashboard.health.title")}</Title>
          <Typography color="text.secondary">
            {t("dashboard.errors.loadFailed")}
          </Typography>
        </StyledCardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <DragHandle className="drag-handle">
        <DragIndicatorRoundedIcon
          sx={{
            fontSize: 24,
          }}
        />
      </DragHandle>
      <StyledCardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Title sx={{ mb: 0 }}>{t("dashboard.health.title")}</Title>
          <HealthIndicator
            status={health.status}
            label={t(`dashboard.health.${health.status}`)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.health.database")}
            </Typography>
            <HealthIndicator status={health.checks.mongo.status} />
          </Box>
        </Box>

        <MetricsGrid>
          <MetricLabel
            label={t("dashboard.health.uptime")}
            value={formatUptime(health.meta.uptimeSec)}
          />
          <MetricLabel
            label={t("dashboard.health.cpu")}
            value={health.meta.system.cpus}
          />
          <MetricLabel
            label={t("dashboard.health.memory")}
            value={`${health.meta.system.freemem} / ${health.meta.system.totalmem}`}
          />
          <MetricLabel
            label={t("dashboard.health.nodeVersion")}
            value={health.meta.node}
          />
        </MetricsGrid>
      </StyledCardContent>
    </StyledCard>
  );
};

export default SystemHealthWidget;
