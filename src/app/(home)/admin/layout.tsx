"use client";

import { useEffect } from "react";

import LeftNavigation from "@/components/organisms/LeftNavigation";
import MobileBlocker from "@/components/organisms/MobileBlocker";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/lib/auth/useAuth";
import { fetchProfile } from "@/store/actions/authActions";
import { getSettings } from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, CircularProgress, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const appSettings = useSelector((state: RootState) => state.appSettings.data);

  const showMobileView = isMobile || isTabletVertical;

  useDocumentTitle("Admin | Digitale Schüleranmeldung");

  // Immediate redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch profile data and app settings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (!authUser?.firstName) {
        dispatch(fetchProfile());
      }
      dispatch(getSettings());
    }
  }, [isAuthenticated, authUser?.firstName, dispatch]);

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
      <MobileBlocker
        enabled={appSettings?.system?.mobileBlockerEnabled ?? true}
      />
      <AdminLayoutContainer showMobileView={showMobileView}>
        <LeftNavigation />
        <LayoutBox showMobileView={showMobileView}>{children}</LayoutBox>
      </AdminLayoutContainer>
    </StyledBox>
  );
}
