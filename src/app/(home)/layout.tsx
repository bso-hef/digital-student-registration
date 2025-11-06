"use client";

import { useEffect } from "react";

import AccessibilityMenu from "@/components/molecules/AccessibilityMenu";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    // Only set title for root path, not for /admin or /student routes
    if (pathname === "/") {
      document.title = "Home | DSR";
    }
  }, [pathname]);

  return (
    <HomeLayoutContainer>
      <HomeLayoutBox>{children}</HomeLayoutBox>
      <StyledAccessMenuLocation>
        <AccessibilityMenu />
      </StyledAccessMenuLocation>
    </HomeLayoutContainer>
  );
}
