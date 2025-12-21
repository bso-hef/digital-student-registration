"use client";

import React from "react";

import { Box, LinearProgress, Typography, styled } from "@mui/material";

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const LabelContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

const ProgressPercentage = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

interface ProgressIndicatorProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

/**
 * ProgressIndicator component displays a linear progress bar with label and percentage
 * Used for tracking multi-step processes like student creation
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  label,
  showPercentage = true,
}) => {
  // Clamp progress between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <ProgressContainer>
      <LabelContainer>
        <ProgressLabel>{label || "Processing..."}</ProgressLabel>
        {showPercentage && (
          <ProgressPercentage>{normalizedProgress}%</ProgressPercentage>
        )}
      </LabelContainer>
      <StyledLinearProgress variant="determinate" value={normalizedProgress} />
    </ProgressContainer>
  );
};

export default ProgressIndicator;
