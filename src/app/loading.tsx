"use client";

import { CircularProgress, Container, styled } from "@mui/material";

const LoadingContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(6),
  height: "100vh",
  minWidth: "100vw",
  width: "100%",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.surface.interface.background,
}));

export default function Loading() {
  return (
    <LoadingContainer>
      <CircularProgress color="primary" size={60} />
    </LoadingContainer>
  );
}
