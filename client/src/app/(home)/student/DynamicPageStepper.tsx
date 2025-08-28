"use client";

// TODO: Animation when change step
import React from "react";

import ActionsTooltip from "@/components/atoms/ActionsTooltip";
import { STEPPER_ICON_SIZE } from "@/constants/ui.constants";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
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

type StepDef = { id: number; label: string; icon: React.ReactElement };

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
}: {
  activeStep?: number;
  showLabelForId?: number | null;
}) => {
  const { t } = useTranslation();

  const steps: StepDef[] = [
    { id: 0, label: t("student.steps.Welcome"), icon: <HomeRoundedIcon /> },
    { id: 1, label: t("student.steps.General"), icon: <InfoRoundedIcon /> },
    { id: 2, label: t("student.steps.Origin"), icon: <PublicRoundedIcon /> },
    {
      id: 3,
      label: t("student.steps.Address"),
      icon: <LocationOnRoundedIcon />,
    },
    {
      id: 4,
      label: t("student.steps.Parents"),
      icon: <FamilyRestroomRoundedIcon />,
    },
    {
      id: 5,
      label: t("student.steps.Pre Education"),
      icon: <SchoolRoundedIcon />,
    },
    { id: 6, label: t("student.steps.Training"), icon: <WorkRoundedIcon /> },
    {
      id: 7,
      label: t("student.steps.Company Contact"),
      icon: <BusinessRoundedIcon />,
    },
    {
      id: 8,
      label: t("student.steps.Summary"),
      icon: <SummarizeRoundedIcon />,
    },
    {
      id: 9,
      label: t("student.steps.Completion"),
      icon: <EmojiEventsRoundedIcon />,
    },
  ];

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
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
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
                    StepIconComponent={ColorlibStepIcon}
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
