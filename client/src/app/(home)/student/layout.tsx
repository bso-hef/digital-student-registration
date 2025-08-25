"use client";

import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Typography, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";
import Image from "next/image";

import BackgroundStudyPattern from "./BackgroundStudyPattern";
import DynamicPageStepper from "./DynamicPageStepper";

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
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "30dvh",
  height: "auto",
  width: "100%",
  maxWidth: "1200px",
  textAlign: "center",
  padding: showMobileView ? theme.spacing(4, 4, 0, 4) : theme.spacing(4),
  backgroundColor: theme.palette.surface.interface.base,
  backgroundImage: "unset",
  color: theme.palette.text.default,
  borderRadius: showMobileView ? theme.spacing(3, 3, 0, 0) : theme.spacing(3),
  border: !showMobileView
    ? `1px solid ${theme.palette.border.seperator}`
    : "none",
  position: showMobileView ? "absolute" : "relative",
  boxShadow: showMobileView
    ? "0px 8px 24px rgba(0,0,0,0.06)"
    : "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  zIndex: 2,
  ...applicationScrollbar(theme),
}));

const StyledRowLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "30dvh",
  height: "auto",
  width: "100%",
  color: theme.palette.text.default,
  gap: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

const TitleBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  textAlign: showMobileView ? "center" : "left",
  color: theme.palette.text.default,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "32px !important",
  fontWeight: 600,
  lineHeight: "24px !important",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px !important",
  fontWeight: 400,
  lineHeight: "32px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.information,
}));

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
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  return (
    <StyledBox>
      <BackgroundStudyPattern
        density={0.3}
        minSize={64}
        maxSize={164}
        opacity={0.08}
        stroke="#0b3558"
        seed={20250825}
      />
      <StudentLayoutContainer showMobileView={showMobileView}>
        {showMobileView ? (
          <StyledImageBox>
            <Image src="/logo.svg" alt="logo" width={250} height={250} />
          </StyledImageBox>
        ) : (
          <DynamicPageStepper />
        )}
        <LayoutBox showMobileView={showMobileView}>
          <TitleBox showMobileView={showMobileView}>
            <Title>Anmeldung der BSO</Title>
            <SubTitle>
              Schließen Sie in 10 Schritten ihre Anmeldung ab.
            </SubTitle>
          </TitleBox>
          <StyledRowLayout>{children}</StyledRowLayout>
        </LayoutBox>
      </StudentLayoutContainer>
    </StyledBox>
  );
}
