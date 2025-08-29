"use client";

import AccessibilityMenu from "@/components/molecules/AccessibilityMenu";
import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
});

const StyledAccessMenuLocation = styled(Box)({
  position: "absolute",
  top: 32,
  right: 32,
  zIndex: 2,
});

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledBox className="student-layout">
      <Box>{children}</Box>
      <StyledAccessMenuLocation>
        <AccessibilityMenu />
      </StyledAccessMenuLocation>
    </StyledBox>
  );
}
