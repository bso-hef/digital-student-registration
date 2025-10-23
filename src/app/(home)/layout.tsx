"use client";

import AccessibilityMenu from "@/components/molecules/AccessibilityMenu";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";

const HomeLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
  overflow: "hidden",
}));

const HomeLayoutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
  ...applicationScrollbar(theme),
}));

const StyledAccessMenuLocation = styled(Box)({
  position: "absolute",
  top: 32,
  right: 32,
  zIndex: 2,
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayoutContainer>
      <HomeLayoutBox>{children}</HomeLayoutBox>
      <StyledAccessMenuLocation>
        <AccessibilityMenu />
      </StyledAccessMenuLocation>
    </HomeLayoutContainer>
  );
}
