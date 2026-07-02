import React from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import { RecentActivityItem } from "@/types/dashboard";
import { applicationScrollbar } from "@/utils/styling.utils";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "isLocked",
})<{ isLocked?: boolean }>(({ theme, isLocked }) => ({
  background: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 8px",
  height: "100%",
  position: "relative",
  cursor: isLocked ? "default" : "grab",
  transition: "all 0.3s ease-in-out",
  "&:active": {
    cursor: isLocked ? "default" : "grabbing",
  },
  "&:hover": {
    border: isLocked
      ? `1px solid ${theme.palette.border.seperator}`
      : `2px dashed ${theme.palette.border.hover}`,
    boxShadow: isLocked
      ? "rgba(0, 0, 0, 0.05) 0px 2px 8px"
      : "rgba(0, 0, 0, 0.15) 0px 6px 20px",
    transform: isLocked ? "none" : "scale(1.01)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
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

const ActivityList = styled(List)(({ theme }) => ({
  maxHeight: 250,
  overflow: "auto",
  padding: 0,
  ...applicationScrollbar(theme),
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const ActivityIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 36,
  color: theme.palette.primary.main,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: theme.palette.text.secondary,
  gap: theme.spacing(2),
}));

interface RecentActivityWidgetProps {
  activities: RecentActivityItem[];
  loading?: boolean;
  isLocked?: boolean;
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities,
  loading = false,
  isLocked = false,
}) => {
  const { t } = useTranslation();

  const getActivityIcon = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "onboarding_complete":
        return <CheckCircleOutlineRoundedIcon color="success" />;
      case "student_added":
        return <PersonAddAltRoundedIcon color="primary" />;
      case "student_imported":
        return <PersonAddAltRoundedIcon color="info" />;
      case "class_changed":
        return <SwapHorizRoundedIcon color="warning" />;
      default:
        return <PersonAddAltRoundedIcon />;
    }
  };

  const getActivityText = (activity: RecentActivityItem): string => {
    const { type, metadata } = activity;
    const name = metadata?.studentName || "Unknown";
    const className = metadata?.className || "";
    const count = metadata?.count || 0;

    switch (type) {
      case "onboarding_complete":
        return t("dashboard.recentActivity.onboardingComplete", { name });
      case "student_added":
        return t("dashboard.recentActivity.studentAdded", { name });
      case "student_imported":
        return t("dashboard.recentActivity.studentImported", { count });
      case "class_changed":
        return t("dashboard.recentActivity.classChanged", {
          name,
          class: className,
        });
      default:
        return name;
    }
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return t("dashboard.recentActivity.justNow");
    } else if (diffMins < 60) {
      return t("dashboard.recentActivity.minutesAgo", { count: diffMins });
    } else if (diffHours < 24) {
      return t("dashboard.recentActivity.hoursAgo", { count: diffHours });
    } else {
      return t("dashboard.recentActivity.daysAgo", { count: diffDays });
    }
  };

  return (
    <StyledCard isLocked={isLocked}>
      {!isLocked && (
        <DragHandle className="drag-handle">
          <DragIndicatorRoundedIcon sx={{ fontSize: 24 }} />
        </DragHandle>
      )}
      <StyledCardContent>
        <Title>{t("dashboard.recentActivity.title")}</Title>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {loading ? (
            <GeneralSkeletonLoader
              variant="rectangular"
              width="100%"
              height={200}
            />
          ) : activities.length === 0 ? (
            <EmptyState>
              <InboxRoundedIcon sx={{ fontSize: 64, opacity: 0.3 }} />
              <Typography variant="body1">
                {t("dashboard.recentActivity.noActivity")}
              </Typography>
            </EmptyState>
          ) : (
            <ActivityList>
              {activities.map((activity) => (
                <ActivityItem key={activity.id} disableGutters>
                  <ActivityIcon>{getActivityIcon(activity.type)}</ActivityIcon>
                  <ListItemText
                    primary={getActivityText(activity)}
                    secondary={getRelativeTime(activity.timestamp)}
                    slotProps={{
                      primary: {
                        variant: "body2",
                        sx: { fontWeight: 500 },
                      },
                      secondary: {
                        variant: "caption",
                        sx: { fontSize: "0.75rem" },
                      },
                    }}
                  />
                </ActivityItem>
              ))}
            </ActivityList>
          )}
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default RecentActivityWidget;
