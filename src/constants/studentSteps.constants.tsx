import React from "react";

import type { ClassInterface } from "@/types/class.d";
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

export type StepDef = {
  id: number;
  label: string;
  icon: React.ReactElement;
  conditional?: boolean;
  requiresVocational?: boolean;
  requiresNonGerman?: boolean;
};

export const getStudentSteps = (t: TFunction): StepDef[] => [
  { id: 0, label: t("student.steps.Welcome"), icon: <HomeRoundedIcon /> },
  { id: 1, label: t("student.steps.General"), icon: <InfoRoundedIcon /> },
  {
    id: 2,
    label: t("student.steps.Origin"),
    icon: <PublicRoundedIcon />,
    conditional: true,
    requiresNonGerman: true,
  },
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
  {
    id: 6,
    label: t("student.steps.Training"),
    icon: <WorkRoundedIcon />,
    conditional: true,
    requiresVocational: true,
  },
  {
    id: 7,
    label: t("student.steps.Company Contact"),
    icon: <BusinessRoundedIcon />,
    conditional: true,
    requiresVocational: true,
  },
  { id: 8, label: t("student.steps.Summary"), icon: <SummarizeRoundedIcon /> },
  {
    id: 9,
    label: t("student.steps.Completion"),
    icon: <EmojiEventsRoundedIcon />,
  },
];

/**
 * Filters steps based on student's class and origin
 * @param allSteps - All available onboarding steps
 * @param studentData - Student data containing birth country
 * @param currentClass - Student's assigned class with vocational flags
 * @returns Filtered array of steps the student should see
 */
export const getActiveSteps = (
  allSteps: StepDef[],
  studentData: { geburtsland?: string },
  currentClass: ClassInterface | null,
): StepDef[] => {
  const isVocational = currentClass?.isVocational || false;

  // Check if student is from Germany (hide Origin form if true)
  const isFromGermany =
    studentData.geburtsland === "Deutschland" ||
    studentData.geburtsland === "Germany" ||
    studentData.geburtsland === "DE" ||
    studentData.geburtsland === "germany" ||
    studentData.geburtsland === "deutschland";

  return allSteps.filter((step) => {
    // Filter vocational steps (Training & Company Contact)
    if (step.requiresVocational) {
      return isVocational;
    }

    // Filter origin step (only show if NOT from Germany)
    if (step.requiresNonGerman) {
      return !isFromGermany;
    }

    // Include all non-conditional steps
    return true;
  });
};
