"use client";

import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";

const StyledBox = styled(Box)({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
});

const AdminLayoutContainer = styled(Box, {
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
  minHeight: "50dvh",
  height: showMobileView ? "100%" : "auto",
  maxHeight: showMobileView ? "75%" : undefined,
  width: "100%",
  maxWidth: "90%",
  textAlign: "center",
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
}));

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  return (
    <StyledBox className="student-layout">
      <AdminLayoutContainer showMobileView={showMobileView}>
        <LayoutBox showMobileView={showMobileView}>{children}</LayoutBox>
      </AdminLayoutContainer>
    </StyledBox>
  );
}
