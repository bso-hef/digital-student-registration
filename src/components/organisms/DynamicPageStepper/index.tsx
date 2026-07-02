"use client";

// TODO: Animation when change step
import React from "react";

import ActionsTooltip from "@/components/atoms/ActionsTooltip";
import { StepDef, getStudentSteps } from "@/constants/studentSteps.constants";
import { STEPPER_ICON_SIZE } from "@/constants/ui.constants";
import {
  Box,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StepperBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  maxWidth: 1200,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.surface.interface.base,
  borderRadius: theme.spacing(3),
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  zIndex: 2,
  border: `1px solid ${theme.palette.border.seperator}`,
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

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(25, 118, 210) 0%, rgb(0, 150, 136) 50%, rgb(129, 199, 132) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(25, 118, 210) 0%, rgb(0, 150, 136) 50%, rgb(129, 199, 132) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  border: `1px solid ${theme.palette.border.seperator}`,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient(136deg, rgb(25, 118, 210) 0%, rgb(0, 150, 136) 50%, rgb(129, 199, 132) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient(136deg, rgb(25, 118, 210) 0%, rgb(0, 150, 136) 50%, rgb(129, 199, 132) 100%)",
      },
    },
  ],
}));

const DynamicPageStepper = ({
  activeStep = 0,
  showLabelForId = null,
  steps: propSteps,
}: {
  activeStep?: number;
  showLabelForId?: number | null;
  steps?: StepDef[];
}) => {
  const { t } = useTranslation();

  // Use provided steps or fall back to all steps
  const steps: StepDef[] = propSteps || getStudentSteps(t);

  // Find the index of the current step ID in the steps array
  const activeStepIndex = steps.findIndex((step) => step.id === activeStep);
  const effectiveActiveStep = activeStepIndex >= 0 ? activeStepIndex : 0;

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className, icon } = props;

    const stepIndex = Number(icon) - 1;
    const step = steps[stepIndex];

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {step?.icon}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <StepperBox>
      <Stepper
        activeStep={effectiveActiveStep}
        alternativeLabel
        connector={<ColorlibConnector />}
        sx={stepperSx}
      >
        {steps.map((step, index) => {
          const isActive = index === effectiveActiveStep;
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
                    slots={{ stepIcon: ColorlibStepIcon }}
                    sx={{
                      "& .MuiStepLabel-label": {
                        display: shouldShowLabel ? "block" : "none",
                      },
                    }}
                  ></StepLabel>
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
