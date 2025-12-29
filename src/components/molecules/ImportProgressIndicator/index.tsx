import React from "react";

import { Box, LinearProgress, Typography, styled } from "@mui/material";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(6),
  minHeight: 200,
}));

const StyledProgressBar = styled(LinearProgress)(() => ({
  width: "100%",
  maxWidth: 500,
  height: 12,
  borderRadius: 6,
}));

export type ImportStep =
  | "parsing"
  | "checking_classes"
  | "creating_classes"
  | "importing_students"
  | "refreshing";

type ImportProgressIndicatorProps = {
  currentStep: ImportStep;
  showSteps?: boolean;
};

const stepOrder: ImportStep[] = [
  "parsing",
  "checking_classes",
  "creating_classes",
  "importing_students",
  "refreshing",
];

const ImportProgressIndicator: React.FC<ImportProgressIndicatorProps> = ({
  currentStep,
}) => {
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / stepOrder.length) * 100;

  return (
    <StyledContainer>
      <StyledProgressBar
        variant="determinate"
        value={progressPercentage}
        data-testid="import-progress-bar"
      />
      <Typography variant="h6" color="text.primary">
        {Math.round(progressPercentage)}%
      </Typography>
    </StyledContainer>
  );
};

export default ImportProgressIndicator;
