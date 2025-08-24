"use client";

import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Typography, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";

import DynamicPageStepper from "./DynamicPageStepper";
import RandomSvg from "./RandomSvg";

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
  background:
    "linear-gradient(to bottom, #d8e0ff 0%, #c2ccff 50%, #aebdff 100%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
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
  padding: theme.spacing(4, 4, 0, 4),
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

const LayoutLeft = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "50%",
}));

const LayoutRight = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: "400px",
  marginTop: theme.spacing(5),
  borderTop: `1px solid ${theme.palette.border.seperator}`,
  borderRight: `1px solid ${theme.palette.border.seperator}`,
  borderLeft: `1px solid ${theme.palette.border.seperator}`,
  height: "560px",
  borderRadius: theme.spacing(2, 2, 0, 0),
  padding: theme.spacing(2),
}));

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  return (
    <StudentLayoutContainer showMobileView={showMobileView}>
      {!showMobileView && <DynamicPageStepper />}
      <LayoutBox showMobileView={showMobileView}>
        <TitleBox showMobileView={showMobileView}>
          <Title>Anmeldung der BSO</Title>
          <SubTitle>Schließen Sie in 10 Schritten ihre Anmeldung ab.</SubTitle>
        </TitleBox>
        <StyledRowLayout>
          {!showMobileView && (
            <LayoutLeft>
              <RandomSvg size="560px" />
            </LayoutLeft>
          )}
          <LayoutRight>{children}</LayoutRight>
        </StyledRowLayout>
      </LayoutBox>
    </StudentLayoutContainer>
  );
}
