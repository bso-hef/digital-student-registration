"use client";

import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
});

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledBox className="student-layout">
      <Box>{children}</Box>
    </StyledBox>
  );
}
