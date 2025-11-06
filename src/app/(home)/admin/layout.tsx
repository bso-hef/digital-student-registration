"use client";

import { useEffect } from "react";

import LeftNavigation from "@/components/organisms/LeftNavigation";
import { useAuth } from "@/lib/auth/useAuth";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, CircularProgress, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";
import { useRouter } from "next/navigation";

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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  background: "transparent",
  color: theme.palette.text.default,
  padding: !showMobileView ? theme.spacing(4, 8) : 0,
  overflow: "hidden",
  gap: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    padding: !showMobileView ? theme.spacing(6, 12) : 0,
    gap: theme.spacing(6),
  },
  [theme.breakpoints.up("lg")]: {
    padding: !showMobileView ? theme.spacing(8, 20) : 0,
    gap: theme.spacing(8),
  },
  ...(showMobileView && {
    bottom: 0,
  }),
}));

const LayoutBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  minHeight: "100%",
  maxHeight: showMobileView ? "75%" : "100%",
  width: "100%",
  maxWidth: "90%",
  textAlign: "center",
  backgroundColor: theme.palette.surface.interface.base,
  backgroundImage: "unset",
  color: theme.palette.text.default,
  borderRadius: showMobileView ? theme.spacing(3, 3, 0, 0) : theme.spacing(2),
  border: !showMobileView
    ? `1px solid ${theme.palette.border.seperator}`
    : "none",
  borderTop: `1px solid ${theme.palette.border.seperator}`,
  position: showMobileView ? "absolute" : "relative",
  boxShadow: showMobileView
    ? "0px 8px 24px rgba(0,0,0,0.06)"
    : "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  zIndex: 2,
  overflow: "hidden",
  ...applicationScrollbar(theme),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  gap: theme.spacing(2),
  color: theme.palette.text.primary,
}));

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const showMobileView = isMobile || isTabletVertical;

  // Immediate redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <StyledBox className="admin-layout">
        <LoadingContainer>
          <CircularProgress size={48} />
        </LoadingContainer>
      </StyledBox>
    );
  }

  // Don't render admin content if not authenticated
  // (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return (
      <StyledBox className="admin-layout">
        <LoadingContainer>
          <CircularProgress size={48} />
        </LoadingContainer>
      </StyledBox>
    );
  }

  return (
    <StyledBox className="admin-layout">
      <AdminLayoutContainer showMobileView={showMobileView}>
        <LeftNavigation />
        <LayoutBox showMobileView={showMobileView}>{children}</LayoutBox>
      </AdminLayoutContainer>
    </StyledBox>
  );
}
