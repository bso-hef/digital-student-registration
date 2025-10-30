import React from "react";

import { Box, Chip, styled } from "@mui/material";

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: "up" | "down" }>(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
  backgroundColor: "transparent",
  color:
    status === "up" ? theme.palette.success.dark : theme.palette.error.dark,
  "& .MuiChip-label": {
    padding: theme.spacing(0, 1.5),
  },
}));

const StatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: "up" | "down" }>(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor:
    status === "up" ? theme.palette.success.main : theme.palette.error.main,
  marginRight: theme.spacing(0.75),
}));

interface HealthIndicatorProps {
  status: "up" | "down";
  label?: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ status, label }) => {
  return (
    <StyledChip
      status={status}
      label={label || status.toUpperCase()}
      icon={<StatusDot status={status} />}
      size="small"
    />
  );
};

export default HealthIndicator;
