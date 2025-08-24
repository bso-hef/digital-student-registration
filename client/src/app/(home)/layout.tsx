"use client";

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

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayoutContainer>
      <HomeLayoutBox>{children}</HomeLayoutBox>
    </HomeLayoutContainer>
  );
}
