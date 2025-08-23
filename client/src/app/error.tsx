"use client";

import { useEffect } from "react";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(6),
  height: "100vh",
  color: theme.palette.text.primary,
}));

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <ErrorContainer>
      <ReportProblemIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.message}
      </Typography>
      <Button
        onClick={reset}
        variant="contained"
        color="warning"
        sx={{ mt: 4 }}
      >
        Try again
      </Button>
    </ErrorContainer>
  );
}
