import React from "react";

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
import { TFunction } from "i18next";

export type StepDef = { id: number; label: string; icon: React.ReactElement };

export const getStudentSteps = (t: TFunction): StepDef[] => [
  { id: 0, label: t("student.steps.Welcome"), icon: <HomeRoundedIcon /> },
  { id: 1, label: t("student.steps.General"), icon: <InfoRoundedIcon /> },
  { id: 2, label: t("student.steps.Origin"), icon: <PublicRoundedIcon /> },
  { id: 3, label: t("student.steps.Address"), icon: <LocationOnRoundedIcon /> },
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
  { id: 8, label: t("student.steps.Summary"), icon: <SummarizeRoundedIcon /> },
  {
    id: 9,
    label: t("student.steps.Completion"),
    icon: <EmojiEventsRoundedIcon />,
  },
];
