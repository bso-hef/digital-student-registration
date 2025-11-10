"use client";

import { useMemo } from "react";

import Logo from "@/components/atoms/Logo";
import BackgroundStudyPattern from "@/components/organisms/BackgroundStudyPattern";
import DynamicPageStepper from "@/components/organisms/DynamicPageStepper";
import {
  getActiveSteps,
  getStudentSteps,
} from "@/constants/studentSteps.constants";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled, useTheme } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const StyledBox = styled(Box)({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
});

const StudentLayoutContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: showMobileView ? "row" : "column",
  alignItems: showMobileView ? "flex-end" : "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  background: "transparent",
  color: theme.palette.text.default,
  padding: !showMobileView ? theme.spacing(20) : 0,
  overflow: "hidden",
  gap: theme.spacing(2),
  ...(showMobileView && {
    bottom: 0,
  }),
}));

const LayoutBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "showMobileView" && prop !== "isStudentWizzardPage",
})<{ showMobileView: boolean; isStudentWizzardPage: boolean }>(
  ({ theme, showMobileView, isStudentWizzardPage }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "30dvh",
    height: showMobileView ? "100%" : "auto",
    maxHeight: showMobileView ? "75%" : undefined,
    width: "100%",
    maxWidth: isStudentWizzardPage ? "1200px" : "500px",
    textAlign: "center",
    // overflowY: "auto",
    padding: showMobileView ? theme.spacing(4, 4, 0, 4) : theme.spacing(4),
    backgroundColor: theme.palette.surface.interface.base,
    backgroundImage: "unset",
    color: theme.palette.text.default,
    borderRadius: showMobileView ? theme.spacing(3, 3, 0, 0) : theme.spacing(3),
    border: !showMobileView
      ? `1px solid ${theme.palette.border.seperator}`
      : "none",
    borderTop: `1px solid ${theme.palette.border.seperator}`,
    position: showMobileView ? "absolute" : "relative",
    boxShadow: showMobileView
      ? "0px 8px 24px rgba(0,0,0,0.06)"
      : "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    zIndex: 2,
    ...applicationScrollbar(theme),
  }),
);

const StyledImageBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  position: "absolute",
  top: 0,
});

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentStep, data, currentClass } = useSelector(
    (state: RootState) => state.student,
  );
  const theme = useTheme();
  const { t } = useTranslation();
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();
  const pathname = usePathname();

  const isStudentWizzardPage =
    pathname.includes("/student/") && !pathname.endsWith("/student");

  const showMobileView = isMobile || isTabletVertical;

  // Calculate active steps based on student data and class
  const activeSteps = useMemo(() => {
    const allSteps = getStudentSteps(t);
    return getActiveSteps(allSteps, data, currentClass);
  }, [t, data, currentClass]);

  return (
    <StyledBox>
      <BackgroundStudyPattern
        haveGradient={false}
        density={0.3}
        minSize={64}
        maxSize={164}
        opacity={0.08}
        stroke={theme.palette.text.default}
        seed={20250822}
      />
      <StudentLayoutContainer showMobileView={showMobileView}>
        {isStudentWizzardPage && !showMobileView ? (
          <DynamicPageStepper activeStep={currentStep} steps={activeSteps} />
        ) : showMobileView ? (
          <StyledImageBox>
            <Logo width={250} height={250} />
          </StyledImageBox>
        ) : null}
        <LayoutBox
          isStudentWizzardPage={isStudentWizzardPage}
          showMobileView={showMobileView}
        >
          {children}
        </LayoutBox>
      </StudentLayoutContainer>
    </StyledBox>
  );
}
