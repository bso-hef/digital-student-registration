"use client";

import React from "react";

import ActionsTooltip from "@/components/atoms/ActionsTooltip";
import { STEPPER_ICON_SIZE } from "@/constants/ui.constants";
import {
  Box,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  alpha,
  stepConnectorClasses,
  styled,
} from "@mui/material";

const StepperBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  maxWidth: 1200,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.surface.interface.base,
  borderRadius: theme.spacing(3),
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
}));

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    marginRight: theme.spacing(1),
    height: "2px",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: alpha(theme.palette.text.primary, 0.2),
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}, 
    &.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
}));

const stepperSx = {
  width: "100%",
  "& .MuiStep-root": { flex: 1, minWidth: 0 },
  "& .MuiStepLabel-iconContainer": { padding: 0, lineHeight: 1 },
  "& .MuiStepIcon-root, & .MuiSvgIcon-root": {
    width: STEPPER_ICON_SIZE,
    height: STEPPER_ICON_SIZE,
  },
  "& .MuiStepLabel-label": {
    display: "none",
    whiteSpace: "nowrap",
    lineHeight: 1.15,
  },
  "& .MuiStepLabel-root.Mui-active .MuiStepLabel-label": { display: "block" },
};

type StepDef = { id: number; label: string };

const DynamicPageStepper = ({
  activeStep = 0,
  showLabelForId = null,
}: {
  activeStep?: number;
  showLabelForId?: number | null;
}) => {
  const steps: StepDef[] = [
    { id: 0, label: "Willkommen" },
    { id: 1, label: "Allgemein" },
    { id: 2, label: "Herkunft" },
    { id: 3, label: "Adresse" },
    { id: 4, label: "Eltern" },
    { id: 5, label: "Vorbildung" },
    { id: 6, label: "Ausbildung" },
    { id: 7, label: "Betriebskontakt" },
    { id: 8, label: "Zusammenfassung" },
    { id: 9, label: "Abschluss" },
  ];

  return (
    <StepperBox>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
        sx={stepperSx}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isExplicitShown = showLabelForId === step.id;
          const shouldShowLabel = isActive || isExplicitShown;

          return (
            <Step key={step.id}>
              <ActionsTooltip
                title={step.label}
                placement="top"
                disableHoverListener={shouldShowLabel}
                disableFocusListener={shouldShowLabel}
                disableTouchListener={shouldShowLabel}
              >
                <Box component="span" sx={{ display: "inline-flex" }}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        display: shouldShowLabel ? "block" : "none",
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Box>
              </ActionsTooltip>
            </Step>
          );
        })}
      </Stepper>
    </StepperBox>
  );
};

export default DynamicPageStepper;
