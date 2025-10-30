"use client";

import AccessibilityMenu from "@/components/molecules/AccessibilityMenu";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";

const AuthLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  height: "100%",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
  overflow: "hidden",
  position: "relative",
}));

const AuthLayoutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  height: "100%",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
  padding: "2rem 1rem",
  overflow: "auto",
  ...applicationScrollbar(theme),
  [theme.breakpoints.down("md")]: {
    padding: "1.5rem 1rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
  [theme.breakpoints.down(400)]: {
    padding: "0.5rem 0",
  },
}));

const StyledAccessMenuLocation = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 32,
  right: 32,
  zIndex: 1300,
  [theme.breakpoints.down("sm")]: {
    top: 16,
    right: 16,
  },
  [theme.breakpoints.down(400)]: {
    top: 8,
    right: 8,
  },
}));

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayoutContainer>
      <AuthLayoutBox>{children}</AuthLayoutBox>
      <StyledAccessMenuLocation>
        <AccessibilityMenu />
      </StyledAccessMenuLocation>
    </AuthLayoutContainer>
  );
}
