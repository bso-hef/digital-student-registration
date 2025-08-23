"use client";

import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";

const StudentLayoutContainer = styled(Box)(({ theme }) => ({
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

const StudentLayoutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
  ...applicationScrollbar(theme),
}));

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentLayoutContainer>
      <StudentLayoutBox>{children}</StudentLayoutBox>
    </StudentLayoutContainer>
  );
}
